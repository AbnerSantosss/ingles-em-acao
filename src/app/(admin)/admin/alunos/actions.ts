/**
 * Server Actions dos alunos — BACKOFFICE §2.7, §6.3 e §6.5.
 *
 * ⚠️ **Server Actions, não route handlers.** Toda função daqui começa por
 * `requireAdmin()` (o layout do painel protege a *renderização*, não o POST de
 * uma action) e termina por `auditar()`. Não existe atalho.
 *
 * ⚠️ **Nada de dado pessoal no log.** O que vai para `console.error` é id,
 * quantidade e mensagem do driver. Nome e e-mail de aluno, nunca.
 *
 * ⚠️ **Não existe "excluir aluno" com `DELETE`** (§7). O que existe é
 * **anonimizar** (`anonimizarContaAction`), com o mesmo núcleo que o próprio
 * aluno usa em "Excluir minha conta" no `/perfil`: `src/lib/conta/anonimizar.ts`.
 * A linha de `User` fica (os pagamentos apontam para ela); o que identifica a
 * pessoa e todo o progresso saem. O cabeçalho daquele módulo lista o que sai e
 * o que fica, e por quê.
 *
 * ⚠️ **Não existe campo para digitar nota.** O que existe é recálculo (§6.5),
 * que roda `pontuar()` de novo contra o conteúdo publicado.
 */
'use server';

import { revalidatePath } from 'next/cache';

import {
  bloqueioDeAcesso,
  esquemaDeId,
  esquemaDeMotivo,
  esquemaDePapel,
  esquemaDePlano,
  limiteDeReenvio,
  recalcularProgressoDoAluno,
} from '@/lib/admin/alunos';
import { auditar } from '@/lib/admin/audit';
import { requireAdmin } from '@/lib/admin/guard';
import type { SessionUser } from '@/lib/auth/session';
import { destroyOtherSessions } from '@/lib/auth/session';
import { createVerificationToken } from '@/lib/auth/tokens';
import { anonimizarConta, type DadosApagados } from '@/lib/conta/anonimizar';
import { prisma } from '@/lib/db';
import { alertarMudancaDeAcesso, alertarMudancaDePlano } from '@/lib/mail/admin-alertas';
import { sendVerificationEmail } from '@/lib/mail/send';

import type { ErrosDeCampo, EstadoDoFormulario } from './tipos';

// ─────────────────────────── utilidades locais ───────────────────────────

function falha(mensagem: string, campos?: ErrosDeCampo): EstadoDoFormulario {
  return campos ? { estado: 'erro', mensagem, campos } : { estado: 'erro', mensagem };
}

function sucesso(mensagem: string): EstadoDoFormulario {
  return { estado: 'ok', mensagem };
}

/**
 * `requireAdmin()` com a recusa virando estado de formulário.
 *
 * A action não pode redirecionar (um POST respondido com 307 faz o navegador
 * repetir o POST na tela de login), então a sessão vencida vira texto na tela.
 */
async function autenticar(): Promise<
  { ok: true; admin: SessionUser } | { ok: false; estado: EstadoDoFormulario }
> {
  try {
    return { ok: true, admin: await requireAdmin() };
  } catch {
    return {
      ok: false,
      estado: falha(
        'Sua sessão administrativa não vale mais. Recarregue a página e entre de novo.',
      ),
    };
  }
}

/** Texto de um campo do formulário, já aparado. */
function texto(dados: FormData, campo: string): string {
  const valor = dados.get(campo);
  return typeof valor === 'string' ? valor.trim() : '';
}

/** Erro inesperado do banco vira texto para o admin e linha no log do servidor. */
function erroDeBanco(onde: string, erro: unknown): EstadoDoFormulario {
  const motivo = erro instanceof Error ? erro.message : 'erro desconhecido';
  console.error(`[painel] alunos (${onde}): ${motivo}`);
  return falha('O banco de dados não completou a operação. Tente de novo em instantes.');
}

/** As telas que mostram aluno. */
function revalidar(id: string): void {
  revalidatePath('/admin/alunos');
  revalidatePath(`/admin/alunos/${id}`);
  revalidatePath('/admin');
}

const FORMATO_DE_HORA = new Intl.DateTimeFormat('pt-BR', {
  timeStyle: 'short',
  timeZone: 'America/Sao_Paulo',
});

const FORMATO_DE_DATA = new Intl.DateTimeFormat('pt-BR', {
  dateStyle: 'short',
  timeStyle: 'short',
  timeZone: 'America/Sao_Paulo',
});

