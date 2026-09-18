import { CampoSomenteLeitura, CampoTexto, CamposDesconhecidos, ListaDeTextos } from './campos';
import { ligador } from './objeto';
import type { PropsDoFormulario } from './tipos';

const ORDEM = ['title', 'items'] as const;

/** `check`: autoavaliação "Eu consigo…". Cada item vira uma caixa que o aluno marca. */
export function FormularioCheck({ valor, aoMudar, erros, id, alunos }: PropsDoFormulario) {
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
        obrigatorio
        erros={erros.em('title')}
        placeholder="Ex.: EU CONSIGO..."
      />
      <ListaDeTextos
        rotulo="Itens para marcar"
        chave="items"
        nomeDoItem="item"
        valor={valor.items}
        aoMudar={definir('items')}
        erros={erros.filho('items')}
        alunosPresos={alunos}
        placeholder="Ex.: Escolher am, is ou are conforme o sujeito."
      />
      <CamposDesconhecidos objeto={valor} conhecidos={ORDEM} erros={erros} aoMudar={aoMudar} />
    </>
  );
}
