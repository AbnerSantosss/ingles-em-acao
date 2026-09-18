import { defineConfig, devices } from '@playwright/test';

/**
 * E2E (`npm run test:e2e`). Usa o Chrome instalado na máquina (`channel:
 * 'chrome'`) — sem baixar navegadores do Playwright — e reaproveita o
 * `npm run dev` se ele já estiver no ar. Roda contra o banco de desenvolvimento
 * com as contas de demonstração (`/entrar` → "Entrar como …"), então cada teste
 * que muda estado desfaz o que mudou.
 */
const baseURL = process.env.E2E_BASE_URL ?? 'http://localhost:3000';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [['list']],
  timeout: 60_000,
  use: {
    baseURL,
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chrome',
      use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: baseURL,
    reuseExistingServer: true,
    timeout: 180_000,
  },
});
