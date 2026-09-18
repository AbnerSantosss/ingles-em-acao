/**
 * As chaves de resposta do aluno (`ExerciseAnswer.answerKey`) — CONTRACT §4.
 *
 * Toda chave é montada aqui e em lugar nenhum mais. Concatenar `'mc:' + …` à mão em
 * outro arquivo é como o progresso do aluno se perde em silêncio: basta um separador
 * diferente e a resposta gravada vira órfã, sem erro nenhum na tela.
 *
 * Duas delas mudaram em relação ao protótipo (BACKOFFICE §6.2, opção A): `mc:` e
 * `match:` passaram a usar o `id` do bloco, e não o `title`. `title` é campo editável
 * pelo admin; `id` é permanente e nunca reaproveitado. `match:` também ganhou o
 * `lessonId` implícito pelo `id`, que é globalmente único — antes a chave era global e
 * dois blocos com o mesmo título em aulas diferentes compartilhariam resposta.
 *
 * Arquivo puro e sem import de servidor: roda igual no cliente e no Server Component.
 */

// ───────────────────────────── construtores ────────────────────────────

/** `mc:{lessonId}:{blockId}:{i}` → índice da opção escolhida, como texto. */
export function chaveMc(lessonId: number, blockId: string, i: number): string {
  return `mc:${lessonId}:${blockId}:${i}`;
}

/** `fill:{blockId}:{i}` → texto digitado na lacuna. */
export function chaveFill(blockId: string, i: number): string {
  return `fill:${blockId}:${i}`;
}

/** `free:{blockId}:{i}` → texto livre do aluno. Não é corrigido, mas precisa sobreviver à recarga. */
export function chaveFree(blockId: string, i: number): string {
  return `free:${blockId}:${i}`;
}

/** `match:{blockId}` → `RESULTADO_OK` ou `RESULTADO_ERRO`, gravado ao conferir. */
export function chaveMatch(blockId: string): string {
  return `match:${blockId}`;
}

/** `dnd:{blockId}` → `RESULTADO_OK` ou `RESULTADO_ERRO`, gravado ao conferir. */
export function chaveDnd(blockId: string): string {
  return `dnd:${blockId}`;
}

/** `chk:{blockId}:{i}` → item da autoavaliação marcado ou não. */
export function chaveCheck(blockId: string, i: number): string {
  return `chk:${blockId}:${i}`;
}

/**
 * `cta:{lessonId}:{i}` → só a lembrança de que o aviso do plano foi aberto.
 * É a única chave sem `id` de bloco: o `cta` não guarda resposta, guarda um clique.
 */
export function chaveCta(lessonId: number, i: number): string {
  return `cta:${lessonId}:${i}`;
}

// ──────────────────────── valores canônicos ────────────────────────────

/** `match` e `dnd` gravam o resultado inteiro, não as peças. */
export const RESULTADO_OK = 'ok';
export const RESULTADO_ERRO = 'no';

/** `chk:` grava um booleano; no banco ele vira texto. */
export const MARCADO = '1';
export const NAO_MARCADO = '0';

/** Aceita também `'true'` porque é o que um `String(boolean)` distraído produz. */
export function estaMarcado(valor: string | undefined): boolean {
  return valor === MARCADO || valor === 'true';
}

// ───────────────────────────── normalização ────────────────────────────

/**
 * A mesma normalização do protótipo (`const norm`, linha 1066 de `mobile.dc.html`) —
 * é ela que decide se a resposta digitada bate com o gabarito do `fill`.
 *
 * `trim` → minúsculas → aspa curva vira reta → espaços colapsados. A aspa importa:
 * o teclado do iPhone escreve “don’t” com U+2019 e o gabarito guarda "don't".
 *
 * Além do protótipo, a pontuação não decide acerto: vírgula vira espaço e a
 * pontuação final (`.`, `!`, `?`, `;`, `:`) cai. Os gabaritos de frase completa
 * (aulas 03, 22, 25, 39…) guardam o ponto final, e quem digita "I am not
 * Brazilian" sem ponto acertou. Gabarito e texto digitado passam pela mesma
 * função — tela (`BlocoFill`) e placar (`pontuar`) continuam coerentes.
 */
export function normalizar(texto: string | null | undefined): string {
  return (texto ?? '')
    .trim()
    .toLowerCase()
    .replace(/[‘’']/g, "'")
    .replace(/\s*,\s*/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\s*[.!?;:]+$/, '')
    .trim();
}
