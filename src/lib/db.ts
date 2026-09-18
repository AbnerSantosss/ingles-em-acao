/**
 * Singleton do Prisma Client.
 *
 * ⚠️ MÓDULO DE SERVIDOR. Em desenvolvimento o Next recarrega os módulos a cada
 * alteração (HMR); sem o cache em `globalThis` cada recarga abriria um novo pool
 * de conexões até o PostgreSQL recusar novas conexões.
 *
 * O Prisma 7 removeu a `url` do bloco `datasource` e passou a exigir um driver
 * adapter. O `@prisma/adapter-pg` (+ `pg`) está no package.json e é importado
 * estaticamente de propósito: com `output: "standalone"` o Next só copia para a
 * imagem as dependências que consegue rastrear no grafo de módulos — um
 * `createRequire` em runtime passaria despercebido e o contêiner subiria sem o
 * adapter. `next.config.ts` mantém os dois pacotes em `serverExternalPackages`,
 * porque carregam binários nativos que não podem ser empacotados.
 */
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

function criarPrismaClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error(
      'DATABASE_URL não está definida. Preencha o .env na raiz de app-web ' +
        '(ou as variáveis de ambiente do contêiner) antes de subir o app.',
    );
  }

  return new PrismaClient({
    adapter: new PrismaPg({ connectionString }),
    // Propositalmente sem o nível "query": ele imprimiria e-mails, tokens e hashes no log.
    log: ['warn', 'error'],
  });
}

const globalParaPrisma = globalThis as typeof globalThis & {
  __ieaPrisma?: PrismaClient;
};

export const prisma: PrismaClient = globalParaPrisma.__ieaPrisma ?? criarPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalParaPrisma.__ieaPrisma = prisma;
}
