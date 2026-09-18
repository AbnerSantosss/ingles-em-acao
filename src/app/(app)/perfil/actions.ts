'use server';

/**
 * Ações do perfil: sair, encerrar outras sessões, reenviar a verificação
 * de e-mail (esta também usada pelo aviso na Home) e excluir a conta.
 *
 * ⚠️ Arquivo `'use server'` só pode exportar funções assíncronas — por isso os
 * tipos `EstadoDeReenvio` e `EstadoDaExclusao` moram fora daqui e voltam como
 * `import type`, que desaparece na compilação.
 */
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import type { EstadoDaExclusao } from '@/app/(app)/perfil/tipos';
import { VALOR_DA_CONFIRMACAO } from '@/app/(app)/perfil/tipos';
import type { EstadoDeReenvio } from '@/components/app/VerifyEmailBanner';
import { auditar } from '@/lib/admin/audit';
import { verifyPassword } from '@/lib/auth/password';
import { ipDosCabecalhos, isRateLimited, recordLoginAttempt } from '@/lib/auth/rate-limit';
import { destroyCurrentSession, destroyOtherSessions, requireUser } from '@/lib/auth/session';
import { createVerificationToken } from '@/lib/auth/tokens';
import { anonimizarConta } from '@/lib/conta/anonimizar';
import { prisma } from '@/lib/db';
import { sendVerificationEmail } from '@/lib/mail/send';

/** Janela mínima entre dois reenvios do mesmo e-mail de verificação. */
const INTERVALO_DE_REENVIO_MS = 60 * 1000;

/**
 * Encerra a sessão deste navegador e volta para a tela de entrada.
 *
 * `redirect()` lança internamente (NEXT_REDIRECT), então fica fora do try do
 * `destroyCurrentSession` — que já limpa o cookie mesmo se o banco cair.
 */
export async function sairAction(): Promise<void> {
  await requireUser();
  await destroyCurrentSession();
  redirect('/entrar');
}

/**
 * Expulsa os outros dispositivos e mantém este.
 *
 * O `userId` vem de `requireUser()`, nunca do formulário: assim a operação não
 * tem como alcançar a sessão de outra pessoa.
 */
export async function encerrarOutrasSessoesAction(): Promise<void> {
  const usuario = await requireUser();
  await destroyOtherSessions(usuario.id);
  redirect('/perfil?aviso=sessoes-encerradas');
}

/**
 * Reenvia o link de confirmação de e-mail.
 *
 * Devolve estado em vez de redirecionar porque o botão vive numa faixa no topo
 * da Home: recarregar a tela inteira para dizer "enviado" seria pior do que
 * trocar a frase no lugar.
 */
/* eslint-disable @typescript-eslint/no-unused-vars -- assinatura fixa do useActionState */
export async function reenviarVerificacaoAction(
  _anterior: EstadoDeReenvio,
  _formData: FormData,
): Promise<EstadoDeReenvio> {
  /* eslint-enable @typescript-eslint/no-unused-vars */
  const usuario = await requireUser();

  if (usuario.emailVerifiedAt) {
    return { estado: 'aviso', mensagem: 'Este e-mail já está confirmado.' };
  }

  // Freio simples contra cliques repetidos: se já existe um token válido criado
  // há menos de um minuto, o link anterior ainda está a caminho.
  try {
    const recente = await prisma.verificationToken.findFirst({
      where: {
        userId: usuario.id,
        type: 'EMAIL_VERIFY',
        usedAt: null,
        expiresAt: { gt: new Date() },
        createdAt: { gt: new Date(Date.now() - INTERVALO_DE_REENVIO_MS) },
      },
      select: { id: true },
    });

    if (recente) {
      return {
        estado: 'aviso',
        mensagem: 'Acabamos de enviar um link. Confira sua caixa de entrada e o spam.',
      };
    }
  } catch {
    // Consulta do freio é otimização, não regra de segurança: se o banco
    // reclamar aqui, seguimos para a criação do token (que vai falhar de forma
    // visível se o problema for real).
  }

  try {
    const token = await createVerificationToken(usuario.id, 'EMAIL_VERIFY');
    const resultado = await sendVerificationEmail({
      to: usuario.email,
      name: usuario.name,
      token,
    });

    if (!resultado.ok) {
      return {
        estado: 'erro',
        mensagem: 'Não conseguimos enviar agora. Tente de novo em alguns minutos.',
      };
    }

    return { estado: 'ok', mensagem: 'Link reenviado. Confira sua caixa de entrada.' };
  } catch {
    return {
      estado: 'erro',
      mensagem: 'Não conseguimos enviar agora. Tente de novo em alguns minutos.',
    };
  }
}

/** Texto do bloqueio por excesso de senhas erradas — o mesmo tom do login. */
function mensagemDeBloqueio(segundos: number): string {
  const minutos = Math.max(1, Math.ceil(segundos / 60));
  const unidade = minutos === 1 ? 'minuto' : 'minutos';
  return `Muitas tentativas seguidas. Por segurança, aguarde ${minutos} ${unidade} antes de tentar de novo.`;
}

