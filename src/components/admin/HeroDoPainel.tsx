/**
 * Faixa-hero do dashboard: título da tela sobre o background da marca.
 *
 * É peça SÓ do dashboard (`/admin`). As outras telas do painel abrem direto no
 * conteúdo, sem faixa; por isso ela não mora no `AdminShell`.
 *
 * ⚠️ O `<h1>` precisa continuar com o nome acessível "O estado do produto": os
 * testes e2e (`admin-acesso`, `admin-publicacao`) procuram o título por esse
 * texto. A última palavra vai num `<span>` só para receber a cor; o espaço antes
 * dele é explícito (`{' '}`) para o nome não virar "O estado doproduto".
 *
 * ⚠️ Contraste: a imagem tem o globo iluminado do centro para a direita, e em
 * telas estreitas o texto passa por cima dele. O degradê navy por baixo do texto
 * garante AA mesmo quando a imagem não carrega (o fallback é `bg-navy`).
 */
import type { ReactNode } from 'react';

export type HeroDoPainelProps = {
  /** Texto de apoio abaixo do título. */
  children: ReactNode;
};

export function HeroDoPainel({ children }: HeroDoPainelProps) {
  return (
    <header
      className="relative overflow-hidden rounded-hero bg-navy bg-cover bg-right shadow-hero"
      // Inline de propósito: um `url(/...)` dentro do CSS passaria pelo
      // empacotador, que pode tentar resolver o caminho como módulo.
      style={{ backgroundImage: 'url(/brand/admin-topo.webp)' }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(90deg, rgba(10,31,78,0.94) 0%, rgba(10,31,78,0.82) 42%, rgba(10,31,78,0.18) 78%, rgba(10,31,78,0) 100%)',
        }}
      />

      {/* O `pb` maior abre espaço para a primeira seção subir sobre a faixa. */}
      <div className="relative flex items-start gap-6 px-5 pb-20 pt-7 lg:px-8 lg:pb-24 lg:pt-9">
        <div className="min-w-0 max-w-[60ch] flex-1">
          <p className="kicker m-0 tracking-[0.28em] text-yellow">Painel</p>
          <h1 className="m-0 mt-2 text-[30px] font-black leading-[1.1] tracking-[-0.02em] text-white lg:text-[38px]">
            O estado do{' '}
            <span className="text-yellow">produto</span>
          </h1>
          <p className="m-0 mt-3 text-[15px] font-semibold leading-snug text-white/85">
            {children}
          </p>
        </div>

        {/* Assinaturas da marca: decorativas, só onde sobra largura. */}
        <div
          aria-hidden="true"
          lang="en"
          className="hidden flex-none items-start gap-8 pr-24 xl:flex"
          style={{ textShadow: '0 2px 12px rgba(5,15,40,0.85)' }}
        >
          <span className="manuscrito block -rotate-6 text-[34px] text-white">
            A better you
            <span className="mt-1 block h-[3px] w-16 rounded-pill bg-yellow" />
          </span>
          <span className="block pt-1 text-[12px] font-bold uppercase leading-[1.5] tracking-[0.22em] text-white/80">
            Small steps
            <br />
            big results
          </span>
        </div>
      </div>
    </header>
  );
}

export default HeroDoPainel;
