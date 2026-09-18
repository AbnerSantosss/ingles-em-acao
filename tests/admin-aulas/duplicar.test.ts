/**
 * "Duplicar aula" (`duplicarAula`, `src/lib/admin/aulas.ts`) contra o banco de teste.
 *
 * O que precisa ser verdade:
 * - o original não muda nada — conteúdo, ids de bloco, chaves de resposta,
 *   respostas gravadas, publicação, capa e vídeo;
 * - a cópia não divide **nenhum** id interativo com o original nem com outra
 *   aula (senão passaria a dividir a resposta do aluno, §6.2);
 * - o mesmo bloco ganha o mesmo id novo em `pages` e em `draftPages`;
 * - a cópia nasce rascunho, sem capa, sem vídeo, sem progresso/respostas/versões;
 * - uma linha de auditoria `lesson.duplicate` por cópia (e DENY na recusa).
 *
 * Fixtures na faixa desta frente: módulo 95 e aulas 950–959, criadas no
 * `beforeAll` e apagadas no `afterAll`, junto com o admin de teste
 * (`a2-<aleatório>@teste.local`) e as linhas de auditoria dele.
 */
import { randomUUID } from 'node:crypto';

import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { codigoDaAula, duplicarAula, esquemaDeDados } from '@/lib/admin/aulas';
import {
  blocosInterativos,
  chavePertenceAoBloco,
  chavesDoBloco,
  coletarIds,
  ehBlocoInterativo,
  validarSemantica,
} from '@/lib/admin/editor';
import { carregarContextoDoCurso } from '@/lib/admin/publicacao';
import type { SessionUser } from '@/lib/auth/session';
import { validarPaginas, type Page } from '@/lib/content/blocks';
import { prisma } from '@/lib/db';

const MODULO = 95;
const PRIMEIRA = 950;
const ULTIMA = 959;
const NA_FAIXA = { number: { gte: PRIMEIRA, lte: ULTIMA } };

const ORIGEM = 950;
const INVALIDA = 953;

const PAGINAS_DA_ORIGEM = [
  {
    blocks: [
      { t: 'badge', label: 'AULA 950' },
      { t: 'title', en: 'Duplicate me', pt: 'Duplique-me' },
      { t: 'image', id: 'a950p1', ph: 'Arte da aula' },
    ],
  },
  {
    blocks: [
      {
        t: 'mc',
        id: 'a950mc1',
        title: 'Escolha a forma certa',
        questions: [{ q: 'I ___ a student.', options: ['am', 'is'], answer: 0 }],
      },
      { t: 'fill', id: 'a950e1', items: [{ pre: 'She', answers: ['is'], post: 'a teacher.' }] },
      {
        t: 'match',
        id: 'a950match1',
        title: 'Ligue as palavras',
        left: ['cat', 'dog'],
        right: ['cachorro', 'gato'],
        answer: [1, 0],
      },
    ],
  },
  {
    blocks: [
      {
        t: 'dnd',
        id: 'a950d1',
        title: 'Monte a frase',
        sub: 'Arraste as peças',
        slots: ['1', '2'],
        tokens: ['am', 'I'],
        answer: ['I', 'am'],
      },
      { t: 'check', id: 'a950c1', title: 'Confira o que aprendeu', items: ['Sei usar o am'] },
      {
        t: 'free',
        id: 'a950f1',
        items: [{ n: '1', kicker: 'Escreva', prefix: 'I am', ideas: '' }],
      },
      {
        t: 'cta',
        items: [{ icon: 'mic', title: 'Pratique', body: 'Fale com a IA', plan: 'PREMIUM', btn: 'Ir' }],
      },
    ],
  },
];

/** O rascunho: tudo do publicado (o `fill` com texto novo) + um exercício que só existe nele. */
const RASCUNHO_DA_ORIGEM = [
  PAGINAS_DA_ORIGEM[0],
  {
    blocks: [
      PAGINAS_DA_ORIGEM[1].blocks[0],
      { t: 'fill', id: 'a950e1', items: [{ pre: 'He', answers: ['is'], post: 'a doctor.' }] },
      PAGINAS_DA_ORIGEM[1].blocks[2],
    ],
  },
  PAGINAS_DA_ORIGEM[2],
  {
    blocks: [
      {
        t: 'mc',
        id: 'a950mc2',
        title: 'Só no rascunho',
        questions: [{ q: 'You ___ here.', options: ['are', 'is'], answer: 0 }],
      },
    ],
  },
];

