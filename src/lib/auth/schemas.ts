/**
 * Validação dos formulários de autenticação (zod 4).
 *
 * Roda **no servidor**, dentro das Server Actions — nunca confie na validação do
 * navegador, que qualquer pessoa desliga com o DevTools aberto (contrato §5.8).
 * O arquivo não importa Prisma nem `next/headers`, então também pode ser usado
 * no cliente se um dia alguém quiser validação instantânea no formulário.
 *
 * Voz das mensagens: frase completa, em português do Brasil, dizendo o que fazer
 * em vez de acusar o erro. "Informe seu e-mail." e não "Campo obrigatório".
 */
import { z } from 'zod';

// Importado de `constantes.ts` (módulo neutro) e NÃO de `password.ts`: aquele
// arquivo puxa o binário nativo do Argon2, que não existe no navegador.
import { TAMANHO_MAXIMO_SENHA, TAMANHO_MINIMO_SENHA } from '@/lib/auth/constantes';

export { TAMANHO_MINIMO_SENHA, TAMANHO_MAXIMO_SENHA };

/** Limite prático de e-mail (RFC 5321). Acima disso é entrada forjada. */
const TAMANHO_MAXIMO_EMAIL = 254;

/** Nomes reais cabem folgados; o teto evita que o cabeçalho do app vire um parágrafo. */
const TAMANHO_MINIMO_NOME = 2;
const TAMANHO_MAXIMO_NOME = 80;

/**
 * E-mail normalizado: aparado e em minúsculas **antes** de validar.
 *
 * A coluna `User.email` é única e sempre minúscula (contrato §4). Se a
 * normalização ficasse a cargo de quem chama, um dia alguém criaria
 * "Maria@Gmail.com" ao lado de "maria@gmail.com" e teríamos duas contas para a
 * mesma pessoa — com a de cima invisível no login.
 */
const campoEmail = z
  .string({ error: 'Informe seu e-mail.' })
  .trim()
  .toLowerCase()
  .max(TAMANHO_MAXIMO_EMAIL, { error: 'Esse e-mail é longo demais.' })
  .pipe(z.email({ error: 'Esse e-mail não parece completo. Confira e tente de novo.' }));

/**
 * Senha nova (cadastro e redefinição).
 *
 * ⚠️ Sem `.trim()`, de propósito. Espaço no começo ou no fim faz parte da senha:
 * aparar aqui mudaria silenciosamente o que o usuário escolheu, e no login
 * seguinte — validado por outro caminho — a senha "não funcionaria mais".
 */
const campoSenhaNova = z
  .string({ error: 'Crie uma senha.' })
  .min(TAMANHO_MINIMO_SENHA, {
    error: `Sua senha precisa de pelo menos ${TAMANHO_MINIMO_SENHA} caracteres.`,
  })
  .max(TAMANHO_MAXIMO_SENHA, { error: 'Essa senha é longa demais.' });

/**
 * Senha no login: só precisa existir.
 *
 * Nada de exigir 8 caracteres aqui. Recusar uma senha curta antes de conferir
 * conta que ela está errada por um motivo diferente de "não confere" — e, pior,
 * revelaria a regra de senha de contas antigas. Quem digitou errado recebe
 * sempre a mesma resposta.
 */
const campoSenhaLogin = z
  .string({ error: 'Informe sua senha.' })
  .min(1, { error: 'Informe sua senha.' })
  .max(TAMANHO_MAXIMO_SENHA, { error: 'E-mail ou senha incorretos.' });

/** Exportado para o `scripts/renomear-conta.ts` usar a mesma regra do cadastro. */
export const campoNome = z
  .string({ error: 'Informe seu nome.' })
  .trim()
  .min(TAMANHO_MINIMO_NOME, { error: 'Escreva seu nome com pelo menos 2 letras.' })
  .max(TAMANHO_MAXIMO_NOME, { error: 'Esse nome é longo demais.' });

/**
 * Token que chega pela URL (`?token=...`).
 *
 * A conferência de verdade é `consumeVerificationToken()`, no banco. Aqui só
 * barramos o que nem formato tem, para a tela poder dizer "esse link está
 * incompleto" antes de qualquer consulta.
 */
const campoToken = z
  .string({ error: 'Esse link está incompleto. Abra novamente o e-mail que enviamos.' })
  .trim()
  .min(20, { error: 'Esse link está incompleto. Abra novamente o e-mail que enviamos.' })
  .max(200, { error: 'Esse link não parece válido. Peça um novo e-mail.' });

/**
 * Caixa de seleção vinda de `FormData`.
 *
 * Um checkbox marcado chega como a string `"on"`; desmarcado simplesmente **não
 * chega** — a chave nem existe no FormData. Por isso o campo precisa aceitar
 * `undefined` e `null` como "não marcado", e não pode ser um `z.boolean()`.
 *
 * ⚠️ O `.optional()` não é enfeite. No zod 4, um campo que termina em
 * `.transform()` conta como **obrigatório** dentro do objeto: a chave ausente
 * devolve `invalid_type / expected nonoptional` e derruba o formulário inteiro.
 * Sem ele, ninguém conseguiria entrar sem marcar "lembrar-me" — e a mensagem de
 * erro apareceria num campo que o usuário nem vê.
 */
const caixaDeSelecao = z
  .unknown()
  .optional()
  .transform((valor) => valor === true || valor === 'on' || valor === 'true' || valor === '1');

/**
 * Campo opcional de texto: `FormData` inexistente vira `undefined`, não string vazia.
 *
 * ⚠️ Mesmo motivo do `.optional()` acima: sem ele, um formulário sem `next` ou
 * sem `confirmarSenha` seria recusado por uma chave que nem existe na tela.
 */
