/**
 * Landing page pública — o planejamento está em `docs/LANDING.md`.
 *
 * Componente de servidor, sem nenhum JS de cliente: o FAQ usa `<details>` nativo
 * (abre por teclado, é anunciado como expandido/recolhido e funciona sem script).
 *
 * ⚠️ COPY: nenhuma frase nasce aqui — tudo vem de `copy.ts`.
 *
 * ⚠️ PRIMEIRA DOBRA ESCURA. Cabeçalho e hero dividem um bloco navy com a arte da
 * marca ao fundo (`public/brand/hero-*.webp`). O `<header>` fica FORA do `<main>`
 * (landmarks corretos) e é posicionado por cima do hero com `absolute`; por isso o
 * hero reserva o espaço dele com `pt-24`. Mudou a altura do cabeçalho? Mude lá.
 * Todo link sobre o escuro leva cor própria de hover e de foco: o `a:hover` global
 * é navy e o anel de foco global é azul — os dois somem nesse fundo.
 *
 * ⚠️ TRÊS CTAs, TRÊS RÓTULOS. Um leitor de tela lista os links da página; três
 * "CRIAR CONTA" iguais seriam indistinguíveis. Cada um diz para onde leva.
 *
 * ⚠️ D26 — dois modos, uma condição: sem nenhum link de checkout a página diz que
 * preço ainda não existe e manda para o cadastro; com link, cada plano ganha o
 * botão de compra, a nota muda e a garantia legal aparece.
 */
import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';

import { LogoWSA } from '@/components/ui/LogoWSA';
import { NOME_DO_PLANO, type Plano } from '@/lib/planos';

import { copyDaLanding as copy } from './copy';
import {
  CelularDaAula,
  Icone,
  type NomeDoIcone,
  OndaDoHero,
  RetratoDoProfessor,
  SkylineDeLondres,
  TrilhaDas42,
} from './ilustracoes';

export type PlanoDaLanding = Plano;

/** O link de compra de cada plano, já resolvido (o do plano ou o global). */
export type OfertasDaLanding = Record<PlanoDaLanding, string | null>;

const ICONES_DA_DOR: NomeDoIcone[] = ['relogio', 'grafico', 'balao', 'porta'];

const PASSOS: { icone: NomeDoIcone; cor: string; cartao: string }[] = [
  { icone: 'livro', cor: 'bg-teal text-white', cartao: 'border-teal/40 bg-mint-1' },
  { icone: 'lapis', cor: 'bg-blue text-white', cartao: 'border-blue/30 bg-[#EAF2FE]' },
  { icone: 'degraus', cor: 'bg-yellow text-navy', cartao: 'border-yellow/60 bg-[#FEF7E0]' },
];

const ICONES_DO_METODO: NomeDoIcone[] = ['bussola', 'degraus', 'lapis', 'relogio'];

const VISUAL_DO_PLANO: Record<PlanoDaLanding, { icone: NomeDoIcone; faixa: string; cartao: string; icon: string }> = {
  ESSENCIAL: { icone: 'livro', faixa: 'bg-navy', cartao: 'border-border bg-surface', icon: 'bg-navy text-white' },
  PREMIUM: { icone: 'microfone', faixa: 'bg-purple', cartao: 'border-purple/50 bg-[#F3EEFC]', icon: 'bg-purple text-white' },
};

/* ------------------------------------------------------------------ peças */

function CtaPrincipal({
  rotulo,
  className = '',
  comSeta = false,
}: {
  rotulo: string;
  className?: string;
  /** Seta → à direita do rótulo (hero). Decorativa: o rótulo já diz para onde leva. */
  comSeta?: boolean;
}) {
  return (
    <Link
      href="/criar-conta"
      className={`inline-flex min-h-13 w-full items-center justify-center gap-3 rounded-pill bg-yellow px-8 text-center text-[15px] font-black tracking-wide text-navy shadow-card transition-colors hover:bg-yellow-hover sm:w-auto ${className}`}
    >
      {rotulo}
      {comSeta ? (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className="size-5 shrink-0"
        >
          <path d="M4 12h16M14 6l6 6-6 6" />
        </svg>
      ) : null}
    </Link>
  );
}

