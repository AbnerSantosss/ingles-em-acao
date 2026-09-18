/**
 * Os links de compra levam a referência opaca do aluno logado
 * (`lerLinksDeCompra(userId)`), preservando a query que o painel gravou.
 *
 * O link de checkout (`AppSetting` `checkout.link`) e o ambiente do webhook são
 * trocados aqui e restaurados no `afterAll`. Fixtures: alunos
 * `pag-link-<aleatório>-<n>@teste.local`, apagados no `afterAll`.
 */
import { randomBytes } from 'node:crypto';

import type { Prisma } from '@prisma/client';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';

import { CHAVE_CHECKOUT, lerLinksDeCompra } from '@/lib/admin/settings';
import { prisma } from '@/lib/db';
import { PARAMETRO_DE_REFERENCIA_FAKE } from '@/lib/pagamento/fake';
import { garantirReferenciaDePagamento, linkComReferencia } from '@/lib/pagamento/referencia';

const SUFIXO = randomBytes(5).toString('hex');

const LINK_GLOBAL = 'https://checkout.exemplo.test/comprar?origem=app&utm_source=wsa';
const LINK_PREMIUM = 'https://checkout.exemplo.test/premium?cupom=BEMVINDO#pagar';

const VARIAVEIS = ['PAYMENT_PROVIDER', 'PAYMENT_WEBHOOK_SECRET'] as const;
const ambienteOriginal = new Map<string, string | undefined>();
let checkoutOriginal: Prisma.JsonValue | null = null;

const idsDosAlunos: string[] = [];
let contador = 0;

function ligarFake() {
  process.env.PAYMENT_PROVIDER = 'fake';
  process.env.PAYMENT_WEBHOOK_SECRET = randomBytes(32).toString('hex');
}

beforeAll(async () => {
  for (const nome of VARIAVEIS) ambienteOriginal.set(nome, process.env[nome]);
  ligarFake();

  const linha = await prisma.appSetting.findUnique({ where: { key: CHAVE_CHECKOUT } });
  checkoutOriginal = linha?.value ?? null;
  const checkout = {
    global: LINK_GLOBAL,
    porPlano: { ESSENCIAL: null, COMPLETO: null, PREMIUM: LINK_PREMIUM },
  };
  await prisma.appSetting.upsert({
    where: { key: CHAVE_CHECKOUT },
    create: { key: CHAVE_CHECKOUT, value: checkout },
    update: { value: checkout },
  });
});

afterAll(async () => {
  for (const nome of VARIAVEIS) {
    const valor = ambienteOriginal.get(nome);
    if (valor === undefined) delete process.env[nome];
    else process.env[nome] = valor;
  }
  vi.restoreAllMocks();

  await prisma.user.deleteMany({ where: { id: { in: idsDosAlunos } } });

  if (checkoutOriginal === null) {
    await prisma.appSetting.deleteMany({ where: { key: CHAVE_CHECKOUT } });
  } else {
    await prisma.appSetting.update({
      where: { key: CHAVE_CHECKOUT },
      data: { value: checkoutOriginal as Prisma.InputJsonValue },
    });
  }
});

async function criarAluno(opcoes: { excluido?: boolean } = {}) {
  contador += 1;
  const aluno = await prisma.user.create({
    data: {
      name: 'Aluno do Link',
      email: `pag-link-${SUFIXO}-${contador}@teste.local`,
      passwordHash: 'sem-senha',
      deletedAt: opcoes.excluido ? new Date() : null,
    },
    select: { id: true },
  });
  idsDosAlunos.push(aluno.id);
  return aluno;
}

async function referenciaGuardada(id: string) {
  const aluno = await prisma.user.findUniqueOrThrow({ where: { id }, select: { paymentRef: true } });
  return aluno.paymentRef;
}

