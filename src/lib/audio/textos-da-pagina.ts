/**
 * Textos de uma página da aula que podem receber áudio (contrato 01, seção 2.2).
 *
 * É a lista que o painel usa para achar clipe órfão (`clipsOrfaos`) e a que o
 * pacote 12 usa para escrever as âncoras. Ela tem de bater, campo por campo,
 * com o que os renderizadores de `src/components/lesson/blocks/` passam para o
 * `OuvirTexto`. Mudou um lado, mude o outro e o teste
 * `tests/audio/textos-da-pagina.test.ts`.
 */
import type { Block, LessonPage } from '@/lib/content/types';

/** Textos de um bloco que podem ter botão de ouvir, na ordem em que aparecem na tela. */
export function textosDoBloco(bloco: Block): string[] {
  switch (bloco.t) {
    case 'chips':
      return bloco.items.map((item) => item.t);
    case 'pron':
      return [bloco.code];
    case 'grid':
      return bloco.items.map((item) => item.title);
    case 'table':
      return bloco.rows.flatMap((linha) => [linha.a, linha.b]);
    case 'rule':
      return [bloco.ex];
    case 'compare':
      // Nunca `wrong`: frase errada não ganha modelo sonoro.
      return bloco.items.map((item) => item.right);
    case 'profile':
      return [...bloco.facts];
    case 'cards':
      return bloco.items.flatMap((item) => [item.tag, ...(item.lines ?? [])]);
    case 'rows':
      return bloco.items.map((item) => item.text);
    case 'steps':
      return bloco.items.flatMap((item) => [item.tag, ...(item.lines ?? [])]);
    case 'dialogue':
      return bloco.items.map((fala) => fala.text);
    case 'lead':
    case 'note':
    case 'key':
      return [bloco.text];
    // Sem áudio nesta entrega. Áudio em exercício é "listening challenge" e fica para depois.
    case 'badge':
    case 'title':
    case 'sec':
    case 'kicker':
    case 'image':
    case 'answers':
    case 'objective':
    case 'meta':
    case 'next':
    case 'bar':
    case 'mc':
    case 'fill':
    case 'match':
    case 'dnd':
    case 'check':
    case 'free':
    case 'cta':
      return [];
    default:
      return tipoSemCase(bloco);
  }
}

/**
 * Trava de compilação: um tipo de bloco novo em `types.ts` sem `case` acima faz
 * este arquivo parar de compilar. Em execução (dado estranho vindo do banco),
 * devolve lista vazia.
 */
function tipoSemCase(bloco: never): string[] {
  void bloco;
  return [];
}

/** Todos os textos da página que podem ancorar áudio, sem os vazios. */
export function textosDaPagina(pagina: LessonPage): string[] {
  return pagina.blocks.flatMap((bloco) => textosDoBloco(bloco)).filter((texto) => texto.trim() !== '');
}

/**
 * Âncora do clipe `alvo: 'bloco'` de um bloco: o texto do PRIMEIRO item, na
 * ordem da tela (contrato 01, seção 2.1). `null`: o bloco não tem player de
 * bloco (`pron`, `rule`, `lead`, `note`, `key` e todos os sem áudio).
 */
export function ancoraDoBloco(bloco: Block): string | null {
  switch (bloco.t) {
    case 'chips':
      return bloco.items[0]?.t ?? null;
    case 'grid':
      return bloco.items[0]?.title ?? null;
    case 'table':
      return bloco.rows[0]?.a ?? null;
    case 'compare':
      return bloco.items[0]?.right ?? null;
    case 'profile':
      return bloco.facts[0] ?? null;
    case 'cards':
      return bloco.items[0]?.tag ?? null;
    case 'rows':
      return bloco.items[0]?.text ?? null;
    case 'steps':
      return bloco.items[0]?.tag ?? null;
    case 'dialogue':
      return bloco.items[0]?.text ?? null;
    default:
      return null;
  }
}
