'use client';

/**
 * O contexto de interação dos blocos — BACKOFFICE §3.4, decisão D5.
 *
 * Existe **um renderer só**. O aluno e o preview do admin usam exatamente os mesmos
 * componentes de bloco; o que muda entre os dois é quem guarda a resposta:
 *
 *   • `ProvedorPersistente` — grava em `ExerciseAnswer` por Server Action.
 *   • `ProvedorEfemero`     — `useState` e nada mais. É o preview do admin: responder
 *                             ali não cria progresso nem pontua.
 *
 * Se o painel tivesse renderer próprio, os dois divergiriam em semanas e o preview
 * passaria a mentir — que é pior do que não ter preview nenhum.
 *
 * Regras de gravação que este arquivo garante:
 *
 *   1. A tela atualiza **na hora** (otimista). A gravação vai em segundo plano por
 *      `useTransition`.
 *   2. Falha de gravação **nunca** apaga o que o aluno digitou: o valor fica na tela e
 *      um aviso discreto aparece.
 *   3. Campo de texto (`fill:`, `free:`) tem debounce de 600 ms e descarrega no `blur`.
 *      Um `fill` de 5 itens não pode virar 40 requisições enquanto a pessoa digita.
 *   4. O que estiver em espera é descarregado ao desmontar — trocar de página no meio
 *      da digitação não pode perder a última frase.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
  type ReactNode,
} from 'react';


// ──────────────────────────── contrato público ────────────────────────────

/** O que uma Server Action de gravação recebe. Uma linha de `ExerciseAnswer`. */
export type EntradaDeSalvamento = {
  answerKey: string;
  value: string;
  checked: boolean;
  correct: boolean | null;
};

/** Resposta opcional da action. Sem retorno, a promessa resolvida já vale como sucesso. */
export type ResultadoDeSalvamento = { ok: boolean; erro?: string };

/**
 * A Server Action injetada por quem monta a página da aula (arquivo de outro agente).
 * Este arquivo nunca a importa: recebe pronta, para o preview do admin poder passar nada.
 */
export type AcaoDeSalvar = (
  entrada: EntradaDeSalvamento,
) => Promise<ResultadoDeSalvamento | void>;

/** A interface que todo bloco interativo usa para ler e escrever resposta. */
export type Interacao = {
  /** Valor gravado para a chave, ou `undefined` se o aluno nunca respondeu. */
  valor(chave: string): string | undefined;
  /** Grava o valor (otimista na tela, em segundo plano no banco). */
  definir(chave: string, valor: string): void;
  /** `true` depois que o aluno tocou em VERIFICAR (ou, no `mc`, escolheu). */
  conferido(chave: string): boolean;
  /** Marca a chave como conferida e registra o acerto. */
  conferir(chave: string, correto: boolean): void;
  /** Zera valor e conferência das chaves — é o botão LIMPAR. */
  limpar(chaves: readonly string[]): void;
  /**
   * Força a gravação do que estiver em espera (o debounce dos campos de texto).
   * Sem argumento, descarrega tudo. Os blocos chamam no `blur`.
   */
  descarregar(chave?: string): void;
  /** `true` enquanto uma gravação está em voo — os blocos usam para não piscar. */
  gravando: boolean;
  /** `false` no preview do admin: nada é persistido e nada pontua. */
  persistente: boolean;
};

/**
 * Implementação inerte: lê vazio, ignora escrita. É o valor padrão do contexto, para
 * um bloco renderizado fora de provedor aparecer em modo leitura em vez de quebrar.
 */
export const INTERACAO_INERTE: Interacao = {
  valor: () => undefined,
  definir: () => undefined,
  conferido: () => false,
  conferir: () => undefined,
  limpar: () => undefined,
  descarregar: () => undefined,
  gravando: false,
  persistente: false,
};

const Contexto = createContext<Interacao>(INTERACAO_INERTE);

/** O acesso dos blocos ao estado de resposta. */
export function useInteracao(): Interacao {
  return useContext(Contexto);
}

// ─────────────────────────────── internos ────────────────────────────────

/** Uma linha de resposta como ela vive na memória do cliente. */
type Linha = { valor: string; conferido: boolean; correto: boolean | null };

const LINHA_VAZIA: Linha = { valor: '', conferido: false, correto: null };

/** Espera do debounce dos campos de texto. */
const ESPERA_TEXTO_MS = 600;

/**
 * Chaves que vêm de digitação e por isso esperam o debounce. As outras
 * (`mc:`, `chk:`, `match:`, `dnd:`, `cta:`) nascem de um toque só e gravam na hora.
 */
const PREFIXOS_DE_TEXTO = ['fill:', 'free:'] as const;

