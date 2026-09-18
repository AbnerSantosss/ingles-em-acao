/**
 * `POST /api/webhooks/pagamento` de ponta a ponta contra o banco de teste, com o
 * adaptador Fake: o handler de verdade recebe um `Request` assinado e o teste
 * confere o que ficou gravado (`Payment`, `User.plan`, `AuditLog`).
 *
 * O ambiente do webhook (`PAYMENT_PROVIDER`, `PAYMENT_WEBHOOK_SECRET`) é
 * trocado aqui por um segredo sorteado só para este arquivo e devolvido no
 * `afterAll`. O mapa produto→plano (`AppSetting` `pagamento.produtos`) também:
 * o valor que estava no banco é guardado e restaurado.
 *
 * Fixtures: alunos `pag-<aleatório>-<n>@teste.local`, eventos
 * `evt-<aleatório>-<n>` e produtos `pag-<aleatório>-*` — tudo apagado no
 * `afterAll`, só pelos próprios identificadores (outros arquivos dividem o
 * banco de teste).
 */
import { createHash, randomBytes } from 'node:crypto';

import type { Plan, Prisma } from '@prisma/client';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';

import { POST } from '@/app/api/webhooks/pagamento/route';
import { prisma } from '@/lib/db';
import { assinarCorpoFake } from '@/lib/pagamento/fake';
import { CHAVE_PRODUTOS } from '@/lib/pagamento/produtos';
import { CAMINHO_DO_WEBHOOK, enderecoDoWebhook } from '@/lib/pagamento/provedor';

const SUFIXO = randomBytes(5).toString('hex');
const SEGREDO = randomBytes(32).toString('hex');

const PRODUTO_COMPLETO = `pag-${SUFIXO}-completo`;
const PRODUTO_PREMIUM = `pag-${SUFIXO}-premium`;
const PRODUTO_FORA_DO_MAPA = `pag-${SUFIXO}-desconhecido`;

const idsDosAlunos: string[] = [];
let contador = 0;

// ─────────────────────────────── ambiente ────────────────────────────────

const VARIAVEIS = ['PAYMENT_PROVIDER', 'PAYMENT_WEBHOOK_SECRET'] as const;
const ambienteOriginal = new Map<string, string | undefined>();
let mapaOriginal: Prisma.JsonValue | null = null;

function restaurarAmbiente() {
  for (const nome of VARIAVEIS) {
    const valor = ambienteOriginal.get(nome);
    if (valor === undefined) delete process.env[nome];
    else process.env[nome] = valor;
  }
}

function ligarFake() {
  process.env.PAYMENT_PROVIDER = 'fake';
  process.env.PAYMENT_WEBHOOK_SECRET = SEGREDO;
}

beforeAll(async () => {
  for (const nome of VARIAVEIS) ambienteOriginal.set(nome, process.env[nome]);
  ligarFake();

  // Os logs do webhook (evento recebido, órfão, assinatura recusada) poluiriam
  // a saída; os erros continuam aparecendo.
  vi.spyOn(console, 'info').mockImplementation(() => undefined);
  vi.spyOn(console, 'warn').mockImplementation(() => undefined);

  const linha = await prisma.appSetting.findUnique({ where: { key: CHAVE_PRODUTOS } });
  mapaOriginal = linha?.value ?? null;
  const mapa = {
    produtos: [
      { codigo: PRODUTO_COMPLETO, plano: 'COMPLETO' },
      { codigo: PRODUTO_PREMIUM, plano: 'PREMIUM' },
    ],
  };
  await prisma.appSetting.upsert({
    where: { key: CHAVE_PRODUTOS },
    create: { key: CHAVE_PRODUTOS, value: mapa },
    update: { value: mapa },
  });
});

afterAll(async () => {
  restaurarAmbiente();
  vi.restoreAllMocks();

  const prefixo = `evt-${SUFIXO}-`;
  const pagamentos = await prisma.payment.findMany({
    where: { externalId: { startsWith: prefixo } },
    select: { id: true },
  });
  await prisma.auditLog.deleteMany({
    where: {
      OR: [
        { resource: { in: idsDosAlunos.map((id) => `User:${id}`) } },
        { resource: { in: pagamentos.map((pagamento) => `Payment:${pagamento.id}`) } },
      ],
    },
  });
  await prisma.payment.deleteMany({
    where: { OR: [{ externalId: { startsWith: prefixo } }, { userId: { in: idsDosAlunos } }] },
  });
  await prisma.user.deleteMany({ where: { id: { in: idsDosAlunos } } });

  if (mapaOriginal === null) {
    await prisma.appSetting.deleteMany({ where: { key: CHAVE_PRODUTOS } });
  } else {
    await prisma.appSetting.update({
      where: { key: CHAVE_PRODUTOS },
      data: { value: mapaOriginal as Prisma.InputJsonValue },
    });
  }
});

