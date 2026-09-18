import { CampoLigado, CampoTexto, CamposDesconhecidos, Secao } from './campos';
import { ligador } from './objeto';
import { SeletorDeVariante } from './paleta';
import type { PropsDoFormulario } from './tipos';

const ORDEM = ['text', 'v', 'kicker', 'bar', 'bold', 'center'] as const;

/** `note`: caixa de texto com fundo colorido, rótulo roxo opcional e três ajustes de estilo. */
export function FormularioNote({ valor, aoMudar, erros }: PropsDoFormulario) {
  const definir = ligador(valor, aoMudar, ORDEM);
  return (
    <>
      <CampoTexto
        rotulo="Rótulo"
        chave="kicker"
        valor={valor.kicker}
        aoMudar={definir('kicker')}
        erros={erros.em('kicker')}
        ajuda="Opcional. Aparece em roxo, em caixa alta, acima do texto."
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
        <CampoLigado
          rotulo="Barra amarela à esquerda"
          chave="bar"
          valor={valor.bar}
          aoMudar={definir('bar')}
          erros={erros.em('bar')}
        />
        <CampoLigado
          rotulo="Texto em negrito"
          chave="bold"
          valor={valor.bold}
          aoMudar={definir('bold')}
          erros={erros.em('bold')}
        />
        <CampoLigado
          rotulo="Centralizado"
          chave="center"
          valor={valor.center}
          aoMudar={definir('center')}
          erros={erros.em('center')}
        />
      </Secao>
      <CamposDesconhecidos objeto={valor} conhecidos={ORDEM} erros={erros} aoMudar={aoMudar} />
    </>
  );
}
