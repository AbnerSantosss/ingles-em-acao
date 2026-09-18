/**
 * O que o aluno faz dentro de uma aula, no banco: as linhas de `ExerciseAnswer`
 * e a linha de `LessonProgress` daquela aula, mais o `StudyDay` do dia.
 *
 * ⚠️ MÓDULO DE SERVIDOR: importa o Prisma. Nunca importe de um `'use client'`.
 *
 * Três decisões que este arquivo carrega, e o porquê de cada uma:
 *
 * 1. **`lessonId` é o cuid de `Lesson`, não o número da aula.** O catálogo que a
 *    tela lê é estático (`src/lib/content/lessons.ts`); o banco guarda o que o
 *    aluno fez com ele. A ponte entre os dois é `Lesson.number`, resolvida a cada
 *    gravação — sem cache. Renumerar aula é ação de alto risco (BACKOFFICE §6.6):
 *    um mapa número→cuid guardado em memória sobreviveria à renumeração e passaria
 *    a gravar resposta na aula errada, em silêncio.
 *
 * 2. **Banco indisponível não derruba a aula.** Mesmo espírito de
 *    `src/lib/progress.ts`: a leitura devolve vazio e a gravação devolve `false`,
 *    para quem chamou avisar o aluno. O aluno continua lendo; só não fica gravado.
 *    Sem log — não há nada de útil aqui que o servidor já não tenha registrado, e
 *    `userId` é dado pessoal.
 *
 * 3. **`COMPLETED` nunca regride** (BACKOFFICE §6.4, regra 5). Responder de novo
 *    uma aula já concluída atualiza a resposta e a posição de leitura, mas não
 *    rebaixa o status nem reescreve o `completedAt` da primeira conclusão.
 */
import type { ProgressStatus } from '@prisma/client';

import { prisma } from '@/lib/db';

// ──────────────────────────────── leitura ────────────────────────────────

/** As respostas gravadas de uma aula, no formato que `ProvedorPersistente` espera. */
export type RespostasDaAula = {
  /** `answerKey` → `value`. */
  valores: Readonly<Record<string, string>>;
  /** As `answerKey` cujo `checked` já é `true`. */
  conferidos: readonly string[];
  /** `false` quando o banco não respondeu (ou a aula não existe na tabela `Lesson`). */
  disponivel: boolean;
};

/** A linha de `LessonProgress` da aula, já com a página dentro do intervalo válido. */
export type ProgressoDaAula = {
  status: ProgressStatus;
  /** Índice de 0 a `pageCount - 1`. */
  currentPage: number;
  /** Cache do placar — a verdade é recontar com `pontuar()` (BACKOFFICE §6.4, regra 4). */
  score: number | null;
  total: number | null;
  completedAt: Date | null;
  /** `false` quando o banco não respondeu. */
  disponivel: boolean;
};

const RESPOSTAS_VAZIAS: RespostasDaAula = { valores: {}, conferidos: [], disponivel: false };

const PROGRESSO_VAZIO: ProgressoDaAula = {
  status: 'NOT_STARTED',
  currentPage: 0,
  score: null,
  total: null,
  completedAt: null,
  disponivel: false,
};

/**
 * O cuid da aula pelo número visível (1 a 42), ou `null` quando o banco está fora
 * ou a tabela `Lesson` ainda não foi semeada.
 */
export async function resolverLessonId(numeroDaAula: number): Promise<string | null> {
  try {
    const linha = await prisma.lesson.findUnique({
      where: { number: numeroDaAula },
      select: { id: true },
    });
    return linha?.id ?? null;
  } catch {
    // Banco fora: quem chamou trata como "não deu para gravar".
    return null;
  }
}

