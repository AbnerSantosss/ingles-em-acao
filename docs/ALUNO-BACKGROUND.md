# Background da área do aluno

Criado em 2026-10-10 com a ferramenta integrada `image_gen`.

Arquivo final: `public/brand/aluno-new-york.webp` (1920 × 640, 176.210 bytes).
Usado no início, no resumo do progresso e como reserva para aulas sem capa.
As capas cadastradas das aulas continuam sendo usadas.

## Prompt final

Create one premium photographic website background for WSA English, an American English learning app. Very wide landscape 3:1 composition. Authentic New York City skyline at blue hour seen from across the East River, with Brooklyn Bridge entering from the right, recognizable American skyscrapers, restrained warm golden window lights and dark navy sky. Polished realistic architectural travel photography, quiet and credible. Leave the left 55 percent mostly dark open navy sky and calm river as negative space for white interface text; architectural detail mainly right half, skyline around vertical middle so it survives a shallow horizontal banner crop. Brand colors deep midnight navy #0A1F4E, subtle blue, warm gold #FFD044. No text, no logos, no typography, no illustrations, no collage, no globe, no British landmarks, no flags. The image is a decorative backdrop, not a complete user interface. Save image for use as a background.

## Avanço exibido

O percentual da aula usa as páginas anteriores à posição salva, dividido pelo total de páginas publicadas. Exemplo: página 3 de 8 = 2 páginas percorridas = 25%. A primeira página começa em 0%; 100% exige conclusão explícita. Voltar páginas acompanha a posição salva, não é uma contagem de páginas únicas visitadas. O avanço da aula é separado da nota dos exercícios e do percentual de aulas concluídas na trilha.

## Validação

- Build de produção e TypeScript passaram.
- 32 testes passaram, incluindo contagem sobre conteúdo publicado e retomada persistida.
- ESLint dos arquivos alterados passou. O lint geral encontrou dois erros preexistentes em `prototype/claude-designer/support.js`.
- Conferência no navegador a 1480, 390 e 320 pixels; sem rolagem horizontal nas páginas início e progresso.
- Retomada verificada na Aula 02: página 3 (25%), avanço à página 4 (38%), saída e reabertura na posição salva. Posição original restaurada ao final.
