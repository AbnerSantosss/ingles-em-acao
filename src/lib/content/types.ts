/**
 * Camada de tipos do conteúdo do curso WSA English.
 *
 * Extraída de `content/course-data.mjs` (42 aulas, 309 páginas, 1538 blocos) e do
 * renderer do protótipo (`prototype/mobile.dc.html`, método `resolve`, a partir da
 * linha ~1160). É o alicerce do motor de aulas da próxima rodada.
 *
 * REGRA DE OBRIGATORIEDADE — um campo está marcado como opcional quando
 * (a) falta em pelo menos uma ocorrência dentro do `course-data.mjs`, OU
 * (b) o renderer do protótipo já lhe dá um valor padrão (`b.x || ""`, `V[b.v || "gray"]`).
 * Todo o resto é obrigatório porque aparece em 100% das ocorrências e o renderer
 * o lê sem rede de proteção. Os comentários registram o padrão quando existe.
 */

// ───────────────────────────── paletas ─────────────────────────────

/**
 * Chaves da paleta `V` do protótipo. Cada variante entrega um conjunto
 * `{ bg, fg, bd, kick }` — fundo, texto, borda e cor do kicker de um card.
 * Aparece nos blocos como o campo `v`. Ausente → `gray`.
 */
export type VariantName =
  | 'gray'
  | 'white'
  | 'mint'
  | 'lilac'
  | 'cream'
  | 'navy'
  | 'teal'
  | 'purple'
  | 'yellow'
  | 'blue'
  | 'red'
  | 'green'
  | 'plain'

/** Chaves da paleta `SOLID` do protótipo: cor chapada de chip, bolinha, traço e botão. */
export type SolidName =
  | 'navy'
  | 'teal'
  | 'purple'
  | 'yellow'
  | 'blue'
  | 'white'
  | 'orange'
  | 'red'

/**
 * Campo `c` dos blocos. O renderer resolve primeiro em `SOLID`; quando a chave não
 * existe lá, cai para a variante de mesmo nome em `V` (é por isso que os chips usam
 * `mint`, `lilac` e `cream`, que não são cores chapadas). Sem correspondência em
 * nenhuma das duas, o padrão é `#0E9BAE`.
 */
export type AccentName = SolidName | VariantName

// ──────────────────────── blocos estáticos ─────────────────────────

/** Etiqueta pequena no topo da página ("AULA 01 · CONTINUAÇÃO") + contador opcional de página. */
export interface BadgeBlock {
  t: 'badge'
  label: string
  /** Ex.: "PÁGINA 02". Ausente → não exibe o contador. */
  page?: string
}

/** Título da página: linha em inglês (destaque) sobre a tradução/explicação em português. */
export interface TitleBlock {
  t: 'title'
  en: string
  pt: string
}

/** Divisória de seção em caixa alta ("NA CONVERSA"). */
export interface SecBlock {
  t: 'sec'
  text: string
  /** Só `purple` muda a cor (#5B21B6); qualquer outro valor cai no cinza #6B7280. */
  c?: AccentName
}

/** Igual à `sec`, mas sempre roxa — usada como antetítulo de um trecho. */
export interface KickerBlock {
  t: 'kicker'
  text: string
}

/** Parágrafo de abertura, sem fundo nem borda, em peso 600. */
export interface LeadBlock {
  t: 'lead'
  text: string
}

/** Caixa de observação. Aceita `\n` no texto — cada quebra vira uma linha. */
export interface NoteBlock {
  t: 'note'
  text: string
  /** Ausente → `gray`. */
  v?: VariantName
  /** Antetítulo dentro da caixa ("A IDEIA-CHAVE"). */
  kicker?: string
  /** `true` → barra lateral amarela grossa (6px) em vez da borda fina. */
  bar?: boolean
  /** `true` → peso 800 em vez de 500. */
  bold?: boolean
  /** `true` → texto centralizado. */
  center?: boolean
}

/**
 * Ilustração ou foto da aula. `id` casa com o arquivo em `public/lessons/art/`;
 * `ph` é a descrição textual usada como placeholder e como alt.
 */
export interface ImageBlock {
  t: 'image'
  id: string
  ph: string
  /**
   * URL do arquivo quando a mídia vem da biblioteca do admin (`MediaAsset`).
   * Quando ausente, vale o caminho legado `public/lessons/art/{id}.png`.
   */
  src?: string
  /** Texto alternativo da biblioteca do admin. Ausente → usa `ph`. */
  alt?: string
}

/** Fileira de pastilhas coloridas (vocabulário, pronomes, formas verbais). */
export interface ChipsBlock {
  t: 'chips'
  items: ChipItem[]
  /** Antetítulo da fileira ("1 A 10"). */
  title?: string
}

