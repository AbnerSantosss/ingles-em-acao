'use client';

/**
 * Navegação inferior fixa — três destinos, sempre ícone **e** rótulo.
 * Só no mobile: a partir de 1024px a navegação vira a pílula do cabeçalho.
 *
 * ⚠️ Regra firme do projeto: nunca só o ícone. Ícone sozinho obriga o aluno a
 * adivinhar o que cada desenho significa, e o público desta trilha é iniciante.
 *
 * Client Component porque precisa de `usePathname()` para saber o item ativo.
 */
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/ui/cn';

import { DESTINOS, estaAtivo } from './destinos';

/** Altura da faixa, sem o safe-area do iPhone. */
export const ALTURA_NAV = 74;

export function BottomNav() {
  const caminho = usePathname() ?? '';

  return (
    <nav
      aria-label="Navegação principal"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-solid border-[#E3EAF3] bg-[rgba(255,255,255,0.97)] backdrop-blur-[12px] lg:hidden"
      style={{ paddingBottom: 'calc(8px + env(safe-area-inset-bottom))' }}
    >
      <ul className="tela grid grid-cols-3 gap-1.5 pt-2">
        {DESTINOS.map((destino) => {
          const ativo = estaAtivo(caminho, destino);

          return (
            <li key={destino.href}>
              <Link
                href={destino.href}
                aria-current={ativo ? 'page' : undefined}
                className={cn(
                  'flex min-h-[58px] flex-col items-center justify-center gap-1 rounded-[16px] px-1 py-2',
                  'text-[12px] font-extrabold tracking-[0.04em]',
                  'transition-colors duration-150',
                  ativo
                    ? 'bg-navy text-white'
                    : 'text-muted hover:bg-[#F1F5FA] hover:text-navy',
                )}
              >
                {destino.icone}
                <span>{destino.rotulo}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default BottomNav;
