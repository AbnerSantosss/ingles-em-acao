# Landing page — implementação

A landing é a porta pública do produto: quem abre `/` sem sessão cai nela; quem
já tem sessão vai direto para `/inicio`. Decisão do PO de 2026-08-28 (US47),
agora trazida para o `app-web`.

Código:
- `src/app/page.tsx` — decide entre landing e `/inicio`, lê os links de checkout.
- `src/components/landing/Landing.tsx` — a página permanece um componente de
  servidor; o FAQ usa `<details>` nativo.
- `src/components/landing/copy.ts` e `visual-copy.ts` — copy e textos dos exemplos
  visuais centralizados.
- `src/components/landing/Experiencias.tsx` — chats ilustrativos, celular e
  sequência de fotos, com animação por CSS.
- `src/components/landing/Interacoes.tsx` e `BarraDeProgresso.tsx` — ilhas de
  cliente para revelar os pilares no scroll, inclinar os balões com o mouse e
  iniciar o progresso quando entra na tela.
- `src/components/ui/component.tsx` — ilha de cliente `GlobePulse`, que desenha
  o globo dourado em canvas; há fallback em SVG.
- `src/components/landing/ilustracoes.tsx` — trilha das aulas e ícones em SVG.
- `src/components/landing/landing.module.css` e `interacoes.module.css` — layout,
  fundos, animações e ajustes responsivos.
- `public/brand/` — imagens da marca, estudante, três passos, campus e professor.

## 1. Objetivo e público

- **Quem chega:** adulto que já tentou estudar inglês, travou e acha que o problema
  é ele. Pouco tempo, vergonha de falar, medo de pagar e não ver resultado
  (as 9 dores do diagnóstico, [[product-lock]]).
- **O que a página precisa fazer:** vender a **primeira aula**. O objetivo é o
  cadastro (`/criar-conta`). A compra vem depois, quando o admin coloca os links
  de checkout.
- **Métrica:** cliques no CTA do hero e na seção de planos, e cadastros vindos da `/`.

## 2. A promessa da primeira dobra

> ⚠️ **LOCK 25:** nada de "fluente em X dias", "fale como nativo" ou "sem esforço".
> "Quero ser fluente agora" já foi pedido e descartado em 2026-08-28.

Uma promessa forte e honesta ao mesmo tempo precisa ser **concreta**: dizer o que a
pessoa vai conseguir fazer, e não quanto tempo vai levar. O conteúdo das 42 aulas
([[conteudo-programatico-modulo-01]]) sustenta cada item:

| O aluno vai conseguir… | Aulas |
|---|---|
| se apresentar e cumprimentar | 01–05 |
| dizer de onde é e falar da família | 06–09 |
| descrever a casa, os objetos, as cores e os números | 10–20 |
| dizer as horas e falar da rotina e do trabalho | 21–29 |
| pedir direções, dizer do que gosta e falar das refeições | 31–39 |
| contar o que fez no passado | 40–42 |

**H1:** "Aprenda inglês do zero e converse de verdade com a IA, desde as primeiras aulas."

**Subtítulo:** "42 aulas curtas + prática de conversação com IA, orientada pelo que
você já estudou."

O chip "NOVO: converse em inglês com a IA" e a nota sob os botões foram removidos.
A explicação de como **Praticar a aula** abre o ChatGPT na conta do aluno permanece
na seção de conversa e no FAQ.

**CTA 1:** "ASSISTIR PRIMEIRA AULA", levando a `/criar-conta`.

**CTA secundário:** "Ver como funciona a conversa", âncora para `#conversa-ia`.

Os três blocos de garantias após a faixa de recursos foram removidos.

A hero tem pouco espaço acima da headline, com texto e botões alinhados ao topo.
O celular aparece cortado, mostrando só as duas falas iniciais do exemplo:
"Hi! What’s your name?" → "I’m Ana.". O corte inferior é seco e demarcado por
uma linha roxa mais larga que o aparelho; não há fade.

No desktop, o fundo `hero-desktop-sem-globo.webp` mantém o cenário da marca,
sem o globo estático. O `GlobePulse` dourado fica decorativo no canto direito,
por trás do celular e com opacidade reduzida. No celular, permanece o fundo
`hero-mobile.webp`; o globo em canvas é ocultado.

A promessa fica visível sem rolar a página.

No celular (até 767 px), título e subtítulo ficam centralizados. A headline usa
26–28 px, e o botão principal usa 12 px, sem a seta. O desktop mantém a
tipografia e o alinhamento anteriores.

## 3. Sequência da página

