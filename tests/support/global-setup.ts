/**
 * Roda uma vez antes de toda a suíte: garante que o banco de teste existe e
 * está com todas as migrations aplicadas (`prisma migrate deploy` — o mesmo
 * comando da produção, então a suíte também prova que as migrations sobem num
 * banco limpo).
 */
import { execSync } from 'node:child_process';

import pg from 'pg';

import { urlDoBancoDeTeste } from './banco';

export default async function prepararBancoDeTeste() {
  const url = urlDoBancoDeTeste();
  const nome = new URL(url).pathname.slice(1);

  const manutencao = new URL(url);
  manutencao.pathname = '/postgres';
  manutencao.search = '';

  const cliente = new pg.Client({ connectionString: manutencao.toString() });
  await cliente.connect();
  try {
    const existe = await cliente.query('SELECT 1 FROM pg_database WHERE datname = $1', [nome]);
    // `nome` já foi validado em urlDoBancoDeTeste (só [a-z0-9_]).
    if (existe.rowCount === 0) await cliente.query(`CREATE DATABASE "${nome}"`);
  } finally {
    await cliente.end();
  }

  execSync('npx prisma migrate deploy', {
    env: { ...process.env, DATABASE_URL: url },
    stdio: 'pipe',
  });
}
