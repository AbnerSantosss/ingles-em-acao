# Landing page — planejamento

A landing é a porta pública do produto: quem abre `/` sem sessão cai nela; quem
já tem sessão vai direto para `/inicio`. Decisão do PO de 2026-08-28 (US47),
agora trazida para o `app-web`.

Código:
- `src/app/page.tsx` — decide entre landing e `/inicio`, lê os links de checkout.
- `src/components/landing/Landing.tsx` — a página (componente de servidor, zero JS
  de cliente; o FAQ usa `<details>` nativo).
- `src/components/landing/copy.ts` — **todo** o texto da página. Nenhuma frase nasce
  no JSX.
- `src/components/landing/ilustracoes.tsx` — todas as imagens, em SVG inline.

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

**H1:** "Do zero a falar de você em inglês, em 42 aulas curtas."

**Subtítulo:** "Se apresentar, falar da família e da rotina, pedir no restaurante,
contar o que fez ontem. Cada aula termina com algo que você já consegue dizer,
e o app mostra isso para você."

**CTA 1:** "QUERO COMEÇAR PELA AULA 01", com a nota "Cadastro em menos de um minuto.
A Aula 01 abre logo em seguida."

**Três garantias sob o CTA:**
- começa do zero;
- aulas de 8 a 15 minutos;
- você retoma de onde parou.

A ilustração do hero é um celular em SVG. Na tela aparecem:
- o card da aula;
- a lista "Eu consigo";
- os balões "Hi! I'm Ana." e "I'm from Brazil.".

A promessa fica visível sem rolar a página.

## 3. Sequência da página

| # | Seção | Função | Imagem (SVG) |
|---|---|---|---|
| 0 | Cabeçalho | Logo, âncoras (só a partir de `lg`), "Entrar" | Logo "IA" em CSS |
| 1 | **Hero** | Promessa, CTA 1 e três garantias | Celular com a aula e a lista "Eu consigo" |
| 2 | Dor | "Você já tentou antes": 4 dores com as palavras do aluno | Ícone por dor |
| 3 | **O que você vai conseguir dizer** | A promessa detalhada: 6 marcos da trilha | Trilha de 42 pontos com 6 marcos |
| 4 | Como funciona | Aprenda → Pratique → Avance | 3 ícones |
| 5 | O método | Estrutura, progresso, aplicação e continuidade, mais o "Future Firewall" em destaque | Ícones e escudo |
| 6 | O que você recebe | 7 itens, com o plano indicado em cada um | Visto |
| 7 | O professor | Walber Santana e o método de sala de aula | Retrato **ilustrado** em SVG (não é foto) |
| 8 | Planos | WSA Essencial e WSA Premium, com CTA 2 | Livro e microfone |
| 9 | Garantia | 7 dias do CDC (**só quando há link de compra**) | Escudo |
| 10 | Perguntas | 8 objeções respondidas | — |
| 11 | Fecho | Última chamada, CTA 3 | Skyline de Londres com o Big Ben em SVG |
| 12 | Rodapé | Seções, conta e contato | Logo |

## 4. Regras que a página segue

- **Sem prova social inventada.** Não há depoimento, nota, número de alunos nem selo,
  porque nenhum existe ainda. Quando existirem, entram com fonte.
- **Três CTAs com três rótulos diferentes**, porque um leitor de tela lista os links
  da página:
  - hero: "QUERO COMEÇAR PELA AULA 01";
  - planos: "QUERO ESCOLHER MEU PLANO" ou "QUERO GARANTIR MEU ACESSO";
  - fecho: "QUERO FAZER MINHA PRIMEIRA AULA".
- **Sem dark pattern:**
  - nada de contador, "vagas limitadas" ou urgência falsa;
  - "Entrar" é uma alternativa neutra.
- **D26, dois modos e uma condição:**
  - **Sem link de checkout:** a nota diz que preço e forma de pagamento aparecem quando a compra estiver aberta, e o
    CTA de planos leva a `/criar-conta`.
  - **Com link:** cada card ganha botão de compra (abre em outra aba, com aviso para
    leitor de tela), a nota explica o pagamento externo e a garantia aparece.
  - O link de cada plano vem de `/admin/configuracoes`. Vale o link do plano; se
    estiver vazio, vale o global.
- **Só promete o que existe no `app-web`:**

  | Recurso | O que a página diz |
  |---|---|
  | Prática com IA (WSA Premium) | um prompt pronto, levado para a IA que o aluno preferir |
  | Revisão espaçada | não é citada (não existe no app) |
  | App instalável e offline | não é prometido (não há PWA) |
  | Liberação do plano após o pagamento | "o plano é liberado na sua conta" (hoje é manual, pelo admin; não há webhook) |

- **Acessibilidade:**
  - link "Ir para o conteúdo";
  - hierarquia h1 → h2 → h3 real;
  - SVGs decorativos com `aria-hidden`;
  - FAQ em `<details>`;
  - alvos de toque com pelo menos 44px.

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

**Foto real do professor:** o retrato é ilustrado. Quando houver foto autorizada,
ela substitui o SVG em `RetratoDoProfessor`.
