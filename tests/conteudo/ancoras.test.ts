/**
 * Funções de apoio das tabelas de áudio (pacote 12). Não usa o banco.
 * A normalização dos scripts precisa ser idêntica à do app (contrato 01, seção 2.2),
 * senão uma âncora aprovada pelo script não acende o botão na tela.
 */
import { describe, expect, it } from 'vitest';

import { normalizarAncora as doApp } from '@/lib/audio/ancora';
import { textoParaFala } from '../../scripts/conteudo/ancoras-da-aula.mjs';
import { normalizarAncora as doScript, normalizarItem } from '../../scripts/conteudo/comum.mjs';

describe('normalizarAncora do script = normalizarAncora do app', () => {
  const amostras = [
    'I’m',
    'They’re friends.',
    '  She   is\nhappy. ',
    '“Hello”',
    'HE',
    'He',
    'Café',
    'Cafe' + String.fromCodePoint(0x0301),
  ];
  for (const s of amostras) {
    it(JSON.stringify(s), () => {
      expect(doScript(s)).toBe(doApp(s));
    });
  }

  it('não muda maiúsculas', () => {
    expect(doScript('HE')).not.toBe(doScript('He'));
  });
});

describe('normalizarItem (chave do mapa curricular)', () => {
  it('ignora maiúsculas, pontuação final e artigo inicial', () => {
    expect(normalizarItem('A doctor.')).toBe(normalizarItem('doctor'));
    expect(normalizarItem('HE')).toBe(normalizarItem('he'));
    expect(normalizarItem('I’m')).toBe(normalizarItem("I'm"));
  });
});

describe('textoParaFala', () => {
  it('troca o apóstrofo curvo pelo reto', () => {
    expect(textoParaFala('I’m', 'table')).toBe("I'm");
  });

  it('põe em minúsculas a palavra que a tela mostra em caixa alta', () => {
    expect(textoParaFala('SHE', 'pron')).toBe('she');
    expect(textoParaFala('I', 'pron')).toBe('I');
  });

  it('nunca devolve travessão', () => {
    const travessao = String.fromCodePoint(0x2014);
    expect(textoParaFala(`my ${travessao} meu`, 'table')).not.toContain(travessao);
  });
});