| # | Seção | Função | Apresentação |
|---|---|---|---|
| 0 | Cabeçalho | Logo WSA, âncoras (a partir de `xl`) e "Entrar" | Logo real da marca sobre navy |
| 1 | **Hero** | Promessa, dois CTAs e faixa de recursos | Dobra compacta, celular com duas falas, corte com linha roxa e globo dourado animado no desktop |
| 2 | Dor | "Você já tentou e travou": falas que descrevem as dores | Balões com entrelinhas compactas e chips transparentes, com contorno e texto navy; brilho a cada 3 s na resposta sobre IA. As três fotos mantêm corte seco de 1 s e contorno roxo. Robô pensando sobreposto ao canto inferior direito, flutuando suavemente num ciclo de 4 s |
| 3 | Como funciona | Aprenda → Pratique → Avance | Fotos com perspectiva nas quatro margens no desktop e títulos alinhados, amarelos no hover. Ilustrações de vídeo, voz e progresso completam os cards. Sem setas entre os cards, tanto no desktop quanto no celular |
| 4 | **Conversa com IA** | "Estudou a aula? Agora converse sobre ela." | Roxo escuro, textura quadriculada à esquerda, chat ilustrativo e foto da universitária no campus à direita, com degradê de opacidade |
| 5 | **O que você vai conseguir dizer** | A promessa detalhada: 6 marcos da trilha | Card navy com bandeiras roxas, chips Aula 01/42 e cidades; balões em uma faixa contínua que pausa no hover ou foco, com títulos menores roxos |
| 6 | Por que nosso método funciona | Quatro justificativas, mais a garantia de conteúdo já ensinado | Cards navy totalmente opacos, texto branco e números roxos sobre selos claros; panorama vetorial de Londres em cinza quase branco. Entrada suave de 700 ms com intervalos de 150 ms. No celular, a garantia coloca o selo e o rótulo numa linha acima do título e do corpo, que usam toda a largura |
| 7 | O que você recebe | Comparação Essencial × Premium, com IA primeiro | Tabela compacta, tipografia maior, ✔ e ✖; recursos Premium em roxo |
| 8 | O professor | Walber Santana, texto em primeira pessoa e citação | Seção compacta, foto real em círculo sobre o globo dourado da marca e rótulo "O professor" em roxo. Retrato de 270 px e globo de 300 px no desktop; 223 px e 248 px no celular |
| 9 | Planos | Premium primeiro, selo "Mais completo", CTA por plano | Globo dourado no título Premium e prateado no Essencial; robô apontando para o chat "SEU GPT" com duas mensagens de áudio ilustrativas e transcrições. Textos distribuídos conforme a referência do responsável, botões alinhados horizontalmente no desktop. Frase de evolução mantida. No celular, o título vem antes da ilustração |
| 10 | Garantia | 7 dias do CDC (**só quando há link de compra**) | Bloco com escudo dentro da seção de planos |
| 11 | Perguntas | 8 objeções respondidas; IA na segunda posição | FAQ nativo compacto, duas colunas no desktop e uma no celular |
| 12 | Fecho | Última chamada, CTA 3 | Fundo navy com textura leve e contorno neon dourado no botão "ASSISTIR PRIMEIRA AULA". Robô com celular à esquerda e textos alinhados à esquerda num conjunto centralizado no desktop. No celular, imagem acima dos textos centralizados e botão sem seta |
| 13 | Rodapé | Seções, conta, contato e links legais | Logo e descrição acima das três colunas "Nesta página", "Conta" e "Legal", em todas as larguras; entrelinhas e espaçamento reduzidos |

A frase abaixo da trilha sobre as duas aulas de revisão foi removida. Os marcos
e a progressão continuam apoiados no conteúdo das 42 aulas.

O intervalo entre título e introdução é padronizado em **8 px** em todas as
seções que possuem introdução. As ondas de áudio do Premium são ilustrativas,
não controles de reprodução; as frases permanecem como transcrições.

## 4. Regras que a página segue

- **Sem prova social inventada.** Não há depoimentos de alunos. O professor tem
  20 anos de experiência e já ajudou mais de 500 alunos, dados confirmados pelo
  responsável pelo projeto em 2026-10-10.
  As falas da seção de dor são exemplos de preocupações, sem nomes ou atribuição a
  alunos reais. Os selos descrevem o método e os recursos, sem certificação externa.
- **CTAs identificam o próximo passo:**
  - hero e fecho: "ASSISTIR PRIMEIRA AULA", no desktop e no celular;
  - planos: "Quero o Essencial" e "Quero praticar com IA";
  - os destinos de cadastro e checkout continuam seguindo as regras abaixo.
- **Sem dark pattern:**
  - nada de contador, "vagas limitadas" ou urgência falsa;
  - "Entrar" é uma alternativa neutra.
- **D26, dois modos e uma condição:**
  - **Sem link de checkout:** os CTAs de planos levam a `/criar-conta`. As notas
    sobre vendas fechadas e criação de conta foram removidas a pedido do responsável.
  - **Com link:** cada card ganha botão de compra (abre em outra aba, com aviso para
    leitor de tela), a nota explica o pagamento externo e a garantia aparece.
  - O link de cada plano vem de `/admin/configuracoes`. Vale o link do plano; se
    estiver vazio, vale o global.
- **Só promete o que existe no `app-web`:**

  | Recurso | O que a página diz |
  |---|---|
  | Prática com IA (WSA Premium) | tocar em Praticar a aula abre o ChatGPT na conta do aluno com o roteiro preparado; o app também permite copiar o roteiro quando necessário |
  | Revisão espaçada | não é citada (não existe no app) |
  | App instalável e offline | não é prometido (não há PWA) |
  | Liberação do plano após o pagamento | "o plano é liberado na sua conta" (hoje é manual, pelo admin; não há webhook) |

