/**
 * Tokens opacos: sessão e verificação por e-mail.
 *
 * ⚠️ MÓDULO DE SERVIDOR (usa `node:crypto` e o Prisma).
 *
 * Princípio único deste arquivo (contrato §5.2 e §5.5): **o banco nunca guarda o
 * token**. Guarda o SHA-256 dele. Quem vazar um dump do banco leva hashes, não
 * chaves de acesso — e não consegue montar o link de redefinição de senha de
 * ninguém.
 *
 * Por que SHA-256 e não Argon2 aqui: o token já tem 256 bits de entropia
 * aleatória, não há dicionário a atacar. O hash serve só para transformar o dump
 * em algo inútil; velocidade é bem-vinda, porque isso roda em toda requisição
 * autenticada.
 */
import { createHash, randomBytes, timingSafeEqual } from 'node:crypto';
import type { TokenType } from '@prisma/client';

import { prisma } from '@/lib/db';

/** 32 bytes de aleatoriedade viram 43 caracteres em base64url (sem padding). */
const TAMANHO_TOKEN_BYTES = 32;
const TAMANHO_TOKEN_TEXTO = 43;

/** Só o alfabeto do base64url: letras, dígitos, `-` e `_`. */
const FORMATO_TOKEN = /^[A-Za-z0-9_-]{43}$/;

/** Validade por tipo de token — contrato §5.5 (1 hora) e §6 (24 horas). */
export const VALIDADE_TOKEN_MS: Record<TokenType, number> = {
  PASSWORD_RESET: 60 * 60 * 1000,
  EMAIL_VERIFY: 24 * 60 * 60 * 1000,
};

/**
 * Gera um token opaco de 32 bytes criptograficamente aleatórios.
 *
 * `randomBytes` (CSPRNG do sistema), nunca `Math.random()`. Base64url porque o
 * token viaja em URL de e-mail e em cookie: nada de `+`, `/` ou `=` para algum
 * cliente de e-mail escapar no caminho.
 */
export function generateToken(): string {
  return randomBytes(TAMANHO_TOKEN_BYTES).toString('base64url');
}

/** SHA-256 do token, em hexadecimal. É isto — e só isto — que vai para o banco. */
export function hashToken(raw: string): string {
  return createHash('sha256').update(raw, 'utf8').digest('hex');
}

/**
 * Compara dois hashes hexadecimais em tempo constante.
 *
 * Usado onde a comparação acontece em memória (ex.: "esta é a sessão atual?").
 * As buscas por token usam índice único no banco e não passam por aqui.
 */
export function hashesIguais(a: string, b: string): boolean {
  if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) return false;
  try {
    return timingSafeEqual(Buffer.from(a, 'utf8'), Buffer.from(b, 'utf8'));
  } catch {
    return false;
  }
}

/** Descarta lixo antes de encostar no banco (evita consulta por cada string aleatória). */
export function pareceToken(raw: unknown): raw is string {
  return typeof raw === 'string' && raw.length === TAMANHO_TOKEN_TEXTO && FORMATO_TOKEN.test(raw);
}

/**
 * Cria um token de verificação para o usuário e devolve o **token cru**.
 *
 * O cru só existe aqui e no e-mail que sai em seguida: no banco fica o SHA-256.
 * Quem chama precisa usar o retorno imediatamente para montar o link — não há
 * como recuperá-lo depois.
 *
 * Tokens anteriores do mesmo tipo e do mesmo usuário que ainda estivessem válidos
 * são marcados como usados. Pedir um novo link de redefinição mata o link antigo:
 * se o e-mail do usuário for comprometido depois, os links velhos na caixa de
 * entrada já não servem para nada.
 */
export async function createVerificationToken(userId: string, type: TokenType): Promise<string> {
  const agora = new Date();

  const raw = generateToken();
  const tokenHash = hashToken(raw);
  const expiresAt = new Date(agora.getTime() + VALIDADE_TOKEN_MS[type]);

  await prisma.$transaction([
    prisma.verificationToken.updateMany({
      where: { userId, type, usedAt: null, expiresAt: { gt: agora } },
      data: { usedAt: agora },
    }),
    prisma.verificationToken.create({
      data: { tokenHash, userId, type, expiresAt },
    }),
  ]);

  return raw;
}

/**
 * Gasta um token de verificação e devolve o `userId` dono dele — ou `null`.
 *
 * Devolve `null` (sem distinguir o motivo, de propósito: quem chama responde
 * sempre "link inválido ou expirado") quando o token não existe, é de outro tipo,
 * já foi usado ou já expirou.
 *
 * **Uso único de verdade.** A checagem prévia serve só para decidir rápido; quem
 * garante a unicidade é o `updateMany` com `usedAt: null` no `where`, que o
 * PostgreSQL executa como um UPDATE condicional atômico. Duas requisições
 * simultâneas com o mesmo token disputam a mesma linha: uma recebe `count === 1`,
 * a outra `count === 0` e vira `null`. É por isso que o retorno depende do
 * `count`, e não do que a leitura anterior achou — entre a leitura e o update a
 * linha pode ter mudado.
 *
 * O `type` também vai no `where` do update: um token de verificação de e-mail
 * nunca pode ser gasto como se fosse de redefinição de senha, nem sob corrida.
 */
export async function consumeVerificationToken(
  raw: string,
  type: TokenType,
): Promise<string | null> {
  if (!pareceToken(raw)) return null;

  const agora = new Date();
  const tokenHash = hashToken(raw);

  const registro = await prisma.verificationToken.findUnique({
    where: { tokenHash },
    select: { id: true, userId: true, type: true, expiresAt: true, usedAt: true },
  });

  if (!registro) return null;
  if (registro.type !== type) return null;
  if (registro.usedAt !== null) return null;
  if (registro.expiresAt.getTime() <= agora.getTime()) return null;

  const { count } = await prisma.verificationToken.updateMany({
    where: { id: registro.id, type, usedAt: null, expiresAt: { gt: agora } },
    data: { usedAt: agora },
  });

  if (count !== 1) return null;

  return registro.userId;
}

/**
 * Remove tokens que já não servem para nada: usados ou expirados há mais de
 * `diasDeRetencao` dias. Devolve quantas linhas saíram.
 *
 * Não há gatilho automático no app — é para uma tarefa agendada (cron do host ou
 * um job futuro). Manter um rastro curto ajuda a investigar "recebi um link que
 * não funcionou"; manter para sempre só engorda a tabela.
 */
export async function cleanupExpiredTokens(diasDeRetencao = 7): Promise<number> {
  const corte = new Date(Date.now() - diasDeRetencao * 24 * 60 * 60 * 1000);

  const { count } = await prisma.verificationToken.deleteMany({
    where: {
      OR: [
        { usedAt: { lt: corte } },
        { expiresAt: { lt: corte } },
      ],
    },
  });

  return count;
}
