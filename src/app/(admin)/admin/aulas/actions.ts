/**
 * Server Actions das aulas — BACKOFFICE §2.3, §6.4, §6.5, §6.6 e §6.7.
 *
 * ⚠️ **Server Actions, não route handlers.** Toda função daqui começa por
 * `requireAdmin()` e termina por `auditar()`. O layout do painel protege a
 * renderização; uma action é um POST direto e o layout não roda antes dela.
 *
 * Três regras deste arquivo que não são negociáveis:
 *
 * 1. **Nada é apagado** (D8). "Excluir aula" é `archivedAt`, com motivo
 *    obrigatório. O progresso do aluno continua lá, intacto.
 * 2. **Progresso não se edita por aqui** (§6.5, D10). A única coisa que estas
 *    actions encostam em `LessonProgress` é o *clamp* de `currentPage` quando o
 *    conteúdo publicado encurta (§6.4, regra 2) — e mesmo isso nunca faz uma
 *    aula concluída deixar de estar concluída. `score`/`total` são cache
 *    recalculável e ficam como estão.
 * 3. **Publicar valida antes.** `validarPaginas` é a porta: conteúdo que não
 *    passa no esquema não vira aula publicada. É a diferença entre "aula
 *    indisponível" e "aula renderizada torta na cara do aluno".
 */
'use server';

import { revalidatePath } from 'next/cache';

import { auditar } from '@/lib/admin/audit';
import {
  codigoDaAula,
  esquemaDeDados,
  esquemaDeNumero,
  numeroDoFormulario,
  paginaInicial,
  proximoNumeroDeAula,
  slugLivre,
} from '@/lib/admin/aulas';
import { requireAdmin } from '@/lib/admin/guard';
import type { SessionUser } from '@/lib/auth/session';
import { validarPaginas } from '@/lib/content/blocks';
import { prisma } from '@/lib/db';
import { sincronizarUsosDaAula } from '@/lib/media/consultas';

import type { ErrosDeCampo, EstadoDoFormulario } from './tipos';

// ─────────────────────────── utilidades locais ───────────────────────────

function falha(mensagem: string, campos?: ErrosDeCampo): EstadoDoFormulario {
  return campos ? { estado: 'erro', mensagem, campos } : { estado: 'erro', mensagem };
}

function sucesso(mensagem: string): EstadoDoFormulario {
  return { estado: 'ok', mensagem };
}

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

function texto(dados: FormData, campo: string): string {
  const valor = dados.get(campo);
  return typeof valor === 'string' ? valor.trim() : '';
}

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

function erroDeBanco(onde: string, erro: unknown): EstadoDoFormulario {
  const motivo = erro instanceof Error ? erro.message : 'erro desconhecido';
  console.error(`[painel] aulas (${onde}): ${motivo}`);
  return falha('O banco de dados não completou a operação. Tente de novo em instantes.');
}

/**
 * Revalida o que a mudança afeta.
 *
 * O slug entra aqui porque a tela do aluno é `/aula/[slug]`: sem isso, a página
 * despublicada continuaria servida do cache para quem já a tinha visitado.
 */
function revalidar(slugs: readonly string[]): void {
  revalidatePath('/admin/aulas');
  revalidatePath('/trilha');
  revalidatePath('/inicio');
  for (const slug of slugs) revalidatePath(`/aula/${slug}`);
}

/** A aula do formulário, pelo `id` escondido. */
async function aulaDoFormulario(dados: FormData) {
  const id = texto(dados, 'id');
  if (id === '') return null;
  return prisma.lesson.findUnique({ where: { id } });
}

/**
 * Os campos que entram na auditoria.
 *
 * `auditar()` já poda `pages`/`draftPages`, mas mandar a linha inteira faria o
 * snapshot carregar colunas que não mudaram. Aqui vai só o que a tela edita.
 */
function paraAuditoria(linha: {
  number: number;
  code: string;
  slug: string;
  title: string;
  subtitle: string;
  estimatedTime: string;
  coverUrl: string | null;
  moduleId: number;
  published: boolean;
  archivedAt: Date | null;
}) {
  return {
    number: linha.number,
    code: linha.code,
    slug: linha.slug,
    title: linha.title,
    subtitle: linha.subtitle,
    estimatedTime: linha.estimatedTime,
    coverUrl: linha.coverUrl,
    moduleId: linha.moduleId,
    published: linha.published,
    archivedAt: linha.archivedAt,
  };
}

