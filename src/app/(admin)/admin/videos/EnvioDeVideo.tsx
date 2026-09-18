/**
 * Enviar o arquivo de vídeo — BACKOFFICE §4.3, D6.
 *
 * O arquivo **não passa pelo servidor do app**. O caminho é:
 *
 * 1. o navegador confere tamanho e formato e lê as medidas do vídeo (resolução,
 *    duração) para os avisos de "passou muito do alvo";
 * 2. pede à Server Action uma URL assinada de `PUT`;
 * 3. manda o arquivo **direto ao bucket**, com barra de progresso;
 * 4. avisa à Server Action, que confere o objeto no bucket e liga à aula.
 *
 * ⚠️ Sem transcodificação: o que sobe é o que o aluno baixa. Por isso a tela
 * mostra o quadro de especificações (`@/lib/media/especificacoes`, montado das
 * constantes de `@/lib/video/envio`) antes de qualquer coisa.
 *
 * Bucket não configurado = a tela diz quais variáveis faltam e não mostra botão
 * de enviar. Botão que não funciona é pior do que botão nenhum.
 */
'use client';

import { useEffect, useRef, useState } from 'react';

import { QuadroDeEspecificacoes } from '@/components/admin/QuadroDeEspecificacoes';
import { Button } from '@/components/ui/Button';
import { linhasDaEspecificacaoDeVideo } from '@/lib/media/especificacoes';
import type { EstadoDoEnvio } from '@/lib/video/bucket';
import {
  ACEITE_DE_VIDEO,
  avisosDoVideo,
  conferirArquivoDeVideo,
  descreverMedidas,
  type MedidasDoVideo,
} from '@/lib/video/envio';

import { concluirEnvioDeVideoAction, iniciarEnvioDeVideoAction } from './actions';
import type { DestinoDoEnvio } from './tipos';

/** Quanto esperar o navegador ler as medidas antes de seguir sem elas. */
const PRAZO_DA_LEITURA_MS = 10_000;

type Fase =
  | { tipo: 'vazio' }
  | { tipo: 'lendo' }
  | { tipo: 'pronto' }
  | { tipo: 'enviando'; progresso: number }
  | { tipo: 'confirmando' }
  | { tipo: 'concluido'; mensagem: string }
  | { tipo: 'erro'; mensagem: string };

type Escolhido = { arquivo: File; medidas: MedidasDoVideo | null; avisos: string[] };

/** Resolução e duração, lidas pelo próprio navegador. `null` se ele não abrir o arquivo. */
function lerMedidas(arquivo: File): Promise<MedidasDoVideo | null> {
  return new Promise((resolver) => {
    const endereco = URL.createObjectURL(arquivo);
    const video = document.createElement('video');
    let terminou = false;

    const terminar = (medidas: MedidasDoVideo | null) => {
      if (terminou) return;
      terminou = true;
      window.clearTimeout(relogio);
      video.removeAttribute('src');
      video.load();
      URL.revokeObjectURL(endereco);
      resolver(medidas);
    };

    const relogio = window.setTimeout(() => terminar(null), PRAZO_DA_LEITURA_MS);
    video.preload = 'metadata';
    video.muted = true;
    video.onloadedmetadata = () =>
      terminar({ largura: video.videoWidth, altura: video.videoHeight, duracaoS: video.duration });
    video.onerror = () => terminar(null);
    video.src = endereco;
  });
}

/** O `PUT` direto ao bucket. `XMLHttpRequest` porque o `fetch` não informa o progresso do envio. */
function enviarAoBucket(
  url: string,
  mime: string,
  arquivo: File,
  aoProgredir: (fracao: number) => void,
  guardar: (pedido: XMLHttpRequest | null) => void,
): Promise<{ ok: true } | { ok: false; cancelado: boolean; mensagem: string }> {
  return new Promise((resolver) => {
    const pedido = new XMLHttpRequest();
    guardar(pedido);
    pedido.open('PUT', url);
    // Tem de ser o mesmo tipo que entrou na assinatura — senão o bucket recusa.
    pedido.setRequestHeader('Content-Type', mime);
    pedido.upload.onprogress = (evento) => {
      if (evento.lengthComputable && evento.total > 0) aoProgredir(evento.loaded / evento.total);
    };
    pedido.onload = () => {
      guardar(null);
      if (pedido.status >= 200 && pedido.status < 300) {
        resolver({ ok: true });
        return;
      }
      resolver({
        ok: false,
        cancelado: false,
        mensagem:
          pedido.status === 403
            ? 'O armazenamento recusou o envio (403). A autorização pode ter vencido — escolha o arquivo e envie de novo.'
            : `O armazenamento recusou o envio (HTTP ${pedido.status}). Tente de novo.`,
      });
    };
    pedido.onerror = () => {
      guardar(null);
      resolver({
        ok: false,
        cancelado: false,
        mensagem:
          'Não consegui falar com o armazenamento. Se a conexão está boa e isto se repete, o bucket ' +
          'não está liberando envios a partir deste endereço (CORS) — veja docs/DEPLOY.md, seção de vídeos.',
      });
    };
    pedido.onabort = () => {
      guardar(null);
      resolver({ ok: false, cancelado: true, mensagem: 'Envio cancelado. Nada mudou.' });
    };
    pedido.send(arquivo);
  });
}

