'use client';

/**
 * Barra lateral do painel.
 *
 * É Client Component por um motivo só: destacar a área atual, e nenhum Server
 * Component consegue saber o caminho da URL (`usePathname()` é a única forma no
 * App Router). Fora isso não guarda estado nenhum.
 *
 * Layout: em telas largas (≥1024px) é uma coluna escura de 264px, com o
 * background da marca, que acompanha a rolagem. Abaixo disso vira uma faixa
 * horizontal rolável no topo, em navy liso, porque o painel é desktop-first mas
 * ainda precisa abrir num tablet sem quebrar.
 *
 * ⚠️ O fundo é escuro nas duas formas. Todo texto aqui é branco (com opacidade)
 * e o anel de foco é amarelo: o anel azul padrão de `globals.css` some sobre
 * navy.
 */
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { IconeDaArea } from '@/components/admin/IconeDaArea';
import { LogoWSA } from '@/components/ui/LogoWSA';
import { AREAS, areaDoCaminho, type AreaDoPainel } from '@/components/admin/nav';
import { cn } from '@/lib/ui/cn';

/**
 * Classes comuns às duas formas do item (link vivo e entrada inerte).
 *
 * ⚠️ O peso da fonte fica FORA daqui: `cn` não resolve utilitários conflitantes,
 * então `font-bold` aqui e `font-extrabold` no item ativo disputariam pela ordem
 * da folha de estilo. Cada forma declara o seu peso.
 */
const ITEM = [
  'relative flex min-h-11 items-center gap-3 rounded-field px-4 py-2.5',
  'text-[15px] leading-tight no-underline transition-colors duration-150',
].join(' ');

/**
 * ⚠️ O anel fica para DENTRO do item (`-outline-offset-2`). Na faixa horizontal
 * a lista tem `overflow-x-auto`, que cortaria um anel desenhado para fora.
 */
const FOCO = 'focus-visible:outline-[3px] focus-visible:-outline-offset-2 focus-visible:outline-yellow';

function Item({ area, ativa }: { area: AreaDoPainel; ativa: boolean }) {
  if (!area.pronta) {
    // Entrada inerte: sem `href`, então não é foco de tabulação nem promete uma
    // tela que ainda não existe. O `aria-disabled` conta a mesma história ao
    // leitor de tela que o "em breve" conta a quem enxerga.
    // `white/60` sobre navy dá cerca de 6:1, acima do AA mesmo estando apagado.
    return (
      <span
        aria-disabled="true"
        title={`${area.rotulo}: em breve`}
        className={cn(ITEM, 'cursor-not-allowed font-bold text-white/60')}
      >
        <IconeDaArea d={area.icone} />
        <span className="min-w-0 flex-1 truncate">{area.rotulo}</span>
        <span className="flex-none rounded-pill bg-white/10 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-[0.08em] text-white/75">
          Em breve
        </span>
      </span>
    );
  }

  return (
    <Link
      href={area.href}
      title={area.descricao}
      aria-current={ativa ? 'page' : undefined}
      className={cn(
        ITEM,
        FOCO,
        ativa
          ? 'bg-navy-light font-extrabold text-white shadow-[0_8px_20px_rgba(5,15,40,0.35)]'
          : 'font-bold text-white/80 hover:bg-white/10 hover:text-white',
      )}
    >
      {/* Barra amarela: o item ativo não depende só do tom da pílula. */}
      {ativa ? (
        <span
          aria-hidden="true"
          className="absolute bottom-2 left-0 top-2 w-1 rounded-pill bg-yellow"
        />
      ) : null}
      <IconeDaArea d={area.icone} />
      <span className="min-w-0 flex-1 truncate">{area.rotulo}</span>
    </Link>
  );
}

export function AdminSidebar() {
  const caminho = usePathname();
  const atual = areaDoCaminho(caminho ?? '/admin');

  return (
    <aside
      className={cn(
        'relative isolate bg-navy',
        'lg:sticky lg:top-0 lg:flex lg:h-dvh lg:w-[264px] lg:flex-none lg:flex-col lg:overflow-y-auto',
      )}
    >
      {/*
        Background só na coluna (lg+). A imagem é vertical (600×1800) e não serve
        para a faixa horizontal. Ancorada embaixo para o globo ficar no pé.
        Inline de propósito: `url(/...)` dentro do CSS passaria pelo empacotador.
      */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 hidden bg-cover bg-bottom lg:block"
        style={{ backgroundImage: 'url(/brand/admin-lateral.webp)' }}
      />

      <div className="flex items-center px-4 pb-4 pt-4 lg:px-6 lg:pb-6 lg:pt-7">
        {/*
          32px na faixa de cima (celular e tablet), 48px na coluna (a partir de
          1024px); abaixo de 360px de largura, só o globo (`compacta`). `LogoWSA`
          fixa a altura por `style` inline, então as classes precisam do `!`.
          Respiro: 16px na faixa, 24px ou mais na coluna. A coluna não é um
          cabeçalho: a logo de 48px ocupa 150 dos 216px livres.
        */}
        <LogoWSA fundo="escuro" altura={48} compacta prioridade className="h-8! lg:h-12!" />
      </div>

      <nav aria-label="Áreas do painel" className="px-3 pb-3 lg:pb-4">
        <ul className="m-0 flex list-none gap-1 overflow-x-auto p-0 lg:flex-col lg:gap-1.5 lg:overflow-visible">
          {AREAS.map((area) => (
            <li key={area.href} className="flex-none lg:flex-auto">
              <Item area={area} ativa={atual?.href === area.href} />
            </li>
          ))}
        </ul>
      </nav>

      {/* Assinatura da marca no pé da coluna, acima do globo do background. */}
      <div className="mt-auto hidden px-6 pb-36 pt-6 lg:block">
        <div aria-hidden="true" className="mb-5 h-px bg-white/15" />
        <p lang="en" className="m-0 text-[17px] font-semibold leading-snug text-white/75">
          A better you.
        </p>
        <span aria-hidden="true" className="mt-3 block h-[3px] w-7 rounded-pill bg-yellow" />
      </div>
    </aside>
  );
}

export default AdminSidebar;
