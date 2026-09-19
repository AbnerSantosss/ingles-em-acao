/**
 * Modo foco: a aula (`/aula/<slug>`) e o resultado dela (`/aula/<slug>/resultado`)
 * ocupam a tela inteira, sem o cabeçalho do app e sem a barra de navegação de
 * baixo. Essas duas telas têm a própria casca em `100dvh` (`LeitorDaAula` e a
 * página de resultado), com botão de voltar para a trilha.
 *
 * A regra fica numa função pura, fora do componente, para ser testada sem
 * navegador (`tests/ui/modo-foco.test.ts`). Um grupo de rotas `(foco)` com layout
 * próprio faria o mesmo sem JavaScript, mas obrigaria a mover
 * `src/app/(app)/aula/**`, que tem outro dono no plano v2 (pacote 06).
 */
const ROTA_DE_FOCO = /^\/aula\/[^/]+(?:\/resultado)?\/?$/;

/** `true` quando o caminho é a aula ou o resultado dela. */
export function ehRotaDeFoco(caminho: string | null | undefined): boolean {
  if (!caminho) return false;
  return ROTA_DE_FOCO.test(caminho);
}
