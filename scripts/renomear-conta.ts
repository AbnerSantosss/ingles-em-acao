/**
 * Troca o nome de uma conta que já existe.
 *
 *   npm run conta:renomear -- <email> --nome "Nome novo"
 *
 * No container (Portainer → Console do `app`):
 *
 *   /app/node_modules/.bin/tsx /app/scripts/renomear-conta.ts <email> --nome Maria
 *
 * Serve para contas criadas pela equipe (contas do MVP, admin novo), que
 * nasceram com um nome provisório como "Administrador". O nome passa pela mesma
 * regra do cadastro (de 2 a 80 letras, sem espaço sobrando nas pontas).
 *
 * Muda só o nome: e-mail, senha, papel, plano e progresso ficam como estão, e a
 * pessoa continua logada. O nome novo aparece na próxima página que ela abrir.
 *
 * Idempotente: pedir o nome que a conta já tem não grava nada e diz isso.
 */
import type { PrismaClient } from '@prisma/client';

import { campoNome, esqueciSenhaSchema } from '../src/lib/auth/schemas';

const log = (mensagem: string) => console.log(`[renomear] ${mensagem}`);

type Argumentos = { email: string | null; nome: string | null; erroDoNome: string | null };

function lerArgumentos(argv: readonly string[]): Argumentos {
  let bruto = '';
  let nomeBruto: string | undefined;

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i] ?? '';
    if (arg === '--nome') {
      nomeBruto = argv[i + 1] ?? '';
      i += 1;
    } else if (arg.startsWith('--nome=')) {
      nomeBruto = arg.slice('--nome='.length);
    } else if (!bruto) {
      bruto = arg;
    }
  }

  // Mesma normalização do login (minúsculas, sem espaço): senão a conta não é achada.
  const email = esqueciSenhaSchema.safeParse({ email: bruto });
  const nome = campoNome.safeParse(nomeBruto ?? '');

  return {
    email: email.success ? email.data.email : null,
    nome: nome.success ? nome.data : null,
    erroDoNome: nome.success ? null : (nome.error.issues[0]?.message ?? 'nome inválido'),
  };
}

async function main(): Promise<void> {
  // Fora do container (teste local), o Prisma 7 não carrega o .env sozinho.
  if (!process.env.DATABASE_URL && typeof process.loadEnvFile === 'function') {
    try {
      process.loadEnvFile();
    } catch {
      // Sem .env local: as variáveis precisam vir do ambiente.
    }
  }

  const { email, nome, erroDoNome } = lerArgumentos(process.argv.slice(2));
  if (!email || !nome) {
    if (email && erroDoNome) log(`nome recusado: ${erroDoNome}`);
    log('uso: renomear-conta.ts <email> --nome "Nome novo"');
    process.exitCode = 1;
    return;
  }

  // Importados depois do .env: `src/lib/db.ts` lê DATABASE_URL ao ser importado.
  const { prisma } = (await import('../src/lib/db')) as { prisma: PrismaClient };
  const { mascararEmail } = await import('../src/lib/mail/transport');

  try {
    const usuario = await prisma.user.findUnique({
      where: { email },
      select: { id: true, name: true, deletedAt: true },
    });
    if (!usuario || usuario.deletedAt) {
      log(`nenhuma conta ativa com ${mascararEmail(email)}: nada alterado.`);
      process.exitCode = 1;
      return;
    }

    if (usuario.name === nome) {
      log(`nada a fazer: a conta ${mascararEmail(email)} já se chama "${nome}".`);
      return;
    }

    await prisma.user.update({ where: { id: usuario.id }, data: { name: nome } });
    log(`conta ${mascararEmail(email)} agora se chama "${nome}" (antes: "${usuario.name}").`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((erro: unknown) => {
  console.error('[renomear] falhou:', erro instanceof Error ? erro.message : erro);
  process.exitCode = 1;
});
