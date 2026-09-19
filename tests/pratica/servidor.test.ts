/**
 * Leitura da prática no banco de teste (pacote 06): `carregarEntradaDoPrompt`
 * e `promptDaAula`.
 *
 * Fixtures na faixa reservada ao pacote 06: módulo 98 e aulas 980 a 989,
 * criadas no `beforeAll` e apagadas no `afterAll`. O banco de teste é dividido
 * com outros arquivos, então toda conferência de "anteriores" olha só a faixa.
 *
 *   980 pronta                      981 pronta, despublicada
 *   982 pronta, arquivada           983 pendente
 *   984 ficha inválida              985 sem ficha
 *   986 ALVO dos testes, pronta     987 pronta, despublicada (depois do alvo)
 *   988 pronta, título proibido     989 pendente
 */
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import { prisma } from '@/lib/db';
import { urlDoChatGPT } from '@/lib/pratica/chatgpt';
import { carregarEntradaDoPrompt, promptDaAula } from '@/lib/pratica/servidor';
import type { FichaDePratica } from '@/lib/pratica/tipos';

const MODULO = 98;
const PRIMEIRA = 980;
const ULTIMA = 989;
const ALVO = 986;
const NA_FAIXA = { number: { gte: PRIMEIRA, lte: ULTIMA } };
const PAGINAS_VALIDAS = [{ blocks: [{ t: 'title', en: 'Fixture', pt: 'Fixture' }] }];
const INEXISTENTE = 99_999;

function ficha(numero: number, status: 'pronta' | 'pendente' = 'pronta'): FichaDePratica {
  return {
    versao: 1,
    status,
    tipo: 'conteudo',
    foco: `FOCO-${numero}`,
    conteudoAlvo: [`ALVO-${numero}`],
    expressoesFixas: [],
    comoIntegrar: [`INTEGRAR-${numero}-A`, `INTEGRAR-${numero}-B`],
    regrasDaAula: [],
    tiposDeExercicio: ['identificar', 'escolher', 'completar'],
    exemplos: [
      { tipo: 'identificar', enunciado: `ENUNCIADO-${numero}-1`, respostaDeReferencia: `RESPOSTA-${numero}-1` },
      { tipo: 'escolher', enunciado: `ENUNCIADO-${numero}-2`, respostaDeReferencia: `RESPOSTA-${numero}-2` },
      { tipo: 'completar', enunciado: `ENUNCIADO-${numero}-3`, respostaDeReferencia: `RESPOSTA-${numero}-3` },
    ],
    limites: [`LIMITE-${numero}`],
    primeiraQuestao: `PRIMEIRA-${numero}`,
    resumoAutorizado: [`RESUMO-${numero}-A`, `RESUMO-${numero}-B`, `RESUMO-${numero}-C`],
    resumoCurto: `CURTO-${numero}`,
  };
}

type Extras = { published?: boolean; archivedAt?: Date | null; practice?: unknown; title?: string };

function aula(numero: number, extras: Extras = {}) {
  return {
    number: numero,
    code: `AULA ${numero}`,
    slug: `pratica-fixture-${numero}`,
    title: extras.title ?? `Pratica ${numero}`,
    subtitle: 'Aula de teste do pacote 06',
    estimatedTime: '5 minutos',
    moduleId: MODULO,
    pages: PAGINAS_VALIDAS as object,
    published: extras.published ?? true,
    archivedAt: extras.archivedAt ?? null,
    ...(extras.practice === undefined ? {} : { practice: extras.practice as object }),
  };
}

async function limparFixtures(): Promise<void> {
  await prisma.lesson.deleteMany({ where: NA_FAIXA });
  await prisma.module.deleteMany({ where: { id: MODULO } });
}

beforeAll(async () => {
  await limparFixtures();
  await prisma.module.create({
    data: { id: MODULO, order: MODULO, title: 'Módulo de teste do pacote 06', fromLesson: PRIMEIRA, toLesson: ULTIMA },
  });
  const agora = new Date();
  await prisma.lesson.createMany({
    data: [
      aula(980, { practice: ficha(980) }),
      aula(981, { practice: ficha(981), published: false }),
      aula(982, { practice: ficha(982), archivedAt: agora }),
      aula(983, { practice: ficha(983, 'pendente') }),
      aula(984, { practice: { versao: 1, status: 'pronta' } }),
      aula(985),
      aula(986, { practice: ficha(986) }),
      aula(987, { practice: ficha(987), published: false }),
      aula(988, { practice: ficha(988), title: 'Titulo Proibido 988' }),
      aula(989, { practice: ficha(989, 'pendente') }),
    ],
  });
});

