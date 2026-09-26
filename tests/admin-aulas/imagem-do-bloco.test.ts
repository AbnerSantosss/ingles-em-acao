/**
 * Painel: a escolha de uma imagem grava `src`, `alt`, `w` e `h` no JSON do bloco,
 * e limpar a imagem apaga os quatro.
 *
 * O `CampoDeImagem` (`forms/imagem.tsx`) só repassa a escolha do seletor para
 * `comImagem`; o componente em si importa as Server Actions da mídia e não roda
 * aqui. Por isso o teste é da função pura — é ela que decide o que fica no JSON.
 *
 * O caso que importa: trocar por uma imagem **sem** tamanho lido não pode deixar
 * o `w`/`h` da anterior, senão a figura nova sai na proporção da velha.
 */
import { describe, expect, it } from 'vitest';

import { comImagem, type Objeto } from '@/components/admin/forms/objeto';
import { tamanhoDaMidia, type MidiaSelecionada } from '@/lib/media/tipos';

// As mesmas ordens de `FormularioImage` e `FormularioCards` (constantes privadas lá).
const ORDEM_IMAGE = ['id', 'ph', 'src', 'alt', 'w', 'h'] as const;
const ORDEM_DO_CARD = ['tag', 'lines', 'note', 'id', 'ph', 'src', 'alt', 'w', 'h', 'c', 'v'] as const;

const SRC_A = '/midia/imagens/aaaaaaaa-0000-4000-8000-000000000001.png';
const SRC_B = '/midia/imagens/bbbbbbbb-0000-4000-8000-000000000002.webp';

describe('tamanhoDaMidia', () => {
  it('copia width/height da biblioteca quando os dois são inteiros positivos', () => {
    expect(tamanhoDaMidia(900, 450)).toEqual({ w: 900, h: 450 });
    expect(tamanhoDaMidia(60, 60)).toEqual({ w: 60, h: 60 });
  });

  it.each([
    [null, null],
    [null, 450],
    [900, null],
    [0, 450],
    [900, -1],
    [12.5, 40],
    [undefined, undefined],
  ])('(%j, %j) → sem tamanho', (width, height) => {
    expect(tamanhoDaMidia(width, height)).toEqual({});
  });
});

describe('comImagem', () => {
  it('grava w/h logo depois de alt, na ordem do tipo', () => {
    const bloco: Objeto = { id: 'a8p1', ph: 'Ilustração: grupo' };
    const escolha: MidiaSelecionada = { src: SRC_A, alt: 'Grupo conversando', w: 900, h: 450 };

    const novo = comImagem(bloco, escolha, ORDEM_IMAGE);

    expect(novo).toEqual({ id: 'a8p1', ph: 'Ilustração: grupo', src: SRC_A, alt: 'Grupo conversando', w: 900, h: 450 });
    expect(Object.keys(novo)).toEqual(['id', 'ph', 'src', 'alt', 'w', 'h']);
  });

  it('no item de cards, w/h entram entre alt e a cor, não no fim', () => {
    const item: Objeto = { tag: 'MORNING', lines: ['Good morning!'], id: 'a8c1', ph: 'Sol', c: 'teal', v: 'mint' };
    const novo = comImagem(item, { src: SRC_A, alt: 'Sol nascendo', w: 320, h: 200 }, ORDEM_DO_CARD);
    expect(Object.keys(novo)).toEqual(['tag', 'lines', 'id', 'ph', 'src', 'alt', 'w', 'h', 'c', 'v']);
  });

  it('trocar de imagem troca o tamanho no mesmo lugar', () => {
    const bloco: Objeto = { id: 'a8p1', ph: 'x', src: SRC_A, alt: 'A', w: 900, h: 450 };
    const novo = comImagem(bloco, { src: SRC_B, alt: 'B', w: 120, h: 80 }, ORDEM_IMAGE);
    expect(novo).toEqual({ id: 'a8p1', ph: 'x', src: SRC_B, alt: 'B', w: 120, h: 80 });
    expect(Object.keys(novo)).toEqual(['id', 'ph', 'src', 'alt', 'w', 'h']);
  });

  it('escolher uma imagem sem tamanho apaga o w/h da anterior', () => {
    const bloco: Objeto = { id: 'a8p1', ph: 'x', src: SRC_A, alt: 'A', w: 900, h: 450 };
    const semTamanho: MidiaSelecionada = { src: SRC_B, alt: 'B', ...tamanhoDaMidia(null, null) };

    const novo = comImagem(bloco, semTamanho, ORDEM_IMAGE);

    expect(novo).toEqual({ id: 'a8p1', ph: 'x', src: SRC_B, alt: 'B' });
    expect('w' in novo || 'h' in novo).toBe(false);
  });

  it('limpar a imagem remove src, alt, w e h e não mexe no resto', () => {
    const bloco: Objeto = { id: 'a8p1', ph: 'x', src: SRC_A, alt: 'A', w: 900, h: 450 };
    expect(comImagem(bloco, null, ORDEM_IMAGE)).toEqual({ id: 'a8p1', ph: 'x' });
  });

  it('só mudar o alt (o seletor espalha o valor atual) mantém w/h', () => {
    const bloco: Objeto = { id: 'a8p1', ph: 'x', src: SRC_A, alt: 'A', w: 900, h: 450 };
    // O que o `CampoDeImagem` monta a partir do bloco e o `trocarAlt` do seletor devolve.
    const valor: MidiaSelecionada = { src: SRC_A, alt: 'A', w: 900, h: 450 };
    const novo = comImagem(bloco, { ...valor, alt: 'Grupo conversando' }, ORDEM_IMAGE);
    expect(novo).toEqual({ id: 'a8p1', ph: 'x', src: SRC_A, alt: 'Grupo conversando', w: 900, h: 450 });
  });

  it('não altera o objeto recebido (a fonte da verdade é o JSON do editor)', () => {
    const bloco: Objeto = { id: 'a8p1', ph: 'x', src: SRC_A, alt: 'A', w: 900, h: 450 };
    const copia = JSON.parse(JSON.stringify(bloco)) as Objeto;
    comImagem(bloco, null, ORDEM_IMAGE);
    comImagem(bloco, { src: SRC_B, alt: 'B' }, ORDEM_IMAGE);
    expect(bloco).toEqual(copia);
  });
});
