/**
 * `FakePaymentProvider` — o adaptador de desenvolvimento e de testes
 * (`PAYMENT_PROVIDER="fake"`).
 *
 * ⚠️ MÓDULO DE SERVIDOR (segura o segredo do webhook).
 *
 * Não imita plataforma nenhuma: é o formato mais simples que exercita o caminho
 * inteiro (assinatura → idempotência → referência → mapa → concessão). Quando o
 * adaptador real existir, este continua servindo para os testes e para o `curl`
 * da documentação.
 *
 * ## Formato do corpo (JSON, UTF-8)
 *
 * ```json
 * {
 *   "id": "evt-2026-0001",
 *   "status": "APPROVED",
 *   "produto": "wsa-premium",
 *   "referencia": "q3Jb0v5mX1c8o4kS2pYt9A",
 *   "valorCentavos": 19700
 * }
 * ```
 *
 * - `id` (obrigatório, 1–128 caracteres): id do evento — a chave da idempotência.
 * - `status` (obrigatório): `PENDING` | `APPROVED` | `REFUNDED` | `CANCELED`.
 * - `produto` (obrigatório, 1–100 caracteres): código do produto na plataforma.
 * - `referencia` (opcional, `null` ou ausente): a `ref` que o link de checkout
 *   levou (`User.paymentRef`).
 * - `valorCentavos` (opcional, `null` ou ausente): inteiro ≥ 0.
 *
 * Campos a mais são ignorados. **Não existe campo de plano**: o plano liberado sai
 * do mapa produto→plano do painel.
 *
 * ## Assinatura
 *
 * Cabeçalho `x-assinatura` = HMAC-SHA256 dos **bytes do corpo**, em hexadecimal,
 * com a chave `PAYMENT_WEBHOOK_SECRET`. Comparada em tempo constante.
 *
 * ## Referência no link de checkout
 *
 * Parâmetro de query `ref`.
 */
import { createHmac, timingSafeEqual } from 'node:crypto';

import { z } from 'zod';

import type { EventoDePagamento, PaymentProvider } from './provedor';

export const NOME_DO_PROVEDOR_FAKE = 'fake';

/** O cabeçalho que carrega a assinatura (documentado no `.env.example`). */
export const CABECALHO_DA_ASSINATURA = 'x-assinatura';

/** O parâmetro de query do checkout que leva a `User.paymentRef`. */
export const PARAMETRO_DE_REFERENCIA_FAKE = 'ref';

/** HMAC-SHA256 em hexadecimal: 64 caracteres. */
const FORMATO_DA_ASSINATURA = /^[0-9a-f]{64}$/;

/**
 * A assinatura do Fake para um corpo — o que o remetente põe em `x-assinatura`.
 *
 * Exportada para os testes e para o script de exemplo da documentação. Assina os
 * bytes exatos: o corpo que vai no `POST` tem de ser o mesmo que foi assinado.
 */
export function assinarCorpoFake(corpo: string | Uint8Array, segredo: string): string {
  return createHmac('sha256', segredo).update(corpo).digest('hex');
}

const textoObrigatorio = (maximo: number) => z.string().trim().min(1).max(maximo);

const EsquemaDoEventoFake = z.object({
  id: textoObrigatorio(128),
  status: z.enum(['PENDING', 'APPROVED', 'REFUNDED', 'CANCELED']),
  produto: textoObrigatorio(100),
  referencia: z.string().trim().max(128).nullish(),
  valorCentavos: z.number().int().min(0).max(100_000_000).nullish(),
});

/** Decodifica UTF-8 **estrito**: byte inválido é corpo ilegível, não "�". */
function decodificar(corpo: Uint8Array): string | null {
  try {
    return new TextDecoder('utf-8', { fatal: true }).decode(corpo);
  } catch {
    return null;
  }
}

/** O adaptador Fake com o segredo já lido do ambiente (ver `./provedor.ts`). */
export function criarProvedorFake(segredo: string): PaymentProvider {
  return {
    nome: NOME_DO_PROVEDOR_FAKE,
    parametroDeReferencia: PARAMETRO_DE_REFERENCIA_FAKE,

    verificarAssinatura(corpoBruto: Uint8Array, cabecalhos: Headers): boolean {
      const recebida = (cabecalhos.get(CABECALHO_DA_ASSINATURA) ?? '').trim().toLowerCase();
      // Formato conferido antes: `Buffer.from(…, 'hex')` engole caractere
      // inválido em silêncio e devolveria um buffer mais curto.
      if (!FORMATO_DA_ASSINATURA.test(recebida)) return false;

      try {
        const esperada = createHmac('sha256', segredo).update(corpoBruto).digest();
        // Os dois têm 32 bytes (o formato garante): `timingSafeEqual` não lança.
        return timingSafeEqual(Buffer.from(recebida, 'hex'), esperada);
      } catch {
        return false;
      }
    },

    extrairEvento(corpoBruto: Uint8Array): EventoDePagamento | null {
      const texto = decodificar(corpoBruto);
      if (texto === null) return null;

      let json: unknown;
      try {
        json = JSON.parse(texto);
      } catch {
        return null;
      }

      const lido = EsquemaDoEventoFake.safeParse(json);
      if (!lido.success) return null;

      const { id, status, produto, referencia, valorCentavos } = lido.data;
      return {
        externalId: id,
        status,
        productCode: produto,
        referencia: referencia ? referencia : null,
        amountCents: valorCentavos ?? null,
      };
    },
  };
}
