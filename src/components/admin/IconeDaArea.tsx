/**
 * Ícone de traço do painel.
 *
 * Os desenhos são `path` de traço num viewBox 24×24, guardados como dado: os das
 * áreas em `nav.ts`, os do cabeçalho e do dashboard em `icones.ts`. Assim essas
 * listas continuam sendo arquivos `.ts` simples, que outra área pode ler sem
 * arrastar JSX junto.
 *
 * `currentColor` de propósito: o ícone acompanha a cor de quem o envolve (branco
 * na barra lateral escura, navy no cabeçalho, a cor do tom nos cartões de
 * número), e nenhuma cor precisa ser repetida aqui.
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
