/**
 * Validação das variáveis de ambiente do "WSA English".
 *
 * ⚠️ MÓDULO DE SERVIDOR. Nunca importe este arquivo a partir de um componente
 * `'use client'`: ele expõe segredos (SMTP) e quebraria o bundle do navegador.
 * O pacote `server-only` — que transformaria esse erro em erro de compilação —
 * ainda não está instalado neste projeto, então o aviso fica por conta deste
 * comentário. Se ele for instalado, basta acrescentar `import 'server-only'` acima.
 *
 * Nenhum valor de variável é impresso em log ou em mensagem de erro: as mensagens
 * citam apenas o NOME da variável e o que se espera dela.
 */
import { z } from 'zod';

/** Texto obrigatório, sem espaços nas pontas. */
function obrigatorio(descricao: string) {
  const mensagem = `ausente ou vazia: ${descricao}`;
  return z.string({ error: mensagem }).trim().min(1, mensagem);
}

const VERDADEIROS = new Set(['true', '1', 'yes', 'y', 'sim', 'on']);
const FALSOS = new Set(['false', '0', 'no', 'n', 'nao', 'não', 'off']);

/** Booleano vindo de texto. `Boolean("false")` é `true`, por isso não usamos z.coerce.boolean(). */
function booleanoDeTexto(descricao: string, padrao: boolean) {
  return z
    .string({ error: `ausente: ${descricao}` })
    .trim()
    .transform((valor, ctx): boolean => {
      const normalizado = valor.toLowerCase();
      if (VERDADEIROS.has(normalizado)) return true;
      if (FALSOS.has(normalizado)) return false;
      ctx.addIssue({ code: 'custom', message: `use "true" ou "false" (${descricao})` });
      return z.NEVER;
    })
    .or(z.undefined().transform(() => padrao));
}

const esquemaEnv = z.object({
  DATABASE_URL: obrigatorio('string de conexão do PostgreSQL').refine(
    (valor) => valor.startsWith('postgres://') || valor.startsWith('postgresql://'),
    { message: 'deve começar com postgresql:// (ou postgres://)' },
  ),

  APP_URL: z
    .url({ error: 'ausente ou inválida: URL pública do app, ex.: https://app.exemplo.com' })
    // Sem barra no fim: os links de e-mail são montados como `${APP_URL}/redefinir-senha`.
    .transform((valor) => valor.replace(/\/+$/, '')),

  SMTP_HOST: obrigatorio('servidor SMTP, ex.: smtp.gmail.com'),

  SMTP_PORT: z.coerce
    .number({ error: 'ausente ou não numérica: porta do servidor SMTP, ex.: 465' })
    .int('deve ser um número inteiro')
    .min(1, 'deve estar entre 1 e 65535')
    .max(65535, 'deve estar entre 1 e 65535'),

  SMTP_SECURE: booleanoDeTexto('TLS implícito (true na porta 465, false na 587)', true),

  SMTP_USER: obrigatorio('usuário/conta do SMTP'),

  SMTP_PASSWORD: obrigatorio('senha de app do SMTP'),

  MAIL_FROM: obrigatorio('remetente dos e-mails, ex.: WSA English <conta@exemplo.com>'),

  NODE_ENV: z
    .enum(['development', 'test', 'production'], {
      error: 'use "development", "test" ou "production"',
    })
    .default('development'),
});

const resultado = esquemaEnv.safeParse(process.env);

if (!resultado.success) {
  const problemas = resultado.error.issues
    .map((problema) => `  • ${problema.path.join('.') || '(raiz)'}: ${problema.message}`)
    .sort()
    .join('\n');

  throw new Error(
    'Variáveis de ambiente inválidas ou ausentes:\n' +
      `${problemas}\n\n` +
      'Confira o arquivo .env na raiz de app-web. ' +
      'Por segurança, nenhum valor é exibido aqui.',
  );
}

/** Variáveis de ambiente já validadas e tipadas. */
export const env = resultado.data;

export type Env = typeof env;

export const isProducao = env.NODE_ENV === 'production';
export const isDesenvolvimento = env.NODE_ENV === 'development';