// ─────────────────────────────── utilidades ──────────────────────────────

async function criarAluno(plano: Plan, opcoes: { excluido?: boolean } = {}) {
  contador += 1;
  const aluno = await prisma.user.create({
    data: {
      name: 'Aluno do Pagamento',
      email: `pag-${SUFIXO}-${contador}@teste.local`,
      passwordHash: 'sem-senha',
      plan: plano,
      paymentRef: randomBytes(16).toString('base64url'),
      deletedAt: opcoes.excluido ? new Date() : null,
    },
    select: { id: true, email: true, paymentRef: true },
  });
  idsDosAlunos.push(aluno.id);
  return { ...aluno, paymentRef: aluno.paymentRef as string };
}

function novoEventoId(): string {
  contador += 1;
  return `evt-${SUFIXO}-${contador}`;
}

function corpoDoEvento(dados: Record<string, unknown>): string {
  return JSON.stringify(dados);
}

function requisicao(corpo: string | Uint8Array<ArrayBuffer>, assinatura?: string | null): Request {
  const cabecalhos = new Headers({ 'content-type': 'application/json' });
  const assinada = assinatura === undefined ? assinarCorpoFake(corpo, SEGREDO) : assinatura;
  if (assinada !== null) cabecalhos.set('x-assinatura', assinada);
  return new Request('http://localhost/api/webhooks/pagamento', {
    method: 'POST',
    headers: cabecalhos,
    body: corpo,
  });
}

async function enviar(corpo: string | Uint8Array<ArrayBuffer>, assinatura?: string | null) {
  const resposta = await POST(requisicao(corpo, assinatura));
  return { status: resposta.status, json: (await resposta.json()) as Record<string, unknown> };
}

async function planoDe(id: string): Promise<Plan> {
  const aluno = await prisma.user.findUniqueOrThrow({ where: { id }, select: { plan: true } });
  return aluno.plan;
}

function pagamentoDo(externalId: string) {
  return prisma.payment.findUnique({
    where: { provider_externalId: { provider: 'fake', externalId } },
  });
}

function concessoesDo(alunoId: string) {
  return prisma.auditLog.findMany({
    where: { resource: `User:${alunoId}`, action: 'user.plan.grant' },
  });
}

// ──────────────────────────────── testes ─────────────────────────────────

