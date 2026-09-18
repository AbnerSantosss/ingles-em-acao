/**
 * A tela de resumo antes de publicar — BACKOFFICE §3.5 e §6.4, regra 6.
 *
 * Mostra, com números reais do banco: o que muda, quem é afetado e o que
 * acontece com o progresso de cada um. Erro bloqueia; aviso e impacto exigem
 * uma caixa marcada. O servidor refaz o relatório inteiro na hora de publicar
 * e só aceita se o rascunho ainda for o mesmo (hash).
 */
'use client';

import { useActionState } from 'react';

import type { EstadoDoEditor } from '@/lib/admin/editor';
import { ESTADO_INICIAL_DO_EDITOR } from '@/lib/admin/editor';
import type { RelatorioDePublicacao } from '@/lib/admin/publicacao';

import { BotaoEnviar, COR_AVISO, ListaDeProblemas, RecadoDoEditor } from './ui';

type AcaoDoEditor = (estado: EstadoDoEditor, dados: FormData) => Promise<EstadoDoEditor>;

function Numero({ valor, rotulo }: { valor: number | string; rotulo: string }) {
  return (
    <div className="rounded-[16px] bg-[#F4F7FB] px-3 py-2.5">
      <p className="m-0 text-[20px] font-black leading-none text-navy">{valor}</p>
      <p className="m-0 mt-1 text-[12px] font-extrabold uppercase tracking-[0.06em] text-muted">
        {rotulo}
      </p>
    </div>
  );
}

