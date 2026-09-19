/**
 * Núcleo de sessão (contrato §5.2 e §5.3) contra o banco de teste.
 *
 * `next/headers`, `next/navigation` e `next/server` são trocados por dublês em
 * memória: um pote de cookies, cabeçalhos da requisição, um `redirect` que lança
 * com a URL e um `after` que só enfileira a tarefa. O resto — hash, prazo,
 * consulta ao banco — é o código de verdade.
 *
 * Fixtures: usuários `a1ss-<aleatório>@teste.local`, apagados no `afterAll`
 * (sessões saem junto, por cascata).
 */
import { randomBytes } from 'node:crypto';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

const dubles = vi.hoisted(() => {
  type Opcoes = Record<string, unknown>;

  class RedirecionamentoDeTeste extends Error {
    constructor(public readonly url: string) {
      super(`NEXT_REDIRECT ${url}`);
    }
  }

  return {
    RedirecionamentoDeTeste,
    /** O pote de cookies da requisição (o que o navegador mandou + o que a resposta escreveu). */
    cookies: new Map<string, { value: string; opcoes?: Opcoes }>(),
    cabecalhos: new Headers(),
    /** Tarefas entregues ao `after()`. */
    tarefas: [] as Array<() => unknown>,
    /** Simula chamada fora do ciclo de requisição, onde `after()` lança. */
    afterLanca: false,
  };
});

vi.mock('next/headers', () => ({
  cookies: async () => ({
    get: (nome: string) => {
      const cookie = dubles.cookies.get(nome);
      return cookie ? { name: nome, value: cookie.value } : undefined;
    },
    set: (nome: string, value: string, opcoes?: Record<string, unknown>) => {
      dubles.cookies.set(nome, { value, opcoes });
    },
    delete: (nome: string) => {
      dubles.cookies.delete(nome);
    },
  }),
  headers: async () => dubles.cabecalhos,
}));

vi.mock('next/navigation', () => ({
  redirect: (url: string) => {
    throw new dubles.RedirecionamentoDeTeste(url);
  },
}));

vi.mock('next/server', () => ({
  after: (tarefa: () => unknown) => {
    if (dubles.afterLanca) throw new Error('after() fora de uma requisição');
    dubles.tarefas.push(tarefa);
  },
}));

import { hashToken, generateToken } from '@/lib/auth/tokens';
import {
  DURACAO_LEMBRAR_MS,
  DURACAO_PADRAO_MS,
  INTERVALO_LAST_SEEN_MS,
  NOME_COOKIE_SESSAO,
  createSession,
  destroyAllSessions,
  destroyCurrentSession,
  destroyOtherSessions,
  getCurrentUser,
  requireUser,
} from '@/lib/auth/session';
import { prisma } from '@/lib/db';

const PREFIXO = `a1ss-${randomBytes(4).toString('hex')}`;
const EMAIL = `${PREFIXO}@teste.local`;
const EMAIL_OUTRO = `${PREFIXO}-outro@teste.local`;
const USER_AGENT = 'Mozilla/5.0 (Teste A1)';

let userId = '';
let outroUserId = '';

/** Cria uma sessão direto no banco e devolve o token cru. */
async function sessaoNoBanco(
  dono: string,
  { expiraEmMs = DURACAO_PADRAO_MS, vistaHaMs = 0 }: { expiraEmMs?: number; vistaHaMs?: number } = {},
): Promise<string> {
  const raw = generateToken();
  await prisma.session.create({
    data: {
      tokenHash: hashToken(raw),
      userId: dono,
      expiresAt: new Date(Date.now() + expiraEmMs),
      lastSeenAt: new Date(Date.now() - vistaHaMs),
    },
  });
  return raw;
}

/** O navegador manda este cookie na requisição. */
function comCookie(valor: string): void {
  dubles.cookies.set(NOME_COOKIE_SESSAO, { value: valor });
}

/** Roda `fn` esperando um `redirect()` e devolve a URL do redirecionamento. */
async function urlDoRedirect(fn: () => Promise<unknown>): Promise<URL> {
  try {
    await fn();
  } catch (erro: unknown) {
    if (erro instanceof dubles.RedirecionamentoDeTeste) return new URL(erro.url, 'https://app.invalid');
    throw erro;
  }
  throw new Error('esperava um redirect() e a função retornou normalmente');
}

