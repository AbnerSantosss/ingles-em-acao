/**
 * Validação de imagem por **conteúdo** — BACKOFFICE §4.3.
 *
 * ⚠️ MÓDULO DE SERVIDOR (`node:crypto`). Nunca importe de um `'use client'`.
 *
 * ## Por que os bytes, e não a extensão nem o `Content-Type`
 *
 * Os dois vêm de quem envia. O navegador manda o `Content-Type` que o sistema
 * operacional adivinhou pela extensão, e a extensão é literalmente o que o
 * usuário digitou no nome do arquivo. Um `.png` que é um SVG com `<script>`
 * dentro passa nas duas checagens — e, servido da mesma origem do app, roda
 * JavaScript com o cookie de sessão à mão.
 *
 * Aqui o arquivo é aberto e lido: assinatura (magic number) primeiro, e o
 * cabeçalho do formato em seguida para extrair largura e altura. O `mime`
 * gravado no `MediaAsset` — e devolvido pela rota `/midia/[...path]` — é o que
 * saiu **desta** leitura, nunca o que o navegador disse.
 *
 * ## Por que as dimensões são lidas à mão
 *
 * Não há `sharp` (nem qualquer outro decodificador) nas dependências do projeto,
 * e acrescentar um binário nativo só para ler dois números seria caro à toa. Os
 * cabeçalhos de PNG, JPEG e WebP são pequenos e estáveis; o que se lê aqui são
 * os primeiros bytes, nunca o pixel. Se a leitura falhar, `width`/`height` ficam
 * nulos — a imagem continua válida, a tela só não mostra a dimensão.
 */
import { randomUUID } from 'node:crypto';

import { z } from 'zod';

import {
  FORMATOS_DE_IMAGEM,
  FORMATOS_EM_TEXTO,
  TAMANHO_MAXIMO_ALT,
  TAMANHO_MAXIMO_IMAGEM,
  TAMANHO_MAXIMO_NOME,
  TAMANHO_MINIMO_ALT,
  formatarBytes,
  type ExtensaoDeImagem,
  type MimeDeImagem,
} from './tipos';

// ────────────────────────────── leitura de bytes ─────────────────────────────

/** Compara uma sequência de bytes numa posição. */
function bytesIguais(dados: Uint8Array, posicao: number, esperado: readonly number[]): boolean {
  if (posicao + esperado.length > dados.length) return false;
  for (let i = 0; i < esperado.length; i++) {
    if (dados[posicao + i] !== esperado[i]) return false;
  }
  return true;
}

/** Compara ASCII numa posição ("RIFF", "WEBP", "IHDR"). */
function textoIgual(dados: Uint8Array, posicao: number, esperado: string): boolean {
  const codigos: number[] = [];
  for (let i = 0; i < esperado.length; i++) codigos.push(esperado.charCodeAt(i));
  return bytesIguais(dados, posicao, codigos);
}

function visao(dados: Uint8Array): DataView {
  return new DataView(dados.buffer, dados.byteOffset, dados.byteLength);
}

// ─────────────────────────────── PNG ─────────────────────────────────────────

const ASSINATURA_PNG = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a] as const;

/** Dimensões do PNG: o chunk IHDR é obrigatoriamente o primeiro, no byte 8. */
function dimensoesPng(dados: Uint8Array): { width: number; height: number } | null {
  if (dados.length < 24 || !textoIgual(dados, 12, 'IHDR')) return null;
  const v = visao(dados);
  return { width: v.getUint32(16, false), height: v.getUint32(20, false) };
}

// ─────────────────────────────── JPEG ────────────────────────────────────────

/**
 * Marcadores SOF (Start Of Frame), que carregam altura e largura.
 * `C4` (tabela de Huffman), `C8` (extensão JPEG) e `CC` (aritmética) ficam de
 * fora: têm o mesmo intervalo, mas outro conteúdo.
 */
function ehMarcadorDeQuadro(marcador: number): boolean {
  if (marcador < 0xc0 || marcador > 0xcf) return false;
  return marcador !== 0xc4 && marcador !== 0xc8 && marcador !== 0xcc;
}

/** Percorre os segmentos do JPEG até o primeiro SOF. */
function dimensoesJpeg(dados: Uint8Array): { width: number; height: number } | null {
  const v = visao(dados);
  let i = 2; // pula SOI (FFD8)

  while (i + 3 < dados.length) {
    // Entre segmentos pode haver bytes de preenchimento 0xFF.
    if (dados[i] !== 0xff) {
      i++;
      continue;
    }

    const marcador = dados[i + 1];
    if (marcador === 0xff) {
      i++;
      continue;
    }

    // Fim da imagem ou início dos dados comprimidos: não há mais cabeçalho.
    if (marcador === 0xd9 || marcador === 0xda) return null;

    // Marcadores sem tamanho (RSTn, SOI, TEM).
    if ((marcador >= 0xd0 && marcador <= 0xd8) || marcador === 0x01) {
      i += 2;
      continue;
    }

    const tamanho = v.getUint16(i + 2, false);
    if (tamanho < 2) return null;

    if (ehMarcadorDeQuadro(marcador)) {
      if (i + 9 > dados.length) return null;
      return { height: v.getUint16(i + 5, false), width: v.getUint16(i + 7, false) };
    }

    i += 2 + tamanho;
  }

  return null;
}

