/**
 * Exclusão de conta (`src/lib/conta/anonimizar.ts`) contra o banco de teste.
 *
 * O que precisa ficar provado (aceite da frente A3):
 * - a conta excluída não entra mais (a senha antiga não bate; o e-mail antigo
 *   não acha ninguém; as sessões saíram);
 * - o e-mail fica livre para um cadastro novo;
 * - o `Payment` sobrevive, ligado ao mesmo `userId`;
 * - ADMIN é recusado; chamar de novo é idempotente (inclusive com duas
 *   chamadas ao mesmo tempo).
 *
 * Fixtures (todas desta frente, apagadas no `afterAll` só pelos próprios ids):
 * usuários `conta-<aleatório>-<n>@teste.local`, um módulo e uma aula com número
 * aleatório na faixa 700000–799999 (para não colidir com as faixas fixas das
 * outras frentes) e pagamentos com `provider = 'teste-conta'`.
 */
import { randomBytes } from 'node:crypto';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { hashPassword, verifyPassword } from '@/lib/auth/password';
import { esqueciSenhaSchema } from '@/lib/auth/schemas';
import { generateToken, hashToken } from '@/lib/auth/tokens';
import {
  anonimizarConta,
  DOMINIO_DE_CONTA_EXCLUIDA,
  ehEmailDeContaExcluida,
  emailDeContaExcluida,
  NOME_DE_CONTA_EXCLUIDA,
} from '@/lib/conta/anonimizar';
import { dataDeExclusao, datasDeExclusao } from '@/lib/conta/consultas';
import { prisma } from '@/lib/db';

const PREFIXO = `conta-${randomBytes(4).toString('hex')}`;
const PROVEDOR = 'teste-conta';
const SENHA = 'senha antiga da fixture 123';
const NUMERO = 700000 + Math.floor(Math.random() * 99999);
const DIA = 24 * 60 * 60 * 1000;

let sequencia = 0;
let aulaId = '';
let hashDaSenha = '';
const usuariosCriados: string[] = [];

function novoEmail(): string {
  sequencia += 1;
  return `${PREFIXO}-${sequencia}@teste.local`;
}

async function criarUsuario(dados: { role?: 'STUDENT' | 'ADMIN'; email?: string } = {}) {
  const usuario = await prisma.user.create({
    data: {
      name: 'Fixture da Conta',
      email: dados.email ?? novoEmail(),
      passwordHash: hashDaSenha,
      role: dados.role ?? 'STUDENT',
      plan: 'COMPLETO',
      photoUrl: 'https://exemplo.invalid/foto.png',
      emailVerifiedAt: new Date(),
      paymentRef: `${PREFIXO}-ref-${randomBytes(6).toString('hex')}`,
    },
  });
  usuariosCriados.push(usuario.id);
  return usuario;
}

async function criarSessao(userId: string) {
  return prisma.session.create({
    data: {
      tokenHash: hashToken(generateToken()),
      userId,
      expiresAt: new Date(Date.now() + DIA),
    },
  });
}

/** Um aluno com um pouco de tudo: sessões, token, progresso, resposta, dia de estudo, tentativas e um pagamento. */
async function criarAlunoCompleto() {
  const usuario = await criarUsuario();

  await criarSessao(usuario.id);
  await criarSessao(usuario.id);
  await prisma.verificationToken.create({
    data: {
      tokenHash: hashToken(generateToken()),
      userId: usuario.id,
      type: 'EMAIL_VERIFY',
      expiresAt: new Date(Date.now() + DIA),
    },
  });
  await prisma.lessonProgress.create({
    data: { userId: usuario.id, lessonId: aulaId, status: 'COMPLETED', score: 8, total: 10 },
  });
  await prisma.exerciseAnswer.create({
    data: { userId: usuario.id, lessonId: aulaId, answerKey: `${NUMERO}:p1:e1`, value: 'went' },
  });
  await prisma.studyDay.create({ data: { userId: usuario.id, date: new Date('2026-09-01') } });
  await prisma.loginAttempt.createMany({
    data: [
      { email: usuario.email, ip: '203.0.113.7', success: false },
      { email: usuario.email, ip: '203.0.113.7', success: true },
    ],
  });
  const pagamento = await prisma.payment.create({
    data: {
      provider: PROVEDOR,
      externalId: `${PREFIXO}-pg-${randomBytes(6).toString('hex')}`,
      status: 'APPROVED',
      productCode: 'curso-completo',
      planCode: 'COMPLETO',
      externalReference: usuario.paymentRef,
      userId: usuario.id,
      amountCents: 19700,
      rawEventHash: randomBytes(32).toString('hex'),
      grantedAt: new Date(),
    },
  });

  return { usuario, pagamento };
}

beforeAll(async () => {
  hashDaSenha = await hashPassword(SENHA);

  await prisma.module.create({
    data: { id: NUMERO, order: NUMERO, title: 'Fixture conta', fromLesson: NUMERO, toLesson: NUMERO },
  });
  const aula = await prisma.lesson.create({
    data: {
      number: NUMERO,
      code: `AULA ${NUMERO}`,
      slug: `${PREFIXO}-aula`,
      title: 'Fixture',
      subtitle: 'Fixture',
      estimatedTime: '5 minutos',
      moduleId: NUMERO,
      pages: [],
    },
  });
  aulaId = aula.id;
});

