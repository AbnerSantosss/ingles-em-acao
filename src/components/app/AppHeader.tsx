'use client';

/**
 * Cabeçalho fixo do app: logo WSA English à esquerda, avatar à direita. A logo
 * tem 28px de altura no celular (só o globo abaixo de 360px de largura, ver a
 * prop `compacta` de `LogoWSA`) e 40px a partir de 1024px.
 *
 * A partir de 1024px (`lg`) segue o design desktop do Claude Designer: a
 * navegação principal numa pílula centralizada (a barra inferior some) e avatar
 * de 56px.
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

import { LogoWSA } from '@/components/ui/LogoWSA';
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
        // Celular com recorte na tela (app instalado ou deitado): o conteúdo desce
        // abaixo do recorte. As laterais ficam na linha de dentro. Pedido do 05.
        'pt-[env(safe-area-inset-top)]',
        'lg:bg-[rgba(247,249,252,0.92)] lg:backdrop-blur-[10px]',
        rolou
          ? 'shadow-[0_6px_20px_rgba(11,31,75,0.08)]'
          : 'shadow-[0_1px_0_var(--border)] lg:shadow-none',
      )}
    >
      <div className="tela flex h-[68px] items-center gap-3 py-3 pl-[max(16px,env(safe-area-inset-left))] pr-[max(16px,env(safe-area-inset-right))] lg:h-[88px] lg:gap-5 lg:py-4 lg:pl-[max(20px,env(safe-area-inset-left))] lg:pr-[max(20px,env(safe-area-inset-right))]">
        <Link
          href="/inicio"
          aria-label="WSA English, início"
          className="-m-1 rounded-field p-1"
        >
          {/* 28px no celular, 40px a partir de 1024px; abaixo de 360px de largura,
              só o globo (`compacta`). A classe com `!` vence a altura inline. */}
          <LogoWSA fundo="claro" altura={40} compacta prioridade className="h-7! lg:h-10!" />
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
