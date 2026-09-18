/**
 * As linhas de `/admin/aulas`, com seleção para publicar/despublicar em lote e
 * o "Duplicar" de cada aula.
 *
 * ⚠️ A seleção vale para a página que está na tela. Trocar de página ou de
 * filtro remonta este componente (a `key` vem do endereço) e zera a seleção —
 * um lote nunca leva aula que o admin não está vendo.
 *
 * O lote passa por uma confirmação que diz **quantas** e **quais** aulas vão
 * ser processadas e quais ficam de fora (e por quê). As regras de cada aula são
 * as do botão individual — é o mesmo núcleo no servidor — e o resultado volta
 * como relatório, aula por aula.
 */
'use client';

import Link from 'next/link';
import { useActionState, useState } from 'react';
import { useFormStatus } from 'react-dom';

import { Button } from '@/components/ui/Button';
import { Field } from '@/components/ui/Field';
import { Input } from '@/components/ui/Input';
import type { EstadoDaAula } from '@/lib/admin/aulas';

import { alterarPublicacaoEmLoteAction } from './actions';
import { DuplicarAula } from './DuplicarAula';
import {
  LOTE_INICIAL,
  type EstadoDoLote,
  type LinhaDoRelatorioDoLote,
  type OperacaoDoLote,
} from './tipos';

/** Uma linha da lista, já pronta para a tela (data formatada no servidor). */
export type LinhaDaTela = {
  id: string;
  number: number;
  code: string;
  slug: string;
  title: string;
  subtitle: string;
  estimatedTime: string;
  modulo: string;
  estado: EstadoDaAula;
  temCapa: boolean;
  temVideo: boolean;
  temRascunho: boolean;
  atualizadaEmIso: string;
  atualizadaEmTexto: string;
};

const CORES_DO_ESTADO: Record<EstadoDaAula, { fundo: string; cor: string; rotulo: string }> = {
  publicada: { fundo: '#E4F5EA', cor: '#136B45', rotulo: 'Publicada' },
  rascunho: { fundo: '#FEF7E0', cor: '#6B520A', rotulo: 'Rascunho' },
  arquivada: { fundo: '#EEF3FA', cor: '#5B6B86', rotulo: 'Arquivada' },
};

const CORES_DO_DESFECHO: Record<
  LinhaDoRelatorioDoLote['desfecho'],
  { fundo: string; cor: string; rotulo: string }
> = {
  publicada: { fundo: '#E4F5EA', cor: '#136B45', rotulo: 'Publicada' },
  despublicada: { fundo: '#EEF3FA', cor: '#5B6B86', rotulo: 'Despublicada' },
  bloqueada: { fundo: '#FEF0F2', cor: '#B21F31', rotulo: 'Bloqueada' },
};

const SELO = 'inline-block rounded-pill px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-[0.08em]';

function Selo({ fundo, cor, rotulo }: { fundo: string; cor: string; rotulo: string }) {
  return (
    <span className={SELO} style={{ background: fundo, color: cor }}>
      {rotulo}
    </span>
  );
}

function numeroComZero(numero: number | null): string {
  return numero === null ? '—' : String(numero).padStart(2, '0');
}

/**
 * Por que uma aula selecionada **não** entra no lote — ou `null` se entra.
 *
 * É só a triagem da tela, com o estado que a lista mostra; o servidor confere
 * de novo, aula por aula, na hora de gravar.
 */
function foraDoLote(aula: LinhaDaTela, operacao: OperacaoDoLote): string | null {
  if (operacao === 'publicar') {
    if (aula.estado === 'publicada') return 'já está no ar';
    if (aula.estado === 'arquivada') return 'arquivada — restaure antes de publicar';
    return null;
  }
  if (aula.estado === 'rascunho') return 'já está fora do ar';
  if (aula.estado === 'arquivada') return 'arquivada — já está fora do ar';
  return null;
}

// ───────────────────────────── confirmação ───────────────────────────────

function EnviarLote({ operacao, total }: { operacao: OperacaoDoLote; total: number }) {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      size="md"
      variant={operacao === 'publicar' ? 'primary' : 'danger'}
      loading={pending}
      loadingLabel={operacao === 'publicar' ? 'Publicando…' : 'Despublicando…'}
      disabled={total === 0}
    >
      {operacao === 'publicar' ? 'Publicar' : 'Despublicar'} {total} aula(s)
    </Button>
  );
}

