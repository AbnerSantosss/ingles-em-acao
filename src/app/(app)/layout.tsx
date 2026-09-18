/**
 * Moldura das telas logadas (`/inicio`, `/trilha`, `/progresso`, `/perfil`,
 * `/aula/[slug]`): cabeçalho fixo em cima, barra de navegação fixa embaixo e o
 * conteúdo no meio, numa coluna de 460px. A partir de 1024px a coluna vai a
 * 1024px, a navegação sobe para o cabeçalho e a barra inferior some.
 *
 * ⚠️ A guarda de sessão é aqui, não no middleware: o middleware só olha o
 * cookie, quem confere no banco é o `requireUser()` (CONTRACT §5.4). Ele
 * redireciona sozinho quando não há sessão válida — nunca devolve `null`.
 */
import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { AppHeader } from '@/components/app/AppHeader';
import { BottomNav } from '@/components/app/BottomNav';
import { requireUser } from '@/lib/auth/session';

export const metadata: Metadata = {
  title: { template: '%s · Inglês em Ação', default: 'Inglês em Ação' },
};

export default async function LayoutDoApp({
  children,
}: Readonly<{ children: ReactNode }>) {
  const usuario = await requireUser();

  return (
    <div className="min-h-dvh bg-bg">
      <AppHeader name={usuario.name} photoUrl={usuario.photoUrl} />

      {/*
        O espaço de cima compensa o cabeçalho fixo (ALTURA_CABECALHO + 16 /
        ALTURA_CABECALHO_DESKTOP + 14); o de baixo, a barra de navegação
        (ALTURA_NAV + 16) + a área segura do iPhone. Sem eles o último cartão de
        cada tela fica escondido atrás da barra. No desktop não há barra.
      */}
      <main className="tela pb-[calc(90px+env(safe-area-inset-bottom))] pt-[84px] lg:pb-[60px] lg:pt-[102px]">
        {children}
      </main>

      <BottomNav />
    </div>
  );
}
