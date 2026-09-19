/**
 * Server Actions dos vídeos — BACKOFFICE §2.6, §6.3.
 *
 * ⚠️ **Server Actions, não route handlers.** Toda função daqui começa por
 * `requireAdmin()` e termina por `auditar({ action: 'video.change' })`. O
 * layout do painel protege a renderização; uma action é um POST direto e o
 * layout não roda antes dela.
 *
 * Três regras deste arquivo:
 *
 * 1. **Nada entra sem passar pelo `parseVideoSource`.** O que o admin cola vai
 *    virar `<iframe>` na sessão do aluno. A allowlist é a porta, e ela fica em
 *    `@/lib/video/fonte` — não escreva outra aqui.
 * 2. **O painel normaliza a linha.** Ao salvar, `videoKind`/`videoRef` passam a
 *    mandar e a coluna legada `videoUrl` (CONTRACT §4) é zerada. Duas fontes de
 *    verdade para o mesmo vídeo é como a tela do aluno e a do painel começam a
 *    discordar.
 * 3. **Arquivo enviado vai para o bucket, nunca para o volume Docker** (D6,
 *    §4.3). O arquivo não passa por aqui: o navegador pede uma URL assinada
 *    (`iniciarEnvioDeVideoAction`), manda direto ao bucket e avisa ao terminar
 *    (`concluirEnvioDeVideoAction`). Só então — com tamanho, tipo e os
 *    primeiros bytes conferidos **no bucket** — o arquivo vira `MediaAsset` e é
 *    ligado à aula. Trocar ou remover o vídeo não apaga o arquivo: o registro e
 *    o objeto ficam (a regra de "nunca apagamos de verdade" das mídias).
 */
'use server';

import { revalidatePath } from 'next/cache';

import { auditar } from '@/lib/admin/audit';
import { requireAdmin } from '@/lib/admin/guard';
import type { SessionUser } from '@/lib/auth/session';
import { prisma } from '@/lib/db';
import { assinarVideoEnviado, CHAVE_VIDEO_PADRAO, interpretarPadrao } from '@/lib/video/aula';
import {
  apagarObjeto,
  inspecionarObjeto,
  lerConfiguracaoDoBucket,
  novaChaveDeVideo,
  urlDeEnvio,
  type ObjetoNoBucket,
} from '@/lib/video/bucket';
import {
  chaveDeVideoValida,
  conferirArquivoDeVideo,
  formatoPelosBytes,
  FORMATOS_DE_VIDEO,
  TAMANHO_MAXIMO_VIDEO,
  type LinkAssinado,
} from '@/lib/video/envio';
import {
  descreverFonte,
  ehErroDeFonte,
  parseVideoSource,
  refDaFonte,
  tipoDaFonte,
  type VideoSource,
} from '@/lib/video/fonte';

import type {
  ConclusaoDoEnvio,
  ErrosDeCampo,
  EstadoDoFormulario,
  InicioDeEnvio,
} from './tipos';

// ─────────────────────────── utilidades locais ───────────────────────────

const ACAO = 'video.change';

function falha(mensagem: string, campos?: ErrosDeCampo): EstadoDoFormulario {
  return campos ? { estado: 'erro', mensagem, campos } : { estado: 'erro', mensagem };
}

function sucesso(mensagem: string): EstadoDoFormulario {
  return { estado: 'ok', mensagem };
}

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

function erroDeBanco(onde: string, erro: unknown): EstadoDoFormulario {
  const motivo = erro instanceof Error ? erro.message : 'erro desconhecido';
  console.error(`[painel] videos (${onde}): ${motivo}`);
  return falha('O banco de dados não completou a operação. Tente de novo em instantes.');
}

/** O vídeo afeta a tela da aula, a lista do painel e a contagem do dashboard. */
function revalidar(slugs: readonly string[]): void {
  revalidatePath('/admin/videos');
  revalidatePath('/admin/aulas');
  // A aba "Vídeo" de cada aula e a tela de pendências de mídia usam o mesmo editor.
  revalidatePath('/admin/aulas/[numero]', 'page');
  revalidatePath('/admin/midia/pendencias');
  revalidatePath('/admin');
  for (const slug of slugs) revalidatePath(`/aula/${slug}`);
}

type Colunas = { videoKind: 'YOUTUBE' | 'VIMEO' | 'URL' | 'UPLOAD'; videoRef: string };