// ─────────────────────────────── WebP ────────────────────────────────────────

/**
 * Dimensões do WebP nos três sabores do formato: `VP8 ` (com perda),
 * `VP8L` (sem perda) e `VP8X` (estendido, com animação/alfa).
 */
function dimensoesWebp(dados: Uint8Array): { width: number; height: number } | null {
  if (dados.length < 30) return null;
  const v = visao(dados);
  const inicio = 20; // RIFF(4) + tamanho(4) + WEBP(4) + fourCC(4) + tamanho(4)

  if (textoIgual(dados, 12, 'VP8 ')) {
    // Quadro-chave: 3 bytes de tag, sync code 9D 01 2A, largura e altura em 14 bits.
    if (!bytesIguais(dados, inicio + 3, [0x9d, 0x01, 0x2a])) return null;
    return {
      width: v.getUint16(inicio + 6, true) & 0x3fff,
      height: v.getUint16(inicio + 8, true) & 0x3fff,
    };
  }

  if (textoIgual(dados, 12, 'VP8L')) {
    if (dados[inicio] !== 0x2f) return null;
    const empacotado = v.getUint32(inicio + 1, true);
    return {
      width: (empacotado & 0x3fff) + 1,
      height: ((empacotado >> 14) & 0x3fff) + 1,
    };
  }

  if (textoIgual(dados, 12, 'VP8X')) {
    // Largura e altura da tela: 24 bits little-endian, guardados como valor - 1.
    const largura = dados[inicio + 4] | (dados[inicio + 5] << 8) | (dados[inicio + 6] << 16);
    const altura = dados[inicio + 7] | (dados[inicio + 8] << 8) | (dados[inicio + 9] << 16);
    return { width: largura + 1, height: altura + 1 };
  }

  return null;
}

// ──────────────────────────── identificação ──────────────────────────────────

export type ImagemIdentificada = {
  /** MIME lido dos bytes. É o que vai para o banco e para a resposta HTTP. */
  mime: MimeDeImagem;
  /** Extensão do arquivo gerado pelo servidor. */
  ext: ExtensaoDeImagem;
  width: number | null;
  height: number | null;
};

/** Extensão canônica de um MIME aceito. */
function extensaoDoMime(mime: MimeDeImagem): ExtensaoDeImagem {
  const formato = FORMATOS_DE_IMAGEM.find((item) => item.mime === mime);
  // O tipo garante que existe; o `?? 'png'` só satisfaz o compilador.
  return formato?.ext ?? 'png';
}

/**
 * Identifica a imagem pelos bytes. Devolve `null` para qualquer coisa que não
 * seja PNG, JPEG ou WebP — inclusive um SVG com nome de `.png`.
 */
export function identificarImagem(dados: Uint8Array): ImagemIdentificada | null {
  if (bytesIguais(dados, 0, ASSINATURA_PNG)) {
    const tamanho = dimensoesPng(dados);
    return { mime: 'image/png', ext: extensaoDoMime('image/png'), ...dimensoesOuNulo(tamanho) };
  }

  if (bytesIguais(dados, 0, [0xff, 0xd8, 0xff])) {
    const tamanho = dimensoesJpeg(dados);
    return { mime: 'image/jpeg', ext: extensaoDoMime('image/jpeg'), ...dimensoesOuNulo(tamanho) };
  }

  if (textoIgual(dados, 0, 'RIFF') && textoIgual(dados, 8, 'WEBP')) {
    const tamanho = dimensoesWebp(dados);
    return { mime: 'image/webp', ext: extensaoDoMime('image/webp'), ...dimensoesOuNulo(tamanho) };
  }

  return null;
}

function dimensoesOuNulo(
  tamanho: { width: number; height: number } | null,
): { width: number | null; height: number | null } {
  if (!tamanho) return { width: null, height: null };
  // Dimensão zero ou absurda é leitura errada, não imagem: melhor não gravar.
  const valida = (n: number) => Number.isInteger(n) && n > 0 && n <= 65535;
  if (!valida(tamanho.width) || !valida(tamanho.height)) return { width: null, height: null };
  return tamanho;
}

/**
 * Nomeia o formato recusado, quando dá para reconhecê-lo. Serve só para a
 * mensagem de erro ser útil ("isto é um SVG") em vez de genérica.
 */
