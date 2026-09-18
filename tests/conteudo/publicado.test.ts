/**
 * Visibilidade do conteúdo para o aluno (BACKOFFICE D7, §6.4) contra o banco de teste.
 *
 * As três regras de `src/lib/content/publicado.ts`:
 * 1. linha publicada e não arquivada → conteúdo do banco, validado;
 * 2. sem linha → conteúdo estático;
 * 3. linha despublicada ou arquivada → `null` (404), NUNCA o estático.
 *
 * Fixtures na faixa reservada a esta frente: módulo 90 e aulas 900–919, criadas
 * no `beforeAll` e apagadas no `afterAll`. Como o catálogo estático só vai até a
 * aula 42, ele é estendido por um dublê com aulas "estáticas" 901, 906 e 907 —
 * é o que permite provar a regra 3 (linha despublicada ganha do estático) sem
 * tocar nas aulas reais.
 */
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';

const estaticas = vi.hoisted(() => {
  const paginas = [{ blocks: [{ t: 'title' as const, en: 'Estática', pt: 'Estática' }] }];
  const aula = (numero: number, slug: string) => ({
    aula: {
      id: numero,
      code: `AULA ${numero}`,
      title: `Estática ${numero}`,
      sub: 'Conteúdo do arquivo',
      time: '5 minutos',
      pages: paginas,
    },
    resumo: {
      id: numero,
      code: `AULA ${numero}`,
      slug,
      title: `Estática ${numero}`,
      subtitle: 'Conteúdo do arquivo',
      time: '5 minutos',
      cover: null,
      pageCount: paginas.length,
      moduleId: 90,
    },
  });
  return [aula(901, 'a1-estatica-901'), aula(906, 'a1-estatica-906'), aula(907, 'a1-estatica-907')];
});

vi.mock('@/lib/content/lessons', async (importOriginal) => {
  const original = await importOriginal<typeof import('@/lib/content/lessons')>();
  const porSlug = (slug: string) => estaticas.find((e) => e.resumo.slug === slug) ?? null;
  const porNumero = (numero: number) => estaticas.find((e) => e.aula.id === numero) ?? null;
  return {
    ...original,
    getLessonBySlug: (slug: string) => porSlug(slug)?.aula ?? original.getLessonBySlug(slug),
    getLessonSummaryBySlug: (slug: string) => porSlug(slug)?.resumo ?? original.getLessonSummaryBySlug(slug),
    getLessonByNumber: (numero: number) => porNumero(numero)?.aula ?? original.getLessonByNumber(numero),
    getLessonSummaryByNumber: (numero: number) =>
      porNumero(numero)?.resumo ?? original.getLessonSummaryByNumber(numero),
  };
});

import {
  aulasEmOrdem,
  carregarAulaPublicadaPorNumero,
  carregarAulaPublicadaPorSlug,
  carregarTrilhaPublicada,
  listarAulasPublicadas,
  listarModulosPublicados,
} from '@/lib/content/publicado';
import { prisma } from '@/lib/db';
import { carregarVideoDaAula, linkRenovadoDaAula } from '@/lib/video/aula';

const MODULO = 90;
const PRIMEIRA = 900;
const ULTIMA = 919;
const NA_FAIXA = { number: { gte: PRIMEIRA, lte: ULTIMA } };
const PAGINAS_VALIDAS = [{ blocks: [{ t: 'title', en: 'Fixture', pt: 'Fixture' }] }];
const ID_YOUTUBE = 'dQw4w9WgXcQ';

type Extras = {
  slug?: string;
  published?: boolean;
  archivedAt?: Date | null;
  pages?: unknown;
  videoKind?: 'YOUTUBE' | 'VIMEO' | 'URL' | 'UPLOAD' | null;
  videoRef?: string | null;
  videoUrl?: string | null;
};

