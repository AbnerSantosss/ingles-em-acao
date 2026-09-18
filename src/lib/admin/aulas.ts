/**
 * Leitura e regras das aulas no painel — BACKOFFICE §2.3, §6.4, §6.6 e §6.7.
 *
 * ⚠️ MÓDULO DE SERVIDOR (importa o Prisma). Nunca importe de um `'use client'`.
 *
 * Consultas e regras puras. As mutações moram nas Server Actions de
 * `src/app/(admin)/admin/aulas/actions.ts`, com `requireAdmin()` e `auditar()`.
 * A exceção é {@link duplicarAula}: o núcleo mora aqui para ser testável contra
 * o banco, recebe o admin já autenticado e grava a própria auditoria — a action
 * continua sendo quem chama `requireAdmin()`.
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

import { auditar } from '@/lib/admin/audit';
import { regenerarIdsInterativos } from '@/lib/admin/editor';
import { carregarContextoDoCurso } from '@/lib/admin/publicacao';
import type { SessionUser } from '@/lib/auth/session';
import { validarPaginas, type Page } from '@/lib/content/blocks';
import { prisma } from '@/lib/db';
import { sincronizarUsosDaAula } from '@/lib/media/consultas';

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

// ──────────────────────────────── duplicar ───────────────────────────────

const SUFIXO_DA_COPIA = ' (cópia)';
const TITULO_MAXIMO = 120;

/** "Verb To Be" vira "Verb To Be (cópia)", sem passar do limite do título. */
export function tituloDaCopia(titulo: string): string {
  const espaco = TITULO_MAXIMO - SUFIXO_DA_COPIA.length;
  return `${titulo.trim().slice(0, espaco).trimEnd()}${SUFIXO_DA_COPIA}`;
}

const SUFIXO_DO_SLUG_DA_COPIA = '-copia';
/** O limite do slug em {@link esquemaDeDados}. */
const SLUG_MAXIMO = 120;
/** O que {@link slugLivre} pode acrescentar: `-50` ou `-<Date.now() em base 36>`. */
const FOLGA_DO_SLUG_LIVRE = 10;

/**
 * A base do slug da cópia: `<slug>-copia`, cortada para caber no limite.
 *
 * ⚠️ Sem o corte, a cópia de um slug longo (ou a cópia da cópia da cópia…)
 * nasceria com um slug que a própria aba Dados recusa ("o slug passou de 120
 * caracteres") — e o admin só descobriria ao salvar outra coisa.
 */
export function baseDoSlugDaCopia(slug: string): string {
  const espaco = SLUG_MAXIMO - SUFIXO_DO_SLUG_DA_COPIA.length - FOLGA_DO_SLUG_LIVRE;
  return `${slug.slice(0, espaco)}${SUFIXO_DO_SLUG_DA_COPIA}`;
}

/**
 * Todo id de bloco `a{numero}…` que aparece numa chave de resposta gravada.
 *
 * Não deveria haver nenhum para um número que ainda não tem aula — respostas
 * morrem junto com a aula (cascade). Mas uma chave órfã com o id que a cópia
 * está para ganhar faria a cópia **herdar** a resposta de alguém; conferir custa
 * uma consulta.
 */
async function idsEmRespostasGravadas(numero: number): Promise<string[]> {
  const respostas = await prisma.exerciseAnswer.findMany({
    where: { answerKey: { contains: `:a${numero}` } },
    select: { answerKey: true },
    distinct: ['answerKey'],
  });
  const formato = new RegExp(`^a${numero}[a-z]+\\d+[a-z]*$`);
  const ids = new Set<string>();
  for (const { answerKey } of respostas) {
    for (const parte of answerKey.split(':')) if (formato.test(parte)) ids.add(parte);
  }
  return [...ids];
}

function ehConflitoDeUnicidade(erro: unknown): boolean {
  return erro instanceof Prisma.PrismaClientKnownRequestError && erro.code === 'P2002';
}

