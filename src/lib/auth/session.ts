/**
 * Núcleo de sessão — cookie opaco + linha na tabela `Session`.
 *
 * ⚠️ MÓDULO DE SERVIDOR. Usa Prisma, `next/headers` e `next/navigation`.
 *
 * Como funciona (contrato §5.2 e §5.3): o login gera 32 bytes aleatórios, entrega
 * o valor cru ao navegador dentro do cookie `iea_session` e guarda no banco
 * apenas o SHA-256 desse valor. Não é JWT: não há nada assinado para o cliente
 * ler ou para alguém forjar, e revogar uma sessão é apagar uma linha — não
 * esperar um token expirar.
 *
 * ⚠️ `cookies().set()` só funciona em Server Action ou Route Handler. Durante a
 * renderização de um Server Component o HTTP já começou a sair e não há mais
 * cabeçalho para escrever. Por isso `createSession` e `destroyCurrentSession`
 * pertencem às Server Actions, enquanto `getCurrentUser` (que apenas lê) pode ser
 * chamada de qualquer lugar.
 */
import { cache } from 'react';
import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { after } from 'next/server';

import { prisma } from '@/lib/db';
import { ipDosCabecalhos } from '@/lib/auth/rate-limit';
import { generateToken, hashToken, pareceToken } from '@/lib/auth/tokens';
import {
  CABECALHO_CAMINHO,
  NOME_COOKIE_SESSAO,
  PARAM_SESSAO,
  VALOR_SESSAO_EXPIRADA,
  urlDeLogin,
} from '@/lib/auth/next-url';

export { NOME_COOKIE_SESSAO } from '@/lib/auth/next-url';

/** O usuário como o resto do app o enxerga. Nunca carrega `passwordHash`. */
export type SessionUser = {
  id: string;
  name: string;
  email: string;
  photoUrl: string | null;
  role: 'STUDENT' | 'ADMIN';
  plan: 'ESSENCIAL' | 'COMPLETO' | 'PREMIUM';
  emailVerifiedAt: Date | null;
};

/** "Lembrar-me" marcado: 30 dias (contrato §5.3). */
export const DURACAO_LEMBRAR_MS = 30 * 24 * 60 * 60 * 1000;

/** "Lembrar-me" desmarcado: 1 dia no banco, mesmo que o cookie morra antes. */
export const DURACAO_PADRAO_MS = 24 * 60 * 60 * 1000;

/**
 * De quanto em quanto tempo o `lastSeenAt` é atualizado.
 *
 * Sem essa folga, toda requisição autenticada viraria um UPDATE — inclusive as
 * dezenas que uma navegação dispara. O campo serve para "quando esta sessão foi
 * usada pela última vez" na tela de perfil; 15 minutos de resolução bastam.
 */
export const INTERVALO_LAST_SEEN_MS = 15 * 60 * 1000;

/** Campos do usuário que viram {@link SessionUser}. */
const CAMPOS_DO_USUARIO = {
  id: true,
  name: true,
  email: true,
  photoUrl: true,
  role: true,
  plan: true,
  emailVerifiedAt: true,
} as const;

/**
 * Atributos do cookie de sessão.
 *
 * - `httpOnly`: JavaScript da página não lê o token. Um XSS ainda faz estrago,
 *   mas não sai carregando a sessão para outro lugar.
 * - `sameSite: "lax"`: o cookie não acompanha requisição POST vinda de outro
 *   site (defesa de CSRF), mas acompanha a navegação normal por link — que é
 *   exatamente o que o link do e-mail de verificação precisa.
 * - `secure` em produção: o cookie só viaja sob HTTPS.
 *   ⚠️ Em produção, sem TLS com `X-Forwarded-Proto` no proxy, o navegador
 *   descarta o cookie e o login entra em laço. Está anotado no `docs/DEPLOY.md`.
 * - `path: "/"`: vale no app inteiro.
 *
 * Lê `process.env.NODE_ENV` direto, e não `env.ts`, por dois motivos: é o que o
 * contrato §5.3 escreve literalmente, e importar `env.ts` aqui faria a validação
 * das variáveis de SMTP rodar em todo módulo que só precisa saber quem está logado.
 */
function atributosDoCookie() {
  return {
    httpOnly: true,
    sameSite: 'lax' as const,
    path: '/',
    secure: process.env.NODE_ENV === 'production',
  };
}

/** User-Agent aparado: a coluna não precisa da string inteira. */
function userAgentDosCabecalhos(cabecalhos: Headers): string | null {
  const bruto = cabecalhos.get('user-agent');
  if (!bruto) return null;
  return bruto.slice(0, 512);
}

