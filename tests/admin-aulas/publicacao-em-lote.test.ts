/**
 * Publicar/despublicar em lote (`alterarPublicacaoEmLote`, `src/lib/admin/publicacao.ts`)
 * contra o banco de teste.
 *
 * O que precisa ser verdade:
 * - cada aula é julgada sozinha: uma inválida (§3.5, esquema, arquivada) fica
 *   bloqueada e as outras seguem;
 * - exatamente **uma** linha de auditoria por aula existente (ALLOW ou DENY) —
 *   id que não existe não tem `Lesson:N` e não grava nada;
 * - o relatório diz, por aula, o desfecho e o motivo;
 * - a ação individual e o lote são o mesmo código: mesmo desfecho, mesmo motivo.
 *
 * Fixtures na faixa desta frente: módulo 95 e aulas 960–979, apagadas no
 * `afterAll` junto com o admin de teste e as linhas de auditoria dele.
 */
import { randomUUID } from 'node:crypto';

import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { codigoDaAula } from '@/lib/admin/aulas';
import {
  alterarPublicacaoEmLote,
  despublicarAula,
  LIMITE_DO_LOTE,
  publicarAula,
} from '@/lib/admin/publicacao';
import type { SessionUser } from '@/lib/auth/session';
import { prisma } from '@/lib/db';

const MODULO = 95;
const PRIMEIRA = 960;
const ULTIMA = 979;
const NA_FAIXA = { number: { gte: PRIMEIRA, lte: ULTIMA } };

let ator: SessionUser;
const ids = new Map<number, string>();

function id(numero: number): string {
  const achado = ids.get(numero);
  if (!achado) throw new Error(`fixture ${numero} não foi criada`);
  return achado;
}

/** Duas páginas válidas na §3.5 (só avisos), com ids próprios da aula. */
function conteudoValido(numero: number) {
  return [
    {
      blocks: [
        { t: 'title', en: `Lesson ${numero}`, pt: `Aula ${numero}` },
        {
          t: 'mc',
          id: `a${numero}mc1`,
          title: 'Escolha a forma certa',
          questions: [{ q: 'I ___ a student.', options: ['am', 'is'], answer: 0 }],
        },
      ],
    },
    {
      blocks: [
        {
          t: 'cta',
          items: [{ icon: 'mic', title: 'Pratique', body: 'Fale com a IA', plan: 'PREMIUM', btn: 'Ir' }],
        },
      ],
    },
  ];
}

/** Passa no esquema, mas o gabarito aponta para a opção 5 de 2 — erro da §3.5. */
function conteudoComGabaritoForaDoIntervalo(numero: number) {
  return [
    {
      blocks: [
        { t: 'title', en: `Lesson ${numero}`, pt: `Aula ${numero}` },
        {
          t: 'mc',
          id: `a${numero}mc1`,
          title: 'Gabarito errado',
          questions: [{ q: 'I ___ a student.', options: ['am', 'is'], answer: 5 }],
        },
      ],
    },
  ];
}

async function criarAula(
  numero: number,
  dados: {
    pages: unknown;
    draftPages?: unknown;
    published?: boolean;
    archivedAt?: Date | null;
  },
): Promise<void> {
  const aula = await prisma.lesson.create({
    data: {
      number: numero,
      code: codigoDaAula(numero),
      slug: `a2-lote-${numero}`,
      title: `Fixture ${numero}`,
      subtitle: 'Aula de teste da frente A2',
      estimatedTime: '5 minutos',
      moduleId: MODULO,
      pages: dados.pages as object,
      ...(dados.draftPages !== undefined ? { draftPages: dados.draftPages as object } : {}),
      published: dados.published ?? false,
      publishedAt: dados.published ? new Date('2026-09-01T12:00:00Z') : null,
      archivedAt: dados.archivedAt ?? null,
    },
  });
  ids.set(numero, aula.id);
}

async function limparFixtures(): Promise<void> {
  const aulas = await prisma.lesson.findMany({ where: NA_FAIXA, select: { id: true } });
  const lessonIds = aulas.map((aula) => aula.id);
  await prisma.mediaUsage.deleteMany({ where: { lessonId: { in: lessonIds } } });
  await prisma.lesson.deleteMany({ where: { id: { in: lessonIds } } });
  await prisma.module.deleteMany({ where: { id: MODULO, lessons: { none: {} } } });
}

/**
 * Roda `acao` e devolve só as linhas de auditoria que ela gravou. Compara ids,
 * não `createdAt`: o relógio do Postgres e o do Node não precisam concordar.
 */
