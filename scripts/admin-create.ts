/**
 * Cria (ou reaproveita) a conta de administrador do painel — BACKOFFICE §1.3.
 *
 * **Não existe tela de "criar admin" e o seed não cria admin.** Este script é o
 * único caminho, e é assim de propósito: uma tela de cadastro de admin é uma
 * porta a mais para defender, e um seed que cria admin coloca a mesma senha em
 * toda instalação que rodar `npm run db:seed`.
 *
 * Uso:
 *   npm run admin:create -- --email=voce@exemplo.com --nome="Seu Nome" --senha=...
 *   ADMIN_EMAIL=... ADMIN_NAME=... ADMIN_PASSWORD=... npm run admin:create
 *
 * Em produção (Portainer), a forma prática é
 * `docker exec -it <container> npm run admin:create` com as variáveis já no
 * ambiente do contêiner: a senha não fica no histórico do shell nem em `ps`.
 *
 * ⚠️ Este script **abre conexão com o banco**. Ele não roda em máquina sem
 * PostgreSQL de pé.
 *
 * ⚠️ Nada aqui imprime a senha, o hash, nem um pedaço deles. Se você for
 * acrescentar uma linha de log, essa regra vale para ela também.
 */
import type { PrismaClient } from '@prisma/client';

import { hashPassword } from '../src/lib/auth/password';
import { esqueciSenhaSchema } from '../src/lib/auth/schemas';

/**
 * Mínimo de 12 caracteres, não os 8 do contrato §5.8.
 *
 * Sem segundo fator (decisão registrada: "sem segundo fator no MVP"), esta senha
 * é a única barreira do painel. As outras compensações — rate limit de login,
 * sessão administrativa de 8 h e auditoria de tudo — não substituem o tamanho.
 */
const TAMANHO_MINIMO_SENHA_ADMIN = 12;

/** `--email=valor` → `valor`. Sem o argumento, `undefined`. */
function argumento(nome: string): string | undefined {
  const prefixo = `--${nome}=`;
  const achado = process.argv.find((item) => item.startsWith(prefixo));
  return achado?.slice(prefixo.length);
}

/**
 * Normaliza e valida o e-mail pelo mesmo caminho que o app usa.
 *
 * `esqueciSenhaSchema` é o schema exportado que aplica o `campoEmail` do
 * `src/lib/auth/schemas.ts`: apara, passa para minúsculas e confere o formato.
 * Reimplementar isso aqui criaria o dia em que `Admin@Gmail.com` e
 * `admin@gmail.com` viram duas contas — e a de cima some no login.
 */
function emailNormalizado(bruto: string): string {
  const resultado = esqueciSenhaSchema.safeParse({ email: bruto });
  if (!resultado.success) {
    throw new Error('E-mail inválido. Use algo como --email=voce@exemplo.com');
  }
  return resultado.data.email;
}

type Entrada = { email: string; nome: string; senha: string; senhaVeioDoArgv: boolean };

function lerEntrada(): Entrada {
  const senhaDoArgv = argumento('senha');

  const email = emailNormalizado(argumento('email') ?? process.env.ADMIN_EMAIL ?? '');
  const nome = (argumento('nome') ?? process.env.ADMIN_NAME ?? '').trim();
  const senha = senhaDoArgv ?? process.env.ADMIN_PASSWORD ?? '';

  if (nome.length < 2) {
    throw new Error('Informe o nome do admin: --nome="Seu Nome" (ou ADMIN_NAME).');
  }

  if (senha.length < TAMANHO_MINIMO_SENHA_ADMIN) {
    throw new Error(
      `A senha do admin precisa de pelo menos ${TAMANHO_MINIMO_SENHA_ADMIN} caracteres.`,
    );
  }

  return { email, nome, senha, senhaVeioDoArgv: senhaDoArgv !== undefined };
}

async function main(): Promise<void> {
  const entrada = lerEntrada();

  // O Prisma 7 não carrega mais o .env sozinho, e este script roda fora do Next.
  if (!process.env.DATABASE_URL && typeof process.loadEnvFile === 'function') {
    try {
      process.loadEnvFile();
    } catch {
      // Sem .env local: as variáveis precisam vir do ambiente.
    }
  }

  // Importado sob demanda para que o .env já esteja carregado quando o client
  // nascer — `src/lib/db.ts` lê DATABASE_URL no momento em que é importado.
  const { prisma } = (await import('../src/lib/db')) as { prisma: PrismaClient };

  try {
    const existente = await prisma.user.findUnique({
      where: { email: entrada.email },
      select: { id: true, role: true },
    });

    const passwordHash = await hashPassword(entrada.senha);

    // `upsert`, não `create`: rodar duas vezes é inofensivo, e é justamente o
    // procedimento para trocar a senha do admin quando ela se perder.
    const usuario = await prisma.user.upsert({
      where: { email: entrada.email },
      update: {
        role: 'ADMIN',
        passwordHash,
        // O admin não depende de receber e-mail para entrar: se o SMTP estiver
        // quebrado, o painel continua acessível — e é pelo painel que se
        // conserta o SMTP.
        emailVerifiedAt: new Date(),
      },
      create: {
        email: entrada.email,
        name: entrada.nome,
        passwordHash,
        role: 'ADMIN',
        emailVerifiedAt: new Date(),
      },
      select: { id: true, email: true },
    });

    // Trocar a senha e deixar as sessões antigas de pé seria um meio-conserto:
    // quem já estava dentro continuaria dentro. É a mesma regra do contrato §5.5
    // para a redefinição de senha.
    const { count: sessoesEncerradas } = await prisma.session.deleteMany({
      where: { userId: usuario.id },
    });

    if (!existente) {
      console.log(`[admin:create] conta criada e promovida a ADMIN: ${usuario.email}`);
    } else if (existente.role !== 'ADMIN') {
      console.log(
        `[admin:create] conta já existia como ${existente.role}: promovida a ADMIN e senha redefinida — ${usuario.email}`,
      );
    } else {
      console.log(`[admin:create] admin já existia: senha redefinida — ${usuario.email}`);
    }

    console.log(`[admin:create] id: ${usuario.id}`);
    console.log(`[admin:create] e-mail marcado como verificado.`);

    if (sessoesEncerradas > 0) {
      console.log(
        `[admin:create] ${sessoesEncerradas} sessão(ões) anterior(es) encerrada(s) — entre de novo.`,
      );
    }

    if (entrada.senhaVeioDoArgv) {
      console.log(
        '[admin:create] aviso: a senha veio pela linha de comando e pode ter ficado no ' +
          'histórico do shell e visível em "ps". Prefira a variável ADMIN_PASSWORD.',
      );
    }
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((erro: unknown) => {
  // A mensagem de erro nunca carrega a senha: as validações acima falam do
  // tamanho, nunca do valor.
  console.error('[admin:create] falhou:', erro instanceof Error ? erro.message : erro);
  process.exitCode = 1;
});
