/**
 * Leitura, regras e recálculo dos alunos no painel — BACKOFFICE §2.7 e §6.5.
 *
 * ⚠️ MÓDULO DE SERVIDOR (importa o Prisma). Nunca importe de um `'use client'`.
 *
 * ⚠️ **Esta é a maior concentração de dado pessoal do produto** (§2.7). Três
 * regras valem em cada consulta deste arquivo, sem exceção:
 *
 * 1. **Nada de segredo sai daqui.** Nenhum `select` pede `passwordHash`, o
 *    `tokenHash` de sessão ou o hash de um token de verificação — nem mascarado.
 *    A tela mostra *quantas* sessões existem e de onde, nunca o que as abre.
 * 2. **Nada de dado pessoal em `console.log`.** O que vai para o log do servidor
 *    é id, número de aula e mensagem do driver. Nome e e-mail, nunca.
 * 3. **Sem exportação em massa.** Não existe função "baixar todos os alunos"
 *    aqui de propósito: a tela pagina de 50 em 50 e é isso.
 *
 * As mutações moram nas Server Actions de
 * `src/app/(admin)/admin/alunos/actions.ts`, atrás de `requireAdmin()` e
 * passando por `auditar()`. A única exceção é {@link recalcularProgressoDoAluno},
 * que escreve porque **recalcular é uma operação, não uma leitura** — e mesmo
 * ela só é chamada de dentro de uma action auditada.
 */
import { Prisma, type Plan, type ProgressStatus } from '@prisma/client';
import { z } from 'zod';

import { validarPaginas } from '@/lib/content/blocks';
import type { Lesson } from '@/lib/content/types';
import { prisma } from '@/lib/db';
import { pontuar } from '@/lib/lesson/score';

// ───────────────────────────────── limites ────────────────────────────────

/** Quantos alunos por página (§2.7). Lista de aluno não vem inteira nunca. */
export const ALUNOS_POR_PAGINA = 50;

/** O que conta como "ativo" no filtro da lista. */
export const JANELA_DE_ATIVIDADE_DIAS = 30;

/** Reenvios de verificação por aluno por hora (§2.7). */
export const REENVIOS_POR_HORA = 3;

/** A janela do limite acima, em milissegundos. */
export const JANELA_DE_REENVIO_MS = 60 * 60 * 1000;

/** Quantos dias de estudo a aba "progresso" desenha. */
export const DIAS_DE_ESTUDO_NA_TELA = 60;

// ───────────────────────────────── tipos ─────────────────────────────────

export type FiltroDeVerificacao = 'todos' | 'verificados' | 'pendentes';
export type FiltroDeAtividade = 'todos' | 'ativos' | 'inativos';
export type FiltroDePlano = Plan | 'todos';

/** O que a lista aceita filtrar. Tudo opcional: sem filtro, mostra todos. */
export type FiltrosDeAlunos = {
  /** Nome ou e-mail. */
  busca?: string;
  plano?: FiltroDePlano;
  verificado?: FiltroDeVerificacao;
  atividade?: FiltroDeAtividade;
  pagina?: number;
};

/** Uma linha da lista de alunos. */
export type AlunoDaLista = {
  id: string;
  nome: string;
  email: string;
  plano: Plan;
  verificado: boolean;
  aulasConcluidas: number;
  /** A aula em andamento mais recente, ou `null` se não há nenhuma aberta. */
  aulaAtual: { numero: number; titulo: string } | null;
  /** Último `lastSeenAt` entre as sessões vivas. `null` = nunca entrou. */
  ultimoAcesso: Date | null;
  criadoEm: Date;
};

export type ListaDeAlunos = {
  alunos: AlunoDaLista[];
  total: number;
  pagina: number;
  paginas: number;
};

/** Uma sessão do aluno, **sem** o `tokenHash`. */
export type SessaoDoAluno = {
  id: string;
  userAgent: string | null;
  ip: string | null;
  criadaEm: Date;
  ultimoUso: Date;
  expiraEm: Date;
  lembrar: boolean;
};

