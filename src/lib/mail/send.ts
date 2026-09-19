/**
 * Ponto de entrada do e-mail transacional: o resto do app só precisa destas
 * duas funções.
 *
 * ⚠️ MÓDULO DE SERVIDOR. Nunca importe de um componente `'use client'`.
 *
 * Regra que manda aqui (CONTRACT §5.5): **falha de e-mail não derruba o fluxo
 * do usuário e não revela se um endereço existe**. Por isso nada aqui lança:
 * qualquer erro vira uma linha de log e `{ ok: false }`. Quem chama decide o
 * que fazer — e, no caso de "esqueci minha senha", a resposta ao usuário é a
 * mesma tendo o e-mail saído ou não.
 *
 * O log é deliberadamente pobre: tipo do e-mail, modo do transporte e um
 * booleano. Sem endereço, sem token, sem a mensagem crua do servidor SMTP (que
 * costuma repetir o destinatário).
 */
import {
  ambienteDeEmail,
  enviarMensagem,
  type ModoDeTransporte,
} from './transport';
import {
  resetPasswordTemplate,
  verifyEmailTemplate,
  type DadosDoTemplate,
  type EmailRenderizado,
} from './templates';

export type EnvioDeEmail = {
  /** Destinatário. */
  to: string;
  /** Nome do aluno, para a saudação. Pode vir vazio. */
  name: string;
  /** Token **cru** (o banco guarda só o SHA-256 dele). */
  token: string;
};

export type ResultadoDeEnvio = {
  ok: boolean;
};

type TipoDeEmail = 'verificacao' | 'redefinicao';

/** Rotas de destino dos links (CONTRACT §7). */
const CAMINHO_VERIFICACAO = '/verificar-email';
const CAMINHO_REDEFINICAO = '/redefinir-senha';

/**
 * Classe do erro, nunca a mensagem. O nodemailer põe em `code` coisas como
 * `EAUTH`, `ESOCKET`, `ETIMEDOUT` ou `EENVELOPE` — é o suficiente para o
 * operador agir, e não carrega o endereço do destinatário.
 */
function codigoDoErro(erro: unknown): string {
  if (typeof erro === 'object' && erro !== null && 'code' in erro) {
    const codigo = (erro as { code?: unknown }).code;
    if (typeof codigo === 'string' && codigo) return codigo;
  }
  if (erro instanceof Error) return erro.name;
  return 'DESCONHECIDO';
}

function registrarResultado(tipo: TipoDeEmail, ok: boolean, detalhe: string): void {
  const linha = `[email] tipo=${tipo} ok=${ok} ${detalhe}`.trim();
  if (ok) console.info(linha);
  else console.warn(linha);
}

/**
 * Em desenvolvimento **sem SMTP configurado** nenhum e-mail sai da máquina, e
 * sem o link no terminal não há como testar confirmação nem redefinição. Fora
 * desse caso (produção, teste, ou dev com SMTP de verdade) o token nunca
 * aparece no log.
 */
function registrarLinkDeDesenvolvimento(modo: ModoDeTransporte, url: string): void {
  if (modo !== 'simulado') return;
  if (process.env.NODE_ENV !== 'development') return;
  console.info(`[email] link (só em desenvolvimento, sem SMTP): ${url}`);
}

type Despacho = {
  tipo: TipoDeEmail;
  caminho: string;
  montarTemplate: (dados: DadosDoTemplate) => EmailRenderizado;
};

async function despachar(
  { tipo, caminho, montarTemplate }: Despacho,
  { to, name, token }: EnvioDeEmail,
): Promise<ResultadoDeEnvio> {
  try {
    if (!to.trim() || !token.trim()) {
      registrarResultado(tipo, false, 'motivo=dados-incompletos');
      return { ok: false };
    }

    const { appUrl, modo } = await ambienteDeEmail();
    const url = `${appUrl}${caminho}?token=${encodeURIComponent(token)}`;

    const { subject, html, text } = montarTemplate({ name, url, appUrl });

    await enviarMensagem({ para: to, assunto: subject, html, texto: text });

    // Em desenvolvimento e em teste, "simulado" é o comportamento desejado e conta
    // como sucesso. Em produção, "simulado" só acontece por configuração faltando —
    // e aí `ok: true` esconderia uma falha real de entrega.
    const entregue = modo === 'smtp' || process.env.NODE_ENV !== 'production';

    registrarResultado(tipo, entregue, `modo=${modo}`);
    registrarLinkDeDesenvolvimento(modo, url);

    return { ok: entregue };
  } catch (erro) {
    registrarResultado(tipo, false, `erro=${codigoDoErro(erro)}`);
    return { ok: false };
  }
}

/**
 * E-mail de confirmação de endereço. Link válido por 24 horas (CONTRACT §5.6)
 * — a validade é conferida no banco; aqui só montamos a URL.
 */
export async function sendVerificationEmail(dados: EnvioDeEmail): Promise<ResultadoDeEnvio> {
  return despachar(
    {
      tipo: 'verificacao',
      caminho: CAMINHO_VERIFICACAO,
      montarTemplate: verifyEmailTemplate,
    },
    dados,
  );
}

/**
 * E-mail de redefinição de senha. Link válido por 1 hora e de uso único
 * (CONTRACT §5.5). Nunca conte a quem chamou se o endereço existia: esta
 * função devolve `{ ok }` do *envio*, e não do *cadastro*.
 */
export async function sendPasswordResetEmail(dados: EnvioDeEmail): Promise<ResultadoDeEnvio> {
  return despachar(
    {
      tipo: 'redefinicao',
      caminho: CAMINHO_REDEFINICAO,
      montarTemplate: resetPasswordTemplate,
    },
    dados,
  );
}
