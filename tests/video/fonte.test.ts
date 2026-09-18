/**
 * Fonte de vídeo — a allowlist do servidor (BACKOFFICE §2.6, D6).
 *
 * O que sai de `parseVideoSource` vai para um `<iframe>` na sessão do aluno.
 * Os casos recusados abaixo são as variantes de host "parecido" que uma regex
 * permissiva deixaria passar; nenhum deles pode virar embed.
 */
import { describe, expect, it } from 'vitest';

import { planoVeVideoaula } from '@/lib/video/acesso';
import { CSP_DE_VIDEO, ORIGENS_DE_EMBED } from '@/lib/video/csp';
import {
  HOSTS_ACEITOS,
  ORIGENS_LIBERADAS,
  descreverFonte,
  ehErroDeFonte,
  fonteDaLinha,
  linkPublico,
  montarReproducao,
  parseVideoSource,
  refDaFonte,
  rotuloDaOrigem,
  tipoDaFonte,
  type VideoSource,
} from '@/lib/video/fonte';

const ID = 'dQw4w9WgXcQ';

/** Atalho: o parser tem de aceitar e devolver exatamente `esperado`. */
function aceita(entrada: string): VideoSource {
  const resultado = parseVideoSource(entrada);
  if (ehErroDeFonte(resultado)) throw new Error(`recusou "${entrada}": ${resultado.erro}`);
  return resultado;
}

describe('parseVideoSource — formatos aceitos', () => {
  it.each<[string, VideoSource]>([
    [`https://www.youtube.com/watch?v=${ID}`, { kind: 'youtube', id: ID }],
    [`https://youtube.com/watch?v=${ID}&t=42`, { kind: 'youtube', id: ID, start: 42 }],
    [`https://m.youtube.com/watch?v=${ID}`, { kind: 'youtube', id: ID }],
    [`https://youtu.be/${ID}?t=1m30s`, { kind: 'youtube', id: ID, start: 90 }],
    [`https://www.youtube.com/shorts/${ID}`, { kind: 'youtube', id: ID }],
    [`https://www.youtube-nocookie.com/embed/${ID}?start=1h02m03s`, { kind: 'youtube', id: ID, start: 3723 }],
    [`https://www.youtube.com/?v=${ID}`, { kind: 'youtube', id: ID }],
    [`https://WWW.YOUTUBE.COM/watch?v=${ID}`, { kind: 'youtube', id: ID }],
    // Sem esquema, só para os hosts conhecidos.
    [`youtu.be/${ID}`, { kind: 'youtube', id: ID }],
    [`www.youtube.com/watch?v=${ID}`, { kind: 'youtube', id: ID }],
    // Espaço em volta do que foi colado.
    [`  https://youtu.be/${ID}  `, { kind: 'youtube', id: ID }],
    ['https://vimeo.com/123456789', { kind: 'vimeo', id: '123456789' }],
    ['https://vimeo.com/123456789/a1b2c3d4e5', { kind: 'vimeo', id: '123456789', hash: 'a1b2c3d4e5' }],
    ['https://player.vimeo.com/video/123456789?h=a1b2c3', { kind: 'vimeo', id: '123456789', hash: 'a1b2c3' }],
    ['https://vimeo.com/channels/staffpicks/123456789', { kind: 'vimeo', id: '123456789' }],
    ['https://cdn.exemplo.com/aulas/aula01.mp4', { kind: 'url', url: 'https://cdn.exemplo.com/aulas/aula01.mp4' }],
    ['https://cdn.exemplo.com/aulas/AULA01.WEBM', { kind: 'url', url: 'https://cdn.exemplo.com/aulas/AULA01.WEBM' }],
  ])('%s', (entrada, esperado) => {
    expect(aceita(entrada)).toEqual(esperado);
  });

  it('do <iframe> colado usa só o src (e desfaz o &amp;)', () => {
    const html =
      `<iframe width="560" height="315" src="https://www.youtube.com/embed/${ID}?si=abc&amp;start=10" ` +
      'title="YouTube video player" frameborder="0" allowfullscreen></iframe>';
    expect(aceita(html)).toEqual({ kind: 'youtube', id: ID, start: 10 });

    expect(aceita('<iframe src="https://player.vimeo.com/video/123456789"></iframe>')).toEqual({
      kind: 'vimeo',
      id: '123456789',
    });
  });

  it('início (t/start): zero ou lixo somem, e o teto é 24h', () => {
    expect(aceita(`https://youtu.be/${ID}?t=0`)).toEqual({ kind: 'youtube', id: ID });
    expect(aceita(`https://youtu.be/${ID}?t=abc`)).toEqual({ kind: 'youtube', id: ID });
    expect(aceita(`https://youtu.be/${ID}?t=999999`)).toEqual({ kind: 'youtube', id: ID, start: 86_400 });
  });

  it('hash do Vimeo fora do formato é descartado, o vídeo não', () => {
    expect(aceita('https://player.vimeo.com/video/123456789?h=ab')).toEqual({ kind: 'vimeo', id: '123456789' });
    expect(aceita('https://player.vimeo.com/video/123456789?h=a%22b%3Cc')).toEqual({ kind: 'vimeo', id: '123456789' });
  });
});

