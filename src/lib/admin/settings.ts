/**
 * As configurações do app — BACKOFFICE §2.9.
 *
 * ⚠️ MÓDULO DE SERVIDOR (importa o Prisma). Nunca importe de um `'use client'`.
 *
 * `AppSetting` é chave/valor com a coluna `value` em `Json`, o que significa que
 * o banco aceita qualquer coisa ali dentro — inclusive o formato de ontem, o
 * `null` de um seed pela metade e o objeto que alguém gravou na mão com `psql`.
 *
 * ⚠️ **Json cru não chega na tela.** Toda leitura passa por um `safeParse` do
 * zod e cai num padrão quando não bate, acumulando um aviso em
 * {@link Configuracoes.avisos} para o admin ver que aquele valor está torto —
 * em vez de a tela quebrar ou, pior, um `link.global` `undefined` virar
 * `href="undefined"` num botão de compra.
 *
 * ⚠️ **Nenhuma credencial mora aqui.** O estado do e-mail é derivado do
 * ambiente na hora de desenhar a tela: modo e remetente, só. `SMTP_PASSWORD`
 * não é lido, não é copiado e não é devolvido por action nenhuma — nem
 * mascarado (§2.9).
 *
 * ## Quem escreve o quê
 *
 * Esta tela **grava** duas chaves: o link de checkout e o aviso de manutenção.
 * As outras duas coisas que a §2.9 lista aparecem aqui **só para leitura**, e
 * de propósito:
 *
 * - **Vídeo padrão** (`video.padrao`) é gravado pela área de vídeos
 *   (`/admin/videos`, `@/lib/video/aula`), no formato `{ kind, ref }` que o
 *   player entende. Uma segunda tela gravando a mesma chave em outro formato
 *   apagaria o vídeo padrão de todas as aulas sem erro nenhum. Aqui ele é lido
 *   pelo mesmo `interpretarPadrao` do player e a tela aponta para onde se edita.
 * - **Allowlist de embed** é fixa no MVP (`@/lib/video/csp`): ela vira o
 *   `frame-src` do CSP, e cabeçalho não muda em runtime. Um host acrescentado
 *   por esta tela seria aceito pelo painel e bloqueado pelo navegador — "salvou,
 *   e o aluno vê um retângulo vazio". Enquanto o cabeçalho não nascer dinâmico,
 *   a tela mostra a lista que vale e diz que mudá-la exige deploy.
 *
 * As escritas ficam nas Server Actions de
 * `src/app/(admin)/admin/configuracoes/actions.ts`, atrás de `requireAdmin()` e
 * passando por `auditar()`.
 */
import type { Plan, Prisma } from '@prisma/client';
import { z } from 'zod';

import { prisma } from '@/lib/db';
import { ambienteDeEmail } from '@/lib/mail/transport';
import { CHAVE_VIDEO_PADRAO, interpretarPadrao } from '@/lib/video/aula';
import { HOSTS_ACEITOS, ORIGENS_LIBERADAS, descreverFonte, linkPublico } from '@/lib/video/fonte';

// ───────────────────────────────── chaves ────────────────────────────────

export const CHAVE_CHECKOUT = 'checkout.link';
export const CHAVE_MANUTENCAO = 'manutencao.aviso';
/** Reexportada para a tela: a dona da chave é a área de vídeos. */
export const CHAVE_VIDEO = CHAVE_VIDEO_PADRAO;

/** Todas as chaves que esta tela mostra. */
export const CHAVES = [CHAVE_CHECKOUT, CHAVE_VIDEO, CHAVE_MANUTENCAO] as const;

export type ChaveDeConfiguracao = (typeof CHAVES)[number];

/** As chaves que **esta** tela grava. */
export type ChaveEditavel = typeof CHAVE_CHECKOUT | typeof CHAVE_MANUTENCAO;

// ───────────────────────────────── tipos ─────────────────────────────────

/** Link de checkout global e, opcionalmente, um por plano. */
export type LinksDeCheckout = {
  global: string | null;
  porPlano: Record<Plan, string | null>;
};

/** O vídeo que as aulas sem vídeo próprio recebem — só leitura aqui. */
export type VideoPadrao = {
  configurado: boolean;
  /** "YouTube · abc123", para a tela. */
  descricao: string | null;
  /** Endereço para conferir em outra aba. */
  link: string | null;
};

/** A allowlist de embed que vale agora — fixa no MVP, só leitura aqui. */
export type AllowlistDeEmbed = {
  /** Hosts que o painel aceita ao colar um vídeo. */
  hosts: readonly string[];
  /** Origens que o `frame-src` do CSP libera para o navegador. */
  origens: readonly string[];
};

