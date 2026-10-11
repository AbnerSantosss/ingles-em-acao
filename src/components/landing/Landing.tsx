/** Landing pública. Copy centralizada; chats ilustram a prática na IA escolhida. */
import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';

import { LogoWSA } from '@/components/ui/LogoWSA';
import { GlobePulse } from '@/components/ui/component';
import { NOME_DO_PLANO, type Plano } from '@/lib/planos';

import { copyDaLanding as copy } from './copy';
import {
  CelularDeConversa,
  ChatDaLanding,
  FotosDaEstudante,
  PraticaVisual,
} from './Experiencias';
import { BarraDeProgresso } from './BarraDeProgresso';
import { BalaoComPerspectiva, RevealOnScroll } from './Interacoes';
import { Icone, PaisagemDeLondres, TrilhaDas42 } from './ilustracoes';
import styles from './landing.module.css';
import { copyDosExemplos as visual } from './visual-copy';

export type PlanoDaLanding = Plano;
export type OfertasDaLanding = Record<PlanoDaLanding, string | null>;

const CONTAINER = 'mx-auto w-full max-w-6xl px-5 sm:px-8';

function CtaPrincipal({
  rotulo,
  href = '/criar-conta',
  className = '',
}: {
  rotulo: string;
  href?: string;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex min-h-13 items-center justify-center gap-3 rounded-pill bg-yellow px-7 py-3 text-center text-[14px] font-extrabold text-navy shadow-card transition-colors hover:bg-yellow-hover ${className}`}
    >
      {rotulo}
      <span className={styles.ctaSeta} aria-hidden="true">
        →
      </span>
    </Link>
  );
}

function TituloDeSecao({
  id,
  children,
  claro = false,
}: {
  id: string;
  children: ReactNode;
  claro?: boolean;
}) {
  return (
    <h2
      id={id}
      className={`${styles.tituloDeSecao} max-w-3xl text-[29px] leading-[1.15] font-black text-balance sm:text-[38px] ${claro ? 'text-white' : 'text-navy'}`}
    >
      {children}
    </h2>
  );
}

function Abertura({ children }: { children: ReactNode }) {
  return (
    <p className="max-w-2xl text-[17px] leading-relaxed text-muted-3 text-pretty">
      {children}
    </p>
  );
}

function MarcaDeInclusao({ incluido }: { incluido: boolean }) {
  return (
    <>
      <span
        aria-hidden="true"
        className={incluido ? styles.marcaSim : styles.marcaNao}
      >
        {incluido ? '✔' : '✖'}
      </span>
      <span className="sr-only">
        {incluido ? copy.recebe.incluido : copy.recebe.naoIncluido}
      </span>
    </>
  );
}

export function Landing({ ofertas }: { ofertas: OfertasDaLanding }) {
  const ano = new Date().getFullYear();
  const vendendo = copy.planos.lista.some((plano) =>
    Boolean(ofertas[plano.chave]),
  );

  return (
    <div className="relative flex min-h-dvh flex-col overflow-x-clip bg-bg">
      <a
        href="#conteudo"
        className="absolute top-3 left-3 z-50 inline-flex min-h-11 -translate-y-[200%] items-center rounded-pill bg-yellow px-5 text-[15px] font-bold text-navy focus:translate-y-0"
      >
        {copy.a11y.pular}
      </a>
      <header className="bg-navy text-white">
        <div
          className={`${CONTAINER} flex items-center justify-between gap-4 py-4`}
        >
          <Link
            href="/"
            aria-label="WSA English, início"
            className="inline-flex min-h-11 items-center focus-visible:outline-yellow"
          >
            <LogoWSA
              fundo="escuro"
              altura={40}
              compacta
              prioridade
              className="h-8! sm:h-10!"
            />
          </Link>
          <nav aria-label={copy.a11y.navegacao} className="hidden xl:block">
            <ul className="flex items-center gap-5">
              {copy.nav.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="inline-flex min-h-11 items-center text-[13px] font-semibold text-white hover:text-yellow focus-visible:outline-yellow"
                  >
                    {item.rotulo}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <Link
            href="/entrar"
            className="inline-flex min-h-11 items-center rounded-pill border border-white/35 px-6 text-sm font-bold text-white transition-colors hover:bg-white/10 hover:text-yellow focus-visible:outline-yellow"
          >
            {copy.entrar}
          </Link>
        </div>
      </header>

      <main id="conteudo" className="flex flex-1 flex-col">
        <section
          aria-labelledby="hero-titulo"
          className="relative isolate overflow-hidden bg-navy text-white"
        >
          <div className={styles.heroBackground} aria-hidden="true" />
          <div className={styles.heroGlobe} aria-hidden="true">
            <GlobePulse />
          </div>
          <div className={`${CONTAINER} ${styles.heroGrid}`}>
            <div className={styles.heroCopy}>
              <div className={styles.sectionIntro}>
                <h1
                  id="hero-titulo"
                  className="max-w-2xl text-[32px] leading-[1.08] font-black text-balance text-white sm:text-[40px] lg:text-[44px]"
                >
                  {copy.hero.titulo.antes}{' '}
                  <span className="text-yellow">
                    {copy.hero.titulo.destaque}
                  </span>
                </h1>
                <p className="max-w-xl text-[17px] leading-relaxed text-[#d9e4f5]">
                  {copy.hero.subtitulo}
                </p>
              </div>
              <div className="flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap">
                <CtaPrincipal
                  rotulo={copy.hero.cta}
                  className={`${styles.ctaMobile} focus-visible:outline-white`}
                />
                <a
                  href="#conversa-ia"
                  className="inline-flex min-h-13 items-center justify-center rounded-pill border border-white/40 px-6 py-3 text-center text-[14px] font-bold text-white hover:bg-white/10 hover:text-yellow focus-visible:outline-yellow"
                >
                  {copy.hero.ctaConversa}
                </a>
              </div>
            </div>
            <CelularDeConversa />
          </div>
          <div className="relative z-10 border-t border-white/15 bg-navy/90">
            <ul className={`${CONTAINER} grid grid-cols-3 gap-3 py-4 sm:gap-8`}>
              {copy.hero.recursos.map((item) => (
                <li
                  key={item.icone}
                  className="flex flex-col items-center gap-3 text-center sm:flex-row sm:text-left"
                >
                  <Image
                    src={`/brand/icone-${item.icone}.webp`}
                    alt=""
                    width={40}
                    height={40}
                    className="size-9 shrink-0"
                  />
                  <div>
                    <p className="text-[13px] font-extrabold text-white sm:text-[15px]">
                      {item.titulo}
                    </p>
                    <p className="mt-1 text-xs text-[#c9d6ec] sm:text-sm">
                      {item.corpo}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section
          aria-labelledby="dor"
          className={`${styles.dorSection} bg-surface py-12 sm:py-16`}
        >
          <div
            className={`${CONTAINER} grid items-center gap-10 md:grid-cols-[.85fr_1.15fr] md:gap-16`}
          >
            <FotosDaEstudante />
            <div className={styles.dorConteudo}>
              <div className={styles.sectionIntro}>
                <TituloDeSecao id="dor">{copy.dor.titulo}</TituloDeSecao>
                <Abertura>{copy.dor.corpo}</Abertura>
              </div>
              <ul className="mt-2 flex flex-col gap-3">
                {copy.dor.itens.map((item) => (
                  <li key={item.titulo} className={styles.dorBalao}>
                    <h3 className={styles.dorChip}>{item.titulo}</h3>
                    <blockquote className="text-lg leading-tight font-bold text-navy sm:text-xl">
                      “{item.fala}”
                    </blockquote>
                    <p className="mt-1 text-sm leading-snug text-muted">
                      {item.corpo}
                    </p>
                    {item.respostaIA ? (
                      <p className={styles.fraseBrilho}>{item.respostaIA}</p>
                    ) : null}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section
          id="como-funciona"
          aria-labelledby="como-funciona-titulo"
          className={`${CONTAINER} ${styles.sectionSpace} scroll-mt-8`}
        >
          <div className={`${styles.sectionIntro} mb-10`}>
            <TituloDeSecao id="como-funciona-titulo">
              {copy.comoFunciona.titulo}
            </TituloDeSecao>
            <Abertura>{copy.comoFunciona.corpo}</Abertura>
          </div>
          <ol className={styles.passos}>
            {copy.comoFunciona.passos.map((passo, i) => (
              <li key={passo.titulo} className={styles.passoItem}>
                <BalaoComPerspectiva className={styles.passo} todasAsMargens>
                  <Image
                    src={`/brand/passo-${['aprenda', 'pratique', 'avance'][i]}.webp`}
                    alt=""
                    fill
                    sizes="(max-width: 767px) 90vw, 33vw"
                    unoptimized
                    className={styles.passoFoto}
                  />
                  <span className={styles.passoNumero}>
                    <span className="sr-only">{visual.passo} </span>
                    {i + 1}
                  </span>
                  <div className={styles.passoTexto}>
                    <h3 className="text-[28px] font-black text-white">
                      {passo.titulo}
                    </h3>
                    <p className="text-[15px] leading-snug text-white">
                      {passo.corpo}
                    </p>
                    {i === 2 ? (
                      <div className={styles.passoProgresso}>
                        <p>{visual.avancar.titulo}</p>
                        <BarraDeProgresso />
                      </div>
                    ) : (
                      <PraticaVisual passo={i} />
                    )}
                  </div>
                </BalaoComPerspectiva>
              </li>
            ))}
          </ol>
        </section>

        <section
          id="conversa-ia"
          aria-labelledby="ia-titulo"
          className={`${styles.iaSection} relative scroll-mt-8 overflow-hidden text-white`}
        >
          <Image
            src="/brand/conversa-ia-campus.webp"
            alt=""
            fill
            sizes="100vw"
            unoptimized
            className={styles.iaFoto}
          />
          <div className={styles.iaTextura} aria-hidden="true" />
          <div className={`${CONTAINER} relative`}>
            <div className={styles.iaGrid}>
              <div className="flex flex-col items-start gap-4">
                <span className="text-xs font-extrabold tracking-[.08em] text-yellow uppercase">
                  {copy.ia.selo}
                </span>
                <div className={styles.sectionIntro}>
                  <TituloDeSecao id="ia-titulo" claro>
                    {copy.ia.titulo}
                  </TituloDeSecao>
                  <p className="text-[17px] leading-relaxed text-[#eee5fb]">
                    {copy.ia.corpo}
                  </p>
                </div>
                <ul className="my-1 flex flex-col gap-4">
                  {copy.ia.pontos.map((ponto) => (
                    <li key={ponto.titulo} className="flex gap-3">
                      <Icone
                        nome="check"
                        className="bg-yellow text-purple"
                        tamanho="size-8"
                      />
                      <div>
                        <h3 className="text-base font-extrabold text-white">
                          {ponto.titulo}
                        </h3>
                        <p className="mt-1 text-sm leading-relaxed text-[#eee5fb]">
                          {ponto.corpo}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
                <CtaPrincipal
                  rotulo={copy.ia.cta}
                  href="#planos"
                  className="focus-visible:outline-white"
                />
                <p className="text-[14px] leading-relaxed text-[#eee5fb]">
                  {copy.ia.nota}
                </p>
              </div>
              <div className={styles.iaChat}>
                <ChatDaLanding />
              </div>
            </div>
          </div>
        </section>

        <section
          id="o-que-voce-vai-dizer"
          aria-labelledby="conquistas-titulo"
          className={`${CONTAINER} ${styles.sectionSpace} scroll-mt-8`}
        >
          <div className={`${styles.sectionIntro} mb-8`}>
            <TituloDeSecao id="conquistas-titulo">
              {copy.conquistas.titulo}
            </TituloDeSecao>
            <Abertura>{copy.conquistas.corpo}</Abertura>
          </div>
          <div
            className={`${styles.trilhaScroll} mb-6 rounded-card px-3 py-5 sm:px-6`}
          >
            <TrilhaDas42 className={styles.trilha} />
          </div>
          <div
            className={styles.marcosJanela}
            tabIndex={0}
            role="region"
            aria-label={visual.marcosLegenda}
          >
            <ol className={styles.marcosSlide}>
              {[0, 1].flatMap((copia) =>
                copy.conquistas.marcos.map((marco) => (
                  <li
                    key={`${copia}-${marco.aulas}`}
                    aria-hidden={copia === 1 ? true : undefined}
                  >
                    <BalaoComPerspectiva className={styles.conquistaBalao}>
                      <span className="text-[12px] font-extrabold tracking-wide text-purple uppercase">
                        {marco.aulas}
                      </span>
                      <h3 className="mt-2 text-[17px] font-extrabold text-navy">
                        {marco.titulo}
                      </h3>
                      <p
                        lang="en"
                        className="manuscrito mt-2 text-[23px] text-navy"
                      >
                        “{marco.exemplo}”
                      </p>
                    </BalaoComPerspectiva>
                  </li>
                )),
              )}
            </ol>
          </div>
        </section>

        <section
          id="metodo"
          aria-labelledby="metodo-titulo"
          className={`${styles.sectionSpace} ${styles.metodoSection} scroll-mt-8 bg-surface`}
        >
          <PaisagemDeLondres className={styles.metodoPaisagem} />
          <div className={`${CONTAINER} relative`}>
            <div className={`${styles.sectionIntro} mb-8`}>
              <TituloDeSecao id="metodo-titulo">
                {copy.metodo.titulo}
              </TituloDeSecao>
              <Abertura>{copy.metodo.corpo}</Abertura>
            </div>
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {copy.metodo.pilares.map((pilar, i) => (
                <li key={pilar.selo}>
                  <RevealOnScroll delay={i * 150} className={styles.metodoCard}>
                    <span aria-hidden="true" className={styles.metodoNumero}>
                      0{i + 1}
                    </span>
                    <h3 className="mt-3 text-[21px] leading-tight font-black text-white">
                      {pilar.selo}
                    </h3>
                    {i === 0 ? (
                      <p className="mt-3 text-sm font-bold text-white">
                        {pilar.titulo}
                      </p>
                    ) : null}
                    <p className="mt-3 text-sm leading-[1.45] text-white">
                      {pilar.corpo}
                    </p>
                  </RevealOnScroll>
                </li>
              ))}
            </ul>
            <div className={styles.garantiaMetodo}>
              <Icone
                nome="check"
                className={styles.seloGarantia}
                tamanho="size-14"
              />
              <div>
                <span className="text-[11px] font-extrabold tracking-wide text-yellow uppercase">
                  {copy.metodo.garantiaSelo}
                </span>
                <h3 className="mt-1 text-[21px] leading-tight font-black text-white">
                  {copy.metodo.firewallTitulo}
                </h3>
                <p className="mt-2 text-[15px] leading-relaxed text-[#d9e4f5]">
                  {copy.metodo.firewallCorpo}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section
          aria-labelledby="recebe-titulo"
          className={`${CONTAINER} ${styles.compactSection}`}
        >
          <div className={`${styles.sectionIntro} mb-5`}>
            <TituloDeSecao id="recebe-titulo">
              {copy.recebe.titulo}
            </TituloDeSecao>
            <Abertura>{copy.recebe.corpo}</Abertura>
          </div>
          <div className="overflow-hidden rounded-card border border-border bg-white shadow-card">
            <table className={styles.comparativo}>
              <caption className="sr-only">{copy.recebe.tabelaLegenda}</caption>
              <thead>
                <tr>
                  <th scope="col">{visual.planos.recurso}</th>
                  <th scope="col">{visual.planos.essencial}</th>
                  <th scope="col">{visual.planos.premium}</th>
                </tr>
              </thead>
              <tbody>
                {copy.recebe.itens.map((item) => (
                  <tr
                    key={item.titulo}
                    className={item.premium ? styles.exclusivo : ''}
                  >
                    <th scope="row">
                      {item.titulo}
                      <p>{item.corpo}</p>
                    </th>
                    <td>
                      <MarcaDeInclusao incluido={item.essencial} />
                    </td>
                    <td>
                      <MarcaDeInclusao incluido={item.premiumIncluso} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section
          aria-labelledby="professor-titulo"
          className={`${styles.professorSection} bg-surface`}
        >
          <div className={`${CONTAINER} ${styles.professorGrid}`}>
            <div className={styles.professorRetrato}>
              <Image
                src="/brand/wsa-globo.webp"
                alt=""
                width={256}
                height={253}
                className={styles.professorGlobo}
              />
              <Image
                src="/brand/walber-santana-atualizada.webp"
                alt={copy.professor.retratoAlt}
                width={900}
                height={900}
                sizes="(max-width: 767px) 224px, 270px"
                unoptimized
                className={styles.professorFoto}
              />
            </div>
            <div className={styles.professorTexto}>
              <div className={styles.sectionIntro}>
                <span className="text-xs font-extrabold tracking-wide text-purple uppercase">
                  {copy.professor.rotulo}
                </span>
                <TituloDeSecao id="professor-titulo">
                  {copy.professor.nome}
                </TituloDeSecao>
                <p className="text-[18px] font-extrabold text-navy">
                  {copy.professor.papel}
                </p>
              </div>
              <p className="text-[16px] leading-relaxed text-muted-3">
                {copy.professor.alunos}
              </p>
              <p className="text-[16px] leading-relaxed text-muted-3">
                {copy.professor.corpo}
              </p>
              <blockquote className="mt-2 border-l-4 border-yellow pl-5 text-[23px] leading-snug font-bold text-navy">
                “{copy.professor.citacao}”
              </blockquote>
            </div>
          </div>
        </section>

        <section
          id="planos"
          aria-labelledby="planos-titulo"
          className={`${CONTAINER} ${styles.planosSection} scroll-mt-6`}
        >
          <div className={`${styles.sectionIntro} mb-6`}>
            <TituloDeSecao id="planos-titulo">
              {copy.planos.titulo}
            </TituloDeSecao>
            <Abertura>{copy.planos.corpo}</Abertura>
          </div>
          <ul className={styles.planosGrid}>
            {copy.planos.lista.map((plano) => {
              const premium = plano.chave === 'PREMIUM';
              const link = ofertas[plano.chave];
              const botao = `${styles.planoBotao} inline-flex min-h-11 items-center justify-center rounded-pill px-6 py-2 text-center text-[15px] font-extrabold transition-colors ${premium ? 'bg-purple text-white hover:bg-[#43158e] hover:text-white' : 'mt-auto bg-navy text-white hover:bg-navy-light hover:text-white'}`;
              const titulo = (
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="flex items-center gap-2 text-[24px] font-black text-navy">
                      <Image
                        src="/brand/wsa-globo.webp"
                        alt=""
                        width={30}
                        height={30}
                        className={`size-[30px] shrink-0 ${premium ? '' : styles.globoPrateado}`}
                      />
                      {NOME_DO_PLANO[plano.chave]}
                    </h3>
                    {plano.seloIA ? (
                      <span className="rounded-pill bg-purple/10 px-3 py-1 text-[10px] font-extrabold text-purple">
                        {plano.seloIA}
                      </span>
                    ) : null}
                  </div>
                  <p
                    className={`mt-2 text-[16px] leading-snug font-bold ${premium ? 'text-purple' : 'text-navy'}`}
                  >
                    {plano.subtitulo}
                  </p>
                </div>
              );
              const beneficios = (
                <ul className="flex flex-col gap-3">
                  {plano.itens.map((texto) => (
                    <li
                      key={texto}
                      className="flex gap-2 text-[15px] leading-snug text-navy"
                    >
                      <Icone
                        nome="check"
                        className={
                          premium
                            ? 'bg-purple/10 text-purple'
                            : 'bg-rail text-navy'
                        }
                        tamanho="size-6"
                      />
                      <span>{texto}</span>
                    </li>
                  ))}
                </ul>
              );
              const cta = link ? (
                <a
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={botao}
                >
                  {plano.cta}
                  <span className="sr-only">{copy.a11y.abreEmOutraAba}</span>
                </a>
              ) : (
                <Link href="/criar-conta" className={botao}>
                  {plano.cta}
                </Link>
              );
              return (
                <li
                  key={plano.chave}
                  className={`${styles.planoCard} ${premium ? styles.planoPremium : ''}`}
                >
                  {plano.selo ? (
                    <span className="absolute -top-3 left-7 rounded-pill bg-yellow px-4 py-1 text-[11px] font-extrabold text-navy">
                      {plano.selo}
                    </span>
                  ) : null}
                  {premium ? (
                    <div className={styles.premiumLayout}>
                      <div className={styles.premiumVisual}>
                        <Image
                          src="/brand/robo-wsa-apontando.webp"
                          alt=""
                          width={700}
                          height={719}
                          sizes="(max-width: 767px) 240px, 260px"
                          unoptimized
                          className={styles.roboPremium}
                        />
                        <ChatDaLanding compacto seuGPT />
                      </div>
                      <div className={styles.premiumConteudo}>
                        <div className={styles.premiumCabecalho}>{titulo}</div>
                        <div className={styles.premiumInfo}>
                          {beneficios}
                          {plano.destaque ? (
                            <div className={styles.premiumEvolucao}>
                              <p>
                                {visual.planos.de} “{plano.destaque.antes}”
                              </p>
                              <strong>
                                {visual.planos.para} “{plano.destaque.depois}”
                              </strong>
                            </div>
                          ) : null}
                          {cta}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      {titulo}
                      {beneficios}
                      {cta}
                    </>
                  )}
                </li>
              );
            })}
          </ul>
          {vendendo ? (
            <p className="mt-4 text-[14px] leading-relaxed text-muted">
              {copy.planos.notaComLink}
            </p>
          ) : null}
          {vendendo ? (
            <div className={styles.garantiaCompra}>
              <Icone nome="escudo" className="bg-teal-texto text-white" />
              <div>
                <h3 className="text-base font-extrabold text-navy">
                  {copy.garantia.titulo}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-muted">
                  {copy.garantia.corpo}
                </p>
              </div>
            </div>
          ) : null}
        </section>

        <section
          id="perguntas"
          aria-labelledby="perguntas-titulo"
          className={`${styles.faqSection} scroll-mt-6 bg-surface`}
        >
          <div className={`${CONTAINER} flex flex-col gap-5`}>
            <TituloDeSecao id="perguntas-titulo">
              {copy.faq.titulo}
            </TituloDeSecao>
            <ul className={styles.faqLista}>
              {copy.faq.itens.map((item) => (
                <li key={item.p} className="border-b border-border">
                  <details className="group">
                    <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-3 text-[16px] font-extrabold text-navy [&::-webkit-details-marker]:hidden">
                      {item.p}
                      <span
                        aria-hidden="true"
                        className="inline-flex size-7 shrink-0 items-center justify-center rounded-pill bg-rail text-xl text-navy transition-transform group-open:rotate-45"
                      >
                        +
                      </span>
                    </summary>
                    <p className="max-w-2xl pb-6 text-sm leading-relaxed text-muted">
                      {item.r}
                    </p>
                  </details>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section
          aria-labelledby="fecho"
          className={`${styles.fechoTextura} bg-navy py-12 sm:py-14`}
        >
          <div className={`${CONTAINER} ${styles.fechoGrid}`}>
            <Image
              src="/brand/robo-wsa-celular.webp"
              alt=""
              width={600}
              height={556}
              sizes="(max-width: 767px) 180px, 300px"
              unoptimized
              className={styles.fechoRobo}
            />
            <div className={styles.fechoConteudo}>
              <div className={styles.sectionIntro}>
                <TituloDeSecao id="fecho" claro>
                  {copy.fecho.titulo}
                </TituloDeSecao>
                <p className="max-w-xl text-[17px] leading-relaxed text-[#c9d6ec]">
                  {copy.fecho.corpo}
                </p>
              </div>
              <CtaPrincipal
                rotulo={copy.fecho.cta}
                className={`${styles.ctaMobile} ${styles.botaoNeon} focus-visible:outline-white`}
              />
              <p lang="en" className="manuscrito text-[24px] text-yellow">
                {copy.fecho.assinatura}
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-surface">
        <div className={`${CONTAINER} ${styles.footerConteudo}`}>
          <div className={styles.footerGrid}>
            <div className={styles.footerMarca}>
              <LogoWSA fundo="claro" altura={40} className="h-8! self-start" />
              <p className="max-w-xs text-sm leading-relaxed text-muted">
                {copy.rodape.tagline}
              </p>
            </div>
            <div className={styles.footerPagina}>
              <h2 className="mb-3 text-xs font-extrabold tracking-wide text-navy uppercase">
                {copy.rodape.colunaPagina}
              </h2>
              <ul>
                {copy.nav.map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      className="inline-flex min-h-10 items-center text-sm font-semibold text-navy hover:underline"
                    >
                      {item.rotulo}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div className={styles.footerConta}>
              <h2 className="mb-3 text-xs font-extrabold tracking-wide text-navy uppercase">
                {copy.rodape.colunaConta}
              </h2>
              <ul>
                {[
                  { href: '/criar-conta', rotulo: copy.rodape.criarConta },
                  { href: '/entrar', rotulo: copy.entrar },
                  { href: '/esqueci-senha', rotulo: copy.rodape.esqueci },
                ].map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="inline-flex min-h-10 items-center text-sm font-semibold text-navy hover:underline"
                    >
                      {item.rotulo}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className={styles.footerLegal}>
              <h2 className="mb-3 text-xs font-extrabold tracking-wide text-navy uppercase">
                {copy.rodape.colunaLegal}
              </h2>
              <ul>
                {[
                  { href: '/termos', rotulo: copy.rodape.termos },
                  { href: '/privacidade', rotulo: copy.rodape.privacidade },
                ].map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="inline-flex min-h-10 items-center text-sm font-semibold text-navy hover:underline"
                    >
                      {item.rotulo}
                    </Link>
                  </li>
                ))}
                <li>
                  <a
                    href={`mailto:${copy.rodape.email}`}
                    className="inline-flex min-h-10 items-center text-sm font-semibold text-navy hover:underline"
                  >
                    {copy.rodape.contato}
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className={styles.footerDireitos}>
            <p>{copy.rodape.direitos(ano)}</p>
            <p>{copy.rodape.feitoNo}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
