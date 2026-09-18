/**
 * A trilha como o aluno a vê (Home e `/trilha`): as aulas publicadas, na ordem
 * da trilha, com o estado de cada uma, e o resumo por módulo para a visão
 * "Módulos". Lê o conteúdo publicado — ver `carregarTrilhaPublicada()`.
 */
import type { EstadoDaAula, ItemDaTrilha, ModuloDaTrilha } from '@/components/app/TrilhaAlternavel';
import { aulasEmOrdem, carregarTrilhaPublicada } from '@/lib/content/publicado';
import { getLessonStatuses } from '@/lib/progress';

export type TrilhaDoAluno = {
  itens: ItemDaTrilha[];
  modulos: ModuloDaTrilha[];
  concluidas: number;
  total: number;
};

export async function montarTrilhaDoAluno(userId: string): Promise<TrilhaDoAluno> {
  const [trilha, statuses] = await Promise.all([
    carregarTrilhaPublicada(),
    getLessonStatuses(userId),
  ]);

  // A mesma ordem da "próxima aula" da Home (ver `aulasEmOrdem`).
  const emOrdem = aulasEmOrdem(trilha);
  const concluiu = (id: number) => statuses.get(id) === 'COMPLETED';

  // A "próxima" é a primeira ainda não concluída; com tudo concluído, nenhuma.
  const proxima = emOrdem.find((aula) => !concluiu(aula.id))?.id ?? null;

  const itens = emOrdem.map((aula) => {
    const estado: EstadoDaAula = concluiu(aula.id)
      ? 'concluida'
      : aula.id === proxima
        ? 'proxima'
        : 'aberta';
    return {
      id: aula.id,
      slug: aula.slug,
      titulo: aula.title,
      subtitulo: aula.subtitle,
      tempo: aula.time,
      estado,
    };
  });

  const modulos = trilha.grupos
    .filter((grupo) => grupo.aulas.length > 0)
    .map(({ modulo, aulas }) => ({
      id: modulo.id,
      ordem: modulo.order,
      titulo: modulo.title,
      concluidas: aulas.filter((aula) => concluiu(aula.id)).length,
      total: aulas.length,
      de: modulo.from,
      ate: modulo.to,
    }));

  return {
    itens,
    modulos,
    concluidas: itens.filter((item) => item.estado === 'concluida').length,
    total: trilha.total,
  };
}