/** Uma pastilha: `t` é o texto exibido (não confundir com o discriminante dos blocos). */
export interface ChipItem {
  t: string
  /** Ausente → fundo cinza da variante `gray`. */
  c?: AccentName
}

/** Gabarito: mesmas pastilhas da `chips`, com o texto montado como "k · a". */
export interface AnswersBlock {
  t: 'answers'
  title: string
  items: AnswerItem[]
  /** Presente no conteúdo, mas o renderer do protótipo ignora (o gabarito vira chips). */
  v?: VariantName
}

/** Item de gabarito: `k` é o número/letra da questão, `a` é a resposta. */
export interface AnswerItem {
  k: string
  a: string
  /** Ausente → sem cor chapada de fundo. */
  c?: AccentName
}

/** Card de pronome: selo com o código em inglês, tradução e explicação de uso. */
export interface PronBlock {
  t: 'pron'
  /** O pronome em inglês, dentro do selo colorido ("I", "THEY"). */
  code: string
  /** A tradução em caixa alta ("EU", "ELES / ELAS"). */
  pt: string
  /** Linha principal de explicação. */
  title: string
  /** Cor do selo. Ausente → #0F2050. */
  c?: AccentName
  /** Fundo do card. Ausente → `gray`. */
  v?: VariantName
  /** Segunda linha da explicação. */
  body?: string
  /** Etiqueta de destaque ("VOCÊ ESTÁ INCLUÍDO"). Ausente → não renderiza. */
  tag?: string
  /** Rodapé em corpo menor, para a ressalva. */
  foot?: string
  /** `true` → versão compacta, usada nos mapas-resumo. */
  small?: boolean
}

/** Card de objetivo/encerramento: título + texto, com etiqueta opcional. */
export interface ObjectiveBlock {
  t: 'objective'
  title: string
  text: string
  /** Ausente → `gray`. */
  v?: VariantName
  tag?: string
}

/** Linha de metadado em duas colunas ("TEMPO ESTIMADO" · "8 a 12 minutos"). */
export interface MetaBlock {
  t: 'meta'
  label: string
  value: string
}

/** Grade de cards curtos. `cols: 3` aperta o mínimo para 140px; 1 vira coluna única. */
export interface GridBlock {
  t: 'grid'
  cols: 1 | 2 | 3
  items: GridItem[]
}

/** Card da grade. Só `title` é obrigatório; o resto compõe conforme existir. */
export interface GridItem {
  title: string
  /** Numerador exibido num círculo à esquerda. */
  n?: string
  /** Antetítulo acima do título. */
  kicker?: string
  body?: string
  foot?: string
  /** Cor do traço de destaque. Ausente → #0E9BAE. */
  c?: AccentName
  /** Ausente → `gray`. */
  v?: VariantName
}

/** Tabela de duas colunas (forma completa × forma curta, pergunta × resposta). */
export interface TableBlock {
  t: 'table'
  /** Sempre dois cabeçalhos: [coluna A, coluna B]. */
  head: [string, string]
  rows: TableRow[]
}

/** Linha da tabela: `a` → `b`, com anotação opcional presa à coluna A. */
export interface TableRow {
  a: string
  b: string
  note?: string
  /** Ausente → `gray`. */
  v?: VariantName
}

/** Regra gramatical: "de tal sujeito" → "tal forma", com exemplo e tradução. */
export interface RuleBlock {
  t: 'rule'
  /** Antetítulo ("PARA FALAR DE MIM"). */
  kicker: string
  /** Lado esquerdo da regra ("he · she · it"). */
  from: string
  /** Lado direito da regra ("is"). */
  to: string
  /** Frase-exemplo em inglês. */
  ex: string
  /** Tradução da frase-exemplo. */
  tr: string
  /** Ausente → `gray`. */
  v?: VariantName
  /** Cor do traço de destaque. Ausente → #0E9BAE. */
  c?: AccentName
}

/** Par errado × certo, para desfazer um erro comum. */
export interface CompareBlock {
  t: 'compare'
  items: CompareItem[]
}

/** Item do comparativo: a frase errada (com o porquê) e a frase certa (com a tradução). */
export interface CompareItem {
  wrong: string
  right: string
  /** Por que a frase da esquerda está errada. */
  note?: string
  /** Tradução ou comentário da frase certa. */
  rnote?: string
}