/** Aviso de manutenção da Home do aluno. */
export type AvisoDeManutencao = {
  ligado: boolean;
  texto: string;
};

/** O que a tela mostra sobre o e-mail. Sem credencial, por definição. */
export type EstadoDoEmail = {
  configurado: boolean;
  modo: 'smtp' | 'simulado';
  remetente: string;
};

export type Configuracoes = {
  checkout: LinksDeCheckout;
  video: VideoPadrao;
  allowlist: AllowlistDeEmbed;
  manutencao: AvisoDeManutencao;
  /** Quando cada chave foi mexida pela última vez. */
  atualizadoEm: Record<ChaveDeConfiguracao, Date | null>;
  /** Valores tortos encontrados no banco, em PT-BR, para a tela avisar. */
  avisos: string[];
};

/** O valor tipado de cada chave gravável — usado por {@link gravarConfiguracao}. */
type ValorPorChave = {
  [CHAVE_CHECKOUT]: LinksDeCheckout;
  [CHAVE_MANUTENCAO]: AvisoDeManutencao;
};

// ──────────────────────────────── padrões ────────────────────────────────

const CHECKOUT_VAZIO: LinksDeCheckout = {
  global: null,
  porPlano: { ESSENCIAL: null, COMPLETO: null, PREMIUM: null },
};

const MANUTENCAO_DESLIGADA: AvisoDeManutencao = { ligado: false, texto: '' };

// ──────────────────────────────── validação ──────────────────────────────

/** Limite de uma URL guardada em configuração. */
export const TAMANHO_MAXIMO_DE_URL = 500;

/** Limite do aviso de manutenção — é um recado, não um artigo. */
export const TAMANHO_MAXIMO_DO_AVISO = 280;

/**
 * Uma URL https de verdade.
 *
 * ⚠️ `https:` obrigatório, e não é frescura de segurança abstrata: o link de
 * checkout é para onde o aluno leva o cartão. `http:` seria a diferença entre um
 * pagamento e um formulário de pagamento no meio do caminho. `javascript:` e
 * `data:` caem aqui também, pelo mesmo teste. Usuário e senha embutidos no
 * endereço também são recusados: link de compra não carrega credencial.
 */
export function analisarUrlHttps(
  bruto: string,
): { ok: true; url: URL } | { ok: false; motivo: string } {
  const texto = bruto.trim();
  if (texto === '') return { ok: false, motivo: 'informe o endereço' };
  if (texto.length > TAMANHO_MAXIMO_DE_URL) {
    return { ok: false, motivo: `o endereço passou de ${TAMANHO_MAXIMO_DE_URL} caracteres` };
  }

  let url: URL;
  try {
    url = new URL(texto);
  } catch {
    return { ok: false, motivo: 'endereço inválido — comece com https://' };
  }

  if (url.protocol !== 'https:') return { ok: false, motivo: 'use um endereço https://' };
  if (url.hostname === '') return { ok: false, motivo: 'endereço sem domínio' };
  if (url.username !== '' || url.password !== '') {
    return { ok: false, motivo: 'o endereço não pode carregar usuário e senha' };
  }

  return { ok: true, url };
}

/**
 * Um campo de link opcional: vazio vira `null` (= "não configurado"), o resto
 * precisa ser https válido.
 */
export function lerLinkOpcional(
  bruto: string,
): { ok: true; link: string | null } | { ok: false; motivo: string } {
  if (bruto.trim() === '') return { ok: true, link: null };
  const analisado = analisarUrlHttps(bruto);
  if (!analisado.ok) return analisado;
  return { ok: true, link: analisado.url.toString() };
}

/** O texto do aviso de manutenção. */
export const esquemaDeAviso = z
  .string()
  .trim()
  .max(TAMANHO_MAXIMO_DO_AVISO, `o aviso passou de ${TAMANHO_MAXIMO_DO_AVISO} caracteres`);

// ──────────────────── leitura do Json guardado no banco ──────────────────

const urlGuardada = z
  .string()
  .trim()
  .max(TAMANHO_MAXIMO_DE_URL)
  .refine((valor) => analisarUrlHttps(valor).ok, 'endereço não é https válido');

const EsquemaCheckout = z.object({
  global: urlGuardada.nullable().optional(),
  porPlano: z
    .object({
      ESSENCIAL: urlGuardada.nullable().optional(),
      COMPLETO: urlGuardada.nullable().optional(),
      PREMIUM: urlGuardada.nullable().optional(),
    })
    .optional(),
});

const EsquemaManutencao = z.object({
  ligado: z.boolean().optional(),
  texto: z.string().max(TAMANHO_MAXIMO_DO_AVISO * 2).optional(),
});

