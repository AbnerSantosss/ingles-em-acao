/**
 * Blocos estáticos em forma de cartão do motor de aulas:
 * `cards`, `steps`, `pron`, `objective`, `rule`, `next`, `image`, `profile`.
 *
 * Réplica do protótipo (`prototype/mobile.dc.html`: template ~584–958,
 * resolvers ~1157–1436). Cor vinda do dado entra em `style` inline via
 * `@/lib/ui/palette`; cor fixa fica no `className` com o hex exato do
 * protótipo. Toda imagem passa pelo `Ilustracao`, que decide entre mídia do
 * admin, arte legada e placeholder. Server Components puros, sem estado.
 */

import { Ilustracao } from "./Ilustracao";
import { SOLID_FG, isSolidName, solid, variant } from "@/lib/ui/palette";
import type {
  AccentName,
  CardsBlock,
  ImageBlock,
  NextBlock,
  ObjectiveBlock,
  ProfileBlock,
  PronBlock,
  RuleBlock,
  StepsBlock,
} from "@/lib/content/types";

/**
 * Texto legível sobre uma cor chapada. O protótipo fixava branco em etiquetas
 * e selos; sobre amarelo isso não passa em contraste, e a regra da marca é
 * texto navy sobre amarelo (CONTRACT §3). Fora da paleta `SOLID` a cor cai no
 * teal padrão (#0E9BAE), que aceita branco.
 */
function corDeTexto(c: AccentName | undefined): string {
  return c && isSolidName(c) ? SOLID_FG[c] : "#FFFFFF";
}

/** Numeração por posição quando falta `n` (o mesmo `n || i + 1` do protótipo). */
function numero(n: string | number | undefined, i: number): string | number {
  return n === undefined || n === "" ? i + 1 : n;
}

/** Ilustração da aula em proporção 16/9. */
export function BlocoImage({ bloco }: { bloco: ImageBlock }) {
  return (
    <Ilustracao
      id={bloco.id}
      ph={bloco.ph}
      src={bloco.src}
      alt={bloco.alt}
      proporcao="16 / 9"
      raio={18}
    />
  );
}

/**
 * Cartões de exemplo: etiqueta colorida no topo, foto opcional, frases e nota.
 * `cols: 2` vira grade responsiva de no mínimo 160px por coluna.
 */
