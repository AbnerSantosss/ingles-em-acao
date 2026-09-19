/**
 * Server Actions dos módulos — BACKOFFICE §2.2 e §6.1.
 *
 * ⚠️ **Server Actions, não route handlers.** Toda função daqui começa por
 * `requireAdmin()` (o layout do painel protege a *renderização*, não o POST de
 * uma action) e termina por `auditar()`. Não existe atalho: se uma mutação nova
 * entrar neste arquivo sem essas duas linhas, ela está errada.
 *
 * ⚠️ **Nada é apagado de verdade** (decisão D8). "Excluir módulo" é
 * `archivedAt`, e mesmo isso é **bloqueado enquanto houver aula dentro** (§6.1):
 * arquivar em cascata sumiria com aulas que ninguém mandou sumir, e reatribuir
 * sozinho inventaria uma decisão editorial. A tela manda mover as aulas antes.
 */
'use server';

import { revalidatePath } from 'next/cache';

import { auditar } from '@/lib/admin/audit';
import { requireAdmin } from '@/lib/admin/guard';
import {
  contarAulasDoModulo,
  esquemaDeModulo,
  numeroDoFormulario,
  proximoIdEOrdem,
  trocarOrdem,
  vizinhoNaOrdem,
} from '@/lib/admin/modulos';
import type { SessionUser } from '@/lib/auth/session';
import { prisma } from '@/lib/db';

import type { ErrosDeCampo, EstadoDoFormulario } from './tipos';

// ─────────────────────────── utilidades locais ───────────────────────────

function falha(mensagem: string, campos?: ErrosDeCampo): EstadoDoFormulario {
  return campos ? { estado: 'erro', mensagem, campos } : { estado: 'erro', mensagem };
}

function sucesso(mensagem: string): EstadoDoFormulario {
  return { estado: 'ok', mensagem };
}

/**
 * `requireAdmin()` com a recusa virando estado de formulário.
 *
 * A action não pode redirecionar (um POST respondido com 307 faz o navegador
 * repetir o POST na tela de login), então a sessão vencida vira texto na tela e
 * a próxima navegação é que leva o admin ao login.
 */
async function autenticar(): Promise<
  { ok: true; admin: SessionUser } | { ok: false; estado: EstadoDoFormulario }
> {
  try {
    return { ok: true, admin: await requireAdmin() };
  } catch {
    return {
      ok: false,
      estado: falha(
        'Sua sessão administrativa não vale mais. Recarregue a página e entre de novo.',
      ),
    };
  }
}

/** Texto de um campo do formulário, já aparado. */
function texto(dados: FormData, campo: string): string {
  const valor = dados.get(campo);
  return typeof valor === 'string' ? valor.trim() : '';
}

/** O `id` inteiro de um módulo vindo do formulário. `NaN` quando ausente. */
function idDoFormulario(dados: FormData): number {
  return numeroDoFormulario(dados.get('id'));
}

/** Traduz os erros do zod para o mapa `campo -> mensagem` que o Field consome. */
function camposDoZod(
  issues: readonly { path: PropertyKey[]; message: string }[],
): ErrosDeCampo {
  const campos: Record<string, string> = {};
  for (const problema of issues) {
    const campo = problema.path[0];
    if (typeof campo === 'string' && !(campo in campos)) campos[campo] = problema.message;
  }
  return campos;
}

/** Lê e valida os três campos editáveis de um módulo. */
function lerDados(dados: FormData):
  | { ok: true; valor: { title: string; fromLesson: number; toLesson: number } }
  | { ok: false; estado: EstadoDoFormulario } {
  const bruto = {
    title: texto(dados, 'title'),
    fromLesson: numeroDoFormulario(dados.get('fromLesson')),
    toLesson: numeroDoFormulario(dados.get('toLesson')),
  };

  const conferido = esquemaDeModulo.safeParse(bruto);
  if (!conferido.success) {
    return {
      ok: false,
      estado: falha('Confira os campos marcados.', camposDoZod(conferido.error.issues)),
    };
  }

  return { ok: true, valor: conferido.data };
}

