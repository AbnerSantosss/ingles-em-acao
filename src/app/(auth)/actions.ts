'use server';

/**
 * Server Actions das telas de acesso.
 *
 * Todas seguem a assinatura que o `useActionState` exige —
 * `(estadoAnterior, formData) => Promise<EstadoDaAcao>` — e todas validam com os
 * schemas zod de `@/lib/auth/schemas` **no servidor**, porque a validação do
 * navegador é conveniência, não barreira (contrato §5.8).
 *
 * ⚠️ Duas regras atravessam o arquivo inteiro:
 *
 * 1. **`redirect()` funciona lançando uma exceção.** Ele nunca pode ficar dentro
 *    de um `try` que engole erros, senão o `catch` comeria o redirecionamento e a
 *    tela voltaria com um erro genérico depois de um login bem-sucedido. Aqui ele
 *    é sempre a última linha, fora de qualquer bloco.
 * 2. **Nada aqui revela se uma conta existe** — nem pela mensagem (login e
 *    recuperação usam texto neutro) nem pelo tempo de resposta (ver
 *    {@link HASH_DE_REFERENCIA}). A única exceção é o cadastro, onde dizer
 *    "esse e-mail já está em uso" é o padrão de UX aceito: a pessoa precisa saber
 *    por que não conseguiu criar a conta, e um atacante descobriria o mesmo
 *    apenas tentando cadastrar.
 */

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { safeNext } from '@/lib/auth/next-url';
import { hashPassword, precisaRehash, verifyPassword } from '@/lib/auth/password';
import { ipDosCabecalhos, isRateLimited, recordLoginAttempt } from '@/lib/auth/rate-limit';
import {
  criarContaSchema,
  entrarSchema,
  esqueciSenhaSchema,
  redefinirSenhaSchema,
  validarFormulario,
  type ErrosDeCampo,
} from '@/lib/auth/schemas';
import { createSession, destroyAllSessions, requireUser } from '@/lib/auth/session';
import { consumeVerificationToken, createVerificationToken } from '@/lib/auth/tokens';
import { prisma } from '@/lib/db';
import { sendPasswordResetEmail, sendVerificationEmail } from '@/lib/mail/send';

// ---------------------------------------------------------------------------
// Estado compartilhado pelos formulários
// ---------------------------------------------------------------------------

/**
 * Valores devolvidos ao formulário depois de uma falha.
 *
 * ⚠️ Não é enfeite: o React **reseta** todo `<form action={fn}>` assim que a
 * ação começa (`requestFormReset`, em `react-dom`). Sem devolver o que a pessoa
 * digitou, um erro de senha apagaria também o e-mail já preenchido. A senha
 * nunca volta — senha digitada não faz o caminho de volta pela rede.
 */
export type ValoresDoFormulario = {
  email?: string;
  nome?: string;
  lembrar?: boolean;
  aceite?: boolean;
};

/** O que toda ação deste arquivo devolve ao `useActionState`. */
export type EstadoDaAcao = {
  /** Uma mensagem por campo. A chave `_form` é o aviso geral do topo. */
  erros?: ErrosDeCampo;
  /** Mensagem de sucesso, quando a ação termina sem redirecionar. */
  mensagem?: string;
  /** Verdadeiro quando deu certo e a tela deve trocar de estado. */
  ok?: boolean;
  /** `/redefinir-senha`: o link morreu; a tela some com o formulário. */
  tokenInvalido?: boolean;
  /** Para repovoar os campos depois de uma falha. */
  valores?: ValoresDoFormulario;
};

// ---------------------------------------------------------------------------
// Textos
// ---------------------------------------------------------------------------

/** Contrato §5: nunca dizer qual dos dois campos errou. */
const CREDENCIAIS_INVALIDAS = 'E-mail ou senha incorretos.';

/** Contrato §5.5: a mesma frase exista ou não a conta. */
const RESPOSTA_NEUTRA_DE_RECUPERACAO =
  'Se existir uma conta com esse e-mail, enviamos as instruções.';

const EMAIL_JA_CADASTRADO =
  'Já existe uma conta com esse e-mail. Entre na sua conta ou recupere a senha.';

const TOKEN_DE_SENHA_INVALIDO =
  'Este link de redefinição não vale mais — ele expira em 1 hora e só pode ser usado uma vez.';

