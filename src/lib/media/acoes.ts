/**
 * Server Actions da biblioteca de mídia — BACKOFFICE §2.8 e §4.
 *
 * ⚠️ **Server Actions, não route handler.** Enviar um arquivo é mutação; o que a
 * §4.3 manda criar em `/api` é só a **leitura** (`GET /midia/[...path]`), que
 * precisa responder bytes com cabeçalho próprio. Toda função daqui começa por
 * `requireAdmin()` — o layout do painel protege a renderização, não o POST de
 * uma action — e termina por `auditar()`.
 *
 * ## Por que estas actions moram em `src/lib/media/` e não ao lado da tela
 *
 * Duas telas as usam: `/admin/midia` e o {@link SeletorDeMidia}, que vive em
 * `src/components/admin/` porque o editor de blocos (outro agente) vai montá-lo
 * dentro do formulário de bloco e no campo de capa. Uma action importada por um
 * componente compartilhado não pode morar dentro da pasta de uma rota.
 *
 * > ⚠️ **Limite de corpo de Server Action.** O Next aceita, por padrão, 1 MB por
 * > Server Action — abaixo dos 5 MB que a §4.3 permite por imagem. Por isso o
 * > `next.config.ts` declara `experimental.serverActions.bodySizeLimit: '6mb'`
 * > (5 MB da imagem + folga do multipart). Se esse número mudar, mude junto
 * > {@link TAMANHO_MAXIMO_IMAGEM}: acima do limite do runtime o arquivo é recusado
 * > **antes** desta action rodar, e o erro aparece como falha de rede.
 *
 * As especificações mostradas antes de cada envio (formatos, tamanho, proporção,
 * peso alvo) saem de `./especificacoes`, que lê as mesmas constantes daqui.
 */
'use server';

import { revalidatePath } from 'next/cache';

import { auditar } from '@/lib/admin/audit';
import { requireAdmin } from '@/lib/admin/guard';
import type { SessionUser } from '@/lib/auth/session';
import { prisma } from '@/lib/db';

import { armazenamentoDeMidia } from './armazenamento';
import { carregarMidia, listarAcervoDeImagens } from './consultas';
import {
  FORMATO_SUGERIDO_IMAGEM,
  PESO_ALVO_IMAGEM,
  avisosDaImagem,
  lerAlvoDeImagem,
} from './especificacoes';
import {
  FORMATOS_EM_TEXTO,
  TAMANHO_MAXIMO_IMAGEM,
  formatarBytes,
  urlDoCaminho,
  type ErrosDeCampo,
  type EstadoDoFormulario,
  type MidiaDaBiblioteca,
  type MidiaSelecionada,
} from './tipos';
import {
  conferirImagem,
  esquemaDeAlt,
  esquemaDeNome,
  gerarNomeDeArquivo,
  nomeParaExibir,
} from './validacao';

// ─────────────────────────── utilidades locais ───────────────────────────────

function falha(mensagem: string, campos?: ErrosDeCampo): EstadoDoFormulario {
  return campos ? { estado: 'erro', mensagem, campos } : { estado: 'erro', mensagem };
}

function sucesso(mensagem: string): EstadoDoFormulario {
  return { estado: 'ok', mensagem };
}

/** `requireAdmin()` com a recusa virando estado de formulário (nunca redirect num POST). */
async function autenticar(): Promise<
  { ok: true; admin: SessionUser } | { ok: false; estado: EstadoDoFormulario }
> {
  try {
    return { ok: true, admin: await requireAdmin() };
  } catch {
    return {
      ok: false,
      estado: falha(
        'Sua sessão administrativa não vale mais. Recarregue a página e entre de novo.',
      ),
    };
  }
}

function texto(dados: FormData, campo: string): string {
  const valor = dados.get(campo);
  return typeof valor === 'string' ? valor.trim() : '';
}

/**
 * Erro inesperado vira texto para o admin e linha no log do servidor.
 * Nada de dado pessoal no log: aqui só circulam id de asset e mensagem técnica.
 */
function erroInesperado(onde: string, erro: unknown): EstadoDoFormulario {
  const motivo = erro instanceof Error ? erro.message : 'erro desconhecido';
  console.error(`[painel] mídia (${onde}): ${motivo}`);
  return falha('A operação não foi concluída. Tente de novo em instantes.');
}

/** As telas que mostram mídia. A do aluno lê `src` do conteúdo publicado. */
function revalidar(): void {
  revalidatePath('/admin/midia');
}

// ──────────────────────────────── enviar ─────────────────────────────────────

type ImagemRegistrada = {
  src: string;
  alt: string;
  nome: string;
  bytes: number;
  width: number | null;
  height: number | null;
};

