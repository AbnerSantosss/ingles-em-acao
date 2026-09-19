/**
 * O editor de páginas e blocos — BACKOFFICE §3 (aba "Páginas").
 *
 * ⚠️ **Salvar ≠ publicar.** "Salvar rascunho" grava só `draftPages`; o aluno
 * continua vendo o publicado até alguém passar pelo painel de publicação.
 *
 * ⚠️ **JSON inválido não sai daqui.** Cada bloco é lido com o `BlockSchema`
 * (zod) a cada tecla; enquanto houver um bloco inválido o botão de salvar fica
 * travado — e o servidor refaz a mesma checagem de qualquer jeito.
 *
 * ⚠️ **ids são permanentes.** O editor gera o `id` dos blocos interativos
 * (nunca o admin), mostra somente leitura e, ao duplicar, gera um novo — o id
 * é a chave das respostas dos alunos (§6.2).
 */
'use client';

import { useActionState, useEffect, useMemo, useRef, useState } from 'react';

import {
  CATALOGO_DE_BLOCOS,
  ESTADO_INICIAL_DO_EDITOR,
  coletarIds,
  ehBlocoInterativo,
  ehTipoComIdGerado,
  ehTipoInterativo,
  gerarIdDeBloco,
  jsonCanonico,
  jsonEditavel,
  lerJsonDoBloco,
  modeloDeBloco,
  regenerarIds,
  validarSemantica,
  type EstadoDoEditor,
  type GrupoDeBloco,
  type LeituraDoBloco,
  type TipoDeBloco,
} from '@/lib/admin/editor';
import type { RelatorioDePublicacao } from '@/lib/admin/publicacao';
import type { Block, Page } from '@/lib/content/blocks';

import { CartaoDoBloco } from './CartaoDoBloco';
import { PainelDePublicacao } from './PainelDePublicacao';
import { PreviaDaAula, type PaginaDaPrevia } from './PreviaDaAula';
import { BotaoDeItem, BotaoEnviar, COR_ERRO, ListaDeProblemas, RecadoDoEditor } from './ui';

type AcaoDoEditor = (estado: EstadoDoEditor, dados: FormData) => Promise<EstadoDoEditor>;

type BlocoLocal = { chave: string; t: TipoDeBloco; id?: string; texto: string };
type PaginaLocal = { chave: string; blocos: BlocoLocal[] };

// Chaves de lista do React: só identificam o item na tela, nunca vão ao banco.
let contadorDeChaves = 0;
function novaChave(): string {
  contadorDeChaves += 1;
  return `k${contadorDeChaves}`;
}

function blocoLocal(bloco: Block): BlocoLocal {
  return {
    chave: novaChave(),
    t: bloco.t,
    id: ehBlocoInterativo(bloco) ? bloco.id : undefined,
    texto: jsonEditavel(bloco),
  };
}

function paginasLocais(pages: ReadonlyArray<Page>): PaginaLocal[] {
  return pages.map((pagina) => ({ chave: novaChave(), blocos: pagina.blocks.map(blocoLocal) }));
}

const GRUPOS: GrupoDeBloco[] = ['Texto', 'Estrutura', 'Mídia', 'Exercício'];

