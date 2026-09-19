/**
 * Quem vê a videoaula (§2.6 e o bloco `cta`): o WSA Premium (`PLANO_MINIMO.videoaula`,
 * em `@/lib/planos`).
 *
 * Puro de propósito: o player (que renderiza no servidor e no navegador), a
 * tela da aula e a action de renovação do link usam a mesma régua. Uma cópia
 * dela em cada lugar é como o Essencial acaba recebendo um link assinado.
 */
import { planoInclui, type Plano } from '@/lib/planos';

export function planoVeVideoaula(plano: Plano): boolean {
  return planoInclui(plano, 'videoaula');
}

/**
 * O `id` do painel de videoaula na página da aula: o destino do `cta` de vídeo.
 * Mora aqui, num módulo puro, porque a página (servidor) e o bloco (`'use client'`)
 * precisam do mesmo valor: importado de um módulo de cliente, o servidor receberia
 * uma referência, não a string.
 */
export const ID_DA_VIDEOAULA = 'videoaula';
