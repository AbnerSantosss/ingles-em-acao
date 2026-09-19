/**
 * Seletores de cor dos blocos, com os nomes REAIS da paleta (`V` e `SOLID` de
 * `@/lib/ui/palette`) — é o nome que vai para o JSON — e uma amostra desenhada
 * com as mesmas cores que o renderer da aula usa.
 *
 * - `v` (variante): fundo + borda + texto + destaque. Ausente = `gray`.
 * - `c` (sólida): chip, etiqueta, traço, botão. O esquema aceita também os nomes
 *   de variante em `c`, mas o renderer procura em `SOLID` e cai na cor padrão —
 *   esse caso aparece como opção à parte, marcada, para o valor não sumir.
 */
'use client';

import { useId, useState, type ReactNode } from 'react';

import {
  SOLID,
  SOLID_FG,
  V,
  VARIANT_NAMES,
  SOLID_NAMES,
  isSolidName,
  isVariantName,
  type SolidName,
  type VariantName,
} from '@/lib/ui/palette';

import { AvisoDeFormato, GrupoDeOpcoes, juntarErros, type Opcao } from './campos';
import { resumirValor } from './objeto';

/** Tradução só para ajudar a ler — o valor gravado é sempre o nome em inglês. */
const NOME_EM_PORTUGUES: Record<VariantName | SolidName, string> = {
  gray: 'cinza',
  white: 'branco',
  mint: 'menta',
  lilac: 'lilás',
  cream: 'creme',
  navy: 'marinho',
  teal: 'verde-água',
  purple: 'roxo',
  yellow: 'amarelo',
  blue: 'azul',
  red: 'vermelho',
  green: 'verde',
  plain: 'sem fundo',
  orange: 'laranja',
};

const PADRAO = '__padrao__';
const ATUAL = '__atual__';

function AmostraDeVariante({ nome }: { nome: VariantName }) {
  const cor = V[nome];
  const transparente = nome === 'plain';
  return (
    <span
      aria-hidden="true"
      className="relative grid h-8 w-11 flex-none place-items-center overflow-hidden rounded-[8px] text-[13px] font-black"
      style={{
        background: transparente ? 'repeating-conic-gradient(#E3EAF3 0 25%, #FFFFFF 0 50%) 0 0 / 10px 10px' : cor.bg,
        border: `1.5px ${transparente ? 'dashed' : 'solid'} ${transparente ? '#A9B4C4' : cor.bd}`,
        color: cor.fg,
      }}
    >
      Aa
      <span className="absolute inset-x-0 bottom-0 h-[4px]" style={{ background: cor.kick }} />
    </span>
  );
}

function AmostraSolida({ hex, texto }: { hex: string; texto: string }) {
  return (
    <span
      aria-hidden="true"
      className="grid h-8 w-8 flex-none place-items-center rounded-full text-[11px] font-black"
      style={{ background: hex, color: texto, border: '1.5px solid rgba(10,31,78,0.18)' }}
    >
      A
    </span>
  );
}

/**
 * Casca comum: mostra a cor atual e um botão "Trocar cor" que abre a grade.
 * Fechada por padrão — um bloco com 10 itens teria 140 ladrilhos abertos.
 */
