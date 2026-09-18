/**
 * Aba "Versões" de `/admin/aulas/[numero]` — histórico de publicações.
 *
 * ⚠️ Restaurar uma versão **nunca publica**: ela volta como rascunho e passa
 * pelo mesmo relatório de impacto da aba Páginas antes de chegar ao aluno.
 */
import { ListaDeVersoes, type LinhaDeVersao } from '@/components/admin/editor/ListaDeVersoes';
import type { AulaDoPainel } from '@/lib/admin/aulas';
import { listarVersoes } from '@/lib/admin/publicacao';

import { carregarVersaoAction, restaurarVersaoAction } from './actions';

const FORMATO_DE_DATA = new Intl.DateTimeFormat('pt-BR', {
  dateStyle: 'short',
  timeStyle: 'short',
  timeZone: 'America/Sao_Paulo',
});

export async function AbaDeVersoes({ aula }: { aula: AulaDoPainel }) {
  let linhas: LinhaDeVersao[];
  try {
    const versoes = await listarVersoes(aula.id);
    linhas = versoes.map((v) => ({
      id: v.id,
      version: v.version,
      data: FORMATO_DE_DATA.format(v.publishedAt),
      autor: v.autor,
      resumo: v.resumo,
      paginas: v.paginas,
      title: v.title,
    }));
  } catch (erro: unknown) {
    const motivo = erro instanceof Error ? erro.message : 'erro desconhecido';
    console.error(`[versões] aula ${aula.number} sem banco: ${motivo}`);
    return (
      <div
        className="rounded-card border border-solid p-5"
        style={{ background: '#FEF0F2', borderColor: '#F9D3D9', color: '#B21F31' }}
      >
        <p className="m-0 text-[15px] font-extrabold leading-snug">
          O histórico de versões não pôde ser carregado.
        </p>
        <p className="m-0 mt-1.5 text-[14px] font-semibold leading-snug">
          O banco de dados não respondeu. Nada foi alterado; recarregue a página em instantes.
        </p>
      </div>
    );
  }

  return (
    <ListaDeVersoes
      aulaId={aula.id}
      numero={aula.number}
      versaoAtual={aula.contentVersion}
      temRascunho={aula.temRascunho}
      versoes={linhas}
      carregarVersao={carregarVersaoAction}
      restaurarAction={restaurarVersaoAction}
    />
  );
}