function aula(numero: number, extras: Extras = {}) {
  return {
    number: numero,
    code: `AULA ${numero}`,
    slug: extras.slug ?? `a1-fixture-${numero}`,
    title: `Fixture ${numero}`,
    subtitle: 'Aula de teste da frente A1',
    estimatedTime: '5 minutos',
    moduleId: MODULO,
    pages: (extras.pages ?? PAGINAS_VALIDAS) as object,
    published: extras.published ?? true,
    archivedAt: extras.archivedAt ?? null,
    videoKind: extras.videoKind ?? null,
    videoRef: extras.videoRef ?? null,
    videoUrl: extras.videoUrl ?? null,
  };
}

async function limparFixtures(): Promise<void> {
  await prisma.lesson.deleteMany({ where: NA_FAIXA });
  await prisma.module.deleteMany({ where: { id: MODULO } });
}

/** Só as aulas da faixa desta frente (o banco de teste é dividido com outras). */
function daFaixa<T extends { id: number }>(lista: T[]): number[] {
  return lista.filter((item) => item.id >= PRIMEIRA && item.id <= ULTIMA).map((item) => item.id);
}

beforeAll(async () => {
  await limparFixtures();
  await prisma.module.create({
    data: { id: MODULO, order: MODULO, title: 'Módulo de teste A1', fromLesson: PRIMEIRA, toLesson: ULTIMA },
  });
  const agora = new Date();
  await prisma.lesson.createMany({
    data: [
      aula(900),
      // Rascunho com o MESMO slug de uma aula estática: tem de dar 404, não o arquivo.
      aula(901, { slug: 'a1-estatica-901', published: false }),
      aula(902, { archivedAt: agora }),
      aula(903, { pages: [{ blocks: [] }] }),
      aula(904, { published: false, archivedAt: agora }),
      aula(905),
      // 906 não tem linha: o estático responde.
      // 907 trocou de slug no painel: o link antigo (slug do arquivo) tem de dar 404.
      aula(907, { slug: 'a1-novo-907' }),
      // 908 não tem linha nem estático.
      aula(910, { videoKind: 'YOUTUBE', videoRef: `${ID_YOUTUBE}?t=42` }),
      aula(911, { videoKind: 'YOUTUBE', videoRef: 'javascript:alert(1)' }),
      aula(912, { videoKind: 'YOUTUBE', videoRef: ID_YOUTUBE, archivedAt: agora }),
      aula(913, { videoUrl: `https://youtu.be/${ID_YOUTUBE}` }),
      aula(914),
      aula(915, { videoKind: 'UPLOAD', videoRef: 'clx1234567890abc', published: false }),
    ],
  });
});

afterAll(async () => {
  await limparFixtures();
});

describe('aula por número', () => {
  it('regra 1: publicada e não arquivada → vem do banco, com o resumo montado da linha', async () => {
    const resultado = await carregarAulaPublicadaPorNumero(900);
    expect(resultado?.fonte).toBe('banco');
    expect(resultado?.aula).toEqual({
      id: 900,
      code: 'AULA 900',
      title: 'Fixture 900',
      sub: 'Aula de teste da frente A1',
      time: '5 minutos',
      pages: PAGINAS_VALIDAS,
    });
    expect(resultado?.resumo).toEqual({
      id: 900,
      code: 'AULA 900',
      slug: 'a1-fixture-900',
      title: 'Fixture 900',
      subtitle: 'Aula de teste da frente A1',
      time: '5 minutos',
      cover: null,
      pageCount: 1,
      moduleId: MODULO,
    });
  });

  it('regra 3: rascunho → null, mesmo existindo aula estática com esse número', async () => {
    expect(await carregarAulaPublicadaPorNumero(901)).toBeNull();
  });

  it('regra 3: arquivada (publicada ou não) → null', async () => {
    expect(await carregarAulaPublicadaPorNumero(902)).toBeNull();
    expect(await carregarAulaPublicadaPorNumero(904)).toBeNull();
  });

  it('publicada com conteúdo que não valida → null (nunca meia aula na tela)', async () => {
    const erro = vi.spyOn(console, 'error').mockImplementation(() => {});
    try {
      expect(await carregarAulaPublicadaPorNumero(903)).toBeNull();
      expect(erro).toHaveBeenCalledWith(expect.stringContaining('aula 903 publicada com conteúdo inválido'));
    } finally {
      erro.mockRestore();
    }
  });

  it('regra 2: sem linha → estático; sem linha e sem estático → null', async () => {
    const resultado = await carregarAulaPublicadaPorNumero(906);
    expect(resultado?.fonte).toBe('estatico');
    expect(resultado?.aula.title).toBe('Estática 906');
    expect(await carregarAulaPublicadaPorNumero(908)).toBeNull();
  });
});

