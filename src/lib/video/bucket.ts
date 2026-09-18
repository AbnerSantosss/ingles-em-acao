/**
 * O bucket dos vídeos enviados — S3-compatível, recomendação Cloudflare R2
 * (BACKOFFICE D6, §4.3).
 *
 * ⚠️ MÓDULO DE SERVIDOR (`node:crypto`, `process.env`, as chaves do bucket).
 * Nunca importe de um `'use client'`: a chave secreta iria para o navegador.
 *
 * ## Por que não o SDK da AWS
 *
 * O app precisa de exatamente quatro operações — URL pré-assinada de `PUT`
 * (envio) e de `GET` (reprodução), `HEAD` e um `GET` de 16 bytes (conferência)
 * e `DELETE` (arquivo recusado). Todas são a mesma assinatura SigV4 por query
 * string, ~60 linhas com `node:crypto`. O SDK traria dezenas de pacotes para o
 * bundle do servidor por isso. A implementação é conferida contra o vetor de
 * teste publicado pela AWS (ver `docs/DEPLOY.md`, seção do bucket de vídeo).
 *
 * ## Configuração
 *
 * Os nomes são os da §4.4: `S3_ENDPOINT`, `S3_BUCKET`, `S3_ACCESS_KEY_ID`,
 * `S3_SECRET_ACCESS_KEY` (e `S3_REGION`, opcional — o R2 usa `auto`). Sem elas,
 * o upload de vídeo simplesmente não aparece como disponível no painel: o link
 * externo continua funcionando, e a tela diz quais variáveis faltam — **pelo
 * nome, nunca pelo valor**.
 *
 * O bucket é **privado**: nada é público, todo acesso é por URL assinada. O
 * CORS do bucket precisa liberar `PUT` vindo da origem do app (o navegador manda
 * o arquivo direto) — passo a passo em `docs/DEPLOY.md`.
 */
import { createHash, createHmac, randomUUID } from 'node:crypto';

import {
  PASTA_DE_VIDEOS,
  VALIDADE_DA_LEITURA_S,
  VALIDADE_DO_ENVIO_S,
  type FormatoDeVideo,
  type LinkAssinado,
} from './envio';

// ───────────────────────────── configuração ──────────────────────────────────

/** As variáveis obrigatórias, na ordem em que a tela as lista. */
export const VARIAVEIS_DO_BUCKET = [
  'S3_ENDPOINT',
  'S3_BUCKET',
  'S3_ACCESS_KEY_ID',
  'S3_SECRET_ACCESS_KEY',
] as const;

export type ConfiguracaoDoBucket = {
  /** Só esquema + host (+ porta): `https://<conta>.r2.cloudflarestorage.com`. */
  origem: string;
  bucket: string;
  regiao: string;
  chaveDeAcesso: string;
  segredo: string;
};

export type LeituraDaConfiguracao =
  | { ok: true; configuracao: ConfiguracaoDoBucket }
  | { ok: false; problema: string; faltando: string[] };

/** Nome de bucket S3: 3–63 caracteres, minúsculas, número, ponto e hífen. */
const NOME_DE_BUCKET = /^[a-z0-9][a-z0-9.-]{1,61}[a-z0-9]$/;

const REGIAO = /^[a-z0-9-]{2,32}$/;

function lerVariavel(nome: string): string {
  return process.env[nome]?.trim() ?? '';
}

/**
 * Lê e confere a configuração do bucket. Não guarda em memória: é barato, e
 * trocar a variável no Portainer + reiniciar é o fluxo esperado.
 *
 * ⚠️ As mensagens citam **o nome** da variável, nunca o valor.
 */
export function lerConfiguracaoDoBucket(): LeituraDaConfiguracao {
  const faltando = VARIAVEIS_DO_BUCKET.filter((nome) => lerVariavel(nome) === '');
  if (faltando.length > 0) {
    return {
      ok: false,
      faltando: [...faltando],
      problema: `Upload de vídeo desligado: falta configurar ${faltando.join(', ')}.`,
    };
  }

  let endpoint: URL;
  try {
    endpoint = new URL(lerVariavel('S3_ENDPOINT'));
  } catch {
    return { ok: false, faltando: [], problema: 'S3_ENDPOINT não é um endereço válido.' };
  }

  const local = endpoint.hostname === 'localhost' || endpoint.hostname === '127.0.0.1';
  if (endpoint.protocol !== 'https:' && !(endpoint.protocol === 'http:' && local)) {
    return {
      ok: false,
      faltando: [],
      problema: 'S3_ENDPOINT precisa começar com https:// (http:// só para um bucket local de teste).',
    };
  }
  if (
    endpoint.username !== '' ||
    endpoint.password !== '' ||
    endpoint.search !== '' ||
    endpoint.hash !== '' ||
    (endpoint.pathname !== '/' && endpoint.pathname !== '')
  ) {
    return {
      ok: false,
      faltando: [],
      problema:
        'S3_ENDPOINT deve ser só o endereço do serviço (ex.: https://<conta>.r2.cloudflarestorage.com), ' +
        'sem o nome do bucket, caminho ou parâmetros.',
    };
  }

  const bucket = lerVariavel('S3_BUCKET');
  if (!NOME_DE_BUCKET.test(bucket)) {
    return {
      ok: false,
      faltando: [],
      problema: 'S3_BUCKET não tem o formato de um nome de bucket (minúsculas, números, ponto e hífen).',
    };
  }

  const regiao = lerVariavel('S3_REGION') || 'auto';
  if (!REGIAO.test(regiao)) {
    return { ok: false, faltando: [], problema: 'S3_REGION tem um valor inválido. No R2, use "auto".' };
  }

  return {
    ok: true,
    configuracao: {
      origem: endpoint.origin,
      bucket,
      regiao,
      chaveDeAcesso: lerVariavel('S3_ACCESS_KEY_ID'),
      segredo: lerVariavel('S3_SECRET_ACCESS_KEY'),
    },
  };
}

