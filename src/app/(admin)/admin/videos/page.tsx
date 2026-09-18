/**
 * `/admin/videos` — o vídeo de cada aula, BACKOFFICE §2.6 e D6.
 *
 * Duas formas de pôr vídeo numa aula, à escolha do admin:
 *
 * - **link** com allowlist: YouTube, Vimeo, ou arquivo .mp4/.webm por https;
 * - **arquivo enviado** para o bucket S3-compatível (Cloudflare R2), direto do
 *   navegador, por URL assinada (§4.3). Nunca para o volume Docker (D6).
 *
 * Sem o bucket configurado, a opção de arquivo diz o que falta em vez de
 * oferecer um botão que não faz nada.
 *
 * A defesa em profundidade desta tela:
 *
 * 1. `proxy.ts` barra quem não tem cookie de admin;
 * 2. o layout de `(admin)` confere o papel e devolve 404 para quem não é;
 * 3. cada Server Action recomeça pelo `requireAdmin()` — o layout não roda
 *    antes de um POST.
 *
 * E o que entra aqui passa por `parseVideoSource` no servidor **e** pelo
 * `frame-src` no navegador (`@/lib/video/csp`).
 */
import type { Metadata } from 'next';
import Link from 'next/link';

import {
  DURACAO_ALVO_DO_VIDEO,
  FORMATOS_DE_VIDEO_EM_TEXTO,
  LARGURA_ALVO_DO_VIDEO,
  PROPORCAO_DO_VIDEO,
} from '@/lib/media/especificacoes';
import { formatarBytes } from '@/lib/media/tipos';
import {
  arquivosEnviados,
  listarVideosDasAulas,
  lerVideoPadrao,
  type ArquivoEnviado,
  type EstadoDaAula,
  type LinhaDeVideo,
} from '@/lib/video/aula';
import { estadoDoEnvioDeVideo, type EstadoDoEnvio } from '@/lib/video/bucket';
import { ALVO_DO_VIDEO, TAMANHO_MAXIMO_VIDEO } from '@/lib/video/envio';
import { descreverFonte, HOSTS_ACEITOS, linkPublico, type VideoSource } from '@/lib/video/fonte';

import { EditorDeVideo } from './EditorDeVideo';
import { PadraoDeVideo } from './PadraoDeVideo';

export const metadata: Metadata = { title: 'Vídeos' };
export const dynamic = 'force-dynamic';

type Busca = { [chave: string]: string | string[] | undefined };

/** Os três estados de vídeo da §2.3, mais "todas". */
type Filtro = 'todas' | 'sem' | 'padrao' | 'configurado';

const FILTROS: readonly { valor: Filtro; rotulo: string }[] = [
  { valor: 'todas', rotulo: 'Todas' },
  { valor: 'sem', rotulo: 'Sem vídeo' },
  { valor: 'padrao', rotulo: 'Com o padrão' },
  { valor: 'configurado', rotulo: 'Configuradas' },
];

function primeiro(valor: string | string[] | undefined): string {
  if (Array.isArray(valor)) return valor[0] ?? '';
  return valor ?? '';
}

function ehFiltro(valor: string): valor is Filtro {
  return FILTROS.some((filtro) => filtro.valor === valor);
}

function estadoDoVideo(aula: LinhaDeVideo): Filtro {
  if (!aula.fonte) return 'sem';
  return aula.padrao ? 'padrao' : 'configurado';
}

const DATA = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' });

/** "YouTube · dQw4w9WgXcQ", ou o nome e o tamanho do arquivo enviado. */
function descreverVideo(fonte: VideoSource, arquivo: ArquivoEnviado | null): string {
  if (fonte.kind !== 'upload') return descreverFonte(fonte);
  return arquivo
    ? `Arquivo enviado · ${arquivo.nome} (${formatarBytes(arquivo.bytes)})`
    : 'Arquivo enviado · registro não encontrado';
}

/** O arquivo do vídeo padrão, quando ele é upload. Sem banco, segue sem o nome. */
async function arquivoDoPadrao(padrao: VideoSource | null): Promise<ArquivoEnviado | null> {
  if (padrao?.kind !== 'upload') return null;
  try {
    return (await arquivosEnviados([padrao.assetId])).get(padrao.assetId) ?? null;
  } catch (erro) {
    console.error('[painel] videos: não consegui ler o arquivo do vídeo padrão.', erro);
    return null;
  }
}

