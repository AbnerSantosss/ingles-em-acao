/**
 * Server Actions da aba "Páginas" — salvar rascunho, descartar e publicar
 * (BACKOFFICE §3, §3.5 e §6.4).
 *
 * ⚠️ Toda action começa por `requireAdmin()` e termina por `auditar()`. O que
 * o navegador validou é conveniência: aqui tudo é refeito — forma (zod),
 * integridade dos ids, validação semântica e relatório de impacto.
 *
 * ⚠️ Salvar ≠ publicar (D7). Salvar só toca `draftPages`. Publicar é a única
 * coisa que muda o que o aluno vê, e exige que o rascunho seja exatamente o
 * que o admin revisou (hash).
 */
'use server';

import { Prisma } from '@prisma/client';
import { revalidatePath } from 'next/cache';

import { auditar } from '@/lib/admin/audit';
import { jsonCanonico, type EstadoDoEditor } from '@/lib/admin/editor';
import { requireAdmin } from '@/lib/admin/guard';
import {
  conferirRascunho,
  hashDasPaginas,
  montarRelatorioDePublicacao,
  publicarRascunho,
  RascunhoMudouError,
} from '@/lib/admin/publicacao';
import type { SessionUser } from '@/lib/auth/session';
import { prisma } from '@/lib/db';

// ─────────────────────────── utilidades locais ───────────────────────────

function falha(mensagem: string, erros?: string[]): EstadoDoEditor {
  return erros && erros.length > 0 ? { estado: 'erro', mensagem, erros } : { estado: 'erro', mensagem };
}

function sucesso(mensagem: string): EstadoDoEditor {
  return { estado: 'ok', mensagem };
}

async function autenticar(): Promise<
  { ok: true; admin: SessionUser } | { ok: false; estado: EstadoDoEditor }
> {
  try {
    return { ok: true, admin: await requireAdmin() };
  } catch {
    return {
      ok: false,
      estado: falha('Sua sessão administrativa não vale mais. Recarregue a página e entre de novo.'),
    };
  }
}

function campo(dados: FormData, nome: string): string {
  const valor = dados.get(nome);
  return typeof valor === 'string' ? valor : '';
}

function revalidarAula(numero: number, slug: string): void {
  revalidatePath('/admin/aulas');
  revalidatePath(`/admin/aulas/${numero}`);
  revalidatePath('/trilha');
  revalidatePath('/inicio');
  revalidatePath(`/aula/${slug}`);
}

async function aulaDoFormulario(dados: FormData) {
  const id = campo(dados, 'aulaId');
  if (id === '') return null;
  return prisma.lesson.findUnique({
    where: { id },
    select: {
      id: true,
      number: true,
      slug: true,
      pages: true,
      draftPages: true,
      published: true,
      contentVersion: true,
    },
  });
}

/** Hash do rascunho gravado agora ('' quando não há rascunho). */
function hashDoRascunhoGravado(draftPages: Prisma.JsonValue | null): string {
  return draftPages === null ? '' : hashDasPaginas(draftPages);
}

const MENSAGEM_CONCORRENCIA =
  'O rascunho desta aula foi alterado em outra aba ou por outra pessoa depois que você abriu o editor. Nada foi gravado. Copie o que precisar e recarregue a página.';

// ─────────────────────────────── salvar ───────────────────────────────

export async function salvarRascunhoAction(
  _estado: EstadoDoEditor,
  dados: FormData,
): Promise<EstadoDoEditor> {
  const sessao = await autenticar();
  if (!sessao.ok) return sessao.estado;

  try {
    const aula = await aulaDoFormulario(dados);
    if (!aula) return falha('Esta aula não existe mais. Recarregue a página.');

    if (campo(dados, 'hashBase') !== hashDoRascunhoGravado(aula.draftPages)) {
      return falha(MENSAGEM_CONCORRENCIA);
    }

    let bruto: unknown;
    try {
      bruto = JSON.parse(campo(dados, 'paginas'));
    } catch {
      return falha('O conteúdo enviado não é um JSON válido. Nada foi gravado.');
    }

    // A porta: forma (zod) + integridade dos ids. Rascunho inválido não é gravado.
    const conferido = await conferirRascunho(aula, bruto);
    if (!conferido.ok) {
      return falha(
        `O rascunho não foi salvo: ${conferido.erros.length} problema(s) precisam ser corrigidos.`,
        conferido.erros,
      );
    }

    // `draftPages = null` significa "rascunho igual ao publicado" (schema).
    const igualAoPublicado = jsonCanonico(conferido.pages) === jsonCanonico(aula.pages);
    await prisma.lesson.update({
      where: { id: aula.id },
      data: {
        draftPages: igualAoPublicado
          ? Prisma.DbNull
          : (conferido.pages as unknown as Prisma.InputJsonValue),
        updatedById: sessao.admin.id,
      },
    });

    const blocos = conferido.pages.reduce((total, pagina) => total + pagina.blocks.length, 0);
    await auditar({
      actor: sessao.admin,
      action: 'lesson.draft.save',
      resource: `Lesson:${aula.number}`,
      before: { temRascunho: aula.draftPages !== null },
      after: {
        temRascunho: !igualAoPublicado,
        paginas: conferido.pages.length,
        blocos,
      },
    });

    revalidatePath('/admin/aulas');
    revalidatePath(`/admin/aulas/${aula.number}`);

    return sucesso(
      igualAoPublicado
        ? 'Salvo. O conteúdo ficou igual ao publicado, então não há rascunho pendente.'
        : `Rascunho salvo (${conferido.pages.length} página(s), ${blocos} bloco(s)). O aluno ainda vê a versão publicada.`,
    );
  } catch (erro: unknown) {
    const motivo = erro instanceof Error ? erro.message : 'erro desconhecido';
    console.error(`[editor] falha ao salvar rascunho: ${motivo}`);
    return falha('Não foi possível salvar agora. Nada foi alterado; tente de novo.');
  }
}

