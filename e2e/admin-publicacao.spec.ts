/**
 * Publicação pelo painel (BACKOFFICE §2.3 e a terceira regra de
 * `src/lib/content/publicado.ts`): despublicar tira a aula do ar de verdade — o
 * endereço responde 404 e ela some da trilha e da contagem — e publicar de novo
 * a devolve.
 *
 * ⚠️ Mexe na Aula 42 do banco de dev, **nunca na 01** (a jornada do aluno usa a
 * 01). A republicação é garantida direto no banco no `finally` do teste e de
 * novo no `afterAll`, mesmo que o painel quebre no meio.
 *
 * Seletores por papel e nome acessível: a lista `/admin/aulas` muda com
 * frequência, então o teste vai direto à tela da aula.
 */
import { expect, test, type Page } from '@playwright/test';

import {
  aulaEstaPublicada,
  contarAuditoria,
  fecharBancoDeDev,
  fotografarAula,
  garantirAulaPublicada,
} from './support/banco-dev';
import { entrarComo } from './support/entrar';

const NUMERO = 42;
const SLUG = 'unit-review-2';
const AULA_42 = `/aula/${SLUG}`;

/** Só republica no fim se foi este teste que despublicou. */
let despublicouAqui = false;

test.beforeAll(async () => {
  const foto = await fotografarAula(NUMERO);
  if (!foto.published || foto.archivedAt !== null || foto.slug !== SLUG) {
    throw new Error(
      `Pré-condição: a Aula ${NUMERO} precisa estar publicada, não arquivada e com o slug "${SLUG}" no banco de dev.`,
    );
  }
});

test.afterAll(async () => {
  try {
    if (despublicouAqui) await garantirAulaPublicada(NUMERO);
  } finally {
    await fecharBancoDeDev();
  }
});

/** O que o aluno vê da Aula 42 agora: status do endereço, trilha e contagem. */
async function oQueOAlunoVe(aluno: Page) {
  const resposta = await aluno.goto(AULA_42);
  const status = resposta?.status() ?? 0;

  await aluno.goto('/trilha');
  const linksNaTrilha = await aluno.locator(`a[href="${AULA_42}"]`).count();
  const cabecalho = (await aluno.locator('#titulo-trilha').textContent())?.trim() ?? '';

  return { status, linksNaTrilha, cabecalho };
}

test('admin despublica a Aula 42 pela tela da aula, o aluno deixa de vê-la, e ela volta ao republicar', async ({
  browser,
  baseURL,
}) => {
  // Duas sessões ao mesmo tempo: o admin mexe, o aluno confere.
  const contextoDoAdmin = await browser.newContext({ baseURL });
  const contextoDoAluno = await browser.newContext({ baseURL });
  const admin = await contextoDoAdmin.newPage();
  const aluno = await contextoDoAluno.newPage();
  // Contagem antes/depois, não por data: o relógio do Postgres (no Docker) pode
  // não bater com o desta máquina.
  const recurso = `Lesson:${NUMERO}`;
  const despublicacoesAntes = await contarAuditoria('lesson.unpublish', recurso);
  const publicacoesAntes = await contarAuditoria('lesson.publish', recurso);

  try {
    await entrarComo(admin, 'ENTRAR COMO ADMIN');
    await expect(admin.getByRole('heading', { level: 1, name: 'O estado do produto' })).toBeVisible();

    await entrarComo(aluno, 'ENTRAR COMO ALUNO');

    // Antes: a aula está no ar para o aluno.
    expect(await oQueOAlunoVe(aluno)).toEqual({
      status: 200,
      linksNaTrilha: 1,
      cabecalho: 'TRILHA · 42 AULAS',
    });

    // Despublica pela tela da aula.
    const resposta = await admin.goto(`/admin/aulas/${NUMERO}`);
    expect(resposta?.status()).toBe(200);
    await expect(admin.getByRole('heading', { level: 1 })).toBeVisible();
    await admin.getByRole('textbox', { name: /Motivo/ }).fill('E2E: despublicar e republicar');
    despublicouAqui = true;
    await admin.getByRole('button', { name: 'Despublicar aula' }).click();

    // A tela troca para "Publicar aula" (ou mostra o recado, conforme o
    // refresh da ação); o banco é quem confirma.
    await expect(
      admin
        .getByText(`Aula ${NUMERO} despublicada.`, { exact: false })
        .or(admin.getByRole('button', { name: 'Publicar aula' }))
        .first(),
    ).toBeVisible();
    await expect.poll(() => aulaEstaPublicada(NUMERO), { timeout: 15_000 }).toBe(false);
    await expect
      .poll(() => contarAuditoria('lesson.unpublish', recurso))
      .toBe(despublicacoesAntes + 1);

    // O aluno não a vê mais: 404 no endereço, fora da trilha e da contagem.
    expect(await oQueOAlunoVe(aluno)).toEqual({
      status: 404,
      linksNaTrilha: 0,
      cabecalho: 'TRILHA · 41 AULAS',
    });
    await aluno.goto('/inicio');
    await expect(
      aluno.getByRole('region', { name: 'Seu progresso' }).getByText(/^\d+ de 41 aulas$/),
    ).toBeVisible();

    // Republica pela mesma tela.
    await admin.goto(`/admin/aulas/${NUMERO}`);
    await admin.getByRole('button', { name: 'Publicar aula' }).click();
    await expect(
      admin
        .getByText(`Aula ${NUMERO} publicada.`, { exact: false })
        .or(admin.getByRole('button', { name: 'Despublicar aula' }))
        .first(),
    ).toBeVisible();
    await expect.poll(() => aulaEstaPublicada(NUMERO), { timeout: 15_000 }).toBe(true);
    await expect
      .poll(() => contarAuditoria('lesson.publish', recurso))
      .toBe(publicacoesAntes + 1);

    // De volta para o aluno.
    expect(await oQueOAlunoVe(aluno)).toEqual({
      status: 200,
      linksNaTrilha: 1,
      cabecalho: 'TRILHA · 42 AULAS',
    });
  } finally {
    if (despublicouAqui) await garantirAulaPublicada(NUMERO);
    await contextoDoAdmin.close();
    await contextoDoAluno.close();
  }
});
