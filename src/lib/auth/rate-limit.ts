/**
 * Limite de tentativas de login (contrato §5.4).
 *
 * ⚠️ MÓDULO DE SERVIDOR.
 *
 * Regra: **5 falhas em 15 minutos para o mesmo par (e-mail, IP) bloqueiam aquele
 * par por 15 minutos.** Um login bem-sucedido zera as falhas do par.
 *
 * Por que o par, e não só o e-mail: bloquear por e-mail sozinho entrega um ataque
 * de negação de serviço de graça — qualquer pessoa trava a conta de qualquer
 * outra só errando a senha cinco vezes. Por IP sozinho pune escritório inteiro
 * atrás de um NAT. O par é o meio-termo que o contrato pede.
 *
 * ⚠️ Limitação conhecida e aceita nesta rodada: um atacante com muitos IPs
 * (botnet, proxies rotativos) contorna a contagem por par. A defesa de fundo
 * continua sendo o Argon2id, que torna cada tentativa cara no servidor. Se isso
 * virar problema real, o passo seguinte é uma segunda janela, mais larga, só por
 * e-mail (ex.: 50 falhas em 24 h) somada a um desafio ao usuário.
 */
import { prisma } from '@/lib/db';

/** Falhas toleradas dentro da janela antes do bloqueio. */
export const MAXIMO_DE_FALHAS = 5;

/** Tamanho da janela — e também a duração do bloqueio. */
export const JANELA_MS = 15 * 60 * 1000;

/** Valor gravado quando não dá para descobrir o IP de origem. */
export const IP_DESCONHECIDO = 'desconhecido';

/** IPv6 em forma longa cabe em 45 caracteres; acima disso é lixo ou ataque. */
const TAMANHO_MAXIMO_IP = 45;

/** E-mail é gravado igual ao que vai para a coluna `User.email`: minúsculo e aparado. */
function normalizarEmail(email: string): string {
  return typeof email === 'string' ? email.trim().toLowerCase().slice(0, 254) : '';
}

/**
 * Normaliza o IP recebido.
 *
 * `X-Forwarded-For` vem como uma lista ("cliente, proxy1, proxy2"); só o primeiro
 * item interessa. Vazio vira {@link IP_DESCONHECIDO} porque a coluna é obrigatória
 * — e porque todo mundo sem IP identificável deve cair no MESMO balde, senão cada
 * requisição estrearia um contador limpo.
 */
export function normalizarIp(ip: string | null | undefined): string {
  if (typeof ip !== 'string') return IP_DESCONHECIDO;
  const primeiro = ip.split(',')[0]?.trim().toLowerCase() ?? '';
  if (primeiro.length === 0) return IP_DESCONHECIDO;
  return primeiro.slice(0, TAMANHO_MAXIMO_IP);
}

/**
 * Descobre o IP do cliente a partir dos cabeçalhos da requisição.
 *
 * ⚠️ Estes cabeçalhos são escritos pelo proxy reverso — e podem ser forjados se o
 * app ficar exposto direto na internet. O `docs/DEPLOY.md` põe nginx na frente,
 * que sobrescreve `X-Forwarded-For`. Enquanto isso for verdade, o valor é
 * confiável o bastante para contagem de tentativas (não para autorização).
 */
export function ipDosCabecalhos(cabecalhos: Headers): string {
  const candidatos = [
    cabecalhos.get('x-forwarded-for'),
    cabecalhos.get('x-real-ip'),
    cabecalhos.get('cf-connecting-ip'),
    cabecalhos.get('x-client-ip'),
  ];

  for (const candidato of candidatos) {
    const normalizado = normalizarIp(candidato);
    if (normalizado !== IP_DESCONHECIDO) return normalizado;
  }

  return IP_DESCONHECIDO;
}