/**
 * Empurra o `lastSeenAt` para depois da resposta.
 *
 * `after()` deixa o Next executar o UPDATE depois que o HTML já foi enviado, para
 * o usuário não pagar a latência de uma escrita que não muda nada na tela. Fora
 * do ciclo de uma requisição o `after()` não existe, e aí a tarefa roda solta —
 * com o erro engolido dentro dela, para nunca derrubar a requisição por causa de
 * um carimbo de horário.
 */
function marcarSessaoComoVista(sessionId: string): void {
  const tarefa = async () => {
    try {
      await prisma.session.update({
        where: { id: sessionId },
        data: { lastSeenAt: new Date() },
      });
    } catch {
      // Carimbo de "visto por último" não vale uma requisição quebrada.
    }
  };

  try {
    after(tarefa);
  } catch {
    void tarefa();
  }
}

/**
 * Carrega o usuário da sessão atual.
 *
 * Memoizado com o `cache()` do React: o layout, a página e cada Server Action da
 * mesma requisição chamam à vontade e o banco é consultado uma vez só. O cache
 * vive dentro de UMA requisição — não há vazamento de usuário entre pessoas.
 */
const carregarUsuarioAtual = cache(async (): Promise<SessionUser | null> => {
  try {
    const armazem = await cookies();
    const bruto = armazem.get(NOME_COOKIE_SESSAO)?.value;

    // Descarta cookie ausente, vazio ou com formato que não é o nosso, sem tocar
    // no banco: é o caso mais comum (visitante) e o mais fácil de abusar.
    if (!pareceToken(bruto)) return null;

    const sessao = await prisma.session.findUnique({
      where: { tokenHash: hashToken(bruto) },
      select: {
        id: true,
        expiresAt: true,
        lastSeenAt: true,
        user: { select: CAMPOS_DO_USUARIO },
      },
    });

    if (!sessao) return null;

    const agora = Date.now();

    // A expiração é conferida aqui, no servidor. O `maxAge` do cookie é uma
    // gentileza com o navegador; quem manda é a coluna `expiresAt`.
    if (sessao.expiresAt.getTime() <= agora) return null;

    if (agora - sessao.lastSeenAt.getTime() >= INTERVALO_LAST_SEEN_MS) {
      marcarSessaoComoVista(sessao.id);
    }

    return sessao.user;
  } catch {
    // Banco fora do ar, cookie corrompido, o que for: sem sessão é sem sessão.
    // Nada de log aqui — o valor em jogo é um token de sessão.
    return null;
  }
});

/** Usuário da requisição atual, ou `null` se não houver sessão válida. */
export async function getCurrentUser(): Promise<SessionUser | null> {
  return carregarUsuarioAtual();
}

/**
 * Exige sessão válida. Sem ela, redireciona para `/entrar` preservando a origem.
 *
 * Use no topo de todo Server Component de rota protegida **e** dentro de toda
 * Server Action que mexa em dados do usuário. O middleware é só a primeira
 * peneira: ele confere a presença do cookie, não a validade da sessão, e uma
 * Server Action pode ser chamada por uma rota que o `matcher` não cobre.
 *
 * O caminho de origem vem do cabeçalho que o middleware injeta — e passa pelo
 * `safeNext()` dentro de `urlDeLogin()`, porque cabeçalho de requisição é dado
 * do cliente até prova em contrário.
 *
 * Nunca retorna quando não há usuário: `redirect()` lança.
 */
export async function requireUser(): Promise<SessionUser> {
  const usuario = await carregarUsuarioAtual();
  if (usuario) return usuario;

  const [armazem, cabecalhos] = await Promise.all([cookies(), headers()]);
  const origem = cabecalhos.get(CABECALHO_CAMINHO);

  // Cookie presente + sessão inválida = sessão expirada ou revogada. A marca
  // avisa o middleware para não devolver a pessoa ao app (seria um laço) e dá à
  // tela de login o contexto para explicar o que aconteceu.
  const tinhaCookie = Boolean(armazem.get(NOME_COOKIE_SESSAO)?.value);
  const extras = tinhaCookie ? { [PARAM_SESSAO]: VALOR_SESSAO_EXPIRADA } : undefined;

  redirect(urlDeLogin(origem, extras));
}

