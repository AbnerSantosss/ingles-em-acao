/**
 * A aba "Dados" de uma aula: o que a aula é, se está no ar e as duas ações
 * perigosas (arquivar e renumerar).
 *
 * ⚠️ Três formulários separados, de propósito. Salvar título não pode publicar
 * junto, e publicar não pode salvar um campo que o admin estava no meio de
 * editar. Cada ação tem o seu envio, o seu estado e a sua linha de auditoria.
 */
'use client';

import { useActionState, useState } from 'react';
import { useFormStatus } from 'react-dom';

import { SeletorDeMidia } from '@/components/admin/SeletorDeMidia';
import { Button } from '@/components/ui/Button';
import { Field } from '@/components/ui/Field';
import { Input } from '@/components/ui/Input';
import type { AulaDoPainel } from '@/lib/admin/aulas';
import type { OpcaoDeModulo } from '@/lib/admin/modulos';

import {
  arquivarAulaAction,
  despublicarAulaAction,
  publicarAulaAction,
  renumerarAulaAction,
  restaurarAulaAction,
  salvarDadosAction,
} from '../actions';
import { FORMULARIO_INICIAL, type EstadoDoFormulario } from '../tipos';

const SELECT = [
  'block h-[52px] w-full rounded-field border-[1.5px] border-border bg-bg px-4',
  'text-[17px] font-bold text-navy',
  'focus:border-blue focus:shadow-[0_0_0_3px_rgba(27,107,227,0.22)] focus-visible:outline-hidden',
  'aria-invalid:border-danger',
].join(' ');

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

function erroDoCampo(estado: EstadoDoFormulario, campo: string): string | undefined {
  if (estado.estado !== 'erro') return undefined;
  return estado.campos?.[campo];
}

function Bloco({
  titulo,
  descricao,
  children,
  tom = 'normal',
}: {
  titulo: string;
  descricao?: string;
  children: React.ReactNode;
  tom?: 'normal' | 'risco';
}) {
  return (
    <section
      className="rounded-[18px] border border-solid p-5"
      style={
        tom === 'risco'
          ? { borderColor: '#F9D3D9', background: '#FFF8F9' }
          : { borderColor: 'var(--color-border, #E3EAF3)', background: 'transparent' }
      }
    >
      <h2
        className="m-0 text-[15px] font-black tracking-[-0.01em]"
        style={{ color: tom === 'risco' ? '#B21F31' : '#0A1F4E' }}
      >
        {titulo}
      </h2>
      {descricao ? (
        <p className="m-0 mt-1.5 text-[14px] font-semibold leading-snug text-muted">{descricao}</p>
      ) : null}
      <div className="mt-4">{children}</div>
    </section>
  );
}

// ──────────────────────────────── capa ───────────────────────────────────

/**
 * A capa: escolhida ou enviada pelo seletor de mídia (com o quadro de
 * especificações da capa 3:1 antes do envio), ou digitada à mão para as capas
 * que já moram em `public/lessons/capas/`.
 *
 * ⚠️ O valor viaja num `<input type="hidden" name="coverUrl">` controlado: o
 * seletor não tem `name` e não pode ter `<form>` próprio (estaria aninhado no
 * formulário de dados). Salvar continua sendo o botão "Salvar dados".
 */
function CampoDeCapa({ inicial, erro }: { inicial: string; erro?: string }) {
  const [capa, setCapa] = useState(inicial);
  const [manual, setManual] = useState(false);

  return (
    <div className="flex flex-col gap-3 lg:col-span-2">
      <input type="hidden" name="coverUrl" value={capa} />
      <SeletorDeMidia
        rotulo="Capa da aula"
        uso="capa"
        semAlt
        valor={capa ? { src: capa, alt: '' } : null}
        aoEscolher={(escolha) => setCapa(escolha?.src ?? '')}
        ajuda="Escolha na biblioteca ou envie uma nova. A capa só é gravada quando você clica em “Salvar dados”."
      />
      {manual ? (
        <Field
          label="Caminho da capa"
          error={erro}
          hint="Caminho interno (/lessons/capas/07.png) ou URL https. Vazio = sem capa."
        >
          <Input
            value={capa}
            onChange={(evento) => setCapa(evento.target.value.trim())}
            maxLength={300}
            autoComplete="off"
            placeholder="/lessons/capas/07.png"
          />
        </Field>
      ) : (
        <div className="flex flex-wrap items-center gap-3">
          <Button type="button" size="md" variant="ghost" onClick={() => setManual(true)}>
            Digitar o caminho…
          </Button>
          {erro ? (
            <p role="alert" className="m-0 text-[14px] font-semibold leading-snug text-danger">
              {erro}
            </p>
          ) : null}
        </div>
      )}
    </div>
  );
}

// ──────────────────────────── dados da aula ──────────────────────────────