/**
 * O miolo do envio, comum à tela da biblioteca e ao seletor dos blocos.
 *
 * A ordem importa: **conferir os bytes → gravar o arquivo → gravar o registro**.
 * Se o registro falhar, o arquivo recém-escrito é removido; um arquivo órfão no
 * volume é invisível para todo mundo e nunca mais seria referenciado.
 *
 * ⚠️ Toda recusa repete a especificação violada (limite, formatos) — o texto sai
 * das mesmas constantes que a conferência usa.
 */
async function registrarImagem(
  admin: SessionUser,
  dados: FormData,
): Promise<{ ok: true; imagem: ImagemRegistrada } | { ok: false; estado: EstadoDoFormulario }> {
  const arquivo = dados.get('arquivo');
  if (!(arquivo instanceof File) || arquivo.size === 0) {
    return {
      ok: false,
      estado: falha(
        `Escolha um arquivo de imagem (${FORMATOS_EM_TEXTO}, até ${formatarBytes(TAMANHO_MAXIMO_IMAGEM)}).`,
        { arquivo: 'Nenhum arquivo selecionado.' },
      ),
    };
  }

  // Barreira barata antes de ler o arquivo inteiro na memória.
  if (arquivo.size > TAMANHO_MAXIMO_IMAGEM) {
    return {
      ok: false,
      estado: falha(
        `A imagem tem ${formatarBytes(arquivo.size)} e o limite é ` +
          `${formatarBytes(TAMANHO_MAXIMO_IMAGEM)} (${FORMATOS_EM_TEXTO}). ` +
          `O peso alvo é de até ${formatarBytes(PESO_ALVO_IMAGEM)}: exporte em ${FORMATO_SUGERIDO_IMAGEM}.`,
        { arquivo: `Arquivo grande demais (limite ${formatarBytes(TAMANHO_MAXIMO_IMAGEM)}).` },
      ),
    };
  }

  const alt = esquemaDeAlt.safeParse(dados.get('alt') ?? '');
  if (!alt.success) {
    return {
      ok: false,
      estado: falha('Confira os campos marcados.', {
        alt: alt.error.issues[0]?.message ?? 'Texto alternativo inválido.',
      }),
    };
  }

  const bytes = new Uint8Array(await arquivo.arrayBuffer());

  // ⚠️ Tipo pelos bytes, nunca por `arquivo.type` (o navegador manda o que quer)
  // nem pela extensão do nome (quem envia escolhe).
  const conferencia = conferirImagem(bytes);
  if (!conferencia.ok) {
    return {
      ok: false,
      estado: falha(conferencia.mensagem, {
        arquivo: `Arquivo recusado: só ${FORMATOS_EM_TEXTO}, até ${formatarBytes(TAMANHO_MAXIMO_IMAGEM)}.`,
      }),
    };
  }

  const { mime, ext, width, height } = conferencia.imagem;
  const armazenamento = armazenamentoDeMidia();
  const nomeExibido = nomeParaExibir(arquivo.name, ext);

  let salvo: { path: string; bytes: number } | null = null;

  try {
    // O nome do arquivo é gerado aqui (`<uuid>.<ext>`); o nome enviado nunca
    // vira caminho.
    salvo = await armazenamento.salvar(bytes, gerarNomeDeArquivo(ext), mime);

    const criado = await prisma.mediaAsset.create({
      data: {
        kind: 'IMAGE',
        path: salvo.path,
        filename: nomeExibido,
        mime,
        bytes: salvo.bytes,
        width,
        height,
        alt: alt.data,
        uploadedById: admin.id,
      },
      select: { id: true, path: true, filename: true, mime: true, bytes: true },
    });

    await auditar({
      actor: admin,
      action: 'media.upload',
      resource: `MediaAsset:${criado.id}`,
      after: criado,
    });

    revalidar();
    return {
      ok: true,
      imagem: {
        src: urlDoCaminho(criado.path),
        alt: alt.data,
        nome: nomeExibido,
        bytes: criado.bytes,
        width,
        height,
      },
    };
  } catch (erro: unknown) {
    if (salvo) {
      // Compensação: o registro não existe, então o arquivo não pode ficar.
      try {
        await armazenamento.remover(salvo.path);
      } catch (erroDaLimpeza: unknown) {
        const motivo =
          erroDaLimpeza instanceof Error ? erroDaLimpeza.message : 'erro desconhecido';
        console.error(`[painel] mídia (limpeza após falha de registro): ${motivo}`);
      }
    }
    return { ok: false, estado: erroInesperado('enviar', erro) };
  }
}