/** Estado do limite de reenvio de verificação para um aluno. */
export type LimiteDeReenvio = {
  permitido: boolean;
  /** Quantos e-mails de verificação saíram na última hora. */
  enviados: number;
  limite: number;
  /** Quando o próximo reenvio libera. `null` quando já está liberado. */
  liberaEm: Date | null;
};

/** A aba "conta". */
export type ContaDoAluno = {
  id: string;
  nome: string;
  email: string;
  plano: Plan;
  /** O painel também abre admin; o detalhe avisa para ninguém se confundir. */
  admin: boolean;
  verificadoEm: Date | null;
  criadoEm: Date;
  atualizadoEm: Date;
  /** Só "tem foto" — a URL da foto não precisa circular no painel. */
  temFoto: boolean;
  sessoes: SessaoDoAluno[];
  ultimoAcesso: Date | null;
  aulasConcluidas: number;
  aulasEmAndamento: number;
  respostasGravadas: number;
  diasDeEstudo: number;
  reenvio: LimiteDeReenvio;
};

/** Uma aula na aba "progresso". */
export type AulaDoAluno = {
  lessonId: string;
  numero: number;
  titulo: string;
  publicada: boolean;
  arquivada: boolean;
  status: ProgressStatus;
  paginaAtual: number;
  score: number | null;
  total: number | null;
  concluidaEm: Date | null;
  atualizadaEm: Date | null;
};

export type AprendizagemDoAluno = {
  aulas: AulaDoAluno[];
  concluidas: number;
  emAndamento: number;
  naoIniciadas: number;
  /** Datas dos últimos {@link DIAS_DE_ESTUDO_NA_TELA} dias com estudo. */
  diasDeEstudo: Date[];
};

/** Uma aula na aba "respostas" — agregado, nunca o texto que o aluno escreveu. */
export type RespostasDeUmaAula = {
  numero: number;
  titulo: string;
  /** Quantas respostas existem gravadas. */
  gravadas: number;
  /** Quantas já foram conferidas pelo aluno. */
  conferidas: number;
  /** Placar recontado agora pelo `pontuar()`. `null` quando não deu para recontar. */
  recontado: { acertos: number; total: number } | null;
  /** O que está guardado no `LessonProgress` — cache, não verdade (§6.4). */
  guardado: { score: number | null; total: number | null } | null;
  /** `true` quando o cache não bate com a recontagem. */
  divergente: boolean;
  /** Por que não deu para recontar, quando `recontado` é `null`. */
  observacao: string | null;
  atualizadaEm: Date | null;
};

export type RespostasDoAluno = {
  aulas: RespostasDeUmaAula[];
  totalDeRespostas: number;
};

/** Uma aula que o recálculo mexeu. */
export type AjusteDeProgresso = {
  numero: number;
  titulo: string;
  antes: {
    status: ProgressStatus;
    score: number | null;
    total: number | null;
    paginaAtual: number;
  };
  depois: { status: ProgressStatus; score: number; total: number; paginaAtual: number };
  /** A linha de progresso não existia e foi criada a partir das respostas. */
  criada: boolean;
};

export type ResultadoDoRecalculo = {
  aulasExaminadas: number;
  ajustes: AjusteDeProgresso[];
  /** Aulas deixadas como estavam, com o motivo. */
  ignoradas: { numero: number; motivo: string }[];
  /** Quantas linhas de progresso nasceram do recálculo. */
  criadas: number;
};

// ──────────────────────────────── validação ──────────────────────────────

/** Os três planos, como valor de formulário. */
export const esquemaDePlano = z.enum(['ESSENCIAL', 'COMPLETO', 'PREMIUM'], {
  error: 'escolha um dos três planos',
});

/**
 * O motivo obrigatório das ações sensíveis (§6.3).
 *
 * ⚠️ Não é enfeite: mudança de plano e troca do link de checkout são as duas
 * ações que a auditoria precisa conseguir explicar seis meses depois. "ok" não
 * explica nada, por isso o mínimo é 5 caracteres.
 */
export const esquemaDeMotivo = z
  .string()
  .trim()
  .min(5, 'escreva o motivo — a auditoria guarda este texto')
  .max(300, 'o motivo passou de 300 caracteres');

