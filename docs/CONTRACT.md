# Contrato do app WSA English (app-web)

O produto é o WSA English, vendido em dois planos: WSA Essencial e WSA Premium (os
nomes e as regras de acesso estão em `src/lib/planos.ts`). Em conflito com este
contrato, vale o plano em `docs/plano-v2/`. A referência de produto é a wiki do projeto.

---

## 1. O que estamos construindo

Um app web mobile-first de ensino de inglês, 42 aulas / 309 páginas, com:

- **Autenticação real** (entrar, criar conta, esqueci minha senha, redefinir, lembrar-me, verificar e-mail)
- **PostgreSQL via Prisma**, deploy em VPS por GitHub + Portainer (Docker)
- O **look & feel e o conteúdo do protótipo** preservados fielmente

**ESCOPO DESTA RODADA: fundação + autenticação + shell visual.** O motor de aulas
(renderer dos 27 tipos de bloco, exercícios, progresso por página) vem na rodada seguinte.
Não implemente o motor de aulas agora — mas o **schema e os tipos já nascem prontos para ele**.

## 2. Fontes de verdade

| Arquivo | O que é |
|---|---|
| `prototype/claude-designer/Ingles em Acao.dc.html` | **Design final do Claude Designer (2026-09-18) — a referência visual e de UX que prevalece.** Layout desktop (nav em pílula no topo: Início/Progresso/Perfil; trilha dentro da Início; coluna de 1024px) e responsivo por `flex-wrap`/`auto-fit`. Em conflito com os protótipos abaixo, vale este. |
| `prototype/mobile.dc.html` | Protótipo mobile do Claude Designer (1645 linhas). Referência anterior. Markup em `<sc-if>` / `{{ bindings }}`; lógica no `<script type="text/x-dc">` a partir da linha 996. |
| `prototype/desktop.dc.html` | Mesma coisa, versão desktop |
| `content/course-data.mjs` | `export const LESSONS` (42 aulas, 309 páginas, blocos tipados) e `export const TRACK` (lista da trilha). **Fonte do conteúdo.** |
| `public/lessons/capas/01..10.png` | Capas das aulas 1–10. As outras 32, as ilustrações e os vídeos serão enviados pelo backoffice (decisão do PO, 2026-09-18). Especificações de mídia em `docs/BACKOFFICE.md` §4.5. |
| `public/lessons/art/*.png` | 14 ilustrações das aulas |
| `public/icons/*.png` | 13 ícones do perfil |
| `public/brand/bigben.png` | Arte de marca |

> ⚠️ No script do protótipo existem constantes `SUBS` e `TIMES` **desatualizadas** (ex.: dizem
> que a aula 31 é "Passado do verbo to be", quando na verdade é "Directions"). O correto está em
> `LESSONS[].sub` e `LESSONS[].time` no `course-data.mjs`. **Sempre prefira `course-data.mjs`.**
> Use `COVERS` / `MODULES` do protótipo só onde `LESSONS` não tiver o dado.

## 3. Identidade visual (extraída do protótipo — use EXATAMENTE estes valores)

### Fontes
- **Figtree** (400,500,600,700,800,900) — toda a interface
- **Caveat** (600,700) — apenas frases manuscritas de incentivo ("Small steps, big results")
- Carregar via `next/font/google`, não via tag `<link>`.

### Cores de superfície
```
--bg           #F7F9FC   fundo da página
--surface      #FFFFFF   cards
--text         #1F2430   texto principal
--muted        #5B6B7F   texto secundário
--muted-2      #8A96A8   texto terciário
--muted-3      #3C4A5C
--border       #DCE6F2   bordas
--border-2     #C9D6EC
--selection    #CDEFF3
```

### Cores de marca
```
--navy         #0A1F4E   marca principal / cards escuros
--navy-light   #123A86   gradiente do logo
--blue         #1B6BE3   ação/links fortes
--link         #0E9BAE   links
--link-hover   #0F2050
--yellow       #F6C945   CTA de destaque (texto sobre amarelo é SEMPRE navy)
--teal         #12A594   sucesso/progresso
--mint-1       #DFF3EC
--mint-2       #E4F3EC
--mint-3       #D8F0E6
```

