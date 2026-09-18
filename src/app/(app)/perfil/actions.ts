'use server';

/**
 * Ações do perfil: sair, encerrar outras sessões e reenviar a verificação
 * de e-mail (esta última também usada pelo aviso na Home).
 *
 * ⚠️ Arquivo `'use server'` só pode exportar funções assíncronas — por isso o
 * tipo `EstadoDeReenvio` mora no componente e volta aqui como `import type`,
 * que desaparece na compilação.
 */
import { redirect } from 'next/navigation';

import type { EstadoDeReenvio } from '@/components/app/VerifyEmailBanner';
import { destroyCurrentSession, destroyOtherSessions, requireUser } from '@/lib/auth/session';
import { createVerificationToken } from '@/lib/auth/tokens';
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