/** O id de um aluno vindo do formulário. */
export const esquemaDeId = z.string().trim().min(1, 'aluno não informado').max(64, 'id inválido');

// ─────────────────────────────── consultas ───────────────────────────────

const CAMPOS_DA_LISTA = {
  id: true,
  name: true,
  email: true,
  plan: true,
  emailVerifiedAt: true,
  createdAt: true,
} as const;

/**
 * A busca livre da lista: nome ou e-mail.
 *
 * Não busca por id: quem tem o id já tem o link do detalhe.
 */
function filtroDeBusca(busca: string): Prisma.UserWhereInput | null {
  const termo = busca.trim();
  if (termo === '') return null;

  return {
    OR: [
      { name: { contains: termo, mode: 'insensitive' } },
      { email: { contains: termo, mode: 'insensitive' } },
    ],
  };
}

function inicioDaJanelaDeAtividade(): Date {
  return new Date(Date.now() - JANELA_DE_ATIVIDADE_DIAS * 24 * 60 * 60 * 1000);
}

function filtroDeAtividade(atividade: FiltroDeAtividade): Prisma.UserWhereInput {
  if (atividade === 'todos') return {};
  const desde = inicioDaJanelaDeAtividade();
  const ativo: Prisma.UserWhereInput = { sessions: { some: { lastSeenAt: { gte: desde } } } };
  return atividade === 'ativos' ? ativo : { NOT: ativo };
}

function filtroDeVerificacao(verificado: FiltroDeVerificacao): Prisma.UserWhereInput {
  switch (verificado) {
    case 'verificados':
      return { emailVerifiedAt: { not: null } };
    case 'pendentes':
      return { emailVerifiedAt: null };
    case 'todos':
    default:
      return {};
  }
}

/**
 * A lista da tela, filtrada, buscada e paginada — **no servidor** (§2.7).
 *
 * ⚠️ Filtrar no cliente aqui seria despejar a base inteira de alunos no HTML.
 * A busca e a paginação são do banco, e o `take` é fixo em
 * {@link ALUNOS_POR_PAGINA}.
 *
 * Os três agregados por aluno (concluídas, aula atual, último acesso) saem em
 * consultas separadas limitadas aos ids da página, e não em subconsulta por
 * linha: são três consultas em vez de cento e cinquenta.
 */
export async function listarAlunos(filtros: FiltrosDeAlunos = {}): Promise<ListaDeAlunos> {
  const pagina = Math.max(1, Math.trunc(filtros.pagina ?? 1));
  const busca = filtroDeBusca(filtros.busca ?? '');
  const plano = filtros.plano ?? 'todos';

  const where: Prisma.UserWhereInput = {
    role: 'STUDENT',
    ...(plano === 'todos' ? {} : { plan: plano }),
    ...filtroDeVerificacao(filtros.verificado ?? 'todos'),
    ...filtroDeAtividade(filtros.atividade ?? 'todos'),
    ...(busca ?? {}),
  };

  const [total, linhas] = await Promise.all([
    prisma.user.count({ where }),
    prisma.user.findMany({
      where,
      orderBy: [{ createdAt: 'desc' }, { id: 'asc' }],
      skip: (pagina - 1) * ALUNOS_POR_PAGINA,
      take: ALUNOS_POR_PAGINA,
      select: CAMPOS_DA_LISTA,
    }),
  ]);

  const ids = linhas.map((linha) => linha.id);

  const [concluidas, acessos, emAndamento] = await Promise.all([
    ids.length === 0
      ? []
      : prisma.lessonProgress.groupBy({
          by: ['userId'],
          where: { userId: { in: ids }, status: 'COMPLETED' },
          _count: { _all: true },
        }),
    ids.length === 0
      ? []
      : prisma.session.groupBy({
          by: ['userId'],
          where: { userId: { in: ids } },
          _max: { lastSeenAt: true },
        }),
    ids.length === 0
      ? []
      : prisma.lessonProgress.findMany({
          where: { userId: { in: ids }, status: 'IN_PROGRESS' },
          orderBy: { updatedAt: 'desc' },
          select: { userId: true, lesson: { select: { number: true, title: true } } },
        }),
  ]);

  const porAluno = new Map(concluidas.map((linha) => [linha.userId, linha._count._all]));
  const ultimoAcesso = new Map(acessos.map((linha) => [linha.userId, linha._max.lastSeenAt]));

  // `emAndamento` já vem da mais recente para a mais antiga: a primeira
  // ocorrência de cada aluno é a aula atual dele.
  const aulaAtual = new Map<string, { numero: number; titulo: string }>();
  for (const linha of emAndamento) {
    if (aulaAtual.has(linha.userId)) continue;
    aulaAtual.set(linha.userId, { numero: linha.lesson.number, titulo: linha.lesson.title });
  }

  return {
    alunos: linhas.map((linha) => ({
      id: linha.id,
      nome: linha.name,
      email: linha.email,
      plano: linha.plan,
      verificado: linha.emailVerifiedAt !== null,
      aulasConcluidas: porAluno.get(linha.id) ?? 0,
      aulaAtual: aulaAtual.get(linha.id) ?? null,
      ultimoAcesso: ultimoAcesso.get(linha.id) ?? null,
      criadoEm: linha.createdAt,
    })),
    total,
    pagina,
    paginas: Math.max(1, Math.ceil(total / ALUNOS_POR_PAGINA)),
  };
}