// ────────────────────────────── aba "Dados" ──────────────────────────────

export async function salvarDadosAction(
  _estado: EstadoDoFormulario,
  dados: FormData,
): Promise<EstadoDoFormulario> {
  const sessao = await autenticar();
  if (!sessao.ok) return sessao.estado;

  const conferido = esquemaDeDados.safeParse({
    title: texto(dados, 'title'),
    subtitle: texto(dados, 'subtitle'),
    estimatedTime: texto(dados, 'estimatedTime'),
    moduleId: numeroDoFormulario(dados.get('moduleId')),
    slug: texto(dados, 'slug'),
    coverUrl: texto(dados, 'coverUrl'),
  });

  if (!conferido.success) {
    return falha('Confira os campos marcados.', camposDoZod(conferido.error.issues));
  }

  try {
    const antes = await aulaDoFormulario(dados);
    if (!antes) return falha('Esta aula não existe mais. Recarregue a página.');

    const modulo = await prisma.module.findUnique({
      where: { id: conferido.data.moduleId },
      select: { id: true, archivedAt: true },
    });
    if (!modulo) {
      return falha('Confira os campos marcados.', { moduleId: 'este módulo não existe' });
    }
    if (modulo.archivedAt !== null && modulo.id !== antes.moduleId) {
      return falha('Confira os campos marcados.', {
        moduleId: 'este módulo está arquivado; escolha outro',
      });
    }

    // Slug é único no banco. A conferência aqui existe para a mensagem ser
    // útil ("já é da aula 12") em vez de um erro de constraint.
    if (conferido.data.slug !== antes.slug) {
      const ocupado = await prisma.lesson.findUnique({
        where: { slug: conferido.data.slug },
        select: { number: true },
      });
      if (ocupado && ocupado.number !== antes.number) {
        return falha('Confira os campos marcados.', {
          slug: `este slug já é da aula ${ocupado.number}`,
        });
      }
    }

    const depois = await prisma.lesson.update({
      where: { id: antes.id },
      data: {
        title: conferido.data.title,
        subtitle: conferido.data.subtitle,
        estimatedTime: conferido.data.estimatedTime,
        moduleId: conferido.data.moduleId,
        slug: conferido.data.slug,
        // Campo vazio significa "sem capa", e sem capa é NULL — não string vazia,
        // que o app trataria como caminho de imagem quebrada.
        coverUrl: conferido.data.coverUrl === '' ? null : conferido.data.coverUrl,
        updatedById: sessao.admin.id,
      },
    });

    await auditar({
      actor: sessao.admin,
      action: 'lesson.update',
      resource: `Lesson:${antes.number}`,
      before: paraAuditoria(antes),
      after: paraAuditoria(depois),
    });

    // A capa entra no índice de uso da biblioteca (`MediaUsage`): sem isto, uma
    // capa recém-escolhida apareceria "sem uso" em /admin/midia e poderia ser
    // arquivada com a aula no ar. O índice é derivado das páginas publicadas +
    // capa, o mesmo que a publicação grava. Falhar aqui não desfaz o salvar.
    if (antes.coverUrl !== depois.coverUrl) {
      try {
        await sincronizarUsosDaAula({
          lessonId: antes.id,
          capa: depois.coverUrl,
          pages: antes.pages,
        });
        revalidatePath('/admin/midia');
      } catch (erro: unknown) {
        const motivo = erro instanceof Error ? erro.message : 'erro desconhecido';
        console.error(`[painel] MediaUsage da capa não sincronizado: ${motivo}`);
      }
    }

    revalidar([antes.slug, depois.slug]);

    return sucesso(
      antes.slug === depois.slug
        ? 'Dados salvos.'
        : `Dados salvos. O endereço da aula agora é /aula/${depois.slug} — quem tiver o link antigo vai cair num 404.`,
    );
  } catch (erro: unknown) {
    return erroDeBanco('salvar dados', erro);
  }
}

// ─────────────────────── publicar e despublicar ──────────────────────────

