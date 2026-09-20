#!/bin/sh
# ==============================================================================
# WSA English — entrypoint de produção
#
#   1. confere as variáveis obrigatórias
#   2. espera o Postgres aceitar conexão
#   3. aplica as migrations (`prisma migrate deploy`) — se falhar, o container morre
#   4. roda o seed SOMENTE quando RUN_SEED=true
#   5. entrega o processo ao servidor do Next (exec, para o SIGTERM do Docker chegar nele)
#
# Nunca imprima valores de variáveis aqui: este log aparece inteiro no Portainer.
# ==============================================================================
set -eu

log()  { echo "[iea] $*"; }
fail() { echo "[iea] ERRO: $*" >&2; exit 1; }

DB_WAIT_RETRIES="${DB_WAIT_RETRIES:-60}"
DB_WAIT_DELAY="${DB_WAIT_DELAY:-2}"
RUN_SEED="${RUN_SEED:-false}"

cd /app

# ------------------------------------------------------------------------------
# 1. Variáveis
# ------------------------------------------------------------------------------
[ -n "${DATABASE_URL:-}" ] || fail "DATABASE_URL não está definida. Cadastre-a no ambiente da stack (Portainer)."

if [ -z "${APP_URL:-}" ]; then
  log "AVISO: APP_URL não definida — os links dos e-mails de verificação e de redefinição de senha podem sair errados."
fi

for var in SMTP_HOST SMTP_PORT SMTP_USER SMTP_PASSWORD MAIL_FROM; do
  # Só o NOME da variável é impresso, nunca o valor.
  eval "value=\${$var:-}"
  if [ -z "$value" ]; then
    log "AVISO: $var não definida — o envio de e-mail vai falhar."
  fi
done
unset value

# O CLI do Prisma é o mesmo binário que `npx prisma` executaria, chamado direto:
# assim não existe a chance de o npx tentar baixar o pacote da internet no start.
if [ -x /app/node_modules/.bin/prisma ]; then
  PRISMA="/app/node_modules/.bin/prisma"
elif [ -f /app/node_modules/prisma/build/index.js ]; then
  PRISMA="node /app/node_modules/prisma/build/index.js"
else
  fail "CLI do Prisma não está na imagem — o build do Dockerfile não terminou como deveria."
fi

# O schema pode ser um arquivo (prisma/schema.prisma) ou uma pasta (prisma/schema/*.prisma).
if [ ! -f /app/prisma/schema.prisma ] && [ ! -d /app/prisma/schema ]; then
  fail "o schema do Prisma não está na imagem (nem prisma/schema.prisma, nem prisma/schema/)."
fi

# ------------------------------------------------------------------------------
# 2. Esperar o Postgres
# ------------------------------------------------------------------------------
wait_for_db() {
  IEA_RETRIES="$DB_WAIT_RETRIES" IEA_DELAY="$DB_WAIT_DELAY" node -e '
    const net = require("node:net");
    const retries = Number(process.env.IEA_RETRIES) || 60;
    const delay = (Number(process.env.IEA_DELAY) || 2) * 1000;

    let url;
    try {
      url = new URL(process.env.DATABASE_URL);
    } catch {
      console.error("[iea] ERRO: DATABASE_URL não é uma URL válida. Se a senha tem caracteres especiais (@ : / ? #), troque por uma alfanumérica ou use percent-encoding.");
      process.exit(1);
    }

    const host = url.hostname;
    const port = Number(url.port || 5432);

    const tryOnce = () => new Promise((resolve) => {
      const socket = net.connect({ host, port });
      const finish = (ok) => { socket.destroy(); resolve(ok); };
      socket.setTimeout(3000);
      socket.once("connect", () => finish(true));
      socket.once("error", () => finish(false));
      socket.once("timeout", () => finish(false));
    });

    (async () => {
      for (let i = 1; i <= retries; i++) {
        if (await tryOnce()) {
          console.log("[iea] Postgres respondeu em " + host + ":" + port + ".");
          process.exit(0);
        }
        if (i === 1 || i % 5 === 0) {
          console.log("[iea] Aguardando o Postgres em " + host + ":" + port + " (tentativa " + i + "/" + retries + ")...");
        }
        await new Promise((r) => setTimeout(r, delay));
      }
      console.error("[iea] Postgres não respondeu em " + host + ":" + port + " depois de " + retries + " tentativas.");
      process.exit(1);
    })();
  '
}

