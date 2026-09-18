# Deploy do "Inglês em Ação" na VPS (GitHub + Portainer)

Guia passo a passo, escrito para ser seguido **sem saber Docker de cor**. No fim você terá:

- o código no GitHub;
- uma stack no Portainer com **dois containers**: o app (`app`) e o banco (`db`);
- migrations aplicadas automaticamente a cada deploy;
- o site no ar em `https://seu-dominio.com.br`.

> **Leia isto antes de começar:** o cookie de sessão do app é `secure` em produção. Ou seja,
> **sem HTTPS ninguém consegue fazer login.** O Passo 6 (proxy reverso + certificado) não é
> opcional.

---

## 0. O que você vai precisar

| Item | Detalhe |
|---|---|
| Uma VPS com Docker e Portainer | Qualquer Linux. **Mínimo recomendado: 2 GB de RAM** — o `next build` roda na VPS e é o passo mais pesado. Com 1 GB, crie 2 GB de swap antes (veja a seção 9). |
| Um domínio apontando para o IP da VPS | Um registro `A` do tipo `app.seudominio.com.br → 203.0.113.10`. |
| Conta no GitHub | O repositório pode ser privado. |
| Uma senha de app do Gmail | Conta com verificação em duas etapas → Segurança → Senhas de app. A senha normal do Gmail **não** funciona no SMTP. |
| Portas 80 e 443 liberadas no firewall | A porta 3000 **não** deve ser aberta para a internet. |

Arquivos deste repositório que interessam ao deploy:

| Arquivo | Papel |
|---|---|
| `Dockerfile` | Receita da imagem de produção (instala, compila e empacota o app). |
| `docker-entrypoint.sh` | O que roda quando o container sobe: espera o banco → aplica migrations → seed opcional → inicia o app. |
| `docker-compose.prod.yml` | A stack (app + banco) que o Portainer vai subir. |
| `.env.example` | Lista de todas as variáveis, com valores de exemplo. |
| `docker-compose.yml` | **Desenvolvimento apenas.** O Portainer não usa este. |

---

## 1. Suba o código para o GitHub

No seu computador, dentro da pasta `app-web`:

```bash
git init
git add .
git commit -m "Primeira versão do Inglês em Ação"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/ingles-em-acao.git
git push -u origin main
```

**Confira antes do push:** o arquivo `.env` (que tem a senha de app do Gmail) **não pode** ir
junto. Ele já está no `.gitignore`. Para ter certeza:

```bash
git ls-files --error-unmatch .env 2>/dev/null && echo "PARE: o .env está versionado" || echo "ok, .env fora do repositório"
```

Se um dia o `.env` for comitado por acidente, **troque a senha de app do Gmail** — apagar o
arquivo depois não resolve, porque o histórico do git guarda o valor.

---

## 2. Crie a stack no Portainer

No Portainer: **Stacks → + Add stack**.

1. **Name:** `ingles-em-acao`
2. **Build method:** clique em **Repository**
3. **Repository URL:** `https://github.com/SEU-USUARIO/ingles-em-acao`
4. **Repository reference:** `refs/heads/main`
5. **Compose path:** `docker-compose.prod.yml` ← **não** é o `docker-compose.yml`
6. **Authentication:** ligue **apenas se o repositório for privado**. Em *Username* coloque seu
   usuário do GitHub e em *Personal Access Token* um token criado em
   GitHub → Settings → Developer settings → Personal access tokens. Um token *fine-grained* com
   permissão **Contents: Read-only** neste repositório basta.
7. **Environment variables:** cadastre as variáveis do Passo 3 (ainda não clique em Deploy).

---

## 3. As variáveis de ambiente, uma a uma

Ainda na tela da stack, em *Environment variables*, clique em **Add an environment variable**
para cada linha abaixo (ou use **Advanced mode** e cole tudo no formato `NOME=valor`).

### Banco de dados

