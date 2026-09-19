/**
 * Server Actions da aba "Versões" — ver uma versão e restaurá-la como rascunho
 * (BACKOFFICE §3 e §6.4).
 *
 * ⚠️ **Restaurar nunca publica.** A versão antiga volta como `draftPages`; o
 * aluno continua vendo o publicado até alguém revisar o relatório de impacto
 * na aba Páginas e publicar. Motivo obrigatório, auditado como
 * `lesson.restore_version`.
 */
'use server';

import { Prisma } from '@prisma/client';
import { revalidatePath } from 'next/cache';

import { auditar } from '@/lib/admin/audit';
import type { EstadoDoEditor } from '@/lib/admin/editor';
import { requireAdmin } from '@/lib/admin/guard';
import { conferirRascunho } from '@/lib/admin/publicacao';
import type { SessionUser } from '@/lib/auth/session';
import { validarPaginas, type Page } from '@/lib/content/blocks';
import { prisma } from '@/lib/db';

const MOTIVO_MINIMO = 5;

function falha(mensagem: string, erros?: string[]): EstadoDoEditor {
  return erros && erros.length > 0 ? { estado: 'erro', mensagem, erros } : { estado: 'erro', mensagem };
}

async function autenticar(): Promise<SessionUser | null> {
  try {
    return await requireAdmin();
  } catch {
    return null;
  }
}

function campo(dados: FormData, nome: string): string {
  const valor = dados.get(nome);
  return typeof valor === 'string' ? valor.trim() : '';
}

// ─────────────────────────────── ver ───────────────────────────────

export type VersaoCarregada =
  | { ok: true; version: number; pages: Page[] }
  | { ok: false; mensagem: string; erros?: string[] };

/**
 * Carrega as páginas de uma versão para o preview da aba Versões. Só leitura:
 * não grava nada, não audita (é o mesmo que abrir a tela).
 */
export async function carregarVersaoAction(
  aulaId: string,
  versaoId: string,
): Promise<VersaoCarregada> {
  const admin = await autenticar();
  if (!admin) return { ok: false, mensagem: 'Sua sessão administrativa não vale mais. Recarregue a página.' };

  try {
    const versao = await prisma.lessonVersion.findFirst({
      where: { id: versaoId, lessonId: aulaId },
      select: { version: true, pages: true },
    });
    if (!versao) return { ok: false, mensagem: 'Esta versão não existe mais.' };
    const conferido = validarPaginas(versao.pages);
    if (!conferido.ok) {
      return {
        ok: false,
        mensagem: `A versão ${versao.version} não passa no esquema atual de blocos e não pode ser exibida.`,
        erros: conferido.erros,
      };
    }
    return { ok: true, version: versao.version, pages: conferido.pages };
  } catch (erro: unknown) {
    const motivo = erro instanceof Error ? erro.message : 'erro desconhecido';
    console.error(`[versões] falha ao carregar versão: ${motivo}`);
    return { ok: false, mensagem: 'Não foi possível carregar a versão agora. Tente de novo.' };
  }
}

// ─────────────────────────────── restaurar ───────────────────────────────

export async function restaurarVersaoAction(
  _estado: EstadoDoEditor,
  dados: FormData,
): Promise<EstadoDoEditor> {
  const admin = await autenticar();
  if (!admin) {
    return falha('Sua sessão administrativa não vale mais. Recarregue a página e entre de novo.');
  }

  const motivo = campo(dados, 'motivo');
  if (motivo.length < MOTIVO_MINIMO) {
    return falha(`Explique o motivo da restauração (mínimo de ${MOTIVO_MINIMO} caracteres).`);
  }

  try {
    const aula = await prisma.lesson.findUnique({
      where: { id: campo(dados, 'aulaId') },
      select: { id: true, number: true, draftPages: true, contentVersion: true },
    });
    if (!aula) return falha('Esta aula não existe mais. Recarregue a página.');

    const versao = await prisma.lessonVersion.findFirst({
      where: { id: campo(dados, 'versaoId'), lessonId: aula.id },
      select: { id: true, version: true, pages: true },
    });
    if (!versao) return falha('Esta versão não existe mais. Recarregue a página.');

    if (aula.draftPages !== null && campo(dados, 'substituirRascunho') !== 'sim') {
      return falha(
        'Esta aula já tem um rascunho pendente. Marque que você quer substituí-lo pela versão restaurada. O rascunho atual será perdido.',
      );
    }

    // A mesma porta do "Salvar rascunho": forma + integridade dos ids.
    const conferido = await conferirRascunho(aula, versao.pages);
    if (!conferido.ok) {
      await auditar({
        actor: admin,
        action: 'lesson.restore_version',
        resource: `Lesson:${aula.number}`,
        outcome: 'DENY',
        reason: `versão ${versao.version} inválida (${conferido.erros.length} erro(s)); motivo: ${motivo}`,
      });
      return falha(
        `A versão ${versao.version} não pode ser restaurada: ${conferido.erros.length} problema(s).`,
        conferido.erros,
      );
    }

    await prisma.lesson.update({
      where: { id: aula.id },
      data: {
        draftPages: conferido.pages as unknown as Prisma.InputJsonValue,
        updatedById: admin.id,
      },
    });

    await auditar({
      actor: admin,
      action: 'lesson.restore_version',
      resource: `Lesson:${aula.number}`,
      before: { contentVersion: aula.contentVersion, tinhaRascunho: aula.draftPages !== null },
      after: { rascunhoDaVersao: versao.version, paginas: conferido.pages.length },
      reason: motivo,
    });

    revalidatePath('/admin/aulas');
    revalidatePath(`/admin/aulas/${aula.number}`);

    return {
      estado: 'ok',
      mensagem: `Versão ${versao.version} restaurada como rascunho. Nada foi publicado: revise na aba Páginas e publique quando estiver pronto.`,
    };
  } catch (erro: unknown) {
    const detalhe = erro instanceof Error ? erro.message : 'erro desconhecido';
    console.error(`[versões] falha ao restaurar: ${detalhe}`);
    return falha('Não foi possível restaurar agora. Nada foi alterado; tente de novo.');
  }
}