export type ResultadoDaDuplicacao =
  | {
      ok: true;
      origem: { id: string; number: number; title: string };
      copia: { id: string; number: number; code: string; slug: string; title: string };
      /** De-para "id original → id novo" de todo bloco interativo. */
      idsNovos: Record<string, string>;
      temRascunho: boolean;
      /** `null` quando o índice de uso de mídia não pôde ser gravado. */
      midias: { registrados: number; ignorados: number } | null;
    }
  | { ok: false; motivo: string };

/**
 * Duplica uma aula como **rascunho despublicado**, no fim da fila.
 *
 * O que a cópia leva:
 * - `pages` e `draftPages` (se houver), com **todo** bloco interativo (`mc`,
 *   `fill`, `match`, `dnd`, `check`, `free`) com id novo — as chaves de resposta
 *   `fill:`/`free:`/`match:`/`dnd:`/`chk:` dependem só do id do bloco, e uma
 *   cópia com o id do original passaria a dividir a resposta do aluno (§6.2).
 *   O mesmo bloco ganha o mesmo id novo nos dois conteúdos;
 * - título + " (cópia)", subtítulo, tempo estimado e módulo;
 * - número = próximo livre, `code` recalculado, slug livre `<slug>-copia`.
 *
 * O que a cópia **não** leva (decisão):
 * - **capa**: a arte da capa traz o número da aula de origem ("AULA 01") — na
 *   cópia seria informação errada. A cópia nasce "sem capa";
 * - **vídeo**: a videoaula foi gravada para a aula de origem. A cópia nasce
 *   "sem vídeo"; o vídeo próprio (ou o padrão) é aplicado pela aba Vídeo ou em
 *   /admin/videos;
 * - progresso, respostas, versões e publicação: nada disso é conteúdo.
 *
 * Imagem e perfil mantêm o id (é o nome da arte legada). Blocos `badge`/`next`
 * que citam o número da origem continuam citando — o editor é quem ajusta.
 * Aula arquivada também pode ser duplicada: a cópia nasce rascunho, não arquivada.
 *
 * `numero` força o número da cópia (os testes usam, para ficar na sua faixa);
 * sem ele vale {@link proximoNumeroDeAula}, com nova tentativa se outra aula
 * pegar o número ou o slug no meio do caminho.
 */