### Paleta de variantes de bloco (constante `V` do protótipo) — usada pelos cards de conteúdo
| nome | bg | fg | bd | kick |
|---|---|---|---|---|
| gray | #F1F5FA | #1F2937 | #E3EAF3 | #5B6B7F |
| white | #FFFFFF | #1F2937 | #E3EAF3 | #5B6B7F |
| mint | #E6F6F0 | #0F5D50 | #CFEDE2 | #0F8F7A |
| lilac | #F1EDFD | #3A1A80 | #E2DAFA | #5B21B6 |
| cream | #FEF7E0 | #6B520A | #F8E7B4 | #B67F0C |
| navy | #0A1F4E | #FFFFFF | #0A1F4E | #F6C945 |
| teal | #12A594 | #FFFFFF | #12A594 | #FFFFFF |
| purple | #5B21B6 | #FFFFFF | #5B21B6 | #F6C945 |
| yellow | #F6C945 | #0A1F4E | #F6C945 | #0A1F4E |
| blue | #EAF2FE | #123A86 | #D6E5FB | #1B6BE3 |
| red | #FEF0F2 | #B21F31 | #F9D3D9 | #E03B4C |
| green | #E4F5EA | #136B45 | #C6E9D2 | #136B45 |
| plain | transparent | #1F2937 | transparent | #5B6B7F |

### Cores sólidas (constante `SOLID`) — usadas pelos chips
`navy #0A1F4E · teal #12A594 · purple #5B21B6 · yellow #F6C945 · blue #1B6BE3 · white #FFFFFF · orange #E8820C · red #E03B4C`

### Forma
- Raios: pills `999px`; cards grandes `26px`; cards médios `20–22px`; campos `14–16px`
- Sombras: `0 8px 26px rgba(11,31,75,.07)` (card) · `0 14px 40px rgba(11,31,75,.18)` (elevado) · `0 18px 48px rgba(11,31,75,.1)` (hero)
- Viewport de referência: **430 × 932** (mobile-first). Em telas largas, centralizar a coluna em ~460px.
- Alvos de toque no mínimo 44px; botões primários 52–56px de altura.

### Logo
O logo oficial é o componente `src/components/ui/LogoWSA.tsx`, com os arquivos de
`public/brand/`. Tamanho e uso: ver o pacote 04 e a §5 de `docs/plano-v2/01-CONTRATOS.md`.

## 4. Modelo de dados (Prisma + PostgreSQL)

O protótipo guardava tudo em `localStorage` sob a chave `ingles-em-acao-v1`, no formato
`{ user, screen, ans, checked, sel, done, lesson, page, photo, days }`. **Esse estado vira banco.**

Chaves de resposta (`answerKey`, string única por usuário) — construídas **só** por
`src/lib/lesson/keys.ts`, nunca concatenadas à mão:
```
mc:{lessonId}:{blockId}:{i}     fill:{blockId}:{i}     free:{blockId}:{i}
match:{blockId}                 dnd:{blockId}          chk:{blockId}:{i}
cta:{lessonId}:{i}
```

> ⚠️ `mc:` e `match:` usam o **`id` do bloco**, não o `title` do protótipo (BACKOFFICE §6.2,
> opção A — decidida e implementada). `title` é editável pelo admin: chave derivada dele vira
> resposta órfã ao primeiro ajuste de maiúsculas, sem erro nenhum na tela. `match:` também era
> global e colidiria entre duas aulas com o mesmo título de bloco. Os 31 blocos `mc` e os 12
> `match` do `course-data.mjs` já receberam `id` (`a{aula}mc{n}` / `a{aula}match{n}`), e os 438
> ids do curso são globalmente únicos. `id` de bloco é **permanente e nunca reaproveitado**.
>
> `free:` e `cta:` entram na lista: sem `free:` o aluno perde a cada recarga o texto que
> escreveu (48 blocos), e `cta:` é a lembrança de que o aviso de plano foi aberto — a única
> chave sem `id` de bloco. Nenhuma das duas pontua.

Entidades obrigatórias:

