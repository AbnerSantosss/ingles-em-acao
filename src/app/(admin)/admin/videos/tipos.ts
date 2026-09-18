/**
 * O estado que as Server Actions de vídeo devolvem para os formulários.
 *
 * ⚠️ Arquivo **sem** `'use server'` e **sem** Prisma de propósito: ele é
 * importado dos dois lados — pelo componente cliente (`useActionState`) e pela
 * action. Um módulo `'use server'` só pode exportar função assíncrona, e um
 * import de servidor arrastaria o Prisma para o bundle do navegador.
 *
 * É o mesmo formato de `../aulas/tipos.ts`, repetido aqui para as duas áreas
 * não ficarem amarradas uma na outra.
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

// ─────────────────────────── envio de arquivo ────────────────────────────

/** Resposta ao "quero enviar este arquivo": a URL de `PUT` e a chave que o servidor escolheu. */
export type InicioDeEnvio =
  | { ok: true; url: string; chave: string; mime: string }
  | { ok: false; erro: string };

/** Para onde vai o arquivo enviado: o vídeo de uma aula, ou o vídeo padrão. */
export type DestinoDoEnvio = { tipo: 'aula'; id: string } | { tipo: 'padrao' };

/** O aviso de "terminei de enviar" — o servidor confere tudo de novo no bucket. */
export type ConclusaoDoEnvio = {
  chave: string;
  /** Nome original, só para exibir na lista. */
  nome: string;
  destino: DestinoDoEnvio;
  /** Medidas lidas pelo navegador; informativas, não são conferidas. */
  largura?: number | null;
  altura?: number | null;
};
