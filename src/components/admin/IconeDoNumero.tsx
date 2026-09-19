/**
 * Ícone num círculo colorido, usado nos cartões de número e nos títulos de
 * seção do dashboard.
 *
 * O tom é decorativo: agrupa cartões parecidos (alunos em azul, mídia em âmbar
 * etc.) e nada mais.
 *
 * ⚠️ O tom NÃO sinaliza pendência. Quem sinaliza é o `destaque` do cartão, com
 * borda mais grossa e o rótulo "Pendente" (ver `Numero` em `admin/page.tsx`).
 * Se um dia o tom passar a carregar significado, ele precisa de um segundo sinal
 * que não seja cor.
 */
import { IconeDaArea } from '@/components/admin/IconeDaArea';
import { ICONES, type NomeDoIcone } from '@/components/admin/icones';

export type TomDoNumero = 'azul' | 'verde' | 'ambar' | 'lilas' | 'rosa';

/**
 * Cores de cada tom. São os mesmos pares claro/escuro que o painel já usa em
 * selos e avisos; o `forte` tem contraste AA sobre o `fundo` e sobre o `circulo`.
 */
export const TONS: Record<
  TomDoNumero,
  { fundo: string; borda: string; circulo: string; forte: string }
> = {
  azul: { fundo: '#F1F6FE', borda: '#D6E5FB', circulo: '#DCE9FC', forte: '#123A86' },
  verde: { fundo: '#EEF9F2', borda: '#C9EBD5', circulo: '#D5F0DF', forte: '#136B45' },
  ambar: { fundo: '#FEF9E8', borda: '#F8E7B4', circulo: '#FBEDC0', forte: '#6B520A' },
  lilas: { fundo: '#F5F1FC', borda: '#E0D5F6', circulo: '#E6DCF8', forte: '#5B21B6' },
  rosa: { fundo: '#FEF3F5', borda: '#F9D3D9', circulo: '#FBDDE2', forte: '#B21F31' },
};

export type IconeDoNumeroProps = {
  icone: NomeDoIcone;
  tom: TomDoNumero;
  /** Diâmetro do círculo em px. O desenho ocupa cerca de metade. */
  size?: number;
};

export function IconeDoNumero({ icone, tom, size = 48 }: IconeDoNumeroProps) {
  const cores = TONS[tom];

  return (
    <span
      aria-hidden="true"
      className="flex flex-none items-center justify-center rounded-full"
      style={{ width: size, height: size, background: cores.circulo, color: cores.forte }}
    >
      <IconeDaArea d={ICONES[icone]} size={Math.round(size * 0.48)} />
    </span>
  );
}

export default IconeDoNumero;
