/**
 * Acesso direto ao banco de DESENVOLVIMENTO para os testes E2E.
 *
 * O E2E roda contra o `npm run dev`, que lê o banco do `.env` — então é nele que
 * os testes preparam e desfazem estado. Três travas, porque aqui se apaga dado:
 *
 * - **Nunca o banco de teste.** Nome terminado em `_test` é do Vitest (que o
 *   limpa por conta própria); o dev server não o enxerga.
 * - **Nunca produção.** `NODE_ENV=production` recusa, e o host precisa ser local.
 * - **Só contas de demonstração.** O que apaga progresso filtra por e-mail
 *   `@dev.local` — as contas criadas pelos botões "Entrar como …" de `/entrar`.
 *
 * Nada aqui imprime a URL do banco: ela carrega a senha.
 */
import path from 'node:path';

import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, type VideoKind } from '@prisma/client';

/** O domínio das contas de demonstração (`src/app/(auth)/dev-actions.ts`). */
export const DOMINIO_DE_DEV = '@dev.local';

export const EMAIL_ALUNO = `aluno${DOMINIO_DE_DEV}`;
export const EMAIL_ESSENCIAL = `essencial${DOMINIO_DE_DEV}`;
export const EMAIL_ADMIN = `admin${DOMINIO_DE_DEV}`;

const HOSTS_LOCAIS = new Set(['localhost', '127.0.0.1', '[::1]', '::1']);

