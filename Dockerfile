# syntax=docker/dockerfile:1
# ==============================================================================
# WSA English: imagem de produção
# Next.js 16 (output: standalone) + Prisma 7 + PostgreSQL
#
# Build multi-stage:
#   deps    → instala node_modules com npm ci (lockfile manda)
#   builder → prisma generate + next build, e depois poda o que era só de build
#   runner  → imagem final, usuário não-root, roda pelo docker-entrypoint.sh
#
# Nenhuma feature exclusiva do BuildKit é usada aqui (sem cache mounts, sem
# COPY --chmod, sem heredoc): o builder clássico do Docker, que o Portainer pode
# acabar usando, constrói esta imagem do mesmo jeito.
# ==============================================================================

ARG NODE_IMAGE=node:22-alpine

# ------------------------------------------------------------------------------
# 1) deps — dependências (dev incluídas: o build precisa de typescript/tailwind/prisma)
# ------------------------------------------------------------------------------
FROM ${NODE_IMAGE} AS deps

# libc6-compat: camada de compatibilidade glibc→musl. Os binários nativos deste projeto
#   (@node-rs/argon2 e sharp) têm artefato musl próprio, que o npm escolhe sozinho pelo
#   campo "libc" do lockfile — mas se por qualquer motivo cair o artefato -gnu, é o
#   libc6-compat que faz ele carregar. Custa ~100 KB e evita um "Error loading shared
#   library ld-linux-x86-64.so.2" no meio do deploy.
# openssl: o motor de schema do Prisma (usado por `prisma migrate`) linka contra OpenSSL 3.
RUN apk add --no-cache libc6-compat openssl

WORKDIR /app

# Só o manifesto primeiro: enquanto package.json/package-lock.json não mudarem,
# o Docker reaproveita esta camada e o deploy não reinstala nada.
COPY package.json package-lock.json ./

# npm ci instala exatamente o que está no lockfile, incluindo os binários nativos da
# plataforma da imagem (@node-rs/argon2-linux-x64-musl, @img/sharp-linuxmusl-x64,
# @next/swc-linux-x64-musl) e o motor de schema do Prisma (postinstall).
RUN npm ci

# ------------------------------------------------------------------------------
# 2) builder — gera o Prisma Client e compila o Next
# ------------------------------------------------------------------------------
FROM ${NODE_IMAGE} AS builder

RUN apk add --no-cache libc6-compat openssl

WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1 \
    CHECKPOINT_DISABLE=1

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Placeholder de build: `prisma generate` e `next build` exigem a variável definida,
# mas nada conecta no banco durante o build. Em produção o valor real vem do ambiente
# do Portainer, em tempo de execução.
ARG DATABASE_URL="postgresql://build:build@127.0.0.1:5432/build?schema=public"
ENV DATABASE_URL=${DATABASE_URL}

# Estas duas o `next build` congela dentro das telas pré-renderizadas, então têm
# de valer já aqui, e não só em runtime:
#
# - APP_URL vira o `metadataBase` e as URLs absolutas de /termos, /privacidade e
#   da 404. Sem ela, essas telas saem do build apontando para localhost:3000.
# - MAIL_FROM é exigida pelo `env.ts`; qualquer rota pré-renderizada que alcance
#   a camada de e-mail derruba o build sem ela.
#
# O docker-compose.prod.yml repassa as duas em `build.args`, com os mesmos
# valores do ambiente da stack. Vazias, o app cai nos padrões de desenvolvimento.
# Só variável pública entra aqui: build arg fica gravada no histórico da imagem,
# então nada de SMTP_PASSWORD ou outro segredo.
ARG APP_URL=""
ENV APP_URL=${APP_URL}

ARG MAIL_FROM=""
ENV MAIL_FROM=${MAIL_FROM}

RUN npx prisma generate
RUN npm run build

