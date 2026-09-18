/**
 * `POST /api/cron/limpeza` — a limpeza diária do banco, disparada pelo crontab
 * da VPS (`docs/DEPLOY.md`, seção "Limpeza diária").
 *
 * Contrato da rota:
 *
 * - `CRON_SECRET` ausente ou vazio → **503**, nada roda (a limpeza está
 *   desligada neste ambiente).
 * - `Authorization: Bearer <CRON_SECRET>` ausente ou errado → **401**, nada roda.
 * - Certo → **200** com `{ ok, sessoes, tokens, tentativas }` — quantas linhas
 *   saíram de cada tabela.
 * - Banco fora do ar → **500**, com o motivo técnico só no log do servidor.
 *
 * Só `POST`: um `GET` (link aberto no navegador, robô de pré-visualização) não
 * dispara efeito colateral — o Next responde 405 sozinho para método não
 * exportado. Handler que não é `GET` nunca entra em cache no Next 16; o
 * `Cache-Control: no-store` é para qualquer proxy no caminho.
 *
 * ⚠️ O `proxy.ts` não cobre `/api/` (ver o `matcher`), então esta rota não tem
 * sessão nem outra tranca além do segredo — que é comparado em tempo constante
 * em `src/lib/jobs/limpeza.ts`.
 */
import {
  cabecalhoDoCronConfere,
  executarLimpeza,
  lerSegredoDoCron,
} from '@/lib/jobs/limpeza';

const SEM_CACHE = { 'Cache-Control': 'no-store' } as const;

export async function POST(request: Request): Promise<Response> {
  const segredo = lerSegredoDoCron();
  if (segredo === null) {
    return Response.json(
      { ok: false, erro: 'Limpeza desligada neste ambiente.' },
      { status: 503, headers: SEM_CACHE },
    );
  }

  if (!cabecalhoDoCronConfere(request.headers.get('authorization'), segredo)) {
    return Response.json(
      { ok: false, erro: 'Não autorizado.' },
      { status: 401, headers: { ...SEM_CACHE, 'WWW-Authenticate': 'Bearer' } },
    );
  }

  const inicio = Date.now();
  try {
    const resultado = await executarLimpeza();
    // Só contagens no log: é o que o `docker logs` mostra para conferir que o
    // cron rodou (docs/DEPLOY.md).
    console.info(
      `[cron] limpeza ok: ${resultado.sessoes} sessão(ões), ${resultado.tokens} token(s), ` +
        `${resultado.tentativas} tentativa(s) de login em ${Date.now() - inicio} ms`,
    );
    return Response.json({ ok: true, ...resultado }, { status: 200, headers: SEM_CACHE });
  } catch (erro: unknown) {
    const motivo = erro instanceof Error ? erro.message : 'erro desconhecido';
    console.error(`[cron] limpeza falhou: ${motivo}`);
    return Response.json(
      { ok: false, erro: 'A limpeza falhou. Veja o log do servidor.' },
      { status: 500, headers: SEM_CACHE },
    );
  }
}
