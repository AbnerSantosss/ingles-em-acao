/**
 * Guarda do painel administrativo — BACKOFFICE §1.
 *
 * ⚠️ MÓDULO DE SERVIDOR (Prisma, `next/headers`, `next/navigation`).
 *
 * ## As camadas, e por que elas não são redundantes
 *
 * 1. **`src/proxy.ts`** é *otimista*: confere só a presença do cookie
 *    `iea_session` e **nunca** consulta o banco (roda na borda, em toda
 *    navegação e em todo prefetch). Ele não sabe, e não tem como saber, qual é
 *    o papel do usuário — o cookie guarda um token opaco, não um JWT.
 * 2. **`src/app/(admin)/layout.tsx`** é onde a autorização acontece de verdade,
 *    porque é onde existe banco. Chama {@link requireAdminNaTela}.
 * 3. **Cada Server Action** começa por {@link requireAdmin}. Layout não protege
 *    mutação: uma Server Function é um POST direto no servidor e o layout não
 *    roda. Se você só proteger o layout, o painel está aberto.
 *
 * ## 404, não 403 (decisão D2)
 *
 * Para quem não é admin, o painel **não existe**. 403 confirmaria que o recurso
 * existe e que a conta só não tem o papel; 404 não confirma nada. O custo de
 * usabilidade é zero — quem é admin nunca vê essa tela.
 *
 * ## Toda negativa vira linha no `AuditLog`
 *
 * Com `outcome: 'DENY'` e `action: 'admin.denied'`. Sem isso não há como
 * perceber alguém sondando o painel. A escrita mora dentro da avaliação
 * memoizada abaixo, então uma requisição negada gera **uma** linha, mesmo que o
 * layout e a página sejam renderizados em paralelo.
 */
import { cache } from 'react';
import { cookies, headers } from 'next/headers';
import { notFound, redirect } from 'next/navigation';

import { auditarNegativa } from '@/lib/admin/audit';
import {
  CABECALHO_CAMINHO,
  NOME_COOKIE_SESSAO,
  PARAM_SESSAO,
  VALOR_SESSAO_EXPIRADA,
  urlDeLogin,
} from '@/lib/auth/next-url';
import { getCurrentUser, type SessionUser } from '@/lib/auth/session';
import { hashToken, pareceToken } from '@/lib/auth/tokens';
import { prisma } from '@/lib/db';

/**
 * Idade máxima de uma sessão para ela valer no painel (BACKOFFICE §1.2).
 *
 * A sessão do aluno é longa de propósito (30 dias com "lembrar-me"); a do admin
 * não deve ser. Sem segundo fator no MVP, esta é uma das compensações — junto
 * com a senha de 12 caracteres do `admin:create`, o rate limit de login e a
 * auditoria. **8 horas**, decisão do PO.
 *
 * Note que isto é *idade*, não inatividade: uma sessão aberta às 8h da manhã
 * pede senha de novo às 16h, mesmo em uso contínuo.
 */
export const DURACAO_SESSAO_ADMIN_MS = 8 * 60 * 60 * 1000;

/** Mensagem única de recusa — a mesma para "não existe" e "não pode". */
export const MENSAGEM_NAO_AUTORIZADO = 'NAO_AUTORIZADO';

/**
 * Recusa de uma Server Action do painel.
 *
 * A mensagem é sempre a mesma, de propósito: não vaza se a sessão existe, se o
 * usuário existe nem se o recurso pedido existe. Quem chama a action trata como
 * erro genérico.
 */
export class NaoAutorizadoError extends Error {
  constructor() {
    super(MENSAGEM_NAO_AUTORIZADO);
    this.name = 'NaoAutorizadoError';
  }
}

/** Por que o acesso foi negado. Só circula dentro deste módulo e na auditoria. */
type MotivoDeNegativa = 'sem-sessao' | 'sem-papel' | 'sessao-antiga';

type Acesso =
  | { ok: true; usuario: SessionUser }
  | { ok: false; motivo: MotivoDeNegativa; usuario: SessionUser | null };

/** Caminho que o usuário pediu, injetado pelo proxy. Dado do cliente até prova em contrário. */
async function caminhoPedido(): Promise<string | null> {
  try {
    const cabecalhos = await headers();
    return cabecalhos.get(CABECALHO_CAMINHO);
  } catch {
    return null;
  }
}

/**
 * Idade da sessão desta requisição, em milissegundos — ou `null` se não der para
 * saber.
 *
 * `getCurrentUser()` não expõe `Session.createdAt` (o `SessionUser` do contrato
 * §9 é só o usuário), então a coluna é lida aqui, pelo mesmo caminho: hash do
 * token do cookie, busca pelo índice único.
 *
 * ⚠️ Falha de banco devolve `null` e a checagem de frescor é **pulada**. É um
 * fail-open deliberado e limitado: quem chegou até aqui já teve papel `ADMIN`
 * confirmado por uma leitura bem-sucedida do banco em `getCurrentUser()`. O
 * papel nunca falha aberto; só o relógio.
 */
