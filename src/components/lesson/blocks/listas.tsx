/**
 * Blocos estáticos de lista e tabela do motor de aulas:
 * `chips`, `answers`, `rows`, `table`, `grid`, `dialogue`, `compare`.
 *
 * Réplica do protótipo (`prototype/mobile.dc.html`: template ~584–958,
 * resolvers ~1157–1436). Cor vinda do dado entra em `style` inline via
 * `@/lib/ui/palette`; cor fixa fica no `className` com o hex exato do
 * protótipo. Nenhum bloco daqui tem estado próprio. Os botões de ouvir e o
 * player de bloco vêm de `OuvirTexto` e `OuvirBloco` (Client Components,
 * pacote 08) e só aparecem quando a página tem clipe para aquele texto.
 */

import type { CSSProperties } from "react";

import { OuvirBloco } from "@/components/lesson/audio/OuvirBloco";
import { OuvirTexto } from "@/components/lesson/audio/OuvirTexto";
import { ROTULO_OUVIR_DIALOGO, ROTULO_OUVIR_TODOS } from "@/components/lesson/audio/rotulos";
import { cn } from "@/lib/ui/cn";
import { SOLID, SOLID_FG, isSolidName, solid, variant } from "@/lib/ui/palette";
import type {
  AccentName,
  AnswersBlock,
  ChipsBlock,
  CompareBlock,
  DialogueBlock,
  GridBlock,
  RowsBlock,
  TableBlock,
} from "@/lib/content/types";

/**
 * Cor de uma pastilha. O protótipo resolve primeiro em `SOLID` (fundo chapado,
 * texto claro) e só cai na variante `V` quando o nome não é cor chapada —
 * é assim que `mint`, `lilac` e `cream` funcionam como chip.
 *
 * Duas correções conscientes em cima do protótipo: o chip amarelo recebe texto
 * navy (regra da marca) e o chip branco também, com borda, porque o protótipo
 * devolvia branco sobre branco — chip invisível. A tabela `SOLID_FG` do
 * `palette.ts` já carrega essa decisão.
 */
function corDeChip(c: AccentName | undefined): {
  bg: string;
  fg: string;
  bd: string;
} {
  if (c && isSolidName(c)) {
    return {
      bg: SOLID[c],
      fg: SOLID_FG[c],
      bd: c === "white" ? "#E3EAF3" : "transparent",
    };
  }
  const v = variant(c);
  return { bg: v.bg, fg: v.fg, bd: "transparent" };
}

/**
 * Grade auto-ajustável cujo mínimo por coluna vem de `--col-min` (celular) e
 * `--col-min-lg` (desktop). Quem usa define as duas variáveis no `style`.
 */
export const GRADE_FLEXIVEL =
  "grid-cols-[repeat(auto-fit,minmax(min(100%,var(--col-min)),1fr))] lg:grid-cols-[repeat(auto-fit,minmax(min(100%,var(--col-min-lg)),1fr))]";

/** Numeração por posição quando falta `n` (o mesmo `n || i + 1` do protótipo). */
function numero(n: string | number | undefined, i: number): string | number {
  return n === undefined || n === "" ? i + 1 : n;
}

type Pastilha = { texto: string; c?: AccentName };

/** Fileira de pastilhas — desenho compartilhado por `chips` e `answers`. */
function Pastilhas({
  title,
  itens,
  comAudio = false,
}: {
  title?: string;
  itens: Pastilha[];
  /** `true` só no `chips`: o gabarito (`answers`) não tem áudio. */
  comAudio?: boolean;
}) {
  return (
    <div>
      {title ? (
        <div className="mb-2.5 text-[13px] font-extrabold tracking-[0.08em] text-[#6B7280]">
          {title}
        </div>
      ) : null}
      <div className="flex flex-wrap gap-2">
        {itens.map((item, i) => {
          const cor = corDeChip(item.c);
          return (
            <span
              key={i}
              className="rounded-pill border border-solid px-4 py-[9px] fs-leitura font-extrabold"
              style={{ background: cor.bg, color: cor.fg, borderColor: cor.bd }}
            >
              {comAudio ? (
                <OuvirTexto texto={item.texto} compacto>
                  {item.texto}
                </OuvirTexto>
              ) : (
                item.texto
              )}
            </span>
          );
        })}
      </div>
    </div>
  );
}

/** Pastilhas de vocabulário, pronomes e formas verbais. */
export function BlocoChips({ bloco }: { bloco: ChipsBlock }) {
  return (
    <OuvirBloco bloco={bloco} rotulo={ROTULO_OUVIR_TODOS}>
      <Pastilhas
        title={bloco.title}
        itens={bloco.items.map((c) => ({ texto: c.t, c: c.c }))}
        comAudio
      />
    </OuvirBloco>
  );
}