function FormularioDeDados({
  aula,
  modulos,
}: {
  aula: AulaDoPainel;
  modulos: OpcaoDeModulo[];
}) {
  const [estado, enviar] = useActionState(salvarDadosAction, FORMULARIO_INICIAL);

  // O módulo atual pode estar arquivado (e, por isso, fora da lista de seleção).
  // Ele entra como opção extra para o select não trocar o vínculo sozinho.
  const opcoes = modulos.some((modulo) => modulo.id === aula.moduleId)
    ? modulos
    : [
        ...modulos,
        {
          id: aula.moduleId,
          order: 0,
          title: `${aula.moduloTitulo ?? `Módulo ${aula.moduleId}`} (arquivado)`,
        },
      ];

  return (
    <form action={enviar} className="flex flex-col gap-4">
      <input type="hidden" name="id" value={aula.id} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Field label="Título em inglês" required error={erroDoCampo(estado, 'title')}>
          <Input name="title" defaultValue={aula.title} maxLength={120} autoComplete="off" />
        </Field>

        <Field label="Subtítulo em português" error={erroDoCampo(estado, 'subtitle')}>
          <Input name="subtitle" defaultValue={aula.subtitle} maxLength={200} autoComplete="off" />
        </Field>

        <Field label="Tempo estimado" required error={erroDoCampo(estado, 'estimatedTime')}>
          <Input
            name="estimatedTime"
            defaultValue={aula.estimatedTime}
            maxLength={24}
            autoComplete="off"
          />
        </Field>

        <Field label="Módulo" required error={erroDoCampo(estado, 'moduleId')}>
          <select name="moduleId" defaultValue={String(aula.moduleId)} className={SELECT}>
            {opcoes.map((modulo) => (
              <option key={modulo.id} value={String(modulo.id)}>
                {modulo.order > 0 ? `${modulo.order}. ` : ''}
                {modulo.title}
              </option>
            ))}
          </select>
        </Field>

        <Field
          label="Slug"
          required
          error={erroDoCampo(estado, 'slug')}
          hint={`Endereço atual: /aula/${aula.slug}. Mudar o slug quebra todo link já compartilhado — o antigo passa a responder 404.`}
        >
          <Input name="slug" defaultValue={aula.slug} maxLength={120} autoComplete="off" />
        </Field>

        <CampoDeCapa inicial={aula.coverUrl ?? ''} erro={erroDoCampo(estado, 'coverUrl')} />
      </div>

      <Recado estado={estado} />

      <div>
        <Enviar>Salvar dados</Enviar>
      </div>
    </form>
  );
}

// ───────────────────────────── publicação ────────────────────────────────

function Publicacao({ aula }: { aula: AulaDoPainel }) {
  const [estadoPublicar, publicar] = useActionState(publicarAulaAction, FORMULARIO_INICIAL);
  const [estadoDespublicar, despublicar] = useActionState(
    despublicarAulaAction,
    FORMULARIO_INICIAL,
  );

  if (aula.estado === 'arquivada') {
    return (
      <p className="m-0 text-[14px] font-semibold leading-snug text-muted">
        Esta aula está arquivada. Restaure-a antes de mexer na publicação.
      </p>
    );
  }

  if (aula.estado === 'publicada') {
    return (
      <form action={despublicar} className="flex flex-col gap-3">
        <input type="hidden" name="id" value={aula.id} />
        <p className="m-0 text-[14px] font-semibold leading-snug text-muted">
          A aula está no ar com {aula.paginas ?? 0} página(s). Despublicar tira o endereço do ar
          (o aluno recebe 404) e some da trilha. O progresso de quem já fez continua guardado, e
          nenhuma conclusão é desfeita.
        </p>
        <Field label="Motivo (opcional)" hint="Fica registrado na auditoria.">
          <Input name="motivo" maxLength={140} autoComplete="off" placeholder="Revisão de conteúdo" />
        </Field>
        <Recado estado={estadoDespublicar} />
        <div>
          <Enviar variant="danger">Despublicar aula</Enviar>
        </div>
      </form>
    );
  }

  return (
    <form action={publicar} className="flex flex-col gap-3">
      <input type="hidden" name="id" value={aula.id} />
      <p className="m-0 text-[14px] font-semibold leading-snug text-muted">
        A aula está em rascunho: ela não aparece na trilha e o endereço responde 404. Publicar
        valida o conteúdo antes — se algum bloco não passar no esquema, a aula não vai ao ar e o
        erro aparece aqui.
      </p>
      <Recado estado={estadoPublicar} />
      <div>
        <Enviar>Publicar aula</Enviar>
      </div>
    </form>
  );
}

// ─────────────────────────── zona de risco ───────────────────────────────

