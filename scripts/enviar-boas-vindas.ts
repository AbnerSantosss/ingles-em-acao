/**
 * Manda o e-mail de boas-vindas para uma conta que já existe.
 *
 *   npm run email:boas-vindas -- <email> [--nome "Primeiro nome"]
 *
 * No container (Portainer → Console do `app`):
 *
 *   /app/node_modules/.bin/tsx /app/scripts/enviar-boas-vindas.ts <email> --nome Maria
 *
 * Serve para contas criadas pela equipe (contas do MVP, admin novo), que não
 * passam pelo cadastro e por isso nunca receberam e-mail nenhum. Para admin, o
 * texto também explica onde fica o painel.
 *
 * `--nome` muda só a saudação deste e-mail; o nome da conta continua o mesmo.
 * Sem SMTP configurado nada sai, e o script diz isso em vez de fingir que enviou.
 *
 * ⚠️ Envia e-mail de verdade. Rode só quando o dono pedir.
 */
import type { PrismaClient } from '@prisma/client';

import { esqueciSenhaSchema } from '../src/lib/auth/schemas';

const log = (mensagem: string) => console.log(`[boas-vindas] ${mensagem}`);

type Argumentos = { email: string | null; nome: string | null };

function lerArgumentos(argv: readonly string[]): Argumentos {
  let bruto = '';
  let nome: string | null = null;

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i] ?? '';
    if (arg === '--nome') {
      nome = argv[i + 1]?.trim() || null;
      i += 1;
    } else if (arg.startsWith('--nome=')) {
      nome = arg.slice('--nome='.length).trim() || null;
    } else if (!bruto) {
      bruto = arg;
    }
  }

  // Mesma normalização do login (minúsculas, sem espaço): senão a conta não é achada.
  const resultado = esqueciSenhaSchema.safeParse({ email: bruto });
  return { email: resultado.success ? resultado.data.email : null, nome };
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

  const { email, nome } = lerArgumentos(process.argv.slice(2));
  if (!email) {
    log('uso: enviar-boas-vindas.ts <email> [--nome "Primeiro nome"]');
    process.exitCode = 1;
    return;
  }

  // Importados depois do .env: `src/lib/db.ts` lê DATABASE_URL ao ser importado.
  const { prisma } = (await import('../src/lib/db')) as { prisma: PrismaClient };
  const { welcomeTemplate } = await import('../src/lib/mail/templates');
  const { ambienteDeEmail, enviarMensagem, fecharTransporte, mascararEmail } = await import(
    '../src/lib/mail/transport'
  );

  try {
    const usuario = await prisma.user.findUnique({
      where: { email },
      select: { name: true, role: true, deletedAt: true },
    });
    if (!usuario || usuario.deletedAt) {
      log(`nenhuma conta ativa com ${mascararEmail(email)}: nada enviado.`);
      process.exitCode = 1;
      return;
    }

    const { appUrl, modo } = await ambienteDeEmail();
    if (modo !== 'smtp') {
      log('SMTP não configurado: o e-mail não sairia daqui. Nada enviado.');
      process.exitCode = 1;
      return;
    }

    const { subject, html, text } = welcomeTemplate({
      name: nome ?? usuario.name,
      appUrl,
      admin: usuario.role === 'ADMIN',
    });
    await enviarMensagem({ para: email, assunto: subject, html, texto: text });
    log(`enviado para ${mascararEmail(email)} (${usuario.role}).`);
  } finally {
    await prisma.$disconnect();
    await fecharTransporte();
  }
}

main().catch((erro: unknown) => {
  console.error('[boas-vindas] falhou:', erro instanceof Error ? erro.message : erro);
  process.exitCode = 1;
});