| Variável | Exemplo | Para que serve |
|---|---|---|
| `POSTGRES_USER` | `iea` | Usuário que o Postgres cria no primeiro start. |
| `POSTGRES_PASSWORD` | `TrocaEssaSenha2026` | Senha desse usuário. **Use só letras e números.** Caracteres como `@ : / ? #` quebram a URL de conexão que a stack monta. |
| `POSTGRES_DB` | `ingles_em_acao` | Nome do banco. |

> Você **não** cadastra `DATABASE_URL`: a stack monta sozinha, com essas três variáveis,
> apontando para o container `db` na rede interna.
>
> ⚠️ Essas três variáveis só têm efeito no **primeiro** start do banco, quando o volume é criado.
> Mudar a senha depois não muda a senha dentro do Postgres — e o app para de conectar.
> Escolha com calma agora.

### Aplicação

| Variável | Exemplo | Para que serve |
|---|---|---|
| `APP_URL` | `https://app.seudominio.com.br` | URL pública, **com https e sem barra no final**. É o endereço que vai dentro dos links dos e-mails de verificação e de redefinição de senha. |
| `TZ` | `America/Sao_Paulo` | Fuso horário. Afeta a contagem de dias de estudo (streak). |
| `APP_BIND` | `127.0.0.1` | Em qual endereço do servidor o app escuta. `127.0.0.1` = só o próprio servidor enxerga; quem publica para a internet é o proxy reverso (Passo 6). |
| `APP_PORT` | `3000` | Porta no servidor que o proxy reverso vai chamar. Se a 3000 já estiver ocupada, use `3001`. |
| `RUN_SEED` | `true` no primeiro deploy, depois `false` | Popula os 7 módulos e as 42 aulas. Veja o Passo 5. |

### E-mail (SMTP do Gmail)

| Variável | Exemplo | Para que serve |
|---|---|---|
| `SMTP_HOST` | `smtp.gmail.com` | Servidor de envio. |
| `SMTP_PORT` | `465` | Porta do SMTP com TLS. |
| `SMTP_SECURE` | `true` | `true` para a porta 465. |
| `SMTP_USER` | `voce@gmail.com` | A conta que envia. |
| `SMTP_PASSWORD` | a senha de app, 16 letras | **A senha de app**, não a senha do Gmail. Cadastre só aqui, no Portainer. Pode colar com os espaços que o Google mostra: no Gmail, o app os tira. |
| `MAIL_FROM` | `Inglês em Ação <voce@gmail.com>` | Remetente que o aluno vê. |

> ⚠️ No Gmail, o endereço de `MAIL_FROM` tem de ser o mesmo de `SMTP_USER`. Com outro endereço,
> o Google troca o remetente ou manda para o spam. A conta gratuita envia até cerca de 500
> e-mails por dia.

### Opcionais

| Variável | Padrão | Para que serve |
|---|---|---|
| `DB_WAIT_RETRIES` | `60` | Quantas vezes o container tenta falar com o banco antes de desistir. |
| `DB_WAIT_DELAY` | `2` | Segundos entre as tentativas. |

### Contas de validação do MVP (opcional)

Com estas variáveis preenchidas, o start do container cria **um admin e um aluno** (plano
PREMIUM, e-mail já verificado) pelo `scripts/contas-mvp.ts`. Ele só cria a conta que ainda não
existe; uma conta existente nunca é alterada, e a senha nunca aparece no log.

| Variável | Exemplo | Para que serve |
|---|---|---|
| `ADMIN_EMAIL` | `admin@seudominio.com.br` | E-mail do admin (entra em `/admin`). |
| `ADMIN_NAME` | `Administrador` | Nome mostrado no painel. |
| `ADMIN_PASSWORD` | — | **Você digita, no Portainer.** 12 caracteres ou mais. |
| `ALUNO_EMAIL` | `aluno@seudominio.com.br` | E-mail do aluno de teste. |
| `ALUNO_NAME` | `Aluno MVP` | Nome mostrado no app. |
| `ALUNO_PASSWORD` | — | **Você digita, no Portainer.** 8 caracteres ou mais. |

