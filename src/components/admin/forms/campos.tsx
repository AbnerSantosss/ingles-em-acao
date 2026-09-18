/**
 * Campos reutilizados pelos formulários de bloco.
 *
 * Regra comum: o campo recebe o valor BRUTO do JSON (`unknown`). Se o valor não
 * tiver o formato que o campo sabe editar (objeto num campo de texto, lista que
 * não é lista…), o campo não se desenha como editável — mostra um aviso para
 * corrigir no modo JSON. Assim o formulário nunca sobrescreve um dado que não
 * entendeu.
 */
'use client';

import { useEffect, useId, useRef, useState, type ReactNode } from 'react';

import { BotaoDeItem, COR_AVISO, COR_ERRO, TextoComCodigo } from '@/components/admin/editor/ui';
import { Button } from '@/components/ui/Button';
import { Field } from '@/components/ui/Field';
import { Input } from '@/components/ui/Input';
import { cn } from '@/lib/ui/cn';

import {
  camposForaDoFormulario,
  copiaProfunda,
  ehObjeto,
  inserirEm,
  lerTexto,
  mover,
  removerEm,
  resumirValor,
  semCampo,
  trocarEm,
  type Objeto,
} from './objeto';
import type { Erros } from './validacao';

// ───────────────────────────── peças visuais ─────────────────────────────

const ROTULO = 'text-[13px] font-extrabold uppercase tracking-[0.1em] text-muted';

const CAIXA_DE_TEXTO = cn(
  'block w-full resize-y rounded-field border-[1.5px] border-solid border-border bg-bg',
  'px-4 py-3 text-[16px] font-bold leading-[1.45] text-navy',
  'placeholder:font-medium placeholder:text-muted-2',
  'focus:border-blue focus:shadow-[0_0_0_3px_rgba(27,107,227,0.22)] focus-visible:outline-hidden',
  'aria-invalid:border-danger',
);

export function juntarErros(erros: readonly string[] | undefined): string | undefined {
  return erros && erros.length > 0 ? erros.join(' ') : undefined;
}

/** Rótulo do campo + a chave do JSON em miúdo, para quem alterna com o modo JSON. */
function RotuloDoCampo({ rotulo, chave }: { rotulo: string; chave?: string }) {
  return (
    <>
      {rotulo}
      {chave ? (
        <code
          aria-hidden="true"
          className="ml-2 font-mono text-[11px] font-bold normal-case tracking-normal text-muted-2"
        >
          {chave}
        </code>
      ) : null}
    </>
  );
}

function MensagemDeErro({ id, texto }: { id?: string; texto: string | undefined }) {
  if (!texto) return null;
  return (
    <p id={id} role="alert" className="m-0 text-[14px] font-semibold leading-snug text-danger">
      <TextoComCodigo texto={texto} />
    </p>
  );
}

/** Grupo visual de campos (ex.: "Aparência", "Imagem do cartão"). */
export function Secao({
  titulo,
  ajuda,
  children,
}: {
  titulo: string;
  ajuda?: ReactNode;
  children: ReactNode;
}) {
  return (
    <fieldset className="m-0 flex min-w-0 flex-col gap-4 rounded-[16px] border-[1.5px] border-solid border-border px-3 pb-3 pt-1">
      <legend className="kicker px-1">{titulo}</legend>
      {ajuda ? <p className="m-0 text-[13px] font-semibold leading-snug text-muted-2">{ajuda}</p> : null}
      {children}
    </fieldset>
  );
}

/** Valor que o formulário não sabe editar: mostra o que é e manda para o JSON. */
export function AvisoDeFormato({
  rotulo,
  chave,
  bruto,
  erros,
}: {
  rotulo: string;
  chave?: string;
  bruto: unknown;
  erros?: readonly string[];
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className={ROTULO}>
        <RotuloDoCampo rotulo={rotulo} chave={chave} />
      </span>
      <div
        className="rounded-field border-[1.5px] border-solid px-3 py-2.5 text-[13px] font-bold leading-snug"
        style={{ background: COR_AVISO.fundo, borderColor: COR_AVISO.borda, color: COR_AVISO.texto }}
      >
        Formato inesperado ({resumirValor(bruto)}). O formulário não mexe neste campo para não
        apagar nada — corrija no modo JSON.
      </div>
      <MensagemDeErro texto={juntarErros(erros)} />
    </div>
  );
}

