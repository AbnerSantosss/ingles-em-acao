/**
 * Leitura e regras das aulas no painel — BACKOFFICE §2.3, §6.4, §6.6 e §6.7.
 *
 * ⚠️ MÓDULO DE SERVIDOR (importa o Prisma). Nunca importe de um `'use client'`.
 *
 * Consultas e regras puras. As mutações moram nas Server Actions de
 * `src/app/(admin)/admin/aulas/actions.ts`, com `requireAdmin()` e `auditar()`.
 *
 * ## O que este arquivo **não** carrega
 *
 * `pages` e `draftPages` ficam de fora de toda consulta de lista. São as colunas
 * gordas (309 páginas, 1.538 blocos no total); trazê-las para pintar uma tabela
 * de 42 linhas seria carregar ~300 KB para mostrar títulos. A lista pergunta
 * apenas *quantas* páginas existem, e isso é calculado no detalhe, não na lista.
 */
import { Prisma } from '@prisma/client';
import { z } from 'zod';

import { prisma } from '@/lib/db';

// ───────────────────────────────── tipos ─────────────────────────────────

/** Em que pé está a aula. É derivado de `published` + `archivedAt`, não é coluna. */
export type EstadoDaAula = 'publicada' | 'rascunho' | 'arquivada';

/** Uma linha da lista de aulas. */
export type AulaDaLista = {
  id: string;
  number: number;
  code: string;
  slug: string;
  title: string;
  subtitle: string;
  estimatedTime: string;
  coverUrl: string | null;
  moduleId: number;
  moduloTitulo: string | null;
  estado: EstadoDaAula;
  temRascunho: boolean;
  temVideo: boolean;
  atualizadaEm: Date;
};

/** A aula inteira, como a aba "Dados" precisa dela. */
export type AulaDoPainel = AulaDaLista & {
  publishedAt: Date | null;
  archivedAt: Date | null;
  contentVersion: number;
  /** Quantas páginas o conteúdo publicado tem. `null` quando o JSON não é lista. */
  paginas: number | null;
  /** Quantas páginas o rascunho tem, se houver rascunho. */
  paginasDoRascunho: number | null;
  /** Quantos alunos já têm progresso nesta aula — peso da renumeração (§6.6). */
  alunosComProgresso: number;
  alunosQueConcluiram: number;
};

/** O que a lista aceita filtrar. Tudo opcional: sem filtro, mostra tudo. */
export type FiltrosDeAulas = {
  /** Número, código, título ou slug. */
  busca?: string;
  moduloId?: number;
  estado?: EstadoDaAula | 'todas';
  pagina?: number;
};

export type ListaDeAulas = {
  aulas: AulaDaLista[];
  total: number;
  pagina: number;
  paginas: number;
};

/** Quantas aulas por página. 42 cabem em duas; a paginação existe para quando não couberem. */
export const AULAS_POR_PAGINA = 25;

// ──────────────────────────────── validação ──────────────────────────────

/**
 * O slug de uma aula (§6.7): minúsculas, números e hífen.
 *
 * Mesmo formato que o seed gera a partir do título, para uma aula criada na mão
 * e uma aula semeada não terem regras diferentes.
 */