function TituloDeSecao({ id, children, claro = false }: { id: string; children: ReactNode; claro?: boolean }) {
  return (
    <h2
      id={id}
      className={`max-w-3xl text-[28px] leading-tight font-black text-balance sm:text-[34px] ${claro ? 'text-white' : 'text-navy'}`}
    >
      {children}
    </h2>
  );
}

function Abertura({ children }: { children: ReactNode }) {
  return <p className="max-w-2xl text-[17px] leading-relaxed text-muted-3 text-pretty">{children}</p>;
}

/* ----------------------------------------------------------------- página */

export function Landing({ ofertas }: { ofertas: OfertasDaLanding }) {
  const ano = new Date().getFullYear();
  const vendendo = copy.planos.lista.some((plano) => Boolean(ofertas[plano.chave]));

  return (
    <div className="relative flex min-h-dvh flex-col overflow-x-hidden bg-bg">
      {/* ⚠️ Amarelo, não navy: o que fica atrás dele agora é o hero escuro. */}
      <a
        href="#conteudo"
        className="absolute top-3 left-3 z-50 inline-flex min-h-11 -translate-y-[200%] items-center rounded-pill bg-yellow px-5 text-[15px] font-bold text-navy focus:translate-y-0 focus-visible:outline-white"
      >
        {copy.a11y.pular}
      </a>

      {/* ------------------------------------------------------- cabeçalho */}
      {/* ⚠️ `absolute`: flutua sobre o bloco escuro do hero (ver o topo do arquivo). */}
      <header className="absolute inset-x-0 top-0 z-20">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8 lg:py-5">
          <Link
            href="/"
            aria-label="WSA English, início"
            className="inline-flex min-h-11 items-center rounded-card focus-visible:outline-yellow"
          >
            {/* ⚠️ A altura vai inline no componente; é o `!` que deixa o `lg:` vencer. */}
            <LogoWSA fundo="escuro" altura={40} compacta prioridade className="h-8! lg:h-10!" />
          </Link>

          <nav aria-label={copy.a11y.navegacao} className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {copy.nav.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="inline-flex min-h-11 items-center rounded-pill px-3 text-[15px] font-semibold text-white hover:bg-white/10 hover:text-white focus-visible:outline-yellow"
                  >
                    {item.rotulo}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <Link
            href="/entrar"
            className="inline-flex min-h-11 items-center rounded-pill border-2 border-yellow bg-navy/85 px-5 text-[15px] font-bold text-white transition-colors hover:bg-navy hover:text-white focus-visible:outline-yellow"
          >
            {copy.entrar}
          </Link>
        </div>
      </header>

      <main id="conteudo" className="relative z-10 flex flex-1 flex-col">
        {/* ------------------------------------------------------------ hero */}
        {/* `bg-navy` é o fallback: o texto já é legível antes de a arte chegar. */}
        <section aria-labelledby="hero-titulo" className="relative isolate overflow-hidden bg-navy text-white">
          {/*
            Arte de fundo, decorativa. `<picture>` puro para o navegador baixar só um
            dos dois arquivos (já são WebP de ~60 KB; o otimizador não ganharia nada).
            ⚠️ Ancorada à DIREITA: globo e Big Ben moram lá e não podem ser cortados.
          */}
          <picture>
            <source media="(min-width: 1024px)" srcSet="/brand/hero-desktop.webp" />
            <img
              src="/brand/hero-mobile.webp"
              alt=""
              aria-hidden="true"
              fetchPriority="high"
              decoding="async"
              className="absolute inset-0 -z-20 size-full max-w-none object-cover object-right"
            />
          </picture>
          {/*
            ⚠️ CONTRASTE AA — véu do desktop: protege só a coluna da esquerda e some
            antes do globo. O do celular fica dentro da coluna de texto, logo abaixo.
          */}
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 hidden bg-linear-to-r from-navy/85 from-35% via-navy/40 via-55% to-transparent to-70% lg:block"
          />

          <div className="mx-auto w-full max-w-6xl px-4 pt-24 sm:px-6 lg:px-8 lg:pt-32">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:items-end lg:gap-12">
              <div className="relative flex flex-col items-start gap-5 lg:self-center lg:pb-20">
                {/*
                  ⚠️ CONTRASTE AA — véu do celular. A dobra é mais alta que a arte, o
                  `cover` amplia o globo e ele passa por baixo do texto. O véu cobre a
                  largura toda (do cabeçalho ao fim da nota) e esmaece no pé, sem risca.
                */}
                <div
                  aria-hidden="true"
                  className="absolute -inset-x-4 -top-24 -bottom-10 -z-10 bg-linear-to-r from-navy/90 via-navy/85 to-navy/75 [mask-image:linear-gradient(to_bottom,black_88%,transparent)] sm:-inset-x-6 lg:hidden"
                />

                <span className="inline-flex max-w-full items-center rounded-pill border-2 border-yellow/80 px-4 py-2 text-[12px] font-extrabold tracking-[0.08em] text-yellow uppercase">
                  {copy.hero.selo}
                </span>

                <h1
                  id="hero-titulo"
                  className="max-w-2xl text-[36px] leading-[1.08] font-black text-balance text-white sm:text-[48px] lg:text-[52px] xl:text-[58px]"
                >
                  {copy.hero.titulo.antes} <span className="text-yellow">{copy.hero.titulo.destaque}</span>
                </h1>

                <p className="max-w-xl text-[18px] leading-relaxed text-[#C9D6EC] text-pretty">{copy.hero.subtitulo}</p>

                <div className="flex w-full flex-col items-stretch gap-2 pt-1 sm:w-auto sm:flex-row sm:items-center sm:gap-3">
                  <CtaPrincipal rotulo={copy.hero.cta} comSeta className="focus-visible:outline-white" />
                  <Link
                    href="/entrar"
                    className="inline-flex min-h-11 items-center justify-center rounded-pill px-4 text-[15px] font-semibold text-white underline underline-offset-4 hover:text-yellow focus-visible:outline-yellow"
                  >
                    {copy.hero.jaTenhoConta}
                  </Link>
                </div>

                <p className="text-[14px] text-[#C9D6EC]">{copy.hero.nota}</p>
              </div>

              {/* Celular, com as duas assinaturas da marca por cima (em inglês). */}
              <div className="mx-auto w-full max-w-[420px]">
                {/* ⚠️ No desktop esta coluna cai em cima do globo dourado: o cartão navy garante o AA. */}
                <div className="mb-3 flex items-end justify-between gap-4 lg:rounded-card lg:bg-navy/80 lg:px-5 lg:py-4 lg:backdrop-blur-sm">
                  <p lang="en" className="text-[12px] leading-[1.9] font-semibold tracking-[0.3em] text-[#C9D6EC] uppercase">
                    {/* Uma palavra por linha é só arte: o leitor de tela ouve a frase inteira. */}
                    <span className="sr-only">{copy.hero.lema}</span>
                    <span aria-hidden="true">
                      {copy.hero.lema.split(' ').map((palavra, i) => (
                        <span key={`${i}-${palavra}`} className="block">
                          {palavra.replace(/[.,]/g, '')}
                        </span>
                      ))}
                      <span className="mt-2 block h-0.5 w-10 rounded-pill bg-yellow" />
                    </span>
                  </p>
                  <p
                    lang="en"
                    className="manuscrito max-w-[7ch] -rotate-6 border-b-2 border-yellow/70 pb-1 text-center text-[34px] text-[#C9D6EC] sm:text-[40px]"
                  >
                    {copy.hero.assinatura}
                  </p>
                </div>
                <CelularDaAula className="block h-auto w-full" />
              </div>
            </div>
          </div>

          {/* Faixa de recursos. ⚠️ `-mt-10`: a onda sobe por cima do pé do celular. */}
          <div className="relative z-10 -mt-10">
            <OndaDoHero className="block h-14 w-full" />
            <div className="bg-navy pt-2 pb-8">
              {/* ⚠️ 320px: três colunas só cabem com o texto SOB o ícone; lado a lado a partir de 480px. */}
              <ul className="mx-auto grid w-full max-w-6xl grid-cols-3 gap-2 px-4 sm:gap-6 sm:px-6 lg:px-8">
                {copy.hero.recursos.map((item) => (
                  <li
                    key={item.icone}
                    className="flex min-w-0 flex-col items-center gap-2 text-center min-[480px]:flex-row min-[480px]:gap-3 min-[480px]:text-left lg:justify-center"
                  >
                    <Image
                      src={`/brand/icone-${item.icone}.webp`}
                      alt=""
                      width={48}
                      height={48}
                      className="size-11 shrink-0 sm:size-12"
                    />
                    <div className="min-w-0">
                      <p className="text-[13px] leading-tight font-extrabold text-white sm:text-[15px]">{item.titulo}</p>
                      <p className="mt-0.5 text-[12px] leading-snug text-[#C9D6EC] sm:text-[14px]">{item.corpo}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Garantias: faixa de transição, já no fundo claro, entre o hero e a dor. */}
        <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          <ul className="grid gap-3 sm:grid-cols-3">
            {copy.hero.garantias.map((item) => (
              <li key={item.titulo} className="flex gap-3 rounded-card border border-border bg-surface p-4 shadow-card">
                <Icone nome="check" className="bg-teal text-white" tamanho="size-9" />
                <div>
                  <h3 className="text-[16px] font-extrabold text-navy">{item.titulo}</h3>
                  <p className="mt-0.5 text-[14px] leading-snug text-muted">{item.corpo}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* ------------------------------------------------------------- dor */}
        <section aria-labelledby="dor" className="bg-surface py-14">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-4 sm:px-6 lg:px-8">
            <TituloDeSecao id="dor">{copy.dor.titulo}</TituloDeSecao>
            <Abertura>{copy.dor.corpo}</Abertura>
            <ul className="grid gap-4 sm:grid-cols-2">
              {copy.dor.itens.map((item, i) => (
                <li key={item.titulo} className="flex gap-4 rounded-card border border-border bg-bg p-5">
                  <Icone nome={ICONES_DA_DOR[i]} className="bg-[#FDE8EA] text-danger" />
                  <div>
                    <h3 className="text-[17px] font-extrabold text-navy">{item.titulo}</h3>
                    <p className="mt-1 text-[15px] leading-relaxed text-muted">{item.corpo}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ------------------------------------ o que você vai conseguir dizer */}
        <section
          id="o-que-voce-vai-dizer"
          aria-labelledby="conquistas-titulo"
          className="scroll-mt-6 bg-navy py-14 text-white"
        >
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-4 sm:px-6 lg:px-8">
            <TituloDeSecao id="conquistas-titulo" claro>
              {copy.conquistas.titulo}
            </TituloDeSecao>
            <p className="max-w-2xl text-[17px] leading-relaxed text-[#C9D6EC]">{copy.conquistas.corpo}</p>

            <div className="rounded-card bg-surface px-3 py-4 sm:px-6">
              <TrilhaDas42 className="h-auto w-full" />
            </div>

            <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {copy.conquistas.marcos.map((marco) => (
                <li key={marco.aulas} className="flex flex-col gap-2 rounded-card border border-white/15 bg-navy-light/60 p-5">
                  <span className="text-[12px] font-extrabold tracking-[0.08em] text-yellow uppercase">{marco.aulas}</span>
                  <h3 className="text-[18px] leading-snug font-extrabold">{marco.titulo}</h3>
                  <p lang="en" className="manuscrito text-[22px] text-[#8FE3D6]">
                    “{marco.exemplo}”
                  </p>
                </li>
              ))}
            </ol>
            <p className="text-[14px] text-[#C9D6EC]">{copy.conquistas.nota}</p>
          </div>
        </section>

        {/* ---------------------------------------------------- como funciona */}
        <section
          id="como-funciona"
          aria-labelledby="como-funciona-titulo"
          className="mx-auto flex w-full max-w-6xl scroll-mt-6 flex-col gap-5 px-4 py-14 sm:px-6 lg:px-8"
        >
          <TituloDeSecao id="como-funciona-titulo">{copy.comoFunciona.titulo}</TituloDeSecao>
          <Abertura>{copy.comoFunciona.corpo}</Abertura>
          <ol className="grid gap-4 sm:grid-cols-3">
            {copy.comoFunciona.passos.map((passo, i) => (
              <li key={passo.titulo} className={`flex flex-col gap-3 rounded-card border p-5 ${PASSOS[i].cartao}`}>
                <div className="flex items-center gap-3">
                  <Icone nome={PASSOS[i].icone} className={PASSOS[i].cor} />
                  <span className="text-[13px] font-extrabold tracking-[0.08em] text-muted uppercase">Passo {i + 1}</span>
                </div>
                <h3 className="text-[20px] font-black text-navy">{passo.titulo}</h3>
                <p className="text-[15px] leading-relaxed text-muted-3">{passo.corpo}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* ----------------------------------------------------------- método */}
        <section id="metodo" aria-labelledby="metodo-titulo" className="scroll-mt-6 bg-surface py-14">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-4 sm:px-6 lg:px-8">
            <TituloDeSecao id="metodo-titulo">{copy.metodo.titulo}</TituloDeSecao>
            <Abertura>{copy.metodo.corpo}</Abertura>
            <ul className="grid gap-4 sm:grid-cols-2">
              {copy.metodo.pilares.map((pilar, i) => (
                <li key={pilar.titulo} className="flex gap-4 rounded-card border border-border bg-bg p-5">
                  <Icone nome={ICONES_DO_METODO[i]} className="bg-rail text-navy" />
                  <div>
                    <h3 className="text-[17px] font-extrabold text-navy">{pilar.titulo}</h3>
                    <p className="mt-1 text-[15px] leading-relaxed text-muted">{pilar.corpo}</p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="flex flex-col gap-3 rounded-card border-2 border-teal bg-mint-1 p-5 sm:flex-row sm:gap-4 sm:p-6">
              <Icone nome="escudo" className="bg-teal text-white" />
              <div>
                <h3 className="text-[18px] font-black text-navy">{copy.metodo.firewallTitulo}</h3>
                <p className="mt-1 text-[15px] leading-relaxed text-muted-3">{copy.metodo.firewallCorpo}</p>
              </div>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------- o que você recebe */}
        <section
          aria-labelledby="recebe-titulo"
          className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-4 py-14 sm:px-6 lg:px-8"
        >
          <TituloDeSecao id="recebe-titulo">{copy.recebe.titulo}</TituloDeSecao>
          <Abertura>{copy.recebe.corpo}</Abertura>
          <ul className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
            {copy.recebe.itens.map((item) => (
              <li key={item.titulo} className="flex gap-3">
                <Icone nome="check" className="mt-0.5 bg-navy text-white" tamanho="size-7" />
                <div>
                  <h3 className="text-[17px] font-extrabold text-navy">{item.titulo}</h3>
                  <p className="mt-1 text-[15px] leading-relaxed text-muted">{item.corpo}</p>
                  <span
                    className={`mt-2 inline-flex rounded-pill px-3 py-1 text-[12px] font-bold ${item.premium ? 'bg-[#F3EEFC] text-purple' : 'bg-rail text-navy'}`}
                  >
                    {item.plano}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* ------------------------------------------------------- professor */}
        <section className="mx-auto w-full max-w-6xl px-4 pb-14 sm:px-6 lg:px-8" aria-labelledby="professor-titulo">
          <div className="flex flex-col items-start gap-6 rounded-hero border border-border bg-surface p-6 shadow-hero sm:flex-row sm:items-center sm:gap-10 sm:p-8">
            <RetratoDoProfessor rotulo={copy.professor.retratoAlt} className="h-auto w-44 shrink-0 sm:w-56" />
            <div className="flex flex-col gap-3">
              <span className="text-[12px] font-extrabold tracking-[0.08em] text-teal-texto uppercase">{copy.professor.rotulo}</span>
              <h2 id="professor-titulo" className="text-[28px] font-black text-navy sm:text-[34px]">
                {copy.professor.nome}
              </h2>
              <p className="text-[15px] font-semibold text-muted">{copy.professor.papel}</p>
              <p className="text-[17px] leading-relaxed text-muted-3">{copy.professor.corpo}</p>
              <p className="text-[17px] leading-relaxed text-muted-3">{copy.professor.corpo2}</p>
            </div>
          </div>
        </section>

        {/* ----------------------------------------------------------- planos */}
        <section id="planos" aria-labelledby="planos-titulo" className="scroll-mt-6 bg-surface py-14">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-4 sm:px-6 lg:px-8">
            <TituloDeSecao id="planos-titulo">{copy.planos.titulo}</TituloDeSecao>
            <Abertura>{copy.planos.corpo}</Abertura>

            <ul className="grid gap-4 md:grid-cols-2">
              {copy.planos.lista.map((plano) => {
                const visual = VISUAL_DO_PLANO[plano.chave];
                const link = ofertas[plano.chave];
                return (
                  <li key={plano.chave} className={`flex flex-col gap-3 rounded-card border-2 p-5 ${visual.cartao}`}>
                    <span aria-hidden="true" className={`h-1.5 w-12 rounded-pill ${visual.faixa}`} />
                    <div className="flex items-center gap-3">
                      <Icone nome={visual.icone} className={visual.icon} />
                      <div>
                        <h3 className="text-[20px] font-black text-navy">{NOME_DO_PLANO[plano.chave]}</h3>
                        <p className="text-[14px] font-semibold text-muted">{plano.subtitulo}</p>
                      </div>
                    </div>
                    <p className="text-[15px] leading-relaxed text-muted-3">{plano.corpo}</p>
                    <ul className="flex flex-col gap-2">
                      {plano.itens.map((texto) => (
                        <li key={texto} className="flex gap-2 text-[15px] leading-relaxed text-navy">
                          <Icone nome="check" className="mt-0.5 bg-navy text-white" tamanho="size-6" />
                          <span>{texto}</span>
                        </li>
                      ))}
                    </ul>
                    {link ? (
                      <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-auto inline-flex min-h-12 items-center justify-center rounded-pill bg-navy px-6 text-center text-[14px] font-black tracking-wide text-white transition-colors hover:bg-navy-light"
                      >
                        {copy.planos.comprar}
                        <span className="sr-only">
                          {`: ${NOME_DO_PLANO[plano.chave]}`}
                          {copy.a11y.abreEmOutraAba}
                        </span>
                      </a>
                    ) : null}
                  </li>
                );
              })}
            </ul>

            <p className="text-[14px] text-muted">{vendendo ? copy.planos.notaComLink : copy.planos.notaSemLink}</p>

            {vendendo ? (
              <div className="flex gap-4 rounded-card border border-border bg-bg p-5">
                <Icone nome="escudo" className="bg-teal text-white" />
                <div>
                  <h3 className="text-[17px] font-extrabold text-navy">{copy.garantia.titulo}</h3>
                  <p className="mt-1 text-[15px] leading-relaxed text-muted">{copy.garantia.corpo}</p>
                </div>
              </div>
            ) : (
              <CtaPrincipal rotulo={copy.planos.escolher} className="self-start" />
            )}
          </div>
        </section>

        {/* -------------------------------------------------------- perguntas */}
        <section
          id="perguntas"
          aria-labelledby="perguntas-titulo"
          className="mx-auto flex w-full max-w-4xl scroll-mt-6 flex-col gap-5 px-4 py-14 sm:px-6 lg:px-8"
        >
          <TituloDeSecao id="perguntas-titulo">{copy.faq.titulo}</TituloDeSecao>
          <ul className="flex flex-col gap-3">
            {copy.faq.itens.map((item) => (
              <li key={item.p}>
                <details className="group rounded-card border border-border bg-surface px-5 shadow-card">
                  <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-4 text-[17px] font-extrabold text-navy [&::-webkit-details-marker]:hidden">
                    {item.p}
                    <span
                      aria-hidden="true"
                      className="inline-flex size-7 shrink-0 items-center justify-center rounded-pill bg-rail text-navy transition-transform group-open:rotate-45"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" className="size-4">
                        <path d="M12 5v14M5 12h14" />
                      </svg>
                    </span>
                  </summary>
                  <p className="pb-5 text-[15px] leading-relaxed text-muted">{item.r}</p>
                </details>
              </li>
            ))}
          </ul>
        </section>

        {/* ------------------------------------------------------------ fecho */}
        <section aria-labelledby="fecho" className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
          <div className="grid items-center gap-6 overflow-hidden rounded-hero bg-navy px-6 pt-8 sm:px-10 sm:pt-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)]">
            <div className="flex flex-col items-start gap-5 lg:pb-10">
              <TituloDeSecao id="fecho" claro>
                {copy.fecho.titulo}
              </TituloDeSecao>
              <p className="max-w-xl text-[17px] leading-relaxed text-[#C9D6EC]">{copy.fecho.corpo}</p>
              <CtaPrincipal rotulo={copy.fecho.cta} />
              <p lang="en" className="manuscrito text-[24px] text-yellow">
                {copy.fecho.assinatura}
              </p>
            </div>
            <SkylineDeLondres className="h-auto w-full self-end" />
          </div>
        </section>
      </main>

      {/* -------------------------------------------------------------- rodapé */}
      <footer className="border-t border-border bg-surface">
        <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
            <div className="flex flex-col gap-5">
              <LogoWSA fundo="claro" altura={40} className="h-8! lg:h-10! self-start" />
              <p className="max-w-xs text-[14px] leading-relaxed text-muted">{copy.rodape.tagline}</p>
            </div>

            <div className="flex flex-col gap-2">
              <h2 className="text-[12px] font-extrabold tracking-[0.08em] text-navy uppercase">{copy.rodape.colunaPagina}</h2>
              <ul>
                {copy.nav.map((item) => (
                  <li key={item.href}>
                    <a href={item.href} className="inline-flex min-h-11 items-center text-[15px] font-semibold text-navy underline underline-offset-4">
                      {item.rotulo}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-2">
              <h2 className="text-[12px] font-extrabold tracking-[0.08em] text-navy uppercase">{copy.rodape.colunaConta}</h2>
              <ul>
                {[
                  { href: '/criar-conta', rotulo: copy.rodape.criarConta },
                  { href: '/entrar', rotulo: copy.entrar },
                  { href: '/esqueci-senha', rotulo: copy.rodape.esqueci },
                ].map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="inline-flex min-h-11 items-center text-[15px] font-semibold text-navy underline underline-offset-4">
                      {item.rotulo}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-2">
              <h2 className="text-[12px] font-extrabold tracking-[0.08em] text-navy uppercase">{copy.rodape.colunaLegal}</h2>
              <ul>
                {[
                  { href: '/termos', rotulo: copy.rodape.termos },
                  { href: '/privacidade', rotulo: copy.rodape.privacidade },
                ].map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="inline-flex min-h-11 items-center text-[15px] font-semibold text-navy underline underline-offset-4">
                      {item.rotulo}
                    </Link>
                  </li>
                ))}
                <li>
                  <a
                    href={`mailto:${copy.rodape.email}`}
                    className="inline-flex min-h-11 items-center text-[15px] font-semibold text-navy underline underline-offset-4"
                  >
                    {copy.rodape.contato}
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-1 border-t border-border pt-6 text-[14px] text-muted sm:flex-row sm:items-center sm:justify-between">
            <p>{copy.rodape.direitos(ano)}</p>
            <p>{copy.rodape.feitoNo}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
