/**
 * Leitura da biblioteca de mídia e manutenção do índice de uso — BACKOFFICE §4 e §2.8.
 *
 * ⚠️ MÓDULO DE SERVIDOR (Prisma). Nunca importe de um `'use client'`.
 *
 * ## `MediaUsage` é o que torna "não arquivar asset em uso" respondível
 *
 * Sem o índice, a pergunta "esta imagem aparece em algum lugar?" seria uma
 * varredura do JSON das 42 aulas a cada clique — e ninguém varre 309 páginas
 * para desabilitar um botão, então na prática o botão ficaria habilitado e a
 * Aula 06 viraria um quadrado cinza em produção sem ninguém perceber. Com o
 * índice, é uma consulta por chave estrangeira.
 *
 * O índice é **derivado**: {@link sincronizarUsosDaAula} apaga e reescreve as
 * linhas de uma aula inteira a cada publicação. Não existe atualização parcial,
 * e é de propósito — um índice derivado que só recebe deltas diverge do
 * conteúdo, e um índice de uso divergente é pior que nenhum: ele autoriza
 * arquivar o que está em uso.
 */
import type { Prisma } from '@prisma/client';

import { prisma } from '@/lib/db';

import {
  caminhoDaUrl,
  urlDoCaminho,
  type MidiaDaBiblioteca,
  type TipoDeMidia,
  type UsoDaMidia,
} from './tipos';

// ─────────────────────────────── formatação ──────────────────────────────────

const FORMATO_DE_DATA = new Intl.DateTimeFormat('pt-BR', {
  dateStyle: 'short',
  timeStyle: 'short',
  timeZone: 'America/Sao_Paulo',
});

/** "Aula 06", ou o aviso de que a aula sumiu. */
function nomeDaAula(numero: number | null): string {
  if (numero === null) return 'Aula removida';
  return `Aula ${String(numero).padStart(2, '0')}`;
}

/**
 * O `contexto` cru vira frase.
 *
 * Formato gravado (§5): `capa` ou `pagina:3:bloco:a6p2`. Qualquer outro texto é
 * mostrado como veio — melhor um contexto estranho na tela do que uma exceção
 * numa página de listagem.
 */
export function descreverContexto(contexto: string, numeroDaAula: number | null): string {
  const aula = nomeDaAula(numeroDaAula);

  if (contexto === 'capa') return `Capa da ${aula}`;

  const partes = contexto.split(':');
  if (partes[0] === 'pagina' && partes.length >= 2) {
    const pagina = `${aula} · página ${partes[1]}`;
    if (partes[2] === 'bloco' && partes[3]) return `${pagina} · bloco ${partes[3]}`;
    return pagina;
  }

  return `${aula} · ${contexto}`;
}

// ─────────────────────────── montagem dos itens ──────────────────────────────

type AssetComUsos = Prisma.MediaAssetGetPayload<{ include: { usos: true } }>;

/**
 * Número e título das aulas citadas pelos usos.
 *
 * `MediaUsage.lessonId` é uma coluna solta — **não há relação com `Lesson` no
 * schema** (ver `prisma/schema.prisma`), então o `include` do Prisma não
 * resolve isso. A busca é feita aqui, de uma vez para a lista inteira, em vez de
 * uma consulta por card.
 */
async function numerosDasAulas(assets: AssetComUsos[]): Promise<Map<string, number>> {
  const ids = new Set<string>();
  for (const asset of assets) {
    for (const uso of asset.usos) ids.add(uso.lessonId);
  }

  if (ids.size === 0) return new Map();

  const aulas = await prisma.lesson.findMany({
    where: { id: { in: [...ids] } },
    select: { id: true, number: true },
  });

  return new Map(aulas.map((aula) => [aula.id, aula.number]));
}