/**
 * Quantos reenvios de verificação saíram na última hora, e quando libera o
 * próximo (§2.7: 3 por hora por aluno).
 *
 * ⚠️ Conta por `createdAt`, **não** por `usedAt: null`:
 * `createVerificationToken` marca os anteriores como usados ao criar um novo,
 * então filtrar por token vivo contaria sempre 1 e o limite nunca pegaria.
 */
export async function limiteDeReenvio(userId: string): Promise<LimiteDeReenvio> {
  const desde = new Date(Date.now() - JANELA_DE_REENVIO_MS);

  const recentes = await prisma.verificationToken.findMany({
    where: { userId, type: 'EMAIL_VERIFY', createdAt: { gt: desde } },
    orderBy: { createdAt: 'asc' },
    select: { createdAt: true },
  });

  const enviados = recentes.length;
  const permitido = enviados < REENVIOS_POR_HORA;
  const maisAntigo = recentes[0]?.createdAt ?? null;

  return {
    permitido,
    enviados,
    limite: REENVIOS_POR_HORA,
    liberaEm:
      permitido || maisAntigo === null
        ? null
        : new Date(maisAntigo.getTime() + JANELA_DE_REENVIO_MS),
  };
}

/**
 * A aba "conta" de um aluno. `null` quando o id não existe — a tela responde
 * `notFound()`.
 *
 * ⚠️ O `select` é explícito de ponta a ponta. `passwordHash` e `tokenHash` não
 * aparecem em lugar nenhum, e é assim que fica.
 */
export async function carregarContaDoAluno(id: string): Promise<ContaDoAluno | null> {
  const linha = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      plan: true,
      role: true,
      photoUrl: true,
      emailVerifiedAt: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  if (!linha) return null;

  const [sessoes, concluidas, emAndamento, respostas, diasDeEstudo, reenvio] = await Promise.all([
    prisma.session.findMany({
      where: { userId: id },
      orderBy: { lastSeenAt: 'desc' },
      take: 20,
      select: {
        id: true,
        userAgent: true,
        ip: true,
        createdAt: true,
        lastSeenAt: true,
        expiresAt: true,
        remember: true,
      },
    }),
    prisma.lessonProgress.count({ where: { userId: id, status: 'COMPLETED' } }),
    prisma.lessonProgress.count({ where: { userId: id, status: 'IN_PROGRESS' } }),
    prisma.exerciseAnswer.count({ where: { userId: id } }),
    prisma.studyDay.count({ where: { userId: id } }),
    limiteDeReenvio(id),
  ]);

  return {
    id: linha.id,
    nome: linha.name,
    email: linha.email,
    plano: linha.plan,
    admin: linha.role === 'ADMIN',
    verificadoEm: linha.emailVerifiedAt,
    criadoEm: linha.createdAt,
    atualizadoEm: linha.updatedAt,
    temFoto: linha.photoUrl !== null,
    sessoes: sessoes.map((sessao) => ({
      id: sessao.id,
      userAgent: sessao.userAgent,
      ip: sessao.ip,
      criadaEm: sessao.createdAt,
      ultimoUso: sessao.lastSeenAt,
      expiraEm: sessao.expiresAt,
      lembrar: sessao.remember,
    })),
    ultimoAcesso: sessoes[0]?.lastSeenAt ?? null,
    aulasConcluidas: concluidas,
    aulasEmAndamento: emAndamento,
    respostasGravadas: respostas,
    diasDeEstudo,
    reenvio,
  };
}