/**
 * O par que vai para as colunas — e para a auditoria.
 *
 * As actions de link recebem só o que `parseVideoSource` produz (YouTube,
 * Vimeo, URL); `UPLOAD` chega aqui pelo vídeo padrão, que pode ser um arquivo
 * enviado.
 */
function paraColunas(fonte: VideoSource): Colunas {
  return { videoKind: tipoDaFonte(fonte), videoRef: refDaFonte(fonte) };
}

// ───────────────────────────── vídeo da aula ─────────────────────────────

/**
 * Salva o vídeo de uma aula a partir do endereço colado.
 *
 * Campos: `id` (Lesson.id), `fonte` (o que o admin colou).
 */
export async function salvarVideoAction(
  _estado: EstadoDoFormulario,
  dados: FormData,
): Promise<EstadoDoFormulario> {
  const sessao = await autenticar();
  if (!sessao.ok) return sessao.estado;

  const id = texto(dados, 'id');
  if (id === '') return falha('Aula não identificada. Recarregue a página e tente de novo.');

  const bruto = texto(dados, 'fonte');
  const fonte = parseVideoSource(bruto);
  if (ehErroDeFonte(fonte)) return falha(fonte.erro, { fonte: fonte.erro });

  const colunas = paraColunas(fonte);

  try {
    const antes = await prisma.lesson.findUnique({
      where: { id },
      select: { number: true, code: true, slug: true, videoKind: true, videoRef: true, videoUrl: true },
    });
    if (!antes) return falha('Essa aula não existe mais. Recarregue a página.');

    await prisma.lesson.update({
      where: { id },
      data: {
        videoKind: colunas.videoKind,
        videoRef: colunas.videoRef,
        // A coluna legada sai de cena: quem manda agora é o par kind/ref.
        videoUrl: null,
        videoIsDefault: false,
        videoUpdatedAt: new Date(),
      },
    });

    revalidar([antes.slug]);

    await auditar({
      actor: sessao.admin,
      action: ACAO,
      resource: `Lesson:${antes.number}`,
      before: { videoKind: antes.videoKind, videoRef: antes.videoRef, videoUrl: antes.videoUrl },
      after: { ...colunas, videoIsDefault: false },
      reason: `${antes.code}: ${descreverFonte(fonte)}`,
    });

    return sucesso(`Vídeo do ${antes.code} salvo. ${descreverFonte(fonte)}`);
  } catch (erro: unknown) {
    return erroDeBanco('salvar', erro);
  }
}

/**
 * Tira o vídeo da aula.
 *
 * A aula volta a não mostrar painel nenhum para o aluno — não fica um quadro
 * vazio no lugar. Campo: `id`.
 */
export async function removerVideoAction(
  _estado: EstadoDoFormulario,
  dados: FormData,
): Promise<EstadoDoFormulario> {
  const sessao = await autenticar();
  if (!sessao.ok) return sessao.estado;

  const id = texto(dados, 'id');
  if (id === '') return falha('Aula não identificada. Recarregue a página e tente de novo.');

  try {
    const antes = await prisma.lesson.findUnique({
      where: { id },
      select: { number: true, code: true, slug: true, videoKind: true, videoRef: true, videoUrl: true },
    });
    if (!antes) return falha('Essa aula não existe mais. Recarregue a página.');

    if (antes.videoKind === null && antes.videoRef === null && antes.videoUrl === null) {
      return falha(`O ${antes.code} já está sem vídeo.`);
    }

    await prisma.lesson.update({
      where: { id },
      data: {
        videoKind: null,
        videoRef: null,
        videoUrl: null,
        videoIsDefault: false,
        videoUpdatedAt: new Date(),
      },
    });

    revalidar([antes.slug]);

    await auditar({
      actor: sessao.admin,
      action: ACAO,
      resource: `Lesson:${antes.number}`,
      before: { videoKind: antes.videoKind, videoRef: antes.videoRef, videoUrl: antes.videoUrl },
      after: { videoKind: null, videoRef: null, videoUrl: null },
      reason: `${antes.code}: vídeo removido`,
    });

    return sucesso(`Vídeo do ${antes.code} removido. A aula segue sem painel de vídeo.`);
  } catch (erro: unknown) {
    return erroDeBanco('remover', erro);
  }
}

// ───────────────────────────── vídeo padrão ──────────────────────────────

/**
 * Guarda o vídeo padrão em `AppSetting["video.padrao"]`.
 *
 * Guardar não muda aula nenhuma: é o "aplicar" que grava linha a linha.
 * Campo: `fonte`.
 */
