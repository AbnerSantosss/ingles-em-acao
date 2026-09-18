/**
 * `safeNext` e `urlDeLogin` — a defesa contra open redirect (contrato §5.7).
 *
 * A regra é lista de permissão: só passa caminho interno comprovado. Cada caso
 * recusado abaixo é uma variante real de ataque; todos precisam cair no destino
 * padrão (ou no `fallback`), nunca num endereço de fora.
 */
import { describe, expect, it } from 'vitest';

import {
  DESTINO_PADRAO,
  PARAM_SESSAO,
  VALOR_SESSAO_EXPIRADA,
  safeNext,
  urlDeLogin,
} from '@/lib/auth/next-url';

describe('safeNext — caminhos internos aceitos', () => {
  it.each([
    ['/aula/subject-pronouns', '/aula/subject-pronouns'],
    ['/trilha?modulo=2', '/trilha?modulo=2'],
    ['/perfil#sessoes', '/perfil#sessoes'],
    ['/', '/'],
    ['/inicio', '/inicio'],
    // O analisador de URL resolve os pontos: o resultado continua interno.
    ['/a/../perfil', '/perfil'],
    // Rota de autenticação só é recusada quando é ela mesma, não um prefixo.
    ['/entrarx', '/entrarx'],
  ])('%s → %s', (entrada, esperado) => {
    expect(safeNext(entrada)).toBe(esperado);
  });

  it('o destino padrão é /inicio', () => {
    expect(DESTINO_PADRAO).toBe('/inicio');
  });
});

describe('safeNext — tentativas de sair do app caem no destino padrão', () => {
  it.each([
    ['URL absoluta https', 'https://evil.com'],
    ['URL absoluta http', 'http://evil.com/entrar'],
    ['relativa a protocolo', '//evil.com'],
    ['três barras', '///evil.com'],
    ['barra + contrabarra', '/\\evil.com'],
    ['duas contrabarras', '\\\\evil.com'],
    ['barra, contrabarra, barra', '/\\/evil.com'],
    ['javascript:', 'javascript:alert(1)'],
    ['JavaScript: com maiúsculas', 'JaVaScRiPt:alert(1)'],
    ['data:', 'data:text/html,<script>alert(1)</script>'],
    ['domínio sem esquema', 'evil.com'],
    ['caminho relativo', 'perfil'],
    ['tab que o navegador remove', '/\t/evil.com'],
    ['quebra de linha que o navegador remove', '/\n/evil.com'],
    ['CRLF (injeção de cabeçalho)', '/inicio\r\nSet-Cookie: x=1'],
    ['espaço na frente', ' /inicio'],
    ['DEL (0x7F)', '/inicio'],
    ['vazio', ''],
  ])('%s', (_rotulo, entrada) => {
    expect(safeNext(entrada)).toBe(DESTINO_PADRAO);
  });

  it('valor maior que 2048 caracteres', () => {
    expect(safeNext(`/${'a'.repeat(2048)}`)).toBe(DESTINO_PADRAO);
    // No limite ainda passa.
    const noLimite = `/${'a'.repeat(2047)}`;
    expect(safeNext(noLimite)).toBe(noLimite);
  });

  it.each([null, undefined])('%s', (entrada) => {
    expect(safeNext(entrada)).toBe(DESTINO_PADRAO);
  });

  it('tipos que não são texto (query string manipulada)', () => {
    expect(safeNext(42 as unknown as string)).toBe(DESTINO_PADRAO);
    expect(safeNext(['/perfil'] as unknown as string)).toBe(DESTINO_PADRAO);
    expect(safeNext({ toString: () => '/perfil' } as unknown as string)).toBe(DESTINO_PADRAO);
  });
});

describe('safeNext — não devolve o usuário para a porta de entrada', () => {
  it.each([
    '/entrar',
    '/entrar/',
    '/entrar?next=/perfil',
    '/criar-conta',
    '/esqueci-senha',
    '/redefinir-senha',
    '/verificar-email',
  ])('%s', (entrada) => {
    expect(safeNext(entrada)).toBe(DESTINO_PADRAO);
  });
});

describe('safeNext — fallback', () => {
  it('usa o fallback quando o valor não presta', () => {
    expect(safeNext('https://evil.com', '/perfil')).toBe('/perfil');
    expect(safeNext(null, '/trilha')).toBe('/trilha');
  });

  it('um fallback que também não presta cai em /inicio', () => {
    expect(safeNext('//evil.com', '//evil2.com')).toBe(DESTINO_PADRAO);
    expect(safeNext(null, '/entrar')).toBe(DESTINO_PADRAO);
  });

  it('valor válido ganha do fallback', () => {
    expect(safeNext('/progresso', '/perfil')).toBe('/progresso');
  });
});

describe('urlDeLogin', () => {
  it('sem origem, ou com a origem igual ao destino padrão, não suja a URL', () => {
    expect(urlDeLogin()).toBe('/entrar');
    expect(urlDeLogin(null)).toBe('/entrar');
    expect(urlDeLogin('/inicio')).toBe('/entrar');
  });

  it('preserva a origem interna no ?next=', () => {
    const url = new URL(urlDeLogin('/aula/subject-pronouns?pagina=3'), 'https://x.invalid');
    expect(url.pathname).toBe('/entrar');
    expect(url.searchParams.get('next')).toBe('/aula/subject-pronouns?pagina=3');
  });

  it('origem forjada (cabeçalho do cliente) nunca vira destino externo', () => {
    expect(urlDeLogin('https://evil.com')).toBe('/entrar');
    expect(urlDeLogin('//evil.com')).toBe('/entrar');
  });

  it('acrescenta a marca de sessão expirada', () => {
    const url = new URL(
      urlDeLogin('/perfil', { [PARAM_SESSAO]: VALOR_SESSAO_EXPIRADA }),
      'https://x.invalid',
    );
    expect(url.searchParams.get('next')).toBe('/perfil');
    expect(url.searchParams.get('sessao')).toBe('expirada');
    expect(urlDeLogin(null, { sessao: 'expirada' })).toBe('/entrar?sessao=expirada');
  });
});