const ERRO_INESPERADO = 'Não conseguimos concluir agora. Tente novamente em alguns instantes.';

/**
 * Hash Argon2id de uma senha aleatória de 32 bytes que ninguém conhece — e que
 * não foi guardada em lugar nenhum.
 *
 * Serve **só para gastar tempo**. Sem ele, um e-mail inexistente responderia em
 * ~1 ms (nem chega a verificar nada) e um e-mail real em ~100 ms (o custo do
 * Argon2). Cronometrando as respostas dá para separar quem tem conta de quem não
 * tem, sem nunca acertar uma senha — e essa lista vale dinheiro.
 *
 * É constante, e não gerado na inicialização, para o primeiro login do processo
 * não custar um hash a mais do que os seguintes. Foi gerado com os
 * `PARAMETROS_ARGON2` deste projeto, para o custo da verificação bater com o de
 * um hash real do banco.
 */
const HASH_DE_REFERENCIA =
  '$argon2id$v=19$m=32768,t=3,p=1$0zyX6RL/dVn0KGybYy5Rag$/wpjqpCqmr6+BVURzJMk3lEwYqTi0xf0krvfbij15ng';

// ---------------------------------------------------------------------------
// Utilidades internas
// (não exportadas: um arquivo 'use server' só pode exportar função async)
// ---------------------------------------------------------------------------

/** Lê um campo de texto do `FormData`, ignorando vazio e arquivo. */
function texto(formData: FormData, chave: string): string | null {
  const valor = formData.get(chave);
  return typeof valor === 'string' && valor.length > 0 ? valor : null;
}

/** Mensagem do bloqueio por tentativas (contrato §5.4). */
function mensagemDeBloqueio(segundos: number): string {
  const minutos = Math.max(1, Math.ceil(segundos / 60));
  const unidade = minutos === 1 ? 'minuto' : 'minutos';
  return `Muitas tentativas seguidas. Por segurança, aguarde ${minutos} ${unidade} antes de tentar de novo.`;
}

/**
 * Reconhece a violação de índice único do Prisma (`P2002`) sem importar o
 * namespace `Prisma`, que só existe depois de `prisma generate` e amarraria
 * estas telas ao ciclo de geração do cliente.
 */
function ehChaveDuplicada(erro: unknown): boolean {
  return (
    typeof erro === 'object' &&
    erro !== null &&
    'code' in erro &&
    (erro as { code?: unknown }).code === 'P2002'
  );
}

// ---------------------------------------------------------------------------
// Entrar
// ---------------------------------------------------------------------------

/**
 * Login. Valida, confere o bloqueio por tentativas, autentica e abre a sessão.
 *
 * A ordem importa: o bloqueio é consultado **antes** de tocar no usuário, e a
 * tentativa bloqueada **não** é registrada — registrar renovaria a janela de 15
 * minutos a cada recarga e o bloqueio nunca terminaria (está no JSDoc de
 * `isRateLimited`).
 */
export async function entrarAction(
  estadoAnterior: EstadoDaAcao,
  formData: FormData,
): Promise<EstadoDaAcao> {
  void estadoAnterior;

  const validacao = validarFormulario(entrarSchema, formData);

  if (!validacao.ok) {
    return {
      erros: validacao.erros,
      valores: {
        email: texto(formData, 'email') ?? '',
        lembrar: formData.get('lembrar') !== null,
      },
    };
  }

  const { email, senha, lembrar, next } = validacao.dados;
  const destino = safeNext(next);
  const devolver: ValoresDoFormulario = { email, lembrar };

  try {
    const ip = ipDosCabecalhos(await headers());

    const bloqueio = await isRateLimited(email, ip);
    if (bloqueio.limited) {
      return {
        erros: { _form: mensagemDeBloqueio(bloqueio.retryAfterSeconds) },
        valores: devolver,
      };
    }

    const usuario = await prisma.user.findUnique({
      where: { email },
      select: { id: true, passwordHash: true, role: true },
    });

    // Conta inexistente também paga o preço do Argon2. Ver HASH_DE_REFERENCIA.
    const confere = await verifyPassword(usuario?.passwordHash ?? HASH_DE_REFERENCIA, senha);
    const autenticado = usuario !== null && confere;

    await recordLoginAttempt(email, ip, autenticado);

    if (!usuario || !autenticado) {
      return { erros: { _form: CREDENCIAIS_INVALIDAS }, valores: devolver };
    }

    // Único momento em que a senha existe em texto puro: aproveitamos para subir
    // o custo do hash antigo, caso os parâmetros tenham mudado desde o cadastro.
    if (precisaRehash(usuario.passwordHash)) {
      try {
        await prisma.user.update({
          where: { id: usuario.id },
          data: { passwordHash: await hashPassword(senha) },
        });
      } catch {
        // Falhar ao migrar o hash não pode impedir um login legítimo.
      }
    }

    // BACKOFFICE §1.2: "lembrar-me" é ignorado para ADMIN — a sessão do painel
    // não ganha os 30 dias nem cookie persistente, marque-se o que for.
    await createSession(usuario.id, lembrar && usuario.role !== 'ADMIN');
  } catch {
    return { erros: { _form: ERRO_INESPERADO }, valores: devolver };
  }

  redirect(destino);
}