// ───────────────────────────── texto ─────────────────────────────

/**
 * Campo de texto ligado a uma chave do JSON.
 *
 * Opcional vazio → a chave sai do JSON (o esquema não aceita `""` nesses campos).
 * Obrigatório vazio → fica `""`, e o erro do esquema aparece ao lado.
 */
export function CampoTexto({
  rotulo,
  chave,
  valor,
  aoMudar,
  obrigatorio = false,
  erros,
  ajuda,
  linhas,
  placeholder,
  vazioPermitido = false,
}: {
  rotulo: string;
  chave?: string;
  valor: unknown;
  aoMudar: (novo: string | undefined) => void;
  obrigatorio?: boolean;
  erros?: readonly string[];
  ajuda?: ReactNode;
  /** Quando presente, vira caixa de várias linhas com essa altura inicial. */
  linhas?: number;
  placeholder?: string;
  /** Campo obrigatório que aceita `""` (ex.: `ideas` do `free`). */
  vazioPermitido?: boolean;
}) {
  const leitura = lerTexto(valor);
  if (leitura.tipo === 'estranho') {
    return <AvisoDeFormato rotulo={rotulo} chave={chave} bruto={leitura.bruto} erros={erros} />;
  }

  const mudar = (texto: string) => {
    if (texto === '' && !obrigatorio && !vazioPermitido) aoMudar(undefined);
    else aoMudar(texto);
  };

  return (
    <Field
      label={<RotuloDoCampo rotulo={rotulo} chave={chave} />}
      required={obrigatorio && !vazioPermitido}
      error={juntarErros(erros)}
      hint={ajuda}
    >
      {linhas ? (
        <textarea
          value={leitura.valor}
          onChange={(evento) => mudar(evento.target.value)}
          rows={linhas}
          placeholder={placeholder}
          className={CAIXA_DE_TEXTO}
        />
      ) : (
        <Input
          value={leitura.valor}
          onChange={(evento) => mudar(evento.target.value)}
          placeholder={placeholder}
        />
      )}
    </Field>
  );
}

/** Texto que não se edita aqui (ex.: `id`). Continua focável e legível por leitor de tela. */
export function CampoSomenteLeitura({
  rotulo,
  chave,
  valor,
  ajuda,
  erros,
}: {
  rotulo: string;
  chave?: string;
  valor: unknown;
  ajuda?: ReactNode;
  erros?: readonly string[];
}) {
  return (
    <Field label={<RotuloDoCampo rotulo={rotulo} chave={chave} />} hint={ajuda} error={juntarErros(erros)}>
      <input
        readOnly
        aria-readonly="true"
        value={valor === undefined ? '(sem valor)' : typeof valor === 'string' ? valor : resumirValor(valor)}
        className="block h-11 w-full cursor-default rounded-field border-[1.5px] border-dashed border-border bg-[#EEF2F8] px-4 font-mono text-[15px] font-bold text-muted-2"
      />
    </Field>
  );
}

// ───────────────────────────── liga/desliga ─────────────────────────────

/** Booleano opcional: marcado grava `true`; desmarcado tira a chave (o padrão é desligado). */
export function CampoLigado({
  rotulo,
  chave,
  valor,
  aoMudar,
  ajuda,
  erros,
}: {
  rotulo: string;
  chave?: string;
  valor: unknown;
  aoMudar: (novo: true | undefined) => void;
  ajuda?: string;
  erros?: readonly string[];
}) {
  const base = useId();
  if (valor !== undefined && typeof valor !== 'boolean') {
    return <AvisoDeFormato rotulo={rotulo} chave={chave} bruto={valor} erros={erros} />;
  }
  const idAjuda = `${base}-ajuda`;
  const idErro = `${base}-erro`;
  const erro = juntarErros(erros);
  const descrito = [ajuda ? idAjuda : null, erro ? idErro : null].filter(Boolean).join(' ');
  return (
    <div className="flex flex-col gap-1">
      <label className="flex min-h-11 cursor-pointer items-center gap-3 rounded-[12px] px-1 text-[15px] font-extrabold text-navy has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-blue">
        <input
          type="checkbox"
          checked={valor === true}
          onChange={(evento) => aoMudar(evento.target.checked ? true : undefined)}
          aria-describedby={descrito || undefined}
          aria-invalid={erro ? true : undefined}
          className="size-5 flex-none accent-[#1B6BE3]"
        />
        <span>
          <RotuloDoCampo rotulo={rotulo} chave={chave} />
        </span>
      </label>
      {ajuda ? (
        <p id={idAjuda} className="m-0 pl-9 text-[13px] leading-snug text-muted-2">
          {ajuda}
        </p>
      ) : null}
      <MensagemDeErro id={idErro} texto={erro} />
    </div>
  );
}

