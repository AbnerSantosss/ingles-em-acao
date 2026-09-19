'use client';

/**
 * Áudios da página atual da aula (contrato 01, seção 8).
 *
 * O `LeitorDaAula` envolve cada página com `<ProvedorDeAudio audios={pagina.audios}>`.
 * Cada bloco pergunta pelo clipe do texto que mostra com `useClip(textoExibido)`.
 * Sem provedor (pré-visualização do painel, por exemplo), `useClip` devolve
 * `undefined` e nenhum botão aparece.
 *
 * O provedor também para o som quando a página muda ou a aula fecha: o áudio de
 * uma página não pode continuar tocando na seguinte.
 */
import { createContext, useContext, useEffect, useMemo, type JSX, type ReactNode } from 'react';

import { acharClip } from '@/lib/audio/ancora';
import type { AudioClip } from '@/lib/content/types';

import { parar } from './tocador';

const AudiosDaPagina = createContext<readonly AudioClip[] | undefined>(undefined);

export function ProvedorDeAudio(props: { audios: AudioClip[] | undefined; children: ReactNode }): JSX.Element {
  const { audios, children } = props;
  // A lista de ids muda quando a página muda. A limpeza do efeito anterior para o som.
  const chave = audios?.map((clip) => clip.id).join('|') ?? '';

  useEffect(() => {
    return () => {
      parar();
    };
  }, [chave]);

  return <AudiosDaPagina.Provider value={audios}>{children}</AudiosDaPagina.Provider>;
}

/** Clipe da página atual cuja âncora casa com o texto exibido. `undefined`: sem botão. */
export function useClip(textoExibido: string, alvo: AudioClip['alvo'] = 'texto'): AudioClip | undefined {
  const audios = useContext(AudiosDaPagina);
  return useMemo(() => acharClip(audios, textoExibido, alvo), [audios, textoExibido, alvo]);
}
