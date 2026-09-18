/**
 * Limpeza diária do banco — sessões vencidas, tokens gastos e tentativas de
 * login antigas.
 *
 * ⚠️ MÓDULO DE SERVIDOR (Prisma, `node:crypto`, `process.env`).
 *
 * As três funções de poda já existiam em `src/lib/auth/` sem ninguém que as
 * chamasse; este arquivo é o "alguém". Quem dispara é `POST /api/cron/limpeza`
 * (`src/app/api/cron/limpeza/route.ts`), que o crontab da VPS chama uma vez por
 * dia — passo a passo em `docs/DEPLOY.md`, seção "Limpeza diária".
 *
 * ## O segredo
 *
 * A rota é pública na rede (o `proxy.ts` nem olha `/api/`), então quem prova
 * que pode rodar a limpeza é o cabeçalho `Authorization: Bearer <CRON_SECRET>`.
 * `CRON_SECRET` é lido direto de `process.env`, como as chaves do bucket de
 * vídeo, e é opcional: sem ele a rota responde 503 e não roda nada.
 *
 * A comparação é em tempo constante: SHA-256 dos dois lados e
 * `timingSafeEqual`. O hash iguala os tamanhos (o `timingSafeEqual` exige
 * buffers do mesmo tamanho, e comparar o tamanho antes vazaria o tamanho do
 * segredo) e o tempo da comparação deixa de depender de quantos caracteres
 * batem.
 */
import { createHash, timingSafeEqual } from 'node:crypto';

import { cleanupOldAttempts } from '@/lib/auth/rate-limit';
import { cleanupExpiredSessions } from '@/lib/auth/session';
import { cleanupExpiredTokens } from '@/lib/auth/tokens';

/** Quantos dias um token usado ou vencido fica para investigar "o link não abriu". */
export const RETENCAO_DE_TOKENS_DIAS = 7;

/** Quantos dias uma tentativa de login fica para investigar "invadiram minha conta?". */
export const RETENCAO_DE_TENTATIVAS_DIAS = 30;

/** O que a limpeza apagou. Só contagens. */
export type ResultadoDaLimpeza = {
  sessoes: number;
  tokens: number;
  tentativas: number;
};

/**
 * O segredo configurado, ou `null` quando a variável falta ou está vazia (ou só
 * com espaços). Aparado porque um espaço colado no painel da stack não pode
 * virar "segredo que nunca bate".
 */
export function lerSegredoDoCron(): string | null {
  const bruto = process.env.CRON_SECRET;
  if (typeof bruto !== 'string') return null;
  const segredo = bruto.trim();
  return segredo.length > 0 ? segredo : null;
}

function sha256(valor: string): Buffer {
  return createHash('sha256').update(valor, 'utf8').digest();
}

/**
 * Diz se o cabeçalho `Authorization` traz o segredo certo.
 *
 * Aceita só o esquema `Bearer` (sem diferenciar maiúsculas, como manda a RFC
 * 7235). Cabeçalho ausente, esquema diferente ou token vazio: `false`, sem
 * comparar nada. Nunca lança e nunca escreve o valor recebido em lugar nenhum.
 */
export function cabecalhoDoCronConfere(cabecalho: string | null, segredo: string): boolean {
  if (typeof cabecalho !== 'string' || typeof segredo !== 'string' || segredo.length === 0) {
    return false;
  }

  const partes = /^Bearer[ \t]+(.+)$/i.exec(cabecalho.trim());
  const recebido = partes?.[1]?.trim() ?? '';
  if (recebido.length === 0) return false;

  return timingSafeEqual(sha256(recebido), sha256(segredo));
}

/**
 * Roda as três podas, uma depois da outra (são independentes; em sequência
 * para não abrir três conexões de uma vez num pool pequeno).
 *
 * Lança se o banco falhar — quem chama transforma em 500 e registra no log.
 */
export async function executarLimpeza(): Promise<ResultadoDaLimpeza> {
  const sessoes = await cleanupExpiredSessions();
  const tokens = await cleanupExpiredTokens(RETENCAO_DE_TOKENS_DIAS);
  const tentativas = await cleanupOldAttempts(RETENCAO_DE_TENTATIVAS_DIAS);
  return { sessoes, tokens, tentativas };
}
