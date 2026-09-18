/** Iniciais do avatar (cabeçalho e `/perfil`). */
import { describe, expect, it } from 'vitest';

import { iniciaisDe } from '@/lib/ui/iniciais';

describe('iniciaisDe', () => {
  it.each([
    ['Maria Souza', 'MS'],
    ['maria souza', 'MS'],
    ['Maria da Silva Souza', 'MS'],
    ['Maria', 'MA'],
    ['a', 'A'],
    ['  Maria   Souza  ', 'MS'],
    ['Maria\tSouza', 'MS'],
    ['Élida Ávila', 'ÉÁ'],
    ['', 'A'],
    ['   ', 'A'],
  ])('%j → %j', (nome, esperado) => {
    expect(iniciaisDe(nome)).toBe(esperado);
  });

  // Regressão do defeito relatado pela frente de QA: `partes[0][0]` cortava o
  // emoji no meio e o avatar mostrava um caractere quebrado (�).
  it('nunca devolve metade de um emoji (par substituto solto)', () => {
    const resultado = iniciaisDe('😀 Maria');
    expect(resultado.isWellFormed()).toBe(true);
  });
});