describe('aula por slug', () => {
  it('publicada → banco', async () => {
    expect((await carregarAulaPublicadaPorSlug('a1-fixture-900'))?.fonte).toBe('banco');
  });

  it('rascunho com slug de aula estática → null, nunca o arquivo', async () => {
    expect(await carregarAulaPublicadaPorSlug('a1-estatica-901')).toBeNull();
  });

  it('arquivada e com conteúdo inválido → null', async () => {
    const erro = vi.spyOn(console, 'error').mockImplementation(() => {});
    try {
      expect(await carregarAulaPublicadaPorSlug('a1-fixture-902')).toBeNull();
      expect(await carregarAulaPublicadaPorSlug('a1-fixture-903')).toBeNull();
      expect(await carregarAulaPublicadaPorSlug('a1-fixture-904')).toBeNull();
    } finally {
      erro.mockRestore();
    }
  });

  it('sem linha → estático', async () => {
    expect((await carregarAulaPublicadaPorSlug('a1-estatica-906'))?.fonte).toBe('estatico');
  });

  it('slug trocado no painel: o novo abre do banco', async () => {
    expect((await carregarAulaPublicadaPorSlug('a1-novo-907'))?.fonte).toBe('banco');
    expect((await carregarAulaPublicadaPorNumero(907))?.resumo.slug).toBe('a1-novo-907');
  });

  it('slug trocado no painel: o antigo (do arquivo) nunca cai no estático', async () => {
    expect((await carregarAulaPublicadaPorSlug('a1-estatica-907'))?.fonte).not.toBe('estatico');
  });

  // Regressão do defeito relatado pela frente de QA: a linha achada só pelo número
  // (`?? linhas[0]`) servia a aula também no slug antigo (§6.7).
  it('slug trocado no painel: o antigo (do arquivo) dá 404', async () => {
    expect(await carregarAulaPublicadaPorSlug('a1-estatica-907')).toBeNull();
  });

  it('slug que não existe em lugar nenhum → null', async () => {
    expect(await carregarAulaPublicadaPorSlug('a1-nao-existe-999')).toBeNull();
  });
});

