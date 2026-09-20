'use client';

/**
 * Cartões do fim da aula: videoaula e prática com IA (contrato 01, seção 3.4).
 *
 * Videoaula (`icon: 'play'`): comportamento de antes. O botão revela uma
 * mensagem; quem tem o plano e tem o vídeo na tela é levado ao player; quem não
 * tem o plano vê o link de compra do WSA Premium, se houver um configurado.
 *
 * Prática com IA (`icon: 'mic'`): o aluno não conversa dentro do app. O cartão
 * entrega o prompt da aula, montado no servidor (`@/lib/pratica/servidor`), e
 * abre o ChatGPT numa conversa nova com ele. Quatro estados, decididos pela
 * prop `pratica`:
 *   1. prompt pronto, com link: abre o ChatGPT já com o prompt e copia o prompt;
 *   2. prompt pronto, sem link (grande demais para o link): abre o ChatGPT em
 *      branco e copia o prompt, para o aluno colar;
 *   3. `sem-ficha`: "em preparação", sem botão;
 *   4. `sem-plano`: diz que é do WSA Premium e mostra o link de compra.
 *
 * ⚠️ O botão principal é síncrono de propósito: `window.open` vem PRIMEIRO,
 * dentro do toque, sem nenhum `await` antes. Qualquer espera antes dele faz o
 * bloqueador de pop-up barrar o ChatGPT. Por isso o prompt chega pronto por
 * prop, e não por Server Action nem por `fetch` no clique.
 *
 * Os textos da prática são fixos (contrato 3.4). `title` e `body` vêm do
 * conteúdo; o `btn` do item `mic` não é mais exibido. A linha de plano dos dois
 * cartões é sempre `ROTULO_EXCLUSIVO_PREMIUM`.
 */
import { useState, type ReactNode } from 'react';

import type { CtaBlock, CtaItem } from '@/lib/content/types';
import { MARCADO, chaveCta, estaMarcado } from '@/lib/lesson/keys';
import { PLANOS, ROTULO_EXCLUSIVO_PREMIUM, planoInclui, type Plano } from '@/lib/planos';
import { URL_DO_CHATGPT } from '@/lib/pratica/chatgpt';
import type { ResultadoDoPrompt } from '@/lib/pratica/tipos';
import { SOLID, isSolidName, variant } from '@/lib/ui/palette';
import { ID_DA_VIDEOAULA } from '@/lib/video/acesso';

import { useInteracao } from '../interacao';

// ─────────────────────────────── textos ────────────────────────────────

/** Textos fixos do cartão de prática (contrato 01, seção 3.4). Não vêm do conteúdo. */
const TEXTOS_DA_PRATICA = {
  botaoPrincipal: 'CONVERSAR NO CHATGPT',
  botaoSecundario: 'COPIAR O PROMPT',
  copiado: 'Prompt copiado. Cole na IA que você preferir.',
  passos: [
    'Toque em "Conversar no ChatGPT". O prompt desta aula já vai junto.',
    'No ChatGPT, toque no botão de voz e responda falando.',
    'Quando terminar, volte ao app e siga para a próxima aula.',
  ],
  aviso: 'O ChatGPT é de outra empresa. A conversa fica na sua conta de lá.',
  semLink: 'O ChatGPT vai abrir em branco. O prompt já está copiado: é só colar.',
  /** Acréscimo do pacote 06 ao contrato: a área de transferência recusou a cópia. */
  falhouACopia: 'Não foi possível copiar. Abra "Ver o prompt" abaixo, selecione o texto e copie.',
  emPreparacao: 'A prática desta aula está em preparação.',
  semPlano: 'A prática com IA faz parte do WSA Premium.',
  conhecerPremium: 'Conhecer o WSA Premium',
  verOPrompt: 'Ver o prompt',
} as const;

/** Mensagens do cartão de videoaula, sem travessão e com o nome novo do plano. */
const TEXTOS_DA_VIDEOAULA = {
  noTopo: 'Sua videoaula está no topo desta aula.',
  doPremium: 'A videoaula desta aula faz parte do WSA Premium.',
  emProducao: 'Sua videoaula está em produção. Em breve no seu app.',
  doPremiumEmBreve: 'A videoaula faz parte do WSA Premium. Em breve no seu app.',
  conhecerPremium: 'Conhecer o WSA Premium',
} as const;

/** Sem a prop `pratica` (preview do painel, por exemplo), o cartão fica "em preparação". */
const SEM_FICHA: ResultadoDoPrompt = { ok: false, motivo: 'sem-ficha' };

// ─────────────────────────────── utilitários ───────────────────────────