function montarItem(asset: AssetComUsos, numeros: Map<string, number>): MidiaDaBiblioteca {
  const usos: UsoDaMidia[] = asset.usos
    .map((uso) => {
      const numero = numeros.get(uso.lessonId) ?? null;
      return {
        lessonId: uso.lessonId,
        contexto: uso.contexto,
        descricao: descreverContexto(uso.contexto, numero),
        numeroDaAula: numero,
      };
    })
    .sort((a, b) => (a.numeroDaAula ?? 999) - (b.numeroDaAula ?? 999));

  return {
    id: asset.id,
    kind: asset.kind as TipoDeMidia,
    src: urlDoCaminho(asset.path),
    path: asset.path,
    filename: asset.filename,
    mime: asset.mime,
    bytes: asset.bytes,
    width: asset.width,
    height: asset.height,
    alt: asset.alt,
    criadoEm: FORMATO_DE_DATA.format(asset.createdAt),
    arquivadoEm: asset.archivedAt ? FORMATO_DE_DATA.format(asset.archivedAt) : null,
    usos,
  };
}

async function montarLista(assets: AssetComUsos[]): Promise<MidiaDaBiblioteca[]> {
  const numeros = await numerosDasAulas(assets);
  return assets.map((asset) => montarItem(asset, numeros));
}

// ──────────────────────────────── filtros ────────────────────────────────────

export type FiltroDeTipo = 'todos' | 'IMAGE' | 'VIDEO';
export type FiltroDeAlt = 'todos' | 'faltando';
export type FiltroDeUso = 'todos' | 'sem' | 'com';
export type FiltroDeArquivo = 'ativos' | 'arquivados';

export type FiltrosDaBiblioteca = {
  tipo: FiltroDeTipo;
  alt: FiltroDeAlt;
  uso: FiltroDeUso;
  arquivo: FiltroDeArquivo;
  /** Busca no nome do arquivo e no texto alternativo. */
  q: string;
};

export const FILTROS_PADRAO: FiltrosDaBiblioteca = {
  tipo: 'todos',
  alt: 'todos',
  uso: 'todos',
  arquivo: 'ativos',
  q: '',
};

/** Teto de itens por leitura. A biblioteca do projeto cabe em ~150 arquivos. */
const LIMITE_DA_LISTA = 240;

/**
 * ⚠️ A biblioteca é **só de imagem**. Vídeo enviado mora no bucket, não no
 * volume, e tem tela própria (`/admin/videos`): listado aqui, ele ganharia uma
 * miniatura que não abre e um "arquivar" que tiraria a videoaula do ar sem
 * passar pela tela de vídeos (a guarda de uso não o enxerga — vídeo não entra
 * em `MediaUsage`).
 */
const SO_IMAGEM = { kind: 'IMAGE' } as const;

function onde(filtros: FiltrosDaBiblioteca): Prisma.MediaAssetWhereInput {
  const where: Prisma.MediaAssetWhereInput = {
    ...SO_IMAGEM,
    archivedAt: filtros.arquivo === 'arquivados' ? { not: null } : null,
  };

  if (filtros.alt === 'faltando') where.OR = [{ alt: null }, { alt: '' }];
  if (filtros.uso === 'sem') where.usos = { none: {} };
  if (filtros.uso === 'com') where.usos = { some: {} };

  const busca = filtros.q.trim();
  if (busca.length > 0) {
    where.AND = [
      {
        OR: [
          { filename: { contains: busca, mode: 'insensitive' } },
          { alt: { contains: busca, mode: 'insensitive' } },
        ],
      },
    ];
  }

  return where;
}

export type ResumoDaBiblioteca = {
  total: number;
  semAlt: number;
  semUso: number;
  arquivados: number;
  /** Soma de bytes dos assets ativos. */
  bytes: number;
};

export type BibliotecaDeMidia = {
  itens: MidiaDaBiblioteca[];
  resumo: ResumoDaBiblioteca;
  /** `true` quando a lista foi cortada em {@link LIMITE_DA_LISTA}. */
  truncada: boolean;
};