No log do primeiro start aparece `[contas-mvp] conta de admin criada` (e a do aluno). Depois
disso, **apague `ADMIN_PASSWORD` e `ALUNO_PASSWORD` da stack** e faça o update: as contas ficam no
banco, e a senha não precisa ficar guardada no Portainer.

### Vídeos enviados pelo painel (opcional — Cloudflare R2)

Em `/admin/videos` cada aula aceita **um link** (YouTube, Vimeo, arquivo .mp4/.webm por
https) **ou o envio do arquivo**. O envio de arquivo precisa de um bucket S3-compatível; sem
estas variáveis, a opção "Enviar arquivo" mostra o que falta e o painel segue só com link.

> ⚠️ Vídeo **nunca** vai para o volume `iea_uploads` nem passa pelo container do app: o
> navegador do admin envia direto ao bucket por uma URL assinada, e o aluno assiste por um
> link assinado que vence em 15 minutos (o player renova sozinho). O volume continua só
> para as imagens.

| Variável | Exemplo | Para que serve |
|---|---|---|
| `S3_ENDPOINT` | `https://<ACCOUNT_ID>.r2.cloudflarestorage.com` | Endereço S3 da conta, **sem** o nome do bucket e sem barra no final. |
| `S3_BUCKET` | `iea-videos` | Nome do bucket. |
| `S3_ACCESS_KEY_ID` | (do token do R2) | Chave de acesso do token. |
| `S3_SECRET_ACCESS_KEY` | (do token do R2) | Segredo do token. **Cadastre só aqui, no Portainer.** |
| `S3_REGION` | `auto` | Opcional. No R2 é sempre `auto`. |

**Criando no Cloudflare R2:**

1. Painel da Cloudflare → **R2** → **Create bucket** (ex.: `iea-videos`). Deixe **privado**
   — nada de "public access" nem domínio público: o app assina cada link.
2. **R2 → Manage R2 API Tokens → Create API token**, permissão **Object Read & Write**,
   restrito a esse bucket. Copie o *Access Key ID* e o *Secret Access Key* (o segredo só
   aparece uma vez) e o endpoint S3 da conta.
3. No bucket, **Settings → CORS Policy**, cole (troque pelo seu `APP_URL`):

```json
[
  {
    "AllowedOrigins": ["https://app.seudominio.com.br"],
    "AllowedMethods": ["PUT", "GET", "HEAD"],
    "AllowedHeaders": ["content-type"],
    "MaxAgeSeconds": 3600
  }
]
```

   Sem esse CORS, o navegador bloqueia o envio e o painel mostra "Não consegui falar com o
   armazenamento". Para testar em desenvolvimento, acrescente `http://localhost:3000` em
   `AllowedOrigins`.
4. Cadastre as variáveis na stack e atualize. A opção "Enviar arquivo" passa a mostrar o
   destino (`<conta>.r2.cloudflarestorage.com · iea-videos`).

**Exporte antes de enviar.** Não há conversão no servidor: o arquivo que sobe é o que o aluno
baixa. Alvo: **720p, ~2 Mbps, MP4 (H.264)** — uma aula fica entre 80 e 150 MB. Limite de
500 MB por arquivo. A tela avisa quando o arquivo passa muito disso.

Trocar ou remover o vídeo de uma aula **não apaga** o arquivo do bucket (a regra de "nunca
apagamos de verdade" das mídias). Arquivos recusados na conferência (tipo ou conteúdo
diferente do anunciado) são apagados na hora.

Agora sim: **Deploy the stack**.

---

## 4. O primeiro deploy