/** Cartão de personagem: foto, nome e a lista de fatos sobre ele em inglês. */
export interface ProfileBlock {
  t: 'profile'
  name: string
  /** Casa com o arquivo em `public/lessons/art/`. */
  id: string
  ph: string
  facts: string[]
  /**
   * URL do arquivo quando a mídia vem da biblioteca do admin (`MediaAsset`).
   * Quando ausente, vale o caminho legado `public/lessons/art/{id}.png`.
   */
  src?: string
  /** Texto alternativo da biblioteca do admin. Ausente → usa `ph`. */
  alt?: string
}

/** Chamada para a próxima aula ao fim da página. */
export interface NextBlock {
  t: 'next'
  /** Antetítulo ("PRÓXIMA AULA"). */
  kicker: string
  title: string
  body?: string
}

/** Faixa de fecho com a ideia-chave da página, em uma frase. */
export interface KeyBlock {
  t: 'key'
  text: string
  /** Ausente → `gray`. */
  v?: VariantName
}

/** Cartões de exemplo: etiqueta colorida + frases + foto e nota opcionais. */
export interface CardsBlock {
  t: 'cards'
  items: CardItem[]
  /** `2` → duas colunas responsivas. Ausente ou `1` → coluna única. */
  cols?: 1 | 2
}

/** Cartão de exemplo. */
export interface CardItem {
  /** Etiqueta colorida no topo ("ACROSS FROM"). */
  tag: string
  /** Frases do cartão, uma por linha. Ausente → cartão só com foto. */
  lines?: string[]
  /** Rodapé explicativo. */
  note?: string
  /** Foto: `id` casa com `public/lessons/art/`; a imagem só aparece se houver `id`. */
  id?: string
  ph?: string
  /**
   * URL do arquivo quando a mídia vem da biblioteca do admin (`MediaAsset`).
   * Quando ausente, vale o caminho legado `public/lessons/art/{id}.png`.
   */
  src?: string
  /** Texto alternativo da biblioteca do admin. Ausente → usa `ph`. */
  alt?: string
  /** Cor da etiqueta. Ausente → #0E9BAE. */
  c?: AccentName
  /** Ausente → `gray`. */
  v?: VariantName
}

/** Lista numerada de frases, cada uma com uma bolinha colorida. */
export interface RowsBlock {
  t: 'rows'
  items: RowItem[]
}

/** Linha da lista. Sem `n`, o renderer numera pela posição (1, 2, 3…). */
export interface RowItem {
  text: string
  n?: string | number
  /** Cor da bolinha. Ausente → #0E9BAE. */
  c?: AccentName
}

/** Passo a passo numerado (dar direções, ler um diálogo). */
export interface StepsBlock {
  t: 'steps'
  items: StepItem[]
}

/** Passo. Sem `n`, o renderer numera pela posição. */
export interface StepItem {
  /** Etiqueta do passo ("TURN LEFT"). */
  tag: string
  lines?: string[]
  n?: string | number
  note?: string
  /** Foto do passo; só aparece se houver `id`. */
  id?: string
  ph?: string
  /**
   * URL do arquivo quando a mídia vem da biblioteca do admin (`MediaAsset`).
   * Quando ausente, vale o caminho legado `public/lessons/art/{id}.png`.
   */
  src?: string
  /** Texto alternativo da biblioteca do admin. Ausente → usa `ph`. */
  alt?: string
  /** Cor da etiqueta. Ausente → #0E9BAE. */
  c?: AccentName
  /** Ausente → `gray`. */
  v?: VariantName
}

/** Diálogo em balões alternados entre dois falantes. */
export interface DialogueBlock {
  t: 'dialogue'
  items: DialogueLine[]
}

/** Fala do diálogo: `a` alinha à esquerda (verde), `b` à direita (roxo). */
export interface DialogueLine {
  s: 'a' | 'b'
  text: string
}

/** Barra de progresso da trilha ("PROGRESSO" · "31 DE 42 AULAS" · "74%"). */
export interface BarBlock {
  t: 'bar'
  label: string
  value: string
  /** Percentual já formatado, com o sinal: "74%". */
  pct: string
}

// ────────────────────── blocos interativos ─────────────────────────

/**
 * Múltipla escolha. Corrige na hora, sem botão de conferir.
 * Chave de resposta: `mc:{lessonId}:{blockId}:{índiceDaQuestão}` → índice escolhido.
 */
export interface McBlock {
  t: 'mc'
  /** Entra na chave de resposta. Permanente: nunca renomeie nem reaproveite. */
  id: string
  /** Só rótulo de tela — editá-lo não mexe em resposta gravada. */
  title: string
  questions: McQuestion[]
  /** Ausente → `gray`. */
  v?: VariantName
}