/** Envia uma imagem para a biblioteca (tela `/admin/midia`). */
export async function enviarMidiaAction(
  _estado: EstadoDoFormulario,
  dados: FormData,
): Promise<EstadoDoFormulario> {
  const sessao = await autenticar();
  if (!sessao.ok) return sessao.estado;

  const resultado = await registrarImagem(sessao.admin, dados);
  if (!resultado.ok) return resultado.estado;

  const { imagem } = resultado;
  const alvo = lerAlvoDeImagem(dados.get('uso'));
  const avisos = alvo
    ? avisosDaImagem(alvo, { width: imagem.width, height: imagem.height, bytes: imagem.bytes })
    : [];
  return sucesso([`"${imagem.nome}" entrou na biblioteca.`, ...avisos].join(' '));
}

export type RespostaDoEnvioDoSeletor =
  | { ok: true; midia: MidiaSelecionada; nome: string; avisos: string[] }
  | { ok: false; mensagem: string; campos?: ErrosDeCampo };

/**
 * Envia uma imagem **de dentro do seletor** (bloco de ilustração, cartão, passo,
 * perfil, capa) e já a devolve escolhida — sem sair do editor e sem perder o
 * rascunho do bloco.
 *
 * O campo `uso` diz para onde a imagem vai (`ilustracao`, `cartao`, `perfil`,
 * `capa`); com ele, a resposta traz avisos de proporção, dimensão mínima e peso
 * alvo lidos do arquivo de verdade. Avisos não bloqueiam: a imagem entra.
 */
export async function enviarImagemDoSeletorAction(
  dados: FormData,
): Promise<RespostaDoEnvioDoSeletor> {
  const sessao = await autenticar();
  if (!sessao.ok) {
    return { ok: false, mensagem: 'Sua sessão administrativa não vale mais. Recarregue a página.' };
  }

  const resultado = await registrarImagem(sessao.admin, dados);
  if (!resultado.ok) {
    const estado = resultado.estado;
    return estado.estado === 'erro'
      ? { ok: false, mensagem: estado.mensagem, campos: estado.campos }
      : { ok: false, mensagem: 'A imagem não foi enviada.' };
  }

  const { imagem } = resultado;
  const alvo = lerAlvoDeImagem(dados.get('uso'));
  return {
    ok: true,
    midia: { src: imagem.src, alt: imagem.alt },
    nome: imagem.nome,
    avisos: alvo
      ? avisosDaImagem(alvo, { width: imagem.width, height: imagem.height, bytes: imagem.bytes })
      : [],
  };
}

// ──────────────────────────────── editar ─────────────────────────────────────

/**
 * Salva o texto alternativo e o nome exibido.
 *
 * ⚠️ `alt` continua **obrigatório** aqui: a tela existe justamente para tirar os
 * assets da lista de "sem alt", e não faz sentido uma edição poder esvaziá-lo.
 * O caminho do arquivo não é editável — nunca foi, e é isso que garante que
 * `MediaAsset.path` só contenha o que o servidor gerou.
 */
export async function salvarMidiaAction(
  _estado: EstadoDoFormulario,
  dados: FormData,
): Promise<EstadoDoFormulario> {
  const sessao = await autenticar();
  if (!sessao.ok) return sessao.estado;

  const id = texto(dados, 'id');
  if (id.length === 0) return falha('Imagem não identificada. Recarregue a página.');

  const alt = esquemaDeAlt.safeParse(dados.get('alt') ?? '');
  const nome = esquemaDeNome.safeParse(dados.get('filename') ?? '');

  if (!alt.success || !nome.success) {
    const campos: Record<string, string> = {};
    if (!alt.success) campos.alt = alt.error.issues[0]?.message ?? 'Texto alternativo inválido.';
    if (!nome.success) campos.filename = nome.error.issues[0]?.message ?? 'Nome inválido.';
    return falha('Confira os campos marcados.', campos);
  }

  try {
    const antes = await prisma.mediaAsset.findUnique({
      where: { id },
      select: { id: true, alt: true, filename: true },
    });
    if (!antes) return falha('Esta imagem não existe mais. Recarregue a página.');

    const depois = await prisma.mediaAsset.update({
      where: { id },
      data: { alt: alt.data, filename: nome.data },
      select: { id: true, alt: true, filename: true },
    });

    await auditar({
      actor: sessao.admin,
      action: 'media.update',
      resource: `MediaAsset:${id}`,
      before: antes,
      after: depois,
    });

    revalidar();
    return sucesso('Alterações salvas.');
  } catch (erro: unknown) {
    return erroInesperado('salvar', erro);
  }
}

// ───────────────────────── arquivar e restaurar ──────────────────────────────

