/**
 * Blocos estáticos de texto do motor de aulas:
 * `badge`, `title`, `sec`, `kicker`, `lead`, `note`, `key`, `meta`, `bar`.
 *
 * Réplica fiel do protótipo (`prototype/mobile.dc.html`: template dos blocos
 * ~584–958, resolvers ~1157–1436). Regra de cor adotada em todo o motor:
 * quando a cor vem do dado (`v`/`c`), ela entra em `style` inline via
 * `@/lib/ui/palette`; quando é fixa, fica no `className` com o valor exato do
 * protótipo. Alguns hexes do protótipo não são token da marca (#0F2050,
 * #6B7280, #F2C230, #9AA1AE) e por isso aparecem literais — mudá-los para o
 * token mais próximo alteraria o desenho.
 *
 * Nenhum bloco daqui tem estado próprio. O botão de ouvir de `lead`, `note` e
 * `key` vem do `OuvirTexto` (Client Component, pacote 08).
 */

// OuvirTexto é Client Component: o botão só aparece quando a página tem um clipe para este texto.
import { OuvirTexto } from "@/components/lesson/audio/OuvirTexto";
import { cn } from "@/lib/ui/cn";
import { variant } from "@/lib/ui/palette";
import type {
  BadgeBlock,
  BarBlock,
  KeyBlock,
  KickerBlock,
  LeadBlock,
  MetaBlock,
  NoteBlock,
  SecBlock,
  TitleBlock,
} from "@/lib/content/types";

/** Etiqueta amarela da página + contador opcional ("PÁGINA 02"). */
export function BlocoBadge({ bloco }: { bloco: BadgeBlock }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="inline-block rounded-[9px] bg-[#F2C230] px-[14px] py-2 fs-rotulo font-extrabold tracking-[0.07em] text-[#0F2050]">
        {bloco.label}
      </span>
      {bloco.page ? (
        <span className="fs-rotulo font-extrabold tracking-[0.08em] text-[#9AA1AE]">
          {bloco.page}
        </span>
      ) : null}
    </div>
  );
}

/**
 * Título da página: frase em inglês sobre a tradução em português. No desktop,
 * os 38px/19px do design do Claude Designer.
 */
export function BlocoTitle({ bloco }: { bloco: TitleBlock }) {
  return (
    <div>
      <h1 className="m-0 mb-1.5 fs-titulo font-black leading-[1.05] text-[#0F2050] [text-wrap:pretty] lg:leading-[1.03]">
        {bloco.en}
      </h1>
      {/* Teal de link (o `--link` do globals.css). O #0E9BAE do protótipo dava
          3,32 nesta linha de 17px, que é texto pequeno no celular. */}
      <p className="m-0 text-[17px] font-extrabold text-[#0E7A8B] [text-wrap:pretty] lg:text-[19px]">
        {bloco.pt}
      </p>
    </div>
  );
}

/** Divisória de seção em caixa alta. Só `c === "purple"` muda a cor. */
export function BlocoSec({ bloco }: { bloco: SecBlock }) {
  return (
    <h3
      className="m-0 text-[13px] font-extrabold tracking-[0.09em]"
      style={{ color: bloco.c === "purple" ? "#5B21B6" : "#6B7280" }}
    >
      {bloco.text}
    </h3>
  );
}

/** Igual à `sec`, mas sempre roxa (#5B21B6 = token --purple). */
export function BlocoKicker({ bloco }: { bloco: KickerBlock }) {
  return (
    <h3 className="m-0 text-[13px] font-extrabold tracking-[0.09em] text-purple">
      {bloco.text}
    </h3>
  );
}

/**
 * Parágrafo de abertura. No protótipo é a mesma caixa da `note` com fundo,
 * borda e barra transparentes — inclusive o recuo de 16px/18px, que é o que
 * mantém o `lead` alinhado com as caixas vizinhas.
 */
