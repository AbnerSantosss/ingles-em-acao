import 'server-only';

/**
 * Prompt de prática de uma aula, montado no servidor (contrato 01, seção 3.3).
 *
 * A página da aula chama `promptDaAula` e passa o resultado como prop até o
 * cartão do fim da aula. Nada de Server Action e nada de fetch no clique: o
 * botão abre o ChatGPT de forma síncrona, senão o navegador bloqueia a janela.
 *
 * ⚠️ Quem não tem o plano recebe `{ ok: false, motivo: 'sem-plano' }` e o texto
 * do prompt nunca sai do servidor. Por isso o plano é conferido ANTES de
 * qualquer consulta.
 */
import { prisma } from '@/lib/db';
import { PLANOS, planoInclui } from '@/lib/planos';

import { urlDoChatGPT } from './chatgpt';
import { FichaDePraticaSchema } from './esquema';
import { montarPrompt, type EntradaDoPrompt } from './montar';
import type { FichaDePratica, ResultadoDoPrompt } from './tipos';

/** Motivo curto do erro, sem pilha e sem dado do banco. */
function motivoDoErro(erro: unknown): string {
  return erro instanceof Error ? erro.message : 'erro desconhecido';
}

/**
 * Valida o JSON de `Lesson.practice`. Devolve a ficha ou `null`.
 * `null` sem log quando a aula não tem ficha; `null` com log quando a ficha
 * existe mas está fora do formato.
 */
function lerFicha(numeroDaAula: number, valor: unknown): FichaDePratica | null {
  if (valor === null || valor === undefined) return null;
  const lida = FichaDePraticaSchema.safeParse(valor);
  if (lida.success) return lida.data as FichaDePratica;
  const primeira = lida.error.issues[0];
  const onde = primeira && primeira.path.length > 0 ? primeira.path.join('.') : '(raiz)';
  console.error(
    `[pratica] aula ${numeroDaAula}: ficha inválida (${lida.error.issues.length} problema(s); primeiro em ${onde}: ${primeira ? primeira.message : 'sem detalhe'}).`,
  );
  return null;
}

export interface OpcoesDaEntrada {
  /**
   * Ficha que substitui a gravada no banco para a aula atual. Uso do painel
   * (pacote 07): pré-visualizar uma ficha ainda não salva. Com ela, a aula atual
   * não precisa estar publicada.
   */
  fichaSubstituta?: FichaDePratica;
}

/**
 * Busca tudo o que `montarPrompt` precisa. Devolve `null` quando não há prompt
 * para montar: aula inexistente, despublicada ou arquivada, sem ficha, ficha
 * inválida ou ficha pendente.
 *
 * As anteriores vêm numa consulta só, com `select` enxuto. Anterior sem ficha,
 * com ficha pendente ou com ficha inválida fica de fora do prompt.
 */
export async function carregarEntradaDoPrompt(
  numeroDaAula: number,
  opcoes: OpcoesDaEntrada = {},
): Promise<EntradaDoPrompt | null> {
  const [atual, linhasAnteriores, seguinte] = await Promise.all([
    prisma.lesson.findUnique({
      where: { number: numeroDaAula },
      select: { number: true, title: true, practice: true, published: true, archivedAt: true },
    }),
    prisma.lesson.findMany({
      where: { number: { lt: numeroDaAula }, published: true, archivedAt: null },
      select: { number: true, title: true, practice: true },
      orderBy: { number: 'asc' },
    }),
    prisma.lesson.findFirst({
      where: { number: { gt: numeroDaAula }, published: true, archivedAt: null },
      select: { number: true, title: true },
      orderBy: { number: 'asc' },
    }),
  ]);

  if (!atual) return null;

  const substituta = opcoes.fichaSubstituta;
  let ficha: FichaDePratica | null;
  if (substituta) {
    // Pré-visualização do painel: vale qualquer status e qualquer publicação.
    ficha = substituta;
  } else {
    if (!atual.published || atual.archivedAt !== null) return null;
    ficha = lerFicha(atual.number, atual.practice);
    if (!ficha || ficha.status !== 'pronta') return null;
  }

  const anteriores: EntradaDoPrompt['anteriores'] = [];
  for (const linha of linhasAnteriores) {
    const dela = lerFicha(linha.number, linha.practice);
    if (!dela || dela.status !== 'pronta') continue;
    anteriores.push({
      numero: linha.number,
      titulo: linha.title,
      resumoAutorizado: dela.resumoAutorizado,
      resumoCurto: dela.resumoCurto,
    });
  }

  return {
    aula: { numero: atual.number, titulo: atual.title },
    ficha,
    anteriores,
    proxima: seguinte ? { numero: seguinte.number, titulo: seguinte.title } : null,
  };
}

/**
 * O que o cartão de prática recebe. `numeroDaAula` é `aula.id` na página da
 * aula (que é o NÚMERO da aula, 1 a 42). `plano` é `usuario.plan`.
 */
export async function promptDaAula(
  numeroDaAula: number,
  plano: string | null | undefined,
): Promise<ResultadoDoPrompt> {
  // Plano desconhecido (inclusive o antigo 'COMPLETO') conta como sem plano.
  const planoDoAluno = PLANOS.find((p) => p === plano) ?? null;
  if (!planoInclui(planoDoAluno, 'pratica')) return { ok: false, motivo: 'sem-plano' };

  try {
    const entrada = await carregarEntradaDoPrompt(numeroDaAula);
    if (!entrada) return { ok: false, motivo: 'sem-ficha' };
    const prompt = montarPrompt(entrada);
    return { ok: true, prompt, urlDoChatGPT: urlDoChatGPT(prompt) };
  } catch (erro) {
    console.error(`[pratica] aula ${numeroDaAula}: não foi possível montar o prompt: ${motivoDoErro(erro)}`);
    return { ok: false, motivo: 'sem-ficha' };
  }
}