/**
 * Recusa das actions que mexem numa conta já anonimizada. A tela esconde esses
 * botões, mas uma action é um POST público: a página aberta antes da exclusão
 * (ou um POST montado à mão) ainda chega aqui.
 */
const CONTA_ANONIMIZADA = 'Esta conta foi anonimizada. Não há mais o que alterar nela.';

// ────────────────────────────── mudar plano ──────────────────────────────

/**
 * Troca o plano de um aluno. **Motivo obrigatório** (§6.3) e **alerta por
 * e-mail** para os admins (§2.9).
 *
 * ⚠️ Mudar plano muda **acesso**, não dinheiro: não cobra, não estorna e não
 * fala com gateway nenhum. Quem cobra é o checkout.
 *
 * ⚠️ O alerta sai **depois** da gravação e da auditoria. Se o e-mail falhar, a
 * troca continua de pé e a falha vira uma segunda linha de auditoria — desfazer
 * uma mudança de acesso porque o SMTP caiu seria deixar o produto refém do
 * servidor de e-mail.
 */
export async function mudarPlanoAction(
  _estado: EstadoDoFormulario,
  dados: FormData,
): Promise<EstadoDoFormulario> {
  const sessao = await autenticar();
  if (!sessao.ok) return sessao.estado;

  const id = esquemaDeId.safeParse(texto(dados, 'id'));
  if (!id.success) return falha('Aluno não identificado. Recarregue a página.');

  const plano = esquemaDePlano.safeParse(texto(dados, 'plano'));
  const motivo = esquemaDeMotivo.safeParse(texto(dados, 'motivo'));

  if (!plano.success || !motivo.success) {
    const campos: Record<string, string> = {};
    if (!plano.success) campos.plano = plano.error.issues[0]?.message ?? 'plano inválido';
    if (!motivo.success) campos.motivo = motivo.error.issues[0]?.message ?? 'motivo inválido';
    return falha('Confira os campos marcados.', campos);
  }

  try {
    const antes = await prisma.user.findUnique({
      where: { id: id.data },
      select: { id: true, name: true, email: true, plan: true, role: true, deletedAt: true },
    });
    if (!antes) return falha('Esse aluno não existe mais.');
    if (antes.deletedAt !== null) return falha(CONTA_ANONIMIZADA);

    if (antes.plan === plano.data) {
      return falha(`O aluno já está no plano ${plano.data}.`, {
        plano: 'escolha um plano diferente do atual',
      });
    }

    const depois = await prisma.user.update({
      where: { id: id.data },
      data: { plan: plano.data },
      select: { id: true, plan: true },
    });

    await auditar({
      actor: sessao.admin,
      action: 'user.plan.change',
      resource: `User:${antes.id}`,
      before: { plan: antes.plan },
      after: { plan: depois.plan },
      reason: motivo.data,
    });

    const alerta = await alertarMudancaDePlano({
      admin: sessao.admin.email,
      alunoId: antes.id,
      alunoNome: antes.name,
      alunoEmail: antes.email,
      de: antes.plan,
      para: depois.plan,
      motivo: motivo.data,
    });

    if (!alerta.enviado) {
      // A mudança está feita e auditada; o que falhou foi avisar. Isso também
      // é fato auditável — e é `DENY` porque *o alerta* não aconteceu.
      await auditar({
        actor: sessao.admin,
        action: 'user.plan.change.alert',
        resource: `User:${antes.id}`,
        outcome: 'DENY',
        after: { destinatarios: alerta.destinatarios, falhas: alerta.falhas },
        reason: alerta.motivo ?? 'alerta não enviado',
      });
    }

    revalidar(antes.id);
    return sucesso(
      alerta.enviado
        ? `Plano alterado para ${depois.plan}. Alerta enviado para ${alerta.destinatarios} admin(s).`
        : `Plano alterado para ${depois.plan}. O alerta por e-mail não saiu (${alerta.motivo ?? 'sem detalhe'}) — a mudança e a falha estão na auditoria.`,
    );
  } catch (erro: unknown) {
    return erroDeBanco('mudar plano', erro);
  }
}

// ──────────────────────── acesso de administrador ────────────────────────