afterAll(async () => {
  await limparFixtures();
});

// A ficha inválida da 984 gera log toda vez que é lida. O espião cala o log, e um
// dos testes confere que ele saiu.
beforeEach(() => {
  vi.spyOn(console, 'error').mockImplementation(() => {});
});
afterEach(() => {
  vi.restoreAllMocks();
});

describe('carregarEntradaDoPrompt', () => {
  it('só entram as anteriores publicadas, não arquivadas e com ficha pronta', async () => {
    const entrada = await carregarEntradaDoPrompt(ALVO);
    expect(entrada).not.toBeNull();
    const daFaixa = entrada!.anteriores.filter((a) => a.numero >= PRIMEIRA && a.numero <= ULTIMA);
    expect(daFaixa.map((a) => a.numero)).toEqual([980]);
    expect(daFaixa[0].resumoAutorizado).toEqual(['RESUMO-980-A', 'RESUMO-980-B', 'RESUMO-980-C']);
    expect(daFaixa[0].resumoCurto).toBe('CURTO-980');
    expect(entrada!.aula).toEqual({ numero: ALVO, titulo: 'Pratica 986' });
    expect(entrada!.ficha.foco).toBe('FOCO-986');
  });

  it('ficha inválida de uma anterior fica de fora e gera log', async () => {
    await carregarEntradaDoPrompt(ALVO);
    expect(console.error).toHaveBeenCalledWith(expect.stringContaining('[pratica] aula 984: ficha inválida'));
  });

  it('a próxima pula a aula despublicada', async () => {
    const entrada = await carregarEntradaDoPrompt(ALVO);
    expect(entrada!.proxima?.numero).toBe(988);
  });

  it.each([981, 982, 983, 984, 985, 989, INEXISTENTE])('aula %i: sem prompt (null)', async (numero) => {
    await expect(carregarEntradaDoPrompt(numero)).resolves.toBeNull();
  });

  it('ficha substituta (painel): monta mesmo com a aula despublicada ou pendente', async () => {
    const despublicada = await carregarEntradaDoPrompt(987, { fichaSubstituta: ficha(987) });
    expect(despublicada?.ficha.foco).toBe('FOCO-987');
    const pendente = await carregarEntradaDoPrompt(983, { fichaSubstituta: ficha(983, 'pendente') });
    expect(pendente?.ficha.status).toBe('pendente');
    await expect(carregarEntradaDoPrompt(INEXISTENTE, { fichaSubstituta: ficha(1) })).resolves.toBeNull();
  });
});

describe('promptDaAula', () => {
  it('PREMIUM na aula pronta: prompt com a anterior e sem nada da próxima', async () => {
    const resultado = await promptDaAula(ALVO, 'PREMIUM');
    expect(resultado.ok).toBe(true);
    if (!resultado.ok) return;
    expect(resultado.prompt).toContain('FOCO-986');
    expect(resultado.prompt).toContain('RESUMO-980-A');
    for (const proibido of ['RESUMO-981', 'RESUMO-982', 'RESUMO-983', 'Titulo Proibido', '988', 'FOCO-987']) {
      expect(resultado.prompt).not.toContain(proibido);
    }
    expect(resultado.urlDoChatGPT).toBe(urlDoChatGPT(resultado.prompt));
  });

  it.each([983, 984, 985, 989, 981, INEXISTENTE])('aula %i: sem-ficha', async (numero) => {
    await expect(promptDaAula(numero, 'PREMIUM')).resolves.toEqual({ ok: false, motivo: 'sem-ficha' });
  });

  it('ESSENCIAL: sem-plano, mesmo com a ficha pronta', async () => {
    await expect(promptDaAula(ALVO, 'ESSENCIAL')).resolves.toEqual({ ok: false, motivo: 'sem-plano' });
  });
});
