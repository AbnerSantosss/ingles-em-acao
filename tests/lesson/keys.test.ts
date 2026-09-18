/**
 * Chaves de resposta (`ExerciseAnswer.answerKey`) — CONTRACT §4.
 *
 * O formato é contrato com o banco: uma chave montada diferente deixa a resposta
 * gravada órfã, sem erro na tela. Por isso os formatos ficam fixados aqui, letra
 * por letra.
 */
import { describe, expect, it } from 'vitest';

import {
  MARCADO,
  NAO_MARCADO,
  RESULTADO_ERRO,
  RESULTADO_OK,
  chaveCheck,
  chaveCta,
  chaveDnd,
  chaveFill,
  chaveFree,
  chaveMatch,
  chaveMc,
  estaMarcado,
  normalizar,
} from '@/lib/lesson/keys';

/** O mesmo formato que `salvarRespostaAction` aceita no servidor (actions.ts). */
const CHAVE_VALIDA = /^(mc|fill|free|match|dnd|chk|cta):[A-Za-z0-9:_-]{1,120}$/;

describe('construtores de chave', () => {
  it('mc: usa aula, id do bloco e índice da pergunta', () => {
    expect(chaveMc(1, 'a1mc1', 0)).toBe('mc:1:a1mc1:0');
    expect(chaveMc(42, 'b-9_x', 3)).toBe('mc:42:b-9_x:3');
  });

  it('fill:, free: e chk: usam id do bloco e índice', () => {
    expect(chaveFill('f1', 2)).toBe('fill:f1:2');
    expect(chaveFree('fr1', 0)).toBe('free:fr1:0');
    expect(chaveCheck('c1', 4)).toBe('chk:c1:4');
  });

  it('match: e dnd: guardam só o id do bloco', () => {
    expect(chaveMatch('m1')).toBe('match:m1');
    expect(chaveDnd('d1')).toBe('dnd:d1');
  });

  it('cta: é a única sem id de bloco', () => {
    expect(chaveCta(7, 1)).toBe('cta:7:1');
  });

  it('toda chave montada aqui passa no formato que o servidor aceita', () => {
    const chaves = [
      chaveMc(1, 'a1mc1', 0),
      chaveFill('f1', 2),
      chaveFree('fr1', 0),
      chaveMatch('m1'),
      chaveDnd('d1'),
      chaveCheck('c1', 4),
      chaveCta(7, 1),
    ];
    for (const chave of chaves) expect(chave).toMatch(CHAVE_VALIDA);
  });
});

describe('valores canônicos', () => {
  it('resultado de match/dnd e marcação de chk', () => {
    expect(RESULTADO_OK).toBe('ok');
    expect(RESULTADO_ERRO).toBe('no');
    expect(MARCADO).toBe('1');
    expect(NAO_MARCADO).toBe('0');
  });

  it.each([
    ['1', true],
    ['true', true],
    ['0', false],
    ['false', false],
    ['', false],
    [undefined, false],
    ['TRUE', false],
  ])('estaMarcado(%s) → %s', (valor, esperado) => {
    expect(estaMarcado(valor)).toBe(esperado);
  });
});

describe('normalizar — o que decide acerto no fill', () => {
  it.each([
    ['  I AM  ', 'i am'],
    ['don’t', "don't"],
    ['don‘t', "don't"],
    ['I am not Brazilian.', 'i am not brazilian'],
    ['I am not Brazilian', 'i am not brazilian'],
    ['Yes, I am!', 'yes i am'],
    ['Yes ,  I   am', 'yes i am'],
    ['What?!', 'what'],
    ['fim ; ', 'fim'],
    ['a:b', 'a:b'],
    ['', ''],
  ])('%j → %j', (entrada, esperado) => {
    expect(normalizar(entrada)).toBe(esperado);
  });

  it('null e undefined viram texto vazio', () => {
    expect(normalizar(null)).toBe('');
    expect(normalizar(undefined)).toBe('');
  });

  it('gabarito e resposta digitada batem depois da mesma normalização', () => {
    expect(normalizar('I don’t like it.')).toBe(normalizar("i don't like it"));
  });
});