/**
 * Dá ou tira o acesso de administrador de uma conta. A conta continua a mesma:
 * mesmo login, mesmo plano, mesmo progresso. Muda só se o painel abre para ela.
 *
 * As regras (e-mail confirmado para dar; ninguém tira o próprio acesso; a
 * última conta de admin não perde o acesso) moram em `bloqueioDeAcesso()`.
 * **Motivo obrigatório** e **alerta por e-mail**, como na troca de plano.
 *
 * ⚠️ A leitura e a gravação correm numa transação que trava as linhas de admin
 * (`FOR UPDATE`). Sem a trava, dois admins tirando o acesso um do outro ao mesmo
 * tempo passariam os dois pela regra de "último admin" e o painel ficaria sem
 * dono. Com ela, o segundo espera o primeiro terminar e já conta um admin a
 * menos.
 *
 * ⚠️ Tirar o acesso não derruba as sessões: elas seguem valendo como aluno, e o
 * painel deixa de abrir na próxima navegação, porque o papel é lido do banco a
 * cada pedido.
 */
export async function mudarAcessoDeAdminAction(
  _estado: EstadoDoFormulario,
  dados: FormData,
): Promise<EstadoDoFormulario> {
  const sessao = await autenticar();
  if (!sessao.ok) return sessao.estado;

  const id = esquemaDeId.safeParse(texto(dados, 'id'));
  if (!id.success) return falha('Conta não identificada. Recarregue a página.');

  const papel = esquemaDePapel.safeParse(texto(dados, 'papel'));
  if (!papel.success) return falha('Pedido incompleto. Recarregue a página.');

  const motivo = esquemaDeMotivo.safeParse(texto(dados, 'motivo'));
  if (!motivo.success) {
    return falha('Confira os campos marcados.', {
      motivo: motivo.error.issues[0]?.message ?? 'motivo inválido',
    });
  }

  const destino = papel.data;

  try {
    const resultado = await prisma.$transaction(async (tx) => {
      // Trava as contas de admin até o fim da transação (ver o cabeçalho).
      const admins = await tx.$queryRaw<{ id: string }[]>`
        SELECT id FROM "User" WHERE role = 'ADMIN' AND "deletedAt" IS NULL FOR UPDATE`;

      const conta = await tx.user.findUnique({
        where: { id: id.data },
        select: { id: true, name: true, email: true, role: true, emailVerifiedAt: true, deletedAt: true },
      });
      if (!conta) return { ok: false as const, mensagem: 'Essa conta não existe mais.', antes: null };
      if (conta.deletedAt !== null) {
        return { ok: false as const, mensagem: CONTA_ANONIMIZADA, antes: null };
      }

      const bloqueio = bloqueioDeAcesso({
        conta: { id: conta.id, role: conta.role, emailVerificado: conta.emailVerifiedAt !== null },
        destino,
        adminId: sessao.admin.id,
        adminsAtivos: admins.length,
      });
      if (bloqueio) return { ok: false as const, mensagem: bloqueio, antes: conta.role };

      await tx.user.update({ where: { id: conta.id }, data: { role: destino } });
      return { ok: true as const, conta };
    });

    if (!resultado.ok) {
      // Recusa pela regra é tentativa sobre o acesso ao painel: fica na
      // auditoria, como as negativas do guarda.
      if (resultado.antes !== null) {
        await auditar({
          actor: sessao.admin,
          action: 'user.role.change',
          resource: `User:${id.data}`,
          outcome: 'DENY',
          before: { role: resultado.antes },
          after: { role: destino },
          reason: resultado.mensagem,
        });
      }
      return falha(resultado.mensagem);
    }

    const { conta } = resultado;
    const deuAcesso = destino === 'ADMIN';

    await auditar({
      actor: sessao.admin,
      action: 'user.role.change',
      resource: `User:${conta.id}`,
      before: { role: conta.role },
      after: { role: destino },
      reason: motivo.data,
    });

    const alerta = await alertarMudancaDeAcesso({
      admin: sessao.admin.email,
      contaId: conta.id,
      contaNome: conta.name,
      contaEmail: conta.email,
      deuAcesso,
      motivo: motivo.data,
    });

    if (!alerta.enviado) {
      await auditar({
        actor: sessao.admin,
        action: 'user.role.change.alert',
        resource: `User:${conta.id}`,
        outcome: 'DENY',
        after: { destinatarios: alerta.destinatarios, falhas: alerta.falhas },
        reason: alerta.motivo ?? 'alerta não enviado',
      });
    }

    revalidar(conta.id);
    const feito = deuAcesso
      ? 'Acesso de administrador liberado. O painel abre para esta conta no próximo acesso.'
      : 'Acesso de administrador retirado. A conta continua estudando como aluno.';
    return sucesso(
      alerta.enviado
        ? `${feito} Alerta enviado para ${alerta.destinatarios} admin(s).`
        : `${feito} O alerta por e-mail não saiu (${alerta.motivo ?? 'sem detalhe'}), e a falha está na auditoria.`,
    );
  } catch (erro: unknown) {
    return erroDeBanco('mudar acesso de admin', erro);
  }
}

