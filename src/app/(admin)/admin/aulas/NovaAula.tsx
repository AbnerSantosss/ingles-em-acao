/**
 * O formulário de criar aula, no fim da lista.
 *
 * Cria a aula **vazia e despublicada**: título, subtítulo, tempo e módulo. O
 * conteúdo entra depois, no editor (Fase 3) — e como a aula nasce em rascunho,
 * nada disso aparece para o aluno enquanto alguém não publicar.
 */
'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';

import { Button } from '@/components/ui/Button';
import { Field } from '@/components/ui/Field';
import { Input } from '@/components/ui/Input';
import type { OpcaoDeModulo } from '@/lib/admin/modulos';

import { criarAulaAction } from './actions';
import { FORMULARIO_INICIAL } from './tipos';

const SELECT = [
  'block h-[52px] w-full rounded-field border-[1.5px] border-border bg-bg px-4',
  'text-[17px] font-bold text-navy',
  'focus:border-blue focus:shadow-[0_0_0_3px_rgba(27,107,227,0.22)] focus-visible:outline-hidden',
  'aria-invalid:border-danger',
].join(' ');

function Enviar() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="md" loading={pending}>
      Criar aula
    </Button>
  );
}

export function NovaAula({ modulos }: { modulos: OpcaoDeModulo[] }) {
  const [estado, enviar] = useActionState(criarAulaAction, FORMULARIO_INICIAL);

  const erro = (campo: string): string | undefined =>
    estado.estado === 'erro' ? estado.campos?.[campo] : undefined;

  if (modulos.length === 0) {
    return (
      <p className="m-0 text-[14px] font-semibold leading-snug text-muted">
        Não há módulo ativo para receber uma aula. Crie um módulo primeiro, em Módulos.
      </p>
    );
  }

  return (
    <form action={enviar} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Field label="Título em inglês" required error={erro('title')}>
          <Input name="title" maxLength={120} autoComplete="off" placeholder="Simple Past" />
        </Field>

        <Field label="Subtítulo em português" error={erro('subtitle')}>
          <Input
            name="subtitle"
            maxLength={200}
            autoComplete="off"
            placeholder="O passado simples"
          />
        </Field>

        <Field label="Tempo estimado" error={erro('estimatedTime')} hint="Ex.: 12 min.">
          <Input name="estimatedTime" maxLength={24} autoComplete="off" defaultValue="10 min" />
        </Field>

        <Field label="Módulo" required error={erro('moduleId')}>
          <select name="moduleId" defaultValue={String(modulos[0].id)} className={SELECT}>
            {modulos.map((modulo) => (
              <option key={modulo.id} value={String(modulo.id)}>
                {modulo.order}. {modulo.title}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <p className="m-0 text-[13px] font-semibold leading-snug text-muted">
        A aula recebe o próximo número livre e nasce como rascunho, com uma página de partida —
        o esquema do conteúdo não aceita aula sem nenhuma página. O slug sai do título e pode ser
        ajustado na aba Dados.
      </p>

      {estado.estado !== 'inicial' ? (
        <p
          role="status"
          className="m-0 rounded-field px-3 py-2 text-[14px] font-bold leading-snug"
          style={
            estado.estado === 'erro'
              ? { background: '#FEF0F2', color: '#B21F31' }
              : { background: '#E4F5EA', color: '#136B45' }
          }
        >
          {estado.mensagem}
        </p>
      ) : null}

      <div>
        <Enviar />
      </div>
    </form>
  );
}

export default NovaAula;
