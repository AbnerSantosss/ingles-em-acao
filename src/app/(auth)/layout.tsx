/**
 * Moldura única das telas de acesso (`/entrar`, `/criar-conta`,
 * `/esqueci-senha`, `/redefinir-senha`, `/verificar-email`).
 *
 * É a réplica do card de login do protótipo (`prototype/mobile.dc.html`,
 * bloco `<sc-if value="{{ isLogin }}">`): coluna centralizada, card branco com
 * raio de 26px (`rounded-hero`) e sombra de hero, logo WSA English no topo
 * (44px de altura no celular, 52px a partir de 640px). O que muda de uma tela
 * para outra é só o miolo.
 *
 * Atrás de tudo vai a arte navy da marca (`FundoDeAcesso`), no lugar do `--bg`
 * claro do protótipo. Por isso o texto de fora do card é claro: sobre o navy,
 * `text-muted-2` e `text-teal` não passariam de AA. O card em si não muda.
 *
 * Duas saídas para a landing, pedido do dono: a logo do topo do card e o link
 * discreto no rodapé do bloco. O rodapé, e não acima do card, para não empurrar
 * o card para fora do centro em tela baixa (celular com teclado aberto) nem
 * competir com o botão principal do formulário.
 */
import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

import { FundoDeAcesso } from "@/components/auth/FundoDeAcesso";
import { LogoWSA } from "@/components/ui/LogoWSA";
import { MODELO_DE_TITULO, NOME_DO_PRODUTO } from "@/lib/marca";

export const metadata: Metadata = {
  // As páginas filhas informam só o nome da tela ("Entrar", "Criar conta"...).
  // `absolute`, e não `default`: o layout raiz já tem modelo de título, e o
  // Next aplicaria esse modelo ao `default` daqui, dobrando a marca
  // ("WSA English · WSA English"). Ver `resolve-title.js` do Next.
  title: { template: MODELO_DE_TITULO, absolute: NOME_DO_PRODUTO },
};

/** Traço dos ícones, igual ao do leitor da aula. */
const TRACO_ICONE = {
  fill: "none",
  stroke: "currentColor",
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

export default function LayoutDeAcesso({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <>
      <FundoDeAcesso />

      {/* `relative`: o fundo é fixo e posicionado, então sem isto ele ficaria
          por cima do card. */}
      <main className="relative z-10 grid min-h-dvh place-items-center px-4 py-10">
        <div className="w-full max-w-[460px]">
          <section className="rounded-hero bg-surface px-[22px] py-7 shadow-hero sm:px-[34px] sm:py-[38px]">
            <div className="mb-[26px]">
              {/* Fundo branco: letreiro navy. 44px no celular, 52px a partir de 640px.
                  A altura inline é a maior; a classe com `!` vence o inline.
                  O `inline-flex` no link deixa a área de clique do tamanho exato
                  da logo, sem a faixa vazia até a borda do card. */}
              <Link
                href="/"
                aria-label="Ir para a página inicial do WSA English"
                className="inline-flex rounded-field"
              >
                <LogoWSA fundo="claro" altura={52} prioridade className="h-11! sm:h-13!" />
              </Link>
            </div>

            {children}
          </section>

          {/* O rodapé do bloco: lema e saída para a landing, sobre a arte. */}
          <div className="rodape-acesso mt-6 pt-2 pb-3 text-center">
            <p className="text-[15px] leading-snug text-white/85 print:text-muted">
              42 aulas de inglês, no seu ritmo.
              <br />
              <span className="manuscrito text-[19px] text-yellow print:text-teal-texto">
                Small steps, big results.
              </span>
            </p>

            <p className="mt-3">
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-pill px-2 py-1 text-[14px] font-semibold text-white/75 transition-colors hover:text-white focus-visible:outline-yellow print:hidden"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" strokeWidth="2.4" aria-hidden="true" {...TRACO_ICONE}>
                  <path d="M19 12H5" />
                  <path d="m11 6-6 6 6 6" />
                </svg>
                Voltar para a página inicial
              </Link>
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
