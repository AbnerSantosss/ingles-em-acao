import { CampoTexto, CamposDesconhecidos, Secao } from './campos';
import { ligador } from './objeto';
import { PADRAO_SOLIDO_TEAL, SeletorDeSolido, SeletorDeVariante } from './paleta';
import type { PropsDoFormulario } from './tipos';

const ORDEM = ['kicker', 'from', 'to', 'ex', 'tr', 'v', 'c'] as const;

/** `rule`: regra gramatical "de → para", com exemplo e tradução. */
export function FormularioRule({ valor, aoMudar, erros }: PropsDoFormulario) {
  const definir = ligador(valor, aoMudar, ORDEM);
  return (
    <>
      <CampoTexto
        rotulo="Rótulo da regra"
        chave="kicker"
        valor={valor.kicker}
        aoMudar={definir('kicker')}
        obrigatorio
        erros={erros.em('kicker')}
        placeholder="Ex.: HE / SHE / IT"
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <CampoTexto
          rotulo="De"
          chave="from"
          valor={valor.from}
          aoMudar={definir('from')}
          obrigatorio
          erros={erros.em('from')}
          placeholder="Ex.: I work"
        />
        <CampoTexto
          rotulo="Para"
          chave="to"
          valor={valor.to}
          aoMudar={definir('to')}
          obrigatorio
          erros={erros.em('to')}
          placeholder="Ex.: She works"
        />
      </div>
      <CampoTexto
        rotulo="Exemplo em inglês"
        chave="ex"
        valor={valor.ex}
        aoMudar={definir('ex')}
        obrigatorio
        erros={erros.em('ex')}
      />
      <CampoTexto
        rotulo="Tradução do exemplo"
        chave="tr"
        valor={valor.tr}
        aoMudar={definir('tr')}
        obrigatorio
        erros={erros.em('tr')}
      />
      <Secao titulo="Aparência">
        <SeletorDeVariante valor={valor.v} aoMudar={definir('v')} erros={erros.em('v')} />
        <SeletorDeSolido
          valor={valor.c}
          aoMudar={definir('c')}
          erros={erros.em('c')}
          padrao={PADRAO_SOLIDO_TEAL}
          ajuda="Traço lateral, rótulo, seta e o quadro do lado “Para”."
        />
      </Secao>
      <CamposDesconhecidos objeto={valor} conhecidos={ORDEM} erros={erros} aoMudar={aoMudar} />
    </>
  );
}