export async function salvarPadraoAction(
  _estado: EstadoDoFormulario,
  dados: FormData,
): Promise<EstadoDoFormulario> {
  const sessao = await autenticar();
  if (!sessao.ok) return sessao.estado;

  const fonte = parseVideoSource(texto(dados, 'fonte'));
  if (ehErroDeFonte(fonte)) return falha(fonte.erro, { fonte: fonte.erro });

  const colunas = paraColunas(fonte);
  const valor = { kind: colunas.videoKind, ref: colunas.videoRef };

  try {
    const antes = await prisma.appSetting.findUnique({ where: { key: CHAVE_VIDEO_PADRAO } });

    await prisma.appSetting.upsert({
      where: { key: CHAVE_VIDEO_PADRAO },
      create: { key: CHAVE_VIDEO_PADRAO, value: valor, updatedById: sessao.admin.id },
      update: { value: valor, updatedById: sessao.admin.id },
    });

    revalidatePath('/admin/videos');

    await auditar({
      actor: sessao.admin,
      action: ACAO,
      resource: `AppSetting:${CHAVE_VIDEO_PADRAO}`,
      before: antes?.value ?? null,
      after: valor,
      reason: `vídeo padrão: ${descreverFonte(fonte)}`,
    });

    return sucesso(`Vídeo padrão guardado. ${descreverFonte(fonte)}`);
  } catch (erro: unknown) {
    return erroDeBanco('salvar padrão', erro);
  }
}

/** Apaga o vídeo padrão. Não mexe nas aulas que já o receberam. */
export async function removerPadraoAction(): Promise<EstadoDoFormulario> {
  const sessao = await autenticar();
  if (!sessao.ok) return sessao.estado;

  try {
    const antes = await prisma.appSetting.findUnique({ where: { key: CHAVE_VIDEO_PADRAO } });
    if (!antes) return falha('Não há vídeo padrão guardado.');

    await prisma.appSetting.deleteMany({ where: { key: CHAVE_VIDEO_PADRAO } });

    revalidatePath('/admin/videos');

    await auditar({
      actor: sessao.admin,
      action: ACAO,
      resource: `AppSetting:${CHAVE_VIDEO_PADRAO}`,
      before: antes.value,
      after: null,
      reason: 'vídeo padrão removido',
    });

    return sucesso('Vídeo padrão removido. As aulas que já o receberam continuam como estão.');
  } catch (erro: unknown) {
    return erroDeBanco('remover padrão', erro);
  }
}

/**
 * Copia o vídeo padrão para toda aula **sem configuração nenhuma**.
 *
 * Não encosta em aula que já tem vídeo — nem no que veio da coluna legada. As
 * aulas atingidas ficam marcadas com `videoIsDefault`, e é isso que faz a
 * lista distinguir "padrão" de "configurado".
 */
export async function aplicarPadraoAction(): Promise<EstadoDoFormulario> {
  const sessao = await autenticar();
  if (!sessao.ok) return sessao.estado;

  try {
    const guardado = await prisma.appSetting.findUnique({ where: { key: CHAVE_VIDEO_PADRAO } });
    const fonte = interpretarPadrao(guardado?.value);
    if (!fonte) {
      return falha('Guarde um vídeo padrão válido antes de aplicá-lo às aulas.');
    }

    const colunas = paraColunas(fonte);
    const semVideo = { archivedAt: null, videoKind: null, videoRef: null, videoUrl: null } as const;

    const alvos = await prisma.lesson.findMany({
      where: semVideo,
      select: { number: true, slug: true },
      orderBy: { number: 'asc' },
    });
    if (alvos.length === 0) {
      return falha('Nenhuma aula está sem vídeo. Nada foi alterado.');
    }

    const resultado = await prisma.lesson.updateMany({
      where: semVideo,
      data: {
        videoKind: colunas.videoKind,
        videoRef: colunas.videoRef,
        videoIsDefault: true,
        videoUpdatedAt: new Date(),
      },
    });

    revalidar(alvos.map((aula) => aula.slug));

    await auditar({
      actor: sessao.admin,
      action: ACAO,
      resource: `Lesson:padrao(${resultado.count})`,
      before: { videoKind: null, videoRef: null },
      after: { ...colunas, videoIsDefault: true, aulas: alvos.map((aula) => aula.number) },
      reason: `vídeo padrão aplicado a ${resultado.count} aula(s) sem configuração`,
    });

    return sucesso(
      `Vídeo padrão aplicado a ${resultado.count} aula(s). As que já tinham vídeo ficaram como estavam.`,
    );
  } catch (erro: unknown) {
    return erroDeBanco('aplicar padrão', erro);
  }
}