describe('webhook de pagamento — concessão', () => {
  it('aprovado + produto mapeado + referência: sobe o plano, marca grantedAt e audita', async () => {
    const aluno = await criarAluno('ESSENCIAL');
    const id = novoEventoId();
    const corpo = corpoDoEvento({
      id,
      status: 'APPROVED',
      produto: PRODUTO_COMPLETO,
      referencia: aluno.paymentRef,
      valorCentavos: 19700,
    });

    const { status, json } = await enviar(corpo);

    expect(status).toBe(200);
    expect(json).toEqual({ ok: true, resultado: 'concedido' });
    expect(await planoDe(aluno.id)).toBe('COMPLETO');

    const pagamento = await pagamentoDo(id);
    expect(pagamento).toMatchObject({
      status: 'APPROVED',
      productCode: PRODUTO_COMPLETO,
      planCode: 'COMPLETO',
      userId: aluno.id,
      externalReference: aluno.paymentRef,
      amountCents: 19700,
      rawEventHash: createHash('sha256').update(corpo).digest('hex'),
    });
    expect(pagamento?.grantedAt).toBeInstanceOf(Date);

    const auditoria = await concessoesDo(aluno.id);
    expect(auditoria).toHaveLength(1);
    expect(auditoria[0]).toMatchObject({
      actorId: null,
      actorEmail: '(webhook fake)',
      outcome: 'ALLOW',
      before: { plan: 'ESSENCIAL' },
      after: { plan: 'COMPLETO' },
    });
    expect(auditoria[0]?.reason).toContain(`fake:${id}`);
  });

  it('reenviar o mesmo evento responde 200 e não concede de novo', async () => {
    const aluno = await criarAluno('ESSENCIAL');
    const id = novoEventoId();
    const corpo = corpoDoEvento({
      id,
      status: 'APPROVED',
      produto: PRODUTO_COMPLETO,
      referencia: aluno.paymentRef,
    });

    expect((await enviar(corpo)).json.resultado).toBe('concedido');
    expect(await planoDe(aluno.id)).toBe('COMPLETO');

    // Um admin rebaixou o aluno depois da compra. O reenvio do mesmo evento não
    // pode desfazer a decisão dele liberando o plano outra vez.
    await prisma.user.update({ where: { id: aluno.id }, data: { plan: 'ESSENCIAL' } });

    const reenvio = await enviar(corpo);
    expect(reenvio.status).toBe(200);
    expect(reenvio.json).toEqual({ ok: true, resultado: 'duplicado' });
    expect(await planoDe(aluno.id)).toBe('ESSENCIAL');
    expect(await prisma.payment.count({ where: { externalId: id } })).toBe(1);
    expect(await concessoesDo(aluno.id)).toHaveLength(1);

    // Mesmo id com outro corpo (a plataforma "corrigiu" o evento): ainda é o
    // mesmo evento para a idempotência.
    const outroCorpo = corpoDoEvento({
      id,
      status: 'APPROVED',
      produto: PRODUTO_PREMIUM,
      referencia: aluno.paymentRef,
    });
    expect((await enviar(outroCorpo)).json.resultado).toBe('duplicado');
    expect(await planoDe(aluno.id)).toBe('ESSENCIAL');
  });

  it('dois envios simultâneos do mesmo evento geram uma linha e uma concessão', async () => {
    const aluno = await criarAluno('ESSENCIAL');
    const id = novoEventoId();
    const corpo = corpoDoEvento({
      id,
      status: 'APPROVED',
      produto: PRODUTO_PREMIUM,
      referencia: aluno.paymentRef,
    });

    const respostas = await Promise.all([enviar(corpo), enviar(corpo), enviar(corpo)]);

    expect(respostas.map((resposta) => resposta.status)).toEqual([200, 200, 200]);
    expect(respostas.map((resposta) => resposta.json.resultado).sort()).toEqual([
      'concedido',
      'duplicado',
      'duplicado',
    ]);
    expect(await prisma.payment.count({ where: { externalId: id } })).toBe(1);
    expect(await concessoesDo(aluno.id)).toHaveLength(1);
    expect(await planoDe(aluno.id)).toBe('PREMIUM');
  });

  it('nunca rebaixa: Premium que compra o Completo continua Premium', async () => {
    const aluno = await criarAluno('PREMIUM');
    const id = novoEventoId();

    const { status, json } = await enviar(
      corpoDoEvento({ id, status: 'APPROVED', produto: PRODUTO_COMPLETO, referencia: aluno.paymentRef }),
    );

    expect(status).toBe(200);
    expect(json.resultado).toBe('concedido');
    expect(await planoDe(aluno.id)).toBe('PREMIUM');

    const pagamento = await pagamentoDo(id);
    expect(pagamento?.planCode).toBe('COMPLETO');
    // O pagamento foi honrado (o plano atual já cobria): não fica na fila do suporte.
    expect(pagamento?.grantedAt).toBeInstanceOf(Date);

    const auditoria = await concessoesDo(aluno.id);
    expect(auditoria).toHaveLength(1);
    expect(auditoria[0]).toMatchObject({ before: { plan: 'PREMIUM' }, after: { plan: 'PREMIUM' } });
  });

  it('Completo que compra o Premium sobe para Premium', async () => {
    const aluno = await criarAluno('COMPLETO');
    const { json } = await enviar(
      corpoDoEvento({
        id: novoEventoId(),
        status: 'APPROVED',
        produto: PRODUTO_PREMIUM,
        referencia: aluno.paymentRef,
      }),
    );
    expect(json.resultado).toBe('concedido');
    expect(await planoDe(aluno.id)).toBe('PREMIUM');
  });
});

