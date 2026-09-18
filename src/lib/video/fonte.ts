/**
 * Normalização de fonte de vídeo — a trava do servidor (BACKOFFICE §2.6, D6).
 *
 * O vídeo de uma aula entra de dois jeitos: **link** (YouTube, Vimeo ou um
 * arquivo .mp4/.webm servido por https) ou **arquivo enviado** para o bucket
 * (ver `./envio.ts` e `./bucket.ts`). O que o admin cola na tela chega aqui, e
 * o que sai daqui é uma de quatro formas conhecidas — ou um erro em português.
 * O parser só produz as três formas de link; `upload` nasce da Server Action
 * de envio, depois que o arquivo foi conferido no bucket.
 *
 * ## A regra que importa
 *
 * `parseVideoSource` é uma **allowlist**, não uma regex permissiva. Ela aceita
 * os formatos conhecidos do YouTube (`watch`, `youtu.be`, `embed`, `shorts`) e
 * do Vimeo, **extrai o id** e recusa todo o resto. O motivo é direto: o que
 * sair daqui vai para dentro de um `<iframe>` na sessão do aluno. Um endereço
 * arbitrário ali é injeção de conteúdo de terceiro na sessão de quem estuda —
 * a página embutida vê os cliques dela, pode pedir permissão de câmera em nome
 * do domínio e pode virar outra coisa depois que o admin conferiu.
 *
 * Por isso, também:
 *
 * - **Do `<iframe>` colado guarda-se só o `src`, nunca o HTML.** Guardar o
 *   HTML é XSS armazenado esperando a primeira tela que renderizar sem
 *   escapar. O parser extrai o `src` e joga o resto fora.
 * - **Só `https:`.** `javascript:`, `data:`, `http:` e amigos morrem aqui.
 * - **O id tem formato.** YouTube são 11 caracteres de um alfabeto conhecido;
 *   Vimeo é numérico. Id fora do formato não vira embed.
 * - A allowlist de host é a mesma de `./csp.ts`, que vira o `frame-src`. Duas
 *   travas independentes: se uma falhar, a outra ainda segura.
 *
 * ⚠️ O tipo `url` (arquivo .mp4/.webm servido por https) aceita **qualquer**
 * host, porque não existe lista de CDNs a fechar. Ele não vai para `<iframe>`:
 * vai para `<video>`, que não executa script. O risco aqui é de conteúdo e de
 * privacidade (o host vê o IP do aluno), não de execução — e quem cola é um
 * admin autenticado, com a mudança registrada em auditoria.
 *
 * ⚠️ Este arquivo é importado por Client Component (a pré-visualização do
 * painel e o player). Ele não pode importar Prisma, `db`, `session` nem nada
 * de servidor. Mantenha-o puro.
 */

import { ORIGENS_DE_EMBED } from './csp';

/** Espelha `enum VideoKind` do schema, sem importar o client do Prisma. */
export type TipoDeVideo = 'YOUTUBE' | 'VIMEO' | 'URL' | 'UPLOAD';

/** Forma normalizada de um vídeo. Contrato da §2.6. */
export type VideoSource =
  | { kind: 'youtube'; id: string; start?: number }
  | { kind: 'vimeo'; id: string; hash?: string }
  | { kind: 'url'; url: string }
  | { kind: 'upload'; assetId: string };

export type ErroDeFonte = { erro: string };

/** Discriminador do retorno de `parseVideoSource`. */
export function ehErroDeFonte(valor: VideoSource | ErroDeFonte): valor is ErroDeFonte {
  return 'erro' in valor;
}

// ---------------------------------------------------------------------------
// Formatos aceitos
// ---------------------------------------------------------------------------

/** Hosts do YouTube que a gente reconhece (já sem o `www.`). */
const HOSTS_YOUTUBE = new Set(['youtube.com', 'm.youtube.com', 'youtube-nocookie.com', 'youtu.be']);

/** Hosts do Vimeo que a gente reconhece (já sem o `www.`). */
const HOSTS_VIMEO = new Set(['vimeo.com', 'player.vimeo.com']);

