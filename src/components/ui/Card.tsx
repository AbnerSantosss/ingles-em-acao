import type { ComponentPropsWithRef, CSSProperties } from "react";

import { cn } from "@/lib/ui/cn";
import { V, type VariantName } from "@/lib/ui/palette";

export type CardProps = ComponentPropsWithRef<"div"> & {
  /**
   * Nome da paleta de variantes (`V`). Aplica bg/fg/borda do bloco.
   * Sem variante, o card é a superfície branca padrão com sombra.
   */
  variant?: VariantName;
  /** Remove o padding de 20px (para cards que abrigam mídia sangrada). */
  flush?: boolean;
  /** Mantém a sombra de card mesmo em variantes coloridas. */
  elevated?: boolean;
};

export function Card({
  variant,
  flush = false,
  elevated = false,
  className,
  style,
  ...props
}: CardProps) {
  const paleta = variant ? V[variant] : null;

  // Cores de variante vêm por dado (o bloco escolhe a cor), então vão em
  // style inline — não dá para gerar 13 conjuntos de classes por antecipação.
  const estiloVariante: CSSProperties | undefined = paleta
    ? {
        background: paleta.bg,
        color: paleta.fg,
        borderColor: paleta.bd,
      }
    : undefined;

  return (
    <div
      {...props}
      style={{ ...estiloVariante, ...style }}
      className={cn(
        "rounded-card",
        paleta
          ? "border-[1.5px] border-solid"
          : "border-0 bg-surface text-text shadow-card",
        paleta && elevated && "shadow-card",
        !flush && "p-5",
        className,
      )}
    />
  );
}

export default Card;
