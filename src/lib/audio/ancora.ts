/**
 * Casa a âncora de um áudio com o texto exibido na tela (contrato 2.2).
 *
 * O áudio não mora dentro do bloco: fica na lista `audios` da página, e o renderizador
 * procura aqui o clipe cuja âncora é igual ao texto que ele está mostrando.
 */
import type { AudioClip } from '@/lib/content/types';

/**
 * Normaliza um texto para comparar âncora de áudio com texto exibido.
 * NÃO muda maiúsculas: "HE" e "He" são textos diferentes na tela.
 */
export function normalizarAncora(s: string): string {
  return s
    .normalize('NFC')
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Primeiro clipe da página cuja âncora casa com o texto. `undefined` → sem áudio. */
export function acharClip(
  audios: readonly AudioClip[] | undefined,
  textoExibido: string,
  alvo: AudioClip['alvo'],
): AudioClip | undefined {
  if (!audios?.length) return undefined;
  const chave = normalizarAncora(textoExibido);
  return audios.find((c) => c.alvo === alvo && normalizarAncora(c.ancora) === chave);
}

/** Clipes cuja âncora não casa com nenhum texto da página: áudio órfão ou desatualizado. */
export function clipsOrfaos(audios: readonly AudioClip[] | undefined, textosDaPagina: readonly string[]): AudioClip[] {
  if (!audios?.length) return [];
  const conjunto = new Set(textosDaPagina.map(normalizarAncora));
  return audios.filter((c) => !conjunto.has(normalizarAncora(c.ancora)));
}