/** Id do YouTube: 11 caracteres do alfabeto base64url. */
const ID_YOUTUBE = /^[A-Za-z0-9_-]{11}$/;

/** Id do Vimeo: só dígitos. */
const ID_VIMEO = /^[0-9]{5,12}$/;

/** Hash de vídeo não listado do Vimeo (`vimeo.com/123456789/abc123def`). */
const HASH_VIMEO = /^[A-Za-z0-9]{4,32}$/;

/** Extensões que o `<video>` do navegador toca sem biblioteca nenhuma. */
const EXTENSOES_DE_ARQUIVO = ['.mp4', '.webm'];

/** Id de `MediaAsset` (cuid): o `videoRef` de um vídeo enviado. */
const ID_DE_ASSET = /^[A-Za-z0-9_-]{8,64}$/;

/** Teto defensivo: um endereço de vídeo não tem 2 KB. */
const TAMANHO_MAXIMO = 2000;

/** Segundos de início aceitáveis — 24h já é absurdo, serve de teto. */
const INICIO_MAXIMO = 86_400;

// ---------------------------------------------------------------------------
// parseVideoSource
// ---------------------------------------------------------------------------

/**
 * Transforma o que o admin colou numa `VideoSource` — ou devolve `{ erro }`
 * com uma frase que explica o que fazer.
 *
 * Aceita, por exemplo:
 * - `https://www.youtube.com/watch?v=dQw4w9WgXcQ`
 * - `https://youtu.be/dQw4w9WgXcQ?t=42` → `start: 42`
 * - `https://www.youtube.com/shorts/dQw4w9WgXcQ`
 * - `https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ`
 * - `<iframe src="https://player.vimeo.com/video/123456789"></iframe>`
 * - `https://vimeo.com/123456789/a1b2c3d4e5` (não listado, com hash)
 * - `https://cdn.exemplo.com/aulas/aula01.mp4`
 *
 * Recusa: outro host, `http://`, `javascript:`, `<script>`, id fora de
 * formato, iframe sem `src`, texto solto.
 */
export function parseVideoSource(bruto: string): VideoSource | ErroDeFonte {
  const texto = typeof bruto === 'string' ? bruto.trim() : '';
  if (texto === '') return { erro: 'Cole o endereço do vídeo.' };
  if (texto.length > TAMANHO_MAXIMO) {
    return { erro: 'Esse texto é longo demais para ser um endereço de vídeo. Cole só o link.' };
  }

  const alvo = extrairEndereco(texto);
  if (typeof alvo !== 'string') return alvo;

  let url: URL;
  try {
    url = new URL(alvo);
  } catch {
    return {
      erro: 'Não reconheci isso como um endereço. Cole o link inteiro do vídeo, começando com https://.',
    };
  }

  if (url.protocol !== 'https:') {
    return {
      erro: `Só entram endereços https:// aqui. O que você colou começa com "${url.protocol}" e não vai para a tela do aluno.`,
    };
  }
  if (url.username !== '' || url.password !== '') {
    return { erro: 'Esse endereço carrega usuário e senha embutidos. Use o link público do vídeo.' };
  }

  const host = url.hostname.toLowerCase().replace(/^www\./, '');

  if (HOSTS_YOUTUBE.has(host)) return doYoutube(url, host);
  if (HOSTS_VIMEO.has(host)) return doVimeo(url, host);

  const caminho = url.pathname.toLowerCase();
  if (EXTENSOES_DE_ARQUIVO.some((extensao) => caminho.endsWith(extensao))) {
    return { kind: 'url', url: url.toString() };
  }

  return {
    erro:
      `O site "${host}" não está na lista permitida. Neste app o vídeo precisa estar no YouTube ou no Vimeo — ` +
      'ou ser um arquivo .mp4/.webm servido por https.',
  };
}

/**
 * Se o texto for um trecho de HTML de incorporação, devolve **só** o `src`.
 * Caso contrário devolve o próprio texto (com `https://` na frente quando o
 * admin colou `youtu.be/...` sem o esquema).
 */