// ---------------------------------------------------------------------------
// Criar conta
// ---------------------------------------------------------------------------

/**
 * Cadastro. Cria o usuário com senha em Argon2id, dispara a confirmação de
 * e-mail e já entra com a pessoa.
 *
 * A confirmação de e-mail **não bloqueia o app** (contrato §5.6): se o SMTP
 * estiver fora, o cadastro segue e a Home mostra o aviso com o botão de reenvio
 * (`reenviarVerificacaoAction`).
 */
export async function criarContaAction(
  estadoAnterior: EstadoDaAcao,
  formData: FormData,
): Promise<EstadoDaAcao> {
  void estadoAnterior;

  const validacao = validarFormulario(criarContaSchema, formData);
  const destino = safeNext(texto(formData, 'next'));

  if (!validacao.ok) {
    return {
      erros: validacao.erros,
      valores: {
        nome: texto(formData, 'nome') ?? '',
        email: texto(formData, 'email') ?? '',
        aceite: formData.get('aceite') !== null,
      },
    };
  }

  const { nome, email, senha } = validacao.dados;
  const devolver: ValoresDoFormulario = { nome, email, aceite: true };

  let usuarioId: string;

  try {
    const jaExiste = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (jaExiste) return { erros: { email: EMAIL_JA_CADASTRADO }, valores: devolver };

    const criado = await prisma.user.create({
      // O e-mail já chega minúsculo e aparado do schema (coluna única, §4).
      data: { name: nome, email, passwordHash: await hashPassword(senha) },
      select: { id: true },
    });

    usuarioId = criado.id;
  } catch (erro) {
    // Duas pessoas cadastrando o mesmo e-mail no mesmo segundo: o índice único
    // decide, e quem perdeu recebe a mesma mensagem da verificação acima.
    if (ehChaveDuplicada(erro)) {
      return { erros: { email: EMAIL_JA_CADASTRADO }, valores: devolver };
    }
    return { erros: { _form: ERRO_INESPERADO }, valores: devolver };
  }

  try {
    const token = await createVerificationToken(usuarioId, 'EMAIL_VERIFY');
    await sendVerificationEmail({ to: email, name: nome, token });
  } catch {
    // Silêncio proposital: a conta existe, e o reenvio resolve depois.
  }

  try {
    // `remember: true` de propósito: quem acabou de criar a conta não deveria
    // perder a sessão ao fechar o navegador. No login, quem decide é a caixinha.
    await createSession(usuarioId, true);
  } catch {
    return {
      erros: {
        _form:
          'Sua conta foi criada, mas não conseguimos abrir a sessão. Entre com seu e-mail e senha.',
      },
      valores: devolver,
    };
  }

  redirect(destino);
}

// ---------------------------------------------------------------------------
// Esqueci minha senha
// ---------------------------------------------------------------------------

/**
 * Pedido de redefinição.
 *
 * ⚠️ Devolve **sempre** a mesma mensagem de sucesso (contrato §5.5). Nem o texto,
 * nem um erro, nem o fato de o e-mail ter saído podem denunciar se a conta
 * existe — por isso até a falha de banco cai no mesmo retorno.
 */
