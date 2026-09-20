/**
 * A tela de conclusão da aula: anel com o aproveitamento, o placar em palavras e
 * os dois caminhos de saída (protótipo `prototype/mobile.dc.html`, ~535 a 557;
 * desktop do Claude Designer, `Ingles em Acao.dc.html`, ~551 a 576).
 *
 * Mesma casca em tela cheia do leitor (plano v2, pacote 05): topo com voltar para
 * a trilha, miolo que rola (o cartão fica no meio da altura quando cabe) e base
 * fixa com REVISAR e PRÓXIMA AULA (ou VER A TRILHA), sempre à vista. O fundo da
 * WSA fica atrás, parado.
 *
 * Server Component, e o placar vem **do banco**: recontado a partir das
 * `ExerciseAnswer` gravadas, que é a fonte correta (BACKOFFICE §6.4, regra 4).
 * Pontuação por querystring não é lida em lugar nenhum: seria só um número que o
 * navegador pediu para ser verdade.
 */
import { cache } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { FundoDaAula } from '@/components/lesson/FundoDaAula';
import { requireUser } from '@/lib/auth/session';
import { carregarAulaPublicadaPorSlug, listarAulasPublicadas } from '@/lib/content/publicado';
import {
  carregarProgressoDaAula,
  carregarRespostasDaAula,
  mapaDeRespostas,
} from '@/lib/lesson/respostas';
import { pontuar } from '@/lib/lesson/score';

/** ⚠️ Next 16: `params` chega como Promise e precisa de `await`. */
type ParametrosDoResultado = { params: Promise<{ slug: string }> };

export const dynamic = 'force-dynamic';

/** Comprimento do círculo do anel (2πr com r = 50), como no protótipo. */
const VOLTA_COMPLETA = 314.16;

/**
 * A mesma porta do leitor e da action de conclusão (`publicado.ts`): o placar desta
 * tela tem de ser contado contra o conteúdo que o aluno de fato respondeu.
 */
const carregarAula = cache(carregarAulaPublicadaPorSlug);

export async function generateMetadata({ params }: ParametrosDoResultado): Promise<Metadata> {
  const { slug } = await params;
  const publicada = await carregarAula(slug);
  return { title: publicada ? `Resultado · ${publicada.resumo.code}` : 'Aula não encontrada' };
}

/** A frase por faixa de aproveitamento, exatamente as três do protótipo. */
function mensagemDaFaixa(percentual: number): string {
  if (percentual >= 80) return 'Excelente! Você dominou esta aula.';
  if (percentual >= 50) return 'Bom trabalho. Vale revisar os itens que ficaram.';
  return 'Tudo bem errar. Revise a aula com calma e tente de novo.';
}

