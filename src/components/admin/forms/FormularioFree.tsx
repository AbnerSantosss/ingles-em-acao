import {
  CampoColunas,
  CampoSomenteLeitura,
  CampoTexto,
  CamposDesconhecidos,
  ListaDeItens,
  Secao,
} from './campos';
import { ehObjeto, ligador, type Objeto } from './objeto';
import { PADRAO_SOLIDO_TEAL, SeletorDeSolido, SeletorDeVariante } from './paleta';
import type { PropsDoFormulario } from './tipos';
import type { Erros } from './validacao';

const ORDEM = ['items', 'cols'] as const;
const ORDEM_DO_ITEM = ['n', 'kicker', 'prefix', 'ideas', 'c', 'v'] as const;

/** Missão nova: próximo número e as cores da anterior. `ideas` é obrigatório (pode ser `""`). */
function novaMissao(lista: readonly unknown[]): Objeto {
  const ultimo = lista.at(-1);
  const novo: Objeto = { n: String(lista.length + 1), kicker: '', prefix: '', ideas: '' };
  if (ehObjeto(ultimo)) {
    if (ultimo.c !== undefined) novo.c = ultimo.c;
    if (ultimo.v !== undefined) novo.v = ultimo.v;
  }
  return novo;
}

function Missao({
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
      <div className="grid gap-4 sm:grid-cols-[120px_1fr]">
        <CampoTexto
          rotulo="Número"
          chave="n"
          valor={item.n}
          aoMudar={definir('n')}
          obrigatorio
          erros={erros.em('n')}
          placeholder="Ex.: 1"
        />
        <CampoTexto
          rotulo="Rótulo da missão"
          chave="kicker"
          valor={item.kicker}
          aoMudar={definir('kicker')}
          obrigatorio
          erros={erros.em('kicker')}
          placeholder="Ex.: FALE SOBRE VOCÊ"
        />
      </div>
      <CampoTexto
        rotulo="Início da frase"
        chave="prefix"
        valor={item.prefix}
        aoMudar={definir('prefix')}
        obrigatorio
        erros={erros.em('prefix')}
        linhas={2}
        placeholder="Ex.: I am"
        ajuda="Texto em destaque logo acima do campo onde o aluno escreve."
      />
      <CampoTexto
        rotulo="Ideias"
        chave="ideas"
        valor={item.ideas}
        aoMudar={definir('ideas')}
        vazioPermitido
        erros={erros.em('ideas')}
        placeholder="Ex.: Ideias: Brazilian • happy • a student"
        ajuda="Pode ficar em branco quando o exercício não sugere vocabulário."
      />
      <Secao titulo="Aparência">
        <SeletorDeSolido
          rotulo="Cor do rótulo e da borda"
          valor={item.c}
          aoMudar={definir('c')}
          erros={erros.em('c')}
          padrao={PADRAO_SOLIDO_TEAL}
        />
        <SeletorDeVariante
          rotulo="Cor da missão"
          valor={item.v}
          aoMudar={definir('v')}
          erros={erros.em('v')}
        />
      </Secao>
      <CamposDesconhecidos objeto={item} conhecidos={ORDEM_DO_ITEM} erros={erros} aoMudar={aoMudar} />
    </>
  );
}

/** `free`: produção escrita livre. Não é corrigida, mas o texto do aluno fica gravado. */
export function FormularioFree({ valor, aoMudar, erros, id, alunos }: PropsDoFormulario) {
  const definir = ligador(valor, aoMudar, ORDEM);
  return (
    <>
      <CampoSomenteLeitura
        rotulo="Identificador do exercício"
        valor={id}
        erros={erros.em('id')}
        ajuda="Fixo: é a chave das respostas dos alunos."
      />
      <CampoColunas valor={valor.cols} aoMudar={definir('cols')} erros={erros.em('cols')} />
      <ListaDeItens
        rotulo="Missões"
        chave="items"
        nomeDoItem="missão"
        valor={valor.items}
        aoMudar={definir('items')}
        novoItem={novaMissao}
        erros={erros.filho('items')}
        alunosPresos={alunos}
        resumoDoItem={(item) => (typeof item.kicker === 'string' ? item.kicker : undefined)}
        renderizar={(item, mudarItem, i) => (
          <Missao item={item} aoMudar={mudarItem} erros={erros.filho('items', i)} />
        )}
      />
      <CamposDesconhecidos objeto={valor} conhecidos={ORDEM} erros={erros} aoMudar={aoMudar} />
    </>
  );
}
