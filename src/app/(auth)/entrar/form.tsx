'use client';

/**
 * Formulário de `/entrar`.
 *
 * É o card de login do protótipo (`prototype/mobile.dc.html`, bloco
 * `<sc-if value="{{ isLogin }}">`) com os campos que uma conta de verdade exige:
 * e-mail, senha e "lembrar-me" no lugar do campo único de nome.
 */
import Link from 'next/link';
import { useActionState, useEffect, useRef } from 'react';
import { useFormStatus } from 'react-dom';

import { Button } from '@/components/ui/Button';
import { Field } from '@/components/ui/Field';
import { Input } from '@/components/ui/Input';
import { V } from '@/lib/ui/palette';

import { entrarAction, type EstadoDaAcao } from '../actions';

export type FormularioDeEntradaProps = {
  /** Destino já peneirado pelo `safeNext()` no servidor. */
  next: string;
  /** Chegou aqui porque a sessão venceu, não por um clique. */
  sessaoExpirada: boolean;
  linkCriarConta: string;
  linkEsqueciSenha: string;
};

/**
 * Botão de envio.
 *
 * Componente separado de propósito: `useFormStatus()` só enxerga o `<form>` se
 * estiver **dentro** dele — chamado no mesmo componente que renderiza o form,
 * devolveria `pending: false` para sempre.
 */
function BotaoEntrar() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" fullWidth loading={pending} loadingLabel="ENTRANDO...">
      ENTRAR
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

export function FormularioDeEntrada({
  next,
  sessaoExpirada,
  linkCriarConta,
  linkEsqueciSenha,
}: FormularioDeEntradaProps) {
  const [estado, acao] = useActionState<EstadoDaAcao, FormData>(entrarAction, {});

  const formRef = useRef<HTMLFormElement>(null);

  // ⚠️ O React **reseta** o formulário assim que a ação começa
  // (`requestFormReset`), e o reset devolve cada campo ao seu `defaultValue`.
  // Por isso os valores que a ação devolve entram como `defaultValue`: no mesmo
  // commit o React grava o atributo novo e só depois chama `form.reset()`
  // (`recursivelyResetForms`), então o campo reaparece com o que foi digitado —
  // sem estado controlado e sem efeito nenhum.
  // A senha fica de fora de propósito: senha digitada não faz o caminho de volta
  // pela rede, e apagá-la depois de uma falha é o comportamento esperado.
  const emailDigitado = estado.valores?.email ?? '';
  const lembrarMarcado = estado.valores?.lembrar ?? true;

  useEffect(() => {
    if (!estado.erros) return;

    // Leva o foco para o primeiro problema. A ordem do documento resolve a
    // prioridade sozinha: o aviso geral fica acima dos campos, então ele ganha
    // quando existe — que é justamente o caso de "e-mail ou senha incorretos",
    // um erro que não pertence a nenhum campo em especial.
    const alvo = formRef.current?.querySelector<HTMLElement>(
      '[data-erro-geral], [aria-invalid="true"]',
    );
    alvo?.focus();
  }, [estado]);

  const erroGeral = estado.erros?._form;

  return (
    <>
      <h1 className="text-[34px] font-black leading-[1.03] tracking-[-0.025em] text-navy sm:text-[40px]">
        Bem-vindo(a)
        <br />
        <span className="text-blue">de volta</span>
      </h1>

      <p className="mt-2 text-[17px] leading-[1.45] text-muted sm:text-[18px]">
        Entre para continuar sua trilha de 42 aulas.
      </p>

      {sessaoExpirada ? (
        <p
          role="status"
          className="mt-5 rounded-[16px] border-[1.5px] px-4 py-3 text-[15px] font-semibold leading-snug"
          style={{ background: V.cream.bg, borderColor: V.cream.bd, color: V.cream.fg }}
        >
          Sua sessão expirou por segurança. Entre de novo para continuar.
        </p>
      ) : null}

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

        <Field label="Sua senha" error={estado.erros?.senha} required>
          <Input
            name="senha"
            type="password"
            autoComplete="current-password"
            placeholder="Sua senha"
            className="bg-surface"
          />
        </Field>

        <div className="flex flex-wrap items-center justify-between gap-x-4">
          <label className="-ml-1 inline-flex min-h-[44px] cursor-pointer items-center gap-3 px-1 text-[15px] font-bold text-muted-3">
            <input
              type="checkbox"
              name="lembrar"
              defaultChecked={lembrarMarcado}
              className="h-[22px] w-[22px] shrink-0 cursor-pointer rounded-[6px] accent-navy"
            />
            Lembrar-me
          </label>

          <Link
            href={linkEsqueciSenha}
            className="inline-flex min-h-[44px] items-center text-[15px] font-bold text-link underline-offset-4 hover:text-link-hover hover:underline"
          >
            Esqueci minha senha
          </Link>
        </div>

        <BotaoEntrar />
      </form>

      <p className="mt-6 text-center text-[16px] text-muted">
        Ainda não tem conta?{' '}
        <Link
          href={linkCriarConta}
          className="font-extrabold text-link underline-offset-4 hover:text-link-hover hover:underline"
        >
          Criar conta
        </Link>
      </p>
    </>
  );
}

export default FormularioDeEntrada;