const IDS_INTERATIVOS_DA_ORIGEM = [
  'a950mc1',
  'a950e1',
  'a950match1',
  'a950d1',
  'a950c1',
  'a950f1',
];

let ator: SessionUser;
let origemId = '';
const copiasForaDaFaixa: string[] = [];

function paginas(valor: unknown): Page[] {
  const lido = validarPaginas(valor);
  if (!lido.ok) throw new Error(`conteúdo inválido na fixture: ${lido.erros.join(' · ')}`);
  return lido.pages;
}

function idsInterativos(valor: unknown): string[] {
  return blocosInterativos(paginas(valor)).map((ocorrencia) => ocorrencia.id);
}

/** Aplica o de-para de ids aos blocos interativos — o resto do conteúdo fica igual. */
function comIdsTrocados(valor: unknown, mapa: Record<string, string>): Page[] {
  return paginas(valor).map((pagina) => ({
    blocks: pagina.blocks.map((bloco) =>
      ehBlocoInterativo(bloco) ? { ...bloco, id: mapa[bloco.id] ?? `SEM-MAPA:${bloco.id}` } : bloco,
    ),
  }));
}

async function limparFixtures(): Promise<void> {
  const aulas = await prisma.lesson.findMany({
    where: { OR: [NA_FAIXA, { id: { in: copiasForaDaFaixa } }] },
    select: { id: true },
  });
  const ids = aulas.map((aula) => aula.id);
  // MediaUsage não tem FK para Lesson: apagar a aula não leva o índice junto.
  await prisma.mediaUsage.deleteMany({ where: { lessonId: { in: ids } } });
  await prisma.lesson.deleteMany({ where: { id: { in: ids } } });
  await prisma.module.deleteMany({ where: { id: MODULO, lessons: { none: {} } } });
}

async function auditoriaDoAtor() {
  return prisma.auditLog.findMany({ where: { actorId: ator.id }, orderBy: { createdAt: 'asc' } });
}

beforeAll(async () => {
  await limparFixtures();

  const usuario = await prisma.user.create({
    data: {
      name: 'Admin de teste A2',
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
      fromLesson: PRIMEIRA,
      toLesson: 979,
    },
  });

  const origem = await prisma.lesson.create({
    data: {
      number: ORIGEM,
      code: codigoDaAula(ORIGEM),
      slug: 'a2-duplicar-950',
      title: 'Fixture 950',
      subtitle: 'Aula de teste da frente A2',
      estimatedTime: '7 minutos',
      moduleId: MODULO,
      coverUrl: '/lessons/capas/950.png',
      videoKind: 'YOUTUBE',
      videoRef: 'dQw4w9WgXcQ',
      pages: PAGINAS_DA_ORIGEM,
      draftPages: RASCUNHO_DA_ORIGEM,
      published: true,
      publishedAt: new Date('2026-09-01T12:00:00Z'),
      contentVersion: 3,
    },
  });
  origemId = origem.id;

  // O que é do aluno e não pode ir para a cópia.
  await prisma.exerciseAnswer.create({
    data: { userId: ator.id, lessonId: origemId, answerKey: 'fill:a950e1:0', value: 'is' },
  });
  await prisma.lessonProgress.create({
    data: { userId: ator.id, lessonId: origemId, status: 'IN_PROGRESS', currentPage: 2 },
  });
  await prisma.lessonVersion.create({
    data: {
      lessonId: origemId,
      version: 1,
      pages: PAGINAS_DA_ORIGEM,
      title: 'Fixture 950',
      subtitle: 'Aula de teste da frente A2',
    },
  });

  // Uma chave de resposta "órfã" com o id que a cópia 955 ganharia (`a955e1`).
  await prisma.exerciseAnswer.create({
    data: { userId: ator.id, lessonId: origemId, answerKey: 'fill:a955e1:0', value: 'órfã' },
  });

  await prisma.lesson.create({
    data: {
      number: INVALIDA,
      code: codigoDaAula(INVALIDA),
      slug: 'a2-duplicar-953',
      title: 'Fixture 953 (inválida)',
      subtitle: '',
      estimatedTime: '5 minutos',
      moduleId: MODULO,
      pages: [{ blocks: [] }],
      published: false,
    },
  });
});

afterAll(async () => {
  await limparFixtures();
  if (ator) {
    await prisma.auditLog.deleteMany({ where: { actorId: ator.id } });
    await prisma.user.deleteMany({ where: { id: ator.id } });
  }
});

