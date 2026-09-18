/**
 * Par `src` + `alt` de um objeto (bloco `image`, `profile` ou item de `cards` e
 * `steps`), escolhido na biblioteca de mídia ou enviado ali mesmo. O seletor devolve `{ src, alt }` — exatamente o que o
 * esquema aceita — e aqui só gravamos as duas chaves no objeto.
 *
 * `alt` é obrigatório na prática: ao escolher uma imagem o seletor já grava o
 * `alt` (o da biblioteca ou a descrição da cena); se o admin apagar, fica `""`,
 * que o esquema recusa e o salvar trava.
 */
'use client';

import { SeletorDeMidia } from '@/components/admin/SeletorDeMidia';
import type { AlvoDeImagem } from '@/lib/media/especificacoes';
import type { MidiaSelecionada } from '@/lib/media/tipos';

import { AvisoDeFormato, CampoTexto, juntarErros } from './campos';
import { comCampo, semCampo, type Objeto } from './objeto';
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
  /** Erros a partir do objeto que tem `src`/`alt`. */
  erros: Erros;
  ordem: readonly string[];
  descricaoSugerida?: string;
  /** Para onde a imagem vai — define as especificações mostradas antes do envio. */
  uso?: AlvoDeImagem;
}) {
  const { src, alt } = objeto;

  if (src !== undefined && typeof src !== 'string') {
    return <AvisoDeFormato rotulo={rotulo} chave="src" bruto={src} erros={erros.em('src')} />;
  }
  if (alt !== undefined && typeof alt !== 'string') {
    return <AvisoDeFormato rotulo="Texto alternativo" chave="alt" bruto={alt} erros={erros.em('alt')} />;
  }

  const valor: MidiaSelecionada | null =
    src !== undefined ? { src, alt: alt ?? '' } : null;

  const escolher = (escolha: MidiaSelecionada | null) => {
    if (escolha === null) {
      aoMudar(semCampo(semCampo(objeto, 'src'), 'alt'));
      return;
    }
    aoMudar(comCampo(comCampo(objeto, 'src', escolha.src, ordem), 'alt', escolha.alt, ordem));
  };

  // O seletor já avisa "Descreva a imagem" quando o alt está vazio; o erro do
  // esquema para o mesmo caso seria repetido.
  const altVazioComImagem = valor !== null && valor.alt.trim() === '';
  const errosDeAlt = altVazioComImagem ? [] : erros.em('alt');
  const errosDeSrc = erros.em('src');

  return (
    <div className="flex flex-col gap-3">
      <SeletorDeMidia
        rotulo={rotulo}
        valor={valor}
        aoEscolher={escolher}
        descricaoSugerida={descricaoSugerida}
        uso={uso}
      />
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
      {valor !== null && (errosDeSrc.length > 0 || errosDeAlt.length > 0) ? (
        <p role="alert" className="m-0 text-[14px] font-semibold leading-snug text-danger">
          {juntarErros([...errosDeSrc, ...errosDeAlt])}
        </p>
      ) : null}
    </div>
  );
}