export async function esqueciSenhaAction(
  estadoAnterior: EstadoDaAcao,
  formData: FormData,
): Promise<EstadoDaAcao> {
  void estadoAnterior;

  const validacao = validarFormulario(esqueciSenhaSchema, formData);

  if (!validacao.ok) {
    return { erros: validacao.erros, valores: { email: texto(formData, 'email') ?? '' } };
  }

  const { email } = validacao.dados;

  try {
    const usuario = await prisma.user.findUnique({
      where: { email },
      select: { id: true, name: true, email: true },
    });

    if (usuario) {
      const token = await createVerificationToken(usuario.id, 'PASSWORD_RESET');
      await sendPasswordResetEmail({ to: usuario.email, name: usuario.name, token });
    }
  } catch {
    // Mesma resposta: um erro aqui não pode virar um canal de descoberta.
  }

  return { ok: true, mensagem: RESPOSTA_NEUTRA_DE_RECUPERACAO, valores: { email } };
}

// ---------------------------------------------------------------------------
// Redefinir senha
// ---------------------------------------------------------------------------

/**
 * Troca a senha usando o token do e-mail.
 *
 * Gasta o token (uso único), grava a senha nova, derruba **todas** as sessões
 * antigas — é o ponto do contrato §5.5: quem estava dentro com a senha anterior
 * sai — e abre uma sessão nova para quem acabou de redefinir.
 */
export async function redefinirSenhaAction(
  estadoAnterior: EstadoDaAcao,
  formData: FormData,
): Promise<EstadoDaAcao> {
  void estadoAnterior;

  const validacao = validarFormulario(redefinirSenhaSchema, formData);
  if (!validacao.ok) return { erros: validacao.erros };

  const { token, senha, next } = validacao.dados;
  const destino = safeNext(next);

  let usuarioId: string | null;

  try {
    usuarioId = await consumeVerificationToken(token, 'PASSWORD_RESET');
  } catch {
    return { erros: { _form: ERRO_INESPERADO } };
  }

  if (!usuarioId) {
    return { erros: { _form: TOKEN_DE_SENHA_INVALIDO }, tokenInvalido: true };
  }

  try {
    await prisma.user.update({
      where: { id: usuarioId },
      data: { passwordHash: await hashPassword(senha) },
    });

    // Outros pedidos de redefinição em aberto morrem junto: quem pediu o link
    // três vezes não deve ficar com dois links vivos depois de trocar a senha.
    await prisma.verificationToken.updateMany({
      where: { userId: usuarioId, type: 'PASSWORD_RESET', usedAt: null },
      data: { usedAt: new Date() },
    });

    await destroyAllSessions(usuarioId);

    // `remember: false`: a redefinição costuma acontecer num aparelho que não é
    // o de sempre. Quem quiser os 30 dias marca a caixinha no próximo login.
    await createSession(usuarioId, false);
  } catch {
    return { erros: { _form: ERRO_INESPERADO } };
  }

  redirect(destino);
}

// ---------------------------------------------------------------------------
// Reenviar a confirmação de e-mail
// ---------------------------------------------------------------------------

/**
 * Reenvia o e-mail de confirmação para quem está logado.
 *
 * Usada pelo aviso da Home (contrato §5.6). `requireUser()` fica fora de
 * qualquer `try` porque ele também redireciona lançando.
 */
export async function reenviarVerificacaoAction(
  estadoAnterior: EstadoDaAcao,
  formData: FormData,
): Promise<EstadoDaAcao> {
  void estadoAnterior;
  void formData;

  const usuario = await requireUser();

  if (usuario.emailVerifiedAt) {
    return { ok: true, mensagem: 'Seu e-mail já está confirmado.' };
  }

  try {
    const token = await createVerificationToken(usuario.id, 'EMAIL_VERIFY');
    const { ok } = await sendVerificationEmail({
      to: usuario.email,
      name: usuario.name,
      token,
    });

    if (!ok) {
      return {
        erros: {
          _form: 'Não conseguimos enviar o e-mail agora. Tente de novo em alguns minutos.',
        },
      };
    }
  } catch {
    return { erros: { _form: ERRO_INESPERADO } };
  }

  return {
    ok: true,
    mensagem: `Pronto! Enviamos um novo link de confirmação para ${usuario.email}. O link vale por 24 horas.`,
  };
}