describe('duplicar aula', () => {
  it('não muda nada no original: conteúdo, ids, chaves, respostas, publicação, capa e vídeo', async () => {
    const antes = await prisma.lesson.findUniqueOrThrow({ where: { id: origemId } });
    const chavesAntes = blocosInterativos(paginas(antes.pages)).map((o) =>
      chavesDoBloco(o.conteudo, ORIGEM),
    );

    const resultado = await duplicarAula({ ator, origemId, numero: 951 });
    expect(resultado.ok).toBe(true);

    const depois = await prisma.lesson.findUniqueOrThrow({ where: { id: origemId } });
    expect(depois.pages).toEqual(antes.pages);
    expect(depois.draftPages).toEqual(antes.draftPages);
    expect(depois.pages).toEqual(PAGINAS_DA_ORIGEM);
    expect(idsInterativos(depois.pages)).toEqual(IDS_INTERATIVOS_DA_ORIGEM);
    expect(idsInterativos(depois.draftPages)).toEqual([...IDS_INTERATIVOS_DA_ORIGEM, 'a950mc2']);
    expect(
      blocosInterativos(paginas(depois.pages)).map((o) => chavesDoBloco(o.conteudo, ORIGEM)),
    ).toEqual(chavesAntes);

    expect({
      number: depois.number,
      code: depois.code,
      slug: depois.slug,
      title: depois.title,
      published: depois.published,
      publishedAt: depois.publishedAt,
      coverUrl: depois.coverUrl,
      videoKind: depois.videoKind,
      videoRef: depois.videoRef,
      contentVersion: depois.contentVersion,
      updatedAt: depois.updatedAt,
    }).toEqual({
      number: antes.number,
      code: antes.code,
      slug: antes.slug,
      title: antes.title,
      published: antes.published,
      publishedAt: antes.publishedAt,
      coverUrl: antes.coverUrl,
      videoKind: antes.videoKind,
      videoRef: antes.videoRef,
      contentVersion: antes.contentVersion,
      updatedAt: antes.updatedAt,
    });

    const respostas = await prisma.exerciseAnswer.findMany({
      where: { lessonId: origemId },
      select: { answerKey: true, value: true },
      orderBy: { answerKey: 'asc' },
    });
    expect(respostas).toEqual([
      { answerKey: 'fill:a950e1:0', value: 'is' },
      { answerKey: 'fill:a955e1:0', value: 'órfã' },
    ]);
    expect(await prisma.lessonProgress.count({ where: { lessonId: origemId } })).toBe(1);
    expect(await prisma.lessonVersion.count({ where: { lessonId: origemId } })).toBe(1);
  });

  it('a cópia nasce rascunho, sem capa e sem vídeo, e não leva progresso, respostas nem versões', async () => {
    const copia = await prisma.lesson.findUniqueOrThrow({ where: { number: 951 } });

    expect(copia.id).not.toBe(origemId);
    expect(copia.code).toBe(codigoDaAula(951));
    expect(copia.slug).toBe('a2-duplicar-950-copia');
    expect(copia.title).toBe('Fixture 950 (cópia)');
    expect(copia.subtitle).toBe('Aula de teste da frente A2');
    expect(copia.estimatedTime).toBe('7 minutos');
    expect(copia.moduleId).toBe(MODULO);
    expect(copia.published).toBe(false);
    expect(copia.publishedAt).toBeNull();
    expect(copia.archivedAt).toBeNull();
    expect(copia.coverUrl).toBeNull();
    expect(copia.videoKind).toBeNull();
    expect(copia.videoRef).toBeNull();
    expect(copia.videoUrl).toBeNull();
    expect(copia.updatedById).toBe(ator.id);

    expect(await prisma.exerciseAnswer.count({ where: { lessonId: copia.id } })).toBe(0);
    expect(await prisma.lessonProgress.count({ where: { lessonId: copia.id } })).toBe(0);
    expect(await prisma.lessonVersion.count({ where: { lessonId: copia.id } })).toBe(0);
  });

  it('a cópia não divide nenhum id interativo nem chave de resposta com o original ou outra aula', async () => {
    const copia = await prisma.lesson.findUniqueOrThrow({ where: { number: 951 } });
    const idsDaCopia = [...idsInterativos(copia.pages), ...idsInterativos(copia.draftPages)];

    // 6 no publicado + os mesmos 6 e mais 1 no rascunho.
    expect(idsDaCopia).toHaveLength(13);
    expect(new Set(idsDaCopia).size).toBe(7);
    for (const id of idsDaCopia) {
      expect(id.startsWith('a951')).toBe(true);
      expect(IDS_INTERATIVOS_DA_ORIGEM).not.toContain(id);
    }

    // Nenhum id interativo da cópia aparece em qualquer outra aula do banco.
    const outras = await prisma.lesson.findMany({
      where: { id: { not: copia.id } },
      select: { pages: true, draftPages: true },
    });
    const idsDeOutras = new Set<string>();
    for (const outra of outras) {
      for (const conteudo of [outra.pages, outra.draftPages]) {
        const lido = validarPaginas(conteudo);
        if (lido.ok) for (const id of coletarIds(lido.pages)) idsDeOutras.add(id);
      }
    }
    for (const id of idsDaCopia) expect(idsDeOutras.has(id)).toBe(false);

    // Nenhuma chave de resposta da cópia casa com uma chave do original nem com
    // qualquer resposta já gravada.
    const chavesDaOrigem = blocosInterativos(paginas(RASCUNHO_DA_ORIGEM)).map((o) =>
      chavesDoBloco(o.conteudo, ORIGEM),
    );
    const respostasGravadas = await prisma.exerciseAnswer.findMany({ select: { answerKey: true } });
    for (const ocorrencia of blocosInterativos(paginas(copia.draftPages))) {
      const chaves = chavesDoBloco(ocorrencia.conteudo, 951);
      for (const daOrigem of chavesDaOrigem) {
        for (const exata of chaves.exatas) expect(daOrigem.exatas).not.toContain(exata);
        for (const prefixo of chaves.prefixos) expect(daOrigem.prefixos).not.toContain(prefixo);
      }
      for (const { answerKey } of respostasGravadas) {
        expect(chavePertenceAoBloco(answerKey, chaves)).toBe(false);
      }
    }

    // A cópia passa na validação da §3.5 — nada de "id já pertence à aula 950".
    const contexto = await carregarContextoDoCurso(copia.id);
    for (const conteudo of [copia.pages, copia.draftPages]) {
      const semantica = validarSemantica(paginas(conteudo), {
        numero: 951,
        idsDeOutrasAulas: contexto.idsDeOutrasAulas,
      });
      expect(semantica.erros).toEqual([]);
    }
  });

  it('o mesmo bloco ganha o mesmo id novo no publicado e no rascunho; o resto do conteúdo é idêntico', async () => {
    const copia = await prisma.lesson.findUniqueOrThrow({ where: { number: 951 } });
    const linha = await prisma.auditLog.findFirstOrThrow({
      where: { actorId: ator.id, action: 'lesson.duplicate', resource: 'Lesson:951' },
    });
    const mapa = (linha.after as { idsNovos: Record<string, string> }).idsNovos;

    expect(Object.keys(mapa).sort()).toEqual([...IDS_INTERATIVOS_DA_ORIGEM, 'a950mc2'].sort());
    expect(copia.pages).toEqual(comIdsTrocados(PAGINAS_DA_ORIGEM, mapa));
    expect(copia.draftPages).toEqual(comIdsTrocados(RASCUNHO_DA_ORIGEM, mapa));

    // Imagem mantém o id: é o nome do arquivo de arte legado, não chave de resposta.
    expect(coletarIds(paginas(copia.pages))).toContain('a950p1');
  });

  it('grava exatamente uma linha de auditoria lesson.duplicate, com a origem no before/after', async () => {
    const linhas = (await auditoriaDoAtor()).filter((l) => l.action === 'lesson.duplicate');
    expect(linhas).toHaveLength(1);
    const [linha] = linhas;
    expect(linha.resource).toBe('Lesson:951');
    expect(linha.outcome).toBe('ALLOW');
    expect(linha.actorEmail).toBe(ator.email);
    expect(linha.before).toMatchObject({
      origem: { id: origemId, number: ORIGEM, slug: 'a2-duplicar-950', published: true },
    });
    expect(linha.after).toMatchObject({
      number: 951,
      origem: ORIGEM,
      published: false,
      coverUrl: null,
      video: null,
      temRascunho: true,
    });
  });

  it('uma segunda cópia ganha outro slug e ids que não colidem com a primeira', async () => {
    const resultado = await duplicarAula({ ator, origemId, numero: 952 });
    if (!resultado.ok) throw new Error(resultado.motivo);

    expect(resultado.copia.slug).toBe('a2-duplicar-950-copia-2');
    const primeira = await prisma.lesson.findUniqueOrThrow({ where: { number: 951 } });
    const segunda = await prisma.lesson.findUniqueOrThrow({ where: { number: 952 } });
    const idsDaPrimeira = new Set(idsInterativos(primeira.draftPages));
    for (const id of idsInterativos(segunda.draftPages)) {
      expect(idsDaPrimeira.has(id)).toBe(false);
    }
  });

  it('pula o id que aparece numa resposta gravada, mesmo sem aula com aquele número', async () => {
    const resultado = await duplicarAula({ ator, origemId, numero: 955 });
    if (!resultado.ok) throw new Error(resultado.motivo);

    // `fill:a955e1:0` já existe: o `fill` da cópia não pode herdar essa resposta.
    expect(resultado.idsNovos.a950e1).toBe('a955e2');
    expect(resultado.idsNovos.a950mc1).toBe('a955mc1');
  });

  it('número já ocupado: recusa sem criar nada', async () => {
    const aulasAntes = await prisma.lesson.count({ where: NA_FAIXA });
    const resultado = await duplicarAula({ ator, origemId, numero: ORIGEM });

    expect(resultado).toEqual({
      ok: false,
      motivo: expect.stringContaining(`O número ${ORIGEM}`),
    });
    expect(await prisma.lesson.count({ where: NA_FAIXA })).toBe(aulasAntes);
  });

  it('conteúdo de origem inválido: recusa, audita DENY e não cria a cópia', async () => {
    const origem = await prisma.lesson.findUniqueOrThrow({ where: { number: INVALIDA } });
    const resultado = await duplicarAula({ ator, origemId: origem.id, numero: 954 });

    expect(resultado.ok).toBe(false);
    expect(await prisma.lesson.findUnique({ where: { number: 954 } })).toBeNull();

    const negadas = (await auditoriaDoAtor()).filter(
      (l) => l.action === 'lesson.duplicate' && l.resource === `Lesson:${INVALIDA}`,
    );
    expect(negadas).toHaveLength(1);
    expect(negadas[0].outcome).toBe('DENY');
  });

  it('slug de origem no limite: o slug da cópia continua cabendo na aba Dados', async () => {
    const slugLongo = `a2-${'x'.repeat(117)}`;
    expect(slugLongo).toHaveLength(120);
    const longa = await prisma.lesson.create({
      data: {
        number: 956,
        code: codigoDaAula(956),
        slug: slugLongo,
        title: 'Fixture 956 (slug longo)',
        subtitle: '',
        estimatedTime: '5 minutos',
        moduleId: MODULO,
        pages: PAGINAS_DA_ORIGEM.slice(0, 1),
        published: false,
      },
    });

    const resultado = await duplicarAula({ ator, origemId: longa.id, numero: 957 });
    if (!resultado.ok) throw new Error(resultado.motivo);

    expect(resultado.copia.slug.length).toBeLessThanOrEqual(120);
    expect(resultado.copia.slug.endsWith('-copia')).toBe(true);
    expect(esquemaDeDados.shape.slug.safeParse(resultado.copia.slug).success).toBe(true);
  });

  it('aula que não existe: recusa sem auditoria (não há número para registrar)', async () => {
    const antes = (await auditoriaDoAtor()).length;
    const resultado = await duplicarAula({ ator, origemId: 'nao-existe-a2' });
    expect(resultado.ok).toBe(false);
    expect((await auditoriaDoAtor()).length).toBe(antes);
  });

  it('sem número informado, a cópia vai para o fim da fila', async () => {
    const maior = await prisma.lesson.aggregate({ _max: { number: true } });
    const resultado = await duplicarAula({ ator, origemId });
    if (!resultado.ok) throw new Error(resultado.motivo);
    // Pode cair fora da faixa 950–959 (outra frente pode ter aulas acima): é
    // apagada pela id já aqui, para não segurar um número que outra frente use,
    // e o `afterAll` confere de novo.
    copiasForaDaFaixa.push(resultado.copia.id);

    try {
      expect(resultado.copia.number).toBeGreaterThan(maior._max.number ?? 0);
      const copia = await prisma.lesson.findUniqueOrThrow({ where: { id: resultado.copia.id } });
      expect(copia.published).toBe(false);
      expect(copia.code).toBe(codigoDaAula(copia.number));
    } finally {
      await prisma.mediaUsage.deleteMany({ where: { lessonId: resultado.copia.id } });
      await prisma.lesson.deleteMany({ where: { id: resultado.copia.id } });
    }
  });
});