function extrairEndereco(texto: string): string | ErroDeFonte {
  if (/<\s*iframe/i.test(texto)) {
    const achado = /\bsrc\s*=\s*["']([^"']+)["']/i.exec(texto);
    if (!achado) {
      return {
        erro: 'Não encontrei o src= dentro desse código de incorporação. Cole só o endereço do vídeo.',
      };
    }
    // O src veio de HTML: `&amp;` ali é um `&`.
    return achado[1].trim().replace(/&amp;/gi, '&');
  }

  if (/<\s*[a-z]/i.test(texto)) {
    return { erro: 'Isso parece um trecho de HTML. Cole só o endereço do vídeo, começando com https://.' };
  }

  const HOSTS_SEM_ESQUEMA = /^(?:www\.)?(?:youtube\.com|m\.youtube\.com|youtu\.be|vimeo\.com|player\.vimeo\.com)\//i;
  if (!texto.includes('://') && HOSTS_SEM_ESQUEMA.test(texto)) {
    return `https://${texto}`;
  }

  return texto;
}

function doYoutube(url: URL, host: string): VideoSource | ErroDeFonte {
  const partes = url.pathname.split('/').filter(Boolean);
  let id: string | undefined;

  if (host === 'youtu.be') {
    id = partes[0];
  } else if (partes[0] === 'watch') {
    id = url.searchParams.get('v') ?? undefined;
  } else if (partes[0] === 'embed' || partes[0] === 'shorts') {
    id = partes[1];
  } else if (partes.length === 0 && url.searchParams.has('v')) {
    id = url.searchParams.get('v') ?? undefined;
  }

  if (!id) {
    return {
      erro:
        'Esse link do YouTube não traz o identificador do vídeo. Use o endereço da página do vídeo ' +
        '(o que tem "?v=") ou o link curto do botão Compartilhar.',
    };
  }
  if (!ID_YOUTUBE.test(id)) {
    return { erro: `"${id}" não tem o formato de um identificador do YouTube (11 caracteres).` };
  }

  const start = lerInicio(url.searchParams.get('t') ?? url.searchParams.get('start'));
  return start === undefined ? { kind: 'youtube', id } : { kind: 'youtube', id, start };
}

function doVimeo(url: URL, host: string): VideoSource | ErroDeFonte {
  const partes = url.pathname.split('/').filter(Boolean);
  let id: string | undefined;
  let hash: string | undefined;

  if (host === 'player.vimeo.com') {
    // player.vimeo.com/video/123456789
    if (partes[0] === 'video') {
      id = partes[1];
      hash = partes[2];
    }
  } else {
    // vimeo.com/123456789, /channels/x/123456789, /groups/x/videos/123456789
    const numericos = partes.filter((parte) => ID_VIMEO.test(parte));
    id = numericos[numericos.length - 1];
    if (id !== undefined) {
      const seguinte = partes[partes.indexOf(id) + 1];
      if (seguinte !== undefined && HASH_VIMEO.test(seguinte)) hash = seguinte;
    }
  }

  const hashDaQuery = url.searchParams.get('h');
  if (hashDaQuery !== null && HASH_VIMEO.test(hashDaQuery)) hash = hashDaQuery;

  if (!id) {
    return { erro: 'Esse link do Vimeo não traz o número do vídeo. Use o endereço da página do vídeo.' };
  }
  if (!ID_VIMEO.test(id)) {
    return { erro: `"${id}" não tem o formato de um número de vídeo do Vimeo.` };
  }
  if (hash !== undefined && !HASH_VIMEO.test(hash)) hash = undefined;

  return hash === undefined ? { kind: 'vimeo', id } : { kind: 'vimeo', id, hash };
}

