/**
 * A trilha do aluno.
 *
 * ⚠️ **Lê o conteúdo publicado, não o arquivo estático.** A porta é
 * `carregarTrilhaPublicada()` (`@/lib/content/publicado`): aula despublicada ou
 * arquivada no painel some daqui, e o título que o PO editar aparece aqui sem
 * ninguém tocar em código. Sem banco, a porta cai no conteúdo estático — ver as
 * três regras no cabeçalho daquele arquivo.
 *
 * A contagem de "concluídas" é feita sobre as aulas **publicadas**, e não sobre
 * as 42 do arquivo: dizer "3 de 42" quando só 30 estão no ar seria mentir para o
 * aluno sobre o tamanho do caminho dele.
 */
import type { Metadata } from 'next';

import { TrilhaAlternavel } from '@/components/app/TrilhaAlternavel';
import { requireUser } from '@/lib/auth/session';
import { montarTrilhaDoAluno } from '@/lib/trilha-do-aluno';

export const metadata: Metadata = { title: 'Trilha' };
export const dynamic = 'force-dynamic';

export default async function TrilhaPage() {
  const usuario = await requireUser();
  const trilha = await montarTrilhaDoAluno(usuario.id);
  const pct = trilha.total > 0 ? Math.round((trilha.concluidas / trilha.total) * 100) : 0;

  return (
    <div className="flex flex-col gap-6 pt-1 lg:pt-3.5">
      <header>
        <h1 className="m-0 text-[clamp(30px,8vw,42px)] font-black leading-tight tracking-[-0.02em] text-navy">
          Seu caminho até o fim
        </h1>
        <p className="m-0 mt-2 text-[16px] leading-snug text-muted lg:text-[19px]">
          {trilha.concluidas} de {trilha.total} aulas concluídas ({pct}%). Todas as aulas ficam
          abertas. Estude na ordem que preferir.
        </p>
      </header>

      <TrilhaAlternavel itens={trilha.itens} modulos={trilha.modulos} />
    </div>
  );
}
