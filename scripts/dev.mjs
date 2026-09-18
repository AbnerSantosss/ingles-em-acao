/**
 * `npm run dev` — sobe o `next dev` na primeira porta livre a partir de 3000.
 *
 * Por quê: nesta máquina a 3000 costuma estar ocupada por outro projeto, e o
 * `next dev` puro só avisa e muda de porta sem dizer ao app — os links dos e-mails
 * (`APP_URL`) continuariam apontando para a porta errada.
 *
 * - `PORT=3100 npm run dev` começa a busca pela 3100.
 * - Se o `APP_URL` do `.env` for `localhost`, ele é sobrescrito só neste processo
 *   com a porta escolhida. Um `APP_URL` de domínio real nunca é tocado.
 * - Argumentos extras vão direto para o `next dev` (`npm run dev -- --turbo`).
 */
import { spawn } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import net from 'node:net';

const INICIO = Number(process.env.PORT) || 3000;
const TENTATIVAS = 50;

/** A porta está livre se der para escutar nela em IPv4 e em IPv6. */
function escutaEm(porta, host) {
  return new Promise((resolve) => {
    const servidor = net.createServer();
    servidor.unref();
    servidor.once('error', (erro) => resolve(erro.code === 'EAFNOSUPPORT' || erro.code === 'EADDRNOTAVAIL'));
    servidor.listen({ port: porta, host, exclusive: true }, () => servidor.close(() => resolve(true)));
  });
}

async function portaLivre(porta) {
  return (await escutaEm(porta, '0.0.0.0')) && (await escutaEm(porta, '::'));
}

async function primeiraPortaLivre() {
  for (let porta = INICIO; porta < INICIO + TENTATIVAS; porta += 1) {
    if (await portaLivre(porta)) return porta;
    console.log(`[dev] porta ${porta} ocupada, tentando a próxima…`);
  }
  throw new Error(`nenhuma porta livre entre ${INICIO} e ${INICIO + TENTATIVAS - 1}`);
}

/** O `APP_URL` do ambiente ou do `.env` — só para decidir se é local. */
function appUrlAtual() {
  if (process.env.APP_URL) return process.env.APP_URL;
  try {
    const linha = readFileSync('.env', 'utf8')
      .split(/\r?\n/)
      .find((l) => l.trim().startsWith('APP_URL='));
    return linha ? linha.slice(linha.indexOf('=') + 1).trim().replace(/^["']|["']$/g, '') : '';
  } catch {
    return '';
  }
}

const porta = await primeiraPortaLivre();
const env = { ...process.env, PORT: String(porta) };

const appUrl = appUrlAtual();
if (!appUrl || /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?\/?$/.test(appUrl)) {
  // Variável já presente no processo vence o `.env` no Next.
  env.APP_URL = `http://localhost:${porta}`;
}

console.log(`[dev] abrindo em http://localhost:${porta}`);

const require = createRequire(import.meta.url);
const binarioDoNext = require.resolve('next/dist/bin/next');
const filho = spawn(process.execPath, [binarioDoNext, 'dev', '-p', String(porta), ...process.argv.slice(2)], {
  stdio: 'inherit',
  env,
});

for (const sinal of ['SIGINT', 'SIGTERM']) {
  process.on(sinal, () => filho.kill(sinal));
}
filho.on('exit', (codigo) => process.exit(codigo ?? 0));
