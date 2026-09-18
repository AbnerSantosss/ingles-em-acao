/**
 * Os três destinos da navegação principal (Início, Progresso, Perfil — como no
 * design do Claude Designer), compartilhados pela barra inferior
 * (mobile) e pela pílula do cabeçalho (desktop, ≥1024px). Módulo neutro — sem
 * `'use client'` — para os dois componentes lerem a mesma lista.
 *
 * ⚠️ Regra firme do projeto: nunca só o ícone. Todo destino tem rótulo.
 */
import type { ReactNode } from 'react';

export type Destino = {
  href: string;
  rotulo: string;
  icone: ReactNode;
  /** Prefixos extras que também acendem este item. */
  tambem?: string[];
};

const TRACO = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2.4,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const;

export const DESTINOS: Destino[] = [
  {
    href: '/inicio',
    rotulo: 'Início',
    // A trilha mora na Início (design do Claude Designer): a lista completa e
    // a aula aberta mantêm o item aceso.
    tambem: ['/trilha', '/aula'],
    icone: (
      <svg width="22" height="22" viewBox="0 0 24 24" {...TRACO} aria-hidden="true">
        <path d="M3 10.5 12 3l9 7.5" />
        <path d="M5 9.5V21h14V9.5" />
      </svg>
    ),
  },
  {
    href: '/progresso',
    rotulo: 'Progresso',
    icone: (
      <svg width="22" height="22" viewBox="0 0 24 24" {...TRACO} aria-hidden="true">
        <path d="M6 20V11" />
        <path d="M12 20V4" />
        <path d="M18 20v-6" />
      </svg>
    ),
  },
  {
    href: '/perfil',
    rotulo: 'Perfil',
    icone: (
      <svg width="22" height="22" viewBox="0 0 24 24" {...TRACO} aria-hidden="true">
        <circle cx="12" cy="8" r="3.6" />
        <path d="M5 20c1.2-3.6 4-5.4 7-5.4s5.8 1.8 7 5.4" />
      </svg>
    ),
  },
];

export function estaAtivo(caminho: string, destino: Destino): boolean {
  const alvos = [destino.href, ...(destino.tambem ?? [])];
  return alvos.some((alvo) => caminho === alvo || caminho.startsWith(`${alvo}/`));
}
