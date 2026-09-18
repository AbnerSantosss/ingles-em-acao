/**
 * A parte interativa de `/admin/modulos`.
 *
 * ⚠️ `'use client'` aqui porque existe interatividade de verdade: abrir e fechar
 * o formulário de edição, confirmar o arquivamento e mostrar o estado de cada
 * envio (`useActionState`). A leitura dos módulos continua no Server Component
 * ao lado — este arquivo não fala com o banco, só com as Server Actions.
 */
'use client';

import { useActionState, useState } from 'react';
import { useFormStatus } from 'react-dom';

import { Button } from '@/components/ui/Button';
import { Field } from '@/components/ui/Field';
import { Input } from '@/components/ui/Input';
import type { ModuloDoPainel } from '@/lib/admin/modulos';

import {
  arquivarModuloAction,
  atualizarModuloAction,
  criarModuloAction,
  moverModuloAction,
  restaurarModuloAction,
} from './actions';
import { FORMULARIO_INICIAL, type EstadoDoFormulario } from './tipos';

// ───────────────────────────── peças pequenas ────────────────────────────

/** A resposta da última tentativa, em texto. Erro nunca é só cor. */
function Recado({ estado }: { estado: EstadoDoFormulario }) {
  if (estado.estado === 'inicial') return null;

  const erro = estado.estado === 'erro';
  return (
    <p
      role="status"
      className="m-0 rounded-field px-3 py-2 text-[14px] font-bold leading-snug"
      style={
        erro
          ? { background: '#FEF0F2', color: '#B21F31' }
          : { background: '#E4F5EA', color: '#136B45' }
      }
    >
      {estado.mensagem}
    </p>
  );
}

/** Botão de envio que sabe que o formulário está no ar. */
function Enviar({
  children,
  variant = 'primary',
  ...props
}: {
  children: React.ReactNode;
  variant?: 'primary' | 'accent' | 'ghost' | 'danger';
  name?: string;
  value?: string;
  'aria-label'?: string;
  disabled?: boolean;
}) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="md" variant={variant} loading={pending} {...props}>
      {children}
    </Button>
  );
}

function erroDoCampo(estado: EstadoDoFormulario, campo: string): string | undefined {
  if (estado.estado !== 'erro') return undefined;
  return estado.campos?.[campo];
}

// ────────────────────────── formulário do módulo ─────────────────────────

type DadosIniciais = { id?: number; title: string; fromLesson: number; toLesson: number };

/**
 * O mesmo formulário serve para criar e para editar — os campos editáveis são os
 * mesmos. Quem muda é a action e o `id` escondido.
 */
function FormularioDeModulo({
  inicial,
  acao,
  rotulo,
  aoFechar,
}: {
  inicial: DadosIniciais;
  acao: (estado: EstadoDoFormulario, dados: FormData) => Promise<EstadoDoFormulario>;
  rotulo: string;
  aoFechar?: () => void;
}) {
  const [estado, enviar] = useActionState(acao, FORMULARIO_INICIAL);

  return (
    <form action={enviar} className="flex flex-col gap-4">
      {inicial.id !== undefined ? (
        <input type="hidden" name="id" value={inicial.id} />
      ) : null}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-[2fr_1fr_1fr]">
        <Field label="Título" required error={erroDoCampo(estado, 'title')}>
          <Input
            name="title"
            defaultValue={inicial.title}
            maxLength={80}
            autoComplete="off"
            placeholder="Fundamentos"
          />
        </Field>

        <Field label="Da aula" required error={erroDoCampo(estado, 'fromLesson')}>
          <Input
            name="fromLesson"
            type="number"
            inputMode="numeric"
            min={1}
            max={999}
            defaultValue={inicial.fromLesson}
          />
        </Field>

        <Field label="Até a aula" required error={erroDoCampo(estado, 'toLesson')}>
          <Input
            name="toLesson"
            type="number"
            inputMode="numeric"
            min={1}
            max={999}
            defaultValue={inicial.toLesson}
          />
        </Field>
      </div>

      <p className="m-0 text-[13px] font-semibold leading-snug text-muted">
        A faixa é descritiva: ela não move aula nenhuma. Quem liga uma aula a um módulo é a
        tela de Aulas — se os dois discordarem, o aviso aparece aqui na lista.
      </p>

      <Recado estado={estado} />

      <div className="flex flex-wrap items-center gap-3">
        <Enviar>{rotulo}</Enviar>
        {aoFechar ? (
          <Button type="button" size="md" variant="ghost" onClick={aoFechar}>
            Fechar
          </Button>
        ) : null}
      </div>
    </form>
  );
}

