/**
 * O editor de vídeo de uma aula — BACKOFFICE §2.6 e §4.3.
 *
 * Duas formas de pôr vídeo na aula, à escolha do admin: **colar um link**
 * (YouTube, Vimeo ou arquivo .mp4/.webm por https) ou **enviar o arquivo**
 * para o armazenamento do app (`EnvioDeVideo`). A última gravada vale.
 *
 * ⚠️ Dois formulários separados (salvar e remover), pelo mesmo motivo da aba de
 * dados das aulas: cada ação tem o seu envio, o seu recado e a sua linha de
 * auditoria.
 *
 * A pré-visualização usa **o componente do aluno** (`PainelDeVideo`), não uma
 * imitação. É o que impede o painel de aprovar um player e a aula entregar
 * outro. E ela roda no navegador enquanto o admin digita, com o **mesmo**
 * `parseVideoSource` que a action vai rodar no servidor — a checagem do cliente
 * é conveniência, a que vale é a de lá.
 */
'use client';

import { useActionState, useCallback, useState } from 'react';
import { useFormStatus } from 'react-dom';

import { QuadroDeEspecificacoes } from '@/components/admin/QuadroDeEspecificacoes';
import { PainelDeVideo, type ArquivoDoPainel } from '@/components/lesson/PainelDeVideo';
import { Button } from '@/components/ui/Button';
import { Field } from '@/components/ui/Field';
import { Input } from '@/components/ui/Input';
import { linhasDaEspecificacaoDeLink } from '@/lib/media/especificacoes';
import { NOME_DO_PLANO, type Plano } from '@/lib/planos';
import type { EstadoDoEnvio } from '@/lib/video/bucket';
import {
  ehErroDeFonte,
  HOSTS_ACEITOS,
  linkPublico,
  parseVideoSource,
  type VideoSource,
} from '@/lib/video/fonte';

import { removerVideoAction, salvarVideoAction, urlDoVideoEnviadoAction } from './actions';
import { EnvioDeVideo } from './EnvioDeVideo';
import { FORMULARIO_INICIAL, type EstadoDoFormulario } from './tipos';

export type ModoDoVideo = 'link' | 'arquivo';

/** A escolha "colar link" × "enviar arquivo". Compartilhada com o vídeo padrão. */
export function SeletorDeModo({
  modo,
  aoMudar,
}: {
  modo: ModoDoVideo;
  aoMudar: (modo: ModoDoVideo) => void;
}) {
  return (
    <div role="group" aria-label="Como pôr o vídeo" className="flex flex-wrap items-center gap-2">
      {(
        [
          { valor: 'link', rotulo: 'Colar link' },
          { valor: 'arquivo', rotulo: 'Enviar arquivo' },
        ] as const
      ).map((opcao) => (
        <button
          key={opcao.valor}
          type="button"
          onClick={() => aoMudar(opcao.valor)}
          aria-pressed={modo === opcao.valor}
          className={
            modo === opcao.valor
              ? 'h-10 rounded-pill bg-navy px-4 text-[14px] font-extrabold text-white'
              : 'h-10 rounded-pill border border-border px-4 text-[14px] font-extrabold text-navy hover:bg-[#EAF2FE]'
          }
        >
          {opcao.rotulo}
        </button>
      ))}
    </div>
  );
}

/**
 * O "como pedir o link" da pré-visualização de um arquivo enviado. Estável por
 * asset: o player pede de novo quando esta função muda.
 */
export function useArquivoDaPrevia(fonte: VideoSource | null): ArquivoDoPainel | undefined {
  const assetId = fonte?.kind === 'upload' ? fonte.assetId : null;
  const renovar = useCallback(
    () => (assetId ? urlDoVideoEnviadoAction(assetId) : Promise.resolve(null)),
    [assetId],
  );
  return assetId ? { renovar } : undefined;
}

export type AulaDoEditor = {
  id: string;
  code: string;
  title: string;
  fonte: VideoSource | null;
  refBruta: string | null;
  invalida: boolean;
  padrao: boolean;
  legada: boolean;
};

function Recado({ estado }: { estado: EstadoDoFormulario }) {
  if (estado.estado === 'inicial') return null;
  const erro = estado.estado === 'erro';
  return (
    <p
      role="status"
      className="m-0 rounded-field px-3 py-2 text-[14px] font-bold leading-snug"
      style={
        erro ? { background: '#FEF0F2', color: '#B21F31' } : { background: '#E4F5EA', color: '#136B45' }
      }
    >
      {estado.mensagem}
    </p>
  );
}

function Enviar({
  children,
  variant = 'primary',
}: {
  children: React.ReactNode;
  variant?: 'primary' | 'accent' | 'ghost' | 'danger';
}) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="md" variant={variant} loading={pending}>
      {children}
    </Button>
  );
}