- **User** — `id`, `name`, `email` (unique, sempre minúsculo), `passwordHash`, `photoUrl?`,
  `emailVerifiedAt?`, `role` (`STUDENT` | `ADMIN`, default STUDENT),
  `plan` (`ESSENCIAL` | `PREMIUM`, default ESSENCIAL), `createdAt`, `updatedAt`
- **Session** — `id`, `tokenHash` (unique), `userId`, `expiresAt`, `remember` (bool),
  `userAgent?`, `ip?`, `createdAt`, `lastSeenAt`
- **VerificationToken** — `id`, `tokenHash` (unique), `userId`,
  `type` (`EMAIL_VERIFY` | `PASSWORD_RESET`), `expiresAt`, `usedAt?`, `createdAt`
- **LoginAttempt** — `id`, `email`, `ip`, `success` (bool), `createdAt` — índice em `(email, ip, createdAt)`
- **Module** — `id`, `order`, `title`, `fromLesson`, `toLesson` — seed com os 7 módulos abaixo
- **Lesson** — `id`, `number` (unique), `code` ("AULA 01"), `slug` (unique), `title`, `subtitle`,
  `estimatedTime`, `coverUrl?`, `videoUrl?`, `moduleId`, `pages` (Json — o array de páginas/blocos),
  `createdAt`, `updatedAt`
- **LessonProgress** — `userId` + `lessonId` (unique juntos), `status`
  (`NOT_STARTED`|`IN_PROGRESS`|`COMPLETED`), `currentPage`, `score?`, `total?`, `completedAt?`, `updatedAt`
- **ExerciseAnswer** — `userId`, `lessonId`, `answerKey` (unique junto com `userId`), `value` (String),
  `checked` (bool), `correct?` (bool), `updatedAt`
- **StudyDay** — `userId` + `date` (unique juntos) — alimenta o streak

Módulos (constante `MODULES` do protótipo):
```
1: aulas 1–6   Fundamentos
2: aulas 7–12  Vocabulário essencial
3: aulas 13–18 Referência e lugar
4: aulas 19–24 Presente simples
5: aulas 25–30 Ações e rotina
6: aulas 31–36 Passado
7: aulas 37–42 Comparar e futuro
```

## 5. Regras de autenticação (não negociáveis)

1. **Hash**: Argon2id via `@node-rs/argon2`. Nunca texto puro, nunca em log.
2. **Sessão**: token opaco de 32 bytes aleatórios (`randomBytes(32).toString('base64url')`).
   No banco grava-se **apenas o SHA-256** do token. O cookie guarda o token cru.
3. **Cookie**: nome `iea_session`, `httpOnly`, `sameSite: 'lax'`, `path: '/'`,
   `secure: process.env.NODE_ENV === 'production'`.
   - **Lembrar-me marcado** → `maxAge` de 30 dias (cookie persistente) e `expiresAt` +30d no banco.
   - **Lembrar-me desmarcado** → **sem `maxAge`** (cookie de sessão, morre ao fechar o navegador)
     e `expiresAt` +1 dia no banco.
4. **Rate limit**: 5 tentativas falhas de login em 15 minutos por `(email, ip)` → bloqueia por 15 min
   com mensagem neutra. Registrar cada tentativa em `LoginAttempt`.
5. **Esqueci minha senha**: a resposta é **sempre** "Se existir uma conta com esse e-mail,
   enviamos as instruções." — nunca revele se o e-mail existe. Token de 1 hora, uso único,
   guardado como SHA-256. Ao redefinir: invalidar **todas** as sessões do usuário e criar sessão nova.