// ──────────────────────────── envio de arquivo ───────────────────────────

/** A mensagem de um estado de erro — as actions de envio respondem só texto. */
function mensagemDe(estado: EstadoDoFormulario): string {
  return estado.estado === 'inicial' ? '' : estado.mensagem;
}

/** Números que vieram do navegador: inteiro positivo razoável, ou nada. */
function medida(valor: unknown): number | null {
  return typeof valor === 'number' && Number.isInteger(valor) && valor > 0 && valor <= 16_384
    ? valor
    : null;
}

/** O nome original, só para exibir. Nunca vira caminho — a chave é do servidor. */
function nomeParaExibir(nome: unknown, extensao: string): string {
  const limpo =
    typeof nome === 'string' ? nome.replace(/[\u0000-\u001f\u007f]/g, '').trim() : '';
  return limpo === '' ? `video.${extensao}` : limpo.slice(0, 200);
}

/**
 * Passo 1 do envio: confere o que o navegador **declarou** e devolve uma URL
 * assinada de `PUT`, válida por 30 minutos, para uma chave escolhida aqui.
 *
 * Nada é gravado no banco neste passo. Um envio abandonado deixa, no máximo, um
 * objeto sem dono no bucket — nunca uma aula apontando para o vazio.
 */
export async function iniciarEnvioDeVideoAction(arquivo: {
  nome: string;
  mime: string;
  bytes: number;
}): Promise<InicioDeEnvio> {
  const sessao = await autenticar();
  if (!sessao.ok) return { ok: false, erro: mensagemDe(sessao.estado) };

  const conferencia = conferirArquivoDeVideo({
    nome: typeof arquivo?.nome === 'string' ? arquivo.nome : '',
    mime: typeof arquivo?.mime === 'string' ? arquivo.mime : '',
    bytes: typeof arquivo?.bytes === 'number' ? arquivo.bytes : Number.NaN,
  });
  if (!conferencia.ok) return { ok: false, erro: conferencia.erro };

  const leitura = lerConfiguracaoDoBucket();
  if (!leitura.ok) return { ok: false, erro: leitura.problema };

  const chave = novaChaveDeVideo(conferencia.formato);
  return {
    ok: true,
    url: urlDeEnvio(leitura.configuracao, chave, conferencia.formato.mime),
    chave,
    mime: conferencia.formato.mime,
  };
}

/**
 * Passo 2 do envio: o navegador terminou o `PUT`. Aqui vale o que está **no
 * bucket**, não o que foi dito no passo 1 — tamanho, tipo gravado e os
 * primeiros bytes. Arquivo recusado é apagado do bucket na hora.
 *
 * Aprovado, vira `MediaAsset` (VIDEO) e é ligado à aula ou ao vídeo padrão
 * numa transação só, com auditoria `video.change`.
 */