afterAll(async () => {
  // Ordem por causa das FKs: pagamento (RESTRICT) antes do usuário; progresso
  // e respostas saem em cascata com o usuário e com a aula.
  await prisma.payment.deleteMany({ where: { provider: PROVEDOR, userId: { in: usuariosCriados } } });
  await prisma.loginAttempt.deleteMany({ where: { email: { startsWith: PREFIXO } } });
  await prisma.user.deleteMany({ where: { id: { in: usuariosCriados } } });
  await prisma.user.deleteMany({ where: { email: { startsWith: PREFIXO } } });
  if (aulaId) await prisma.lesson.deleteMany({ where: { id: aulaId } });
  await prisma.module.deleteMany({ where: { id: NUMERO } });
});

describe('o endereço-marcador', () => {
  it('é único, imprevisível, reconhecível e passa na validação de e-mail do cadastro', () => {
    const a = emailDeContaExcluida('cmABC123');
    const b = emailDeContaExcluida('cmABC123');

    expect(a).not.toBe(b);
    expect(a.startsWith('excluida-cmabc123-')).toBe(true);
    expect(a.endsWith(`@${DOMINIO_DE_CONTA_EXCLUIDA}`)).toBe(true);
    expect(ehEmailDeContaExcluida(a)).toBe(true);
    expect(ehEmailDeContaExcluida('aluno@gmail.com')).toBe(false);
    expect(esqueciSenhaSchema.safeParse({ email: a }).success).toBe(true);
  });
});

