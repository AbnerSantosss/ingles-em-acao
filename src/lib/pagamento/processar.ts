/**
 * O que um evento de pagamento **vale** — igual para qualquer plataforma.
 *
 * ⚠️ MÓDULO DE SERVIDOR (Prisma).
 *
 * Chega aqui um {@link EventoDePagamento} cuja assinatura já foi conferida pela
 * rota. As regras, na ordem:
 *
 * 1. **Idempotência pelo `(provider, externalId)`.** Evento repetido não grava
 *    nem concede de novo. A inserção do `Payment` e a concessão estão na mesma
 *    transação, e o índice único decide as corridas: dois envios simultâneos do
 *    mesmo evento produzem uma linha e uma concessão; o perdedor recebe `P2002`
 *    e vira "duplicado".
 * 2. **Aluno só pela referência** (`User.paymentRef`, conta não excluída).
 *    Nunca pelo e-mail. Referência ausente ou desconhecida → `Payment` órfão
 *    (`userId` nulo), para o suporte.
 * 3. **Plano só pelo mapa** produto→plano do painel. Produto fora do mapa →
 *    `planCode` nulo e nada liberado.
 * 4. **`APPROVED` + produto mapeado + aluno achado → concede**: o plano passa a
 *    ser o maior entre o atual e o mapeado. **Nunca rebaixa** — quem já é
 *    Premium e compra o Completo continua Premium. `grantedAt` marca a concessão
 *    e a auditoria registra `user.plan.grant`.
 * 5. **`REFUNDED`/`CANCELED` só registram e auditam.** Nada é rebaixado
 *    automaticamente nesta versão: a política de estorno (prazo de
 *    arrependimento do CDC, estorno parcial, chargeback contestado) ainda não
 *    está definida e a plataforma real ainda não foi escolhida. Tirar acesso de
 *    quem pagou por causa de um evento mal interpretado é pior do que um admin
 *    rebaixar à mão, pelo painel, com motivo. Quando a política existir, é
 *    aqui que ela entra.
 * 6. `PENDING` só registra.
 *
 * `rawEventHash` guarda o SHA-256 do corpo bruto: prova do que chegou sem guardar
 * o corpo (que pode ter nome, e-mail e CPF do comprador).
 */
import type { Plan, Prisma } from '@prisma/client';

import { auditarSistema } from '@/lib/admin/audit';
import { prisma } from '@/lib/db';

import { lerMapaDeProdutos, maiorPlano, planoDoProduto } from './produtos';
import type { EventoDePagamento } from './provedor';

/** O desfecho, para a resposta do webhook. Sem dado pessoal. */
export type ResultadoDoEvento =
  /** Evento já recebido antes: nada foi gravado nem concedido de novo. */
  | { tipo: 'duplicado' }
  /** Plano concedido (ou mantido, se o atual já cobria). */
  | { tipo: 'concedido'; pagamentoId: string }
  /** Gravado sem concessão: não aprovado, órfão ou produto sem mapeamento. */
  | { tipo: 'registrado'; pagamentoId: string };

type Concessao = { userId: string; antes: Plan; depois: Plan };

/** Quantas vezes a troca de plano é retentada se o plano mudar no meio. */
const TENTATIVAS_DE_CONCESSAO = 3;

function ehChaveDuplicada(erro: unknown): boolean {
  return (
    typeof erro === 'object' &&
    erro !== null &&
    'code' in erro &&
    (erro as { code?: unknown }).code === 'P2002'
  );
}

/**
 * Sobe o plano do aluno para o maior entre o atual e o comprado, dentro da
 * transação do pagamento.
 *
 * ⚠️ Comparar-e-trocar, não ler-e-gravar: o UPDATE só vale se o plano ainda é o
 * que foi lido. Sem isso, duas compras simultâneas (Completo e Premium) podiam
 * terminar com a mais lenta gravando Completo por cima do Premium — um
 * rebaixamento. Em READ COMMITTED cada releitura enxerga o que a outra
 * transação acabou de gravar, então o laço converge.
 *
 * `null` quando a conta sumiu ou foi excluída no meio: nada é concedido.
 */
async function concederPlano(
  tx: Prisma.TransactionClient,
  userId: string,
  plano: Plan,
): Promise<Concessao | null> {
  for (let tentativa = 0; tentativa < TENTATIVAS_DE_CONCESSAO; tentativa += 1) {
    const atual = await tx.user.findFirst({
      where: { id: userId, deletedAt: null },
      select: { plan: true },
    });
    if (!atual) return null;

    const depois = maiorPlano(atual.plan, plano);
    if (depois === atual.plan) return { userId, antes: atual.plan, depois };

    const trocado = await tx.user.updateMany({
      where: { id: userId, deletedAt: null, plan: atual.plan },
      data: { plan: depois },
    });
    if (trocado.count === 1) return { userId, antes: atual.plan, depois };
  }

  // Joga para a rota responder 500: a transação volta inteira (o `Payment`
  // também) e a plataforma reenvia o evento.
  throw new Error('o plano do aluno mudou durante a concessão; o evento será reenviado');
}

