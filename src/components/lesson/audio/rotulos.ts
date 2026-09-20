/**
 * Textos de tela e formatação do áudio das aulas (pacote 08 do plano v2).
 *
 * Tudo o que o aluno lê, ou ouve pelo leitor de tela, sai daqui. Assim a revisão
 * de escrita (`docs/ESCRITA.md`) olha um arquivo só.
 *
 * O botão grande mostra o nome na tela ("Ouvir pronúncia") e o nome acessível
 * começa com essa mesma palavra, porque o texto visível de um botão precisa
 * estar dentro do nome acessível dele (WCAG 2.5.3, "Label in Name"): quem usa
 * comando de voz fala o que está vendo.
 */

export const ERRO_AO_TOCAR = 'Não deu para tocar. Tente de novo.';
/** Texto visível do botão de ouvir uma frase, e começo do nome acessível dele. */
export const ROTULO_OUVIR_PRONUNCIA = 'Ouvir pronúncia';
export const ROTULO_OUVIR_DIALOGO = 'Ouvir o diálogo';
export const ROTULO_OUVIR_TODOS = 'Ouvir todos';
/** Enquanto o clipe toca: o toque seguinte pausa e guarda a posição. */
export const ROTULO_PAUSAR = 'Pausar';
/** Depois de pausar: o toque seguinte volta de onde parou. */
export const ROTULO_CONTINUAR = 'Continuar';
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

/** Nome acessível do botão parado: "Ouvir pronúncia: I am ready." */
export function rotuloDeOuvir(texto: string): string {
  return `${ROTULO_OUVIR_PRONUNCIA}: ${resumirTexto(texto)}`;
}

/** Nome acessível do mesmo botão enquanto o clipe toca: "Pausar: I am ready." */
export function rotuloDePausar(texto: string): string {
  return `${ROTULO_PAUSAR}: ${resumirTexto(texto)}`;
}

/** Nome acessível do mesmo botão com o clipe pausado: "Continuar: I am ready." */
export function rotuloDeContinuar(texto: string): string {
  return `${ROTULO_CONTINUAR}: ${resumirTexto(texto)}`;
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
