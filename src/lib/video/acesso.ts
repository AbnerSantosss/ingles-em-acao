/**
 * Quem vê a videoaula — §2.6 e o bloco `cta`: do Plano Completo para cima.
 *
 * Puro de propósito: o player (que renderiza no servidor e no navegador), a
 * tela da aula e a action de renovação do link usam a mesma régua. Uma cópia
 * dela em cada lugar é como o Essencial acaba recebendo um link assinado.
 */
export type PlanoDoAluno = 'ESSENCIAL' | 'COMPLETO' | 'PREMIUM';

const NIVEL_DO_PLANO: Record<PlanoDoAluno, number> = { ESSENCIAL: 0, COMPLETO: 1, PREMIUM: 2 };

export function planoVeVideoaula(plano: PlanoDoAluno): boolean {
  return NIVEL_DO_PLANO[plano] >= NIVEL_DO_PLANO.COMPLETO;
}

/**
 * O `id` do painel de videoaula na página da aula — o destino do `cta` de vídeo.
 * Mora aqui, num módulo puro, porque a página (servidor) e o bloco (`'use client'`)
 * precisam do mesmo valor: importado de um módulo de cliente, o servidor receberia
 * uma referência, não a string.
 */
export const ID_DA_VIDEOAULA = 'videoaula';