/**
 * A aba "progresso": as aulas do curso, o que o aluno fez em cada uma e os dias
 * de estudo recentes.
 *
 * Aula arquivada só entra se o aluno tiver progresso nela — sumir com a linha
 * esconderia que ele estudou algo que depois saiu do ar.
 */
export async function carregarAprendizagemDoAluno(id: string): Promise<AprendizagemDoAluno> {
  const desde = new Date(Date.now() - DIAS_DE_ESTUDO_NA_TELA * 24 * 60 * 60 * 1000);

  const [aulas, progresso, dias] = await Promise.all([
    prisma.lesson.findMany({
      orderBy: { number: 'asc' },
      select: { id: true, number: true, title: true, published: true, archivedAt: true },
    }),
    prisma.lessonProgress.findMany({
      where: { userId: id },
      select: {
        lessonId: true,
        status: true,
        currentPage: true,
        score: true,
        total: true,
        completedAt: true,
        updatedAt: true,
      },
    }),
    prisma.studyDay.findMany({
      where: { userId: id, date: { gte: desde } },
      orderBy: { date: 'asc' },
      select: { date: true },
    }),
  ]);

  const porAula = new Map(progresso.map((linha) => [linha.lessonId, linha]));

  const linhas: AulaDoAluno[] = aulas
    .filter((aula) => aula.archivedAt === null || porAula.has(aula.id))
    .map((aula) => {
      const passo = porAula.get(aula.id);
      return {
        lessonId: aula.id,
        numero: aula.number,
        titulo: aula.title,
        publicada: aula.published,
        arquivada: aula.archivedAt !== null,
        status: passo?.status ?? 'NOT_STARTED',
        paginaAtual: passo?.currentPage ?? 0,
        score: passo?.score ?? null,
        total: passo?.total ?? null,
        concluidaEm: passo?.completedAt ?? null,
        atualizadaEm: passo?.updatedAt ?? null,
      };
    });

  return {
    aulas: linhas,
    concluidas: linhas.filter((aula) => aula.status === 'COMPLETED').length,
    emAndamento: linhas.filter((aula) => aula.status === 'IN_PROGRESS').length,
    naoIniciadas: linhas.filter((aula) => aula.status === 'NOT_STARTED').length,
    diasDeEstudo: dias.map((dia) => dia.date),
  };
}

// ────────────────── recontagem: a base da aba e do recálculo ─────────────

const CAMPOS_PARA_PONTUAR = {
  id: true,
  number: true,
  code: true,
  title: true,
  subtitle: true,
  estimatedTime: true,
  pages: true,
  published: true,
  archivedAt: true,
} as const;

type LinhaPontuavel = Prisma.LessonGetPayload<{ select: typeof CAMPOS_PARA_PONTUAR }>;

/**
 * Transforma a linha do banco na forma que `pontuar()` consome, ou devolve o
 * motivo de não dar.
 *
 * ⚠️ O `id` daqui é o **número** da aula, não o cuid: é ele que entra na chave
 * `mc:{lessonId}:{blockId}:{i}` (§4). Trocar um pelo outro zera o placar de
 * todo mundo sem erro nenhum aparecer na tela.
 */