/**
 * Arquiva uma imagem — e **recusa** quando ela está em uso (§2.8).
 *
 * ⚠️ A checagem é aqui, no servidor. O botão desabilitado na tela é
 * conveniência: quem chamar a action direto recebe a mesma recusa, com a lista
 * de onde a imagem aparece. Sem isto, arquivar uma capa em uso deixa a Aula 06
 * com um quadrado cinza em produção e ninguém fica sabendo.
 *
 * Nada é apagado de verdade (decisão D8): `archivedAt` e pronto. O arquivo
 * continua no volume — restaurar é uma linha, e uma imagem some de vez só num
 * procedimento manual e deliberado.
 */
export async function arquivarMidiaAction(
  _estado: EstadoDoFormulario,
  dados: FormData,
): Promise<EstadoDoFormulario> {
  const sessao = await autenticar();
  if (!sessao.ok) return sessao.estado;

  const id = texto(dados, 'id');
  if (id.length === 0) return falha('Imagem não identificada. Recarregue a página.');

  const motivo = texto(dados, 'motivo');

  try {
    const item = await carregarMidia(id);
    if (!item) return falha('Esta imagem não existe mais. Recarregue a página.');
    if (item.arquivadoEm !== null) return falha('Esta imagem já está arquivada.');

    if (item.usos.length > 0) {
      const onde = item.usos
        .slice(0, 8)
        .map((uso) => uso.descricao)
        .join('; ');
      const resto = item.usos.length > 8 ? ` e mais ${item.usos.length - 8}` : '';

      await auditar({
        actor: sessao.admin,
        action: 'media.archive',
        resource: `MediaAsset:${id}`,
        outcome: 'DENY',
        reason: `bloqueado: ${item.usos.length} uso(s) no conteúdo`,
      });

      return falha(
        `Esta imagem está em uso em ${item.usos.length} lugar(es): ${onde}${resto}. ` +
          'Troque a imagem nesses lugares antes de arquivar.',
      );
    }

    const depois = await prisma.mediaAsset.update({
      where: { id },
      data: { archivedAt: new Date() },
      select: { id: true, archivedAt: true },
    });

    await auditar({
      actor: sessao.admin,
      action: 'media.archive',
      resource: `MediaAsset:${id}`,
      before: { archivedAt: null, filename: item.filename },
      after: depois,
      reason: motivo || undefined,
    });

    revalidar();
    return sucesso(`"${item.filename}" foi arquivada. Nada foi apagado e dá para restaurar.`);
  } catch (erro: unknown) {
    return erroInesperado('arquivar', erro);
  }
}

export async function restaurarMidiaAction(
  _estado: EstadoDoFormulario,
  dados: FormData,
): Promise<EstadoDoFormulario> {
  const sessao = await autenticar();
  if (!sessao.ok) return sessao.estado;

  const id = texto(dados, 'id');
  if (id.length === 0) return falha('Imagem não identificada. Recarregue a página.');

  try {
    const antes = await prisma.mediaAsset.findUnique({
      where: { id },
      select: { id: true, filename: true, archivedAt: true },
    });
    if (!antes) return falha('Esta imagem não existe mais. Recarregue a página.');
    if (antes.archivedAt === null) return falha('Esta imagem não está arquivada.');

    const depois = await prisma.mediaAsset.update({
      where: { id },
      data: { archivedAt: null },
      select: { id: true, archivedAt: true },
    });

    await auditar({
      actor: sessao.admin,
      action: 'media.restore',
      resource: `MediaAsset:${id}`,
      before: antes,
      after: depois,
    });

    revalidar();
    return sucesso(`"${antes.filename}" voltou para a biblioteca.`);
  } catch (erro: unknown) {
    return erroInesperado('restaurar', erro);
  }
}

// ──────────────────────────── leitura do seletor ─────────────────────────────

export type RespostaDoAcervo =
  | { ok: true; itens: MidiaDaBiblioteca[] }
  | { ok: false; mensagem: string };

/**
 * O acervo de imagens para o {@link SeletorDeMidia}.
 *
 * É leitura — e leitura, por padrão, mora em Server Component. A exceção existe
 * porque o seletor abre **dentro** de um editor de blocos que é cliente: sem
 * isto, escolher uma imagem recém-enviada exigiria recarregar a página inteira,
 * perdendo o rascunho do bloco. Continua atrás de `requireAdmin()`.
 */
export async function buscarAcervoAction(busca: string): Promise<RespostaDoAcervo> {
  const sessao = await autenticar();
  if (!sessao.ok) {
    return { ok: false, mensagem: 'Sua sessão administrativa não vale mais. Recarregue a página.' };
  }

  try {
    return { ok: true, itens: await listarAcervoDeImagens(busca) };
  } catch (erro: unknown) {
    const motivo = erro instanceof Error ? erro.message : 'erro desconhecido';
    console.error(`[painel] mídia (acervo): ${motivo}`);
    return { ok: false, mensagem: 'A biblioteca não pôde ser carregada agora.' };
  }
}
