/**
 * Carrega as fichas de prática com IA (`content/pratica/aula-NN.json`) em `Lesson.practice`.
 *
 *   npm run pratica:carregar
 *
 * No container (Portainer → Console do `app`):
 *
 *   /app/node_modules/.bin/tsx /app/scripts/carregar-pratica.ts
 *
 * Idempotente: ficha igual à do banco não é regravada. Arquivo inválido não para os outros,
 * mas faz o script terminar com código 1, para ninguém achar que tudo entrou.
 * A lógica mora em `src/lib/pratica/carregar.ts`, a mesma que o `prisma/seed.ts` chama.
 */
import type { PrismaClient } from '@prisma/client';

const log = (mensagem: string) => console.log(`[pratica] ${mensagem}`);

async function main(): Promise<void> {
  // O Prisma 7 não carrega mais o .env sozinho, e este script roda fora do Next.
  if (!process.env.DATABASE_URL && typeof process.loadEnvFile === 'function') {
    try {
      process.loadEnvFile();
    } catch {
      // Sem .env local: as variáveis precisam vir do ambiente.
    }
  }

  // Importados sob demanda para que o .env já esteja carregado quando o client nascer.
  const { prisma } = (await import('../src/lib/db')) as { prisma: PrismaClient };
  const { carregarPratica } = await import('../src/lib/pratica/carregar');

  try {
    const r = await carregarPratica(prisma);
    log(
      `arquivos lidos: ${r.lidas} · gravadas: ${r.gravadas} · iguais: ${r.iguais} · inválidas: ${r.invalidas} · sem aula: ${r.semAula}`,
    );
    for (const erro of r.erros) log(`  ${erro}`);
    if (r.lidas === 0) log('nenhuma ficha encontrada em content/pratica. Nada a fazer.');
    if (r.invalidas > 0) process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((erro: unknown) => {
  console.error('[pratica] falhou:', erro instanceof Error ? erro.message : erro);
  process.exitCode = 1;
});
