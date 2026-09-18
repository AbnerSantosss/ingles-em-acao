/**
 * Seletor de imagem da biblioteca — BACKOFFICE §2.8 / Fase 5.
 *
 * ## O contrato com o editor de blocos (outro agente)
 *
 * Este componente devolve **`{ src, alt }`** — exatamente o par que os blocos
 * `image`, `profile`, `cards[]` e `steps[]` aceitam hoje em
 * `src/lib/content/types.ts`. Não há tradução no meio: o que sai daqui entra no
 * JSON da página como está.
 *
 * ```tsx
 * const [imagem, setImagem] = useState<MidiaSelecionada | null>(bloco.src ? { src: bloco.src, alt: bloco.alt ?? '' } : null)
 *
 * <SeletorDeMidia
 *   rotulo="Ilustração do bloco"
 *   valor={imagem}
 *   descricaoSugerida={bloco.ph}       // o `ph` vira o alt inicial
 *   aoEscolher={(escolha) => setImagem(escolha)}   // null = remover a imagem
 * />
 * ```
 *
 * Serve igual no campo de capa da aula: `valor={{ src: aula.coverUrl, alt }}`.
 *
 * ## Duas coisas que valem a atenção
 *
 * 1. **`alt` é desta ocorrência, não do arquivo.** Ele começa igual ao `alt`
 *    gravado no asset (ou ao `ph` do bloco, quando houver), e pode ser ajustado
 *    para o contexto: a mesma foto ilustra coisas diferentes em duas aulas. O
 *    `alt` do asset continua sendo editado em `/admin/midia`.
 * 2. **Escolher sem descrever não é permitido.** O campo de texto alternativo
 *    fica em evidência e avisa quando está vazio — são 110 blocos `image` e 42
 *    capas; um `alt` vazio aqui é um buraco na tela de quem usa leitor de tela.
 *    A validação final é do formulário que hospeda o seletor.
 *
 * ## Enviar sem sair do editor
 *
 * Além de escolher da biblioteca, o seletor **envia** uma imagem nova e já a
 * deixa escolhida (`enviarImagemDoSeletorAction`). Antes do campo de arquivo
 * aparece o {@link QuadroDeEspecificacoes} do `uso` (ilustração 16:9, cartão
 * 16:10, perfil, capa 3:1), montado pelas mesmas constantes que a validação usa.
 *
 * ⚠️ O envio **não** usa `<form>`: o seletor vive dentro do formulário do
 * editor de blocos e do formulário de dados da aula, e formulário aninhado é
 * HTML inválido. O arquivo sai num `FormData` montado à mão, e o `<input
 * type="file">` não tem `name` — senão ele iria junto no POST do formulário
 * hospedeiro.
 *
 * `'use client'` porque abrir a biblioteca, buscar e escolher são interação de
 * verdade. O componente não fala com o banco: fala com as Server Actions
 * `buscarAcervoAction` e `enviarImagemDoSeletorAction`, atrás de `requireAdmin()`.
 */

/* eslint-disable @next/next/no-img-element -- miniatura de caminho arbitrário vindo do banco, sem dimensões conhecidas em build; ver o mesmo raciocínio em components/lesson/blocks/Ilustracao.tsx */

'use client';

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  useTransition,
  type ReactNode,
} from 'react';

import { QuadroDeEspecificacoes } from '@/components/admin/QuadroDeEspecificacoes';
import { Button } from '@/components/ui/Button';
import { Field } from '@/components/ui/Field';
import { Input } from '@/components/ui/Input';
import { buscarAcervoAction, enviarImagemDoSeletorAction } from '@/lib/media/acoes';
import {
  ACEITE_DE_IMAGEM,
  ESPECIFICACOES_DE_IMAGEM,
  linhasDaEspecificacaoDeImagem,
  resumoDaEspecificacaoDeImagem,
  type AlvoDeImagem,
} from '@/lib/media/especificacoes';
import {
  FORMATOS_EM_TEXTO,
  TAMANHO_MAXIMO_ALT,
  TAMANHO_MAXIMO_IMAGEM,
  formatarBytes,
  type MidiaDaBiblioteca,
  type MidiaSelecionada,
} from '@/lib/media/tipos';