/**
 * Lê uma chave com o padrão como rede.
 *
 * ⚠️ Valor torto **não** derruba a tela: vira padrão + aviso. Uma configuração
 * quebrada precisa ser corrigida na própria tela de configurações, e ela não
 * abriria se o parse jogasse.
 */
function ler<T>(
  bruto: Prisma.JsonValue | undefined,
  esquema: z.ZodType<T>,
  padrao: T,
  rotulo: string,
  avisos: string[],
): T {
  if (bruto === undefined || bruto === null) return padrao;

  const conferido = esquema.safeParse(bruto);
  if (!conferido.success) {
    avisos.push(`${rotulo}: o valor guardado não está no formato esperado e foi ignorado.`);
    return padrao;
  }

  return conferido.data;
}

function checkoutDe(bruto: Prisma.JsonValue | undefined, avisos: string[]): LinksDeCheckout {
  const lido = ler(bruto, EsquemaCheckout, {}, 'Link de checkout', avisos);
  return {
    global: lido.global ?? CHECKOUT_VAZIO.global,
    porPlano: {
      ESSENCIAL: lido.porPlano?.ESSENCIAL ?? null,
      COMPLETO: lido.porPlano?.COMPLETO ?? null,
      PREMIUM: lido.porPlano?.PREMIUM ?? null,
    },
  };
}

function manutencaoDe(bruto: Prisma.JsonValue | undefined, avisos: string[]): AvisoDeManutencao {
  const lido = ler(bruto, EsquemaManutencao, {}, 'Aviso de manutenção', avisos);
  return {
    ligado: lido.ligado ?? MANUTENCAO_DESLIGADA.ligado,
    texto: (lido.texto ?? MANUTENCAO_DESLIGADA.texto).slice(0, TAMANHO_MAXIMO_DO_AVISO),
  };
}

/** O vídeo padrão, lido pelo mesmo `interpretarPadrao` que o player usa. */
function videoDe(bruto: Prisma.JsonValue | undefined, avisos: string[]): VideoPadrao {
  if (bruto === undefined || bruto === null) {
    return { configurado: false, descricao: null, link: null };
  }

  const fonte = interpretarPadrao(bruto);
  if (fonte === null) {
    avisos.push(
      'Vídeo padrão: o valor guardado não é uma fonte de vídeo válida e está sendo ignorado. Corrija em Vídeos.',
    );
    return { configurado: false, descricao: null, link: null };
  }

  return { configurado: true, descricao: descreverFonte(fonte), link: linkPublico(fonte) };
}

// ──────────────────────────────── leituras ───────────────────────────────

/**
 * Todas as configurações, tipadas, numa consulta só.
 *
 * Chave que não existe no banco devolve o padrão — o app funciona sem nenhuma
 * linha em `AppSetting`, que é o estado de uma instalação nova. Falha de banco
 * **propaga**: quem decide o que mostrar sem banco é a tela.
 */
export async function carregarConfiguracoes(): Promise<Configuracoes> {
  const linhas = await prisma.appSetting.findMany({
    where: { key: { in: [...CHAVES] } },
    select: { key: true, value: true, updatedAt: true },
  });

  const porChave = new Map(linhas.map((linha) => [linha.key, linha]));
  const avisos: string[] = [];

  return {
    checkout: checkoutDe(porChave.get(CHAVE_CHECKOUT)?.value, avisos),
    video: videoDe(porChave.get(CHAVE_VIDEO)?.value, avisos),
    allowlist: { hosts: HOSTS_ACEITOS, origens: ORIGENS_LIBERADAS },
    manutencao: manutencaoDe(porChave.get(CHAVE_MANUTENCAO)?.value, avisos),
    atualizadoEm: {
      [CHAVE_CHECKOUT]: porChave.get(CHAVE_CHECKOUT)?.updatedAt ?? null,
      [CHAVE_VIDEO]: porChave.get(CHAVE_VIDEO)?.updatedAt ?? null,
      [CHAVE_MANUTENCAO]: porChave.get(CHAVE_MANUTENCAO)?.updatedAt ?? null,
    },
    avisos,
  };
}

/**
 * Os links de checkout, para os botões de compra do app.
 *
 * ⚠️ **Nunca joga.** Sem banco, devolve "nada configurado" — e aí o botão de
 * compra some, em vez de a tela do aluno cair por causa de um botão.
 */
export async function lerLinksDeCheckout(): Promise<LinksDeCheckout> {
  try {
    const linha = await prisma.appSetting.findUnique({
      where: { key: CHAVE_CHECKOUT },
      select: { value: true },
    });
    return checkoutDe(linha?.value, []);
  } catch (erro: unknown) {
    const motivo = erro instanceof Error ? erro.message : 'erro desconhecido';
    console.error(`[configuracoes] checkout sem banco: seguindo sem link. ${motivo}`);
    return CHECKOUT_VAZIO;
  }
}