export function EnvioDeVideo({
  destino,
  estado,
  rotuloDoBotao = 'Enviar e usar este vídeo',
}: {
  destino: DestinoDoEnvio;
  /** De `estadoDoEnvioDeVideo()`, lido no servidor. */
  estado: EstadoDoEnvio;
  rotuloDoBotao?: string;
}) {
  const [fase, setFase] = useState<Fase>({ tipo: 'vazio' });
  const [escolhido, setEscolhido] = useState<Escolhido | null>(null);
  const [versaoDoCampo, setVersaoDoCampo] = useState(0);
  const pedidoAtual = useRef<XMLHttpRequest | null>(null);

  const ocupado = fase.tipo === 'lendo' || fase.tipo === 'enviando' || fase.tipo === 'confirmando';

  // Sair da página no meio do envio perde o que já subiu: o navegador pergunta antes.
  useEffect(() => {
    if (fase.tipo !== 'enviando' && fase.tipo !== 'confirmando') return;
    const segurar = (evento: BeforeUnloadEvent) => {
      evento.preventDefault();
    };
    window.addEventListener('beforeunload', segurar);
    return () => window.removeEventListener('beforeunload', segurar);
  }, [fase.tipo]);

  // O quadro aparece mesmo sem o armazenamento ligado: quem vai exportar o vídeo
  // precisa saber o formato antes de o servidor estar pronto para recebê-lo.
  const quadro = (
    <QuadroDeEspecificacoes
      titulo="Antes de enviar · arquivo de vídeo"
      linhas={linhasDaEspecificacaoDeVideo()}
    />
  );

  if (!estado.disponivel) {
    return (
      <div className="flex flex-col gap-3">
      {quadro}
      <div
        className="rounded-field border border-solid px-4 py-3"
        style={{ background: '#FDF2D6', borderColor: '#F2DC9B' }}
      >
        <p className="m-0 text-[14px] font-extrabold leading-snug" style={{ color: '#7A5B00' }}>
          O envio de arquivo ainda não está ligado neste servidor.
        </p>
        <p className="m-0 mt-1 text-[13px] font-semibold leading-snug" style={{ color: '#7A5B00' }}>
          {estado.problema}
          {estado.faltando.length > 0 ? (
            <>
              {' '}
              Falta configurar:{' '}
              {estado.faltando.map((nome, indice) => (
                <span key={nome}>
                  {indice > 0 ? ', ' : ''}
                  <code>{nome}</code>
                </span>
              ))}
              .
            </>
          ) : null}{' '}
          O passo a passo (Cloudflare R2 e CORS do bucket) está em <code>docs/DEPLOY.md</code>.
          Enquanto isso, use a opção de link.
        </p>
      </div>
      </div>
    );
  }

  async function aoEscolher(evento: React.ChangeEvent<HTMLInputElement>) {
    const arquivo = evento.target.files?.[0] ?? null;
    if (!arquivo) {
      setEscolhido(null);
      setFase({ tipo: 'vazio' });
      return;
    }

    const conferencia = conferirArquivoDeVideo({
      nome: arquivo.name,
      mime: arquivo.type,
      bytes: arquivo.size,
    });
    if (!conferencia.ok) {
      setEscolhido(null);
      setFase({ tipo: 'erro', mensagem: conferencia.erro });
      return;
    }

    setFase({ tipo: 'lendo' });
    const medidas = await lerMedidas(arquivo);
    setEscolhido({ arquivo, medidas, avisos: avisosDoVideo(arquivo.size, medidas) });
    setFase({ tipo: 'pronto' });
  }

  async function aoEnviar() {
    if (!escolhido || ocupado) return;
    const { arquivo, medidas } = escolhido;

    setFase({ tipo: 'enviando', progresso: 0 });

    let inicio;
    try {
      inicio = await iniciarEnvioDeVideoAction({
        nome: arquivo.name,
        mime: arquivo.type,
        bytes: arquivo.size,
      });
    } catch {
      setFase({ tipo: 'erro', mensagem: 'O servidor não respondeu. Tente de novo em instantes.' });
      return;
    }
    if (!inicio.ok) {
      setFase({ tipo: 'erro', mensagem: inicio.erro });
      return;
    }

    const envio = await enviarAoBucket(
      inicio.url,
      inicio.mime,
      arquivo,
      (fracao) => setFase({ tipo: 'enviando', progresso: fracao }),
      (pedido) => {
        pedidoAtual.current = pedido;
      },
    );
    if (!envio.ok) {
      setFase(
        envio.cancelado ? { tipo: 'pronto' } : { tipo: 'erro', mensagem: envio.mensagem },
      );
      return;
    }

    setFase({ tipo: 'confirmando' });
    try {
      const resposta = await concluirEnvioDeVideoAction({
        chave: inicio.chave,
        nome: arquivo.name,
        destino,
        largura: medidas && medidas.largura > 0 ? medidas.largura : null,
        altura: medidas && medidas.altura > 0 ? medidas.altura : null,
      });
      if (resposta.estado === 'ok') {
        setEscolhido(null);
        setVersaoDoCampo((versao) => versao + 1);
        setFase({ tipo: 'concluido', mensagem: resposta.mensagem });
      } else {
        setFase({
          tipo: 'erro',
          mensagem: resposta.estado === 'erro' ? resposta.mensagem : 'O envio não foi concluído.',
        });
      }
    } catch {
      setFase({
        tipo: 'erro',
        mensagem:
          'O arquivo subiu, mas o servidor não confirmou. Tente enviar de novo — a aula não mudou.',
      });
    }
  }

  const porcentagem = fase.tipo === 'enviando' ? Math.round(fase.progresso * 100) : 0;

  return (
    <div className="flex flex-col gap-3">
      {quadro}
      <p className="m-0 max-w-[62ch] text-[13px] font-semibold leading-snug text-muted">
        Destino: {estado.destino}.
      </p>

      <label className="flex flex-col gap-1.5">
        <span className="text-[13px] font-extrabold tracking-[0.04em] text-muted uppercase">
          Arquivo de vídeo
        </span>
        <input
          key={versaoDoCampo}
          type="file"
          accept={ACEITE_DE_VIDEO}
          onChange={aoEscolher}
          disabled={ocupado}
          className="block w-full max-w-[460px] text-[14px] font-semibold text-navy file:mr-3 file:h-10 file:cursor-pointer file:rounded-pill file:border-0 file:bg-[#EAF2FE] file:px-4 file:text-[14px] file:font-extrabold file:text-navy"
        />
      </label>

      {fase.tipo === 'lendo' ? (
        <p role="status" className="m-0 text-[13px] font-semibold text-muted">
          Lendo o arquivo…
        </p>
      ) : null}

      {escolhido ? (
        <div className="flex flex-col gap-2">
          <p className="m-0 text-[14px] font-bold leading-snug text-navy">
            {escolhido.arquivo.name}{' '}
            <span className="font-semibold text-muted">
              · {descreverMedidas(escolhido.arquivo.size, escolhido.medidas)}
            </span>
          </p>
          {escolhido.avisos.length > 0 ? (
            <ul
              className="m-0 flex list-none flex-col gap-1.5 rounded-field px-3 py-2"
              style={{ background: '#FDF2D6' }}
            >
              {escolhido.avisos.map((aviso) => (
                <li
                  key={aviso}
                  className="text-[13px] font-semibold leading-snug"
                  style={{ color: '#7A5B00' }}
                >
                  {aviso}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}

      {fase.tipo === 'enviando' ? (
        <div className="flex max-w-[460px] flex-col gap-1.5">
          <div
            role="progressbar"
            aria-label="Progresso do envio"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={porcentagem}
            className="h-2.5 w-full overflow-hidden rounded-pill bg-[#EAF0F7]"
          >
            <div className="h-full bg-teal transition-[width]" style={{ width: `${porcentagem}%` }} />
          </div>
          <p className="m-0 text-[13px] font-semibold text-muted">
            Enviando… {porcentagem}% — não feche esta página.
          </p>
        </div>
      ) : null}

      {fase.tipo === 'confirmando' ? (
        <p role="status" className="m-0 text-[13px] font-semibold text-muted">
          Arquivo enviado. Conferindo no armazenamento…
        </p>
      ) : null}

      {fase.tipo === 'erro' || fase.tipo === 'concluido' ? (
        <p
          role="status"
          className="m-0 rounded-field px-3 py-2 text-[14px] font-bold leading-snug"
          style={
            fase.tipo === 'erro'
              ? { background: '#FEF0F2', color: '#B21F31' }
              : { background: '#E4F5EA', color: '#136B45' }
          }
        >
          {fase.mensagem}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center gap-3">
        {fase.tipo === 'enviando' ? (
          <Button type="button" size="md" variant="ghost" onClick={() => pedidoAtual.current?.abort()}>
            Cancelar envio
          </Button>
        ) : (
          <Button
            type="button"
            size="md"
            variant="primary"
            onClick={aoEnviar}
            disabled={!escolhido || ocupado}
            loading={fase.tipo === 'confirmando'}
          >
            {rotuloDoBotao}
          </Button>
        )}
      </div>

      <p className="m-0 max-w-[62ch] text-[12px] font-semibold leading-snug text-muted">
        Trocar ou remover o vídeo depois não apaga o arquivo do armazenamento — ele fica guardado,
        como as imagens da biblioteca.
      </p>
    </div>
  );
}
