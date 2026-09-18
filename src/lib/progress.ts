/**
 * Progresso real do aluno — o que o protótipo guardava em `localStorage` sob
 * `{ done, page, days }` e agora vive nas tabelas `LessonProgress` e `StudyDay`.
 *
 * ⚠️ MÓDULO DE SERVIDOR: importa o Prisma. Nunca importe de um `'use client'`.
 *
 * ⚠️ A lista de aulas é a **publicada** (`carregarTrilhaPublicada`, em
 * `@/lib/content/publicado`), a mesma da trilha: aula despublicada ou arquivada
 * no painel não entra no total nem vira "próxima aula" (o link daria 404). Sem
 * banco populado, aquela porta cai no conteúdo estático, então a Home continua
 * funcionando antes do seed — um aluno novo só não tem linha de progresso.
 *
 * Aula concluída que depois saiu do ar some da conta ("3 de 30", não "4 de 30"),
 * como na trilha. A linha de progresso continua no banco: se a aula voltar, a
 * conclusão volta junto.
 */
import type { ProgressStatus } from '@prisma/client';
import { cache } from 'react';

import { prisma } from '@/lib/db';
import {
  aulasEmOrdem,
  carregarTrilhaPublicada,
  type ResumoPublicado,
} from '@/lib/content/publicado';

/** O retrato de progresso que a Home, a trilha e o perfil consomem. */
export type UserProgress = {
  /** Aulas concluídas (status COMPLETED). */
  done: number;
  /** Total de aulas publicadas (42 com o curso inteiro no ar). */
  total: number;
  /** Percentual inteiro de 0 a 100, arredondado. */
  pct: number;
  /**
   * A aula a retomar: a primeira que ainda não foi concluída.
   * Com a trilha inteira concluída, é a última aula (não há "próxima").
   * `null` só se o conteúdo estiver vazio, o que hoje não acontece.
   */
  nextLesson: ResumoPublicado | null;
};

/** Uma linha de `LessonProgress` reduzida ao que o app usa. */
export type RegistroDeAula = {
  status: ProgressStatus;
  currentPage: number;
  /**
   * Acertos e total gravados na conclusão. É o placar daquele momento — o
   * recálculo do painel pode atualizá-lo (BACKOFFICE §6.4). `null` = não concluída.
   */
  score: number | null;
  total: number | null;
};

/**
 * Progresso por número de aula (1 a 42).
 *
 * `LessonProgress.lessonId` aponta para o cuid de `Lesson`, então o número
 * visível da aula vem do relacionamento — é ele que casa com o conteúdo.
 */
const carregarRegistros = cache(async (userId: string): Promise<Map<number, RegistroDeAula>> => {
  try {
    const linhas = await prisma.lessonProgress.findMany({
      where: { userId },
      select: {
        status: true,
        currentPage: true,
        score: true,
        total: true,
        lesson: { select: { number: true } },
      },
    });

    return new Map(
      linhas.map((linha) => [
        linha.lesson.number,
        {
          status: linha.status,
          currentPage: linha.currentPage,
          score: linha.score,
          total: linha.total,
        },
      ]),
    );
  } catch {
    // Banco indisponível ou tabela ainda não migrada: o app mostra a trilha
    // zerada em vez de derrubar a Home inteira. Sem log — não há nada de útil
    // aqui que o servidor já não tenha registrado, e o userId é dado pessoal.
    return new Map();
  }
});

/**
 * O progresso consolidado do aluno.
 *
 * Aluno novo (nenhuma linha no banco): 0 de N, 0% e a próxima aula é a primeira
 * publicada. "Próxima" segue a ordem da trilha (`aulasEmOrdem`), para a Home e o
 * "Continue aqui" da trilha apontarem para a mesma aula.
 */
export async function getUserProgress(userId: string): Promise<UserProgress> {
  const [trilha, registros] = await Promise.all([
    carregarTrilhaPublicada(),
    carregarRegistros(userId),
  ]);
  const aulas = aulasEmOrdem(trilha);
  const total = aulas.length;

  let done = 0;
  for (const aula of aulas) {
    if (registros.get(aula.id)?.status === 'COMPLETED') done += 1;
  }

  const proxima =
    aulas.find((aula) => registros.get(aula.id)?.status !== 'COMPLETED') ??
    aulas[aulas.length - 1] ??
    null;

  return {
    done,
    total,
    pct: total > 0 ? Math.round((done / total) * 100) : 0,
    nextLesson: proxima,
  };
}

/**
 * Tudo o que o aluno fez em cada aula, por número de aula. Aula ausente do mapa
 * = nunca aberta. Serve a `/progresso`, que precisa do status e do placar.
 */
export async function getLessonRecords(userId: string): Promise<Map<number, RegistroDeAula>> {
  return carregarRegistros(userId);
}

/**
 * O status de cada aula que o aluno já tocou, por número de aula.
 *
 * Aula ausente do mapa = `NOT_STARTED`. Serve à trilha, que precisa marcar
 * concluída/em andamento sem refazer a conta de `getUserProgress`.
 */
export async function getLessonStatuses(
  userId: string,
): Promise<Map<number, ProgressStatus>> {
  const registros = await carregarRegistros(userId);
  return new Map([...registros].map(([numero, r]) => [numero, r.status]));
}

/** Um dia em milissegundos. */
const UM_DIA_MS = 86_400_000;

/** O dia (sem hora) de um instante, em UTC, no formato `AAAA-MM-DD`. */
function diaUtc(instante: Date | number): string {
  return new Date(instante).toISOString().slice(0, 10);
}

/**
 * Sequência de dias estudados sem falhar (o "streak" do protótipo).
 *
 * A conta anda para trás a partir de hoje. Se ainda não houve estudo hoje, a
 * sequência de ontem continua valendo — o dia só "quebra" quando ontem também
 * ficou vazio. É o que evita a sequência zerar à meia-noite para quem estuda à
 * noite.
 *
 * ⚠️ `StudyDay.date` é `@db.Date` (dia puro, sem fuso). Quem gravar um dia de
 * estudo precisa usar meia-noite UTC, ou o dia escorrega e a sequência quebra
 * sozinha.
 */
export async function getStreak(userId: string): Promise<number> {
  let dias: { date: Date }[];

  try {
    dias = await prisma.studyDay.findMany({
      where: { userId },
      select: { date: true },
      orderBy: { date: 'desc' },
      // Mais de um ano de sequência é irrelevante para o número exibido e
      // evita carregar o histórico inteiro de um aluno antigo.
      take: 400,
    });
  } catch {
    return 0;
  }

  if (dias.length === 0) return 0;

  const estudados = new Set(dias.map((d) => diaUtc(d.date)));

  const agora = new Date();
  let cursor = Date.UTC(agora.getUTCFullYear(), agora.getUTCMonth(), agora.getUTCDate());

  if (!estudados.has(diaUtc(cursor))) {
    cursor -= UM_DIA_MS;
    if (!estudados.has(diaUtc(cursor))) return 0;
  }

  let sequencia = 0;
  while (estudados.has(diaUtc(cursor))) {
    sequencia += 1;
    cursor -= UM_DIA_MS;
  }

  return sequencia;
}

/** Rótulo pronto para a interface: "1 dia" / "N dias". */
export function rotuloDeSequencia(dias: number): string {
  return dias === 1 ? '1 dia' : `${dias} dias`;
}
