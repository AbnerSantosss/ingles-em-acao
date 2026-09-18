/**
 * As sete áreas do painel — BACKOFFICE §2.
 *
 * ⚠️ **A navegação nasce completa.** As sete entradas existem desde a Fase 1,
 * antes de as telas existirem, por um motivo de coordenação: os agentes que vão
 * construir Módulos, Aulas, Vídeos, Alunos, Mídia e Configurações **não podem
 * precisar mexer na casca** para o link deles aparecer. Enquanto a tela não
 * existe, a entrada é renderizada inerte (`aria-disabled`, sem `href`) — um
 * link morto é melhor que um 404 na cara do PO.
 *
 * Quando a tela de uma área entrar no ar, troque o `pronta: false` da linha
 * correspondente por `true`. **É a única linha desta pasta que outra área
 * precisa tocar** — nada de acrescentar item, reordenar ou mexer no layout.
 *
 * A ordem aqui é a ordem da barra lateral, e ela segue o §2: primeiro o que se
 * olha todo dia (Dashboard), depois a estrutura do conteúdo (Módulos → Aulas →
 * Vídeos), depois as pessoas e os arquivos, e por fim as configurações.
 */

export type AreaDoPainel = {
  /** Rota da área. Também identifica a entrada. */
  href: string;
  rotulo: string;
  /** Uma frase curta para o `title` e para o dashboard. */
  descricao: string;
  /** `d` do path do ícone, viewBox 24×24, traço. */
  icone: string;
  /** A tela já existe? `false` renderiza a entrada inerte. */
  pronta: boolean;
};

export const AREAS: readonly AreaDoPainel[] = [
  {
    href: '/admin',
    rotulo: 'Dashboard',
    descricao: 'O estado do produto num relance.',
    icone: 'M4 4h7v7H4zM13 4h7v4h-7zM13 10h7v10h-7zM4 13h7v7H4z',
    pronta: true,
  },
  {
    href: '/admin/modulos',
    rotulo: 'Módulos',
    descricao: 'Os 7 módulos, sua ordem e a faixa de aulas de cada um.',
    icone: 'M12 3 3 7.5l9 4.5 9-4.5zM3 12.5 12 17l9-4.5M3 17 12 21.5 21 17',
    pronta: true,
  },
  {
    href: '/admin/aulas',
    rotulo: 'Aulas',
    descricao: 'As 42 aulas: dados, páginas, blocos e publicação.',
    icone: 'M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5zM4 5.5v15M8 7.5h8M8 11h5',
    pronta: true,
  },
  {
    href: '/admin/videos',
    rotulo: 'Vídeos',
    descricao: 'Videoaula de cada aula e a allowlist de embed.',
    icone: 'M3 6.5A2.5 2.5 0 0 1 5.5 4h13A2.5 2.5 0 0 1 21 6.5v11a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 17.5zM10 9l5 3-5 3z',
    pronta: true,
  },
  {
    href: '/admin/alunos',
    rotulo: 'Alunos',
    descricao: 'Contas, planos, verificação e sessões.',
    icone: 'M16 20v-1.5a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4V20M12.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0M17 4.3a3.5 3.5 0 0 1 0 6.4M21 20v-1.5a4 4 0 0 0-3-3.87',
    pronta: true,
  },
  {
    href: '/admin/midia',
    rotulo: 'Mídia',
    descricao: 'Capas e ilustrações, com o índice de uso.',
    icone: 'M3 6.5A2.5 2.5 0 0 1 5.5 4h13A2.5 2.5 0 0 1 21 6.5v11a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 17.5zM3 16l5-4.5 4 3.5 3-2.5 6 5M15.5 9a1 1 0 1 1-2 0 1 1 0 0 1 2 0',
    pronta: true,
  },
  {
    href: '/admin/configuracoes',
    rotulo: 'Configurações',
    descricao: 'Link de checkout, vídeo padrão e allowlist.',
    icone: 'M4 7h16M4 12h16M4 17h16M9 5v4M15.5 10v4M11 15v4',
    pronta: true,
  },
];

/**
 * A área correspondente a um caminho.
 *
 * Casa a rota mais específica primeiro, senão `/admin/aulas/7` acenderia a
 * entrada do Dashboard (todo caminho do painel começa com `/admin`).
 */
export function areaDoCaminho(caminho: string): AreaDoPainel | null {
  const candidatas = AREAS.filter(
    (area) => caminho === area.href || caminho.startsWith(`${area.href}/`),
  );

  if (candidatas.length === 0) return null;

  return candidatas.reduce((mais, atual) =>
    atual.href.length > mais.href.length ? atual : mais,
  );
}
