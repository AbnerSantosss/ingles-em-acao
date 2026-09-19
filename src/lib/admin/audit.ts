/**
 * Trilha de auditoria do painel — BACKOFFICE §6.3.
 *
 * ⚠️ MÓDULO DE SERVIDOR (Prisma + `next/headers`).
 *
 * **Esta é a única porta de escrita do `AuditLog`.** Nenhuma Server Action fala
 * com `prisma.auditLog` diretamente, e não existe — nem pode passar a existir —
 * action de editar ou apagar linha daqui: a tabela é *append-only*. Se um dia
 * houver retenção, ela é um job que apaga por idade, nunca uma tela.
 *
 * Três garantias que moram neste arquivo, e não em quem chama:
 *
 * 1. **`actorEmail` congelado.** O e-mail vai copiado para a linha no instante
 *    da ação. O usuário pode ser renomeado, trocar de e-mail ou sumir; a linha
 *    continua dizendo quem era naquele momento. (`actorId` fica sem FK de
 *    propósito, ver o comentário do schema.)
 * 2. **`before`/`after` nunca carregam `pages`.** Um snapshot de 309 páginas por
 *    edição enche o banco à toa e o conteúdo completo já está em `LessonVersion`.
 *    A poda é feita aqui: quem chamar `auditar({ before: aulaInteira })` não
 *    consegue gravar o conteúdo mesmo que queira.
 * 3. **Auditar não derruba a operação auditada.** Nenhuma função deste arquivo
 *    lança. Ver a decisão documentada em {@link registrarFalhaDeAuditoria}.
 */
import { headers } from 'next/headers';
import type { Prisma } from '@prisma/client';

import { ipDosCabecalhos } from '@/lib/auth/rate-limit';
import type { SessionUser } from '@/lib/auth/session';
import { prisma } from '@/lib/db';

/** Resultado da ação: permitida ou negada. Espelha o enum `AuditOutcome`. */
export type ResultadoAuditado = 'ALLOW' | 'DENY';

/** Ação registrada para toda tentativa barrada pelo guarda do painel. */
export const ACAO_ADMIN_NEGADO = 'admin.denied';

/**
 * `actorEmail` é coluna obrigatória e uma negativa pode não ter ninguém do outro
 * lado (cookie inválido, `curl` sem sessão). Este é o carimbo desse caso — texto
 * fixo, nunca um e-mail inventado.
 */
export const ATOR_SEM_SESSAO = '(sem sessão)';

/**
 * Entrada de auditoria — assinatura da BACKOFFICE §6.3, ao pé da letra.
 *
 * - `action`: `lesson.publish`, `module.update`, `user.plan.change`…
 * - `resource`: `Lesson:42`, `User:ckx…`, `AppSetting:checkout.link`
 * - `reason`: obrigatório (por política, validada em quem chama) ao mudar plano
 *   de aluno, trocar o link de checkout, restaurar versão e arquivar aula.
 */
export type EntradaDeAuditoria = {
  actor: SessionUser;
  action: string;
  resource: string;
  before?: unknown;
  after?: unknown;
  reason?: string;
  outcome?: ResultadoAuditado;
};

/** Campos de uma negativa: o ator pode não existir. */
export type NegativaDeAuditoria = {
  actor: SessionUser | null;
  /** Padrão: {@link ACAO_ADMIN_NEGADO}. */
  action?: string;
  resource: string;
  reason?: string;
};

/**
 * Uma ação feita pelo próprio sistema, sem pessoa nem sessão do outro lado: o
 * webhook de pagamento liberando plano, uma rotina agendada.
 *
 * - `sistema`: quem agiu, em texto curto — `webhook fake`, `webhook appmax`. Vira
 *   o `actorEmail` entre parênteses, `(webhook fake)`, no mesmo espírito de
 *   {@link ATOR_SEM_SESSAO}: um carimbo fixo, nunca um e-mail inventado.
 * - `actorId` fica nulo.
 */
export type EntradaDeSistema = {
  sistema: string;
  action: string;
  resource: string;
  before?: unknown;
  after?: unknown;
  reason?: string;
  outcome?: ResultadoAuditado;
};

/** Teto do carimbo de sistema — é um rótulo, não um texto livre. */
const TAMANHO_MAXIMO_DO_SISTEMA = 60;