function SeletorDeCor({
  rotulo,
  chave,
  opcoes,
  selecionada,
  aoEscolher,
  erros,
  resumoAtual,
  amostraAtual,
  ajuda,
}: {
  rotulo: string;
  chave: string;
  opcoes: readonly Opcao[];
  selecionada: string;
  aoEscolher: (chave: string) => void;
  erros?: readonly string[];
  resumoAtual: ReactNode;
  amostraAtual: ReactNode;
  ajuda?: ReactNode;
}) {
  const base = useId();
  const idPainel = `${base}-painel`;
  const idResumo = `${base}-resumo`;
  const [aberto, setAberto] = useState(false);
  const erro = juntarErros(erros);
  return (
    <div className="flex flex-col gap-2">
      <span className="text-[13px] font-extrabold uppercase tracking-[0.1em] text-muted">
        {rotulo}
        <code
          aria-hidden="true"
          className="ml-2 font-mono text-[11px] font-bold normal-case tracking-normal text-muted-2"
        >
          {chave}
        </code>
      </span>
      <div className="flex flex-wrap items-center gap-3">
        {amostraAtual}
        <span id={idResumo} className="min-w-0 flex-1 text-[14px] font-extrabold text-navy">
          {resumoAtual}
        </span>
        <button
          type="button"
          onClick={() => setAberto((estava) => !estava)}
          aria-expanded={aberto}
          aria-controls={idPainel}
          aria-describedby={idResumo}
          className="min-h-11 rounded-pill border-[1.5px] border-solid border-border bg-surface px-4 text-[13px] font-extrabold text-navy hover:border-navy-light"
        >
          {aberto ? 'Fechar cores' : `Trocar ${rotulo.toLowerCase()}`}
        </button>
      </div>
      {ajuda ? <p className="m-0 text-[13px] leading-snug text-muted-2">{ajuda}</p> : null}
      <div id={idPainel} hidden={!aberto}>
        {aberto ? (
          <GrupoDeOpcoes
            legenda={rotulo}
            legendaVisivel={false}
            opcoes={opcoes}
            selecionada={selecionada}
            aoEscolher={aoEscolher}
            larguraMinima={132}
          />
        ) : null}
      </div>
      {erro ? (
        <p role="alert" className="m-0 text-[14px] font-semibold leading-snug text-danger">
          {erro}
        </p>
      ) : null}
    </div>
  );
}

/** Campo `v`: as 13 variantes da paleta `V`. Ausente = `gray` (fallback do renderer). */
export function SeletorDeVariante({
  rotulo = 'Cor de fundo',
  chave = 'v',
  valor,
  aoMudar,
  erros,
  ajuda,
}: {
  rotulo?: string;
  chave?: string;
  valor: unknown;
  aoMudar: (novo: string | undefined) => void;
  erros?: readonly string[];
  ajuda?: ReactNode;
}) {
  if (valor !== undefined && typeof valor !== 'string') {
    return <AvisoDeFormato rotulo={rotulo} chave={chave} bruto={valor} erros={erros} />;
  }

  const opcoes: Opcao[] = [
    {
      chave: PADRAO,
      rotulo: 'Padrão',
      detalhe: 'sem campo (gray)',
      amostra: <AmostraDeVariante nome="gray" />,
    },
    ...VARIANT_NAMES.map((nome) => ({
      chave: nome,
      rotulo: <code className="font-mono">{nome}</code>,
      detalhe: NOME_EM_PORTUGUES[nome],
      amostra: <AmostraDeVariante nome={nome} />,
    })),
  ];

  const valido = valor !== undefined && isVariantName(valor);
  if (valor !== undefined && !valido) {
    opcoes.push({
      chave: ATUAL,
      rotulo: <code className="font-mono">{resumirValor(valor)}</code>,
      detalhe: 'valor atual, fora da paleta',
      amostra: <AmostraDeVariante nome="gray" />,
    });
  }
  const selecionada = valor === undefined ? PADRAO : valido ? valor : ATUAL;

  return (
    <SeletorDeCor
      rotulo={rotulo}
      chave={chave}
      opcoes={opcoes}
      selecionada={selecionada}
      erros={erros}
      ajuda={ajuda}
      amostraAtual={<AmostraDeVariante nome={valido ? valor : 'gray'} />}
      resumoAtual={
        valor === undefined ? (
          <>Padrão (gray, {NOME_EM_PORTUGUES.gray})</>
        ) : valido ? (
          <>
            <code className="font-mono">{valor}</code> · {NOME_EM_PORTUGUES[valor]}
          </>
        ) : (
          <>
            <code className="font-mono">{valor}</code> · fora da paleta: a aula mostra gray
          </>
        )
      }
      aoEscolher={(chave) => {
        if (chave === PADRAO) aoMudar(undefined);
        else if (chave !== ATUAL) aoMudar(chave);
      }}
    />
  );
}