async function idadeDaSessaoAtual(): Promise<number | null> {
  try {
    const armazem = await cookies();
    const bruto = armazem.get(NOME_COOKIE_SESSAO)?.value;
    if (!pareceToken(bruto)) return null;

    const sessao = await prisma.session.findUnique({
      where: { tokenHash: hashToken(bruto) },
      select: { createdAt: true },
    });

    if (!sessao) return null;
    return Date.now() - sessao.createdAt.getTime();
  } catch {
    return null;
  }
}

/**
 * Decide o acesso **uma vez por requisição** e audita a negativa ali mesmo.
 *
 * O `cache()` do React memoiza a promessa dentro do ciclo de uma requisição: o
 * layout, a página e qualquer action do mesmo POST compartilham o resultado — e
 * a linha de `admin.denied`, que é escrita aqui dentro, sai uma vez só. O cache
 * não atravessa requisições nem usuários.
 */
const avaliarAcesso = cache(async (): Promise<Acesso> => {
  const usuario = await getCurrentUser();
  const caminho = await caminhoPedido();
  const recurso = `Admin:${caminho ?? '/admin'}`;

  if (!usuario) {
    // O proxy já deveria ter mandado para `/entrar`; chegar aqui significa
    // cookie presente e inválido, ou um POST de action sem sessão nenhuma.
    await auditarNegativa({ actor: null, resource: recurso, reason: 'sem sessão válida' });
    return { ok: false, motivo: 'sem-sessao', usuario: null };
  }

  if (usuario.role !== 'ADMIN') {
    await auditarNegativa({ actor: usuario, resource: recurso, reason: 'papel STUDENT' });
    return { ok: false, motivo: 'sem-papel', usuario };
  }

  const idade = await idadeDaSessaoAtual();
  if (idade !== null && idade >= DURACAO_SESSAO_ADMIN_MS) {
    await auditarNegativa({
      actor: usuario,
      resource: recurso,
      reason: 'sessão administrativa com mais de 8 h',
    });
    return { ok: false, motivo: 'sessao-antiga', usuario };
  }

  return { ok: true, usuario };
});

/**
 * Destino da reautenticação administrativa.
 *
 * ⚠️ O `?sessao=expirada` **não é decoração**. Sem ele o proxy vê o cookie
 * (ainda válido para o app do aluno), reconhece `/entrar` como rota de entrada e
 * devolve o admin para `/inicio` — ele nunca conseguiria renovar a sessão do
 * painel. A marca é exatamente o que faz a tela de login abrir mesmo com cookie.
 * O `motivo` acompanha só para a tela poder explicar o caso quando quiser.
 */
function destinoDeReautenticacao(caminho: string | null): string {
  return urlDeLogin(caminho ?? '/admin', {
    [PARAM_SESSAO]: VALOR_SESSAO_EXPIRADA,
    motivo: 'sessao_admin',
  });
}

/**
 * Exige um admin numa **Server Action**. Lança {@link NaoAutorizadoError}.
 *
 * É a primeira linha de toda ação do painel, sem exceção:
 *
 * ```ts
 * export async function publicarAulaAction(formData: FormData) {
 *   const admin = await requireAdmin();
 *   // …
 * }
 * ```
 *
 * Diferente da versão de tela, aqui a sessão velha também **lança** em vez de
 * redirecionar: um POST respondido com 307 faria o navegador repetir o POST na
 * tela de login. A próxima navegação cai em {@link requireAdminNaTela} e aí sim
 * o usuário é levado a reautenticar.
 */
export async function requireAdmin(): Promise<SessionUser> {
  const acesso = await avaliarAcesso();
  if (!acesso.ok) throw new NaoAutorizadoError();
  return acesso.usuario;
}

/**
 * Exige um admin numa **tela** (layout ou page). Nunca retorna quando recusa.
 *
 * - Sem sessão ou sem papel → `notFound()`: o painel não existe (decisão D2).
 * - Sessão com mais de 8 h → `redirect()` para reautenticar.
 *
 * ⚠️ `notFound()` e `redirect()` funcionam lançando (`NEXT_HTTP_ERROR_FALLBACK`
 * e `NEXT_REDIRECT`). Nunca chame esta função dentro de um `try/catch` que
 * engula exceções — o painel abriria para quem não deveria.
 */
export async function requireAdminNaTela(): Promise<SessionUser> {
  const acesso = await avaliarAcesso();
  if (acesso.ok) return acesso.usuario;

  if (acesso.motivo === 'sessao-antiga') {
    redirect(destinoDeReautenticacao(await caminhoPedido()));
  }

  notFound();
}

/**
 * ⚠️ Não existe aqui um `ehAdmin()` "só para decidir se mostro o link do painel",
 * e a ausência é proposital: qualquer leitura passa por {@link avaliarAcesso},
 * que **audita a negativa**. Chamado de uma tela do aluno, esse atalho encheria
 * o `AuditLog` de `admin.denied` de gente que não estava sondando nada. Quem
 * precisar de uma decisão de apresentação usa `getCurrentUser()` e compara o
 * `role` — sem guarda, sem auditoria.
 */