// ───────────────────────── reenviar verificação ──────────────────────────

/**
 * Reenvia o e-mail de verificação de um aluno.
 *
 * ⚠️ **Com limite: 3 por hora por aluno** (§2.7). Sem ele, o painel vira uma
 * máquina de mandar e-mail para o endereço de outra pessoa — e o domínio do
 * app vira spam. A tentativa barrada é auditada com `DENY`: é justamente ela
 * que conta uma história, quando vier a dúvida.
 *
 * ⚠️ O token **cru** nunca volta para a tela, nem para o log. Ele vai direto
 * para o e-mail do aluno; o banco guarda só o SHA-256.
 */
export async function reenviarVerificacaoAction(
  _estado: EstadoDoFormulario,
  dados: FormData,
): Promise<EstadoDoFormulario> {
  const sessao = await autenticar();
  if (!sessao.ok) return sessao.estado;

  const id = esquemaDeId.safeParse(texto(dados, 'id'));
  if (!id.success) return falha('Aluno não identificado. Recarregue a página.');

  try {
    const aluno = await prisma.user.findUnique({
      where: { id: id.data },
      select: { id: true, name: true, email: true, emailVerifiedAt: true, deletedAt: true },
    });
    if (!aluno) return falha('Esse aluno não existe mais.');
    // Sem esta tranca, o reenvio criaria um token novo para a conta excluída e
    // tentaria mandar e-mail para o endereço-marcador.
    if (aluno.deletedAt !== null) return falha(CONTA_ANONIMIZADA);

    if (aluno.emailVerifiedAt !== null) {
      return falha('O e-mail deste aluno já está verificado — não há o que reenviar.');
    }

    const limite = await limiteDeReenvio(aluno.id);
    if (!limite.permitido) {
      await auditar({
        actor: sessao.admin,
        action: 'user.verification.resend',
        resource: `User:${aluno.id}`,
        outcome: 'DENY',
        reason: `limite de ${limite.limite} reenvios por hora atingido`,
      });

      const hora = limite.liberaEm ? FORMATO_DE_HORA.format(limite.liberaEm) : 'daqui a pouco';
      return falha(
        `Limite de ${limite.limite} reenvios por hora atingido para este aluno. Libera às ${hora}.`,
      );
    }

    const token = await createVerificationToken(aluno.id, 'EMAIL_VERIFY');
    const resultado = await sendVerificationEmail({
      to: aluno.email,
      name: aluno.name,
      token,
    });

    await auditar({
      actor: sessao.admin,
      action: 'user.verification.resend',
      resource: `User:${aluno.id}`,
      outcome: resultado.ok ? 'ALLOW' : 'DENY',
      after: { enviado: resultado.ok, tentativaDaHora: limite.enviados + 1 },
      ...(resultado.ok ? {} : { reason: 'o transporte de e-mail recusou a mensagem' }),
    });

    revalidar(aluno.id);
    return resultado.ok
      ? sucesso(
          `E-mail de verificação reenviado (${limite.enviados + 1} de ${limite.limite} nesta hora).`,
        )
      : falha(
          'O token foi gerado, mas o e-mail não saiu. Confira o estado do e-mail em Configurações.',
        );
  } catch (erro: unknown) {
    return erroDeBanco('reenviar verificação', erro);
  }
}

// ─────────────────────────── encerrar sessões ────────────────────────────

/**
 * Derruba as sessões abertas do aluno — o "saiu de todos os aparelhos" feito
 * pelo suporte.
 *
 * ⚠️ `destroyOtherSessions` preserva a sessão **do próprio pedido**. Como quem
 * está pedindo é o admin, e a sessão dele é dele, todas as sessões do aluno
 * caem. O único caso em que sobra uma é o admin fazendo isso na própria conta —
 * e aí sobrar a aba aberta é o comportamento desejado, não um bug.
 */
