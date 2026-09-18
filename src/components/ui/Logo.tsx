import { cn } from "@/lib/ui/cn";

export type LogoProps = {
  /** Lado do quadrado em px. 58 na tela de login, 44 dentro do app. */
  size?: number;
  /** Mostra a marca "Inglês em Ação" em duas linhas ao lado do quadrado. */
  withWordmark?: boolean;
  className?: string;
};

type Metricas = {
  radius: number;
  /** corpo das letras "IA" */
  mark: number;
  /** corpo da marca escrita */
  word: number;
  gap: number;
};

// Os dois tamanhos canônicos vêm medidos do protótipo; os demais escalam.
const CANONICAS: Partial<Record<number, Metricas>> = {
  58: { radius: 16, mark: 23, word: 22, gap: 12 },
  44: { radius: 13, mark: 17, word: 16, gap: 12 },
};

function metricas(size: number): Metricas {
  return (
    CANONICAS[size] ?? {
      radius: Math.round(size * 0.28),
      mark: Math.round(size * 0.39),
      word: Math.round(size * 0.375),
      gap: Math.max(8, Math.round(size * 0.21)),
    }
  );
}

export function Logo({
  size = 58,
  withWordmark = true,
  className,
}: LogoProps) {
  const m = metricas(size);

  return (
    <span
      className={cn("inline-flex items-center", className)}
      style={{ gap: m.gap }}
      {...(withWordmark
        ? {}
        : { role: "img" as const, "aria-label": "Inglês em Ação" })}
    >
      <span
        aria-hidden={withWordmark ? "true" : undefined}
        className="grid flex-none place-items-center font-black"
        style={{
          width: size,
          height: size,
          borderRadius: m.radius,
          background: "linear-gradient(160deg,#123A86,#0A1F4E)",
          color: "#F6C945",
          fontSize: m.mark,
          letterSpacing: "0.02em",
          boxShadow: "0 8px 18px rgba(11,31,75,0.22)",
        }}
      >
        IA
      </span>

      {withWordmark ? (
        <span
          className="font-black text-navy"
          style={{
            fontSize: m.word,
            lineHeight: 1.05,
            letterSpacing: "-0.01em",
          }}
        >
          Inglês
          <br />
          em Ação
        </span>
      ) : null}
    </span>
  );
}

export default Logo;