describe('parseVideoSource — tudo o que não está na allowlist é recusado', () => {
  it.each([
    ['http (sem TLS)', `http://www.youtube.com/watch?v=${ID}`],
    ['host que termina em outro domínio', `https://youtube.com.evil.com/watch?v=${ID}`],
    ['host que contém o nome', `https://evilyoutube.com/watch?v=${ID}`],
    ['subdomínio do atacante', `https://youtube.evil.com/watch?v=${ID}`],
    ['subdomínio do YouTube fora da lista', `https://music.youtube.com/watch?v=${ID}`],
    ['ponto final no host', `https://youtube.com./watch?v=${ID}`],
    ['host como usuário (youtube.com@evil.com)', `https://youtube.com@evil.com/watch?v=${ID}`],
    ['credenciais embutidas', `https://user:senha@www.youtube.com/watch?v=${ID}`],
    ['www duplicado', `https://www.www.youtube.com/watch?v=${ID}`],
    ['Vimeo com sufixo', 'https://vimeo.com.evil.com/123456789'],
    ['Vimeo com prefixo', 'https://evilvimeo.com/123456789'],
    ['link do YouTube escondido na query de outro host', `https://evil.com/?u=https://www.youtube.com/watch?v=${ID}`],
    ['javascript:', 'javascript:alert(1)'],
    ['data:', 'data:text/html,<b>oi</b>'],
    ['ftp:', 'ftp://cdn.exemplo.com/aula.mp4'],
    ['<script>', '<script>alert(1)</script>'],
    ['HTML que não é iframe', `<a href="https://youtu.be/${ID}">vídeo</a>`],
    ['iframe de outro host', '<iframe src="https://evil.com/embed/x"></iframe>'],
    ['iframe com javascript:', '<iframe src="javascript:alert(1)"></iframe>'],
    ['iframe sem src', '<iframe width="560"></iframe>'],
    ['id do YouTube curto', 'https://www.youtube.com/watch?v=curto'],
    ['id do YouTube com aspas (tentativa de sair do atributo)', `https://www.youtube.com/watch?v=${ID}" onload="x`],
    ['YouTube sem id', 'https://www.youtube.com/channel/UC1234567890'],
    ['Vimeo sem número', 'https://vimeo.com/abc'],
    ['player do Vimeo com id que não é número', 'https://player.vimeo.com/video/abc'],
    ['arquivo com extensão disfarçada', 'https://evil.com/video.mp4.html'],
    ['arquivo por http', 'http://cdn.exemplo.com/aula.mp4'],
    ['texto solto', 'meu vídeo da aula'],
    ['vazio', ''],
    ['só espaço', '   '],
  ])('%s', (_rotulo, entrada) => {
    const resultado = parseVideoSource(entrada);
    expect(ehErroDeFonte(resultado)).toBe(true);
    if (ehErroDeFonte(resultado)) expect(resultado.erro.length).toBeGreaterThan(0);
  });

  it('texto acima de 2000 caracteres', () => {
    const longo = `https://www.youtube.com/watch?v=${ID}&x=${'a'.repeat(2000)}`;
    expect(ehErroDeFonte(parseVideoSource(longo))).toBe(true);
  });

  it('entrada que não é texto não derruba o parser', () => {
    expect(ehErroDeFonte(parseVideoSource(undefined as unknown as string))).toBe(true);
    expect(ehErroDeFonte(parseVideoSource(42 as unknown as string))).toBe(true);
  });
});

