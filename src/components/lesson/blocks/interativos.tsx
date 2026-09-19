'use client';

/**
 * Os 7 blocos que produzem resposta do aluno: `mc`, `fill`, `match`, `dnd`, `check`,
 * `free` e `cta`.
 *
 * Fidelidade visual: cada medida, peso e cor vem do protótipo
 * (`prototype/mobile.dc.html` — resolvers ~1157–1436, template ~584–958). Onde a cor
 * vem do dado (`V` / `SOLID`), ela entra em `style` inline, como lá; onde é cor fixa
 * do bloco, entra como valor literal de utilitário Tailwind, para ficar à vista de
 * quem comparar com o protótipo.
 *
 * Onde o protótipo NÃO serve, melhoramos:
 *
 *   • Acerto e erro não podem ser só cor e "✓"/"✕". Toda correção tem texto acessível
 *     (`sr-only`) e sai por região viva (`aria-live` / `role="status"`).
 *   • `div` clicável virou `<button type="button">`; campo virou `<label>` + `input`.
 *   • `match` funciona por teclado (o protótipo é só toque): tudo é botão de verdade,
 *     com `aria-pressed` e um anúncio do que está selecionado.
 *   • `dnd` tem o clique como caminho principal — arrastar não existe no toque.
 *   • Alvo de toque mínimo de 44px nos botões de ação e nas caixas de marcar.
 *
 * Este arquivo não conhece o banco: tudo passa pelo contexto de `interacao.tsx`.
 */

import { useState, type CSSProperties, type DragEvent } from 'react';

import {
  MARCADO,
  NAO_MARCADO,
  RESULTADO_ERRO,
  RESULTADO_OK,
  chaveCheck,
  chaveDnd,
  chaveFill,
  chaveFree,
  chaveMatch,
  chaveMc,
  estaMarcado,
  normalizar,
} from '@/lib/lesson/keys';
import { solid, variant } from '@/lib/ui/palette';
import type {
  CheckBlock,
  DndBlock,
  FillBlock,
  FreeBlock,
  InteractiveBlock,
  MatchBlock,
  McBlock,
} from '@/lib/content/types';
import type { LinksDeCompra, Plano } from '@/lib/planos';
import type { ResultadoDoPrompt } from '@/lib/pratica/tipos';

import { useInteracao } from '../interacao';
import { BlocoCta } from './BlocoCta';
import { GRADE_FLEXIVEL } from './listas';

// ─────────────────────────── cores de correção ───────────────────────────
// Valores literais do protótipo. Não são cores de marca: são os estados de acerto,
// erro e neutro dos exercícios.

const VERDE_BG = '#E4F5EA';
const VERDE_FG = '#1B6B3A';
const VERDE_BD = '#C6E9D2';
const VERMELHO_BG = '#FDE8EA';
const VERMELHO_FG = '#9B1C2E';
const NEUTRO_BG = '#FFFFFF';
const NEUTRO_FG = '#0F2050';
const NEUTRO_BD = '#E6E8EE';

/** Botão de ação dos exercícios (VERIFICAR / LIMPAR), com alvo de toque de 44px. */
const CLASSE_ACAO =
  'inline-flex min-h-[44px] items-center justify-center rounded-pill px-[22px] py-[11px] text-[13px] font-extrabold tracking-[.04em]';

// ══════════════════════════════════ mc ═══════════════════════════════════

/**
 * Múltipla escolha. Corrige **na hora**, sem botão: escolhida a alternativa, a certa
 * aparece verde mesmo quando a pessoa errou, e a explicação entra logo abaixo.
 */