/** Questão de múltipla escolha; `answer` é o índice da opção correta em `options`. */
export interface McQuestion {
  q: string
  options: string[]
  answer: number
  /** Ausente → "Correto!" / "Tente novamente." conforme o acerto. */
  explain?: string
}

/**
 * Completar lacunas. Corrige só quando o aluno toca em conferir.
 * Chaves: `fill:{id}:{índiceDoItem}` → texto digitado; `fill:{id}` → conferido.
 */
export interface FillBlock {
  t: 'fill'
  /** Entra na chave de resposta. */
  id: string
  items: FillItem[]
  title?: string
  sub?: string
  /** Ausente → `gray`. */
  v?: VariantName
  /** `true` → campo largo, para escrever a frase inteira. */
  wide?: boolean
}

/** Lacuna: texto antes do campo, respostas aceitas e texto depois. */
export interface FillItem {
  /** Texto à esquerda do campo ("3. Lucas"). */
  pre: string
  /** Respostas aceitas; a comparação é normalizada (minúsculas, apóstrofo e espaços). */
  answers: string[]
  /** Texto à direita do campo ("Brazilian."). */
  post?: string
  /** Dica exibida junto ao item. */
  note?: string
  /** Ausente → `gray`. */
  v?: VariantName
}

/**
 * Ligar colunas. `answer[i]` é o índice em `right` que corresponde a `left[i]`.
 * Chaves: `matchsel:{blockId}` → seleção em andamento (estado de tela);
 * `match:{blockId}` → conferido, "ok"/"no".
 */
export interface MatchBlock {
  t: 'match'
  /** Entra na chave de resposta. Permanente: nunca renomeie nem reaproveite. */
  id: string
  /** Só rótulo de tela — editá-lo não mexe em resposta gravada. */
  title: string
  left: string[]
  right: string[]
  answer: number[]
}

/**
 * Montar a frase arrastando peças.
 * Chave: `dnd:{id}` → peças posicionadas, conferido e "ok"/"no".
 */
export interface DndBlock {
  t: 'dnd'
  /** Entra na chave de resposta. */
  id: string
  title: string
  sub: string
  /** Rótulo de cada espaço vazio ("verbo", "sujeito", "informação"). */
  slots: string[]
  /** Peças embaralhadas que o aluno arrasta. */
  tokens: string[]
  /** A ordem correta das peças, posição a posição. */
  answer: string[]
}

/**
 * Autoavaliação "EU CONSIGO…". Sem resposta certa: conta como feita quando marcada.
 * Chave: `chk:{id}:{índiceDoItem}` → bool.
 */
export interface CheckBlock {
  t: 'check'
  /** Entra na chave de resposta. */
  id: string
  title: string
  items: string[]
}

/**
 * Produção livre: o aluno escreve a própria frase a partir de um começo pronto.
 * Não é corrigido. Chave: `free:{id}:{índiceDoItem}` → texto digitado.
 */
export interface FreeBlock {
  t: 'free'
  /** Entra na chave de resposta. */
  id: string
  items: FreeItem[]
  /** `2` → duas colunas responsivas. Ausente ou `1` → coluna única. */
  cols?: 1 | 2
}

/** Item de produção livre. */
export interface FreeItem {
  /** Numerador exibido ("1", "2"…). */
  n: string
  /** Missão do item ("FALE SOBRE VOCÊ"). */
  kicker: string
  /** Começo da frase, já escrito ("I am"). */
  prefix: string
  /** Sugestões de vocabulário. Pode vir vazio (""). */
  ideas: string
  /** Cor do traço de destaque. Ausente → #0E9BAE. */
  c?: AccentName
  /** Ausente → `gray`. */
  v?: VariantName
}

/**
 * Chamadas de videoaula e prática oral no fim da aula (recursos de plano pago).
 * Chave: `cta:{lessonId}:{índiceDoItem}` → bool, só para lembrar que o aviso foi aberto.
 */
export interface CtaBlock {
  t: 'cta'
  items: CtaItem[]
}

/** Chamada: `play` é videoaula, `mic` é prática oral com IA. Os dois são do WSA Premium. */
export interface CtaItem {
  icon: 'play' | 'mic'
  title: string
  body: string
  /** Linha do plano exigido. */
  plan: string
  /** Texto do botão. */
  btn: string
  /** Cor do botão. Ausente → #0F2050. */
  c?: AccentName
  /** Ausente → `gray`. Em `teal`, `purple` e `navy` o card vira escuro. */
  v?: VariantName
}

// ───────────────────────── união e agregados ───────────────────────

