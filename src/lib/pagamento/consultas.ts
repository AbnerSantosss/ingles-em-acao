/**
 * Leituras de `Payment` para o painel (`/admin/configuracoes`).
 *
 * ⚠️ MÓDULO DE SERVIDOR (Prisma). Só leitura: quem grava `Payment` é o webhook
 * (`./processar.ts`).
 *
 * O que o suporte precisa enxergar são os pagamentos que **não** liberaram
 * nada: órfãos (a referência não casou com nenhuma conta ativa) e produtos fora
 * do mapa. Os dois chegam com status aprovado e ficam esperando alguém liberar
 * à mão, pela ficha do aluno.
 */
import type { PaymentStatus, Plan } from '@prisma/client';

import { prisma } from '@/lib/db';

export type PagamentoRecente = {
  id: string;
  provider: string;
  externalId: string;
  status: PaymentStatus;
  productCode: string;
  /** `null` = produto fora do mapa na hora em que o evento chegou. */
  planCode: Plan | null;
  amountCents: number | null;
  grantedAt: Date | null;
  createdAt: Date;
  /** `null` = órfão: a referência não casou com nenhuma conta ativa. */
  aluno: { id: string; email: string } | null;
};

export type ResumoDePagamentos = {
  recentes: PagamentoRecente[];
  /** Aprovados que não liberaram plano (órfãos ou sem mapeamento), em todo o histórico. */
  aprovadosSemLiberacao: number;
};

/** Quantos pagamentos a tela mostra — é um resumo, não um extrato. */
export const PAGAMENTOS_NA_TELA = 10;

/** Os últimos pagamentos recebidos e quantos aprovados ficaram sem liberação. */
export async function resumoDePagamentos(
  limite: number = PAGAMENTOS_NA_TELA,
): Promise<ResumoDePagamentos> {
  const [linhas, aprovadosSemLiberacao] = await Promise.all([
    prisma.payment.findMany({
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      take: limite,
      select: {
        id: true,
        provider: true,
        externalId: true,
        status: true,
        productCode: true,
        planCode: true,
        amountCents: true,
        grantedAt: true,
        createdAt: true,
        user: { select: { id: true, email: true } },
      },
    }),
    prisma.payment.count({ where: { status: 'APPROVED', grantedAt: null } }),
  ]);

  return {
    recentes: linhas.map(({ user, ...pagamento }) => ({ ...pagamento, aluno: user })),
    aprovadosSemLiberacao,
  };
}
