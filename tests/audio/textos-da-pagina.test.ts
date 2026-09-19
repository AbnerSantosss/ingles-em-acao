/**
 * Textos que podem receber áudio (pacote 08, contrato 01 seção 2.2).
 *
 * `textosDoBloco` é a lista que o painel usa para achar clipe órfão e a que o
 * pacote 12 usa para escrever âncora. Se ela divergir do que os renderizadores
 * passam para o `OuvirTexto`, o clipe existe no banco e o botão nunca aparece.
 * Por isso cada tipo tem o seu caso, campo por campo.
 */
import { describe, expect, it } from 'vitest';

import { acharClip, clipsOrfaos } from '@/lib/audio/ancora';
import { ancoraDoBloco, textosDaPagina, textosDoBloco } from '@/lib/audio/textos-da-pagina';
import { validarPaginas } from '@/lib/content/blocks';
import { LESSONS } from '@/lib/content/lessons';
import type { AudioClip, Block } from '@/lib/content/types';

/** Um exemplo de cada tipo com áudio, com dois itens nas listas. */
const COM_AUDIO: Record<string, Block> = {
  lead: { t: 'lead', text: 'Listen and repeat.' },
  note: { t: 'note', text: 'We use "am" with I.' },
  key: { t: 'key', text: 'I am ready.' },
  chips: { t: 'chips', items: [{ t: 'I' }, { t: 'you' }] },
  pron: { t: 'pron', code: 'I', pt: 'EU', title: 'I am a student.' },
  grid: { t: 'grid', cols: 2, items: [{ title: 'Monday' }, { title: 'Tuesday', body: 'second day' }] },
  table: { t: 'table', head: ['FULL', 'SHORT'], rows: [{ a: 'I am', b: "I'm" }, { a: 'you are', b: "you're" }] },
  rule: { t: 'rule', kicker: 'REGRA', from: 'I', to: 'am', ex: 'I am happy.', tr: 'Eu estou feliz.' },
  compare: { t: 'compare', items: [{ wrong: 'I is', right: 'I am' }, { wrong: 'He are', right: 'He is' }] },
  profile: { t: 'profile', name: 'ANNA', id: 'anna', ph: 'Anna', facts: ['She is 25.', 'She is a nurse.'] },
  cards: {
    t: 'cards',
    items: [
      { tag: 'MORNING', lines: ['Good morning!', 'How are you?'], note: 'antes do meio-dia' },
      { tag: 'NIGHT' },
    ],
  },
  rows: { t: 'rows', items: [{ text: 'Go straight.' }, { text: 'Turn left.' }] },
  steps: { t: 'steps', items: [{ tag: 'TURN LEFT', lines: ['Turn left at the bank.'] }, { tag: 'STOP' }] },
  dialogue: {
    t: 'dialogue',
    items: [
      { s: 'a', text: 'Excuse me, where is the museum?' },
      { s: 'b', text: 'Go straight for two blocks.' },
    ],
  },
};

/** Os 17 tipos que ficam sem áudio nesta entrega. */
const SEM_AUDIO = [
  'badge',
  'title',
  'sec',
  'kicker',
  'image',
  'answers',
  'objective',
  'meta',
  'next',
  'bar',
  'mc',
  'fill',
  'match',
  'dnd',
  'check',
  'free',
  'cta',
] as const;

function bloco(t: string): Block {
  const achado = COM_AUDIO[t];
  if (!achado) throw new Error(`sem exemplo para ${t}`);
  return achado;
}

describe('textosDoBloco: os campos da tabela 2.2, um tipo por vez', () => {
  it('lead, note e key: o `text` inteiro', () => {
    expect(textosDoBloco(bloco('lead'))).toEqual(['Listen and repeat.']);
    expect(textosDoBloco(bloco('note'))).toEqual(['We use "am" with I.']);
    expect(textosDoBloco(bloco('key'))).toEqual(['I am ready.']);
  });

  it('chips: `items[].t`', () => {
    expect(textosDoBloco(bloco('chips'))).toEqual(['I', 'you']);
  });

  it('pron: só o `code`, nunca `title` nem `body`', () => {
    expect(textosDoBloco(bloco('pron'))).toEqual(['I']);
  });

  it('grid: só o `title` de cada item', () => {
    expect(textosDoBloco(bloco('grid'))).toEqual(['Monday', 'Tuesday']);
  });

  it('table: `a` e `b` de cada linha, nessa ordem', () => {
    expect(textosDoBloco(bloco('table'))).toEqual(['I am', "I'm", 'you are', "you're"]);
  });

  it('rule: só o `ex`', () => {
    expect(textosDoBloco(bloco('rule'))).toEqual(['I am happy.']);
  });

  it('compare: só o `right`. Frase errada não ganha áudio', () => {
    expect(textosDoBloco(bloco('compare'))).toEqual(['I am', 'He is']);
  });

  it('profile: cada item de `facts`', () => {
    expect(textosDoBloco(bloco('profile'))).toEqual(['She is 25.', 'She is a nurse.']);
  });

  it('cards: `tag` e depois as `lines` de cada cartão, sem a `note`', () => {
    expect(textosDoBloco(bloco('cards'))).toEqual(['MORNING', 'Good morning!', 'How are you?', 'NIGHT']);
  });

  it('rows: `items[].text`', () => {
    expect(textosDoBloco(bloco('rows'))).toEqual(['Go straight.', 'Turn left.']);
  });

  it('steps: `tag` e depois as `lines` de cada passo', () => {
    expect(textosDoBloco(bloco('steps'))).toEqual(['TURN LEFT', 'Turn left at the bank.', 'STOP']);
  });

  it('dialogue: o `text` de cada fala', () => {
    expect(textosDoBloco(bloco('dialogue'))).toEqual([
      'Excuse me, where is the museum?',
      'Go straight for two blocks.',
    ]);
  });

  it.each(SEM_AUDIO)('%s: nenhum texto', (t) => {
    expect(textosDoBloco({ t } as unknown as Block)).toEqual([]);
  });

  it('tipo desconhecido vindo do banco: lista vazia, sem erro', () => {
    expect(textosDoBloco({ t: 'inventado' } as unknown as Block)).toEqual([]);
  });

  it('14 tipos com áudio e 17 sem: os 31 do types.ts', () => {
    expect(Object.keys(COM_AUDIO)).toHaveLength(14);
    expect(SEM_AUDIO).toHaveLength(17);
  });
});