/** Todas as respostas do aluno naquela aula. */
export async function carregarRespostasDaAula(
  userId: string,
  numeroDaAula: number,
): Promise<RespostasDaAula> {
  const lessonId = await resolverLessonId(numeroDaAula);
  if (lessonId === null) return RESPOSTAS_VAZIAS;

  try {
    const linhas = await prisma.exerciseAnswer.findMany({
      where: { userId, lessonId },
      select: { answerKey: true, value: true, checked: true },
    });

    const valores: Record<string, string> = {};
    const conferidos: string[] = [];

    for (const linha of linhas) {
      valores[linha.answerKey] = linha.value;
      if (linha.checked) conferidos.push(linha.answerKey);
    }

    return { valores, conferidos, disponivel: true };
  } catch {
    return RESPOSTAS_VAZIAS;
  }
}

/** As mesmas respostas no formato que `pontuar()` consome. */
export function mapaDeRespostas(respostas: RespostasDaAula): Map<string, string> {
  return new Map(Object.entries(respostas.valores));
}

/** Mantém a página dentro do intervalo válido da aula. */
function paginaValida(pagina: number, totalDePaginas: number): number {
  if (!Number.isFinite(pagina) || pagina <= 0) return 0;
  return Math.min(Math.trunc(pagina), Math.max(totalDePaginas - 1, 0));
}

/**
 * O progresso do aluno naquela aula.
 *
 * ⚠️ `currentPage` é índice por posição: se o PO apagar páginas, o índice gravado
 * pode apontar para o nada. O clamp aqui é o que impede a tela branca
 * (BACKOFFICE §6.4, regra 2).
 */
export async function carregarProgressoDaAula(
  userId: string,
  numeroDaAula: number,
  totalDePaginas: number,
): Promise<ProgressoDaAula> {
  const lessonId = await resolverLessonId(numeroDaAula);
  if (lessonId === null) return PROGRESSO_VAZIO;

  try {
    const linha = await prisma.lessonProgress.findUnique({
      where: { userId_lessonId: { userId, lessonId } },
      select: {
        status: true,
        currentPage: true,
        score: true,
        total: true,
        completedAt: true,
      },
    });

    if (linha === null) return { ...PROGRESSO_VAZIO, disponivel: true };

    return {
      status: linha.status,
      currentPage: paginaValida(linha.currentPage, totalDePaginas),
      score: linha.score,
      total: linha.total,
      completedAt: linha.completedAt,
      disponivel: true,
    };
  } catch {
    return PROGRESSO_VAZIO;
  }
}

// ─────────────────────────────── gravação ────────────────────────────────

/** Uma linha de `ExerciseAnswer`, do jeito que o contexto de interação a produz. */
export type EntradaDeResposta = {
  answerKey: string;
  value: string;
  checked: boolean;
  correct: boolean | null;
};

/** Promove a aula a `IN_PROGRESS` sem nunca rebaixar uma já concluída. */
async function marcarEmAndamento(userId: string, lessonId: string): Promise<void> {
  try {
    const { count } = await prisma.lessonProgress.updateMany({
      where: { userId, lessonId, status: { not: 'COMPLETED' } },
      data: { status: 'IN_PROGRESS' },
    });

    if (count === 0) {
      await prisma.lessonProgress.upsert({
        where: { userId_lessonId: { userId, lessonId } },
        create: { userId, lessonId, status: 'IN_PROGRESS', currentPage: 0 },
        // Aula já concluída: `COMPLETED` não regride por uma resposta nova.
        update: {},
      });
    }
  } catch {
    // A resposta já está gravada; o status é detalhe que a próxima gravação conserta.
  }
}

/**
 * Marca hoje como dia estudado.
 *
 * ⚠️ `StudyDay.date` é `@db.Date` (dia puro, sem fuso). Gravar o instante local
 * faria o dia escorregar e a sequência quebrar sozinha — por isso meia-noite UTC,
 * exatamente o dia que `getStreak()` procura em `src/lib/progress.ts`.
 */
