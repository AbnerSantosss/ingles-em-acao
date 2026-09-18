/**
 * Tokens opacos de verificação (contrato §5.2, §5.5 e §6) contra o banco de teste.
 *
 * O que precisa valer: o banco guarda só o SHA-256; o token é de uso único
 * (inclusive sob corrida); tipo errado, expirado, usado ou malformado dão `null`;
 * pedir um novo mata o anterior do mesmo tipo.
 *
 * Fixture: um usuário `a1tk-<aleatório>@teste.local`, apagado no `afterAll`
 * (os tokens saem junto, por cascata).
 */
import { randomBytes } from 'node:crypto';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import {
  VALIDADE_TOKEN_MS,
  consumeVerificationToken,
  createVerificationToken,
  generateToken,
  hashToken,
  hashesIguais,
  pareceToken,
} from '@/lib/auth/tokens';
import { prisma } from '@/lib/db';

const EMAIL = `a1tk-${randomBytes(4).toString('hex')}@teste.local`;
let userId = '';
let outroUserId = '';

beforeAll(async () => {
  const usuario = await prisma.user.create({
    data: { name: 'Fixture Tokens', email: EMAIL, passwordHash: 'fixture-sem-senha' },
  });
  userId = usuario.id;
  const outro = await prisma.user.create({
    data: { name: 'Fixture Tokens 2', email: `outro-${EMAIL}`, passwordHash: 'fixture-sem-senha' },
  });
  outroUserId = outro.id;
});

afterAll(async () => {
  await prisma.user.deleteMany({ where: { email: { in: [EMAIL, `outro-${EMAIL}`] } } });
});

describe('funções puras', () => {
  it('generateToken: 43 caracteres base64url, sempre diferentes', () => {
    const vistos = new Set<string>();
    for (let i = 0; i < 200; i += 1) {
      const token = generateToken();
      expect(token).toMatch(/^[A-Za-z0-9_-]{43}$/);
      expect(pareceToken(token)).toBe(true);
      vistos.add(token);
    }
    expect(vistos.size).toBe(200);
  });

  it('hashToken: SHA-256 em hexadecimal, determinístico', () => {
    expect(hashToken('abc')).toBe('ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');
    const token = generateToken();
    expect(hashToken(token)).toBe(hashToken(token));
    expect(hashToken(token)).toMatch(/^[0-9a-f]{64}$/);
  });

  it('hashesIguais: compara em tempo constante e recusa tamanhos diferentes', () => {
    const hash = hashToken('x');
    expect(hashesIguais(hash, hashToken('x'))).toBe(true);
    expect(hashesIguais(hash, hashToken('y'))).toBe(false);
    expect(hashesIguais(hash, hash.slice(1))).toBe(false);
    expect(hashesIguais(hash, 42 as unknown as string)).toBe(false);
  });

  it.each([
    ['curto', 'abc'],
    ['44 caracteres', 'a'.repeat(44)],
    ['caractere fora do base64url', `${'a'.repeat(42)}+`],
    ['padding', `${'a'.repeat(42)}=`],
    ['espaço', `${'a'.repeat(42)} `],
    ['vazio', ''],
  ])('pareceToken recusa: %s', (_rotulo, valor) => {
    expect(pareceToken(valor)).toBe(false);
  });

  it('pareceToken recusa o que não é texto', () => {
    expect(pareceToken(undefined)).toBe(false);
    expect(pareceToken(null)).toBe(false);
    expect(pareceToken(123)).toBe(false);
  });

  it('validade: 1 hora para redefinição, 24 horas para verificação de e-mail', () => {
    expect(VALIDADE_TOKEN_MS.PASSWORD_RESET).toBe(60 * 60 * 1000);
    expect(VALIDADE_TOKEN_MS.EMAIL_VERIFY).toBe(24 * 60 * 60 * 1000);
  });
});

