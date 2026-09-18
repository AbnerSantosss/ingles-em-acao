import { defineConfig, env } from 'prisma/config';

// O Prisma 7 não lê mais o .env sozinho. Carregamos aqui (sem imprimir nada)
// para que `prisma migrate`, `prisma studio` e `prisma db seed` achem a DATABASE_URL.
if (!process.env.DATABASE_URL && typeof process.loadEnvFile === 'function') {
  try {
    process.loadEnvFile();
  } catch {
    // Sem .env local (ex.: em produção as variáveis já vêm do ambiente).
  }
}

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: env('DATABASE_URL'),
  },
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx prisma/seed.ts',
  },
});
