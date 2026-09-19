# BACKOFFICE — Plano de execução do painel administrativo

> **Status:** plano. Nada aqui foi implementado. Este documento é o roteiro que a rodada do
> admin vai seguir.
> **Subordinado a** `docs/CONTRACT.md`. Onde este documento propuser mudança no contrato
> (há uma, na §6.2, e é importante), está marcado como **PROPOSTA DE MUDANÇA DE CONTRATO** e
> precisa de decisão explícita antes de codar.
> **Fontes lidas:** `docs/CONTRACT.md`, `content/course-data.mjs` (42 aulas / 309 páginas),
> `prototype/mobile.dc.html` (linhas 996–1645, o renderer de blocos), `docker-compose.yml`,
> `package.json`, e no vault: `../wiki/tecnico/painel-admin-cms.md` e
> `../wiki/roadmap/plano-painel-admin-comercial.md` — **os dois existem** e várias regras
> deste plano vêm deles (workflow draft/publish, "não apagar asset em uso", "não editar
> progresso livremente", grants com motivo obrigatório, `npm run admin:create`, allowlist de
> embed de vídeo, exclusão por anonimização). O que **não** foi trazido de lá é o aparato
> pedagógico pesado (Knowledge Elements, Can-Dos, LCP, Session Blueprints, Future Firewall,
> RBAC de 8 papéis, workflow de 5 estados com revisor humano): o app-web tem `User.role` com
> **dois** valores e `Lesson.pages` como **um Json**. Trazer o CMS completo da wiki seria
> projetar para um domínio que este código não tem. O plano abaixo é o subconjunto que cabe
> no schema do contrato, com os ganchos certos para crescer depois.

---

## 0. Resumo das decisões (leia isto e você já sabe o plano)

| # | Decisão | Onde |
|---|---|---|
| D1 | `/admin` é protegido em **duas camadas**: `proxy.ts` (otimista, só presença de cookie) + verificação real de `role` no `layout.tsx` do grupo `(admin)`. O proxy **nunca** consulta o banco. | §1 |
| D2 | STUDENT logado que acessa `/admin` recebe **404**, não 403. O painel não existe para ele. | §1.4 |
| D3 | Primeiro admin por `npm run admin:create` (tsx, argv/env, argon2, senha mínima de 12). Nunca por seed automático, nunca por tela de cadastro. | §1.3 |
| D4 | Editor de conteúdo **híbrido**: formulário por tipo de bloco (o caminho normal) + editor JSON com validação zod (o escape) + preview ao vivo. Não é "JSON cru" nem "só formulário". | §3 |
| D5 | O preview **importa o renderer do aluno**. Um renderer só, dois provedores de interação (persistente e efêmero). | §3.4 |
| D6 | Imagens e capas → **volume Docker** (o deploy é VPS+Portainer, o disco é durável). Vídeo → **link externo com allowlist** ou **arquivo enviado ao bucket S3-compatível (Cloudflare R2)**, à escolha do admin por aula (decisão do PO, 2026-09-17 — ver §4.3). Vídeo **nunca** no volume. | §4 |
| D7 | `Lesson.pages` (publicado) e `Lesson.draftPages` (rascunho) são colunas diferentes. O app do aluno **só** lê `pages` de aula com `published = true`. Salvar ≠ publicar. | §5, §6.4 |
| D8 | Nada é apagado de verdade: `archivedAt` em Module/Lesson/MediaAsset, `AuditLog` append-only, `LessonVersion` como histórico de publicações. | §6 |
| D9 | **A armadilha:** as chaves de resposta do contrato derivam de campos que o admin pode editar (`blockTitle`). Renomear um bloco no admin **órfã silenciosamente** as respostas de todos os alunos. Fix na §6.2 — precisa ser resolvido **antes do primeiro aluno real**, porque depois fica caro. | §6.2 |
| D10 | Aula concluída **continua concluída** quando o conteúdo muda. `score`/`total` viram cache recalculável, não verdade. | §6.5 |

---

## 1. Controle de acesso

### 1.1 As duas camadas (defesa em profundidade)

O contrato (§5.9) já diz que toda rota sob `(app)` exige sessão. `/admin` exige **sessão +
papel**, e as duas coisas são checadas em lugares diferentes de propósito.

