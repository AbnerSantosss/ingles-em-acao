/**
 * Alertas internos para os admins — BACKOFFICE §2.9.
 *
 * ⚠️ Duas ações do painel mandam e-mail: **troca do link de checkout** e
 * **mudança de plano de aluno**. São as duas que, feitas por engano ou por uma
 * conta comprometida, só apareceriam no faturamento semanas depois. O custo é
 * quase zero (o transporte já existe) e o ganho é transformar "descobri em
 * novembro" em "recebi um e-mail estranho hoje".
 *
 * ⚠️ **Falha de envio não desfaz a ação.** A mudança já foi gravada e já está
 * na auditoria quando este módulo é chamado; se o SMTP estiver fora do ar, a
 * action segue em frente e registra uma segunda linha de auditoria dizendo que
 * o alerta não saiu. O contrário — desfazer a troca de plano porque o e-mail
 * falhou — seria deixar o produto refém do servidor de e-mail.
 *
 * ⚠️ Nada daqui escreve no banco e nada daqui lança. Os erros viram
 * {@link ResultadoDoAlerta}, que quem chama audita.
 *
 * Este arquivo **não** mexe em `templates.ts` (que é dos e-mails do aluno):
 * monta o HTML com os mesmos ajudantes de `layout.ts` e despacha pelo
 * `transport.ts`.
 *
 * ⚠️ MÓDULO DE SERVIDOR (importa o Prisma e o transporte SMTP). Nunca importe
 * de um `'use client'`.
 */
import type { Plan } from '@prisma/client';

import { prisma } from '@/lib/db';

import {
  aviso,
  botao,
  escaparHtml,
  layoutEmail,
  paragrafo,
  rodapeEmTexto,
  separador,
  titulo,
} from './layout';
import { ambienteDeEmail, descreverErro, enviarMensagem, mascararEmail } from './transport';

// ───────────────────────────────── tipos ─────────────────────────────────

export type ResultadoDoAlerta = {
  /** Saiu para pelo menos um admin. */
  enviado: boolean;
  /** Quantos admins eram para receber. */
  destinatarios: number;
  /** Quantos envios falharam. */
  falhas: number;
  /** Por que não saiu, quando `enviado` é falso. Nunca traz credencial. */
  motivo?: string;
};

export type AlertaDePlano = {
  /** Quem fez a mudança. */
  admin: string;
  alunoId: string;
  alunoNome: string;
  alunoEmail: string;
  de: Plan;
  para: Plan;
  motivo: string;
};

/** Um link que mudou: o global ou o de um plano. */
export type TrocaDeLink = {
  /** "Global" ou o nome do plano. */
  escopo: string;
  de: string | null;
  para: string | null;
};

export type AlertaDeCheckout = {
  admin: string;
  /** Um salvamento pode trocar vários links; o alerta sai **um só**, com todos. */
  trocas: readonly TrocaDeLink[];
  motivo: string;
};

const ROTULO_DO_PLANO: Record<Plan, string> = {
  ESSENCIAL: 'Essencial',
  COMPLETO: 'Completo',
  PREMIUM: 'Premium',
};

const FORMATO_DE_DATA = new Intl.DateTimeFormat('pt-BR', {
  dateStyle: 'short',
  timeStyle: 'short',
  timeZone: 'America/Sao_Paulo',
});

// ──────────────────────────────── despacho ───────────────────────────────

/**
 * Os admins que recebem alerta.
 *
 * Todo mundo com `role: 'ADMIN'`. Não há lista separada de destinatários: uma
 * segunda lista para manter é uma lista para esquecer de atualizar.
 */
async function destinatarios(): Promise<string[]> {
  const admins = await prisma.user.findMany({
    where: { role: 'ADMIN' },
    select: { email: true },
    orderBy: { createdAt: 'asc' },
    take: 20,
  });
  return admins.map((admin) => admin.email);
}

/**
 * Manda a mesma mensagem para cada admin, um envio por vez.
 *
 * Um endereço recusado derruba só o envio dele — por isso o laço, e não um
 * `to` com a lista inteira. E o resultado conta as falhas para a action poder
 * auditar "saiu para 2 de 3".
 */
async function despachar(
  assunto: string,
  preheader: string,
  conteudo: string,
  texto: string,
): Promise<ResultadoDoAlerta> {
  let lista: string[];
  try {
    lista = await destinatarios();
  } catch (erro: unknown) {
    return {
      enviado: false,
      destinatarios: 0,
      falhas: 0,
      motivo: `não deu para listar os admins: ${descreverErro(erro)}`,
    };
  }

  if (lista.length === 0) {
    return { enviado: false, destinatarios: 0, falhas: 0, motivo: 'nenhum admin cadastrado' };
  }

  const html = layoutEmail({ assunto, preheader, conteudo, publico: 'painel' });
  let falhas = 0;
  let ultimoErro = '';

  for (const para of lista) {
    try {
      await enviarMensagem({ para, assunto, html, texto });
    } catch (erro: unknown) {
      falhas += 1;
      ultimoErro = descreverErro(erro);
      // ⚠️ Log sem dado pessoal: endereço mascarado e motivo técnico, só.
      console.error(
        `[painel] alerta não saiu para ${mascararEmail(para)}: ${ultimoErro}`,
      );
    }
  }

  const enviado = falhas < lista.length;
  return {
    enviado,
    destinatarios: lista.length,
    falhas,
    ...(enviado ? {} : { motivo: ultimoErro || 'o transporte recusou a mensagem' }),
  };
}