function Arquivamento({ aula }: { aula: AulaDoPainel }) {
  const [estadoArquivar, arquivar] = useActionState(arquivarAulaAction, FORMULARIO_INICIAL);
  const [estadoRestaurar, restaurar] = useActionState(restaurarAulaAction, FORMULARIO_INICIAL);
  const [aberto, setAberto] = useState(false);

  if (aula.estado === 'arquivada') {
    return (
      <form action={restaurar} className="flex flex-col gap-3">
        <input type="hidden" name="id" value={aula.id} />
        <p className="m-0 text-[14px] font-semibold leading-snug text-muted">
          Arquivada em{' '}
          {aula.archivedAt ? aula.archivedAt.toLocaleDateString('pt-BR') : 'data desconhecida'}.
          Restaurar devolve a aula ao estado anterior — se ela estava publicada, volta ao ar.
        </p>
        <Recado estado={estadoRestaurar} />
        <div>
          <Enviar>Restaurar aula</Enviar>
        </div>
      </form>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="m-0 text-[14px] font-semibold leading-snug text-muted">
        Arquivar esconde a aula do painel e do app. <strong>Nada é apagado</strong>: conteúdo,
        respostas e progresso continuam no banco, e a aula pode ser restaurada.
      </p>

      {aberto ? (
        <form action={arquivar} className="flex flex-col gap-3">
          <input type="hidden" name="id" value={aula.id} />
          <Field
            label="Motivo"
            required
            error={erroDoCampo(estadoArquivar, 'motivo')}
            hint="Obrigatório. É o que vai explicar, daqui a seis meses, por que esta aula sumiu."
          >
            <Input name="motivo" maxLength={140} autoComplete="off" />
          </Field>
          <Recado estado={estadoArquivar} />
          <div className="flex flex-wrap gap-3">
            <Enviar variant="danger">Arquivar aula {aula.number}</Enviar>
            <Button type="button" size="md" variant="ghost" onClick={() => setAberto(false)}>
              Cancelar
            </Button>
          </div>
        </form>
      ) : (
        <div>
          <Button type="button" size="md" variant="ghost" onClick={() => setAberto(true)}>
            Arquivar aula…
          </Button>
        </div>
      )}
    </div>
  );
}

function Renumeracao({ aula }: { aula: AulaDoPainel }) {
  const [estado, renumerar] = useActionState(renumerarAulaAction, FORMULARIO_INICIAL);
  const [aberto, setAberto] = useState(false);

  return (
    <div className="flex flex-col gap-3">
      <p className="m-0 text-[14px] font-semibold leading-snug text-muted">
        Esta aula é a número {aula.number}. Mudar o número muda o código exibido (&ldquo;
        {aula.code}&rdquo;) e a posição dela na trilha. <strong>Não muda</strong> o slug, a capa
        nem os blocos do conteúdo que citam o número — isso fica para revisão à mão. O progresso
        de {aula.alunosComProgresso} aluno(s) não se perde: ele aponta para a aula, não para o
        número.
      </p>

      {aberto ? (
        <form action={renumerar} className="flex flex-col gap-3">
          <input type="hidden" name="id" value={aula.id} />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Novo número" required error={erroDoCampo(estado, 'numero')}>
              <Input name="numero" type="number" inputMode="numeric" min={1} max={999} />
            </Field>
            <Field
              label="Confirme o novo número"
              required
              error={erroDoCampo(estado, 'confirmacao')}
              hint="Digite o mesmo número de novo."
            >
              <Input name="confirmacao" type="number" inputMode="numeric" min={1} max={999} />
            </Field>
          </div>
          <Field label="Motivo" required error={erroDoCampo(estado, 'motivo')}>
            <Input name="motivo" maxLength={140} autoComplete="off" />
          </Field>
          <Recado estado={estado} />
          <div className="flex flex-wrap gap-3">
            <Enviar variant="danger">Renumerar aula</Enviar>
            <Button type="button" size="md" variant="ghost" onClick={() => setAberto(false)}>
              Cancelar
            </Button>
          </div>
        </form>
      ) : (
        <div>
          <Button type="button" size="md" variant="ghost" onClick={() => setAberto(true)}>
            Renumerar aula…
          </Button>
        </div>
      )}
    </div>
  );
}

// ──────────────────────────────── a aba ──────────────────────────────────

export function AbaDeDados({
  aula,
  modulos,
}: {
  aula: AulaDoPainel;
  modulos: OpcaoDeModulo[];
}) {
  return (
    <div className="flex flex-col gap-5">
      <Bloco titulo="Dados da aula" descricao="O que o aluno vê no topo da aula e na trilha.">
        <FormularioDeDados aula={aula} modulos={modulos} />
      </Bloco>

      <Bloco titulo="Publicação" descricao="Só aula publicada chega ao aluno.">
        <Publicacao aula={aula} />
      </Bloco>

      <Bloco titulo="Arquivar" tom="risco">
        <Arquivamento aula={aula} />
      </Bloco>

      <Bloco titulo="Renumerar" tom="risco">
        <Renumeracao aula={aula} />
      </Bloco>
    </div>
  );
}

export default AbaDeDados;