async function auditoriaDe<T>(acao: () => Promise<T>) {
  const antes = new Set(
    (await prisma.auditLog.findMany({ where: { actorId: ator.id }, select: { id: true } })).map(
      (linha) => linha.id,
    ),
  );
  const resultado = await acao();
  const linhas = (
    await prisma.auditLog.findMany({ where: { actorId: ator.id }, orderBy: { createdAt: 'asc' } })
  ).filter((linha) => !antes.has(linha.id));
  return { resultado, linhas };
}

function porRecurso<T extends { resource: string }>(linhas: T[]): Map<string, T[]> {
  const mapa = new Map<string, T[]>();
  for (const linha of linhas) mapa.set(linha.resource, [...(mapa.get(linha.resource) ?? []), linha]);
  return mapa;
}

beforeAll(async () => {
  await limparFixtures();

  const usuario = await prisma.user.create({
    data: {
      name: 'Admin de teste A2 (lote)',
      email: `a2-${randomUUID().slice(0, 12)}@teste.local`,
      passwordHash: 'nao-usado-nos-testes',
      role: 'ADMIN',
      plan: 'PREMIUM',
    },
  });
  ator = {
    id: usuario.id,
    name: usuario.name,
    email: usuario.email,
    photoUrl: null,
    role: 'ADMIN',
    plan: 'PREMIUM',
    emailVerifiedAt: null,
  };

  await prisma.module.upsert({
    where: { id: MODULO },
    update: {},
    create: {
      id: MODULO,
      order: MODULO,
      title: 'Módulo de teste A2',
      fromLesson: 950,
      toLesson: ULTIMA,
    },
  });

  await criarAula(960, { pages: conteudoValido(960) });
  await criarAula(961, { pages: conteudoValido(961) });
  await criarAula(962, { pages: conteudoComGabaritoForaDoIntervalo(962) });
  await criarAula(963, { pages: [{ blocks: [] }] });
  await criarAula(964, { pages: conteudoValido(964), archivedAt: new Date() });
  await criarAula(965, { pages: conteudoValido(965), published: true });
  await criarAula(966, {
    pages: conteudoValido(966),
    draftPages: [...conteudoValido(966), { blocks: [{ t: 'title', en: 'Extra', pt: 'Extra' }] }],
  });

  // Aluno "na página 8" de uma aula que tem 2: a publicação reposiciona.
  await prisma.lessonProgress.create({
    data: { userId: ator.id, lessonId: id(966), status: 'COMPLETED', currentPage: 7 },
  });
});

afterAll(async () => {
  await limparFixtures();
  if (ator) {
    await prisma.auditLog.deleteMany({ where: { actorId: ator.id } });
    await prisma.user.deleteMany({ where: { id: ator.id } });
  }
});

