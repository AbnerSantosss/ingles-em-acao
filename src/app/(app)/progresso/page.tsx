/**
 * O progresso do aluno.
 *
 * ⚠️ Módulos e aulas vêm do conteúdo **publicado** (`carregarTrilhaPublicada`),
 * como na trilha e na Home: o que o PO escondeu ou renomeou no painel não
 * aparece aqui com o nome antigo, e a conta é sobre o que está no ar.
 *
 * Layout do Claude Designer (tela "Progresso"): cartão com o anel de 150px,
 * quatro números em grade `auto-fit`, desempenho por aula e progresso por
 * módulo. Tudo quebra por `flex-wrap`/`auto-fit`, então cabe em 375px.
 */
import type { CSSProperties } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';

import { requireUser } from '@/lib/auth/session';
import {
  aulasEmOrdem,
  carregarTrilhaPublicada,
  type ResumoPublicado,
} from '@/lib/content/publicado';
import { prisma } from '@/lib/db';
import {
  getLessonRecords,
  getStreak,
  getUserProgress,
  rotuloDeSequencia,
  type RegistroDeAula,
} from '@/lib/progress';

export const metadata: Metadata = { title: 'Progresso' };
export const dynamic = 'force-dynamic';

/** Sombra dos cartões brancos do design. */
const SOMBRA_DO_CARTAO = 'shadow-[0_6px_22px_rgba(11,31,75,.05)]';

type NumeroProps = {
  valor: string;
  rotulo: string;
  corDoValor: string;
  corDoRotulo?: string;
  fundo: string;
  borda: string;
};

function Numero({ valor, rotulo, corDoValor, corDoRotulo = '#0A1F4E', fundo, borda }: NumeroProps) {
  return (
    <div
      className="rounded-[18px] border border-solid px-[22px] py-5"
      style={{ background: fundo, borderColor: borda }}
    >
      <p className="m-0 text-[34px] font-black leading-none" style={{ color: corDoValor }}>
        {valor}
      </p>
      <p
        className="m-0 mt-1.5 text-[13px] font-extrabold tracking-[0.07em]"
        style={{ color: corDoRotulo }}
      >
        {rotulo}
      </p>
    </div>
  );
}

/** Raio e comprimento do arco — o mesmo 314,16 do design. */
const RAIO = 50;
const CIRCUNFERENCIA = 2 * Math.PI * RAIO;

/** O anel de 150px com o percentual de 34px no centro, como no design. */
function AnelDeProgresso({ pct, done, total }: { pct: number; done: number; total: number }) {
  const percentual = Math.min(100, Math.max(0, Math.round(pct)));
  const deslocamento = CIRCUNFERENCIA - (percentual / 100) * CIRCUNFERENCIA;
  // Mesma entrada animada do `ProgressRing`: o offset parte do círculo inteiro.
  const estiloDoArco = {
    strokeDasharray: `${CIRCUNFERENCIA}px`,
    strokeDashoffset: `${deslocamento}px`,
    '--iea-anel-total': `${CIRCUNFERENCIA}px`,
    animation: 'iea-anel-entrada 900ms cubic-bezier(0.22, 1, 0.36, 1) both',
  } as CSSProperties;

  return (
    <div
      className="relative h-[150px] w-[150px] flex-none"
      role="img"
      aria-label={`${percentual}% da trilha concluída — ${done} de ${total} aulas`}
    >
      {/* Mesmo `href` do ProgressRing: o React deduplica a folha no <head>. */}
      <style href="iea-anel-entrada" precedence="default">
        {'@keyframes iea-anel-entrada{from{stroke-dashoffset:var(--iea-anel-total)}}'}
      </style>
      <svg width="150" height="150" viewBox="0 0 120 120" aria-hidden="true">
        <circle cx="60" cy="60" r={RAIO} fill="none" stroke="#DCE6F2" strokeWidth="13" />
        <circle
          cx="60"
          cy="60"
          r={RAIO}
          fill="none"
          stroke="#12A594"
          strokeWidth="13"
          // Com 0% o `round` desenharia um pontinho teal fingindo progresso.
          strokeLinecap={percentual > 0 ? 'round' : 'butt'}
          transform="rotate(-90 60 60)"
          style={estiloDoArco}
        />
      </svg>
      <div
        aria-hidden="true"
        className="absolute inset-0 grid place-items-center text-[34px] font-black text-[#0A1F4E]"
      >
        {percentual}%
      </div>
    </div>
  );
}

/** Um cartão de módulo (ou "Outras aulas") na seção de progresso por módulo. */
type GrupoDeProgresso = {
  chave: string;
  rotulo: string | null;
  titulo: string;
  aulas: ResumoPublicado[];
};

/** "Aulas 1–6", ou a lista curta quando os números não são seguidos. */
function faixaDeAulas(aulas: readonly ResumoPublicado[]): string {
  const numeros = aulas.map((aula) => aula.id);
  const primeiro = numeros[0];
  const ultimo = numeros[numeros.length - 1];
  if (primeiro === undefined || ultimo === undefined) return '';
  if (numeros.length === 1) return `Aula ${primeiro}`;
  const seguidos = numeros.every((n, i) => n === primeiro + i);
  return seguidos ? `Aulas ${primeiro}–${ultimo}` : `Aulas ${numeros.join(', ')}`;
}