function Confirmacao({
  operacao,
  marcadas,
  estado,
  enviar,
  aoCancelar,
}: {
  operacao: OperacaoDoLote;
  marcadas: LinhaDaTela[];
  estado: EstadoDoLote;
  enviar: (dados: FormData) => void;
  aoCancelar: () => void;
}) {
  const entram = marcadas.filter((aula) => foraDoLote(aula, operacao) === null);
  const ficam = marcadas
    .map((aula) => ({ aula, motivo: foraDoLote(aula, operacao) }))
    .filter((item): item is { aula: LinhaDaTela; motivo: string } => item.motivo !== null);
  const publicar = operacao === 'publicar';

  return (
    <form
      action={enviar}
      aria-label={publicar ? 'Confirmar publicação em lote' : 'Confirmar despublicação em lote'}
      className="flex flex-col gap-3 rounded-[18px] border border-solid p-4"
      style={
        publicar
          ? { borderColor: '#CFE0FA', background: '#F5F9FF' }
          : { borderColor: '#F9D3D9', background: '#FFF8F9' }
      }
    >
      <input type="hidden" name="operacao" value={operacao} />
      {entram.map((aula) => (
        <input key={aula.id} type="hidden" name="ids" value={aula.id} />
      ))}

      <h3
        className="m-0 text-[15px] font-black tracking-[-0.01em]"
        style={{ color: publicar ? '#0A1F4E' : '#B21F31' }}
      >
        {entram.length === 0
          ? `Nenhuma das ${marcadas.length} aula(s) selecionada(s) pode ser ${publicar ? 'publicada' : 'despublicada'}.`
          : `${publicar ? 'Publicar' : 'Despublicar'} ${entram.length} aula(s)?`}
      </h3>

      <p className="m-0 text-[14px] font-semibold leading-snug text-muted">
        {publicar
          ? 'Cada aula passa pela mesma conferência do botão “Publicar aula”: o esquema e a validação da §3.5. A que não passar fica fora do ar e aparece no relatório com o motivo — as outras vão ao ar normalmente. O rascunho pendente da aba Páginas não entra no ar por aqui.'
          : 'Cada aula sai da trilha e o endereço passa a responder 404. O progresso de quem já fez continua guardado, e nenhuma conclusão é desfeita.'}
      </p>

      {entram.length > 0 ? (
        <ol className="m-0 flex list-none flex-col gap-1 p-0" aria-label="Aulas do lote">
          {entram.map((aula) => (
            <li key={aula.id} className="text-[14px] font-bold leading-snug text-navy">
              Aula {numeroComZero(aula.number)} · {aula.title}
            </li>
          ))}
        </ol>
      ) : null}

      {ficam.length > 0 ? (
        <div>
          <p className="m-0 text-[13px] font-extrabold uppercase tracking-[0.1em] text-muted">
            Ficam de fora ({ficam.length})
          </p>
          <ul className="m-0 mt-1 flex list-none flex-col gap-1 p-0">
            {ficam.map(({ aula, motivo }) => (
              <li key={aula.id} className="text-[14px] font-semibold leading-snug text-muted">
                Aula {numeroComZero(aula.number)} · {aula.title} — {motivo}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {!publicar && entram.length > 0 ? (
        <Field label="Motivo (opcional)" hint="Fica registrado na auditoria de cada aula.">
          <Input name="motivo" maxLength={140} autoComplete="off" placeholder="Revisão de conteúdo" />
        </Field>
      ) : null}

      {estado.estado === 'erro' ? (
        <p
          role="status"
          className="m-0 rounded-field px-3 py-2 text-[14px] font-bold leading-snug"
          style={{ background: '#FEF0F2', color: '#B21F31' }}
        >
          {estado.mensagem}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <EnviarLote operacao={operacao} total={entram.length} />
        <Button type="button" size="md" variant="ghost" onClick={aoCancelar}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}

// ────────────────────────────── relatório ────────────────────────────────

function Relatorio({
  estado,
  aoFechar,
}: {
  estado: Extract<EstadoDoLote, { estado: 'ok' }>;
  aoFechar: () => void;
}) {
  const bloqueou = estado.relatorio.some((linha) => linha.desfecho === 'bloqueada');
  return (
    <section
      aria-label="Relatório do lote"
      className="flex flex-col gap-3 rounded-[18px] border border-solid p-4"
      style={
        bloqueou
          ? { borderColor: '#F9D3D9', background: '#FFF8F9' }
          : { borderColor: '#BFE5CD', background: '#F4FBF6' }
      }
    >
      <p role="status" className="m-0 text-[15px] font-black leading-snug text-navy">
        {estado.operacao === 'publicar' ? 'Publicar em lote' : 'Despublicar em lote'}:{' '}
        {estado.mensagem}
      </p>
      <ol className="m-0 flex list-none flex-col gap-2 p-0">
        {estado.relatorio.map((linha, indice) => (
          <li key={`${linha.numero ?? 'x'}-${indice}`} className="flex flex-col gap-1">
            <p className="m-0 flex flex-wrap items-center gap-2 text-[14px] font-bold leading-snug text-navy">
              <Selo {...CORES_DO_DESFECHO[linha.desfecho]} />
              <span>
                Aula {numeroComZero(linha.numero)} · {linha.titulo}
              </span>
              <span className="font-semibold text-muted">— {linha.motivo}</span>
            </p>
            {linha.erros.length > 0 ? (
              <ul className="m-0 flex flex-col gap-0.5 pl-5 text-[13px] font-semibold leading-snug text-danger">
                {linha.erros.map((erro, posicao) => (
                  <li key={posicao}>{erro}</li>
                ))}
                {linha.totalDeErros > linha.erros.length ? (
                  <li>
                    e mais {linha.totalDeErros - linha.erros.length} — veja todos na aba Páginas
                  </li>
                ) : null}
              </ul>
            ) : null}
            {linha.desfecho === 'publicada' && linha.avisos > 0 ? (
              <p className="m-0 pl-5 text-[12px] font-semibold leading-snug text-muted-2">
                {linha.avisos} aviso(s) de revisão da §3.5 — não bloqueiam.
              </p>
            ) : null}
          </li>
        ))}
      </ol>
      <div>
        <Button type="button" size="md" variant="ghost" onClick={aoFechar}>
          Fechar relatório
        </Button>
      </div>
    </section>
  );
}

// ──────────────────────────────── linha ──────────────────────────────────

function Linha({
  aula,
  marcada,
  bloqueada,
  aoMarcar,
}: {
  aula: LinhaDaTela;
  marcada: boolean;
  bloqueada: boolean;
  aoMarcar: (id: string) => void;
}) {
  const [duplicando, setDuplicando] = useState(false);

  return (
    <li
      className="rounded-[18px] border border-solid p-4"
      style={
        marcada
          ? { borderColor: '#9CC0F5', background: '#F5F9FF' }
          : { borderColor: 'var(--color-border, #E3EAF3)' }
      }
    >
      <div className="flex flex-wrap items-start gap-4">
        <input
          type="checkbox"
          checked={marcada}
          disabled={bloqueada}
          onChange={() => aoMarcar(aula.id)}
          aria-label={`Selecionar aula ${aula.number} · ${aula.title}`}
          className="mt-3 h-5 w-5 flex-none cursor-pointer accent-blue disabled:cursor-not-allowed"
        />

        <span
          aria-hidden="true"
          className="grid h-11 w-11 flex-none place-items-center rounded-field bg-[#F1F5FA] text-[17px] font-black text-navy"
        >
          {aula.number}
        </span>

        <div className="min-w-0 flex-1">
          <p className="m-0 flex flex-wrap items-center gap-2">
            <Link
              href={`/admin/aulas/${aula.number}`}
              className="text-[17px] font-black leading-tight text-navy underline-offset-4 hover:underline"
            >
              {aula.title}
            </Link>
            <Selo {...CORES_DO_ESTADO[aula.estado]} />
            {aula.temRascunho ? (
              <Selo fundo="#FEF7E0" cor="#6B520A" rotulo="Rascunho pendente" />
            ) : null}
            {aula.temCapa ? null : (
              <span className="text-[12px] font-bold text-muted-2">sem capa</span>
            )}
            {aula.temVideo ? null : (
              <span className="text-[12px] font-bold text-muted-2">sem vídeo</span>
            )}
          </p>
          <p className="m-0 mt-1 text-[13px] font-semibold leading-snug text-muted">
            {aula.code} · {aula.modulo} · {aula.estimatedTime} · /aula/{aula.slug}
          </p>
          {aula.subtitle ? (
            <p className="m-0 mt-1 truncate text-[13px] font-semibold leading-snug text-muted-2">
              {aula.subtitle}
            </p>
          ) : null}
        </div>

        <div className="flex flex-none flex-col items-end gap-1">
          <time dateTime={aula.atualizadaEmIso} className="text-[12px] font-semibold text-muted-2">
            {aula.atualizadaEmTexto}
          </time>
          {duplicando ? null : (
            <button
              type="button"
              onClick={() => setDuplicando(true)}
              className="cursor-pointer rounded-pill border-0 bg-transparent px-3 py-1 text-[13px] font-extrabold text-navy transition-colors duration-150 hover:bg-[#EAF2FE]"
            >
              Duplicar…
            </button>
          )}
        </div>
      </div>

      {duplicando ? (
        <div className="mt-4 border-0 border-t border-solid border-border pt-4">
          <DuplicarAula aula={aula} aoFechar={() => setDuplicando(false)} />
        </div>
      ) : null}
    </li>
  );
}

// ──────────────────────────────── a lista ────────────────────────────────

export function ListaDeAulas({ aulas }: { aulas: LinhaDaTela[] }) {
  const [selecionadas, setSelecionadas] = useState<ReadonlySet<string>>(() => new Set());
  const [confirmando, setConfirmando] = useState<OperacaoDoLote | null>(null);
  const [relatorioAberto, setRelatorioAberto] = useState(false);
  const [estado, enviar, processando] = useActionState(
    alterarPublicacaoEmLoteAction,
    LOTE_INICIAL,
  );

  // Resposta nova do servidor: fecha a confirmação, zera a seleção e abre o
  // relatório. Ajuste durante a renderização (e não num efeito), comparando com
  // a última resposta vista — o padrão do React para "estado que segue outro".
  const [estadoVisto, setEstadoVisto] = useState(estado);
  if (estado !== estadoVisto) {
    setEstadoVisto(estado);
    if (estado.estado === 'ok') {
      setSelecionadas(new Set());
      setConfirmando(null);
      setRelatorioAberto(true);
    }
  }

  // Só conta o que está na tela: uma aula que sumiu da lista (arquivada por
  // outra aba, página recarregada) não entra no lote às cegas.
  const marcadas = aulas.filter((aula) => selecionadas.has(aula.id));
  const todas = aulas.length > 0 && marcadas.length === aulas.length;
  const parcial = marcadas.length > 0 && !todas;

  function alternar(id: string) {
    setSelecionadas((atual) => {
      const nova = new Set(atual);
      if (nova.has(id)) nova.delete(id);
      else nova.add(id);
      return nova;
    });
  }

  function alternarTodas() {
    setSelecionadas(todas ? new Set() : new Set(aulas.map((aula) => aula.id)));
  }

  function limpar() {
    setSelecionadas(new Set());
    setConfirmando(null);
  }

  const relatorio =
    relatorioAberto && estado.estado === 'ok' ? (
      <Relatorio estado={estado} aoFechar={() => setRelatorioAberto(false)} />
    ) : null;

  // ⚠️ Lista vazia continua sendo este componente (e não um texto solto na
  // página): depois de um lote que tira todas as aulas do filtro — "Publicadas"
  // → despublicar todas —, a página volta sem linhas, e o relatório do lote mora
  // no estado daqui.
  if (aulas.length === 0) {
    return (
      <div className="flex flex-col gap-3">
        {relatorio}
        <p className="m-0 text-[14px] font-semibold leading-snug text-muted">
          Nenhuma aula bate com esses filtros.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-3 rounded-[18px] bg-[#F1F5FA] px-4 py-3">
        <label className="flex cursor-pointer items-center gap-2 text-[14px] font-extrabold text-navy">
          <input
            type="checkbox"
            checked={todas}
            disabled={processando || aulas.length === 0}
            ref={(elemento) => {
              if (elemento) elemento.indeterminate = parcial;
            }}
            onChange={alternarTodas}
            className="h-5 w-5 cursor-pointer accent-blue"
          />
          Selecionar todas desta página
        </label>
        <span className="text-[14px] font-semibold text-muted" aria-live="polite">
          {marcadas.length} selecionada(s)
        </span>
        <div className="ml-auto flex flex-wrap gap-2">
          <Button
            type="button"
            size="md"
            variant={confirmando === 'publicar' ? 'primary' : 'ghost'}
            disabled={marcadas.length === 0 || processando}
            onClick={() => setConfirmando('publicar')}
          >
            Publicar selecionadas…
          </Button>
          <Button
            type="button"
            size="md"
            variant={confirmando === 'despublicar' ? 'danger' : 'ghost'}
            disabled={marcadas.length === 0 || processando}
            onClick={() => setConfirmando('despublicar')}
          >
            Despublicar selecionadas…
          </Button>
          {marcadas.length > 0 ? (
            <Button type="button" size="md" variant="ghost" disabled={processando} onClick={limpar}>
              Limpar seleção
            </Button>
          ) : null}
        </div>
      </div>

      {confirmando !== null && marcadas.length > 0 ? (
        <Confirmacao
          operacao={confirmando}
          marcadas={marcadas}
          estado={estado}
          enviar={enviar}
          aoCancelar={() => setConfirmando(null)}
        />
      ) : null}

      {relatorio}

      <ul className="m-0 flex list-none flex-col gap-3 p-0">
        {aulas.map((aula) => (
          <Linha
            key={aula.id}
            aula={aula}
            marcada={selecionadas.has(aula.id)}
            bloqueada={processando}
            aoMarcar={alternar}
          />
        ))}
      </ul>
    </div>
  );
}

export default ListaDeAulas;
