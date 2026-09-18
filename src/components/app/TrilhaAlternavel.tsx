'use client';

/**
 * "TRILHA · N AULAS" com a alternância Lista / Módulos do design do Claude
 * Designer. Usado na Home (como no design) e em `/trilha`.
 *
 * Client Component só pela alternância; os dados chegam prontos do servidor.
 */
import Link from 'next/link';
import { useState } from 'react';

import { cn } from '@/lib/ui/cn';

export type EstadoDaAula = 'concluida' | 'proxima' | 'aberta';

export type ItemDaTrilha = {
  id: number;
  slug: string;
  titulo: string;
  subtitulo: string;
  tempo: string;
  estado: EstadoDaAula;
};

export type ModuloDaTrilha = {
  id: number;
  ordem: number;
  titulo: string;
  concluidas: number;
  total: number;
  de: number;
  ate: number;
};

type Visao = 'lista' | 'modulos';

const ESTILO: Record<EstadoDaAula, { tag: string; tagCor: string; borda: string; numero: string }> = {
  concluida: {
    tag: 'CONCLUÍDA',
    tagCor: 'text-teal',
    borda: 'border-transparent',
    numero: 'linear-gradient(160deg,#12A594,#0C7A6D)',
  },
  proxima: {
    tag: 'DISPONÍVEL',
    tagCor: 'text-blue',
    borda: 'border-[#7EAEF5]',
    numero: 'linear-gradient(160deg,#123A86,#0A1F4E)',
  },
  aberta: {
    tag: 'DISPONÍVEL',
    tagCor: 'text-blue',
    borda: 'border-transparent',
    numero: 'linear-gradient(160deg,#123A86,#0A1F4E)',
  },
};

function BotaoDeVisao({
  ativo,
  aoClicar,
  children,
}: {
  ativo: boolean;
  aoClicar: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={aoClicar}
      aria-pressed={ativo}
      className={cn(
        'flex cursor-pointer items-center gap-[9px] rounded-pill border-none px-5 py-2.5 text-[15px] font-extrabold lg:px-6 lg:py-3 lg:text-[17px]',
        'transition-colors duration-150',
        ativo ? 'bg-navy text-white' : 'bg-transparent text-muted hover:text-navy',
      )}
    >
      {children}
    </button>
  );
}

