/**
 * `POST /api/cron/limpeza` — o contrato da rota, chamando o handler direto com
 * um `Request`.
 *
 * ⚠️ As três podas (`cleanupExpiredSessions`, `cleanupExpiredTokens`,
 * `cleanupOldAttempts`) são trocadas por dublês: elas varrem a tabela inteira,
 * e o banco de teste é dividido com as outras frentes — rodar a limpeza de
 * verdade aqui apagaria fixtures vencidas de outros arquivos no meio dos
 * testes deles. O que se prova aqui é a tranca (503/401), o formato da
 * resposta, os prazos de retenção passados às podas e o 500 quando o banco
 * falha. A poda real é exercida no servidor de desenvolvimento.
 *
 * ⚠️ O setup dos testes carrega o `.env` (que pode ter um `CRON_SECRET` de
 * verdade): cada teste define o valor que quer, e o original volta no fim.
 */
import { afterAll, afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const podas = vi.hoisted(() => ({
  sessoes: vi.fn<() => Promise<number>>(),
  tokens: vi.fn<(dias?: number) => Promise<number>>(),
  tentativas: vi.fn<(dias?: number) => Promise<number>>(),
}));

vi.mock('@/lib/auth/session', () => ({ cleanupExpiredSessions: podas.sessoes }));
vi.mock('@/lib/auth/tokens', () => ({ cleanupExpiredTokens: podas.tokens }));
vi.mock('@/lib/auth/rate-limit', () => ({ cleanupOldAttempts: podas.tentativas }));

import { POST } from '@/app/api/cron/limpeza/route';
import {
  cabecalhoDoCronConfere,
  RETENCAO_DE_TENTATIVAS_DIAS,
  RETENCAO_DE_TOKENS_DIAS,
} from '@/lib/jobs/limpeza';

const SEGREDO_ORIGINAL = process.env.CRON_SECRET;
const SEGREDO = 'segredo-de-teste-do-cron-0123456789abcdef';

function chamar(cabecalhos: Record<string, string> = {}): Promise<Response> {
  return POST(
    new Request('http://localhost:3000/api/cron/limpeza', { method: 'POST', headers: cabecalhos }),
  );
}

beforeEach(() => {
  podas.sessoes.mockReset().mockResolvedValue(3);
  podas.tokens.mockReset().mockResolvedValue(2);
  podas.tentativas.mockReset().mockResolvedValue(41);
  process.env.CRON_SECRET = SEGREDO;
});

afterEach(() => {
  vi.restoreAllMocks();
});

afterAll(() => {
  if (SEGREDO_ORIGINAL === undefined) delete process.env.CRON_SECRET;
  else process.env.CRON_SECRET = SEGREDO_ORIGINAL;
});

function nenhumaPodaRodou(): void {
  expect(podas.sessoes).not.toHaveBeenCalled();
  expect(podas.tokens).not.toHaveBeenCalled();
  expect(podas.tentativas).not.toHaveBeenCalled();
}

describe('POST /api/cron/limpeza', () => {
  it('responde 503 e não roda nada quando CRON_SECRET não está definido', async () => {
    delete process.env.CRON_SECRET;

    const resposta = await chamar({ Authorization: `Bearer ${SEGREDO}` });

    expect(resposta.status).toBe(503);
    expect(await resposta.json()).toEqual({ ok: false, erro: 'Limpeza desligada neste ambiente.' });
    expect(resposta.headers.get('cache-control')).toBe('no-store');
    nenhumaPodaRodou();
  });

  it('trata CRON_SECRET vazio ou só com espaços como ausente (503)', async () => {
    process.env.CRON_SECRET = '   ';
    expect((await chamar({ Authorization: 'Bearer    ' })).status).toBe(503);
    process.env.CRON_SECRET = '';
    expect((await chamar({ Authorization: 'Bearer ' })).status).toBe(503);
    nenhumaPodaRodou();
  });

  it('responde 401 sem o cabeçalho Authorization', async () => {
    const resposta = await chamar();

    expect(resposta.status).toBe(401);
    expect(await resposta.json()).toEqual({ ok: false, erro: 'Não autorizado.' });
    expect(resposta.headers.get('www-authenticate')).toBe('Bearer');
    expect(resposta.headers.get('cache-control')).toBe('no-store');
    nenhumaPodaRodou();
  });

  it('responde 401 com segredo errado, esquema errado ou token vazio', async () => {
    const tentativas = [
      'Bearer errado',
      `Bearer ${SEGREDO}x`,
      `Bearer ${SEGREDO.slice(0, -1)}`,
      `Basic ${SEGREDO}`,
      SEGREDO,
      'Bearer',
      'Bearer    ',
    ];

    for (const cabecalho of tentativas) {
      const resposta = await chamar({ Authorization: cabecalho });
      expect(resposta.status, cabecalho.replace(SEGREDO, '<segredo>')).toBe(401);
    }
    nenhumaPodaRodou();
  });

  it('com o segredo certo, roda as três podas e devolve as contagens (200)', async () => {
    const info = vi.spyOn(console, 'info').mockImplementation(() => {});

    const resposta = await chamar({ Authorization: `Bearer ${SEGREDO}` });

    expect(resposta.status).toBe(200);
    expect(resposta.headers.get('cache-control')).toBe('no-store');
    const corpo = (await resposta.json()) as Record<string, unknown>;
    expect(corpo).toEqual({ ok: true, sessoes: 3, tokens: 2, tentativas: 41 });
    expect(typeof corpo.sessoes).toBe('number');

    expect(podas.sessoes).toHaveBeenCalledTimes(1);
    expect(podas.tokens).toHaveBeenCalledWith(RETENCAO_DE_TOKENS_DIAS);
    expect(podas.tentativas).toHaveBeenCalledWith(RETENCAO_DE_TENTATIVAS_DIAS);
    expect(RETENCAO_DE_TOKENS_DIAS).toBe(7);
    expect(RETENCAO_DE_TENTATIVAS_DIAS).toBe(30);

    // O log leva só as contagens — nunca o segredo.
    expect(info).toHaveBeenCalledTimes(1);
    const linha = String(info.mock.calls[0]?.[0]);
    expect(linha).toContain('[cron] limpeza ok');
    expect(linha).not.toContain(SEGREDO);
  });

  it('aceita o esquema sem diferenciar maiúsculas e espaço sobrando no segredo configurado', async () => {
    vi.spyOn(console, 'info').mockImplementation(() => {});
    process.env.CRON_SECRET = `  ${SEGREDO}\n`;

    expect((await chamar({ Authorization: `bearer ${SEGREDO}` })).status).toBe(200);
    expect((await chamar({ Authorization: `BEARER   ${SEGREDO}` })).status).toBe(200);
  });

  it('responde 500 sem vazar o motivo quando o banco falha', async () => {
    const erro = vi.spyOn(console, 'error').mockImplementation(() => {});
    podas.tokens.mockRejectedValueOnce(new Error('conexão recusada'));

    const resposta = await chamar({ Authorization: `Bearer ${SEGREDO}` });

    expect(resposta.status).toBe(500);
    expect(await resposta.json()).toEqual({
      ok: false,
      erro: 'A limpeza falhou. Veja o log do servidor.',
    });
    expect(String(erro.mock.calls[0]?.[0])).toContain('conexão recusada');
  });
});

describe('cabecalhoDoCronConfere', () => {
  it('só confere com Bearer e o segredo exato', () => {
    expect(cabecalhoDoCronConfere(`Bearer ${SEGREDO}`, SEGREDO)).toBe(true);
    expect(cabecalhoDoCronConfere(null, SEGREDO)).toBe(false);
    expect(cabecalhoDoCronConfere('', SEGREDO)).toBe(false);
    expect(cabecalhoDoCronConfere(`Bearer ${SEGREDO}`, '')).toBe(false);
    expect(cabecalhoDoCronConfere(`Token ${SEGREDO}`, SEGREDO)).toBe(false);
  });
});