export default async function PaginaDeVideos({ searchParams }: { searchParams: Promise<Busca> }) {
  const busca = await searchParams;
  const bruto = primeiro(busca.filtro);
  const filtro: Filtro = ehFiltro(bruto) ? bruto : 'todas';

  const [aulas, padrao] = await Promise.all([listarVideosDasAulas(), lerVideoPadrao()]);
  const arquivoPadrao = await arquivoDoPadrao(padrao);
  const envio = estadoDoEnvioDeVideo();

  return (
    <div className="flex flex-col gap-5">
      <header>
        <p className="kicker m-0">Conteúdo</p>
        <h1 className="m-0 mt-1 text-[26px] font-black leading-tight tracking-[-0.02em] text-navy">
          Vídeos
        </h1>
        <p className="m-0 mt-1.5 max-w-[62ch] text-[14px] font-semibold leading-snug text-muted">
          A videoaula de cada uma das 42 aulas: cole um link (YouTube, Vimeo) ou envie o arquivo
          para o armazenamento do app. Quem assiste é o aluno do Plano Completo para cima; no
          Essencial a aula mostra a chamada de upgrade no lugar do player.
        </p>
      </header>

      {aulas === null ? (
        <Degradado />
      ) : (
        <>
          <section className="rounded-card bg-surface p-5 shadow-card lg:p-6">
            <h2 className="m-0 mb-1 text-[17px] font-black tracking-[-0.01em] text-navy">
              Vídeo padrão
            </h2>
            <p className="m-0 mb-4 max-w-[62ch] text-[13px] font-semibold leading-snug text-muted">
              Um vídeo só, para as aulas que ainda não têm o seu — uma apresentação do curso, por
              exemplo.
            </p>
            <PadraoDeVideo
              padrao={padrao}
              descricao={padrao ? descreverVideo(padrao, arquivoPadrao) : null}
              semVideo={aulas.filter((aula) => estadoDoVideo(aula) === 'sem').length}
              envio={envio}
            />
          </section>

          <section className="rounded-card bg-surface p-5 shadow-card lg:p-6">
            <Contagens aulas={aulas} filtro={filtro} />
            <ListaDeAulas aulas={aulas} filtro={filtro} envio={envio} />
          </section>

          <ComoFunciona envio={envio} />
        </>
      )}
    </div>
  );
}

function Contagens({ aulas, filtro }: { aulas: readonly LinhaDeVideo[]; filtro: Filtro }) {
  const total = aulas.length;
  const quantidade = (alvo: Filtro) =>
    alvo === 'todas' ? total : aulas.filter((aula) => estadoDoVideo(aula) === alvo).length;

  return (
    <div className="mb-4 flex flex-wrap items-center gap-2">
      <h2 className="m-0 mr-2 text-[17px] font-black tracking-[-0.01em] text-navy">
        {total} aula(s)
      </h2>
      {FILTROS.map((opcao) => {
        const ativo = opcao.valor === filtro;
        return (
          <Link
            key={opcao.valor}
            href={opcao.valor === 'todas' ? '/admin/videos' : `/admin/videos?filtro=${opcao.valor}`}
            aria-current={ativo ? 'page' : undefined}
            className={
              ativo
                ? 'grid h-11 place-items-center rounded-pill bg-navy px-4 text-[14px] font-extrabold text-white'
                : 'grid h-11 place-items-center rounded-pill border border-border px-4 text-[14px] font-extrabold text-navy hover:bg-[#EAF2FE]'
            }
          >
            {opcao.rotulo} ({quantidade(opcao.valor)})
          </Link>
        );
      })}
    </div>
  );
}

function ListaDeAulas({
  aulas,
  filtro,
  envio,
}: {
  aulas: readonly LinhaDeVideo[];
  filtro: Filtro;
  envio: EstadoDoEnvio;
}) {
  const visiveis = filtro === 'todas' ? aulas : aulas.filter((aula) => estadoDoVideo(aula) === filtro);

  if (visiveis.length === 0) {
    return (
      <p className="m-0 text-[14px] font-semibold leading-snug text-muted">
        Nenhuma aula neste estado.
      </p>
    );
  }

  return (
    <ul className="m-0 flex list-none flex-col gap-3 p-0">
      {visiveis.map((aula) => (
        <li key={aula.id}>
          <details className="rounded-card border border-border bg-bg">
            <summary className="flex cursor-pointer flex-wrap items-center gap-x-3 gap-y-1 rounded-card px-4 py-3.5">
              <span className="text-[13px] font-extrabold tracking-[0.04em] text-muted uppercase">
                {aula.code}
              </span>
              <span className="text-[15px] font-extrabold text-navy">{aula.title}</span>
              <Selo aula={aula} />
              {aula.estado !== 'publicada' ? <SeloDeAula estado={aula.estado} /> : null}
              <span className="ml-auto text-[13px] font-semibold text-muted">
                {aula.fonte ? descreverVideo(aula.fonte, aula.arquivo) : 'sem vídeo'}
              </span>
            </summary>

            <div className="flex flex-col gap-4 border-t border-border px-4 py-4">
              <p className="m-0 text-[13px] font-semibold leading-snug text-muted">
                {aula.atualizadoEm
                  ? `Último ajuste de vídeo em ${DATA.format(aula.atualizadoEm)}.`
                  : 'Nunca teve vídeo configurado por aqui.'}
                {aula.fonte && linkPublico(aula.fonte) ? (
                  <>
                    {' '}
                    <a
                      href={linkPublico(aula.fonte) ?? undefined}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-extrabold text-link underline"
                    >
                      Abrir na origem
                    </a>
                  </>
                ) : null}
              </p>

              <EditorDeVideo
                aula={{
                  id: aula.id,
                  code: aula.code,
                  title: aula.title,
                  fonte: aula.fonte,
                  refBruta: aula.refBruta,
                  invalida: aula.invalida,
                  padrao: aula.padrao,
                  legada: aula.legada,
                }}
                envio={envio}
              />
            </div>
          </details>
        </li>
      ))}
    </ul>
  );
}

