import type { ComponentPropsWithRef } from "react";

import { cn } from "@/lib/ui/cn";
import { SOLID, SOLID_FG, type SolidName } from "@/lib/ui/palette";

export type PillProps = ComponentPropsWithRef<"span"> & {
  /** Cor sólida da paleta `SOLID`. Padrão: navy. */
  color?: SolidName;
};

export function Pill({ color = "navy", className, style, ...props }: PillProps) {
  return (
    <span
      {...props}
      style={{
        background: SOLID[color],
        color: SOLID_FG[color],
        // O chip branco precisa de recorte para não sumir na superfície.
        borderColor: color === "white" ? "var(--border)" : "transparent",
        ...style,
      }}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-pill border border-solid",
        "px-3 py-1.5 text-[12px] font-extrabold uppercase leading-none tracking-[0.08em]",
        className,
      )}
    />
  );
}

export default Pill;