/**
 * Abre uma sessão para o usuário e entrega o cookie ao navegador.
 *
 * ⚠️ Só funciona dentro de uma Server Action ou Route Handler.
 *
 * O coração do "lembrar-me" está nas duas últimas linhas:
 * - **marcado** → o cookie ganha `maxAge` (30 dias). É um cookie *persistente*:
 *   o navegador grava em disco e ele sobrevive a fechar a janela, reiniciar a
 *   máquina, tudo — até a data acabar.
 * - **desmarcado** → o cookie vai **sem `maxAge` e sem `expires`**. Isso o torna
 *   um *cookie de sessão*: existe só na memória do navegador e some quando a
 *   janela fecha. É o comportamento que alguém num computador compartilhado
 *   espera ao deixar a caixinha vazia. Omitir o atributo é o que produz esse
 *   efeito — `maxAge: 0` faria o oposto, apagaria o cookie na hora.
 *
 * O prazo do banco acompanha: 30 dias com "lembrar-me", 1 dia sem. Mesmo que o
 * navegador guarde o cookie além da conta, o servidor recusa depois do prazo.
 */
export async function createSession(userId: string, remember: boolean): Promise<void> {
  const [armazem, cabecalhos] = await Promise.all([cookies(), headers()]);

  const raw = generateToken();
  const duracaoMs = remember ? DURACAO_LEMBRAR_MS : DURACAO_PADRAO_MS;
  const expiresAt = new Date(Date.now() + duracaoMs);

  await prisma.session.create({
    data: {
      tokenHash: hashToken(raw),
      userId,
      expiresAt,
      remember,
      userAgent: userAgentDosCabecalhos(cabecalhos),
      ip: ipDosCabecalhos(cabecalhos),
    },
  });

  armazem.set(NOME_COOKIE_SESSAO, raw, {
    ...atributosDoCookie(),
    ...(remember ? { maxAge: Math.floor(DURACAO_LEMBRAR_MS / 1000) } : {}),
  });
}

/**
 * Encerra a sessão atual: apaga a linha do banco e o cookie do navegador.
 *
 * ⚠️ Só funciona dentro de uma Server Action ou Route Handler.
 *
 * O cookie é limpo num `finally`: se o banco falhar, o usuário ainda sai da
 * sessão no navegador (e o erro sobe para quem chamou, em vez de virar um
 * "saiu" mentiroso). A linha órfã expira sozinha pelo `expiresAt`.
 */
export async function destroyCurrentSession(): Promise<void> {
  const armazem = await cookies();
  const bruto = armazem.get(NOME_COOKIE_SESSAO)?.value;

  try {
    if (pareceToken(bruto)) {
      await prisma.session.deleteMany({ where: { tokenHash: hashToken(bruto) } });
    }
  } finally {
    // `delete()` nem sempre casa com os atributos originais em todo navegador;
    // sobrescrever com valor vazio e prazo no passado é o apagamento confiável.
    armazem.set(NOME_COOKIE_SESSAO, '', {
      ...atributosDoCookie(),
      maxAge: 0,
      expires: new Date(0),
    });
  }
}

/**
 * Derruba **todas** as sessões do usuário, inclusive a atual.
 *
 * É o que o contrato §5.5 exige depois de uma redefinição de senha: quem estava
 * dentro com a senha antiga (o invasor, na hipótese que motivou a redefinição)
 * é posto para fora. O cookie desta requisição **não** é limpo aqui de propósito
 * — a ação de redefinir cria uma sessão nova logo em seguida, e limpar antes
 * disso só provocaria um piscar de tela de login.
 */
export async function destroyAllSessions(userId: string): Promise<void> {
  await prisma.session.deleteMany({ where: { userId } });
}

/**
 * Derruba as outras sessões do usuário e mantém a desta requisição.
 *
 * É o botão "encerrar outras sessões" do perfil: dá para expulsar o celular
 * esquecido no ônibus sem se deslogar do computador onde você está agora.
 *
 * O `userId` entra no `where`, então a operação nunca alcança a sessão de outra
 * pessoa — quem chama deve passar o id de `requireUser()`, não algo vindo do
 * formulário. Sem cookie válido nesta requisição, "as outras" são todas.
 */
export async function destroyOtherSessions(userId: string): Promise<void> {
  const armazem = await cookies();
  const bruto = armazem.get(NOME_COOKIE_SESSAO)?.value;
  const hashAtual = pareceToken(bruto) ? hashToken(bruto) : null;

  await prisma.session.deleteMany({
    where: {
      userId,
      ...(hashAtual ? { NOT: { tokenHash: hashAtual } } : {}),
    },
  });
}

/**
 * Remove sessões vencidas. Devolve quantas saíram.
 *
 * Sessão expirada já não autentica ninguém (o `getCurrentUser` confere a data),
 * mas continua ocupando espaço e poluindo a lista de dispositivos do perfil.
 * Para tarefa agendada, como as outras limpezas deste diretório.
 */
export async function cleanupExpiredSessions(): Promise<number> {
  const { count } = await prisma.session.deleteMany({
    where: { expiresAt: { lt: new Date() } },
  });

  return count;
}
