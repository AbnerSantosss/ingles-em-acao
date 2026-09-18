/**
 * O vídeo padrão e o "aplicar às aulas sem configuração" — BACKOFFICE §2.6.
 *
 * Guardar o padrão **não** muda aula nenhuma: é o botão de aplicar que grava
 * linha a linha, e só nas aulas que estão sem vídeo. Separar os dois é o que
 * permite trocar o padrão sem varrer 42 aulas por engano.
 *
 * O padrão pode ser um link ou um arquivo enviado, como o vídeo de cada aula.
 */
'use client';

import { useActionState, useState } from 'react';
import { useFormStatus } from 'react-dom';

import type { Plano } from '@/components/lesson/blocks/interativos';
import { PainelDeVideo } from '@/components/lesson/PainelDeVideo';
import { Button } from '@/components/ui/Button';
import { Field } from '@/components/ui/Field';
import { Input } from '@/components/ui/Input';
import type { EstadoDoEnvio } from '@/lib/video/bucket';
import {
  descreverFonte,
  ehErroDeFonte,
  linkPublico,
  parseVideoSource,
  type VideoSource,
} from '@/lib/video/fonte';

import { aplicarPadraoAction, removerPadraoAction, salvarPadraoAction } from './actions';
import { SeletorDeModo, useArquivoDaPrevia, type ModoDoVideo } from './EditorDeVideo';
import { EnvioDeVideo } from './EnvioDeVideo';
import { FORMULARIO_INICIAL, type EstadoDoFormulario } from './tipos';

const PLANO_DA_PREVIA: Plano = 'COMPLETO';

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

export function PadraoDeVideo({
  padrao,
  descricao,
  semVideo,
  envio,
}: {
  padrao: VideoSource | null;
  /** Como descrever o padrão guardado — com o nome do arquivo, quando é upload. */
  descricao: string | null;
  /** Quantas aulas estão sem vídeo nenhum — as que o "aplicar" atinge. */
  semVideo: number;
  envio: EstadoDoEnvio;
}) {
  const [modo, setModo] = useState<ModoDoVideo>(() =>
    padrao?.kind === 'upload' ? 'arquivo' : 'link',
  );
  const [bruto, setBruto] = useState(() => (padrao ? (linkPublico(padrao) ?? '') : ''));

  const [estadoSalvar, salvar] = useActionState(salvarPadraoAction, FORMULARIO_INICIAL);
  const [estadoAplicar, aplicar] = useActionState(aplicarPadraoAction, FORMULARIO_INICIAL);
  const [estadoRemover, remover] = useActionState(removerPadraoAction, FORMULARIO_INICIAL);

  const analisada = modo === 'link' && bruto.trim() !== '' ? parseVideoSource(bruto) : null;
  const erroAoDigitar = analisada !== null && ehErroDeFonte(analisada) ? analisada.erro : null;
  const previa = analisada !== null && !ehErroDeFonte(analisada) ? analisada : padrao;
  const arquivoDaPrevia = useArquivoDaPrevia(previa);

  const erroDoCampo = estadoSalvar.estado === 'erro' ? estadoSalvar.campos?.fonte : undefined;

  return (
    <div className="flex flex-col gap-4">
      <p className="m-0 max-w-[62ch] text-[14px] font-semibold leading-snug text-muted">
        {padrao
          ? `Padrão guardado: ${descricao ?? descreverFonte(padrao)}.`
          : 'Nenhum vídeo padrão guardado ainda.'}{' '}
        Guardar aqui não muda aula nenhuma — use o botão de aplicar para copiá-lo para as aulas que
        estão sem vídeo.
      </p>

      <div className="max-w-[460px]">
        {previa ? (
          <PainelDeVideo
            fonte={previa}
            plano={PLANO_DA_PREVIA}
            legenda="Pré-visualização do vídeo padrão"
            titulo="Pré-visualização do vídeo padrão"
            arquivo={arquivoDaPrevia}
          />
        ) : (
          <div className="grid min-h-[120px] place-items-center rounded-card border border-dashed border-border px-4 text-center">
            <p className="m-0 text-[14px] font-semibold leading-snug text-muted">
              {erroAoDigitar
                ? 'Nada para pré-visualizar: o endereço acima não foi aceito.'
                : 'Cole um endereço ou envie um arquivo para ver como ele fica na tela da aula.'}
            </p>
          </div>
        )}
      </div>

      <SeletorDeModo modo={modo} aoMudar={setModo} />

      {modo === 'arquivo' ? (
        <EnvioDeVideo
          destino={{ tipo: 'padrao' }}
          estado={envio}
          rotuloDoBotao="Enviar e guardar como padrão"
        />
      ) : (
      <form action={salvar} className="flex flex-col gap-3">
        <Field
          label="Endereço do vídeo padrão"
          error={erroDoCampo ?? erroAoDigitar ?? undefined}
          hint="Mesmas regras das aulas: YouTube, Vimeo ou arquivo .mp4/.webm por https."
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
          <Enviar>Guardar padrão</Enviar>
          <Recado estado={estadoSalvar} />
        </div>
      </form>
      )}

      <div className="flex flex-col gap-3 border-t border-border pt-4">
        <form action={aplicar} className="flex flex-wrap items-center gap-3">
          <Enviar variant="accent">
            {semVideo > 0 ? `Aplicar às ${semVideo} aula(s) sem vídeo` : 'Aplicar às aulas sem vídeo'}
          </Enviar>
          <Recado estado={estadoAplicar} />
        </form>

        {padrao ? (
          <form action={remover} className="flex flex-wrap items-center gap-3">
            <Enviar variant="ghost">Remover padrão</Enviar>
            <Recado estado={estadoRemover} />
          </form>
        ) : null}
      </div>
    </div>
  );
}
