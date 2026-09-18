'use client';

/**
 * Formulário de `/redefinir-senha`.
 *
 * A conferência das duas senhas acontece **aqui e no servidor**. Aqui, para a
 * pessoa descobrir o erro de digitação sem esperar uma ida e volta; no servidor
 * (`redefinirSenhaSchema`), porque validação de navegador é conveniência, não
 * barreira — qualquer um a desliga com o DevTools aberto.
 */
import Link from 'next/link';
import { useActionState, useEffect, useRef, useState } from 'react';
import { useFormStatus } from 'react-dom';

import { Button } from '@/components/ui/Button';
import { Field } from '@/components/ui/Field';
import { Input } from '@/components/ui/Input';
import { TAMANHO_MINIMO_SENHA } from '@/lib/auth/constantes';
import { V } from '@/lib/ui/palette';

import { redefinirSenhaAction, type EstadoDaAcao } from '../actions';


export type FormularioDeNovaSenhaProps = {
  /** Token bruto vindo de `?token=`. Quem o gasta é a Server Action. */
  token: string;
  /** Destino já peneirado pelo `safeNext()` no servidor. */
  next: string;
};

const SENHAS_DIFERENTES = 'As duas senhas precisam ser iguais.';

/** `useFormStatus()` precisa morar dentro do `<form>` — daí o componente à parte. */
function BotaoSalvarSenha() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" fullWidth loading={pending} loadingLabel="SALVANDO...">
      SALVAR A NOVA SENHA
    </Button>
  );
}

/** Lê um campo do formulário pelo `name`, sem precisar de um ref por campo. */
function campo(form: HTMLFormElement | null, nome: string): HTMLInputElement | null {
  const elemento = form?.elements.namedItem(nome);
  return elemento instanceof HTMLInputElement ? elemento : null;
}

export function FormularioDeNovaSenha({ token, next }: FormularioDeNovaSenhaProps) {
  const [estado, acao] = useActionState<EstadoDaAcao, FormData>(redefinirSenhaAction, {});

  const formRef = useRef<HTMLFormElement>(null);
  const tituloInvalidoRef = useRef<HTMLHeadingElement>(null);

  // Erro visto só no navegador; some assim que as duas senhas voltam a bater.
  // Os campos ficam **não controlados** de propósito: guardar senha em estado
  // do React não acrescenta nada, e o `defaultValue` vazio é justamente o que
  // queremos depois de um envio que falhou.
  const [erroLocal, setErroLocal] = useState<string | null>(null);

  useEffect(() => {
    if (estado.tokenInvalido) {
      // O formulário some por inteiro: o foco tem de acompanhar a troca de tela.
      tituloInvalidoRef.current?.focus();
      return;
    }

    if (!estado.erros) return;

    const alvo = formRef.current?.querySelector<HTMLElement>(
      '[data-erro-geral], [aria-invalid="true"]',
    );
    alvo?.focus();
  }, [estado]);

  // Token morto descoberto no envio (a página só conferiu antes de mostrar a
  // tela; entre uma coisa e outra ele pode ter expirado ou sido usado).
  if (estado.tokenInvalido) {
    return (
      <div className="flex flex-col items-center text-center">
        <span
          className="grid h-[68px] w-[68px] place-items-center rounded-full"
          style={{ background: V.red.bg, color: V.red.fg }}
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.1"
            strokeLinecap="round"
            aria-hidden="true"
            focusable="false"
          >
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7.4v5.2" />
            <path d="M12 16.4h.01" />
          </svg>
        </span>

        <h1
          ref={tituloInvalidoRef}
          tabIndex={-1}
          className="mt-5 text-[28px] font-black leading-[1.1] tracking-[-0.02em] text-navy focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue sm:text-[30px]"
        >
          Esse link não vale mais
        </h1>

        <p className="mt-3 text-[17px] leading-[1.5] text-muted">{estado.erros?._form}</p>

        <p className="mt-3 text-[15px] leading-[1.5] text-muted-2">
          Sua senha atual continua valendo. Peça um link novo para trocá-la.
        </p>

        <Link
          href="/esqueci-senha"
          className="mt-7 inline-flex h-[54px] w-full items-center justify-center rounded-pill bg-navy px-7 text-[17px] font-extrabold tracking-[0.03em] text-white transition-colors duration-150 hover:bg-navy-light"
        >
          PEDIR UM LINK NOVO
        </Link>
      </div>
    );
  }

  const erroConfirmacao = erroLocal ?? estado.erros?.confirmarSenha;

  return (
    <>
      <h1 className="text-[32px] font-black leading-[1.05] tracking-[-0.025em] text-navy sm:text-[34px]">
        Crie uma
        <br />
        <span className="text-blue">nova senha</span>
      </h1>

      <p className="mt-2 text-[17px] leading-[1.45] text-muted sm:text-[18px]">
        Ao salvar, todas as outras sessões abertas com a senha antiga são encerradas.
      </p>

      <form
        ref={formRef}
        action={acao}
        noValidate
        onSubmit={(evento) => {
          const form = evento.currentTarget;
          const nova = campo(form, 'senha')?.value ?? '';
          const repetida = campo(form, 'confirmarSenha')?.value ?? '';

          if (nova !== repetida) {
            // `preventDefault()` num `onSubmit` segura a Server Action: o React
            // só dispara a ação quando o evento nativo chega sem `defaultPrevented`.
            // Ninguém vai ao servidor por um erro de digitação — e o campo
            // continua preenchido, porque sem ação não há reset de formulário.
            evento.preventDefault();
            setErroLocal(SENHAS_DIFERENTES);
            campo(form, 'confirmarSenha')?.focus();
          }
        }}
        className="mt-6 flex flex-col gap-5"
      >
        <input type="hidden" name="token" value={token} />
        <input type="hidden" name="next" value={next} />

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

        <Field
          label="Nova senha"
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
            onChange={(evento) => {
              if (!erroLocal) return;
              const repetida = campo(evento.currentTarget.form, 'confirmarSenha')?.value ?? '';
              if (evento.currentTarget.value === repetida) setErroLocal(null);
            }}
            className="bg-surface"
          />
        </Field>

        <Field label="Repita a nova senha" error={erroConfirmacao} required>
          <Input
            name="confirmarSenha"
            type="password"
            autoComplete="new-password"
            placeholder="A mesma senha de novo"
            onChange={(evento) => {
              if (!erroLocal) return;
              const nova = campo(evento.currentTarget.form, 'senha')?.value ?? '';
              if (evento.currentTarget.value === nova) setErroLocal(null);
            }}
            className="bg-surface"
          />
        </Field>

        <BotaoSalvarSenha />
      </form>

      <p className="mt-6 text-center text-[16px] text-muted">
        Lembrou a senha antiga?{' '}
        <Link
          href="/entrar"
          className="font-extrabold text-link underline-offset-4 hover:text-link-hover hover:underline"
        >
          Entrar
        </Link>
      </p>
    </>
  );
}

export default FormularioDeNovaSenha;
