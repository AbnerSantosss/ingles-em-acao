/**
 * Mapa curricular (pacote 11): `content/mapa-curricular.json` contra `content/course-data.mjs`.
 * Não usa o banco.
 */
import { beforeAll, describe, expect, it } from 'vitest';

import {
  carregarAulas,
  caminhoDoMapa,
  lerJson,
  tituloDepoisDoPacote10,
} from '../../scripts/conteudo/comum.mjs';
import { validarMapa } from '../../scripts/conteudo/validar-mapa.mjs';

type Aula = { id: number; title: string; pages: unknown[] };
type Entrada = {
  numero: number;
  titulo: string;
  tipo: string;
  status: string;
  apresenta: Record<string, string[]>;
  reutiliza: string[];
  textosEmIngles: unknown[];
  nota?: string;
};
type Mapa = { versao: number; aulas: Entrada[] };

let aulas: Aula[];
let mapa: Mapa;

beforeAll(async () => {
  aulas = (await carregarAulas()) as Aula[];
  mapa = lerJson(caminhoDoMapa()) as Mapa;
});

describe('mapa curricular real', () => {
  it('existe e passa no validador sem erro', () => {
    expect(mapa).not.toBeNull();
    const { erros } = validarMapa(mapa, aulas, { parcial: false });
    expect(erros).toEqual([]);
  });

  it('tem as 42 aulas, em ordem', () => {
    expect(mapa.aulas.map((e) => e.numero)).toEqual(Array.from({ length: 42 }, (_, i) => i + 1));
  });

  // A pendência da Aula 05 foi resolvida em 2026-09-19: a aula tem as 9 páginas do e-book.
  it('traz a Aula 05 pronta, como revisão que só reutiliza', () => {
    const cinco = mapa.aulas[4];
    expect(cinco.tipo).toBe('revisao');
    expect(cinco.status).toBe('pronta');
    expect(Object.values(cinco.apresenta).flat()).toEqual([]);
    expect(cinco.reutiliza.length).toBeGreaterThan(0);
    expect(cinco.textosEmIngles.length).toBeGreaterThan(0);
    expect(cinco.nota).toBeUndefined();
  });

  it('traz a Aula 01 exatamente como no exemplo do pacote 11', () => {
    const um = mapa.aulas[0];
    expect(um.apresenta.vocabulario).toEqual(['I', 'you', 'he', 'she', 'it', 'we', 'they']);
    expect(um.reutiliza).toEqual([]);
    expect(um.textosEmIngles).toHaveLength(13);
  });
});

describe('validarMapa com mapas de teste', () => {
  function mapaDeDuasAulas(): Mapa {
    return JSON.parse(JSON.stringify({ versao: 1, aulas: mapa.aulas.slice(0, 2) })) as Mapa;
  }

  it('acusa item apresentado duas vezes', () => {
    const m = mapaDeDuasAulas();
    m.aulas[1].apresenta.vocabulario.push('she');
    const { erros } = validarMapa(m, aulas, { parcial: true });
    expect(erros.some((e: string) => e.includes('"she" já foi apresentado na Aula 1'))).toBe(true);
  });

  it('acusa reutiliza de item que ainda não apareceu', () => {
    const m = mapaDeDuasAulas();
    m.aulas[1].reutiliza.push('from');
    const { erros } = validarMapa(m, aulas, { parcial: true });
    expect(erros.some((e: string) => e.includes('reutiliza "from"'))).toBe(true);
  });

  it('acusa título diferente do título depois do pacote 10', () => {
    const m = mapaDeDuasAulas();
    m.aulas[1].titulo = 'Verb to be Affirmative';
    const { erros } = validarMapa(m, aulas, { parcial: true });
    expect(erros.some((e: string) => e.startsWith('Aula 2: "titulo"'))).toBe(true);
  });

  it('exige 42 aulas sem --parcial', () => {
    const { erros } = validarMapa(mapaDeDuasAulas(), aulas, { parcial: false });
    expect(erros[0]).toContain('Precisa ter 42');
  });
});

describe('tituloDepoisDoPacote10', () => {
  it('troca o travessão por dois-pontos e a meia-risca por hífen', () => {
    const travessao = String.fromCodePoint(0x2014);
    const meiaRisca = String.fromCodePoint(0x2013);
    expect(tituloDepoisDoPacote10(`Verb to be ${travessao} Affirmative`)).toBe('Verb to be: Affirmative');
    expect(tituloDepoisDoPacote10(`How Often? ${travessao} Frequency`)).toBe('How Often? Frequency');
    expect(tituloDepoisDoPacote10(`Numbers 1${meiaRisca}100`)).toBe('Numbers 1-100');
    expect(tituloDepoisDoPacote10('Subject Pronouns')).toBe('Subject Pronouns');
  });
});