describe('webhook de pagamento — o que não concede', () => {
  it('assinatura inválida responde 401 e não grava nada', async () => {
    const aluno = await criarAluno('ESSENCIAL');
    const id = novoEventoId();
    const corpo = corpoDoEvento({
      id,
      status: 'APPROVED',
      produto: PRODUTO_PREMIUM,
      referencia: aluno.paymentRef,
    });

    const assinadaComOutroSegredo = assinarCorpoFake(corpo, randomBytes(32).toString('hex'));
    const assinadaParaOutroCorpo = assinarCorpoFake(`${corpo} `, SEGREDO);
    const casos: (string | null)[] = [
      null, // sem cabeçalho
      '',
      'nao-e-hex',
      assinadaComOutroSegredo,
      assinadaParaOutroCorpo,
      `${assinarCorpoFake(corpo, SEGREDO)}00`, // comprimento errado
    ];

    for (const assinatura of casos) {
      const { status, json } = await enviar(corpo, assinatura);
      expect(status).toBe(401);
      expect(json.ok).toBe(false);
    }

    expect(await pagamentoDo(id)).toBeNull();
    expect(await prisma.auditLog.count({ where: { resource: `User:${aluno.id}` } })).toBe(0);
    expect(await planoDe(aluno.id)).toBe('ESSENCIAL');
  });

  it('produto fora do mapa grava o Payment com planCode nulo e não concede — mesmo com "plano" no payload', async () => {
    const aluno = await criarAluno('ESSENCIAL');
    const id = novoEventoId();

    const { status, json } = await enviar(
      corpoDoEvento({
        id,
        status: 'APPROVED',
        produto: PRODUTO_FORA_DO_MAPA,
        referencia: aluno.paymentRef,
        plano: 'PREMIUM',
        planCode: 'PREMIUM',
      }),
    );

    expect(status).toBe(200);
    expect(json.resultado).toBe('registrado');
    expect(await planoDe(aluno.id)).toBe('ESSENCIAL');
    expect(await pagamentoDo(id)).toMatchObject({
      productCode: PRODUTO_FORA_DO_MAPA,
      planCode: null,
      userId: aluno.id,
      grantedAt: null,
    });
    expect(await concessoesDo(aluno.id)).toHaveLength(0);
  });

  it('referência desconhecida vira Payment órfão', async () => {
    const id = novoEventoId();
    const referencia = randomBytes(16).toString('base64url');

    const { status, json } = await enviar(
      corpoDoEvento({ id, status: 'APPROVED', produto: PRODUTO_PREMIUM, referencia }),
    );

    expect(status).toBe(200);
    expect(json.resultado).toBe('registrado');
    expect(await pagamentoDo(id)).toMatchObject({
      userId: null,
      externalReference: referencia,
      planCode: 'PREMIUM',
      grantedAt: null,
    });
  });

  it('sem referência também vira órfão', async () => {
    const id = novoEventoId();
    const { json } = await enviar(
      corpoDoEvento({ id, status: 'APPROVED', produto: PRODUTO_PREMIUM, referencia: null }),
    );
    expect(json.resultado).toBe('registrado');
    expect(await pagamentoDo(id)).toMatchObject({ userId: null, externalReference: null });
  });

  it('referência de conta excluída não concede (órfão)', async () => {
    const aluno = await criarAluno('ESSENCIAL', { excluido: true });
    const id = novoEventoId();

    const { json } = await enviar(
      corpoDoEvento({ id, status: 'APPROVED', produto: PRODUTO_PREMIUM, referencia: aluno.paymentRef }),
    );

    expect(json.resultado).toBe('registrado');
    expect(await planoDe(aluno.id)).toBe('ESSENCIAL');
    expect(await pagamentoDo(id)).toMatchObject({ userId: null, grantedAt: null });
    expect(await concessoesDo(aluno.id)).toHaveLength(0);
  });

  it('o aluno é achado só pela referência, nunca pelo e-mail', async () => {
    const aluno = await criarAluno('ESSENCIAL');
    const id = novoEventoId();

    const { json } = await enviar(
      corpoDoEvento({ id, status: 'APPROVED', produto: PRODUTO_PREMIUM, referencia: aluno.email }),
    );

    expect(json.resultado).toBe('registrado');
    expect(await planoDe(aluno.id)).toBe('ESSENCIAL');
    expect(await pagamentoDo(id)).toMatchObject({ userId: null });
  });

  it('pendente só registra', async () => {
    const aluno = await criarAluno('ESSENCIAL');
    const id = novoEventoId();
    const { json } = await enviar(
      corpoDoEvento({ id, status: 'PENDING', produto: PRODUTO_PREMIUM, referencia: aluno.paymentRef }),
    );
    expect(json.resultado).toBe('registrado');
    expect(await planoDe(aluno.id)).toBe('ESSENCIAL');
    expect(await pagamentoDo(id)).toMatchObject({ status: 'PENDING', userId: aluno.id, grantedAt: null });
  });

  it('estorno e cancelamento registram e auditam, sem rebaixar', async () => {
    const aluno = await criarAluno('ESSENCIAL');
    await enviar(
      corpoDoEvento({
        id: novoEventoId(),
        status: 'APPROVED',
        produto: PRODUTO_PREMIUM,
        referencia: aluno.paymentRef,
      }),
    );
    expect(await planoDe(aluno.id)).toBe('PREMIUM');

    for (const [status, acao] of [
      ['REFUNDED', 'payment.refunded'],
      ['CANCELED', 'payment.canceled'],
    ] as const) {
      const id = novoEventoId();
      const { json } = await enviar(
        corpoDoEvento({ id, status, produto: PRODUTO_PREMIUM, referencia: aluno.paymentRef }),
      );
      expect(json.resultado).toBe('registrado');
      expect(await planoDe(aluno.id)).toBe('PREMIUM');
      expect(await pagamentoDo(id)).toMatchObject({ status, userId: aluno.id, grantedAt: null });

      const auditoria = await prisma.auditLog.findMany({
        where: { resource: `User:${aluno.id}`, action: acao },
      });
      expect(auditoria).toHaveLength(1);
      expect(auditoria[0]?.reason).toContain(`fake:${id}`);
    }
  });
});

