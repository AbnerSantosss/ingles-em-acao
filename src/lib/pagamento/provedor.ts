/**
 * Pagamento independente de plataforma — o contrato de um adaptador e a escolha
 * de qual adaptador vale (`PAYMENT_PROVIDER`).
 *
 * ⚠️ MÓDULO DE SERVIDOR (lê `PAYMENT_WEBHOOK_SECRET`). Nunca importe de um
 * `'use client'`: o segredo do webhook iria para o navegador.
 *
 * ## O desenho
 *
 * A plataforma de venda avisa o app por webhook (`POST /api/webhooks/pagamento`).
 * Cada plataforma tem o seu formato de corpo e o seu jeito de assinar; o resto do
 * app não pode saber disso. Então:
 *
 * - {@link PaymentProvider} é tudo o que um adaptador faz: conferir a assinatura
 *   do **corpo bruto** e traduzi-lo para um {@link EventoDePagamento}
 *   normalizado.
 * - O que o evento **vale** — qual aluno, qual plano, se concede — é decidido em
 *   `./processar.ts`, igual para qualquer plataforma. O adaptador não escolhe
 *   plano: ele devolve o código do produto, e o plano sai do mapa
 *   produto→plano do painel (`./produtos.ts`). Um payload que diga "PREMIUM"
 *   não libera nada.
 *
 * ## Onde entra o adaptador real (Appmax ou outra — decisão do PO pendente)
 *
 * 1. Um arquivo novo nesta pasta (ex.: `appmax.ts`) que monta um
 *    `PaymentProvider`: a assinatura do jeito que a plataforma documenta
 *    (comparada em tempo constante, como em `./fake.ts`), o corpo traduzido para
 *    {@link EventoDePagamento} e o nome do parâmetro de query que o checkout
 *    dela devolve no webhook (é nele que vai a `User.paymentRef`).
 * 2. **Uma linha** em {@link PROVEDORES}: o nome que vai em `PAYMENT_PROVIDER` e
 *    a fábrica do arquivo novo. O segredo chega já conferido (presente, com o
 *    tamanho mínimo); se a plataforma pedir outra credencial além dele, a
 *    fábrica a lê e o `.env.example` ganha a variável.
 * 3. Testes em `tests/pagamento/` com um corpo de exemplo da plataforma.
 *
 * Rota, idempotência, mapa, referência e auditoria não mudam. O endereço que se
 * cola no painel da plataforma aparece em `/admin/configuracoes`
 * ({@link enderecoDoWebhook}). Até esse adaptador existir, termos, landing e
 * copy continuam dizendo "liberação manual".
 *
 * ## Configuração
 *
 * Lida direto de `process.env` a cada chamada (como `@/lib/video/bucket`), sem
 * passar pelo `@/lib/env` — cujo schema exige as variáveis de SMTP. Trocar a
 * variável no Portainer + reiniciar é o fluxo esperado. As mensagens de
 * {@link obterProvedor} citam **o nome** da variável, nunca o valor.
 */
import 'server-only';

import type { PaymentStatus } from '@prisma/client';

import { criarProvedorFake } from './fake';

// ─────────────────────────────── contrato ────────────────────────────────

/** O evento de venda já traduzido do formato da plataforma. */
export type EventoDePagamento = {
  /**
   * Id do evento na plataforma — a chave da idempotência, junto com o nome do
   * provedor. Se a plataforma não tiver id de evento, o adaptador compõe
   * `<transação>:<status>` (ver o comentário de `Payment.externalId`).
   */
  externalId: string;
  status: PaymentStatus;
  /** Código do produto na plataforma. O plano sai do mapa, nunca daqui. */
  productCode: string;
  /** A `User.paymentRef` que o link de checkout levou; `null` quando não veio. */
  referencia: string | null;
  amountCents: number | null;
};

/** O que um adaptador de plataforma de venda precisa saber fazer. */
export interface PaymentProvider {
  /** Vai para `Payment.provider` e para a auditoria: "fake", "appmax"… */
  readonly nome: string;
  /**
   * O parâmetro de query do link de checkout que a plataforma devolve no
   * webhook. É por ele que a referência opaca do aluno viaja.
   */
  readonly parametroDeReferencia: string;
  /**
   * O corpo veio mesmo da plataforma? Recebe o corpo **bruto** — reserializar o
   * JSON antes mudaria os bytes e a assinatura nunca bateria.
   *
   * ⚠️ Nunca lança: qualquer coisa estranha é `false`.
   */
  verificarAssinatura(corpoBruto: Uint8Array, cabecalhos: Headers): boolean | Promise<boolean>;
  /**
   * Traduz o corpo para o evento normalizado. `null` quando o corpo não é um
   * evento que o adaptador reconheça (JSON torto, campo faltando, status
   * desconhecido). Só é chamado depois de a assinatura conferir.
   *
   * ⚠️ Nunca lança.
   */
  extrairEvento(corpoBruto: Uint8Array): EventoDePagamento | null;
}