describe('createVerificationToken / consumeVerificationToken', () => {
  it('o banco guarda o hash, nunca o token cru; e o prazo é o do tipo', async () => {
    const antes = Date.now();
    const raw = await createVerificationToken(userId, 'PASSWORD_RESET');
    expect(pareceToken(raw)).toBe(true);

    expect(await prisma.verificationToken.count({ where: { tokenHash: raw } })).toBe(0);
    const linha = await prisma.verificationToken.findUniqueOrThrow({ where: { tokenHash: hashToken(raw) } });
    expect(linha.userId).toBe(userId);
    expect(linha.type).toBe('PASSWORD_RESET');
    expect(linha.usedAt).toBeNull();

    const prazo = linha.expiresAt.getTime() - antes;
    expect(prazo).toBeGreaterThan(VALIDADE_TOKEN_MS.PASSWORD_RESET - 5_000);
    expect(prazo).toBeLessThanOrEqual(VALIDADE_TOKEN_MS.PASSWORD_RESET + 5_000);
  });

  it('uso único: a primeira vez devolve o dono, a segunda devolve null', async () => {
    const raw = await createVerificationToken(userId, 'EMAIL_VERIFY');
    expect(await consumeVerificationToken(raw, 'EMAIL_VERIFY')).toBe(userId);
    expect(await consumeVerificationToken(raw, 'EMAIL_VERIFY')).toBeNull();

    const linha = await prisma.verificationToken.findUniqueOrThrow({ where: { tokenHash: hashToken(raw) } });
    expect(linha.usedAt).not.toBeNull();
  });

  it('tipo errado devolve null e NÃO gasta o token', async () => {
    const raw = await createVerificationToken(userId, 'EMAIL_VERIFY');
    expect(await consumeVerificationToken(raw, 'PASSWORD_RESET')).toBeNull();
    // Continua valendo para o tipo certo.
    expect(await consumeVerificationToken(raw, 'EMAIL_VERIFY')).toBe(userId);
  });

  it('token expirado devolve null', async () => {
    const raw = generateToken();
    await prisma.verificationToken.create({
      data: {
        tokenHash: hashToken(raw),
        userId,
        type: 'PASSWORD_RESET',
        expiresAt: new Date(Date.now() - 1_000),
      },
    });
    expect(await consumeVerificationToken(raw, 'PASSWORD_RESET')).toBeNull();
  });

  it('token que não existe devolve null', async () => {
    expect(await consumeVerificationToken(generateToken(), 'PASSWORD_RESET')).toBeNull();
  });

  it.each([
    ['vazio', ''],
    ['curto', 'abc'],
    ['injeção', "' OR 1=1 --"],
    ['o próprio hash (vazou o banco)', 'x'.repeat(64)],
  ])('token malformado devolve null sem consultar: %s', async (_rotulo, raw) => {
    expect(await consumeVerificationToken(raw, 'EMAIL_VERIFY')).toBeNull();
  });

  it('o hash vazado do banco não serve como token', async () => {
    const raw = await createVerificationToken(userId, 'PASSWORD_RESET');
    expect(await consumeVerificationToken(hashToken(raw), 'PASSWORD_RESET')).toBeNull();
  });

  it('pedir um novo token mata o anterior do mesmo tipo — e só dele', async () => {
    const verificacao = await createVerificationToken(userId, 'EMAIL_VERIFY');
    const antigo = await createVerificationToken(userId, 'PASSWORD_RESET');
    const novo = await createVerificationToken(userId, 'PASSWORD_RESET');

    expect(await consumeVerificationToken(antigo, 'PASSWORD_RESET')).toBeNull();
    expect(await consumeVerificationToken(novo, 'PASSWORD_RESET')).toBe(userId);
    // O de outro tipo segue valendo.
    expect(await consumeVerificationToken(verificacao, 'EMAIL_VERIFY')).toBe(userId);
  });

  it('o token novo de um usuário não mexe nos tokens de outro usuário', async () => {
    const doOutro = await createVerificationToken(outroUserId, 'PASSWORD_RESET');
    await createVerificationToken(userId, 'PASSWORD_RESET');
    expect(await consumeVerificationToken(doOutro, 'PASSWORD_RESET')).toBe(outroUserId);
  });

  it('corrida: dois consumos simultâneos do mesmo token — exatamente um vence', async () => {
    const raw = await createVerificationToken(userId, 'PASSWORD_RESET');
    const resultados = await Promise.all(
      Array.from({ length: 5 }, () => consumeVerificationToken(raw, 'PASSWORD_RESET')),
    );
    expect(resultados.filter((resultado) => resultado === userId)).toHaveLength(1);
    expect(resultados.filter((resultado) => resultado === null)).toHaveLength(4);
  });
});
