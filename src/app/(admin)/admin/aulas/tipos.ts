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

// ─────────────────────────────── duplicar ───────────────────────────────

export type EstadoDaDuplicacao =
  | { estado: 'inicial' }
  /** A cópia existe: a tela mostra o link para abrir a aula nova. */
  | { estado: 'ok'; mensagem: string; numero: number; titulo: string }
  | { estado: 'erro'; mensagem: string };

export const DUPLICACAO_INICIAL: EstadoDaDuplicacao = { estado: 'inicial' };

// ──────────────────────── publicar/despublicar em lote ────────────────────────

export type OperacaoDoLote = 'publicar' | 'despublicar';

/** O que aconteceu com uma aula do lote. */
export type LinhaDoRelatorioDoLote = {
  numero: number | null;
  titulo: string;
  desfecho: 'publicada' | 'despublicada' | 'bloqueada';
  motivo: string;
  /** Os primeiros erros de validação, quando foi isso que bloqueou. */
  erros: string[];
  /** Quantos erros havia no total (a lista acima é cortada). */
  totalDeErros: number;
  avisos: number;
};

export type EstadoDoLote =
  | { estado: 'inicial' }
  | { estado: 'erro'; mensagem: string }
  | {
      estado: 'ok';
      mensagem: string;
      operacao: OperacaoDoLote;
      relatorio: LinhaDoRelatorioDoLote[];
    };

export const LOTE_INICIAL: EstadoDoLote = { estado: 'inicial' };
