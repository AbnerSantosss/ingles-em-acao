/**
 * Lista de versões publicadas de uma aula, com pré-visualização e
 * "Restaurar como rascunho" (motivo obrigatório, auditado).
 *
 * ⚠️ Restaurar **não publica**: grava `draftPages` e pronto.
 */
'use client';

import { useActionState, useState, useTransition } from 'react';

import { ESTADO_INICIAL_DO_EDITOR, type EstadoDoEditor } from '@/lib/admin/editor';
import type { Page } from '@/lib/content/blocks';

import { PreviaDaAula } from './PreviaDaAula';
import { BotaoEnviar, ListaDeProblemas, RecadoDoEditor } from './ui';

export type LinhaDeVersao = {
  id: string;
  version: number;
  /** Já formatada no servidor (pt-BR, horário de Brasília). */
  data: string;
  autor: string | null;
  resumo: string | null;
  paginas: number;
  title: string;
};

type VersaoCarregada =
  | { ok: true; version: number; pages: Page[] }
  | { ok: false; mensagem: string; erros?: string[] };

type AcaoDoEditor = (estado: EstadoDoEditor, dados: FormData) => Promise<EstadoDoEditor>;

export function ListaDeVersoes({
  aulaId,
  numero,
  versaoAtual,
  temRascunho,
  versoes,
  carregarVersao,
  restaurarAction,
}: {
  aulaId: string;
  numero: number;
  versaoAtual: number;
  temRascunho: boolean;
  versoes: LinhaDeVersao[];
  carregarVersao: (aulaId: string, versaoId: string) => Promise<VersaoCarregada>;
  restaurarAction: AcaoDoEditor;
}) {
  const [selecionada, setSelecionada] = useState<string | null>(null);
  const [carregada, setCarregada] = useState<VersaoCarregada | null>(null);
  const [pagina, setPagina] = useState(0);
  const [carregando, iniciar] = useTransition();
  const [estado, acao] = useActionState(restaurarAction, ESTADO_INICIAL_DO_EDITOR);

  function ver(id: string): void {
    setSelecionada(id);
    setCarregada(null);
    setPagina(0);
    iniciar(async () => {
      setCarregada(await carregarVersao(aulaId, id));
    });
  }

  if (versoes.length === 0) {
    return (
      <div className="rounded-[18px] border border-dashed border-border p-6 text-center">
        <p className="m-0 text-[15px] font-black text-navy">Nenhuma versão registrada ainda.</p>
        <p className="m-0 mt-1.5 text-[14px] font-semibold leading-snug text-muted">
          O conteúdo atual (versão {versaoAtual}) veio do seed. Na primeira publicação pela aba
          Páginas, ele é guardado aqui como versão {versaoAtual} e a nova vira a versão{' '}
          {versaoAtual + 1}.
        </p>
      </div>
    );
  }

  const linha = versoes.find((v) => v.id === selecionada) ?? null;

  return (
    <div className="flex flex-col gap-5">
      <RecadoDoEditor estado={estado} />

      <ol className="m-0 flex list-none flex-col gap-2 p-0" aria-label="Versões publicadas">
        {versoes.map((v) => {
          const ativa = v.id === selecionada;
          const emUso = v.version === versaoAtual;
          return (
            <li
              key={v.id}
              className="flex flex-wrap items-center gap-3 rounded-[18px] border-[1.5px] border-solid bg-surface p-3"
              style={{ borderColor: ativa ? '#1B6BE3' : '#E3EAF3' }}
            >
              <span className="grid min-h-11 min-w-11 place-items-center rounded-[12px] bg-[#EEF3FA] px-2 text-[15px] font-black text-navy">
                v{v.version}
              </span>
              <div className="min-w-0 flex-1">
                <p className="m-0 text-[14px] font-extrabold text-navy">
                  {v.resumo ?? 'sem resumo'}
                  {emUso ? (
                    <span
                      className="ml-2 inline-block rounded-pill px-2 py-0.5 text-[11px] font-extrabold uppercase tracking-[0.08em]"
                      style={{ background: '#E4F5EA', color: '#136B45' }}
                    >
                      publicada agora
                    </span>
                  ) : null}
                </p>
                <p className="m-0 mt-0.5 text-[13px] font-semibold text-muted">
                  {v.data} · {v.autor ?? 'sistema'} · {v.paginas} página(s) · “{v.title}”
                </p>
              </div>
              <button
                type="button"
                onClick={() => ver(v.id)}
                aria-pressed={ativa}
                className="min-h-11 rounded-pill bg-[#EEF3FA] px-4 text-[14px] font-extrabold text-navy"
              >
                {ativa ? 'Vendo' : 'Ver'}
              </button>
            </li>
          );
        })}
      </ol>

      {selecionada !== null && linha ? (
        <section
          aria-labelledby="versao-escolhida"
          className="flex flex-col gap-4 border-t border-solid border-border pt-5"
        >
          <h2 id="versao-escolhida" className="m-0 text-[20px] font-black text-navy">
            Versão {linha.version}
          </h2>

          {carregando || carregada === null ? (
            <p role="status" className="m-0 text-[14px] font-bold text-muted">
              Carregando a versão…
            </p>
          ) : carregada.ok ? (
            <PreviaDaAula
              paginas={carregada.pages.map((p) => ({ blocos: p.blocks }))}
              numero={numero}
              pagina={pagina}
              aoTrocarPagina={setPagina}
              faixa={`Versão ${carregada.version} · só visualização`}
            />
          ) : (
            <>
              <RecadoDoEditor estado={{ estado: 'erro', mensagem: carregada.mensagem }} />
              {carregada.erros ? <ListaDeProblemas itens={carregada.erros} tom="erro" /> : null}
            </>
          )}

          <form action={acao} className="flex flex-col gap-3 rounded-[18px] bg-[#F4F7FB] p-4">
            <input type="hidden" name="aulaId" value={aulaId} />
            <input type="hidden" name="versaoId" value={linha.id} />
            <p className="m-0 text-[15px] font-black text-navy">
              Restaurar a versão {linha.version} como rascunho
            </p>
            <p className="m-0 text-[14px] font-semibold leading-snug text-muted">
              Nada é publicado: a versão volta como rascunho na aba Páginas, e o aluno continua
              vendo a versão {versaoAtual} até alguém revisar o impacto e publicar.
            </p>
            <label className="flex flex-col gap-1.5">
              <span className="text-[13px] font-extrabold text-navy">Motivo (obrigatório)</span>
              <textarea
                name="motivo"
                required
                minLength={5}
                rows={2}
                className="w-full rounded-field border-[1.5px] border-solid border-border bg-surface p-3 text-[14px] text-navy"
              />
            </label>
            {temRascunho ? (
              <label className="flex min-h-11 cursor-pointer items-center gap-3 text-[14px] font-bold text-navy">
                <input
                  type="checkbox"
                  name="substituirRascunho"
                  value="sim"
                  required
                  className="size-5 accent-navy"
                />
                Esta aula já tem um rascunho. Entendo que ele será substituído.
              </label>
            ) : null}
            <div>
              <BotaoEnviar variant="primary" disabled={carregada !== null && !carregada.ok}>
                Restaurar como rascunho
              </BotaoEnviar>
            </div>
          </form>
        </section>
      ) : null}
    </div>
  );
}