describe('webhook de pagamento — trancas da rota', () => {
  it('corpo assinado mas ilegível responde 400 e não grava', async () => {
    const antes = await prisma.payment.count({ where: { externalId: { startsWith: `evt-${SUFIXO}-` } } });

    for (const corpo of [
      '{"id": ',
      corpoDoEvento({ id: novoEventoId(), status: 'PAGO', produto: PRODUTO_PREMIUM }),
      corpoDoEvento({ id: novoEventoId(), status: 'APPROVED' }),
      corpoDoEvento({ status: 'APPROVED', produto: PRODUTO_PREMIUM }),
      '[]',
      new Uint8Array([0xff, 0xfe, 0x7b]), // UTF-8 inválido
    ]) {
      const { status, json } = await enviar(corpo);
      expect(status).toBe(400);
      expect(json.ok).toBe(false);
    }

    const depois = await prisma.payment.count({ where: { externalId: { startsWith: `evt-${SUFIXO}-` } } });
    expect(depois).toBe(antes);
  });

  it('corpo acima de 64 KB responde 413', async () => {
    const corpo = corpoDoEvento({
      id: novoEventoId(),
      status: 'APPROVED',
      produto: PRODUTO_PREMIUM,
      recheio: 'x'.repeat(70 * 1024),
    });
    const { status } = await enviar(corpo);
    expect(status).toBe(413);
  });

  it('sem provedor ou com segredo ausente/curto responde 503', async () => {
    const corpo = corpoDoEvento({ id: novoEventoId(), status: 'APPROVED', produto: PRODUTO_PREMIUM });

    try {
      delete process.env.PAYMENT_PROVIDER;
      expect((await enviar(corpo)).status).toBe(503);

      process.env.PAYMENT_PROVIDER = 'fake';
      delete process.env.PAYMENT_WEBHOOK_SECRET;
      expect((await enviar(corpo)).status).toBe(503);

      process.env.PAYMENT_WEBHOOK_SECRET = 'curto';
      expect((await enviar(corpo)).status).toBe(503);

      process.env.PAYMENT_PROVIDER = 'plataforma-que-nao-existe';
      process.env.PAYMENT_WEBHOOK_SECRET = SEGREDO;
      expect((await enviar(corpo)).status).toBe(503);

      // O registro é um Map: nome herdado de Object.prototype não vira provedor.
      for (const nome of ['constructor', '__proto__', 'toString']) {
        process.env.PAYMENT_PROVIDER = nome;
        expect((await enviar(corpo)).status).toBe(503);
      }
    } finally {
      ligarFake();
    }
  });

  it('o painel mostra o endereço do webhook a partir de APP_URL', () => {
    const original = process.env.APP_URL;
    try {
      process.env.APP_URL = ' https://app.exemplo.test/ ';
      expect(enderecoDoWebhook()).toBe(`https://app.exemplo.test${CAMINHO_DO_WEBHOOK}`);

      delete process.env.APP_URL;
      expect(enderecoDoWebhook()).toBeNull();

      process.env.APP_URL = 'javascript:alert(1)';
      expect(enderecoDoWebhook()).toBeNull();
    } finally {
      if (original === undefined) delete process.env.APP_URL;
      else process.env.APP_URL = original;
    }
  });

  it('a resposta não carrega dado pessoal', async () => {
    const aluno = await criarAluno('ESSENCIAL');
    const resposta = await POST(
      requisicao(
        corpoDoEvento({
          id: novoEventoId(),
          status: 'APPROVED',
          produto: PRODUTO_COMPLETO,
          referencia: aluno.paymentRef,
        }),
      ),
    );
    const texto = await resposta.text();

    expect(resposta.headers.get('cache-control')).toBe('no-store');
    expect(texto).not.toContain(aluno.email);
    expect(texto).not.toContain(aluno.id);
    expect(texto).not.toContain(aluno.paymentRef);
    expect(Object.keys(JSON.parse(texto) as object).sort()).toEqual(['ok', 'resultado']);
  });
});