O Portainer clona o repositório e **constrói a imagem na VPS**. Isso demora
**5 a 15 minutos** na primeira vez (depois é bem mais rápido, porque o Docker reaproveita as
camadas). A tela pode parecer travada — está construindo.

Quando terminar, vá em **Containers**. Você verá dois:

- `ingles-em-acao-db-1` — deve ficar **healthy**;
- `ingles-em-acao-app-1` — só sobe depois que o banco está saudável.

Clique no container do app → **Logs**. Um start correto tem esta cara:

```
[iea] Postgres respondeu em db:5432.
[iea] Aplicando migrations com 'prisma migrate deploy'...
[iea] Banco em dia.
[iea] Seed pulado (RUN_SEED=false).
[iea] Subindo o app em 0.0.0.0:3000 ...
  ▲ Next.js 16.3.5
  - Local: http://0.0.0.0:3000
```

Teste de dentro da própria VPS (ainda sem domínio):

```bash
curl -I http://127.0.0.1:3000/
```

Uma resposta `200` ou `307` significa que o app está de pé.

---

## 5. A primeira migration e o seed

**A migration você não precisa rodar à mão.** Toda vez que o container sobe, o
`docker-entrypoint.sh` executa `prisma migrate deploy` antes de iniciar o app. Se a migration
falhar, o container **não sobe** — é de propósito: é melhor ficar fora do ar do que atender com
o banco fora de sincronia. O erro aparece inteiro no log.

**O seed (módulos + 42 aulas) é opt-in:**

1. No primeiro deploy, deixe `RUN_SEED=true`. No log você verá `[iea] Rodando o seed...`.
2. Assim que terminar, edite a stack (**Stacks → ingles-em-acao**), mude para `RUN_SEED=false`
   e clique em **Update the stack**.

Se esquecer o `true`, o seed roda **em todo start do container** — inclusive nos reinícios
automáticos —, o que pode duplicar ou sobrescrever dados.

Para conferir o estado das migrations sem adivinhar, abra o container do app em **Console**
(comando `/bin/sh`, usuário `root`) e rode:

```sh
cd /app && ./node_modules/.bin/prisma migrate status
```

Para rodar o seed manualmente uma única vez, sem mexer na stack:

```sh
cd /app && ./node_modules/.bin/tsx prisma/seed.ts
```

---

## 6. Proxy reverso e HTTPS

O app escuta em `127.0.0.1:3000` e **não** está exposto na internet. Quem atende as portas
80/443, termina o TLS e repassa para ele é o proxy reverso. Escolha **uma** das opções.

### Opção A — nginx instalado na própria VPS (mais simples)

```bash
sudo apt update && sudo apt install -y nginx certbot python3-certbot-nginx
sudo nano /etc/nginx/sites-available/ingles-em-acao
```

Conteúdo:

```nginx
server {
    listen 80;
    server_name app.seudominio.com.br;

    # espaço para uploads (foto de perfil, por exemplo)
    client_max_body_size 10M;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;

        proxy_set_header Host              $host;
        proxy_set_header X-Real-IP         $remote_addr;
        proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
        # sem esta linha o app acha que está em http e o cookie de sessão não gruda
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade           $http_upgrade;
        proxy_set_header Connection        "upgrade";

        proxy_read_timeout 90s;
    }
}
```

Ative e peça o certificado:

```bash
sudo ln -s /etc/nginx/sites-available/ingles-em-acao /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d app.seudominio.com.br
```

O certbot reescreve o arquivo para HTTPS e renova sozinho. Depois:

```bash
sudo ufw allow 80/tcp && sudo ufw allow 443/tcp
```

Confirme que `APP_URL` na stack é exatamente `https://app.seudominio.com.br` (sem barra no
fim). Mudou? **Update the stack**, para o container pegar o valor novo.

### Opção B — proxy em container (Nginx Proxy Manager, Traefik, Caddy)

Um proxy que roda em container não enxerga o `127.0.0.1` do host. Duas mudanças:

1. Coloque o app na mesma rede Docker do proxy. No `docker-compose.prod.yml`, acrescente a rede
   externa ao serviço `app`:

   ```yaml
       networks:
         - iea
         - proxy      # rede que o seu proxy já usa

   networks:
     iea:
       name: iea
     proxy:
       external: true
   ```

   (Alternativa mais grosseira, se não quiser mexer no arquivo: mude `APP_BIND` para `0.0.0.0`
   e aponte o proxy para o IP do host. Isso deixa a porta 3000 aberta na rede — só faça se o
   firewall bloquear a 3000 de fora.)

2. No proxy, aponte o destino para **`app`** (o nome do serviço) na porta **3000**, não para o
   IP do host.

Em qualquer uma das opções, garanta que o proxy envia o cabeçalho `X-Forwarded-Proto: https`.

---

## 7. Redeploy depois de um `git push`

No seu computador:

```bash
git add .
git commit -m "O que mudou"
git push
```

Na VPS, escolha um caminho:

**Manual (recomendado no começo):** Portainer → **Stacks → ingles-em-acao → Pull and redeploy**.
Marque a opção de **reconstruir a imagem** (*Re-pull image and redeploy*). O Portainer busca o
commit mais recente, reconstrói e reinicia os containers. Migrations novas são aplicadas
sozinhas no start.

**Automático (GitOps):** na edição da stack, ligue **GitOps updates** e escolha *Polling* (a
cada 5 minutos, por exemplo) ou *Webhook*. No modo webhook, copie a URL que o Portainer gera e
cadastre no GitHub em **Settings → Webhooks → Add webhook**, com *Content type*
`application/json` e o evento *Just the push event*. A partir daí, todo push redeploya.

O banco **não** é afetado pelo redeploy: os dados vivem no volume `iea_pgdata`, que sobrevive à
recriação dos containers.

---

## 8. Manutenção do dia a dia

**Ver logs em tempo real** — Portainer → Containers → app → Logs (marque *Auto-refresh*), ou
pelo terminal da VPS:

```bash
docker logs -f ingles-em-acao-app-1
```

**Backup do banco** (rode na VPS e guarde o arquivo fora do servidor):

```bash
docker exec -t ingles-em-acao-db-1 pg_dump -U iea -d ingles_em_acao > backup-$(date +%F).sql
```

**Restaurar um backup:**

```bash
cat backup-2026-09-17.sql | docker exec -i ingles-em-acao-db-1 psql -U iea -d ingles_em_acao
```

**Abrir o banco à mão:** Portainer → Containers → `db` → **Console** (`/bin/sh`) e então
`psql -U iea -d ingles_em_acao`. O Postgres não publica porta nenhuma no host de propósito; se
quiser usar um cliente gráfico (DBeaver, TablePlus), faça um túnel SSH e publique a porta
temporariamente, nunca de forma permanente.

**Recriar tudo do zero (apaga os dados!):** Stacks → ingles-em-acao → Delete, marcando a opção
de remover volumes. Só com um backup na mão.

### Limpeza diária (cron)

O banco guarda coisas que vencem e ninguém mais usa: sessões expiradas, links de e-mail
(verificação e redefinição de senha) usados ou vencidos, e o registro de cada tentativa de
login. Sem poda, a tabela de tentativas vira a maior do banco em poucos meses. Quem poda é a
rota `POST /api/cron/limpeza`, e quem chama a rota uma vez por dia é o **crontab da VPS**.

| O que sai | A partir de quando |
|---|---|
| Sessões | assim que vencem |
| Links de e-mail | 7 dias depois de usados ou vencidos (dá para investigar "o link não abriu") |
| Tentativas de login | 30 dias depois (dá para investigar "invadiram minha conta?") |

**1. Crie o segredo.** Gere um valor aleatório (no seu computador ou na VPS):

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

