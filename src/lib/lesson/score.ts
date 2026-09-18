/**
 * Placar de uma aula — a mesma contagem do protótipo (`scoreLesson`, linha ~1138 de
 * `prototype/mobile.dc.html`).
 *
 * Função pura: recebe a aula e as respostas, devolve números. Sem Prisma, sem cache,
 * sem efeito. É de propósito — BACKOFFICE §6.4, regra 4: `LessonProgress.score`/`total`
 * são cache, não verdade. O gabarito mora no conteúdo, e o conteúdo muda quando o PO
 * edita a aula. Quem sabe o placar certo é esta função, rodando de novo.
 *
 * Quem pontua e quanto vale:
 *   mc     → 1 ponto por questão
 *   fill   → 1 ponto por lacuna
 *   match  → 1 ponto pelo bloco inteiro (acertou todos os pares, ou nada)
 *   dnd    → 1 ponto pelo bloco inteiro
 *   check  → 1 ponto por item marcado (autoavaliação: não existe resposta errada)
 *   free   → não pontua (produção livre não é corrigida)
 *   cta    → não pontua (é um clique, não uma resposta)
 */
import type { Lesson } from '../content/types';
import {
  RESULTADO_OK,
  chaveCheck,
  chaveDnd,
  chaveFill,
  chaveMatch,
  chaveMc,
  estaMarcado,
  normalizar,
} from './keys';

/** Os 5 tipos de bloco que entram no placar. */
export type TipoPontuavel = 'mc' | 'fill' | 'match' | 'dnd' | 'check';

export interface PontuacaoDeBloco {
  /** `id` do bloco — permanente e único no curso inteiro. */
  id: string;
  tipo: TipoPontuavel;
  /** Índice da página onde o bloco está, contado a partir de zero. */
  pagina: number;
  acertos: number;
  total: number;
}

export interface Pontuacao {
  acertos: number;
  total: number;
  /** Detalhe por bloco, em ordem de leitura da aula. Chave: o `id` do bloco. */
  porBloco: Map<string, PontuacaoDeBloco>;
}

/**
 * Conta o placar da aula a partir das respostas gravadas.
 *
 * @param respostas mapa `answerKey` → `value`, exatamente como vem de `ExerciseAnswer`.
 *   Chave ausente conta como não respondida — nunca como erro de sistema.
 */
export function pontuar(aula: Lesson, respostas: ReadonlyMap<string, string>): Pontuacao {
  const porBloco = new Map<string, PontuacaoDeBloco>();
  let acertos = 0;
  let total = 0;

  const registrar = (
    id: string,
    tipo: TipoPontuavel,
    pagina: number,
    acertosDoBloco: number,
    totalDoBloco: number,
  ): void => {
    porBloco.set(id, { id, tipo, pagina, acertos: acertosDoBloco, total: totalDoBloco });
    acertos += acertosDoBloco;
    total += totalDoBloco;
  };

  aula.pages.forEach((pagina, indiceDaPagina) => {
    for (const bloco of pagina.blocks) {
      switch (bloco.t) {
        case 'mc': {
          let certos = 0;
          bloco.questions.forEach((questao, i) => {
            if (respostas.get(chaveMc(aula.id, bloco.id, i)) === String(questao.answer)) certos += 1;
          });
          registrar(bloco.id, 'mc', indiceDaPagina, certos, bloco.questions.length);
          break;
        }

        case 'fill': {
          let certos = 0;
          bloco.items.forEach((item, i) => {
            const digitado = normalizar(respostas.get(chaveFill(bloco.id, i)));
            // Sem resposta, `digitado` é "" e nenhum gabarito casa: conta como erro, não como ponto.
            if (item.answers.some((aceita) => normalizar(aceita) === digitado)) certos += 1;
          });
          registrar(bloco.id, 'fill', indiceDaPagina, certos, bloco.items.length);
          break;
        }

        case 'match': {
          const certo = respostas.get(chaveMatch(bloco.id)) === RESULTADO_OK;
          registrar(bloco.id, 'match', indiceDaPagina, certo ? 1 : 0, 1);
          break;
        }

        case 'dnd': {
          const certo = respostas.get(chaveDnd(bloco.id)) === RESULTADO_OK;
          registrar(bloco.id, 'dnd', indiceDaPagina, certo ? 1 : 0, 1);
          break;
        }

        case 'check': {
          let marcados = 0;
          bloco.items.forEach((_, i) => {
            if (estaMarcado(respostas.get(chaveCheck(bloco.id, i)))) marcados += 1;
          });
          registrar(bloco.id, 'check', indiceDaPagina, marcados, bloco.items.length);
          break;
        }

        default:
          // Os outros 26 tipos não pontuam. `free` e `cta` gravam resposta, mas não placar.
          break;
      }
    }
  });

  return { acertos, total, porBloco };
}
