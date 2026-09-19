/**
 * Textos de tela e formatação do áudio das aulas (pacote 08 do plano v2).
 *
 * Tudo o que o aluno lê, ou ouve pelo leitor de tela, sai daqui. Assim a revisão
 * de escrita (`docs/ESCRITA.md`) olha um arquivo só.
 */

export const ERRO_AO_TOCAR = 'Não deu para tocar. Tente de novo.';
export const ROTULO_OUVIR_DIALOGO = 'Ouvir o diálogo';
export const ROTULO_OUVIR_TODOS = 'Ouvir todos';
/** O player tocando mostra "Parar". Pausar e continuar ficaram para depois (PENDENCIAS.md, item 9). */
export const ROTULO_PARAR = 'Parar';
export const ROTULO_DEVAGAR = 'Devagar';
export const ROTULO_PROGRESSO = 'Progresso do áudio';

/** Quantos caracteres do texto entram no nome acessível do botão. */
export const LIMITE_DO_ROTULO = 60;

/**
 * Encurta um texto para caber no nome acessível: junta os espaços, corta na
 * última palavra inteira e fecha com reticências.
 */
export function resumirTexto(texto: string, limite = LIMITE_DO_ROTULO): string {
  const limpo = texto.replace(/\s+/g, ' ').trim();
  if (limpo.length <= limite) return limpo;
  const corte = limpo.slice(0, limite);
  const espaco = corte.lastIndexOf(' ');
  const base = espaco > limite / 2 ? corte.slice(0, espaco) : corte;
  return `${base.replace(/[\s.,;:!?]+$/, '')}…`;
}

/** Nome acessível do botão de ouvir: "Ouvir: I am ready." */
export function rotuloDeOuvir(texto: string): string {
  return `Ouvir: ${resumirTexto(texto)}`;
}

/** Nome acessível do botão "Devagar": "Ouvir mais devagar: I am ready." */
export function rotuloDeOuvirDevagar(texto: string): string {
  return `Ouvir mais devagar: ${resumirTexto(texto)}`;
}

/** Segundos em "m:ss". Valor inválido (NaN, Infinity, negativo) vira "0:00". */
export function formatarTempo(segundos: number): string {
  const total = Number.isFinite(segundos) && segundos > 0 ? Math.floor(segundos) : 0;
  const minutos = Math.floor(total / 60);
  const resto = total % 60;
  return `${minutos}:${String(resto).padStart(2, '0')}`;
}

/** "0:03 de 0:12", lido pelo leitor de tela na barra de progresso. */
export function textoDoProgresso(posicao: number, duracao: number): string {
  return `${formatarTempo(posicao)} de ${formatarTempo(duracao)}`;
}