export type SeletorDeMidiaProps = {
  /** Rótulo do campo ("Ilustração do bloco", "Capa da aula"). */
  rotulo: string;
  /** A imagem escolhida hoje, ou `null`. */
  valor: MidiaSelecionada | null;
  /**
   * Devolve a escolha. `null` significa "sem imagem" — o renderer volta a
   * mostrar o placeholder do bloco.
   */
  aoEscolher: (escolha: MidiaSelecionada | null) => void;
  /**
   * Texto que vira `alt` inicial quando o asset não tiver um — tipicamente o
   * `ph` do bloco ("Ilustração: grupo conversando").
   */
  descricaoSugerida?: string;
  /**
   * Acervo já carregado no servidor. Quando ausente, o seletor busca sozinho ao
   * abrir pela primeira vez.
   */
  acervoInicial?: MidiaDaBiblioteca[];
  /** Ajuda abaixo do campo. */
  ajuda?: string;
  /**
   * Para onde a imagem vai. Define o quadro de especificações mostrado antes
   * do envio e os avisos de proporção depois dele. Padrão: `ilustracao`.
   */
  uso?: AlvoDeImagem;
  /**
   * Sem campo de texto alternativo — para a capa, que não tem coluna de `alt`
   * (ela é decorativa na tela da aula; o título ao lado já diz o que é).
   */
  semAlt?: boolean;
};

const CLASSE_DO_ARQUIVO =
  'block w-full cursor-pointer rounded-field border-[1.5px] border-border bg-surface px-3 py-[11px] text-[15px] font-bold text-navy file:mr-3 file:cursor-pointer file:rounded-pill file:border-0 file:bg-navy file:px-4 file:py-2 file:text-[14px] file:font-extrabold file:text-white focus:border-blue focus:shadow-[0_0_0_3px_rgba(27,107,227,0.22)] focus-visible:outline-hidden aria-invalid:border-danger';

function Recado({ tom, children }: { tom: 'erro' | 'ok' | 'aviso'; children: ReactNode }) {
  const cores =
    tom === 'erro'
      ? { background: '#FEF0F2', color: '#B21F31' }
      : tom === 'ok'
        ? { background: '#E6F7EE', color: '#0B7A43' }
        : { background: '#FFF6DC', color: '#7A5A00' };
  return (
    <p
      role={tom === 'erro' ? 'alert' : 'status'}
      className="m-0 rounded-field px-3 py-2 text-[14px] font-bold leading-snug"
      style={cores}
    >
      {children}
    </p>
  );
}

const MINIATURA = 'h-full w-full object-cover';

function Vazio({ texto }: { texto: string }) {
  return (
    <p className="m-0 px-1 py-6 text-center text-[14px] font-semibold leading-snug text-muted">
      {texto}
    </p>
  );
}