describe('ancoraDoBloco: o texto do primeiro item', () => {
  it.each([
    ['chips', 'I'],
    ['grid', 'Monday'],
    ['table', 'I am'],
    ['compare', 'I am'],
    ['profile', 'She is 25.'],
    ['cards', 'MORNING'],
    ['rows', 'Go straight.'],
    ['steps', 'TURN LEFT'],
    ['dialogue', 'Excuse me, where is the museum?'],
  ])('%s → %s', (t, esperado) => {
    expect(ancoraDoBloco(bloco(t))).toBe(esperado);
  });

  it.each(['lead', 'note', 'key', 'pron', 'rule'])('%s: sem player de bloco', (t) => {
    expect(ancoraDoBloco(bloco(t))).toBeNull();
  });

  it('lista vazia: null', () => {
    expect(ancoraDoBloco({ t: 'rows', items: [] })).toBeNull();
    expect(ancoraDoBloco({ t: 'dialogue', items: [] })).toBeNull();
  });
});

describe('textosDaPagina', () => {
  it('junta os blocos na ordem da página e tira texto vazio', () => {
    const pagina = {
      blocks: [
        { t: 'title', en: 'Hello', pt: 'Olá' },
        { t: 'chips', items: [{ t: 'I' }, { t: '  ' }] },
        { t: 'key', text: 'I am ready.' },
      ] as Block[],
    };
    expect(textosDaPagina(pagina)).toEqual(['I', 'I am ready.']);
  });

  it('nas 42 aulas: nenhuma página quebra e a âncora de bloco é sempre um texto da página', () => {
    let total = 0;
    for (const aula of LESSONS) {
      for (const pagina of aula.pages) {
        const textos = textosDaPagina(pagina);
        total += textos.length;
        for (const texto of textos) expect(texto.trim()).not.toBe('');
        for (const b of pagina.blocks) {
          const ancora = ancoraDoBloco(b);
          if (ancora !== null && ancora.trim() !== '') expect(textos).toContain(ancora);
        }
      }
    }
    // Hoje são 1494. O número exato muda com o conteúdo; abaixo de 1000 algo quebrou.
    expect(total).toBeGreaterThan(1000);
  });
});

describe('acharClip e clipsOrfaos com os textos da página', () => {
  const clip = (id: string, alvo: AudioClip['alvo'], ancora: string): AudioClip => ({
    id,
    alvo,
    ancora,
    texto: ancora,
    src: `/audio/aula-02/${id}.0badc0de.mp3`,
    categoria: 'FIXED_CHUNK',
  });

  it('apóstrofo reto na âncora casa com o curvo da tela', () => {
    const audios = [clip('lesson_002_audio_001', 'texto', "I'm")];
    const curvo = `I${String.fromCharCode(0x2019)}m`;
    expect(acharClip(audios, curvo, 'texto')?.id).toBe('lesson_002_audio_001');
  });

  it('quebra de linha na tela casa com espaço na âncora', () => {
    const audios = [clip('lesson_002_audio_002', 'texto', 'Good morning! How are you?')];
    expect(acharClip(audios, 'Good morning!\nHow are you?', 'texto')).toBeDefined();
  });

  it('maiúscula diferente não casa', () => {
    const audios = [clip('lesson_002_audio_003', 'texto', 'HE')];
    expect(acharClip(audios, 'He', 'texto')).toBeUndefined();
  });

  it('o alvo separa o botão do texto do player do bloco', () => {
    const audios = [clip('lesson_002_audio_004', 'bloco', 'I am')];
    expect(acharClip(audios, 'I am', 'texto')).toBeUndefined();
    expect(acharClip(audios, 'I am', 'bloco')?.id).toBe('lesson_002_audio_004');
  });

  it('sem lista de áudios: nenhum clipe', () => {
    expect(acharClip(undefined, 'I am', 'texto')).toBeUndefined();
  });

  it('clipe cuja âncora sumiu da página é órfão', () => {
    const pagina = { blocks: [bloco('table')] };
    const audios = [clip('lesson_002_audio_005', 'texto', "I'm"), clip('lesson_002_audio_006', 'texto', 'they are')];
    expect(clipsOrfaos(audios, textosDaPagina(pagina)).map((c) => c.id)).toEqual(['lesson_002_audio_006']);
  });

  it('página com `audios` passa na validação do conteúdo (depende do pacote 02)', () => {
    const paginas = [{ blocks: [bloco('table')], audios: [clip('lesson_002_audio_007', 'texto', 'I am')] }];
    expect(validarPaginas(paginas).ok).toBe(true);
  });
});
