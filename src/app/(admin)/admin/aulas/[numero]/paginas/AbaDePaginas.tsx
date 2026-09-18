/**
 * Aba "Páginas" de `/admin/aulas/[numero]` — BACKOFFICE §3.
 *
 * Server Component: carrega do banco o que o editor precisa (rascunho ou
 * publicado, ids reservados do curso inteiro, quantos alunos responderam cada
 * bloco, relatório de publicação) e entrega ao editor, que é client.
 */
import Link from 'next/link';

import { EditorDePaginas } from '@/components/admin/editor/EditorDePaginas';
import type { AulaDoPainel } from '@/lib/admin/aulas';
import { ROTULO_DO_ESPACO, espacosSemImagem } from '@/lib/admin/pendencias';
import {
  alunosPorBloco,
  type ContextoDoCurso,
  type RelatorioDePublicacao,
  carregarContextoDoCurso,
  contagemPorBloco,
  hashDasPaginas,
  montarRelatorioDePublicacao,
  paginasValidas,
} from '@/lib/admin/publicacao';
import { validarPaginas, type Page } from '@/lib/content/blocks';
import { prisma } from '@/lib/db';

import { descartarRascunhoAction, publicarRascunhoAction, salvarRascunhoAction } from './actions';

function Falha({ titulo, detalhe, erros }: { titulo: string; detalhe: string; erros?: string[] }) {
  return (
    <div
      className="rounded-card border border-solid p-5"
      style={{ background: '#FEF0F2', borderColor: '#F9D3D9', color: '#B21F31' }}
    >
      <p className="m-0 text-[15px] font-extrabold leading-snug">{titulo}</p>
      <p className="m-0 mt-1.5 text-[14px] font-semibold leading-snug">{detalhe}</p>
      {erros && erros.length > 0 ? (
        <ul className="m-0 mt-2 flex list-disc flex-col gap-1 pl-5 text-[13px] font-bold leading-snug">
          {erros.slice(0, 30).map((erro, i) => (
            <li key={i}>{erro}</li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

type Carga =
  | { ok: false; titulo: string; detalhe: string; erros?: string[] }
  | {
      ok: true;
      paginas: Page[];
      temRascunho: boolean;
      hashBase: string;
      versaoAtual: number;
      contexto: ContextoDoCurso;
      respostas: Record<string, number>;
      relatorio: RelatorioDePublicacao | null;
    };

async function carregar(aula: AulaDoPainel): Promise<Carga> {
  try {
    const registro = await prisma.lesson.findUnique({
      where: { id: aula.id },
      select: { id: true, number: true, pages: true, draftPages: true, contentVersion: true },
    });
    if (!registro) {
      return { ok: false, titulo: 'Esta aula não existe mais.', detalhe: 'Volte para a lista de aulas.' };
    }

    const temRascunho = registro.draftPages !== null;
    const conferido = validarPaginas(temRascunho ? registro.draftPages : registro.pages);
    if (!conferido.ok) {
      return {
        ok: false,
        titulo: `O ${temRascunho ? 'rascunho' : 'conteúdo publicado'} desta aula não passa no esquema de blocos.`,
        detalhe:
          'O editor não abre conteúdo inválido para não gravar por cima sem querer. Corrija pelo seed/migração ou restaure uma versão na aba Versões.',
        erros: conferido.erros,
      };
    }

    const publicadas = paginasValidas(registro.pages) ?? [];
    const [contexto, respostas, relatorio] = await Promise.all([
      carregarContextoDoCurso(registro.id),
      alunosPorBloco(registro, publicadas),
      temRascunho ? montarRelatorioDePublicacao(registro.id) : Promise.resolve(null),
    ]);

    return {
      ok: true,
      paginas: conferido.pages,
      temRascunho,
      hashBase: temRascunho ? hashDasPaginas(registro.draftPages) : '',
      versaoAtual: registro.contentVersion,
      contexto,
      respostas: contagemPorBloco(respostas),
      relatorio,
    };
  } catch (erro: unknown) {
    const motivo = erro instanceof Error ? erro.message : 'erro desconhecido';
    console.error(`[editor] aula ${aula.number} sem banco: ${motivo}`);
    return {
      ok: false,
      titulo: 'O editor não pôde ser carregado.',
      detalhe: 'O banco de dados não respondeu. Nada foi alterado; recarregue a página em instantes.',
    };
  }
}

export async function AbaDePaginas({ aula }: { aula: AulaDoPainel }) {
  const dados = await carregar(aula);
  if (!dados.ok) return <Falha titulo={dados.titulo} detalhe={dados.detalhe} erros={dados.erros} />;

  // Quantos espaços de ilustração ainda estão sem imagem no que está em edição.
  // Não bloqueia nada (placeholder não é defeito): é o lembrete de produção.
  const semImagem = espacosSemImagem(dados.paginas);

  return (
    <>
      {semImagem.length > 0 ? (
        <div
          className="mb-4 rounded-field border border-solid px-4 py-3"
          style={{ background: '#FFF7E8', borderColor: '#F6D9A8' }}
        >
          <p className="m-0 text-[14px] font-extrabold leading-snug text-navy">
            {semImagem.length === 1
              ? '1 espaço de ilustração ainda está sem imagem'
              : `${semImagem.length} espaços de ilustração ainda estão sem imagem`}{' '}
            <span className="font-semibold text-muted">
              (
              {semImagem
                .slice(0, 6)
                .map(
                  (espaco) =>
                    `p. ${espaco.pagina} · ${ROTULO_DO_ESPACO[espaco.tipo]}${espaco.item !== null ? ` ${espaco.item}` : ''}`,
                )
                .join('; ')}
              {semImagem.length > 6 ? '; …' : ''})
            </span>
          </p>
          <p className="m-0 mt-1 text-[13px] font-semibold leading-snug text-muted">
            Abra o bloco e use “Enviar nova imagem” ou “Escolher da biblioteca”. Até lá o aluno
            vê o quadro desenhado.{' '}
            <Link href="/admin/midia/pendencias" className="font-extrabold text-link">
              Ver todas as pendências
            </Link>
          </p>
        </div>
      ) : null}
      <EditorDePaginas
      aulaId={aula.id}
      numero={aula.number}
      paginasIniciais={dados.paginas}
      hashBase={dados.hashBase}
      temRascunho={dados.temRascunho}
      publicada={aula.estado === 'publicada'}
      versaoAtual={dados.versaoAtual}
      idsUsados={dados.contexto.idsUsados}
      respostasPorBloco={dados.respostas}
      idsDeOutrasAulas={[...dados.contexto.idsDeOutrasAulas]}
      aulasExistentes={dados.contexto.aulasExistentes}
      mediaDePaginas={dados.contexto.mediaDePaginas}
      relatorio={dados.relatorio}
      salvarAction={salvarRascunhoAction}
      descartarAction={descartarRascunhoAction}
      publicarAction={publicarRascunhoAction}
      />
    </>
  );
}
