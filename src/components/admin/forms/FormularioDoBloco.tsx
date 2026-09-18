/**
 * Despachante: escolhe o formulário do tipo e liga ele ao texto JSON do bloco.
 *
 * O texto JSON continua sendo a única fonte da verdade (`BlocoLocal.texto`). O
 * formulário lê dele a cada render e devolve o objeto inteiro, que volta a ser
 * texto via `serializar` — alternar entre formulário e JSON nunca perde dado.
 */
'use client';

import { useMemo, type ComponentType } from 'react';

import { COR_AVISO } from '@/components/admin/editor/ui';
import type { TipoDeBloco } from '@/lib/admin/editor';

import { FormularioBadge } from './FormularioBadge';
import { FormularioCards } from './FormularioCards';
import { FormularioCheck } from './FormularioCheck';
import { FormularioCta } from './FormularioCta';
import { FormularioFill } from './FormularioFill';
import { FormularioFree } from './FormularioFree';
import { FormularioImage } from './FormularioImage';
import { FormularioNext } from './FormularioNext';
import { FormularioNote } from './FormularioNote';
import { FormularioObjective } from './FormularioObjective';
import { FormularioProfile } from './FormularioProfile';
import { FormularioRule } from './FormularioRule';
import { FormularioSteps } from './FormularioSteps';
import { FormularioTitle } from './FormularioTitle';
import { lerObjeto, serializar, type Objeto } from './objeto';
import type { PropsDoFormulario } from './tipos';
import { validarFormulario } from './validacao';

const FORMULARIOS = {
  title: FormularioTitle,
  badge: FormularioBadge,
  image: FormularioImage,
  note: FormularioNote,
  objective: FormularioObjective,
  cards: FormularioCards,
  steps: FormularioSteps,
  profile: FormularioProfile,
  rule: FormularioRule,
  free: FormularioFree,
  fill: FormularioFill,
  cta: FormularioCta,
  next: FormularioNext,
  check: FormularioCheck,
} as const satisfies Partial<Record<TipoDeBloco, ComponentType<PropsDoFormulario>>>;

export type TipoComFormulario = keyof typeof FORMULARIOS;

/** Os 14 tipos com formulário (todos os que levam imagem entre eles); os outros continuam só no modo JSON. */
export const TIPOS_COM_FORMULARIO = Object.keys(FORMULARIOS) as readonly TipoComFormulario[];

export function temFormulario(t: string): t is TipoComFormulario {
  return Object.hasOwn(FORMULARIOS, t);
}

export function FormularioDoBloco({
  t,
  id,
  texto,
  alunos,
  aoEditar,
}: {
  t: TipoComFormulario;
  id?: string;
  texto: string;
  alunos: number;
  aoEditar: (texto: string) => void;
}) {
  const objeto = useMemo(() => lerObjeto(texto), [texto]);
  const erros = useMemo(
    () => (objeto === null ? null : validarFormulario(t, id, objeto)),
    [t, id, objeto],
  );

  if (objeto === null || erros === null) {
    return (
      <p
        className="m-0 rounded-field border-[1.5px] border-solid px-3 py-2.5 text-[13px] font-bold leading-snug"
        style={{ background: COR_AVISO.fundo, borderColor: COR_AVISO.borda, color: COR_AVISO.texto }}
      >
        O texto do bloco não é um objeto JSON legível, então o formulário não pode abri-lo sem
        arriscar perder conteúdo. Corrija no modo JSON.
      </p>
    );
  }

  const Formulario = FORMULARIOS[t];
  const aoMudar = (novo: Objeto) => aoEditar(serializar(novo));

  return (
    <div className="flex flex-col gap-4">
      <Formulario valor={objeto} aoMudar={aoMudar} erros={erros} id={id} alunos={alunos} />
    </div>
  );
}
