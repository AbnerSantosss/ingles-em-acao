'use client';

/**
 * Player de um bloco inteiro (pacote 08 do plano v2): o diálogo completo, com
 * as duas vozes (prompt-mestre de áudios, seção 15), ou o "Ouvir todos" de uma
 * lista (seção 20). É um arquivo só, tocado do começo ao fim.
 *
 * O MVP tem tocar e parar: tocando, o botão principal vira "Parar". Pausar e
 * continuar ficaram para depois (docs/plano-v2/PENDENCIAS.md, item 9).
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
  ROTULO_DEVAGAR,
  ROTULO_PARAR,
  ROTULO_PROGRESSO,
  formatarTempo,
  textoDoProgresso,
} from './rotulos';
import { TAXA_DEVAGAR, TAXA_NORMAL, mudarTaxa, parar, tocar } from './tocador';
import { useEstadoDoTocador } from './useEstadoDoTocador';

function IconeTocar() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M8 5.5v13l11-6.5-11-6.5Z" fill="currentColor" />
    </svg>
  );
}

function IconeParar() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <rect x="6" y="6" width="12" height="12" rx="1.8" fill="currentColor" />
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
  const textoDoBotao = ativo ? ROTULO_PARAR : rotulo;

  function principal() {
    if (ativo) {
      parar();
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
    <div className="flex flex-col gap-2 rounded-[16px] border border-solid border-border bg-surface px-3 py-2.5">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={principal}
          className="inline-flex h-11 flex-none cursor-pointer items-center gap-2 rounded-pill bg-navy px-4 text-[15px] font-extrabold text-white transition-colors hover:bg-navy-light"
        >
          {ativo ? <IconeParar /> : <IconeTocar />}
          {textoDoBotao}
        </button>
        {clip.lento ? (
          <button
            type="button"
            onClick={alternarDevagar}
            aria-pressed={devagar}
            className={cn(
              'inline-flex h-11 flex-none cursor-pointer items-center rounded-pill border border-solid px-3.5 text-[14px] font-extrabold transition-colors',
              devagar ? 'border-navy bg-navy text-white' : 'border-border bg-surface text-navy hover:border-navy',
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
        <div className="h-full rounded-pill bg-teal" style={{ width: `${pct}%` }} />
      </div>
      {meu && estado === 'erro' ? (
        <p role="alert" className="m-0 text-[14px] font-bold leading-[1.35] text-[#9B1C2E]">
          {ERRO_AO_TOCAR}
        </p>
      ) : null}
    </div>
  );
}