// ───────────────────────────── opções ─────────────────────────────

export type Opcao = {
  chave: string;
  rotulo: ReactNode;
  detalhe?: ReactNode;
  amostra?: ReactNode;
};

/**
 * Grupo de rádios em "ladrilhos" de 44px. O rádio nativo fica escondido
 * visualmente mas é ele que recebe foco e setas — o ladrilho só desenha.
 */
export function GrupoDeOpcoes({
  legenda,
  legendaVisivel = true,
  opcoes,
  selecionada,
  aoEscolher,
  erros,
  larguraMinima = 128,
}: {
  legenda: ReactNode;
  legendaVisivel?: boolean;
  opcoes: readonly Opcao[];
  selecionada: string | null;
  aoEscolher: (chave: string) => void;
  erros?: readonly string[];
  larguraMinima?: number;
}) {
  const nome = useId();
  const idErro = `${nome}-erro`;
  const erro = juntarErros(erros);
  return (
    <fieldset className="m-0 min-w-0 border-0 p-0" aria-describedby={erro ? idErro : undefined}>
      <legend className={legendaVisivel ? cn(ROTULO, 'mb-2 p-0') : 'sr-only'}>{legenda}</legend>
      <div
        className="grid gap-2"
        style={{ gridTemplateColumns: `repeat(auto-fill, minmax(min(100%, ${larguraMinima}px), 1fr))` }}
      >
        {opcoes.map((opcao) => {
          const marcada = opcao.chave === selecionada;
          return (
            <label
              key={opcao.chave}
              className={cn(
                'relative flex min-h-11 cursor-pointer items-center gap-2 rounded-[12px] border-[1.5px] border-solid px-2.5 py-1.5 text-[13px] font-extrabold text-navy',
                'has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-blue',
                marcada ? 'border-blue bg-[#EAF2FE]' : 'border-border bg-surface hover:border-navy-light',
              )}
            >
              <input
                type="radio"
                name={nome}
                value={opcao.chave}
                checked={marcada}
                onChange={() => aoEscolher(opcao.chave)}
                className="sr-only"
              />
              {opcao.amostra}
              <span className="flex min-w-0 flex-col leading-tight">
                <span className="break-words">{opcao.rotulo}</span>
                {opcao.detalhe ? (
                  <span className="text-[11px] font-bold text-muted">{opcao.detalhe}</span>
                ) : null}
              </span>
              {marcada ? (
                <span aria-hidden="true" className="ml-auto pl-1 text-[15px] font-black text-blue">
                  ✓
                </span>
              ) : null}
            </label>
          );
        })}
      </div>
      <MensagemDeErro id={idErro} texto={erro} />
    </fieldset>
  );
}

/**
 * `cols` de `cards`/`free`: ausente = 1 coluna (padrão do renderer).
 * Um `1` explícito que já estava no JSON continua `1`; só "2 colunas" grava `2`.
 */