export default async function ResultadoDaAulaPage({ params }: ParametrosDoResultado) {
  const usuario = await requireUser();

  const { slug } = await params;
  const publicada = await carregarAula(slug);
  if (publicada === null) notFound();
  const { aula } = publicada;

  const [respostas, progresso] = await Promise.all([
    carregarRespostasDaAula(usuario.id, aula.id),
    carregarProgressoDaAula(usuario.id, aula.id, aula.pages.length),
  ]);

  // A recontagem manda; `LessonProgress.score` só entra quando as respostas não
  // puderam ser lidas: ele é cache de um cálculo, não o cálculo.
  const placar = respostas.disponivel ? pontuar(aula, mapaDeRespostas(respostas)) : null;
  const acertos = placar?.acertos ?? progresso.score ?? 0;
  const total = placar?.total ?? progresso.total ?? 0;
  const percentual = total > 0 ? Math.round((acertos / total) * 100) : 0;

  const semRegistro = !respostas.disponivel && progresso.score === null;

  // A próxima aula **publicada**: pular para `id + 1` daria 404 se ela estiver fora do ar.
  const aulasPublicadas = await listarAulasPublicadas();
  const slugDaProxima = aulasPublicadas.find((a) => a.id > aula.id)?.slug ?? null;
  const destinoDoAvanco = slugDaProxima === null ? '/trilha' : `/aula/${slugDaProxima}`;
  const rotuloDoAvanco = slugDaProxima === null ? 'VER A TRILHA' : 'PRÓXIMA AULA';

  return (
    <>
      <FundoDaAula />

      <div className="casca-aula">
        {/* ─────────────────────────────── topo ─────────────────────────────── */}
        <div className="casca-aula__topo">
          <div className="coluna-aula casca-aula__controles">
            <Link
              href="/trilha"
              aria-label="Voltar para a trilha"
              className="alvo-toque grid size-11 flex-none place-items-center rounded-[14px] border-[1.5px] border-solid border-border bg-surface text-navy transition-colors hover:border-navy-light hover:text-navy-light"
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M19 12H5" />
                <path d="m11 6-6 6 6 6" />
              </svg>
            </Link>

            <div className="min-w-0 flex-1">
              <p className="fs-rotulo m-0 truncate font-extrabold leading-tight tracking-[.08em] text-blue">
                {aula.code} · RESULTADO
              </p>
              <p className="fs-leitura m-0 truncate font-black leading-tight text-navy">{aula.title}</p>
            </div>
          </div>
        </div>

        {/* ─────────────────────────────── miolo ────────────────────────────── */}
        {/* O cartão fica no meio da altura quando cabe; quando não cabe, o miolo rola. */}
        <div className="casca-aula__miolo">
          <div className="coluna-aula casca-aula__conteudo flex min-h-full flex-col justify-center">
            <article className="mx-auto w-full max-w-[600px] rounded-hero bg-surface px-5 py-6 text-center shadow-[0_10px_32px_rgba(11,31,75,.08)] lg:px-[34px] lg:py-9">
              <div className="anel-do-resultado relative mx-auto mb-4 lg:mb-5">
                <svg viewBox="0 0 120 120" aria-hidden="true" className="size-full">
                  <circle cx="60" cy="60" r="50" fill="none" stroke="#DCE6F2" strokeWidth="13" />
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    fill="none"
                    stroke="#12A594"
                    strokeWidth="13"
                    strokeLinecap={percentual > 0 ? 'round' : 'butt'}
                    strokeDasharray={`${(percentual / 100) * VOLTA_COMPLETA} ${VOLTA_COMPLETA}`}
                    transform="rotate(-90 60 60)"
                  />
                </svg>
                <p className="anel-do-resultado__valor absolute inset-0 m-0 grid place-items-center font-black text-navy">
                  <span>
                    {percentual}%<span className="sr-only"> de aproveitamento</span>
                  </span>
                </p>
              </div>

              <p className="m-0 mb-2 text-[15px] font-extrabold tracking-[.14em] text-teal-texto">
                AULA CONCLUÍDA <span aria-hidden="true">🎉</span>
              </p>

              <h1 className="fs-titulo m-0 mb-[10px] font-black leading-[1.08] tracking-[-.02em] text-navy text-pretty">
                {aula.code} · {aula.title}
              </h1>

              <p className="m-0 mb-1.5 text-[17px] text-muted lg:text-[19px]">
                Você acertou <strong className="text-navy">{acertos}</strong> de{' '}
                <strong className="text-navy">{total}</strong> {total === 1 ? 'item' : 'itens'}.
              </p>

              <p className="fs-leitura m-0 text-muted">{mensagemDaFaixa(percentual)}</p>

              {semRegistro ? (
                <p
                  role="status"
                  className="fs-apoio m-0 mt-4 rounded-card border-[1.5px] border-solid border-[#F8E7B4] bg-[#FEF7E0] px-4 py-3 font-bold leading-snug text-[#6B520A]"
                >
                  Não conseguimos ler seu progresso agora, então este placar pode não refletir tudo o que
                  você respondeu. Suas respostas não foram perdidas.
                </p>
              ) : null}

              <p className="manuscrito m-0 mt-4 text-[26px] text-[#1B3A6B] lg:mt-5 lg:text-[30px]">Keep going! 🚀</p>
            </article>
          </div>
        </div>

        {/* ─────────────────────────────── base ─────────────────────────────── */}
        <nav aria-label="Depois da aula" className="casca-aula__base">
          <div className="coluna-aula casca-aula__acoes">
            <div className="mx-auto flex w-full max-w-[600px] gap-2 lg:gap-[10px]">
              <Link
                href={`/aula/${slug}`}
                className="alt-botao fs-botao flex flex-none items-center justify-center rounded-pill border-[1.5px] border-solid border-border bg-surface px-4 font-extrabold text-navy transition-colors hover:border-navy-light sm:px-6"
              >
                REVISAR
              </Link>

              <Link
                href={destinoDoAvanco}
                className="alt-botao fs-botao flex min-w-0 flex-1 items-center justify-center gap-3 rounded-pill bg-navy px-4 font-extrabold text-white transition-colors hover:bg-navy-light sm:px-6"
              >
                {rotuloDoAvanco}
                {/* Em 320px a seta não cabe ao lado de PRÓXIMA AULA. */}
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  className="hidden flex-none min-[360px]:block"
                >
                  <path d="M4 12h15" />
                  <path d="m13 6 6 6-6 6" />
                </svg>
              </Link>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
}