/** Leva a tela até o painel de vídeo, no topo da aula. */
function irParaAVideoaula() {
  const painel = document.getElementById(ID_DA_VIDEOAULA);
  if (!painel) return;
  const suave = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  painel.scrollIntoView({ behavior: suave ? 'smooth' : 'auto', block: 'start' });
}

/**
 * Caminho antigo de cópia, para navegador sem `navigator.clipboard` ou que
 * recusou a cópia: área de texto fora da tela, `select()` e `execCommand`.
 * Fonte de 16px para o iPhone não dar zoom. Devolve o foco para onde estava.
 */
function copiarPorAreaDeTexto(texto: string): boolean {
  const focoAntes = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  const area = document.createElement('textarea');
  area.value = texto;
  area.setAttribute('readonly', '');
  area.setAttribute('aria-hidden', 'true');
  area.style.position = 'fixed';
  area.style.top = '0';
  area.style.left = '-9999px';
  area.style.opacity = '0';
  area.style.fontSize = '16px';
  document.body.appendChild(area);
  area.select();
  area.setSelectionRange(0, texto.length);
  let copiou = false;
  try {
    copiou = document.execCommand('copy');
  } catch {
    copiou = false;
  }
  document.body.removeChild(area);
  focoAntes?.focus({ preventScroll: true });
  return copiou;
}

/**
 * Copia o texto. `navigator.clipboard.writeText` é chamado na hora, dentro do
 * toque (uma função async roda síncrona até o primeiro `await`). Nunca joga.
 */
async function copiarTexto(texto: string): Promise<boolean> {
  try {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(texto);
      return true;
    }
  } catch {
    // Recusou (permissão, foco, navegador antigo): tenta o caminho antigo.
  }
  return copiarPorAreaDeTexto(texto);
}

/** Fundo escuro pede texto claro. */
function ehEscuro(item: CtaItem): boolean {
  return item.v === 'teal' || item.v === 'purple' || item.v === 'navy';
}

/** `SOLID[c.c] || "#0F2050"` do protótipo: o fallback aqui é navy, não o teal. */
function coresDoBotao(item: CtaItem): { fundo: string; texto: string } {
  const fundo = item.c && isSolidName(item.c) ? SOLID[item.c] : '#0F2050';
  const texto = item.c === 'yellow' || item.c === 'white' ? '#0F2050' : '#FFFFFF';
  return { fundo, texto };
}

// ─────────────────────────────── casca ─────────────────────────────────

/** Ícone, título, texto e linha de plano. Igual nos dois cartões. */
function CascaDoCartao({ item, children }: { item: CtaItem; children: ReactNode }) {
  const cv = variant(item.v);
  const escuro = ehEscuro(item);
  const microfone = item.icon === 'mic';

  return (
    <div className="flex items-start gap-4 rounded-[18px] p-5" style={{ background: cv.bg }}>
      <span
        aria-hidden="true"
        className="grid h-[46px] w-[46px] flex-none place-items-center rounded-full text-[19px]"
        style={{
          background: escuro ? '#F2C230' : microfone ? '#5B21B6' : '#0E9BAE',
          color: escuro ? '#0F2050' : '#FFFFFF',
        }}
      >
        {microfone ? '🎙' : '▶'}
      </span>

      <div className="min-w-0 flex-1">
        <h3 className="mb-1 text-[17px] font-black" style={{ color: escuro ? '#FFFFFF' : '#0F2050' }}>
          {item.title}
        </h3>
        {/* #E3E8F5 era o cinza-azulado do corpo no cartão escuro. Com o teal
            novo por baixo ele ficava em 4,43, a um passo dos 4,5 de texto
            pequeno; clareado um degrau dá 4,67 no teal, 13,69 no navy e 7,73
            no roxo. */}
        <p className="mb-2 text-[14px]" style={{ color: escuro ? '#E9EEF9' : '#6B7280' }}>
          {item.body}
        </p>
        <p
          className="mb-3 text-[11px] font-extrabold tracking-[.05em]"
          style={{ color: escuro ? '#F2C230' : microfone ? '#5B21B6' : '#0E7A8B' }}
        >
          {ROTULO_EXCLUSIVO_PREMIUM}
        </p>
        {children}
      </div>
    </div>
  );
}

// ─────────────────────────────── videoaula ─────────────────────────────