export function EditorDeVideo({ aula, envio }: { aula: AulaDoEditor; envio: EstadoDoEnvio }) {
  const [modo, setModo] = useState<ModoDoVideo>(() =>
    aula.fonte?.kind === 'upload' ? 'arquivo' : 'link',
  );
  const [bruto, setBruto] = useState(
    () => (aula.fonte ? (linkPublico(aula.fonte) ?? '') : (aula.refBruta ?? '')),
  );
  const [planoDaPrevia, setPlanoDaPrevia] = useState<Plano>('PREMIUM');

  const [estadoSalvar, salvar] = useActionState(salvarVideoAction, FORMULARIO_INICIAL);
  const [estadoRemover, remover] = useActionState(removerVideoAction, FORMULARIO_INICIAL);

  const analisada = modo === 'link' && bruto.trim() !== '' ? parseVideoSource(bruto) : null;
  const erroAoDigitar = analisada !== null && ehErroDeFonte(analisada) ? analisada.erro : null;
  const previa = analisada !== null && !ehErroDeFonte(analisada) ? analisada : aula.fonte;
  const arquivoDaPrevia = useArquivoDaPrevia(previa);

  const erroDoCampo =
    estadoSalvar.estado === 'erro' ? estadoSalvar.campos?.fonte : undefined;

  return (
    <div className="flex flex-col gap-4">
      {aula.invalida ? (
        <p
          className="m-0 rounded-field px-3 py-2 text-[14px] font-bold leading-snug"
          style={{ background: '#FEF0F2', color: '#B21F31' }}
        >
          O valor gravado ({aula.refBruta}) não passa mais pela lista de origens permitidas. O aluno
          não vê vídeo nesta aula até alguém salvar um endereço válido.
        </p>
      ) : null}

      {aula.legada ? (
        <p className="m-0 text-[13px] font-semibold leading-snug text-muted">
          Este vídeo veio da coluna antiga <code>videoUrl</code>. Salvar aqui passa a aula para os
          campos novos.
        </p>
      ) : null}

      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[13px] font-extrabold tracking-[0.04em] text-muted uppercase">
            Ver como
          </span>
          {(['PREMIUM', 'ESSENCIAL'] as const).map((plano) => (
            <button
              key={plano}
              type="button"
              onClick={() => setPlanoDaPrevia(plano)}
              aria-pressed={planoDaPrevia === plano}
              className={
                planoDaPrevia === plano
                  ? 'h-9 rounded-pill bg-navy px-3 text-[13px] font-extrabold text-white'
                  : 'h-9 rounded-pill border border-border px-3 text-[13px] font-extrabold text-navy hover:bg-[#EAF2FE]'
              }
            >
              {NOME_DO_PLANO[plano]}
            </button>
          ))}
        </div>

        <div className="max-w-[460px]">
          {previa ? (
            <PainelDeVideo
              fonte={previa}
              plano={planoDaPrevia}
              legenda={`${aula.code} · ${aula.title}`}
              titulo={`Pré-visualização: ${aula.code}`}
              arquivo={arquivoDaPrevia}
            />
          ) : (
            <div className="grid min-h-[140px] place-items-center rounded-card border border-dashed border-border px-4 text-center">
              <p className="m-0 text-[14px] font-semibold leading-snug text-muted">
                {erroAoDigitar
                    ? 'Nada para pré-visualizar: o endereço acima não foi aceito.'
                    : 'Sem vídeo configurado. A tela da aula não mostra painel nenhum.'}
              </p>
            </div>
          )}
        </div>
      </div>

      <SeletorDeModo modo={modo} aoMudar={setModo} />

      {modo === 'arquivo' ? (
        <EnvioDeVideo destino={{ tipo: 'aula', id: aula.id }} estado={envio} />
      ) : (
      <form action={salvar} className="flex flex-col gap-3">
        <input type="hidden" name="id" value={aula.id} />
        <QuadroDeEspecificacoes
          titulo="Antes de colar · link de vídeo"
          linhas={linhasDaEspecificacaoDeLink(HOSTS_ACEITOS)}
        />
        <Field
          label="Endereço do vídeo"
          error={erroDoCampo ?? erroAoDigitar ?? undefined}
          hint="Cole o link do YouTube ou do Vimeo. Serve o link curto, o de compartilhar e o código de incorporação (do iframe, o painel guarda só o endereço). Um arquivo .mp4/.webm por https também entra."
        >
          <Input
            name="fonte"
            value={bruto}
            onChange={(evento) => setBruto(evento.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
            autoComplete="off"
            spellCheck={false}
            invalid={Boolean(erroDoCampo ?? erroAoDigitar)}
          />
        </Field>
        <div className="flex flex-wrap items-center gap-3">
          <Enviar>Salvar vídeo</Enviar>
          <Recado estado={estadoSalvar} />
        </div>
      </form>
      )}

      {aula.fonte || aula.refBruta ? (
        <form action={remover} className="flex flex-wrap items-center gap-3">
          <input type="hidden" name="id" value={aula.id} />
          <Enviar variant="danger">Remover vídeo</Enviar>
          <Recado estado={estadoRemover} />
        </form>
      ) : null}
    </div>
  );
}