const MENSAGEM_DE_FALHA =
  'Não conseguimos salvar sua resposta agora. Ela continua aqui na tela. Tentamos de novo no próximo toque.';

/** Constantes estáveis para o provedor efêmero não recriar objeto a cada render. */
const SEM_INICIAIS: Readonly<Record<string, string>> = Object.freeze({});
const SEM_CONFERIDOS: readonly string[] = Object.freeze([]);

function ehCampoDeTexto(chave: string): boolean {
  return PREFIXOS_DE_TEXTO.some((prefixo) => chave.startsWith(prefixo));
}

function semear(
  iniciais: Readonly<Record<string, string>>,
  conferidos: readonly string[],
): Map<string, Linha> {
  const mapa = new Map<string, Linha>();
  for (const [chave, valor] of Object.entries(iniciais)) {
    mapa.set(chave, { valor, conferido: false, correto: null });
  }
  for (const chave of conferidos) {
    const linha = mapa.get(chave);
    mapa.set(chave, {
      valor: linha?.valor ?? '',
      conferido: true,
      correto: linha?.correto ?? null,
    });
  }
  return mapa;
}

type Motor = {
  interacao: Interacao;
  aviso: string | null;
  dispensarAviso: () => void;
};

/**
 * O motor dos dois provedores. Com `salvar` em `null`, nada sai do navegador — é
 * literalmente o mesmo código do aluno, só sem servidor.
 *
 * O mapa vive num ref *e* no estado: o ref é a verdade (lido pelos temporizadores, que
 * senão pegariam um valor velho) e o estado é o que dispara o render. Os dois são
 * atualizados juntos, sempre dentro de um manipulador de evento.
 */
function useMotor(
  iniciais: Readonly<Record<string, string>>,
  conferidos: readonly string[],
  salvar: AcaoDeSalvar | null,
): Motor {
  const [loja, setLoja] = useState<Map<string, Linha>>(() => semear(iniciais, conferidos));
  const lojaRef = useRef(loja);

  const [gravando, iniciarTransicao] = useTransition();
  const [aviso, setAviso] = useState<string | null>(null);

  const salvarRef = useRef(salvar);
  useEffect(() => {
    salvarRef.current = salvar;
  }, [salvar]);

  const temporizadoresRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const enviar = useCallback((chave: string, comTransicao: boolean) => {
    const acao = salvarRef.current;
    if (acao === null) return;

    const linha = lojaRef.current.get(chave);
    if (linha === undefined) return;

    const entrada: EntradaDeSalvamento = {
      answerKey: chave,
      value: linha.valor,
      checked: linha.conferido,
      correct: linha.correto,
    };

    const executar = async (): Promise<void> => {
      try {
        const resultado = await acao(entrada);
        if (resultado && resultado.ok === false) {
          setAviso(resultado.erro ?? MENSAGEM_DE_FALHA);
          return;
        }
        setAviso(null);
      } catch {
        // A resposta continua na tela: a falha vira aviso, nunca perda de conteúdo.
        setAviso(MENSAGEM_DE_FALHA);
      }
    };

    if (comTransicao) {
      iniciarTransicao(async () => {
        await executar();
      });
    } else {
      void executar();
    }
  }, []);

  const enviarRef = useRef(enviar);
  useEffect(() => {
    enviarRef.current = enviar;
  }, [enviar]);

  const agendar = useCallback(
    (chave: string, atraso: number) => {
      if (salvarRef.current === null) return;

      const temporizadores = temporizadoresRef.current;
      const anterior = temporizadores.get(chave);
      if (anterior !== undefined) clearTimeout(anterior);

      const id = setTimeout(() => {
        temporizadores.delete(chave);
        enviar(chave, true);
      }, atraso);

      temporizadores.set(chave, id);
    },
    [enviar],
  );

  const descarregar = useCallback(
    (chave?: string) => {
      const temporizadores = temporizadoresRef.current;
      const alvos =
        chave === undefined
          ? Array.from(temporizadores.keys())
          : temporizadores.has(chave)
            ? [chave]
            : [];

      for (const alvo of alvos) {
        const id = temporizadores.get(alvo);
        if (id !== undefined) clearTimeout(id);
        temporizadores.delete(alvo);
        enviar(alvo, true);
      }
    },
    [enviar],
  );

  const aplicar = useCallback((chave: string, mudanca: Partial<Linha>) => {
    const atual = lojaRef.current.get(chave) ?? LINHA_VAZIA;
    const mapa = new Map(lojaRef.current);
    mapa.set(chave, { ...atual, ...mudanca });
    lojaRef.current = mapa;
    setLoja(mapa);
  }, []);

  // Sair da página no meio da digitação não pode custar a última frase.
  useEffect(() => {
    const temporizadores = temporizadoresRef.current;
    return () => {
      for (const [chave, id] of Array.from(temporizadores)) {
        clearTimeout(id);
        enviarRef.current(chave, false);
      }
      temporizadores.clear();
    };
  }, []);

  const dispensarAviso = useCallback(() => setAviso(null), []);

  const persistente = salvar !== null;

  const interacao = useMemo<Interacao>(
    () => ({
      valor: (chave) => loja.get(chave)?.valor,
      conferido: (chave) => loja.get(chave)?.conferido ?? false,
      definir: (chave, valor) => {
        aplicar(chave, { valor });
        agendar(chave, ehCampoDeTexto(chave) ? ESPERA_TEXTO_MS : 0);
      },
      conferir: (chave, correto) => {
        // Grava na hora, mesmo em campo de texto: VERIFICAR não espera debounce.
        aplicar(chave, { conferido: true, correto });
        agendar(chave, 0);
      },
      limpar: (chaves) => {
        for (const chave of chaves) {
          aplicar(chave, { valor: '', conferido: false, correto: null });
          agendar(chave, 0);
        }
      },
      descarregar,
      gravando,
      persistente,
    }),
    [loja, aplicar, agendar, descarregar, gravando, persistente],
  );

  return { interacao, aviso, dispensarAviso };
}