function urlDoBancoDeDev(): string {
  if (!process.env.DATABASE_URL) {
    try {
      // e2e/support → e2e → app-web
      process.loadEnvFile(path.resolve(__dirname, '..', '..', '.env'));
    } catch {
      // Sem .env: segue para o erro abaixo, que explica o que falta.
    }
  }

  const bruta = process.env.DATABASE_URL;
  if (!bruta) {
    throw new Error('Defina DATABASE_URL no .env de app-web: o E2E prepara estado no banco de dev.');
  }
  if (process.env.NODE_ENV === 'production') {
    throw new Error('O E2E não mexe em banco com NODE_ENV=production.');
  }

  const url = new URL(bruta);
  const nome = url.pathname.replace(/^\//, '');
  if (nome.endsWith('_test')) {
    throw new Error(
      `O E2E roda contra o banco do dev server, não contra o de teste ("${nome}"). Confira o DATABASE_URL.`,
    );
  }
  if (!HOSTS_LOCAIS.has(url.hostname)) {
    throw new Error('O E2E só mexe em banco local (localhost). Confira o DATABASE_URL.');
  }
  return bruta;
}

let cliente: PrismaClient | null = null;

/** Um cliente por processo do Playwright; abre na primeira chamada. */
export function bancoDeDev(): PrismaClient {
  if (!cliente) {
    cliente = new PrismaClient({
      adapter: new PrismaPg({ connectionString: urlDoBancoDeDev() }),
      log: ['warn', 'error'],
    });
  }
  return cliente;
}

export async function fecharBancoDeDev(): Promise<void> {
  if (!cliente) return;
  const aberto = cliente;
  cliente = null;
  await aberto.$disconnect();
}

// ─────────────────────────────── progresso ────────────────────────────────

/**
 * Zera o progresso das contas de demonstração: páginas, conclusões, respostas e
 * dias de estudo. **Só** de e-mails `@dev.local` — conta de verdade no banco de
 * dev (criada pelo formulário) não é tocada.
 */
export async function zerarProgressoDasContasDeDev(): Promise<{
  progressos: number;
  respostas: number;
  diasDeEstudo: number;
}> {
  const banco = bancoDeDev();
  const dasContasDeDev = { user: { email: { endsWith: DOMINIO_DE_DEV } } };

  const [progressos, respostas, diasDeEstudo] = await banco.$transaction([
    banco.lessonProgress.deleteMany({ where: dasContasDeDev }),
    banco.exerciseAnswer.deleteMany({ where: dasContasDeDev }),
    banco.studyDay.deleteMany({ where: dasContasDeDev }),
  ]);

  return {
    progressos: progressos.count,
    respostas: respostas.count,
    diasDeEstudo: diasDeEstudo.count,
  };
}

/** A resposta gravada de uma conta para uma chave (`mc:1:a1mc1:0`), ou `null`. */
export async function lerResposta(
  email: string,
  answerKey: string,
): Promise<{ value: string; checked: boolean; correct: boolean | null } | null> {
  return bancoDeDev().exerciseAnswer.findFirst({
    where: { answerKey, user: { email } },
    select: { value: true, checked: true, correct: true },
  });
}

/** O progresso de uma conta numa aula (pelo número), ou `null`. */
export async function lerProgresso(
  email: string,
  numeroDaAula: number,
): Promise<{ status: string; currentPage: number } | null> {
  return bancoDeDev().lessonProgress.findFirst({
    where: { user: { email }, lesson: { number: numeroDaAula } },
    select: { status: true, currentPage: true },
  });
}

// ──────────────────────────────── aulas ───────────────────────────────────

/** O que os testes mexem numa aula e precisam devolver como estava. */
export type FotoDaAula = {
  number: number;
  slug: string;
  published: boolean;
  publishedAt: Date | null;
  archivedAt: Date | null;
  videoKind: VideoKind | null;
  videoRef: string | null;
  videoUrl: string | null;
  videoIsDefault: boolean;
  videoUpdatedAt: Date | null;
};

/** Lê o estado atual da aula. Falha se a aula não existir no banco de dev. */
export async function fotografarAula(numero: number): Promise<FotoDaAula> {
  const linha = await bancoDeDev().lesson.findUnique({
    where: { number: numero },
    select: {
      number: true,
      slug: true,
      published: true,
      publishedAt: true,
      archivedAt: true,
      videoKind: true,
      videoRef: true,
      videoUrl: true,
      videoIsDefault: true,
      videoUpdatedAt: true,
    },
  });
  if (!linha) {
    throw new Error(`A aula ${numero} não existe no banco de dev. Rode o seed antes do E2E.`);
  }
  return linha;
}

/** Devolve à aula os campos de vídeo fotografados antes do teste. */
export async function restaurarVideoDaAula(foto: FotoDaAula): Promise<void> {
  await bancoDeDev().lesson.update({
    where: { number: foto.number },
    data: {
      videoKind: foto.videoKind,
      videoRef: foto.videoRef,
      videoUrl: foto.videoUrl,
      videoIsDefault: foto.videoIsDefault,
      videoUpdatedAt: foto.videoUpdatedAt,
    },
  });
}

/** Aponta a videoaula da aula para um vídeo do YouTube (só no banco de dev). */
export async function definirVideoDoYoutube(numero: number, id: string): Promise<void> {
  await bancoDeDev().lesson.update({
    where: { number: numero },
    data: {
      videoKind: 'YOUTUBE',
      videoRef: id,
      videoUrl: null,
      videoIsDefault: false,
      videoUpdatedAt: new Date(),
    },
  });
}

/**
 * Garante a aula no ar, direto no banco — a rede de segurança do teste que
 * despublica pelo painel. `publishedAt` é preservado quando existe (é a data da
 * primeira publicação, como faz `publicarAula`).
 */
export async function garantirAulaPublicada(numero: number): Promise<void> {
  const banco = bancoDeDev();
  const linha = await banco.lesson.findUnique({
    where: { number: numero },
    select: { published: true, publishedAt: true },
  });
  if (!linha || linha.published) return;
  await banco.lesson.update({
    where: { number: numero },
    data: { published: true, publishedAt: linha.publishedAt ?? new Date() },
  });
}

/** Se a aula está publicada agora (lida do banco, sem cache). */
export async function aulaEstaPublicada(numero: number): Promise<boolean> {
  const linha = await bancoDeDev().lesson.findUnique({
    where: { number: numero },
    select: { published: true },
  });
  return linha?.published === true;
}

/** Quantas entradas de auditoria (permitidas) uma ação tem num recurso. */
export async function contarAuditoria(acao: string, recurso: string): Promise<number> {
  return bancoDeDev().auditLog.count({
    where: { action: acao, resource: recurso, outcome: 'ALLOW' },
  });
}
