import type { AvancoDaAula as Avanco } from '@/lib/lesson/avanco';

export function AvancoDaAula({ progresso, titulo, escuro = false }: {
  progresso: Avanco;
  titulo: string;
  escuro?: boolean;
}) {
  return (
    <span className="mt-2.5 block max-w-[320px]">
      <span className={`mb-1.5 flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-[12px] leading-snug ${escuro ? 'text-white/90' : 'text-muted'}`}>
        <span className={`font-bold ${escuro ? 'text-yellow' : 'text-teal-texto'}`}>
          {progresso.percentual}% {progresso.percentual === 100 ? 'concluído' : 'percorrido'}
        </span>
        {progresso.iniciada && progresso.percentual < 100 && progresso.totalPaginas > 0 ? (
          <span>Página {progresso.pagina} de {progresso.totalPaginas}</span>
        ) : null}
      </span>
      <span
        role="progressbar"
        aria-label={`Avanço na aula ${titulo}`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progresso.percentual}
        className={`block h-1.5 overflow-hidden rounded-full ${escuro ? 'bg-white/20' : 'bg-[#DCE6F2]'}`}
      >
        <span className={`block h-full rounded-full ${escuro ? 'bg-yellow' : 'bg-teal'}`} style={{ width: `${progresso.percentual}%` }} />
      </span>
    </span>
  );
}
