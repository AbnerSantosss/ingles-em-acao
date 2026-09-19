/**
 * Travas da casca em tela cheia (plano v2, pacote 05). Os testes leem o código
 * como texto: aqui importa que a regra continue escrita. O visual é conferido
 * no Chrome, na verificação do pacote 05.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

const RAIZ = fileURLToPath(new URL('../../', import.meta.url));
const ler = (caminho: string) => readFileSync(join(RAIZ, caminho), 'utf8');

const CSS = ler('src/app/globals.css');

/** O corpo de um `@utility nome { ... }`, ou '' se ele não existir. */
function corpoDoUtilitario(nome: string): string {
  const inicio = CSS.indexOf(`@utility ${nome} {`);
  if (inicio < 0) return '';
  return CSS.slice(inicio, CSS.indexOf('}', inicio));
}

describe('globals.css: casca da aula', () => {
  it.each([
    '.casca-aula {',
    '@supports (height: 100dvh)',
    'height: 100dvh;',
    'height: 100vh;',
    'overscroll-behavior: contain;',
    '.coluna-aula {',
    '.modo-foco {',
    '.fundo-aula {',
    'position: fixed;',
    'object-fit: cover;',
    '(prefers-contrast: more)',
    'env(safe-area-inset-bottom)',
    'env(safe-area-inset-top)',
  ])('tem %s', (trecho) => {
    expect(CSS).toContain(trecho);
  });

  it.each([
    ['fs-leitura', 'max(15px'],
    ['fs-apoio', 'max(14px'],
    ['fs-rotulo', 'max(12px'],
    ['fs-botao', 'max(15px'],
    ['alt-botao', 'max(44px'],
  ])('o utilitário %s tem o piso %s', (nome, piso) => {
    expect(corpoDoUtilitario(nome)).toContain(piso);
  });

  it('não usa background-attachment: fixed (o Safari do iPhone ignora)', () => {
    expect(CSS).not.toMatch(/background-attachment:\s*fixed/);
  });
});

describe('FundoDaAula', () => {
  const FONTE = ler('src/components/lesson/FundoDaAula.tsx');

  it('usa a imagem de desktop só em tela larga e deitada', () => {
    expect(FONTE).toContain("'(min-width: 1024px) and (orientation: landscape)'");
    expect(FONTE).toContain("'/brand/aula-fundo-desktop.webp'");
    expect(FONTE).toContain("'/brand/aula-fundo-mobile.webp'");
  });

  it('é decorativo', () => {
    expect(FONTE).toContain('aria-hidden="true"');
    expect(FONTE).toContain('alt=""');
  });

  it('usa <picture>, não o componente de imagem do Next', () => {
    expect(FONTE).toContain('<picture>');
    expect(FONTE).not.toMatch(/from ['"]next\/image['"]/);
  });
});

/** O travessão, montado pelo código para não aparecer escrito neste arquivo. */
const TRAVESSAO = String.fromCharCode(0x2014);

describe('sem travessão (U+2014) nos arquivos do pacote 05', () => {
  it.each([
    'src/app/globals.css',
    'src/app/(app)/layout.tsx',
    'src/app/(app)/aula/[slug]/resultado/page.tsx',
    'src/components/app/MolduraDoApp.tsx',
    'src/components/app/modo-foco.ts',
    'src/components/lesson/FundoDaAula.tsx',
    'src/components/lesson/LeitorDaAula.tsx',
  ])('%s', (caminho) => {
    expect(ler(caminho)).not.toContain(TRAVESSAO);
  });
});
