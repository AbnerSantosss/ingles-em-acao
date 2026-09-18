/**
 * A porta de leitura do conteúdo para o app do aluno.
 *
 * ⚠️ MÓDULO DE SERVIDOR (importa o Prisma). Nunca importe de um `'use client'`.
 *
 * ## As três regras (BACKOFFICE D7 e §6.4, regra 1)
 *
 * Até a Fase 2 o aluno lia `content/course-data.mjs` direto. Sem trocar isso, o
 * painel seria **cosmético**: o PO edita e o aluno não vê. Este arquivo é a troca,
 * e ele decide entre banco e estático por estas três regras — nesta ordem:
 *
 * 1. **Existe linha em `Lesson` com aquele `number`, `archivedAt: null` e
 *    `published: true`** → devolve o `pages` do banco **validado por
 *    `validarPaginas`**. Conteúdo do banco que não passa no validador é tratado
 *    como **aula indisponível**, nunca renderizado torto: meia aula na tela é
 *    pior que um 404, porque o aluno não sabe que está vendo conteúdo quebrado e
 *    ninguém recebe erro nenhum.
 *
 * 2. **Não existe linha nenhuma na tabela** (banco vazio, ambiente sem seed) →
 *    cai no conteúdo estático. É o que mantém o desenvolvimento funcionando sem
 *    banco populado, e é o único caminho em que o estático ainda vale.
 *
 * 3. **Existe linha, mas está despublicada ou arquivada** → **404**. **Nunca**
 *    caia no estático aqui. Despublicar precisa realmente esconder, ou o botão
 *    mente: o PO tira do ar uma aula com problema, a tela continua servindo a
 *    versão antiga do arquivo, e ele só descobre pelo suporte.
 *
 * Estas três regras são a diferença entre "esconder uma aula com problema"
 * funcionar e não funcionar. Se você mexer em alguma, mexa no comentário junto.
 *
 * ## E quando o banco não responde?
 *
 * Cai no estático, como no caso 2 — e isso **não** abre buraco na regra 3. Para
 * ver qualquer tela de `(app)` é preciso sessão válida, e `getCurrentUser()` lê
 * a sessão no mesmo banco: com o Postgres fora, ninguém está logado para ver
 * aula nenhuma. O fallback só existe para o caso real de desenvolvimento local
 * sem banco no ar.
 */
import { cache } from 'react';

import { validarPaginas } from '@/lib/content/blocks';
import {
  getAllLessons,
  getLessonBySlug,
  getLessonByNumber,
  getLessonSummaryByNumber,
  getLessonSummaryBySlug,
} from '@/lib/content/lessons';
import { MODULES } from '@/lib/content/modules';
import type { Lesson, LessonSummary } from '@/lib/content/types';
import { prisma } from '@/lib/db';

// ───────────────────────────────── tipos ─────────────────────────────────

/** De onde veio o conteúdo desta resposta. Serve a log e a aviso de tela, não a regra. */
export type FonteDoConteudo = 'banco' | 'estatico';

/** Uma aula pronta para o leitor: o conteúdo, os metadados e a procedência. */
export type AulaPublicada = {
  /** A aula no formato que `LeitorDaAula` e `BlockRenderer` consomem. */
  aula: Lesson;
  /** Slug, capa, módulo e contagem de páginas. */
  resumo: LessonSummary;
  fonte: FonteDoConteudo;
};

/**
 * Uma aula na lista da trilha.
 *
 * É `LessonSummary` **menos `pageCount`**, e a ausência é proposital: contar
 * páginas exigiria trazer o `pages` das 42 aulas a cada render da trilha (~300 KB
 * de blocos) para exibir um número que a trilha não mostra. Quem precisa da
 * contagem real abre a aula.
 */
export type ResumoPublicado = Omit<LessonSummary, 'pageCount'> & { fonte: FonteDoConteudo };

/** Um módulo como o aluno o vê. */
export type ModuloPublicado = {
  id: number;
  order: number;
  title: string;
  from: number;
  to: number;
  fonte: FonteDoConteudo;
};

