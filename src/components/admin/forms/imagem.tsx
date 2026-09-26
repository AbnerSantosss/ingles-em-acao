/**
 * Campos `src` + `alt` (+ `w`/`h`) de um objeto (bloco `image`, `profile` ou item
 * de `cards` e `steps`), escolhido na biblioteca de mídia ou enviado ali mesmo. O
 * seletor devolve `{ src, alt, w?, h? }` — exatamente o que o esquema aceita — e
 * aqui só gravamos essas chaves no objeto (`comImagem`).
 *
 * `w`/`h` são o tamanho natural do arquivo e vêm da biblioteca: escolher outra
 * imagem troca os dois, escolher uma sem tamanho lido apaga os dois, e limpar a
 * imagem apaga tudo. Nunca fica o tamanho da imagem anterior.
 *
 * `alt` é obrigatório na prática: ao escolher uma imagem o seletor já grava o
 * `alt` (o da biblioteca ou a descrição da cena); se o admin apagar, fica `""`,
 * que o esquema recusa e o salvar trava.
 */
'use client';

import { SeletorDeMidia } from '@/components/admin/SeletorDeMidia';
import type { AlvoDeImagem } from '@/lib/media/especificacoes';
import { formatarDimensoes, tamanhoDaMidia, type MidiaSelecionada } from '@/lib/media/tipos';

import { AvisoDeFormato, CampoTexto, juntarErros } from './campos';
import { comCampo, comImagem, type Objeto } from './objeto';
import type { Erros } from './validacao';

export function CampoDeImagem({
  rotulo,
  objeto,
  aoMudar,
  erros,
  ordem,
  descricaoSugerida,
  uso = 'ilustracao',
}: {
  rotulo: string;
  objeto: Objeto;
  aoMudar: (novo: Objeto) => void;
  /** Erros a partir do objeto que tem `src`/`alt`/`w`/`h`. */
  erros: Erros;
  ordem: readonly string[];
  descricaoSugerida?: string;
  /** Para onde a imagem vai — define as especificações mostradas antes do envio. */
  uso?: AlvoDeImagem;
}) {
  const { src, alt, w, h } = objeto;

  if (src !== undefined && typeof src !== 'string') {
    return <AvisoDeFormato rotulo={rotulo} chave="src" bruto={src} erros={erros.em('src')} />;
  }
  if (alt !== undefined && typeof alt !== 'string') {
    return <AvisoDeFormato rotulo="Texto alternativo" chave="alt" bruto={alt} erros={erros.em('alt')} />;
  }
  // Tamanho em texto ("300") ou lista: o formulário não regrava por cima, igual a `src`/`alt`.
  if (w !== undefined && typeof w !== 'number') {
    return <AvisoDeFormato rotulo="Largura da imagem" chave="w" bruto={w} erros={erros.em('w')} />;
  }
  if (h !== undefined && typeof h !== 'number') {
    return <AvisoDeFormato rotulo="Altura da imagem" chave="h" bruto={h} erros={erros.em('h')} />;
  }

  // `w`/`h` entram no valor para o seletor devolvê-los intactos quando só o `alt` muda.
  const valor: MidiaSelecionada | null =
    src !== undefined
      ? { src, alt: alt ?? '', ...(w !== undefined ? { w } : {}), ...(h !== undefined ? { h } : {}) }
      : null;

  const escolher = (escolha: MidiaSelecionada | null) => aoMudar(comImagem(objeto, escolha, ordem));

  // O seletor já avisa "Descreva a imagem" quando o alt está vazio; o erro do
  // esquema para o mesmo caso seria repetido.
  const altVazioComImagem = valor !== null && valor.alt.trim() === '';
  const errosDeAlt = altVazioComImagem ? [] : erros.em('alt');
  const errosDeSrc = erros.em('src');
  // `w`/`h` não têm campo próprio: o erro sai com o nome do campo na frente.
  const errosDeTamanho = [
    ...erros.em('w').map((m) => `Largura (w): ${m}`),
    ...erros.em('h').map((m) => `Altura (h): ${m}`),
  ];
  const errosDaImagem = [...errosDeSrc, ...errosDeAlt, ...errosDeTamanho];
  // Só com os dois válidos a aula muda de modo; com erro, vale a mensagem acima.
  const medida = valor !== null ? tamanhoDaMidia(valor.w, valor.h) : {};
  const tamanho = formatarDimensoes(medida.w ?? null, medida.h ?? null);

  return (
    <div className="flex flex-col gap-3">
      <SeletorDeMidia
        rotulo={rotulo}
        valor={valor}
        aoEscolher={escolher}
        descricaoSugerida={descricaoSugerida}
        uso={uso}
      />
      {tamanho ? (
        <p className="m-0 text-[13px] font-semibold leading-snug text-muted-2">
          Tamanho natural do arquivo: {tamanho}. A aula mostra a figura inteira, nesta proporção.
        </p>
      ) : null}
      {valor === null && alt !== undefined ? (
        // `alt` sem `src`: o placeholder da aula usa esse texto; não pode sumir da tela.
        <CampoTexto
          rotulo="Texto alternativo (sem imagem escolhida)"
          chave="alt"
          valor={alt}
          aoMudar={(novo) => aoMudar(comCampo(objeto, 'alt', novo, ordem))}
          erros={errosDeAlt}
          ajuda="Sem imagem, a aula usa este texto no lugar da descrição da cena."
        />
      ) : null}
      {valor !== null && errosDaImagem.length > 0 ? (
        <p role="alert" className="m-0 text-[14px] font-semibold leading-snug text-danger">
          {juntarErros(errosDaImagem)}
        </p>
      ) : null}
    </div>
  );
}
