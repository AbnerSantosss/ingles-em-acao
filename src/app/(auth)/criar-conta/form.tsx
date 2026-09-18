'use client';

/**
 * Formulário de `/criar-conta`.
 *
 * Mesma moldura da tela de login, com quatro decisões e nada mais: nome,
 * e-mail, senha e o aceite dos termos.
 */
import Link from 'next/link';
import { useActionState, useEffect, useId, useRef } from 'react';
import { useFormStatus } from 'react-dom';

import { Button } from '@/components/ui/Button';
import { Field } from '@/components/ui/Field';
import { Input } from '@/components/ui/Input';
import { TAMANHO_MINIMO_SENHA } from '@/lib/auth/constantes';
import { V } from '@/lib/ui/palette';

import { criarContaAction, type EstadoDaAcao } from '../actions';


export type FormularioDeCadastroProps = {
  /** Destino já peneirado pelo `safeNext()` no servidor. */
  next: string;
  linkEntrar: string;
};

/** `useFormStatus()` precisa morar dentro do `<form>` — daí o componente à parte. */
function BotaoCriarConta() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" fullWidth loading={pending} loadingLabel="CRIANDO...">
      CRIAR MINHA CONTA
      <svg
        width="19"
        height="19"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        focusable="false"
      >
        <path d="M5 12h13" />
        <path d="m12.5 5.5 6.5 6.5-6.5 6.5" />
      </svg>
    </Button>
  );
}

export function FormularioDeCadastro({ next, linkEntrar }: FormularioDeCadastroProps) {
  const [estado, acao] = useActionState<EstadoDaAcao, FormData>(criarContaAction, {});

  const formRef = useRef<HTMLFormElement>(null);
  const aceiteId = useId();
  const erroAceiteId = `${aceiteId}-erro`;

  // ⚠️ O React reseta o formulário quando a ação começa, e o reset devolve cada
  // campo ao seu `defaultValue`. Por isso o que a ação devolve entra como
  // `defaultValue`/`defaultChecked`: reescrever nome e e-mail a cada erro de
  // senha seria um castigo. A senha não volta do servidor e some mesmo — é o
  // comportamento esperado.
  const nomeDigitado = estado.valores?.nome ?? '';
  const emailDigitado = estado.valores?.email ?? '';
  const aceiteMarcado = estado.valores?.aceite ?? false;

  useEffect(() => {
    if (!estado.erros) return;

    const alvo = formRef.current?.querySelector<HTMLElement>(
      '[data-erro-geral], [aria-invalid="true"]',
    );
    alvo?.focus();
  }, [estado]);

  const erroGeral = estado.erros?._form;
  const erroAceite = estado.erros?.aceite;

  return (
    <>
      <h1 className="text-[32px] font-black leading-[1.05] tracking-[-0.025em] text-navy sm:text-[34px]">
        Comece sua
        <br />
        <span className="text-blue">trilha</span>
      </h1>

      <p className="mt-2 text-[17px] leading-[1.45] text-muted sm:text-[18px]">
        São 42 aulas, no seu ritmo. Criar a conta leva menos de um minuto.
      </p>

      <form ref={formRef} action={acao} noValidate className="mt-6 flex flex-col gap-5">
        <input type="hidden" name="next" value={next} />

        {erroGeral ? (
          <p
            data-erro-geral
            tabIndex={-1}
            role="alert"
            className="rounded-[16px] border-[1.5px] px-4 py-3 text-[15px] font-semibold leading-snug focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-danger"
            style={{ background: V.red.bg, borderColor: V.red.bd, color: V.red.fg }}
          >
            {erroGeral}
          </p>
        ) : null}

        <Field label="Seu nome" error={estado.erros?.nome} required>
          <Input
            name="nome"
            type="text"
            autoComplete="name"
            autoCapitalize="words"
            placeholder="Como quer ser chamado(a)"
            defaultValue={nomeDigitado}
            className="bg-surface"
          />
        </Field>

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

        <Field
          label="Crie uma senha"
          error={estado.erros?.senha}
          hint={`Mínimo de ${TAMANHO_MINIMO_SENHA} caracteres.`}
          required
        >
          <Input
            name="senha"
            type="password"
            autoComplete="new-password"
            minLength={TAMANHO_MINIMO_SENHA}
            placeholder="Pelo menos 8 caracteres"
            className="bg-surface"
          />
        </Field>

        <div className="flex flex-col gap-2">
          <label
            htmlFor={aceiteId}
            className="-ml-1 flex min-h-[44px] cursor-pointer items-center gap-3 px-1 text-[15px] leading-snug text-muted-3"
          >
            <input
              id={aceiteId}
              type="checkbox"
              name="aceite"
              defaultChecked={aceiteMarcado}
              aria-invalid={erroAceite ? true : undefined}
              aria-describedby={erroAceite ? erroAceiteId : undefined}
              required
              className="h-[22px] w-[22px] shrink-0 cursor-pointer rounded-[6px] accent-navy"
            />
            {/*
              Os links abrem em outra aba: quem para para ler não perde o que já
              digitou. Clicar num link dentro do <label> navega, não marca a caixa.
            */}
            <span>
              Li e aceito os{' '}
              <a
                href="/termos"
                target="_blank"
                rel="noopener noreferrer"
                className="font-extrabold text-navy underline underline-offset-4"
              >
                termos de uso<span className="sr-only"> (abre em outra aba)</span>
              </a>{' '}
              e a{' '}
              <a
                href="/privacidade"
                target="_blank"
                rel="noopener noreferrer"
                className="font-extrabold text-navy underline underline-offset-4"
              >
                política de privacidade<span className="sr-only"> (abre em outra aba)</span>
              </a>{' '}
              do Inglês em Ação.
            </span>
          </label>

          {erroAceite ? (
            <p
              id={erroAceiteId}
              role="alert"
              className="text-[14px] font-semibold leading-snug text-danger"
            >
              {erroAceite}
            </p>
          ) : null}
        </div>

        <BotaoCriarConta />
      </form>

      <p className="mt-6 text-center text-[16px] text-muted">
        Já tem conta?{' '}
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

export default FormularioDeCadastro;