beforeAll(async () => {
  const usuario = await prisma.user.create({
    data: { name: 'Fixture Sessão', email: EMAIL, passwordHash: 'fixture-sem-senha', plan: 'PREMIUM' },
  });
  userId = usuario.id;
  const outro = await prisma.user.create({
    data: { name: 'Fixture Sessão 2', email: EMAIL_OUTRO, passwordHash: 'fixture-sem-senha' },
  });
  outroUserId = outro.id;
});

beforeEach(() => {
  dubles.cookies.clear();
  dubles.cabecalhos = new Headers({
    'user-agent': USER_AGENT,
    'x-forwarded-for': '203.0.113.7, 10.0.0.1',
  });
  dubles.tarefas = [];
  dubles.afterLanca = false;
});

afterEach(() => {
  vi.unstubAllEnvs();
});

afterAll(async () => {
  await prisma.user.deleteMany({ where: { email: { in: [EMAIL, EMAIL_OUTRO] } } });
});

describe('createSession', () => {
  it('sem "lembrar-me": cookie de sessão (sem maxAge) e 1 dia no banco', async () => {
    const antes = Date.now();
    await createSession(userId, false);

    const cookie = dubles.cookies.get(NOME_COOKIE_SESSAO);
    expect(cookie?.value).toMatch(/^[A-Za-z0-9_-]{43}$/);
    expect(cookie?.opcoes).toEqual({ httpOnly: true, sameSite: 'lax', path: '/', secure: false });
    expect(cookie?.opcoes).not.toHaveProperty('maxAge');
    expect(cookie?.opcoes).not.toHaveProperty('expires');

    const linha = await prisma.session.findUniqueOrThrow({ where: { tokenHash: hashToken(cookie!.value) } });
    expect(linha.userId).toBe(userId);
    expect(linha.remember).toBe(false);
    expect(linha.userAgent).toBe(USER_AGENT);
    expect(linha.ip).toBe('203.0.113.7');
    const prazo = linha.expiresAt.getTime() - antes;
    expect(prazo).toBeGreaterThan(DURACAO_PADRAO_MS - 5_000);
    expect(prazo).toBeLessThanOrEqual(DURACAO_PADRAO_MS + 5_000);
  });

  it('com "lembrar-me": cookie persistente de 30 dias e 30 dias no banco', async () => {
    const antes = Date.now();
    await createSession(userId, true);

    const cookie = dubles.cookies.get(NOME_COOKIE_SESSAO);
    expect(cookie?.opcoes).toMatchObject({ httpOnly: true, sameSite: 'lax', path: '/', maxAge: 30 * 24 * 60 * 60 });
    expect(DURACAO_LEMBRAR_MS).toBe(30 * 24 * 60 * 60 * 1000);

    const linha = await prisma.session.findUniqueOrThrow({ where: { tokenHash: hashToken(cookie!.value) } });
    expect(linha.remember).toBe(true);
    const prazo = linha.expiresAt.getTime() - antes;
    expect(prazo).toBeGreaterThan(DURACAO_LEMBRAR_MS - 5_000);
    expect(prazo).toBeLessThanOrEqual(DURACAO_LEMBRAR_MS + 5_000);
  });

  it('o banco guarda só o hash do token', async () => {
    await createSession(userId, false);
    const raw = dubles.cookies.get(NOME_COOKIE_SESSAO)!.value;
    expect(await prisma.session.count({ where: { tokenHash: raw } })).toBe(0);
    expect(await prisma.session.count({ where: { tokenHash: hashToken(raw) } })).toBe(1);
  });

  it('em produção o cookie é secure', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    await createSession(userId, false);
    expect(dubles.cookies.get(NOME_COOKIE_SESSAO)?.opcoes).toMatchObject({ secure: true });
  });

  it('User-Agent gigante é aparado em 512 caracteres; sem IP vira "desconhecido"', async () => {
    dubles.cabecalhos = new Headers({ 'user-agent': 'x'.repeat(5_000) });
    await createSession(userId, false);
    const raw = dubles.cookies.get(NOME_COOKIE_SESSAO)!.value;
    const linha = await prisma.session.findUniqueOrThrow({ where: { tokenHash: hashToken(raw) } });
    expect(linha.userAgent).toHaveLength(512);
    expect(linha.ip).toBe('desconhecido');
  });
});

