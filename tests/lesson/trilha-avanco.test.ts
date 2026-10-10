import { afterAll, beforeAll, expect, it } from 'vitest';
import { prisma } from '@/lib/db';
import { montarTrilhaDoAluno } from '@/lib/trilha-do-aluno';

const modulo = 987;
const email = 'trilha-avanco@teste.local';
let userId: string;

beforeAll(async () => {
  await prisma.module.create({ data: { id: modulo, order: modulo, title: 'Avanço', fromLesson: 9871, toLesson: 9873 } });
  const usuario = await prisma.user.create({ data: { name: 'Teste avanço', email, passwordHash: 'fixture-sem-login' } });
  userId = usuario.id;
  for (const numero of [9871, 9872, 9873]) {
    const aula = await prisma.lesson.create({ data: {
      number: numero, code: `AULA ${numero}`, slug: `teste-avanco-${numero}`, title: 'Avanço',
      subtitle: 'Teste', estimatedTime: '5 minutos', moduleId: modulo, published: numero !== 9873,
      pages: Array.from({ length: 8 }, () => ({ blocks: [{ t: 'title', en: 'Test', pt: 'Teste' }] })),
      draftPages: [{ blocks: [] }],
    } });
    await prisma.lessonProgress.create({ data: { userId, lessonId: aula.id, status: numero === 9872 ? 'COMPLETED' : 'IN_PROGRESS', currentPage: 2 } });
  }
});

afterAll(async () => {
  await prisma.user.deleteMany({ where: { email } });
  await prisma.lesson.deleteMany({ where: { moduleId: modulo } });
  await prisma.module.deleteMany({ where: { id: modulo } });
});

it('mostra a posição persistida usando páginas publicadas e exclui aulas ocultas', async () => {
  const trilha = await montarTrilhaDoAluno(userId);
  expect(trilha.itens.find((aula) => aula.id === 9871)?.progresso)
    .toEqual({ percentual: 25, pagina: 3, totalPaginas: 8, iniciada: true });
  expect(trilha.itens.find((aula) => aula.id === 9872)?.progresso.percentual).toBe(100);
  expect(trilha.itens.some((aula) => aula.id === 9873)).toBe(false);
  expect(trilha.itens.find((aula) => aula.id === 9871)?.estado).toBe('proxima');
});