function formatoRecusado(dados: Uint8Array): string | null {
  if (textoIgual(dados, 0, 'GIF8')) return 'GIF';
  if (textoIgual(dados, 0, '%PDF')) return 'PDF';
  if (textoIgual(dados, 0, 'BM')) return 'BMP';
  if (textoIgual(dados, 0, 'II*') || textoIgual(dados, 0, 'MM')) return 'TIFF';
  if (bytesIguais(dados, 4, [0x66, 0x74, 0x79, 0x70])) return 'vídeo ou HEIC';

  // SVG e XML são texto: procuramos a marca nos primeiros 200 bytes, pulando
  // espaço em branco e BOM.
  const inicio = new TextDecoder('utf-8', { fatal: false })
    .decode(dados.subarray(0, 200))
    .trimStart()
    .toLowerCase();
  if (inicio.startsWith('<svg') || inicio.startsWith('<?xml') || inicio.includes('<svg')) {
    return 'SVG';
  }

  return null;
}

export type ConferenciaDeImagem =
  | { ok: true; imagem: ImagemIdentificada }
  | { ok: false; mensagem: string };

/**
 * A porta única do upload de imagem: tamanho, assinatura e dimensões.
 *
 * O tamanho é conferido sobre os **bytes recebidos**, não sobre o `size`
 * declarado pelo navegador.
 */
export function conferirImagem(dados: Uint8Array): ConferenciaDeImagem {
  if (dados.length === 0) {
    return { ok: false, mensagem: 'O arquivo chegou vazio. Escolha a imagem de novo.' };
  }

  if (dados.length > TAMANHO_MAXIMO_IMAGEM) {
    return {
      ok: false,
      mensagem:
        `A imagem tem ${formatarBytes(dados.length)} e o limite é ` +
        `${formatarBytes(TAMANHO_MAXIMO_IMAGEM)}. Reduza o arquivo e envie de novo.`,
    };
  }

  const imagem = identificarImagem(dados);
  if (!imagem) {
    const reconhecido = formatoRecusado(dados);

    if (reconhecido === 'SVG') {
      return {
        ok: false,
        mensagem:
          'Arquivo SVG não é aceito: SVG pode conter script e seria servido do mesmo ' +
          `endereço do app. Exporte a arte em ${FORMATOS_EM_TEXTO}.`,
      };
    }

    return {
      ok: false,
      mensagem: reconhecido
        ? `O conteúdo do arquivo é ${reconhecido}, e só aceitamos ${FORMATOS_EM_TEXTO}.`
        : `O conteúdo do arquivo não é ${FORMATOS_EM_TEXTO}. A extensão do nome não conta: ` +
          'o tipo é conferido pelos bytes.',
    };
  }

  return { ok: true, imagem };
}

// ───────────────────────── nome do arquivo e do registro ─────────────────────

/**
 * Nome do arquivo no armazenamento — **sempre** gerado aqui.
 *
 * ⚠️ O nome enviado pelo usuário nunca vira caminho. Nome de arquivo é caminho,
 * e caminho é travessia de diretório (`../../.env`). O que o usuário mandou só
 * sobrevive em `MediaAsset.filename`, que é texto de tela.
 */
export function gerarNomeDeArquivo(ext: ExtensaoDeImagem): string {
  return `${randomUUID()}.${ext}`;
}

/**
 * Nome original higienizado, só para exibição: sem diretório, sem caractere de
 * controle e com tamanho limitado.
 */
export function nomeParaExibir(nomeOriginal: string, ext: ExtensaoDeImagem): string {
  const semCaminho = nomeOriginal.split(/[\\/]/).pop() ?? '';
  const limpo = semCaminho
    // Caracteres de controle (incluindo NUL) vêm de nome de arquivo forjado e não
    // têm o que fazer numa tela nem num log.
    .replace(/[\x00-\x1F\x7F]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, TAMANHO_MAXIMO_NOME);

  return limpo.length > 0 ? limpo : `imagem.${ext}`;
}

// ───────────────────────────────── zod ───────────────────────────────────────

/**
 * `alt` obrigatório.
 *
 * O app tem 110 blocos `image` e 42 capas; sem texto alternativo, cada um deles
 * é um buraco para quem usa leitor de tela. A coluna continua opcional no banco
 * (asset importado antes desta tela pode não ter), mas **por esta porta não
 * entra imagem sem alt**.
 */
export const esquemaDeAlt = z
  .string({ error: 'Descreva a imagem em uma frase — é o texto lido em voz alta.' })
  .trim()
  .min(TAMANHO_MINIMO_ALT, 'Descreva a imagem em uma frase curta (mínimo 3 caracteres).')
  .max(TAMANHO_MAXIMO_ALT, `No máximo ${TAMANHO_MAXIMO_ALT} caracteres.`);

/** Nome exibido do arquivo. Nunca vira caminho. */
export const esquemaDeNome = z
  .string({ error: 'Dê um nome ao arquivo.' })
  .trim()
  .min(1, 'Dê um nome ao arquivo.')
  .max(TAMANHO_MAXIMO_NOME, `No máximo ${TAMANHO_MAXIMO_NOME} caracteres.`);
