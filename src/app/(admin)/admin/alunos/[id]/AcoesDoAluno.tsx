/**
 * As ações do detalhe do aluno (BACKOFFICE §2.7): as quatro do dia a dia e,
 * por último, "Anonimizar conta".
 *
 * ⚠️ `'use client'` porque existe interatividade de verdade: o estado de cada
 * envio (`useActionState`) e a confirmação em dois toques de "encerrar
 * sessões" e de "anonimizar". Este arquivo não fala com o banco — só com as
 * Server Actions.
 *
 * ⚠️ **Não existe campo de nota aqui.** "Recalcular progresso" manda o servidor
 * recontar a partir das respostas gravadas (§6.5); o admin não digita placar.
 *
 * ⚠️ "Mudar de plano" e "Anonimizar conta" usam `onSubmit` + `startTransition`,
 * não `action={...}`:
 * no React 19 um `<form action>` limpa os campos depois de cada envio, até
 * quando a action devolve erro — e o admin perderia o motivo que escreveu.
 *
 * ⚠️ **Não existe "excluir aluno" com `DELETE`** (§7). "Anonimizar conta" usa o
 * mesmo núcleo do "Excluir minha conta" do aluno (`src/lib/conta/anonimizar.ts`)
 * e o bloco diz, antes do botão, o que sai e o que fica. Conta já anonimizada
 * não mostra ação nenhuma — não há mais plano, e-mail nem sessão para mexer.
 */
'use client';

import { startTransition, useActionState, useState, type FormEvent } from 'react';
import { useFormStatus } from 'react-dom';

import { Button } from '@/components/ui/Button';
import { Field } from '@/components/ui/Field';

import {
  anonimizarContaAction,
  encerrarSessoesAction,
  mudarPlanoAction,
  recalcularProgressoAction,
  reenviarVerificacaoAction,
} from '../actions';
import { FORMULARIO_INICIAL, type EstadoDoFormulario } from '../tipos';

const SELECT = [
  'block h-[52px] w-full rounded-field border-[1.5px] border-border bg-bg px-4',
  'text-[17px] font-bold text-navy',
  'focus:border-blue focus:shadow-[0_0_0_3px_rgba(27,107,227,0.22)] focus-visible:outline-hidden',
  'aria-invalid:border-danger',
].join(' ');

const TEXTAREA = [
  'block min-h-[92px] w-full rounded-field border-[1.5px] border-border bg-bg px-4 py-3',
  'text-[15px] font-semibold leading-snug text-navy',
  'focus:border-blue focus:shadow-[0_0_0_3px_rgba(27,107,227,0.22)] focus-visible:outline-hidden',
  'aria-invalid:border-danger',
].join(' ');

const PLANOS = [
  { valor: 'ESSENCIAL', rotulo: 'Essencial' },
  { valor: 'COMPLETO', rotulo: 'Completo' },
  { valor: 'PREMIUM', rotulo: 'Premium' },
] as const;

const FORMATO_DE_HORA = new Intl.DateTimeFormat('pt-BR', {
  timeStyle: 'short',
  timeZone: 'America/Sao_Paulo',
});

const FORMATO_DE_DATA = new Intl.DateTimeFormat('pt-BR', {
  dateStyle: 'short',
  timeStyle: 'short',
  timeZone: 'America/Sao_Paulo',
});

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
  disabled,
}: {
  children: React.ReactNode;
  variant?: 'primary' | 'accent' | 'ghost' | 'danger';
  disabled?: boolean;
}) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="md" variant={variant} loading={pending} disabled={disabled}>
      {children}
    </Button>
  );
}

/** Envia sem deixar o React 19 limpar o formulário (ver o cabeçalho). */
function enviarSemLimpar(despachar: (dados: FormData) => void) {
  return (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault();
    const dados = new FormData(evento.currentTarget);
    startTransition(() => despachar(dados));
  };
}

function erroDoCampo(estado: EstadoDoFormulario, campo: string): string | undefined {
  if (estado.estado !== 'erro') return undefined;
  return estado.campos?.[campo];
}

/** Um bloco de ação: título, explicação e o formulário. */
function Bloco({
  titulo,
  descricao,
  tom = 'normal',
  children,
}: {
  titulo: string;
  descricao: string;
  tom?: 'normal' | 'risco';
  children: React.ReactNode;
}) {
  return (
    <div
      className={`rounded-[18px] border border-solid p-4 ${tom === 'risco' ? '' : 'border-border'}`}
      style={tom === 'risco' ? { borderColor: '#F9D3D9', background: '#FEF7F8' } : undefined}
    >
      <h4 className="m-0 text-[15px] font-black tracking-[-0.01em] text-navy">{titulo}</h4>
      <p className="m-0 mb-3 mt-1 text-[13px] font-semibold leading-snug text-muted">
        {descricao}
      </p>
      {children}
    </div>
  );
}

// ───────────────────────────── mudar de plano ────────────────────────────

