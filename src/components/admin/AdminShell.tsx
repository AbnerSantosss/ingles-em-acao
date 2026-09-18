/**
 * Casca do painel: faixa de ambiente, barra lateral, cabeçalho e a área de
 * conteúdo onde cada tela é montada.
 *
 * O painel é **desktop-first** (o app do aluno é mobile-first; conteúdo não se
 * edita bem em 430px), mas usa os mesmos tokens e a mesma Figtree do contrato
 * §3 — não é um tema à parte. Por isso nada aqui usa `.tela`: aquela classe
 * prende a largura em 460px, que é o certo para o aluno e o errado para uma
 * tabela de 42 aulas.
 */
import type { ReactNode } from 'react';

import { AdminHeader } from '@/components/admin/AdminHeader';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { BannerDeAmbiente } from '@/components/admin/BannerDeAmbiente';
import type { SessionUser } from '@/lib/auth/session';

export type AdminShellProps = {
  usuario: SessionUser;
  children: ReactNode;
};

export function AdminShell({ usuario, children }: AdminShellProps) {
  return (
    <div className="min-h-dvh bg-bg">
      <BannerDeAmbiente />

      <div className="lg:flex lg:items-start">
        <AdminSidebar />

        <div className="flex min-w-0 flex-1 flex-col">
          <AdminHeader usuario={usuario} />

          <main className="mx-auto w-full max-w-[1180px] flex-1 px-4 py-6 lg:px-8 lg:py-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}

export default AdminShell;
