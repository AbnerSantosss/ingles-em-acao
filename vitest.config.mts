import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

const raiz = (caminho: string) => fileURLToPath(new URL(caminho, import.meta.url));

/**
 * Testes de unidade/integração (`npm test`). Rodam em Node puro contra um banco
 * de teste próprio (`<banco do .env>_test`), criado e migrado pelo global-setup —
 * nunca contra o banco de desenvolvimento. Os E2E ficam no Playwright (`e2e/`).
 */
export default defineConfig({
  resolve: {
    alias: {
      '@': raiz('./src'),
      // `server-only` lança fora do bundle de servidor do Next; aqui é um no-op.
      'server-only': raiz('./tests/support/vazio.ts'),
    },
  },
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts'],
    globalSetup: ['tests/support/global-setup.ts'],
    setupFiles: ['tests/support/setup.ts'],
    // Todos os arquivos dividem o mesmo banco de teste: um arquivo por vez.
    fileParallelism: false,
  },
});
