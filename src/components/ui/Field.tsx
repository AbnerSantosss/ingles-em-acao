"use client";

import { cloneElement, isValidElement, useId, type ReactNode } from "react";

import { cn } from "@/lib/ui/cn";

export type FieldProps = {
  /** Rótulo do campo (renderizado em caixa alta pelo estilo). */
  label: ReactNode;
  /**
   * O controle. Se for um único elemento, o Field injeta nele `id`,
   * `aria-invalid` e `aria-describedby` — não é preciso repetir nada.
   * Se forem vários elementos, passe `id` você mesmo no controle certo.
   */
  children: ReactNode;
  /** Id do controle. Gerado automaticamente quando ausente. */
  id?: string;
  /** Mensagem de erro. Erro é SEMPRE texto — a borda vermelha só acompanha. */
  error?: ReactNode;
  /** Texto de ajuda permanente (ex.: "Mínimo de 8 caracteres"). */
  hint?: ReactNode;
  /** Marca visual e sonora de campo obrigatório. */
  required?: boolean;
  className?: string;
  labelClassName?: string;
};

export function Field({
  label,
  children,
  id,
  error,
  hint,
  required = false,
  className,
  labelClassName,
}: FieldProps) {
  const gerado = useId();
  const controleId = id ?? `campo-${gerado}`;
  const erroId = `${controleId}-erro`;
  const ajudaId = `${controleId}-ajuda`;

  const temErro = Boolean(error);
  const descrito = [hint ? ajudaId : null, temErro ? erroId : null]
    .filter(Boolean)
    .join(" ");

  let controle: ReactNode = children;

  if (isValidElement<Record<string, unknown>>(children)) {
    const propsFilho = children.props;
    const descritoExistente = propsFilho["aria-describedby"] as
      | string
      | undefined;

    controle = cloneElement(children, {
      id: (propsFilho.id as string | undefined) ?? controleId,
      "aria-invalid": temErro ? true : propsFilho["aria-invalid"],
      "aria-describedby":
        [descritoExistente, descrito].filter(Boolean).join(" ") || undefined,
      required: propsFilho.required ?? (required || undefined),
    });
  }

  return (
    <div className={cn("flex w-full flex-col gap-2", className)}>
      <label
        htmlFor={controleId}
        className={cn(
          "text-[13px] font-extrabold uppercase tracking-[0.1em] text-muted",
          labelClassName,
        )}
      >
        {label}
        {required ? (
          <>
            <span aria-hidden="true" className="ml-1 text-danger">
              *
            </span>
            <span className="sr-only"> (obrigatório)</span>
          </>
        ) : null}
      </label>

      {controle}

      {hint ? (
        <p id={ajudaId} className="text-[14px] leading-snug text-muted-2">
          {hint}
        </p>
      ) : null}

      {temErro ? (
        <p
          id={erroId}
          role="alert"
          className="flex items-start gap-1.5 text-[14px] font-semibold leading-snug text-danger"
        >
          <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            aria-hidden="true"
            focusable="false"
            className="mt-[2px] shrink-0"
          >
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7.6v5" />
            <path d="M12 16.2h.01" />
          </svg>
          <span>{error}</span>
        </p>
      ) : null}
    </div>
  );
}

export default Field;
