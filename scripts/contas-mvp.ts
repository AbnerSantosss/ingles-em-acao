/**
 * Contas de validação do MVP: um admin e um aluno, criados no start do container.
 *
 * O `docker-entrypoint.sh` roda este script a cada start quando alguma das
 * variáveis abaixo existe no ambiente da stack (Portainer). Ele **só cria**: se o
 * e-mail já tem conta, nada muda — nem senha, nem papel, nem plano, nem sessões.
 * Assim um restart nunca derruba quem está logado nem desfaz uma troca de senha.
 *
 *   ADMIN_EMAIL, ADMIN_PASSWORD (mín. 12), ADMIN_NAME (opcional)
 *   ALUNO_EMAIL, ALUNO_PASSWORD (mín. 8),  ALUNO_NAME (opcional)
 *
 * O aluno nasce no plano PREMIUM, para o MVP ser validado com tudo liberado
 * enquanto o pagamento não existe; o plano muda depois em /admin/alunos.
 * Os dois nascem com o e-mail verificado: o MVP roda sem SMTP.
 *
 * Trocar a senha de uma conta que já existe continua sendo com
 * `npm run admin:create` (admin). Depois do primeiro deploy, as senhas podem
 * sair do ambiente da stack: as contas ficam no banco.
 *
 * ⚠️ Nada aqui imprime senha, hash ou pedaço deles — este log aparece inteiro no
 * Portainer. A mesma regra vale para qualquer linha de log nova.
 */
import type { PrismaClient, Role } from '@prisma/client';

import { TAMANHO_MINIMO_SENHA } from '../src/lib/auth/constantes';
import { hashPassword } from '../src/lib/auth/password';
import { esqueciSenhaSchema } from '../src/lib/auth/schemas';

/** O mesmo mínimo do `admin:create`: sem segundo fator, a senha é a única barreira. */
const TAMANHO_MINIMO_SENHA_ADMIN = 12;

type Conta = {
  rotulo: 'admin' | 'aluno';
  prefixo: 'ADMIN' | 'ALUNO';
  role: Role;
  nomePadrao: string;
  tamanhoMinimo: number;
};

const CONTAS: Conta[] = [
  {
    rotulo: 'admin',
    prefixo: 'ADMIN',
    role: 'ADMIN',
    nomePadrao: 'Administrador',
    tamanhoMinimo: TAMANHO_MINIMO_SENHA_ADMIN,
  },
  {
    rotulo: 'aluno',
    prefixo: 'ALUNO',
    role: 'STUDENT',
    nomePadrao: 'Aluno MVP',
    tamanhoMinimo: TAMANHO_MINIMO_SENHA,
  },
];

const log = (mensagem: string) => console.log(`[contas-mvp] ${mensagem}`);

/** Mesma normalização do login (minúsculas, sem espaço) — senão a conta não entra. */
function emailNormalizado(bruto: string): string | null {
  const resultado = esqueciSenhaSchema.safeParse({ email: bruto });
  return resultado.success ? resultado.data.email : null;
}

async function criarSeFaltar(prisma: PrismaClient, conta: Conta): Promise<boolean> {
  const emailBruto = process.env[`${conta.prefixo}_EMAIL`]?.trim() ?? '';
  const senha = process.env[`${conta.prefixo}_PASSWORD`] ?? '';
  const nome = process.env[`${conta.prefixo}_NAME`]?.trim() || conta.nomePadrao;

  if (!emailBruto && !senha) return true;

  const email = emailNormalizado(emailBruto);
  if (!email) {
    log(`${conta.prefixo}_EMAIL ausente ou inválido: conta de ${conta.rotulo} não criada.`);
    return false;
  }

  const existente = await prisma.user.findUnique({ where: { email }, select: { role: true } });
  if (existente) {
    log(`${conta.rotulo} já existe (${email}, ${existente.role}): nada alterado.`);
    return true;
  }

  if (senha.length < conta.tamanhoMinimo) {
    log(
      `${conta.prefixo}_PASSWORD precisa de pelo menos ${conta.tamanhoMinimo} caracteres: ` +
        `conta de ${conta.rotulo} não criada.`,
    );
    return false;
  }

  await prisma.user.create({
    data: {
      email,
      name: nome,
      passwordHash: await hashPassword(senha),
      role: conta.role,
      plan: 'PREMIUM',
      emailVerifiedAt: new Date(),
    },
  });
  log(`conta de ${conta.rotulo} criada: ${email}`);
  return true;
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

  // Importado depois do .env: `src/lib/db.ts` lê DATABASE_URL ao ser importado.
  const { prisma } = (await import('../src/lib/db')) as { prisma: PrismaClient };

  try {
    let tudoCerto = true;
    for (const conta of CONTAS) {
      tudoCerto = (await criarSeFaltar(prisma, conta)) && tudoCerto;
    }
    if (!tudoCerto) process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((erro: unknown) => {
  console.error('[contas-mvp] falhou:', erro instanceof Error ? erro.message : erro);
  process.exitCode = 1;
});
