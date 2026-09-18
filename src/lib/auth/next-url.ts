/**
 * Destino de retorno (`?next=`) e constantes compartilhadas com o middleware.
 *
 * "Login é uma PORTA, não um destino: a origem nunca se perde." (contrato §5.7)
 *
 * Este arquivo é a defesa contra **open redirect**. O ataque é sempre o mesmo:
 * mandar a vítima para `https://ingles-em-acao.com/entrar?next=https://sitedoladrao.com/entrar`,
 * ela confere o domínio, digita a senha de verdade, e o app — obediente — a joga
 * numa cópia idêntica da tela de login hospedada pelo atacante, que pede a senha
 * "de novo". O phishing ganha credibilidade porque o primeiro link era legítimo.
 *
 * Por isso a regra é **lista de permissão, não de bloqueio**: só passa o que for,
 * comprovadamente, um caminho interno. Qualquer dúvida cai no `fallback`.
 *
 * Sem dependências de propósito — é importado pelo middleware, que roda fora do
 * runtime principal do app e não pode arrastar Prisma nem `next/headers`.
 */

/**
 * Constantes que o middleware e o núcleo de sessão precisam enxergar iguais.
 *
 * Elas moram aqui, e não em `session.ts`, por um motivo prático: `session.ts`
 * importa o Prisma, e o middleware não pode arrastar o Prisma para o bundle dele.
 * Este arquivo não tem dependência nenhuma, então serve aos dois lados sem
 * duplicar texto mágico. `session.ts` reexporta o nome do cookie, que é onde
 * qualquer pessoa vai procurar primeiro.
 */

/** Nome do cookie de sessão — contrato §5.3. */
export const NOME_COOKIE_SESSAO = 'iea_session';

/**
 * Cabeçalho que o middleware injeta na requisição com o caminho original
 * (`/aula/verbo-to-be?pagina=3`). O `requireUser()` lê daqui para montar o
 * `?next=` quando o cookie existe mas a sessão já não vale.
 *
 * O cliente pode forjar este cabeçalho — por isso o valor SEMPRE passa por
 * `safeNext()` antes de virar destino. O pior que um valor forjado consegue é
 * apontar para outra tela interna do próprio app.
 */
export const CABECALHO_CAMINHO = 'x-iea-caminho';

/**
 * Marca "a sessão morreu, mostre a tela de login mesmo com cookie".
 *
 * Sem isso existe um laço: o middleware vê o cookie e manda para `/inicio`;
 * `/inicio` chama `requireUser()`, descobre que a sessão não vale e manda para
 * `/entrar`; o middleware vê o cookie de novo... O `requireUser()` acrescenta
 * `?sessao=expirada` no retorno e o middleware, ao ver essa marca, deixa a tela
 * de login abrir. O laço termina em dois saltos e a tela ainda ganha o contexto
 * para dizer "sua sessão expirou, entre novamente".
 */
export const PARAM_SESSAO = 'sessao';
export const VALOR_SESSAO_EXPIRADA = 'expirada';

/** Destino padrão quando não há um `next` confiável. */
export const DESTINO_PADRAO = '/inicio';

/**
 * Base fictícia para a análise final. O domínio `.invalid` é reservado pela
 * RFC 2606 e nunca resolve — se o valor conseguir trocar a origem, dá para
 * detectar comparando com esta constante.
 */
const BASE_FICTICIA = 'https://destino.invalid';

/** Teto de tamanho: caminho gigante é tentativa de estourar log ou parser. */
const TAMANHO_MAXIMO = 2048;

/**
 * Rotas de autenticação. Mandar o usuário de volta para a porta depois de ele
 * ter entrado é um pingue-pongue inútil (o middleware devolveria para `/inicio`),
 * além de ser o formato preferido do atacante que quer reencenar o login.
 */
const ROTAS_DE_AUTENTICACAO = [
  '/entrar',
  '/criar-conta',
  '/esqueci-senha',
  '/redefinir-senha',
  '/verificar-email',
];

/**
 * Devolve o caminho interno normalizado, ou `null` se o valor não for confiável.
 * Cada regra abaixo está numerada com o ataque que ela fecha.
 */