if ! wait_for_db; then
  fail "não consegui falar com o banco. Confira DATABASE_URL, se o serviço db está de pé e se os dois estão na mesma rede."
fi

# ------------------------------------------------------------------------------
# 3. Migrations — falha aqui derruba o container de propósito (nada de `|| true`)
# ------------------------------------------------------------------------------
log "Aplicando migrations com 'prisma migrate deploy'..."
# $PRISMA sem aspas de propósito: pode ser "node <caminho>" (duas palavras).
# shellcheck disable=SC2086
if ! $PRISMA migrate deploy; then
  fail "a migration falhou. O app NÃO vai subir com o banco fora de sincronia — leia o erro acima, corrija e faça o redeploy."
fi
log "Banco em dia."

# ------------------------------------------------------------------------------
# 4. Seed (opcional) — só com RUN_SEED=true
# ------------------------------------------------------------------------------
has_prisma_config() {
  [ -f /app/prisma.config.ts ] || [ -f /app/prisma.config.mts ] || \
  [ -f /app/prisma.config.js ] || [ -f /app/prisma.config.mjs ]
}

run_seed() {
  if has_prisma_config; then
    log "Rodando o seed com 'prisma db seed'..."
    # shellcheck disable=SC2086
    if $PRISMA db seed; then
      return 0
    fi
    log "'prisma db seed' não concluiu; tentando executar o arquivo de seed direto."
  fi

  for candidate in prisma/seed.ts prisma/seed.mts prisma/seed.mjs prisma/seed.js; do
    [ -f "$candidate" ] || continue
    case "$candidate" in
      *.ts|*.mts)
        [ -x /app/node_modules/.bin/tsx ] || fail "o seed é TypeScript ($candidate) mas o tsx não está na imagem."
        log "Rodando o seed: tsx $candidate"
        /app/node_modules/.bin/tsx "$candidate"
        return 0
        ;;
      *)
        log "Rodando o seed: node $candidate"
        node "$candidate"
        return 0
        ;;
    esac
  done

  fail "RUN_SEED=true, mas não encontrei nenhum seed (prisma/seed.ts, .mts, .mjs ou .js)."
}

if [ "$RUN_SEED" = "true" ]; then
  run_seed
  log "Seed concluído. Volte RUN_SEED para 'false' e faça o redeploy — senão ele roda de novo a cada start."
else
  log "Seed pulado (RUN_SEED=$RUN_SEED)."
fi

# ------------------------------------------------------------------------------
# 4b. Contas de validação do MVP (admin + aluno) — só quando as variáveis existem
#     Só cria conta que falta; nunca altera uma existente. Falha aqui NÃO derruba
#     o app: sem as contas, o site continua no ar e o log diz o que faltou.
# ------------------------------------------------------------------------------
if [ -n "${ADMIN_EMAIL:-}${ALUNO_EMAIL:-}" ]; then
  if [ -x /app/node_modules/.bin/tsx ] && [ -f /app/scripts/contas-mvp.ts ]; then
    /app/node_modules/.bin/tsx /app/scripts/contas-mvp.ts || log "AVISO: as contas do MVP não foram todas criadas — veja as linhas [contas-mvp] acima."
  else
    log "AVISO: scripts/contas-mvp.ts ou o tsx não estão na imagem — contas do MVP não criadas."
  fi
fi

# ------------------------------------------------------------------------------
# 5. Servidor
# ------------------------------------------------------------------------------
if [ "$#" -eq 0 ]; then
  set -- node server.js
fi

log "Subindo o app em ${HOSTNAME:-0.0.0.0}:${PORT:-3000} ..."
exec "$@"
