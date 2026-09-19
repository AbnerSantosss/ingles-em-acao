/**
 * Leitura do tocador pelos componentes (pacote 08 do plano v2).
 *
 * Os botões assinam o tocador com um seletor que devolve um valor primitivo.
 * Assim o `timeupdate` (umas quatro vezes por segundo) só redesenha o player de
 * bloco, que mostra a barra, e não todos os botões da página.
 */
import { useSyncExternalStore } from 'react';

import {
  ESTADO_NO_SERVIDOR,
  assinar,
  obterEstado,
  type EstadoDoTocador,
  type InstantaneoDoTocador,
} from './tocador';

/** O instantâneo inteiro. Muda a cada `timeupdate`: use só no player de bloco. */
export function useEstadoDoTocador(): InstantaneoDoTocador {
  return useSyncExternalStore(assinar, obterEstado, () => ESTADO_NO_SERVIDOR);
}

/** Estado visto por UM clipe: o do tocador se o clipe for o atual, senão 'parado'. */
export function useEstadoDoClipe(src: string): EstadoDoTocador {
  return useSyncExternalStore<EstadoDoTocador>(
    assinar,
    () => {
      const agora = obterEstado();
      return agora.src === src ? agora.estado : 'parado';
    },
    () => 'parado',
  );
}

/** Velocidade do clipe se ele for o atual, senão `null`. */
export function useTaxaDoClipe(src: string): number | null {
  return useSyncExternalStore<number | null>(
    assinar,
    () => {
      const agora = obterEstado();
      return agora.src === src ? agora.taxa : null;
    },
    () => null,
  );
}