export async function duplicarAula(entrada: {
  ator: SessionUser;
  origemId: string;
  numero?: number;
}): Promise<ResultadoDaDuplicacao> {
  const origem = await prisma.lesson.findUnique({ where: { id: entrada.origemId } });
  if (!origem) return { ok: false, motivo: 'A aula de origem não existe mais.' };

  const negar = async (motivo: string): Promise<ResultadoDaDuplicacao> => {
    await auditar({
      actor: entrada.ator,
      action: 'lesson.duplicate',
      resource: `Lesson:${origem.number}`,
      outcome: 'DENY',
      reason: motivo,
    });
    return { ok: false, motivo };
  };

  // Só se duplica conteúdo que se sabe ler: trocar ids num JSON torto poderia
  // deixar um exercício com o id do original escondido num canto.
  const publicadas = validarPaginas(origem.pages);
  if (!publicadas.ok) {
    return negar(
      `O conteúdo publicado da aula ${origem.number} não passa no esquema; corrija antes de duplicar.`,
    );
  }
  let rascunho: Page[] | null = null;
  if (origem.draftPages !== null) {
    const lido = validarPaginas(origem.draftPages);
    if (!lido.ok) {
      return negar(
        `O rascunho da aula ${origem.number} não passa no esquema; corrija ou descarte antes de duplicar.`,
      );
    }
    rascunho = lido.pages;
  }

  const TENTATIVAS = entrada.numero === undefined ? 3 : 1;

  for (let tentativa = 1; tentativa <= TENTATIVAS; tentativa += 1) {
    const numero = entrada.numero ?? (await proximoNumeroDeAula());
    if (!esquemaDeNumero.safeParse(numero).success) {
      return {
        ok: false,
        motivo:
          entrada.numero === undefined
            ? 'Não há número livre para a cópia (o limite é a aula 999).'
            : 'Número de aula inválido para a cópia.',
      };
    }

    const [contexto, orfaos, slug] = await Promise.all([
      carregarContextoDoCurso(origem.id),
      idsEmRespostasGravadas(numero),
      slugLivre(baseDoSlugDaCopia(origem.slug)),
    ]);
    const usados = new Set([...contexto.idsUsados, ...orfaos]);
    const mapa = new Map<string, string>();
    const paginas = regenerarIdsInterativos(publicadas.pages, numero, usados, mapa);
    const paginasDoRascunho = rascunho
      ? regenerarIdsInterativos(rascunho, numero, usados, mapa)
      : null;

    let copia;
    try {
      copia = await prisma.lesson.create({
        data: {
          number: numero,
          code: codigoDaAula(numero),
          slug,
          title: tituloDaCopia(origem.title),
          subtitle: origem.subtitle,
          estimatedTime: origem.estimatedTime,
          moduleId: origem.moduleId,
          coverUrl: null,
          pages: paginas as unknown as Prisma.InputJsonValue,
          draftPages: paginasDoRascunho
            ? (paginasDoRascunho as unknown as Prisma.InputJsonValue)
            : Prisma.DbNull,
          published: false,
          publishedAt: null,
          updatedById: entrada.ator.id,
        },
        select: { id: true, number: true, code: true, slug: true, title: true, moduleId: true },
      });
    } catch (erro: unknown) {
      if (ehConflitoDeUnicidade(erro)) {
        if (entrada.numero !== undefined) {
          return {
            ok: false,
            motivo: `O número ${numero} (ou o endereço ${slug}) já é de outra aula.`,
          };
        }
        if (tentativa < TENTATIVAS) continue;
        return {
          ok: false,
          motivo: 'Outra aula foi criada ao mesmo tempo e ocupou o número. Tente de novo.',
        };
      }
      throw erro;
    }

    // A cópia usa as mesmas imagens da biblioteca: sem o índice, uma imagem
    // usada só por ela apareceria "sem uso" em /admin/midia e poderia ser
    // arquivada. Falhar aqui não desfaz a cópia (mesma regra da publicação).
    let midias: { registrados: number; ignorados: number } | null = null;
    try {
      midias = await sincronizarUsosDaAula({ lessonId: copia.id, capa: null, pages: paginas });
    } catch (erro: unknown) {
      const motivo = erro instanceof Error ? erro.message : 'erro desconhecido';
      console.error(`[painel] MediaUsage da cópia não sincronizado: ${motivo}`);
    }

    const idsNovos = Object.fromEntries(mapa);
    const dadosDaOrigem = {
      id: origem.id,
      number: origem.number,
      slug: origem.slug,
      title: origem.title,
      published: origem.published,
      contentVersion: origem.contentVersion,
    };

    await auditar({
      actor: entrada.ator,
      action: 'lesson.duplicate',
      resource: `Lesson:${copia.number}`,
      before: { origem: dadosDaOrigem },
      after: {
        number: copia.number,
        code: copia.code,
        slug: copia.slug,
        title: copia.title,
        moduleId: copia.moduleId,
        published: false,
        coverUrl: null,
        video: null,
        temRascunho: paginasDoRascunho !== null,
        origem: origem.number,
        idsNovos,
      },
    });

    return {
      ok: true,
      origem: { id: origem.id, number: origem.number, title: origem.title },
      copia: {
        id: copia.id,
        number: copia.number,
        code: copia.code,
        slug: copia.slug,
        title: copia.title,
      },
      idsNovos,
      temRascunho: paginasDoRascunho !== null,
      midias,
    };
  }

  return { ok: false, motivo: 'Não foi possível reservar um número para a cópia. Tente de novo.' };
}