function CartaoDeVideoaula({
  item,
  chave,
  planoDoAluno,
  temVideoaula,
  linkDePremium,
}: {
  item: CtaItem;
  chave: string;
  planoDoAluno: Plano | null;
  temVideoaula: boolean;
  linkDePremium: string | null;
}) {
  const interacao = useInteracao();
  const aberto = estaMarcado(interacao.valor(chave));
  const escuro = ehEscuro(item);
  const cores = coresDoBotao(item);

  const incluso = planoInclui(planoDoAluno, 'videoaula');
  const levaAoPlayer = temVideoaula && incluso;
  const linkDeCompra = incluso ? null : linkDePremium;

  const mensagem = levaAoPlayer
    ? TEXTOS_DA_VIDEOAULA.noTopo
    : temVideoaula
      ? TEXTOS_DA_VIDEOAULA.doPremium
      : incluso
        ? TEXTOS_DA_VIDEOAULA.emProducao
        : TEXTOS_DA_VIDEOAULA.doPremiumEmBreve;

  const idMensagem = `${chave}-msg`;

  return (
    <CascaDoCartao item={item}>
      <button
        type="button"
        onClick={() => {
          interacao.definir(chave, MARCADO);
          interacao.conferir(chave, true);
          if (levaAoPlayer) irParaAVideoaula();
        }}
        aria-expanded={aberto}
        aria-controls={idMensagem}
        className="inline-flex min-h-[44px] items-center justify-center rounded-pill px-[22px] py-3 text-[13px] font-extrabold tracking-[.04em]"
        style={{ background: cores.fundo, color: cores.texto }}
      >
        {item.btn}
      </button>

      <p
        id={idMensagem}
        aria-live="polite"
        className={aberto ? 'mt-[10px] text-[13px] font-bold' : undefined}
        style={aberto ? { color: escuro ? '#E3E8F5' : '#6B7280' } : undefined}
      >
        {aberto ? mensagem : ''}
      </p>

      {aberto && linkDeCompra ? (
        <a
          href={linkDeCompra}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 inline-flex min-h-[44px] items-center text-[13px] font-extrabold underline underline-offset-4"
          style={{ color: escuro ? '#FFFFFF' : '#0F2050' }}
        >
          {TEXTOS_DA_VIDEOAULA.conhecerPremium}
          <span className="sr-only"> (abre em outra aba)</span>
        </a>
      ) : null}
    </CascaDoCartao>
  );
}

// ─────────────────────────────── prática com IA ────────────────────────

/** O que a linha de confirmação mostra depois de um toque. */
type EstadoDaCopia = 'nada' | 'copiado' | 'copiado-sem-link' | 'falhou';