6. **Verificar e-mail**: token de 24h. **Não bloqueia o uso do app** — só mostra um aviso na Home.
7. **Return Intent** (`?next=`): obrigatório em login e redefinição. Validar que o destino é
   um caminho interno — aceite apenas strings que começam com `/` e **não** com `//` nem com `/\`.
   Caso contrário, caia para `/inicio`. "Login é uma PORTA, não um destino: a origem nunca se perde."
8. Senhas: mínimo 8 caracteres. Validar com zod no servidor, sempre.
9. Toda rota sob `(app)` exige sessão válida; o middleware redireciona para `/entrar?next=<origem>`.

## 6. E-mail

Nodemailer + Gmail SMTP. As variáveis já existem no `.env` (`SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`,
`SMTP_USER`, `SMTP_PASSWORD`, `MAIL_FROM`). **Nunca** imprima o valor de `SMTP_PASSWORD`,
nem o comite, nem o copie para outro arquivo.
Templates HTML em tabela (compatíveis com clientes de e-mail), nas cores da marca: cabeçalho navy
`#0A1F4E`, botão amarelo `#F6C945` com texto navy. Dois templates: verificação de e-mail e
redefinição de senha. Sempre com versão em texto puro alternativa.

## 7. Rotas

```
/                         → redireciona: com sessão → /inicio, sem sessão → /entrar
(auth)/entrar             → login (réplica do card do protótipo: e-mail + senha + lembrar-me)
(auth)/criar-conta        → nome, e-mail, senha, aceite
(auth)/esqueci-senha      → pede e-mail
(auth)/redefinir-senha    → ?token=... → nova senha
(auth)/verificar-email    → ?token=...
(app)/inicio              → Home (tela isHome do protótipo)
(app)/trilha              → trilha das 42 aulas (rodada seguinte — por ora um stub honesto)
(app)/progresso           → stub
(app)/perfil              → perfil + sair + encerrar outras sessões
(app)/aula/[slug]         → stub (o motor de aulas é a rodada seguinte)
```

Tudo em **português do Brasil**, incluindo slugs de rota e mensagens de erro.

## 8. Convenções de código

- Next.js 16 App Router, pasta `src/`, TypeScript **strict**, Tailwind CSS v4 (`@theme inline` no `globals.css`).
- **Server Components por padrão.** `'use client'` só onde houver interatividade real.
- Mutações de auth via **Server Actions** + `useActionState` / `useFormStatus` (React 19).
  Não crie route handlers em `/api` para o que uma Server Action resolve.
- Prisma Client como singleton em `src/lib/db.ts` (padrão `globalThis`, para sobreviver ao HMR).
- Nada de `any`. Nada de `console.log` com dado sensível.
- Comentários em português, e só quando o "porquê" não for óbvio.
- `npm run build` **precisa** passar ao final. Se você não conseguir rodar o build, garanta ao
  menos que seus próprios arquivos tipam corretamente.

## 9. Mapa de propriedade de arquivos (NÃO invada a área de outro agente)

Vários agentes trabalham em paralelo no mesmo repositório. **Escreva apenas nos arquivos da
sua lista.** Se precisar de algo de outra área, *presuma a interface descrita abaixo* e importe —
o arquivo vai existir. Não crie uma versão própria, não edite o que não é seu.

Interfaces públicas com as quais todos contam:

```ts
// src/lib/db.ts
export const prisma: PrismaClient

// src/lib/auth/session.ts
export async function getCurrentUser(): Promise<SessionUser | null>
export async function requireUser(): Promise<SessionUser>   // redireciona se faltar
export async function createSession(userId: string, remember: boolean): Promise<void>
export async function destroyCurrentSession(): Promise<void>
export type SessionUser = {
  id: string; name: string; email: string; photoUrl: string | null
  role: 'STUDENT' | 'ADMIN'; plan: Plano // de @/lib/planos
  emailVerifiedAt: Date | null
}

// src/lib/content/lessons.ts
export type LessonSummary = {
  id: number; code: string; slug: string; title: string; subtitle: string
  time: string; cover: string | null; pageCount: number; moduleId: number
}
export function getAllLessons(): LessonSummary[]
export function getLessonBySlug(slug: string): Lesson | null
export const MODULES: { id: number; title: string; from: number; to: number }[]

// src/components/ui/*  → Button, Input, Card, Pill, Logo, Field
```

## 10. Verificação

Ao terminar, relate em texto: arquivos criados, o que você de fato testou, e o que ficou pendente.
Não afirme que algo funciona se você não executou. Se `npm run build` falhar por causa do arquivo
de outro agente, diga isso explicitamente em vez de "consertar" o arquivo alheio.
