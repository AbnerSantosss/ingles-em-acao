import { CampoTexto, CamposDesconhecidos } from './campos';
import { ligador } from './objeto';
import type { PropsDoFormulario } from './tipos';

const ORDEM = ['kicker', 'title', 'body'] as const;

/** `next`: chamada para a próxima aula, no fim da última página. */
export function FormularioNext({ valor, aoMudar, erros }: PropsDoFormulario) {
  const definir = ligador(valor, aoMudar, ORDEM);
  return (
    <>
      <CampoTexto
        rotulo="Rótulo"
        chave="kicker"
        valor={valor.kicker}
        aoMudar={definir('kicker')}
        obrigatorio
        erros={erros.em('kicker')}
        placeholder="Ex.: PRÓXIMA AULA"
      />
      <CampoTexto
        rotulo="Título"
        chave="title"
        valor={valor.title}
        aoMudar={definir('title')}
        obrigatorio
        erros={erros.em('title')}
        placeholder="Ex.: Aula 08 — Daily routine"
        ajuda="A publicação confere se a aula citada aqui existe."
      />
      <CampoTexto
        rotulo="Texto de apoio"
        chave="body"
        valor={valor.body}
        aoMudar={definir('body')}
        erros={erros.em('body')}
        ajuda="Opcional."
      />
      <CamposDesconhecidos objeto={valor} conhecidos={ORDEM} erros={erros} aoMudar={aoMudar} />
    </>
  );
}