/** Teto do JSON gravado em `before`/`after`. Acima disso vira só o tamanho. */
const TAMANHO_MAXIMO_SNAPSHOT = 8_000;

/** Profundidade máxima da poda — corta estrutura ciclicamente aninhada cedo. */
const PROFUNDIDADE_MAXIMA = 6;

/**
 * Campos que **nunca** entram num snapshot de auditoria.
 *
 * São as colunas de conteúdo da aula (`Lesson.pages` e `Lesson.draftPages`): o
 * array inteiro de páginas com os blocos. Auditoria guarda o *que mudou*, não a
 * aula; o conteúdo publicado fica em `LessonVersion`.
 */
const CAMPOS_PODADOS = new Set(['pages', 'draftPages']);

/** Marca deixada no lugar do campo podado, para o diff não mentir por omissão. */
function marcaDePoda(valor: unknown): string {
  if (Array.isArray(valor)) return `[omitido: ${valor.length} páginas]`;
  return '[omitido]';
}

/**
 * Copia o valor para JSON puro, podando o que não pode ser gravado.
 *
 * Devolve `undefined` quando não há o que gravar — e aí a coluna fica NULL, que
 * é diferente de "gravamos um objeto vazio".
 */
function paraSnapshot(valor: unknown): Prisma.InputJsonValue | undefined {
  if (valor === undefined) return undefined;

  let podado: unknown;
  try {
    podado = podar(valor, 0);
  } catch {
    podado = { erro: 'snapshot não pôde ser lido' };
  }

  // `JSON.stringify` é a prova final: o que não serializa (ciclo, BigInt,
  // função) não teria como virar coluna Json de qualquer forma.
  let texto: string;
  try {
    texto = JSON.stringify(podado ?? null);
  } catch {
    return { erro: 'snapshot não serializável' };
  }

  if (texto === undefined) return undefined;

  if (texto.length > TAMANHO_MAXIMO_SNAPSHOT) {
    return { erro: 'snapshot grande demais', bytes: texto.length };
  }

  return JSON.parse(texto) as Prisma.InputJsonValue;
}

/** Poda recursiva: tira `pages`/`draftPages` e corta profundidade excessiva. */
function podar(valor: unknown, nivel: number): unknown {
  if (valor === null || typeof valor !== 'object') {
    return typeof valor === 'bigint' ? valor.toString() : valor;
  }

  if (valor instanceof Date) return valor.toISOString();

  if (nivel >= PROFUNDIDADE_MAXIMA) return '[profundo demais]';

  if (Array.isArray(valor)) {
    return valor.map((item) => podar(item, nivel + 1));
  }

  const saida: Record<string, unknown> = {};
  for (const [chave, item] of Object.entries(valor as Record<string, unknown>)) {
    saida[chave] = CAMPOS_PODADOS.has(chave) ? marcaDePoda(item) : podar(item, nivel + 1);
  }
  return saida;
}

/** Origem da requisição, quando houver uma. Em script de terminal, não há. */
async function contexto(): Promise<{ ip: string | null; userAgent: string | null }> {
  try {
    const cabecalhos = await headers();
    const userAgent = cabecalhos.get('user-agent');
    return {
      ip: ipDosCabecalhos(cabecalhos),
      userAgent: userAgent ? userAgent.slice(0, 512) : null,
    };
  } catch {
    // Fora do ciclo de uma requisição (`headers()` lança). A linha vale do mesmo
    // jeito; só não tem de onde veio.
    return { ip: null, userAgent: null };
  }
}

/**
 * O que fazer quando a própria auditoria falha.
 *
 * **Decisão (BACKOFFICE §6.3, ponto 3):** a gravação da trilha *nunca* derruba a
 * operação auditada — recusar uma publicação porque o log caiu seria trocar um
 * problema de observabilidade por um de disponibilidade. Mas também não pode
 * passar em silêncio, senão o painel fica com a aparência de auditado sem estar.
 * O meio-termo é este: engolir a exceção e gritar no log do servidor.
 *
 * O que vai para o log é só metadado operacional — ação, recurso e desfecho. Sem
 * e-mail, sem `before`/`after`, sem nada que o contrato chame de dado pessoal.
 */