// ───────────────────────────── configuração ──────────────────────────────

/**
 * Segredo curto demais é recusado: o `.env.example` manda gerar 32 bytes em
 * hexadecimal (64 caracteres), e um "123" digitado às pressas transformaria o
 * webhook numa porta aberta para liberar plano.
 */
export const TAMANHO_MINIMO_DO_SEGREDO = 16;

/**
 * Os adaptadores que `PAYMENT_PROVIDER` aceita: nome → fábrica que recebe o
 * segredo já conferido. **O adaptador real entra aqui, numa linha** — ver o
 * cabeçalho do arquivo.
 *
 * `Map`, e não objeto literal: o nome vem do ambiente, e `constructor` ou
 * `__proto__` não podem virar provedor.
 */
const PROVEDORES: ReadonlyMap<string, (segredo: string) => PaymentProvider> = new Map([
  ['fake', criarProvedorFake],
]);

/** Os valores que `PAYMENT_PROVIDER` aceita hoje. */
export const PROVEDORES_CONHECIDOS: readonly string[] = [...PROVEDORES.keys()];

export type LeituraDoProvedor =
  | { ok: true; provedor: PaymentProvider }
  | { ok: false; motivo: string };

function lerVariavel(nome: string): string {
  return process.env[nome]?.trim() ?? '';
}

/**
 * O adaptador que vale agora, ou o motivo de não haver um.
 *
 * Sem provedor, o webhook responde 503 e os links de checkout seguem sem
 * referência. Puro (não loga): quem chama decide se o motivo vai para o log.
 */
export function obterProvedor(): LeituraDoProvedor {
  const nome = lerVariavel('PAYMENT_PROVIDER').toLowerCase();
  if (nome === '') return { ok: false, motivo: 'PAYMENT_PROVIDER não está configurada' };

  const criar = PROVEDORES.get(nome);
  if (!criar) {
    return {
      ok: false,
      motivo: `PAYMENT_PROVIDER tem um valor que o app não conhece (aceitos: ${PROVEDORES_CONHECIDOS.join(', ')})`,
    };
  }

  const segredo = lerVariavel('PAYMENT_WEBHOOK_SECRET');
  if (segredo === '') {
    return { ok: false, motivo: 'PAYMENT_WEBHOOK_SECRET não está configurada' };
  }
  if (segredo.length < TAMANHO_MINIMO_DO_SEGREDO) {
    return {
      ok: false,
      motivo: `PAYMENT_WEBHOOK_SECRET é curta demais (mínimo de ${TAMANHO_MINIMO_DO_SEGREDO} caracteres)`,
    };
  }
  return { ok: true, provedor: criar(segredo) };
}

/** O caminho da rota do webhook (`src/app/api/webhooks/pagamento/route.ts`). */
export const CAMINHO_DO_WEBHOOK = '/api/webhooks/pagamento';

/**
 * O endereço que se cola no painel da plataforma de venda: `APP_URL` (a mesma
 * base dos links de e-mail) + {@link CAMINHO_DO_WEBHOOK}. `null` quando
 * `APP_URL` falta ou não é um endereço http(s) — a tela mostra só o caminho.
 */
export function enderecoDoWebhook(): string | null {
  const base = lerVariavel('APP_URL').replace(/\/+$/, '');
  try {
    const url = new URL(`${base}${CAMINHO_DO_WEBHOOK}`);
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.toString() : null;
  } catch {
    return null;
  }
}

/** O que o painel mostra sobre o webhook: nome do provedor, nunca o segredo. */
export type EstadoDoPagamento =
  | { ligado: true; provedor: string }
  | { ligado: false; motivo: string };

export function estadoDoPagamento(): EstadoDoPagamento {
  const leitura = obterProvedor();
  return leitura.ok
    ? { ligado: true, provedor: leitura.provedor.nome }
    : { ligado: false, motivo: leitura.motivo };
}
