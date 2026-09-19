/**
 * Fundo das telas de acesso (`/entrar`, `/criar-conta`, `/esqueci-senha`,
 * `/redefinir-senha`, `/verificar-email`): a arte azul-marinho da WSA (livros,
 * balões de fala, birrete e fios dourados) atrás do card branco, parada,
 * enquanto só a página rola.
 *
 * Irmão do `FundoDaAula`, e de propósito separado dele: a arte é outra e as
 * telas de acesso não têm casca de aula. Nada aqui mexe em `.fundo-aula`.
 *
 * Duas imagens: a de desktop (1672x941, deitada) a partir de 1024px de largura
 * com a tela deitada; a de celular (941x1672, em pé) em todo o resto, inclusive
 * tablet em pé e celular deitado.
 *
 * Por que `<picture>` e não o componente de imagem do Next:
 *   • as duas WebP já estão no tamanho final em `public/brand/`; o otimizador só
 *     acrescentaria uma ida ao servidor;
 *   • trocar de arquivo pela largura e pela orientação é "direção de arte", que
 *     no Next exige `getImageProps` e um `<picture>` montado à mão do mesmo jeito
 *     (guia `node_modules/next/dist/docs/01-app/03-api-reference/02-components/image.md`,
 *     trecho "Art Direction");
 *   • a landing e o fundo da aula já fazem assim.
 * A regra de lint `@next/next/no-img-element` não reclama de `<img>` dentro de
 * `<picture>`.
 *
 * Por que um elemento `position: fixed` e não `background-attachment: fixed`: o
 * Safari do iPhone ignora `background-attachment: fixed` e a imagem rola ou
 * estica. As regras visuais moram em `globals.css` (`.fundo-acesso`), inclusive
 * esconder só a imagem quando a pessoa pede mais contraste ou usa cores
 * forçadas (o azul liso fica, senão o texto claro de fora do card sumiria) e
 * sumir por inteiro na impressão.
 *
 * Decorativo: `aria-hidden` no contêiner e `alt=""`. Prioridade baixa
 * (`fetchPriority="low"`, `decoding="async"`): o formulário chega primeiro e,
 * até a imagem carregar, vale a cor `--fundo-acesso`.
 *
 * Sem `'use client'`: não tem estado. Serve ao layout de acesso (servidor).
 */

/** Versão deitada, para tela larga. */
export const FUNDO_ACESSO_DESKTOP = '/brand/login-fundo-desktop.webp';
/** Versão em pé, o padrão. */
export const FUNDO_ACESSO_MOBILE = '/brand/login-fundo-mobile.webp';
/** Quando usar a versão deitada (o mesmo corte do fundo da aula). */
export const MIDIA_ACESSO_DESKTOP = '(min-width: 1024px) and (orientation: landscape)';

export function FundoDeAcesso() {
  return (
    <div aria-hidden="true" className="fundo-acesso">
      <picture>
        <source
          media={MIDIA_ACESSO_DESKTOP}
          srcSet={FUNDO_ACESSO_DESKTOP}
          type="image/webp"
        />
        <img
          src={FUNDO_ACESSO_MOBILE}
          alt=""
          width={941}
          height={1672}
          decoding="async"
          fetchPriority="low"
          className="fundo-acesso__imagem"
        />
      </picture>
    </div>
  );
}
