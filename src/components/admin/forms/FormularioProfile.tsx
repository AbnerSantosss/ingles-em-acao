import { CampoSomenteLeitura, CampoTexto, CamposDesconhecidos, ListaDeTextos } from './campos';
import { CampoDeImagem } from './imagem';
import { ligador } from './objeto';
import type { PropsDoFormulario } from './tipos';

const ORDEM = ['name', 'id', 'ph', 'facts', 'src', 'alt'] as const;

/**
 * `profile`: cartão de personagem — foto ao lado de nome e fatos. Como no
 * `image`, o `id` é o nome da arte legada e não se troca aqui; a foto nova vem
 * da biblioteca (`src` + `alt`), enviada ali mesmo se preciso.
 */
export function FormularioProfile({ valor, aoMudar, erros }: PropsDoFormulario) {
  const definir = ligador(valor, aoMudar, ORDEM);
  const descricao = typeof valor.ph === 'string' ? valor.ph : undefined;
  return (
    <>
      <CampoTexto
        rotulo="Nome"
        chave="name"
        valor={valor.name}
        aoMudar={definir('name')}
        obrigatorio
        erros={erros.em('name')}
        placeholder="Ex.: Anna Smith"
      />
      <ListaDeTextos
        rotulo="Fatos"
        chave="facts"
        nomeDoItem="fato"
        valor={valor.facts}
        aoMudar={(fatos) => definir('facts')(fatos)}
        erros={erros.filho('facts')}
        ajuda="Uma linha por fato (idade, cidade, profissão...)."
      />
      <CampoSomenteLeitura
        rotulo="Nome da arte original"
        chave="id"
        valor={valor.id}
        erros={erros.em('id')}
        ajuda="Gerado pelo editor. Para usar outra foto, escolha ou envie abaixo."
      />
      <CampoTexto
        rotulo="Descrição da foto"
        chave="ph"
        valor={valor.ph}
        aoMudar={definir('ph')}
        obrigatorio
        erros={erros.em('ph')}
        linhas={2}
        ajuda="Aparece no quadro cinza enquanto não houver foto, e é sugerida como texto alternativo."
      />
      <CampoDeImagem
        rotulo="Foto do personagem"
        objeto={valor}
        aoMudar={aoMudar}
        erros={erros}
        ordem={ORDEM}
        descricaoSugerida={descricao}
        uso="perfil"
      />
      <CamposDesconhecidos objeto={valor} conhecidos={ORDEM} erros={erros} aoMudar={aoMudar} />
    </>
  );
}
