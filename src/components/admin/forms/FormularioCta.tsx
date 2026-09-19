import {
  AvisoDeFormato,
  CampoTexto,
  CamposDesconhecidos,
  GrupoDeOpcoes,
  ListaDeItens,
  Secao,
  type Opcao,
} from './campos';
import { ehObjeto, ligador, resumirValor, type Objeto } from './objeto';
import { PADRAO_SOLIDO_CTA, SeletorDeSolido, SeletorDeVariante } from './paleta';
import type { PropsDoFormulario } from './tipos';
import type { Erros } from './validacao';

const ORDEM = ['items'] as const;
const ORDEM_DO_ITEM = ['icon', 'title', 'body', 'plan', 'btn', 'c', 'v'] as const;

function Amostra({ simbolo, fundo }: { simbolo: string; fundo: string }) {
  return (
    <span
      aria-hidden="true"
      className="grid size-7 flex-none place-items-center rounded-full text-[13px] text-white"
      style={{ background: fundo }}
    >
      {simbolo}
    </span>
  );
}

const ICONES: readonly Opcao[] = [
  {
    chave: 'play',
    rotulo: 'Videoaula',
    detalhe: 'ícone ▶ · WSA Premium',
    amostra: <Amostra simbolo="▶" fundo="#0E9BAE" />,
  },
  {
    chave: 'mic',
    rotulo: 'Prática oral com IA',
    detalhe: 'ícone 🎙 · WSA Premium',
    amostra: <Amostra simbolo="🎙" fundo="#5B21B6" />,
  },
];

/** Chamada nova: ícone oposto ao da última (o par comum é videoaula + prática oral). */
function novaChamada(lista: readonly unknown[]): Objeto {
  const ultimo = lista.at(-1);
  const icone = ehObjeto(ultimo) && ultimo.icon === 'play' ? 'mic' : 'play';
  return { icon: icone, title: '', body: '', plan: '', btn: '' };
}

function CampoIcone({
  valor,
  aoMudar,
  erros,
}: {
  valor: unknown;
  aoMudar: (novo: string) => void;
  erros: readonly string[];
}) {
  if (valor !== undefined && typeof valor !== 'string') {
    return <AvisoDeFormato rotulo="Tipo de chamada" chave="icon" bruto={valor} erros={erros} />;
  }
  const conhecido = valor === 'play' || valor === 'mic';
  const opcoes: Opcao[] =
    valor === undefined || conhecido
      ? [...ICONES]
      : // Valor fora da lista continua visível (e com erro) até o admin escolher outro.
        [...ICONES, { chave: valor, rotulo: `Atual: ${resumirValor(valor)}`, detalhe: 'fora do permitido' }];
  return (
    <GrupoDeOpcoes
      legenda="Tipo de chamada"
      opcoes={opcoes}
      selecionada={valor ?? null}
      aoEscolher={(chave) => {
        if (chave === 'play' || chave === 'mic') aoMudar(chave);
      }}
      erros={erros}
      larguraMinima={180}
    />
  );
}

function Chamada({
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
      <CampoIcone valor={item.icon} aoMudar={definir('icon')} erros={erros.em('icon')} />
      <CampoTexto
        rotulo="Título"
        chave="title"
        valor={item.title}
        aoMudar={definir('title')}
        obrigatorio
        erros={erros.em('title')}
        placeholder="Ex.: ASSISTA À VIDEOAULA 02"
      />
      <CampoTexto
        rotulo="Texto"
        chave="body"
        valor={item.body}
        aoMudar={definir('body')}
        obrigatorio
        erros={erros.em('body')}
        linhas={2}
      />
      <CampoTexto
        rotulo="Plano"
        chave="plan"
        valor={item.plan}
        aoMudar={definir('plan')}
        obrigatorio
        erros={erros.em('plan')}
        placeholder="Ex.: EXCLUSIVO DO WSA PREMIUM"
      />
      <CampoTexto
        rotulo="Texto do botão"
        chave="btn"
        valor={item.btn}
        aoMudar={definir('btn')}
        obrigatorio
        erros={erros.em('btn')}
        placeholder="Ex.: TOQUE PARA ASSISTIR"
      />
      <Secao titulo="Aparência">
        <SeletorDeVariante
          rotulo="Cor do cartão"
          valor={item.v}
          aoMudar={definir('v')}
          erros={erros.em('v')}
          ajuda="Teal, roxo e marinho deixam o texto branco."
        />
        <SeletorDeSolido
          rotulo="Cor do botão"
          valor={item.c}
          aoMudar={definir('c')}
          erros={erros.em('c')}
          padrao={PADRAO_SOLIDO_CTA}
        />
      </Secao>
      <CamposDesconhecidos objeto={item} conhecidos={ORDEM_DO_ITEM} erros={erros} aoMudar={aoMudar} />
    </>
  );
}

/**
 * `cta`: chamadas para videoaula e prática oral. O tipo de chamada decide o plano
 * que libera o recurso e a mensagem que o aluno vê ao tocar no botão.
 */
export function FormularioCta({ valor, aoMudar, erros }: PropsDoFormulario) {
  const definir = ligador(valor, aoMudar, ORDEM);
  return (
    <>
      <ListaDeItens
        rotulo="Chamadas"
        chave="items"
        nomeDoItem="chamada"
        valor={valor.items}
        aoMudar={definir('items')}
        novoItem={novaChamada}
        erros={erros.filho('items')}
        resumoDoItem={(item) => (typeof item.title === 'string' ? item.title : undefined)}
        renderizar={(item, mudarItem, i) => (
          <Chamada item={item} aoMudar={mudarItem} erros={erros.filho('items', i)} />
        )}
      />
      <CamposDesconhecidos objeto={valor} conhecidos={ORDEM} erros={erros} aoMudar={aoMudar} />
    </>
  );
}