export async function publicarAulaAction(
  _estado: EstadoDoFormulario,
  dados: FormData,
): Promise<EstadoDoFormulario> {
  const sessao = await autenticar();
  if (!sessao.ok) return sessao.estado;

  try {
    const antes = await aulaDoFormulario(dados);
    if (!antes) return falha('Esta aula não existe mais. Recarregue a página.');

    if (antes.archivedAt !== null) {
      return falha('Esta aula está arquivada. Restaure a aula antes de publicá-la.');
    }

    // ⚠️ A porta: conteúdo que não passa no esquema não é publicado. Sem isto,
    // um `pages` torto viraria aula quebrada na tela do aluno em vez de erro
    // aqui, onde alguém pode consertar.
    const conferido = validarPaginas(antes.pages);
    if (!conferido.ok) {
      await auditar({
        actor: sessao.admin,
        action: 'lesson.publish',
        resource: `Lesson:${antes.number}`,
        outcome: 'DENY',
        reason: `conteúdo inválido (${conferido.erros.length} erro(s))`,
      });
      const primeiros = conferido.erros.slice(0, 3).join(' · ');
      return falha(
        `O conteúdo desta aula não passou na validação e por isso ela não foi publicada: ${primeiros}`,
      );
    }

    const ultimaPagina = conferido.pages.length - 1;

    await prisma.lesson.update({
      where: { id: antes.id },
      data: {
        published: true,
        publishedAt: antes.publishedAt ?? new Date(),
        updatedById: sessao.admin.id,
      },
    });

    // §6.4, regra 2: se o conteúdo encurtou, o aluno que estava na página 9 de
    // uma aula que agora tem 7 não pode ficar apontando para o vazio. O clamp
    // **não** mexe em `status`: aula concluída continua concluída (D10).
    const ajustados = await prisma.lessonProgress.updateMany({
      where: { lessonId: antes.id, currentPage: { gt: ultimaPagina } },
      data: { currentPage: ultimaPagina },
    });

    await auditar({
      actor: sessao.admin,
      action: 'lesson.publish',
      resource: `Lesson:${antes.number}`,
      before: { published: antes.published },
      after: { published: true, paginas: conferido.pages.length },
      reason:
        ajustados.count > 0
          ? `${ajustados.count} progresso(s) reposicionado(s) na última página`
          : undefined,
    });

    revalidar([antes.slug]);

    // ⚠️ Este botão liga a aula com o conteúdo que já está publicado — ele não
    // publica o rascunho da aba Páginas (esse passa pelo relatório de impacto e
    // cria versão). Com rascunho pendente, a mensagem diz isso com todas as letras.
    const avisoDeRascunho =
      antes.draftPages !== null
        ? ' Atenção: o rascunho da aba Páginas continua pendente e NÃO entrou no ar — publique-o por lá.'
        : '';

    return sucesso(
      (ajustados.count > 0
        ? `Aula ${antes.number} publicada. ${ajustados.count} aluno(s) estavam além da última página e foram reposicionados no fim — nenhuma conclusão foi desfeita.`
        : `Aula ${antes.number} publicada. Ela já aparece para os alunos.`) + avisoDeRascunho,
    );
  } catch (erro: unknown) {
    return erroDeBanco('publicar', erro);
  }
}

export async function despublicarAulaAction(
  _estado: EstadoDoFormulario,
  dados: FormData,
): Promise<EstadoDoFormulario> {
  const sessao = await autenticar();
  if (!sessao.ok) return sessao.estado;

  const motivo = texto(dados, 'motivo');

  try {
    const antes = await aulaDoFormulario(dados);
    if (!antes) return falha('Esta aula não existe mais. Recarregue a página.');
    if (!antes.published) return falha('Esta aula já está despublicada.');

    await prisma.lesson.update({
      where: { id: antes.id },
      data: { published: false, updatedById: sessao.admin.id },
    });

    await auditar({
      actor: sessao.admin,
      action: 'lesson.unpublish',
      resource: `Lesson:${antes.number}`,
      before: { published: true },
      after: { published: false },
      reason: motivo || undefined,
    });

    revalidar([antes.slug]);

    // ⚠️ Despublicada, a aula responde 404 para o aluno — ela **não** cai no
    // conteúdo estático. É a terceira regra de `src/lib/content/publicado.ts`:
    // despublicar precisa realmente tirar do ar.
    return sucesso(
      `Aula ${antes.number} despublicada. Ela some da trilha e o endereço passa a responder 404. O progresso de quem já fez continua guardado.`,
    );
  } catch (erro: unknown) {
    return erroDeBanco('despublicar', erro);
  }
}

// ─────────────────────── arquivar e restaurar ────────────────────────────

