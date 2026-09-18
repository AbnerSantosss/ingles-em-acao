/**
 * Leitura do vídeo das aulas — BACKOFFICE §2.6.
 *
 * ⚠️ MÓDULO DE SERVIDOR (importa o Prisma). Nunca importe de um `'use client'`:
 * o player (`@/components/lesson/PainelDeVideo`) e o parser (`./fonte`) são
 * puros justamente para não arrastarem isto para o bundle do navegador.
 *
 * As mutações moram nas Server Actions de `src/app/(admin)/admin/videos`, com
 * `requireAdmin()` antes e `auditar()` depois. Aqui é só leitura.
 *
 * ## Degradação sem banco
 *
 * Toda função aqui devolve `null` se a consulta falhar, e registra o motivo no
 * log do servidor. A tela da aula continua de pé sem painel de vídeo — que é
 * exatamente o que ela faz quando a aula não tem vídeo configurado. Vídeo não
 * é o conteúdo da aula; não derruba a leitura.
 */
import type { VideoKind } from '@prisma/client';

import { prisma } from '@/lib/db';

import { lerConfiguracaoDoBucket, linkDeLeitura } from './bucket';
import { chaveDeVideoValida, type LinkAssinado } from './envio';
import { fonteDaLinha, type VideoSource } from './fonte';

/** Chave do `AppSetting` com o vídeo padrão das aulas (§2.6, §2.9). */
export const CHAVE_VIDEO_PADRAO = 'video.padrao';

/** Campos de vídeo de uma aula, já normalizados. */
export type VideoDaAula = {
  fonte: VideoSource;
  /** Veio do "aplicar padrão", não de uma escolha aula a aula. */
  padrao: boolean;
  atualizadoEm: Date | null;
};

/** Em que pé está a aula — mesma derivação de `@/lib/admin/aulas`. */
export type EstadoDaAula = 'publicada' | 'rascunho' | 'arquivada';

/** Nome e tamanho de um arquivo enviado — para a lista do painel. */
export type ArquivoEnviado = { nome: string; bytes: number };

/** Uma linha da lista de `/admin/videos`. */
export type LinhaDeVideo = {
  id: string;
  number: number;
  code: string;
  slug: string;
  title: string;
  estado: EstadoDaAula;
  fonte: VideoSource | null;
  /** O `videoRef` cru, para mostrar quando ele não decodifica. */
  refBruta: string | null;
  /** Tem valor gravado, mas ele não passa mais pela allowlist. */
  invalida: boolean;
  /** Recebeu o vídeo padrão. */
  padrao: boolean;
  /** O vídeo veio da coluna legada `videoUrl` (CONTRACT §4). */
  legada: boolean;
  /** Preenchido quando a fonte é um arquivo enviado e o registro dele existe. */
  arquivo: ArquivoEnviado | null;
  atualizadoEm: Date | null;
};

const CAMPOS_DE_VIDEO = {
  id: true,
  number: true,
  code: true,
  slug: true,
  title: true,
  published: true,
  archivedAt: true,
  videoKind: true,
  videoRef: true,
  videoUrl: true,
  videoIsDefault: true,
  videoUpdatedAt: true,
} as const;

/**
 * O vídeo de uma aula, pelo número dela (1–42).
 *
 * `null` quando não há vídeo configurado, quando o que está gravado não passa
 * mais pela allowlist, ou quando o banco não responde. Em todos os casos a
 * tela da aula não mostra painel nenhum — nunca um quadro vazio.
 *
 * ⚠️ Não há fallback implícito para o vídeo padrão: uma aula só tem vídeo se
 * alguém salvou um nela (inclusive via "aplicar padrão", que grava linha a
 * linha). É o que faz os três estados da lista — sem vídeo, padrão,
 * configurado — dizerem a verdade.
 */
export async function carregarVideoDaAula(numero: number): Promise<VideoDaAula | null> {
  if (!Number.isInteger(numero) || numero < 1) return null;

  try {
    const linha = await prisma.lesson.findUnique({
      where: { number: numero },
      select: {
        videoKind: true,
        videoRef: true,
        videoUrl: true,
        videoIsDefault: true,
        videoUpdatedAt: true,
        archivedAt: true,
      },
    });
    if (!linha || linha.archivedAt !== null) return null;

    const fonte = fonteDaLinha(linha.videoKind, linha.videoRef, linha.videoUrl);
    if (!fonte) return null;

    return { fonte, padrao: linha.videoIsDefault, atualizadoEm: linha.videoUpdatedAt };
  } catch (erro) {
    console.error('[video] aula sem banco: a tela segue sem painel de vídeo.', erro);
    return null;
  }
}

/**
 * As 42 aulas com o estado do vídeo, em ordem.
 *
 * `null` quando o banco não responde — a tela do painel mostra o aviso em vez
 * de quebrar.
 */
