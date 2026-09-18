/**
 * Ícone de uma área do painel.
 *
 * Os desenhos são `path` de traço num viewBox 24×24, guardados como dado em
 * `nav.ts` — assim a lista de áreas continua sendo um arquivo `.ts` simples, que
 * outra área pode ler sem arrastar JSX junto.
 *
 * `currentColor` de propósito: o ícone acompanha a cor do link (navy quando
 * ativo, `--muted` quando não), e nenhuma cor precisa ser repetida aqui.
 */
export type IconeDaAreaProps = {
  /** `d` do path (campo `icone` de `AreaDoPainel`). */
  d: string;
  /** Lado do quadrado em px. */
  size?: number;
};

export function IconeDaArea({ d, size = 20 }: IconeDaAreaProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className="flex-none"
    >
      <path d={d} />
    </svg>
  );
}

export default IconeDaArea;
