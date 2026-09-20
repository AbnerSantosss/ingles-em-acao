/**
 * Os renderizadores dos blocos e a lista `textosDoBloco` contam a mesma história
 * (pacote 08).
 *
 * O projeto não tem jsdom nem testing-library, e o pacote não instala nada. Por
 * isso o bloco é desenhado em texto com `renderToStaticMarkup`, como o servidor
 * faz no primeiro carregamento: nenhum efeito roda, nenhum áudio é criado, e o
 * HTML mostra quantos botões de ouvir apareceram.
 *
 * Se alguém tirar um `OuvirTexto` de um bloco, ou mudar o campo que ele recebe,
 * o clipe continua no banco e o botão some. Este teste pega isso.
 */
import { createElement, type ReactElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { jsx } from 'react/jsx-runtime';
import { describe, expect, it } from 'vitest';

import { ProvedorDeAudio } from '@/components/lesson/audio/ContextoDeAudio';
import {
  ROTULO_OUVIR_DIALOGO,
  ROTULO_OUVIR_PRONUNCIA,
  ROTULO_OUVIR_TODOS,
} from '@/components/lesson/audio/rotulos';
import { BlocoCards, BlocoProfile, BlocoPron, BlocoRule, BlocoSteps } from '@/components/lesson/blocks/cartoes';
import {
  BlocoChips,
  BlocoCompare,
  BlocoDialogue,
  BlocoGrid,
  BlocoRows,
  BlocoTable,
} from '@/components/lesson/blocks/listas';
import { BlocoKey, BlocoLead, BlocoNote } from '@/components/lesson/blocks/texto';
import { ancoraDoBloco, textosDoBloco } from '@/lib/audio/textos-da-pagina';
import type {
  AudioClip,
  Block,
  CardsBlock,
  ChipsBlock,
  CompareBlock,
  DialogueBlock,
  GridBlock,
  KeyBlock,
  LeadBlock,
  NoteBlock,
  ProfileBlock,
  PronBlock,
  RowsBlock,
  RuleBlock,
  StepsBlock,
  TableBlock,
} from '@/lib/content/types';

const LEAD: LeadBlock = { t: 'lead', text: 'Listen and repeat.' };
const NOTE: NoteBlock = { t: 'note', text: 'We use "am" with I.' };
const KEY: KeyBlock = { t: 'key', text: 'I am ready.' };
const CHIPS: ChipsBlock = { t: 'chips', items: [{ t: 'I' }, { t: 'you' }] };
const PRON: PronBlock = { t: 'pron', code: 'I', pt: 'EU', title: 'I am a student.' };
const GRID: GridBlock = { t: 'grid', cols: 2, items: [{ title: 'Monday' }, { title: 'Tuesday', body: 'second day' }] };
const TABLE: TableBlock = {
  t: 'table',
  head: ['FULL', 'SHORT'],
  rows: [
    { a: 'I am', b: "I'm" },
    { a: 'you are', b: "you're" },
  ],
};
const RULE: RuleBlock = { t: 'rule', kicker: 'REGRA', from: 'I', to: 'am', ex: 'I am happy.', tr: 'Eu estou feliz.' };
const COMPARE: CompareBlock = {
  t: 'compare',
  items: [
    { wrong: 'I is', right: 'I am' },
    { wrong: 'He are', right: 'He is' },
  ],
};
const PROFILE: ProfileBlock = { t: 'profile', name: 'ANNA', id: 'anna', ph: 'Anna', facts: ['She is 25.', 'She is a nurse.'] };
const CARDS: CardsBlock = {
  t: 'cards',
  items: [{ tag: 'MORNING', lines: ['Good morning!', 'How are you?'], note: 'antes do meio-dia' }, { tag: 'NIGHT' }],
};
const ROWS: RowsBlock = { t: 'rows', items: [{ text: 'Go straight.' }, { text: 'Turn left.' }] };
const STEPS: StepsBlock = { t: 'steps', items: [{ tag: 'TURN LEFT', lines: ['Turn left at the bank.'] }, { tag: 'STOP' }] };
const DIALOGUE: DialogueBlock = {
  t: 'dialogue',
  items: [
    { s: 'a', text: 'Excuse me, where is the museum?' },
    { s: 'b', text: 'Go straight for two blocks.' },
  ],
};

/** Os 14 tipos com áudio, cada um com o seu renderizador real. */
const CASOS: ReadonlyArray<readonly [string, Block, () => ReactElement]> = [
  ['lead', LEAD, () => createElement(BlocoLead, { bloco: LEAD })],
  ['note', NOTE, () => createElement(BlocoNote, { bloco: NOTE })],
  ['key', KEY, () => createElement(BlocoKey, { bloco: KEY })],
  ['chips', CHIPS, () => createElement(BlocoChips, { bloco: CHIPS })],
  ['pron', PRON, () => createElement(BlocoPron, { bloco: PRON })],
  ['grid', GRID, () => createElement(BlocoGrid, { bloco: GRID })],
  ['table', TABLE, () => createElement(BlocoTable, { bloco: TABLE })],
  ['rule', RULE, () => createElement(BlocoRule, { bloco: RULE })],
  ['compare', COMPARE, () => createElement(BlocoCompare, { bloco: COMPARE })],
  ['profile', PROFILE, () => createElement(BlocoProfile, { bloco: PROFILE })],
  ['cards', CARDS, () => createElement(BlocoCards, { bloco: CARDS })],
  ['rows', ROWS, () => createElement(BlocoRows, { bloco: ROWS })],
  ['steps', STEPS, () => createElement(BlocoSteps, { bloco: STEPS })],
  ['dialogue', DIALOGUE, () => createElement(BlocoDialogue, { bloco: DIALOGUE })],
];

function clip(id: string, alvo: AudioClip['alvo'], ancora: string): AudioClip {
  return { id, alvo, ancora, texto: ancora, src: `/audio/aula-02/${id}.0badc0de.mp3`, categoria: 'FIXED_CHUNK' };
}

/** Um clipe de texto para cada texto do bloco e, quando existe, um de bloco inteiro. */
function clipesDoBloco(bloco: Block): AudioClip[] {
  const clipes = textosDoBloco(bloco).map((texto, i) => clip(`lesson_002_audio_${String(100 + i)}`, 'texto', texto));
  const ancora = ancoraDoBloco(bloco);
  if (ancora !== null) clipes.push(clip('lesson_002_audio_199', 'bloco', ancora));
  return clipes;
}

/** O arquivo é .ts, sem JSX: `jsx()` é o que `<ProvedorDeAudio audios={...}>{elemento}</ProvedorDeAudio>` vira. */
function desenhar(elemento: ReactElement, audios?: AudioClip[]): string {
  return renderToStaticMarkup(jsx(ProvedorDeAudio, { audios, children: elemento }));
}

function contar(html: string, trecho: string): number {
  return html.split(trecho).length - 1;
}

describe('bloco sem clipe: nada muda', () => {
  it.each(CASOS)('%s: sem provedor, com lista vazia e sem lista, o HTML é o mesmo e não tem botão', (_t, _b, criar) => {
    const semProvedor = renderToStaticMarkup(criar());
    expect(semProvedor).not.toContain('<button');
    expect(desenhar(criar(), [])).toBe(semProvedor);
    expect(desenhar(criar(), undefined)).toBe(semProvedor);
  });
});

describe('bloco com um clipe para cada texto', () => {
  it.each(CASOS)('%s: um botão "Ouvir pronúncia" para cada texto de textosDoBloco', (_t, bloco, criar) => {
    const html = desenhar(criar(), clipesDoBloco(bloco));
    expect(contar(html, `aria-label="${ROTULO_OUVIR_PRONUNCIA}: `)).toBe(textosDoBloco(bloco).length);
  });

  it.each(CASOS)('%s: o player de bloco aparece só quando o tipo tem âncora de bloco', (t, bloco, criar) => {
    const html = desenhar(criar(), clipesDoBloco(bloco));
    const players = contar(html, `>${ROTULO_OUVIR_DIALOGO}<`) + contar(html, `>${ROTULO_OUVIR_TODOS}<`);
    expect(players).toBe(ancoraDoBloco(bloco) === null ? 0 : 1);
    if (t === 'dialogue') expect(html).toContain(`>${ROTULO_OUVIR_DIALOGO}<`);
  });

  it('compare: a frase errada nunca ganha botão', () => {
    const html = desenhar(createElement(BlocoCompare, { bloco: COMPARE }), [
      clip('lesson_002_audio_150', 'texto', 'I is'),
    ]);
    expect(html).not.toContain('<button');
  });

  it('clipe lento: aparece o segundo botão "Devagar"', () => {
    const lento: AudioClip = { ...clip('lesson_002_audio_160', 'texto', 'I am ready.'), lento: true };
    const html = desenhar(createElement(BlocoKey, { bloco: KEY }), [lento]);
    expect(html).toContain('aria-label="Ouvir pronúncia: I am ready."');
    expect(html).toContain('aria-label="Ouvir mais devagar: I am ready."');
  });

  it('o botão grande mostra o nome na tela; dentro do balão de diálogo fica só o ícone', () => {
    const grande = desenhar(createElement(BlocoKey, { bloco: KEY }), [
      clip('lesson_002_audio_170', 'texto', KEY.text),
    ]);
    expect(grande).toContain(`>${ROTULO_OUVIR_PRONUNCIA}<`);

    const compacto = desenhar(createElement(BlocoDialogue, { bloco: DIALOGUE }), [
      clip('lesson_002_audio_171', 'texto', ancoraDoBloco(DIALOGUE) ?? ''),
    ]);
    expect(compacto).not.toContain(`>${ROTULO_OUVIR_PRONUNCIA}<`);
    expect(compacto).toContain(`aria-label="${ROTULO_OUVIR_PRONUNCIA}: `);
  });

  it('nenhum botão nasce tocando e nenhum áudio é criado no servidor', () => {
    const html = desenhar(createElement(BlocoDialogue, { bloco: DIALOGUE }), clipesDoBloco(DIALOGUE));
    expect(html).not.toContain('aria-pressed="true"');
    expect(html).not.toContain('<audio');
  });
});