- **Acessibilidade:**
  - link "Ir para o conteúdo";
  - hierarquia h1 → h2 → h3 real;
  - SVGs decorativos com `aria-hidden`;
  - FAQ em `<details>`;
  - botões e CTAs com alvos de pelo menos 44 px; links do rodapé mobile com
    altura mínima de 28 px e separados em três colunas;
  - animações respeitam `prefers-reduced-motion`: a estudante fica no primeiro
    quadro, e globo, robô flutuante, perspectiva, reveal, progresso, brilho, slide e neon reduzem
    ou interrompem o movimento;
  - o slide também pausa com foco de teclado; a cópia usada para fechar o loop
    é oculta de leitores de tela. Com movimento reduzido, só os seis itens
    originais permanecem em uma faixa rolável;
  - o texto dos pilares nasce visível no HTML e permanece disponível sem JS.

## 5. Pendências antes de lançar

> ⚠️ **Garantia de 7 dias (CDC art. 49):**
> - precisa de revisão jurídica;
> - o prazo tem de ser o mesmo praticado pela plataforma de pagamento.

> ⚠️ **Termos e Privacidade existem, mas em versão preliminar (2026-09-18):**
> - `/termos` e `/privacidade` estão no ar, são rotas públicas e aparecem no rodapé
>   (coluna "Legal") e no aceite do cadastro, abrindo em outra aba;
> - o texto descreve só o que o app faz hoje, conferido no código;
> - cada página mostra o aviso "Versão preliminar" até passar por revisão jurídica.
>   Depois da revisão, tire o aviso em `src/components/legal/PaginaLegal.tsx`;
> - o texto promete encerrar a conta e apagar os dados a pedido, por e-mail. Não há
>   botão para isso no app, então esse atendimento é manual;
> - `cleanupExpiredTokens`, `cleanupExpiredSessions` e `cleanupOldAttempts` existem,
>   mas nada os agenda. Por isso a política não promete apagar esses dados sozinha.

> ⚠️ **E-mail de contato:** `contato@wsaenglish.com.br` veio da versão anterior.
> Confirmar se a caixa existe. Ele está em `EMAIL_DE_CONTATO` (`PaginaLegal.tsx`)
> e em `copyDaLanding.rodape.email`.

**Professor:** o responsável pelo projeto confirmou em 2026-10-10 os 20 anos de
experiência, mais de 500 alunos e a foto "WALBER SANTANA" na pasta do projeto.
A descrição não atribui um resultado específico aos alunos sem confirmação.

## 6. Validação da atualização de 2026-10-10

- Em uma janela de laptop de **1366 × 768**, foram verificadas as alturas:
  **hero: 495 px**, **planos: 648 px** e **FAQ fechado: 407 px**. Planos e FAQ
  cabem em uma tela nessa resolução; respostas abertas e a garantia condicional
  de compra podem aumentar a altura. No celular, os blocos empilham e mantêm
  altura natural.
- A checagem de tipos com `tsc` e o lint dos arquivos alterados passam.
- Perspectiva nas quatro margens, alinhamento dos títulos e pausa/retomada do
  slide foram conferidos no navegador. A nova foto do professor carrega em
  900 × 900. Não houve overflow horizontal em 320 e 390 px de largura.
- Os quatro cards do método usam `#0a1f4e` totalmente opaco no fundo; texto branco
  e conteúdo continuam com opacidade 1. Os chips da dor têm fundo transparente.
  O Premium mantém 24 px entre a frase de evolução e o botão no desktop e
  apresenta dois áudios ilustrativos. Os botões dos dois planos têm o mesmo
  topo e a mesma altura no desktop. A seção do professor mede 380 px em
  1366 × 768. Em 1280 × 720, os planos cabem inteiros na tela.
- Em 1366 px de largura, o rodapé mede 334 px. Em 390 px, foi reduzido de cerca
  de 971 para 361 px, e a garantia mede 219 px. Em 320 px, o rodapé mede 399 px, e título e corpo
  da garantia ocupam toda a largura útil do card. As duas resoluções não
  apresentam overflow horizontal. Todos os títulos e subtítulos das dobras
  ficam centralizados no celular. O rótulo "ASSISTIR PRIMEIRA AULA" nos dois
  CTAs e a ausência de suas setas no celular foram conferidos no navegador.
- O lint global continua falhando em dois erros preexistentes de
  `prototype/claude-designer/support.js`; eles não foram introduzidos por esta
  atualização da landing.
- As imagens foram inspecionadas após a conversão para WebP. Prompts e origens:
  [backgrounds](assets/backgrounds-prompts.md),
  [três passos](assets/passos-fotografias-prompts.md) e
  [estudante](assets/estudante-frustrada-prompts.md).
- O robô e a nova foto de Walber são arquivos fornecidos pelo responsável,
  convertidos para WebP com transparência preservada no robô. Origens e saídas
  estão em [assets fornecidos](assets/arquivos-fornecidos.md).