describe('getCurrentUser — a validade é conferida no servidor', () => {
  it('sessão válida devolve o usuário, sem passwordHash', async () => {
    comCookie(await sessaoNoBanco(userId));
    const usuario = await getCurrentUser();
    expect(usuario).toEqual({
      id: userId,
      name: 'Fixture Sessão',
      email: EMAIL,
      photoUrl: null,
      role: 'STUDENT',
      plan: 'PREMIUM',
      emailVerifiedAt: null,
    });
    expect(usuario).not.toHaveProperty('passwordHash');
  });

  it('sem cookie → null', async () => {
    expect(await getCurrentUser()).toBeNull();
  });

  it.each([
    ['vazio', ''],
    ['curto', 'abc'],
    ['com caractere inválido', `${'a'.repeat(42)}+`],
    ['o hash guardado no banco', 'f'.repeat(64)],
  ])('cookie malformado (%s) → null', async (_rotulo, valor) => {
    comCookie(valor);
    expect(await getCurrentUser()).toBeNull();
  });

  it('token bem formado que não existe no banco → null', async () => {
    comCookie(generateToken());
    expect(await getCurrentUser()).toBeNull();
  });

  it('sessão vencida → null, mesmo com o cookie ainda no navegador', async () => {
    comCookie(await sessaoNoBanco(userId, { expiraEmMs: -1_000 }));
    expect(await getCurrentUser()).toBeNull();
  });

  it('sessão que vence agora → null', async () => {
    const raw = await sessaoNoBanco(userId);
    await prisma.session.update({ where: { tokenHash: hashToken(raw) }, data: { expiresAt: new Date() } });
    comCookie(raw);
    expect(await getCurrentUser()).toBeNull();
  });

  it('sessão revogada (linha apagada) → null', async () => {
    const raw = await sessaoNoBanco(userId);
    comCookie(raw);
    expect(await getCurrentUser()).not.toBeNull();
    await prisma.session.delete({ where: { tokenHash: hashToken(raw) } });
    expect(await getCurrentUser()).toBeNull();
  });

  it('lastSeenAt recente: nenhum UPDATE agendado', async () => {
    comCookie(await sessaoNoBanco(userId, { vistaHaMs: 60_000 }));
    await getCurrentUser();
    expect(dubles.tarefas).toHaveLength(0);
  });

  it('lastSeenAt com 15+ minutos: o UPDATE vai para o after()', async () => {
    const raw = await sessaoNoBanco(userId, { vistaHaMs: INTERVALO_LAST_SEEN_MS + 60_000 });
    comCookie(raw);
    const antes = Date.now();

    expect(await getCurrentUser()).not.toBeNull();
    expect(dubles.tarefas).toHaveLength(1);

    // Antes de a resposta sair, nada foi escrito.
    const ainda = await prisma.session.findUniqueOrThrow({ where: { tokenHash: hashToken(raw) } });
    expect(ainda.lastSeenAt.getTime()).toBeLessThan(antes - INTERVALO_LAST_SEEN_MS);

    await dubles.tarefas[0]();
    const depois = await prisma.session.findUniqueOrThrow({ where: { tokenHash: hashToken(raw) } });
    expect(depois.lastSeenAt.getTime()).toBeGreaterThanOrEqual(antes - 1_000);
  });

  it('fora de uma requisição (after() lança), o carimbo ainda é gravado e nada quebra', async () => {
    dubles.afterLanca = true;
    const raw = await sessaoNoBanco(userId, { vistaHaMs: INTERVALO_LAST_SEEN_MS + 60_000 });
    comCookie(raw);
    const antes = Date.now();

    expect(await getCurrentUser()).not.toBeNull();
    await vi.waitFor(async () => {
      const linha = await prisma.session.findUniqueOrThrow({ where: { tokenHash: hashToken(raw) } });
      expect(linha.lastSeenAt.getTime()).toBeGreaterThanOrEqual(antes - 1_000);
    });
  });
});