**Camada 1 — `src/proxy.ts`.**
Atenção: no Next 16 o arquivo de middleware **chama-se `proxy.ts`**, não `middleware.ts`
(`node_modules/next/dist/docs/01-app/01-getting-started/16-proxy.md`: *"Starting with
Next.js 16, Middleware is now called Proxy"*). O contrato usa a palavra "middleware" no
sentido conceitual; o arquivo é `src/proxy.ts` e **pertence ao agente de autenticação** —
a rodada do admin **não cria e não reescreve** esse arquivo, apenas pede que o `matcher`
inclua `/admin/:path*`.

O proxy só consegue fazer uma checagem **otimista**: o cookie `iea_session` guarda um token
opaco de 32 bytes, e o papel do usuário **não está no cookie** — está no banco. O proxy roda
no edge, em toda navegação e em todo prefetch; consultar o Postgres ali é o erro clássico.
Portanto:

```ts
// src/proxy.ts — trecho que o agente de auth precisa incluir (NÃO é arquivo do admin)
const isAdmin = pathname.startsWith('/admin')
const token = req.cookies.get('iea_session')?.value

if ((isAdmin || isApp) && !token) {
  const url = new URL('/entrar', req.url)
  url.searchParams.set('next', pathname + search)   // Return Intent do contrato §5.7
  return NextResponse.redirect(url)
}
// O papel NÃO é decidido aqui. Quem decide é o layout de (admin).
```

**Camada 2 — `src/app/(admin)/layout.tsx`.** É aqui que a autorização de verdade acontece,
porque é aqui que existe acesso ao banco:

```tsx
// src/app/(admin)/layout.tsx
import { notFound } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth/session'   // interface do CONTRACT §9

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser()
  if (!user) notFound()                 // sem sessão: o proxy já deveria ter redirecionado
  if (user.role !== 'ADMIN') notFound() // aluno logado: o painel não existe
  return <AdminShell user={user}>{children}</AdminShell>
}
```

**Camada 3 — cada Server Action.** Layout não protege mutação. Um `POST` de Server Action
chega direto no servidor; o layout não roda. Toda ação do admin começa pela mesma linha:

```ts
// src/lib/admin/guard.ts
import { getCurrentUser } from '@/lib/auth/session'
import type { SessionUser } from '@/lib/auth/session'

export async function requireAdmin(): Promise<SessionUser> {
  const user = await getCurrentUser()
  if (!user || user.role !== 'ADMIN') {
    // não vaza se a sessão existe nem se o recurso existe
    throw new Error('NAO_AUTORIZADO')
  }
  return user
}
```

> ⚠️ **Se você só proteger o layout, o painel está aberto.** Server Action é um endpoint.
> A regra é: **nenhuma função em `src/lib/admin/actions/**` começa sem `await requireAdmin()`**,
> e a revisão de código dessa rodada checa isso arquivo por arquivo.

### 1.2 Sessão administrativa

A sessão de aluno é longa de propósito (30 dias com "lembrar-me"). A de admin não deve ser.
Duas medidas, ambas baratas:

- **Reautenticação por idade de sessão.** `requireAdmin()` também verifica
  `Date.now() - session.createdAt < 8h`. Passou disso, redireciona para
  `/entrar?next=<origem>&motivo=sessao_admin`. Exige uma leitura de `Session.createdAt`,
  que `getCurrentUser()` já faz.
- **"Lembrar-me" é ignorado para ADMIN.** Na criação da sessão, se o usuário é ADMIN, o
  `remember` vira `false`. Implementado em 2026-09-17 no `entrarAction`
  (`src/app/(auth)/actions.ts`): o login lê o `role` junto com o hash da senha.

Sem segundo fator, por decisão já registrada no vault
(`plano-painel-admin-comercial` §8: *"sem segundo fator no MVP"*). As compensações que
sobram carregando a proteção sozinhas: senha longa e exclusiva (§1.3), rate limit de login
que já existe no contrato (§5.4), sessão curta acima, e auditoria de tudo (§6.3).

### 1.3 Como nasce o primeiro admin

Não existe tela de "criar admin" e o seed **não** cria admin. O caminho é um script:

```jsonc
// package.json — o dono do package.json precisa adicionar (não é arquivo do admin)
"scripts": {
  "admin:create":  "tsx scripts/admin-create.ts",
  "admin:promote": "tsx scripts/admin-promote.ts"
}
```

```ts
// scripts/admin-create.ts
import { hash } from '@node-rs/argon2'
import { prisma } from '../src/lib/db'

// Uso: npm run admin:create -- --email=... --nome="..." --senha=...
// Ou por env: ADMIN_EMAIL / ADMIN_NAME / ADMIN_PASSWORD (melhor para Portainer)
function arg(nome: string) {
  const achado = process.argv.find((a) => a.startsWith(`--${nome}=`))
  return achado ? achado.slice(nome.length + 3) : undefined
}

async function main() {
  const email = (arg('email') ?? process.env.ADMIN_EMAIL ?? '').trim().toLowerCase()
  const name = arg('nome') ?? process.env.ADMIN_NAME ?? ''
  const senha = arg('senha') ?? process.env.ADMIN_PASSWORD ?? ''

  if (!email.includes('@')) throw new Error('E-mail inválido.')
  if (name.length < 2) throw new Error('Informe o nome.')
  // 12, não 8: sem segundo fator, esta senha é a única barreira do painel.
  if (senha.length < 12) throw new Error('A senha do admin precisa de pelo menos 12 caracteres.')

  const passwordHash = await hash(senha)   // Argon2id — CONTRACT §5.1
  const user = await prisma.user.upsert({
    where: { email },
    update: { role: 'ADMIN', passwordHash, emailVerifiedAt: new Date() },
    create: { email, name, passwordHash, role: 'ADMIN', emailVerifiedAt: new Date() },
  })

  // Nunca imprima a senha nem o hash.
  console.log(`Admin pronto: ${user.email} (${user.id})`)
}

main().finally(() => prisma.$disconnect())
```

Detalhes que importam:

- **`emailVerifiedAt` já preenchido.** O admin não depende de receber e-mail para entrar —
  se o SMTP estiver quebrado, o painel continua acessível (e é exatamente pelo painel que se
  conserta o SMTP).
- **`upsert`, não `create`.** Rodar duas vezes é inofensivo, e serve para trocar a senha do
  admin quando ela se perder.
- **Em produção via Portainer** a forma prática é `docker exec -it <container> npm run admin:create`
  com as variáveis já no ambiente — a senha não fica no histórico do shell.
- `admin:promote` faz só `role: 'ADMIN'` num usuário que já existe, sem tocar na senha. Com
  `--rebaixar` faz o inverso, e recusa rebaixar a última conta de admin.
- **Com o painel no ar, o caminho normal é o painel.** Em `/admin/alunos/<id>`, o bloco
  **Acesso de administrador** dá ou tira o acesso, com motivo obrigatório, auditoria
  (`user.role.change`) e alerta por e-mail para os admins. Ele recusa: dar a quem não confirmou
  o e-mail, tirar o próprio acesso e tirar o acesso da última conta de admin. As contas de admin
  não entram na lista de alunos; aparecem na seção **Administradores**, embaixo dela.
- `conta:renomear` troca o nome de uma conta que já existe (contas criadas pela equipe nascem
  com nome provisório): `npm run conta:renomear -- pessoa@exemplo.com --nome "Maria Lima"`.

### 1.4 O que acontece com um STUDENT que tenta entrar

| Situação | Resposta |
|---|---|
| Sem cookie de sessão | `proxy.ts` redireciona para `/entrar?next=/admin/...` (Return Intent do contrato) |
| Cookie inválido/expirado | Idem — `getCurrentUser()` devolve `null`, o layout dá `notFound()` |
| Logado como STUDENT, abre `/admin/aulas` | **404** (`notFound()`), a página "não encontrada" padrão do app |
| STUDENT dispara uma Server Action do admin (curl, devtools) | `requireAdmin()` lança; a action devolve erro genérico; **uma linha em `AuditLog` com `outcome: 'DENY'`** |

**Por que 404 e não 403:** 403 confirma que o recurso existe e que a conta simplesmente não
tem o papel. 404 não confirma nada. O custo de usabilidade é zero — quem é admin nunca vê
essa tela. (A wiki sugere redirecionar para `/inicio`; 404 é mais fechado e igualmente
indolor. Se o PO preferir o redirect, trocar uma linha.)

Tentativa negada **é evento auditável** (`painel-admin-cms` §20: *"ação negada também é
auditada"*). Sem isso, não existe como perceber alguém sondando o painel.

---

## 2. Mapa de telas

Todas sob `src/app/(admin)/…`, prefixo de rota `/admin`. O painel é **desktop-first**
(o app do aluno é mobile-first; conteúdo não se edita bem em 430px), mas usa os mesmos
tokens de cor e a mesma fonte Figtree do contrato §3 — não é um tema à parte. A casca tem
uma barra lateral fixa e um cabeçalho com o nome do admin, o ambiente
(`produção` / `desenvolvimento`, lido de `NODE_ENV`) e "Sair".

> ⚠️ **Banner de ambiente.** Em produção, faixa discreta com o texto `PRODUÇÃO`. A wiki é
> explícita sobre isso e o motivo é banal: editar a Aula 14 achando que está no staging.

### 2.1 `/admin` — Dashboard

**Mostra:** cinco números e duas listas, tudo leitura.

- Aulas publicadas / total (`42`), aulas com rascunho pendente, aulas sem capa
  (hoje **32 das 42**: só existem `public/lessons/capas/01..10.png`), aulas sem vídeo,
  blocos de imagem sem arquivo (hoje **110** — ver §4.1).
- Alunos: total, verificados, ativos nos últimos 7 dias, por plano.
- Últimas 10 linhas do `AuditLog` (quem, o quê, quando).
- Lista "precisa de atenção": aulas cuja validação (§3.5) está em ERROR.

**Dá para fazer:** navegar. Dashboard não muta nada — é a tela que se abre cem vezes por dia,
não é lugar de botão perigoso.

### 2.2 `/admin/modulos` — Módulos

**Mostra:** os 7 módulos em ordem, com `order`, título, faixa de aulas (`fromLesson`–`toLesson`),
quantidade de aulas realmente ligadas e se há divergência entre a faixa declarada e as aulas
ligadas (ex.: módulo diz 1–6 mas tem 7 aulas apontando para ele).

**Dá para fazer:** criar, renomear, editar a faixa, reordenar (setas ↑/↓ que trocam `order`
em transação — **não** drag-and-drop livre), arquivar.

- **Arquivar módulo com aulas dentro é bloqueado.** A mensagem diz quantas aulas precisam
  ser movidas primeiro. Não existe cascata.
- Reordenar módulo é seguro (não muda a numeração das aulas, só a ordem de exibição na
  trilha). Reordenar **aula** é outra história — ver §6.6.

### 2.3 `/admin/aulas` — Lista de aulas

**Mostra:** tabela paginada (42 linhas hoje, então uma página só, mas paginada porque isso
não é para sempre) com: número, código, título, módulo, tempo estimado, capa (miniatura),
vídeo (`sem vídeo` / `padrão` / `configurado`), nº de páginas, estado
(`publicada` / `rascunho pendente` / `despublicada`), validação (`ok` / `avisos` / `erros`),
última edição (quem e quando).

**Filtros:** módulo, estado, "sem capa", "sem vídeo", "com erro de validação". Busca por
número, código, título ou slug. **Filtro e ordenação no servidor**, sempre.

**Dá para fazer:** abrir a aula, publicar/despublicar em massa (com confirmação),
duplicar aula como rascunho, criar aula nova.

### 2.4 `/admin/aulas/[numero]` — Aula (abas)

Quatro abas, porque cinco já vira menu.

**Aba "Dados".** Campos: `number` (imutável depois de criada — é ela que amarra
`LessonProgress`), `code`, `slug` (editável, mas com aviso: mudar o slug quebra links
salvos; ver §6.7), `title`, `subtitle`, `estimatedTime`, `moduleId`, `coverUrl` (seletor da
biblioteca de mídia + upload). Botões: **Salvar rascunho**, **Publicar**, **Despublicar**.

**Aba "Conteúdo".** O editor de páginas e blocos — §3.

**Aba "Vídeo".** §2.6, embutida aqui.

**Aba "Versões".** Lista de `LessonVersion` com data, autor, resumo do diff
(`"3 páginas alteradas, 1 bloco novo, 2 blocos removidos"`) e dois botões: **Ver** (preview
somente leitura) e **Restaurar como rascunho** — restaurar **nunca** publica sozinho; ela
volta para o rascunho e o admin publica se quiser. Rollback é publicar de novo, não editar
produção.

### 2.5 Editor de páginas e blocos

É a §3 inteira. Não cabe em parágrafo.

### 2.6 `/admin/videos` — Vídeos

**Mostra:** as 42 aulas com o estado do vídeo, a origem e a data da última troca.

**Dá para fazer:** por aula, colar uma fonte em quatro formatos e pré-visualizar **no mesmo
player que o aluno vê** antes de salvar. Também: "aplicar vídeo padrão às aulas sem
configuração".

O normalizador (`src/lib/admin/video-source.ts`) é função pura e é a única porta de entrada:

```ts
export type VideoSource =
  | { kind: 'youtube'; id: string; start?: number }
  | { kind: 'vimeo'; id: string }
  | { kind: 'url'; url: string }          // https, mp4/webm
  | { kind: 'upload'; assetId: string }

export function parseVideoSource(bruto: string): VideoSource | { erro: string }
```

| Colado pelo admin | Resultado |
|---|---|
| `https://www.youtube.com/watch?v=iewQ45wJ7JA` | `youtube` · `iewQ45wJ7JA` |
| `https://youtu.be/iewQ45wJ7JA?t=42` | `youtube` · `iewQ45wJ7JA`, `start: 42` |
| `<iframe src="https://player.vimeo.com/video/123" …>` | `vimeo` · `123` — **o resto do HTML é jogado fora** |
| `https://cdn.exemplo.com/aula01.mp4` | `url` (só `https:`) |
| `javascript:…`, `<script>`, host fora da allowlist | **recusa, mensagem em PT-BR** |

> ⚠️ **Do iframe guarda-se o `src`, nunca o HTML.** Guardar markup vindo do admin e
> reinjetar na página do aluno é XSS armazenado: uma conta de admin comprometida passa a
> executar script na sessão de todos os alunos. A allowlist de host
> (`youtube.com`, `youtube-nocookie.com`, `youtu.be`, `player.vimeo.com`, `vimeo.com`, mais
> o que o PO adicionar em `AppSetting.embed_allowlist`) é validada no servidor **e** repetida
> no `frame-src` do CSP — duas travas independentes.

YouTube é servido por `youtube-nocookie.com` com `rel=0`.

> ⚠️ **Vídeo no YouTube público é conteúdo público.** Quem tiver o link assiste sem plano.
> Para o vídeo genérico e para a beta, tudo bem. Para as 42 videoaulas do produto pago, não
> é aceitável — é a razão de existir o caminho de upload com URL assinada na §4.3.

### 2.7 `/admin/alunos` — Alunos

**Mostra:** tabela paginada (50/página, paginação e busca no servidor) com nome, e-mail,
plano, e-mail verificado (✓/—), aulas concluídas, aula atual, último acesso, criado em.
Filtros: plano, verificado, ativo nos últimos 30 dias.

**Dá para fazer** (lista): buscar por nome ou e-mail. Só isso — ações ficam no detalhe, onde
o admin vê o contexto.

**`/admin/alunos/[id]` — detalhe**, em três abas:

- **Visão geral:** identidade, plano, verificação, criado em, último acesso, sessões ativas
  (quantidade, user agent, IP, última vez vista).
- **Aprendizagem:** as 42 aulas com status, página atual e `score/total` por aula; dias de
  estudo (`StudyDay`) dos últimos 60 dias. **Leitura pura.**
- **Ações:** mudar plano (exige motivo), reenviar verificação de e-mail (rate limit de
  **3 por hora por aluno**, botão desabilitado com o motivo visível), encerrar todas as
  sessões, enviar redefinição de senha.

> ⚠️ **Não existe edição livre de progresso.** Nada de "marcar 42/42", nada de editar
> `LessonProgress` na mão. A wiki é explícita e o motivo é bom: progresso editável a mão
> deixa de ser evidência de aprendizado e vira campo de texto. Correção de falha real do
> sistema é uma ferramenta específica, auditada, de recálculo (§6.5) — não um input.

> ⚠️ **Esta é a maior concentração de dado pessoal do produto.** Ela responde "quem são
> todos os clientes e onde estão no funil". Por isso: `noindex` no painel inteiro,
> **sem exportação CSV** nesta fase (exportar é a via mais rápida de a base sair do
> perímetro), abertura de detalhe individual auditada, e a API/Server Action **nunca**
> devolve `passwordHash`, `tokenHash` de sessão ou token de verificação — nem mascarado.

**Excluir aluno** não está nesta fase. Quando entrar, é **anonimização**, não `DELETE`:
`email → excluido+<uuid>@invalido.local`, `name` nulo, `photoUrl` nulo, sessões revogadas,
respostas preservadas de forma anônima, `AuditLog` preservado. Exige digitar o e-mail do
aluno para confirmar, mais um motivo. Irreversível e auditada.

### 2.8 `/admin/midia` — Biblioteca de mídia

**Mostra:** grade de `MediaAsset` com miniatura, nome, tipo, tamanho, dimensões, alt text
(ou o aviso de que falta), e **onde está sendo usado** (`"Aula 06 · página 3"`,
`"capa da Aula 12"`). Filtros por tipo e por "sem alt" e "sem uso".

**Dá para fazer:** enviar arquivo, editar alt text e nome, arquivar.

> ⚠️ **Asset em uso não é apagável.** Se uma imagem aparece em 8 blocos, o botão de arquivar
> fica desabilitado e a tela lista os 8 lugares. Sem isso, a Aula 06 vira um quadrado
> cinza em produção sem ninguém perceber.

### 2.9 `/admin/configuracoes` — Configurações

Chave/valor em `AppSetting`, tudo auditado. O que mora aqui:

- **Link de checkout** (global e, opcionalmente, um por plano) — todos os botões de compra do
  app leem daqui. Uma fonte, muitos botões.
- **Vídeo padrão** das aulas sem configuração.
- **Allowlist de hosts de embed** (acrescenta à lista fixa; não substitui).
- **Estado do e-mail:** só `configurado` / `não configurado` e o remetente. **Nunca** o valor
  de `SMTP_PASSWORD`, nem mascarado, nem em resposta de action.
- **Aviso de manutenção** exibido na Home do aluno (texto + liga/desliga).

> ⚠️ **Alerta por e-mail em duas ações:** troca do link de checkout e mudança de plano de
> aluno. Custo quase zero (o transporte de e-mail já existe) e é o que transforma
> "descobri semanas depois" em "recebi um e-mail estranho hoje".

---

## 3. O editor de conteúdo — a decisão central

### 3.1 O que o editor manipula, de verdade

`Lesson.pages` é um `Json` com esta forma, tirada de `content/course-data.mjs`:

```js
pages: [
  { blocks: [ { t: "badge", label: "AULA 01" },
              { t: "title", en: "SUBJECT PRONOUNS", pt: "Pronomes pessoais do sujeito" },
              { t: "mc", title: "TESTE RELÂMPAGO", v: "cream", questions: [
                  { q: "“Eu quero falar de mim.”", options: ["I","YOU"], answer: 0,
                    explain: "Você fala sobre você mesmo → I." } ] } ] },
  { blocks: [ … ] }
]
```

Números reais, contados no arquivo: **42 aulas, 309 páginas, 1.538 blocos, 255 deles com `id`
próprio e zero `id` duplicado.** O renderer do protótipo trata **31 tipos de bloco** — não 27;
os 31 estão todos em uso no conteúdo. A lista completa,
que o editor precisa saber criar e editar:

**Estruturais (7):** `badge` · `title` · `sec` · `kicker` · `lead` · `meta` · `next`
**Texto e destaque (3):** `note` · `objective` · `key`
**Mídia (2):** `image` · `profile`
**Listas e tabelas (8):** `chips` · `answers` · `grid` · `table` · `cards` · `rows` · `steps` · `bar`
**Didáticos (4):** `pron` · `rule` · `compare` · `dialogue`
**Interativos (6):** `mc` · `fill` · `match` · `dnd` · `check` · `free`
**Comercial (1):** `cta`

Cinco desses tipos carregam **estado do aluno** e por isso são os caros de editar:
`mc`, `fill`, `match`, `dnd`, `check` (e `free`, que guarda texto livre do aluno). O resto
é apresentação e pode ser editado à vontade.

Campos por tipo, para a tabela de esquemas (extraídos do renderer,
`prototype/mobile.dc.html` 1160–1435):

| tipo | campos |
|---|---|
| `badge` | `label`, `page?` |
| `title` | `en`, `pt` |
| `sec` | `text`, `c?` |
| `kicker` | `text` |
| `lead` | `text` |
| `note` | `text`, `kicker?`, `v`, `bar?`, `center?`, `bold?` |
| `objective` | `title`, `text`, `v`, `tag?` |
| `key` | `text`, `v` |
| `meta` | `label`, `value` |
| `next` | `kicker`, `title`, `body?` |
| `image` | `id`, `ph` **(+ `src` e `alt` novos — §4.1)** |
| `profile` | `name`, `id`, `ph`, `facts[]` |
| `chips` | `title?`, `items[{ t, c }]` |
| `answers` | `title`, `items[{ k, a, c }]` |
| `grid` | `cols`, `items[{ n?, kicker?, title, body?, foot?, c, v }]` |
| `table` | `head[2]`, `rows[{ a, b, note?, v }]` |
| `cards` | `cols?`, `items[{ tag, c, v, id?, ph?, lines[], note? }]` |
| `rows` | `items[{ n?, text, c }]` |
| `steps` | `items[{ n?, tag, c, v, lines[], id?, ph?, note? }]` |
| `bar` | `label`, `value`, `pct` |
| `pron` | `code`, `pt`, `c`, `v`, `title`, `body?`, `foot?`, `tag?`, `small?` |
| `rule` | `kicker`, `from`, `to`, `ex`, `tr`, `v`, `c` |
| `compare` | `items[{ wrong, note?, right, rnote? }]` |
| `dialogue` | `items[{ s: 'a'\|'b', text }]` |
| `mc` | `title`, `v`, `questions[{ q, options[], answer, explain? }]` |
| `fill` | `id`, `title?`, `sub?`, `v`, `wide?`, `items[{ pre, post?, note?, answers[], v }]` |
| `match` | `title`, `left[]`, `right[]`, `answer[]` |
| `dnd` | `id`, `title`, `sub`, `slots[]`, `tokens[]`, `answer[]` |
| `check` | `id`, `title`, `items[string]` |
| `free` | `id`, `cols?`, `items[{ n, kicker, prefix, ideas, v, c }]` |
| `cta` | `items[{ icon: 'play'\|'mic', v, title, body, plan, btn, c }]` |

`v` é a paleta de variantes do contrato §3 (13 nomes). `c` é a paleta sólida (8 nomes).
**Os dois são `select`, nunca campo de cor livre** — é o que mantém as 309 páginas parecendo
o mesmo produto. A wiki diz a mesma coisa com outras palavras: *"o editor escolhe um
componente semântico, não define fundo #F1D5FA, borda 13px"*.

### 3.2 As três opções, honestamente

**Opção A — JSON cru com validação zod e preview ao vivo.**
Um `<textarea>` com o array de blocos da página, zod validando a cada pausa de digitação,
preview ao lado.
*A favor:* sai em um dia; cobre os 31 tipos no primeiro commit, inclusive os que aparecem
3 vezes no curso inteiro (`steps`, `compare`, `profile`); copiar/colar entre aulas funciona
de graça; nunca fica "desatualizado" em relação ao conteúdo.
*Contra:* quem vai usar isso é o PO, não um programador. Uma vírgula fora do lugar apaga a
página. Não se descobre que existe um tipo `rule` olhando a tela — só lendo o código. E
editar `answer: 0` num array de options é exatamente o tipo de coisa que gera erro silencioso
no gabarito.

**Opção B — formulário por tipo de bloco.**
31 formulários, um por tipo, com os campos certos e selects nas paletas.
*A favor:* qualquer pessoa usa; impossível quebrar o JSON; os selects fazem cumprir o design
system sem depender de disciplina; validação por campo, com mensagem no lugar certo.
*Contra:* são 31 formulários — vários com arrays aninhados (`grid.items`, `mc.questions[].options`,
`table.rows`), o que significa componentes de lista com adicionar/remover/reordenar em dois
níveis. É a maior parte do custo da rodada. E os tipos raros ficam mal servidos: gastar um dia
construindo o formulário de `compare` (3 ocorrências em 309 páginas) é péssimo uso de tempo.

**Opção C — híbrido.** Formulário para os tipos que pagam o investimento; editor JSON
validado como escape para o resto e para quem sabe o que está fazendo; **o mesmo preview
para os dois**.

### 3.3 Recomendação: **C, o híbrido — com a ordem de construção sendo a parte importante**

A recomendação não é "faça os dois", é **faça o JSON validado primeiro e os formulários por
frequência de uso**. Assim:

1. **O esquema zod vem antes de qualquer tela.** Um `z.discriminatedUnion('t', [...])` com os
   31 tipos, em `src/lib/content/blocks.ts`. Esse arquivo é a fonte de verdade da forma de um
   bloco — o renderer do aluno tipa por ele, o editor valida por ele, o validador de publicação
   usa ele, e o `course-data.mjs` é validado por ele no seed. Um esquema, quatro consumidores.
2. **O editor JSON validado é o piso.** Desde o primeiro dia, **todo** tipo é editável, porque
   o textarea aceita qualquer coisa que passe no zod. Nenhum tipo fica órfão esperando o
   formulário dele existir. Erro de zod aparece como lista em português
   (`"Bloco 3 (mc): questions[0].answer aponta para a opção 2, mas só existem 2 opções"`),
   nunca como stack trace.
3. **Os formulários chegam por frequência.** A distribuição real nos 1.538 blocos manda a ordem:
   `badge` 309 · `title` 309 · `image` 110 · `note` 90 · `objective` 78 · `cards` 70 ·
   `rule` 57 · `free` 48 · `fill` 44 · `cta` 42 · `next` 41 · `check` 40 · `mc` 31 ·
   `meta` 30 · `key` 29 · `grid` 29 · `table` 27 · `chips` 25 · `rows` 19 · `pron` 18 ·
   `sec` 18 · `dialogue` 13 · `match` 12 · `dnd` 12 · `bar` 12 · `kicker` 7 · `answers` 6 ·
   `lead` 5 · `compare` 3 · `steps` 3 · `profile` 1.
   Os **12 primeiros tipos cobrem 1.238 blocos — 80,5% do curso**; para chegar a 90% seriam
   precisos 18 formulários. Formulário para os doze, JSON para os dezenove restantes, e o
   editor já está pronto para o trabalho editorial de verdade.
4. **Um botão alterna os dois modos no mesmo bloco**, sem perder o estado: o formulário é uma
   vista sobre o mesmo objeto que o JSON mostra. Quem quiser ver o que o formulário gerou,
   clica em "JSON".

Por que não A sozinho: o usuário é o PO, e um painel que o PO tem medo de usar não é um
painel — é um arquivo `.json` com passos a mais.
Por que não B sozinho: 31 formulários antes de a primeira aula ser editável é uma rodada
inteira sem nada usável, e os últimos 19 formulários custam quase tanto quanto os 12
primeiros para servir 11% do conteúdo.

### 3.4 O preview — um renderer só, e é isso que evita o desastre

A regra é dura: **o preview importa o componente que o aluno usa.** Se o admin tiver o próprio
renderer, os dois divergem em semanas e o painel passa a mentir — que é pior do que não ter
preview.

Para isso funcionar, o renderer do motor de aulas (rodada seguinte, arquivo de outro agente)
precisa nascer com a interação **injetada**, não embutida:

```tsx
// src/components/lesson/BlockRenderer.tsx — do agente do motor de aulas
export type BlockInteraction = {
  get(key: string): string | number | boolean | undefined
  set(key: string, value: string | number | boolean): void
  isChecked(key: string): boolean
  check(key: string): void
}

export const InteractionContext = createContext<BlockInteraction>(efemero)
export function BlockRenderer({ block, lessonId }: { block: Block; lessonId: number }) { … }
```

E o painel consome assim:

```tsx
// src/app/(admin)/aulas/[numero]/_components/PreviewPagina.tsx
'use client'
import { BlockRenderer, InteractionContext } from '@/components/lesson/BlockRenderer'
import { useEstadoEfemero } from './useEstadoEfemero'   // useState, nada de servidor

export function PreviewPagina({ blocks, lessonId }: { blocks: Block[]; lessonId: number }) {
  const interacao = useEstadoEfemero()   // responder no preview não grava nada
  return (
    <InteractionContext.Provider value={interacao}>
      <div className="w-[430px] …">   {/* viewport de referência do contrato §3 */}
        {blocks.map((b, i) => <BlockRenderer key={i} block={b} lessonId={lessonId} />)}
      </div>
    </InteractionContext.Provider>
  )
}
```

O aluno usa o mesmo `BlockRenderer` com um provider que persiste em `ExerciseAnswer` via
Server Action. **O componente visual é literalmente o mesmo arquivo.**

Três exigências do preview:

- **Não grava nada.** Nem `ExerciseAnswer`, nem `LessonProgress`, nem `StudyDay`. O provider
  efêmero é `useState` e some ao fechar a aba. É o "Preview as Student" da wiki — simula sem
  gerar progresso.
- **Larguras 430 (padrão) / 768 / 1280**, porque o aluno é mobile e o admin é desktop; sem o
  seletor, edita-se cegamente para a tela errada.
- **Preview do rascunho, não do publicado.** A tela mostra `draftPages`, com uma faixa
  dizendo `RASCUNHO — o aluno ainda vê a versão publicada`.

### 3.5 Validação antes de publicar

Duas camadas: zod (forma) e semântica (sentido). O zod não pega gabarito errado.

**ERRO — impede publicar:**

- `id` de bloco duplicado em qualquer lugar do curso (os `id` são chave global — §6.2)
- `mc`: `answer` fora do intervalo de `options`; menos de 2 `options`
- `fill`: item com `answers` vazio ou com string vazia
- `match`: `left.length !== answer.length`, ou índice em `answer` fora de `right`
- `dnd`: `answer` que não é permutação de `tokens`, ou `answer.length !== slots.length`
- `check` / `free` / `fill` / `dnd` sem `id`
- página sem nenhum bloco; aula sem nenhuma página
- `slug` repetido; `number` repetido
- bloco `image` sem `src` (depois da migração da §4.1)
- bloco `next` apontando para uma aula que não existe

**AVISO — publica com confirmação:**

- `image` sem `alt`
- página com só `badge` + `title` (página vazia de conteúdo)
- aula com muito mais páginas que a média (sinal de página duplicada por engano)
- `title` de bloco `mc`/`match` repetido dentro da mesma aula (§6.2)
- aula sem bloco `cta` (o gancho comercial some daquela aula)

A tela de publicar mostra o resumo antes de confirmar: *"3 páginas alteradas, 1 bloco novo,
2 blocos removidos, 1 aviso"* — e, se houver bloco interativo removido, quantos alunos têm
resposta gravada nele (§6.4).

---

## 4. Uploads

### 4.1 O que precisa ser enviado, em números

| O quê | Hoje | Tamanho típico |
|---|---|---|
| Capas de aula | 10 de 42 (`public/lessons/capas/01..10.png`) | ~200–600 KB |
| Imagens de bloco | **0 de 110.** Os blocos `image` têm só `id` e `ph` (a descrição da ilustração); **não há campo de URL**. O protótipo renderiza um retângulo cinza com a legenda. | ~200–800 KB |
| Ilustrações avulsas | 14 em `public/lessons/art/` | — |
| Vídeos | 0 de 42 | 80–500 MB |

> ⚠️ **Achado que muda o escopo: o bloco `image` não tem para onde apontar.** Os 110 blocos
> de imagem das 42 aulas guardam `{ t:"image", id:"a1p1", ph:"Ilustração: grupo conversando" }`.
> Não existe `src`. Enquanto isso não mudar, nenhuma imagem enviada pelo admin aparece para o
> aluno. A mudança é pequena e precisa entrar no esquema de blocos junto com o motor de aulas:
> `src?: string` (caminho servido) e `alt?: string` (acessibilidade), com o `ph` continuando
> como texto do placeholder enquanto `src` estiver vazio. Idem para `cards[].id/ph`,
> `steps[].id/ph` e `profile.id/ph`, que têm o mesmo formato.

Somando: **~150 imagens, algo entre 30 e 80 MB no total.** Vídeo: **3 a 20 GB.** São dois
problemas de tamanhos diferentes e merecem respostas diferentes.

### 4.2 Volume Docker × S3-compatível, no contexto real deste deploy

O deploy é **Portainer numa VPS** — e isso muda a conversa em relação ao conselho padrão.
Em Vercel, Railway, Fly ou Render o sistema de arquivos é efêmero e "salvar no disco" é um bug
com data marcada: no primeiro redeploy os arquivos somem e o banco continua apontando para o
nada. **Numa VPS com volume nomeado isso não acontece**: o volume sobrevive a `docker compose
down && up`, a troca de imagem e a redeploy. O conselho "nunca use disco" é verdadeiro para
PaaS efêmera e falso aqui.

| | Volume Docker na VPS | S3-compatível (R2/B2/S3) |
|---|---|---|
| Custo | zero (já está pago no disco da VPS) | ~US$ 0,015/GB/mês + egress (R2: egress **zero**) |
| Setup | um `volumes:` no compose | conta, bucket, 2 chaves, SDK, CORS |
| Durabilidade | igual à VPS; morre com ela | replicado, independente da VPS |
| Backup | **manual** — precisa entrar no plano de backup, senão não existe | do provedor, mais versionamento |
| Banda | sai pela VPS; vídeo satura o link e a CPU | sai do provedor; não encosta na VPS |
| URL assinada | dá para fazer, mas é código nosso | pronto no SDK |
| Migrar depois | precisa de script de cópia | — |

### 4.3 Recomendação

**Dois níveis, e a linha divisória é o tamanho do arquivo.**

**Imagens (capas, blocos, arte) → volume Docker.** 80 MB não justificam uma dependência de
infraestrutura nova, uma conta a mais e duas chaves para guardar. O volume atende, o custo é
zero, o código é um `fs.writeFile` e uma rota de leitura. **Com uma condição inegociável: o
volume de uploads entra no procedimento de backup no mesmo dia em que a primeira imagem
subir.** Volume sem backup é disco com aparência de segurança.

**Vídeos → nunca no volume.** Duas razões, e nenhuma é durabilidade:

1. **Banda.** Um mp4 de 200 MB servido pela VPS para 50 alunos simultâneos é a VPS inteira
   ocupada em I/O e banda; o app do aluno fica lento por causa do player.
2. **Proteção do acervo.** Arquivo servido por caminho estático é arquivo público: basta o
   link. Videoaula é o produto do WSA Premium. URL assinada de vida curta é o que impede
   que o link circule, e é o modo de operar natural do S3-compatível.

> **Decisão do PO (2026-09-17): as duas formas já na primeira rodada.** Em `/admin/videos`,
> cada aula (e o vídeo padrão) tem o seletor **"Colar link" | "Enviar arquivo"**; a última
> gravada vale. O envio de arquivo só aparece ligado quando as variáveis `S3_*` estão
> configuradas (`docs/DEPLOY.md`); sem elas, a tela lista o que falta e o painel segue só com
> link. Implementação: `src/lib/video/{envio,bucket,aula,acesso,acoes}.ts`,
> `src/app/(admin)/admin/videos/EnvioDeVideo.tsx`, `src/components/lesson/VideoAssinado.tsx`.
> Assinatura SigV4 própria (sem o SDK da AWS); o arquivo vira `MediaAsset` com `kind VIDEO`,
> fora de `MediaUsage` e fora da biblioteca de mídia (que é só de imagem); trocar ou remover
> o vídeo **não apaga** o objeto do bucket; o arquivo recusado na conferência (tamanho, tipo,
> bytes iniciais) é apagado na hora. O link assinado só é gerado para aluno do WSA Premium:
> o HTML do WSA Essencial nunca recebe URL.

Texto original da recomendação: **vídeo no MVP = link externo** (YouTube não listado / Vimeo) pelo normalizador da
§2.6; **vídeo em produção paga = bucket S3-compatível, recomendação Cloudflare R2** — mesmo
SDK do S3, **egress zero**, que é justamente o custo que assusta em vídeo. Ordem de grandeza:
42 aulas × ~200 MB ≈ 8,4 GB ≈ **US$ 0,13/mês** de armazenamento, tráfego zero. Backblaze B2 é
equivalente.

A abstração que torna a troca barata:

```ts
// src/lib/admin/storage/index.ts
export type ArquivoSalvo = { path: string; url: string; bytes: number; mime: string }

export interface MediaStorage {
  salvar(buffer: Buffer, nome: string, mime: string): Promise<ArquivoSalvo>
  remover(path: string): Promise<void>
  urlPublica(path: string): string
  urlAssinada?(path: string, ttlSegundos: number): Promise<string>  // só o adapter S3
}
// MEDIA_STORAGE=volume → adapter de disco;  MEDIA_STORAGE=s3 → adapter S3.
```

Regras do upload, todas no servidor:

- **Imagem:** máximo 5 MB; `png`, `jpeg`, `webp`. **Tipo verificado pelos bytes iniciais**
  (magic number), nunca pela extensão nem pelo `Content-Type` do navegador — os dois são
  escolhidos por quem envia. `.png` que na verdade é `.svg` (que carrega script) é recusado.
- **Nome do arquivo gerado pelo servidor** (`<uuid>.<ext>`), nunca o nome enviado. Nome de
  arquivo do usuário é caminho, e caminho é travessia de diretório.
- Servido por rota `GET /midia/[...path]` com `Content-Type` fixado pelo registro do
  `MediaAsset`, `Content-Disposition: inline`, `X-Content-Type-Options: nosniff` e
  `Cache-Control: public, max-age=31536000, immutable` (o nome é único, então cache eterno é
  seguro). **O caminho é resolvido contra o registro no banco**, não concatenado com o que
  veio na URL.
- **Vídeo (upload implementado em 2026-09-17):** 500 MB, `mp4`/`webm`, upload direto do navegador para o
  bucket por **URL pré-assinada (`PUT`)** — 500 MB atravessando o Node derruba a requisição e
  come memória por minutos. Playback por URL assinada de **15 min**, renovada pelo player.

> ⚠️ **Sem transcodificação, o arquivo enviado é o arquivo baixado.** Não há qualidade
> adaptativa: um mp4 de 500 MB trava em 4G. Enquanto HLS não existir, a tela de upload mostra
> o alvo (**720p, ~2 Mbps, 80–150 MB por aula**) e avisa quando o arquivo passa muito disso.

### 4.4 O que muda no `docker-compose.yml`

O compose atual tem só o Postgres com o volume `wsa_pgdata`. A rodada de deploy precisa
acrescentar o serviço da aplicação e **um segundo volume nomeado**:

```yaml
services:
  app:
    build: .
    restart: unless-stopped
    depends_on:
      db: { condition: service_healthy }
    environment:
      DATABASE_URL: postgresql://wsa:${POSTGRES_PASSWORD}@db:5432/wsa_english
      MEDIA_STORAGE: volume            # volume | s3
      MEDIA_ROOT: /app/var/uploads
      # quando for S3: S3_ENDPOINT, S3_BUCKET, S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY, S3_PUBLIC_URL
    volumes:
      - wsa_uploads:/app/var/uploads   # <<< o que os uploads exigem
    ports: ["3000:3000"]

volumes:
  wsa_pgdata:
  wsa_uploads:                          # <<< novo
```

Mais três coisas:

- `var/uploads/` no `.gitignore` (arquivo de produção não entra em commit).
- **Backup:** o procedimento que hoje cuida do `pg_dump` passa a cuidar também do
  `wsa_uploads`. Em Portainer, isso é um container efêmero montando o volume e escrevendo um
  `.tar.gz` no destino de backup.
- `checkConfig()` na subida: se `MEDIA_STORAGE=s3` sem as quatro variáveis de S3, **o app
  recusa subir** em vez de descobrir na primeira imagem.

### 4.5 Especificações finais de mídia (2026-09-18) — **em vigor**

> **Decisão do PO (2026-09-18):** as ilustrações das aulas, as capas 11–42 e os vídeos entram
> **depois, pelo backoffice**. Placeholder de ilustração ("ILUSTRAÇÃO · EM BREVE") **não é
> defeito**. Inventário por aula, passo a passo do PO e histórico estão em
> `../wiki/conteudo/midia-pendente-aulas.md`.

**Uma fonte só.** Os valores abaixo saem de `src/lib/media/especificacoes.ts`, que reaproveita
as constantes de `src/lib/media/tipos.ts` (`TAMANHO_MAXIMO_IMAGEM`, `FORMATOS_DE_IMAGEM`) e de
`src/lib/video/envio.ts` (`TAMANHO_MAXIMO_VIDEO`, `FORMATOS_DE_VIDEO`, `ALVO_DO_VIDEO`). São as
mesmas constantes que `conferirImagem`, `registrarImagem` e `conferirArquivoDeVideo` usam.
**Mude a constante, não o texto.** O `QuadroDeEspecificacoes` mostra a regra antes de cada
envio, e a mensagem de recusa repete a regra quebrada.

**Imagens (todos os usos):**
- **Formatos:** PNG, JPEG ou WebP. O tipo é conferido pelos bytes do arquivo. SVG, GIF e HEIC
  são recusados.
- **Tamanho:** até 5 MB por arquivo. A Server Action tem `bodySizeLimit: '6mb'` em
  `next.config.ts`, para caber o multipart.
- **Peso alvo:** 500 KB, com sugestão de WebP qualidade ~80.
- **Só aviso, sem recusa:** proporção fora da tolerância de 8%, tamanho abaixo do mínimo e peso
  acima do alvo.

| Uso (`AlvoDeImagem`) | Blocos | Proporção | Recomendado | Mínimo | Observação |
|---|---|---|---|---|---|
| `ilustracao` | `image` | 16:9 | 1600×900 | 1280×720 | a caixa recorta as bordas |
| `cartao` | `cards[]`, `steps[]` | 16:10 | 1280×800 | 960×600 | fica estreita em 2 colunas |
| `perfil` | `profile` | 4:3 | 1200×900 | 800×600 | caixa de 190 px de altura, rosto no centro |
| `capa` | `Lesson.coverUrl` | 3:1 | 2172×724 | 1500×500 | mesmo formato das capas 01–10 |

**Vídeo por arquivo:**
- **Formato e tamanho:** MP4 ou WebM, até 500 MB. O mais seguro é H.264 com AAC.
- **Alvo:** 16:9, 1280×720, ~2 Mbps. Uma aula de 5 a 10 min fica entre 80 e 150 MB.
- **Só aviso, sem recusa:** resolução acima de 720p, proporção fora de 16:9, taxa acima de
  3 Mbps e arquivo acima de 200 MB.
- **Fluxo:** o envio vai direto ao bucket por URL assinada e exige as variáveis `S3_*`. O aluno
  assiste por link assinado de 15 min. Sem as variáveis `S3_*`, a tela avisa que o envio está
  indisponível e só o link funciona.

**Vídeo por link:** YouTube, Vimeo, ou um arquivo https `.mp4`/`.webm` (`HOSTS_ACEITOS` em
`src/lib/video/fonte.ts`). Use "não listado" no YouTube e no Vimeo.

**Onde cada mídia entra:**
- **Bloco:** `SeletorDeMidia` com "Enviar nova imagem" ou "Escolher da biblioteca", na aba
  Páginas.
- **Capa:** `CampoDeCapa`, na aba Dados.
- **Vídeo:** `AbaDeVideo`, na aba Vídeo, e também em `/admin/videos`.
- **Biblioteca:** `/admin/midia`, com o seletor "Para onde vai".
- **O que falta:** `/admin/midia/pendencias`, calculada a cada leitura por
  `src/lib/admin/pendencias.ts`, sem tabela própria.

> ⚠️ `IDS_COM_ARTE_LEGADA` em `src/lib/admin/pendencias.ts` precisa ficar em sincronia com
> `ARTE_LEGADA` em `components/lesson/blocks/Ilustracao.tsx`. Hoje os dois têm só `a1p1`.
>
> ⚠️ **Pendências de engenharia:**
> - `Lesson.coverUrl` ainda não aparece nas telas do aluno. Elas montam
>   `/lessons/capas/NN.png` só para as aulas 1–10, em `src/lib/content/lessons.ts`.
> - Uma imagem usada só no rascunho não entra no `MediaUsage` até a publicação.

---

## 5. Mudanças de schema

Aditivas ao modelo do contrato §4. O `prisma/schema.prisma` **é de outro agente** — esta
seção é a especificação que ele (ou a rodada do admin, se a propriedade mudar) aplica.

```prisma
// ── 1. Rascunho, publicação e autoria em Lesson ─────────────────────────────
model Lesson {
  // … campos do contrato §4 …
  published     Boolean   @default(false)
  publishedAt   DateTime?
  draftPages    Json?          // rascunho; null = rascunho igual ao publicado
  contentVersion Int      @default(1)   // sobe a cada publicação; invalida cache de score
  updatedById   String?
  updatedBy     User?     @relation("AulasEditadas", fields: [updatedById], references: [id])
  archivedAt    DateTime?      // soft delete — o app filtra archivedAt: null

  // vídeo normalizado (§2.6)
  videoKind     VideoKind?     // YOUTUBE | VIMEO | URL | UPLOAD
  videoRef      String?        // id do YouTube/Vimeo, URL, ou id do MediaAsset
  videoIsDefault Boolean  @default(false)
  videoUpdatedAt DateTime?

  versions      LessonVersion[]
  @@index([published, number])
  @@index([archivedAt])
}

enum VideoKind { YOUTUBE VIMEO URL UPLOAD }

// ── 2. Histórico de publicações (rollback e diff) ───────────────────────────
model LessonVersion {
  id           String   @id @default(cuid())
  lessonId     String
  lesson       Lesson   @relation(fields: [lessonId], references: [id], onDelete: Cascade)
  version      Int
  pages        Json             // snapshot do que foi publicado
  title        String
  subtitle     String
  publishedAt  DateTime @default(now())
  publishedById String?
  resumo       String?          // "3 páginas alteradas, 1 bloco novo"
  @@unique([lessonId, version])
  @@index([lessonId, publishedAt])
}

// ── 3. Biblioteca de mídia ──────────────────────────────────────────────────
model MediaAsset {
  id         String   @id @default(cuid())
  kind       MediaKind            // IMAGE | VIDEO
  path       String   @unique     // caminho no storage; NUNCA concatenado com input do usuário
  filename   String               // nome original, só para exibir
  mime       String
  bytes      Int
  width      Int?
  height     Int?
  alt        String?              // acessibilidade — obrigatório em imagem pedagógica
  uploadedById String?
  createdAt  DateTime @default(now())
  archivedAt DateTime?            // nunca apagamos de verdade
  usos       MediaUsage[]
  @@index([kind, archivedAt])
}

enum MediaKind { IMAGE VIDEO }

// Índice de uso: é o que torna "não apagar asset em uso" possível de responder rápido.
// Reescrito por inteiro a cada publicação da aula.
model MediaUsage {
  id        String     @id @default(cuid())
  assetId   String
  asset     MediaAsset @relation(fields: [assetId], references: [id], onDelete: Cascade)
  lessonId  String
  contexto  String     // "capa" | "pagina:3:bloco:a6p2"
  @@unique([assetId, lessonId, contexto])
  @@index([lessonId])
}

// ── 4. Trilha de auditoria (append-only) ────────────────────────────────────
model AuditLog {
  id         String      @id @default(cuid())
  actorId    String?
  actorEmail String                  // congelado no momento da ação (o usuário pode sumir)
  action     String                  // "lesson.publish", "user.plan.change", "admin.denied"
  resource   String                  // "Lesson:42", "User:ckx…"
  outcome    AuditOutcome @default(ALLOW)
  reason     String?                 // obrigatório em ações sensíveis
  before     Json?
  after      Json?
  ip         String?
  userAgent  String?
  createdAt  DateTime    @default(now())
  @@index([createdAt])
  @@index([resource, createdAt])
  @@index([actorId, createdAt])
}

enum AuditOutcome { ALLOW DENY }

// ── 5. Configurações do app (link de checkout, vídeo padrão, allowlist) ─────
model AppSetting {
  key        String   @id          // "checkout.link", "video.padrao", "embed.allowlist"
  value      Json
  updatedAt  DateTime @updatedAt
  updatedById String?
}

// ── 6. Ordem explícita em Module ────────────────────────────────────────────
model Module {
  // … campos do contrato §4 …
  archivedAt DateTime?
}
```

**Não vão para o schema, de propósito:**

- Estados intermediários de workflow editorial (`READY_FOR_REVIEW`, `APPROVED`, …). Com um
  papel de admin e um operador, um fluxo de 5 estados é cerimônia sem revisor. `published:
  Boolean` + `LessonVersion` dá rascunho, publicação, histórico e rollback. Quando houver um
  segundo papel (editor × revisor), aí sim.
- `User.mfaEnabled` — decisão registrada de não ter segundo fator no MVP. Acrescentar depois
  não quebra nada.
- Tabelas de Knowledge Element / Can-Do / LCP da wiki. O app-web não tem esse domínio e criar
  tabelas vazias "para o futuro" só gera migração para desfazer.

---

## 6. Segurança e integridade

### 6.1 Quem pode apagar o quê

| Recurso | Apagar de verdade? | Regra |
|---|---|---|
| Aula | **Não** | `archivedAt`. Publicada → só despublicar. Arquivar exige que não esteja publicada. |
| Módulo | **Não** | `archivedAt`, e **bloqueado** se tiver aula ligada. |
| Página dentro da aula | Sim, no rascunho | Mas com aviso de impacto se contiver bloco interativo com resposta gravada (§6.4). |
| Bloco | Sim, no rascunho | Idem. O `id` do bloco **nunca é reaproveitado** em outro bloco. |
| Asset de mídia | **Não** | `archivedAt`, **bloqueado se `MediaUsage` tiver linha**. |
| Aluno | **Não** (fora do escopo desta fase) | Quando entrar: anonimização, com motivo e confirmação por digitação do e-mail. |
| `ExerciseAnswer` / `LessonProgress` | **Nunca pelo painel** | Resposta de aluno não é do admin. Só o próprio aluno, e por ação dele. |
| `AuditLog` | **Nunca, por ninguém** | Append-only. §6.3. |

### 6.2 A armadilha das chaves de resposta — resolver antes do primeiro aluno

O contrato §4 congela estas chaves, vindas do protótipo:

```
mc:{lessonId}:{blockTitle}:{i}     fill:{blockId}:{i}
match:{blockTitle}                 dnd:{blockId}            chk:{blockId}:{i}
```

Duas delas **derivam de campos que o editor do admin vai deixar o PO alterar com dois cliques**:

- `mc:` usa o **título do bloco**. Trocar `"TESTE RELÂMPAGO"` por `"Teste relâmpago"` gera
  `mc:1:Teste relâmpago:0` — e as respostas gravadas em `mc:1:TESTE RELÂMPAGO:0` ficam órfãs.
  O aluno vê o exercício zerado; o `score` da aula cai; ninguém recebe erro nenhum.
- `match:` é pior: a chave **não tem o `lessonId`**. É global. Hoje não há colisão (conferido:
  zero títulos de `mc`/`match` repetidos nas 42 aulas), mas basta o PO criar em duas aulas um
  bloco `match` chamado `"LIGUE AS COLUNAS"` para que responder numa aula marque a outra.

No protótipo isso nunca apareceu porque o conteúdo era fixo e vinha do código. **Um admin que
edita conteúdo transforma isso em bug de produção**, e o sintoma é o pior possível: perda
silenciosa de progresso de aluno.

Há um detalhe a mais: o protótipo grava também `free:{blockId}:{i}` (produção escrita do
aluno, **48 blocos**) e `cta:{lessonId}:{i}`, que **não estão na lista do contrato §4**. Se
`free:` não for persistido, o aluno perde o texto que escreveu a cada recarga. Precisa entrar
na lista.

**PROPOSTA DE MUDANÇA DE CONTRATO (§4) — opção A, recomendada.**
Trocar as duas chaves que dependem de campo editável por chaves que dependem do `id` do bloco,
e acrescentar `free:`:

```
mc:{lessonId}:{blockId}:{i}     fill:{blockId}:{i}     free:{blockId}:{i}
match:{blockId}                 dnd:{blockId}          chk:{blockId}:{i}
```

Para isso, **todo bloco interativo passa a ter `id` obrigatório** — hoje `mc` e `match` não
têm. São 31 blocos `mc` e 12 `match` a receber `id` no `course-data.mjs` (um script de uma
página; os 255 ids existentes ficam intactos e continuam globalmente únicos).

**Custo de fazer agora: baixo.** O banco ainda não existe, não há aluno, não há resposta
gravada. O `course-data.mjs` é alterado uma vez e o seed roda.
**Custo de fazer depois: migração de dados de produção com reescrita de chave por linha, e a
chance de errar é real.** Esta é a diferença entre 40 minutos e uma manhã ruim.

**Opção B, se a mudança de contrato for recusada.** Mantém as chaves e trava o editor:

- O campo `title` de bloco `mc`/`match` fica **somente leitura** assim que a aula é publicada.
- Para renomear, existe uma ação explícita **"Renomear e migrar respostas"**, que numa
  transação faz `UPDATE ExerciseAnswer SET answerKey = replace(…)` para as chaves afetadas,
  registra antes/depois no `AuditLog` e só então grava o novo título.
- O validador impede publicar duas aulas com o mesmo título de bloco `match` (a colisão global).

B funciona, mas é código permanente para contornar um formato que dava para consertar em uma
tarde. **Recomendo A.**

**Regra que vale nas duas opções:** `id` de bloco é **permanente e nunca reaproveitado**. O
editor gera `id` novo ao criar bloco (`<prefixo da aula><sequencial>`, verificando unicidade
global), e o campo é **somente leitura** na interface. Duplicar uma aula gera ids novos para
todos os blocos interativos — senão a cópia passa a compartilhar respostas com a original.

### 6.3 Trilha de auditoria

Toda Server Action do admin que muta algo escreve uma linha. A única forma de garantir isso é
o auxiliar único:

```ts
// src/lib/admin/audit.ts
export async function auditar(entrada: {
  actor: SessionUser; action: string; resource: string
  before?: unknown; after?: unknown; reason?: string
  outcome?: 'ALLOW' | 'DENY'
}): Promise<void>
```

Eventos mínimos: `lesson.create` · `lesson.update` · `lesson.publish` · `lesson.unpublish` ·
`lesson.archive` · `lesson.restore_version` · `module.*` · `media.upload` · `media.archive` ·
`video.change` · `user.plan.change` · `user.sessions.revoke` · `user.verification.resend` ·
`setting.change` · `admin.denied`.

Três regras:

- **Append-only.** Não existe action de editar nem apagar `AuditLog`. Se um dia houver política
  de retenção, ela é um job que apaga por idade — nunca uma tela.
- **`reason` obrigatório** em: mudar plano de aluno, trocar o link de checkout, restaurar
  versão, arquivar aula.
- **`before`/`after` não guardam `pages` inteiro.** Um snapshot de 309 páginas por edição enche
  o banco à toa. Guarde o resumo do diff; o conteúdo completo já está em `LessonVersion`.

### 6.4 O que acontece com o progresso quando o conteúdo muda — **a parte que importa**

Esta é a armadilha real. Um CMS que edita conteúdo que já tem gente estudando em cima pode
destruir progresso sem lançar um único erro. As regras abaixo são a resposta, e nenhuma delas
é opcional.

**Regra 1 — o aluno só vê `pages` publicado.** Salvar rascunho **não muda absolutamente nada**
para quem está no meio da aula. O único instante em que o conteúdo do aluno muda é o clique em
"Publicar". Isso concentra todo o risco num momento único, visível e auditado — em vez de
espalhá-lo por cada tecla digitada.

**Regra 2 — página é identificada por posição, e isso precisa ser contido.**
`LessonProgress.currentPage` é um índice (`Int`). Se o PO apagar a página 3 de uma aula de 7
enquanto um aluno está na página 5, esse aluno passa a estar na página 5 de um conteúdo que
agora só tem 6 páginas — lendo a página errada. Se apagar as duas últimas, `currentPage: 6`
aponta para o nada e a tela quebra.

Duas medidas, as duas necessárias:
- **No render:** `currentPage` é sempre lido com clamp — `Math.min(currentPage, pages.length - 1)`.
  É uma linha e impede a tela branca. Vale para sempre, independente do admin.
- **Na publicação:** se o número de páginas diminuiu, uma transação ajusta quem ficou fora:
  ```ts
  await prisma.lessonProgress.updateMany({
    where: { lessonId, currentPage: { gt: novasPaginas - 1 } },
    data:  { currentPage: novasPaginas - 1 },
  })
  ```
  E a linha correspondente no `AuditLog` registra quantos alunos foram ajustados. Não é
  invisível.

**Regra 3 — resposta órfã se preserva, nunca se apaga.** Quando um bloco interativo some da
aula, as `ExerciseAnswer` daquele `answerKey` **ficam no banco**. Três motivos: apagar é
irreversível e o PO pode estar só experimentando; se o bloco voltar (rollback de versão,
reversão de edição), as respostas voltam com ele; e a linha órfã não faz mal nenhum — ninguém
a lê. O que existe é um **relatório** no dashboard ("respostas sem bloco correspondente: N"),
não um `DELETE`.

**Regra 4 — `score` e `total` são cache, não verdade.** O protótipo recontava o placar a cada
render, percorrendo os blocos e conferindo as respostas. Essa continua sendo a fonte correta:
o gabarito mora no conteúdo, e o conteúdo muda. Se o PO acrescentar um exercício, o
`LessonProgress.total = 9` gravado ontem fica errado hoje.

A regra: `LessonProgress` ganha `scoredAtVersion Int?`. Ao ler o progresso, se
`scoredAtVersion !== lesson.contentVersion`, o app **recalcula** `score`/`total` a partir das
`ExerciseAnswer` e do conteúdo publicado atual, regrava e atualiza `scoredAtVersion`. Custa uma
passada pelos blocos da aula; é barato e sempre certo.

**Regra 5 — `COMPLETED` é irrevogável por edição.** Se um aluno concluiu a Aula 12 e o PO
acrescenta uma página, o status **continua `COMPLETED`**, o `completedAt` não muda, e o streak
não é afetado. O que aparece é um selo "conteúdo atualizado" na aula, convidando a rever.

O motivo é de produto, não técnico: tirar uma conclusão que o aluno já tinha, por causa de uma
decisão editorial em que ele não participou, é a forma mais rápida de destruir a confiança no
app — e o aluno não tem como entender o que aconteceu. Progresso é do aluno. Conteúdo é do PO.
Edição de conteúdo **não regride** progresso, em nenhuma circunstância.

**Regra 6 — o que a tela de publicar precisa dizer, em português claro**, quando houver
impacto:

```
Esta publicação remove 2 blocos de exercício que têm resposta de 14 alunos.
As respostas serão preservadas, mas deixarão de aparecer.
3 alunos estão em páginas que não existem mais e serão movidos para a última página.
```

Publicação cega é como se apaga progresso sem perceber.

### 6.5 Recálculo, não edição

Quando houver falha real de sistema (não "o aluno pediu"), existe **uma** ferramenta:
`/admin/alunos/[id]` → **"Recalcular progresso"**, que refaz `score`/`total`/`status` de todas
as aulas a partir de `ExerciseAnswer` e do conteúdo publicado. Não aceita valores digitados.
Exige motivo. É auditada. Não existe caminho para escrever um número à mão — porque, se
existir, ele vira o caminho normal.

### 6.6 Renumerar aula é ação de alto risco

`Lesson.number` é a identidade da aula na trilha, em `LessonProgress`, nas capas
(`capas/07.png`), nos blocos `badge` ("AULA 07"), nos blocos `next` e na cabeça do aluno.

**O editor não permite alterar `number` depois da criação.** Reordenar o curso é uma operação
separada, fora desta fase, que precisa de plano de migração próprio. Se o PO quiser inserir
uma aula entre a 12 e a 13, a resposta é uma aula nova com número no fim, não renumerar 30
aulas. A wiki diz a mesma coisa: *"não deve existir drag-and-drop casual para reorganizar as
42 aulas em produção"*.

### 6.7 Slug

`slug` é editável (às vezes há erro de digitação), mas:
- editar slug de aula publicada mostra aviso de que links salvos e compartilhados vão quebrar;
- a ação grava o slug antigo em `AuditLog`, o que permite, se necessário, criar um redirect
  depois;
- slug duplicado é ERRO de validação, não aviso.

---

## 7. Roteiro de implementação

Sete fases. **Cada uma termina com algo que o PO consegue usar sozinho** — nenhuma fase
entrega "metade do editor".

### Fase 0 — Congelar a identidade do conteúdo · *pré-requisito, não é do admin*

Entra **junto com o motor de aulas**, não depois. Sem isso, o admin nasce em cima de um
formato que ele mesmo quebra.

- `src/lib/content/blocks.ts`: `z.discriminatedUnion('t', …)` com os **31 tipos**, mais
  `src`/`alt` no `image` (e em `cards[]`, `steps[]`, `profile`).
- Decisão sobre a §6.2 (chaves de resposta). Se for a opção A: `id` obrigatório em `mc` e
  `match`, script que popula os 43 ids faltantes no `course-data.mjs`, e o contrato §4 atualizado.
- `BlockRenderer` com `InteractionContext` injetado (§3.4).
- Seed validando `course-data.mjs` contra o esquema — se o conteúdo não passa no validador, o
  validador está errado.

**Entregue:** o motor de aulas funciona e o formato está fechado.

### Fase 1 — Fundação administrativa

- `requireAdmin()`, `/admin` no matcher do `proxy.ts`, layout com checagem de papel, 404 para
  STUDENT.
- `scripts/admin-create.ts` + `admin-promote.ts` e as entradas no `package.json`.
- `AuditLog` no schema + `auditar()`.
- Casca do painel (barra lateral, cabeçalho, banner de ambiente) e o **Dashboard em leitura**.

**Entregue:** o PO entra no painel e vê o estado do produto. Não muda nada ainda — e mesmo
assim já é útil: é a primeira vez que existe uma resposta para "quantos alunos e em que pé
está o conteúdo".

### Fase 2 — Módulos e dados de aula

- `/admin/modulos` (CRUD, reordenar, arquivar bloqueado com aulas).
- `/admin/aulas` (lista, filtros, busca) e a aba "Dados".
- `published` / `draftPages` / `contentVersion` no schema; publicar / despublicar com auditoria.

**Entregue:** dá para esconder uma aula com problema, corrigir título/subtítulo/tempo/módulo e
criar aula nova (vazia). **Sem tocar em código, sem deploy.**

### Fase 3 — Editor de páginas e blocos

- Lista de páginas (adicionar, duplicar, reordenar, remover) e lista de blocos dentro da página.
- Editor JSON validado por zod, com erros em português. **Todos os 31 tipos editáveis desde o
  primeiro dia.**
- Preview ao vivo reaproveitando `BlockRenderer` (§3.4), com larguras 430/768/1280.
- Validação de publicação (§3.5) e a tela de resumo de impacto (§6.4 regra 6).
- `LessonVersion` + aba "Versões" + restaurar como rascunho.

**Entregue:** o conteúdo das 42 aulas passa a ser editável em produção. É a fase que justifica
o painel.

### Fase 4 — Formulários dos 12 tipos principais

`title`, `badge`, `image`, `note`, `objective`, `cards`, `rule`, `free`, `fill`, `cta`, `next`,
`check` — **1.238 de 1.538 blocos, 80,5% do curso**. Alternância formulário ↔ JSON no mesmo bloco.

**Entregue:** o PO edita conteúdo sem ver JSON. Os outros 19 tipos continuam pelo JSON, e
ninguém fica bloqueado.

### Fase 5 — Mídia

- `MediaAsset` + `MediaUsage` + adapter de volume + rota `/midia/[...path]`.
- `/admin/midia` com uso, alt text e bloqueio de arquivar asset em uso.
- Seletor de imagem dentro do editor de bloco e no campo de capa.
- **Mutirão:** as 32 capas faltantes e os 110 blocos `image` sem arquivo.

**Entregue:** as aulas deixam de ter retângulo cinza. Visualmente, é a maior mudança de todas
para o aluno.

### Fase 6 — Vídeos

- `parseVideoSource` + allowlist + `frame-src` no CSP.
- `/admin/videos` com preview no player do aluno e "aplicar padrão".
- Bloco/painel de vídeo na tela da aula, respeitando o plano (o WSA Essencial não vê).

**Entregue:** videoaulas ligadas às aulas, trocáveis sem deploy.

### Fase 7 — Alunos e configurações

- `/admin/alunos` (lista, busca, filtros) e o detalhe em três abas.
- Mudar plano (com motivo), reenviar verificação (rate limit), encerrar sessões, recalcular
  progresso.
- `/admin/configuracoes` (link de checkout, vídeo padrão, allowlist, estado do e-mail, aviso
  de manutenção) + alerta por e-mail nas duas ações críticas.

**Entregue:** suporte ao aluno deixa de exigir acesso ao banco.

**Fora deste roteiro, anotado de propósito:** webhook de pagamento e concessão automática de
acesso, exclusão de aluno por anonimização, segundo fator,
segundo papel administrativo (editor × revisor), publicação agendada, importação em massa. Os
ganchos existem (`AppSetting`, `AuditLog`, `MediaStorage`, `role`); nenhum deles exige refazer
o que está acima.

---

## 8. Mapa de propriedade sugerido para a rodada do admin

Para a rodada de implementação não repetir a colisão que este contrato evita:

```
src/app/(admin)/**                      → agente do admin
src/lib/admin/**                        → agente do admin
scripts/admin-create.ts, admin-promote.ts → agente do admin
prisma/schema.prisma                    → dono do schema (aplica a §5 deste doc)
src/proxy.ts                            → agente de auth (só acrescenta /admin no matcher)
src/lib/auth/session.ts                 → agente de auth (o admin só importa)
src/lib/content/blocks.ts               → agente do motor de aulas (o admin só importa)
src/components/lesson/BlockRenderer.tsx → agente do motor de aulas (o admin só importa)
package.json, docker-compose.yml        → integração (aplicam §1.3 e §4.4)
```

## 9. Decisões que dependem do PO antes de começar

1. **Chaves de resposta (§6.2): opção A ou B?** É a única decisão que fica mais cara a cada
   dia. Recomendação: **A**, e agora, enquanto não há aluno.
2. ~~**Vídeo:** link externo no MVP e bucket depois, ou bucket já na primeira rodada de vídeo?~~
   **Decidido (2026-09-17): as duas formas, à escolha do admin por aula** (§4.3). O bucket
   (Cloudflare R2) continua sendo o único item novo de infraestrutura e é opcional: sem ele,
   o painel aceita só link.
3. **STUDENT em `/admin`: 404 (recomendado) ou redirecionar para `/inicio`?**
4. **Quais e-mails serão admins**, e quem responde por LGPD quando existir exclusão de aluno.
5. **Sessão de admin de 8 h**, ou mais curta?
6. ~~**As 32 capas e as 110 ilustrações existem em algum lugar?** Se existirem, a Fase 5 ganha
   uma importação em massa. Se não, o mutirão é de produção de arte, e isso é prazo do PO, não
   de código.~~
   **Decidido (2026-09-18): a arte ainda será produzida.** As ~250 ilustrações, as capas 11–42 e
   os vídeos entram depois pelo painel, seguindo o §4.5. Placeholder não é defeito.