export async function listarVideosDasAulas(): Promise<LinhaDeVideo[] | null> {
  try {
    const linhas = await prisma.lesson.findMany({
      where: { archivedAt: null },
      select: CAMPOS_DE_VIDEO,
      orderBy: { number: 'asc' },
    });

    const arquivos = await arquivosEnviados(
      linhas.flatMap((linha) => {
        const fonte = fonteDaLinha(linha.videoKind, linha.videoRef, linha.videoUrl);
        return fonte?.kind === 'upload' ? [fonte.assetId] : [];
      }),
    );

    return linhas.map((linha) => {
      const fonte = fonteDaLinha(linha.videoKind, linha.videoRef, linha.videoUrl);
      const temAlgoGravado = linha.videoRef !== null || linha.videoUrl !== null;
      const legada = fonte !== null && linha.videoRef === null && linha.videoUrl !== null;

      return {
        id: linha.id,
        number: linha.number,
        code: linha.code,
        slug: linha.slug,
        title: linha.title,
        estado: estadoDaAula(linha.published, linha.archivedAt),
        fonte,
        refBruta: linha.videoRef ?? linha.videoUrl,
        invalida: temAlgoGravado && fonte === null,
        padrao: linha.videoIsDefault,
        legada,
        arquivo: fonte?.kind === 'upload' ? (arquivos.get(fonte.assetId) ?? null) : null,
        atualizadoEm: linha.videoUpdatedAt,
      } satisfies LinhaDeVideo;
    });
  } catch (erro) {
    console.error('[video] painel sem banco: lista de vídeos indisponível.', erro);
    return null;
  }
}

function estadoDaAula(published: boolean, archivedAt: Date | null): EstadoDaAula {
  if (archivedAt !== null) return 'arquivada';
  return published ? 'publicada' : 'rascunho';
}

/**
 * O vídeo padrão guardado em `AppSetting["video.padrao"]`.
 *
 * O valor é `{ kind, ref }` — as mesmas duas colunas da aula —, e ele volta
 * pela mesma revalidação de `fonteDaLinha`. Lixo no JSON vira `null`, não vira
 * iframe.
 */
export async function lerVideoPadrao(): Promise<VideoSource | null> {
  try {
    const linha = await prisma.appSetting.findUnique({ where: { key: CHAVE_VIDEO_PADRAO } });
    return interpretarPadrao(linha?.value);
  } catch (erro) {
    console.error('[video] padrão sem banco: seguindo sem vídeo padrão.', erro);
    return null;
  }
}

/** Forma gravada em `AppSetting.value`. Exportada para a Server Action gravar igual. */
export type PadraoGravado = { kind: VideoKind; ref: string };

/** Lê o JSON do `AppSetting` com desconfiança: qualquer coisa fora do formato vira `null`. */
export function interpretarPadrao(valor: unknown): VideoSource | null {
  if (typeof valor !== 'object' || valor === null || Array.isArray(valor)) return null;
  const objeto = valor as Record<string, unknown>;
  const kind = objeto.kind;
  const ref = objeto.ref;
  if (typeof kind !== 'string' || typeof ref !== 'string') return null;
  return fonteDaLinha(kind, ref);
}

/** Nome e tamanho dos arquivos enviados, por id do `MediaAsset`. */
export async function arquivosEnviados(ids: readonly string[]): Promise<Map<string, ArquivoEnviado>> {
  const unicos = [...new Set(ids)];
  if (unicos.length === 0) return new Map();
  const assets = await prisma.mediaAsset.findMany({
    where: { id: { in: unicos }, kind: 'VIDEO' },
    select: { id: true, filename: true, bytes: true },
  });
  return new Map(assets.map((asset) => [asset.id, { nome: asset.filename, bytes: asset.bytes }]));
}

// ─────────────────────────── vídeo enviado (bucket) ──────────────────────────

/**
 * O link de reprodução de 15 minutos de um vídeo enviado (§4.3).
 *
 * `null` quando o bucket não está configurado, o asset não existe, não é vídeo
 * ou foi arquivado — e a tela do aluno segue sem painel, como numa aula sem
 * vídeo. **Quem chama confere o plano antes**: o link não pode ir para o HTML
 * de quem não tem direito à videoaula.
 */
export async function assinarVideoEnviado(assetId: string): Promise<LinkAssinado | null> {
  const leitura = lerConfiguracaoDoBucket();
  if (!leitura.ok) {
    console.error(`[video] aula com vídeo enviado, mas o bucket não está pronto: ${leitura.problema}`);
    return null;
  }

  try {
    const asset = await prisma.mediaAsset.findUnique({
      where: { id: assetId },
      select: { kind: true, path: true, archivedAt: true },
    });
    if (!asset || asset.kind !== 'VIDEO' || asset.archivedAt !== null) return null;
    if (!chaveDeVideoValida(asset.path)) return null;

    return linkDeLeitura(leitura.configuracao, asset.path);
  } catch (erro) {
    console.error('[video] não consegui assinar o link do vídeo enviado.', erro);
    return null;
  }
}

/**
 * Link novo para o player do aluno, quando o de 15 minutos venceu.
 *
 * Refaz as conferências da tela da aula — publicada, não arquivada, vídeo do
 * tipo enviado — porque a action de renovação é um POST que qualquer um pode
 * disparar com qualquer número. O plano é conferido por quem chama.
 */
export async function linkRenovadoDaAula(numero: number): Promise<LinkAssinado | null> {
  if (!Number.isInteger(numero) || numero < 1) return null;

  try {
    const linha = await prisma.lesson.findUnique({
      where: { number: numero },
      select: { published: true, archivedAt: true, videoKind: true, videoRef: true },
    });
    if (!linha || !linha.published || linha.archivedAt !== null) return null;

    const fonte = fonteDaLinha(linha.videoKind, linha.videoRef);
    if (!fonte || fonte.kind !== 'upload') return null;

    return await assinarVideoEnviado(fonte.assetId);
  } catch (erro) {
    console.error('[video] não consegui renovar o link do vídeo da aula.', erro);
    return null;
  }
}