/**
 * Processa um evento já autenticado. **Lança** em falha de banco — a rota
 * responde 500 e a plataforma reenvia; nada fica pela metade porque inserção e
 * concessão são uma transação só.
 */
export async function processarEventoDePagamento(entrada: {
  provedor: string;
  evento: EventoDePagamento;
  hashDoCorpo: string;
}): Promise<ResultadoDoEvento> {
  const { provedor, evento, hashDoCorpo } = entrada;
  const rotulo = `${provedor}:${evento.externalId}`;

  // Atalho da idempotência: o caso comum de reenvio nem abre transação. A
  // garantia de verdade é o índice único, mais abaixo.
  const existente = await prisma.payment.findUnique({
    where: { provider_externalId: { provider: provedor, externalId: evento.externalId } },
    select: { rawEventHash: true },
  });
  if (existente) {
    if (existente.rawEventHash !== hashDoCorpo) {
      console.warn(
        `[pagamento] ${rotulo} chegou de novo com outro corpo; mantido o primeiro (idempotência).`,
      );
    }
    return { tipo: 'duplicado' };
  }

  const mapa = await lerMapaDeProdutos();
  if (!mapa.valido) {
    console.error(
      '[pagamento] o mapa produto→plano guardado está fora do formato; tratado como vazio. Corrija em /admin/configuracoes.',
    );
  }
  const planoMapeado = planoDoProduto(mapa.produtos, evento.productCode);

  const aluno =
    evento.referencia === null
      ? null
      : await prisma.user.findFirst({
          where: { paymentRef: evento.referencia, deletedAt: null },
          select: { id: true },
        });

  const concede = evento.status === 'APPROVED' && planoMapeado !== null && aluno !== null;

  let gravado: { pagamentoId: string; concessao: Concessao | null };
  try {
    gravado = await prisma.$transaction(async (tx) => {
      const pagamento = await tx.payment.create({
        data: {
          provider: provedor,
          externalId: evento.externalId,
          status: evento.status,
          productCode: evento.productCode,
          planCode: planoMapeado,
          externalReference: evento.referencia,
          userId: aluno?.id ?? null,
          amountCents: evento.amountCents,
          rawEventHash: hashDoCorpo,
        },
        select: { id: true },
      });

      if (!concede) return { pagamentoId: pagamento.id, concessao: null };

      const concessao = await concederPlano(tx, aluno.id, planoMapeado);
      if (concessao) {
        await tx.payment.update({
          where: { id: pagamento.id },
          data: { grantedAt: new Date() },
          select: { id: true },
        });
      }
      return { pagamentoId: pagamento.id, concessao };
    });
  } catch (erro: unknown) {
    // Corrida com um envio simultâneo do mesmo evento: o outro gravou primeiro.
    if (ehChaveDuplicada(erro)) return { tipo: 'duplicado' };
    throw erro;
  }

  const { pagamentoId, concessao } = gravado;

  // Auditoria depois do commit (ver `auditarSistema`). Não lança.
  if (concessao) {
    await auditarSistema({
      sistema: `webhook ${provedor}`,
      action: 'user.plan.grant',
      resource: `User:${concessao.userId}`,
      before: { plan: concessao.antes },
      after: { plan: concessao.depois },
      reason:
        concessao.antes === concessao.depois
          ? `pagamento ${rotulo}: produto ${evento.productCode} → ${planoMapeado}; o plano atual já cobria, mantido`
          : `pagamento ${rotulo}: produto ${evento.productCode} → ${planoMapeado}`,
    });
    return { tipo: 'concedido', pagamentoId };
  }

  if (evento.status === 'REFUNDED' || evento.status === 'CANCELED') {
    await auditarSistema({
      sistema: `webhook ${provedor}`,
      action: evento.status === 'REFUNDED' ? 'payment.refunded' : 'payment.canceled',
      resource: aluno ? `User:${aluno.id}` : `Payment:${pagamentoId}`,
      after: {
        status: evento.status,
        productCode: evento.productCode,
        planCode: planoMapeado,
        payment: pagamentoId,
      },
      reason: `pagamento ${rotulo}: registrado sem rebaixar o plano — a revisão é humana até a política de estorno estar definida`,
    });
  }

  if (evento.status === 'APPROVED') {
    // Pagamento aprovado que não liberou nada: o suporte precisa ver.
    const porque =
      aluno === null
        ? evento.referencia === null
          ? 'sem referência de aluno'
          : 'referência desconhecida ou de conta excluída'
        : planoMapeado === null
          ? 'produto fora do mapa produto→plano'
          : 'a conta foi excluída durante o processamento';
    console.warn(`[pagamento] ${rotulo} aprovado e gravado sem liberar plano: ${porque}.`);
  }

  return { tipo: 'registrado', pagamentoId };
}
