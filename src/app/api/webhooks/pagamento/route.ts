/**
 * `POST /api/webhooks/pagamento` — a plataforma de venda avisa que um pagamento
 * mudou de estado. Independente de plataforma: o adaptador que vale é o de
 * `PAYMENT_PROVIDER` (`src/lib/pagamento/provedor.ts`).
 *
 * Contrato da rota, na ordem em que as trancas rodam:
 *
 * - Provedor ou segredo ausente/inválido → **503**, nada roda (webhook
 *   desligado neste ambiente). O motivo — só o nome da variável — vai para o log.
 * - Corpo acima de {@link TETO_DO_CORPO} bytes → **413**, sem ler o resto.
 * - Assinatura errada ou ausente → **401** e **nada é gravado** (nem `Payment`,
 *   nem auditoria: um corpo sem assinatura não é evento, é ruído).
 * - Corpo assinado mas ilegível (JSON torto, campo faltando) → **400**. A
 *   plataforma vai insistir; o log mostra que o formato mudou.
 * - Evento válido → **200** com `{ ok, resultado }`, onde `resultado` é
 *   `concedido`, `registrado` ou `duplicado`. Evento repetido também é 200 —
 *   senão a plataforma reenviaria para sempre.
 * - Banco fora do ar → **500**; a plataforma reenvia e a idempotência segura a
 *   repetição.
 *
 * ⚠️ A resposta nunca leva dado pessoal (nome, e-mail, plano do aluno): ela vai
 * para o painel de uma plataforma de terceiro.
 *
 * ⚠️ O `proxy.ts` não cobre `/api/` (ver o `matcher`): a única tranca desta rota
 * é a assinatura do corpo, conferida em tempo constante pelo adaptador.
 *
 * Só `POST`: o Next responde 405 sozinho para os outros métodos. Handler que não
 * é `GET` nunca entra em cache no Next 16; o `Cache-Control: no-store` é para
 * qualquer proxy no caminho.
 */
import { createHash } from 'node:crypto';

import { processarEventoDePagamento } from '@/lib/pagamento/processar';
import { obterProvedor } from '@/lib/pagamento/provedor';

const SEM_CACHE = { 'Cache-Control': 'no-store' } as const;

/**
 * Teto do corpo: um evento de venda tem poucos KB. Sem teto, qualquer um na
 * internet faria o servidor bufferizar megabytes antes da assinatura recusar.
 *
 * Não exportado: `route.ts` só pode exportar os handlers e a config de segmento.
 */
const TETO_DO_CORPO = 64 * 1024;

function responder(status: number, corpo: Record<string, unknown>): Response {
  return Response.json(corpo, { status, headers: SEM_CACHE });
}

/**
 * Lê o corpo bruto (os bytes exatos que foram assinados) parando no teto.
 * `null` = passou do teto.
 */
async function lerCorpoComTeto(request: Request, teto: number): Promise<Uint8Array | null> {
  // Atalho honesto: quem declara um corpo grande nem começa a ser lido. O
  // cabeçalho pode mentir para baixo, por isso a contagem abaixo continua.
  const declarado = Number(request.headers.get('content-length') ?? '');
  if (Number.isFinite(declarado) && declarado > teto) return null;

  if (!request.body) return new Uint8Array(0);

  const leitor = request.body.getReader();
  const pedacos: Uint8Array[] = [];
  let total = 0;
  for (;;) {
    const { done, value } = await leitor.read();
    if (done) break;
    total += value.byteLength;
    if (total > teto) {
      await leitor.cancel().catch(() => undefined);
      return null;
    }
    pedacos.push(value);
  }

  const corpo = new Uint8Array(total);
  let posicao = 0;
  for (const pedaco of pedacos) {
    corpo.set(pedaco, posicao);
    posicao += pedaco.byteLength;
  }
  return corpo;
}

export async function POST(request: Request): Promise<Response> {
  const leitura = obterProvedor();
  if (!leitura.ok) {
    console.error(`[pagamento] webhook desligado: ${leitura.motivo}.`);
    return responder(503, { ok: false, erro: 'Webhook de pagamento desligado neste ambiente.' });
  }
  const provedor = leitura.provedor;

  let corpo: Uint8Array | null;
  try {
    corpo = await lerCorpoComTeto(request, TETO_DO_CORPO);
  } catch {
    return responder(400, { ok: false, erro: 'Não foi possível ler o corpo.' });
  }
  if (corpo === null) {
    return responder(413, { ok: false, erro: 'Corpo grande demais.' });
  }

  let assinaturaConfere = false;
  try {
    assinaturaConfere = await provedor.verificarAssinatura(corpo, request.headers);
  } catch {
    // O contrato diz que o adaptador não lança; se lançar, é assinatura recusada.
    assinaturaConfere = false;
  }
  if (!assinaturaConfere) {
    console.warn(`[pagamento] webhook ${provedor.nome}: assinatura recusada; nada foi gravado.`);
    return responder(401, { ok: false, erro: 'Assinatura inválida.' });
  }

  const evento = provedor.extrairEvento(corpo);
  if (evento === null) {
    console.warn(
      `[pagamento] webhook ${provedor.nome}: corpo assinado mas fora do formato esperado (${corpo.byteLength} bytes).`,
    );
    return responder(400, { ok: false, erro: 'Evento ilegível.' });
  }

  const hashDoCorpo = createHash('sha256').update(corpo).digest('hex');

  try {
    const resultado = await processarEventoDePagamento({
      provedor: provedor.nome,
      evento,
      hashDoCorpo,
    });
    console.info(
      `[pagamento] webhook ${provedor.nome}:${evento.externalId} ${evento.status} → ${resultado.tipo}.`,
    );
    return responder(200, { ok: true, resultado: resultado.tipo });
  } catch (erro: unknown) {
    const motivo = erro instanceof Error ? erro.message : 'erro desconhecido';
    console.error(`[pagamento] webhook ${provedor.nome}:${evento.externalId} falhou: ${motivo}`);
    return responder(500, { ok: false, erro: 'Falha ao processar o evento. Tente de novo.' });
  }
}