export function PainelDePublicacao({
  aulaId,
  relatorio,
  temRascunho,
  publicada,
  versaoAtual,
  mudancasNaoSalvas,
  publicarAction,
}: {
  aulaId: string;
  relatorio: RelatorioDePublicacao | null;
  temRascunho: boolean;
  /** `Lesson.published`: a aula está no ar para o aluno. */
  publicada: boolean;
  versaoAtual: number;
  /** Há edição local ainda não salva: publicar agora publicaria outra coisa. */
  mudancasNaoSalvas: boolean;
  publicarAction: AcaoDoEditor;
}) {
  const [estado, acao] = useActionState(publicarAction, ESTADO_INICIAL_DO_EDITOR);

  if (!temRascunho || !relatorio) {
    return (
      <div className="flex flex-col gap-3">
        <RecadoDoEditor estado={estado} />
        <p className="m-0 text-[14px] font-semibold leading-snug text-muted">
          Não há rascunho pendente: o editor mostra o conteúdo publicado (versão {versaoAtual}).
          Salve uma alteração para poder publicá-la.
        </p>
      </div>
    );
  }

  const d = relatorio.diferencas;
  const bloqueado = relatorio.erros.length > 0 || mudancasNaoSalvas;

  return (
    <form action={acao} className="flex flex-col gap-4">
      <input type="hidden" name="aulaId" value={aulaId} />
      <input type="hidden" name="hash" value={relatorio.hash} />

      <div>
        <p className="m-0 text-[17px] font-black text-navy">
          Publicar rascunho como versão {relatorio.proximaVersao}
        </p>
        <p className="m-0 mt-1 text-[14px] font-semibold leading-snug text-muted">
          Resumo: {relatorio.resumo || '—'}. Hoje o aluno vê a versão {relatorio.versaoAtual}.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Numero valor={`${d.paginasAntes} → ${d.paginasDepois}`} rotulo="páginas" />
        <Numero valor={d.exerciciosNovos.length} rotulo="exercícios novos" />
        <Numero valor={d.exerciciosRemovidos.length} rotulo="exercícios removidos" />
        <Numero valor={d.exerciciosAlterados.length} rotulo="exercícios alterados" />
      </div>

      <ListaDeProblemas
        titulo={`Erros que bloqueiam a publicação (${relatorio.erros.length})`}
        itens={relatorio.erros}
        tom="erro"
      />

      <section
        aria-labelledby="impacto-titulo"
        className="flex flex-col gap-2 rounded-[18px] border-[1.5px] border-solid p-4"
        style={{ borderColor: COR_AVISO.borda, background: '#FFFCF2' }}
      >
        <p id="impacto-titulo" className="kicker m-0">
          Impacto nos alunos
        </p>
        <ul className="m-0 flex list-disc flex-col gap-1.5 pl-5 text-[14px] font-bold leading-snug text-navy">
          {relatorio.impacto.map((frase, i) => (
            <li key={i}>{frase}</li>
          ))}
        </ul>
        {relatorio.removidos.length > 0 || relatorio.alterados.length > 0 ? (
          <div className="mt-1 overflow-x-auto">
            <table className="w-full border-collapse text-left text-[13px]">
              <thead>
                <tr className="text-muted">
                  <th className="py-1 pr-3 font-extrabold">Exercício</th>
                  <th className="py-1 pr-3 font-extrabold">Mudança</th>
                  <th className="py-1 pr-3 font-extrabold">Página (publicada)</th>
                  <th className="py-1 font-extrabold">Alunos que responderam</th>
                </tr>
              </thead>
              <tbody>
                {relatorio.removidos.map((b) => (
                  <tr key={`r-${b.id}`} className="border-t border-solid border-border">
                    <td className="py-1.5 pr-3 font-mono font-bold text-navy">
                      {b.id} <span className="text-muted">({b.t})</span>
                    </td>
                    <td className="py-1.5 pr-3 font-extrabold" style={{ color: '#B21F31' }}>
                      removido
                    </td>
                    <td className="py-1.5 pr-3 font-bold text-navy">{b.pagina + 1}</td>
                    <td className="py-1.5 font-black text-navy">{b.alunos}</td>
                  </tr>
                ))}
                {relatorio.alterados.map((b) => (
                  <tr key={`a-${b.id}`} className="border-t border-solid border-border">
                    <td className="py-1.5 pr-3 font-mono font-bold text-navy">
                      {b.id} <span className="text-muted">({b.t})</span>
                    </td>
                    <td className="py-1.5 pr-3 font-extrabold" style={{ color: '#6B520A' }}>
                      alterado
                    </td>
                    <td className="py-1.5 pr-3 font-bold text-navy">{b.pagina + 1}</td>
                    <td className="py-1.5 font-black text-navy">{b.alunos}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
        <p className="m-0 text-[12px] font-bold leading-snug text-muted">
          Nenhuma resposta é apagada. Aula concluída continua concluída. Nota (score/total) é cache e
          é recalculada. {relatorio.alunosComProgresso} aluno(s) com progresso nesta aula.
        </p>
      </section>

      {relatorio.avisos.length > 0 ? (
        <div className="flex flex-col gap-2">
          <ListaDeProblemas
            titulo={`Avisos (${relatorio.avisos.length})`}
            itens={relatorio.avisos}
            tom="aviso"
          />
          <label className="flex min-h-11 cursor-pointer items-center gap-3 text-[14px] font-bold text-navy">
            <input type="checkbox" name="confirmarAvisos" value="sim" className="size-5 accent-navy" />
            Revisei os avisos e quero publicar mesmo assim.
          </label>
        </div>
      ) : null}

      {relatorio.exigeConfirmacaoDeImpacto ? (
        <label className="flex min-h-11 cursor-pointer items-center gap-3 text-[14px] font-bold text-navy">
          <input type="checkbox" name="confirmarImpacto" value="sim" className="size-5 accent-navy" />
          Li o impacto nos alunos descrito acima.
        </label>
      ) : null}

      {mudancasNaoSalvas ? (
        <p
          className="m-0 rounded-field px-3 py-2 text-[14px] font-bold leading-snug"
          style={{ background: COR_AVISO.fundo, color: COR_AVISO.texto }}
        >
          Há alterações no editor que ainda não foram salvas. Salve o rascunho primeiro — este
          relatório é do rascunho gravado.
        </p>
      ) : null}

      <RecadoDoEditor estado={estado} />

      <div className="flex flex-wrap items-center gap-3">
        <BotaoEnviar variant="accent" disabled={bloqueado}>
          Publicar versão {relatorio.proximaVersao}
        </BotaoEnviar>
        {!publicada ? (
          <p className="m-0 text-[13px] font-bold leading-snug text-muted">
            A aula está fora do ar. Publicar a versão atualiza o conteúdo; colocar a aula no ar é
            na aba Dados.
          </p>
        ) : null}
      </div>
    </form>
  );
}