// ──────────────────────────── linha da lista ─────────────────────────────

function Etiqueta({ children, tom }: { children: React.ReactNode; tom: 'aviso' | 'neutro' }) {
  return (
    <span
      className="inline-block rounded-pill px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-[0.08em]"
      style={
        tom === 'aviso'
          ? { background: '#FEF7E0', color: '#6B520A' }
          : { background: '#EEF3FA', color: '#5B6B86' }
      }
    >
      {children}
    </span>
  );
}

function LinhaDeModulo({
  modulo,
  primeiro,
  ultimo,
}: {
  modulo: ModuloDoPainel;
  primeiro: boolean;
  ultimo: boolean;
}) {
  const [editando, setEditando] = useState(false);
  const [confirmando, setConfirmando] = useState(false);

  const [estadoMover, mover] = useActionState(moverModuloAction, FORMULARIO_INICIAL);
  const [estadoArquivar, arquivar] = useActionState(arquivarModuloAction, FORMULARIO_INICIAL);
  const [estadoRestaurar, restaurar] = useActionState(restaurarModuloAction, FORMULARIO_INICIAL);

  const podeArquivar = modulo.aulas === 0;

  return (
    <li className="rounded-[18px] border border-solid border-border p-4">
      <div className="flex flex-wrap items-start gap-4">
        <span
          aria-hidden="true"
          className="grid h-11 w-11 flex-none place-items-center rounded-field bg-[#F1F5FA] text-[17px] font-black text-navy"
        >
          {modulo.order}
        </span>

        <div className="min-w-0 flex-1">
          <h3 className="m-0 text-[17px] font-black leading-tight text-navy">
            {modulo.title}{' '}
            {modulo.arquivado ? <Etiqueta tom="neutro">Arquivado</Etiqueta> : null}
          </h3>
          <p className="m-0 mt-1 text-[13px] font-semibold leading-snug text-muted">
            Aulas {modulo.fromLesson}–{modulo.toLesson} · {modulo.aulas} aula(s) neste módulo ·
            id {modulo.id}
          </p>
          {modulo.divergencia ? (
            <p className="m-0 mt-1.5 text-[13px] font-bold leading-snug" style={{ color: '#6B520A' }}>
              ⚠ {modulo.divergencia}.
            </p>
          ) : null}
        </div>

        <div className="flex flex-none flex-wrap items-center gap-2">
          <form action={mover} className="flex items-center gap-2">
            <input type="hidden" name="id" value={modulo.id} />
            <Enviar
              variant="ghost"
              name="direcao"
              value="sobe"
              aria-label={`Mover "${modulo.title}" para cima`}
              disabled={primeiro}
            >
              ↑
            </Enviar>
            <Enviar
              variant="ghost"
              name="direcao"
              value="desce"
              aria-label={`Mover "${modulo.title}" para baixo`}
              disabled={ultimo}
            >
              ↓
            </Enviar>
          </form>

          <Button
            type="button"
            size="md"
            variant="ghost"
            aria-expanded={editando}
            onClick={() => setEditando((aberto) => !aberto)}
          >
            {editando ? 'Cancelar' : 'Editar'}
          </Button>

          {modulo.arquivado ? (
            <form action={restaurar}>
              <input type="hidden" name="id" value={modulo.id} />
              <Enviar variant="ghost">Restaurar</Enviar>
            </form>
          ) : (
            <Button
              type="button"
              size="md"
              variant="ghost"
              aria-expanded={confirmando}
              disabled={!podeArquivar}
              title={
                podeArquivar
                  ? undefined
                  : 'Mova as aulas deste módulo antes de arquivá-lo (BACKOFFICE §6.1).'
              }
              onClick={() => setConfirmando((aberto) => !aberto)}
            >
              Arquivar
            </Button>
          )}
        </div>
      </div>

      <div className="mt-3 flex flex-col gap-2 empty:mt-0">
        <Recado estado={estadoMover} />
        <Recado estado={estadoArquivar} />
        <Recado estado={estadoRestaurar} />
      </div>

      {editando ? (
        <div className="mt-4 border-t border-solid border-border pt-4">
          <FormularioDeModulo
            inicial={{
              id: modulo.id,
              title: modulo.title,
              fromLesson: modulo.fromLesson,
              toLesson: modulo.toLesson,
            }}
            acao={atualizarModuloAction}
            rotulo="Salvar módulo"
            aoFechar={() => setEditando(false)}
          />
        </div>
      ) : null}

      {confirmando && !modulo.arquivado ? (
        <form action={arquivar} className="mt-4 flex flex-col gap-3 border-t border-solid border-border pt-4">
          <input type="hidden" name="id" value={modulo.id} />
          <p className="m-0 text-[14px] font-semibold leading-snug text-muted">
            Arquivar esconde o módulo do painel e da trilha, mas <strong>não apaga nada</strong>:
            a linha continua no banco e pode ser restaurada.
          </p>
          <Field label="Motivo (opcional)" hint="Fica registrado na auditoria.">
            <Input name="motivo" maxLength={140} autoComplete="off" placeholder="Reorganização do curso" />
          </Field>
          <div className="flex flex-wrap gap-3">
            <Enviar variant="danger">Arquivar módulo</Enviar>
            <Button type="button" size="md" variant="ghost" onClick={() => setConfirmando(false)}>
              Cancelar
            </Button>
          </div>
        </form>
      ) : null}
    </li>
  );
}

