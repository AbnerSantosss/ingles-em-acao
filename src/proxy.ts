/**
 * Primeira peneira de autenticação.
 *
 * ⚠️ LEIA ISTO ANTES DE ACHAR QUE FALTA CÓDIGO AQUI.
 *
 * Este arquivo **não valida a sessão**. Ele só confere se o cookie `iea_session`
 * está presente. Parece um bug; não é, e o motivo é arquitetural:
 *
 * 1. O middleware/proxy do Next roda numa camada separada do app — historicamente
 *    o runtime Edge, e mesmo agora, com o padrão Node.js do Next 16, ele é um
 *    bundle próprio, pensado para viver na borda (CDN), antes de qualquer
 *    renderização. Nada de Prisma, `pg` ou binário nativo aqui dentro: além de
 *    inchar o bundle, o adapter do Prisma nem sempre teria com quem falar.
 * 2. A própria documentação do Next chama isto de "verificação otimista" e manda,
 *    com todas as letras, conferir autenticação de novo dentro de cada Server
 *    Component e Server Function.
 *
 * Quem valida de verdade — hasheia o token, consulta a tabela `Session`, confere
 * `expiresAt` e carrega o usuário — é o `requireUser()` de
 * `src/lib/auth/session.ts`, já no runtime do app, com banco à mão.
 *
 * A divisão de trabalho, então, é:
 * - middleware: **barato e antecipado**. Evita renderizar a Home inteira para
 *   quem nem cookie tem, e guarda o endereço de origem para depois do login.
 * - `requireUser()`: **correto e final**. É ele que diz não a um cookie forjado,
 *   expirado ou revogado.
 *
 * ⚠️ Corolário para quem escreve Server Actions: o `matcher` abaixo não é
 * autorização. Uma Server Function é um POST para a rota onde ela foi declarada,
 * e qualquer mudança de matcher pode tirá-la da cobertura sem ninguém notar.
 * Chame `requireUser()` dentro de toda ação que toque em dados do usuário.
 */
// Next 16 renomeou a convenção `middleware` para `proxy` (mesmo comportamento;
// o arquivo antigo emitia aviso de depreciação no build). Arquivo único por projeto:
// se alguém reintroduzir `src/middleware.ts`, o comportamento vira indefinido.
import { NextResponse, type NextRequest } from 'next/server';

import {
  CABECALHO_CAMINHO,
  NOME_COOKIE_SESSAO,
  PARAM_SESSAO,
  VALOR_SESSAO_EXPIRADA,
} from '@/lib/auth/next-url';

/**
 * Rotas que funcionam sem sessão.
 *
 * A lista é de **exceções**: tudo o que não estiver aqui exige cookie. Essa
 * inversão é proposital — quando a rodada seguinte criar `/aula/[slug]` de
 * verdade, ou quando o backoffice trouxer `/admin`, a rota nasce protegida em
 * vez de nascer aberta porque alguém esqueceu de acrescentá-la a uma lista.
 *
 * - `/` decide sozinha para onde mandar (contrato §7), então não pode ser barrada.
 * - `/redefinir-senha` e `/verificar-email` são abertas porque o que autoriza é o
 *   token da URL, não a sessão.
 */
const ROTAS_PUBLICAS = [
  '/',
  '/entrar',
  '/criar-conta',
  '/esqueci-senha',
  '/redefinir-senha',
  '/verificar-email',
  '/termos',
  '/privacidade',
];

/**
 * Rotas de `(auth)` das quais um visitante já logado é desviado para `/inicio`.
 *
 * ⚠️ `/redefinir-senha` e `/verificar-email` ficam de fora **de propósito**.
 * Quem clica no link de verificação de e-mail quase sempre está logado (o
 * contrato §6 diz que o e-mail não verificado não bloqueia o app); mandá-lo para
 * `/inicio` faria o link nunca funcionar. E quem pede redefinição de senha pode
 * ter uma sessão velha aberta em outra aba — o link precisa abrir do mesmo jeito.
 */
const ROTAS_DE_ENTRADA = ['/entrar', '/criar-conta', '/esqueci-senha'];

/** Métodos de navegação: são os únicos em que um redirecionamento faz sentido. */
const METODOS_DE_NAVEGACAO = new Set(['GET', 'HEAD']);

/** Compara ignorando barra final, para `/perfil` e `/perfil/` seguirem a mesma regra. */
function normalizar(caminho: string): string {
  if (caminho.length > 1 && caminho.endsWith('/')) return caminho.slice(0, -1);
  return caminho;
}

/** Uma rota é pública se for a própria rota listada ou uma sub-rota dela. */
function ehPublica(caminho: string): boolean {
  return ROTAS_PUBLICAS.some(
    (rota) => caminho === rota || (rota !== '/' && caminho.startsWith(`${rota}/`)),
  );
}

function ehRotaDeEntrada(caminho: string): boolean {
  return ROTAS_DE_ENTRADA.includes(caminho);
}