export function BlocoLead({ bloco }: { bloco: LeadBlock }) {
  return (
    <div className="rounded-[14px] px-[18px] py-4">
      <OuvirTexto texto={bloco.text} forma="lado">
        <p className="m-0 whitespace-pre-line fs-leitura font-semibold leading-[1.5] text-[#1F2430]">
          {bloco.text}
        </p>
      </OuvirTexto>
    </div>
  );
}

/** Caixa de observação. `bar` troca a borda fina por uma faixa amarela de 6px. */
export function BlocoNote({ bloco }: { bloco: NoteBlock }) {
  const v = variant(bloco.v);

  return (
    <div
      className={cn(
        "rounded-[14px] px-[18px] py-4",
        bloco.center ? "text-center" : "text-left",
      )}
      style={{
        background: v.bg,
        border: `1px solid ${v.bd}`,
        // A ordem importa: `borderLeft` sobrescreve o atalho `border` acima.
        borderLeft: bloco.bar ? "6px solid #F2C230" : `1px solid ${v.bd}`,
      }}
    >
      {bloco.kicker ? (
        <div className="mb-1.5 fs-rotulo font-extrabold tracking-[0.08em] text-purple">
          {bloco.kicker}
        </div>
      ) : null}
      <OuvirTexto texto={bloco.text} forma="lado">
        <p
          className="m-0 whitespace-pre-line fs-leitura leading-[1.5]"
          style={{ fontWeight: bloco.bold ? 800 : 500, color: v.fg }}
        >
          {bloco.text}
        </p>
      </OuvirTexto>
    </div>
  );
}

/** Faixa de fecho com a ideia-chave da página. */
export function BlocoKey({ bloco }: { bloco: KeyBlock }) {
  const v = variant(bloco.v);

  return (
    <div
      className="rounded-[16px] px-5 py-[18px] text-center fs-leitura font-extrabold leading-[1.45]"
      style={{ background: v.bg, color: v.fg }}
    >
      <OuvirTexto texto={bloco.text}>{bloco.text}</OuvirTexto>
    </div>
  );
}

/** Linha de metadado ("TEMPO ESTIMADO" · "8 a 12 minutos"). */
export function BlocoMeta({ bloco }: { bloco: MetaBlock }) {
  return (
    <div className="inline-flex items-center gap-3 rounded-[16px] border border-[#E6E8EE] bg-white px-[18px] py-3">
      <div
        aria-hidden="true"
        className="grid h-[34px] w-[34px] flex-none place-items-center rounded-full bg-purple text-[15px] text-white"
      >
        ◷
      </div>
      <div>
        <div className="fs-rotulo font-extrabold tracking-[0.08em] text-[#6B7280]">
          {bloco.label}
        </div>
        <div className="text-[17px] font-black text-[#0F2050]">{bloco.value}</div>
      </div>
    </div>
  );
}

/**
 * Barra de progresso da trilha. `pct` já chega formatado ("74%") e vai direto
 * para a largura. O trilho ganha `role="img"` porque a proporção preenchida é
 * informação: sem isso, só a cor contaria a história.
 */
export function BlocoBar({ bloco }: { bloco: BarBlock }) {
  return (
    <div className="rounded-[18px] border border-[#F8E7B4] bg-[#FEF7E0] px-[18px] py-4">
      <div className="mb-1 fs-rotulo font-extrabold tracking-[0.08em] text-[#B67F0C]">
        {bloco.label}
      </div>
      <div className="mb-2.5 text-[19px] font-black text-[#0F8F7A]">{bloco.value}</div>
      <div
        role="img"
        aria-label={`${bloco.label}: ${bloco.value}, ${bloco.pct}`}
        className="h-2.5 overflow-hidden rounded-pill bg-[#EFE6CC]"
      >
        <div className="h-full rounded-pill bg-teal" style={{ width: bloco.pct }} />
      </div>
    </div>
  );
}