// ──────────────────────────────── a lista ────────────────────────────────

export function PainelDeModulos({ modulos }: { modulos: ModuloDoPainel[] }) {
  const [criando, setCriando] = useState(false);

  const ativos = modulos.filter((modulo) => !modulo.arquivado);
  const proximaAula =
    modulos.length === 0 ? 1 : Math.max(...modulos.map((modulo) => modulo.toLesson)) + 1;

  return (
    <div className="flex flex-col gap-4">
      {modulos.length === 0 ? (
        <p className="m-0 text-[14px] font-semibold leading-snug text-muted">
          Nenhum módulo cadastrado. O seed cria os 7 do curso; aqui dá para criar outros.
        </p>
      ) : (
        <ul className="m-0 flex list-none flex-col gap-3 p-0">
          {modulos.map((modulo) => (
            <LinhaDeModulo
              key={modulo.id}
              modulo={modulo}
              primeiro={modulo.order === ativos[0]?.order}
              ultimo={modulo.order === ativos[ativos.length - 1]?.order}
            />
          ))}
        </ul>
      )}

      <div className="rounded-[18px] border border-dashed border-border p-4">
        {criando ? (
          <div className="flex flex-col gap-3">
            <h3 className="m-0 text-[15px] font-black text-navy">Novo módulo</h3>
            <FormularioDeModulo
              inicial={{ title: '', fromLesson: proximaAula, toLesson: proximaAula }}
              acao={criarModuloAction}
              rotulo="Criar módulo"
              aoFechar={() => setCriando(false)}
            />
          </div>
        ) : (
          <Button type="button" size="md" variant="ghost" onClick={() => setCriando(true)}>
            + Novo módulo
          </Button>
        )}
      </div>
    </div>
  );
}

export default PainelDeModulos;
