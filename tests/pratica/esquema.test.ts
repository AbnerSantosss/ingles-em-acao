/**
 * `src/lib/pratica/esquema.ts`: a ficha de prática de uma aula.
 *
 * O que precisa ser verdade:
 * - a ficha de exemplo (formato do contrato 3.1, dentro do orçamento da 10.3) passa;
 * - campo a mais, tipo de exercício inventado e texto vazio são erro;
 * - os mínimos valem para ficha pronta; os máximos (orçamento 10.3), para qualquer ficha;
 * - ficha pendente (Aula 05) passa só com versão, status, tipo e foco;
 * - os erros saem em português, no formato `<caminho>: <problema>` (contrato 10.8).
 */
import { describe, expect, it } from 'vitest';

import { validarFicha } from '@/lib/pratica/esquema';

import { fichaDeExemplo } from './ficha-de-exemplo';

function erros(valor: unknown): string[] {
  const r = validarFicha(valor);
  return r.ok ? [] : r.erros;
}

describe('validarFicha', () => {
  it('aceita a ficha de exemplo', () => {
    const r = validarFicha(fichaDeExemplo());
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.ficha).toEqual(fichaDeExemplo());
  });

  it('recusa campo desconhecido', () => {
    expect(erros({ ...fichaDeExemplo(), extra: 1 }).join('\n')).toContain('ficha: campo(s) desconhecido(s): `extra`');
  });

  it('recusa versão diferente de 1 e tipo de exercício inventado', () => {
    expect(erros({ ...fichaDeExemplo(), versao: 2 }).join('\n')).toContain('versao: ');
    expect(
      erros({ ...fichaDeExemplo(), tiposDeExercicio: ['identificar', 'escolher', 'cantar'] }).join('\n'),
    ).toContain('tiposDeExercicio[2]: ');
  });

  it('recusa texto vazio ou só com espaços', () => {
    expect(erros({ ...fichaDeExemplo(), foco: '   ' })).toContain('foco: não pode ficar vazio');
  });

  it('cobra os mínimos de uma ficha pronta', () => {
    const f = fichaDeExemplo();
    const lista = erros({
      ...f,
      comoIntegrar: ['só uma'],
      tiposDeExercicio: ['identificar'],
      exemplos: f.exemplos.slice(0, 2),
      resumoAutorizado: ['um', 'dois'],
      primeiraQuestao: '',
    });
    expect(lista).toContain('comoIntegrar: precisa de pelo menos 2 item(ns) numa ficha pronta');
    expect(lista).toContain('tiposDeExercicio: precisa de pelo menos 3 item(ns) numa ficha pronta');
    expect(lista).toContain('exemplos: precisa de pelo menos 3 item(ns) numa ficha pronta');
    expect(lista).toContain('resumoAutorizado: precisa de pelo menos 3 item(ns) numa ficha pronta');
    expect(lista).toContain('primeiraQuestao: não pode ficar vazio numa ficha pronta');
  });

  it('cobra o orçamento da seção 10.3 em qualquer ficha', () => {
    const f = fichaDeExemplo();
    const lista = erros({
      ...f,
      foco: 'f'.repeat(121),
      conteudoAlvo: ['a', 'b', 'c', 'd', 'e'],
      comoIntegrar: ['a', 'b', 'c'],
      tiposDeExercicio: ['identificar', 'escolher', 'traduzir', 'completar', 'responder'],
      exemplos: [{ ...f.exemplos[0], enunciado: 'e'.repeat(91) }, f.exemplos[1], f.exemplos[2]],
      resumoAutorizado: ['x'.repeat(81), 'b', 'c'],
      resumoCurto: 'y'.repeat(121),
    });
    expect(lista).toContain('foco: é longo demais (máximo 120)');
    expect(lista).toContain('conteudoAlvo: é longo demais (máximo 4)');
    expect(lista).toContain('comoIntegrar: é longo demais (máximo 2)');
    expect(lista).toContain('tiposDeExercicio: é longo demais (máximo 4)');
    expect(lista).toContain('exemplos[0].enunciado: é longo demais (máximo 90)');
    expect(lista).toContain('resumoAutorizado[0]: é longo demais (máximo 80)');
    expect(lista).toContain('resumoCurto: é longo demais (máximo 120)');
  });

  it('aceita ficha pendente só com o essencial (Aula 05)', () => {
    const pendente = {
      versao: 1,
      status: 'pendente',
      tipo: 'conteudo',
      foco: 'Conteúdo da Aula 05 em definição pelo dono do produto.',
      conteudoAlvo: [],
      expressoesFixas: [],
      comoIntegrar: [],
      regrasDaAula: [],
      tiposDeExercicio: [],
      exemplos: [],
      limites: [],
      primeiraQuestao: '',
      resumoAutorizado: [],
      resumoCurto: '',
    };
    expect(validarFicha(pendente).ok).toBe(true);
  });

  it('valor que não é objeto vira um erro no caminho `ficha`', () => {
    expect(erros('texto solto')[0]).toMatch(/^ficha: /);
  });
});