describe('publicar em lote', () => {
  it('uma aula com erro da §3.5 fica bloqueada sozinha; as outras vão ao ar', async () => {
    const { resultado, linhas } = await auditoriaDe(() =>
      alterarPublicacaoEmLote({ ator, ids: [id(960), id(962), id(961)], operacao: 'publicar' }),
    );

    expect(resultado.map((r) => [r.numero, r.desfecho])).toEqual([
      [960, 'publicada'],
      [961, 'publicada'],
      [962, 'bloqueada'],
    ]);
    const bloqueada = resultado[2];
    expect(bloqueada.motivo).toBe('o conteúdo tem 1 erro de validação (§3.5)');
    expect(bloqueada.erros).toHaveLength(1);
    expect(bloqueada.erros[0]).toContain('gabarito 5');
    expect(resultado[0].motivo).toBe('foi ao ar');
    expect(resultado[0].erros).toEqual([]);

    const aulas = await prisma.lesson.findMany({
      where: { number: { in: [960, 961, 962] } },
      select: { number: true, published: true, publishedAt: true },
      orderBy: { number: 'asc' },
    });
    expect(aulas.map((a) => [a.number, a.published])).toEqual([
      [960, true],
      [961, true],
      [962, false],
    ]);
    expect(aulas[0].publishedAt).not.toBeNull();
    expect(aulas[2].publishedAt).toBeNull();

    // Exatamente uma linha por aula.
    expect(linhas).toHaveLength(3);
    const linhasPorAula = porRecurso(linhas);
    expect([...linhasPorAula.keys()].sort()).toEqual(['Lesson:960', 'Lesson:961', 'Lesson:962']);
    for (const grupo of linhasPorAula.values()) expect(grupo).toHaveLength(1);

    for (const linha of linhas) expect(linha.action).toBe('lesson.publish');
    expect(linhasPorAula.get('Lesson:960')?.[0].outcome).toBe('ALLOW');
    expect(linhasPorAula.get('Lesson:961')?.[0].outcome).toBe('ALLOW');
    expect(linhasPorAula.get('Lesson:960')?.[0].before).toEqual({ published: false });
    expect(linhasPorAula.get('Lesson:960')?.[0].after).toEqual({
      published: true,
      paginas: 2,
      emLote: true,
    });
    const negada = linhasPorAula.get('Lesson:962')?.[0];
    expect(negada?.outcome).toBe('DENY');
    expect(negada?.reason).toContain('§3.5');
    expect(negada?.after).toEqual({ emLote: true });
  });

  it('esquema inválido, arquivada e id inexistente ficam de fora, cada um com o seu motivo', async () => {
    const progressoAntes = await prisma.lessonProgress.findFirstOrThrow({
      where: { lessonId: id(966) },
    });
    const aula966Antes = await prisma.lesson.findUniqueOrThrow({ where: { id: id(966) } });

    const { resultado, linhas } = await auditoriaDe(() =>
      alterarPublicacaoEmLote({
        ator,
        ids: [id(963), id(964), 'nao-existe-a2', id(966)],
        operacao: 'publicar',
      }),
    );

    // Ordem do número da aula; o inexistente vai para o fim.
    expect(resultado.map((r) => [r.numero, r.desfecho])).toEqual([
      [963, 'bloqueada'],
      [964, 'bloqueada'],
      [966, 'publicada'],
      [null, 'bloqueada'],
    ]);
    const [esquema, arquivada, publicada, inexistente] = resultado;

    expect(esquema.motivo).toMatch(/^o conteúdo não passou no esquema \(\d+ erros?\)$/);
    expect(esquema.erros.length).toBeGreaterThan(0);
    expect(arquivada.motivo).toBe('a aula está arquivada — restaure antes de publicar');
    expect(inexistente.lessonId).toBe('nao-existe-a2');
    expect(inexistente.motivo).toBe('a aula não existe mais');

    // Publicar coloca no ar o `pages` — o rascunho continua rascunho, e o aluno
    // que estava além da última página vai para ela, sem perder a conclusão.
    expect(publicada.progressosReposicionados).toBe(1);
    expect(publicada.rascunhoPendente).toBe(true);
    expect(publicada.motivo).toBe(
      'foi ao ar; 1 aluno reposicionado na última página; o rascunho da aba Páginas NÃO entrou no ar',
    );
    const progressoDepois = await prisma.lessonProgress.findFirstOrThrow({
      where: { lessonId: id(966) },
    });
    expect(progressoDepois.currentPage).toBe(1);
    expect(progressoDepois.status).toBe(progressoAntes.status);
    const aula966 = await prisma.lesson.findUniqueOrThrow({ where: { id: id(966) } });
    expect(aula966.published).toBe(true);
    expect(aula966.pages).toEqual(aula966Antes.pages);
    expect(aula966.draftPages).toEqual(aula966Antes.draftPages);
    expect(aula966.contentVersion).toBe(aula966Antes.contentVersion);

    expect(
      await prisma.lesson.count({ where: { number: { in: [963, 964] }, published: true } }),
    ).toBe(0);

    // Uma linha por aula que existe; o id inexistente não grava nada.
    expect(linhas).toHaveLength(3);
    const linhasPorAula = porRecurso(linhas);
    expect(linhasPorAula.get('Lesson:963')?.map((l) => l.outcome)).toEqual(['DENY']);
    expect(linhasPorAula.get('Lesson:964')?.map((l) => l.outcome)).toEqual(['DENY']);
    expect(linhasPorAula.get('Lesson:966')?.map((l) => l.outcome)).toEqual(['ALLOW']);
    expect(linhasPorAula.get('Lesson:966')?.[0].reason).toBe(
      '1 progresso(s) reposicionado(s) na última página',
    );
  });

  it('id repetido no lote conta uma vez só — um resultado e uma auditoria', async () => {
    const { resultado, linhas } = await auditoriaDe(() =>
      alterarPublicacaoEmLote({
        ator,
        ids: [id(965), id(965), ` ${id(965)} `, ''],
        operacao: 'publicar',
      }),
    );

    expect(resultado).toHaveLength(1);
    expect(resultado[0].numero).toBe(965);
    expect(resultado[0].desfecho).toBe('publicada');
    expect(resultado[0].motivo).toBe('já estava no ar; conteúdo conferido de novo');
    expect(linhas).toHaveLength(1);
    expect(linhas[0].resource).toBe('Lesson:965');
    expect(linhas[0].before).toEqual({ published: true });
  });

  it('lote vazio não faz nada; acima do limite é recusado inteiro, sem tocar em aula nenhuma', async () => {
    const vazio = await auditoriaDe(() =>
      alterarPublicacaoEmLote({ ator, ids: ['', '  '], operacao: 'publicar' }),
    );
    expect(vazio.resultado).toEqual([]);
    expect(vazio.linhas).toHaveLength(0);

    const demais = [id(961), ...Array.from({ length: LIMITE_DO_LOTE }, (_, i) => `nao-existe-${i}`)];
    const excesso = await auditoriaDe(async () => {
      await expect(
        alterarPublicacaoEmLote({ ator, ids: demais, operacao: 'despublicar' }),
      ).rejects.toThrow(RangeError);
    });
    expect(excesso.linhas).toHaveLength(0);
    expect((await prisma.lesson.findUniqueOrThrow({ where: { id: id(961) } })).published).toBe(true);
  });
});