function MudarPlano({ id, plano }: { id: string; plano: string }) {
  const [estado, enviar, pendente] = useActionState(mudarPlanoAction, FORMULARIO_INICIAL);

  return (
    <Bloco
      titulo="Mudar de plano"
      descricao="Muda o acesso do aluno, não a cobrança: nada é cobrado nem estornado aqui. O motivo é obrigatório e os admins recebem um e-mail avisando."
    >
      <form onSubmit={enviarSemLimpar(enviar)} className="flex flex-col gap-3" noValidate>
        <input type="hidden" name="id" value={id} />

        <Field label="Novo plano" required error={erroDoCampo(estado, 'plano')}>
          <select name="plano" defaultValue={plano} className={SELECT}>
            {PLANOS.map((opcao) => (
              <option key={opcao.valor} value={opcao.valor}>
                {opcao.rotulo}
              </option>
            ))}
          </select>
        </Field>

        <Field
          label="Motivo"
          required
          hint="Fica na auditoria. Escreva o que você diria a quem perguntar daqui a seis meses."
          error={erroDoCampo(estado, 'motivo')}
        >
          <textarea name="motivo" maxLength={300} className={TEXTAREA} />
        </Field>

        <Recado estado={estado} />

        <div className="flex">
          <Button type="submit" size="md" variant="primary" loading={pendente}>
            Mudar plano
          </Button>
        </div>
      </form>
    </Bloco>
  );
}

// ─────────────────────────── reenviar verificação ────────────────────────

function ReenviarVerificacao({
  id,
  verificado,
  reenvio,
}: {
  id: string;
  verificado: boolean;
  reenvio: { permitido: boolean; enviados: number; limite: number; liberaEm: string | null };
}) {
  const [estado, enviar] = useActionState(reenviarVerificacaoAction, FORMULARIO_INICIAL);

  // ⚠️ O botão desabilitado sempre vem com o motivo visível ao lado — botão
  // apagado sem explicação é suporte aberto.
  const bloqueio = verificado
    ? 'O e-mail deste aluno já está verificado.'
    : reenvio.permitido
      ? null
      : `Limite de ${reenvio.limite} reenvios por hora atingido${
          reenvio.liberaEm
            ? `. Libera às ${FORMATO_DE_HORA.format(new Date(reenvio.liberaEm))}.`
            : '.'
        }`;

  return (
    <Bloco
      titulo="Reenviar verificação de e-mail"
      descricao={`Manda de novo o link de verificação para o e-mail do aluno. No máximo ${reenvio.limite} por hora por aluno — ${reenvio.enviados} já saíram nesta hora.`}
    >
      <form action={enviar} className="flex flex-col gap-3">
        <input type="hidden" name="id" value={id} />

        <Recado estado={estado} />

        <div className="flex flex-wrap items-center gap-3">
          <Enviar variant="ghost" disabled={bloqueio !== null}>
            Reenviar verificação
          </Enviar>
          {bloqueio ? (
            <span className="text-[13px] font-bold leading-snug text-muted">{bloqueio}</span>
          ) : null}
        </div>
      </form>
    </Bloco>
  );
}

// ──────────────────────────── encerrar sessões ───────────────────────────

function EncerrarSessoes({ id, sessoes }: { id: string; sessoes: number }) {
  const [estado, enviar] = useActionState(encerrarSessoesAction, FORMULARIO_INICIAL);
  const [confirmando, setConfirmando] = useState(false);

  return (
    <Bloco
      tom="risco"
      titulo="Encerrar sessões abertas"
      descricao={`Derruba as ${sessoes} sessão(ões) deste aluno. Ele precisa entrar de novo em cada aparelho; nada do progresso dele é tocado.`}
    >
      {confirmando ? (
        <form action={enviar} className="flex flex-col gap-3">
          <input type="hidden" name="id" value={id} />
          <Recado estado={estado} />
          <div className="flex flex-wrap items-center gap-3">
            <Enviar variant="danger">Confirmar encerramento</Enviar>
            <Button
              type="button"
              size="md"
              variant="ghost"
              onClick={() => setConfirmando(false)}
            >
              Cancelar
            </Button>
          </div>
        </form>
      ) : (
        <div className="flex flex-col gap-3">
          <Recado estado={estado} />
          <div className="flex">
            <Button
              type="button"
              size="md"
              variant="ghost"
              disabled={sessoes === 0}
              onClick={() => setConfirmando(true)}
            >
              Encerrar sessões
            </Button>
          </div>
          {sessoes === 0 ? (
            <p className="m-0 text-[13px] font-bold leading-snug text-muted">
              Este aluno não tem nenhuma sessão aberta.
            </p>
          ) : null}
        </div>
      )}
    </Bloco>
  );
}

// ────────────────────────── recalcular progresso ─────────────────────────

function RecalcularProgresso({ id }: { id: string }) {
  const [estado, enviar] = useActionState(recalcularProgressoAction, FORMULARIO_INICIAL);

  return (
    <Bloco
      titulo="Recalcular progresso"
      descricao="Reconta o placar de cada aula a partir das respostas já gravadas, com o conteúdo publicado hoje. Aula concluída continua concluída, as respostas do aluno não são alteradas e nada é digitado à mão."
    >
      <form action={enviar} className="flex flex-col gap-3">
        <input type="hidden" name="id" value={id} />
        <Recado estado={estado} />
        <div className="flex">
          <Enviar variant="ghost">Recalcular agora</Enviar>
        </div>
      </form>
    </Bloco>
  );
}