function registrarFalhaDeAuditoria(
  action: string,
  resource: string,
  outcome: ResultadoAuditado,
  erro: unknown,
): void {
  const motivo = erro instanceof Error ? erro.message : 'erro desconhecido';
  console.error(
    `[auditoria] FALHA AO GRAVAR: action=${action} resource=${resource} outcome=${outcome}: ${motivo}`,
  );
}

/** Escreve a linha. É a única função deste módulo que toca no banco. */
async function gravar(dados: {
  actorId: string | null;
  actorEmail: string;
  action: string;
  resource: string;
  outcome: ResultadoAuditado;
  reason?: string;
  before?: unknown;
  after?: unknown;
}): Promise<void> {
  const { ip, userAgent } = await contexto();

  try {
    await prisma.auditLog.create({
      data: {
        actorId: dados.actorId,
        actorEmail: dados.actorEmail,
        action: dados.action,
        resource: dados.resource,
        outcome: dados.outcome,
        reason: dados.reason,
        before: paraSnapshot(dados.before),
        after: paraSnapshot(dados.after),
        ip,
        userAgent,
      },
    });
  } catch (erro: unknown) {
    registrarFalhaDeAuditoria(dados.action, dados.resource, dados.outcome, erro);
  }
}

/**
 * Registra uma ação do painel.
 *
 * Chame **depois** da mutação dar certo (o que se audita é o que aconteceu), e
 * sem `try`: esta função não lança.
 *
 * @example
 * await auditar({
 *   actor,
 *   action: 'lesson.publish',
 *   resource: `Lesson:${aula.number}`,
 *   after: { title: aula.title, contentVersion: aula.contentVersion },
 * });
 */
export async function auditar(entrada: EntradaDeAuditoria): Promise<void> {
  await gravar({
    actorId: entrada.actor.id,
    actorEmail: entrada.actor.email,
    action: entrada.action,
    resource: entrada.resource,
    outcome: entrada.outcome ?? 'ALLOW',
    reason: entrada.reason,
    before: entrada.before,
    after: entrada.after,
  });
}

/**
 * Registra uma tentativa **negada** — a porta de quem pode não ter sessão.
 *
 * Existe separada de {@link auditar} só por causa do tipo do ator: a assinatura
 * da §6.3 exige `SessionUser`, e uma negativa acontece justamente quando não há
 * um. As duas escrevem pela mesma função privada, então a regra de "um caminho
 * só" continua valendo.
 *
 * "Ação negada também é auditada" — sem isto não existe como perceber alguém
 * sondando o painel.
 */
export async function auditarNegativa(entrada: NegativaDeAuditoria): Promise<void> {
  await gravar({
    actorId: entrada.actor?.id ?? null,
    actorEmail: entrada.actor?.email ?? ATOR_SEM_SESSAO,
    action: entrada.action ?? ACAO_ADMIN_NEGADO,
    resource: entrada.resource,
    outcome: 'DENY',
    reason: entrada.reason,
  });
}

/**
 * Registra uma ação do **sistema** — a porta de quem age sem sessão (o webhook
 * de pagamento é o primeiro caso).
 *
 * Mesmas regras de {@link auditar}: chame depois da mutação dar certo (depois do
 * commit, quando houver transação) e sem `try` — esta função não lança. Escreve
 * pela mesma função privada, então o "um caminho só" continua valendo.
 *
 * ⚠️ Por que não gravar a linha dentro da transação de quem chama: numa
 * transação do Postgres, um INSERT que falha aborta tudo o que veio antes — a
 * auditoria passaria a poder derrubar a operação auditada, o contrário da
 * garantia 3 do cabeçalho. Quem precisa de registro transacional grava na
 * própria tabela (o `Payment` guarda `grantedAt`, plano e referência); a trilha
 * vem logo depois, como em toda ação do painel.
 */
export async function auditarSistema(entrada: EntradaDeSistema): Promise<void> {
  const sistema = entrada.sistema.trim().slice(0, TAMANHO_MAXIMO_DO_SISTEMA) || 'sistema';
  await gravar({
    actorId: null,
    actorEmail: `(${sistema})`,
    action: entrada.action,
    resource: entrada.resource,
    outcome: entrada.outcome ?? 'ALLOW',
    reason: entrada.reason,
    before: entrada.before,
    after: entrada.after,
  });
}