No Portainer → Stacks → ingles-em-acao → **Environment variables**, cadastre `CRON_SECRET`
com esse valor e clique em **Update the stack**. Sem a variável a rota responde `503` e não
apaga nada; com ela, só quem manda `Authorization: Bearer <CRON_SECRET>` passa.

**2. Teste à mão, no terminal da VPS:**

```bash
docker exec ingles-em-acao-app-1 node -e "fetch('http://127.0.0.1:'+(process.env.PORT||3000)+'/api/cron/limpeza',{method:'POST',headers:{Authorization:'Bearer '+process.env.CRON_SECRET}}).then(async r=>{console.log(new Date().toISOString(),r.status,await r.text());process.exit(r.ok?0:1)}).catch(e=>{console.log(new Date().toISOString(),'falhou:',e.message);process.exit(1)})"
```

A resposta esperada é algo como
`2026-09-18T07:15:00.000Z 200 {"ok":true,"sessoes":3,"tokens":0,"tentativas":41}`: quantas
linhas saíram de cada tabela. Se o nome do container for outro, confira com
`docker ps --format '{{.Names}}'`.

> **Por que esse comando e não um `curl` com o segredo?** O `node -e` roda **dentro** do
> container e lê o `CRON_SECRET` do ambiente do próprio container. O segredo nunca aparece
> no crontab, no histórico do shell nem na lista de processos da VPS, e a chamada nem passa
> pelo proxy reverso (vai direto para `127.0.0.1` dentro do container). A imagem não tem
> `curl` nem `wget`; é o mesmo truque do healthcheck.

**3. Agende.** Na VPS, abra o crontab do root (`sudo crontab -e`) e acrescente **uma linha**
(é uma linha só, mesmo que pareça longa):

```cron
15 4 * * * docker exec ingles-em-acao-app-1 node -e "fetch('http://127.0.0.1:'+(process.env.PORT||3000)+'/api/cron/limpeza',{method:'POST',headers:{Authorization:'Bearer '+process.env.CRON_SECRET}}).then(async r=>{console.log(new Date().toISOString(),r.status,await r.text());process.exit(r.ok?0:1)}).catch(e=>{console.log(new Date().toISOString(),'falhou:',e.message);process.exit(1)})" >> /var/log/iea-limpeza.log 2>&1
```

Roda todo dia às 4h15 (no fuso da VPS; confira com `timedatectl`), num horário sem aluno.
O arquivo de log cresce uma linha por dia, cerca de 40 KB por ano, então não precisa de
rotação.

**4. Como saber que rodou.**

- O resultado de cada dia, com data e hora:

  ```bash
  tail -n 7 /var/log/iea-limpeza.log
  ```

- O que o app registrou (uma linha por execução, só com contagens):

  ```bash
  docker logs ingles-em-acao-app-1 2>&1 | grep "\[cron\] limpeza"
  ```

  Exemplo: `[cron] limpeza ok: 3 sessão(ões), 0 token(s), 41 tentativa(s) de login em 18 ms`.

- Se o arquivo de log nem existe, o cron não disparou: confira com `sudo crontab -l` e, no
  Ubuntu/Debian, com `grep CRON /var/log/syslog`.

| O log mostra | O que é | O que fazer |
|---|---|---|
| `200 {"ok":true,...}` | Rodou. | Nada. |
| `503 ... Limpeza desligada neste ambiente.` | `CRON_SECRET` vazio na stack | Faça o passo 1 e atualize a stack. |
| `401 ... Não autorizado.` | O cabeçalho não bateu com o segredo | Pelo comando acima isso não acontece, porque os dois lados leem a mesma variável. Veja se a linha do crontab não foi alterada. |
| `500 ... A limpeza falhou.` | O banco não respondeu | `docker logs` mostra `[cron] limpeza falhou:` com o motivo. |
| `falhou: fetch failed` | O app não estava de pé (deploy ou reinício naquela hora) | Rode o passo 2 à mão. Um dia perdido não faz diferença: a próxima execução apaga o acumulado. |
| `Error response from daemon: No such container` | O nome do container mudou | Ajuste o nome na linha do crontab. |

