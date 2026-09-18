import type { Metadata } from 'next';
import Link from 'next/link';

import { NextLessonCard } from '@/components/app/NextLessonCard';
import { ProgressRing } from '@/components/app/ProgressRing';
import { TrilhaAlternavel } from '@/components/app/TrilhaAlternavel';
import { VerifyEmailBanner } from '@/components/app/VerifyEmailBanner';
import { lerAvisoDeManutencao } from '@/lib/admin/settings';
import { requireUser } from '@/lib/auth/session';
import { getStreak, getUserProgress, rotuloDeSequencia } from '@/lib/progress';
import { montarTrilhaDoAluno } from '@/lib/trilha-do-aluno';

export const metadata: Metadata = { title: 'Início' };

/** Sessão e progresso mudam a cada visita: nada de cache estático aqui. */
export const dynamic = 'force-dynamic';

/** A frase de incentivo do protótipo, pelo percentual concluído. */
function fraseDeIncentivo(pct: number, dias: number): string {
  if (dias >= 2) return `Sequência de ${rotuloDeSequencia(dias)}. Não perca o ritmo!`;
  if (pct >= 60) return 'Ótimo! Você está no caminho certo.';
  if (pct > 0) return 'Bom ritmo! Siga uma aula por dia.';
  return 'Comece hoje. A primeira aula leva 12 min.';
}

/** Primeiro nome, para a saudação em caixa alta. */
function primeiroNome(nome: string): string {
  const limpo = nome.trim();
  if (!limpo) return 'ALUNO(A)';
  return (limpo.split(/\s+/)[0] ?? limpo).toUpperCase();
}