describe('anonimizarConta', () => {
  it('troca tudo o que identifica a pessoa, apaga o estudo e as sessões, e guarda o pagamento', async () => {
    const { usuario, pagamento } = await criarAlunoCompleto();

    const resultado = await anonimizarConta(usuario.id);

    expect(resultado.ok).toBe(true);
    if (!resultado.ok) return;
    expect(resultado.jaEstavaExcluida).toBe(false);
    expect(resultado.apagados).toEqual({
      sessoes: 2,
      tokens: 1,
      progresso: 1,
      respostas: 1,
      diasDeEstudo: 1,
      tentativasDeLogin: 2,
    });

    const depois = await prisma.user.findUniqueOrThrow({ where: { id: usuario.id } });
    expect(depois.name).toBe(NOME_DE_CONTA_EXCLUIDA);
    expect(depois.email).not.toBe(usuario.email);
    expect(ehEmailDeContaExcluida(depois.email)).toBe(true);
    expect(depois.email).toContain(usuario.id.toLowerCase());
    expect(depois.photoUrl).toBeNull();
    expect(depois.emailVerifiedAt).toBeNull();
    expect(depois.paymentRef).toBeNull();
    expect(depois.deletedAt).toEqual(resultado.excluidaEm);
    // Ficam: papel, plano e data de criação.
    expect(depois.role).toBe('STUDENT');
    expect(depois.plan).toBe('COMPLETO');
    expect(depois.createdAt).toEqual(usuario.createdAt);

    // A senha antiga não entra mais.
    expect(depois.passwordHash).not.toBe(usuario.passwordHash);
    expect(await verifyPassword(depois.passwordHash, SENHA)).toBe(false);

    // O e-mail antigo não acha ninguém.
    expect(await prisma.user.findUnique({ where: { email: usuario.email } })).toBeNull();

    // Nada de sessão, token, estudo ou tentativa sobrando.
    expect(await prisma.session.count({ where: { userId: usuario.id } })).toBe(0);
    expect(await prisma.verificationToken.count({ where: { userId: usuario.id } })).toBe(0);
    expect(await prisma.lessonProgress.count({ where: { userId: usuario.id } })).toBe(0);
    expect(await prisma.exerciseAnswer.count({ where: { userId: usuario.id } })).toBe(0);
    expect(await prisma.studyDay.count({ where: { userId: usuario.id } })).toBe(0);
    expect(await prisma.loginAttempt.count({ where: { email: usuario.email } })).toBe(0);

    // O pagamento sobrevive, ligado à mesma conta.
    const pagamentoDepois = await prisma.payment.findUniqueOrThrow({ where: { id: pagamento.id } });
    expect(pagamentoDepois.userId).toBe(usuario.id);
    expect(pagamentoDepois.status).toBe('APPROVED');

    // As consultas do painel enxergam a exclusão.
    expect(await dataDeExclusao(usuario.id)).toEqual(resultado.excluidaEm);
  });

  it('deixa o e-mail antigo livre para um cadastro novo', async () => {
    const { usuario } = await criarAlunoCompleto();
    const resultado = await anonimizarConta(usuario.id);
    expect(resultado.ok).toBe(true);

    const novo = await criarUsuario({ email: usuario.email });

    expect(novo.id).not.toBe(usuario.id);
    expect(novo.email).toBe(usuario.email);
    expect(await dataDeExclusao(novo.id)).toBeNull();
  });

  it('recusa conta de administrador sem mexer em nada', async () => {
    const admin = await criarUsuario({ role: 'ADMIN' });
    await criarSessao(admin.id);

    const resultado = await anonimizarConta(admin.id);

    expect(resultado).toEqual({ ok: false, motivo: 'administrador' });
    const depois = await prisma.user.findUniqueOrThrow({ where: { id: admin.id } });
    expect(depois.email).toBe(admin.email);
    expect(depois.name).toBe(admin.name);
    expect(depois.deletedAt).toBeNull();
    expect(await verifyPassword(depois.passwordHash, SENHA)).toBe(true);
    expect(await prisma.session.count({ where: { userId: admin.id } })).toBe(1);
  });

  it('responde "não encontrada" para id que não existe', async () => {
    expect(await anonimizarConta(`${PREFIXO}-nao-existe`)).toEqual({
      ok: false,
      motivo: 'nao-encontrada',
    });
  });

  it('é idempotente: a segunda chamada não reescreve a linha, mas varre o que sobrou', async () => {
    const { usuario } = await criarAlunoCompleto();

    const primeira = await anonimizarConta(usuario.id);
    expect(primeira.ok).toBe(true);
    if (!primeira.ok) return;
    const aposPrimeira = await prisma.user.findUniqueOrThrow({ where: { id: usuario.id } });

    // Nada sobrou: a repetição não apaga nada e não troca nem o marcador nem a data.
    const segunda = await anonimizarConta(usuario.id);
    expect(segunda).toEqual({
      ok: true,
      jaEstavaExcluida: true,
      excluidaEm: primeira.excluidaEm,
      apagados: {
        sessoes: 0,
        tokens: 0,
        progresso: 0,
        respostas: 0,
        diasDeEstudo: 0,
        tentativasDeLogin: 0,
      },
    });
    const aposSegunda = await prisma.user.findUniqueOrThrow({ where: { id: usuario.id } });
    expect(aposSegunda.email).toBe(aposPrimeira.email);
    expect(aposSegunda.passwordHash).toBe(aposPrimeira.passwordHash);
    expect(aposSegunda.deletedAt).toEqual(aposPrimeira.deletedAt);

    // Uma sessão que apareceu depois (corrida com um login) sai na repetição.
    await criarSessao(usuario.id);
    const terceira = await anonimizarConta(usuario.id);
    expect(terceira.ok && terceira.apagados.sessoes).toBe(1);
    expect(await prisma.session.count({ where: { userId: usuario.id } })).toBe(0);
  });

  it('apaga só as tentativas de login do próprio e-mail (`_` e `%` não são curinga)', async () => {
    // `_` é válido em e-mail e é curinga de LIKE/ILIKE: a varredura não pode
    // alcançar o e-mail de outra pessoa que só "casa" com o padrão.
    const usuario = await criarUsuario({ email: `${PREFIXO}-a_b%c@teste.local` });
    const outroEmail = `${PREFIXO}-aXbYYc@teste.local`;
    await prisma.loginAttempt.createMany({
      data: [
        { email: usuario.email, ip: '203.0.113.9', success: false },
        { email: outroEmail, ip: '203.0.113.9', success: false },
      ],
    });

    const resultado = await anonimizarConta(usuario.id);

    expect(resultado.ok && resultado.apagados.tentativasDeLogin).toBe(1);
    expect(await prisma.loginAttempt.count({ where: { email: usuario.email } })).toBe(0);
    expect(await prisma.loginAttempt.count({ where: { email: outroEmail } })).toBe(1);
  });

  it('com duas exclusões ao mesmo tempo, só uma reescreve a linha', async () => {
    const { usuario } = await criarAlunoCompleto();

    const [a, b] = await Promise.all([anonimizarConta(usuario.id), anonimizarConta(usuario.id)]);

    expect(a.ok && b.ok).toBe(true);
    if (!a.ok || !b.ok) return;
    expect([a.jaEstavaExcluida, b.jaEstavaExcluida].sort()).toEqual([false, true]);
    expect(a.excluidaEm).toEqual(b.excluidaEm);

    const depois = await prisma.user.findUniqueOrThrow({ where: { id: usuario.id } });
    expect(depois.deletedAt).toEqual(a.excluidaEm);
    expect(await prisma.session.count({ where: { userId: usuario.id } })).toBe(0);
  });
});

describe('datasDeExclusao', () => {
  it('traz só as contas excluídas entre os ids pedidos', async () => {
    const ativa = await criarUsuario();
    const { usuario: excluida } = await criarAlunoCompleto();
    await anonimizarConta(excluida.id);

    const mapa = await datasDeExclusao([ativa.id, excluida.id, `${PREFIXO}-fantasma`, excluida.id]);

    expect([...mapa.keys()]).toEqual([excluida.id]);
    expect(mapa.get(excluida.id)).toBeInstanceOf(Date);
    expect(await datasDeExclusao([])).toEqual(new Map());
  });
});