function Selo({ aula }: { aula: LinhaDeVideo }) {
  const estado = estadoDoVideo(aula);
  if (aula.invalida) {
    return <Etiqueta texto="link inválido" fundo="#FEF0F2" cor="#B21F31" />;
  }
  if (estado === 'sem') return <Etiqueta texto="sem vídeo" fundo="#EAF0F7" cor="#5B6B7F" />;
  if (estado === 'padrao') return <Etiqueta texto="padrão" fundo="#FDF2D6" cor="#7A5B00" />;
  return <Etiqueta texto="configurado" fundo="#E4F5EA" cor="#136B45" />;
}

function SeloDeAula({ estado }: { estado: EstadoDaAula }) {
  return (
    <Etiqueta
      texto={estado === 'arquivada' ? 'aula arquivada' : 'aula em rascunho'}
      fundo="#EAF0F7"
      cor="#3C4A5C"
    />
  );
}

function Etiqueta({ texto, fundo, cor }: { texto: string; fundo: string; cor: string }) {
  return (
    <span
      className="rounded-pill px-2.5 py-1 text-[12px] font-extrabold tracking-[0.02em] uppercase"
      style={{ background: fundo, color: cor }}
    >
      {texto}
    </span>
  );
}

/** O que a tela precisa dizer em voz alta para ninguém tentar o que não existe. */
function ComoFunciona({ envio }: { envio: EstadoDoEnvio }) {
  return (
    <section className="rounded-card bg-surface p-5 shadow-card lg:p-6">
      <h2 className="m-0 mb-2 text-[17px] font-black tracking-[-0.01em] text-navy">
        O que entra aqui
      </h2>
      <ul className="m-0 flex list-none flex-col gap-2 p-0 text-[14px] font-semibold leading-snug text-muted">
        <li>
          <strong className="text-navy">Link ou arquivo — a última gravada vale.</strong> O link
          aponta para um vídeo que mora em outro lugar. O arquivo enviado vai direto do seu navegador
          para o armazenamento do app (bucket S3/R2), nunca para o servidor, e o aluno assiste por um
          endereço assinado que vence em 15 minutos e é renovado pelo player.{' '}
          {envio.disponivel
            ? `Armazenamento em uso: ${envio.destino}.`
            : 'O armazenamento ainda não está configurado neste servidor — por enquanto, só link.'}
        </li>
        <li>
          <strong className="text-navy">Arquivo: sem conversão.</strong> {FORMATOS_DE_VIDEO_EM_TEXTO}{' '}
          (MP4 com H.264 + AAC é o mais seguro), até {formatarBytes(TAMANHO_MAXIMO_VIDEO)}, em{' '}
          {PROPORCAO_DO_VIDEO}. O que sobe é o que o aluno baixa — exporte em{' '}
          {LARGURA_ALVO_DO_VIDEO}×{ALVO_DO_VIDEO.altura} a ~{ALVO_DO_VIDEO.mbps} Mbps (
          {ALVO_DO_VIDEO.mbMinimo}–{ALVO_DO_VIDEO.mbMaximo} MB para {DURACAO_ALVO_DO_VIDEO.minimo}–
          {DURACAO_ALVO_DO_VIDEO.maximo} min de aula). Trocar ou remover o vídeo não apaga o arquivo
          guardado.
        </li>
        <li>
          <strong className="text-navy">Links aceitos:</strong> {HOSTS_ACEITOS.join(', ')}, ou um
          arquivo .mp4/.webm servido por https. Qualquer outro endereço é recusado no servidor e
          bloqueado pelo navegador. Acrescentar uma origem de player nova exige mudança no código e
          um novo deploy — a lista vale nos dois lugares.
        </li>
        <li>
          <strong className="text-navy">Vídeo público é público.</strong> Um vídeo do YouTube sem
          restrição pode ser encontrado fora do app. Use &ldquo;não listado&rdquo; para o conteúdo do
          curso.
        </li>
        <li>
          <strong className="text-navy">Aula sem vídeo não mostra nada.</strong> A tela do aluno
          simplesmente não traz o painel — não fica um quadro vazio no lugar.
        </li>
      </ul>
    </section>
  );
}

function Degradado() {
  return (
    <div
      className="rounded-card border border-solid p-5"
      style={{ background: '#FEF0F2', borderColor: '#F9D3D9' }}
    >
      <p className="m-0 text-[15px] font-extrabold leading-snug" style={{ color: '#B21F31' }}>
        A lista de vídeos não pôde ser carregada.
      </p>
      <p className="m-0 mt-1.5 text-[14px] font-semibold leading-snug" style={{ color: '#B21F31' }}>
        O banco de dados não respondeu. Nada foi alterado; recarregue a página em alguns instantes.
        O detalhe técnico está no log do servidor.
      </p>
    </div>
  );
}
