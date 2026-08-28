import { Link } from 'react-router-dom';
import Icon from '../../components/Icon.jsx';
import { useIdioma } from '../../lib/IdiomaContext.jsx';

const OPCIONES = [
  { to: '/calculadoras/costos', icon: 'calculator', tono: 'bg-emerald-50 text-emerald-500', k: 'home.t1' },
  { to: '/calculadoras/precios', icon: 'report', tono: 'bg-orange-50 text-orange-500', k: 'home.t2' },
  { to: '/central-de-rendimiento', icon: 'trending', tono: 'bg-rose-50 text-rose-400', k: 'home.t3' },
  { to: '/central-de-rendimiento', icon: 'target', tono: 'bg-violet-50 text-violet-500', k: 'home.t4' },
];

export default function CalculatorsIndex() {
  const { t } = useIdioma();

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-[22px] font-extrabold tracking-tight text-ink">{t('nav.calculadoras')}</h1>
        <p className="mt-1 text-[13px] text-ink/50">
          Calculá costos, precios y ganancias antes de producir.
        </p>
      </div>

      <div className="grid gap-3.5 sm:grid-cols-2">
        {OPCIONES.map((o, i) => (
          <Link
            key={`${o.k}-${i}`}
            to={o.to}
            className="card flex items-start gap-3 p-5 transition hover:-translate-y-0.5 hover:shadow-lift"
          >
            <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${o.tono}`}>
              <Icon name={o.icon} className="w-5 h-5" />
            </span>
            <span className="min-w-0">
              <span className="block text-[14px] font-bold text-ink">{t(o.k)}</span>
              <span className="mt-0.5 block text-[12px] text-ink/45">{t(`${o.k}s`)}</span>
            </span>
            <Icon name="chevronRight" className="ml-auto w-4 h-4 shrink-0 text-ink/30" />
          </Link>
        ))}
      </div>
    </div>
  );
}