/**
 * O aviso de manutenção, para a Home do aluno. Devolve `null` quando está
 * desligado, vazio ou quando o banco não respondeu.
 *
 * ⚠️ **Nunca joga**, pelo mesmo motivo de {@link lerLinksDeCheckout}.
 */
export async function lerAvisoDeManutencao(): Promise<string | null> {
  try {
    const linha = await prisma.appSetting.findUnique({
      where: { key: CHAVE_MANUTENCAO },
      select: { value: true },
    });
    const aviso = manutencaoDe(linha?.value, []);
    return aviso.ligado && aviso.texto !== '' ? aviso.texto : null;
  } catch (erro: unknown) {
    const motivo = erro instanceof Error ? erro.message : 'erro desconhecido';
    console.error(`[configuracoes] aviso de manutenção sem banco: seguindo sem aviso. ${motivo}`);
    return null;
  }
}

/**
 * O link de checkout que um plano deve usar: o do plano, se houver, senão o
 * global. `null` quando nenhum está configurado — e aí o botão de compra
 * **não** aparece, em vez de apontar para lugar nenhum.
 */
export function linkDoPlano(checkout: LinksDeCheckout, plano: Plan): string | null {
  return checkout.porPlano[plano] ?? checkout.global;
}

/** Os links que os botões de compra do app do aluno usam. */
export type LinksDeCompra = { COMPLETO: string | null; PREMIUM: string | null };

/**
 * Os links de compra das telas do aluno, **por plano de destino**: a videoaula
 * vende o Completo, a prática oral vende o Premium, o perfil oferece o degrau
 * seguinte. O campo "Plano Completo" do painel é o checkout de quem quer o
 * Completo — vazio, cai no global; sem global, `null` e o botão não aparece.
 *
 * O Essencial fica de fora: quem está logado já tem, no mínimo, o Essencial.
 *
 * ⚠️ Nunca joga — herda de {@link lerLinksDeCheckout}.
 */
export async function lerLinksDeCompra(): Promise<LinksDeCompra> {
  const checkout = await lerLinksDeCheckout();
  return {
    COMPLETO: linkDoPlano(checkout, 'COMPLETO'),
    PREMIUM: linkDoPlano(checkout, 'PREMIUM'),
  };
}

/**
 * O que a tela mostra sobre o e-mail.
 *
 * ⚠️ Modo e remetente, e nada mais. `SMTP_PASSWORD` não passa por esta função,
 * não é comparado, não é contado e não vira `configurado: true` por estar
 * "preenchido" — quem responde isso é o transporte, olhando o ambiente dele.
 */
export async function estadoDoEmail(): Promise<EstadoDoEmail> {
  const ambiente = await ambienteDeEmail();
  return {
    configurado: ambiente.modo === 'smtp',
    modo: ambiente.modo,
    remetente: ambiente.remetente,
  };
}

// ──────────────────────────────── escrita ────────────────────────────────

/**
 * Grava uma chave e devolve o valor que estava lá antes — é ele que vai para o
 * `before` da auditoria.
 *
 * `updatedById` guarda quem mexeu. A linha nasce se não existir: configuração
 * nunca foi criada por migração, ela aparece no primeiro salvamento.
 *
 * ⚠️ Só aceita as chaves que esta tela é dona ({@link ChaveEditavel}). O vídeo
 * padrão não passa por aqui — ver o cabeçalho do arquivo.
 */
export async function gravarConfiguracao<K extends ChaveEditavel>(
  chave: K,
  valor: ValorPorChave[K],
  adminId: string,
): Promise<{ antes: Prisma.JsonValue | null }> {
  const anterior = await prisma.appSetting.findUnique({
    where: { key: chave },
    select: { value: true },
  });

  await prisma.appSetting.upsert({
    where: { key: chave },
    create: { key: chave, value: valor, updatedById: adminId },
    update: { value: valor, updatedById: adminId },
  });

  return { antes: anterior?.value ?? null };
}

/**
 * O valor anterior de uma chave, já tipado — a action compara com o novo para
 * não gravar (nem mandar alerta) quando nada mudou.
 */
export async function lerCheckoutAtual(): Promise<LinksDeCheckout> {
  const linha = await prisma.appSetting.findUnique({
    where: { key: CHAVE_CHECKOUT },
    select: { value: true },
  });
  return checkoutDe(linha?.value, []);
}

export async function lerManutencaoAtual(): Promise<AvisoDeManutencao> {
  const linha = await prisma.appSetting.findUnique({
    where: { key: CHAVE_MANUTENCAO },
    select: { value: true },
  });
  return manutencaoDe(linha?.value, []);
}
