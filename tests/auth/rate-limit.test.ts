/**
 * Limite de tentativas de login (contrato §5.4) contra o banco de teste.
 *
 * Regra: 5 falhas em 15 minutos para o mesmo par (e-mail, IP) bloqueiam o par
 * até a mais antiga delas sair da janela; um sucesso zera as falhas do par.
 *
 * Fixtures: e-mails `a1rl-<aleatório>@teste.local`, apagados no `afterAll`. As
 * funções de limpeza global (`cleanupOldAttempts`) ficam de fora de propósito:
 * elas varrem a tabela inteira e o banco de teste é dividido com outras frentes.
 */
import { randomBytes } from 'node:crypto';
import { afterAll, describe, expect, it } from 'vitest';

import {
  IP_DESCONHECIDO,
  JANELA_MS,
  MAXIMO_DE_FALHAS,
  ipDosCabecalhos,
  isRateLimited,
  normalizarIp,
  recordLoginAttempt,
} from '@/lib/auth/rate-limit';
import { prisma } from '@/lib/db';

const PREFIXO = `a1rl-${randomBytes(4).toString('hex')}`;
let sequencia = 0;

/** Um e-mail novo por teste: cada caso começa com o contador zerado. */
function novoEmail(): string {
  sequencia += 1;
  return `${PREFIXO}-${sequencia}@teste.local`;
}

async function falhar(email: string, ip: string, vezes: number): Promise<void> {
  for (let i = 0; i < vezes; i += 1) await recordLoginAttempt(email, ip, false);
}

afterAll(async () => {
  await prisma.loginAttempt.deleteMany({ where: { email: { startsWith: PREFIXO } } });
});

describe('normalizarIp', () => {
  it.each([
    ['203.0.113.9', '203.0.113.9'],
    ['  203.0.113.9  ', '203.0.113.9'],
    ['203.0.113.9, 10.0.0.1, 10.0.0.2', '203.0.113.9'],
    ['2001:DB8::1', '2001:db8::1'],
    ['', IP_DESCONHECIDO],
    ['   ', IP_DESCONHECIDO],
    [', 10.0.0.1', IP_DESCONHECIDO],
    [null, IP_DESCONHECIDO],
    [undefined, IP_DESCONHECIDO],
  ])('%j → %j', (entrada, esperado) => {
    expect(normalizarIp(entrada)).toBe(esperado);
  });

  it('corta em 45 caracteres (o tamanho de um IPv6 longo)', () => {
    expect(normalizarIp('a'.repeat(100))).toHaveLength(45);
  });
});

describe('ipDosCabecalhos', () => {
  it('prefere o primeiro item do X-Forwarded-For', () => {
    const cabecalhos = new Headers({
      'x-forwarded-for': '198.51.100.7, 10.0.0.1',
      'x-real-ip': '10.9.9.9',
    });
    expect(ipDosCabecalhos(cabecalhos)).toBe('198.51.100.7');
  });

  it('cai para x-real-ip, cf-connecting-ip e x-client-ip, nessa ordem', () => {
    expect(ipDosCabecalhos(new Headers({ 'x-real-ip': '10.1.1.1', 'cf-connecting-ip': '10.2.2.2' }))).toBe('10.1.1.1');
    expect(ipDosCabecalhos(new Headers({ 'cf-connecting-ip': '10.2.2.2', 'x-client-ip': '10.3.3.3' }))).toBe('10.2.2.2');
    expect(ipDosCabecalhos(new Headers({ 'x-client-ip': '10.3.3.3' }))).toBe('10.3.3.3');
  });

  it('X-Forwarded-For vazio não impede de olhar o próximo cabeçalho', () => {
    expect(ipDosCabecalhos(new Headers({ 'x-forwarded-for': ' ', 'x-real-ip': '10.1.1.1' }))).toBe('10.1.1.1');
  });

  it('sem cabeçalho nenhum, todo mundo cai no mesmo balde', () => {
    expect(ipDosCabecalhos(new Headers())).toBe(IP_DESCONHECIDO);
  });
});

