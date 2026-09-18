/**
 * Quem não é admin não enxerga o painel (BACKOFFICE §1): aluno logado recebe
 * 404 — nem "acesso negado", que confirmaria que ali existe algo — e quem não
 * está logado vai para a tela de entrada.
 */
import { expect, test } from '@playwright/test';

import { entrarComo } from './support/entrar';

test('aluno logado recebe 404 em /admin e nas telas do painel', async ({ page }) => {
  await entrarComo(page, 'ENTRAR COMO ALUNO');

  for (const caminho of ['/admin', '/admin/aulas', '/admin/aulas/42', '/admin/alunos']) {
    const resposta = await page.goto(caminho);
    expect(resposta?.status(), caminho).toBe(404);
    expect(new URL(page.url()).pathname, caminho).toBe(caminho);
    await expect(page.getByRole('heading', { name: 'O estado do produto' })).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'Despublicar aula' })).toHaveCount(0);
  }
});

test('sem sessão, /admin leva à tela de entrada com o retorno guardado', async ({ page }) => {
  const resposta = await page.goto('/admin');
  expect(resposta?.status()).toBe(200);
  const destino = new URL(page.url());
  expect(destino.pathname).toBe('/entrar');
  expect(destino.searchParams.get('next')).toBe('/admin');
  await expect(page.getByRole('button', { name: 'ENTRAR COMO ADMIN' })).toBeVisible();
});
