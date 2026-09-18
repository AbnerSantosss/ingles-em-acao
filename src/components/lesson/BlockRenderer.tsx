'use client';

/**
 * O despachante dos 31 tipos de bloco — um `bloco.t` entra, um componente sai.
 *
 * Existe **um renderer só** (BACKOFFICE §3.4): o aluno e o preview do admin usam
 * este mesmo arquivo. O que muda entre os dois é o provedor de interação que
 * envolve a árvore (`ProvedorPersistente` × `ProvedorEfemero`), nunca o desenho.
 *
 * Duas garantias que este arquivo dá, e são o motivo de ele existir separado:
 *
 * 1. **Exaustividade em tempo de compilação.** O `default` só compila porque, ali,
 *    `bloco` já é `never`. Se um 32º tipo entrar em `Block` sem entrar aqui, o
 *    build quebra — que é o comportamento certo. Um bloco novo que renderiza
 *    silenciosamente em branco é conteúdo perdido sem aviso nenhum.
 *
 * 2. **Dado torto não derruba a página.** Em runtime o `pages` vem de uma coluna
 *    `Json`: um bloco com `t` desconhecido (rascunho de um admin, migração pela
 *    metade) vira um aviso discreto no lugar do bloco, não uma tela branca. O
 *    preview do admin depende disso para ser usável enquanto se edita.
 */
import {
  BlocoCards,
  BlocoImage,
  BlocoNext,
  BlocoObjective,
  BlocoProfile,
  BlocoPron,
  BlocoRule,
  BlocoSteps,
} from '@/components/lesson/blocks/cartoes';
import {
  BlocoInterativo,
  type LinksDeCompra,
  type Plano,
} from '@/components/lesson/blocks/interativos';
import {
  BlocoAnswers,
  BlocoChips,
  BlocoCompare,
  BlocoDialogue,
  BlocoGrid,
  BlocoRows,
  BlocoTable,
} from '@/components/lesson/blocks/listas';
import {
  BlocoBadge,
  BlocoBar,
  BlocoKey,
  BlocoKicker,
  BlocoLead,
  BlocoMeta,
  BlocoNote,
  BlocoSec,
  BlocoTitle,
} from '@/components/lesson/blocks/texto';
import type { Block } from '@/lib/content/types';

export type PropsDoBlockRenderer = {
  bloco: Block;
  /** Número da aula (1 a 42). Entra nas chaves `mc:` e `cta:`. */
  lessonId: number;
  /** Plano do aluno — só o `cta` usa, para saber se o recurso já é dele. */
  plano?: Plano;
  /** A aula tem videoaula na tela — só o `cta` usa. Ausente = não tem. */
  temVideoaula?: boolean;
  /** Checkout por plano — só o `cta` usa. Ausente = sem botão de compra. */
  linksDeCompra?: LinksDeCompra;
};

export function BlockRenderer({
  bloco,
  lessonId,
  plano,
  temVideoaula,
  linksDeCompra,
}: PropsDoBlockRenderer) {
  switch (bloco.t) {
    // ───────────────────────── os 24 estáticos ─────────────────────────
    case 'badge':
      return <BlocoBadge bloco={bloco} />;
    case 'title':
      return <BlocoTitle bloco={bloco} />;
    case 'sec':
      return <BlocoSec bloco={bloco} />;
    case 'kicker':
      return <BlocoKicker bloco={bloco} />;
    case 'lead':
      return <BlocoLead bloco={bloco} />;
    case 'note':
      return <BlocoNote bloco={bloco} />;
    case 'image':
      return <BlocoImage bloco={bloco} />;
    case 'chips':
      return <BlocoChips bloco={bloco} />;
    case 'answers':
      return <BlocoAnswers bloco={bloco} />;
    case 'pron':
      return <BlocoPron bloco={bloco} />;
    case 'objective':
      return <BlocoObjective bloco={bloco} />;
    case 'meta':
      return <BlocoMeta bloco={bloco} />;
    case 'grid':
      return <BlocoGrid bloco={bloco} />;
    case 'table':
      return <BlocoTable bloco={bloco} />;
    case 'rule':
      return <BlocoRule bloco={bloco} />;
    case 'compare':
      return <BlocoCompare bloco={bloco} />;
    case 'profile':
      return <BlocoProfile bloco={bloco} />;
    case 'next':
      return <BlocoNext bloco={bloco} />;
    case 'key':
      return <BlocoKey bloco={bloco} />;
    case 'cards':
      return <BlocoCards bloco={bloco} />;
    case 'rows':
      return <BlocoRows bloco={bloco} />;
    case 'steps':
      return <BlocoSteps bloco={bloco} />;
    case 'dialogue':
      return <BlocoDialogue bloco={bloco} />;
    case 'bar':
      return <BlocoBar bloco={bloco} />;

    // ──────────────────────── os 7 interativos ─────────────────────────
    // Todos passam pelo despachante de `interativos.tsx`, que já conhece a
    // chave de resposta de cada um.
    case 'mc':
    case 'fill':
    case 'match':
    case 'dnd':
    case 'check':
    case 'free':
    case 'cta':
      return (
        <BlocoInterativo
          bloco={bloco}
          lessonId={lessonId}
          plano={plano}
          temVideoaula={temVideoaula}
          linksDeCompra={linksDeCompra}
        />
      );

    default:
      return <BlocoDesconhecido tipo={tipoDoBlocoInesperado(bloco)} />;
  }
}

/**
 * A rede de segurança dos dois lados.
 *
 * O parâmetro `never` é a checagem de exaustividade: só é possível chamar esta
 * função de um ponto onde o compilador já provou que todos os `t` foram tratados.
 * O corpo é a tolerância a runtime: o valor que chega aqui de verdade veio de uma
 * coluna `Json`, então lê-se o `t` com cuidado, sem confiar no tipo.
 */
function tipoDoBlocoInesperado(bloco: never): string | null {
  const cru: unknown = bloco;
  if (typeof cru === 'object' && cru !== null && 't' in cru) {
    const t = (cru as { t: unknown }).t;
    if (typeof t === 'string' && t.length > 0 && t.length <= 40) return t;
  }
  return null;
}

/** O lugar do bloco que não deu para desenhar — discreto, mas nunca invisível. */
function BlocoDesconhecido({ tipo }: { tipo: string | null }) {
  return (
    <p
      role="note"
      className="m-0 rounded-field border-[1.5px] border-dashed border-border bg-surface px-4 py-3 text-[13px] font-bold leading-snug text-muted-2"
    >
      Não foi possível exibir este trecho da aula
      {tipo === null ? '' : ` (bloco “${tipo}”)`}. O restante da página continua aqui.
    </p>
  );
}
