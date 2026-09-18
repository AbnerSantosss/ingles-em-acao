import { expect, test } from '@playwright/test';

test('a tela de entrada abre com o acesso rápido de desenvolvimento', async ({ page }) => {
  await page.goto('/entrar');
  await expect(page.getByRole('button', { name: 'ENTRAR COMO ALUNO' })).toBeVisible();
});
