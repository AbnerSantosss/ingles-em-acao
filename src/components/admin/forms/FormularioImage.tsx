import { CampoSomenteLeitura, CampoTexto, CamposDesconhecidos } from './campos';
import { CampoDeImagem } from './imagem';
import { ligador } from './objeto';
import type { PropsDoFormulario } from './tipos';

const ORDEM = ['id', 'ph', 'src', 'alt'] as const;

/**
 * `image`: ilustração da aula. O `id` aqui não é chave de resposta, é o nome da
 * arte legada (`public/lessons/art/{id}.png`); o formulário não o troca para a
 * cópia não perder a arte. A imagem nova vem da biblioteca (`src` + `alt`).
 */
export function FormularioImage({ valor, aoMudar, erros }: PropsDoFormulario) {
  const definir = ligador(valor, aoMudar, ORDEM);
  const descricao = typeof valor.ph === 'string' ? valor.ph : undefined;
  return (
    <>
      <CampoSomenteLeitura
        rotulo="Nome da arte original"
        chave="id"
        valor={valor.id}
        erros={erros.em('id')}
        ajuda="Gerado pelo editor. Para usar outra imagem, escolha na biblioteca abaixo."
      />
      <CampoTexto
        rotulo="Descrição da cena"
        chave="ph"
        valor={valor.ph}
        aoMudar={definir('ph')}
        obrigatorio
        erros={erros.em('ph')}
        linhas={3}
        ajuda="Aparece no quadro cinza enquanto não houver imagem, e é sugerida como texto alternativo."
      />
      <CampoDeImagem
        rotulo="Imagem da biblioteca"
        objeto={valor}
        aoMudar={aoMudar}
        erros={erros}
        ordem={ORDEM}
        descricaoSugerida={descricao}
        uso="ilustracao"
      />
      <CamposDesconhecidos objeto={valor} conhecidos={ORDEM} erros={erros} aoMudar={aoMudar} />
    </>
  );
}