export async function arquivarAulaAction(
  _estado: EstadoDoFormulario,
  dados: FormData,
): Promise<EstadoDoFormulario> {
  const sessao = await autenticar();
  if (!sessao.ok) return sessao.estado;

  // §6.1: arquivar aula exige motivo. Não é burocracia — é a única pista que
  // sobra, meses depois, de por que a aula 23 sumiu do curso.
  const motivo = texto(dados, 'motivo');
  if (motivo.length < 5) {
    return falha('Confira os campos marcados.', {
      motivo: 'escreva o motivo (mínimo de 5 caracteres)',
    });
  }

  try {
    const antes = await aulaDoFormulario(dados);
    if (!antes) return falha('Esta aula não existe mais. Recarregue a página.');
    if (antes.archivedAt !== null) return falha('Esta aula já está arquivada.');

    const depois = await prisma.lesson.update({
      where: { id: antes.id },
      // `published` fica como está, de propósito: restaurar devolve a aula ao
      // estado em que ela estava, em vez de republicá-la por conta própria.
      data: { archivedAt: new Date(), updatedById: sessao.admin.id },
    });

    await auditar({
      actor: sessao.admin,
      action: 'lesson.archive',
      resource: `Lesson:${antes.number}`,
      before: paraAuditoria(antes),
      after: paraAuditoria(depois),
      reason: motivo,
    });

    revalidar([antes.slug]);

    return sucesso(
      `Aula ${antes.number} arquivada. Nada foi apagado: o conteúdo, as respostas e o progresso continuam no banco, e dá para restaurar.`,
    );
  } catch (erro: unknown) {
    return erroDeBanco('arquivar', erro);
  }
}

export async function restaurarAulaAction(
  _estado: EstadoDoFormulario,
  dados: FormData,
): Promise<EstadoDoFormulario> {
  const sessao = await autenticar();
  if (!sessao.ok) return sessao.estado;

  try {
    const antes = await aulaDoFormulario(dados);
    if (!antes) return falha('Esta aula não existe mais. Recarregue a página.');
    if (antes.archivedAt === null) return falha('Esta aula não está arquivada.');

    const depois = await prisma.lesson.update({
      where: { id: antes.id },
      data: { archivedAt: null, updatedById: sessao.admin.id },
    });

    await auditar({
      actor: sessao.admin,
      action: 'lesson.restore',
      resource: `Lesson:${antes.number}`,
      before: paraAuditoria(antes),
      after: paraAuditoria(depois),
    });

    revalidar([antes.slug]);

    return sucesso(
      antes.published
        ? `Aula ${antes.number} restaurada — e ela estava publicada, então já voltou para o ar.`
        : `Aula ${antes.number} restaurada. Ela continua despublicada.`,
    );
  } catch (erro: unknown) {
    return erroDeBanco('restaurar', erro);
  }
}

// ───────────────────────────── criar aula ────────────────────────────────

export async function criarAulaAction(
  _estado: EstadoDoFormulario,
  dados: FormData,
): Promise<EstadoDoFormulario> {
  const sessao = await autenticar();
  if (!sessao.ok) return sessao.estado;

  const title = texto(dados, 'title');
  const subtitle = texto(dados, 'subtitle');
  const estimatedTime = texto(dados, 'estimatedTime') || '10 min';
  const moduleId = numeroDoFormulario(dados.get('moduleId'));

  if (title.length < 2) {
    return falha('Confira os campos marcados.', {
      title: 'o título precisa de pelo menos 2 caracteres',
    });
  }
  if (!Number.isInteger(moduleId)) {
    return falha('Confira os campos marcados.', { moduleId: 'escolha um módulo' });
  }

  try {
    const modulo = await prisma.module.findUnique({
      where: { id: moduleId },
      select: { id: true },
    });
    if (!modulo) {
      return falha('Confira os campos marcados.', { moduleId: 'este módulo não existe' });
    }

    const numero = await proximoNumeroDeAula();
    const slug = await slugLivre(title);

    const criada = await prisma.lesson.create({
      data: {
        number: numero,
        code: codigoDaAula(numero),
        slug,
        title,
        subtitle,
        estimatedTime,
        moduleId,
        // Conteúdo mínimo válido — ver `paginaInicial`. A aula nasce
        // **despublicada**: ninguém publica sem querer uma aula com uma página.
        pages: paginaInicial(title, subtitle),
        published: false,
        updatedById: sessao.admin.id,
      },
    });

    await auditar({
      actor: sessao.admin,
      action: 'lesson.create',
      resource: `Lesson:${criada.number}`,
      after: paraAuditoria(criada),
    });

    revalidar([]);

    return sucesso(
      `Aula ${criada.number} criada como rascunho, com uma página de partida. Abra "${criada.title}" para escrever o conteúdo.`,
    );
  } catch (erro: unknown) {
    return erroDeBanco('criar', erro);
  }
}