describe('requireUser', () => {
  it('com sessão válida devolve o usuário', async () => {
    comCookie(await sessaoNoBanco(userId));
    expect((await requireUser()).id).toBe(userId);
  });

  it('visitante sem cookie vai para /entrar com a origem no ?next=', async () => {
    dubles.cabecalhos.set('x-iea-caminho', '/aula/subject-pronouns?pagina=3');
    const url = await urlDoRedirect(() => requireUser());
    expect(url.pathname).toBe('/entrar');
    expect(url.searchParams.get('next')).toBe('/aula/subject-pronouns?pagina=3');
    expect(url.searchParams.has('sessao')).toBe(false);
  });

  it('cookie presente mas sessão vencida → marca sessao=expirada (evita o laço com o proxy)', async () => {
    comCookie(await sessaoNoBanco(userId, { expiraEmMs: -1_000 }));
    dubles.cabecalhos.set('x-iea-caminho', '/perfil');
    const url = await urlDoRedirect(() => requireUser());
    expect(url.pathname).toBe('/entrar');
    expect(url.searchParams.get('next')).toBe('/perfil');
    expect(url.searchParams.get('sessao')).toBe('expirada');
  });

  it('cabeçalho de origem forjado nunca vira destino externo', async () => {
    dubles.cabecalhos.set('x-iea-caminho', 'https://evil.com/entrar');
    const url = await urlDoRedirect(() => requireUser());
    expect(url.origin).toBe('https://app.invalid');
    expect(url.pathname).toBe('/entrar');
    expect(url.searchParams.has('next')).toBe(false);
  });

  it('sem cabeçalho de origem, o login não leva ?next=', async () => {
    const url = await urlDoRedirect(() => requireUser());
    expect(`${url.pathname}${url.search}`).toBe('/entrar');
  });
});

describe('encerrar sessões', () => {
  it('destroyCurrentSession apaga a linha e sobrescreve o cookie com prazo no passado', async () => {
    const raw = await sessaoNoBanco(userId);
    comCookie(raw);
    await destroyCurrentSession();

    expect(await prisma.session.count({ where: { tokenHash: hashToken(raw) } })).toBe(0);
    const cookie = dubles.cookies.get(NOME_COOKIE_SESSAO);
    expect(cookie?.value).toBe('');
    expect(cookie?.opcoes).toMatchObject({ httpOnly: true, path: '/', maxAge: 0 });
    expect((cookie?.opcoes?.expires as Date).getTime()).toBe(0);
    expect(await getCurrentUser()).toBeNull();
  });

  it('destroyCurrentSession sem cookie não lança e ainda limpa o cookie', async () => {
    await expect(destroyCurrentSession()).resolves.toBeUndefined();
    expect(dubles.cookies.get(NOME_COOKIE_SESSAO)?.value).toBe('');
  });

  it('destroyOtherSessions mantém a atual, derruba as outras do usuário e não toca nas de outra pessoa', async () => {
    await prisma.session.deleteMany({ where: { userId: { in: [userId, outroUserId] } } });
    const atual = await sessaoNoBanco(userId);
    const celular = await sessaoNoBanco(userId);
    const tablet = await sessaoNoBanco(userId);
    const deOutro = await sessaoNoBanco(outroUserId);
    comCookie(atual);

    await destroyOtherSessions(userId);

    const restantes = await prisma.session.findMany({ where: { userId }, select: { tokenHash: true } });
    expect(restantes.map((linha) => linha.tokenHash)).toEqual([hashToken(atual)]);
    expect(await prisma.session.count({ where: { tokenHash: { in: [hashToken(celular), hashToken(tablet)] } } })).toBe(0);
    expect(await prisma.session.count({ where: { tokenHash: hashToken(deOutro) } })).toBe(1);
  });

  it('destroyOtherSessions sem cookie válido derruba todas as do usuário', async () => {
    await sessaoNoBanco(userId);
    await sessaoNoBanco(userId);
    comCookie('lixo');
    await destroyOtherSessions(userId);
    expect(await prisma.session.count({ where: { userId } })).toBe(0);
  });

  it('destroyAllSessions derruba todas, inclusive a atual, e só do usuário', async () => {
    const atual = await sessaoNoBanco(userId);
    await sessaoNoBanco(userId);
    const deOutro = await sessaoNoBanco(outroUserId);
    comCookie(atual);

    await destroyAllSessions(userId);

    expect(await prisma.session.count({ where: { userId } })).toBe(0);
    expect(await prisma.session.count({ where: { tokenHash: hashToken(deOutro) } })).toBe(1);
    expect(await getCurrentUser()).toBeNull();
  });
});
