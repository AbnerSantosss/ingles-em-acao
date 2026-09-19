/**
 * Preview do editor — BACKOFFICE §3.4.
 *
 * ⚠️ **Não existe um segundo renderer.** Isto é o `BlockRenderer` do aluno,
 * dentro do `ProvedorEfemero`: as mesmas peças, o mesmo cartão de página, só
 * que com as interações guardadas em memória. Nada aqui grava
 * `ExerciseAnswer`, `LessonProgress` ou `StudyDay`.
 *
 * Três larguras (430 celular, 768 tablet, 1280 desktop). Em largura maior que
 * o painel, a rolagem horizontal fica dentro da moldura — nunca na página.
 */
'use client';

import { useState } from 'react';

import { BlockRenderer } from '@/components/lesson/BlockRenderer';
import { ProvedorEfemero } from '@/components/lesson/interacao';
import type { Block } from '@/lib/content/blocks';

const LARGURAS = [
  { px: 430, rotulo: 'Celular' },
  { px: 768, rotulo: 'Tablet' },
  { px: 1280, rotulo: 'Desktop' },
] as const;

type Largura = (typeof LARGURAS)[number]['px'];

/** Uma página do preview: bloco válido é renderizado; inválido vira aviso no lugar. */
export type PaginaDaPrevia = { blocos: Array<Block | null> };

export function PreviaDaAula({
  paginas,
  numero,
  pagina,
  aoTrocarPagina,
  faixa,
}: {
  paginas: PaginaDaPrevia[];
  /** Número da aula — entra nas chaves `mc:`/`cta:` do motor efêmero. */
  numero: number;
  pagina: number;
  aoTrocarPagina: (pagina: number) => void;
  /** Texto da faixa no topo ("RASCUNHO — o aluno ainda vê a versão publicada"). */
  faixa: string;
}) {
  const [largura, setLargura] = useState<Largura>(430);
  const total = paginas.length;
  const atual = Math.min(Math.max(pagina, 0), Math.max(total - 1, 0));
  const blocos = paginas[atual]?.blocos ?? [];

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="kicker m-0">Pré-visualização</p>
        <div role="group" aria-label="Largura da pré-visualização" className="flex gap-1.5">
          {LARGURAS.map((opcao) => {
            const ativa = opcao.px === largura;
            return (
              <button
                key={opcao.px}
                type="button"
                aria-pressed={ativa}
                onClick={() => setLargura(opcao.px)}
                className="min-h-11 rounded-pill px-3 text-[13px] font-extrabold transition-colors"
                style={
                  ativa
                    ? { background: '#0A1F4E', color: '#FFFFFF' }
                    : { background: '#EEF3FA', color: '#0A1F4E' }
                }
              >
                {opcao.rotulo} <span className="font-bold opacity-80">{opcao.px}</span>
              </button>
            );
          })}
        </div>
      </div>

      <p
        role="note"
        className="m-0 rounded-field px-3 py-2 text-center text-[12px] font-extrabold uppercase tracking-[0.08em]"
        style={{ background: '#FEF7E0', color: '#6B520A' }}
      >
        {faixa}
      </p>

      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => aoTrocarPagina(atual - 1)}
          disabled={atual <= 0}
          className="min-h-11 rounded-pill border-[1.5px] border-solid border-border bg-surface px-4 text-[14px] font-extrabold text-navy disabled:cursor-not-allowed disabled:opacity-50"
        >
          ← Anterior
        </button>
        <p className="m-0 text-[14px] font-extrabold text-navy" aria-live="polite">
          Página {total === 0 ? 0 : atual + 1} de {total}
        </p>
        <button
          type="button"
          onClick={() => aoTrocarPagina(atual + 1)}
          disabled={atual >= total - 1}
          className="min-h-11 rounded-pill border-[1.5px] border-solid border-border bg-surface px-4 text-[14px] font-extrabold text-navy disabled:cursor-not-allowed disabled:opacity-50"
        >
          Próxima →
        </button>
      </div>

      <div className="max-w-full overflow-x-auto rounded-[18px] bg-bg p-3">
        <div className="mx-auto" style={{ width: largura, maxWidth: largura }}>
          <ProvedorEfemero>
            <section
              aria-label={`Pré-visualização da página ${atual + 1}`}
              className="flex flex-col gap-4 rounded-card bg-surface px-4 py-[18px] shadow-[0_10px_34px_rgba(11,31,75,.06)]"
            >
              {blocos.length === 0 ? (
                <p className="m-0 text-[14px] font-bold text-muted">Página sem blocos.</p>
              ) : (
                blocos.map((bloco, i) =>
                  bloco === null ? (
                    <div
                      key={`${atual}-${i}`}
                      className="rounded-field border-[1.5px] border-dashed px-3 py-4 text-center text-[13px] font-extrabold"
                      style={{ borderColor: '#F9D3D9', background: '#FEF0F2', color: '#B21F31' }}
                    >
                      Bloco {i + 1} com erro. Corrija o JSON para ver aqui.
                    </div>
                  ) : (
                    <div key={`${atual}-${i}`}>
                      <BlockRenderer bloco={bloco} lessonId={numero} />
                    </div>
                  ),
                )
              )}
            </section>
          </ProvedorEfemero>
        </div>
      </div>
    </div>
  );
}