/** `42`, `1m30s`, `1h02m03s` → segundos. Qualquer outra coisa → `undefined`. */
function lerInicio(valor: string | null): number | undefined {
  if (valor === null) return undefined;
  const texto = valor.trim().toLowerCase();
  if (texto === '') return undefined;

  if (/^\d+$/.test(texto)) return limitarInicio(Number(texto));

  const achado = /^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/.exec(texto);
  if (!achado || (achado[1] === undefined && achado[2] === undefined && achado[3] === undefined)) {
    return undefined;
  }
  const horas = Number(achado[1] ?? 0);
  const minutos = Number(achado[2] ?? 0);
  const segundos = Number(achado[3] ?? 0);
  return limitarInicio(horas * 3600 + minutos * 60 + segundos);
}

function limitarInicio(segundos: number): number | undefined {
  if (!Number.isFinite(segundos) || segundos <= 0) return undefined;
  return Math.min(Math.floor(segundos), INICIO_MAXIMO);
}

// ---------------------------------------------------------------------------
// Ida e volta do banco (`Lesson.videoKind` + `Lesson.videoRef`)
// ---------------------------------------------------------------------------

/** O `videoKind` correspondente. */
export function tipoDaFonte(fonte: VideoSource): TipoDeVideo {
  switch (fonte.kind) {
    case 'youtube':
      return 'YOUTUBE';
    case 'vimeo':
      return 'VIMEO';
    case 'url':
      return 'URL';
    case 'upload':
      return 'UPLOAD';
  }
}

/**
 * O `videoRef` correspondente: o id, com os extras em forma de query.
 * `dQw4w9WgXcQ?t=42`, `123456789?h=a1b2c3`, a URL inteira, o id do asset.
 */
export function refDaFonte(fonte: VideoSource): string {
  switch (fonte.kind) {
    case 'youtube':
      return fonte.start === undefined ? fonte.id : `${fonte.id}?t=${fonte.start}`;
    case 'vimeo':
      return fonte.hash === undefined ? fonte.id : `${fonte.id}?h=${fonte.hash}`;
    case 'url':
      return fonte.url;
    case 'upload':
      return fonte.assetId;
  }
}

/**
 * Volta do banco para a forma normalizada, **revalidando tudo**.
 *
 * O banco não é fonte confiável para algo que vira `<iframe>`: linha editada à
 * mão, importação antiga e migração pela metade existem. Se o par
 * `kind`/`ref` não passar pelas mesmas regras do parser, devolve `null` — e a
 * tela do aluno simplesmente não mostra painel nenhum.
 *
 * `legado` é a coluna `Lesson.videoUrl` do CONTRACT §4, anterior a estes
 * campos: quando `kind`/`ref` estão vazios, ela é lida passando pelo parser.
 */
export function fonteDaLinha(
  kind: string | null | undefined,
  ref: string | null | undefined,
  legado?: string | null,
): VideoSource | null {
  if (kind && ref) {
    const [base, query] = separarRef(ref);
    switch (kind) {
      case 'YOUTUBE': {
        if (!ID_YOUTUBE.test(base)) return null;
        const start = lerInicio(query.get('t'));
        return start === undefined ? { kind: 'youtube', id: base } : { kind: 'youtube', id: base, start };
      }
      case 'VIMEO': {
        if (!ID_VIMEO.test(base)) return null;
        const hash = query.get('h');
        return hash !== null && HASH_VIMEO.test(hash)
          ? { kind: 'vimeo', id: base, hash }
          : { kind: 'vimeo', id: base };
      }
      case 'URL': {
        const conferido = parseVideoSource(ref);
        return !ehErroDeFonte(conferido) && conferido.kind === 'url' ? conferido : null;
      }
      case 'UPLOAD':
        // O id do MediaAsset. Se ele existe, é de vídeo e não está arquivado é
        // conferido no servidor, na hora de assinar o link (`./aula.ts`).
        return ID_DE_ASSET.test(ref) ? { kind: 'upload', assetId: ref } : null;
      default:
        return null;
    }
  }

  if (legado) {
    const conferido = parseVideoSource(legado);
    return ehErroDeFonte(conferido) ? null : conferido;
  }

  return null;
}