/** A biblioteca como a tela `/admin/midia` precisa dela. */
export async function listarBiblioteca(
  filtros: FiltrosDaBiblioteca,
): Promise<BibliotecaDeMidia> {
  const [assets, total, semAlt, semUso, arquivados, soma] = await Promise.all([
    prisma.mediaAsset.findMany({
      where: onde(filtros),
      include: { usos: true },
      orderBy: { createdAt: 'desc' },
      take: LIMITE_DA_LISTA,
    }),
    prisma.mediaAsset.count({ where: { ...SO_IMAGEM, archivedAt: null } }),
    prisma.mediaAsset.count({
      where: { ...SO_IMAGEM, archivedAt: null, OR: [{ alt: null }, { alt: '' }] },
    }),
    prisma.mediaAsset.count({ where: { ...SO_IMAGEM, archivedAt: null, usos: { none: {} } } }),
    prisma.mediaAsset.count({ where: { ...SO_IMAGEM, archivedAt: { not: null } } }),
    prisma.mediaAsset.aggregate({
      where: { ...SO_IMAGEM, archivedAt: null },
      _sum: { bytes: true },
    }),
  ]);

  return {
    itens: await montarLista(assets),
    resumo: {
      total,
      semAlt,
      semUso,
      arquivados,
      bytes: soma._sum.bytes ?? 0,
    },
    truncada: assets.length === LIMITE_DA_LISTA,
  };
}

/** Um asset com seus usos, para as actions que precisam decidir sobre ele. */
export async function carregarMidia(id: string): Promise<MidiaDaBiblioteca | null> {
  const asset = await prisma.mediaAsset.findUnique({ where: { id }, include: { usos: true } });
  if (!asset || asset.kind !== SO_IMAGEM.kind) return null;

  const numeros = await numerosDasAulas([asset]);
  return montarItem(asset, numeros);
}

/**
 * O acervo do seletor de imagem: só imagem, só o que não está arquivado.
 *
 * Vídeo fica de fora porque o seletor existe para os campos `image`, `profile`,
 * `cards[]` e `steps[]` — e vídeo tem tela própria, `/admin/videos` (§4.3).
 */
export async function listarAcervoDeImagens(busca = ''): Promise<MidiaDaBiblioteca[]> {
  const termo = busca.trim();

  const assets = await prisma.mediaAsset.findMany({
    where: {
      kind: 'IMAGE',
      archivedAt: null,
      ...(termo.length > 0
        ? {
            OR: [
              { filename: { contains: termo, mode: 'insensitive' as const } },
              { alt: { contains: termo, mode: 'insensitive' as const } },
            ],
          }
        : {}),
    },
    include: { usos: true },
    orderBy: { createdAt: 'desc' },
    take: LIMITE_DA_LISTA,
  });

  return montarLista(assets);
}

// ───────────────────────── índice de uso (escrita) ───────────────────────────

/** Uma ocorrência encontrada no conteúdo, antes de virar linha no banco. */
type OcorrenciaDeMidia = { src: string; contexto: string };

function ehObjeto(valor: unknown): valor is Record<string, unknown> {
  return typeof valor === 'object' && valor !== null && !Array.isArray(valor);
}

/**
 * Procura `src` dentro de um bloco, inclusive nos itens de `cards[]` e `steps[]`.
 *
 * A varredura é genérica de propósito: a forma exata dos 27 tipos de bloco é do
 * agente do motor de aulas e vai continuar mudando. O que não muda é o nome do
 * campo — `src` é o que a §4.1 fixou para todos eles.
 */
function coletarSrc(valor: unknown, saida: string[], nivel = 0): void {
  if (nivel > 6) return;

  if (Array.isArray(valor)) {
    for (const item of valor) coletarSrc(item, saida, nivel + 1);
    return;
  }

  if (!ehObjeto(valor)) return;

  const src = valor.src;
  if (typeof src === 'string' && src.trim().length > 0) saida.push(src);

  for (const [chave, item] of Object.entries(valor)) {
    if (chave === 'src') continue;
    coletarSrc(item, saida, nivel + 1);
  }
}

/**
 * Todas as ocorrências de mídia de uma aula: a capa e o que estiver nos blocos.
 *
 * `pages` chega como `unknown` porque é coluna `Json`: o que vem do banco não
 * tem garantia de forma, e uma lista de uso não é lugar para derrubar a
 * publicação por causa de um bloco estranho.
 */
