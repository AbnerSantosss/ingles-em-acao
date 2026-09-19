'use client';

/**
 * O `<video>` de um arquivo enviado ao bucket — BACKOFFICE §4.3.
 *
 * O endereço do arquivo é um link assinado que vale 15 minutos. Este componente
 * é o "renovado pelo player" da §4.3:
 *
 * - **sem link inicial** (pré-visualização do painel, logo depois do envio),
 *   pede um ao montar;
 * - **o link venceu** (o navegador recebe 403 e dispara `error`): pede outro e
 *   volta ao ponto em que o aluno estava, tocando se estava tocando;
 * - **o link está para vencer** quando o aluno aperta play: troca antes, para
 *   não travar no meio de um trecho.
 *
 * Um teto de tentativas seguidas impede o laço "renova → erro → renova" quando
 * o problema é o arquivo, não o link.
 */
import { useEffect, useRef, useState } from 'react';

import type { LinkAssinado } from '@/lib/video/envio';

/** Antecedência com que o play troca um link que está para vencer. */
const MARGEM_DE_VENCIMENTO_MS = 90_000;

/** Renovações seguidas sem o vídeo voltar a tocar antes de desistir. */
const MAXIMO_DE_TENTATIVAS = 3;

/** Depois de tocar este tempo sem erro, a contagem de tentativas zera. */
const TEMPO_PARA_ZERAR_MS = 60_000;

export type PropsDoVideoAssinado = {
  /** Link assinado no servidor junto com a página; `null`/ausente = pedir ao montar. */
  inicial?: LinkAssinado | null;
  /** Pede um link novo. `null` = sem direito, sem bucket ou vídeo removido. */
  renovar: () => Promise<LinkAssinado | null>;
  /** Nome acessível do player. */
  titulo: string;
};

type Retomada = { tempo: number; tocando: boolean };

export function VideoAssinado({ inicial, renovar, titulo }: PropsDoVideoAssinado) {
  const [link, setLink] = useState<LinkAssinado | null>(inicial ?? null);
  const [falhou, setFalhou] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const retomada = useRef<Retomada | null>(null);
  const tentativas = useRef(0);
  const ultimaRenovacao = useRef(0);
  const renovando = useRef(false);

  // Sem link inicial: pede um. O `setState` fica no `then`, não no corpo do efeito.
  useEffect(() => {
    if (link || falhou) return;
    renovar()
      .then((novo) => (novo ? setLink(novo) : setFalhou(true)))
      .catch(() => setFalhou(true));
  }, [link, falhou, renovar]);

  async function trocarLink() {
    if (renovando.current) return;
    if (tentativas.current >= MAXIMO_DE_TENTATIVAS) {
      setFalhou(true);
      return;
    }

    renovando.current = true;
    tentativas.current += 1;
    ultimaRenovacao.current = Date.now();

    const video = videoRef.current;
    if (video) {
      retomada.current = {
        tempo: video.currentTime,
        tocando: retomada.current?.tocando ?? !video.paused,
      };
    }

    try {
      const novo = await renovar();
      if (novo) setLink(novo);
      else setFalhou(true);
    } catch {
      setFalhou(true);
    } finally {
      renovando.current = false;
    }
  }

  function aoDarPlay() {
    if (!link) return;
    if (link.expiraEm - Date.now() > MARGEM_DE_VENCIMENTO_MS) return;
    retomada.current = { tempo: videoRef.current?.currentTime ?? 0, tocando: true };
    videoRef.current?.pause();
    void trocarLink();
  }

  function aoCarregar() {
    const video = videoRef.current;
    const ponto = retomada.current;
    if (!video || !ponto) return;
    retomada.current = null;

    if (ponto.tempo > 0 && Number.isFinite(video.duration)) {
      video.currentTime = Math.min(ponto.tempo, video.duration);
    }
    if (ponto.tocando) {
      // Autoplay com som pode ser recusado; aí o aluno aperta play de novo.
      video.play().catch(() => undefined);
    }
  }

  function aoTocar() {
    if (Date.now() - ultimaRenovacao.current > TEMPO_PARA_ZERAR_MS) tentativas.current = 0;
  }

  if (falhou) {
    return (
      <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
        <p className="max-w-sm text-[14px] leading-relaxed text-white/80">
          Não conseguimos carregar a videoaula agora. Recarregue a página para tentar de novo. A
          leitura e os exercícios da aula continuam aqui embaixo.
        </p>
      </div>
    );
  }

  if (!link) {
    return (
      <div
        className="absolute inset-0 flex items-center justify-center text-[13px] font-semibold text-white/60"
        role="status"
      >
        Carregando a videoaula…
      </div>
    );
  }

  return (
    <video
      ref={videoRef}
      src={link.src}
      title={titulo}
      aria-label={titulo}
      controls
      preload="metadata"
      playsInline
      controlsList="nodownload"
      className="absolute inset-0 h-full w-full"
      onPlay={aoDarPlay}
      onPlaying={aoTocar}
      onLoadedMetadata={aoCarregar}
      onError={() => void trocarLink()}
    >
      Seu navegador não consegue tocar este vídeo.
    </video>
  );
}