# Pacote com o que o entrypoint precisa em runtime além do servidor:
# schema + migrations, o seed e o conteúdo do curso que o seed lê — e os scripts
# de conta de admin (`npm run admin:create` / `admin:promote` via docker exec).
# O `if` cobre o prisma.config.* ser opcional (COPY falharia com glob sem match).
RUN mkdir -p /opt/runtime \
 && cp -R prisma content src scripts package.json tsconfig.json /opt/runtime/ \
 && if ls prisma.config.* >/dev/null 2>&1; then cp prisma.config.* /opt/runtime/; fi

# Poda: a partir daqui node_modules só serve para o CLI do Prisma (`migrate deploy`)
# e para o tsx (seed). O runtime do app NÃO sai daqui — ele vem tracejado dentro de
# .next/standalone. Podar aqui (e não no runner) é o que realmente encolhe a imagem:
# apagar em uma camada posterior não remove os bytes das camadas anteriores.
RUN rm -rf \
      node_modules/next \
      node_modules/@next \
      node_modules/typescript \
      node_modules/eslint \
      node_modules/eslint-config-next \
      node_modules/@eslint \
      node_modules/@eslint-community \
      node_modules/@typescript-eslint \
      node_modules/tailwindcss \
      node_modules/@tailwindcss \
      node_modules/@types \
      node_modules/vitest \
      node_modules/@vitest \
      node_modules/vite \
      node_modules/rolldown \
      node_modules/@rolldown \
      node_modules/@playwright \
      node_modules/playwright \
      node_modules/playwright-core \
      node_modules/.cache

# ------------------------------------------------------------------------------
# 3) runner — imagem final
# ------------------------------------------------------------------------------
FROM ${NODE_IMAGE} AS runner

LABEL org.opencontainers.image.title="WSA English" \
      org.opencontainers.image.description="App web de ensino de inglês (42 aulas)" \
      org.opencontainers.image.licenses="UNLICENSED"

# openssl: motor de schema do Prisma (`migrate deploy` roda no start do container).
# ca-certificates: TLS do SMTP (envio de e-mail de verificação/redefinição).
# tzdata: fusos nomeados, para TZ=America/Sao_Paulo valer na contagem de dias de estudo.
# libc6-compat: mesma rede de segurança do stage deps para os binários nativos.
RUN apk add --no-cache openssl ca-certificates tzdata libc6-compat

WORKDIR /app

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    CHECKPOINT_DISABLE=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0

# Usuário sem privilégios: o app nunca roda como root.
RUN addgroup --system --gid 1001 nodejs \
 && adduser --system --uid 1001 --ingroup nodejs nextjs

# (a) Ferramentas de linha de comando: CLI do Prisma (migrate deploy) e tsx (seed).
#     O CLI do Prisma 7 carrega @prisma/config, @prisma/dev, @prisma/engines e
#     @prisma/studio-core já no topo do módulo, então a árvore vai inteira (podada no
#     builder) em vez de pacote a pacote — copiar "só o prisma" quebraria no deploy.
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules

# (b) schema + migrations + seed + conteúdo do curso
COPY --from=builder --chown=nextjs:nodejs /opt/runtime ./

# (c) estáticos servidos pelo próprio server.js do standalone
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# (d) o servidor standalone (server.js + o node_modules tracejado do Next, que repõe o
#     pacote `next` podado no builder) e os assets com hash do build
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Cache do Next (ISR e imagens otimizadas) precisa ser gravável pelo usuário do app.
RUN mkdir -p .next/cache && chown -R nextjs:nodejs .next

COPY docker-entrypoint.sh ./docker-entrypoint.sh
# O repositório é editado no Windows: sem tirar o CR o shebang vira "/bin/sh\r" e o
# container morre com "no such file or directory". O sed abaixo resolve nos dois mundos.
RUN sed -i 's/\r$//' ./docker-entrypoint.sh \
 && chmod +x ./docker-entrypoint.sh \
 && chown nextjs:nodejs ./docker-entrypoint.sh

USER nextjs

EXPOSE 3000

ENTRYPOINT ["/app/docker-entrypoint.sh"]
CMD ["node", "server.js"]
