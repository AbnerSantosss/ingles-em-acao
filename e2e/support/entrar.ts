/**
 * Entrada pelas contas de demonstração de `/entrar` (só existem em
 * desenvolvimento — `src/app/(auth)/dev-actions.ts`). Cada botão recria a conta
 * no estado de fábrica (nome, papel e plano) e leva ao destino dela.
 */
import { expect, type Page } from '@playwright/test';

export type ContaDeDemonstracao =
  | 'ENTRAR COMO ALUNO'
  | 'ENTRAR COMO ADMIN'
  | 'ALUNO ESSENCIAL';

/** Para onde cada botão leva depois de entrar. */
const DESTINO: Record<ContaDeDemonstracao, RegExp> = {
  'ENTRAR COMO ALUNO': /\/inicio$/,
  'ENTRAR COMO ADMIN': /\/admin$/,
  'ALUNO ESSENCIAL': /\/inicio$/,
};

export async function entrarComo(page: Page, conta: ContaDeDemonstracao): Promise<void> {
  await page.goto('/entrar');
  await page.getByRole('button', { name: conta, exact: true }).click();
  await page.waitForURL(DESTINO[conta]);
  await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible();
}