/** A trilha inteira, já agrupada. */
export type TrilhaPublicada = {
  grupos: { modulo: ModuloPublicado; aulas: ResumoPublicado[] }[];
  /**
   * Aulas cujo módulo não está na lista (módulo arquivado, por exemplo). Nunca
   * somem da trilha: uma aula publicada que ninguém consegue abrir é pior que
   * uma aula fora do agrupamento.
   */
  soltas: ResumoPublicado[];
  /** Quantas aulas o aluno tem disponíveis, somando grupos e soltas. */
  total: number;
};

/** A linha de `Lesson` com tudo o que o leitor precisa. */
type LinhaCompleta = {
  number: number;
  code: string;
  slug: string;
  title: string;
  subtitle: string;
  estimatedTime: string;
  coverUrl: string | null;
  moduleId: number;
  pages: unknown;
  published: boolean;
  archivedAt: Date | null;
};

/** A mesma linha sem `pages` — o que a trilha precisa (42 linhas, nenhum bloco). */
type LinhaDeLista = Omit<LinhaCompleta, 'pages'>;

const CAMPOS_DE_LISTA = {
  number: true,
  code: true,
  slug: true,
  title: true,
  subtitle: true,
  estimatedTime: true,
  coverUrl: true,
  moduleId: true,
  published: true,
  archivedAt: true,
} as const;

const CAMPOS_COMPLETOS = { ...CAMPOS_DE_LISTA, pages: true } as const;

// ──────────────────────────── acesso ao banco ────────────────────────────

/**
 * Registra a indisponibilidade do banco sem dado de pessoa junto.
 *
 * Só o motivo técnico: quem chamou já sabe que vai cair no estático, e o
 * silêncio aqui esconderia um Postgres fora do ar por dias.
 */
function avisarBancoFora(onde: string, erro: unknown): void {
  const motivo = erro instanceof Error ? erro.message : 'erro desconhecido';
  console.error(`[conteudo] ${onde}: banco indisponível, usando o conteúdo estático — ${motivo}`);
}

/**
 * As linhas que podem responder por este slug.
 *
 * Busca pelo slug **e** pelo número da aula estática de mesmo slug, porque os
 * dois caminhos precisam de resposta diferente: linha achada pelo slug manda na
 * decisão; linha achada só pelo número significa que o PO **trocou o slug** — e
 * aí o link antigo tem de dar 404 (§6.7: mudar slug quebra link salvo), não
 * cair no estático.
 *
 * `null` = banco não respondeu.
 */
async function linhasDoSlug(slug: string, numero: number | null): Promise<LinhaCompleta[] | null> {
  try {
    return await prisma.lesson.findMany({
      where: numero === null ? { slug } : { OR: [{ slug }, { number: numero }] },
      select: CAMPOS_COMPLETOS,
      take: 2,
    });
  } catch (erro: unknown) {
    avisarBancoFora('aula por slug', erro);
    return null;
  }
}

/** A linha daquele número, ou `null` quando não existe / o banco não respondeu. */
async function linhaDoNumero(numero: number): Promise<LinhaCompleta | null> {
  try {
    return await prisma.lesson.findUnique({ where: { number: numero }, select: CAMPOS_COMPLETOS });
  } catch (erro: unknown) {
    avisarBancoFora('aula por número', erro);
    return null;
  }
}

// ──────────────────────────────── montagem ───────────────────────────────

/** O estático correspondente, quando existe — o par (aula, resumo) sempre anda junto. */
type Estatico = { aula: Lesson; resumo: LessonSummary } | null;

function estaticoPorSlug(slug: string): Estatico {
  const aula = getLessonBySlug(slug);
  const resumo = getLessonSummaryBySlug(slug);
  return aula && resumo ? { aula, resumo } : null;
}

function estaticoPorNumero(numero: number): Estatico {
  const aula = getLessonByNumber(numero);
  const resumo = getLessonSummaryByNumber(numero);
  return aula && resumo ? { aula, resumo } : null;
}

/**
 * Aplica as três regras do topo do arquivo.
 *
 * @param linha    a linha do banco, ou `null` quando não existe (ou não há banco)
 * @param estatico o conteúdo do arquivo para o mesmo slug/número, se houver
 */