export function BlocoCards({ bloco }: { bloco: CardsBlock }) {
  const colunas = bloco.cols === 2 ? "repeat(auto-fit, minmax(160px,1fr))" : "1fr";

  return (
    <div className="grid gap-3" style={{ gridTemplateColumns: colunas }}>
      {bloco.items.map((c, i) => {
        const v = variant(c.v);
        const etiqueta = solid(c.c);
        return (
          <div
            key={i}
            className="overflow-hidden rounded-[18px] border border-solid"
            style={{ background: v.bg, borderColor: v.bd }}
          >
            <div
              className="px-4 py-[11px] text-[13px] font-extrabold tracking-[0.07em]"
              style={{ background: etiqueta, color: corDeTexto(c.c) }}
            >
              {c.tag}
            </div>
            <div className="flex flex-col gap-2.5 p-3.5">
              {c.id || c.src ? (
                <Ilustracao
                  id={c.id}
                  ph={c.ph}
                  src={c.src}
                  alt={c.alt}
                  proporcao="16 / 10"
                  raio={14}
                />
              ) : null}
              {(c.lines ?? []).map((linha, j) => (
                <div
                  key={j}
                  className="rounded-[12px] border border-[#E6E8EE] bg-white px-3.5 py-3 text-[15px] font-bold leading-[1.4] text-[#0F2050]"
                >
                  {linha}
                </div>
              ))}
              {c.note ? (
                <div
                  className="text-[13px] font-bold leading-[1.4]"
                  style={{ color: etiqueta }}
                >
                  {c.note}
                </div>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/** Passo a passo numerado, com etiqueta, frases, foto e nota opcionais. */
export function BlocoSteps({ bloco }: { bloco: StepsBlock }) {
  return (
    <ol className="m-0 flex list-none flex-col gap-3 p-0">
      {bloco.items.map((s, i) => {
        const v = variant(s.v);
        return (
          <li
            key={i}
            className="rounded-[18px] border border-solid p-3.5"
            style={{ background: v.bg, borderColor: v.bd }}
          >
            <div className="mb-2.5 flex items-center gap-2.5">
              <span
                aria-hidden="true"
                className="grid h-7 w-7 flex-none place-items-center rounded-full text-[14px] font-black text-white"
                style={{ background: solid(s.c) }}
              >
                {numero(s.n, i)}
              </span>
              <span className="rounded-[8px] bg-[#0F2050] px-[13px] py-[7px] text-[12px] font-extrabold tracking-[0.07em] text-white">
                {s.tag}
              </span>
            </div>
            {(s.lines ?? []).map((linha, j) => (
              <div
                key={j}
                className="mb-1.5 text-[15px] font-bold leading-[1.45] text-[#0F2050]"
              >
                {linha}
              </div>
            ))}
            {s.id || s.src ? (
              <div className="mt-2">
                <Ilustracao
                  id={s.id}
                  ph={s.ph}
                  src={s.src}
                  alt={s.alt}
                  proporcao="16 / 10"
                  raio={14}
                />
              </div>
            ) : null}
            {s.note ? (
              <div className="mt-2.5 rounded-[12px] border border-[#E6E8EE] bg-white px-3 py-2.5 text-[13px] font-bold leading-[1.4] text-[#3C4A5C]">
                {s.note}
              </div>
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}

/**
 * Card de pronome: selo colorido com o pronome em inglês e a tradução, ao lado
 * da explicação de uso.
 *
 * `small` não existe no resolver do protótipo, mas está no contrato de tipos
 * (`PronBlock.small`: "versão compacta, usada nos mapas-resumo") e é o que o
 * conteúdo pede nas páginas de mapa, onde quatro desses cards se empilham.
 * A compactação é discreta: só encolhe o selo e os espaçamentos, sem mexer em
 * cor nem em hierarquia.
 */
export function BlocoPron({ bloco }: { bloco: PronBlock }) {
  const v = variant(bloco.v);
  // O selo do protótipo cai em #0F2050 (e não no teal) quando `c` não é sólida.
  const selo = bloco.c && isSolidName(bloco.c) ? solid(bloco.c) : "#0F2050";
  const compacto = bloco.small === true;

  return (
    <div
      className="flex items-stretch gap-3.5 overflow-hidden rounded-[18px]"
      style={{ background: v.bg }}
    >
      <div
        className={
          compacto
            ? "flex min-w-[72px] flex-none flex-col items-center justify-center gap-0.5 px-2.5 py-3 text-center"
            : "flex min-w-[84px] flex-none flex-col items-center justify-center gap-0.5 px-2.5 py-4 text-center lg:min-w-[104px] lg:px-3.5 lg:py-[18px]"
        }
        style={{ background: selo, color: corDeTexto(bloco.c) }}
      >
        <span
          className={
            compacto
              ? "text-[19px] font-black leading-[1.05]"
              : "text-[22px] font-black leading-[1.05] lg:text-[26px]"
          }
        >
          {bloco.code}
        </span>
        <span className="text-[11px] font-extrabold tracking-[0.08em] opacity-85">
          {bloco.pt}
        </span>
      </div>
      <div
        className={
          compacto
            ? "flex flex-col justify-center gap-1 py-3 pl-0.5 pr-[18px]"
            : "flex flex-col justify-center gap-1 py-4 pl-0.5 pr-[18px]"
        }
      >
        <div className="text-[17px] font-extrabold text-[#0F2050] [text-wrap:pretty]">
          {bloco.title}
        </div>
        {bloco.body ? (
          <div className="text-[15px] text-[#6B7280]">{bloco.body}</div>
        ) : null}
        {bloco.foot ? (
          <div className="text-[13px] font-extrabold text-purple">{bloco.foot}</div>
        ) : null}
        {bloco.tag ? (
          <span className="mt-1 self-start rounded-pill bg-white px-3 py-1.5 text-[11px] font-extrabold tracking-[0.06em] text-[#0F2050]">
            {bloco.tag}
          </span>
        ) : null}
      </div>
    </div>
  );
}

/** Card de objetivo/encerramento. O texto aceita `\n` (uma linha por quebra). */
export function BlocoObjective({ bloco }: { bloco: ObjectiveBlock }) {
  const v = variant(bloco.v);

  return (
    <div
      className="rounded-[18px] border border-solid px-[22px] py-5"
      style={{ background: v.bg, borderColor: v.bd }}
    >
      {bloco.tag ? (
        <span className="mb-2.5 inline-block rounded-[8px] bg-[#F2C230] px-3 py-1.5 text-[11px] font-extrabold tracking-[0.07em] text-[#0F2050]">
          {bloco.tag}
        </span>
      ) : null}
      <div
        className="mb-2 text-[13px] font-extrabold tracking-[0.08em]"
        style={{ color: v.kick }}
      >
        {bloco.title}
      </div>
      <p
        className="m-0 whitespace-pre-line text-[16px] font-bold leading-[1.5]"
        style={{ color: v.fg }}
      >
        {bloco.text}
      </p>
    </div>
  );
}

/**
 * Regra gramatical: "de tal sujeito" vira "tal forma", com exemplo e tradução.
 * A seta é decorativa; a relação entre os dois lados vai em texto para leitor
 * de tela, senão a regra chega como duas palavras soltas.
 */
export function BlocoRule({ bloco }: { bloco: RuleBlock }) {
  const v = variant(bloco.v);
  const destaque = solid(bloco.c);

  return (
    <div
      className="rounded-[16px] border-l-[6px] border-solid px-5 py-[18px]"
      style={{ background: v.bg, borderLeftColor: destaque }}
    >
      <div
        className="mb-3 text-[12px] font-extrabold tracking-[0.08em]"
        style={{ color: destaque }}
      >
        {bloco.kicker}
      </div>
      <div className="flex flex-wrap items-center gap-3.5">
        <span className="rounded-[14px] bg-white px-[22px] py-3.5 text-[22px] font-black text-[#0F2050]">
          {bloco.from}
        </span>
        <span className="text-[20px] font-black" style={{ color: destaque }}>
          <span aria-hidden="true">⟶</span>
          <span className="sr-only">vira</span>
        </span>
        <span
          className="rounded-[14px] px-[22px] py-3.5 text-[22px] font-black"
          style={{ background: destaque, color: corDeTexto(bloco.c) }}
        >
          {bloco.to}
        </span>
      </div>
      <div className="mt-3 text-[15px] font-extrabold text-[#0F2050]">
        {bloco.ex} <span className="font-semibold text-[#6B7280]">{bloco.tr}</span>
      </div>
    </div>
  );
}

/** Chamada para a próxima aula, ao fim da página. */
export function BlocoNext({ bloco }: { bloco: NextBlock }) {
  return (
    <div className="rounded-[18px] bg-[#0F2050] p-[22px] text-center">
      <div className="mb-1.5 text-[12px] font-extrabold tracking-[0.08em] text-[#F2C230]">
        {bloco.kicker}
      </div>
      <div className="text-[22px] font-black text-white">{bloco.title}</div>
      {bloco.body ? (
        <div className="mt-1.5 text-[14px] text-[#B9C3DA]">{bloco.body}</div>
      ) : null}
    </div>
  );
}

/** Cartão de personagem: nome, fatos verdadeiros em inglês e foto de 190px. */
export function BlocoProfile({ bloco }: { bloco: ProfileBlock }) {
  return (
    <div className="grid grid-cols-2 items-center gap-4 rounded-[18px] bg-[#0F2050] p-[18px]">
      <div>
        <div className="mb-2.5 text-[12px] font-extrabold tracking-[0.08em] text-[#F2C230]">
          {bloco.name}
        </div>
        <div className="rounded-[14px] bg-white px-4 py-3.5">
          <div className="mb-2 text-[11px] font-extrabold tracking-[0.07em] text-purple">
            INFORMAÇÕES VERDADEIRAS
          </div>
          <ul className="m-0 list-none p-0">
            {bloco.facts.map((f, i) => (
              <li
                key={i}
                className="mb-1 text-[15px] font-extrabold text-[#0F2050]"
              >
                <span aria-hidden="true">• </span>
                {f}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <Ilustracao
        id={bloco.id}
        ph={bloco.ph}
        src={bloco.src}
        alt={bloco.alt}
        altura={190}
        raio={14}
      />
    </div>
  );
}
