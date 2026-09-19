/**
 * Server Actions das configurações — BACKOFFICE §2.9 e §6.3.
 *
 * ⚠️ **Server Actions, não route handlers.** Toda função daqui começa por
 * `requireAdmin()` (o layout do painel protege a *renderização*, não o POST de
 * uma action) e termina por `auditar()` com `setting.change`.
 *
 * ⚠️ **Três chaves são gravadas aqui, e só três:** o link de checkout, o aviso
 * de manutenção e o mapa produto→plano do webhook de pagamento. O vídeo padrão
 * é da área de vídeos e a allowlist de embed é fixa no MVP — o porquê está no
 * cabeçalho de `@/lib/admin/settings`.
 *
 * ⚠️ **Link de checkout é a ação mais sensível do painel depois de mexer em
 * aluno**: é para lá que o aluno leva o cartão. Por isso: motivo obrigatório,
 * só `https:`, e alerta por e-mail para todos os admins. Se o e-mail falhar, a
 * troca **fica** — desfazer por causa do SMTP deixaria o produto refém do
 * servidor de e-mail — e a falha vira uma segunda linha de auditoria.
 *
 * ⚠️ Nenhuma action daqui lê, compara ou devolve `SMTP_PASSWORD`.
 */
'use server';

import type { Plan } from '@prisma/client';
import { revalidatePath } from 'next/cache';

import { esquemaDeMotivo } from '@/lib/admin/alunos';
import { auditar } from '@/lib/admin/audit';
import { requireAdmin } from '@/lib/admin/guard';
import {
  CHAVE_CHECKOUT,
  CHAVE_MANUTENCAO,
  CHAVE_PRODUTOS,
  esquemaDeAviso,
  gravarConfiguracao,
  lerCheckoutAtual,
  lerLinkOpcional,
  lerManutencaoAtual,
  type AvisoDeManutencao,
  type LinksDeCheckout,
} from '@/lib/admin/settings';
import type { SessionUser } from '@/lib/auth/session';
import { alertarTrocaDeCheckout, type TrocaDeLink } from '@/lib/mail/admin-alertas';
import {
  MAXIMO_DE_PRODUTOS,
  esquemaDoCodigo,
  esquemaDoPlano,
  lerMapaDeProdutos,
  mapasIguais,
  ordenarMapa,
  paraGravar,
  type ProdutoMapeado,
} from '@/lib/pagamento/produtos';

import type { ErrosDeCampo, EstadoDoFormulario } from './tipos';

// ─────────────────────────── utilidades locais ───────────────────────────

function falha(mensagem: string, campos?: ErrosDeCampo): EstadoDoFormulario {
  return campos ? { estado: 'erro', mensagem, campos } : { estado: 'erro', mensagem };
}

function sucesso(mensagem: string): EstadoDoFormulario {
  return { estado: 'ok', mensagem };
}

/**
 * `requireAdmin()` com a recusa virando estado de formulário.
 *
 * A action não pode redirecionar (um POST respondido com 307 faz o navegador
 * repetir o POST na tela de login), então a sessão vencida vira texto na tela.
 */
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

/** Texto de um campo do formulário, já aparado. */
function texto(dados: FormData, campo: string): string {
  const valor = dados.get(campo);
  return typeof valor === 'string' ? valor.trim() : '';
}

/** Erro inesperado do banco vira texto para o admin e linha no log do servidor. */
function erroDeBanco(onde: string, erro: unknown): EstadoDoFormulario {
  const motivo = erro instanceof Error ? erro.message : 'erro desconhecido';
  console.error(`[painel] configurações (${onde}): ${motivo}`);
  return falha('O banco de dados não completou a operação. Tente de novo em instantes.');
}

/**
 * O checkout e o aviso aparecem fora do painel (botões de compra, Home do
 * aluno), então a revalidação é do app inteiro. Mudança rara; custo aceitável.
 */
function revalidar(): void {
  revalidatePath('/', 'layout');
}

const PLANOS: readonly { plano: Plan; rotulo: string }[] = [
  { plano: 'ESSENCIAL', rotulo: 'Essencial' },
  { plano: 'PREMIUM', rotulo: 'Premium' },
];

// ──────────────────────────── link de checkout ───────────────────────────

/** Os links que mudaram entre o valor guardado e o enviado. */
function trocasEntre(antes: LinksDeCheckout, depois: LinksDeCheckout): TrocaDeLink[] {
  const trocas: TrocaDeLink[] = [];
  if (antes.global !== depois.global) {
    trocas.push({ escopo: 'Global', de: antes.global, para: depois.global });
  }
  for (const { plano, rotulo } of PLANOS) {
    if (antes.porPlano[plano] !== depois.porPlano[plano]) {
      trocas.push({ escopo: rotulo, de: antes.porPlano[plano], para: depois.porPlano[plano] });
    }
  }
  return trocas;
}

