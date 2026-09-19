/**
 * `src/lib/audio/aplicar.ts`: o manifesto gerado entrando nas páginas da aula.
 *
 * O que precisa ser verdade:
 * - cada página recebe exatamente os clipes dela; página sem clipe fica sem o campo;
 * - os `audios` antigos são substituídos, nunca somados;
 * - nada é mutado;
 * - sem manifesto, as páginas voltam como estavam;
 * - clipe de página inexistente é erro;
 * - `validarManifesto` recusa formato errado e id repetido.
 */
import { describe, expect, it } from 'vitest';

import { aplicarAudios, validarManifesto, type ManifestoDeAudio } from '@/lib/audio/aplicar';
import { validarPaginas } from '@/lib/content/blocks';
import type { AudioClip, LessonPage } from '@/lib/content/types';

function clip(n: number, ancora: string): AudioClip {
  const mmm = String(n).padStart(3, '0');
  return {
    id: `lesson_002_audio_${mmm}`,
    alvo: 'texto',
    ancora,
    texto: ancora,
    src: `/audio/aula-02/lesson_002_audio_${mmm}.1a2b3c4d.mp3`,
    categoria: 'GRAMMAR_IN_CONTEXT',
  };
}

function paginas(): LessonPage[] {
  return [
    { blocks: [{ t: 'lead', text: 'I am ready.' }] },
    { blocks: [{ t: 'lead', text: 'You are late.' }], audios: [clip(90, 'Texto antigo.')] },
    { blocks: [{ t: 'lead', text: 'We are here.' }] },
  ];
}

describe('aplicarAudios', () => {
  const manifesto: ManifestoDeAudio = {
    aula: 2,
    clips: [
      { pagina: 1, clip: clip(1, 'I am ready.') },
      { pagina: 3, clip: clip(2, 'We are here.') },
      { pagina: 3, clip: clip(3, 'We') },
    ],
  };

  it('põe em cada página os clipes dela, na ordem do manifesto', () => {
    const saida = aplicarAudios(paginas(), manifesto);
    expect(saida[0].audios?.map((c) => c.id)).toEqual(['lesson_002_audio_001']);
    expect(saida[2].audios?.map((c) => c.id)).toEqual(['lesson_002_audio_002', 'lesson_002_audio_003']);
  });

  it('página sem clipe no manifesto perde os áudios antigos e fica sem o campo', () => {
    const saida = aplicarAudios(paginas(), manifesto);
    expect('audios' in saida[1]).toBe(false);
  });

  it('não muda as páginas nem o manifesto recebidos', () => {
    const entrada = paginas();
    const copiaDaEntrada = structuredClone(entrada);
    const copiaDoManifesto = structuredClone(manifesto);
    aplicarAudios(entrada, manifesto);
    expect(entrada).toEqual(copiaDaEntrada);
    expect(manifesto).toEqual(copiaDoManifesto);
  });

  it('sem manifesto, devolve as páginas como estavam (cópias)', () => {
    const entrada = paginas();
    const saida = aplicarAudios(entrada, undefined);
    expect(saida).toEqual(entrada);
    expect(saida[1]).not.toBe(entrada[1]);
  });

  it('clipe de página que não existe é erro', () => {
    const torto: ManifestoDeAudio = { aula: 2, clips: [{ pagina: 4, clip: clip(1, 'I am ready.') }] };
    expect(() => aplicarAudios(paginas(), torto)).toThrow('aponta para a página 4, mas a aula tem 3 página(s)');
  });

  it('o resultado passa na validação estrita das páginas', () => {
    const saida = aplicarAudios(paginas(), manifesto);
    expect(validarPaginas(saida).ok).toBe(true);
  });
});

describe('validarManifesto', () => {
  it('aceita o formato do contrato 2.5', () => {
    const r = validarManifesto({ aula: 2, clips: [{ pagina: 3, clip: clip(1, 'I am ready.') }] });
    expect(r.ok).toBe(true);
  });

  it('recusa src fora do padrão e campo a mais', () => {
    const r = validarManifesto({
      aula: 2,
      clips: [{ pagina: 1, clip: { ...clip(1, 'I am ready.'), src: '/audio/x.mp3', voz: 'F1' } }],
    });
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.erros.some((e) => e.includes('clips[0].clip.src'))).toBe(true);
      expect(r.erros.some((e) => e.includes('`voz`'))).toBe(true);
    }
  });

  it('recusa id repetido', () => {
    const r = validarManifesto({
      aula: 2,
      clips: [
        { pagina: 1, clip: clip(1, 'I am ready.') },
        { pagina: 2, clip: clip(1, 'You are late.') },
      ],
    });
    expect(r).toEqual({ ok: false, erros: ['manifesto: o id lesson_002_audio_001 aparece mais de uma vez'] });
  });
});
