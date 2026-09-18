/**
 * Tipos do formulário "Excluir minha conta".
 *
 * Moram fora do `actions.ts` porque arquivo `'use server'` só pode exportar
 * funções assíncronas; lá eles entram como `import type`.
 */

/** Campos que podem vir marcados com erro. */
export type CampoDaExclusao = 'senha' | 'confirmacao';

export type EstadoDaExclusao =
  | { estado: 'inicial' }
  | { estado: 'erro'; mensagem: string; campo?: CampoDaExclusao };

export const ESTADO_INICIAL_DA_EXCLUSAO: EstadoDaExclusao = { estado: 'inicial' };

/** Valor que o checkbox de confirmação manda quando marcado. */
export const VALOR_DA_CONFIRMACAO = 'sim';