/**
 * Monta o destino de um desvio.
 *
 * ⚠️ Não use `request.nextUrl.clone()` aqui. A `NextURL` memoriza o
 * `trailingSlash` do pedido original e o reaplica ao pathname novo: quem pede
 * `/perfil/` seria mandado para `/entrar/`, e o Next ainda faria um segundo
 * redirecionamento (308) só para tirar a barra. Dois saltos, uma URL torta na
 * barra de endereços e uma rota que não bate com `ROTAS_DE_ENTRADA` na volta.
 * Montando uma `URL` comum a partir da origem, o destino sai exatamente como
 * está escrito aqui. O `basePath` entra na conta para o dia em que o app for
 * servido de um subdiretório.
 */
function destinoNoApp(request: NextRequest, caminho: string): URL {
  const base = request.nextUrl.basePath || '';
  return new URL(`${base}${caminho}`, request.nextUrl.origin);
}

export function proxy(request: NextRequest): NextResponse {
  const { pathname, search } = request.nextUrl;
  const caminho = normalizar(pathname);

  // Presença, não validade. Ver o bloco no topo do arquivo.
  const temCookieDeSessao = Boolean(request.cookies.get(NOME_COOKIE_SESSAO)?.value);
  const ehNavegacao = METODOS_DE_NAVEGACAO.has(request.method);

  // ---------------------------------------------------------------------
  // Já entrou e voltou para a porta → leva para dentro (contrato §7)
  // ---------------------------------------------------------------------
  if (temCookieDeSessao && ehNavegacao && ehRotaDeEntrada(caminho)) {
    // A marca `?sessao=expirada` vem do `requireUser()` e significa: "o cookie
    // existe, mas a sessão não vale mais". Sem esta exceção o par middleware ↔
    // requireUser entraria num laço de redirecionamentos, cada um empurrando o
    // usuário de volta para o outro. Com ela, a tela de login abre e a próxima
    // autenticação sobrescreve o cookie morto.
    const sessaoExpirada =
      request.nextUrl.searchParams.get(PARAM_SESSAO) === VALOR_SESSAO_EXPIRADA;

    if (!sessaoExpirada) {
      return NextResponse.redirect(destinoNoApp(request, '/inicio'));
    }
  }

  if (ehPublica(caminho)) {
    return NextResponse.next();
  }

  // ---------------------------------------------------------------------
  // Rota protegida
  // ---------------------------------------------------------------------
  if (!temCookieDeSessao) {
    // POST sem cookie (tipicamente uma Server Action) não é redirecionado: um 307
    // preserva o método e o navegador repetiria o POST na tela de login, onde ele
    // não faz sentido nenhum. Deixa passar — o `requireUser()` da ação recusa.
    if (!ehNavegacao) return NextResponse.next();

    const destino = destinoNoApp(request, '/entrar');
    // `pathname + search` preserva o Return Intent inteiro, inclusive a query
    // (contrato §5.7). O `searchParams.set` cuida da codificação; do outro lado,
    // o `safeNext()` confere que o valor continua sendo um caminho interno.
    destino.searchParams.set('next', `${pathname}${search}`);
    return NextResponse.redirect(destino);
  }

  // Tem cookie: segue para o app, mas leva junto o caminho de origem. Se a sessão
  // não valer, o `requireUser()` lê este cabeçalho para montar o `?next=` — é a
  // única forma de um Server Component saber a URL que o usuário pediu.
  const cabecalhos = new Headers(request.headers);
  cabecalhos.set(CABECALHO_CAMINHO, `${pathname}${search}`);

  return NextResponse.next({ request: { headers: cabecalhos } });
}

export default proxy;

export const config = {
  matcher: [
    /**
     * Roda em tudo, menos:
     * - `api/...`      rotas de API respondem 401 por conta própria; um 307 para
     *                  a tela de login estragaria a resposta JSON.
     * - `_next/...`    build, imagens otimizadas e payload de navegação. Barrar
     *                  isso deixa o app sem CSS e sem JavaScript.
     * - qualquer caminho cujo último segmento tenha ponto (`favicon.ico`,
     *   `brand/bigben.png`, `lessons/capas/01.png`, `robots.txt`): são arquivos
     *   de `public/`, e nenhuma rota do app tem ponto no nome.
     */
    '/((?!api/|_next/|.*\\.[^/]*$).*)',

    /**
     * `/admin` explicitamente, embora o padrão acima já o alcance.
     *
     * A redundância é de propósito (BACKOFFICE §1.1): o painel depende desta
     * peneira para que um visitante sem cookie seja mandado para `/entrar` antes
     * de qualquer renderização, e `/admin` não está em `ROTAS_PUBLICAS`. Se um
     * dia o padrão genérico for estreitado — para poupar prefetch, por exemplo —
     * esta linha impede que o painel saia da cobertura em silêncio.
     *
     * ⚠️ E continua valendo o aviso do topo do arquivo: isto é peneira, não
     * autorização. Quem confere `role === 'ADMIN'` é o `layout.tsx` do grupo
     * `(admin)`, via `requireAdmin()`, que é onde existe banco.
     */
    '/admin/:path*',
  ],
};