// ────────────────────── renumerar (alto risco, §6.6) ─────────────────────

/**
 * Trocar o número de uma aula.
 *
 * ⚠️ **Ação de alto risco.** A §6.6 chega a dizer que o editor não deixa mexer
 * no `number` depois da criação, e o motivo é bom: o número aparece no `code`,
 * no caminho da capa, em blocos `badge` dentro do conteúdo e em qualquer link
 * que alguém tenha anotado. Ela existe aqui porque renumerar *às vezes* é
 * necessário (uma aula entra no meio do módulo), e um painel que não faz isso
 * empurra o PO para o `psql`, onde não há validação nem auditoria.
 *
 * O que a torna aceitável:
 *
 * - **Confirmação explícita:** o admin digita o novo número de novo, em um
 *   segundo campo. Um clique só não renumera nada.
 * - **Motivo obrigatório**, que vai para a auditoria.
 * - **Número ocupado é recusado** — nada de troca automática com a aula que já
 *   usa aquele número, que seria duas renumerações escondidas em uma.
 * - **`code` acompanha** o número novo; o conteúdo, não. O aviso na tela diz
 *   quais coisas continuam com o número antigo.
 *
 * O progresso do aluno não se perde: `LessonProgress` aponta para o `id` (cuid)
 * da aula, não para o número.
 */
export async function renumerarAulaAction(
  _estado: EstadoDoFormulario,
  dados: FormData,
): Promise<EstadoDoFormulario> {
  const sessao = await autenticar();
  if (!sessao.ok) return sessao.estado;

  const conferido = esquemaDeNumero.safeParse(numeroDoFormulario(dados.get('numero')));
  if (!conferido.success) {
    return falha('Confira os campos marcados.', {
      numero: conferido.error.issues[0]?.message ?? 'número inválido',
    });
  }
  const novo = conferido.data;

  const confirmacao = numeroDoFormulario(dados.get('confirmacao'));
  if (confirmacao !== novo) {
    return falha('Confira os campos marcados.', {
      confirmacao: 'digite o mesmo número para confirmar',
    });
  }

  const motivo = texto(dados, 'motivo');
  if (motivo.length < 5) {
    return falha('Confira os campos marcados.', {
      motivo: 'escreva o motivo (mínimo de 5 caracteres)',
    });
  }

  try {
    const antes = await aulaDoFormulario(dados);
    if (!antes) return falha('Esta aula não existe mais. Recarregue a página.');
    if (antes.number === novo) return falha('Esta aula já tem esse número.');

    const ocupado = await prisma.lesson.findUnique({
      where: { number: novo },
      select: { number: true, title: true },
    });
    if (ocupado) {
      await auditar({
        actor: sessao.admin,
        action: 'lesson.renumber',
        resource: `Lesson:${antes.number}`,
        outcome: 'DENY',
        reason: `número ${novo} já é de "${ocupado.title}"`,
      });
      return falha(
        `O número ${novo} já é da aula "${ocupado.title}". Renumere aquela aula primeiro — esta ação não troca duas aulas de lugar sozinha.`,
      );
    }

    const depois = await prisma.lesson.update({
      where: { id: antes.id },
      data: { number: novo, code: codigoDaAula(novo), updatedById: sessao.admin.id },
    });

    await auditar({
      actor: sessao.admin,
      action: 'lesson.renumber',
      resource: `Lesson:${antes.number}`,
      before: paraAuditoria(antes),
      after: paraAuditoria(depois),
      reason: motivo,
    });

    revalidar([antes.slug]);

    // Nada de `redirect()` aqui: ele funciona lançando (`NEXT_REDIRECT`), e o
    // `catch` logo abaixo engoliria o desvio e o transformaria em "erro de
    // banco". A tela informa o endereço novo e oferece o link.
    return sucesso(
      `A aula ${antes.number} agora é a aula ${novo}, e o código virou "${depois.code}". Esta tela passou a ser /admin/aulas/${novo}. O endereço do aluno continua /aula/${depois.slug}; a capa e os blocos que citam o número antigo precisam ser revistos à mão.`,
    );
  } catch (erro: unknown) {
    return erroDeBanco('renumerar', erro);
  }
}