// ─────────────────────────────── descartar ───────────────────────────────

export async function descartarRascunhoAction(
  _estado: EstadoDoEditor,
  dados: FormData,
): Promise<EstadoDoEditor> {
  const sessao = await autenticar();
  if (!sessao.ok) return sessao.estado;

  try {
    const aula = await aulaDoFormulario(dados);
    if (!aula) return falha('Esta aula não existe mais. Recarregue a página.');
    if (aula.draftPages === null) return falha('Esta aula não tem rascunho para descartar.');
    if (campo(dados, 'hashBase') !== hashDoRascunhoGravado(aula.draftPages)) {
      return falha(MENSAGEM_CONCORRENCIA);
    }

    await prisma.lesson.update({
      where: { id: aula.id },
      data: { draftPages: Prisma.DbNull, updatedById: sessao.admin.id },
    });

    await auditar({
      actor: sessao.admin,
      action: 'lesson.draft.discard',
      resource: `Lesson:${aula.number}`,
      before: { temRascunho: true },
      after: { temRascunho: false },
    });

    revalidatePath('/admin/aulas');
    revalidatePath(`/admin/aulas/${aula.number}`);
    return sucesso('Rascunho descartado. O editor voltou para o conteúdo publicado.');
  } catch (erro: unknown) {
    const motivo = erro instanceof Error ? erro.message : 'erro desconhecido';
    console.error(`[editor] falha ao descartar rascunho: ${motivo}`);
    return falha('Não foi possível descartar agora. Nada foi alterado; tente de novo.');
  }
}

// ─────────────────────────────── publicar ───────────────────────────────

export async function publicarRascunhoAction(
  _estado: EstadoDoEditor,
  dados: FormData,
): Promise<EstadoDoEditor> {
  const sessao = await autenticar();
  if (!sessao.ok) return sessao.estado;

  try {
    const aula = await aulaDoFormulario(dados);
    if (!aula) return falha('Esta aula não existe mais. Recarregue a página.');

    // Tudo refeito aqui, do zero — o relatório que o admin viu é só uma cópia.
    const relatorio = await montarRelatorioDePublicacao(aula.id);
    if (!relatorio) return falha('Esta aula não tem rascunho para publicar. Salve o rascunho antes.');

    if (campo(dados, 'hash') !== relatorio.hash) {
      return falha(
        'O rascunho mudou depois que o relatório de impacto foi montado. Recarregue a página e revise o relatório de novo antes de publicar.',
      );
    }

    if (relatorio.erros.length > 0) {
      await auditar({
        actor: sessao.admin,
        action: 'lesson.publish',
        resource: `Lesson:${aula.number}`,
        outcome: 'DENY',
        reason: `rascunho com ${relatorio.erros.length} erro(s) de validação`,
      });
      return falha(
        `A publicação foi bloqueada: ${relatorio.erros.length} erro(s) precisam ser corrigidos no rascunho.`,
        relatorio.erros,
      );
    }

    if (relatorio.avisos.length > 0 && campo(dados, 'confirmarAvisos') !== 'sim') {
      return falha('Há avisos de validação. Marque que você revisou os avisos para publicar.');
    }
    if (relatorio.exigeConfirmacaoDeImpacto && campo(dados, 'confirmarImpacto') !== 'sim') {
      return falha(
        'Esta publicação afeta alunos. Marque que você leu o impacto para publicar.',
        relatorio.impacto,
      );
    }

    const resultado = await publicarRascunho({
      lessonId: aula.id,
      hashEsperado: relatorio.hash,
      adminId: sessao.admin.id,
      resumo: relatorio.resumo,
    });

    await auditar({
      actor: sessao.admin,
      action: 'lesson.publish',
      resource: `Lesson:${aula.number}`,
      before: { contentVersion: resultado.versaoAnterior, paginas: relatorio.diferencas.paginasAntes },
      after: {
        contentVersion: resultado.versao,
        paginas: resultado.paginas,
        resumo: relatorio.resumo,
        exerciciosRemovidos: relatorio.removidos.map((b) => b.id),
        exerciciosAlterados: relatorio.alterados.map((b) => b.id),
        alunosComRespostasRemovidas: relatorio.alunosComRespostasRemovidas,
        progressosReposicionados: resultado.progressosReposicionados,
        avisosConfirmados: relatorio.avisos.length,
      },
      reason: relatorio.impacto.join(' '),
    });

    revalidarAula(aula.number, aula.slug);

    const partes = [`Versão ${resultado.versao} publicada (${relatorio.resumo}).`];
    if (resultado.progressosReposicionados > 0) {
      partes.push(
        `${resultado.progressosReposicionados} aluno(s) reposicionado(s) na última página.`,
      );
    }
    if (resultado.midias === null) {
      partes.push(
        'Atenção: o índice de uso de mídia não foi atualizado. Publique de novo mais tarde ou avise o suporte.',
      );
    }
    if (!aula.published) {
      partes.push('A aula continua fora do ar: para o aluno ver, publique a aula na aba Dados.');
    }
    return sucesso(partes.join(' '));
  } catch (erro: unknown) {
    if (erro instanceof RascunhoMudouError) {
      return falha(
        'O rascunho mudou durante a publicação. Nada foi publicado; recarregue a página e revise de novo.',
      );
    }
    const motivo = erro instanceof Error ? erro.message : 'erro desconhecido';
    console.error(`[editor] falha ao publicar: ${motivo}`);
    return falha('Não foi possível publicar agora. Nada foi alterado; tente de novo.');
  }
}
