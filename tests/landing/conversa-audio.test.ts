/**
 * O áudio da conversa de exemplo da landing (`scripts/audio/landing.py`) precisa
 * dizer o que está escrito no cartão. Quem mudar as falas em `copy.ts` e não
 * gerar o áudio de novo deixa o manifesto para trás, e este teste acusa.
 */
import { existsSync } from 'node:fs';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

import gravacao from '@/components/landing/conversa-audio.json';
import { copyDaLanding } from '@/components/landing/copy';

describe('áudio da conversa de exemplo da landing', () => {
  it('tem as mesmas falas do cartão, na mesma ordem', () => {
    expect(gravacao.falas.map(({ autor, texto }) => ({ autor, texto }))).toEqual(
      copyDaLanding.ia.chat.map(({ autor, texto }) => ({ autor, texto })),
    );
  });

  it('usa uma voz para a IA e outra para o aluno', () => {
    const vozesDe = (autor: string) =>
      new Set(gravacao.falas.filter((fala) => fala.autor === autor).map((fala) => fala.voz));
    const [daIa, doAluno] = [vozesDe('ia'), vozesDe('aluno')];

    expect(daIa.size).toBe(1);
    expect(doAluno.size).toBe(1);
    expect([...daIa][0]).not.toBe([...doAluno][0]);
  });

  it('tem as falas em sequência, sem sobreposição, dentro do arquivo', () => {
    let fimDaAnterior = 0;
    for (const fala of gravacao.falas) {
      expect(fala.inicioMs, fala.texto).toBeGreaterThanOrEqual(fimDaAnterior);
      expect(fala.duracaoMs, fala.texto).toBeGreaterThan(0);
      fimDaAnterior = fala.inicioMs + fala.duracaoMs;
    }
    expect(fimDaAnterior).toBeLessThanOrEqual(gravacao.duracaoMs);
  });

  it('aponta para um MP3 que existe em public/', () => {
    expect(gravacao.src).toMatch(/^\/audio\/landing\/conversa\.[0-9a-f]{8}\.mp3$/);
    expect(existsSync(path.join(process.cwd(), 'public', gravacao.src))).toBe(true);
  });
});