export default async function InicioPage() {
  const usuario = await requireUser();
  // O aviso de manutenção (/admin/configuracoes, §2.9) nunca joga: sem banco,
  // a Home segue sem aviso.
  const [progresso, sequencia, avisoDeManutencao, trilha] = await Promise.all([
    getUserProgress(usuario.id),
    getStreak(usuario.id),
    lerAvisoDeManutencao(),
    montarTrilhaDoAluno(usuario.id),
  ]);

  const { done, total, pct, nextLesson } = progresso;
  const concluiuTudo = done === total && total > 0;

  return (
    <div className="flex flex-col gap-7 pt-1 lg:pt-3.5">
      {avisoDeManutencao ? (
        <section
          aria-label="Aviso da equipe"
          className="rounded-card border-[1.5px] border-solid border-[#F8E7B4] bg-[#FEF7E0] p-4"
        >
          <p className="m-0 mb-1 text-[12px] font-extrabold uppercase tracking-[0.12em] text-[#6B520A]">
            Aviso
          </p>
          <p className="m-0 whitespace-pre-line text-[15px] leading-[1.45] text-[#3D2F06]">
            {avisoDeManutencao}
          </p>
        </section>
      ) : null}

      {usuario.emailVerifiedAt ? null : <VerifyEmailBanner email={usuario.email} />}

      {/*
        Layout do design do Claude Designer: saudação à esquerda e, à direita,
        progresso + frase; quando não cabem lado a lado (mobile) empilham.
      */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] items-start gap-6">
        <header className="pt-2">
          <p className="m-0 mb-2.5 text-[15px] font-bold tracking-[0.18em] text-muted lg:text-[19px]">
            OLÁ, {primeiroNome(usuario.name)} 👋
          </p>
          <h1 className="m-0 mb-[18px] text-[clamp(38px,10.5vw,58px)] font-black leading-[1.02] tracking-[-0.025em] text-navy text-pretty">
            Continue de
            <br />
            <span className="text-blue">onde parou</span>
          </h1>
          <p className="m-0 text-[17px] leading-[1.45] text-muted text-pretty lg:text-[20px]">
            O inglês que você usa de verdade,
            <br />
            no seu ritmo e com objetivos reais.
          </p>
        </header>

        <div className="flex flex-col gap-3.5">
          <section
            aria-label="Seu progresso"
            className="flex flex-wrap items-center gap-[22px] rounded-[20px] bg-surface px-[26px] py-[22px] shadow-[0_8px_26px_rgba(11,31,75,0.07)]"
          >
            <ProgressRing pct={pct} done={done} total={total} size={118} caption={false} />

            <div className="min-w-[170px] flex-1">
              <p className="m-0 mb-1.5 text-[14px] font-extrabold tracking-[0.13em] text-muted">
                SEU PROGRESSO
              </p>
              <p className="m-0 mb-3 text-[27px] font-black leading-tight text-navy">
                {done} de {total} aulas
              </p>
              <div className="flex items-center gap-2.5">
                <span
                  aria-hidden="true"
                  className="grid size-[38px] flex-none place-items-center rounded-[11px] bg-[#DFF3EC]"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--teal)"
                    strokeWidth="2.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 17 9.5 10.5l3.5 3.5L21 6" />
                    <path d="M15 6h6v6" />
                  </svg>
                </span>
                <p className="m-0 text-[16px] leading-[1.3] text-[#3C4A5C]">
                  {fraseDeIncentivo(pct, sequencia)}
                </p>
              </div>
            </div>
          </section>

          <section className="flex gap-3.5 rounded-[20px] bg-[#E4F3EC] px-[26px] py-[22px]">
            <svg
              width="30"
              height="30"
              viewBox="0 0 24 24"
              fill="var(--teal)"
              aria-hidden="true"
              className="mt-0.5 flex-none"
            >
              <path d="M9.5 5C6.6 6.3 4.8 9 4.8 12.2c0 3 1.9 4.9 4.2 4.9 2 0 3.5-1.4 3.5-3.4 0-1.9-1.3-3.2-3.1-3.2-.4 0-.8.1-1 .2.4-1.6 1.7-3 3.4-3.8L9.5 5Zm9 0c-2.9 1.3-4.7 4-4.7 7.2 0 3 1.9 4.9 4.2 4.9 2 0 3.5-1.4 3.5-3.4 0-1.9-1.3-3.2-3.1-3.2-.4 0-.8.1-1 .2.4-1.6 1.7-3 3.4-3.8L18.5 5Z" />
            </svg>
            <p className="m-0 text-[17px] leading-[1.45] text-[#1B3A32] lg:text-[19px]">
              A disciplina de hoje
              <br />é o resultado de amanhã.
              <br />
              <em className="font-semibold">Keep going!</em> 🚀
            </p>
          </section>
        </div>
      </div>

      {nextLesson ? (
        <NextLessonCard
          lesson={nextLesson}
          label={concluiuTudo ? 'REVER AULA' : 'CONTINUAR AULA'}
        />
      ) : null}

      <TrilhaAlternavel itens={trilha.itens} modulos={trilha.modulos} />

      <Link
        href={nextLesson ? `/aula/${nextLesson.slug}` : '/trilha'}
        className="relative flex flex-wrap items-center gap-[22px] overflow-hidden rounded-[20px] px-7 py-6 transition-opacity hover:opacity-95"
        style={{ background: 'linear-gradient(100deg,#0A1F4E,#123A86)' }}
      >
        <span
          aria-hidden="true"
          className="grid size-[58px] flex-none place-items-center rounded-full border-[2.5px] border-solid border-[rgba(255,255,255,0.55)]"
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="2.2"
            strokeLinecap="round"
          >
            <circle cx="12" cy="12" r="8" />
            <circle cx="12" cy="12" r="3.4" />
            <path d="M17 7 21 3" />
          </svg>
        </span>

        <span aria-hidden="true" className="w-px self-stretch bg-white/25" />

        <span className="min-w-[200px] flex-1">
          <span className="block text-[19px] font-extrabold text-white lg:text-[21px]">
            Seu objetivo é fluência.
          </span>
          <span className="mt-0.5 block text-[16px] text-[#C9D6EC] lg:text-[18px]">
            E cada aula te aproxima disso.
          </span>
        </span>

        <span aria-hidden="true" className="text-center">
          <span className="manuscrito block text-[32px] text-white">Keep learning! 💪</span>
          <span className="mx-auto mt-0.5 block h-[3px] w-[120px] rounded-pill bg-yellow" />
        </span>

        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className="flex-none"
        >
          <path d="m9 6 6 6-6 6" />
        </svg>
      </Link>
    </div>
  );
}