/**
 * Salva os links de checkout (global + um por plano, todos opcionais).
 *
 * Campos: `global`, `ESSENCIAL`, `PREMIUM`, `motivo`. Campo vazio
 * significa "sem link" — o plano passa a usar o global e, sem global, o botão
 * de compra some.
 *
 * ⚠️ **Motivo obrigatório** (§6.3) e **alerta por e-mail** (§2.9). Salvar sem
 * mudar nada não grava, não audita e não alerta.
 */
export async function salvarCheckoutAction(
  _estado: EstadoDoFormulario,
  dados: FormData,
): Promise<EstadoDoFormulario> {
  const sessao = await autenticar();
  if (!sessao.ok) return sessao.estado;

  const campos: Record<string, string> = {};

  const global = lerLinkOpcional(texto(dados, 'global'));
  if (!global.ok) campos.global = global.motivo;

  const porPlano: Record<Plan, string | null> = { ESSENCIAL: null, PREMIUM: null };
  for (const { plano } of PLANOS) {
    const lido = lerLinkOpcional(texto(dados, plano));
    if (lido.ok) porPlano[plano] = lido.link;
    else campos[plano] = lido.motivo;
  }

  const motivo = esquemaDeMotivo.safeParse(texto(dados, 'motivo'));
  if (!motivo.success) campos.motivo = motivo.error.issues[0]?.message ?? 'motivo inválido';

  if (!global.ok || !motivo.success || Object.keys(campos).length > 0) {
    return falha('Confira os campos marcados.', campos);
  }

  const novo: LinksDeCheckout = { global: global.link, porPlano };

  try {
    const atual = await lerCheckoutAtual();
    const trocas = trocasEntre(atual, novo);
    if (trocas.length === 0) {
      return falha('Nenhum link mudou. Nada foi gravado.');
    }

    const { antes } = await gravarConfiguracao(CHAVE_CHECKOUT, novo, sessao.admin.id);

    await auditar({
      actor: sessao.admin,
      action: 'setting.change',
      resource: `AppSetting:${CHAVE_CHECKOUT}`,
      before: antes,
      after: novo,
      reason: motivo.data,
    });

    const alerta = await alertarTrocaDeCheckout({
      admin: sessao.admin.email,
      trocas,
      motivo: motivo.data,
    });

    if (!alerta.enviado) {
      // A troca está feita e auditada; o que falhou foi avisar. Isso também é
      // fato auditável — e é `DENY` porque *o alerta* não aconteceu.
      await auditar({
        actor: sessao.admin,
        action: 'setting.change.alert',
        resource: `AppSetting:${CHAVE_CHECKOUT}`,
        outcome: 'DENY',
        after: { destinatarios: alerta.destinatarios, falhas: alerta.falhas },
        reason: alerta.motivo ?? 'alerta não enviado',
      });
    }

    revalidar();
    const quais = trocas.map((troca) => troca.escopo).join(', ');
    return sucesso(
      alerta.enviado
        ? `Link de checkout salvo (${quais}). Alerta enviado para ${alerta.destinatarios} admin(s).`
        : `Link de checkout salvo (${quais}). O alerta por e-mail não saiu (${alerta.motivo ?? 'sem detalhe'}). A troca e a falha estão na auditoria.`,
    );
  } catch (erro: unknown) {
    return erroDeBanco('checkout', erro);
  }
}

// ─────────────────────────── aviso de manutenção ─────────────────────────

/**
 * Liga, desliga ou reescreve o aviso de manutenção da Home do aluno.
 *
 * Campos: `ligado` (checkbox) e `texto`. Não se liga aviso vazio: o aluno veria
 * uma faixa sem nada escrito. Desligar mantém o texto guardado, para religar
 * sem redigitar.
 */
export async function salvarManutencaoAction(
  _estado: EstadoDoFormulario,
  dados: FormData,
): Promise<EstadoDoFormulario> {
  const sessao = await autenticar();
  if (!sessao.ok) return sessao.estado;

  const ligado = dados.get('ligado') === 'on';
  const lido = esquemaDeAviso.safeParse(texto(dados, 'texto'));
  if (!lido.success) {
    const mensagem = lido.error.issues[0]?.message ?? 'aviso inválido';
    return falha('Confira o aviso.', { texto: mensagem });
  }
  if (ligado && lido.data === '') {
    return falha('Escreva o aviso antes de ligá-lo.', {
      texto: 'o aluno veria uma faixa vazia',
    });
  }

  const novo: AvisoDeManutencao = { ligado, texto: lido.data };

  try {
    const atual = await lerManutencaoAtual();
    if (atual.ligado === novo.ligado && atual.texto === novo.texto) {
      return falha('O aviso já está assim. Nada foi gravado.');
    }

    const { antes } = await gravarConfiguracao(CHAVE_MANUTENCAO, novo, sessao.admin.id);

    await auditar({
      actor: sessao.admin,
      action: 'setting.change',
      resource: `AppSetting:${CHAVE_MANUTENCAO}`,
      before: antes,
      after: novo,
    });

    revalidar();
    return sucesso(
      novo.ligado
        ? 'Aviso de manutenção ligado. Ele aparece na Home do aluno.'
        : 'Aviso de manutenção desligado. O texto ficou guardado.',
    );
  } catch (erro: unknown) {
    return erroDeBanco('manutenção', erro);
  }
}