function separarRef(ref: string): [string, URLSearchParams] {
  const corte = ref.indexOf('?');
  if (corte < 0) return [ref, new URLSearchParams()];
  return [ref.slice(0, corte), new URLSearchParams(ref.slice(corte + 1))];
}

// ---------------------------------------------------------------------------
// Player
// ---------------------------------------------------------------------------

export type Reproducao =
  /** Vai para `<iframe src>`; `origem` está em `ORIGENS_DE_EMBED` e no `frame-src`. */
  | { modo: 'iframe'; src: string; origem: string }
  /** Vai para `<video src>`; não executa script. */
  | { modo: 'arquivo'; src: string };

/**
 * Monta o endereço que entra no player.
 *
 * `null` para `upload`: o endereço de um arquivo enviado é uma URL assinada de
 * 15 minutos, e assinar exige a chave do bucket — coisa de servidor. O player
 * recebe esse link à parte (`PainelDeVideo`, prop `arquivo`).
 *
 * YouTube sai por `youtube-nocookie.com` com `rel=0` (§2.6): sem cookie de
 * rastreio e sem recomendação de canal alheio no fim da aula.
 */
export function montarReproducao(fonte: VideoSource): Reproducao | null {
  switch (fonte.kind) {
    case 'youtube': {
      const parametros = new URLSearchParams({ rel: '0', modestbranding: '1', playsinline: '1' });
      if (fonte.start !== undefined) parametros.set('start', String(fonte.start));
      return {
        modo: 'iframe',
        src: `https://www.youtube-nocookie.com/embed/${fonte.id}?${parametros.toString()}`,
        origem: 'https://www.youtube-nocookie.com',
      };
    }
    case 'vimeo': {
      const parametros = new URLSearchParams({ dnt: '1' });
      if (fonte.hash !== undefined) parametros.set('h', fonte.hash);
      return {
        modo: 'iframe',
        src: `https://player.vimeo.com/video/${fonte.id}?${parametros.toString()}`,
        origem: 'https://player.vimeo.com',
      };
    }
    case 'url':
      return { modo: 'arquivo', src: fonte.url };
    case 'upload':
      return null;
  }
}

/** Endereço para o humano abrir em outra aba (conferência no painel). */
export function linkPublico(fonte: VideoSource): string | null {
  switch (fonte.kind) {
    case 'youtube':
      return `https://www.youtube.com/watch?v=${fonte.id}`;
    case 'vimeo':
      return fonte.hash === undefined
        ? `https://vimeo.com/${fonte.id}`
        : `https://vimeo.com/${fonte.id}/${fonte.hash}`;
    case 'url':
      return fonte.url;
    case 'upload':
      return null;
  }
}

/** Nome curto da origem, para tabela e rodapé do player. */
export function rotuloDaOrigem(fonte: VideoSource): string {
  switch (fonte.kind) {
    case 'youtube':
      return 'YouTube';
    case 'vimeo':
      return 'Vimeo';
    case 'url':
      return 'Arquivo direto';
    case 'upload':
      return 'Arquivo enviado';
  }
}

/** Uma linha só descrevendo a fonte, para a lista do painel. */
export function descreverFonte(fonte: VideoSource): string {
  switch (fonte.kind) {
    case 'youtube':
      return `YouTube · ${fonte.id}${fonte.start === undefined ? '' : ` · começa em ${fonte.start}s`}`;
    case 'vimeo':
      return `Vimeo · ${fonte.id}${fonte.hash === undefined ? '' : ' · não listado'}`;
    case 'url':
      return `Arquivo · ${fonte.url}`;
    case 'upload':
      return 'Arquivo enviado';
  }
}

/** Texto de ajuda da tela — a allowlist dita em português. */
export const HOSTS_ACEITOS: readonly string[] = [...HOSTS_YOUTUBE, ...HOSTS_VIMEO];

/** As origens que o `frame-src` libera, reexportadas para a tela do painel. */
export const ORIGENS_LIBERADAS: readonly string[] = ORIGENS_DE_EMBED;