export function BlocoMc({ bloco, lessonId }: { bloco: McBlock; lessonId: number }) {
  const interacao = useInteracao();
  const v = variant(bloco.v);

  return (
    <div
      className="rounded-[18px] border p-5"
      style={{ background: v.bg, borderColor: v.bd }}
      aria-busy={interacao.gravando || undefined}
    >
      {bloco.title ? (
        <h3 className="mb-[14px] text-[13px] font-extrabold tracking-[.08em] text-[#0F2050]">
          {bloco.title}
        </h3>
      ) : null}

      <div className="flex flex-col gap-4">
        {bloco.questions.map((questao, qi) => {
          const chave = chaveMc(lessonId, bloco.id, qi);
          const bruto = interacao.valor(chave);
          const escolhida = bruto === undefined || bruto === '' ? null : Number(bruto);
          const respondeu = escolhida !== null && Number.isInteger(escolhida);
          const acertou = respondeu && escolhida === questao.answer;
          const idPergunta = `${bloco.id}-q${qi}`;

          return (
            <div key={idPergunta}>
              <p id={idPergunta} className="mb-2 fs-leitura font-bold text-[#1F2430]">
                {questao.q}
              </p>

              <div className="flex flex-wrap gap-2" role="group" aria-labelledby={idPergunta}>
                {questao.options.map((rotulo, oi) => {
                  const estaEscolhida = respondeu && escolhida === oi;
                  const ehCerta = oi === questao.answer;

                  let fundo = NEUTRO_BG;
                  let frente = NEUTRO_FG;
                  let borda = NEUTRO_BD;
                  let marca = '';
                  let leitura = '';

                  if (estaEscolhida && ehCerta) {
                    fundo = VERDE_BG;
                    frente = VERDE_FG;
                    borda = VERDE_FG;
                    marca = '✓';
                    leitura = ', sua resposta, correta';
                  } else if (estaEscolhida && !ehCerta) {
                    fundo = VERMELHO_BG;
                    frente = VERMELHO_FG;
                    borda = VERMELHO_FG;
                    marca = '✕';
                    leitura = ', sua resposta, incorreta';
                  } else if (respondeu && ehCerta) {
                    fundo = VERDE_BG;
                    frente = VERDE_FG;
                    borda = VERDE_BD;
                    leitura = ', esta era a resposta correta';
                  }

                  return (
                    <button
                      key={oi}
                      type="button"
                      aria-pressed={estaEscolhida}
                      onClick={() => {
                        interacao.definir(chave, String(oi));
                        interacao.conferir(chave, ehCerta);
                      }}
                      className="min-h-[44px] rounded-pill border-2 px-5 py-[13px] fs-leitura font-extrabold"
                      style={{ background: fundo, color: frente, borderColor: borda }}
                    >
                      {rotulo}
                      {marca ? <span aria-hidden="true"> {marca}</span> : null}
                      {leitura ? <span className="sr-only">{leitura}</span> : null}
                    </button>
                  );
                })}
              </div>

              <p
                aria-live="polite"
                className={respondeu ? 'mt-[9px] fs-apoio font-bold' : undefined}
                style={respondeu ? { color: acertou ? VERDE_FG : VERMELHO_FG } : undefined}
              >
                {respondeu ? (
                  <>
                    <span className="sr-only">
                      {acertou ? 'Resposta correta. ' : 'Resposta incorreta. '}
                    </span>
                    {questao.explain ?? (acertou ? 'Correto!' : 'Tente novamente.')}
                  </>
                ) : null}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ═════════════════════════════════ fill ══════════════════════════════════

/**
 * Completar lacunas. Só corrige ao tocar em VERIFICAR, e a comparação é normalizada
 * (`normalizar`) contra **qualquer** item de `answers` — o teclado do celular escreve
 * “don’t” com aspa curva e o gabarito guarda "don't".
 */
export function BlocoFill({ bloco }: { bloco: FillBlock }) {
  const interacao = useInteracao();
  const v = variant(bloco.v);

  const acertou = (indice: number): boolean => {
    const item = bloco.items[indice];
    const digitado = normalizar(interacao.valor(chaveFill(bloco.id, indice)));
    return item.answers.some((aceita) => normalizar(aceita) === digitado);
  };

  const conferido =
    bloco.items.length > 0 &&
    bloco.items.every((_, i) => interacao.conferido(chaveFill(bloco.id, i)));
  const acertos = bloco.items.reduce((soma, _, i) => (acertou(i) ? soma + 1 : soma), 0);
  const tudoCerto = acertos === bloco.items.length;

  const verificar = () => {
    bloco.items.forEach((_, i) => {
      interacao.conferir(chaveFill(bloco.id, i), acertou(i));
    });
  };

  return (
    <div
      className="rounded-[18px] border p-5"
      style={{ background: v.bg, borderColor: v.bd }}
      aria-busy={interacao.gravando || undefined}
    >
      {bloco.title ? (
        <h3 className="mb-1 text-[13px] font-extrabold tracking-[.08em] text-[#0F2050]">
          {bloco.title}
        </h3>
      ) : null}
      {bloco.sub ? <p className="mb-[14px] fs-apoio text-[#6B7280]">{bloco.sub}</p> : null}

      <div className="flex flex-col gap-[9px]">
        {bloco.items.map((item, i) => {
          const chave = chaveFill(bloco.id, i);
          const iv = variant(item.v);
          const certo = acertou(i);
          const idCampo = `${bloco.id}-f${i}`;
          const idNota = `${idCampo}-nota`;

          return (
            <div
              key={chave}
              className="flex flex-wrap items-center gap-[10px] rounded-field border-[1.5px] px-[14px] py-3"
              style={{ background: iv.bg, borderColor: iv.bd }}
            >
              <label
                htmlFor={idCampo}
                className="min-w-[150px] flex-1 fs-leitura font-extrabold text-[#0F2050]"
              >
                {item.pre}
              </label>

              <input
                id={idCampo}
                type="text"
                value={interacao.valor(chave) ?? ''}
                onChange={(evento) => interacao.definir(chave, evento.target.value)}
                onBlur={() => interacao.descarregar(chave)}
                placeholder={bloco.wide ? 'escreva a frase completa' : '?'}
                autoComplete="off"
                autoCapitalize="none"
                spellCheck={false}
                aria-invalid={conferido && !certo ? true : undefined}
                aria-describedby={item.note ? idNota : undefined}
                className="min-h-[44px] min-w-[110px] rounded-pill border-[1.5px] bg-white px-[14px] py-3 fs-leitura font-bold text-[#0F2050]"
                style={{
                  flex: bloco.wide ? '3' : '0',
                  borderColor: conferido ? (certo ? VERDE_FG : VERMELHO_FG) : NEUTRO_BD,
                }}
              />

              {item.post ? (
                <span className="fs-leitura font-extrabold text-[#0F2050]">{item.post}</span>
              ) : null}

              {conferido ? (
                <span
                  className="text-[18px] font-black"
                  style={{ color: certo ? VERDE_FG : VERMELHO_FG }}
                >
                  <span aria-hidden="true">{certo ? '✓' : '✕'}</span>
                  <span className="sr-only">{certo ? ' correto' : ' incorreto'}</span>
                </span>
              ) : null}

              {item.note ? (
                <p id={idNota} className="basis-full fs-apoio font-bold text-[#9AA1AE]">
                  {item.note}
                </p>
              ) : null}
            </div>
          );
        })}
      </div>

      <div className="mt-[14px] flex flex-wrap items-center gap-3">
        <button type="button" onClick={verificar} className={`${CLASSE_ACAO} bg-[#0F2050] text-white`}>
          VERIFICAR
        </button>
        <p
          aria-live="polite"
          className="fs-apoio font-extrabold"
          style={{ color: tudoCerto ? VERDE_FG : VERMELHO_FG }}
        >
          {conferido ? `${acertos} de ${bloco.items.length} corretos` : ''}
        </p>
      </div>
    </div>
  );
}

// ════════════════════════════════ match ══════════════════════════════════

/**
 * Ligar colunas: escolhe-se um item à esquerda e depois o par à direita.
 *
 * Só o resultado é persistido (`match:{id}` = "ok"/"no"); os pares em andamento são
 * estado de tela. Ao recarregar com acerto gravado, os pares voltam do gabarito — e
 * com erro gravado o bloco volta limpo, porque mostrar placar sem os pares seria
 * mentir sobre o que a pessoa fez.
 */
export function BlocoMatch({ bloco }: { bloco: MatchBlock }) {
  const interacao = useInteracao();
  const chave = chaveMatch(bloco.id);
  const acertoGravado =
    interacao.conferido(chave) && interacao.valor(chave) === RESULTADO_OK;

  const [pares, setPares] = useState<Map<number, number>>(() =>
    acertoGravado ? new Map(bloco.answer.map((direita, i) => [i, direita])) : new Map(),
  );
  const [ativo, setAtivo] = useState<number | null>(null);
  const [conferido, setConferido] = useState<boolean>(acertoGravado);

  const acertos = bloco.left.reduce(
    (soma, _, i) => (pares.get(i) === bloco.answer[i] ? soma + 1 : soma),
    0,
  );
  const tudoCerto = acertos === bloco.left.length;

  const escolher = (lado: 'esquerda' | 'direita', indice: number) => {
    if (lado === 'esquerda') {
      setAtivo((anterior) => (anterior === indice ? null : indice));
      return;
    }
    if (ativo === null) return;
    setPares((anterior) => {
      const proximo = new Map(anterior);
      proximo.set(ativo, indice);
      return proximo;
    });
    setAtivo(null);
  };

  const verificar = () => {
    const certo = bloco.left.every((_, i) => pares.get(i) === bloco.answer[i]);
    interacao.definir(chave, certo ? RESULTADO_OK : RESULTADO_ERRO);
    interacao.conferir(chave, certo);
    setConferido(true);
  };

  const limpar = () => {
    setPares(new Map());
    setAtivo(null);
    setConferido(false);
    interacao.limpar([chave]);
  };

  const usados = new Set(pares.values());
  const anuncio =
    ativo !== null
      ? `${bloco.left[ativo]} selecionado. Escolha o par correspondente à direita.`
      : '';

  return (
    <div
      className="rounded-[18px] border border-[#E6E8EE] bg-white p-5"
      aria-busy={interacao.gravando || undefined}
    >
      <h3 className="mb-1 text-[13px] font-extrabold tracking-[.08em] text-[#0F2050]">
        {bloco.title}
      </h3>
      <p className="mb-[14px] fs-apoio text-[#6B7280]">
        Selecione um item à esquerda e depois o par correspondente à direita.
      </p>

      <div className="grid grid-cols-2 gap-[10px]">
        <div className="flex flex-col gap-2" role="group" aria-label="Itens para ligar">
          {bloco.left.map((rotulo, i) => {
            const ligado = pares.has(i);
            const destino = pares.get(i);
            const certo = destino === bloco.answer[i];

            let fundo = NEUTRO_BG;
            let frente = NEUTRO_FG;
            let borda = NEUTRO_BD;

            if (ativo === i) {
              fundo = '#0F2050';
              frente = '#FFFFFF';
              borda = '#0F2050';
            } else if (conferido && ligado) {
              fundo = certo ? VERDE_BG : VERMELHO_BG;
              frente = certo ? VERDE_FG : VERMELHO_FG;
              borda = frente;
            } else if (ligado) {
              fundo = '#E4F6F7';
              frente = '#0B5563';
              borda = '#C7EBEE';
            }

            return (
              <button
                key={i}
                type="button"
                aria-pressed={ativo === i}
                onClick={() => escolher('esquerda', i)}
                className="min-h-[44px] rounded-xl border-2 px-3 py-[13px] text-left fs-leitura font-extrabold"
                style={{ background: fundo, color: frente, borderColor: borda }}
              >
                {rotulo}
                {ligado && destino !== undefined ? (
                  <span aria-hidden="true"> → {bloco.right[destino]}</span>
                ) : null}
                <span className="sr-only">
                  {ligado && destino !== undefined
                    ? `, ligado a ${bloco.right[destino]}${
                        conferido ? (certo ? ', correto' : ', incorreto') : ''
                      }`
                    : ', sem par'}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex flex-col gap-2" role="group" aria-label="Pares correspondentes">
          {bloco.right.map((rotulo, i) => {
            const usado = usados.has(i);
            return (
              <button
                key={i}
                type="button"
                onClick={() => escolher('direita', i)}
                className="min-h-[44px] rounded-xl border-2 px-3 py-[13px] text-left fs-leitura font-bold"
                style={{
                  background: usado ? '#EFEAFB' : NEUTRO_BG,
                  color: usado ? '#3C1D80' : '#1F2430',
                  borderColor: usado ? '#DCD2F6' : NEUTRO_BD,
                }}
              >
                {rotulo}
                {usado ? <span className="sr-only">, já usado</span> : null}
              </button>
            );
          })}
        </div>
      </div>

      <p role="status" className="sr-only">
        {anuncio}
      </p>

      <div className="mt-[14px] flex flex-wrap items-center gap-3">
        <button type="button" onClick={verificar} className={`${CLASSE_ACAO} bg-[#0F2050] text-white`}>
          VERIFICAR
        </button>
        <button
          type="button"
          onClick={limpar}
          className={`${CLASSE_ACAO} border-[1.5px] border-[#E6E8EE] bg-white text-[#6B7280]`}
        >
          LIMPAR
        </button>
        <p
          aria-live="polite"
          className="fs-apoio font-extrabold"
          style={{ color: tudoCerto ? VERDE_FG : VERMELHO_FG }}
        >
          {conferido ? `${acertos} de ${bloco.left.length} corretos` : ''}
        </p>
      </div>
    </div>
  );
}

// ═════════════════════════════════ dnd ═══════════════════════════════════

/**
 * Montar a frase. Arrastar não funciona no toque, então **o clique é o caminho
 * principal**: tocar numa peça a coloca na primeira lacuna vazia, e tocar numa lacuna
 * preenchida devolve a peça. Arrastar continua valendo no mouse.
 */
export function BlocoDnd({ bloco }: { bloco: DndBlock }) {
  const interacao = useInteracao();
  const chave = chaveDnd(bloco.id);
  const acertoGravado = interacao.conferido(chave) && interacao.valor(chave) === RESULTADO_OK;

  const [pecas, setPecas] = useState<string[]>(() =>
    acertoGravado ? bloco.answer.slice(0, bloco.slots.length) : bloco.slots.map(() => ''),
  );
  const [conferido, setConferido] = useState<boolean>(acertoGravado);

  const certo = bloco.answer.every((esperado, i) => pecas[i] === esperado);

  const colocar = (rotulo: string, indice?: number) => {
    setPecas((anterior) => {
      if (indice === undefined && anterior.includes(rotulo)) return anterior;
      const proximo = anterior.slice();
      // A mesma peça não pode ocupar duas lacunas: some de onde estava.
      const jaEstava = proximo.indexOf(rotulo);
      if (jaEstava >= 0) proximo[jaEstava] = '';
      const alvo = indice ?? proximo.findIndex((peca) => peca === '');
      if (alvo < 0 || alvo >= proximo.length) return anterior;
      proximo[alvo] = rotulo;
      return proximo;
    });
  };

  const devolver = (indice: number) => {
    setPecas((anterior) => {
      const proximo = anterior.slice();
      proximo[indice] = '';
      return proximo;
    });
  };

  const verificar = () => {
    const resultado = bloco.answer.every((esperado, i) => pecas[i] === esperado);
    interacao.definir(chave, resultado ? RESULTADO_OK : RESULTADO_ERRO);
    interacao.conferir(chave, resultado);
    setConferido(true);
  };

  const limpar = () => {
    setPecas(bloco.slots.map(() => ''));
    setConferido(false);
    interacao.limpar([chave]);
  };

  const soltar = (evento: DragEvent<HTMLDivElement>, indice: number) => {
    evento.preventDefault();
    const rotulo = evento.dataTransfer.getData('text/plain');
    if (rotulo) colocar(rotulo, indice);
  };

  return (
    <div className="rounded-[18px] bg-[#0F2050] p-[22px]" aria-busy={interacao.gravando || undefined}>
      <h3 className="mb-1 fs-rotulo font-extrabold tracking-[.08em] text-[#F2C230]">
        {bloco.title}
      </h3>
      <p className="mb-4 fs-apoio text-[#B9C3DA]">{bloco.sub}</p>

      <div className="mb-4 flex flex-wrap items-start gap-[10px]">
        {bloco.slots.map((rotuloDaLacuna, i) => {
          const texto = pecas[i] ?? '';
          const preenchida = texto !== '';

          let fundo = 'rgba(255,255,255,.08)';
          let borda = '#33427A';
          let frente = '#FFFFFF';
          if (preenchida) {
            fundo = '#FFFFFF';
            borda = '#FFFFFF';
            frente = '#0F2050';
          }
          if (conferido && preenchida) {
            const lacunaCerta = bloco.answer[i] === texto;
            fundo = lacunaCerta ? VERDE_BG : VERMELHO_BG;
            frente = lacunaCerta ? VERDE_FG : VERMELHO_FG;
            borda = frente;
          }

          const caixa =
            'w-full min-h-[56px] rounded-field border-2 border-dashed px-[10px] py-4 text-center text-[17px] font-black';
          const estilo = { background: fundo, borderColor: borda, color: frente };

          return (
            <div
              key={`${bloco.id}-s${i}`}
              className="min-w-[120px] flex-1"
              onDragOver={(evento) => evento.preventDefault()}
              onDrop={(evento) => soltar(evento, i)}
            >
              {preenchida ? (
                <button
                  type="button"
                  onClick={() => devolver(i)}
                  className={caixa}
                  style={estilo}
                  aria-label={`Lacuna ${i + 1}, ${rotuloDaLacuna}: ${texto}${
                    conferido ? (bloco.answer[i] === texto ? ', correta' : ', incorreta') : ''
                  }. Selecione para devolver a peça.`}
                >
                  <span aria-hidden="true">{texto}</span>
                </button>
              ) : (
                <div className={caixa} style={estilo}>
                  <span aria-hidden="true">-</span>
                  <span className="sr-only">{`Lacuna ${i + 1}, ${rotuloDaLacuna}: vazia.`}</span>
                </div>
              )}
              <p className="mt-[6px] text-center fs-rotulo font-extrabold tracking-[.06em] text-[#B9C3DA]">
                {rotuloDaLacuna}
              </p>
            </div>
          );
        })}
      </div>

      <div className="mb-[14px] flex flex-wrap gap-2" role="group" aria-label="Peças da frase">
        {bloco.tokens.map((rotulo) => {
          const usada = pecas.includes(rotulo);
          return (
            <button
              key={rotulo}
              type="button"
              draggable
              onDragStart={(evento) => evento.dataTransfer.setData('text/plain', rotulo)}
              onClick={() => colocar(rotulo)}
              className="min-h-[44px] cursor-grab rounded-xl px-[18px] py-[11px] fs-leitura font-extrabold"
              style={{
                background: usada ? '#33427A' : '#F2C230',
                color: usada ? '#8A97C0' : '#0F2050',
                opacity: usada ? 0.6 : 1,
              }}
            >
              {rotulo}
              {usada ? <span className="sr-only">, já usada</span> : null}
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={verificar}
          className={`${CLASSE_ACAO} bg-[#F2C230] text-[#0F2050]`}
        >
          VERIFICAR
        </button>
        <button
          type="button"
          onClick={limpar}
          className={`${CLASSE_ACAO} border-[1.5px] border-[#33427A] bg-transparent text-[#B9C3DA]`}
        >
          LIMPAR
        </button>
        <p
          aria-live="polite"
          className="fs-apoio font-extrabold"
          style={{ color: certo ? '#7BE3A0' : '#FFB3BD' }}
        >
          {conferido ? (certo ? 'Perfeito!' : 'Ainda não. Tente de novo.') : ''}
        </p>
      </div>
    </div>
  );
}

// ════════════════════════════════ check ══════════════════════════════════

/** Autoavaliação "EU CONSIGO…": não há resposta certa — marcar já conta como feito. */
export function BlocoCheck({ bloco }: { bloco: CheckBlock }) {
  const interacao = useInteracao();

  return (
    <div
      className="rounded-[18px] border border-[#E6E8EE] bg-[#F4F5F7] p-5"
      aria-busy={interacao.gravando || undefined}
    >
      <h3 className="mb-[14px] text-[13px] font-extrabold tracking-[.08em] text-[#5B21B6]">
        {bloco.title}
      </h3>

      <div className="flex flex-col gap-[10px]">
        {bloco.items.map((rotulo, i) => {
          const chave = chaveCheck(bloco.id, i);
          const marcado = estaMarcado(interacao.valor(chave));

          return (
            <label
              key={chave}
              className="flex min-h-[44px] cursor-pointer items-center gap-3"
            >
              <input
                type="checkbox"
                className="peer sr-only"
                checked={marcado}
                onChange={(evento) => {
                  const ligado = evento.target.checked;
                  interacao.definir(chave, ligado ? MARCADO : NAO_MARCADO);
                  interacao.conferir(chave, ligado);
                }}
              />
              <span
                aria-hidden="true"
                className="grid h-[26px] w-[26px] flex-none place-items-center rounded-lg border-2 text-[15px] font-black text-white peer-focus-visible:ring-2 peer-focus-visible:ring-blue peer-focus-visible:ring-offset-2"
                style={{
                  background: marcado ? '#0E9BAE' : '#FFFFFF',
                  borderColor: marcado ? '#0E9BAE' : '#C7CBD6',
                }}
              >
                {marcado ? '✓' : ''}
              </span>
              <span className="fs-leitura font-bold text-[#1F2430]">{rotulo}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}

// ═════════════════════════════════ free ══════════════════════════════════

/**
 * Produção escrita. Não é corrigida, **mas é persistida**: perder o que o aluno
 * escreveu ao recarregar é o pior defeito possível nesta tela.
 */
export function BlocoFree({ bloco }: { bloco: FreeBlock }) {
  const interacao = useInteracao();

  return (
    <div
      className={`grid gap-3 ${bloco.cols === 2 ? GRADE_FLEXIVEL : 'grid-cols-1'}`}
      // Duas colunas: mínimo de 160px no celular e os 240px do design no desktop.
      style={
        bloco.cols === 2
          ? ({ '--col-min': '160px', '--col-min-lg': '240px' } as CSSProperties)
          : undefined
      }
      aria-busy={interacao.gravando || undefined}
    >
      {bloco.items.map((item, i) => {
        const chave = chaveFree(bloco.id, i);
        const fv = variant(item.v);
        const destaque = solid(item.c);
        const idCampo = `${bloco.id}-l${i}`;
        const idMissao = `${idCampo}-missao`;
        const idIdeias = `${idCampo}-ideias`;

        return (
          <div
            key={chave}
            className="rounded-2xl border-l-[6px] px-[18px] py-4"
            style={{ background: fv.bg, borderLeftColor: destaque }}
          >
            <p
              id={idMissao}
              className="mb-2 fs-rotulo font-extrabold tracking-[.08em]"
              style={{ color: destaque }}
            >
              {item.n} · {item.kicker}
            </p>

            <label htmlFor={idCampo} className="mb-2 block text-[17px] font-black text-[#0F2050]">
              {item.prefix}
            </label>

            <input
              id={idCampo}
              type="text"
              value={interacao.valor(chave) ?? ''}
              onChange={(evento) => interacao.definir(chave, evento.target.value)}
              onBlur={() => interacao.descarregar(chave)}
              placeholder="escreva aqui…"
              autoComplete="off"
              autoCapitalize="sentences"
              aria-describedby={item.ideas ? `${idMissao} ${idIdeias}` : idMissao}
              className="min-h-[44px] w-full rounded-pill border-[1.5px] border-[#E6E8EE] bg-white px-[14px] py-[11px] fs-leitura font-bold text-[#0F2050]"
            />

            {item.ideas ? (
              <p id={idIdeias} className="mt-2 fs-apoio font-bold text-[#6B7280]">
                {item.ideas}
              </p>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

// ══════════════════════════════ despachante ══════════════════════════════

/**
 * Atalho para o `BlockRenderer` (arquivo de outro agente): recebe qualquer um dos 7
 * blocos interativos e escolhe o componente. Quem preferir pode importar os
 * componentes um a um.
 */
export function BlocoInterativo({
  bloco,
  lessonId,
  plano,
  temVideoaula,
  linksDeCompra,
  pratica,
}: {
  bloco: InteractiveBlock;
  lessonId: number;
  plano?: Plano;
  temVideoaula?: boolean;
  linksDeCompra?: LinksDeCompra;
  /** Prompt da prática com IA (contrato 3.3). Só o `cta` usa. */
  pratica?: ResultadoDoPrompt;
}) {
  switch (bloco.t) {
    case 'mc':
      return <BlocoMc bloco={bloco} lessonId={lessonId} />;
    case 'fill':
      return <BlocoFill bloco={bloco} />;
    case 'match':
      return <BlocoMatch bloco={bloco} />;
    case 'dnd':
      return <BlocoDnd bloco={bloco} />;
    case 'check':
      return <BlocoCheck bloco={bloco} />;
    case 'free':
      return <BlocoFree bloco={bloco} />;
    case 'cta':
      return (
        <BlocoCta
          bloco={bloco}
          lessonId={lessonId}
          plano={plano}
          temVideoaula={temVideoaula}
          linksDeCompra={linksDeCompra}
          pratica={pratica}
        />
      );
  }
}
