/**
 * Link do ChatGPT com o prompt da aula (pacote 06).
 */
import { describe, expect, it } from 'vitest';

import { LIMITE_DO_Q, URL_DO_CHATGPT, urlDoChatGPT } from '@/lib/pratica/chatgpt';

describe('urlDoChatGPT', () => {
  it('abre uma conversa nova no chatgpt.com', () => {
    expect(URL_DO_CHATGPT).toBe('https://chatgpt.com/');
    expect(Number.isInteger(LIMITE_DO_Q) && LIMITE_DO_Q > 0).toBe(true);
  });

  it('prompt vazio ou só com espaços dá null', () => {
    expect(urlDoChatGPT('')).toBeNull();
    expect(urlDoChatGPT('   \n  ')).toBeNull();
  });

  it('prompt no limite exato ainda vai no link', () => {
    const prompt = 'a'.repeat(LIMITE_DO_Q);
    expect(urlDoChatGPT(prompt)).toBe(`https://chatgpt.com/?q=${prompt}`);
  });

  it('um caractere acima do limite dá null (o ChatGPT abre em branco e o aluno cola)', () => {
    expect(urlDoChatGPT('a'.repeat(LIMITE_DO_Q + 1))).toBeNull();
  });

  it('codifica acentos, quebras de linha e símbolos, e o texto volta igual', () => {
    const prompt = 'Olá, você?\nA & B #1 · AULA 07';
    const url = urlDoChatGPT(prompt);
    expect(url).toBe(`https://chatgpt.com/?q=${encodeURIComponent(prompt)}`);
    expect(url).not.toContain('\n');
    expect(url).not.toContain(' ');
    expect(new URL(url ?? '').searchParams.get('q')).toBe(prompt);
  });
});
