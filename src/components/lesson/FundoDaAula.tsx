/**
 * Fundo das telas da aula e do resultado: a arte da WSA atrás de tudo, parada,
 * enquanto só o miolo da casca rola (01-CONTRATOS §4).
 *
 * Duas imagens: a de desktop (1672x941, deitada) a partir de 1024px de largura
 * com a tela deitada; a de celular (941x1672, em pé) em todo o resto, inclusive
 * tablet em pé e celular deitado.
 *
 * Por que `<picture>` e não o componente de imagem do Next:
 *   • as duas WebP já saem do pacote 02 no tamanho final; o otimizador só
 *     acrescentaria uma ida ao servidor;
 *   • trocar de arquivo pela largura e pela orientação é "direção de arte", que
 *     no Next exige `getImageProps` e um `<picture>` montado à mão do mesmo jeito
 *     (guia `node_modules/next/dist/docs/01-app/03-api-reference/02-components/image.md`,
 *     trecho "Art Direction");
 *   • a landing já faz assim (`src/components/landing/Landing.tsx`, herói).
 * A regra de lint `@next/next/no-img-element` não reclama de `<img>` dentro de
 * `<picture>`.
 *
 * Por que um elemento `position: fixed` e não `background-attachment: fixed`: o
 * Safari do iPhone ignora `background-attachment: fixed` e a imagem rola ou
 * estica. As regras visuais moram em `globals.css` (`.fundo-aula`), inclusive
 * esconder a imagem quando a pessoa pede mais contraste, em cores forçadas e na
 * impressão.
 *
 * Decorativo: `aria-hidden` no contêiner e `alt=""`. Prioridade baixa
 * (`fetchPriority="low"`, `decoding="async"`): o texto da aula chega primeiro e,
 * até a imagem carregar, vale a cor `--fundo-aula`.
 *
 * Sem `'use client'`: não tem estado. Serve ao leitor (cliente) e à página de
 * resultado (servidor).
 */

/** Versão deitada, para tela larga. */
export const FUNDO_DESKTOP = '/brand/aula-fundo-desktop.webp';
/** Versão em pé, o padrão. */
export const FUNDO_MOBILE = '/brand/aula-fundo-mobile.webp';
/** Quando usar a versão deitada (01-CONTRATOS §4). */
export const MIDIA_DESKTOP = '(min-width: 1024px) and (orientation: landscape)';

export function FundoDaAula() {
  return (
    <div aria-hidden="true" className="fundo-aula">
      <picture>
        <source media={MIDIA_DESKTOP} srcSet={FUNDO_DESKTOP} type="image/webp" />
        <img
          src={FUNDO_MOBILE}
          alt=""
          width={941}
          height={1672}
          decoding="async"
          fetchPriority="low"
          className="fundo-aula__imagem"
        />
      </picture>
    </div>
  );
}
