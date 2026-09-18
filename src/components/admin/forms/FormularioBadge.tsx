import { CampoTexto, CamposDesconhecidos } from './campos';
import { ligador } from './objeto';
import type { PropsDoFormulario } from './tipos';

const ORDEM = ['label', 'page'] as const;

/** `badge`: o selo do topo da página ("AULA 07") e, opcionalmente, a página ("PÁGINA 02"). */
export function FormularioBadge({ valor, aoMudar, erros }: PropsDoFormulario) {
  const definir = ligador(valor, aoMudar, ORDEM);
  return (
    <>
      <CampoTexto
        rotulo="Texto do selo"
        chave="label"
        valor={valor.label}
        aoMudar={definir('label')}
        obrigatorio
        erros={erros.em('label')}
        placeholder="Ex.: AULA 07"
      />
      <CampoTexto
        rotulo="Página"
        chave="page"
        valor={valor.page}
        aoMudar={definir('page')}
        erros={erros.em('page')}
        placeholder="Ex.: PÁGINA 02"
        ajuda="Opcional. Deixe vazio para não mostrar."
      />
      <CamposDesconhecidos objeto={valor} conhecidos={ORDEM} erros={erros} aoMudar={aoMudar} />
    </>
  );
}