function montarAulaPontuavel(
  linha: LinhaPontuavel,
): { ok: true; aula: Lesson } | { ok: false; motivo: string } {
  if (linha.archivedAt !== null) {
    return { ok: false, motivo: 'aula arquivada — o placar guardado foi preservado' };
  }
  if (!linha.published) {
    return { ok: false, motivo: 'aula não publicada — o placar guardado foi preservado' };
  }

  const conferido = validarPaginas(linha.pages);
  if (!conferido.ok) {
    return {
      ok: false,
      motivo: `conteúdo publicado não passou no validador (${conferido.erros.length} erro(s))`,
    };
  }

  return {
    ok: true,
    aula: {
      id: linha.number,
      code: linha.code,
      title: linha.title,
      sub: linha.subtitle,
      time: linha.estimatedTime,
      pages: conferido.pages,
    },
  };
}

/** `answerKey` → `value`, do jeito que `pontuar()` espera. */
function mapaDeRespostas(
  respostas: readonly { answerKey: string; value: string }[],
): Map<string, string> {
  return new Map(respostas.map((resposta) => [resposta.answerKey, resposta.value]));
}

/**
 * A aba "respostas": por aula, quantas respostas existem e como o placar
 * recontado se compara ao guardado.
 *
 * ⚠️ **O que o aluno escreveu não aparece na tela.** O painel precisa saber
 * *se* ele respondeu e *quanto* acertou, não ler a produção livre dele — é o
 * mínimo de dado pessoal que resolve o problema (§2.7).
 */
export async function carregarRespostasDoAluno(id: string): Promise<RespostasDoAluno> {
  const respostas = await prisma.exerciseAnswer.findMany({
    where: { userId: id },
    select: { lessonId: true, answerKey: true, value: true, checked: true, updatedAt: true },
  });

  if (respostas.length === 0) return { aulas: [], totalDeRespostas: 0 };

  const ids = [...new Set(respostas.map((resposta) => resposta.lessonId))];

  const [aulas, progresso] = await Promise.all([
    prisma.lesson.findMany({ where: { id: { in: ids } }, select: CAMPOS_PARA_PONTUAR }),
    prisma.lessonProgress.findMany({
      where: { userId: id, lessonId: { in: ids } },
      select: { lessonId: true, score: true, total: true },
    }),
  ]);

  const guardados = new Map(progresso.map((linha) => [linha.lessonId, linha]));

  const linhas = aulas
    .map((aula): RespostasDeUmaAula => {
      const daAula = respostas.filter((resposta) => resposta.lessonId === aula.id);
      const montada = montarAulaPontuavel(aula);
      const recontado = montada.ok ? pontuar(montada.aula, mapaDeRespostas(daAula)) : null;
      const guardado = guardados.get(aula.id) ?? null;

      const atualizadaEm = daAula.reduce<Date | null>(
        (maior, resposta) =>
          maior === null || resposta.updatedAt > maior ? resposta.updatedAt : maior,
        null,
      );

      return {
        numero: aula.number,
        titulo: aula.title,
        gravadas: daAula.length,
        conferidas: daAula.filter((resposta) => resposta.checked).length,
        recontado: recontado ? { acertos: recontado.acertos, total: recontado.total } : null,
        guardado: guardado ? { score: guardado.score, total: guardado.total } : null,
        divergente:
          recontado !== null &&
          guardado !== null &&
          guardado.score !== null &&
          (guardado.score !== recontado.acertos || guardado.total !== recontado.total),
        observacao: montada.ok ? null : montada.motivo,
        atualizadaEm,
      };
    })
    .sort((a, b) => a.numero - b.numero);

  return { aulas: linhas, totalDeRespostas: respostas.length };
}

/**
 * Recalcula `score`/`total` a partir das respostas gravadas — BACKOFFICE §6.5.
 *
 * ⚠️ **Recalcular é recálculo, não edição.** Não existe, em lugar nenhum deste
 * projeto, um campo para digitar a nota de um aluno. O que esta função faz é
 * rodar o `pontuar()` de novo contra o conteúdo publicado e gravar o resultado
 * — nem mais, nem menos:
 *
 * - **Aula concluída continua concluída.** O status nunca regride: o aluno leu
 *   a aula, e uma questão que o PO trocou depois não desfaz isso.
 * - **Nunca promove para `COMPLETED`.** Concluir é ato do aluno, na tela dele.
 * - **`completedAt` não é tocado.**
 * - **Aula sem resposta nenhuma é pulada**, mesmo tendo placar guardado. Se as
 *   respostas sumiram, gravar 0 apagaria a evidência justamente no caso que o
 *   recálculo existe para diagnosticar. A tela lista a aula como ignorada.
 * - **Aula despublicada, arquivada ou com conteúdo inválido é pulada** com o
 *   motivo: recontar contra conteúdo que o aluno não pode abrir dá um número
 *   que não quer dizer nada.
 *
 * Escreve só as linhas que mudaram, numa transação. Quem chama é a Server
 * Action, que exige motivo e audita o resultado.
 */