// ───────────────────────── produtos → plano (webhook) ────────────────────

/** Um campo repetido do formulário, na ordem das linhas. */
function textos(dados: FormData, campo: string): string[] {
  return dados.getAll(campo).map((valor) => (typeof valor === 'string' ? valor.trim() : ''));
}

/**
 * Salva o mapa produto→plano que o webhook de pagamento usa
 * (`@/lib/pagamento/produtos`).
 *
 * Campos: `produto` e `plano` repetidos, uma dupla por linha, e `motivo`. Linha
 * com o código vazio é ignorada — é assim que se tira um produto do mapa. Os
 * erros voltam por linha (`produto-<i>`, `plano-<i>`).
 *
 * ⚠️ **É a configuração que decide qual plano um pagamento libera.** Por isso:
 * motivo obrigatório e auditoria com o mapa antes e depois. Salvar sem mudar
 * nada não grava nem audita — a não ser que o valor guardado esteja torto, e aí
 * salvar é justamente o conserto.
 */
export async function salvarProdutosAction(
  _estado: EstadoDoFormulario,
  dados: FormData,
): Promise<EstadoDoFormulario> {
  const sessao = await autenticar();
  if (!sessao.ok) return sessao.estado;

  const codigos = textos(dados, 'produto');
  const planos = textos(dados, 'plano');

  const campos: Record<string, string> = {};
  const novo: ProdutoMapeado[] = [];
  const vistos = new Set<string>();

  codigos.forEach((bruto, indice) => {
    if (bruto === '') return;

    const codigo = esquemaDoCodigo.safeParse(bruto);
    const plano = esquemaDoPlano.safeParse(planos[indice] ?? '');
    if (!codigo.success) {
      campos[`produto-${indice}`] = codigo.error.issues[0]?.message ?? 'código inválido';
    } else if (vistos.has(codigo.data)) {
      campos[`produto-${indice}`] = 'este código já está em outra linha';
    }
    if (!plano.success) {
      campos[`plano-${indice}`] = plano.error.issues[0]?.message ?? 'plano inválido';
    }
    if (codigo.success && plano.success && !vistos.has(codigo.data)) {
      vistos.add(codigo.data);
      novo.push({ codigo: codigo.data, plano: plano.data });
    }
  });

  const motivo = esquemaDeMotivo.safeParse(texto(dados, 'motivo'));
  if (!motivo.success) campos.motivo = motivo.error.issues[0]?.message ?? 'motivo inválido';

  if (!motivo.success || Object.keys(campos).length > 0) {
    return falha('Confira os campos marcados.', campos);
  }
  if (novo.length > MAXIMO_DE_PRODUTOS) {
    return falha(`No máximo ${MAXIMO_DE_PRODUTOS} produtos. Nada foi gravado.`);
  }

  const ordenado = ordenarMapa(novo);

  try {
    const atual = await lerMapaDeProdutos();
    if (atual.valido && mapasIguais(atual.produtos, ordenado)) {
      return falha('Nenhum produto mudou. Nada foi gravado.');
    }

    const valor = paraGravar(ordenado);
    const { antes } = await gravarConfiguracao(CHAVE_PRODUTOS, valor, sessao.admin.id);

    await auditar({
      actor: sessao.admin,
      action: 'setting.change',
      resource: `AppSetting:${CHAVE_PRODUTOS}`,
      before: antes,
      after: valor,
      reason: motivo.data,
    });

    // Só o painel mostra o mapa; o webhook lê do banco a cada evento.
    revalidatePath('/admin/configuracoes');
    return sucesso(
      ordenado.length === 0
        ? 'Mapa salvo sem produtos: nenhum pagamento libera plano até um produto ser mapeado.'
        : `Mapa salvo com ${ordenado.length} produto(s). Vale para o próximo evento que chegar.`,
    );
  } catch (erro: unknown) {
    return erroDeBanco('produtos', erro);
  }
}