/**
 * Gabarito: as mesmas pastilhas, com o texto montado como "k · a". O `v` do
 * bloco é ignorado — o protótipo faz o mesmo. Item sem `c` cai no cinza da
 * variante `gray`; no protótipo ficava com texto branco e sem fundo nenhum,
 * ou seja, invisível.
 */
export function BlocoAnswers({ bloco }: { bloco: AnswersBlock }) {
  return (
    <Pastilhas
      title={bloco.title}
      itens={bloco.items.map((it) => ({ texto: `${it.k} · ${it.a}`, c: it.c }))}
    />
  );
}

/** Lista numerada de frases, cada uma com a bolinha colorida. */
export function BlocoRows({ bloco }: { bloco: RowsBlock }) {
  return (
    <OuvirBloco bloco={bloco} rotulo={ROTULO_OUVIR_TODOS}>
      <ol className="m-0 flex list-none flex-col gap-2.5 p-0">
        {bloco.items.map((r, i) => (
          <li
            key={i}
            className="flex items-center gap-3 rounded-[16px] border border-[#E6E8EE] bg-white px-[14px] py-3 shadow-[0_3px_10px_rgba(11,31,75,0.04)]"
          >
            <span
              aria-hidden="true"
              className="grid h-[34px] w-[34px] flex-none place-items-center rounded-full text-[14px] font-black text-white"
              style={{ background: solid(r.c) }}
            >
              {numero(r.n, i)}
            </span>
            <OuvirTexto texto={r.text} forma="lado" compacto>
              <span className="fs-leitura font-bold leading-[1.4] text-[#0F2050]">
                {r.text}
              </span>
            </OuvirTexto>
          </li>
        ))}
      </ol>
    </OuvirBloco>
  );
}

/**
 * Tabela de duas colunas (cabeçalho A navy, cabeçalho B teal) com a seta no
 * meio de cada linha. Continua em `div`: virar `<table>` obrigaria a inventar
 * um cabeçalho para a coluna da seta. A seta é decorativa e a relação entre as
 * duas formas é dita em texto para quem usa leitor de tela.
 */
