/**
 * `src/lib/audio/ancora.ts`: como o renderizador acha o áudio de um texto exibido.
 *
 * O que precisa ser verdade:
 * - aspas curvas, espaço duplo e forma Unicode não impedem o casamento;
 * - maiúscula e minúscula continuam diferentes ("HE" não é "He");
 * - o alvo ('texto' ou 'bloco') filtra;
 * - clipe sem texto correspondente na página é órfão.
 */
import { describe, expect, it } from 'vitest';

import { acharClip, clipsOrfaos, normalizarAncora } from '@/lib/audio/ancora';
import type { AudioClip } from '@/lib/content/types';

function clip(id: number, ancora: string, alvo: AudioClip['alvo'] = 'texto'): AudioClip {
  const mmm = String(id).padStart(3, '0');
  return {
    id: `lesson_001_audio_${mmm}`,
    alvo,
    ancora,
    texto: ancora,
    src: `/audio/aula-01/lesson_001_audio_${mmm}.0123abcd.mp3`,
    categoria: 'VOCABULARY_PRONUNCIATION',
  };
}

describe('normalizarAncora', () => {
  it('troca aspas curvas por retas', () => {
    expect(normalizarAncora('I’m not.')).toBe("I'm not.");
    expect(normalizarAncora('“Hello”')).toBe('"Hello"');
    expect(normalizarAncora('‘ok’')).toBe("'ok'");
  });

  it('junta espaços e tira as pontas', () => {
    expect(normalizarAncora('  I   am\n ready. ')).toBe('I am ready.');
  });

  it('usa a forma NFC (acento composto e decomposto viram o mesmo texto)', () => {
    expect(normalizarAncora('café')).toBe(normalizarAncora('café'));
  });

  it('não muda maiúsculas', () => {
    expect(normalizarAncora('HE')).toBe('HE');
    expect(normalizarAncora('HE')).not.toBe(normalizarAncora('He'));
  });
});

describe('acharClip', () => {
  const audios = [clip(1, 'I am ready.'), clip(2, 'HE'), clip(3, 'Hi! I am Ana.', 'bloco'), clip(4, 'I am ready.')];

  it('acha pelo texto exibido, com aspas e espaços diferentes', () => {
    expect(acharClip([clip(9, 'I’m fine.')], "I'm   fine.", 'texto')?.id).toBe('lesson_001_audio_009');
  });

  it('devolve o primeiro que casa', () => {
    expect(acharClip(audios, 'I am ready.', 'texto')?.id).toBe('lesson_001_audio_001');
  });

  it('respeita maiúsculas', () => {
    expect(acharClip(audios, 'HE', 'texto')?.id).toBe('lesson_001_audio_002');
    expect(acharClip(audios, 'He', 'texto')).toBeUndefined();
  });

  it('filtra pelo alvo', () => {
    expect(acharClip(audios, 'Hi! I am Ana.', 'texto')).toBeUndefined();
    expect(acharClip(audios, 'Hi! I am Ana.', 'bloco')?.id).toBe('lesson_001_audio_003');
  });

  it('página sem áudio devolve undefined', () => {
    expect(acharClip(undefined, 'I am ready.', 'texto')).toBeUndefined();
    expect(acharClip([], 'I am ready.', 'texto')).toBeUndefined();
  });
});

describe('clipsOrfaos', () => {
  it('lista só os clipes cuja âncora não aparece na página', () => {
    const audios = [clip(1, 'I am ready.'), clip(2, 'You are late.')];
    expect(clipsOrfaos(audios, ['I am   ready.', 'Outro texto']).map((c) => c.id)).toEqual(['lesson_001_audio_002']);
  });

  it('sem áudio não há órfão', () => {
    expect(clipsOrfaos(undefined, ['qualquer'])).toEqual([]);
  });
});
