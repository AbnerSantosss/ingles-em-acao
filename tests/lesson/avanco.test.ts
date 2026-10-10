import { describe, expect, it } from 'vitest';
import { calcularAvancoDaAula } from '@/lib/lesson/avanco';

describe('avanço de leitura da aula', () => {
  it('não inventa avanço para uma aula ainda não iniciada', () => {
    expect(calcularAvancoDaAula(undefined, 8)).toEqual({ percentual: 0, pagina: 0, totalPaginas: 8, iniciada: false });
  });
  it('retoma na página salva e conta as páginas anteriores percorridas', () => {
    expect(calcularAvancoDaAula({ status: 'IN_PROGRESS', currentPage: 2 }, 8))
      .toEqual({ percentual: 25, pagina: 3, totalPaginas: 8, iniciada: true });
  });
  it('a primeira página não equivale a conteúdo concluído', () => {
    expect(calcularAvancoDaAula({ status: 'IN_PROGRESS', currentPage: 0 }, 8).percentual).toBe(0);
  });
  it('chegar à última página não conclui a aula', () => {
    expect(calcularAvancoDaAula({ status: 'IN_PROGRESS', currentPage: 7 }, 8).percentual).toBe(88);
    expect(calcularAvancoDaAula({ status: 'IN_PROGRESS', currentPage: 0 }, 1).percentual).toBe(0);
  });
  it('preserva 100% depois de concluída, inclusive durante revisão', () => {
    expect(calcularAvancoDaAula({ status: 'COMPLETED', currentPage: 0 }, 8).percentual).toBe(100);
  });
  it('limita posições antigas quando o conteúdo muda', () => {
    expect(calcularAvancoDaAula({ status: 'IN_PROGRESS', currentPage: 25 }, 4))
      .toMatchObject({ percentual: 75, pagina: 4 });
    expect(calcularAvancoDaAula({ status: 'IN_PROGRESS', currentPage: -2 }, 4).percentual).toBe(0);
  });
  it('não divide por zero nem produz NaN com conteúdo vazio', () => {
    expect(calcularAvancoDaAula({ status: 'IN_PROGRESS', currentPage: 2 }, 0))
      .toMatchObject({ percentual: 0, pagina: 0 });
  });
});
