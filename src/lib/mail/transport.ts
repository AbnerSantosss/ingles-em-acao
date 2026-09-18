/**
 * Transporte de e-mail do "Inglês em Ação" (nodemailer + Gmail SMTP).
 *
 * ⚠️ MÓDULO DE SERVIDOR. Nunca importe de um componente `'use client'`.
 *
 * Duas decisões que valem explicação:
 *
 * 1. **Singleton preguiçoso.** O transporter só é criado no primeiro envio —
 *    importar este arquivo não abre conexão nenhuma. O objeto fica guardado em
 *    `globalThis` para sobreviver ao HMR do `next dev`, que senão criaria um
 *    transporter novo a cada alteração de arquivo.
 *
 * 2. **`src/lib/env.ts` é carregado por `import()` dinâmico, não estático.**
 *    O `env.ts` valida tudo na avaliação do módulo e *lança* se faltar
 *    variável. Com import estático, um `.env` incompleto derrubaria qualquer
 *    rota que importasse (mesmo indiretamente) o envio de e-mail — inclusive o
 *    cadastro. Carregando aqui dentro, a falta de configuração vira "modo
 *    simulado" com um aviso no log, e o fluxo do usuário continua de pé. É o
 *    que também permite rodar com `NODE_ENV=test` sem credencial de SMTP.
 *
 * Nada neste arquivo imprime o valor de `SMTP_PASSWORD`: o `logger`/`debug` do
 * nodemailer fica desligado de propósito, porque o diálogo SMTP em modo debug
 * inclui a linha `AUTH LOGIN` (a senha em base64).
 */
import { createTransport, type SendMailOptions } from 'nodemailer';

/** `smtp` = sai da máquina de verdade. `simulado` = só registra que sairia. */
export type ModoDeTransporte = 'smtp' | 'simulado';

/** Informação pública do transporte — nunca carrega usuário ou senha do SMTP. */
export type AmbienteDeEmail = {
  modo: ModoDeTransporte;
  /** Remetente já formatado, vindo de `MAIL_FROM`. */
  remetente: string;
  /** Base pública do app, sem barra no fim — é a partir dela que os links são montados. */
  appUrl: string;
};

export type MensagemDeEmail = {
  /** Destinatário. */
  para: string;
  assunto: string;
  html: string;
  /** Alternativa em texto puro. Obrigatória: sem ela o e-mail cai em spam. */
  texto: string;
};

export type ResultadoDoTransporte = {
  modo: ModoDeTransporte;
  messageId: string | null;
};

/** Só o que este módulo usa do transporter do nodemailer. */
export type Transportador = {
  sendMail(mensagem: SendMailOptions): Promise<{ messageId?: string }>;
  verify(): Promise<boolean>;
  close(): void;
};

/** Remetente usado quando não há `MAIL_FROM` (só acontece em modo simulado). */
const REMETENTE_SIMULADO = 'Inglês em Ação <nao-responda@localhost>';

/** Base usada quando não há `APP_URL` (só acontece em modo simulado). */
const APP_URL_SIMULADA = 'http://localhost:3000';

/** Configuração sensível do SMTP. Fica restrita a este módulo, nunca é exportada. */
type ConfiguracaoSmtp = {
  host: string;
  porta: number;
  seguro: boolean;
  usuario: string;
  senha: string;
};

type ConfiguracaoResolvida = {
  publico: AmbienteDeEmail;
  /** `null` em modo simulado. */
  smtp: ConfiguracaoSmtp | null;
};

type CacheDeEmail = {
  configuracao?: Promise<ConfiguracaoResolvida>;
  transportador?: Promise<Transportador>;
};

// Cache em globalThis para sobreviver ao HMR (mesmo padrão do src/lib/db.ts).
const escopoGlobal = globalThis as typeof globalThis & { __ieaEmail?: CacheDeEmail };
const cache: CacheDeEmail = (escopoGlobal.__ieaEmail ??= {});

/** Uma linha de log com prefixo, para o operador achar rápido no `docker logs`. */
function registrar(nivel: 'info' | 'warn', mensagem: string): void {
  if (nivel === 'warn') console.warn(`[email] ${mensagem}`);
  else console.info(`[email] ${mensagem}`);
}

/** Mensagem de erro em texto, sem vazar o objeto inteiro (que pode trazer credencial). */
export function descreverErro(erro: unknown): string {
  if (erro instanceof Error) return `${erro.name}: ${erro.message}`;
  return 'erro desconhecido';
}

/** `maria.silva@gmail.com` → `ma****@gmail.com`. Para log sem expor o endereço inteiro. */
export function mascararEmail(endereco: string): string {
  const limpo = endereco.trim();
  const arroba = limpo.lastIndexOf('@');
  if (arroba <= 0) return '***';
  const usuario = limpo.slice(0, arroba);
  const dominio = limpo.slice(arroba);
  const visivel = usuario.slice(0, Math.min(2, usuario.length));
  return `${visivel}****${dominio}`;
}

function configuracaoSimulada(motivo: string): ConfiguracaoResolvida {
  registrar('warn', `modo simulado (${motivo}) — nenhum e-mail sai desta máquina`);

  const appUrl = (process.env.APP_URL ?? '').trim().replace(/\/+$/, '') || APP_URL_SIMULADA;
  const remetente = (process.env.MAIL_FROM ?? '').trim() || REMETENTE_SIMULADO;

  return {
    publico: { modo: 'simulado', remetente, appUrl },
    smtp: null,
  };
}