function decidir(linha: LinhaCompleta | null, estatico: Estatico): AulaPublicada | null {
  // Regra 2 — não existe linha: o arquivo ainda responde.
  if (linha === null) {
    if (estatico === null) return null;
    return { aula: estatico.aula, resumo: estatico.resumo, fonte: 'estatico' };
  }

  // Regra 3 — existe e está escondida: 404, sem rede de proteção estática.
  if (linha.archivedAt !== null || !linha.published) return null;

  // Regra 1 — existe e está publicada: o banco manda, mas só se o conteúdo
  // passar no validador. Aula que não valida é aula indisponível.
  const validacao = validarPaginas(linha.pages);
  if (!validacao.ok) {
    console.error(
      `[conteudo] aula ${linha.number} publicada com conteúdo inválido (${validacao.erros.length} erro(s)); ` +
        `tratada como indisponível. Primeiro erro: ${validacao.erros[0] ?? 'sem detalhe'}`,
    );
    return null;
  }

  const paginas = validacao.pages;

  return {
    aula: {
      id: linha.number,
      code: linha.code,
      title: linha.title,
      sub: linha.subtitle,
      time: linha.estimatedTime,
      pages: paginas,
    },
    resumo: {
      id: linha.number,
      code: linha.code,
      slug: linha.slug,
      title: linha.title,
      subtitle: linha.subtitle,
      time: linha.estimatedTime,
      cover: linha.coverUrl,
      pageCount: paginas.length,
      moduleId: linha.moduleId,
    },
    fonte: 'banco',
  };
}

/** O resumo de uma linha de lista, sem abrir as páginas. */
function resumoDaLinha(linha: LinhaDeLista): ResumoPublicado {
  return {
    id: linha.number,
    code: linha.code,
    slug: linha.slug,
    title: linha.title,
    subtitle: linha.subtitle,
    time: linha.estimatedTime,
    cover: linha.coverUrl,
    moduleId: linha.moduleId,
    fonte: 'banco',
  };
}

// ──────────────────────────── leitura de aula ────────────────────────────

/**
 * A aula que o aluno pode abrir por este slug, ou `null` (→ `notFound()`).
 *
 * `null` cobre os três "não": slug que não existe, aula despublicada ou
 * arquivada, e aula publicada com conteúdo que não valida.
 */
export async function carregarAulaPublicadaPorSlug(slug: string): Promise<AulaPublicada | null> {
  const estatico = estaticoPorSlug(slug);
  const linhas = await linhasDoSlug(slug, estatico?.aula.id ?? null);

  if (linhas === null) {
    // Banco fora: o caso 2 (ver o cabeçalho) responde pelo desenvolvimento local.
    return decidir(null, estatico);
  }

  // A linha achada pelo slug pedido manda. Se só houve casamento por número, o
  // slug mudou no painel: o link antigo dá 404 (§6.7), senão a mesma aula ficaria
  // em dois endereços e o aviso do painel ("links salvos quebram") seria falso.
  const linha = linhas.find((l) => l.slug === slug) ?? linhas[0] ?? null;
  if (linha !== null && linha.slug !== slug) return null;
  return decidir(linha, estatico);
}

/** A mesma decisão, pelo número da aula (1 a 42). */
export async function carregarAulaPublicadaPorNumero(
  numero: number,
): Promise<AulaPublicada | null> {
  const estatico = estaticoPorNumero(numero);
  const linha = await linhaDoNumero(numero);
  return decidir(linha, estatico);
}

// ─────────────────────────── leitura de listas ───────────────────────────

/**
 * Todas as linhas de `Lesson`, sem filtro — é a leitura que distingue "a tabela
 * está vazia" (regra 2) de "está tudo despublicado" (regra 3).
 *
 * São 42 linhas sem `pages`; filtrar em memória sai mais barato que duas idas
 * ao banco, e evita o engano de tratar "nenhuma publicada" como "sem seed".
 */
