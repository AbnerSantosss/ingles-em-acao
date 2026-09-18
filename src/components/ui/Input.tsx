"use client";

import { useState, type ComponentPropsWithRef } from "react";

import { cn } from "@/lib/ui/cn";

export type InputProps = ComponentPropsWithRef<"input"> & {
  /** Marca o campo como inválido (vira `aria-invalid` + borda vermelha). */
  invalid?: boolean;
  /** Classe do invólucro posicionado (o campo em si usa `className`). */
  wrapperClassName?: string;
};

const CAMPO = [
  "block w-full h-[52px] rounded-field",
  "border-[1.5px] border-border bg-bg",
  "px-5 text-[17px] font-bold text-navy",
  "placeholder:font-medium placeholder:text-muted-2",
  "transition-[border-color,box-shadow] duration-150",
  // Foco: anel azul da marca. O outline transparente fica para o modo de
  // cores forçadas do Windows, que ignora box-shadow.
  "focus:border-blue focus:shadow-[0_0_0_3px_rgba(27,107,227,0.22)]",
  "focus-visible:outline-hidden",
  // Erro: a borda vermelha acompanha o texto de erro do Field, nunca sozinha.
  "aria-invalid:border-danger",
  "aria-invalid:focus:border-danger aria-invalid:focus:shadow-[0_0_0_3px_rgba(224,59,76,0.22)]",
  "disabled:cursor-not-allowed disabled:bg-[#EEF2F8] disabled:text-muted",
].join(" ");

function IconeOlho({ aberto }: { aberto: boolean }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.1"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {aberto ? (
        <>
          <path d="M2.5 12S6 5.8 12 5.8 21.5 12 21.5 12 18 18.2 12 18.2 2.5 12 2.5 12Z" />
          <circle cx="12" cy="12" r="3.2" />
          <path d="m4 20 16-16" />
        </>
      ) : (
        <>
          <path d="M2.5 12S6 5.8 12 5.8 21.5 12 21.5 12 18 18.2 12 18.2 2.5 12 2.5 12Z" />
          <circle cx="12" cy="12" r="3.2" />
        </>
      )}
    </svg>
  );
}

export function Input({
  type = "text",
  invalid,
  className,
  wrapperClassName,
  id,
  ...props
}: InputProps) {
  const [revelado, setRevelado] = useState(false);

  const ehSenha = type === "password";
  const tipoFinal = ehSenha && revelado ? "text" : type;

  return (
    <div className={cn("relative w-full", wrapperClassName)}>
      <input
        {...props}
        id={id}
        type={tipoFinal}
        aria-invalid={invalid ? true : props["aria-invalid"]}
        className={cn(CAMPO, ehSenha && "pr-[56px]", className)}
      />

      {ehSenha ? (
        <button
          type="button"
          onClick={() => setRevelado((atual) => !atual)}
          aria-label={revelado ? "Ocultar senha" : "Mostrar senha"}
          aria-pressed={revelado}
          aria-controls={id}
          className={cn(
            "absolute right-[5px] top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center",
            "rounded-full text-muted transition-colors duration-150",
            "hover:bg-[#EAF2FE] hover:text-navy",
          )}
        >
          <IconeOlho aberto={revelado} />
        </button>
      ) : null}
    </div>
  );
}

export default Input;