export function TrilhaAlternavel({
  itens,
  modulos,
}: {
  itens: ItemDaTrilha[];
  modulos: ModuloDaTrilha[];
}) {
  const [visao, setVisao] = useState<Visao>('lista');

  return (
    <section aria-labelledby="titulo-trilha">
      <div className="mb-[18px] flex flex-wrap items-center gap-4">
        <h3
          id="titulo-trilha"
          className="m-0 text-[17px] font-extrabold tracking-[0.14em] text-navy lg:text-[21px]"
        >
          TRILHA · {itens.length} AULAS
        </h3>

        <div className="ml-auto flex gap-1 rounded-pill bg-surface p-[7px] shadow-[0_6px_20px_rgba(11,31,75,0.08)]">
          <BotaoDeVisao ativo={visao === 'lista'} aoClicar={() => setVisao('lista')}>
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
              <path d="M9 6h11" />
              <path d="M9 12h11" />
              <path d="M9 18h11" />
              <path d="M4 6h.01" />
              <path d="M4 12h.01" />
              <path d="M4 18h.01" />
            </svg>
            Lista
          </BotaoDeVisao>
          <BotaoDeVisao ativo={visao === 'modulos'} aoClicar={() => setVisao('modulos')}>
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round" aria-hidden="true">
              <rect x="3.5" y="3.5" width="7" height="7" rx="1.6" />
              <rect x="13.5" y="3.5" width="7" height="7" rx="1.6" />
              <rect x="3.5" y="13.5" width="7" height="7" rx="1.6" />
              <rect x="13.5" y="13.5" width="7" height="7" rx="1.6" />
            </svg>
            Módulos
          </BotaoDeVisao>
        </div>
      </div>

      {itens.length === 0 ? (
        <p className="m-0 rounded-[18px] bg-surface p-5 text-[16px] leading-snug text-muted shadow-[0_4px_16px_rgba(11,31,75,0.05)]">
          Nenhuma aula está disponível no momento. Estamos preparando o conteúdo — volte em
          instantes.
        </p>
      ) : visao === 'lista' ? (
        <ul className="m-0 flex list-none flex-col gap-3 p-0">
          {itens.map((item) => {
            const estilo = ESTILO[item.estado];

            return (
              <li key={item.id}>
                <Link
                  href={`/aula/${item.slug}`}
                  aria-current={item.estado === 'proxima' ? 'step' : undefined}
                  className={cn(
                    'flex items-center gap-3.5 rounded-[18px] border-2 border-solid bg-surface px-4 py-3.5 lg:gap-5 lg:px-[22px] lg:py-4',
                    'shadow-[0_4px_16px_rgba(11,31,75,0.05)] transition-colors hover:border-[#7EAEF5]',
                    estilo.borda,
                  )}
                >
                  <span
                    aria-hidden="true"
                    className="grid size-[52px] flex-none place-items-center rounded-[15px] text-[20px] font-black text-white lg:size-[68px] lg:text-[24px]"
                    style={{ background: estilo.numero }}
                  >
                    {String(item.id).padStart(2, '0')}
                  </span>

                  <span className="min-w-0 flex-1">
                    <span
                      className={cn(
                        'mb-[3px] block text-[12px] font-extrabold tracking-[0.1em] lg:text-[14px]',
                        estilo.tagCor,
                      )}
                    >
                      {estilo.tag}
                    </span>
                    <span className="block text-[17px] font-extrabold text-navy text-pretty lg:text-[21px]">
                      {item.titulo}
                    </span>
                    <span className="mt-0.5 block text-[14px] text-muted lg:text-[16px]">
                      {item.subtitulo}
                    </span>
                  </span>

                  <span className="hidden items-center gap-[9px] text-navy min-[420px]:flex">
                    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
                      <circle cx="12" cy="12" r="8.5" />
                      <path d="M12 7.5V12l3 2" />
                    </svg>
                    <span className="whitespace-nowrap text-[15px] font-semibold lg:text-[17px]">
                      {item.tempo}
                    </span>
                  </span>

                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--navy)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="flex-none">
                    <path d="m9 6 6 6-6 6" />
                  </svg>
                </Link>
              </li>
            );
          })}
        </ul>
      ) : (
        <ul className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-3.5 p-0">
          {modulos.map((modulo) => {
            const pct = modulo.total > 0 ? Math.round((modulo.concluidas / modulo.total) * 100) : 0;

            return (
              <li key={modulo.id}>
                <button
                  type="button"
                  onClick={() => setVisao('lista')}
                  className="block w-full cursor-pointer rounded-[18px] border-2 border-solid border-[#DCE6F2] bg-surface p-[22px] text-left"
                >
                  <span className="mb-3 flex items-center gap-3">
                    <span
                      aria-hidden="true"
                      className="grid size-[46px] flex-none place-items-center rounded-[13px] text-[18px] font-black text-white"
                      style={{ background: 'linear-gradient(160deg,#123A86,#0A1F4E)' }}
                    >
                      {String(modulo.ordem).padStart(2, '0')}
                    </span>
                    <span>
                      <span className="block text-[13px] font-extrabold tracking-[0.1em] text-blue">
                        DISPONÍVEL
                      </span>
                      <span className="block text-[19px] font-extrabold text-navy text-pretty">
                        {modulo.titulo}
                      </span>
                    </span>
                  </span>
                  <span className="mb-3 block text-[15px] text-muted">
                    Aulas {modulo.de}–{modulo.ate} · {modulo.concluidas} de {modulo.total} concluídas
                  </span>
                  <span className="block h-[9px] overflow-hidden rounded-pill bg-[#EAF0F7]">
                    <span className="block h-full rounded-pill bg-teal" style={{ width: `${pct}%` }} />
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

export default TrilhaAlternavel;
