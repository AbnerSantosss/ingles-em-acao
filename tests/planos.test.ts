/**
 * `src/lib/planos.ts`: a fonte única dos planos comerciais.
 *
 * O que precisa ser verdade:
 * - só existem dois planos, na mesma ordem do enum `Plan` do banco;
 * - o Essencial tem áudio e não tem videoaula nem prática (decisão 1 do dono do produto);
 * - o Premium tem tudo;
 * - visitante (sem plano) não tem nada.
 */
import { Plan } from '@prisma/client';
import { describe, expect, it } from 'vitest';

import {
  NIVEL_DO_PLANO,
  NOME_DO_PLANO,
  PLANO_MINIMO,
  PLANOS,
  planoInclui,
  ROTULO_EXCLUSIVO_PREMIUM,
  type Plano,
} from '@/lib/planos';

describe('planos', () => {
  it('só existem ESSENCIAL e PREMIUM, iguais ao enum do banco', () => {
    expect(PLANOS).toEqual(['ESSENCIAL', 'PREMIUM']);
    expect(Object.values(Plan)).toEqual([...PLANOS]);
  });

  it('o Premium está acima do Essencial', () => {
    expect(NIVEL_DO_PLANO.PREMIUM).toBeGreaterThan(NIVEL_DO_PLANO.ESSENCIAL);
  });

  it('nomes de tela', () => {
    expect(NOME_DO_PLANO).toEqual({ ESSENCIAL: 'WSA Essencial', PREMIUM: 'WSA Premium' });
    expect(ROTULO_EXCLUSIVO_PREMIUM).toBe('EXCLUSIVO DO WSA PREMIUM');
  });

  it('plano mínimo de cada recurso (decisão 1: prática só no Premium)', () => {
    expect(PLANO_MINIMO).toEqual({ audio: 'ESSENCIAL', videoaula: 'PREMIUM', pratica: 'PREMIUM' });
  });

  it.each([
    ['ESSENCIAL', 'audio', true],
    ['ESSENCIAL', 'videoaula', false],
    ['ESSENCIAL', 'pratica', false],
    ['PREMIUM', 'audio', true],
    ['PREMIUM', 'videoaula', true],
    ['PREMIUM', 'pratica', true],
  ] as const)('%s inclui %s: %s', (plano, recurso, esperado) => {
    expect(planoInclui(plano, recurso)).toBe(esperado);
  });

  it('visitante (sem plano) não tem nenhum recurso', () => {
    expect(planoInclui(null, 'audio')).toBe(false);
    expect(planoInclui(undefined, 'videoaula')).toBe(false);
    expect(planoInclui(null, 'pratica')).toBe(false);
  });

  it('o tipo Plano e o enum do Prisma são o mesmo conjunto', () => {
    // Se o enum do banco ganhar ou perder um valor, esta linha deixa de compilar (`npx tsc`).
    const trava: Identico<Plan, Plano> = true;
    expect(trava).toBe(true);
  });
});

/** Identidade exata de tipos (a mesma técnica de `ConferenciaDeTipos`, em `blocks.ts`). */
type Identico<A, B> = (<G>() => G extends A ? 1 : 2) extends <G>() => G extends B ? 1 : 2
  ? true
  : false;