/**
 * Campo `c`: as 8 cores sólidas de `SOLID`.
 * `padrao` é a cor que o renderer daquele bloco usa quando `c` falta
 * (`#0E9BAE` na maioria; o `cta` usa marinho).
 */
export function SeletorDeSolido({
  rotulo = 'Cor de destaque',
  chave = 'c',
  valor,
  aoMudar,
  erros,
  padrao,
  ajuda,
}: {
  rotulo?: string;
  chave?: string;
  valor: unknown;
  aoMudar: (novo: string | undefined) => void;
  erros?: readonly string[];
  padrao: { hex: string; texto: string; descricao: string };
  ajuda?: ReactNode;
}) {
  if (valor !== undefined && typeof valor !== 'string') {
    return <AvisoDeFormato rotulo={rotulo} chave={chave} bruto={valor} erros={erros} />;
  }

  const opcoes: Opcao[] = [
    {
      chave: PADRAO,
      rotulo: 'Padrão',
      detalhe: `sem campo (${padrao.descricao})`,
      amostra: <AmostraSolida hex={padrao.hex} texto={padrao.texto} />,
    },
    ...SOLID_NAMES.map((nome) => ({
      chave: nome,
      rotulo: <code className="font-mono">{nome}</code>,
      detalhe: NOME_EM_PORTUGUES[nome],
      amostra: <AmostraSolida hex={SOLID[nome]} texto={SOLID_FG[nome]} />,
    })),
  ];

  const solida = valor !== undefined && isSolidName(valor);
  // Nome de variante em `c`: o esquema aceita, mas o renderer não acha em SOLID.
  const soDeVariante = valor !== undefined && !solida && isVariantName(valor);
  if (valor !== undefined && !solida) {
    opcoes.push({
      chave: ATUAL,
      rotulo: <code className="font-mono">{valor}</code>,
      detalhe: soDeVariante ? 'valor atual, fora das sólidas' : 'valor atual, fora da paleta',
      amostra: <AmostraSolida hex={padrao.hex} texto={padrao.texto} />,
    });
  }
  const selecionada = valor === undefined ? PADRAO : solida ? valor : ATUAL;

  return (
    <SeletorDeCor
      rotulo={rotulo}
      chave={chave}
      opcoes={opcoes}
      selecionada={selecionada}
      erros={erros}
      ajuda={ajuda}
      amostraAtual={
        solida ? (
          <AmostraSolida hex={SOLID[valor]} texto={SOLID_FG[valor]} />
        ) : (
          <AmostraSolida hex={padrao.hex} texto={padrao.texto} />
        )
      }
      resumoAtual={
        valor === undefined ? (
          <>Padrão ({padrao.descricao})</>
        ) : solida ? (
          <>
            <code className="font-mono">{valor}</code> · {NOME_EM_PORTUGUES[valor]}
          </>
        ) : soDeVariante ? (
          <>
            <code className="font-mono">{valor}</code> · não é cor sólida: a aula mostra a cor
            padrão ({padrao.descricao})
          </>
        ) : (
          <>
            <code className="font-mono">{valor}</code> · fora da paleta
          </>
        )
      }
      aoEscolher={(chave) => {
        if (chave === PADRAO) aoMudar(undefined);
        else if (chave !== ATUAL) aoMudar(chave);
      }}
    />
  );
}

/** Cor que `solid()` devolve quando `c` falta ou não é sólida (cards, rule, free). */
export const PADRAO_SOLIDO_TEAL = { hex: '#0E9BAE', texto: '#FFFFFF', descricao: 'teal claro' } as const;

/** Cor do botão do `cta` quando `c` falta (`SOLID[c] || "#0F2050"` do protótipo). */
export const PADRAO_SOLIDO_CTA = { hex: '#0F2050', texto: '#FFFFFF', descricao: 'marinho' } as const;
