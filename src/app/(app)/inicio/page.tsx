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
      {/* Faixa compacta: o destaque da tela fica com a aula a continuar. */}
      <div className="relative isolate flex flex-col gap-4 pb-5 pt-1 lg:pb-6 lg:pt-2">
        <div
          aria-hidden="true"
          className="absolute bottom-0 -top-5 left-1/2 -z-10 w-screen -translate-x-1/2 overflow-hidden bg-navy lg:-top-7"
          style={{ backgroundImage: 'linear-gradient(90deg, rgba(10,31,78,.96), rgba(10,31,78,.76) 48%, rgba(10,31,78,.18)), url(/brand/aluno-new-york.webp)', backgroundSize: 'cover', backgroundPosition: 'center 58%' }}
        />

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

        <div className="grid min-w-0 items-center gap-4 lg:grid-cols-[1fr_340px] lg:gap-8">
          <header className="min-w-0">
            <p className="m-0 mb-1.5 text-[12px] font-bold tracking-[0.14em] text-yellow">
              OLÁ, {primeiroNome(usuario.name)} 👋
            </p>
            <h1 className="m-0 text-[28px] font-black leading-[1.12] tracking-[-0.025em] text-white text-balance lg:text-[34px]">
              Continue de <span className="text-yellow">onde parou</span>
            </h1>
            <p className="m-0 mt-2 text-[14px] leading-snug text-white/90 lg:text-[15px]">
              Seu inglês avança uma aula por vez.
            </p>
          </header>

          <section
            aria-label="Seu progresso"
            className="flex min-w-0 items-center gap-3 rounded-[16px] bg-surface px-4 py-3 shadow-[0_8px_26px_rgba(11,31,75,0.07)]"
          >
            <ProgressRing pct={pct} done={done} total={total} size={68} caption={false} />
            <div className="min-w-0 flex-1">
              <p className="m-0 text-[10px] font-extrabold tracking-[0.12em] text-muted">SEU PROGRESSO</p>
              <p className="m-0 mt-0.5 text-[21px] font-black leading-tight text-navy">{done} de {total} aulas</p>
              <p className="m-0 mt-1 text-[12px] leading-snug text-muted">{fraseDeIncentivo(pct, sequencia)}</p>
            </div>
          </section>
        </div>
      </div>

      {nextLesson ? (
        <NextLessonCard
          lesson={nextLesson}
          label={concluiuTudo ? 'REVER AULA' : 'CONTINUAR AULA'}
          progresso={trilha.itens.find((item) => item.id === nextLesson.id)?.progresso}
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
