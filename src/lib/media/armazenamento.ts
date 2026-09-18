/**
 * Armazenamento de mídia — a abstração que torna a troca barata (BACKOFFICE §4.3).
 *
 * ⚠️ MÓDULO DE SERVIDOR (`node:fs`). Nunca importe de um `'use client'`.
 *
 * ## A decisão (D6)
 *
 * Imagem vai para **volume Docker**. O deploy é VPS + Portainer: um volume
 * nomeado sobrevive a `docker compose down && up`, a troca de imagem e a
 * redeploy — o conselho "nunca use disco" vale para PaaS efêmera (Vercel, Fly),
 * não aqui. São ~150 imagens, 30–80 MB; uma conta de bucket e duas chaves a mais
 * não se pagam. **Vídeo nunca entra aqui** (banda da VPS e proteção do acervo):
 * §4.3 manda link externo agora e bucket depois.
 *
 * > ⚠️ Condição inegociável da §4.3: **o volume de uploads entra no backup no
 * > mesmo dia em que a primeira imagem subir.** Volume sem backup é disco com
 * > aparência de segurança. Em Portainer isso é um container efêmero montando o
 * > volume e escrevendo um `.tar.gz` junto do `pg_dump`.
 *
 * ## Por que uma interface, e não `fs.writeFile` espalhado
 *
 * O dia do bucket chega junto com o vídeo. Se o `fs` estiver espalhado por
 * actions e rotas, trocar vira arqueologia. Com {@link ArmazenamentoDeMidia},
 * o adapter novo é um arquivo, e nada mais muda: `MEDIA_STORAGE=s3` passa a
 * devolver outra implementação da mesma interface.
 *
 * ## Por que este arquivo lê `process.env` direto
 *
 * `src/lib/env.ts` é de outro agente e valida um conjunto fixo de variáveis. As
 * de mídia são validadas aqui, no mesmo espírito: nome da variável na mensagem,
 * nunca o valor.
 */
