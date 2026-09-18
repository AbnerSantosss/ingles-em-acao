/**
 * O estado que as Server Actions desta área devolvem para os formulários.
 *
 * ⚠️ Fica num arquivo **sem** `'use server'` e **sem** Prisma de propósito: ele é
 * importado dos dois lados — pelo componente cliente (`useActionState`) e pela
 * action — e um `'use server'` só pode exportar função assíncrona, enquanto um
 * import de servidor arrastaria o Prisma para o bundle do navegador.
 */

/** Erros por campo, na chave do `name` do input. */
export type ErrosDeCampo = Readonly<Record<string, string>>;

export type EstadoDoFormulario =
  /** Nada foi enviado ainda. */
  | { estado: 'inicial' }
  /** Deu certo. A mensagem aparece como confirmação. */
  | { estado: 'ok'; mensagem: string }
  /** Não deu. `mensagem` é sempre preenchida — erro é sempre texto (§3). */
  | { estado: 'erro'; mensagem: string; campos?: ErrosDeCampo };

export const FORMULARIO_INICIAL: EstadoDoFormulario = { estado: 'inicial' };
