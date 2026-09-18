'use client';

/**
 * Cabeçalho fixo do app: logo de 44px à esquerda, avatar à direita.
 *
 * A partir de 1024px (`lg`) segue o design desktop do Claude Designer: logo de
 * 54px, a navegação principal numa pílula centralizada (a barra inferior some)
 * e avatar de 56px.
 *
 * É um Client Component por um motivo só: a sombra que aparece quando a página
 * rola. Sem ela o cabeçalho "flutua" sobre o conteúdo sem nenhuma separação —
 * e a alternativa em CSS puro (`animation-timeline: scroll()`) ainda não tem
 * suporte no Safari, justamente o navegador da maior parte do público mobile.
 */
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Logo } from '@/components/ui/Logo';
import { cn } from '@/lib/ui/cn';
import { iniciaisDe } from '@/lib/ui/iniciais';

import { DESTINOS, estaAtivo } from './destinos';

export type AppHeaderProps = {
  /** Nome do usuário, para as iniciais e o rótulo acessível. */
  name: string;
  /** Foto de perfil, quando houver. */
  photoUrl?: string | null;
};

/**
 * Altura do cabeçalho em px: 68 no mobile (12 + 44 + 12) e 88 a partir de
 * 1024px (16 + 56 + 16). O layout do app afasta o conteúdo com esses mesmos
 * valores (`pt-[84px] lg:pt-[102px]`) — se a altura mudar aqui, muda lá também.
 */
export const ALTURA_CABECALHO = 68;
export const ALTURA_CABECALHO_DESKTOP = 88;

/** Quanto a página precisa rolar para o cabeçalho ganhar sombra. */
const LIMIAR_DE_ROLAGEM = 4;

export function AppHeader({ name, photoUrl }: AppHeaderProps) {
  const [rolou, setRolou] = useState(false);
  const caminho = usePathname() ?? '';

  useEffect(() => {
    const aoRolar = () => {
      setRolou(window.scrollY > LIMIAR_DE_ROLAGEM);
    };

    // Chamada imediata: a página pode abrir já rolada (voltar do navegador).
    aoRolar();
    window.addEventListener('scroll', aoRolar, { passive: true });
    return () => window.removeEventListener('scroll', aoRolar);
  }, []);

  const iniciais = iniciaisDe(name);

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-30 bg-surface transition-shadow duration-200',
        'lg:bg-[rgba(247,249,252,0.92)] lg:backdrop-blur-[10px]',
        rolou
          ? 'shadow-[0_6px_20px_rgba(11,31,75,0.08)]'
          : 'shadow-[0_1px_0_var(--border)] lg:shadow-none',
      )}
    >
      <div className="tela flex h-[68px] items-center gap-3 py-3 lg:h-[88px] lg:gap-5 lg:py-4">
        <Link
          href="/inicio"
          aria-label="Ir para o início"
          className="-m-1 rounded-field p-1"
        >
          <Logo size={44} className="lg:hidden" />
          {/* O `hidden` fica no invólucro: no próprio Logo ele empataria com o
              `inline-flex` base (o `cn` não faz merge de utilitários) e perderia. */}
          <span className="hidden lg:inline-flex">
            <Logo size={54} />
          </span>
        </Link>

        <nav
          aria-label="Navegação principal"
          className="mx-auto hidden items-center gap-1 rounded-pill bg-surface p-[7px] shadow-[0_6px_20px_rgba(11,31,75,0.08)] lg:flex"
        >
          {DESTINOS.map((destino) => {
            const ativo = estaAtivo(caminho, destino);

            return (
              <Link
                key={destino.href}
                href={destino.href}
                aria-current={ativo ? 'page' : undefined}
                className={cn(
                  'flex items-center gap-[9px] rounded-pill px-6 py-3 text-[16px] font-extrabold',
                  'transition-colors duration-150 [&_svg]:size-[19px]',
                  ativo ? 'bg-navy text-white' : 'text-muted hover:bg-[#F1F5FA] hover:text-navy',
                )}
              >
                {destino.icone}
                {destino.rotulo}
              </Link>
            );
          })}
        </nav>

        <Link
          href="/perfil"
          aria-label={`Abrir o perfil de ${name}`}
          className="ml-auto flex items-center gap-2 lg:ml-0"
        >
          <span className="flex size-11 flex-none items-center justify-center overflow-hidden rounded-full bg-navy lg:size-14 lg:bg-[#D8F0E6]">
            {photoUrl ? (
              <Image
                src={photoUrl}
                alt=""
                width={56}
                height={56}
                // Foto de perfil pode chegar como caminho local, data URL ou URL
                // externa; só a primeira passa pelo otimizador do Next.
                unoptimized={!photoUrl.startsWith('/')}
                className="size-full object-cover"
              />
            ) : (
              <span
                aria-hidden="true"
                className="text-[15px] font-extrabold leading-none text-yellow lg:text-[19px] lg:text-navy"
              >
                {iniciais}
              </span>
            )}
          </span>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--muted)"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="hidden lg:block"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </Link>
      </div>
    </header>
  );
}

export default AppHeader;
