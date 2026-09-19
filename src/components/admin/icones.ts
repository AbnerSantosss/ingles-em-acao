/**
 * Desenhos dos ícones da casca e do dashboard.
 *
 * Mesmo formato dos ícones de `nav.ts`: o `d` de um `path` de traço num viewBox
 * 24×24, desenhado por `IconeDaArea`. Ficam num `.ts` sem JSX para que o
 * cabeçalho, o hero e os cartões de número usem a mesma fonte.
 *
 * ⚠️ Os ícones das áreas (barra lateral) continuam em `nav.ts`. Aqui só entra o
 * que a navegação não tem.
 */
export const ICONES = {
  alunos:
    'M16 20v-1.5a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4V20M12.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0M17 4.3a3.5 3.5 0 0 1 0 6.4M21 20v-1.5a4 4 0 0 0-3-3.87',
  email:
    'M3 6.5A2.5 2.5 0 0 1 5.5 4h13A2.5 2.5 0 0 1 21 6.5v11a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 17.5zM3.5 7l8.5 6 8.5-6',
  relogio: 'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0M12 7v5l3 2',
  diamante: 'M6 3h12l4 6-10 12L2 9zM2 9h20M9 3 7.5 9 12 21l4.5-12L15 3',
  estrela:
    'M12 3l2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3 6.4 20.2l1.1-6.2L3 9.6l6.2-.9z',
  coroa: 'M3 8l4.5 4L12 5l4.5 7L21 8l-1.5 10h-15zM5 21h14',
  play: 'M7 4.5v15l12-7.5z',
  documento:
    'M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8zM14 3v5h5M9 13h6M9 17h4',
  olho: 'M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0',
  olhoRiscado:
    'M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0M4 4l16 16',
  imagem:
    'M3 6.5A2.5 2.5 0 0 1 5.5 4h13A2.5 2.5 0 0 1 21 6.5v11a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 17.5zM3 16l5-4.5 4 3.5 3-2.5 6 5M15.5 9a1 1 0 1 1-2 0 1 1 0 0 1 2 0',
  video:
    'M3 7.5A2.5 2.5 0 0 1 5.5 5h8A2.5 2.5 0 0 1 16 7.5v9a2.5 2.5 0 0 1-2.5 2.5h-8A2.5 2.5 0 0 1 3 16.5zM16 10l5-3v10l-5-3',
  paleta:
    'M12 3a9 9 0 1 0 0 18c1.4 0 2-1 2-2 0-1.5-1-2-1-3s.8-2 2-2h2.5A3.5 3.5 0 0 0 21 10.5C21 6.4 17 3 12 3M7.5 12h.01M9.5 8h.01M14.5 7.5h.01',
  atividade: 'M3 12h4l3-8 4 16 3-8h4',
  grade: 'M4 4h7v7H4zM13 4h7v4h-7zM13 10h7v10h-7zM4 13h7v7H4z',
  sair: 'M9 4H6.5A2.5 2.5 0 0 0 4 6.5v11A2.5 2.5 0 0 0 6.5 20H9M15 8l4 4-4 4M19 12H9',
} as const;

export type NomeDoIcone = keyof typeof ICONES;
