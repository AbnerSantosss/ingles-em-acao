/**
 * `carregarPratica` (`src/lib/pratica/carregar.ts`) contra o banco de teste.
 *
 * O que precisa ser verdade:
 * - ficha válida é gravada em `Lesson.practice`, com uma linha de auditoria;
 * - rodar de novo não grava nada nem audita (idempotente), mesmo com o JSONB
 *   devolvendo as chaves em outra ordem;
 * - ficha mudada é regravada, e a auditoria guarda o antes;
 * - arquivo com JSON quebrado ou fora do esquema é contado e não impede os outros;
 * - ficha de aula que não existe é contada à parte;
 * - pasta inexistente devolve tudo zerado.
 *
 * O nome do arquivo tem dois dígitos (`aula-NN.json`), então as fixtures precisam de número
 * abaixo de 100. O banco de teste não é semeado (só migrado), e nenhum outro teste usa esta
 * faixa: módulo 97 e aulas 80 a 89, apagadas no `afterAll` junto com a auditoria delas.
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { prisma } from '@/lib/db';
import { carregarPratica } from '@/lib/pratica/carregar';

import { fichaDeExemplo } from './ficha-de-exemplo';

const MODULO = 97;
const PRIMEIRA = 80;
const ULTIMA = 89;
const NA_FAIXA = { number: { gte: PRIMEIRA, lte: ULTIMA } };
const SISTEMA = 'teste-carregar-pratica';
const AUTOR = `(${SISTEMA})`;

let pasta: string;

async function limparFixtures(): Promise<void> {
  await prisma.lesson.deleteMany({ where: NA_FAIXA });
  await prisma.module.deleteMany({ where: { id: MODULO, lessons: { none: {} } } });
  await prisma.auditLog.deleteMany({ where: { actorEmail: AUTOR } });
}

async function criarAula(numero: number): Promise<void> {
  await prisma.lesson.create({
    data: {
      number: numero,
      code: `AULA ${numero}`,
      slug: `pratica-teste-${numero}`,
      title: `Fixture ${numero}`,
      subtitle: 'Aula de teste da carga de prática',
      estimatedTime: '5 minutos',
      moduleId: MODULO,
      pages: [{ blocks: [{ t: 'lead', text: 'Hello.' }] }],
      published: false,
    },
  });
}

function gravarArquivo(nome: string, conteudo: unknown): void {
  const texto = typeof conteudo === 'string' ? conteudo : JSON.stringify(conteudo, null, 2);
  fs.writeFileSync(path.join(pasta, nome), texto, 'utf8');
}

async function auditoria() {
  return prisma.auditLog.findMany({ where: { actorEmail: AUTOR }, orderBy: { createdAt: 'asc' } });
}

beforeAll(async () => {
  await limparFixtures();
  await prisma.module.upsert({
    where: { id: MODULO },
    update: {},
    create: {
      id: MODULO,
      order: MODULO,
      title: 'Módulo de teste da prática',
      fromLesson: PRIMEIRA,
      toLesson: ULTIMA,
    },
  });
  await criarAula(80);
  await criarAula(81);

  pasta = fs.mkdtempSync(path.join(os.tmpdir(), 'wsa-pratica-'));
  gravarArquivo('aula-80.json', fichaDeExemplo());
  gravarArquivo('aula-81.json', { ...fichaDeExemplo(), tipo: 'revisao' });
  gravarArquivo('aula-82.json', '{ isto não é json');
  gravarArquivo('aula-83.json', { ...fichaDeExemplo(), extra: true });
  gravarArquivo('aula-84.json', fichaDeExemplo());
  gravarArquivo('leia-me.txt', 'ignorado: não é aula-NN.json');
});

afterAll(async () => {
  await limparFixtures();
  if (pasta) fs.rmSync(pasta, { recursive: true, force: true });
});

describe('carregarPratica', () => {
  it('pasta que não existe devolve tudo zerado', async () => {
    const r = await carregarPratica(prisma, { pasta: path.join(pasta, 'nao-existe'), sistema: SISTEMA });
    expect(r).toEqual({ lidas: 0, gravadas: 0, iguais: 0, invalidas: 0, semAula: 0, erros: [] });
  });

  it('primeira carga: grava as válidas, conta inválidas e aula inexistente', async () => {
    const r = await carregarPratica(prisma, { pasta, sistema: SISTEMA });

    expect(r).toMatchObject({ lidas: 5, gravadas: 2, iguais: 0, invalidas: 2, semAula: 1 });
    expect(r.erros.some((e) => e.startsWith('aula-82.json: JSON inválido'))).toBe(true);
    expect(r.erros.some((e) => e.startsWith('aula-83.json: ficha: '))).toBe(true);
    expect(r.erros).toContain('aula-84.json: a Aula 84 não existe no banco');

    const aula80 = await prisma.lesson.findUniqueOrThrow({ where: { number: 80 }, select: { practice: true } });
    expect(aula80.practice).toEqual(fichaDeExemplo());

    const linhas = await auditoria();
    expect(linhas.map((l) => [l.action, l.resource, l.outcome])).toEqual([
      ['lesson.practice.load', 'Lesson:80', 'ALLOW'],
      ['lesson.practice.load', 'Lesson:81', 'ALLOW'],
    ]);
    expect(linhas[0].before).toBeNull();
  });

  it('segunda carga igual: nada é gravado nem auditado', async () => {
    const r = await carregarPratica(prisma, { pasta, sistema: SISTEMA });
    expect(r).toMatchObject({ lidas: 5, gravadas: 0, iguais: 2, invalidas: 2, semAula: 1 });
    expect(await auditoria()).toHaveLength(2);
  });

  it('ficha mudada é regravada, e a auditoria guarda o antes', async () => {
    gravarArquivo('aula-80.json', { ...fichaDeExemplo(), foco: 'Foco novo da aula de teste.' });

    const r = await carregarPratica(prisma, { pasta, sistema: SISTEMA });
    expect(r).toMatchObject({ gravadas: 1, iguais: 1 });

    const linhas = await auditoria();
    expect(linhas).toHaveLength(3);
    const ultima = linhas[2];
    expect(ultima.resource).toBe('Lesson:80');
    expect((ultima.before as { foco: string }).foco).toBe(fichaDeExemplo().foco);
    expect((ultima.after as { foco: string }).foco).toBe('Foco novo da aula de teste.');
  });
});
