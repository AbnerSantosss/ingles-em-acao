import {
  CampoColunas,
  CampoSomenteLeitura,
  CampoTexto,
  CamposDesconhecidos,
  ListaDeItens,
  ListaDeTextos,
  Secao,
} from './campos';
import { CampoDeImagem } from './imagem';
import { ehObjeto, ligador, type Objeto } from './objeto';
import { PADRAO_SOLIDO_TEAL, SeletorDeSolido, SeletorDeVariante } from './paleta';
import type { PropsDoFormulario } from './tipos';
import type { Erros } from './validacao';

const ORDEM = ['items', 'cols'] as const;
const ORDEM_DO_ITEM = ['tag', 'lines', 'note', 'id', 'ph', 'src', 'alt', 'c', 'v'] as const;

/** Cartão novo herda as cores do último, que é o que o admin quase sempre quer. */
function novoCartao(lista: readonly unknown[]): Objeto {
  const ultimo = lista.at(-1);
  const novo: Objeto = { tag: '', lines: [''] };
  if (ehObjeto(ultimo)) {
    if (ultimo.c !== undefined) novo.c = ultimo.c;
    if (ultimo.v !== undefined) novo.v = ultimo.v;
  }
  return novo;
}

function Cartao({
  item,
  aoMudar,
  erros,
}: {
  item: Objeto;
  aoMudar: (novo: Objeto) => void;
  erros: Erros;
}) {
  const definir = ligador(item, aoMudar, ORDEM_DO_ITEM);
  const temArteLegada = item.id !== undefined;
  const descricao = typeof item.ph === 'string' ? item.ph : undefined;
  return (
    <>
      <CampoTexto
        rotulo="Etiqueta"
        chave="tag"
        valor={item.tag}
        aoMudar={definir('tag')}
        obrigatorio
        erros={erros.em('tag')}
        placeholder="Ex.: AFIRMATIVA"
      />
      <ListaDeTextos
        rotulo="Linhas"
        chave="lines"
        nomeDoItem="linha"
        valor={item.lines}
        aoMudar={(linhas) => definir('lines')(linhas.length > 0 ? linhas : undefined)}
        erros={erros.filho('lines')}
        ajuda="Cada linha vira uma faixa branca no cartão. Opcional."
      />
      <CampoTexto
        rotulo="Nota"
        chave="note"
        valor={item.note}
        aoMudar={definir('note')}
        erros={erros.em('note')}
        ajuda="Opcional. Texto pequeno na cor da etiqueta, no fim do cartão."
      />
      <Secao
        titulo="Imagem do cartão"
        ajuda="Opcional. O cartão só mostra imagem quando há arte original ou imagem da biblioteca."
      >
        {temArteLegada ? (
          <CampoSomenteLeitura
            rotulo="Nome da arte original"
            chave="id"
            valor={item.id}
            erros={erros.em('id')}
          />
        ) : null}
        <CampoTexto
          rotulo="Descrição da cena"
          chave="ph"
          valor={item.ph}
          aoMudar={definir('ph')}
          erros={erros.em('ph')}
          linhas={2}
        />
        <CampoDeImagem
          rotulo="Imagem da biblioteca"
          objeto={item}
          aoMudar={aoMudar}
          erros={erros}
          ordem={ORDEM_DO_ITEM}
          descricaoSugerida={descricao}
          uso="cartao"
        />
      </Secao>
      <Secao titulo="Aparência">
        <SeletorDeSolido
          rotulo="Cor da etiqueta"
          valor={item.c}
          aoMudar={definir('c')}
          erros={erros.em('c')}
          padrao={PADRAO_SOLIDO_TEAL}
        />
        <SeletorDeVariante
          rotulo="Cor do cartão"
          valor={item.v}
          aoMudar={definir('v')}
          erros={erros.em('v')}
        />
      </Secao>
      <CamposDesconhecidos objeto={item} conhecidos={ORDEM_DO_ITEM} erros={erros} aoMudar={aoMudar} />
    </>
  );
}

/** `cards`: cartões com etiqueta colorida, linhas, nota e imagem opcional. */
export function FormularioCards({ valor, aoMudar, erros }: PropsDoFormulario) {
  const definir = ligador(valor, aoMudar, ORDEM);
  return (
    <>
      <CampoColunas valor={valor.cols} aoMudar={definir('cols')} erros={erros.em('cols')} />
      <ListaDeItens
        rotulo="Cartões"
        chave="items"
        nomeDoItem="cartão"
        valor={valor.items}
        aoMudar={definir('items')}
        novoItem={novoCartao}
        erros={erros.filho('items')}
        resumoDoItem={(item) => (typeof item.tag === 'string' ? item.tag : undefined)}
        renderizar={(item, mudarItem, i) => (
          <Cartao item={item} aoMudar={mudarItem} erros={erros.filho('items', i)} />
        )}
      />
      <CamposDesconhecidos objeto={valor} conhecidos={ORDEM} erros={erros} aoMudar={aoMudar} />
    </>
  );
}