export function extrairOcorrencias(entrada: {
  capa?: string | null;
  pages: unknown;
}): OcorrenciaDeMidia[] {
  const ocorrencias: OcorrenciaDeMidia[] = [];

  if (typeof entrada.capa === 'string' && entrada.capa.trim().length > 0) {
    ocorrencias.push({ src: entrada.capa, contexto: 'capa' });
  }

  if (!Array.isArray(entrada.pages)) return ocorrencias;

  entrada.pages.forEach((pagina, indiceDaPagina) => {
    const numeroDaPagina = indiceDaPagina + 1;
    const blocos = ehObjeto(pagina) && Array.isArray(pagina.blocks) ? pagina.blocks : [];

    blocos.forEach((bloco, indiceDoBloco) => {
      const encontrados: string[] = [];
      coletarSrc(bloco, encontrados);
      if (encontrados.length === 0) return;

      const id =
        ehObjeto(bloco) && typeof bloco.id === 'string' && bloco.id.length > 0
          ? bloco.id
          : `b${indiceDoBloco + 1}`;

      for (const src of encontrados) {
        ocorrencias.push({ src, contexto: `pagina:${numeroDaPagina}:bloco:${id}` });
      }
    });
  });

  return ocorrencias;
}

export type SincronizacaoDeUsos = {
  /** Linhas gravadas em `MediaUsage`. */
  registrados: number;
  /**
   * Ocorrências ignoradas: `src` que não aponta para a biblioteca (arte legada
   * em `/lessons/art/…`, link externo) ou cujo caminho não existe no banco.
   */
  ignorados: number;
};

/**
 * Reescreve o índice de uso de **uma aula inteira**.
 *
 * Chame isto na publicação da aula (é a §4: "reescrito por inteiro a cada
 * publicação"). Apagar tudo e recriar é o que garante que uma imagem retirada da
 * página 3 deixe de constar como em uso — e volte a ser arquivável.
 *
 * @example
 * await sincronizarUsosDaAula({ lessonId: aula.id, capa: aula.coverUrl, pages: aula.pages })
 */
export async function sincronizarUsosDaAula(entrada: {
  lessonId: string;
  capa?: string | null;
  pages: unknown;
}): Promise<SincronizacaoDeUsos> {
  const ocorrencias = extrairOcorrencias(entrada);

  // `src` → caminho de armazenamento. O que não é desta biblioteca sai aqui.
  const porCaminho = new Map<string, OcorrenciaDeMidia[]>();
  let ignorados = 0;

  for (const ocorrencia of ocorrencias) {
    const caminho = caminhoDaUrl(ocorrencia.src);
    if (!caminho) {
      ignorados++;
      continue;
    }
    const lista = porCaminho.get(caminho) ?? [];
    lista.push(ocorrencia);
    porCaminho.set(caminho, lista);
  }

  const assets =
    porCaminho.size > 0
      ? await prisma.mediaAsset.findMany({
          where: { path: { in: [...porCaminho.keys()] } },
          select: { id: true, path: true },
        })
      : [];

  const idPorCaminho = new Map(assets.map((asset) => [asset.path, asset.id]));

  const linhas: Prisma.MediaUsageCreateManyInput[] = [];
  for (const [caminho, lista] of porCaminho) {
    const assetId = idPorCaminho.get(caminho);
    if (!assetId) {
      // Caminho que parece da biblioteca mas não tem registro: conteúdo antigo
      // ou asset apagado à mão no banco. Não inventamos linha para ele.
      ignorados += lista.length;
      continue;
    }
    for (const ocorrencia of lista) {
      linhas.push({ assetId, lessonId: entrada.lessonId, contexto: ocorrencia.contexto });
    }
  }

  await prisma.$transaction([
    prisma.mediaUsage.deleteMany({ where: { lessonId: entrada.lessonId } }),
    ...(linhas.length > 0
      ? [prisma.mediaUsage.createMany({ data: linhas, skipDuplicates: true })]
      : []),
  ]);

  return { registrados: linhas.length, ignorados };
}