/** Os 24 blocos que só apresentam conteúdo — nada é salvo no progresso do aluno. */
export type StaticBlock =
  | BadgeBlock
  | TitleBlock
  | SecBlock
  | KickerBlock
  | LeadBlock
  | NoteBlock
  | ImageBlock
  | ChipsBlock
  | AnswersBlock
  | PronBlock
  | ObjectiveBlock
  | MetaBlock
  | GridBlock
  | TableBlock
  | RuleBlock
  | CompareBlock
  | ProfileBlock
  | NextBlock
  | KeyBlock
  | CardsBlock
  | RowsBlock
  | StepsBlock
  | DialogueBlock
  | BarBlock

/** Os 7 blocos que produzem `ExerciseAnswer` — cada um com a sua chave de resposta. */
export type InteractiveBlock =
  | McBlock
  | FillBlock
  | MatchBlock
  | DndBlock
  | CheckBlock
  | FreeBlock
  | CtaBlock

/** Qualquer bloco de uma página. Discrimine por `t`. */
export type Block = StaticBlock | InteractiveBlock

/** O literal do campo `t` de qualquer bloco — útil para mapas de renderizadores. */
export type BlockType = Block['t']

/** Função pedagógica do áudio (prompt-mestre de áudios, seção 18). */
export type CategoriaDeAudio =
  | 'VOCABULARY_PRONUNCIATION'
  | 'GRAMMAR_IN_CONTEXT'
  | 'FIXED_CHUNK'
  | 'DIALOGUE'
  | 'TEXT_LISTENING'
  | 'LISTENING_PRACTICE'
  | 'PRONUNCIATION_MODEL'

/** Um áudio de uma página da aula. */
export interface AudioClip {
  /** "lesson_005_audio_003". Único no curso inteiro. */
  id: string
  /**
   * 'texto' → botão de ouvir ao lado de UMA frase ou palavra.
   * 'bloco' → um player para o bloco inteiro (diálogo completo, "ouvir todos" de uma lista).
   */
  alvo: 'texto' | 'bloco'
  /**
   * O texto EXIBIDO na tela que recebe o botão, caractere por caractere.
   * Para `alvo: 'bloco'`, é o texto do PRIMEIRO item do bloco (primeira fala do diálogo,
   * primeira palavra da lista).
   */
  ancora: string
  /**
   * Transcrição literal do que é falado. Pode diferir da âncora: a tela mostra "HE", o áudio
   * diz "he"; a tela mostra "Yes, I am. / No, I’m not.", o áudio diz as duas frases.
   * Em diálogo, as falas vêm separadas por "\n".
   */
  texto: string
  /** Caminho público: "/audio/aula-05/lesson_005_audio_003.1a2b3c4d.mp3". */
  src: string
  categoria: CategoriaDeAudio
  /** `true` → o botão "ouvir mais devagar" aparece (reprodução a 80%, mesmo arquivo). */
  lento?: boolean
}

/** Uma página da aula: unidade de navegação e de progresso (`LessonProgress.currentPage`). */
export interface LessonPage {
  blocks: Block[]
  /** Áudios da página. Ausente ou vazio → a página não tem áudio. */
  audios?: AudioClip[]
}

/** Uma aula como vem do `course-data.mjs` — a forma crua, sem os campos derivados. */
export interface Lesson {
  /** Número da aula, de 1 a 42. */
  id: number
  /** Código exibido ("AULA 01"). */
  code: string
  /** Título em inglês ("Subject Pronouns"). */
  title: string
  /** Subtítulo em português. Fonte de verdade — nunca use a constante SUBS do protótipo. */
  sub: string
  /** Tempo estimado ("8 a 12 minutos"). Fonte de verdade — nunca use TIMES do protótipo. */
  time: string
  pages: LessonPage[]
}

/** Aula resumida para listas: trilha, home e progresso. Sem o peso das páginas. */
export interface LessonSummary {
  /** Número da aula, de 1 a 42. */
  id: number
  code: string
  slug: string
  title: string
  subtitle: string
  time: string
  /** "/lessons/capas/NN.png" nas aulas 1 a 10; `null` nas demais (ainda sem capa). */
  cover: string | null
  pageCount: number
  /** Módulo de 1 a 7 ao qual a aula pertence. */
  moduleId: number
}

/** Entrada da trilha, como exportada por `TRACK`: número da aula e título em inglês. */
export interface TrackItem {
  n: number
  t: string
}

/** Um dos 7 módulos do curso, com o intervalo de aulas que cobre. */
export interface CourseModule {
  /** De 1 a 7. */
  id: number
  title: string
  /** Primeira aula do módulo (inclusive). */
  from: number
  /** Última aula do módulo (inclusive). */
  to: number
}