describe('isRateLimited — contagem no banco', () => {
  const IP = '203.0.113.50';

  it('a regra é 5 falhas em 15 minutos', () => {
    expect(MAXIMO_DE_FALHAS).toBe(5);
    expect(JANELA_MS).toBe(15 * 60 * 1000);
  });

  it('4 falhas ainda não bloqueiam; a 5ª bloqueia por até 15 minutos', async () => {
    const email = novoEmail();
    await falhar(email, IP, 4);
    expect(await isRateLimited(email, IP)).toEqual({ limited: false, retryAfterSeconds: 0 });

    await falhar(email, IP, 1);
    const estado = await isRateLimited(email, IP);
    expect(estado.limited).toBe(true);
    expect(estado.retryAfterSeconds).toBeGreaterThanOrEqual(1);
    expect(estado.retryAfterSeconds).toBeLessThanOrEqual(15 * 60);
    // As falhas acabaram de acontecer: falta praticamente a janela inteira.
    expect(estado.retryAfterSeconds).toBeGreaterThan(15 * 60 - 30);
  });

  it('o bloqueio é do par: outro IP e outro e-mail continuam livres', async () => {
    const email = novoEmail();
    await falhar(email, IP, 5);
    expect((await isRateLimited(email, IP)).limited).toBe(true);
    expect((await isRateLimited(email, '203.0.113.51')).limited).toBe(false);
    expect((await isRateLimited(novoEmail(), IP)).limited).toBe(false);
  });

  it('e-mail com maiúsculas e espaços conta no mesmo par', async () => {
    const email = novoEmail();
    await falhar(email.toUpperCase(), IP, 3);
    await falhar(`  ${email}  `, IP, 2);
    expect((await isRateLimited(email, IP)).limited).toBe(true);

    const gravados = await prisma.loginAttempt.findMany({ where: { email }, select: { email: true } });
    expect(gravados).toHaveLength(5);
  });

  it('IP em forma de lista (X-Forwarded-For) conta pelo primeiro item', async () => {
    const email = novoEmail();
    await falhar(email, `${IP}, 10.0.0.1`, 3);
    await falhar(email, ` ${IP} `, 2);
    expect((await isRateLimited(email, IP)).limited).toBe(true);
  });

  it('sem IP conhecido, as falhas vão para o balde "desconhecido" — e bloqueiam', async () => {
    const email = novoEmail();
    await falhar(email, '', 3);
    for (let i = 0; i < 2; i += 1) await recordLoginAttempt(email, null, false);
    expect((await isRateLimited(email, undefined)).limited).toBe(true);
    const ips = await prisma.loginAttempt.findMany({ where: { email }, select: { ip: true } });
    expect(new Set(ips.map((linha) => linha.ip))).toEqual(new Set([IP_DESCONHECIDO]));
  });

  it('um sucesso zera as falhas do par (e só do par)', async () => {
    const email = novoEmail();
    await falhar(email, IP, 4);
    await falhar(email, '198.51.100.1', 2);
    await recordLoginAttempt(email, IP, true);

    expect(await prisma.loginAttempt.count({ where: { email, ip: IP, success: false } })).toBe(0);
    expect(await prisma.loginAttempt.count({ where: { email, ip: '198.51.100.1', success: false } })).toBe(2);
    // O próprio sucesso fica registrado.
    expect(await prisma.loginAttempt.count({ where: { email, ip: IP, success: true } })).toBe(1);

    // Depois do sucesso, 4 falhas novas ainda não bloqueiam.
    await falhar(email, IP, 4);
    expect((await isRateLimited(email, IP)).limited).toBe(false);
  });

  it('sucesso não conta como falha', async () => {
    const email = novoEmail();
    for (let i = 0; i < 6; i += 1) await recordLoginAttempt(email, IP, true);
    expect((await isRateLimited(email, IP)).limited).toBe(false);
  });

  it('falhas mais antigas que 15 minutos saem da janela', async () => {
    const email = novoEmail();
    const haDezesseisMinutos = new Date(Date.now() - 16 * 60 * 1000);
    await prisma.loginAttempt.createMany({
      data: Array.from({ length: 5 }, () => ({ email, ip: IP, success: false, createdAt: haDezesseisMinutos })),
    });
    expect((await isRateLimited(email, IP)).limited).toBe(false);

    // Quatro antigas + quatro recentes: só as recentes contam.
    await falhar(email, IP, 4);
    expect((await isRateLimited(email, IP)).limited).toBe(false);
  });

  it('o bloqueio termina quando a mais antiga das 5 recentes completa 15 minutos', async () => {
    const email = novoEmail();
    const haQuatorzeMinutos = new Date(Date.now() - 14 * 60 * 1000);
    await prisma.loginAttempt.createMany({
      data: Array.from({ length: 5 }, () => ({ email, ip: IP, success: false, createdAt: haQuatorzeMinutos })),
    });
    const estado = await isRateLimited(email, IP);
    expect(estado.limited).toBe(true);
    // Falta ~1 minuto (com folga para a latência do teste).
    expect(estado.retryAfterSeconds).toBeGreaterThanOrEqual(50);
    expect(estado.retryAfterSeconds).toBeLessThanOrEqual(60);
  });

  it('janela deslizante: uma falha nova renova o bloqueio a partir das 5 mais recentes', async () => {
    const email = novoEmail();
    const haQuatorzeMinutos = new Date(Date.now() - 14 * 60 * 1000);
    await prisma.loginAttempt.createMany({
      data: Array.from({ length: 5 }, () => ({ email, ip: IP, success: false, createdAt: haQuatorzeMinutos })),
    });
    // Tentativa que entrou mesmo assim (ex.: outra instância): as 5 mais recentes
    // agora incluem 4 de 14 min atrás — o prazo continua sendo ~1 minuto.
    await falhar(email, IP, 1);
    const estado = await isRateLimited(email, IP);
    expect(estado.limited).toBe(true);
    expect(estado.retryAfterSeconds).toBeLessThanOrEqual(60);
  });

  it('nunca grava a senha: só e-mail, IP, resultado e data', async () => {
    const email = novoEmail();
    await recordLoginAttempt(email, IP, false);
    const linha = await prisma.loginAttempt.findFirstOrThrow({ where: { email } });
    expect(Object.keys(linha).sort()).toEqual(['createdAt', 'email', 'id', 'ip', 'success']);
  });
});