/** Aula concluída com placar — o que a seção "Desempenho por aula" lista. */
type LinhaDeDesempenho = { aula: ResumoPublicado; acertos: number; total: number };

function desempenhoPorAula(
  aulas: readonly ResumoPublicado[],
  registros: ReadonlyMap<number, RegistroDeAula>,
): LinhaDeDesempenho[] {
  const linhas: LinhaDeDesempenho[] = [];
  for (const aula of aulas) {
    const registro = registros.get(aula.id);
    if (registro?.status !== 'COMPLETED') continue;
    // Aula sem exercício pontuável (total 0) não tem acerto para mostrar.
    if (registro.total === null || registro.total <= 0 || registro.score === null) continue;
    linhas.push({ aula, acertos: registro.score, total: registro.total });
  }
  return linhas;
}

/** Cor da barra de desempenho: verde a partir de 70%, azul-petróleo abaixo, cinza sem acerto. */
function corDoDesempenho(percentual: number): string {
  if (percentual >= 70) return '#1B6B3A';
  if (percentual > 0) return '#0E9BAE';
  return '#C7CBD6';
}

/** A frase sob o título: aula em aberto primeiro; senão, o incentivo do design. */
function incentivo(emAndamento: number, pct: number): string {
  if (emAndamento > 0) {
    const aulas = emAndamento === 1 ? '1 aula começada' : `${emAndamento} aulas começadas`;
    return `${aulas} e ainda em aberto. Termine uma antes de abrir outra.`;
  }
  if (pct >= 60) return 'Ótimo! Você está no caminho certo.';
  if (pct > 0) return 'Bom ritmo! Siga uma aula por dia.';
  return 'Uma aula por dia já muda o seu inglês em um mês.';
}