export async function recalcularProgressoDoAluno(id: string): Promise<ResultadoDoRecalculo> {
  const [respostas, progresso] = await Promise.all([
    prisma.exerciseAnswer.findMany({
      where: { userId: id },
      select: { lessonId: true, answerKey: true, value: true },
    }),
    prisma.lessonProgress.findMany({
      where: { userId: id },
      select: {
        id: true,
        lessonId: true,
        status: true,
        currentPage: true,
        score: true,
        total: true,
      },
    }),
  ]);

  const ids = [
    ...new Set([
      ...respostas.map((resposta) => resposta.lessonId),
      ...progresso.map((linha) => linha.lessonId),
    ]),
  ];
  if (ids.length === 0) return { aulasExaminadas: 0, ajustes: [], ignoradas: [], criadas: 0 };

  const aulas = await prisma.lesson.findMany({
    where: { id: { in: ids } },
    select: CAMPOS_PARA_PONTUAR,
  });

  const porAula = new Map(progresso.map((linha) => [linha.lessonId, linha]));

  const ajustes: AjusteDeProgresso[] = [];
  const ignoradas: { numero: number; motivo: string }[] = [];
  const operacoes: Prisma.PrismaPromise<unknown>[] = [];
  let criadas = 0;

  for (const aula of [...aulas].sort((a, b) => a.number - b.number)) {
    const daAula = respostas.filter((resposta) => resposta.lessonId === aula.id);
    const atual = porAula.get(aula.id) ?? null;

    if (daAula.length === 0) {
      ignoradas.push({ numero: aula.number, motivo: 'nenhuma resposta gravada' });
      continue;
    }

    const montada = montarAulaPontuavel(aula);
    if (!montada.ok) {
      ignoradas.push({ numero: aula.number, motivo: montada.motivo });
      continue;
    }

    const placar = pontuar(montada.aula, mapaDeRespostas(daAula));
    const ultimaPagina = Math.max(0, montada.aula.pages.length - 1);
    const paginaAtual = Math.min(Math.max(0, atual?.currentPage ?? 0), ultimaPagina);
    const status: ProgressStatus = atual?.status === 'COMPLETED' ? 'COMPLETED' : 'IN_PROGRESS';

    const mudou =
      atual === null ||
      atual.score !== placar.acertos ||
      atual.total !== placar.total ||
      atual.status !== status ||
      atual.currentPage !== paginaAtual;

    if (!mudou) continue;

    ajustes.push({
      numero: aula.number,
      titulo: aula.title,
      antes: {
        status: atual?.status ?? 'NOT_STARTED',
        score: atual?.score ?? null,
        total: atual?.total ?? null,
        paginaAtual: atual?.currentPage ?? 0,
      },
      depois: { status, score: placar.acertos, total: placar.total, paginaAtual },
      criada: atual === null,
    });

    if (atual === null) {
      criadas += 1;
      operacoes.push(
        prisma.lessonProgress.create({
          data: {
            userId: id,
            lessonId: aula.id,
            status,
            currentPage: paginaAtual,
            score: placar.acertos,
            total: placar.total,
          },
        }),
      );
    } else {
      operacoes.push(
        prisma.lessonProgress.update({
          where: { id: atual.id },
          // `completedAt` fora do `data` de propósito: o recálculo não mexe na
          // data em que o aluno concluiu a aula.
          data: {
            status,
            currentPage: paginaAtual,
            score: placar.acertos,
            total: placar.total,
          },
        }),
      );
    }
  }

  if (operacoes.length > 0) await prisma.$transaction(operacoes);

  return { aulasExaminadas: aulas.length, ajustes, ignoradas, criadas };
}