/**
 * Erro inesperado do banco vira texto para o admin e linha no log do servidor.
 *
 * Nada de `console.log` com dado de pessoa: aqui só circulam número de módulo e
 * a mensagem do driver.
 */
function erroDeBanco(onde: string, erro: unknown): EstadoDoFormulario {
  const motivo = erro instanceof Error ? erro.message : 'erro desconhecido';
  console.error(`[painel] módulos (${onde}): ${motivo}`);
  return falha('O banco de dados não completou a operação. Tente de novo em instantes.');
}

/** As duas telas que mostram módulo. A trilha do aluno lê módulo publicado. */
function revalidarTudo(): void {
  revalidatePath('/admin/modulos');
  revalidatePath('/trilha');
}

// ───────────────────────────────── criar ─────────────────────────────────

export async function criarModuloAction(
  _estado: EstadoDoFormulario,
  dados: FormData,
): Promise<EstadoDoFormulario> {
  const sessao = await autenticar();
  if (!sessao.ok) return sessao.estado;

  const campos = lerDados(dados);
  if (!campos.ok) return campos.estado;

  try {
    // `Module.id` não tem default e `Module.order` é único: os dois números são
    // escolhidos aqui. Há uma corrida teórica (dois admins criando módulo no
    // mesmo segundo); ela termina em violação de unicidade, que vira a mensagem
    // de erro abaixo — e não em duas linhas com a mesma ordem.
    const { id, order } = await proximoIdEOrdem();

    const criado = await prisma.module.create({
      data: { id, order, ...campos.valor },
    });

    await auditar({
      actor: sessao.admin,
      action: 'module.create',
      resource: `Module:${criado.id}`,
      after: criado,
    });

    revalidarTudo();
    return sucesso(`Módulo ${criado.id} criado.`);
  } catch (erro: unknown) {
    return erroDeBanco('criar', erro);
  }
}

// ──────────────────────────────── atualizar ──────────────────────────────

export async function atualizarModuloAction(
  _estado: EstadoDoFormulario,
  dados: FormData,
): Promise<EstadoDoFormulario> {
  const sessao = await autenticar();
  if (!sessao.ok) return sessao.estado;

  const id = idDoFormulario(dados);
  if (!Number.isInteger(id)) return falha('Módulo não identificado. Recarregue a página.');

  const campos = lerDados(dados);
  if (!campos.ok) return campos.estado;

  try {
    const antes = await prisma.module.findUnique({ where: { id } });
    if (!antes) return falha('Este módulo não existe mais. Recarregue a página.');

    const depois = await prisma.module.update({ where: { id }, data: campos.valor });

    await auditar({
      actor: sessao.admin,
      action: 'module.update',
      resource: `Module:${id}`,
      before: antes,
      after: depois,
    });

    revalidarTudo();
    // A faixa é descritiva: mudar `fromLesson`/`toLesson` **não** mexe no
    // `moduleId` de nenhuma aula. Quem liga aula a módulo é a tela de aulas, e a
    // divergência entre as duas coisas aparece na lista.
    return sucesso('Módulo salvo.');
  } catch (erro: unknown) {
    return erroDeBanco('atualizar', erro);
  }
}

// ──────────────────────────────── reordenar ──────────────────────────────