describe('linkComReferencia', () => {
  it('acrescenta a referência e preserva a query e o fragmento', () => {
    const link = new URL(linkComReferencia(LINK_PREMIUM, 'ref', 'abc_123-XYZ'));
    expect(link.origin + link.pathname).toBe('https://checkout.exemplo.test/premium');
    expect(link.searchParams.get('cupom')).toBe('BEMVINDO');
    expect(link.searchParams.get('ref')).toBe('abc_123-XYZ');
    expect(link.hash).toBe('#pagar');
  });

  it('substitui um parâmetro de mesmo nome colado no painel', () => {
    const link = new URL(
      linkComReferencia('https://checkout.exemplo.test/c?ref=de-quem-colou&x=1', 'ref', 'minha'),
    );
    expect(link.searchParams.getAll('ref')).toEqual(['minha']);
    expect(link.searchParams.get('x')).toBe('1');
  });

  it('link que não é URL volta como está', () => {
    expect(linkComReferencia('não é url', 'ref', 'abc')).toBe('não é url');
  });
});

describe('lerLinksDeCompra(userId)', () => {
  it('com provedor ligado, os links levam a paymentRef do aluno e mantêm a query', async () => {
    const aluno = await criarAluno();
    expect(await referenciaGuardada(aluno.id)).toBeNull();

    const links = await lerLinksDeCompra(aluno.id);

    const referencia = await referenciaGuardada(aluno.id);
    expect(referencia).toMatch(/^[A-Za-z0-9_-]{22}$/);

    const completo = new URL(links.COMPLETO ?? '');
    expect(completo.origin + completo.pathname).toBe('https://checkout.exemplo.test/comprar');
    expect(completo.searchParams.get('origem')).toBe('app');
    expect(completo.searchParams.get('utm_source')).toBe('wsa');
    expect(completo.searchParams.get(PARAMETRO_DE_REFERENCIA_FAKE)).toBe(referencia);

    const premium = new URL(links.PREMIUM ?? '');
    expect(premium.searchParams.get('cupom')).toBe('BEMVINDO');
    expect(premium.searchParams.get(PARAMETRO_DE_REFERENCIA_FAKE)).toBe(referencia);
    expect(premium.hash).toBe('#pagar');
  });

  it('a referência é estável: a segunda leitura devolve a mesma', async () => {
    const aluno = await criarAluno();
    const primeira = await lerLinksDeCompra(aluno.id);
    const segunda = await lerLinksDeCompra(aluno.id);
    expect(segunda).toEqual(primeira);
  });

  it('leituras simultâneas para o mesmo aluno não geram duas referências', async () => {
    const aluno = await criarAluno();
    const referencias = await Promise.all(
      Array.from({ length: 5 }, () => garantirReferenciaDePagamento(aluno.id)),
    );
    expect(new Set(referencias).size).toBe(1);
    expect(referencias[0]).toBe(await referenciaGuardada(aluno.id));
  });

  it('sem userId, os links saem como estão no painel', async () => {
    expect(await lerLinksDeCompra()).toEqual({ COMPLETO: LINK_GLOBAL, PREMIUM: LINK_PREMIUM });
  });

  it('sem provedor configurado, os links saem como estão e nenhuma referência é criada', async () => {
    const aluno = await criarAluno();
    try {
      delete process.env.PAYMENT_PROVIDER;
      expect(await lerLinksDeCompra(aluno.id)).toEqual({
        COMPLETO: LINK_GLOBAL,
        PREMIUM: LINK_PREMIUM,
      });
      expect(await referenciaGuardada(aluno.id)).toBeNull();
    } finally {
      ligarFake();
    }
  });

  it('conta excluída recebe os links sem referência', async () => {
    const aluno = await criarAluno({ excluido: true });
    expect(await lerLinksDeCompra(aluno.id)).toEqual({
      COMPLETO: LINK_GLOBAL,
      PREMIUM: LINK_PREMIUM,
    });
    expect(await referenciaGuardada(aluno.id)).toBeNull();
  });
});
