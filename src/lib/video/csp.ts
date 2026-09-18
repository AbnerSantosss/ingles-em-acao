/**
 * A allowlist de embed de vídeo — e o `frame-src` que a repete no CSP.
 *
 * ⚠️ **Este arquivo é importado pelo `next.config.ts`.** Por isso ele não tem
 * import nenhum (nem de tipo, nem com `@/`): o carregador de configuração do
 * Next transpila o `next.config.ts` e resolve os `require` dele por um hook
 * próprio, e quanto menos houver no caminho, menos coisa pode quebrar a subida
 * do app inteiro. Se você precisar de algo daqui em código normal, importe;
 * não acrescente dependências **aqui**.
 *
 * ## Por que existem duas travas (BACKOFFICE §2.6)
 *
 * 1. `parseVideoSource` (em `./fonte.ts`) só aceita endereços do YouTube e do
 *    Vimeo, extrai o id e recusa o resto. É a trava do **servidor**.
 * 2. O `frame-src` abaixo é a trava do **navegador**: mesmo que um dia um
 *    `videoRef` torto chegue à tela — banco editado à mão, migração pela
 *    metade, conta de admin comprometida —, o navegador se recusa a carregar
 *    um iframe de origem que não esteja nesta lista.
 *
 * As duas precisam bater. Acrescentar um host à allowlist do parser **sem**
 * acrescentá-lo aqui dá o pior resultado possível: o painel salva, a tela do
 * aluno mostra um retângulo vazio e ninguém recebe erro. Por isso a lista é
 * uma só, neste arquivo, e os dois lados a importam.
 *
 * ⚠️ **Mudar esta lista exige deploy.** É por isso que o MVP **não** implementa
 * a allowlist dinâmica em `AppSetting.embed.allowlist` que a §2.9 prevê: um
 * host acrescentado em runtime não entraria no cabeçalho, e o vídeo salvo com
 * ele seria bloqueado pelo navegador. Quando a allowlist dinâmica existir, o
 * cabeçalho precisa nascer dinâmico junto (proxy ou route handler), não aqui.
 */

/** Origens que o app pode carregar dentro de um `<iframe>`. Nada além disto. */
export const ORIGENS_DE_EMBED = [
  // YouTube sem cookie de rastreio — §2.6: "YouTube é servido por
  // youtube-nocookie.com com rel=0".
  'https://www.youtube-nocookie.com',
  'https://player.vimeo.com',
] as const;

/**
 * Valor do `frame-src`.
 *
 * `'self'` entra porque o app pode precisar embutir uma página dele mesmo (e
 * porque o overlay de erro do `next dev` usa iframe de mesma origem); tirá-lo
 * economizaria nada e quebraria isso.
 */
export const FRAME_SRC = ["'self'", ...ORIGENS_DE_EMBED].join(' ');

/**
 * A política inteira que o app envia — só a diretiva de vídeo, de propósito.
 *
 * Uma política com uma diretiva só **não** restringe script, estilo ou imagem:
 * diretiva ausente é diretiva sem restrição (não existe `default-src` aqui).
 * Isso é deliberado — esta rodada é a de vídeo, e uma CSP ampla escrita às
 * pressas quebraria telas que não são desta fase. Quando alguém escrever a
 * política completa do app, esta constante vira uma linha dentro dela.
 */
export const CSP_DE_VIDEO = `frame-src ${FRAME_SRC}`;

/**
 * Onde o cabeçalho é aplicado.
 *
 * Só as rotas que de fato embutem vídeo: a tela da aula (onde entra conteúdo
 * configurado pelo admin, que é o risco real) e a tela de vídeos do painel
 * (que pré-visualiza no mesmo player). Aplicar em `/:path*` seria política
 * ampla — exatamente o que esta fase não deve inventar.
 */
export const ROTAS_COM_VIDEO = ['/aula/:slug*', '/admin/videos'] as const;