describe('montarReproducao — o que vai para o player', () => {
  it('YouTube sai sempre por youtube-nocookie, com rel=0', () => {
    expect(montarReproducao({ kind: 'youtube', id: ID, start: 42 })).toEqual({
      modo: 'iframe',
      src: `https://www.youtube-nocookie.com/embed/${ID}?rel=0&modestbranding=1&playsinline=1&start=42`,
      origem: 'https://www.youtube-nocookie.com',
    });
    expect(montarReproducao({ kind: 'youtube', id: ID })).toEqual({
      modo: 'iframe',
      src: `https://www.youtube-nocookie.com/embed/${ID}?rel=0&modestbranding=1&playsinline=1`,
      origem: 'https://www.youtube-nocookie.com',
    });
  });

  it('Vimeo sai pelo player com dnt=1 e o hash quando há', () => {
    expect(montarReproducao({ kind: 'vimeo', id: '123456789', hash: 'a1b2c3' })).toEqual({
      modo: 'iframe',
      src: 'https://player.vimeo.com/video/123456789?dnt=1&h=a1b2c3',
      origem: 'https://player.vimeo.com',
    });
  });

  it('arquivo vai para <video>, nunca para <iframe>; upload não tem endereço aqui', () => {
    expect(montarReproducao({ kind: 'url', url: 'https://cdn.exemplo.com/a.mp4' })).toEqual({
      modo: 'arquivo',
      src: 'https://cdn.exemplo.com/a.mp4',
    });
    expect(montarReproducao({ kind: 'upload', assetId: 'clx1234567890' })).toBeNull();
  });

  it('todo iframe montado a partir de uma entrada aceita está no frame-src', () => {
    const entradas = [
      `https://www.youtube.com/watch?v=${ID}`,
      `https://youtu.be/${ID}?t=5`,
      `<iframe src="https://www.youtube.com/embed/${ID}"></iframe>`,
      'https://vimeo.com/123456789/a1b2c3d4e5',
      'https://player.vimeo.com/video/123456789',
    ];
    for (const entrada of entradas) {
      const reproducao = montarReproducao(aceita(entrada));
      expect(reproducao?.modo).toBe('iframe');
      if (reproducao?.modo !== 'iframe') continue;
      expect(ORIGENS_DE_EMBED as readonly string[]).toContain(reproducao.origem);
      expect(new URL(reproducao.src).origin).toBe(reproducao.origem);
      expect(CSP_DE_VIDEO).toContain(reproducao.origem);
    }
  });
});

