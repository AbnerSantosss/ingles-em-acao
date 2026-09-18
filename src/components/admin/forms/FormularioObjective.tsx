import { CampoTexto, CamposDesconhecidos, Secao } from './campos';
import { ligador } from './objeto';
import { SeletorDeVariante } from './paleta';
import type { PropsDoFormulario } from './tipos';

const ORDEM = ['title', 'text', 'v', 'tag'] as const;

/** `objective`: quadro de objetivo da aula — etiqueta amarela opcional, título e texto. */
export function FormularioObjective({ valor, aoMudar, erros }: PropsDoFormulario) {
  const definir = ligador(valor, aoMudar, ORDEM);
  return (
    <>
      <CampoTexto
        rotulo="Etiqueta"
        chave="tag"
        valor={valor.tag}
        aoMudar={definir('tag')}
        erros={erros.em('tag')}
        ajuda="Opcional. Selo amarelo acima do título."
      />
      <CampoTexto
        rotulo="Título"
        chave="title"
        valor={valor.title}
        aoMudar={definir('title')}
        obrigatorio
        erros={erros.em('title')}
        placeholder="Ex.: OBJETIVO DA AULA"
      />
      <CampoTexto
        rotulo="Texto"
        chave="text"
        valor={valor.text}
        aoMudar={definir('text')}
        obrigatorio
        erros={erros.em('text')}
        linhas={4}
        ajuda="Quebras de linha aparecem na aula."
      />
      <Secao titulo="Aparência">
        <SeletorDeVariante valor={valor.v} aoMudar={definir('v')} erros={erros.em('v')} />
      </Secao>
      <CamposDesconhecidos objeto={valor} conhecidos={ORDEM} erros={erros} aoMudar={aoMudar} />
    </>
  );
}
