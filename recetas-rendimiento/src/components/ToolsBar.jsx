import { Link } from 'react-router-dom';
import Icon from './Icon.jsx';
import { useIdioma } from '../lib/IdiomaContext.jsx';

// Barra de herramientas de la referencia — presente en Inicio, en la ficha de
// receta y en la Central de Rendimiento. Cada tarjeta navega a su herramienta.
export const HERRAMIENTAS = [
  { to: '/calculadoras/costos', icon: 'calculator', tono: 'bg-emerald-50 text-emerald-500', k: 'home.t1' },
  { to: '/calculadoras/precios', icon: 'report', tono: 'bg-orange-50 text-orange-500', k: 'home.t2' },
  { to: '/central-de-rendimiento', icon: 'trending', tono: 'bg-rose-50 text-rose-400', k: 'home.t3' },
  { to: '/central-de-rendimiento#objetivos', icon: 'target', tono: 'bg-violet-50 text-violet-500', k: 'home.t4' },
  { to: '/lista-compras', icon: 'cart', tono: 'bg-amber-50 text-amber-500', k: 'home.t5' },
  { to: '/asistente-ia', icon: 'chat', tono: 'bg-sky-50 text-sky-500', k: 'home.t6' },
];

export default function ToolsBar() {
  const { t } = useIdioma();

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {HERRAMIENTAS.map((h) => (
        <Link
          key={h.k}
          to={h.to}
          className="card flex items-start gap-2.5 p-3.5 transition hover:-translate-y-0.5 hover:shadow-lift"
        >
          <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${h.tono}`}>
            <Icon name={h.icon} className="w-[18px] h-[18px]" />
          </span>
          <span className="min-w-0">
            <span className="block text-[12.5px] font-bold leading-tight text-ink">{t(h.k)}</span>
            <span className="mt-0.5 block text-[11px] leading-snug text-ink/45">{t(`${h.k}s`)}</span>
          </span>
        </Link>
      ))}
    </div>
  );
}
