/**
 * `Ilustracao` com tamanho natural (`w`/`h`): a figura inteira, na proporção
 * dela, sem corte, sem esticar e sem o fundo cinza da caixa fixa.
 *
 * Sem jsdom (o projeto não tem): o bloco é desenhado em texto com
 * `renderToStaticMarkup` e o teste lê as classes e o `style` do `<img>`. O que
 * não dá para medir aqui (a largura final em px) fica garantido pela fórmula de
 * `larguraNaColuna`, testada à parte.
 *
 * Sem `w`/`h`, o HTML tem que ser o de antes: `object-cover`, fundo cinza e o
 * placeholder "EM BREVE" quando não há arquivo.
 */
import { createElement, type ReactElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { jsx } from 'react/jsx-runtime';
import { describe, expect, it } from 'vitest';

import { ProvedorDeAudio } from '@/components/lesson/audio/ContextoDeAudio';
import {
  ALTURA_MAXIMA_DA_FIGURA,
  ALTURA_MAXIMA_NA_CAIXA,
  Ilustracao,
  LARGURA_UTIL_DO_EBOOK,
  larguraNaCaixa,
  larguraNaColuna,
  type IlustracaoProps,
} from '@/components/lesson/blocks/Ilustracao';
import { BlocoCards, BlocoImage, BlocoProfile, BlocoSteps } from '@/components/lesson/blocks/cartoes';
import type { CardsBlock, ImageBlock, ProfileBlock, StepsBlock } from '@/lib/content/types';

const SRC = '/midia/imagens/0f0e0d0c-0000-4000-8000-000000000001.png';

function desenhar(elemento: ReactElement): string {
  return renderToStaticMarkup(jsx(ProvedorDeAudio, { audios: [], children: elemento }));
}

function ilustracao(props: Partial<IlustracaoProps>): string {
  return desenhar(createElement(Ilustracao, { raio: 14, ph: 'Ilustração: grupo conversando', ...props }));
}

/** A tag `<img …>` do HTML (há no máximo uma por ilustração). */
function tagImg(html: string): string {
  const achado = /<img [^>]*>/.exec(html);
  if (!achado) throw new Error(`sem <img> em: ${html}`);
  return achado[0];
}

describe('constantes', () => {
  it('a coluna do e-book tem 900 px úteis e a figura do bloco image para em 420 px de altura', () => {
    expect(LARGURA_UTIL_DO_EBOOK).toBe(900);
    expect(ALTURA_MAXIMA_DA_FIGURA).toBe(420);
  });

  it('em cartões e passos a figura para em 280 px de altura', () => {
    expect(ALTURA_MAXIMA_NA_CAIXA).toBe(280);
  });
});

describe('larguraNaCaixa (cards, steps, profile)', () => {
  it.each([
    // miniatura do e-book: o tamanho natural, sem vão em volta
    [146, 117, 280, 'min(100%, 146px, 349.402px)'],
    // figura alta: a altura chega ao teto e a largura encolhe junto (280 × 300/600)
    [300, 600, 280, 'min(100%, 300px, 140px)'],
    // profile: o teto é a altura dele
    [435, 317, 190, 'min(100%, 435px, 260.726px)'],
  ])('%i × %i, teto %i → %s', (w, h, teto, esperado) => {
    expect(larguraNaCaixa(w, h, teto)).toBe(esperado);
  });
});

describe('larguraNaColuna (bloco image)', () => {
  it.each([
    // figura da largura útil inteira: a coluna toda; a altura (450 × coluna/900) não chega ao teto
    [900, 450, 'min(100%, 100%, 840px)'],
    // metade da largura útil: metade da coluna
    [450, 200, 'min(100%, 50%, 945px)'],
    // ícone pequeno: 60/900 da coluna, nunca a tela inteira
    [60, 60, 'min(100%, 6.667%, 420px)'],
    // figura em pé: a altura chega a 420 px antes, e a largura encolhe junto (420 × 400/800)
    [400, 800, 'min(100%, 44.444%, 210px)'],
  ])('%i × %i → %s', (w, h, esperado) => {
    expect(larguraNaColuna(w, h)).toBe(esperado);
  });
});

describe('com w/h: figura inteira', () => {
  it('no encaixe coluna, o img leva width/height, lazy, async e alt, sem caixa cinza nem corte', () => {
    const html = ilustracao({ src: SRC, alt: 'Grupo conversando', w: 900, h: 450, encaixe: 'coluna', proporcao: '16 / 9', raio: 18 });
    const img = tagImg(html);

    expect(img).toContain(`src="${SRC}"`);
    expect(img).toContain('alt="Grupo conversando"');
    expect(img).toContain('width="900"');
    expect(img).toContain('height="450"');
    expect(img).toContain('loading="lazy"');
    expect(img).toContain('decoding="async"');
    expect(img).toContain('mx-auto');
    expect(img).toContain('h-auto');
    expect(img).toContain('width:min(100%, 100%, 840px)');
    expect(img).toContain('aspect-ratio:900 / 450');

    expect(html).not.toContain('bg-[#F0F1F5]');
    expect(html).not.toContain('object-cover');
    expect(html).not.toContain('overflow-hidden');
    expect(html).not.toContain('border-radius');
    expect(html).not.toContain('EM BREVE');
  });

  it('no encaixe caixa, a área é a da figura: tamanho natural com teto de altura, sem a caixa fixa', () => {
    const html = ilustracao({ src: SRC, alt: 'Sol', w: 60, h: 40, proporcao: '16 / 10' });
    const img = tagImg(html);

    expect(html).not.toContain('aspect-ratio:16 / 10');
    expect(img).toContain('mx-auto');
    expect(img).toContain('h-auto');
    expect(img).toContain('width:min(100%, 60px, 420px)');
    expect(img).toContain('aspect-ratio:60 / 40');
    expect(img).toContain('width="60"');
    expect(img).toContain('height="40"');
    expect(img).toContain('loading="lazy"');
    expect(img).toContain('decoding="async"');

    expect(html).not.toContain('bg-[#F0F1F5]');
    expect(html).not.toContain('object-cover');
  });

  it('altura fixa (profile) vira o teto de altura da figura', () => {
    const html = ilustracao({ src: SRC, alt: 'Anna', w: 300, h: 400, altura: 190 });
    expect(html).not.toContain('height:190px');
    expect(tagImg(html)).toContain('width:min(100%, 300px, 142.5px)');
  });
});

describe('sem w/h válidos: exatamente o comportamento de antes', () => {
  const ANTIGO = ilustracao({ src: SRC, alt: 'Grupo', proporcao: '16 / 9' });

  it('a caixa fixa com fundo cinza e object-cover segue igual', () => {
    expect(ANTIGO).toContain('bg-[#F0F1F5]');
    expect(tagImg(ANTIGO)).toContain('object-cover');
    expect(tagImg(ANTIGO)).not.toContain('width="');
  });

  it.each([
    ['só w', { w: 300 }],
    ['só h', { h: 150 }],
    ['w zero', { w: 0, h: 150 }],
    ['w fracionário', { w: 1.5, h: 150 }],
  ])('%s → HTML idêntico ao sem tamanho', (_nome, tamanho) => {
    expect(ilustracao({ src: SRC, alt: 'Grupo', proporcao: '16 / 9', ...tamanho })).toBe(ANTIGO);
  });

  it('vaga sem arquivo mostra o placeholder "EM BREVE", mesmo com w/h', () => {
    const html = ilustracao({ id: 'a9p9', w: 300, h: 150, encaixe: 'coluna' });
    expect(html).toContain('EM BREVE');
    expect(html).toContain('data-placeholder="ilustracao"');
    expect(html).not.toContain('<img');
  });

  it('a arte legada (sem src) não entra no modo novo', () => {
    const html = ilustracao({ id: 'a1p1', w: 300, h: 150, encaixe: 'coluna' });
    expect(tagImg(html)).toContain('src="/lessons/art/a1p1.webp"');
    expect(tagImg(html)).toContain('object-cover');
  });
});

describe('os blocos passam w/h para a Ilustracao', () => {
  it('image usa o encaixe coluna', () => {
    const bloco: ImageBlock = { t: 'image', id: 'a8p1', ph: 'Ilustração: grupo', src: SRC, alt: 'Grupo', w: 450, h: 200 };
    const img = tagImg(desenhar(createElement(BlocoImage, { bloco })));
    expect(img).toContain('width:min(100%, 50%, 945px)');
    expect(img).toContain('width="450"');
  });

  it('cards, steps e profile usam o encaixe caixa (tamanho natural com teto)', () => {
    const cards: CardsBlock = { t: 'cards', items: [{ tag: 'MORNING', id: 'a8c1', ph: 'Sol', src: SRC, alt: 'Sol', w: 120, h: 80 }] };
    const steps: StepsBlock = { t: 'steps', items: [{ tag: 'TURN LEFT', id: 'a8s1', ph: 'Seta', src: SRC, alt: 'Seta', w: 64, h: 64 }] };
    const profile: ProfileBlock = { t: 'profile', name: 'ANNA', id: 'anna', ph: 'Anna', facts: ['She is 25.'], src: SRC, alt: 'Anna', w: 300, h: 400 };

    for (const [elemento, w, h, teto] of [
      [createElement(BlocoCards, { bloco: cards }), 120, 80, ALTURA_MAXIMA_NA_CAIXA],
      [createElement(BlocoSteps, { bloco: steps }), 64, 64, ALTURA_MAXIMA_NA_CAIXA],
      [createElement(BlocoProfile, { bloco: profile }), 300, 400, 190],
    ] as const) {
      const img = tagImg(desenhar(elemento));
      expect(img).toContain(`width="${w}"`);
      expect(img).toContain(`height="${h}"`);
      expect(img).toContain(`width:${larguraNaCaixa(w, h, teto)}`);
    }
  });
});