// ──────────────────────────── anonimizar conta ───────────────────────────

function AnonimizarConta({ id, administrador }: { id: string; administrador: boolean }) {
  const [estado, enviar, pendente] = useActionState(anonimizarContaAction, FORMULARIO_INICIAL);
  const [confirmando, setConfirmando] = useState(false);
  const erroDaCaixa = erroDoCampo(estado, 'confirmacao');

  return (
    <Bloco
      tom="risco"
      titulo="Anonimizar conta"
      descricao="Para pedido de exclusão que chegou pelo suporte. Irreversível: saem nome, e-mail, foto, senha, sessões e todo o progresso (aulas, respostas e dias de estudo); o e-mail fica livre para um cadastro novo. Ficam os pagamentos (obrigação fiscal) e a auditoria."
    >
      {administrador ? (
        <p className="m-0 text-[13px] font-bold leading-snug text-muted">
          Conta de administrador não é anonimizada pelo painel. O acesso de administrador precisa ser
          retirado no banco antes.
        </p>
      ) : confirmando ? (
        <form onSubmit={enviarSemLimpar(enviar)} className="flex flex-col gap-3" noValidate>
          <input type="hidden" name="id" value={id} />

          <Field
            label="Motivo"
            required
            hint="Fica na auditoria. Ex.: pedido de exclusão recebido por e-mail em 12/09, protocolo 123."
            error={erroDoCampo(estado, 'motivo')}
          >
            <textarea name="motivo" maxLength={300} className={TEXTAREA} />
          </Field>

          <div className="flex flex-col gap-1">
            <label className="flex cursor-pointer items-start gap-2.5 text-[14px] font-bold leading-snug text-navy">
              <input
                type="checkbox"
                name="confirmacao"
                value="sim"
                aria-invalid={erroDaCaixa ? true : undefined}
                aria-describedby={erroDaCaixa ? `erro-confirmacao-${id}` : undefined}
                className="mt-0.5 size-[18px] flex-none cursor-pointer accent-[#E03B4C]"
              />
              Entendo que a anonimização não pode ser desfeita.
            </label>
            {erroDaCaixa ? (
              <p
                id={`erro-confirmacao-${id}`}
                className="m-0 text-[13px] font-bold leading-snug text-[#B21F31]"
              >
                {erroDaCaixa}
              </p>
            ) : null}
          </div>

          <Recado estado={estado} />

          <div className="flex flex-wrap items-center gap-3">
            <Button type="submit" size="md" variant="danger" loading={pendente}>
              Anonimizar agora
            </Button>
            <Button
              type="button"
              size="md"
              variant="ghost"
              disabled={pendente}
              onClick={() => setConfirmando(false)}
            >
              Cancelar
            </Button>
          </div>
        </form>
      ) : (
        <div className="flex flex-col gap-3">
          <Recado estado={estado} />
          <div className="flex">
            <Button type="button" size="md" variant="ghost" onClick={() => setConfirmando(true)}>
              Anonimizar conta
            </Button>
          </div>
        </div>
      )}
    </Bloco>
  );
}

// ──────────────────────────────── o painel ───────────────────────────────

export function AcoesDoAluno({
  id,
  plano,
  verificado,
  sessoes,
  reenvio,
  administrador,
  excluidaEm,
}: {
  id: string;
  plano: string;
  verificado: boolean;
  sessoes: number;
  reenvio: { permitido: boolean; enviados: number; limite: number; liberaEm: string | null };
  /** A conta é de administrador (não pode ser anonimizada pelo painel). */
  administrador: boolean;
  /** Data (ISO) em que a conta foi anonimizada, ou `null` se está ativa. */
  excluidaEm: string | null;
}) {
  if (excluidaEm !== null) {
    return (
      <div>
        <h3 className="m-0 mb-2 text-[15px] font-black tracking-[-0.01em] text-navy">Ações</h3>
        <Bloco
          tom="risco"
          titulo="Conta anonimizada"
          descricao={`Excluída em ${FORMATO_DE_DATA.format(new Date(excluidaEm))}. Nome, e-mail, senha, sessões e progresso já saíram; ficaram os pagamentos e a auditoria.`}
        >
          <p className="m-0 text-[13px] font-bold leading-snug text-muted">
            Não há ação para uma conta anonimizada: ninguém entra nela, e o e-mail original já está
            livre para um cadastro novo.
          </p>
        </Bloco>
      </div>
    );
  }

  return (
    <div>
      <h3 className="m-0 mb-2 text-[15px] font-black tracking-[-0.01em] text-navy">Ações</h3>
      <div className="flex flex-col gap-3">
        <MudarPlano id={id} plano={plano} />
        <ReenviarVerificacao id={id} verificado={verificado} reenvio={reenvio} />
        <RecalcularProgresso id={id} />
        <EncerrarSessoes id={id} sessoes={sessoes} />
        <AnonimizarConta id={id} administrador={administrador} />
      </div>
    </div>
  );
}