export async function moverModuloAction(
  _estado: EstadoDoFormulario,
  dados: FormData,
): Promise<EstadoDoFormulario> {
  const sessao = await autenticar();
  if (!sessao.ok) return sessao.estado;

  const id = idDoFormulario(dados);
  if (!Number.isInteger(id)) return falha('Módulo não identificado. Recarregue a página.');

  const direcao = texto(dados, 'direcao');
  if (direcao !== 'sobe' && direcao !== 'desce') {
    return falha('Direção inválida.');
  }

  try {
    const atual = await prisma.module.findUnique({
      where: { id },
      select: { id: true, order: true, title: true },
    });
    if (!atual) return falha('Este módulo não existe mais. Recarregue a página.');

    const vizinho = await vizinhoNaOrdem(id, direcao);
    if (!vizinho) {
      return falha(
        direcao === 'sobe'
          ? 'Este módulo já é o primeiro da lista.'
          : 'Este módulo já é o último da lista.',
      );
    }

    await trocarOrdem({ id: atual.id, order: atual.order }, vizinho);

    await auditar({
      actor: sessao.admin,
      action: 'module.reorder',
      resource: `Module:${id}`,
      before: { order: atual.order },
      after: { order: vizinho.order, trocadoCom: vizinho.id },
    });

    revalidarTudo();
    return sucesso(`"${atual.title}" mudou de posição.`);
  } catch (erro: unknown) {
    return erroDeBanco('reordenar', erro);
  }
}

// ───────────────────────── arquivar e restaurar ──────────────────────────

export async function arquivarModuloAction(
  _estado: EstadoDoFormulario,
  dados: FormData,
): Promise<EstadoDoFormulario> {
  const sessao = await autenticar();
  if (!sessao.ok) return sessao.estado;

  const id = idDoFormulario(dados);
  if (!Number.isInteger(id)) return falha('Módulo não identificado. Recarregue a página.');

  const motivo = texto(dados, 'motivo');

  try {
    const antes = await prisma.module.findUnique({ where: { id } });
    if (!antes) return falha('Este módulo não existe mais. Recarregue a página.');
    if (antes.archivedAt !== null) return falha('Este módulo já está arquivado.');

    // §6.1: módulo com aula dentro **não** é arquivado. A checagem é aqui, no
    // servidor — o botão desabilitado na tela é conveniência, não regra.
    const aulas = await contarAulasDoModulo(id);
    if (aulas > 0) {
      await auditar({
        actor: sessao.admin,
        action: 'module.archive',
        resource: `Module:${id}`,
        outcome: 'DENY',
        reason: `bloqueado: ${aulas} aula(s) ainda no módulo`,
      });
      return falha(
        `Este módulo ainda tem ${aulas} aula(s). Mova as aulas para outro módulo antes de arquivar.`,
      );
    }

    const depois = await prisma.module.update({
      where: { id },
      data: { archivedAt: new Date() },
    });

    await auditar({
      actor: sessao.admin,
      action: 'module.archive',
      resource: `Module:${id}`,
      before: antes,
      after: depois,
      reason: motivo || undefined,
    });

    revalidarTudo();
    return sucesso(`Módulo ${id} arquivado. Nada foi apagado, e dá para restaurar.`);
  } catch (erro: unknown) {
    return erroDeBanco('arquivar', erro);
  }
}

export async function restaurarModuloAction(
  _estado: EstadoDoFormulario,
  dados: FormData,
): Promise<EstadoDoFormulario> {
  const sessao = await autenticar();
  if (!sessao.ok) return sessao.estado;

  const id = idDoFormulario(dados);
  if (!Number.isInteger(id)) return falha('Módulo não identificado. Recarregue a página.');

  try {
    const antes = await prisma.module.findUnique({ where: { id } });
    if (!antes) return falha('Este módulo não existe mais. Recarregue a página.');
    if (antes.archivedAt === null) return falha('Este módulo não está arquivado.');

    const depois = await prisma.module.update({ where: { id }, data: { archivedAt: null } });

    await auditar({
      actor: sessao.admin,
      action: 'module.restore',
      resource: `Module:${id}`,
      before: antes,
      after: depois,
    });

    revalidarTudo();
    return sucesso(`Módulo ${id} restaurado.`);
  } catch (erro: unknown) {
    return erroDeBanco('restaurar', erro);
  }
}