export async function encerrarSessoesAction(
  _estado: EstadoDoFormulario,
  dados: FormData,
): Promise<EstadoDoFormulario> {
  const sessao = await autenticar();
  if (!sessao.ok) return sessao.estado;

  const id = esquemaDeId.safeParse(texto(dados, 'id'));
  if (!id.success) return falha('Aluno não identificado. Recarregue a página.');

  try {
    const aluno = await prisma.user.findUnique({
      where: { id: id.data },
      select: { id: true },
    });
    if (!aluno) return falha('Esse aluno não existe mais.');

    const antes = await prisma.session.count({ where: { userId: aluno.id } });
    if (antes === 0) return falha('Este aluno não tem nenhuma sessão aberta.');

    await destroyOtherSessions(aluno.id);
    const depois = await prisma.session.count({ where: { userId: aluno.id } });

    await auditar({
      actor: sessao.admin,
      action: 'user.sessions.revoke',
      resource: `User:${aluno.id}`,
      before: { sessoes: antes },
      after: { sessoes: depois },
    });

    revalidar(aluno.id);
    return sucesso(`${antes - depois} sessão(ões) encerrada(s).`);
  } catch (erro: unknown) {
    return erroDeBanco('encerrar sessões', erro);
  }
}

// ────────────────────────── recalcular progresso ─────────────────────────

/**
 * Recalcula o placar do aluno a partir das respostas gravadas — §6.5.
 *
 * ⚠️ **Isto é recálculo, não edição.** A action não recebe nota nenhuma: ela
 * manda `pontuar()` rodar de novo contra o conteúdo publicado e grava o que
 * saiu. Aula concluída continua concluída, `completedAt` não é tocado e
 * `ExerciseAnswer` não é alterado em nada (§6.1).
 *
 * O resultado vai inteiro para a auditoria: quantas aulas mudaram, quais e de
 * quanto para quanto. É o que permite responder "por que a nota do aluno mudou"
 * daqui a três meses.
 */
export async function recalcularProgressoAction(
  _estado: EstadoDoFormulario,
  dados: FormData,
): Promise<EstadoDoFormulario> {
  const sessao = await autenticar();
  if (!sessao.ok) return sessao.estado;

  const id = esquemaDeId.safeParse(texto(dados, 'id'));
  if (!id.success) return falha('Aluno não identificado. Recarregue a página.');

  try {
    const aluno = await prisma.user.findUnique({ where: { id: id.data }, select: { id: true } });
    if (!aluno) return falha('Esse aluno não existe mais.');

    const resultado = await recalcularProgressoDoAluno(aluno.id);

    await auditar({
      actor: sessao.admin,
      action: 'user.progress.recalc',
      resource: `User:${aluno.id}`,
      after: {
        aulasExaminadas: resultado.aulasExaminadas,
        criadas: resultado.criadas,
        ajustes: resultado.ajustes.map((ajuste) => ({
          aula: ajuste.numero,
          antes: `${ajuste.antes.score ?? '—'}/${ajuste.antes.total ?? '—'}`,
          depois: `${ajuste.depois.score}/${ajuste.depois.total}`,
        })),
        ignoradas: resultado.ignoradas,
      },
    });

    revalidar(aluno.id);

    if (resultado.ajustes.length === 0) {
      return sucesso(
        resultado.aulasExaminadas === 0
          ? 'Não há respostas gravadas para recalcular.'
          : `Nada mudou: o placar guardado já batia com a recontagem em ${resultado.aulasExaminadas} aula(s).`,
      );
    }

    const numeros = resultado.ajustes.map((ajuste) => ajuste.numero).join(', ');
    const ignoradas =
      resultado.ignoradas.length > 0
        ? ` ${resultado.ignoradas.length} aula(s) ficaram como estavam (veja a auditoria).`
        : '';

    return sucesso(`${resultado.ajustes.length} aula(s) recalculada(s): ${numeros}.${ignoradas}`);
  } catch (erro: unknown) {
    return erroDeBanco('recalcular progresso', erro);
  }
}

// ─────────────────────────── anonimizar conta ────────────────────────────

/** Valor que o checkbox "entendo que é irreversível" manda quando marcado. */
const CONFIRMACAO_DE_ANONIMIZACAO = 'sim';

function totalApagado(apagados: DadosApagados): number {
  return (
    apagados.sessoes +
    apagados.tokens +
    apagados.progresso +
    apagados.respostas +
    apagados.diasDeEstudo +
    apagados.tentativasDeLogin
  );
}