function CartaoDePratica({
  item,
  chave,
  pratica,
  linkDePremium,
}: {
  item: CtaItem;
  chave: string;
  pratica: ResultadoDoPrompt;
  linkDePremium: string | null;
}) {
  const interacao = useInteracao();
  const [copia, setCopia] = useState<EstadoDaCopia>('nada');
  const escuro = ehEscuro(item);
  const cores = coresDoBotao(item);
  const corDoTexto = escuro ? '#FFFFFF' : '#0F2050';
  const corDeApoio = escuro ? '#E3E8F5' : '#6B7280';

  // Estado 3: ficha pendente, inválida ou ausente.
  if (!pratica.ok && pratica.motivo === 'sem-ficha') {
    return (
      <CascaDoCartao item={item}>
        <p className="text-[15px] font-bold" style={{ color: corDoTexto }}>
          {TEXTOS_DA_PRATICA.emPreparacao}
        </p>
      </CascaDoCartao>
    );
  }

  // Estado 4: o plano do aluno não inclui a prática. O prompt nem chegou aqui.
  if (!pratica.ok) {
    return (
      <CascaDoCartao item={item}>
        <p className="text-[15px] font-bold" style={{ color: corDoTexto }}>
          {TEXTOS_DA_PRATICA.semPlano}
        </p>
        {linkDePremium ? (
          <a
            href={linkDePremium}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 inline-flex min-h-[44px] items-center text-[15px] font-extrabold underline underline-offset-4"
            style={{ color: corDoTexto }}
          >
            {TEXTOS_DA_PRATICA.conhecerPremium}
            <span className="sr-only"> (abre em outra aba)</span>
          </a>
        ) : null}
      </CascaDoCartao>
    );
  }

  // Estados 1 e 2: prompt pronto.
  const { prompt, urlDoChatGPT } = pratica;
  const idConfirmacao = `${chave}-msg`;

  /** Lembra que o aluno usou o cartão. É o mesmo registro que o botão antigo gravava. */
  function lembrarUso() {
    interacao.definir(chave, MARCADO);
    interacao.conferir(chave, true);
  }

  // ⚠️ Síncrono. `window.open` primeiro, sem nenhum `await` antes dele.
  function conversarNoChatGPT() {
    window.open(urlDoChatGPT ?? URL_DO_CHATGPT, '_blank', 'noopener');
    void copiarTexto(prompt).then((copiou) => {
      // Com link, o prompt já foi junto: a cópia é só um bônus, e a falha dela
      // não merece aviso. Sem link, o aluno precisa colar: aí a falha é avisada.
      if (urlDoChatGPT) setCopia(copiou ? 'copiado' : 'nada');
      else setCopia(copiou ? 'copiado-sem-link' : 'falhou');
    });
    lembrarUso();
  }

  function copiarOPrompt() {
    void copiarTexto(prompt).then((copiou) => setCopia(copiou ? 'copiado' : 'falhou'));
    lembrarUso();
  }

  const confirmacao =
    copia === 'copiado'
      ? TEXTOS_DA_PRATICA.copiado
      : copia === 'copiado-sem-link'
        ? TEXTOS_DA_PRATICA.semLink
        : copia === 'falhou'
          ? TEXTOS_DA_PRATICA.falhouACopia
          : '';

  return (
    <CascaDoCartao item={item}>
      <ol className="mb-4 list-decimal space-y-1 pl-5 text-[15px]" style={{ color: corDoTexto }}>
        {TEXTOS_DA_PRATICA.passos.map((passo) => (
          <li key={passo}>{passo}</li>
        ))}
      </ol>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={conversarNoChatGPT}
          className="inline-flex min-h-[var(--alt-botao,48px)] w-full items-center justify-center rounded-pill px-5 py-2 text-center text-[15px] font-extrabold tracking-[.04em] sm:w-auto"
          style={{ background: cores.fundo, color: cores.texto }}
        >
          {TEXTOS_DA_PRATICA.botaoPrincipal}
          <span className="sr-only"> (abre em outra aba)</span>
        </button>
        <button
          type="button"
          onClick={copiarOPrompt}
          className="inline-flex min-h-[var(--alt-botao,48px)] w-full items-center justify-center rounded-pill border-[1.5px] bg-transparent px-5 py-2 text-center text-[15px] font-extrabold tracking-[.04em] sm:w-auto"
          style={{ borderColor: corDoTexto, color: corDoTexto }}
        >
          {TEXTOS_DA_PRATICA.botaoSecundario}
        </button>
      </div>

      <p
        id={idConfirmacao}
        aria-live="polite"
        className={confirmacao ? 'mt-3 text-[15px] font-bold' : undefined}
        style={confirmacao ? { color: corDoTexto } : undefined}
      >
        {confirmacao}
      </p>

      <p className="mt-3 text-[14px]" style={{ color: corDeApoio }}>
        {TEXTOS_DA_PRATICA.aviso}
      </p>

      <details className="mt-2">
        <summary
          className="inline-flex min-h-[44px] cursor-pointer items-center text-[15px] font-extrabold underline underline-offset-4"
          style={{ color: corDoTexto }}
        >
          {TEXTOS_DA_PRATICA.verOPrompt}
        </summary>
        <pre className="mt-2 max-h-[40vh] select-text overflow-auto whitespace-pre-wrap break-words rounded-[12px] bg-white p-3 font-sans text-[15px] leading-relaxed text-[#0F2050]">
          {prompt}
        </pre>
      </details>
    </CascaDoCartao>
  );
}

// ─────────────────────────────── bloco ─────────────────────────────────

/**
 * O bloco `cta` do fim da aula. `plano` e `linksDeCompra` aceitam os tipos
 * antigos e os novos (o pacote 03 troca os tipos em paralelo).
 */
export function BlocoCta({
  bloco,
  lessonId,
  plano,
  temVideoaula = false,
  linksDeCompra,
  pratica = SEM_FICHA,
}: {
  bloco: CtaBlock;
  lessonId: number;
  plano?: string | null;
  temVideoaula?: boolean;
  linksDeCompra?: { PREMIUM?: string | null };
  pratica?: ResultadoDoPrompt;
}) {
  const interacao = useInteracao();
  // Plano desconhecido (inclusive o antigo 'COMPLETO') conta como sem plano.
  const planoDoAluno = PLANOS.find((p) => p === plano) ?? null;
  const linkDePremium = linksDeCompra?.PREMIUM ?? null;

  return (
    <div className="flex flex-col gap-3" aria-busy={interacao.gravando || undefined}>
      {bloco.items.map((item, i) => {
        const chave = chaveCta(lessonId, i);
        return item.icon === 'mic' ? (
          <CartaoDePratica
            key={chave}
            item={item}
            chave={chave}
            pratica={pratica}
            linkDePremium={linkDePremium}
          />
        ) : (
          <CartaoDeVideoaula
            key={chave}
            item={item}
            chave={chave}
            planoDoAluno={planoDoAluno}
            temVideoaula={temVideoaula}
            linkDePremium={linkDePremium}
          />
        );
      })}
    </div>
  );
}
