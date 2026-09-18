/**
 * Leitura e regras dos módulos do painel — BACKOFFICE §2.2 e §6.1.
 *
 * ⚠️ MÓDULO DE SERVIDOR (importa o Prisma). Nunca importe de um `'use client'`.
 *
 * Aqui moram as **consultas** e as **regras puras**. As mutações moram nas
 * Server Actions de `src/app/(admin)/admin/modulos/actions.ts`, onde estão o
 * `requireAdmin()` e o `auditar()` — este arquivo não escreve no banco, com uma
 * exceção anotada: {@link trocarOrdem}, que é uma transação de três passos e não
 * caberia em linha reta dentro da action.
 *
 * Duas regras que este arquivo carrega:
 *
 * 1. **Arquivar módulo com aula dentro é bloqueado** (§6.1). Não existe cascata:
 *    arquivar em cascata esconderia aulas que ninguém mandou esconder. A
 *    mensagem diz quantas aulas precisam ser movidas primeiro.
 * 2. **Reordenar módulo é seguro.** Só muda a ordem de exibição da trilha, não a
 *    numeração das aulas. Reordenar *aula* é outra história (§6.6).
 */
import { z } from 'zod';

import { prisma } from '@/lib/db';

// ───────────────────────────────── tipos ─────────────────────────────────

/** Um módulo com o que a tela precisa mostrar. */
export type ModuloDoPainel = {
  id: number;
  order: number;
  title: string;
  fromLesson: number;
  toLesson: number;
  arquivado: boolean;
  /** Quantas aulas não arquivadas apontam para este módulo. */
  aulas: number;
  /**
   * Divergência entre a faixa declarada e as aulas realmente ligadas, em uma
   * frase — ou `null` quando as duas coisas batem.
   */
  divergencia: string | null;
};

/** Um módulo na lista de seleção do formulário de aula. */
export type OpcaoDeModulo = { id: number; title: string; order: number };

// ──────────────────────────────── validação ──────────────────────────────

/** Faixa de aulas aceita. O curso tem 42, mas o campo não pode travar em 42. */
const NUMERO_DE_AULA = z
  .number({ error: 'informe um número de aula' })
  .int('use um número inteiro')
  .min(1, 'a primeira aula é a 1')
  .max(999, 'número de aula alto demais');

/** Os campos editáveis de um módulo. `id` e `order` não vêm do formulário. */
export const esquemaDeModulo = z
  .object({
    title: z
      .string()
      .trim()
      .min(2, 'o título precisa de pelo menos 2 caracteres')
      .max(80, 'o título passou de 80 caracteres'),
    fromLesson: NUMERO_DE_AULA,
    toLesson: NUMERO_DE_AULA,
  })
  .refine((dados) => dados.fromLesson <= dados.toLesson, {
    path: ['toLesson'],
    error: 'a última aula não pode ser menor que a primeira',
  });

export type DadosDeModulo = z.infer<typeof esquemaDeModulo>;

/** Lê os campos do formulário como número, sem deixar `NaN` virar zero silencioso. */
export function numeroDoFormulario(valor: FormDataEntryValue | null): number {
  const texto = typeof valor === 'string' ? valor.trim() : '';
  if (texto === '') return Number.NaN;
  return Number(texto);
}

// ──────────────────────────────── consultas ──────────────────────────────

/**
 * Os módulos com a contagem de aulas e a divergência de faixa.
 *
 * São duas consultas pequenas (7 módulos, 42 aulas sem conteúdo) em vez de um
 * `_count` com filtro por relação: a segunda também alimenta a conferência de
 * "aula fora da faixa declarada", que o `_count` não responderia.
 */