export function CampoColunas({
  valor,
  aoMudar,
  erros,
}: {
  valor: unknown;
  aoMudar: (novo: 1 | 2 | undefined) => void;
  erros?: readonly string[];
}) {
  const atual = valor === undefined || valor === 1 ? 'uma' : valor === 2 ? 'duas' : 'outro';
  const opcoes: Opcao[] = [
    { chave: 'uma', rotulo: '1 coluna', detalhe: 'um embaixo do outro (padrão)' },
    { chave: 'duas', rotulo: '2 colunas', detalhe: 'lado a lado quando cabe' },
  ];
  if (atual === 'outro') {
    opcoes.push({ chave: 'outro', rotulo: `Atual: ${resumirValor(valor)}`, detalhe: 'fora do permitido' });
  }
  return (
    <GrupoDeOpcoes
      legenda={<RotuloDoCampo rotulo="Colunas" chave="cols" />}
      opcoes={opcoes}
      selecionada={atual}
      erros={erros}
      aoEscolher={(chave) => {
        if (chave === 'duas') aoMudar(2);
        else if (chave === 'uma') aoMudar(valor === 1 ? 1 : undefined);
      }}
    />
  );
}

// ───────────────────────────── campos fora do formulário ─────────────────────────────

/**
 * Chaves do objeto que o formulário não desenha. Nunca somem sozinhas: ficam
 * listadas aqui, com o erro do esquema, e só saem com clique explícito.
 */
