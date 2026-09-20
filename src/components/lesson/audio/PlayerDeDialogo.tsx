'use client';

/**
 * Player de um bloco inteiro (pacote 08 do plano v2): o diálogo completo, com
 * as duas vozes (prompt-mestre de áudios, seção 15), ou o "Ouvir todos" de uma
 * lista (seção 20). É um arquivo só, tocado do começo ao fim.
 *
 * Tocando, o botão principal vira "Pausar"; depois de pausar, vira "Continuar"
 * e o áudio volta de onde parou, com a barra de progresso parada no ponto.
 *
 * NÃO destaca a fala que está tocando. O clipe é um MP3 único, sem o tempo de
 * cada fala, e adivinhar o ponto de troca erraria na frente do aluno. Se um dia
 * o pipeline gravar os tempos, o destaque entra aqui.
 */
import { useState } from 'react';

import type { AudioClip } from '@/lib/content/types';
import { cn } from '@/lib/ui/cn';

import {
  ERRO_AO_TOCAR,
  ROTULO_CONTINUAR,
  ROTULO_DEVAGAR,
  ROTULO_PAUSAR,
  ROTULO_PROGRESSO,
  formatarTempo,
  textoDoProgresso,
} from './rotulos';
import { TAXA_DEVAGAR, TAXA_NORMAL, continuar, mudarTaxa, pausar, tocar } from './tocador';
import { useEstadoDoTocador } from './useEstadoDoTocador';

function IconeTocar() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M8 5.5v13l11-6.5-11-6.5Z" fill="currentColor" />
    </svg>
  );
}

function IconePausar() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <rect x="7.2" y="5.5" width="3.8" height="13" rx="1.6" fill="currentColor" />
      <rect x="13" y="5.5" width="3.8" height="13" rx="1.6" fill="currentColor" />
    </svg>
  );
}

export function PlayerDeDialogo({
  clip,
  rotulo,
}: {
  clip: AudioClip;
  /** Texto do botão parado: "Ouvir o diálogo" ou "Ouvir todos". */
  rotulo: string;
}) {
  const agora = useEstadoDoTocador();
  const [devagar, setDevagar] = useState(false);

  const meu = agora.src === clip.src;
  const estado = meu ? agora.estado : 'parado';
  const ativo = estado === 'tocando' || estado === 'carregando';
  const duracao = meu ? agora.duracao : 0;
  const posicao = meu ? agora.posicao : 0;
  const pct = duracao > 0 ? Math.min(100, Math.round((posicao / duracao) * 100)) : 0;
  const pausado = estado === 'pausado';
  const textoDoBotao = ativo ? ROTULO_PAUSAR : pausado ? ROTULO_CONTINUAR : rotulo;

  function principal() {
    if (ativo) {
      pausar();
      return;
    }
    if (pausado) {
      continuar();
      return;
    }
    tocar(clip.src, { taxa: devagar ? TAXA_DEVAGAR : TAXA_NORMAL });
  }

  function alternarDevagar() {
    const novo = !devagar;
    setDevagar(novo);
    if (meu) mudarTaxa(novo ? TAXA_DEVAGAR : TAXA_NORMAL);
  }

  return (
    <div className="flex flex-col gap-2.5 rounded-[16px] border border-solid border-border bg-surface px-3.5 py-3">
      <div className="flex flex-wrap items-center gap-2.5">
        <button
          type="button"
          onClick={principal}
          className="inline-flex h-11 flex-none cursor-pointer items-center gap-2.5 rounded-pill bg-navy px-5 text-[15px] font-extrabold text-white shadow-[0_2px_6px_rgba(11,31,75,0.14)] transition-colors duration-150 hover:bg-navy-light"
        >
          {ativo ? <IconePausar /> : <IconeTocar />}
          {textoDoBotao}
        </button>
        {clip.lento ? (
          <button
            type="button"
            onClick={alternarDevagar}
            aria-pressed={devagar}
            className={cn(
              'inline-flex h-11 flex-none cursor-pointer items-center rounded-pill border-[1.5px] border-solid px-4 text-[14px] font-extrabold transition-colors duration-150',
              devagar
                ? 'border-navy bg-navy text-white hover:border-navy-light hover:bg-navy-light'
                : 'border-border-2 bg-surface text-navy hover:border-navy hover:bg-[#EEF3FA]',
            )}
          >
            {ROTULO_DEVAGAR}
          </button>
        ) : null}
        {duracao > 0 ? (
          <span aria-hidden="true" className="ml-auto text-[13px] font-bold tabular-nums text-muted">
            {formatarTempo(posicao)} / {formatarTempo(duracao)}
          </span>
        ) : null}
      </div>
      <div
        role="progressbar"
        aria-label={ROTULO_PROGRESSO}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct}
        aria-valuetext={textoDoProgresso(posicao, duracao)}
        className="h-1.5 overflow-hidden rounded-pill bg-rail"
      >
        <div
          className="h-full rounded-pill bg-teal motion-safe:transition-[width] motion-safe:duration-200 motion-safe:ease-linear"
          style={{ width: `${pct}%` }}
        />
      </div>
      {meu && estado === 'erro' ? (
        <p role="alert" className="m-0 text-[14px] font-bold leading-[1.35] text-[#9B1C2E]">
          {ERRO_AO_TOCAR}
        </p>
      ) : null}
    </div>
  );
}
