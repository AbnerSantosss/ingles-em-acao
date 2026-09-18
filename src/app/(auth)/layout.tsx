/**
 * Moldura única das telas de acesso (`/entrar`, `/criar-conta`,
 * `/esqueci-senha`, `/redefinir-senha`, `/verificar-email`).
 *
 * É a réplica do card de login do protótipo (`prototype/mobile.dc.html`,
 * bloco `<sc-if value="{{ isLogin }}">`): fundo `--bg`, coluna centralizada,
 * card branco com raio de 26px (`rounded-hero`) e sombra de hero, logo de 58px
 * no topo. O que muda de uma tela para outra é só o miolo.
 */
import type { Metadata } from "next";
import type { ReactNode } from "react";

import { Logo } from "@/components/ui/Logo";

export const metadata: Metadata = {
  // As páginas filhas informam só o nome da tela ("Entrar", "Criar conta"...).
  title: { template: "%s · Inglês em Ação", default: "Inglês em Ação" },
};

export default function LayoutDeAcesso({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <main className="grid min-h-dvh place-items-center px-4 py-10">
      <div className="w-full max-w-[460px]">
        <section className="rounded-hero bg-surface px-[22px] py-7 shadow-hero sm:px-[34px] sm:py-[38px]">
          <div className="mb-[26px]">
            <Logo size={58} />
          </div>

          {children}
        </section>

        <p className="mt-6 text-center text-[15px] leading-snug text-muted-2">
          42 aulas de inglês, no seu ritmo.
          <br />
          <span className="manuscrito text-[19px] text-teal">
            Small steps, big results.
          </span>
        </p>
      </div>
    </main>
  );
}
