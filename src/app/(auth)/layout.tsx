/**
 * Moldura única das telas de acesso (`/entrar`, `/criar-conta`,
 * `/esqueci-senha`, `/redefinir-senha`, `/verificar-email`).
 *
 * É a réplica do card de login do protótipo (`prototype/mobile.dc.html`,
 * bloco `<sc-if value="{{ isLogin }}">`): fundo `--bg`, coluna centralizada,
 * card branco com raio de 26px (`rounded-hero`) e sombra de hero, logo WSA
 * English no topo (44px de altura no celular, 52px a partir de 640px). O que
 * muda de uma tela para outra é só o miolo.
 */
import type { Metadata } from "next";
import type { ReactNode } from "react";

import { LogoWSA } from "@/components/ui/LogoWSA";
import { MODELO_DE_TITULO, NOME_DO_PRODUTO } from "@/lib/marca";

export const metadata: Metadata = {
  // As páginas filhas informam só o nome da tela ("Entrar", "Criar conta"...).
  // `absolute`, e não `default`: o layout raiz já tem modelo de título, e o
  // Next aplicaria esse modelo ao `default` daqui, dobrando a marca
  // ("WSA English · WSA English"). Ver `resolve-title.js` do Next.
  title: { template: MODELO_DE_TITULO, absolute: NOME_DO_PRODUTO },
};

export default function LayoutDeAcesso({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <main className="grid min-h-dvh place-items-center px-4 py-10">
      <div className="w-full max-w-[460px]">
        <section className="rounded-hero bg-surface px-[22px] py-7 shadow-hero sm:px-[34px] sm:py-[38px]">
          <div className="mb-[26px]">
            {/* Fundo branco: letreiro navy. 44px no celular, 52px a partir de 640px.
                A altura inline é a maior; a classe com `!` vence o inline. */}
            <LogoWSA fundo="claro" altura={52} prioridade className="h-11! sm:h-13!" />
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
