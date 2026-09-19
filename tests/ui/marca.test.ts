import { createHash } from 'node:crypto';
import { readFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  CAMINHO_DA_LOGO_DO_EMAIL,
  COR_DO_TEMA,
  MODELO_DE_TITULO,
  MODELO_DE_TITULO_DO_PAINEL,
  NOME_DO_PRODUTO,
  TITULO_PADRAO_DO_PAINEL,
  baseDoSite,
} from '@/lib/marca';

/** Caminho absoluto a partir da pasta app-web/. */
function caminho(relativo: string): string {
  return fileURLToPath(new URL(`../../${relativo}`, import.meta.url));
}

/** Largura e altura de um PNG, lidas do cabeçalho IHDR. */
function medidasDoPng(relativo: string): { largura: number; altura: number } {
  const bytes = readFileSync(caminho(relativo));
  expect(bytes.subarray(0, 8).toString('hex')).toBe('89504e470d0a1a0a');
  return { largura: bytes.readUInt32BE(16), altura: bytes.readUInt32BE(20) };
}

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('marca', () => {
  it('tem o nome, os modelos de título e a cor do tema', () => {
    expect(NOME_DO_PRODUTO).toBe('WSA English');
    expect(MODELO_DE_TITULO).toBe('%s · WSA English');
    expect(MODELO_DE_TITULO_DO_PAINEL).toBe('%s · Painel · WSA English');
    expect(TITULO_PADRAO_DO_PAINEL).toBe('Painel · WSA English');
    expect(COR_DO_TEMA).toBe('#0A1F4E');
    expect(CAMINHO_DA_LOGO_DO_EMAIL).toBe('/brand/email/wsa-logo-email.png');
  });

  it('baseDoSite cai em localhost sem APP_URL', () => {
    vi.stubEnv('APP_URL', '');
    expect(baseDoSite().href).toBe('http://localhost:3000/');
  });

  it('baseDoSite usa APP_URL válida, sem barra dobrada', () => {
    vi.stubEnv('APP_URL', 'https://app.exemplo.com/');
    expect(baseDoSite().href).toBe('https://app.exemplo.com/');
  });

  it('baseDoSite ignora APP_URL inválida ou sem http', () => {
    vi.stubEnv('APP_URL', 'lixo');
    expect(baseDoSite().href).toBe('http://localhost:3000/');
    vi.stubEnv('APP_URL', 'ftp://app.exemplo.com');
    expect(baseDoSite().href).toBe('http://localhost:3000/');
  });

  it('a logo do e-mail é PNG 300x96 e leve', () => {
    const relativo = `public${CAMINHO_DA_LOGO_DO_EMAIL}`;
    expect(medidasDoPng(relativo)).toEqual({ largura: 300, altura: 96 });
    expect(statSync(caminho(relativo)).size).toBeLessThanOrEqual(40000);
  });

  it('os ícones têm as medidas do contrato', () => {
    expect(medidasDoPng('src/app/icon.png')).toEqual({ largura: 512, altura: 512 });
    expect(medidasDoPng('src/app/apple-icon.png')).toEqual({ largura: 180, altura: 180 });
    expect(medidasDoPng('src/app/opengraph-image.png')).toEqual({ largura: 1200, altura: 630 });
    expect(statSync(caminho('src/app/opengraph-image.png')).size).toBeLessThan(8 * 1024 * 1024);
  });

  it('a imagem de compartilhamento tem texto alternativo', () => {
    const texto = readFileSync(caminho('src/app/opengraph-image.alt.txt'), 'utf8');
    expect(texto).toBe('WSA English: curso de inglês do zero em 42 aulas curtas');
  });

  it('o favicon não é o padrão do Next e tem 16 e 32 px', () => {
    const bytes = readFileSync(caminho('src/app/favicon.ico'));
    const hash = createHash('sha256').update(bytes).digest('hex');
    expect(hash.startsWith('2b8ad2d')).toBe(false);
    expect(bytes.readUInt16LE(2)).toBe(1);
    const quantos = bytes.readUInt16LE(4);
    const tamanhos: number[] = [];
    for (let i = 0; i < quantos; i += 1) {
      const largura = bytes[6 + i * 16];
      tamanhos.push(largura === 0 ? 256 : largura);
    }
    expect(tamanhos).toContain(16);
    expect(tamanhos).toContain(32);
  });
});