---

## 9. Quando algo dá errado

| Sintoma | O que é | O que fazer |
|---|---|---|
| `[iea] ERRO: DATABASE_URL não está definida` | Faltou variável na stack | Cadastre `POSTGRES_USER`, `POSTGRES_PASSWORD` e `POSTGRES_DB` e atualize a stack. |
| `[iea] Aguardando o Postgres...` repetindo até falhar | O app não alcança o banco | Veja se o container `db` está *healthy*; confira se a senha tem caractere especial (`@ : / ? #`) quebrando a URL. |
| `[iea] ERRO: a migration falhou` | O `migrate deploy` não passou | Leia o erro logo acima. Migration aplicada à mão ou banco criado por outra versão do schema são as causas comuns; `prisma migrate status` no Console ajuda. |
| `P1000: Authentication failed` | Senha do Postgres diferente da que está gravada no volume | A senha só é definida quando o volume é criado. Ou volte a senha antiga, ou apague o volume (perde os dados) e recrie. |
| Build morre com `killed` ou `JavaScript heap out of memory` | RAM insuficiente na VPS | Crie swap: `sudo fallocate -l 2G /swapfile && sudo chmod 600 /swapfile && sudo mkswap /swapfile && sudo swapon /swapfile` (e acrescente a linha correspondente no `/etc/fstab`). |
| Login "não faz nada" e volta para a tela de entrar | Cookie `secure` sem HTTPS, ou proxy sem `X-Forwarded-Proto` | Termine o Passo 6 e confira que `APP_URL` começa com `https://`. |
| E-mails não chegam | SMTP | Confirme **senha de app** do Gmail, `SMTP_PORT=465` e `SMTP_SECURE=true`. O log do app mostra o erro do envio. |
| `502 Bad Gateway` no navegador | O proxy não achou o app | Confira `APP_BIND` / `APP_PORT` e se o `proxy_pass` bate com eles. |
| "Não consegui falar com o armazenamento" ao enviar vídeo | CORS do bucket | Confira a CORS Policy do bucket (Passo 3, vídeos): a origem tem de ser exatamente o `APP_URL`, com `PUT` e o cabeçalho `content-type`. |
| "O envio de arquivo ainda não está ligado" em `/admin/videos` | Faltam as variáveis `S3_*` | A própria tela lista os nomes que faltam. Cadastre e atualize a stack. |
| O container reinicia em loop logo após o seed | `RUN_SEED` ficou `true` e o seed falha | Volte `RUN_SEED` para `false`, atualize a stack e rode o seed manualmente pelo Console. |

---

## 10. Como a stack está montada (para consulta)

- **`app`** — construído a partir deste repositório (`build: context: .`). Sobe só depois que o
  `db` responde ao healthcheck (`depends_on: condition: service_healthy`), reinicia sozinho
  (`restart: unless-stopped`) e tem healthcheck HTTP próprio, que o Portainer mostra como
  *healthy*. Roda como usuário **não-root** dentro do container.
- **`db`** — `postgres:17-alpine`, dados no volume nomeado `iea_pgdata`, healthcheck com
  `pg_isready`. **Sem portas publicadas**: só o app, pela rede interna `iea`, fala com ele.
- **Imagem** — multi-stage: instala as dependências, roda `prisma generate` e `next build`,
  e a imagem final leva apenas o servidor standalone do Next, os estáticos, o `prisma/`
  (schema + migrations) e o CLI do Prisma necessário para o `migrate deploy`.
- **Segredos** — nenhum valor real está versionado. Tudo que aparece como `${VARIAVEL}` no
  `docker-compose.prod.yml` vem do ambiente da stack no Portainer.