/**
 * Registra uma tentativa de login.
 *
 * Chame **sempre** — sucesso e fracasso —, e apenas quando a tentativa foi de
 * fato avaliada. Não registre a tentativa recusada por bloqueio: se cada batida
 * na porta trancada contasse como falha nova, o bloqueio se renovaria sozinho e
 * viraria permanente para quem estivesse sendo atacado.
 *
 * No sucesso, as falhas anteriores daquele par saem da tabela: quem acertou a
 * senha não deve começar a sessão seguinte com o contador quase cheio.
 *
 * Nunca recebe nem grava a senha — só e-mail, IP e o resultado.
 */
export async function recordLoginAttempt(
  email: string,
  ip: string | null | undefined,
  success: boolean,
): Promise<void> {
  const emailNormalizado = normalizarEmail(email);
  const ipNormalizado = normalizarIp(ip);

  await prisma.loginAttempt.create({
    data: { email: emailNormalizado, ip: ipNormalizado, success },
  });

  if (success) {
    await prisma.loginAttempt.deleteMany({
      where: { email: emailNormalizado, ip: ipNormalizado, success: false },
    });
  }
}

/**
 * Diz se o par (e-mail, IP) está bloqueado agora e por quanto tempo ainda.
 *
 * Janela deslizante: pegamos as {@link MAXIMO_DE_FALHAS} falhas mais recentes
 * dentro dos últimos 15 minutos. Se há cinco, o bloqueio dura até a mais ANTIGA
 * delas completar 15 minutos e sair da janela. É assim que o bloqueio se desfaz
 * sozinho, sem tabela de bloqueios nem tarefa agendada.
 *
 * `retryAfterSeconds` é sempre >= 1 quando `limited` é verdadeiro, para nunca
 * dizer ao usuário "tente de novo em 0 segundos".
 *
 * Em caso de erro no banco, responde "não bloqueado": a autenticação em si já
 * depende do mesmo banco e vai falhar logo em seguida de qualquer jeito, então
 * fechar a porta aqui só trocaria uma mensagem clara por uma enganosa.
 */
export async function isRateLimited(
  email: string,
  ip: string | null | undefined,
): Promise<{ limited: boolean; retryAfterSeconds: number }> {
  const emailNormalizado = normalizarEmail(email);
  const ipNormalizado = normalizarIp(ip);
  const agora = Date.now();
  const inicioDaJanela = new Date(agora - JANELA_MS);

  try {
    const falhas = await prisma.loginAttempt.findMany({
      where: {
        email: emailNormalizado,
        ip: ipNormalizado,
        success: false,
        createdAt: { gte: inicioDaJanela },
      },
      orderBy: { createdAt: 'desc' },
      take: MAXIMO_DE_FALHAS,
      select: { createdAt: true },
    });

    if (falhas.length < MAXIMO_DE_FALHAS) {
      return { limited: false, retryAfterSeconds: 0 };
    }

    const maisAntigaDasRecentes = falhas[falhas.length - 1]!.createdAt.getTime();
    const liberaEm = maisAntigaDasRecentes + JANELA_MS;
    const restanteMs = liberaEm - agora;

    if (restanteMs <= 0) return { limited: false, retryAfterSeconds: 0 };

    return { limited: true, retryAfterSeconds: Math.max(1, Math.ceil(restanteMs / 1000)) };
  } catch {
    return { limited: false, retryAfterSeconds: 0 };
  }
}

/**
 * Apaga tentativas antigas demais para servirem de alguma coisa. Devolve quantas
 * linhas saíram.
 *
 * Nada no app chama isto hoje — é para uma tarefa agendada. A tabela cresce uma
 * linha por tentativa de login de toda a base; sem poda ela vira a maior do banco
 * em poucos meses. O padrão de 30 dias mantém rastro suficiente para investigar
 * "minha conta foi invadida?" sem guardar histórico para sempre.
 */
export async function cleanupOldAttempts(diasDeRetencao = 30): Promise<number> {
  const corte = new Date(Date.now() - diasDeRetencao * 24 * 60 * 60 * 1000);

  const { count } = await prisma.loginAttempt.deleteMany({
    where: { createdAt: { lt: corte } },
  });

  return count;
}
