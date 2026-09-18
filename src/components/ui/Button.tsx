import type { ComponentPropsWithRef, ReactNode } from "react";

import { cn } from "@/lib/ui/cn";

export type ButtonVariant = "primary" | "accent" | "ghost" | "danger";
export type ButtonSize = "lg" | "md";

export type ButtonProps = Omit<ComponentPropsWithRef<"button">, "children"> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Ocupa toda a largura disponível. */
  fullWidth?: boolean;
  /** Mostra o spinner e desabilita o botão. */
  loading?: boolean;
  /** Texto que substitui o rótulo enquanto carrega (ex.: "Entrando..."). */
  loadingLabel?: ReactNode;
  children?: ReactNode;
};

const BASE = [
  "inline-flex items-center justify-center gap-3",
  "rounded-pill border-0 font-extrabold tracking-[0.03em]",
  "cursor-pointer select-none transition-colors duration-150",
  "disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none",
].join(" ");

const VARIANTES: Record<ButtonVariant, string> = {
  // Navy sólido com texto branco: a ação principal de qualquer tela.
  primary: "bg-navy text-white enabled:hover:bg-navy-light",
  // Regra da marca: texto sobre amarelo é SEMPRE navy.
  accent:
    "bg-yellow text-navy shadow-[0_10px_26px_rgba(246,201,69,0.34)] enabled:hover:bg-yellow-hover",
  ghost:
    "bg-transparent text-navy enabled:hover:bg-[#EAF2FE] enabled:active:bg-[#DCE9FC]",
  danger: "bg-danger text-white enabled:hover:bg-danger-hover",
};

const TAMANHOS: Record<ButtonSize, string> = {
  lg: "h-[54px] px-7 text-[17px]",
  md: "h-[46px] px-5 text-[15px]",
};

function Spinner({ size }: { size: ButtonSize }) {
  const px = size === "lg" ? 20 : 18;
  return (
    <svg
      className="iea-spinner shrink-0"
      width={px}
      height={px}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeOpacity="0.28"
        strokeWidth="2.6"
      />
      <path
        d="M21 12a9 9 0 0 0-9-9"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Button({
  variant = "primary",
  size = "lg",
  fullWidth = false,
  loading = false,
  loadingLabel,
  disabled,
  className,
  children,
  ...props
}: ButtonProps) {
  const bloqueado = disabled || loading;

  return (
    <button
      {...props}
      disabled={bloqueado}
      aria-busy={loading || undefined}
      className={cn(
        BASE,
        VARIANTES[variant],
        TAMANHOS[size],
        fullWidth && "w-full",
        className,
      )}
    >
      {loading ? (
        <>
          <Spinner size={size} />
          <span className="sr-only">Carregando</span>
          {loadingLabel ?? children}
        </>
      ) : (
        children
      )}
    </button>
  );
}

export default Button;