describe('despublicar em lote', () => {
  it('tira do ar as publicadas, recusa a que já estava fora, uma auditoria por aula com o motivo', async () => {
    const { resultado, linhas } = await auditoriaDe(() =>
      alterarPublicacaoEmLote({
        ator,
        ids: [id(961), id(962), id(960)],
        operacao: 'despublicar',
        motivo: 'revisão do módulo de teste',
      }),
    );

    expect(resultado.map((r) => [r.numero, r.desfecho, r.motivo])).toEqual([
      [960, 'despublicada', 'saiu do ar; o progresso dos alunos continua guardado'],
      [961, 'despublicada', 'saiu do ar; o progresso dos alunos continua guardado'],
      [962, 'bloqueada', 'a aula já está despublicada'],
    ]);
    expect(
      await prisma.lesson.count({ where: { number: { in: [960, 961, 962] }, published: true } }),
    ).toBe(0);

    expect(linhas).toHaveLength(3);
    const linhasPorAula = porRecurso(linhas);
    for (const grupo of linhasPorAula.values()) expect(grupo).toHaveLength(1);
    for (const numero of [960, 961]) {
      const linha = linhasPorAula.get(`Lesson:${numero}`)?.[0];
      expect(linha?.action).toBe('lesson.unpublish');
      expect(linha?.outcome).toBe('ALLOW');
      expect(linha?.reason).toBe('revisão do módulo de teste');
      expect(linha?.before).toEqual({ published: true });
      expect(linha?.after).toEqual({ published: false, emLote: true });
    }
    const negada = linhasPorAula.get('Lesson:962')?.[0];
    expect(negada?.action).toBe('lesson.unpublish');
    expect(negada?.outcome).toBe('DENY');
    expect(negada?.reason).toBe('já estava despublicada');
  });
});

describe('ação individual = mesmo código do lote', () => {
  it('publicar a aula com erro da §3.5 sozinha dá o mesmo bloqueio e uma auditoria DENY', async () => {
    const lote = await alterarPublicacaoEmLote({ ator, ids: [id(962)], operacao: 'publicar' });
    const { resultado, linhas } = await auditoriaDe(() =>
      publicarAula({ ator, lessonId: id(962) }),
    );

    expect(resultado.desfecho).toBe('bloqueada');
    expect(resultado.motivo).toBe(lote[0].motivo);
    expect(resultado.erros).toEqual(lote[0].erros);
    expect(linhas).toHaveLength(1);
    expect(linhas[0].resource).toBe('Lesson:962');
    expect(linhas[0].outcome).toBe('DENY');
    // Fora do lote, a linha não carrega a marca `emLote`.
    expect(linhas[0].after).toBeNull();
  });

  it('despublicar sozinha: tira do ar uma vez; na segunda, recusa — uma auditoria cada', async () => {
    const primeira = await auditoriaDe(() =>
      despublicarAula({ ator, lessonId: id(965), motivo: 'teste individual' }),
    );
    expect(primeira.resultado.desfecho).toBe('despublicada');
    expect(primeira.linhas).toHaveLength(1);
    expect(primeira.linhas[0].outcome).toBe('ALLOW');
    expect(primeira.linhas[0].reason).toBe('teste individual');
    expect(primeira.linhas[0].after).toEqual({ published: false });

    const segunda = await auditoriaDe(() => despublicarAula({ ator, lessonId: id(965) }));
    expect(segunda.resultado.desfecho).toBe('bloqueada');
    expect(segunda.resultado.motivo).toBe('a aula já está despublicada');
    expect(segunda.linhas).toHaveLength(1);
    expect(segunda.linhas[0].outcome).toBe('DENY');
  });
});