const FALHA_GENERICA: EstadoDaExclusao = {
  estado: 'erro',
  mensagem: 'Não conseguimos excluir sua conta agora. Nada foi apagado; tente de novo em alguns minutos.',
};

/**
 * "Excluir minha conta" — o aluno pede a exclusão dos próprios dados (LGPD,
 * art. 18, VI). O que sai e o que fica está em `src/lib/conta/anonimizar.ts`.
 *
 * A ordem importa:
 *
 * 1. **Sessão válida** (`requireUser`) — o id vem dela, nunca do formulário.
 * 2. **Administrador não se exclui por aqui**: precisa ser rebaixado antes.
 * 3. **Confirmação explícita** (checkbox) e **senha de novo**. Um cookie
 *    esquecido num computador compartilhado não pode bastar para apagar tudo.
 * 4. **Limite de tentativas** do login, pelo mesmo par (e-mail, IP): sem ele,
 *    esta tela viraria um oráculo de senha sem freio para quem pegou uma sessão
 *    aberta. A senha errada conta como falha de login; a recusa por bloqueio
 *    não conta (ver `recordLoginAttempt`). A resposta a uma senha errada é só
 *    "Senha incorreta." — nada mais.
 * 5. **Auditoria ANTES da anonimização**: a linha `user.delete.self` é a prova
 *    de que o pedido veio do próprio aluno. Depois da anonimização a sessão já
 *    não existe e o nome e o e-mail já foram trocados. O `before` leva só o
 *    plano e se o e-mail estava confirmado — o e-mail fica apenas no `actorEmail` que o
 *    `auditar()` congela, que é o vínculo mínimo para responder "vocês
 *    apagaram meus dados?" depois.
 * 6. **Anonimiza** (transação única; apaga TODAS as sessões, inclusive esta).
 * 7. **Limpa o cookie** deste navegador e manda para `/entrar`.
 *
 * `redirect()` lança (NEXT_REDIRECT), então fica fora de qualquer try.
 */
export async function excluirContaAction(
  _anterior: EstadoDaExclusao,
  dados: FormData,
): Promise<EstadoDaExclusao> {
  const usuario = await requireUser();

  if (usuario.role === 'ADMIN') {
    return {
      estado: 'erro',
      mensagem:
        'Conta de administrador não pode ser excluída por aqui. Quem cuida do servidor precisa retirar o acesso de administrador antes.',
    };
  }

  const senha = dados.get('senha');
  const confirmacao = dados.get('confirmacao');

  if (typeof senha !== 'string' || senha.length === 0) {
    return { estado: 'erro', mensagem: 'Digite a sua senha para confirmar.', campo: 'senha' };
  }

  if (confirmacao !== VALOR_DA_CONFIRMACAO) {
    return {
      estado: 'erro',
      mensagem: 'Marque a caixa confirmando que você entende que a exclusão não pode ser desfeita.',
      campo: 'confirmacao',
    };
  }

  const ip = ipDosCabecalhos(await headers());

  const bloqueio = await isRateLimited(usuario.email, ip);
  if (bloqueio.limited) {
    return { estado: 'erro', mensagem: mensagemDeBloqueio(bloqueio.retryAfterSeconds) };
  }

  let hashGuardado: string | null = null;
  try {
    const conta = await prisma.user.findUnique({
      where: { id: usuario.id },
      select: { passwordHash: true },
    });
    hashGuardado = conta?.passwordHash ?? null;
  } catch {
    return FALHA_GENERICA;
  }

  // `verifyPassword` nunca lança; hash ausente ou estranho vira "não bateu".
  const confere = await verifyPassword(hashGuardado ?? '', senha);
  if (!confere) {
    try {
      await recordLoginAttempt(usuario.email, ip, false);
    } catch {
      // Sem registro a senha continua errada; só a contagem perde um ponto.
    }
    return { estado: 'erro', mensagem: 'Senha incorreta.', campo: 'senha' };
  }

  await auditar({
    actor: usuario,
    action: 'user.delete.self',
    resource: `User:${usuario.id}`,
    before: { plano: usuario.plan, emailVerificado: usuario.emailVerifiedAt !== null },
  });

  let resultado: Awaited<ReturnType<typeof anonimizarConta>>;
  try {
    resultado = await anonimizarConta(usuario.id);
  } catch (erro: unknown) {
    // Log sem dado pessoal: id e motivo técnico.
    const motivo = erro instanceof Error ? erro.message : 'erro desconhecido';
    console.error(`[conta] exclusão de ${usuario.id} falhou: ${motivo}`);
    await auditar({
      actor: usuario,
      action: 'user.delete.self',
      resource: `User:${usuario.id}`,
      outcome: 'DENY',
      reason: 'o banco não completou a anonimização',
    });
    return FALHA_GENERICA;
  }

  if (!resultado.ok) {
    await auditar({
      actor: usuario,
      action: 'user.delete.self',
      resource: `User:${usuario.id}`,
      outcome: 'DENY',
      reason: resultado.motivo === 'administrador' ? 'conta de administrador' : 'conta não encontrada',
    });
    return FALHA_GENERICA;
  }

  // A linha da sessão já saiu na anonimização; isto limpa o cookie.
  await destroyCurrentSession();

  redirect('/entrar?conta=excluida');
}
