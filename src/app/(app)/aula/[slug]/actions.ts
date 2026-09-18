'use server';

/**
 * As três mutações do leitor da aula: gravar uma resposta, gravar a página em
 * que o aluno está e concluir a aula.
 *
 * ⚠️ As três tiram o `userId` de `requireUser()`, **nunca do formulário nem do
 * argumento**. O que chega do cliente é só a aula (pelo slug, que é público) e o
 * conteúdo da resposta — e mesmo isso passa pelo zod antes de encostar no banco.
 *
 * ⚠️ `concluirAulaAction` **reconta o placar no servidor** a partir do que está
 * gravado em `ExerciseAnswer`. Número de acertos vindo do cliente não é dado, é
 * palpite — e `LessonProgress.score` é cache, não verdade (BACKOFFICE §6.4,
 * regra 4): o gabarito mora no conteúdo, que o PO edita.
 *
 * Quando a tabela `Lesson` ainda não foi semeada (ou o banco está fora), nada
 * disso derruba a tela: a gravação falha em silêncio controlado e devolve o
 * aviso para o cliente mostrar. O aluno continua lendo a aula.
 */
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

import { requireUser } from '@/lib/auth/session';
import { carregarAulaPublicadaPorSlug } from '@/lib/content/publicado';
import type { Lesson } from '@/lib/content/types';
import {
  carregarRespostasDaAula,
  gravarConclusao,
  gravarPagina,
  gravarResposta,
  mapaDeRespostas,
} from '@/lib/lesson/respostas';
import { pontuar } from '@/lib/lesson/score';

/** O retorno que o cliente entende (é o `ResultadoDeSalvamento` de `interacao.tsx`). */
type Resultado = { ok: boolean; erro?: string };

const NAO_GRAVOU =
  'Não conseguimos salvar sua resposta agora. Ela continua aqui na tela — tentamos de novo no próximo toque.';

const AULA_INVALIDA = 'Esta aula não está mais disponível.';

const esquemaSlug = z.string().min(1).max(120);

/**
 * Só as chaves que `src/lib/lesson/keys.ts` sabe construir entram no banco.
 * Sem isso, qualquer string viraria uma linha de `ExerciseAnswer` permanente.
 */
const CHAVE_VALIDA = /^(mc|fill|free|match|dnd|chk|cta):[A-Za-z0-9:_-]{1,120}$/;

const esquemaResposta = z.object({
  answerKey: z.string().min(3).max(160).regex(CHAVE_VALIDA),
  // Texto livre do aluno cabe folgado; o limite existe para o campo não virar porta de despejo.
  value: z.string().max(4000),
  checked: z.boolean(),
  correct: z.boolean().nullable(),
});

const esquemaPagina = z.number().int().min(0).max(999);

/**
 * A aula pela **mesma porta** que o leitor usa (`publicado.ts`). Ler do catálogo
 * estático aqui pontuaria contra um conteúdo diferente do que o aluno vê: blocos
 * novos do painel nunca contariam, e um slug trocado pelo PO recusaria toda gravação.
 */
async function aulaPublicada(slug: string): Promise<Lesson | null> {
  const publicada = await carregarAulaPublicadaPorSlug(slug);
  return publicada?.aula ?? null;
}

/**
 * Grava uma resposta do aluno (`upsert` pela única `(userId, answerKey)`), marca
 * a aula como em andamento e registra o dia de estudo.
 */
export async function salvarRespostaAction(
  slug: string,
  entrada: { answerKey: string; value: string; checked: boolean; correct: boolean | null },
): Promise<Resultado> {
  const usuario = await requireUser();

  const slugValidado = esquemaSlug.safeParse(slug);
  const entradaValidada = esquemaResposta.safeParse(entrada);
  if (!slugValidado.success || !entradaValidada.success) {
    return { ok: false, erro: NAO_GRAVOU };
  }

  const aula = await aulaPublicada(slugValidado.data);
  if (aula === null) return { ok: false, erro: AULA_INVALIDA };

  const gravou = await gravarResposta(usuario.id, aula.id, entradaValidada.data);
  return gravou ? { ok: true } : { ok: false, erro: NAO_GRAVOU };
}

/**
 * Guarda a página corrente. Devolve `void` de propósito: a virada de página não
 * espera por esta gravação, e falhar aqui custa o "continue de onde parou", não a aula.
 */
export async function salvarPaginaAction(slug: string, pagina: number): Promise<void> {
  const usuario = await requireUser();

  const slugValidado = esquemaSlug.safeParse(slug);
  const paginaValidada = esquemaPagina.safeParse(pagina);
  if (!slugValidado.success || !paginaValidada.success) return;

  const aula = await aulaPublicada(slugValidado.data);
  if (aula === null) return;

  // Clamp contra uma página que não existe mais (BACKOFFICE §6.4, regra 2).
  const destino = Math.min(paginaValidada.data, Math.max(aula.pages.length - 1, 0));
  await gravarPagina(usuario.id, aula.id, destino);
}

/**
 * Fecha a aula: reconta o placar a partir das respostas gravadas, grava
 * `COMPLETED` + `score`/`total`/`completedAt`, registra o dia de estudo e
 * atualiza as telas que mostram progresso.
 */
export async function concluirAulaAction(slug: string): Promise<Resultado> {
  const usuario = await requireUser();

  const slugValidado = esquemaSlug.safeParse(slug);
  if (!slugValidado.success) return { ok: false, erro: AULA_INVALIDA };

  const aula = await aulaPublicada(slugValidado.data);
  if (aula === null) return { ok: false, erro: AULA_INVALIDA };

  const respostas = await carregarRespostasDaAula(usuario.id, aula.id);
  const placar = pontuar(aula, mapaDeRespostas(respostas));

  const gravou = await gravarConclusao(usuario.id, aula.id, {
    score: placar.acertos,
    total: placar.total,
    ultimaPagina: Math.max(aula.pages.length - 1, 0),
  });

  if (!gravou) {
    return {
      ok: false,
      erro:
        'Não conseguimos registrar sua conclusão agora. Sua aula continua aqui — tente de novo em instantes.',
    };
  }

  revalidatePath('/inicio');
  revalidatePath('/trilha');
  revalidatePath('/progresso');

  return { ok: true };
}