export async function concluirEnvioDeVideoAction(
  pedido: ConclusaoDoEnvio,
): Promise<EstadoDoFormulario> {
  const sessao = await autenticar();
  if (!sessao.ok) return sessao.estado;

  const chave = pedido?.chave;
  if (!chaveDeVideoValida(chave)) {
    return falha('Envio não reconhecido. Escolha o arquivo e envie de novo.');
  }
  const destino = pedido.destino;
  const idDaAula =
    destino?.tipo === 'aula' && typeof destino.id === 'string' && destino.id !== ''
      ? destino.id
      : null;
  if (idDaAula === null && destino?.tipo !== 'padrao') {
    return falha('Não ficou claro para onde vai o vídeo. Recarregue a página e tente de novo.');
  }

  const leitura = lerConfiguracaoDoBucket();
  if (!leitura.ok) return falha(leitura.problema);
  const configuracao = leitura.configuracao;

  const extensao = chave.slice(chave.lastIndexOf('.') + 1);
  const formato = FORMATOS_DE_VIDEO.find((item) => item.ext === extensao);
  if (!formato) return falha('Envio não reconhecido. Escolha o arquivo e envie de novo.');

  let objeto: ObjetoNoBucket;
  try {
    objeto = await inspecionarObjeto(configuracao, chave);
  } catch (erro: unknown) {
    const motivo = erro instanceof Error ? erro.message : 'erro desconhecido';
    console.error(`[painel] videos (conferir envio): ${motivo}`);
    return falha(
      'Não consegui conferir o arquivo no armazenamento agora. Tente concluir de novo em instantes.',
    );
  }
  if (!objeto.existe) {
    return falha('O arquivo não chegou ao armazenamento. Envie de novo.');
  }

  const recusa =
    !Number.isFinite(objeto.bytes) || objeto.bytes <= 0
      ? 'O arquivo chegou vazio ao armazenamento.'
      : objeto.bytes > TAMANHO_MAXIMO_VIDEO
        ? 'O arquivo passou do limite de 500 MB.'
        : objeto.tipo !== formato.mime
          ? 'O arquivo foi gravado com um tipo diferente do anunciado.'
          : formatoPelosBytes(objeto.inicio) !== formato.ext
            ? `O conteúdo do arquivo não é ${formato.rotulo}: a extensão não corresponde ao que está dentro.`
            : null;
  if (recusa) {
    await apagarObjeto(configuracao, chave);
    return falha(`${recusa} Ele foi descartado; nada mudou.`);
  }

  const nome = nomeParaExibir(pedido.nome, formato.ext);
  const dadosDoArquivo = {
    kind: 'VIDEO' as const,
    path: chave,
    filename: nome,
    mime: formato.mime,
    bytes: objeto.bytes,
    width: medida(pedido.largura),
    height: medida(pedido.altura),
    uploadedById: sessao.admin.id,
  };

  try {
    if (idDaAula !== null) {
      const antes = await prisma.lesson.findUnique({
        where: { id: idDaAula },
        select: { number: true, code: true, slug: true, videoKind: true, videoRef: true, videoUrl: true },
      });
      if (!antes) return falha('Essa aula não existe mais. Recarregue a página.');

      const asset = await prisma.$transaction(async (tx) => {
        const registrado = await tx.mediaAsset.upsert({
          where: { path: chave },
          create: dadosDoArquivo,
          update: {},
          select: { id: true },
        });
        await tx.lesson.update({
          where: { id: idDaAula },
          data: {
            videoKind: 'UPLOAD',
            videoRef: registrado.id,
            // A coluna legada sai de cena, como no salvar por link.
            videoUrl: null,
            videoIsDefault: false,
            videoUpdatedAt: new Date(),
          },
        });
        return registrado;
      });

      revalidar([antes.slug]);

      await auditar({
        actor: sessao.admin,
        action: ACAO,
        resource: `Lesson:${antes.number}`,
        before: { videoKind: antes.videoKind, videoRef: antes.videoRef, videoUrl: antes.videoUrl },
        after: { videoKind: 'UPLOAD', videoRef: asset.id, videoIsDefault: false },
        reason: `${antes.code}: arquivo enviado (${nome})`,
      });

      return sucesso(`Vídeo do ${antes.code} salvo: ${nome}.`);
    }

    const antes = await prisma.appSetting.findUnique({ where: { key: CHAVE_VIDEO_PADRAO } });
    const asset = await prisma.$transaction(async (tx) => {
      const registrado = await tx.mediaAsset.upsert({
        where: { path: chave },
        create: dadosDoArquivo,
        update: {},
        select: { id: true },
      });
      const valor = { kind: 'UPLOAD', ref: registrado.id };
      await tx.appSetting.upsert({
        where: { key: CHAVE_VIDEO_PADRAO },
        create: { key: CHAVE_VIDEO_PADRAO, value: valor, updatedById: sessao.admin.id },
        update: { value: valor, updatedById: sessao.admin.id },
      });
      return registrado;
    });

    revalidatePath('/admin/videos');

    await auditar({
      actor: sessao.admin,
      action: ACAO,
      resource: `AppSetting:${CHAVE_VIDEO_PADRAO}`,
      before: antes?.value ?? null,
      after: { kind: 'UPLOAD', ref: asset.id },
      reason: `vídeo padrão: arquivo enviado (${nome})`,
    });

    return sucesso(`Vídeo padrão guardado: ${nome}.`);
  } catch (erro: unknown) {
    return erroDeBanco('concluir envio', erro);
  }
}

/**
 * Link de 15 minutos para a pré-visualização do painel.
 *
 * O painel usa o mesmo player do aluno (`VideoAssinado`), que chama isto ao
 * montar e quando o link vence.
 */
export async function urlDoVideoEnviadoAction(assetId: string): Promise<LinkAssinado | null> {
  const sessao = await autenticar();
  if (!sessao.ok || typeof assetId !== 'string') return null;
  return assinarVideoEnviado(assetId);
}
