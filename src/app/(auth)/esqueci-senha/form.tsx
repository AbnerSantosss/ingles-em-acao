'use client';

/**
 * Formulário de `/esqueci-senha`.
 *
 * Dois estados: o pedido e a confirmação. A confirmação usa a mesma frase
 * exista ou não a conta — e é por isso que ela troca o formulário inteiro, em
 * vez de aparecer como um aviso acima dele: repetir "enviamos" com o campo
 * ainda preenchido convida a tentar outro e-mail para comparar as respostas.
 */
import Link from 'next/link';
import { useActionState, useEffect, useRef } from 'react';
import { useFormStatus } from 'react-dom';

import { Button } from '@/components/ui/Button';
import { Field } from '@/components/ui/Field';
import { Input } from '@/components/ui/Input';
import { V } from '@/lib/ui/palette';

import { esqueciSenhaAction, type EstadoDaAcao } from '../actions';

export type FormularioDeRecuperacaoProps = {
  linkEntrar: string;
};

/** `useFormStatus()` precisa morar dentro do `<form>` — daí o componente à parte. */
function BotaoEnviarLink() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" fullWidth loading={pending} loadingLabel="ENVIANDO...">
      ENVIAR O LINK
    </Button>
  );
}

function IconeEnvelope() {
  return (
    <svg
      width="30"
      height="30"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <rect x="2.6" y="5" width="18.8" height="14" rx="3" />
      <path d="m3.4 7.2 7.6 5.3a2 2 0 0 0 2 0l7.6-5.3" />
    </svg>
  );
}

export function FormularioDeRecuperacao({ linkEntrar }: FormularioDeRecuperacaoProps) {
  const [estado, acao] = useActionState<EstadoDaAcao, FormData>(esqueciSenhaAction, {});

  const formRef = useRef<HTMLFormElement>(null);
  const confirmacaoRef = useRef<HTMLHeadingElement>(null);

  // ⚠️ O React reseta o formulário ao disparar a ação, devolvendo cada campo ao
  // seu `defaultValue` — então é por ele que o e-mail digitado volta.
  const emailDigitado = estado.valores?.email ?? '';

  useEffect(() => {
    if (estado.ok) {
      // A tela mudou por inteiro: o foco precisa ir para o texto novo, senão
      // quem usa leitor de tela continua no botão de um formulário que sumiu.
      confirmacaoRef.current?.focus();
      return;
    }

    if (!estado.erros) return;

    const alvo = formRef.current?.querySelector<HTMLElement>(
      '[data-erro-geral], [aria-invalid="true"]',
    );
    alvo?.focus();
  }, [estado]);

  if (estado.ok) {
    return (
      <div className="flex flex-col items-center text-center">
        <span
          className="grid h-[68px] w-[68px] place-items-center rounded-full"
          style={{ background: V.mint.bg, color: V.mint.fg }}
        >
          <IconeEnvelope />
        </span>

        <h1
          ref={confirmacaoRef}
          tabIndex={-1}
          className="mt-5 text-[28px] font-black leading-[1.1] tracking-[-0.02em] text-navy focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue sm:text-[30px]"
        >
          Confira seu e-mail
        </h1>

        <p className="mt-3 text-[17px] leading-[1.5] text-muted">
          {estado.mensagem} O link vale por <strong className="text-navy">1 hora</strong> e só pode
          ser usado uma vez.
        </p>

        <p className="mt-3 text-[15px] leading-[1.5] text-muted-2">
          Não chegou em alguns minutos? Procure na caixa de spam antes de pedir outro.
        </p>

        {/*
          Link com cara de botão, e não um <Button> dentro de um <Link>: botão
          dentro de âncora é HTML inválido e confunde leitor de tela. Aqui o
          destino é uma página, então o elemento certo é a âncora.
        */}
        <Link
          href={linkEntrar}
          className="mt-7 inline-flex h-[54px] w-full items-center justify-center rounded-pill bg-navy px-7 text-[17px] font-extrabold tracking-[0.03em] text-white transition-colors duration-150 hover:bg-navy-light"
        >
          VOLTAR PARA O LOGIN
        </Link>
      </div>
    );
  }

  return (
    <>
      <h1 className="text-[32px] font-black leading-[1.05] tracking-[-0.025em] text-navy sm:text-[34px]">
        Esqueceu a
        <br />
        <span className="text-blue">senha?</span>
      </h1>

      <p className="mt-2 text-[17px] leading-[1.45] text-muted sm:text-[18px]">
        Informe o e-mail da sua conta. Enviamos um link para você criar uma nova.
      </p>

      <form ref={formRef} action={acao} noValidate className="mt-6 flex flex-col gap-5">
        {estado.erros?._form ? (
          <p
            data-erro-geral
            tabIndex={-1}
            role="alert"
            className="rounded-[16px] border-[1.5px] px-4 py-3 text-[15px] font-semibold leading-snug focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-danger"
            style={{ background: V.red.bg, borderColor: V.red.bd, color: V.red.fg }}
          >
            {estado.erros._form}
          </p>
        ) : null}

        <Field label="Seu e-mail" error={estado.erros?.email} required>
          <Input
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            autoCapitalize="none"
            spellCheck={false}
            placeholder="voce@email.com"
            defaultValue={emailDigitado}
            className="bg-surface"
          />
        </Field>

        <BotaoEnviarLink />
      </form>

      <p className="mt-6 text-center text-[16px] text-muted">
        Lembrou a senha?{' '}
        <Link
          href={linkEntrar}
          className="font-extrabold text-link underline-offset-4 hover:text-link-hover hover:underline"
        >
          Entrar
        </Link>
      </p>
    </>
  );
}

export default FormularioDeRecuperacao;