describe('fonteDaLinha — a volta do banco revalida tudo', () => {
  it.each<[string | null, string | null, string | null, VideoSource | null]>([
    ['YOUTUBE', ID, null, { kind: 'youtube', id: ID }],
    ['YOUTUBE', `${ID}?t=42`, null, { kind: 'youtube', id: ID, start: 42 }],
    ['YOUTUBE', 'javascript:alert(1)', null, null],
    ['YOUTUBE', `${ID}"><script>`, null, null],
    ['YOUTUBE', 'https://evil.com/x', null, null],
    ['VIMEO', '123456789?h=abcd1234', null, { kind: 'vimeo', id: '123456789', hash: 'abcd1234' }],
    ['VIMEO', '123456789?h=<x>', null, { kind: 'vimeo', id: '123456789' }],
    ['VIMEO', 'abc', null, null],
    ['URL', 'https://cdn.exemplo.com/a.mp4', null, { kind: 'url', url: 'https://cdn.exemplo.com/a.mp4' }],
    // Um link do YouTube gravado como URL não vira iframe pela porta dos fundos.
    ['URL', `https://www.youtube.com/watch?v=${ID}`, null, null],
    ['URL', 'http://cdn.exemplo.com/a.mp4', null, null],
    ['URL', 'https://evil.com/pagina', null, null],
    ['UPLOAD', 'clx1234567890abc', null, { kind: 'upload', assetId: 'clx1234567890abc' }],
    ['UPLOAD', '../../etc/passwd', null, null],
    ['UPLOAD', 'curto', null, null],
    ['OUTRO', ID, null, null],
    // Coluna legada `videoUrl`: passa pelo parser inteiro.
    [null, null, `https://youtu.be/${ID}`, { kind: 'youtube', id: ID }],
    [null, null, 'https://evil.com/embed', null],
    ['YOUTUBE', null, `https://youtu.be/${ID}`, { kind: 'youtube', id: ID }],
    [null, null, null, null],
  ])('(%s, %s, legado %s)', (kind, ref, legado, esperado) => {
    expect(fonteDaLinha(kind, ref, legado)).toEqual(esperado);
  });

  it('ida e volta: tipoDaFonte + refDaFonte → fonteDaLinha devolve a mesma fonte', () => {
    const fontes: VideoSource[] = [
      { kind: 'youtube', id: ID },
      { kind: 'youtube', id: ID, start: 90 },
      { kind: 'vimeo', id: '123456789' },
      { kind: 'vimeo', id: '123456789', hash: 'a1b2c3d4e5' },
      { kind: 'url', url: 'https://cdn.exemplo.com/aulas/aula01.mp4' },
      { kind: 'upload', assetId: 'clx1234567890abc' },
    ];
    for (const fonte of fontes) {
      expect(fonteDaLinha(tipoDaFonte(fonte), refDaFonte(fonte))).toEqual(fonte);
    }
  });
});

describe('textos e listas auxiliares', () => {
  it('linkPublico, rotuloDaOrigem e descreverFonte', () => {
    expect(linkPublico({ kind: 'youtube', id: ID, start: 5 })).toBe(`https://www.youtube.com/watch?v=${ID}`);
    expect(linkPublico({ kind: 'vimeo', id: '123456789', hash: 'abcd' })).toBe('https://vimeo.com/123456789/abcd');
    expect(linkPublico({ kind: 'upload', assetId: 'clx1234567890' })).toBeNull();
    expect(rotuloDaOrigem({ kind: 'url', url: 'https://x.com/a.mp4' })).toBe('Arquivo direto');
    expect(descreverFonte({ kind: 'youtube', id: ID, start: 5 })).toBe(`YouTube · ${ID} · começa em 5s`);
    expect(descreverFonte({ kind: 'vimeo', id: '123456789', hash: 'abcd' })).toBe('Vimeo · 123456789 · não listado');
  });

  it('a allowlist exibida é exatamente a do parser, e o frame-src é o do CSP', () => {
    expect([...HOSTS_ACEITOS].sort()).toEqual(
      ['player.vimeo.com', 'm.youtube.com', 'vimeo.com', 'youtu.be', 'youtube-nocookie.com', 'youtube.com'].sort(),
    );
    expect(ORIGENS_LIBERADAS).toEqual(ORIGENS_DE_EMBED);
    expect([...ORIGENS_DE_EMBED]).toEqual(['https://www.youtube-nocookie.com', 'https://player.vimeo.com']);
  });
});

describe('planoVeVideoaula', () => {
  it.each([
    ['ESSENCIAL', false],
    ['COMPLETO', true],
    ['PREMIUM', true],
  ] as const)('%s → %s', (plano, esperado) => {
    expect(planoVeVideoaula(plano)).toBe(esperado);
  });
});