export function CamposDesconhecidos({
  objeto,
  conhecidos,
  erros,
  aoMudar,
}: {
  objeto: Objeto;
  conhecidos: readonly string[];
  erros: Erros;
  aoMudar: (novo: Objeto) => void;
}) {
  const extras = camposForaDoFormulario(objeto, conhecidos);
  if (extras.length === 0) return null;
  return (
    <div
      className="flex flex-col gap-2 rounded-field border-[1.5px] border-solid px-3 py-2.5"
      style={{ background: COR_AVISO.fundo, borderColor: COR_AVISO.borda, color: COR_AVISO.texto }}
    >
      <p className="m-0 text-[13px] font-black">Campos que este formulário não edita</p>
      <p className="m-0 text-[12px] font-bold leading-snug">
        Continuam no bloco exatamente como estão. Para mudar o valor, use o modo JSON.
      </p>
      <ul className="m-0 flex list-none flex-col gap-2 p-0">
        {extras.map((chave) => (
          <li key={chave} className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="min-w-0 text-[13px] font-bold">
              <code className="rounded-[6px] bg-white/70 px-1 font-mono">{chave}</code>:{' '}
              {resumirValor(objeto[chave])}
            </span>
            {erros.em(chave).map((mensagem, i) => (
              <span key={i} className="text-[12px] font-extrabold" style={{ color: COR_ERRO.texto }}>
                <TextoComCodigo texto={mensagem} />
              </span>
            ))}
            <button
              type="button"
              onClick={() => aoMudar(semCampo(objeto, chave))}
              className="ml-auto min-h-11 rounded-pill border-[1.5px] border-solid bg-white px-3 text-[12px] font-extrabold"
              style={{ borderColor: COR_ERRO.borda, color: COR_ERRO.texto }}
            >
              Remover <code className="font-mono">{chave}</code>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ───────────────────────────── listas ─────────────────────────────

function maiuscula(texto: string): string {
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

/**
 * ⚠️ As respostas de `fill`, `free` e `check` são gravadas por POSIÇÃO do item
 * (`fill:{id}:{i}`, `free:{id}:{i}`, `chk:{id}:{i}`). Com aluno respondendo,
 * mover, remover ou inserir no meio faz a resposta antiga aparecer no item
 * errado — o mesmo tipo de corrupção silenciosa do §6.2. Pede confirmação.
 */
function confirmarMudancaDePosicao(alunos: number | undefined, acao: string): boolean {
  if (!alunos || alunos <= 0) return true;
  return window.confirm(
    `${alunos} aluno(s) já responderam este exercício, e cada resposta fica presa à POSIÇÃO do item (1º, 2º, 3º…), não ao texto.\n\n` +
      `${acao} faz respostas antigas aparecerem no item errado.\n\nContinuar mesmo assim?`,
  );
}

function AvisoDePosicao({ alunos }: { alunos: number }) {
  return (
    <p
      className="m-0 rounded-field px-3 py-2 text-[12px] font-bold leading-snug"
      style={{ background: COR_AVISO.fundo, color: COR_AVISO.texto }}
    >
      {alunos} aluno(s) já responderam. As respostas ficam presas à posição de cada item: para
      não embaralhar, prefira acrescentar no fim e corrigir o texto no lugar.
    </p>
  );
}

type OperacoesDeLista = {
  subir: (i: number) => void;
  descer: (i: number) => void;
  duplicar: (i: number) => void;
  remover: (i: number) => void;
  adicionar: () => void;
  anuncio: string;
};

/** Operações comuns às duas listas, com anúncio para leitor de tela e foco no item novo. */
function useOperacoesDeLista({
  lista,
  aoMudar,
  novoItem,
  duplicarItem,
  nomeDoItem,
  alunosPresos,
  focar,
}: {
  lista: readonly unknown[];
  aoMudar: (lista: unknown[]) => void;
  novoItem: (lista: readonly unknown[]) => unknown;
  duplicarItem: (item: unknown) => unknown;
  nomeDoItem: string;
  alunosPresos?: number;
  focar: (indice: number) => void;
}): OperacoesDeLista {
  const [anuncio, setAnuncio] = useState('');
  const Nome = maiuscula(nomeDoItem);
  return {
    anuncio,
    subir: (i) => {
      if (i === 0 || !confirmarMudancaDePosicao(alunosPresos, 'Mover um item')) return;
      aoMudar(mover(lista, i, i - 1));
      setAnuncio(`${Nome} ${i + 1} movido para a posição ${i}.`);
    },
    descer: (i) => {
      if (i >= lista.length - 1 || !confirmarMudancaDePosicao(alunosPresos, 'Mover um item')) return;
      aoMudar(mover(lista, i, i + 1));
      setAnuncio(`${Nome} ${i + 1} movido para a posição ${i + 2}.`);
    },
    duplicar: (i) => {
      const noFim = i === lista.length - 1;
      if (!noFim && !confirmarMudancaDePosicao(alunosPresos, 'Inserir um item no meio da lista')) {
        return;
      }
      aoMudar(inserirEm(lista, i + 1, duplicarItem(lista[i])));
      setAnuncio(`${Nome} ${i + 1} duplicado; a cópia é o ${nomeDoItem} ${i + 2}.`);
      focar(i + 1);
    },
    remover: (i) => {
      if (!confirmarMudancaDePosicao(alunosPresos, 'Remover um item')) return;
      aoMudar(removerEm(lista, i));
      setAnuncio(`${Nome} ${i + 1} removido.`);
    },
    adicionar: () => {
      aoMudar([...lista, novoItem(lista)]);
      setAnuncio(`${Nome} ${lista.length + 1} adicionado no fim.`);
      focar(lista.length);
    },
  };
}

/** Foca o primeiro campo editável do item recém-criado, depois que ele aparece. */
function useFocoPendente(idDoItem: (indice: number) => string): (indice: number) => void {
  const pendente = useRef<number | null>(null);
  useEffect(() => {
    if (pendente.current === null) return;
    const alvo = document.getElementById(idDoItem(pendente.current));
    pendente.current = null;
    const campo = alvo?.matches('input,textarea')
      ? alvo
      : alvo?.querySelector<HTMLElement>(
          'input:not([readonly]):not([type=radio]):not([type=checkbox]),textarea',
        );
    campo?.focus();
  });
  return (indice) => {
    pendente.current = indice;
  };
}

function ControlesDoItem({
  indice,
  total,
  nome,
  ops,
}: {
  indice: number;
  total: number;
  nome: string;
  ops: OperacoesDeLista;
}) {
  const n = indice + 1;
  return (
    <div className="flex flex-none gap-1.5">
      <BotaoDeItem rotulo={`Subir ${nome} ${n}`} onClick={() => ops.subir(indice)} disabled={indice === 0}>
        ↑
      </BotaoDeItem>
      <BotaoDeItem
        rotulo={`Descer ${nome} ${n}`}
        onClick={() => ops.descer(indice)}
        disabled={indice === total - 1}
      >
        ↓
      </BotaoDeItem>
      <BotaoDeItem rotulo={`Duplicar ${nome} ${n}`} onClick={() => ops.duplicar(indice)}>
        ⧉
      </BotaoDeItem>
      <BotaoDeItem rotulo={`Remover ${nome} ${n}`} onClick={() => ops.remover(indice)} perigo>
        ✕
      </BotaoDeItem>
    </div>
  );
}

function CabecalhoDaLista({
  id,
  rotulo,
  chave,
  quantidade,
}: {
  id: string;
  rotulo: string;
  chave?: string;
  quantidade: number;
}) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-2">
      <p id={id} className={cn(ROTULO, 'm-0')}>
        <RotuloDoCampo rotulo={rotulo} chave={chave} />
      </p>
      <span className="text-[12px] font-extrabold text-muted-2">
        {quantidade} {quantidade === 1 ? 'item' : 'itens'}
      </span>
    </div>
  );
}

/**
 * Lista de objetos (cartões, lacunas, missões, chamadas): cada item num quadro,
 * com ↑ ↓ duplicar remover e "Adicionar" no fim.
 */
export function ListaDeItens({
  rotulo,
  chave,
  nomeDoItem,
  valor,
  aoMudar,
  novoItem,
  duplicarItem = copiaProfunda,
  renderizar,
  resumoDoItem,
  erros,
  alunosPresos,
}: {
  rotulo: string;
  chave?: string;
  /** Minúsculo, singular: "cartão", "lacuna"… */
  nomeDoItem: string;
  valor: unknown;
  aoMudar: (lista: unknown[]) => void;
  novoItem: (lista: readonly unknown[]) => unknown;
  duplicarItem?: (item: unknown) => unknown;
  renderizar: (item: Objeto, mudarItem: (novo: Objeto) => void, indice: number) => ReactNode;
  /** Texto curto ao lado do número do item (ex.: a etiqueta do cartão). */
  resumoDoItem?: (item: Objeto) => string | undefined;
  /** Erros a partir da própria lista (`erros.filho('items')`). */
  erros: Erros;
  /** > 0: as respostas dependem da posição do item — pede confirmação. */
  alunosPresos?: number;
}) {
  const base = useId();
  const idTitulo = `${base}-titulo`;
  const idDoItem = (i: number) => `${base}-item-${i}`;
  const focar = useFocoPendente(idDoItem);
  const lista: readonly unknown[] = Array.isArray(valor) ? valor : [];
  const ops = useOperacoesDeLista({
    lista,
    aoMudar,
    novoItem,
    duplicarItem,
    nomeDoItem,
    alunosPresos,
    focar,
  });

  if (valor !== undefined && !Array.isArray(valor)) {
    return <AvisoDeFormato rotulo={rotulo} chave={chave} bruto={valor} erros={erros.em()} />;
  }

  const Nome = maiuscula(nomeDoItem);

  return (
    <div role="group" aria-labelledby={idTitulo} className="flex flex-col gap-3">
      <CabecalhoDaLista id={idTitulo} rotulo={rotulo} chave={chave} quantidade={lista.length} />
      <MensagemDeErro texto={juntarErros(erros.em())} />
      {alunosPresos && alunosPresos > 0 ? <AvisoDePosicao alunos={alunosPresos} /> : null}

      {lista.length > 0 ? (
        <ol className="m-0 flex list-none flex-col gap-3 p-0">
          {lista.map((item, i) => {
            const qtdErros = erros.contarAbaixo(i);
            const resumo = ehObjeto(item) ? resumoDoItem?.(item) : undefined;
            return (
              <li
                // A lista não tem id estável por item; a posição é a identidade (e é
                // também a chave das respostas dos alunos).
                key={i}
                id={idDoItem(i)}
                className="rounded-[16px] border-[1.5px] border-solid bg-[#FBFCFE] p-3"
                style={{ borderColor: qtdErros > 0 ? COR_ERRO.borda : '#E3EAF3' }}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <p className="m-0 flex min-w-0 flex-1 flex-col">
                    <span className="text-[14px] font-black text-navy">
                      {Nome} {i + 1}
                    </span>
                    {resumo ? (
                      <span className="truncate text-[12px] font-bold text-muted">{resumo}</span>
                    ) : null}
                    {qtdErros > 0 ? (
                      <span className="text-[12px] font-extrabold" style={{ color: COR_ERRO.texto }}>
                        {qtdErros} erro(s) neste {nomeDoItem}
                      </span>
                    ) : null}
                  </p>
                  <ControlesDoItem indice={i} total={lista.length} nome={nomeDoItem} ops={ops} />
                </div>
                <div className="mt-3 flex flex-col gap-4">
                  {ehObjeto(item) ? (
                    renderizar(item, (novo) => aoMudar(trocarEm(lista, i, novo)), i)
                  ) : (
                    <AvisoDeFormato rotulo={`${Nome} ${i + 1}`} bruto={item} erros={erros.em(i)} />
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      ) : null}

      <div>
        <Button type="button" size="md" variant="ghost" onClick={ops.adicionar}>
          + Adicionar {nomeDoItem}
        </Button>
      </div>
      <p role="status" className="sr-only">
        {ops.anuncio}
      </p>
    </div>
  );
}

/** Lista de textos (linhas, respostas aceitas, itens do checklist). */
export function ListaDeTextos({
  rotulo,
  chave,
  nomeDoItem,
  valor,
  aoMudar,
  erros,
  ajuda,
  placeholder,
  alunosPresos,
}: {
  rotulo: string;
  chave?: string;
  nomeDoItem: string;
  valor: unknown;
  aoMudar: (lista: unknown[]) => void;
  erros: Erros;
  ajuda?: ReactNode;
  placeholder?: string;
  alunosPresos?: number;
}) {
  const base = useId();
  const idTitulo = `${base}-titulo`;
  const idDoItem = (i: number) => `${base}-texto-${i}`;
  const focar = useFocoPendente(idDoItem);
  const lista: readonly unknown[] = Array.isArray(valor) ? valor : [];
  const ops = useOperacoesDeLista({
    lista,
    aoMudar,
    novoItem: () => '',
    duplicarItem: (item) => item,
    nomeDoItem,
    alunosPresos,
    focar,
  });

  if (valor !== undefined && !Array.isArray(valor)) {
    return <AvisoDeFormato rotulo={rotulo} chave={chave} bruto={valor} erros={erros.em()} />;
  }

  const Nome = maiuscula(nomeDoItem);

  return (
    <div role="group" aria-labelledby={idTitulo} className="flex flex-col gap-2">
      <CabecalhoDaLista id={idTitulo} rotulo={rotulo} chave={chave} quantidade={lista.length} />
      {ajuda ? <p className="m-0 text-[13px] leading-snug text-muted-2">{ajuda}</p> : null}
      <MensagemDeErro texto={juntarErros(erros.em())} />
      {alunosPresos && alunosPresos > 0 ? <AvisoDePosicao alunos={alunosPresos} /> : null}

      {lista.length > 0 ? (
        <ol className="m-0 flex list-none flex-col gap-2 p-0">
          {lista.map((item, i) => (
            // A posição é a identidade do item (ver `ListaDeItens`).
            <li key={i} className="flex flex-wrap items-start gap-2">
              <div className="min-w-[200px] flex-1">
                {typeof item === 'string' ? (
                  <Field
                    id={idDoItem(i)}
                    label={`${Nome} ${i + 1}`}
                    labelClassName="sr-only"
                    error={juntarErros(erros.em(i))}
                  >
                    <Input
                      value={item}
                      placeholder={placeholder}
                      onChange={(evento) => aoMudar(trocarEm(lista, i, evento.target.value))}
                    />
                  </Field>
                ) : (
                  <AvisoDeFormato rotulo={`${Nome} ${i + 1}`} bruto={item} erros={erros.em(i)} />
                )}
              </div>
              <div className="pt-1">
                <ControlesDoItem indice={i} total={lista.length} nome={nomeDoItem} ops={ops} />
              </div>
            </li>
          ))}
        </ol>
      ) : null}

      <div>
        <Button type="button" size="md" variant="ghost" onClick={ops.adicionar}>
          + Adicionar {nomeDoItem}
        </Button>
      </div>
      <p role="status" className="sr-only">
        {ops.anuncio}
      </p>
    </div>
  );
}