/**
 * Anonimiza a conta de um aluno — o pedido de exclusão que chegou pelo suporte
 * (e-mail, WhatsApp) em vez de pelo `/perfil`. **Irreversível.**
 *
 * Exige **motivo** (vai para a auditoria, como na troca de plano) e a caixa de
 * **confirmação** marcada — conferida aqui, não só na tela: um POST montado à
 * mão sem a caixa não passa.
 *
 * ⚠️ Administrador não é anonimizado (o núcleo recusa). Nem outro, nem o
 * próprio: rebaixar é feito no banco, por quem cuida do servidor.
 *
 * ⚠️ A auditoria leva **só números** (plano, quantas linhas saíram de cada
 * tabela) — nada de nome ou e-mail do aluno, que é justamente o que acabou de
 * ser apagado. O `resource` (`User:<id>`) é o vínculo.
 *
 * Conta que já estava anonimizada: o núcleo repassa a varredura. Se algo
 * sobrou (um login concorrente, por exemplo) e saiu agora, isso é auditado;
 * se não havia nada, a resposta só informa, sem linha nova na auditoria.
 */
export async function anonimizarContaAction(
  _estado: EstadoDoFormulario,
  dados: FormData,
): Promise<EstadoDoFormulario> {
  const sessao = await autenticar();
  if (!sessao.ok) return sessao.estado;

  const id = esquemaDeId.safeParse(texto(dados, 'id'));
  if (!id.success) return falha('Aluno não identificado. Recarregue a página.');

  const motivo = esquemaDeMotivo.safeParse(texto(dados, 'motivo'));
  const confirmou = texto(dados, 'confirmacao') === CONFIRMACAO_DE_ANONIMIZACAO;

  if (!motivo.success || !confirmou) {
    const campos: Record<string, string> = {};
    if (!motivo.success) campos.motivo = motivo.error.issues[0]?.message ?? 'motivo inválido';
    if (!confirmou) campos.confirmacao = 'marque a caixa para confirmar';
    return falha('Confira os campos marcados.', campos);
  }

  try {
    const antes = await prisma.user.findUnique({
      where: { id: id.data },
      select: { id: true, plan: true, role: true, emailVerifiedAt: true, deletedAt: true },
    });
    if (!antes) return falha('Esse aluno não existe mais.');

    if (antes.role === 'ADMIN') {
      await auditar({
        actor: sessao.admin,
        action: 'user.anonymize',
        resource: `User:${antes.id}`,
        outcome: 'DENY',
        reason: 'conta de administrador',
      });
      return falha(
        'Conta de administrador não pode ser anonimizada. Tire antes o acesso de administrador, no bloco "Acesso de administrador" desta página.',
      );
    }

    const resultado = await anonimizarConta(antes.id);

    if (!resultado.ok) {
      return resultado.motivo === 'administrador'
        ? falha('Esta conta virou administradora no meio do caminho. Nada foi apagado.')
        : falha('Esse aluno não existe mais.');
    }

    const quando = FORMATO_DE_DATA.format(resultado.excluidaEm);

    if (resultado.jaEstavaExcluida) {
      const sobras = totalApagado(resultado.apagados);
      if (sobras === 0) {
        return falha(`Esta conta já estava anonimizada desde ${quando}. Não havia nada a apagar.`);
      }

      await auditar({
        actor: sessao.admin,
        action: 'user.anonymize',
        resource: `User:${antes.id}`,
        after: { repasse: true, apagados: resultado.apagados },
        reason: motivo.data,
      });
      revalidar(antes.id);
      return sucesso(
        `Esta conta já estava anonimizada desde ${quando}. Sobras apagadas agora: ${sobras} linha(s).`,
      );
    }

    await auditar({
      actor: sessao.admin,
      action: 'user.anonymize',
      resource: `User:${antes.id}`,
      before: { plan: antes.plan, emailVerificado: antes.emailVerifiedAt !== null },
      after: { excluida: true, apagados: resultado.apagados },
      reason: motivo.data,
    });

    revalidar(antes.id);
    const { apagados } = resultado;
    return sucesso(
      `Conta anonimizada. Saíram ${apagados.progresso} registro(s) de aula, ${apagados.respostas} resposta(s), ` +
        `${apagados.diasDeEstudo} dia(s) de estudo e ${apagados.sessoes} sessão(ões). Os pagamentos ficaram.`,
    );
  } catch (erro: unknown) {
    return erroDeBanco('anonimizar conta', erro);
  }
}
