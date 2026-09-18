import { CampoTexto, CamposDesconhecidos } from './campos';
import { ligador } from './objeto';
import type { PropsDoFormulario } from './tipos';

const ORDEM = ['en', 'pt'] as const;

/** `title`: título da página em inglês, com a tradução embaixo. */
export function FormularioTitle({ valor, aoMudar, erros }: PropsDoFormulario) {
  const definir = ligador(valor, aoMudar, ORDEM);
  return (
    <>
      <CampoTexto
        rotulo="Título em inglês"
        chave="en"
        valor={valor.en}
        aoMudar={definir('en')}
        obrigatorio
        erros={erros.em('en')}
        placeholder="Ex.: My family"
      />
      <CampoTexto
        rotulo="Tradução em português"
        chave="pt"
        valor={valor.pt}
        aoMudar={definir('pt')}
        obrigatorio
        erros={erros.em('pt')}
        placeholder="Ex.: Minha família"
      />
      <CamposDesconhecidos objeto={valor} conhecidos={ORDEM} erros={erros} aoMudar={aoMudar} />
    </>
  );
}