const textoOpcional = z
  .unknown()
  .optional()
  .transform((valor) => (typeof valor === 'string' && valor.length > 0 ? valor : undefined));

// ---------------------------------------------------------------------------
// Entrar
// ---------------------------------------------------------------------------

/**
 * Tela `/entrar`.
 *
 * `next` entra aqui só para atravessar o formulário; quem decide se ele é um
 * destino aceitável é o `safeNext()` de `next-url.ts`, nunca este schema.
 */
export const entrarSchema = z.object({
  email: campoEmail,
  senha: campoSenhaLogin,
  lembrar: caixaDeSelecao,
  next: textoOpcional,
});

export type EntrarInput = z.infer<typeof entrarSchema>;

// ---------------------------------------------------------------------------
// Criar conta
// ---------------------------------------------------------------------------

/**
 * Tela `/criar-conta` (contrato §7: nome, e-mail, senha, aceite).
 *
 * `confirmarSenha` é opcional: se o formulário renderizar o campo, a conferência
 * acontece; se não renderizar, a chave não existe e o schema segue em frente.
 * Assim o mesmo schema serve às duas decisões de interface.
 */
export const criarContaSchema = z
  .object({
    nome: campoNome,
    email: campoEmail,
    senha: campoSenhaNova,
    confirmarSenha: textoOpcional,
    aceite: caixaDeSelecao.refine((marcado) => marcado, {
      error: 'Para criar sua conta, é preciso aceitar os termos de uso.',
    }),
  })
  .refine(
    (dados) => dados.confirmarSenha === undefined || dados.confirmarSenha === dados.senha,
    { path: ['confirmarSenha'], error: 'As duas senhas precisam ser iguais.' },
  )
  .refine((dados) => dados.senha.toLowerCase().trim() !== dados.email, {
    path: ['senha'],
    error: 'Sua senha não pode ser o seu e-mail. Escolha outra.',
  });

export type CriarContaInput = z.infer<typeof criarContaSchema>;

// ---------------------------------------------------------------------------
// Esqueci minha senha
// ---------------------------------------------------------------------------

/**
 * Tela `/esqueci-senha`.
 *
 * ⚠️ A resposta da ação é sempre a mesma frase, exista o e-mail ou não
 * (contrato §5.5). Nem este schema nem a mensagem de erro podem deixar escapar
 * se a conta existe — por isso aqui só se valida o **formato**.
 */
export const esqueciSenhaSchema = z.object({
  email: campoEmail,
});

export type EsqueciSenhaInput = z.infer<typeof esqueciSenhaSchema>;

// ---------------------------------------------------------------------------
// Redefinir senha
// ---------------------------------------------------------------------------

/** Tela `/redefinir-senha?token=...`. */
export const redefinirSenhaSchema = z
  .object({
    token: campoToken,
    senha: campoSenhaNova,
    confirmarSenha: textoOpcional,
    next: textoOpcional,
  })
  .refine(
    (dados) => dados.confirmarSenha === undefined || dados.confirmarSenha === dados.senha,
    { path: ['confirmarSenha'], error: 'As duas senhas precisam ser iguais.' },
  );

export type RedefinirSenhaInput = z.infer<typeof redefinirSenhaSchema>;

// ---------------------------------------------------------------------------
// Verificar e-mail
// ---------------------------------------------------------------------------

/** Tela `/verificar-email?token=...`. */
export const verificarEmailSchema = z.object({
  token: campoToken,
});

export type VerificarEmailInput = z.infer<typeof verificarEmailSchema>;

// ---------------------------------------------------------------------------
// Ajuda para as Server Actions
// ---------------------------------------------------------------------------

/** Uma mensagem por campo — o formato que o `<Field error={...}>` espera. */
export type ErrosDeCampo = Record<string, string>;

/**
 * Converte um `ZodError` em `{ campo: "primeira mensagem" }`.
 *
 * Só a primeira mensagem de cada campo: mostrar três queixas sobre a mesma
 * caixinha é ruído. Erros sem caminho (os que vêm de um `.refine()` no objeto
 * inteiro) caem em `_form`, que a tela renderiza como aviso geral.
 */
export function errosDeCampo(erro: z.ZodError): ErrosDeCampo {
  const erros: ErrosDeCampo = {};

  for (const problema of erro.issues) {
    const chave = problema.path.length > 0 ? String(problema.path[0]) : '_form';
    if (erros[chave] === undefined) erros[chave] = problema.message;
  }

  return erros;
}

/**
 * Valida um `FormData` contra um schema deste arquivo.
 *
 * Devolve uma união discriminada, para a Server Action poder fazer
 * `if (!resultado.ok) return { erros: resultado.erros }` sem cerimônia.
 *
 * ⚠️ Usa `FormData.get()` (o primeiro valor de cada chave), não `getAll()`.
 * Nenhum formulário de autenticação tem campo repetido, e pegar só o primeiro
 * fecha o truque de mandar `senha` duas vezes para confundir a validação.
 */
export function validarFormulario<Saida>(
  schema: z.ZodType<Saida>,
  formData: FormData,
): { ok: true; dados: Saida } | { ok: false; erros: ErrosDeCampo } {
  const bruto: Record<string, FormDataEntryValue> = {};

  for (const chave of new Set(formData.keys())) {
    const valor = formData.get(chave);
    if (valor !== null) bruto[chave] = valor;
  }

  const resultado = schema.safeParse(bruto);

  if (resultado.success) return { ok: true, dados: resultado.data };
  return { ok: false, erros: errosDeCampo(resultado.error) };
}