export async function registrarDiaDeEstudo(userId: string): Promise<void> {
  const agora = new Date();
  const hoje = new Date(
    Date.UTC(agora.getUTCFullYear(), agora.getUTCMonth(), agora.getUTCDate()),
  );

  try {
    await prisma.studyDay.upsert({
      where: { userId_date: { userId, date: hoje } },
      create: { userId, date: hoje },
      update: {},
    });
  } catch {
    // Banco fora: perde-se o dia na sequência, não a aula. Segue.
  }
}

/**
 * Grava (ou atualiza) uma resposta, marca a aula como em andamento e registra o
 * dia de estudo. Devolve `false` quando nada foi gravado.
 */
export async function gravarResposta(
  userId: string,
  numeroDaAula: number,
  entrada: EntradaDeResposta,
): Promise<boolean> {
  const lessonId = await resolverLessonId(numeroDaAula);
  if (lessonId === null) return false;

  try {
    await prisma.exerciseAnswer.upsert({
      where: { userId_answerKey: { userId, answerKey: entrada.answerKey } },
      create: {
        userId,
        lessonId,
        answerKey: entrada.answerKey,
        value: entrada.value,
        checked: entrada.checked,
        correct: entrada.correct,
      },
      update: {
        value: entrada.value,
        checked: entrada.checked,
        correct: entrada.correct,
      },
    });
  } catch {
    return false;
  }

  await marcarEmAndamento(userId, lessonId);
  await registrarDiaDeEstudo(userId);
  return true;
}

/** Guarda a página em que o aluno está. Devolve `false` quando nada foi gravado. */
export async function gravarPagina(
  userId: string,
  numeroDaAula: number,
  pagina: number,
): Promise<boolean> {
  const lessonId = await resolverLessonId(numeroDaAula);
  if (lessonId === null) return false;

  try {
    // Aula ainda não concluída: anda a página e o status junto.
    const { count } = await prisma.lessonProgress.updateMany({
      where: { userId, lessonId, status: { not: 'COMPLETED' } },
      data: { currentPage: pagina, status: 'IN_PROGRESS' },
    });

    if (count === 0) {
      // Ou não havia linha, ou a aula já está concluída — nos dois casos a
      // posição de leitura continua andando, o status não.
      await prisma.lessonProgress.upsert({
        where: { userId_lessonId: { userId, lessonId } },
        create: { userId, lessonId, status: 'IN_PROGRESS', currentPage: pagina },
        update: { currentPage: pagina },
      });
    }

    return true;
  } catch {
    return false;
  }
}

/** O placar que fecha a aula. `score`/`total` já vêm recontados pelo servidor. */
export type EntradaDeConclusao = {
  score: number;
  total: number;
  /** Última página da aula — é onde o aluno fica ao voltar para revisar. */
  ultimaPagina: number;
};

/**
 * Fecha a aula: `COMPLETED`, placar, `completedAt` e o dia de estudo.
 * Reconcluir não reescreve o `completedAt` da primeira vez.
 */
export async function gravarConclusao(
  userId: string,
  numeroDaAula: number,
  entrada: EntradaDeConclusao,
): Promise<boolean> {
  const lessonId = await resolverLessonId(numeroDaAula);
  if (lessonId === null) return false;

  try {
    const existente = await prisma.lessonProgress.findUnique({
      where: { userId_lessonId: { userId, lessonId } },
      select: { completedAt: true },
    });

    const agora = new Date();

    await prisma.lessonProgress.upsert({
      where: { userId_lessonId: { userId, lessonId } },
      create: {
        userId,
        lessonId,
        status: 'COMPLETED',
        currentPage: entrada.ultimaPagina,
        score: entrada.score,
        total: entrada.total,
        completedAt: agora,
      },
      update: {
        status: 'COMPLETED',
        currentPage: entrada.ultimaPagina,
        score: entrada.score,
        total: entrada.total,
        completedAt: existente?.completedAt ?? agora,
      },
    });
  } catch {
    return false;
  }

  await registrarDiaDeEstudo(userId);
  return true;
}
