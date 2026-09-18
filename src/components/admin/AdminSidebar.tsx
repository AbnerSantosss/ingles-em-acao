'use client';

/**
 * Barra lateral do painel.
 *
 * É Client Component por um motivo só: destacar a área atual, e nenhum Server
 * Component consegue saber o caminho da URL (`usePathname()` é a única forma no
 * App Router). Fora isso não guarda estado nenhum.
 *
 * Layout: em telas largas (≥1024px) é uma coluna fixa de 248px que acompanha a
 * rolagem; abaixo disso vira uma faixa horizontal rolável no topo, porque o
 * painel é desktop-first mas ainda precisa abrir num tablet sem quebrar.
 */
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { IconeDaArea } from '@/components/admin/IconeDaArea';
import { Logo } from '@/components/ui/Logo';
import { AREAS, areaDoCaminho, type AreaDoPainel } from '@/components/admin/nav';
import { cn } from '@/lib/ui/cn';

/** Classes comuns às duas formas do item (link vivo e entrada inerte). */
const ITEM = [
  'flex min-h-11 items-center gap-3 rounded-field px-3 py-2.5',
  'text-[15px] font-bold leading-tight transition-colors duration-150',
].join(' ');

function Item({ area, ativa }: { area: AreaDoPainel; ativa: boolean }) {
  if (!area.pronta) {
    // Entrada inerte: sem `href`, então não é foco de tabulação nem promete uma
    // tela que ainda não existe. O `aria-disabled` conta a mesma história ao
    // leitor de tela que o "em breve" conta a quem enxerga.
    return (
      <span
        aria-disabled="true"
        title={`${area.rotulo} — em breve`}
        className={cn(ITEM, 'cursor-not-allowed text-muted-2')}
      >
        <IconeDaArea d={area.icone} />
        <span className="min-w-0 flex-1 truncate">{area.rotulo}</span>
        <span className="flex-none rounded-pill bg-[#EEF3FA] px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-[0.08em] text-muted-2">
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
        ativa
          ? 'bg-navy text-white shadow-[0_8px_20px_rgba(11,31,75,0.18)]'
          : 'text-muted-3 hover:bg-[#EAF2FE] hover:text-navy',
      )}
    >
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
        'border-b border-solid border-border bg-surface',
        'lg:sticky lg:top-0 lg:h-dvh lg:w-[248px] lg:flex-none lg:overflow-y-auto',
        'lg:border-b-0 lg:border-r',
      )}
    >
      <div className="flex items-center gap-3 px-4 py-4 lg:px-5 lg:py-6">
        <Logo size={44} withWordmark={false} />
        <span className="flex flex-col leading-tight">
          <span className="text-[17px] font-black tracking-[-0.01em] text-navy">Painel</span>
          <span className="text-[12px] font-bold text-muted-2">Inglês em Ação</span>
        </span>
      </div>

      <nav aria-label="Áreas do painel" className="px-3 pb-4 lg:px-3">
        <ul className="flex list-none gap-1 overflow-x-auto p-0 lg:flex-col lg:overflow-visible">
          {AREAS.map((area) => (
            <li key={area.href} className="flex-none lg:flex-auto">
              <Item area={area} ativa={atual?.href === area.href} />
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}

export default AdminSidebar;
