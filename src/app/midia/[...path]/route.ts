/**
 * `GET /midia/[...path]` — serve um arquivo da biblioteca (BACKOFFICE §4.3).
 *
 * ## ⚠️ O caminho da URL não é um caminho de arquivo
 *
 * Esta é a regra que faz a rota existir em vez de a pasta ser servida
 * estaticamente: **o caminho pedido é resolvido contra o banco**, nunca
 * concatenado com a raiz do volume. O que chega na URL vira chave de busca em
 * `MediaAsset.path` (coluna única); o que vai para o disco é o `path` que **veio
 * do registro**. Uma URL com `../../.env` simplesmente não casa com linha
 * nenhuma e termina em 404 antes de qualquer `fs`. Travessia de diretório aqui
 * seria leitura de arquivo arbitrário do servidor — `.env`, chave, dump.
 *
 * O adapter ainda confere o formato do caminho e se o resolvido continua dentro
 * da raiz (`src/lib/media/armazenamento.ts`). Duas barreiras para a mesma coisa,
 * de propósito.
 *
 * ## Cabeçalhos, e por quê
 *
 * - `Content-Type` **do registro** (lido dos bytes no upload), nunca adivinhado
 *   pela extensão da URL.
 * - `X-Content-Type-Options: nosniff` — impede o navegador de reinterpretar o
 *   conteúdo e "descobrir" que aquilo é HTML.
 * - `Content-Disposition: inline`, **sem `filename`**: o nome exibido é texto do
 *   usuário e não tem por que entrar num cabeçalho.
 * - `Cache-Control: public, max-age=31536000, immutable` — o nome é um UUID e o
 *   conteúdo de um caminho nunca muda; arquivo novo é caminho novo.
 *
 * ## Por que é público
 *
 * O `matcher` do `src/proxy.ts` ignora caminhos cujo último segmento tem ponto,
 * e todo caminho daqui termina em `.png`/`.jpg`/`.webp`. Isso é coerente com o
 * `immutable`: ilustração de aula não é o produto do plano pago — vídeo é, e
 * vídeo não mora nesta rota (§4.3). Imagem arquivada, porém, sai de circulação:
 * responde 404.
 */
import { armazenamentoDeMidia } from '@/lib/media/armazenamento';
import { prisma } from '@/lib/db';

/** `node:fs` no adapter: runtime Node, não Edge. */
export const runtime = 'nodejs';

/** A resposta depende do banco a cada pedido; o cache está no cabeçalho. */
export const dynamic = 'force-dynamic';

const NAO_ENCONTRADO = 'Arquivo não encontrado.';

function naoEncontrado(): Response {
  return new Response(NAO_ENCONTRADO, {
    status: 404,
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'cache-control': 'no-store',
      'x-content-type-options': 'nosniff',
    },
  });
}

export async function GET(
  requisicao: Request,
  contexto: { params: Promise<{ path: string[] }> },
): Promise<Response> {
  // ⚠️ Next 16: `params` chega como Promise.
  const { path: segmentos } = await contexto.params;

  if (!Array.isArray(segmentos) || segmentos.length === 0) return naoEncontrado();

  // O caminho pedido só serve como chave de busca. Nada dele encosta no disco.
  const caminhoPedido = segmentos.join('/');
  if (caminhoPedido.length > 256) return naoEncontrado();

  type AssetServido = {
    id: string;
    path: string;
    mime: string;
    bytes: number;
    archivedAt: Date | null;
  };

  let asset: AssetServido | null = null;

  try {
    const encontrado = await prisma.mediaAsset.findUnique({
      where: { path: caminhoPedido },
      select: { id: true, kind: true, path: true, mime: true, bytes: true, archivedAt: true },
    });

    // Arquivada = fora de circulação. O guarda de arquivamento garante que ela
    // não estava em uso quando saiu. Vídeo não é servido por aqui: mora no
    // bucket e toca por link assinado de 15 minutos (`@/lib/video/bucket`).
    asset =
      encontrado && encontrado.kind === 'IMAGE' && encontrado.archivedAt === null
        ? encontrado
        : null;
  } catch (erro: unknown) {
    const motivo = erro instanceof Error ? erro.message : 'erro desconhecido';
    console.error(`[midia] banco indisponível ao resolver um caminho: ${motivo}`);
    return new Response('Serviço indisponível.', {
      status: 503,
      headers: { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'no-store' },
    });
  }

  if (!asset) return naoEncontrado();

  // O conteúdo de um caminho nunca muda, então id + tamanho já identificam a
  // versão. Um `If-None-Match` responde 304 sem ler o disco.
  const etag = `"${asset.id}-${asset.bytes}"`;
  if (requisicao.headers.get('if-none-match') === etag) {
    return new Response(null, {
      status: 304,
      headers: { etag, 'cache-control': 'public, max-age=31536000, immutable' },
    });
  }

  try {
    // Repare: `asset.path` (do banco), não `caminhoPedido` (da URL).
    const conteudo = await armazenamentoDeMidia().ler(asset.path);

    return new Response(new Uint8Array(conteudo), {
      status: 200,
      headers: {
        'content-type': asset.mime,
        'content-length': String(conteudo.byteLength),
        'content-disposition': 'inline',
        'cache-control': 'public, max-age=31536000, immutable',
        'x-content-type-options': 'nosniff',
        etag,
      },
    });
  } catch (erro: unknown) {
    // Registro sem arquivo no volume (volume não montado, backup restaurado pela
    // metade). O log diz qual asset, nunca o caminho absoluto do servidor.
    const motivo = erro instanceof Error ? erro.name : 'erro desconhecido';
    console.error(`[midia] arquivo ausente ou ilegível: asset=${asset.id}: ${motivo}`);
    return naoEncontrado();
  }
}
