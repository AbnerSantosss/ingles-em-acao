/**
 * Planos comerciais do WSA English. Fonte única: nenhum outro arquivo declara
 * a lista de planos, o nível de cada um ou o que cada recurso exige.
 */
export type Plano = 'ESSENCIAL' | 'PREMIUM';

export const PLANOS: readonly Plano[] = ['ESSENCIAL', 'PREMIUM'];

export const NIVEL_DO_PLANO: Record<Plano, number> = { ESSENCIAL: 0, PREMIUM: 1 };

/** Nome que o aluno lê. */
export const NOME_DO_PLANO: Record<Plano, string> = {
  ESSENCIAL: 'WSA Essencial',
  PREMIUM: 'WSA Premium',
};

/**
 * Plano mínimo de cada recurso pago ou não.
 * ⚠️ Decisão 1 do dono do produto: se a prática com IA passar a valer para todos,
 * troque `pratica` para 'ESSENCIAL'. É a única linha a mudar.
 */
export const PLANO_MINIMO = {
  audio: 'ESSENCIAL',
  videoaula: 'PREMIUM',
  pratica: 'PREMIUM',
} as const satisfies Record<string, Plano>;

export type Recurso = keyof typeof PLANO_MINIMO;

/** `true` quando o plano do aluno inclui o recurso. Sem plano (visitante) → `false`. */
export function planoInclui(plano: Plano | null | undefined, recurso: Recurso): boolean {
  if (!plano) return false;
  return NIVEL_DO_PLANO[plano] >= NIVEL_DO_PLANO[PLANO_MINIMO[recurso]];
}

/** Linha de plano exibida nos cartões do fim da aula. */
export const ROTULO_EXCLUSIVO_PREMIUM = 'EXCLUSIVO DO WSA PREMIUM';

/** Só existe um destino de compra: o Premium. */
export type LinksDeCompra = { PREMIUM: string | null };
