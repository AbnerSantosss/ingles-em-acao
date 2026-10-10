export type AvancoDaAula = {
  percentual: number;
  pagina: number;
  totalPaginas: number;
  iniciada: boolean;
};

/** Páginas percorridas antes da posição salva; 100% exige conclusão explícita. */
export function calcularAvancoDaAula(
  registro: { status: string; currentPage: number } | undefined,
  totalPaginas: number,
): AvancoDaAula {
  const total = Number.isFinite(totalPaginas) ? Math.max(0, Math.trunc(totalPaginas)) : 0;
  const iniciada = !!registro && registro.status !== 'NOT_STARTED';
  const posicao = Number.isFinite(registro?.currentPage) ? Math.trunc(registro!.currentPage) : 0;
  const indice = Math.min(Math.max(0, posicao), Math.max(0, total - 1));
  return {
    percentual: registro?.status === 'COMPLETED' ? 100 : iniciada && total > 0
      ? Math.min(99, Math.round((indice / total) * 100)) : 0,
    pagina: iniciada && total > 0 ? indice + 1 : 0,
    totalPaginas: total,
    iniciada,
  };
}
