# WSA English — guia de desenvolvimento

App web **mobile-first** de ensino de inglês: 42 aulas / 309 páginas, com autenticação
real (entrar, criar conta, verificar e-mail, esqueci/redefinir senha, "lembrar-me"),
PostgreSQL via Prisma e deploy em VPS por **GitHub + Portainer (Docker)**.

Toda a interface é em **português do Brasil**, inclusive as rotas (`/entrar`, `/inicio`,
`/trilha`, `/perfil`…).

- Contrato técnico (identidade visual, modelo de dados, regras de auth, rotas): [`docs/CONTRACT.md`](CONTRACT.md)
- Como colocar no ar: [`docs/DEPLOY.md`](DEPLOY.md)

---

## Stack

| Peça | O que é |
|---|---|
| **Next.js 16** (App Router, pasta `src/`) | Server Components por padrão; mutações por Server Actions |
| **React 19** | `useActionState` / `useFormStatus` nos formulários |
| **TypeScript strict** | sem `any` |
| **Tailwind CSS v4** | tokens em `@theme inline` no `globals.css` |
| **Prisma 7 + PostgreSQL 17** | schema, migrations e seed em `prisma/` |
| **@node-rs/argon2** | hash de senha (Argon2id) |
| **Nodemailer** | e-mails de verificação e de redefinição, via SMTP do Gmail |

---

## Rodando em desenvolvimento

Pré-requisitos: **Node.js 22+**, **npm** e **Docker** (só para o banco).

### 1. Dependências

```bash
npm install
```

### 2. Variáveis de ambiente

```bash
cp .env.example .env
```

Abra o `.env` e preencha o bloco de SMTP (no Gmail é preciso uma **senha de app**, não a
senha da conta). Os valores de banco já vêm apontando para o container de desenvolvimento.
O `.env` **nunca** é comitado — ele está no `.gitignore`.

### 3. Banco de dados

O `docker-compose.yml` (o de desenvolvimento) sobe um PostgreSQL 17 no container `iea-db`,
publicado na porta **5433** do seu computador — assim ele não briga com um Postgres que já
exista na 5432.

```bash
docker compose up -d db
```

### 4. Migrations e seed

```bash
npx prisma migrate dev     # cria/aplica as migrations e gera o Prisma Client
npx prisma db seed         # popula os 7 módulos e as 42 aulas
```

> Se `npx prisma db seed` reclamar que não há seed configurado, rode o arquivo direto:
> `npx tsx prisma/seed.ts`.

### 5. Subir o app

```bash
npm run dev
```

Abra <http://localhost:3000>. Sem sessão, a raiz leva para `/entrar`.

---

## Scripts

| Comando | O que faz |
|---|---|
| `npm run dev` | servidor de desenvolvimento na primeira porta livre a partir da 3000 (`scripts/dev.mjs`) |
| `npm run build` | build de produção (gera também `.next/standalone`) |
| `npm run start` | roda o build de produção localmente |
| `npm run lint` | ESLint |
| `npm test` | testes unitários e de integração (Vitest) num banco **separado**, o `<nome do banco>_test`, criado e migrado sozinho na primeira rodada |
| `npm run test:watch` | Vitest em modo observação |
| `npm run test:e2e` | testes de ponta a ponta (Playwright, no Chrome instalado) contra `http://localhost:3000`; reaproveita o `npm run dev` que já estiver no ar |

> ⚠️ Os testes E2E rodam contra o banco de **desenvolvimento**, porque usam o app de verdade e os
> botões de entrada de dev (`/entrar`). Eles zeram o progresso das contas `*@dev.local` e mais nada.
> O Vitest nunca toca o banco de desenvolvimento: `tests/support/banco.ts` recusa qualquer nome
> que não termine em `_test`.

Comandos de banco (CLI do Prisma, funcionam independentemente de atalhos no `package.json`):

| Comando | O que faz |
|---|---|
| `npx prisma migrate dev --name <nome>` | cria uma migration a partir do `schema.prisma` |
| `npx prisma migrate deploy` | aplica as migrations pendentes (é o que roda em produção) |
| `npx prisma studio` | abre o navegador de dados do banco |
| `npx prisma generate` | regenera o Prisma Client |
| `npx prisma db seed` | roda o seed |

---

## Estrutura de pastas

```
app-web/
├─ src/
│  ├─ app/                 rotas do App Router
│  │  ├─ (auth)/           entrar, criar-conta, esqueci-senha, redefinir-senha, verificar-email
│  │  ├─ (app)/            inicio, trilha, progresso, perfil, aula/[slug]  (exigem sessão)
│  │  ├─ layout.tsx        fontes (Figtree/Caveat) e shell da aplicação
│  │  └─ globals.css       tokens de cor/forma do design (Tailwind v4)
│  ├─ components/          UI compartilhada (Button, Input, Card, Pill, Logo, Field…)
│  └─ lib/
│     ├─ db.ts             Prisma Client singleton
│     ├─ auth/             sessão, hash de senha, rate limit, tokens
│     ├─ mail/             Nodemailer + templates de e-mail
│     └─ content/          leitura do conteúdo do curso
├─ tests/                  Vitest: unitários e integração com o banco _test (tests/support/ = infraestrutura)
├─ e2e/                    Playwright: jornadas do aluno e do admin no navegador
├─ prisma/                 schema.prisma, migrations/ e seed
├─ content/course-data.mjs conteúdo das 42 aulas (fonte de verdade do curso)
├─ public/                 capas, ilustrações, ícones e arte de marca
├─ prototype/              protótipo HTML que serve de referência visual
├─ docs/
│  ├─ CONTRACT.md          contrato técnico da entrega
│  └─ DEPLOY.md            deploy em VPS (GitHub + Portainer)
├─ docker-compose.yml      banco de DESENVOLVIMENTO (Postgres na 5433)
├─ docker-compose.prod.yml stack de PRODUÇÃO (app + banco) para o Portainer
├─ Dockerfile              imagem de produção (multi-stage, Next standalone)
└─ docker-entrypoint.sh    espera o banco, aplica migrations, roda o seed opcional, sobe o app
```

---

## Produção, em uma frase

O `Dockerfile` gera uma imagem com o servidor standalone do Next rodando como usuário
não-root; ao subir, o `docker-entrypoint.sh` espera o Postgres, roda `prisma migrate deploy`
(se falhar, o container não sobe) e só então inicia o app. O passo a passo completo — repositório
no GitHub, stack no Portainer, variáveis de ambiente, HTTPS — está em [`docs/DEPLOY.md`](DEPLOY.md).