export async function listarModulosDoPainel(): Promise<ModuloDoPainel[]> {
  const [modulos, aulas] = await Promise.all([
    prisma.module.findMany({ orderBy: { order: 'asc' } }),
    prisma.lesson.findMany({
      where: { archivedAt: null },
      select: { number: true, moduleId: true },
    }),
  ]);

  const porModulo = new Map<number, number[]>();
  for (const aula of aulas) {
    const lista = porModulo.get(aula.moduleId);
    if (lista) lista.push(aula.number);
    else porModulo.set(aula.moduleId, [aula.number]);
  }

  return modulos.map((modulo) => {
    const numeros = porModulo.get(modulo.id) ?? [];
    const declaradas = modulo.toLesson - modulo.fromLesson + 1;
    const foraDaFaixa = numeros.filter(
      (n) => n < modulo.fromLesson || n > modulo.toLesson,
    ).length;

    return {
      id: modulo.id,
      order: modulo.order,
      title: modulo.title,
      fromLesson: modulo.fromLesson,
      toLesson: modulo.toLesson,
      arquivado: modulo.archivedAt !== null,
      aulas: numeros.length,
      divergencia: descreverDivergencia(numeros.length, declaradas, foraDaFaixa),
    };
  });
}

/** A frase de divergência, ou `null` quando faixa e vínculo batem. */
function descreverDivergencia(
  ligadas: number,
  declaradas: number,
  foraDaFaixa: number,
): string | null {
  const partes: string[] = [];

  if (ligadas !== declaradas) {
    partes.push(
      `a faixa declara ${declaradas} aula(s), mas ${ligadas} aula(s) apontam para este módulo`,
    );
  }
  if (foraDaFaixa > 0) {
    partes.push(`${foraDaFaixa} aula(s) ligada(s) têm número fora da faixa`);
  }

  return partes.length === 0 ? null : partes.join('; ');
}

/** Os módulos que podem receber uma aula — os arquivados ficam de fora. */
export async function listarModulosParaSelecao(): Promise<OpcaoDeModulo[]> {
  const modulos = await prisma.module.findMany({
    where: { archivedAt: null },
    orderBy: { order: 'asc' },
    select: { id: true, title: true, order: true },
  });
  return modulos;
}

/** Quantas aulas não arquivadas estão dentro do módulo. Base da regra da §6.1. */
export async function contarAulasDoModulo(moduloId: number): Promise<number> {
  return prisma.lesson.count({ where: { moduleId: moduloId, archivedAt: null } });
}

// ──────────────────────────────── escrita ────────────────────────────────

/**
 * O próximo `id` e a próxima `order` livres.
 *
 * `Module.id` é `Int @id` **sem default** (o app referencia o módulo pelo
 * número, não por cuid), então quem cria precisa escolher o número — e
 * `order` é `@unique`, então também.
 */
export async function proximoIdEOrdem(): Promise<{ id: number; order: number }> {
  const maiores = await prisma.module.aggregate({ _max: { id: true, order: true } });
  return {
    id: (maiores._max.id ?? 0) + 1,
    order: (maiores._max.order ?? 0) + 1,
  };
}

/** O vizinho na direção pedida, ou `null` quando o módulo já está na ponta. */
export async function vizinhoNaOrdem(
  moduloId: number,
  direcao: 'sobe' | 'desce',
): Promise<{ id: number; order: number } | null> {
  const atual = await prisma.module.findUnique({
    where: { id: moduloId },
    select: { order: true },
  });
  if (!atual) return null;

  const vizinho = await prisma.module.findFirst({
    where:
      direcao === 'sobe' ? { order: { lt: atual.order } } : { order: { gt: atual.order } },
    orderBy: { order: direcao === 'sobe' ? 'desc' : 'asc' },
    select: { id: true, order: true },
  });

  return vizinho;
}

/**
 * Troca a `order` de dois módulos.
 *
 * ⚠️ São **três** UPDATEs, não dois, e o motivo é o `@unique` em `Module.order`:
 * o Postgres confere a restrição a cada comando, então gravar B na ordem de A
 * antes de A sair de lá estoura. O primeiro passo estaciona A numa ordem
 * negativa — valor que nenhuma linha real usa —, o segundo move B, o terceiro
 * traz A. Tudo numa transação: ou os três acontecem, ou nenhum.
 */
export async function trocarOrdem(
  a: { id: number; order: number },
  b: { id: number; order: number },
): Promise<void> {
  const estacionamento = -Math.abs(a.order) - 1;

  await prisma.$transaction([
    prisma.module.update({ where: { id: a.id }, data: { order: estacionamento } }),
    prisma.module.update({ where: { id: b.id }, data: { order: a.order } }),
    prisma.module.update({ where: { id: a.id }, data: { order: b.order } }),
  ]);
}
