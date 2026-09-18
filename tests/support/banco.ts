/**
 * Qual banco os testes usam. Regra: a mesma instância do `.env`, mas o banco
 * `<nome>_test` — os testes limpam tabelas, então jamais podem apontar para o
 * banco de desenvolvimento (e muito menos para produção).
 *
 * `TEST_DATABASE_URL` sobrescreve, mas o nome do banco continua obrigado a
 * terminar em `_test`.
 */
export function urlDoBancoDeTeste(): string {
  if (!process.env.DATABASE_URL && typeof process.loadEnvFile === 'function') {
    try {
      process.loadEnvFile();
    } catch {
      // Sem .env: segue para o erro abaixo, que explica o que falta.
    }
  }

  const base = process.env.TEST_DATABASE_URL ?? process.env.DATABASE_URL;
  if (!base) {
    throw new Error('Defina DATABASE_URL (ou TEST_DATABASE_URL) no .env para rodar os testes.');
  }

  const url = new URL(base);
  const nome = url.pathname.replace(/^\//, '');
  // Idempotente: o setup roda em cada worker e pode receber a URL já trocada.
  const nomeDeTeste = nome.endsWith('_test') ? nome : `${nome}_test`;

  if (!/^[a-z0-9_]+_test$/i.test(nomeDeTeste)) {
    throw new Error(`Nome de banco de teste inesperado: "${nomeDeTeste}".`);
  }
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Os testes não rodam com NODE_ENV=production.');
  }

  url.pathname = `/${nomeDeTeste}`;
  return url.toString();
}