describe('listas e trilha', () => {
  it('listarAulasPublicadas traz só publicadas e não arquivadas, em ordem de número', async () => {
    const aulas = await listarAulasPublicadas();
    // 903 é publicada com conteúdo inválido: a lista não abre as páginas, então ela
    // aparece — e a tela da aula responde 404 (ver o teste por número).
    expect(daFaixa(aulas)).toEqual([900, 903, 905, 907, 910, 911, 913, 914]);
    for (const item of aulas.filter((a) => a.id >= PRIMEIRA && a.id <= ULTIMA)) {
      expect(item.fonte).toBe('banco');
    }
  });

  it('a trilha agrupa pelo moduleId real', async () => {
    const trilha = await carregarTrilhaPublicada();
    const grupo = trilha.grupos.find((g) => g.modulo.id === MODULO);
    expect(grupo?.modulo).toEqual({
      id: MODULO,
      order: MODULO,
      title: 'Módulo de teste A1',
      from: PRIMEIRA,
      to: ULTIMA,
      fonte: 'banco',
    });
    expect(daFaixa(grupo?.aulas ?? [])).toEqual([900, 903, 905, 907, 910, 911, 913, 914]);
    expect(daFaixa(trilha.soltas)).toEqual([]);
    expect(trilha.total).toBe(trilha.grupos.reduce((soma, g) => soma + g.aulas.length, 0) + trilha.soltas.length);
  });

  it('despublicar tira a aula da lista, da trilha e da leitura; republicar devolve', async () => {
    await prisma.lesson.update({ where: { number: 905 }, data: { published: false } });
    try {
      expect(daFaixa(await listarAulasPublicadas())).not.toContain(905);
      const trilha = await carregarTrilhaPublicada();
      expect(daFaixa(aulasEmOrdem(trilha))).not.toContain(905);
      expect(await carregarAulaPublicadaPorNumero(905)).toBeNull();
      expect(await carregarAulaPublicadaPorSlug('a1-fixture-905')).toBeNull();
    } finally {
      await prisma.lesson.update({ where: { number: 905 }, data: { published: true } });
    }
    expect(daFaixa(await listarAulasPublicadas())).toContain(905);
    expect((await carregarAulaPublicadaPorNumero(905))?.fonte).toBe('banco');
  });

  it('arquivar tira a aula de tudo, mesmo publicada', async () => {
    await prisma.lesson.update({ where: { number: 905 }, data: { archivedAt: new Date() } });
    try {
      expect(daFaixa(await listarAulasPublicadas())).not.toContain(905);
      expect(await carregarAulaPublicadaPorNumero(905)).toBeNull();
    } finally {
      await prisma.lesson.update({ where: { number: 905 }, data: { archivedAt: null } });
    }
  });

  it('módulo arquivado: some da lista de módulos, e as aulas dele vão para as soltas (no fim)', async () => {
    await prisma.module.update({ where: { id: MODULO }, data: { archivedAt: new Date() } });
    try {
      const modulos = await listarModulosPublicados();
      expect(modulos.map((m) => m.id)).not.toContain(MODULO);

      const trilha = await carregarTrilhaPublicada();
      expect(trilha.grupos.find((g) => g.modulo.id === MODULO)).toBeUndefined();
      expect(daFaixa(trilha.soltas)).toEqual([900, 903, 905, 907, 910, 911, 913, 914]);

      // As soltas vêm depois de todas as aulas agrupadas.
      const ordem = aulasEmOrdem(trilha);
      const agrupadas = trilha.grupos.reduce((soma, g) => soma + g.aulas.length, 0);
      expect(ordem.slice(agrupadas).map((a) => a.id)).toEqual(trilha.soltas.map((a) => a.id));
    } finally {
      await prisma.module.update({ where: { id: MODULO }, data: { archivedAt: null } });
    }
  });
});

describe('vídeo da aula', () => {
  it('YouTube válido volta normalizado, com o início', async () => {
    expect(await carregarVideoDaAula(910)).toEqual({
      fonte: { kind: 'youtube', id: ID_YOUTUBE, start: 42 },
      padrao: false,
      atualizadoEm: null,
    });
  });

  it('valor gravado que não passa mais na allowlist → sem painel', async () => {
    expect(await carregarVideoDaAula(911)).toBeNull();
  });

  it('aula arquivada → sem vídeo', async () => {
    expect(await carregarVideoDaAula(912)).toBeNull();
  });

  it('coluna legada videoUrl passa pelo parser', async () => {
    expect((await carregarVideoDaAula(913))?.fonte).toEqual({ kind: 'youtube', id: ID_YOUTUBE });
  });

  it('sem vídeo, número inválido ou aula inexistente → null', async () => {
    expect(await carregarVideoDaAula(914)).toBeNull();
    expect(await carregarVideoDaAula(0)).toBeNull();
    expect(await carregarVideoDaAula(1.5)).toBeNull();
    expect(await carregarVideoDaAula(918)).toBeNull();
  });

  it('renovação de link: só para vídeo enviado de aula publicada', async () => {
    // 910 é YouTube (não há link a renovar); 915 é upload, mas está em rascunho.
    expect(await linkRenovadoDaAula(910)).toBeNull();
    expect(await linkRenovadoDaAula(915)).toBeNull();
    expect(await linkRenovadoDaAula(-1)).toBeNull();
  });
});