async function todasAsLinhas(): Promise<LinhaDeLista[] | null> {
  try {
    return await prisma.lesson.findMany({ select: CAMPOS_DE_LISTA, orderBy: { number: 'asc' } });
  } catch (erro: unknown) {
    avisarBancoFora('lista de aulas', erro);
    return null;
  }
}

/** As aulas que o aluno pode abrir, em ordem de número. */
export async function listarAulasPublicadas(): Promise<ResumoPublicado[]> {
  const linhas = await todasAsLinhas();

  // Regra 2: tabela vazia (ou banco fora) → o catálogo do arquivo.
  if (linhas === null || linhas.length === 0) {
    return getAllLessons().map((resumo) => ({
      id: resumo.id,
      code: resumo.code,
      slug: resumo.slug,
      title: resumo.title,
      subtitle: resumo.subtitle,
      time: resumo.time,
      cover: resumo.cover,
      moduleId: resumo.moduleId,
      fonte: 'estatico' as const,
    }));
  }

  return linhas.filter((linha) => linha.archivedAt === null && linha.published).map(resumoDaLinha);
}

/** Os módulos como o aluno os vê — mesmas três regras, aplicadas à tabela `Module`. */
export async function listarModulosPublicados(): Promise<ModuloPublicado[]> {
  let linhas: { id: number; order: number; title: string; fromLesson: number; toLesson: number; archivedAt: Date | null }[] | null;

  try {
    linhas = await prisma.module.findMany({
      select: { id: true, order: true, title: true, fromLesson: true, toLesson: true, archivedAt: true },
      orderBy: { order: 'asc' },
    });
  } catch (erro: unknown) {
    avisarBancoFora('lista de módulos', erro);
    linhas = null;
  }

  if (linhas === null || linhas.length === 0) {
    return MODULES.map((modulo) => ({
      id: modulo.id,
      order: modulo.id,
      title: modulo.title,
      from: modulo.from,
      to: modulo.to,
      fonte: 'estatico' as const,
    }));
  }

  return linhas
    .filter((linha) => linha.archivedAt === null)
    .map((linha) => ({
      id: linha.id,
      order: linha.order,
      title: linha.title,
      from: linha.fromLesson,
      to: linha.toLesson,
      fonte: 'banco' as const,
    }));
}

/**
 * A trilha pronta para a tela: módulos na ordem, aulas publicadas dentro de cada
 * um, e as que sobraram no fim.
 *
 * O agrupamento é por `moduleId`, não pela faixa `from..to`: a faixa é o que o
 * módulo *declara*, e o painel mostra quando as duas divergem — mas quem manda
 * na tela do aluno é o vínculo real da aula.
 */
/**
 * Memoizada por requisição (`cache` do React): a Home, o perfil e `/progresso`
 * pedem a trilha pelo `getUserProgress` e pela própria página no mesmo render.
 */
export const carregarTrilhaPublicada = cache(async (): Promise<TrilhaPublicada> => {
  const [aulas, modulos] = await Promise.all([listarAulasPublicadas(), listarModulosPublicados()]);

  const porModulo = new Map<number, ResumoPublicado[]>();
  for (const modulo of modulos) porModulo.set(modulo.id, []);

  const soltas: ResumoPublicado[] = [];
  for (const aula of aulas) {
    const grupo = porModulo.get(aula.moduleId);
    if (grupo) grupo.push(aula);
    else soltas.push(aula);
  }

  return {
    grupos: modulos.map((modulo) => ({ modulo, aulas: porModulo.get(modulo.id) ?? [] })),
    soltas,
    total: aulas.length,
  };
});

/**
 * As aulas na ordem em que o aluno as percorre: os grupos já vêm por módulo, e
 * cada grupo por número de aula; as soltas vão no fim.
 *
 * ⚠️ É a ordem do "Continue aqui" da trilha **e** da "próxima aula" da Home.
 * As duas telas têm de apontar para a mesma aula — por isso a ordem mora aqui.
 */
export function aulasEmOrdem(trilha: TrilhaPublicada): ResumoPublicado[] {
  return [...trilha.grupos.flatMap((grupo) => grupo.aulas), ...trilha.soltas];
}
