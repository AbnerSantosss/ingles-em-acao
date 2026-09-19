'use client';

/**
 * Player de bloco inteiro em cima do bloco (pacote 08 do plano v2).
 *
 * Procura o clipe `alvo: 'bloco'` cuja âncora é o texto do primeiro item do
 * bloco (`ancoraDoBloco`). Não tem: devolve só o bloco, sem caixa a mais. Tem:
 * põe o `PlayerDeDialogo` logo acima dele.
 */
import type { ReactNode } from 'react';

import { ancoraDoBloco } from '@/lib/audio/textos-da-pagina';
import type { Block } from '@/lib/content/types';

import { useClip } from './ContextoDeAudio';
import { PlayerDeDialogo } from './PlayerDeDialogo';

export function OuvirBloco({
  bloco,
  rotulo,
  children,
}: {
  bloco: Block;
  /** "Ouvir o diálogo" no `dialogue`, "Ouvir todos" nas listas. */
  rotulo: string;
  children: ReactNode;
}) {
  const clip = useClip(ancoraDoBloco(bloco) ?? '', 'bloco');
  if (!clip) return <>{children}</>;

  return (
    <div className="flex flex-col gap-2.5">
      <PlayerDeDialogo clip={clip} rotulo={rotulo} />
      {children}
    </div>
  );
}
