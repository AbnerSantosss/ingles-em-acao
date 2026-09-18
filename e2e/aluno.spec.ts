/**
 * Jornada do aluno, de ponta a ponta, contra o dev server e o banco de dev.
 *
 * Entrar → Home "0 de 42" → Aula 01 → responder a múltipla escolha da página 2 →
 * recarregar e a resposta (e a página) continuam lá → /progresso e /perfil.
 *
 * O progresso das contas `@dev.local` é zerado antes e depois — é o que faz a
 * Home começar em "0 de 42" a cada execução, e o que evita deixar resposta de
 * teste no banco de quem desenvolve.
 */
import { expect, test } from '@playwright/test';

import {
  EMAIL_ALUNO,
  fecharBancoDeDev,
  lerProgresso,
  lerResposta,
  zerarProgressoDasContasDeDev,
} from './support/banco-dev';
import { entrarComo } from './support/entrar';

/** Aula 01 (Subject Pronouns): a página 2 abre com a múltipla escolha `a1mc1`. */
const AULA_01 = '/aula/subject-pronouns';
const PERGUNTA = '“Eu quero falar de mim.”';
/** `chaveMc(1, 'a1mc1', 0)` — a mesma chave que o servidor grava. */
const CHAVE = 'mc:1:a1mc1:0';

test.beforeAll(async () => {
  await zerarProgressoDasContasDeDev();
});

test.afterAll(async () => {
  try {
    await zerarProgressoDasContasDeDev();
  } finally {
    await fecharBancoDeDev();
  }
});

test('aluno: Home → Aula 01 → responde → recarrega e a resposta persiste → progresso e perfil', async ({
  page,
}) => {
  await entrarComo(page, 'ENTRAR COMO ALUNO');

  // Home: nada concluído, 42 aulas no ar.
  const progresso = page.getByRole('region', { name: 'Seu progresso' });
  await expect(progresso.getByText('0 de 42 aulas', { exact: true })).toBeVisible();

  // Abre a Aula 01 pela trilha da Home.
  await page.locator(`a[href="${AULA_01}"]`).first().click();
  await page.waitForURL(new RegExp(`${AULA_01}$`));
  await expect(page.getByText(/PÁGINA 1 DE 7$/)).toBeVisible();

  await page.getByRole('button', { name: 'PRÓXIMA PÁGINA' }).click();
  await expect(page.getByText(/PÁGINA 2 DE 7$/)).toBeVisible();

  // Responde "I" (a certa). A correção é na hora e a resposta vai ao servidor.
  const pergunta = page.getByRole('group', { name: PERGUNTA });
  await pergunta.getByRole('button', { name: 'I', exact: true }).click();
  const escolhida = pergunta.getByRole('button', { name: /^I\b/ });
  await expect(escolhida).toHaveAttribute('aria-pressed', 'true');
  await expect(escolhida).toHaveAccessibleName('I — sua resposta, correta');

  // Gravou no banco: a resposta conferida e a página em que o aluno está.
  await expect
    .poll(() => lerResposta(EMAIL_ALUNO, CHAVE), { timeout: 15_000 })
    .toEqual({ value: '0', checked: true, correct: true });
  await expect
    .poll(async () => (await lerProgresso(EMAIL_ALUNO, 1))?.currentPage, { timeout: 15_000 })
    .toBe(1);

  // Recarrega: volta na página 2, com a resposta marcada.
  await page.reload();
  await expect(page.getByText(/PÁGINA 2 DE 7$/)).toBeVisible();
  const depois = page.getByRole('group', { name: PERGUNTA }).getByRole('button', { name: /^I\b/ });
  await expect(depois).toHaveAttribute('aria-pressed', 'true');
  await expect(depois).toHaveAccessibleName('I — sua resposta, correta');
  await expect(
    page.getByRole('group', { name: PERGUNTA }).getByRole('button', { name: /^YOU\b/ }),
  ).toHaveAttribute('aria-pressed', 'false');

  // /progresso abre e conta a partir das aulas publicadas.
  const respostaProgresso = await page.goto('/progresso');
  expect(respostaProgresso?.status()).toBe(200);
  await expect(page.getByRole('heading', { level: 1, name: '0 de 42 aulas', exact: true })).toBeVisible();

  // /perfil abre com a saudação do aluno.
  const respostaPerfil = await page.goto('/perfil');
  expect(respostaPerfil?.status()).toBe(200);
  await expect(page.getByRole('heading', { level: 1, name: /^Olá, / })).toBeVisible();
});
