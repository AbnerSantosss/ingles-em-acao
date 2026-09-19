/**
 * `promptDaAula` confere o plano ANTES de qualquer consulta (pacote 06).
 * O banco é um dublê: se alguma consulta rodar sem o plano, o teste pega.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const dubles = vi.hoisted(() => ({
  findUnique: vi.fn(),
  findMany: vi.fn(),
  findFirst: vi.fn(),
}));

vi.mock('@/lib/db', () => ({
  prisma: {
    lesson: {
      findUnique: dubles.findUnique,
      findMany: dubles.findMany,
      findFirst: dubles.findFirst,
    },
  },
}));

import { promptDaAula } from '@/lib/pratica/servidor';

const SEM_O_PLANO: (string | null | undefined)[] = ['ESSENCIAL', 'COMPLETO', '', 'premium', null, undefined];

describe('promptDaAula sem o plano', () => {
  beforeEach(() => {
    dubles.findUnique.mockReset();
    dubles.findMany.mockReset();
    dubles.findFirst.mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it.each(SEM_O_PLANO)('plano %s: sem-plano e nenhuma consulta ao banco', async (plano) => {
    await expect(promptDaAula(7, plano)).resolves.toEqual({ ok: false, motivo: 'sem-plano' });
    expect(dubles.findUnique).not.toHaveBeenCalled();
    expect(dubles.findMany).not.toHaveBeenCalled();
    expect(dubles.findFirst).not.toHaveBeenCalled();
  });

  it('PREMIUM passa da trava e consulta o banco', async () => {
    dubles.findUnique.mockResolvedValue(null);
    dubles.findMany.mockResolvedValue([]);
    dubles.findFirst.mockResolvedValue(null);
    await expect(promptDaAula(7, 'PREMIUM')).resolves.toEqual({ ok: false, motivo: 'sem-ficha' });
    expect(dubles.findUnique).toHaveBeenCalledTimes(1);
    expect(dubles.findMany).toHaveBeenCalledTimes(1);
  });

  it('erro do banco vira sem-ficha, com log, e não joga', async () => {
    const erro = vi.spyOn(console, 'error').mockImplementation(() => {});
    dubles.findUnique.mockRejectedValue(new Error('banco fora do ar'));
    dubles.findMany.mockResolvedValue([]);
    dubles.findFirst.mockResolvedValue(null);
    await expect(promptDaAula(7, 'PREMIUM')).resolves.toEqual({ ok: false, motivo: 'sem-ficha' });
    expect(erro).toHaveBeenCalledWith(expect.stringContaining('[pratica] aula 7'));
  });
});
