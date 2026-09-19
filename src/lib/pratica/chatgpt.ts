/**
 * Link que abre o ChatGPT numa conversa nova, já com o prompt da aula
 * (contrato 01, seção 3.2).
 *
 * Sem `'use client'` e sem import de servidor: o servidor usa `urlDoChatGPT` e
 * o cartão (cliente) usa `URL_DO_CHATGPT`.
 *
 * ⚠️ Não existe link que abra o ChatGPT direto no modo de voz. O aluno toca no
 * botão de voz lá dentro.
 */

/** Página inicial do ChatGPT: conversa nova, em branco. */
export const URL_DO_CHATGPT = 'https://chatgpt.com/';

/**
 * Maior prompt, em caracteres (texto antes de codificar), que o ChatGPT abriu
 * inteiro pelo `?q=` no spike da Onda 0 (`docs/plano-v2/RESULTADOS-ONDA0.md`).
 * Acima disso o link sai sem `?q=`: o ChatGPT abre em branco e o aluno cola o
 * prompt, que o botão já copiou. Padrão enquanto o spike não mediu: 6000.
 */
export const LIMITE_DO_Q = 6000;

/**
 * `https://chatgpt.com/?q=<prompt>` ou `null` quando o prompt passa do limite
 * (ou está vazio). `null` não é erro: o cartão abre `URL_DO_CHATGPT` e avisa
 * que é só colar.
 */
export function urlDoChatGPT(prompt: string): string | null {
  if (prompt.trim() === '') return null;
  if (prompt.length > LIMITE_DO_Q) return null;
  return `${URL_DO_CHATGPT}?q=${encodeURIComponent(prompt)}`;
}
