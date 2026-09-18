import {
  CampoLigado,
  CampoSomenteLeitura,
  CampoTexto,
  CamposDesconhecidos,
  ListaDeItens,
  ListaDeTextos,
  Secao,
} from './campos';
import { ehObjeto, ligador, type Objeto } from './objeto';
import { SeletorDeVariante } from './paleta';
import type { PropsDoFormulario } from './tipos';
import type { Erros } from './validacao';

const ORDEM = ['items', 'title', 'sub', 'v', 'wide'] as const;
const ORDEM_DO_ITEM = ['pre', 'answers', 'post', 'note', 'v'] as const;

function novaLacuna(lista: readonly unknown[]): Objeto {
  const ultimo = lista.at(-1);
  const novo: Objeto = { pre: '', answers: [''] };
  if (ehObjeto(ultimo) && ultimo.v !== undefined) novo.v = ultimo.v;
  return novo;
}

function Lacuna({
  item,
  aoMudar,
  erros,
}: {
  item: Objeto;
  aoMudar: (novo: Objeto) => void;
  erros: Erros;
}) {
  const definir = ligador(item, aoMudar, ORDEM_DO_ITEM);
  return (
    <>
      <CampoTexto
        rotulo="Texto antes da lacuna"
        chave="pre"
        valor={item.pre}
        aoMudar={definir('pre')}
        obrigatorio
        erros={erros.em('pre')}
        placeholder="Ex.: 1. She ___"
      />
      <ListaDeTextos
        rotulo="Respostas aceitas"
        chave="answers"
        nomeDoItem="resposta"
        valor={item.answers}
        aoMudar={definir('answers')}
        erros={erros.filho('answers')}
        ajuda="O aluno acerta se digitar qualquer uma delas. Precisa de pelo menos uma."
      />
      <CampoTexto
        rotulo="Texto depois da lacuna"
        chave="post"
        valor={item.post}
        aoMudar={definir('post')}
        erros={erros.em('post')}
        ajuda="Opcional."
      />
      <CampoTexto
        rotulo="Dica"
        chave="note"
        valor={item.note}
        aoMudar={definir('note')}
        erros={erros.em('note')}
        ajuda="Opcional. Aparece em cinza, embaixo da linha."
      />
      <SeletorDeVariante
        rotulo="Cor da linha"
        valor={item.v}
        aoMudar={definir('v')}
        erros={erros.em('v')}
      />
      <CamposDesconhecidos objeto={item} conhecidos={ORDEM_DO_ITEM} erros={erros} aoMudar={aoMudar} />
    </>
  );
}

/** `fill`: complete as lacunas. Cada item é uma frase com uma lacuna e as respostas aceitas. */
export function FormularioFill({ valor, aoMudar, erros, id, alunos }: PropsDoFormulario) {
  const definir = ligador(valor, aoMudar, ORDEM);
  return (
    <>
      <CampoSomenteLeitura
        rotulo="Identificador do exercício"
        valor={id}
        erros={erros.em('id')}
        ajuda="Fixo: é a chave das respostas dos alunos."
      />
      <CampoTexto
        rotulo="Título"
        chave="title"
        valor={valor.title}
        aoMudar={definir('title')}
        erros={erros.em('title')}
        placeholder="Ex.: EXERCÍCIO · COMPLETE"
        ajuda="Opcional."
      />
      <CampoTexto
        rotulo="Instrução"
        chave="sub"
        valor={valor.sub}
        aoMudar={definir('sub')}
        erros={erros.em('sub')}
        ajuda="Opcional. Linha cinza embaixo do título."
      />
      <ListaDeItens
        rotulo="Lacunas"
        chave="items"
        nomeDoItem="lacuna"
        valor={valor.items}
        aoMudar={definir('items')}
        novoItem={novaLacuna}
        erros={erros.filho('items')}
        alunosPresos={alunos}
        resumoDoItem={(item) => (typeof item.pre === 'string' ? item.pre : undefined)}
        renderizar={(item, mudarItem, i) => (
          <Lacuna item={item} aoMudar={mudarItem} erros={erros.filho('items', i)} />
        )}
      />
      <Secao titulo="Aparência">
        <CampoLigado
          rotulo="Resposta de frase inteira"
          chave="wide"
          valor={valor.wide}
          aoMudar={definir('wide')}
          erros={erros.em('wide')}
          ajuda="Campo de resposta mais largo, para escrever a frase completa."
        />
        <SeletorDeVariante valor={valor.v} aoMudar={definir('v')} erros={erros.em('v')} />
      </Secao>
      <CamposDesconhecidos
        objeto={valor}
        conhecidos={ORDEM}
        erros={erros}
        aoMudar={aoMudar}
      />
    </>
  );
}
