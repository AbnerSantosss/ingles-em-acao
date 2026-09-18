/**
 * Tipos e constantes da biblioteca de mídia — BACKOFFICE §4.
 *
 * ⚠️ **Este arquivo é o único da pasta `media/` que pode ser importado do
 * cliente.** Nada aqui toca `node:fs`, Prisma ou `process.env`: é só tipo,
 * constante e formatação. `armazenamento.ts`, `validacao.ts` e `consultas.ts`
 * são módulos de servidor — importá-los de um componente `'use client'`
 * quebraria o bundle do navegador.
 *
 * O contrato mais importante daqui é {@link MidiaSelecionada}: `{ src, alt }` é
 * exatamente o par que os blocos `image`, `profile`, `cards[]` e `steps[]`
 * aceitam (ver `src/lib/content/types.ts`). O seletor de mídia devolve isso, e
 * o editor de blocos grava isso no JSON da página — sem tradução no meio.
 */

// ───────────────────────────── limites e formatos ────────────────────────────

/** Teto de uma imagem, em bytes (BACKOFFICE §4.3: 5 MB). */
export const TAMANHO_MAXIMO_IMAGEM = 5 * 1024 * 1024;

/**
 * Os três formatos aceitos.
 *
 * ⚠️ **SVG está fora de propósito.** SVG é XML com `<script>` e `<foreignObject>`
 * dentro: servido com `Content-Type: image/svg+xml` na mesma origem do app, vira
 * XSS com acesso ao cookie de sessão. Não há "sanitizar depois" barato aqui — a
 * decisão é não aceitar.
 */
export const FORMATOS_DE_IMAGEM = [
  { mime: 'image/png', ext: 'png', rotulo: 'PNG' },
  { mime: 'image/jpeg', ext: 'jpg', rotulo: 'JPEG' },
  { mime: 'image/webp', ext: 'webp', rotulo: 'WebP' },
] as const;

export type MimeDeImagem = (typeof FORMATOS_DE_IMAGEM)[number]['mime'];
export type ExtensaoDeImagem = (typeof FORMATOS_DE_IMAGEM)[number]['ext'];

/** "PNG, JPEG ou WebP" — usado em mensagem de erro e em texto de ajuda. */
export const FORMATOS_EM_TEXTO = 'PNG, JPEG ou WebP';

/** Tamanho máximo do `alt`. Texto alternativo é frase curta, não legenda longa. */
export const TAMANHO_MAXIMO_ALT = 300;

/** Mínimo do `alt`. Abaixo disso não descreve nada ("foto", "img"). */
export const TAMANHO_MINIMO_ALT = 3;

/** Tamanho máximo do nome exibido (o nome original do arquivo). */
export const TAMANHO_MAXIMO_NOME = 120;

// ───────────────────────────────── URLs ──────────────────────────────────────

/**
 * Prefixo público da mídia.
 *
 * ⚠️ O último segmento da URL **sempre** tem ponto (`<uuid>.png`), e isso não é
 * cosmético: o `matcher` do `src/proxy.ts` exclui caminhos com ponto no último
 * segmento, então a imagem é servida sem passar pela peneira de sessão — que é o
 * que o `Cache-Control: immutable` da §4.3 pressupõe. Imagem de aula é pública;
 * o que é do plano pago é vídeo, e vídeo não mora aqui.
 */
export const PREFIXO_URL_MIDIA = '/midia/';

/** URL pública de um `MediaAsset.path`. */
export function urlDoCaminho(caminho: string): string {
  return `${PREFIXO_URL_MIDIA}${caminho}`;
}

/**
 * Caminho de armazenamento a partir de uma URL servida — o inverso de
 * {@link urlDoCaminho}. Devolve `null` para qualquer coisa que não seja uma URL
 * desta biblioteca (arte legada em `/lessons/art/…`, link externo, caminho vazio).
 *
 * É só uma leitura de texto: quem decide se o caminho existe é o banco.
 */
export function caminhoDaUrl(src: string): string | null {
  const limpo = src.trim();
  if (!limpo.startsWith(PREFIXO_URL_MIDIA)) return null;

  const caminho = limpo.slice(PREFIXO_URL_MIDIA.length).split(/[?#]/)[0];
  return caminho.length > 0 ? caminho : null;
}

// ───────────────────────────── o que circula na tela ─────────────────────────

/**
 * O que o seletor de mídia devolve — e o que os blocos de conteúdo aceitam.
 *
 * `src` é a URL servida (`/midia/imagens/<uuid>.png`); `alt` é o texto
 * alternativo **desta ocorrência**, que começa igual ao `alt` do asset e pode
 * ser ajustado para o contexto do bloco (a mesma foto pode ilustrar duas coisas
 * diferentes em duas aulas).
 */
export type MidiaSelecionada = { src: string; alt: string };

/** Tipo do asset. Espelha o enum `MediaKind` do Prisma sem importar o client. */
export type TipoDeMidia = 'IMAGE' | 'VIDEO';

/** Uma ocorrência do asset no conteúdo (linha de `MediaUsage`). */
export type UsoDaMidia = {
  lessonId: string;
  /** Formato cru gravado no banco: `capa` ou `pagina:3:bloco:a6p2`. */
  contexto: string;
  /** O mesmo uso em português: "Aula 06 · página 3 · bloco a6p2". */
  descricao: string;
  /** Número da aula, quando a aula ainda existe. */
  numeroDaAula: number | null;
};

/** Um item da biblioteca, pronto para a tela. Datas já vêm formatadas. */
export type MidiaDaBiblioteca = {
  id: string;
  kind: TipoDeMidia;
  /** URL servida — é o que vai para `src` do bloco. */
  src: string;
  /** Caminho no armazenamento. Aparece só em detalhe técnico. */
  path: string;
  /** Nome original enviado, só para o humano reconhecer o arquivo. */
  filename: string;
  mime: string;
  bytes: number;
  width: number | null;
  height: number | null;
  alt: string | null;
  criadoEm: string;
  arquivadoEm: string | null;
  usos: UsoDaMidia[];
};

// ──────────────────────────── estado de formulário ───────────────────────────

/** Erros por campo, na chave do `name` do input. */
export type ErrosDeCampo = Readonly<Record<string, string>>;

/**
 * O estado que as Server Actions da mídia devolvem aos formulários.
 *
 * Mesma forma do resto do painel (`/admin/modulos/tipos.ts`), repetida aqui
 * porque estas actions moram em `src/lib/media/acoes.ts` — elas são usadas pela
 * tela `/admin/midia` **e** pelo seletor, que vive em `src/components/admin/`.
 */
export type EstadoDoFormulario =
  | { estado: 'inicial' }
  | { estado: 'ok'; mensagem: string }
  | { estado: 'erro'; mensagem: string; campos?: ErrosDeCampo };

export const FORMULARIO_INICIAL: EstadoDoFormulario = { estado: 'inicial' };

// ─────────────────────────────── formatação ──────────────────────────────────

/** Tamanho de arquivo em português ("482 KB", "1,7 MB"). */
export function formatarBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) return '—';
  if (bytes < 1024) return `${bytes} B`;

  const kb = bytes / 1024;
  if (kb < 1024) return `${Math.round(kb)} KB`;

  const mb = kb / 1024;
  return `${mb.toFixed(1).replace('.', ',')} MB`;
}

/** "1200 × 800 px", ou `null` quando as dimensões não foram lidas. */
export function formatarDimensoes(
  width: number | null,
  height: number | null,
): string | null {
  if (width === null || height === null) return null;
  return `${width} × ${height} px`;
}