export default async function ProgressoPage() {
  const usuario = await requireUser();
  const [progresso, registros, sequencia, trilha, respostasSalvas] = await Promise.all([
    getUserProgress(usuario.id),
    getLessonRecords(usuario.id),
    getStreak(usuario.id),
    carregarTrilhaPublicada(),
    // "Respostas salvas" do design: cada resposta de exercício gravada.
    prisma.exerciseAnswer.count({ where: { userId: usuario.id } }),
  ]);

  const { done, total, pct } = progresso;
  const statusDa = (numero: number) => registros.get(numero)?.status;
  const emOrdem = aulasEmOrdem(trilha);
  const emAndamento = emOrdem.filter((aula) => statusDa(aula.id) === 'IN_PROGRESS').length;

  const grupos: GrupoDeProgresso[] = [
    ...trilha.grupos
      .filter((grupo) => grupo.aulas.length > 0)
      .map(({ modulo, aulas }) => ({
        chave: `modulo-${modulo.id}`,
        rotulo: `MÓDULO ${String(modulo.order).padStart(2, '0')}`,
        titulo: modulo.title,
        aulas,
      })),
    ...(trilha.soltas.length > 0
      ? [{ chave: 'outras', rotulo: null, titulo: 'Outras aulas', aulas: trilha.soltas }]
      : []),
  ];
  const cursoCompleto =
    trilha.soltas.length === 0 &&
    grupos.length === 7 &&
    grupos.every((grupo) => grupo.aulas.length === 6);
  const desempenho = desempenhoPorAula(emOrdem, registros);

  return (
    <div className="flex flex-col gap-4">
      <section
        className={`flex flex-wrap items-center gap-[34px] rounded-[22px] bg-white px-6 py-7 sm:px-[34px] sm:py-[30px] ${SOMBRA_DO_CARTAO}`}
      >
        <AnelDeProgresso pct={pct} done={done} total={total} />

        <div className="min-w-[250px] flex-1 max-[400px]:min-w-0 max-[400px]:basis-full">
          <p className="m-0 mb-2 text-[15px] font-extrabold tracking-[0.14em] text-[#5B6B7F]">
            SEU PROGRESSO
          </p>
          <h1 className="m-0 mb-2.5 text-[42px] font-black leading-[1.04] tracking-[-0.025em] text-[#0A1F4E] max-[400px]:text-[36px]">
            {done} de {total} aulas
          </h1>
          <p className="m-0 text-[19px] leading-[1.45] text-[#5B6B7F]">
            {incentivo(emAndamento, pct)}
          </p>
        </div>

        <div aria-hidden="true" className="flex-none rotate-[-6deg] text-center">
          <p className="manuscrito m-0 max-w-[210px] text-[30px] leading-[1.15] text-[#1B3A6B]">
            Um passo por dia já é progresso!
          </p>
          <svg width="180" height="16" viewBox="0 0 180 16" fill="none" className="mt-0.5">
            <path d="M6 11C44 4 136 2 174 8" stroke="#8FBEF5" strokeWidth="5" strokeLinecap="round" />
          </svg>
        </div>
      </section>

      <section
        aria-label="Números da sua trilha"
        className="grid grid-cols-[repeat(auto-fit,minmax(230px,1fr))] gap-3.5"
      >
        <Numero
          valor={String(done)}
          rotulo="AULAS CONCLUÍDAS"
          corDoValor="#0F8F7A"
          fundo="#EAF7F1"
          borda="#D3EDE2"
        />
        <Numero
          valor={String(respostasSalvas)}
          rotulo="RESPOSTAS SALVAS"
          corDoValor="#5B21B6"
          corDoRotulo="#5B21B6"
          fundo="#F2EFFD"
          borda="#E3DCF9"
        />
        <Numero
          valor={`${pct}%`}
          rotulo="DA TRILHA"
          corDoValor="#E39C10"
          fundo="#FEF7E0"
          borda="#F8E7B4"
        />
        <Numero
          valor={rotuloDeSequencia(sequencia)}
          rotulo="SEQUÊNCIA"
          corDoValor="#1B6BE3"
          fundo="#EAF2FE"
          borda="#D6E5FB"
        />
      </section>

      <section className={`rounded-[20px] bg-white p-6 ${SOMBRA_DO_CARTAO}`}>
        <h2 className="m-0 mb-1 text-[19px] font-black tracking-[-0.01em] text-[#0A1F4E]">
          Desempenho por aula
        </h2>
        {desempenho.length === 0 ? (
          <p className="m-0 text-[16px] leading-snug text-[#5B6B7F]">
            Conclua uma aula com exercícios e os seus acertos aparecem aqui — o placar de cada
            aula, do jeito que ficou ao terminar.
          </p>
        ) : (
          <>
            <p className="m-0 mb-[18px] text-[16px] text-[#5B6B7F]">
              Acertos nos exercícios de cada aula concluída.
            </p>
            <ul className="m-0 flex list-none flex-col p-0">
              {desempenho.map(({ aula, acertos, total: totalDaAula }) => {
                const percentual = Math.round((acertos / totalDaAula) * 100);
                const cor = corDoDesempenho(percentual);
                return (
                  <li key={aula.id} className="border-t border-solid border-[#EEF2F8]">
                    <Link
                      href={`/aula/${aula.slug}/resultado`}
                      aria-label={`${aula.code} — ${aula.title}: ${acertos} de ${totalDaAula} acertos (${percentual}%)`}
                      className="-mx-2 block rounded-[12px] px-2 py-3.5 transition-colors hover:bg-[#F5F8FC]"
                    >
                      <span className="mb-2.5 flex flex-wrap items-baseline justify-between gap-3">
                        <span className="text-[18px] font-extrabold text-[#0A1F4E]">
                          {aula.code} — {aula.title}
                        </span>
                        <span className="text-[16px] font-extrabold" style={{ color: cor }}>
                          {acertos}/{totalDaAula}
                        </span>
                      </span>
                      <span className="block h-2.5 overflow-hidden rounded-full bg-[#EAF0F7]">
                        <span
                          className="block h-full rounded-full transition-[width] duration-500"
                          style={{ width: `${percentual}%`, background: cor }}
                        />
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </section>

      <section className={`rounded-[20px] bg-white p-6 ${SOMBRA_DO_CARTAO}`}>
        <h2 className="m-0 mb-1 text-[19px] font-black tracking-[-0.01em] text-[#0A1F4E]">
          Progresso por módulo
        </h2>
        <p className="m-0 mb-[18px] text-[16px] text-[#5B6B7F]">
          {cursoCompleto
            ? 'Sete módulos, seis aulas cada.'
            : 'As aulas que estão no ar, na ordem da trilha.'}
        </p>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-3.5">
          {grupos.map(({ chave, rotulo, titulo, aulas }) => {
            const concluidas = aulas.filter((aula) => statusDa(aula.id) === 'COMPLETED').length;
            const percentualDoModulo =
              aulas.length > 0 ? Math.round((concluidas / aulas.length) * 100) : 0;

            return (
              <div
                key={chave}
                className="rounded-[16px] border-[1.5px] border-solid border-[#DCE6F2] p-[18px]"
              >
                {rotulo ? (
                  <p className="m-0 text-[13px] font-extrabold tracking-[0.1em] text-[#1B6BE3]">
                    {rotulo}
                  </p>
                ) : null}
                <p className="m-0 mb-2 mt-0.5 text-[18px] font-extrabold text-[#0A1F4E] text-pretty">
                  {titulo}
                </p>

                <div
                  className="mb-2 h-[9px] overflow-hidden rounded-full bg-[#EAF0F7]"
                  role="progressbar"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={percentualDoModulo}
                  aria-label={rotulo ? `${rotulo}: ${titulo}` : titulo}
                >
                  <div
                    className="h-full rounded-full bg-[#12A594] transition-[width] duration-500"
                    style={{ width: `${percentualDoModulo}%` }}
                  />
                </div>

                <p className="m-0 text-[14px] text-[#5B6B7F]">
                  {faixaDeAulas(aulas)} · {concluidas} de {aulas.length} concluídas
                </p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