import { constants as constantesDeArquivo } from 'node:fs';
import { access, mkdir, readFile, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';

import { urlDoCaminho } from './tipos';

// ─────────────────────────────── a interface ─────────────────────────────────

/** O que fica sabido de um arquivo depois de salvo. */
export type ArquivoSalvo = {
  /** Caminho relativo no armazenamento — vai para `MediaAsset.path`. */
  path: string;
  /** URL servida ao navegador. */
  url: string;
  bytes: number;
  mime: string;
};

/**
 * A porta única de leitura e escrita de mídia.
 *
 * `urlAssinada` é opcional de propósito: só o adapter S3 terá. Quem precisar
 * dela um dia confere a existência (`if (armazenamento.urlAssinada)`) em vez de
 * assumir — no volume, URL assinada não existe e a imagem é pública mesmo.
 */
export interface ArmazenamentoDeMidia {
  /** `volume` | `s3` — aparece em log e na tela de configurações. */
  readonly nome: string;
  /**
   * Grava o arquivo. `nome` é **sempre** gerado pelo servidor
   * (`validacao.gerarNomeDeArquivo`), nunca o nome enviado pelo usuário.
   */
  salvar(conteudo: Uint8Array, nome: string, mime: string): Promise<ArquivoSalvo>;
  /** Lê o arquivo de um caminho **vindo do banco**, nunca da URL crua. */
  ler(caminho: string): Promise<Uint8Array>;
  remover(caminho: string): Promise<void>;
  urlPublica(caminho: string): string;
  urlAssinada?(caminho: string, ttlSegundos: number): Promise<string>;
}

/** Erro de configuração de mídia — some do log com o valor, fica só o nome. */
export class ConfiguracaoDeMidiaError extends Error {
  constructor(mensagem: string) {
    super(mensagem);
    this.name = 'ConfiguracaoDeMidiaError';
  }
}

/** Caminho que não pode ser resolvido dentro da raiz. Nunca vira 500 detalhado. */
export class CaminhoDeMidiaInvalidoError extends Error {
  constructor() {
    super('Caminho de mídia inválido.');
    this.name = 'CaminhoDeMidiaInvalidoError';
  }
}

/** Arquivo ausente no armazenamento (registro no banco sem arquivo no disco). */
export class ArquivoDeMidiaAusenteError extends Error {
  constructor() {
    super('Arquivo de mídia não encontrado no armazenamento.');
    this.name = 'ArquivoDeMidiaAusenteError';
  }
}

// ────────────────────────── caminho seguro no volume ─────────────────────────

/** Pasta das imagens dentro da raiz. Vídeo, quando existir, não mora aqui. */
export const PASTA_DE_IMAGENS = 'imagens';

/**
 * Segmento aceito num caminho de mídia: letra, número, hífen, sublinhado e
 * ponto — o formato do que **nós** geramos (`<uuid>.png`). Qualquer outra coisa
 * é recusada antes de chegar perto do disco.
 */
const SEGMENTO_VALIDO = /^[A-Za-z0-9][A-Za-z0-9._-]*$/;

/**
 * Confere um caminho relativo de mídia.
 *
 * ⚠️ Esta função é a rede de segurança, **não** a defesa principal. A defesa
 * principal é que `MediaAsset.path` só existe se este servidor o gerou, e a rota
 * pública resolve o caminho pedido **contra o banco**: uma URL com `..` não casa
 * com nenhuma linha e vira 404 antes de qualquer `fs`. Ainda assim, nada nesta
 * pasta toca o disco sem passar por aqui — defesa em profundidade é isso.
 */
export function caminhoRelativoValido(caminho: string): boolean {
  if (typeof caminho !== 'string' || caminho.length === 0 || caminho.length > 256) return false;
  if (caminho.includes('\\') || caminho.includes('\u{0000}')) return false;

  const segmentos = caminho.split('/');
  if (segmentos.length < 1 || segmentos.length > 4) return false;

  return segmentos.every((segmento) => SEGMENTO_VALIDO.test(segmento) && segmento !== '..');
}

// ────────────────────────── adapter: volume Docker ───────────────────────────

/**
 * Raiz do volume.
 *
 * Em produção, `MEDIA_ROOT=/app/var/uploads` (o ponto de montagem de
 * `iea_uploads` no compose). Em desenvolvimento não há container: o padrão é
 * `var/uploads/` na raiz do projeto — que **precisa** estar no `.gitignore`
 * (§4.4), porque arquivo de produção não entra em commit.
 */
function raizDoVolume(): string {
  const configurada = process.env.MEDIA_ROOT?.trim();
  if (configurada && configurada.length > 0) return path.resolve(configurada);
  return path.resolve(process.cwd(), 'var', 'uploads');
}

class ArmazenamentoEmVolume implements ArmazenamentoDeMidia {
  readonly nome = 'volume';

  private readonly raiz: string;

  constructor(raiz: string) {
    this.raiz = raiz;
  }

  /**
   * Caminho absoluto de um caminho relativo — e a conferência de que ele
   * continua **dentro** da raiz depois de resolvido.
   */
  private absoluto(caminho: string): string {
    if (!caminhoRelativoValido(caminho)) throw new CaminhoDeMidiaInvalidoError();

    const resolvido = path.resolve(this.raiz, caminho);
    const dentro =
      resolvido === this.raiz || resolvido.startsWith(this.raiz + path.sep);

    if (!dentro) throw new CaminhoDeMidiaInvalidoError();
    return resolvido;
  }

  async salvar(conteudo: Uint8Array, nome: string, mime: string): Promise<ArquivoSalvo> {
    const relativo = `${PASTA_DE_IMAGENS}/${nome}`;
    const destino = this.absoluto(relativo);

    await mkdir(path.dirname(destino), { recursive: true });

    // `wx` falha se o arquivo já existir. Com nome de UUID isso é praticamente
    // impossível — e é justamente por isso que uma colisão não pode passar em
    // silêncio sobrescrevendo a imagem de outra aula.
    await writeFile(destino, conteudo, { flag: 'wx' });

    return {
      path: relativo,
      url: this.urlPublica(relativo),
      bytes: conteudo.byteLength,
      mime,
    };
  }

  async ler(caminho: string): Promise<Uint8Array> {
    const origem = this.absoluto(caminho);
    try {
      return await readFile(origem);
    } catch (erro: unknown) {
      if (ehErroDeArquivoAusente(erro)) throw new ArquivoDeMidiaAusenteError();
      throw erro;
    }
  }

  async remover(caminho: string): Promise<void> {
    const alvo = this.absoluto(caminho);
    try {
      await unlink(alvo);
    } catch (erro: unknown) {
      // Já não existir é o resultado desejado.
      if (!ehErroDeArquivoAusente(erro)) throw erro;
    }
  }

  urlPublica(caminho: string): string {
    return urlDoCaminho(caminho);
  }

  /** A raiz configurada — para a tela de diagnóstico do painel. */
  get raizConfigurada(): string {
    return this.raiz;
  }

  /** A raiz existe e é gravável? Usado pelo diagnóstico, não pelo upload. */
  async gravavel(): Promise<boolean> {
    try {
      await mkdir(this.raiz, { recursive: true });
      await access(this.raiz, constantesDeArquivo.W_OK);
      return true;
    } catch {
      return false;
    }
  }
}

function ehErroDeArquivoAusente(erro: unknown): boolean {
  return (
    typeof erro === 'object' &&
    erro !== null &&
    'code' in erro &&
    (erro as { code?: unknown }).code === 'ENOENT'
  );
}

// ───────────────────────────── a fábrica ─────────────────────────────────────

let instancia: ArmazenamentoDeMidia | null = null;

/**
 * O adapter configurado. Memoizado no módulo: abrir o volume é barato, mas a
 * validação da configuração não precisa rodar a cada upload.
 *
 * `MEDIA_STORAGE=s3` **recusa** em vez de cair no volume em silêncio — o pior
 * resultado possível seria o app achar que está no bucket e estar gravando no
 * disco de um container efêmero.
 */
export function armazenamentoDeMidia(): ArmazenamentoDeMidia {
  if (instancia) return instancia;

  const modo = (process.env.MEDIA_STORAGE?.trim() || 'volume').toLowerCase();

  if (modo === 'volume') {
    instancia = new ArmazenamentoEmVolume(raizDoVolume());
    return instancia;
  }

  if (modo === 's3') {
    throw new ConfiguracaoDeMidiaError(
      'MEDIA_STORAGE=s3 ainda não tem adapter nesta versão. ' +
        'Use MEDIA_STORAGE=volume ou implemente o adapter S3 sobre a interface ' +
        'ArmazenamentoDeMidia (src/lib/media/armazenamento.ts).',
    );
  }

  throw new ConfiguracaoDeMidiaError(
    `MEDIA_STORAGE tem um valor não reconhecido. Use "volume" ou "s3".`,
  );
}

/**
 * Diagnóstico da configuração de mídia — o `checkConfig()` da §4.4, na versão
 * que não derruba o processo.
 *
 * A §4.4 pede que o app **recuse subir** com `MEDIA_STORAGE=s3` sem as quatro
 * variáveis do bucket. Enquanto o adapter S3 não existe, a recusa é a exceção de
 * {@link armazenamentoDeMidia} — e esta função é o que a tela do painel usa para
 * mostrar o estado em vez de estourar: diagnóstico não é lugar de `throw`.
 */
export async function diagnosticoDeMidia(): Promise<{
  ok: boolean;
  modo: string;
  raiz: string | null;
  problema: string | null;
}> {
  const modo = (process.env.MEDIA_STORAGE?.trim() || 'volume').toLowerCase();

  try {
    const armazenamento = armazenamentoDeMidia();

    if (armazenamento instanceof ArmazenamentoEmVolume) {
      const gravavel = await armazenamento.gravavel();
      return {
        ok: gravavel,
        modo: armazenamento.nome,
        raiz: armazenamento.raizConfigurada,
        problema: gravavel
          ? null
          : 'A pasta de uploads não existe ou não é gravável. Confira MEDIA_ROOT e a montagem do volume.',
      };
    }

    return { ok: true, modo: armazenamento.nome, raiz: null, problema: null };
  } catch (erro: unknown) {
    return {
      ok: false,
      modo,
      raiz: null,
      problema: erro instanceof Error ? erro.message : 'Configuração de mídia inválida.',
    };
  }
}