// ─────────────────────────────── provedores ──────────────────────────────

export type PropsDoProvedorPersistente = {
  children: ReactNode;
  /** Respostas já carregadas do banco: `answerKey` → `value`. */
  iniciais: Readonly<Record<string, string>>;
  /** As `answerKey` cujo `checked` já é `true` no banco. */
  conferidos: readonly string[];
  /** A Server Action que grava uma linha de `ExerciseAnswer`. */
  salvar: AcaoDeSalvar;
};

/**
 * O provedor do aluno. As `iniciais` são lidas uma vez, na montagem: o que está na tela
 * é sempre mais novo do que o que o servidor mandou, e re-semear apagaria digitação.
 */
export function ProvedorPersistente({
  children,
  iniciais,
  conferidos,
  salvar,
}: PropsDoProvedorPersistente) {
  const { interacao, aviso, dispensarAviso } = useMotor(iniciais, conferidos, salvar);

  return (
    <Contexto.Provider value={interacao}>
      {children}
      <AvisoDeGravacao texto={aviso} aoDispensar={dispensarAviso} />
    </Contexto.Provider>
  );
}

/**
 * O provedor do preview do admin: guarda tudo em memória e nunca chama servidor.
 * Nem `ExerciseAnswer`, nem `LessonProgress`, nem `StudyDay` (BACKOFFICE §3.4).
 */
export function ProvedorEfemero({ children }: { children: ReactNode }) {
  const { interacao } = useMotor(SEM_INICIAIS, SEM_CONFERIDOS, null);

  return <Contexto.Provider value={interacao}>{children}</Contexto.Provider>;
}

// ──────────────────────────────── o aviso ────────────────────────────────

/**
 * A faixa de falha de gravação. Fica sempre no DOM como região viva, para o leitor de
 * tela anunciar o texto quando ele aparece; visível só quando há o que dizer.
 */
/**
 * Onde o aviso para: acima da barra "anterior / próxima" do leitor, que já fica
 * colada 10px acima da BottomNav (`LeitorDaAula`; `--altura-nav` vale 0 no desktop). Na mesma altura dela, o
 * aviso cobria justamente o botão de avançar enquanto estava na tela.
 */
const ALTURA_DA_BARRA_DO_LEITOR = 56;
const ALTURA_DO_AVISO = 10 + ALTURA_DA_BARRA_DO_LEITOR + 10;

function AvisoDeGravacao({
  texto,
  aoDispensar,
}: {
  texto: string | null;
  aoDispensar: () => void;
}) {
  if (texto === null) {
    return <div role="status" className="sr-only" />;
  }

  return (
    <div
      role="status"
      className="fixed inset-x-0 z-40 mx-auto flex w-[min(420px,calc(100%-32px))] items-center gap-3 rounded-card bg-navy px-4 py-3 text-[13px] font-bold leading-snug text-white shadow-raised"
      style={{ bottom: `calc(var(--altura-nav) + ${ALTURA_DO_AVISO}px + env(safe-area-inset-bottom))` }}
    >
      <span className="flex-1">{texto}</span>
      <button
        type="button"
        onClick={aoDispensar}
        aria-label="Dispensar aviso"
        className="grid h-11 w-11 flex-none place-items-center rounded-pill text-[18px] font-black text-yellow"
      >
        <span aria-hidden="true">×</span>
      </button>
    </div>
  );
}
