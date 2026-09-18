/**
 * Leituras de estado de conta para as telas do painel.
 *
 * ⚠️ MÓDULO DE SERVIDOR (Prisma).
 *
 * Existe à parte porque as consultas da lista e da ficha do aluno
 * (`src/lib/admin/alunos.ts`) não trazem `deletedAt`. Em vez de mexer nelas,
 * as telas pedem aqui a data de exclusão dos ids que vão mostrar — uma
 * consulta só, limitada aos ids da página.
 */
import { prisma } from '@/lib/db';

/**
 * Data de exclusão de cada conta excluída entre os `ids` informados. Conta
 * ativa (ou id inexistente) simplesmente não aparece no mapa.
 */
export async function datasDeExclusao(ids: readonly string[]): Promise<Map<string, Date>> {
  const unicos = [...new Set(ids)].filter((id) => typeof id === 'string' && id.length > 0);
  if (unicos.length === 0) return new Map();

  const linhas = await prisma.user.findMany({
    where: { id: { in: unicos }, deletedAt: { not: null } },
    select: { id: true, deletedAt: true },
  });

  const mapa = new Map<string, Date>();
  for (const linha of linhas) {
    if (linha.deletedAt) mapa.set(linha.id, linha.deletedAt);
  }
  return mapa;
}

/** A data de exclusão de uma conta, ou `null` se ela está ativa (ou não existe). */
export async function dataDeExclusao(id: string): Promise<Date | null> {
  const mapa = await datasDeExclusao([id]);
  return mapa.get(id) ?? null;
}
