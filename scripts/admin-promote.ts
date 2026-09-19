/**
 * Promove um usuário **que já existe** a ADMIN — BACKOFFICE §1.3.
 *
 * Diferença para o `admin:create`: este script **não cria conta e não toca na
 * senha**. Serve para o caso comum de "a pessoa já tem conta de aluno e agora
 * precisa do painel" — e serve, também, para o inverso, com `--rebaixar`.
 *
 * Uso:
 *   npm run admin:promote -- --email=pessoa@exemplo.com
 *   npm run admin:promote -- --email=pessoa@exemplo.com --rebaixar
 *   ADMIN_EMAIL=... npm run admin:promote
 *
 * ⚠️ Este script **abre conexão com o banco**. Ele não roda em máquina sem
 * PostgreSQL de pé.
 *
 * Idempotente: promover quem já é admin (ou rebaixar quem já é aluno) não muda
 * nada e diz isso em voz alta.
 *
 * Com o painel no ar, o caminho normal é o bloco "Acesso de administrador" no
 * detalhe da conta (com motivo, auditoria e alerta). Este script fica para o
 * primeiro admin e para quando ninguém consegue entrar no painel. Ele também
 * recusa rebaixar a última conta de admin.
 */
import type { PrismaClient, Role } from '@prisma/client';

import { esqueciSenhaSchema } from '../src/lib/auth/schemas';

/** `--email=valor` → `valor`. Sem o argumento, `undefined`. */
function argumento(nome: string): string | undefined {
  const prefixo = `--${nome}=`;
  const achado = process.argv.find((item) => item.startsWith(prefixo));
  return achado?.slice(prefixo.length);
}

/** Mesmo caminho de normalização do app — ver o comentário em `admin-create.ts`. */
function emailNormalizado(bruto: string): string {
  const resultado = esqueciSenhaSchema.safeParse({ email: bruto });
  if (!resultado.success) {
    throw new Error('E-mail inválido. Use algo como --email=pessoa@exemplo.com');
  }
  return resultado.data.email;
}

async function main(): Promise<void> {
  const email = emailNormalizado(argumento('email') ?? process.env.ADMIN_EMAIL ?? '');
  const rebaixar = process.argv.includes('--rebaixar');
  const destino: Role = rebaixar ? 'STUDENT' : 'ADMIN';

  if (!process.env.DATABASE_URL && typeof process.loadEnvFile === 'function') {
    try {
      process.loadEnvFile();
    } catch {
      // Sem .env local: as variáveis precisam vir do ambiente.
    }
  }

  const { prisma } = (await import('../src/lib/db')) as { prisma: PrismaClient };

  try {
    const usuario = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, role: true, emailVerifiedAt: true },
    });

    if (!usuario) {
      // Sem `upsert` de propósito: promover é um verbo sobre alguém que existe.
      // Criar conta aqui seria uma porta paralela ao `admin:create`, com as
      // regras de senha dele contornadas.
      throw new Error(
        `Nenhuma conta com esse e-mail. Para criar a primeira, use: npm run admin:create -- --email=${email} --nome="..." --senha=...`,
      );
    }

    if (usuario.role === destino) {
      console.log(`[admin:promote] nada a fazer: ${usuario.email} já é ${destino}.`);
      return;
    }

    if (destino === 'STUDENT') {
      // Mesma regra do painel (`bloqueioDeAcesso`): o produto nunca fica sem
      // admin. Promova outra pessoa antes de rebaixar a última.
      const outrosAdmins = await prisma.user.count({
        where: { role: 'ADMIN', deletedAt: null, id: { not: usuario.id } },
      });
      if (outrosAdmins === 0) {
        throw new Error(
          'Esta é a única conta de administrador. Promova outra pessoa antes de rebaixar esta.',
        );
      }
    }

    await prisma.user.update({
      where: { id: usuario.id },
      data: {
        role: destino,
        // Promover alguém que nunca confirmou o e-mail deixaria o painel
        // dependente do SMTP para nada — o papel já é a confirmação de que
        // alguém com acesso ao servidor conhece essa pessoa.
        ...(destino === 'ADMIN' && usuario.emailVerifiedAt === null
          ? { emailVerifiedAt: new Date() }
          : {}),
      },
    });

    if (destino === 'ADMIN') {
      console.log(`[admin:promote] ${usuario.email} agora é ADMIN (era ${usuario.role}).`);
      if (usuario.emailVerifiedAt === null) {
        console.log('[admin:promote] e-mail marcado como verificado.');
      }
      console.log(
        '[admin:promote] a senha não foi alterada — a pessoa entra com a que já usava.',
      );
    } else {
      console.log(`[admin:promote] ${usuario.email} voltou a ser STUDENT.`);
      console.log(
        '[admin:promote] as sessões abertas continuam válidas como aluno; o painel some na próxima navegação.',
      );
    }
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((erro: unknown) => {
  console.error('[admin:promote] falhou:', erro instanceof Error ? erro.message : erro);
  process.exitCode = 1;
});