export function SeletorDeMidia({
  rotulo,
  valor,
  aoEscolher,
  descricaoSugerida,
  acervoInicial,
  ajuda,
  uso = 'ilustracao',
  semAlt = false,
}: SeletorDeMidiaProps) {
  const idBase = useId();
  const idDoAlt = `${idBase}-alt`;
  const idDoPainel = `${idBase}-painel`;
  const idDoEnvio = `${idBase}-envio`;
  const idDoArquivo = `${idBase}-arquivo`;
  const idDoAltNovo = `${idBase}-alt-novo`;
  const especificacao = ESPECIFICACOES_DE_IMAGEM[uso];

  const [enviando, setEnviando] = useState(false);
  const [altNovo, setAltNovo] = useState('');
  const [errosDoEnvio, setErrosDoEnvio] = useState<{
    mensagem: string;
    campos?: Readonly<Record<string, string>>;
  } | null>(null);
  const [resultadoDoEnvio, setResultadoDoEnvio] = useState<{
    mensagem: string;
    avisos: string[];
  } | null>(null);
  const [envioPendente, iniciarEnvio] = useTransition();
  const refDoArquivo = useRef<HTMLInputElement>(null);

  const [aberto, setAberto] = useState(false);
  const [acervo, setAcervo] = useState<MidiaDaBiblioteca[]>(acervoInicial ?? []);
  const [carregado, setCarregado] = useState(Boolean(acervoInicial));
  const [erro, setErro] = useState<string | null>(null);
  const [busca, setBusca] = useState('');
  const [pendente, iniciar] = useTransition();

  const carregar = useCallback((termo: string) => {
    iniciar(async () => {
      const resposta = await buscarAcervoAction(termo);
      if (resposta.ok) {
        setAcervo(resposta.itens);
        setErro(null);
        setCarregado(true);
      } else {
        setErro(resposta.mensagem);
      }
    });
  }, []);

  // Primeira abertura sem acervo pré-carregado: busca uma vez.
  useEffect(() => {
    if (aberto && !carregado && !pendente) carregar('');
  }, [aberto, carregado, pendente, carregar]);

  function escolher(item: MidiaDaBiblioteca) {
    const alt = item.alt?.trim() || descricaoSugerida?.trim() || '';
    aoEscolher({ src: item.src, alt });
    setAberto(false);
  }

  function abrirEnvio() {
    setEnviando((estava) => !estava);
    setAberto(false);
    setErrosDoEnvio(null);
    if (altNovo.length === 0 && descricaoSugerida) setAltNovo(descricaoSugerida.trim());
  }

  function enviar() {
    const arquivo = refDoArquivo.current?.files?.[0];
    if (!arquivo) {
      setErrosDoEnvio({
        mensagem: `Escolha um arquivo (${FORMATOS_EM_TEXTO}, até ${formatarBytes(TAMANHO_MAXIMO_IMAGEM)}).`,
        campos: { arquivo: 'Nenhum arquivo selecionado.' },
      });
      return;
    }
    // Barreira no navegador: não manda 12 MB para ouvir "não" do servidor.
    if (arquivo.size > TAMANHO_MAXIMO_IMAGEM) {
      setErrosDoEnvio({
        mensagem:
          `A imagem tem ${formatarBytes(arquivo.size)} e o limite é ${formatarBytes(TAMANHO_MAXIMO_IMAGEM)} ` +
          `(${FORMATOS_EM_TEXTO}). ${resumoDaEspecificacaoDeImagem(uso)}.`,
        campos: { arquivo: `Arquivo grande demais (limite ${formatarBytes(TAMANHO_MAXIMO_IMAGEM)}).` },
      });
      return;
    }

    const dados = new FormData();
    dados.set('arquivo', arquivo);
    // A capa não tem `alt` próprio, mas o asset da biblioteca exige um.
    dados.set('alt', semAlt && altNovo.trim().length === 0 ? especificacao.rotulo : altNovo);
    dados.set('uso', uso);

    iniciarEnvio(async () => {
      const resposta = await enviarImagemDoSeletorAction(dados);
      if (!resposta.ok) {
        setErrosDoEnvio({ mensagem: resposta.mensagem, campos: resposta.campos });
        return;
      }
      aoEscolher(resposta.midia);
      setErrosDoEnvio(null);
      setResultadoDoEnvio({
        mensagem: `"${resposta.nome}" foi enviada e já está escolhida aqui. Salve para gravar.`,
        avisos: resposta.avisos,
      });
      setEnviando(false);
      setAltNovo('');
      // A biblioteca aberta depois já mostra a imagem nova.
      setCarregado(false);
      if (refDoArquivo.current) refDoArquivo.current.value = '';
    });
  }

  function trocarAlt(texto: string) {
    if (!valor) return;
    aoEscolher({ src: valor.src, alt: texto });
  }

  const altVazio = !semAlt && valor !== null && valor.alt.trim().length === 0;

  return (
    <div className="flex w-full flex-col gap-3">
      <span className="text-[13px] font-extrabold uppercase tracking-[0.1em] text-muted">
        {rotulo}
      </span>

      {/* ───────── a escolha atual ───────── */}
      <div className="flex flex-wrap items-start gap-4">
        <div
          className="h-[92px] w-[124px] shrink-0 overflow-hidden rounded-field border border-border bg-[#EDEFF4]"
          aria-hidden={valor ? undefined : true}
        >
          {valor ? (
            <img src={valor.src} alt="" className={MINIATURA} loading="lazy" decoding="async" />
          ) : (
            <span className="flex h-full w-full items-center justify-center text-[12px] font-bold text-muted-2">
              sem imagem
            </span>
          )}
        </div>

        <div className="flex min-w-[220px] flex-1 flex-col gap-2">
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              size="md"
              variant={valor ? 'ghost' : 'primary'}
              onClick={() => {
                setAberto((estava) => !estava);
                setEnviando(false);
              }}
              aria-expanded={aberto}
              aria-controls={idDoPainel}
            >
              {valor ? 'Trocar pela biblioteca' : 'Escolher da biblioteca'}
            </Button>

            <Button
              type="button"
              size="md"
              variant="ghost"
              onClick={abrirEnvio}
              aria-expanded={enviando}
              aria-controls={idDoEnvio}
            >
              Enviar nova imagem
            </Button>

            {valor ? (
              <Button
                type="button"
                size="md"
                variant="ghost"
                onClick={() => {
                  aoEscolher(null);
                  setResultadoDoEnvio(null);
                }}
              >
                Remover
              </Button>
            ) : null}
          </div>

          {valor && semAlt ? (
            <p className="m-0 break-all text-[13px] font-semibold leading-snug text-muted">
              {valor.src}
            </p>
          ) : valor ? (
            <Field
              id={idDoAlt}
              label="Texto alternativo"
              required
              error={
                altVazio
                  ? 'Descreva a imagem: é o texto lido em voz alta por quem não a enxerga.'
                  : undefined
              }
            >
              <Input
                value={valor.alt}
                maxLength={TAMANHO_MAXIMO_ALT}
                onChange={(evento) => trocarAlt(evento.target.value)}
                placeholder="Descreva a cena em uma frase"
              />
            </Field>
          ) : (
            <p className="m-0 text-[14px] font-semibold leading-snug text-muted">
              Sem imagem escolhida — a aula mostra o placeholder cinza com a descrição do bloco.
            </p>
          )}

          {ajuda ? (
            <p className="m-0 text-[13px] font-semibold leading-snug text-muted-2">{ajuda}</p>
          ) : null}

          <p className="m-0 text-[12px] font-bold leading-snug text-muted-2">
            {resumoDaEspecificacaoDeImagem(uso)}
          </p>

          {resultadoDoEnvio ? (
            <div className="flex flex-col gap-2">
              <Recado tom="ok">{resultadoDoEnvio.mensagem}</Recado>
              {resultadoDoEnvio.avisos.map((aviso) => (
                <Recado key={aviso} tom="aviso">
                  {aviso}
                </Recado>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      {/* ───────── enviar uma imagem nova ───────── */}
      {enviando ? (
        <div
          id={idDoEnvio}
          role="group"
          aria-label="Enviar nova imagem"
          className="flex flex-col gap-3 rounded-card border border-border bg-bg p-4"
        >
          <QuadroDeEspecificacoes
            titulo={`Antes de enviar · ${especificacao.rotulo}`}
            linhas={linhasDaEspecificacaoDeImagem(uso)}
            className="bg-surface"
          />

          <Field
            id={idDoArquivo}
            label="Arquivo"
            required
            error={errosDoEnvio?.campos?.arquivo}
            hint={`${FORMATOS_EM_TEXTO}, até ${formatarBytes(TAMANHO_MAXIMO_IMAGEM)}.`}
          >
            <input
              ref={refDoArquivo}
              type="file"
              accept={ACEITE_DE_IMAGEM}
              className={CLASSE_DO_ARQUIVO}
            />
          </Field>

          <Field
            id={idDoAltNovo}
            label={semAlt ? 'Descrição na biblioteca' : 'Texto alternativo'}
            required={!semAlt}
            error={errosDoEnvio?.campos?.alt}
            hint={
              semAlt
                ? 'Só para achar a imagem depois na biblioteca.'
                : 'Uma frase dizendo o que a imagem mostra — é o que o leitor de tela lê.'
            }
          >
            <Input
              value={altNovo}
              maxLength={TAMANHO_MAXIMO_ALT}
              onChange={(evento) => setAltNovo(evento.target.value)}
              onKeyDown={(evento) => {
                // Enter aqui envia a imagem, não o formulário hospedeiro.
                if (evento.key === 'Enter') {
                  evento.preventDefault();
                  enviar();
                }
              }}
              placeholder="Descreva a cena em uma frase"
            />
          </Field>

          {errosDoEnvio ? <Recado tom="erro">{errosDoEnvio.mensagem}</Recado> : null}

          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              size="md"
              onClick={enviar}
              loading={envioPendente}
              loadingLabel="Enviando…"
            >
              Enviar e usar aqui
            </Button>
            <Button type="button" size="md" variant="ghost" onClick={() => setEnviando(false)}>
              Cancelar
            </Button>
          </div>
        </div>
      ) : null}

      {/* ───────── a biblioteca ───────── */}
      {aberto ? (
        <div
          id={idDoPainel}
          role="group"
          aria-label="Biblioteca de imagens"
          onKeyDown={(evento) => {
            if (evento.key === 'Escape') {
              evento.stopPropagation();
              setAberto(false);
            }
          }}
          className="flex flex-col gap-3 rounded-card border border-border bg-bg p-4"
        >
          <div className="flex flex-wrap items-center gap-2">
            <Input
              type="search"
              value={busca}
              onChange={(evento) => setBusca(evento.target.value)}
              onKeyDown={(evento) => {
                if (evento.key === 'Enter') {
                  // Enter aqui busca; sem isso ele submeteria o formulário que
                  // hospeda o seletor (o editor de blocos), que não é o que
                  // ninguém quer no meio de uma escolha de imagem.
                  evento.preventDefault();
                  carregar(busca);
                }
              }}
              placeholder="Buscar por nome ou descrição"
              aria-label="Buscar na biblioteca"
              wrapperClassName="min-w-[220px] flex-1"
            />
            <Button
              type="button"
              size="md"
              variant="ghost"
              onClick={() => carregar(busca)}
              loading={pendente}
            >
              Buscar
            </Button>
            <Button type="button" size="md" variant="ghost" onClick={() => setAberto(false)}>
              Fechar
            </Button>
          </div>

          {erro ? (
            <p
              role="status"
              className="m-0 rounded-field px-3 py-2 text-[14px] font-bold leading-snug"
              style={{ background: '#FEF0F2', color: '#B21F31' }}
            >
              {erro}
            </p>
          ) : null}

          {pendente && acervo.length === 0 ? <Vazio texto="Carregando a biblioteca…" /> : null}

          {!pendente && carregado && acervo.length === 0 && !erro ? (
            <Vazio texto="Nenhuma imagem na biblioteca ainda. Use “Enviar nova imagem” aqui ao lado." />
          ) : null}

          {acervo.length > 0 ? (
            <ul className="m-0 grid list-none grid-cols-2 gap-3 p-0 sm:grid-cols-3 lg:grid-cols-4">
              {acervo.map((item) => {
                const escolhida = valor?.src === item.src;
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => escolher(item)}
                      aria-pressed={escolhida}
                      className={`flex w-full cursor-pointer flex-col gap-1.5 rounded-field border-[1.5px] p-1.5 text-left transition-colors ${
                        escolhida
                          ? 'border-blue bg-[#EAF2FE]'
                          : 'border-border bg-surface hover:border-border-2'
                      }`}
                    >
                      <span className="block h-[86px] w-full overflow-hidden rounded-[10px] bg-[#EDEFF4]">
                        <img
                          src={item.src}
                          alt=""
                          className={MINIATURA}
                          loading="lazy"
                          decoding="async"
                        />
                      </span>
                      <span className="block truncate text-[13px] font-extrabold text-navy">
                        {item.filename}
                      </span>
                      <span className="block text-[12px] font-semibold text-muted-2">
                        {formatarBytes(item.bytes)}
                        {item.alt ? '' : ' · sem alt'}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

export default SeletorDeMidia;