async function resolverConfiguracao(): Promise<ConfiguracaoResolvida> {
  if (process.env.NODE_ENV === 'test') {
    return configuracaoSimulada('NODE_ENV=test');
  }

  // Lido do `process.env` cru de propósito: precisamos decidir o modo ANTES de
  // carregar o env.ts, que lança quando alguma variável falta.
  if (!(process.env.SMTP_USER ?? '').trim()) {
    return configuracaoSimulada('SMTP_USER vazio');
  }

  try {
    const { env } = await import('../env');

    return {
      publico: { modo: 'smtp', remetente: env.MAIL_FROM, appUrl: env.APP_URL },
      smtp: {
        host: env.SMTP_HOST,
        porta: env.SMTP_PORT,
        seguro: env.SMTP_SECURE,
        usuario: env.SMTP_USER,
        senha: env.SMTP_PASSWORD,
      },
    };
  } catch (erro) {
    // As mensagens do env.ts citam só o NOME da variável, nunca o valor.
    registrar('warn', `configuração de ambiente inválida — ${descreverErro(erro)}`);
    return configuracaoSimulada('variáveis de ambiente incompletas');
  }
}

function obterConfiguracao(): Promise<ConfiguracaoResolvida> {
  // A promessa é cacheada (e não o resultado) para que dois envios simultâneos
  // no primeiro acesso não criem dois transporters.
  cache.configuracao ??= resolverConfiguracao();
  return cache.configuracao;
}

function criarTransportador(configuracao: ConfiguracaoResolvida): Transportador {
  const { smtp } = configuracao;

  if (!smtp) {
    // `jsonTransport` compõe a mensagem e devolve o JSON sem abrir socket nenhum.
    return createTransport({ jsonTransport: true }) as Transportador;
  }

  registrar('info', `transporte SMTP pronto (${smtp.host}:${smtp.porta}, TLS ${smtp.seguro ? 'implícito' : 'STARTTLS'})`);

  return createTransport({
    host: smtp.host,
    port: smtp.porta,
    secure: smtp.seguro,
    auth: { user: smtp.usuario, pass: smtp.senha },
    // Sem esses limites, um SMTP mudo deixaria a Server Action pendurada.
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 20_000,
    // Desligados de propósito: o log de debug do nodemailer imprime o AUTH LOGIN.
    logger: false,
    debug: false,
  }) as Transportador;
}

/**
 * Transporter compartilhado. Instancia na primeira chamada e reaproveita
 * depois — inclusive entre recargas do `next dev`.
 */
export async function obterTransportador(): Promise<Transportador> {
  cache.transportador ??= obterConfiguracao().then(criarTransportador);
  return cache.transportador;
}

/** Modo, remetente e base de URL já resolvidos. Usado pelo `send.ts` para montar os links. */
export async function ambienteDeEmail(): Promise<AmbienteDeEmail> {
  const { publico } = await obterConfiguracao();
  return publico;
}

/**
 * Envia (ou simula) uma mensagem já renderizada.
 *
 * **Lança** se o SMTP recusar: quem chama é o `send.ts`, que captura e devolve
 * `{ ok: false }` para nunca derrubar o fluxo do usuário.
 */
export async function enviarMensagem(mensagem: MensagemDeEmail): Promise<ResultadoDoTransporte> {
  const { publico } = await obterConfiguracao();
  const transportador = await obterTransportador();

  const info = await transportador.sendMail({
    from: publico.remetente,
    to: mensagem.para,
    subject: mensagem.assunto,
    text: mensagem.texto,
    html: mensagem.html,
  });

  if (publico.modo === 'simulado') {
    registrar(
      'info',
      `e-mail SERIA enviado para ${mascararEmail(mensagem.para)} — assunto: "${mensagem.assunto}"`,
    );
  }

  return { modo: publico.modo, messageId: info.messageId ?? null };
}

export type ResultadoDaVerificacao = {
  ok: boolean;
  modo: ModoDeTransporte;
  /** Só preenchido quando `ok` é falso. Nunca contém credencial. */
  erro?: string;
};

/**
 * Faz o handshake com o servidor SMTP (útil num script de diagnóstico ou num
 * healthcheck). Em modo simulado devolve `ok` sem tocar na rede.
 */
export async function verificarTransporte(): Promise<ResultadoDaVerificacao> {
  const { publico } = await obterConfiguracao();

  if (publico.modo === 'simulado') {
    // Em produção, estar simulado não é escolha: é configuração faltando.
    if (process.env.NODE_ENV === 'production') {
      return { ok: false, modo: 'simulado', erro: 'SMTP não configurado — veja o aviso no log' };
    }
    return { ok: true, modo: 'simulado' };
  }

  try {
    const transportador = await obterTransportador();
    await transportador.verify();
    return { ok: true, modo: 'smtp' };
  } catch (erro) {
    return { ok: false, modo: 'smtp', erro: descreverErro(erro) };
  }
}

/**
 * Fecha as conexões e esquece o singleton. Serve para scripts pontuais
 * (`tsx`), que senão ficariam com o processo vivo esperando o socket.
 */
export async function fecharTransporte(): Promise<void> {
  const pendente = cache.transportador;
  cache.transportador = undefined;
  cache.configuracao = undefined;

  if (!pendente) return;

  try {
    const transportador = await pendente;
    transportador.close();
  } catch {
    // Fechar é melhor-esforço: se nem chegou a abrir, não há o que fechar.
  }
}