/** Linha "rótulo: valor" do corpo do alerta. */
function linha(rotulo: string, valor: string): string {
  return paragrafo(`<strong>${escaparHtml(rotulo)}:</strong> ${escaparHtml(valor)}`, {
    margem: 6,
  });
}

// ───────────────────────────── plano de aluno ────────────────────────────

/**
 * "O plano de um aluno mudou."
 *
 * ⚠️ O e-mail traz o nome do aluno e o endereço **mascarado**, mais o link do
 * detalhe no painel. Quem precisa do e-mail inteiro abre o painel, que exige
 * sessão de admin; a caixa de entrada de todo mundo não precisa dele.
 */
export async function alertarMudancaDePlano(dados: AlertaDePlano): Promise<ResultadoDoAlerta> {
  try {
    const { appUrl } = await ambienteDeEmail();
    const link = `${appUrl}/admin/alunos/${dados.alunoId}`;
    const de = ROTULO_DO_PLANO[dados.de];
    const para = ROTULO_DO_PLANO[dados.para];
    const quando = FORMATO_DE_DATA.format(new Date());

    const assunto = `[Painel] Plano de aluno alterado: ${de} → ${para}`;

    const conteudo = [
      titulo('Plano de aluno alterado'),
      paragrafo(
        'Esta é uma notificação automática do painel. Se você não reconhece esta ação, ' +
          'confira a auditoria agora.',
      ),
      separador(),
      linha('Aluno', dados.alunoNome),
      linha('E-mail', mascararEmail(dados.alunoEmail)),
      linha('De', de),
      linha('Para', para),
      linha('Motivo', dados.motivo),
      linha('Por', dados.admin),
      linha('Quando', quando),
      separador(),
      botao({ href: link, rotulo: 'Abrir o aluno no painel' }),
      aviso(
        'Mudança de plano não cobra e não estorna nada — ela só muda o acesso. ' +
          'A cobrança continua sendo assunto do checkout.',
      ),
    ].join('');

    const texto = [
      'Plano de aluno alterado',
      '',
      `Aluno: ${dados.alunoNome}`,
      `E-mail: ${mascararEmail(dados.alunoEmail)}`,
      `De: ${de}`,
      `Para: ${para}`,
      `Motivo: ${dados.motivo}`,
      `Por: ${dados.admin}`,
      `Quando: ${quando}`,
      '',
      `Detalhe do aluno: ${link}`,
      '',
      rodapeEmTexto('painel'),
    ].join('\n');

    return await despachar(assunto, `${dados.alunoNome}: ${de} → ${para}`, conteudo, texto);
  } catch (erro: unknown) {
    const motivo = descreverErro(erro);
    console.error(`[painel] alerta de plano não pôde ser montado: ${motivo}`);
    return { enviado: false, destinatarios: 0, falhas: 0, motivo };
  }
}

// ──────────────────────────── link de checkout ───────────────────────────

/**
 * "O link de checkout mudou."
 *
 * ⚠️ O alerta mostra o endereço **inteiro**, antigo e novo. Aqui o dado não é
 * pessoal e é exatamente o que precisa ser conferido de relance: um link de
 * checkout trocado por outro domínio é o cenário que este e-mail existe para
 * pegar no mesmo dia.
 */
export async function alertarTrocaDeCheckout(dados: AlertaDeCheckout): Promise<ResultadoDoAlerta> {
  try {
    if (dados.trocas.length === 0) {
      return { enviado: false, destinatarios: 0, falhas: 0, motivo: 'nenhum link mudou' };
    }

    const { appUrl } = await ambienteDeEmail();
    const link = `${appUrl}/admin/configuracoes`;
    const quando = FORMATO_DE_DATA.format(new Date());
    const escopos = dados.trocas.map((troca) => troca.escopo).join(', ');
    const antes = (troca: TrocaDeLink): string => troca.de ?? '(não havia link)';
    const agora = (troca: TrocaDeLink): string => troca.para ?? '(removido)';

    const assunto = `[Painel] Link de checkout alterado (${escopos})`;

    const conteudo = [
      titulo('Link de checkout alterado'),
      paragrafo(
        'Os botões de compra do app passam a apontar para o novo endereço. ' +
          'Se você não reconhece esta mudança, troque o link de volta e revise a auditoria.',
      ),
      ...dados.trocas.flatMap((troca) => [
        separador(),
        linha('Escopo', troca.escopo),
        linha('Antes', antes(troca)),
        linha('Agora', agora(troca)),
      ]),
      separador(),
      linha('Motivo', dados.motivo),
      linha('Por', dados.admin),
      linha('Quando', quando),
      separador(),
      botao({ href: link, rotulo: 'Abrir as configurações' }),
    ].join('');

    const texto = [
      'Link de checkout alterado',
      '',
      ...dados.trocas.flatMap((troca) => [
        `Escopo: ${troca.escopo}`,
        `Antes: ${antes(troca)}`,
        `Agora: ${agora(troca)}`,
        '',
      ]),
      `Motivo: ${dados.motivo}`,
      `Por: ${dados.admin}`,
      `Quando: ${quando}`,
      '',
      `Configurações: ${link}`,
      '',
      rodapeEmTexto('painel'),
    ].join('\n');

    return await despachar(assunto, `checkout (${escopos})`, conteudo, texto);
  } catch (erro: unknown) {
    const motivo = descreverErro(erro);
    console.error(`[painel] alerta de checkout não pôde ser montado: ${motivo}`);
    return { enviado: false, destinatarios: 0, falhas: 0, motivo };
  }
}