export function BlocoTable({ bloco }: { bloco: TableBlock }) {
  return (
    <OuvirBloco bloco={bloco} rotulo={ROTULO_OUVIR_TODOS}>
      <div>
        <div className="mb-2.5 grid grid-cols-2 gap-2.5">
          <div className="rounded-[12px] bg-[#0F2050] px-4 py-3 fs-rotulo font-extrabold tracking-[0.08em] text-white">
            {bloco.head[0]}
          </div>
          <div className="rounded-[12px] bg-[#0E9BAE] px-4 py-3 text-center fs-rotulo font-extrabold tracking-[0.08em] text-white">
            {bloco.head[1]}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          {bloco.rows.map((r, i) => {
            const v = variant(r.v);
            return (
              <div
                key={i}
                className="grid grid-cols-[1fr_auto_1fr] items-center gap-2.5 rounded-[14px] px-[18px] py-3.5"
                style={{ background: v.bg }}
              >
                <span className="text-[17px] font-extrabold text-[#0F2050]">
                  <OuvirTexto texto={r.a} compacto>
                    {r.a}
                  </OuvirTexto>
                  {r.note ? (
                    <span className="fs-apoio font-bold text-[#9AA1AE]">
                      {" "}
                      {r.note}
                    </span>
                  ) : null}
                </span>
                <span className="text-[16px] font-extrabold" style={{ color: v.kick }}>
                  <span aria-hidden="true">⟶</span>
                  <span className="sr-only">vira</span>
                </span>
                <span
                  className="text-center text-[17px] font-extrabold"
                  style={{ color: v.kick }}
                >
                  <OuvirTexto texto={r.b} compacto>
                    {r.b}
                  </OuvirTexto>
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </OuvirBloco>
  );
}

/**
 * Grade de cards curtos. `1` vira coluna única. No celular o mínimo por coluna é
 * 160px (140px com `cols: 3`); no desktop, os 230px (190px) do design do Claude
 * Designer — as duas larguras moram em variáveis CSS e o `lg:` troca uma pela
 * outra, sem JS medindo a tela.
 */
export function BlocoGrid({ bloco }: { bloco: GridBlock }) {
  const umaColuna = bloco.cols === 1;
  const minimos = {
    "--col-min": bloco.cols === 3 ? "140px" : "160px",
    "--col-min-lg": bloco.cols === 3 ? "190px" : "230px",
  } as CSSProperties;

  return (
    <OuvirBloco bloco={bloco} rotulo={ROTULO_OUVIR_TODOS}>
      <div
        className={cn(
          "grid gap-3",
          umaColuna ? "grid-cols-1" : GRADE_FLEXIVEL,
        )}
        style={umaColuna ? undefined : minimos}
      >
        {bloco.items.map((g, i) => {
          const v = variant(g.v);
          return (
            <div
              key={i}
              className="rounded-[18px] border border-solid p-[18px]"
              style={{ background: v.bg, borderColor: v.bd }}
            >
              {g.n || g.kicker ? (
                <div className="mb-2 flex items-center gap-[9px]">
                  {g.n ? (
                    <span
                      aria-hidden="true"
                      className="grid h-[26px] w-[26px] flex-none place-items-center rounded-full text-[13px] font-extrabold text-white"
                      style={{ background: solid(g.c) }}
                    >
                      {g.n}
                    </span>
                  ) : null}
                  {g.kicker ? (
                    <span
                      className="fs-rotulo font-extrabold tracking-[0.08em]"
                      style={{ color: v.kick }}
                    >
                      {g.kicker}
                    </span>
                  ) : null}
                </div>
              ) : null}
              <div className="text-[19px] font-black text-[#0F2050] [text-wrap:pretty]">
                <OuvirTexto texto={g.title}>{g.title}</OuvirTexto>
              </div>
              {g.body ? (
                <div className="mt-1 fs-apoio text-[#6B7280]">{g.body}</div>
              ) : null}
              {g.foot ? (
                <div
                  className="mt-1.5 fs-apoio font-extrabold"
                  style={{ color: v.kick }}
                >
                  {g.foot}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </OuvirBloco>
  );
}

/**
 * Diálogo em balões alternados. No protótipo só a cor e o lado do balão dizem
 * quem fala; aqui cada balão ganha o falante em texto para leitor de tela.
 */
export function BlocoDialogue({ bloco }: { bloco: DialogueBlock }) {
  return (
    <OuvirBloco bloco={bloco} rotulo={ROTULO_OUVIR_DIALOGO}>
      <div className="flex flex-col gap-2.5 rounded-[18px] border border-[#E6E8EE] bg-white px-3.5 py-4">
        {bloco.items.map((d, i) => {
          const segundo = d.s === "b";
          return (
            <div
              key={i}
              className={cn(
                "flex max-w-[92%] items-start gap-2",
                segundo ? "flex-row-reverse self-end" : "flex-row self-start",
              )}
            >
              <span
                aria-hidden="true"
                className="mt-3 h-4 w-4 flex-none rounded-full"
                style={{ background: segundo ? "#5B21B6" : "#12A594" }}
              />
              <div
                className="rounded-[16px] border-[1.5px] border-solid px-3.5 py-[11px] fs-leitura leading-[1.4] text-[#1F2430]"
                style={{
                  background: segundo ? "#F7F4FE" : "#F0FAF8",
                  borderColor: segundo ? "#DCD2F6" : "#C7EBEE",
                }}
              >
                <span className="sr-only">
                  {segundo ? "Segunda pessoa: " : "Primeira pessoa: "}
                </span>
                <OuvirTexto texto={d.text} compacto>
                  {d.text}
                </OuvirTexto>
              </div>
            </div>
          );
        })}
      </div>
    </OuvirBloco>
  );
}

/** Par errado × certo. O rótulo é texto ("ERRADO", "CORRETO"), não só cor. */
export function BlocoCompare({ bloco }: { bloco: CompareBlock }) {
  return (
    <OuvirBloco bloco={bloco} rotulo={ROTULO_OUVIR_TODOS}>
      <div className="flex flex-col gap-2.5">
        {bloco.items.map((c, i) => (
          <div key={i} className="grid grid-cols-2 gap-2.5">
            <div className="rounded-[14px] bg-[#FDE8EA] px-4 py-3.5">
              <div className="mb-1.5 fs-rotulo font-extrabold tracking-[0.07em] text-[#9B1C2E]">
                ERRADO <span aria-hidden="true">✕</span>
              </div>
              <div className="fs-leitura font-extrabold text-[#1F2430]">{c.wrong}</div>
              {c.note ? (
                <div className="mt-1 fs-apoio text-[#9B1C2E]">{c.note}</div>
              ) : null}
            </div>
            <div className="rounded-[14px] bg-[#E4F5EA] px-4 py-3.5">
              <div className="mb-1.5 fs-rotulo font-extrabold tracking-[0.07em] text-[#1B6B3A]">
                CORRETO <span aria-hidden="true">✓</span>
              </div>
              <div className="fs-leitura font-extrabold text-[#1F2430]">
                <OuvirTexto texto={c.right} compacto>
                  {c.right}
                </OuvirTexto>
              </div>
              {c.rnote ? (
                <div className="mt-1 fs-apoio text-[#1B6B3A]">{c.rnote}</div>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </OuvirBloco>
  );
}
