/**
 * `w`/`h` — o tamanho natural da figura — em toda vaga com mídia: bloco `image`,
 * `profile`, item de `cards` e de `steps`.
 *
 * Os objetos do esquema são `z.strictObject`: antes desta mudança, `w`/`h`
 * recusavam o conteúdo inteiro com "campo desconhecido". Aqui fica provado que
 * eles passam pelo esquema (inclusive pelo `CourseSchema` do seed e pelo
 * `validarPaginas` da publicação) **sem se perderem** no `data` devolvido, e que
 * 0, negativo, fração e texto são recusados com uma frase que diz o que veio.
 */
import { describe, expect, it } from 'vitest';

import { validarFormulario } from '@/components/admin/forms/validacao';
import { BlockSchema, CourseSchema, validarPaginas } from '@/lib/content/blocks';

const SRC = '/midia/imagens/0f0e0d0c-0000-4000-8000-000000000001.png';

/** Uma vaga de cada tipo, todas com `w`/`h`. */
function blocosComTamanho(w: unknown, h: unknown) {
  return [
    { t: 'image', id: 'a8p1', ph: 'Ilustração: grupo conversando', src: SRC, alt: 'Grupo conversando', w, h },
    { t: 'profile', name: 'ANNA', id: 'anna', ph: 'Foto: Anna', facts: ['She is 25.'], src: SRC, alt: 'Anna', w, h },
    { t: 'cards', items: [{ tag: 'MORNING', id: 'a8c1', ph: 'Sol', src: SRC, alt: 'Sol nascendo', w, h }] },
    { t: 'steps', items: [{ tag: 'TURN LEFT', id: 'a8s1', ph: 'Seta', src: SRC, alt: 'Seta à esquerda', w, h }] },
  ];
}

/** `w`/`h` de cada vaga, lidos de volta do dado validado. */
function tamanhos(blocos: readonly unknown[]): Array<[unknown, unknown]> {
  return blocos.map((bloco) => {
    const b = bloco as Record<string, unknown> & { items?: Array<Record<string, unknown>> };
    const vaga = b.items ? b.items[0] : b;
    return [vaga.w, vaga.h];
  });
}

describe('esquema: w/h aceitos como inteiros positivos', () => {
  it.each([
    [60, 60],
    [900, 450],
    [1, 1],
  ])('aceita %i × %i em image, profile, cards[] e steps[] e devolve os dois no data', (w, h) => {
    for (const bloco of blocosComTamanho(w, h)) {
      const resultado = BlockSchema.safeParse(bloco);
      expect(resultado.success, JSON.stringify(bloco)).toBe(true);
      if (resultado.success) expect(tamanhos([resultado.data])).toEqual([[w, h]]);
    }
  });

  it('continua opcional: a vaga sem w/h passa como antes', () => {
    const semTamanho = blocosComTamanho(undefined, undefined).map((b) => JSON.parse(JSON.stringify(b)));
    for (const bloco of semTamanho) expect(BlockSchema.safeParse(bloco).success).toBe(true);
  });

  it('validarPaginas (publicação e leitura do banco) mantém w/h nas páginas devolvidas', () => {
    const resultado = validarPaginas([{ blocks: blocosComTamanho(300, 150) }]);
    expect(resultado.ok).toBe(true);
    if (resultado.ok) expect(tamanhos(resultado.pages[0].blocks)).toEqual(Array(4).fill([300, 150]));
  });

  it('CourseSchema (seed, inclusive --ressincronizar) mantém w/h dentro da aula', () => {
    const curso = {
      LESSONS: [
        { id: 8, code: 'A08', title: 'Aula 08', sub: 'sub', time: '10 min', pages: [{ blocks: blocosComTamanho(640, 360) }] },
      ],
      TRACK: [{ n: 8, t: 'Aula 08' }],
    };
    const resultado = CourseSchema.safeParse(curso);
    expect(resultado.success).toBe(true);
    if (resultado.success) {
      expect(tamanhos(resultado.data.LESSONS[0].pages[0].blocks)).toEqual(Array(4).fill([640, 360]));
    }
  });
});

describe('esquema: w/h recusados fora de inteiro positivo', () => {
  it.each([
    ['zero', 0, 'deveria ser maior que 0'],
    ['negativo', -1, 'deveria ser maior que 0'],
    ['fração', 1.5, 'deveria ser um número inteiro, mas veio 1.5'],
    ['texto', '300', 'deveria ser number, mas veio string'],
  ])('%s em w é erro em todas as vagas, com frase que diz o que veio', (_nome, w, frase) => {
    for (const bloco of blocosComTamanho(w, 150)) {
      expect(BlockSchema.safeParse(bloco).success, JSON.stringify(bloco)).toBe(false);
    }

    const resultado = validarPaginas([{ blocks: blocosComTamanho(w, 150) }]);
    expect(resultado.ok).toBe(false);
    if (resultado.ok) return;
    expect(resultado.erros).toEqual([
      `página 1, bloco 1 (\`image\`): campo \`w\` ${frase}`,
      `página 1, bloco 2 (\`profile\`): campo \`w\` ${frase}`,
      `página 1, bloco 3 (\`cards\`): campo \`items[0].w\` ${frase}`,
      `página 1, bloco 4 (\`steps\`): campo \`items[0].w\` ${frase}`,
    ]);
  });

  it.each([0, -20, 2.5, '450'])('h = %j também é recusado', (h) => {
    for (const bloco of blocosComTamanho(900, h)) expect(BlockSchema.safeParse(bloco).success).toBe(false);
  });

  it('tipo errado não vira mais "ausente" na frase do erro', () => {
    const resultado = validarPaginas([{ blocks: [{ t: 'image', id: 'a8p1', ph: 'x', src: SRC, alt: 'x', w: null }] }]);
    expect(resultado.ok).toBe(false);
    if (!resultado.ok) expect(resultado.erros).toEqual(['página 1, bloco 1 (`image`): campo `w` deveria ser number, mas veio null']);
  });
});

describe('painel: o erro de w/h aparece em português ao lado do campo', () => {
  const imagem = (w: unknown) => ({ id: 'a8p1', ph: 'x', src: SRC, alt: 'x', w, h: 150 });

  it.each([
    [0, 'Precisa ser maior que 0.'],
    [-1, 'Precisa ser maior que 0.'],
    [1.5, 'Formato errado: aqui vai um número inteiro.'],
    ['300', 'Formato errado: aqui vai um número.'],
  ])('w = %j → "%s"', (w, mensagem) => {
    expect(validarFormulario('image', undefined, imagem(w)).em('w')).toEqual([mensagem]);
  });

  it('w/h válidos não geram erro, nem "campo desconhecido"', () => {
    const erros = validarFormulario('image', undefined, imagem(300));
    expect(erros.contarAbaixo()).toBe(0);
  });

  it('nos itens de cards, o erro fica preso ao item certo', () => {
    const erros = validarFormulario('cards', undefined, { items: [{ tag: 'A' }, { tag: 'B', src: SRC, alt: 'b', w: 0, h: 10 }] });
    expect(erros.filho('items', 0).contarAbaixo()).toBe(0);
    expect(erros.filho('items', 1).em('w')).toEqual(['Precisa ser maior que 0.']);
  });
});
