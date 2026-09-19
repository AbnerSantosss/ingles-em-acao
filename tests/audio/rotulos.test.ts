/**
 * Textos de tela e nomes acessíveis do áudio (pacote 08).
 *
 * O nome acessível do botão leva o texto que ele toca ("Ouvir: I am ready."),
 * encurtado para não virar um parágrafo no leitor de tela.
 */
import { describe, expect, it } from 'vitest';

import * as rotulos from '@/components/lesson/audio/rotulos';

const { formatarTempo, resumirTexto, rotuloDeOuvir, rotuloDeOuvirDevagar, textoDoProgresso } = rotulos;

describe('resumirTexto', () => {
  it('texto curto passa inteiro, com os espaços e quebras juntados', () => {
    expect(resumirTexto('I  am\nready.')).toBe('I am ready.');
  });

  it('texto longo corta na última palavra inteira e fecha com reticências', () => {
    const fala = 'Go straight for two blocks. Then turn right at the first corner. The museum is on your left.';
    expect(resumirTexto(fala)).toBe('Go straight for two blocks. Then turn right at the first…');
  });

  it('tira a pontuação antes das reticências', () => {
    expect(resumirTexto('Hello there, friend', 13)).toBe('Hello there…');
  });

  it('palavra sem espaço é cortada no limite', () => {
    expect(resumirTexto('a'.repeat(80))).toBe(`${'a'.repeat(60)}…`);
  });
});

describe('nomes acessíveis', () => {
  it('ouvir e ouvir mais devagar levam o texto exibido', () => {
    expect(rotuloDeOuvir('I am ready.')).toBe('Ouvir: I am ready.');
    expect(rotuloDeOuvirDevagar('I am ready.')).toBe('Ouvir mais devagar: I am ready.');
  });
});

describe('tempo', () => {
  it.each([
    [0, '0:00'],
    [5.9, '0:05'],
    [65, '1:05'],
    [600, '10:00'],
    [Number.NaN, '0:00'],
    [Number.POSITIVE_INFINITY, '0:00'],
    [-3, '0:00'],
  ])('%s segundos → %s', (segundos, esperado) => {
    expect(formatarTempo(segundos)).toBe(esperado);
  });

  it('progresso para o leitor de tela', () => {
    expect(textoDoProgresso(3, 12)).toBe('0:03 de 0:12');
  });
});

describe('escrita de tela (docs/ESCRITA.md)', () => {
  it('nenhum texto fixo tem travessão', () => {
    const valores: unknown[] = Object.values(rotulos);
    const textos = valores.filter((valor): valor is string => typeof valor === 'string');
    expect(textos.length).toBeGreaterThanOrEqual(6);
    // O caractere é montado pelo código para não aparecer no próprio arquivo.
    const travessao = String.fromCharCode(0x2014);
    for (const texto of textos) expect(texto).not.toContain(travessao);
  });

  it('os textos de tela, palavra por palavra', () => {
    expect(rotulos.ERRO_AO_TOCAR).toBe('Não deu para tocar. Tente de novo.');
    expect(rotulos.ROTULO_OUVIR_DIALOGO).toBe('Ouvir o diálogo');
    expect(rotulos.ROTULO_OUVIR_TODOS).toBe('Ouvir todos');
    expect(rotulos.ROTULO_PARAR).toBe('Parar');
    expect(rotulos.ROTULO_DEVAGAR).toBe('Devagar');
    expect(rotulos.ROTULO_PROGRESSO).toBe('Progresso do áudio');
  });
});