/** O que a tela do painel pode saber do bucket — sem chave, sem segredo. */
export type EstadoDoEnvio =
  | { disponivel: true; destino: string }
  | { disponivel: false; problema: string; faltando: string[] };

export function estadoDoEnvioDeVideo(): EstadoDoEnvio {
  const leitura = lerConfiguracaoDoBucket();
  if (!leitura.ok) {
    return { disponivel: false, problema: leitura.problema, faltando: leitura.faltando };
  }
  const { origem, bucket } = leitura.configuracao;
  return { disponivel: true, destino: `${new URL(origem).host} · ${bucket}` };
}

// ──────────────────────────── assinatura SigV4 ───────────────────────────────

/** RFC 3986: o `encodeURIComponent` deixa passar `!'()*`, a AWS não. */
function codificar(texto: string): string {
  return encodeURIComponent(texto).replace(
    /[!'()*]/g,
    (caractere) => `%${caractere.charCodeAt(0).toString(16).toUpperCase()}`,
  );
}

function sha256Hex(texto: string): string {
  return createHash('sha256').update(texto, 'utf8').digest('hex');
}

function hmac(chave: string | Buffer, texto: string): Buffer {
  return createHmac('sha256', chave).update(texto, 'utf8').digest();
}

/** `2013-05-24T00:00:00.000Z` → `20130524T000000Z`. */
function dataAmz(agora: Date): string {
  return agora.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
}

export type PedidoDeAssinatura = {
  metodo: 'GET' | 'PUT' | 'HEAD' | 'DELETE';
  /** Esquema + host: `https://examplebucket.s3.amazonaws.com`. */
  origem: string;
  /** Caminho já no formato canônico, começando por `/`. */
  caminho: string;
  regiao: string;
  chaveDeAcesso: string;
  segredo: string;
  validadeS: number;
  /** Cabeçalhos que entram na assinatura além do `host` (o cliente **tem** que mandá-los iguais). */
  cabecalhos?: Readonly<Record<string, string>>;
  agora?: Date;
};

/**
 * URL pré-assinada, SigV4 por query string, payload `UNSIGNED-PAYLOAD`.
 *
 * Exportada para o teste contra o vetor da AWS; o resto do app usa as funções
 * de cima, que montam o caminho no estilo `/<bucket>/<chave>` (o R2 aceita).
 */
export function assinarUrl(pedido: PedidoDeAssinatura): string {
  const agora = pedido.agora ?? new Date();
  const amzData = dataAmz(agora);
  const dia = amzData.slice(0, 8);
  const escopo = `${dia}/${pedido.regiao}/s3/aws4_request`;
  const host = new URL(pedido.origem).host;

  const cabecalhos = new Map<string, string>([['host', host]]);
  for (const [nome, valor] of Object.entries(pedido.cabecalhos ?? {})) {
    cabecalhos.set(nome.toLowerCase(), valor.trim());
  }
  const nomesAssinados = [...cabecalhos.keys()].sort();
  const cabecalhosCanonicos = nomesAssinados.map((nome) => `${nome}:${cabecalhos.get(nome)}\n`).join('');
  const listaAssinada = nomesAssinados.join(';');

  const validade = Math.max(1, Math.min(Math.floor(pedido.validadeS), 604_800));
  const consulta = [
    ['X-Amz-Algorithm', 'AWS4-HMAC-SHA256'],
    ['X-Amz-Credential', `${pedido.chaveDeAcesso}/${escopo}`],
    ['X-Amz-Date', amzData],
    ['X-Amz-Expires', String(validade)],
    ['X-Amz-SignedHeaders', listaAssinada],
  ]
    .map(([nome, valor]) => [codificar(nome), codificar(valor)] as const)
    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
    .map(([nome, valor]) => `${nome}=${valor}`)
    .join('&');

  const pedidoCanonico = [
    pedido.metodo,
    pedido.caminho,
    consulta,
    cabecalhosCanonicos,
    listaAssinada,
    'UNSIGNED-PAYLOAD',
  ].join('\n');

  const textoParaAssinar = ['AWS4-HMAC-SHA256', amzData, escopo, sha256Hex(pedidoCanonico)].join('\n');

  const chaveDoDia = hmac(`AWS4${pedido.segredo}`, dia);
  const chaveDaRegiao = hmac(chaveDoDia, pedido.regiao);
  const chaveDoServico = hmac(chaveDaRegiao, 's3');
  const chaveDeAssinatura = hmac(chaveDoServico, 'aws4_request');
  const assinatura = createHmac('sha256', chaveDeAssinatura).update(textoParaAssinar, 'utf8').digest('hex');

  return `${pedido.origem}${pedido.caminho}?${consulta}&X-Amz-Signature=${assinatura}`;
}

/** `/<bucket>/<chave>`, cada segmento codificado uma vez (o S3 não recodifica). */
function caminhoDoObjeto(configuracao: ConfiguracaoDoBucket, chave: string): string {
  const segmentos = [configuracao.bucket, ...chave.split('/')].map(codificar);
  return `/${segmentos.join('/')}`;
}

function assinar(
  configuracao: ConfiguracaoDoBucket,
  metodo: PedidoDeAssinatura['metodo'],
  chave: string,
  validadeS: number,
  cabecalhos?: Record<string, string>,
): string {
  return assinarUrl({
    metodo,
    origem: configuracao.origem,
    caminho: caminhoDoObjeto(configuracao, chave),
    regiao: configuracao.regiao,
    chaveDeAcesso: configuracao.chaveDeAcesso,
    segredo: configuracao.segredo,
    validadeS,
    cabecalhos,
  });
}

// ───────────────────────────── as operações ──────────────────────────────────

/** Chave nova, gerada aqui: `videos/<uuid>.<ext>`. O nome do admin nunca vira caminho. */
export function novaChaveDeVideo(formato: FormatoDeVideo): string {
  return `${PASTA_DE_VIDEOS}/${randomUUID()}.${formato.ext}`;
}

/**
 * URL de envio. O `content-type` entra na assinatura: o navegador **tem** que
 * mandar exatamente esse tipo, e é com ele que o objeto fica gravado — e servido.
 */
export function urlDeEnvio(configuracao: ConfiguracaoDoBucket, chave: string, mime: string): string {
  return assinar(configuracao, 'PUT', chave, VALIDADE_DO_ENVIO_S, { 'content-type': mime });
}

/** Link de reprodução de 15 minutos (§4.3). */
export function linkDeLeitura(configuracao: ConfiguracaoDoBucket, chave: string): LinkAssinado {
  const agora = Date.now();
  return {
    src: assinar(configuracao, 'GET', chave, VALIDADE_DA_LEITURA_S),
    expiraEm: agora + VALIDADE_DA_LEITURA_S * 1000,
  };
}

const PRAZO_DA_CONFERENCIA_MS = 15_000;

export type ObjetoNoBucket =
  | { existe: false }
  | { existe: true; bytes: number; tipo: string; inicio: Uint8Array };

/**
 * O que está de fato no bucket: tamanho, tipo gravado e os 16 primeiros bytes.
 * É a conferência que vale — o navegador só **disse** o que ia mandar.
 */
export async function inspecionarObjeto(
  configuracao: ConfiguracaoDoBucket,
  chave: string,
): Promise<ObjetoNoBucket> {
  const cabeca = await fetch(assinar(configuracao, 'HEAD', chave, 60), {
    method: 'HEAD',
    cache: 'no-store',
    signal: AbortSignal.timeout(PRAZO_DA_CONFERENCIA_MS),
  });
  if (cabeca.status === 404) return { existe: false };
  if (!cabeca.ok) throw new Error(`o bucket respondeu ${cabeca.status} ao HEAD`);

  const bytes = Number(cabeca.headers.get('content-length') ?? NaN);
  const tipo = (cabeca.headers.get('content-type') ?? '').split(';')[0].trim().toLowerCase();

  const trecho = await fetch(assinar(configuracao, 'GET', chave, 60), {
    headers: { range: 'bytes=0-15' },
    cache: 'no-store',
    signal: AbortSignal.timeout(PRAZO_DA_CONFERENCIA_MS),
  });
  if (!trecho.ok) throw new Error(`o bucket respondeu ${trecho.status} ao ler o início do arquivo`);
  const inicio = new Uint8Array(await trecho.arrayBuffer()).slice(0, 16);

  return { existe: true, bytes, tipo, inicio };
}

/** Apaga um objeto recusado na conferência. Falhar aqui só deixa lixo — não quebra nada. */
export async function apagarObjeto(configuracao: ConfiguracaoDoBucket, chave: string): Promise<void> {
  try {
    const resposta = await fetch(assinar(configuracao, 'DELETE', chave, 60), {
      method: 'DELETE',
      cache: 'no-store',
      signal: AbortSignal.timeout(PRAZO_DA_CONFERENCIA_MS),
    });
    if (!resposta.ok && resposta.status !== 404) {
      console.error(`[video] o bucket respondeu ${resposta.status} ao apagar um envio recusado.`);
    }
  } catch (erro: unknown) {
    const motivo = erro instanceof Error ? erro.message : 'erro desconhecido';
    console.error(`[video] não consegui apagar um envio recusado: ${motivo}`);
  }
}