export function EditorDePaginas({
  aulaId,
  numero,
  paginasIniciais,
  hashBase,
  temRascunho,
  publicada,
  versaoAtual,
  idsUsados,
  respostasPorBloco,
  idsDeOutrasAulas,
  aulasExistentes,
  mediaDePaginas,
  relatorio,
  salvarAction,
  descartarAction,
  publicarAction,
}: {
  aulaId: string;
  numero: number;
  /** O rascunho gravado, ou o publicado quando não há rascunho. */
  paginasIniciais: Page[];
  /** Hash do rascunho gravado ('' quando não há) — trava de concorrência. */
  hashBase: string;
  temRascunho: boolean;
  publicada: boolean;
  versaoAtual: number;
  /** Todo id já usado no curso (inclusive versões antigas): nunca reutilizar. */
  idsUsados: string[];
  /** id do bloco → alunos distintos com resposta (conteúdo publicado). */
  respostasPorBloco: Record<string, number>;
  idsDeOutrasAulas: Array<[string, number]>;
  aulasExistentes: Array<{ numero: number; titulo: string }>;
  mediaDePaginas: number;
  relatorio: RelatorioDePublicacao | null;
  salvarAction: AcaoDoEditor;
  descartarAction: AcaoDoEditor;
  publicarAction: AcaoDoEditor;
}) {
  const [paginas, setPaginas] = useState<PaginaLocal[]>(() => paginasLocais(paginasIniciais));
  const [paginaAtual, setPaginaAtual] = useState(0);
  const [abertos, setAbertos] = useState<Set<string>>(() => new Set());
  const [tipoNovo, setTipoNovo] = useState<TipoDeBloco>('lead');

  // Quando o servidor devolve outro conteúdo (salvou, descartou, publicou,
  // restaurou), o editor recomeça dele. Ajuste de estado durante o render,
  // como a documentação do React recomenda para "resetar ao mudar a prop".
  const carimbo = `${hashBase}|${versaoAtual}|${jsonCanonico(paginasIniciais).length}`;
  const [carimboVisto, setCarimboVisto] = useState(carimbo);
  if (carimbo !== carimboVisto) {
    setCarimboVisto(carimbo);
    setPaginas(paginasLocais(paginasIniciais));
    setPaginaAtual((atual) => Math.min(atual, Math.max(paginasIniciais.length - 1, 0)));
  }

  // O conjunto de ids reservados só é lido e escrito em eventos (gerar id).
  const usados = useRef<Set<string> | null>(null);
  function idsReservados(): Set<string> {
    if (usados.current === null) {
      usados.current = new Set([...idsUsados, ...coletarIds(paginasIniciais)]);
    }
    return usados.current;
  }

  const [estadoSalvar, acaoSalvar] = useActionState(salvarAction, ESTADO_INICIAL_DO_EDITOR);
  const [estadoDescartar, acaoDescartar] = useActionState(descartarAction, ESTADO_INICIAL_DO_EDITOR);

  // ─────────────── leitura e validação (derivadas, a cada edição) ───────────────

  const leituras: LeituraDoBloco[][] = useMemo(
    () =>
      paginas.map((pagina, p) =>
        pagina.blocos.map((bloco, b) => lerJsonDoBloco(bloco.texto, { t: bloco.t, id: bloco.id }, p, b)),
      ),
    [paginas],
  );

  const errosDeForma = useMemo(
    () => leituras.flatMap((pagina) => pagina.flatMap((l) => (l.ok ? [] : l.erros))),
    [leituras],
  );

  const conteudo: Page[] | null = useMemo(() => {
    if (errosDeForma.length > 0) return null;
    return leituras.map((pagina) => ({
      blocks: pagina.map((l) => (l.ok ? l.bloco : null)).filter((b): b is Block => b !== null),
    }));
  }, [leituras, errosDeForma]);

  const contexto = useMemo(
    () => ({
      numero,
      idsDeOutrasAulas: new Map(idsDeOutrasAulas),
      aulasExistentes,
      mediaDePaginas,
    }),
    [numero, idsDeOutrasAulas, aulasExistentes, mediaDePaginas],
  );

  const semantica = useMemo(
    () => (conteudo ? validarSemantica(conteudo, contexto) : { erros: [], avisos: [] }),
    [conteudo, contexto],
  );

  const mudou = conteudo === null || jsonCanonico(conteudo) !== jsonCanonico(paginasIniciais);
  const podeSalvar = conteudo !== null && mudou;

  useEffect(() => {
    if (!mudou) return undefined;
    const avisar = (evento: BeforeUnloadEvent) => {
      evento.preventDefault();
    };
    window.addEventListener('beforeunload', avisar);
    return () => window.removeEventListener('beforeunload', avisar);
  }, [mudou]);

  const atual = Math.min(paginaAtual, Math.max(paginas.length - 1, 0));
  const paginaEmEdicao = paginas[atual];
  const leiturasDaPagina = leituras[atual] ?? [];

  const previa: PaginaDaPrevia[] = useMemo(
    () => leituras.map((pagina) => ({ blocos: pagina.map((l) => (l.ok ? l.bloco : null)) })),
    [leituras],
  );

  // ───────────────────────────── utilidades ─────────────────────────────

  function alunosDoBloco(bloco: BlocoLocal): number {
    return bloco.id !== undefined ? (respostasPorBloco[bloco.id] ?? 0) : 0;
  }

  function alunosDaPagina(pagina: PaginaLocal): number {
    return pagina.blocos.reduce((maior, bloco) => Math.max(maior, alunosDoBloco(bloco)), 0);
  }

  function trocarPaginas(transformar: (lista: PaginaLocal[]) => PaginaLocal[]): void {
    setPaginas((lista) => transformar(lista));
  }

  function trocarBlocos(p: number, transformar: (blocos: BlocoLocal[]) => BlocoLocal[]): void {
    trocarPaginas((lista) =>
      lista.map((pagina, i) => (i === p ? { ...pagina, blocos: transformar(pagina.blocos) } : pagina)),
    );
  }

  function mover<T>(lista: T[], de: number, para: number): T[] {
    if (para < 0 || para >= lista.length) return lista;
    const copia = [...lista];
    const [item] = copia.splice(de, 1);
    copia.splice(para, 0, item);
    return copia;
  }

  function alternar(chave: string): void {
    setAbertos((conjunto) => {
      const novo = new Set(conjunto);
      if (novo.has(chave)) novo.delete(chave);
      else novo.add(chave);
      return novo;
    });
  }

  /** Cópia de um bloco com id novo (interativos). Imagem/perfil mantêm o id da arte. */
  function copiaDoBloco(bloco: BlocoLocal, leitura: LeituraDoBloco | undefined): BlocoLocal {
    if (leitura?.ok) return blocoLocal(regenerarIds(leitura.bloco, numero, idsReservados()));
    let id = bloco.id;
    if (ehTipoInterativo(bloco.t) && ehTipoComIdGerado(bloco.t)) {
      id = gerarIdDeBloco(numero, bloco.t, idsReservados());
      idsReservados().add(id);
    }
    return { chave: novaChave(), t: bloco.t, id, texto: bloco.texto };
  }

  // ───────────────────────────── páginas ─────────────────────────────

  function adicionarPagina(): void {
    const bloco = blocoLocal(modeloDeBloco('sec', numero, idsReservados()));
    const nova: PaginaLocal = { chave: novaChave(), blocos: [bloco] };
    const posicao = atual + 1;
    trocarPaginas((lista) => [...lista.slice(0, posicao), nova, ...lista.slice(posicao)]);
    setAbertos((conjunto) => new Set(conjunto).add(bloco.chave));
    setPaginaAtual(posicao);
  }

  function duplicarPagina(): void {
    if (!paginaEmEdicao) return;
    const copia: PaginaLocal = {
      chave: novaChave(),
      blocos: paginaEmEdicao.blocos.map((bloco, b) => copiaDoBloco(bloco, leiturasDaPagina[b])),
    };
    const posicao = atual + 1;
    trocarPaginas((lista) => [...lista.slice(0, posicao), copia, ...lista.slice(posicao)]);
    setPaginaAtual(posicao);
  }

  function moverPagina(delta: number): void {
    const destino = atual + delta;
    if (destino < 0 || destino >= paginas.length) return;
    trocarPaginas((lista) => mover(lista, atual, destino));
    setPaginaAtual(destino);
  }

  function removerPagina(): void {
    if (!paginaEmEdicao || paginas.length <= 1) return;
    const alunos = alunosDaPagina(paginaEmEdicao);
    const texto =
      alunos > 0
        ? `A página ${atual + 1} tem exercícios que ${alunos} aluno(s) já responderam. Ao publicar sem ela, essas respostas deixam de contar na nota (não são apagadas). Remover a página?`
        : `Remover a página ${atual + 1} e seus ${paginaEmEdicao.blocos.length} bloco(s)?`;
    if (!window.confirm(texto)) return;
    trocarPaginas((lista) => lista.filter((_, i) => i !== atual));
    setPaginaAtual(Math.max(0, atual - 1));
  }

  // ───────────────────────────── blocos ─────────────────────────────

  function adicionarBloco(): void {
    const bloco = blocoLocal(modeloDeBloco(tipoNovo, numero, idsReservados()));
    trocarBlocos(atual, (blocos) => [...blocos, bloco]);
    setAbertos((conjunto) => new Set(conjunto).add(bloco.chave));
  }

  function editarBloco(b: number, texto: string): void {
    trocarBlocos(atual, (blocos) => blocos.map((bloco, i) => (i === b ? { ...bloco, texto } : bloco)));
  }

  function formatarBloco(b: number): void {
    const leitura = leiturasDaPagina[b];
    if (!leitura?.ok) return;
    editarBloco(b, jsonEditavel(leitura.bloco));
  }

  function duplicarBloco(b: number): void {
    const original = paginaEmEdicao?.blocos[b];
    if (!original) return;
    const copia = copiaDoBloco(original, leiturasDaPagina[b]);
    trocarBlocos(atual, (blocos) => [...blocos.slice(0, b + 1), copia, ...blocos.slice(b + 1)]);
    setAbertos((conjunto) => new Set(conjunto).add(copia.chave));
  }

  function removerBloco(b: number): void {
    const bloco = paginaEmEdicao?.blocos[b];
    if (!bloco || !paginaEmEdicao) return;
    if (paginaEmEdicao.blocos.length <= 1) {
      window.alert(
        'Uma página precisa de pelo menos um bloco. Para tirar a página inteira, use "Remover página".',
      );
      return;
    }
    const alunos = alunosDoBloco(bloco);
    if (
      alunos > 0 &&
      !window.confirm(
        `${alunos} aluno(s) já responderam o exercício ${bloco.id ?? ''}. Ao publicar sem ele, essas respostas deixam de contar na nota (não são apagadas). Remover mesmo assim?`,
      )
    ) {
      return;
    }
    trocarBlocos(atual, (blocos) => blocos.filter((_, i) => i !== b));
  }

  // ───────────────────────────── tela ─────────────────────────────

  const totalDeBlocos = paginas.reduce((soma, pagina) => soma + pagina.blocos.length, 0);

  return (
    <div className="flex flex-col gap-6">
      {/* ── barra de estado + salvar/descartar ── */}
      <div className="flex flex-col gap-3 rounded-[18px] bg-[#F4F7FB] p-4">
        <div className="flex flex-wrap items-center gap-2 text-[14px] font-bold text-navy">
          <span>
            {paginas.length} página(s) · {totalDeBlocos} bloco(s)
          </span>
          <span aria-hidden="true">·</span>
          <span>
            {temRascunho
              ? 'Editando o rascunho gravado.'
              : `Editando a partir do publicado (versão ${versaoAtual}).`}
          </span>
          {mudou ? (
            <span
              className="rounded-pill px-2.5 py-1 text-[12px] font-extrabold"
              style={{ background: '#FEF7E0', color: '#6B520A' }}
            >
              alterações não salvas
            </span>
          ) : null}
        </div>

        <div className="flex flex-wrap items-start gap-3">
          <form action={acaoSalvar} className="flex flex-col gap-2">
            <input type="hidden" name="aulaId" value={aulaId} />
            <input type="hidden" name="hashBase" value={hashBase} />
            <input type="hidden" name="paginas" value={conteudo ? JSON.stringify(conteudo) : ''} />
            <BotaoEnviar disabled={!podeSalvar}>Salvar rascunho</BotaoEnviar>
          </form>
          {temRascunho ? (
            <form
              action={acaoDescartar}
              onSubmit={(evento) => {
                if (
                  !window.confirm(
                    'Descartar o rascunho gravado? O editor volta para o conteúdo publicado e o rascunho é perdido.',
                  )
                ) {
                  evento.preventDefault();
                }
              }}
            >
              <input type="hidden" name="aulaId" value={aulaId} />
              <input type="hidden" name="hashBase" value={hashBase} />
              <BotaoEnviar variant="ghost">Descartar rascunho</BotaoEnviar>
            </form>
          ) : null}
        </div>

        {errosDeForma.length > 0 ? (
          <p className="m-0 text-[14px] font-bold leading-snug" style={{ color: COR_ERRO.texto }}>
            {errosDeForma.length} erro(s) de formato. Corrija antes de salvar. Os blocos com erro
            estão marcados em vermelho.
          </p>
        ) : null}
        <RecadoDoEditor estado={estadoSalvar} />
        <RecadoDoEditor estado={estadoDescartar} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        {/* ── coluna do editor ── */}
        <div className="flex min-w-0 flex-col gap-4">
          <div className="flex flex-col gap-2">
            <p className="kicker m-0">Páginas</p>
            <div role="group" aria-label="Escolher página" className="flex flex-wrap gap-1.5">
              {paginas.map((pagina, p) => {
                const ativa = p === atual;
                const comErro = (leituras[p] ?? []).some((l) => !l.ok);
                return (
                  <button
                    key={pagina.chave}
                    type="button"
                    aria-pressed={ativa}
                    aria-label={`Página ${p + 1}${comErro ? ' (com erro)' : ''}`}
                    onClick={() => setPaginaAtual(p)}
                    className="grid min-h-11 min-w-11 place-items-center rounded-[12px] border-[1.5px] border-solid px-2 text-[14px] font-black"
                    style={
                      ativa
                        ? { background: '#0A1F4E', color: '#FFFFFF', borderColor: '#0A1F4E' }
                        : {
                            background: comErro ? COR_ERRO.fundo : '#FFFFFF',
                            color: comErro ? COR_ERRO.texto : '#0A1F4E',
                            borderColor: comErro ? COR_ERRO.borda : '#E3EAF3',
                          }
                    }
                  >
                    {p + 1}
                  </button>
                );
              })}
              <BotaoDeItem rotulo="Nova página depois desta" onClick={adicionarPagina}>
                +
              </BotaoDeItem>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="mr-1 text-[13px] font-extrabold text-muted">
                Página {atual + 1}:
              </span>
              <BotaoDeItem rotulo="Mover página para trás" onClick={() => moverPagina(-1)} disabled={atual === 0}>
                ←
              </BotaoDeItem>
              <BotaoDeItem
                rotulo="Mover página para frente"
                onClick={() => moverPagina(1)}
                disabled={atual >= paginas.length - 1}
              >
                →
              </BotaoDeItem>
              <BotaoDeItem rotulo="Duplicar página" onClick={duplicarPagina}>
                ⧉
              </BotaoDeItem>
              <BotaoDeItem
                rotulo="Remover página"
                onClick={removerPagina}
                disabled={paginas.length <= 1}
                perigo
              >
                ✕
              </BotaoDeItem>
            </div>
          </div>

          <ol className="m-0 flex list-none flex-col gap-2.5 p-0" aria-label={`Blocos da página ${atual + 1}`}>
            {(paginaEmEdicao?.blocos ?? []).map((bloco, b) => {
              const leitura = leiturasDaPagina[b] ?? { ok: false, erros: [] };
              return (
                <CartaoDoBloco
                  key={bloco.chave}
                  indice={b}
                  total={paginaEmEdicao?.blocos.length ?? 0}
                  t={bloco.t}
                  id={bloco.id}
                  texto={bloco.texto}
                  leitura={leitura}
                  alunos={alunosDoBloco(bloco)}
                  aberto={abertos.has(bloco.chave)}
                  selecionado={false}
                  aoAlternar={() => alternar(bloco.chave)}
                  aoEditar={(texto) => editarBloco(b, texto)}
                  aoFormatar={() => formatarBloco(b)}
                  aoSubir={() => trocarBlocos(atual, (blocos) => mover(blocos, b, b - 1))}
                  aoDescer={() => trocarBlocos(atual, (blocos) => mover(blocos, b, b + 1))}
                  aoDuplicar={() => duplicarBloco(b)}
                  aoRemover={() => removerBloco(b)}
                />
              );
            })}
          </ol>

          <div className="flex flex-wrap items-end gap-2">
            <label className="flex min-w-0 flex-1 flex-col gap-1.5">
              <span className="kicker m-0">Adicionar bloco nesta página</span>
              <select
                value={tipoNovo}
                onChange={(evento) => setTipoNovo(evento.target.value as TipoDeBloco)}
                className="min-h-11 rounded-field border-[1.5px] border-solid border-border bg-surface px-3 text-[14px] font-bold text-navy"
              >
                {GRUPOS.map((grupo) => (
                  <optgroup key={grupo} label={grupo}>
                    {CATALOGO_DE_BLOCOS.filter((item) => item.grupo === grupo).map((item) => (
                      <option key={item.t} value={item.t}>
                        {item.rotulo} ({item.t})
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </label>
            <button
              type="button"
              onClick={adicionarBloco}
              className="min-h-11 rounded-pill bg-navy px-5 text-[14px] font-extrabold text-white"
            >
              Adicionar
            </button>
          </div>

          {/* ── validação ao vivo ── */}
          <section aria-labelledby="validacao-titulo" className="flex flex-col gap-2">
            <p id="validacao-titulo" className="kicker m-0">
              Validação
            </p>
            {conteudo === null ? (
              <ListaDeProblemas
                titulo={`Erros de formato (${errosDeForma.length}): impedem salvar`}
                itens={errosDeForma}
                tom="erro"
              />
            ) : semantica.erros.length === 0 && semantica.avisos.length === 0 ? (
              <ListaDeProblemas itens={['Nenhum problema encontrado.']} tom="ok" />
            ) : (
              <>
                <ListaDeProblemas
                  titulo={`Erros (${semantica.erros.length}): impedem publicar`}
                  itens={semantica.erros}
                  tom="erro"
                />
                <ListaDeProblemas
                  titulo={`Avisos (${semantica.avisos.length}): exigem confirmação ao publicar`}
                  itens={semantica.avisos}
                  tom="aviso"
                />
              </>
            )}
          </section>
        </div>

        {/* ── coluna da pré-visualização ── */}
        <div className="min-w-0 xl:sticky xl:top-4 xl:self-start">
          <PreviaDaAula
            paginas={previa}
            numero={numero}
            pagina={atual}
            aoTrocarPagina={(p) => setPaginaAtual(Math.min(Math.max(p, 0), paginas.length - 1))}
            faixa={
              mudou
                ? 'Edição não salva: o aluno ainda vê a versão publicada'
                : temRascunho
                  ? 'Rascunho: o aluno ainda vê a versão publicada'
                  : `Conteúdo publicado (versão ${versaoAtual})`
            }
          />
        </div>
      </div>

      {/* ── publicação ── */}
      <section
        aria-labelledby="publicar-titulo"
        className="flex flex-col gap-3 border-t border-solid border-border pt-5"
      >
        <h2 id="publicar-titulo" className="m-0 text-[20px] font-black text-navy">
          Publicar
        </h2>
        <PainelDePublicacao
          aulaId={aulaId}
          relatorio={relatorio}
          temRascunho={temRascunho}
          publicada={publicada}
          versaoAtual={versaoAtual}
          mudancasNaoSalvas={mudou}
          publicarAction={publicarAction}
        />
      </section>
    </div>
  );
}
