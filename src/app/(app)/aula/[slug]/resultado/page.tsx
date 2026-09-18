/**
 * A tela de conclusão da aula (protótipo `prototype/mobile.dc.html`, ~535–557):
 * anel com o aproveitamento, o placar em palavras e os dois caminhos de saída.
 * A partir de 1024px valem as medidas do design de desktop do Claude Designer
 * (`Ingles em Acao.dc.html`, ~551–576): coluna de 640px, anel de 170px, título de
 * 34px e os dois botões lado a lado.
 *
 * Server Component, e o placar vem **do banco** — recontado a partir das
 * `ExerciseAnswer` gravadas, que é a fonte correta (BACKOFFICE §6.4, regra 4).
 * Pontuação por querystring não é lida em lugar nenhum: seria só um número que o
 * navegador pediu para ser verdade.
 */
import { cache } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

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
  return { title: publicada ? `Resultado — ${publicada.resumo.code}` : 'Aula não encontrada' };
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
  // puderam ser lidas — ele é cache de um cálculo, não o cálculo.
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

  // Coluna de 640px do design com 20px de respiro de cada lado = 600px de
  // conteúdo; a `.tela` do layout já dá os 20px no desktop.
  return (
    <article className="rounded-hero bg-surface px-5 py-[26px] text-center shadow-[0_10px_32px_rgba(11,31,75,.08)] lg:mx-auto lg:mt-4 lg:max-w-[600px] lg:px-[34px] lg:py-9">
      <div className="relative mx-auto mb-[18px] size-[136px] lg:mb-5 lg:size-[170px]">
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
        <p className="absolute inset-0 m-0 grid place-items-center text-[29px] font-black text-navy lg:text-[36px]">
          <span>
            {percentual}%<span className="sr-only"> de aproveitamento</span>
          </span>
        </p>
      </div>

      <p className="m-0 mb-2 text-[15px] font-extrabold tracking-[.14em] text-teal">
        AULA CONCLUÍDA <span aria-hidden="true">🎉</span>
      </p>

      <h1 className="m-0 mb-[10px] text-[26px] font-black leading-[1.08] tracking-[-.02em] text-navy text-pretty lg:text-[34px] lg:leading-[1.05]">
        {aula.code} — {aula.title}
      </h1>

      <p className="m-0 mb-1.5 text-[17px] text-muted lg:text-[19px]">
        Você acertou <strong className="text-navy">{acertos}</strong> de{' '}
        <strong className="text-navy">{total}</strong> {total === 1 ? 'item' : 'itens'}.
      </p>

      <p className="m-0 mb-[22px] text-[15px] text-muted lg:mb-[26px] lg:text-[17px]">
        {mensagemDaFaixa(percentual)}
      </p>

      {semRegistro ? (
        <p
          role="status"
          className="m-0 mb-[22px] rounded-card border-[1.5px] border-solid border-[#F8E7B4] bg-[#FEF7E0] px-4 py-3 text-[14px] font-bold leading-snug text-[#6B520A]"
        >
          Não conseguimos ler seu progresso agora, então este placar pode não refletir tudo o que
          você respondeu. Suas respostas não foram perdidas.
        </p>
      ) : null}

      {/* Empilhados no celular; lado a lado quando há largura, como no design. */}
      <div className="flex flex-col gap-[10px] sm:flex-row sm:flex-wrap">
        <Link
          href={destinoDoAvanco}
          className="flex min-h-[44px] w-full items-center justify-center gap-3 rounded-pill bg-navy px-4 py-[17px] text-[17px] font-extrabold text-white transition-colors hover:bg-navy-light sm:w-auto sm:min-w-[200px] sm:flex-1"
        >
          {rotuloDoAvanco}
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
          >
            <path d="M4 12h15" />
            <path d="m13 6 6 6-6 6" />
          </svg>
        </Link>

        <Link
          href={`/aula/${slug}`}
          className="flex min-h-[44px] w-full items-center justify-center rounded-pill border-[1.5px] border-solid border-border bg-surface px-6 py-[17px] text-[17px] font-extrabold text-navy transition-colors hover:border-navy-light sm:w-auto sm:flex-none"
        >
          REVISAR
        </Link>
      </div>

      <p className="manuscrito m-0 mt-5 text-[26px] text-[#1B3A6B] lg:mt-[22px] lg:text-[30px]">Keep going! 🚀</p>
    </article>
  );
}