export const FORMATO_DE_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** "Verb to be — Affirmative" vira "verb-to-be-affirmative". */
export function slugificar(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/['‘’´`]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Os campos da aba "Dados". `number` **não** está aqui — ver §6.6. */
export const esquemaDeDados = z.object({
  title: z
    .string()
    .trim()
    .min(2, 'o título precisa de pelo menos 2 caracteres')
    .max(120, 'o título passou de 120 caracteres'),
  subtitle: z.string().trim().max(200, 'o subtítulo passou de 200 caracteres'),
  estimatedTime: z
    .string()
    .trim()
    .min(1, 'informe o tempo estimado')
    .max(24, 'use algo curto, como "12 min"'),
  moduleId: z
    .number({ error: 'escolha um módulo' })
    .int('módulo inválido')
    .min(1, 'escolha um módulo'),
  slug: z
    .string()
    .trim()
    .min(2, 'o slug precisa de pelo menos 2 caracteres')
    .max(120, 'o slug passou de 120 caracteres')
    .regex(FORMATO_DE_SLUG, 'use apenas minúsculas, números e hífen'),
  /** Caminho da capa. Vazio vira `null` — "sem capa" é ausência, não string vazia. */
  coverUrl: z
    .string()
    .trim()
    .max(300, 'o caminho da capa é longo demais')
    .refine(
      (valor) => valor === '' || valor.startsWith('/') || valor.startsWith('https://'),
      'use um caminho interno (/lessons/capas/07.png) ou uma URL https',
    ),
});

export type DadosDaAula = z.infer<typeof esquemaDeDados>;

/** O número de uma aula: inteiro, de 1 a 999. */
export const esquemaDeNumero = z
  .number({ error: 'informe o número da aula' })
  .int('use um número inteiro')
  .min(1, 'a primeira aula é a 1')
  .max(999, 'número de aula alto demais');

/** Lê um campo numérico do formulário sem deixar vazio virar zero. */
export function numeroDoFormulario(valor: FormDataEntryValue | null): number {
  const texto = typeof valor === 'string' ? valor.trim() : '';
  if (texto === '') return Number.NaN;
  return Number(texto);
}

/**
 * O código exibido da aula — "AULA 07", no formato do `course-data.mjs`.
 *
 * Fica aqui porque renumerar precisa recalcular o código: senão a aula 8 passa a
 * vida se apresentando como "AULA 07" na tela do aluno.
 */
export function codigoDaAula(numero: number): string {
  return `AULA ${String(numero).padStart(2, '0')}`;
}

// ──────────────────────────────── consultas ──────────────────────────────

const CAMPOS_DA_LISTA = {
  id: true,
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
  publishedAt: true,
  contentVersion: true,
  videoUrl: true,
  videoRef: true,
  updatedAt: true,
} as const;

type LinhaDaLista = Prisma.LessonGetPayload<{ select: typeof CAMPOS_DA_LISTA }>;

function estadoDaLinha(linha: { published: boolean; archivedAt: Date | null }): EstadoDaAula {
  if (linha.archivedAt !== null) return 'arquivada';
  return linha.published ? 'publicada' : 'rascunho';
}

/** O `where` do estado. "Arquivada" é a única visão que inclui arquivadas. */
function filtroDeEstado(estado: EstadoDaAula | 'todas'): Prisma.LessonWhereInput {
  switch (estado) {
    case 'publicada':
      return { archivedAt: null, published: true };
    case 'rascunho':
      return { archivedAt: null, published: false };
    case 'arquivada':
      return { archivedAt: { not: null } };
    case 'todas':
    default:
      return {};
  }
}

/**
 * A busca livre: número, código, título ou slug.
 *
 * Um termo que é só dígito vira busca por número **e** continua valendo como
 * texto — "10" precisa achar a aula 10 e também "Numbers 1-100".
 */
function filtroDeBusca(busca: string): Prisma.LessonWhereInput | null {
  const termo = busca.trim();
  if (termo === '') return null;

  const condicoes: Prisma.LessonWhereInput[] = [
    { title: { contains: termo, mode: 'insensitive' } },
    { subtitle: { contains: termo, mode: 'insensitive' } },
    { slug: { contains: termo, mode: 'insensitive' } },
    { code: { contains: termo, mode: 'insensitive' } },
  ];

  if (/^\d{1,3}$/.test(termo)) condicoes.push({ number: Number(termo) });

  return { OR: condicoes };
}

function montarLinha(linha: LinhaDaLista, titulosDeModulo: Map<number, string>): AulaDaLista {
  return {
    id: linha.id,
    number: linha.number,
    code: linha.code,
    slug: linha.slug,
    title: linha.title,
    subtitle: linha.subtitle,
    estimatedTime: linha.estimatedTime,
    coverUrl: linha.coverUrl,
    moduleId: linha.moduleId,
    moduloTitulo: titulosDeModulo.get(linha.moduleId) ?? null,
    estado: estadoDaLinha(linha),
    // O rascunho é contado por uma consulta separada; aqui a lista só diz
    // "existe ou não", e quem responde isso é {@link listarAulas}.
    temRascunho: false,
    temVideo: linha.videoUrl !== null || linha.videoRef !== null,
    atualizadaEm: linha.updatedAt,
  };
}

/**
 * A lista da tela, já filtrada, buscada e paginada — no servidor.
 *
 * ⚠️ Filtrar no cliente pareceria mais simples (são 42 linhas) e seria a decisão
 * errada: a tela também mostra aula arquivada, e trazer tudo para filtrar no
 * navegador colocaria conteúdo despublicado no HTML de qualquer jeito.
 */
export async function listarAulas(filtros: FiltrosDeAulas = {}): Promise<ListaDeAulas> {
  const estado = filtros.estado ?? 'todas';
  const busca = filtroDeBusca(filtros.busca ?? '');
  const pagina = Math.max(1, Math.trunc(filtros.pagina ?? 1));

  const where: Prisma.LessonWhereInput = {
    ...filtroDeEstado(estado),
    ...(filtros.moduloId !== undefined ? { moduleId: filtros.moduloId } : {}),
    ...(busca ?? {}),
  };

  const [total, linhas, modulos, comRascunho] = await Promise.all([
    prisma.lesson.count({ where }),
    prisma.lesson.findMany({
      where,
      orderBy: { number: 'asc' },
      skip: (pagina - 1) * AULAS_POR_PAGINA,
      take: AULAS_POR_PAGINA,
      select: CAMPOS_DA_LISTA,
    }),
    prisma.module.findMany({ select: { id: true, title: true } }),
    // Coluna Json anulável: "tem rascunho" é não ser NULL no banco
    // (`Prisma.DbNull`), e não o JSON `null`, que seria um rascunho vazio.
    prisma.lesson.findMany({
      where: { ...where, draftPages: { not: Prisma.DbNull } },
      select: { id: true },
    }),
  ]);

  const titulos = new Map(modulos.map((modulo) => [modulo.id, modulo.title]));
  const rascunhos = new Set(comRascunho.map((linha) => linha.id));

  return {
    aulas: linhas.map((linha) => ({
      ...montarLinha(linha, titulos),
      temRascunho: rascunhos.has(linha.id),
    })),
    total,
    pagina,
    paginas: Math.max(1, Math.ceil(total / AULAS_POR_PAGINA)),
  };
}

/** Quantos itens tem o array guardado na coluna Json, ou `null` se não for array. */
function contarPaginas(valor: Prisma.JsonValue | null): number | null {
  return Array.isArray(valor) ? valor.length : null;
}

/**
 * Uma aula pelo número, com o contexto que a aba "Dados" mostra.
 *
 * Devolve `null` quando não existe — a tela responde `notFound()`. Aula
 * **arquivada** volta normalmente: o painel precisa poder abrir e restaurar o
 * que foi arquivado (D8); quem some com ela é o app do aluno.
 */
export async function carregarAulaDoPainel(numero: number): Promise<AulaDoPainel | null> {
  const linha = await prisma.lesson.findUnique({
    where: { number: numero },
    select: { ...CAMPOS_DA_LISTA, pages: true, draftPages: true },
  });
  if (!linha) return null;

  const [modulos, progresso, concluidas] = await Promise.all([
    prisma.module.findMany({ select: { id: true, title: true } }),
    prisma.lessonProgress.count({ where: { lessonId: linha.id } }),
    prisma.lessonProgress.count({ where: { lessonId: linha.id, status: 'COMPLETED' } }),
  ]);

  const titulos = new Map(modulos.map((modulo) => [modulo.id, modulo.title]));

  return {
    ...montarLinha(linha, titulos),
    temRascunho: linha.draftPages !== null,
    publishedAt: linha.publishedAt,
    archivedAt: linha.archivedAt,
    contentVersion: linha.contentVersion,
    paginas: contarPaginas(linha.pages),
    paginasDoRascunho: contarPaginas(linha.draftPages),
    alunosComProgresso: progresso,
    alunosQueConcluiram: concluidas,
  };
}

/** O próximo número livre, para a aula nova nascer no fim da fila. */
export async function proximoNumeroDeAula(): Promise<number> {
  const maior = await prisma.lesson.aggregate({ _max: { number: true } });
  return (maior._max.number ?? 0) + 1;
}

/**
 * Um slug livre a partir de uma base — acrescenta `-2`, `-3`… se precisar.
 *
 * `ignorarId` é a própria aula, para renomear a aula sem ela colidir consigo
 * mesma.
 */
export async function slugLivre(base: string, ignorarId?: string): Promise<string> {
  const raiz = slugificar(base) || 'aula';

  for (let tentativa = 1; tentativa <= 50; tentativa += 1) {
    const candidato = tentativa === 1 ? raiz : `${raiz}-${tentativa}`;
    const existente = await prisma.lesson.findUnique({
      where: { slug: candidato },
      select: { id: true },
    });
    if (!existente || existente.id === ignorarId) return candidato;
  }

  // 50 aulas com o mesmo título é problema editorial, não de banco; ainda assim
  // o sufixo aleatório evita que a criação simplesmente falhe.
  return `${raiz}-${Date.now().toString(36)}`;
}

/**
 * O conteúdo mínimo de uma aula recém-criada.
 *
 * ⚠️ Não é enfeite: `PageSchema` exige **pelo menos um bloco** por página e
 * `z.array(PageSchema).min(1)` exige pelo menos uma página, então "aula vazia"
 * é, no esquema, conteúdo inválido. A aula precisa nascer válida para o editor
 * (Fase 3) abrir nela sem tratar um caso especial de "aula sem nada".
 *
 * O bloco escolhido é o `title` — `en` e `pt`, os dois obrigatórios e não vazios
 * (`texto` é `z.string().min(1)`). E a aula nasce **despublicada**, então este
 * conteúdo de partida nunca chega ao aluno sem alguém ter escrito o resto antes.
 */
export function paginaInicial(titulo: string, subtitulo: string): Prisma.InputJsonValue {
  const pt = subtitulo.trim() === '' ? titulo : subtitulo.trim();
  return [{ blocks: [{ t: 'title', en: titulo, pt }] }];
}