function caminhoInterno(valor: unknown): string | null {
  // (1) Tipo e tamanho. `null`, `undefined`, número, objeto vindo de query string
  //     manipulada: nada disso é caminho.
  if (typeof valor !== 'string') return null;
  if (valor.length === 0 || valor.length > TAMANHO_MAXIMO) return null;

  // (2) Caracteres de controle e espaços em branco crus.
  //     Ataque: navegadores REMOVEM tab (\t), LF (\n) e CR (\r) da URL antes de
  //     interpretá-la. Ou seja, "/\t/evil.com" vira "//evil.com" — um endereço
  //     externo — só na hora de navegar. O mesmo lixo também serve para injeção
  //     de cabeçalho HTTP (CRLF) se o valor for parar num `Location:`.
  //     Rejeitar qualquer caractere <= 0x20 e o DEL (0x7F) mata a família inteira.
  for (let i = 0; i < valor.length; i += 1) {
    const codigo = valor.charCodeAt(i);
    if (codigo <= 0x20 || codigo === 0x7f) return null;
  }

  // (3) Barra invertida em qualquer posição.
  //     Ataque: para URLs de esquema especial (http/https) a especificação manda
  //     tratar "\" como "/". Então "/\evil.com" é lido como "//evil.com" e
  //     "/\/evil.com" também. É a variante que mais passa por validador ingênuo.
  if (valor.includes('\\')) return null;

  // (4) Tem que começar com "/".
  //     Ataque: "https://evil.com", "//evil.com", "evil.com" e "javascript:alert(1)"
  //     são todos destinos externos (ou execução de script) se entregues a um
  //     redirect sem checagem.
  if (!valor.startsWith('/')) return null;

  // (5) Não pode começar com "//".
  //     Ataque: URL relativa a protocolo. "//evil.com" herda o https do site atual
  //     e vai parar no domínio do atacante, sem nunca escrever "http" no valor.
  if (valor.startsWith('//')) return null;

  // (6) Sem ":" antes da primeira "/".
  //     Com a regra (4) já valendo, o primeiro caractere é "/" e esta condição é
  //     estruturalmente impossível — ela fica aqui de propósito, como cinto de
  //     segurança: se um dia alguém relaxar a regra (4) para aceitar caminhos
  //     relativos ("perfil"), esta linha continua bloqueando "javascript:",
  //     "data:", "mailto:" e qualquer outro esquema.
  const ateAPrimeiraBarra = valor.slice(0, Math.max(valor.indexOf('/'), 0));
  if (ateAPrimeiraBarra.includes(':')) return null;

  // (7) Prova final: deixe o analisador de URL do próprio runtime decidir.
  //     As regras acima são texto; esta é semântica. Se, resolvido contra uma base
  //     conhecida, o valor mudar de origem, ele não era interno — não importa o
  //     truque usado. É a rede de segurança para o caso que ninguém previu.
  let url: URL;
  try {
    url = new URL(valor, BASE_FICTICIA);
  } catch {
    return null;
  }

  if (url.origin !== BASE_FICTICIA) return null;
  if (url.protocol !== 'https:') return null;
  if (!url.pathname.startsWith('/')) return null;
  // Credenciais embutidas ("/@evil.com" resolvido de forma criativa) nunca
  // aparecem num caminho interno legítimo.
  if (url.username !== '' || url.password !== '') return null;

  const caminho = `${url.pathname}${url.search}${url.hash}`;

  // (8) Política, não segurança: não devolva o usuário para a própria porta.
  const primeiroSegmento = url.pathname.replace(/\/+$/, '') || '/';
  if (ROTAS_DE_AUTENTICACAO.includes(primeiroSegmento)) return null;

  return caminho;
}

/**
 * Normaliza o `?next=` recebido do cliente.
 *
 * Devolve **sempre** um caminho interno: o valor, se ele passar por todas as
 * regras; senão o `fallback`; e, se nem o `fallback` prestar, `/inicio`.
 * Nunca lança e nunca devolve endereço absoluto.
 *
 * @example
 * safeNext('/aula/verbo-to-be')          // '/aula/verbo-to-be'
 * safeNext('/trilha?modulo=2')           // '/trilha?modulo=2'
 * safeNext('https://sitedoladrao.com')   // '/inicio'
 * safeNext('//sitedoladrao.com')         // '/inicio'
 * safeNext('/\\sitedoladrao.com')        // '/inicio'
 * safeNext(null, '/perfil')              // '/perfil'
 */
export function safeNext(
  value: string | null | undefined,
  fallback: string = DESTINO_PADRAO,
): string {
  return caminhoInterno(value) ?? caminhoInterno(fallback) ?? DESTINO_PADRAO;
}

/**
 * Monta `/entrar?next=<origem>` — a redação única do "volte para onde estava".
 *
 * A origem passa pelo `safeNext` antes de entrar na query, então mesmo um valor
 * forjado (um cabeçalho inventado pelo cliente, por exemplo) só consegue apontar
 * para dentro do app. Quando a origem é o próprio destino padrão, o parâmetro é
 * omitido para não sujar a URL da tela de login.
 */
export function urlDeLogin(origem?: string | null, extras?: Record<string, string>): string {
  const destino = safeNext(origem, DESTINO_PADRAO);
  const parametros = new URLSearchParams();

  if (destino !== DESTINO_PADRAO) parametros.set('next', destino);
  for (const [chave, valor] of Object.entries(extras ?? {})) parametros.set(chave, valor);

  const query = parametros.toString();
  return query ? `/entrar?${query}` : '/entrar';
}
