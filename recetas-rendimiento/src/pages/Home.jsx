import { Link } from 'react-router-dom';
import { useStore } from '../lib/StoreContext.jsx';
import { useIdioma } from '../lib/IdiomaContext.jsx';
import Icon from '../components/Icon.jsx';
import RecipeCard from '../components/RecipeCard.jsx';
import EmptyState from '../components/EmptyState.jsx';

const ACCIONES = [
  { to: '/recetas', icon: 'search', tono: 'bg-violet-100 text-violet-500', k: 'home.a1' },
  { to: '/vender', icon: 'store', tono: 'bg-orange-100 text-orange-500', k: 'home.a2' },
  { to: '/calculadoras/costos', icon: 'calculator', tono: 'bg-pink-100 text-pink-500', k: 'home.a3' },
  { to: '/lista-compras', icon: 'cart', tono: 'bg-amber-100 text-amber-500', k: 'home.a4' },
  { to: '/central-de-rendimiento', icon: 'box', tono: 'bg-emerald-100 text-emerald-500', k: 'home.a5' },
  { to: '/favoritos', icon: 'heart', tono: 'bg-rose-100 text-rose-400', k: 'home.a6' },
];

const HERRAMIENTAS = [
  { to: '/calculadoras/costos', icon: 'calculator', tono: 'bg-emerald-50 text-emerald-500', k: 'home.t1' },
  { to: '/calculadoras/precios', icon: 'report', tono: 'bg-orange-50 text-orange-500', k: 'home.t2' },
  { to: '/central-de-rendimiento', icon: 'trending', tono: 'bg-rose-50 text-rose-400', k: 'home.t3' },
  { to: '/central-de-rendimiento', icon: 'target', tono: 'bg-violet-50 text-violet-500', k: 'home.t4' },
  { to: '/lista-compras', icon: 'cart', tono: 'bg-amber-50 text-amber-500', k: 'home.t5' },
  { to: '/asistente-ia', icon: 'chat', tono: 'bg-sky-50 text-sky-500', k: 'home.t6' },
];

export default function Home() {
  const { recetasPublicadas } = useStore();
  const { t } = useIdioma();
  const novedades = recetasPublicadas.filter((r) => r.novedad);

  return (
    <div className="space-y-6">
      <h1 className="text-[22px] font-extrabold tracking-tight text-ink sm:text-[26px]">{t('home.titulo')}</h1>

      {/* 6 accesos principales — contenido centrado, igual que la referencia */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {ACCIONES.map((a) => (
          <Link
            key={a.k}
            to={a.to}
            className="card flex flex-col items-center gap-2.5 px-3 py-5 text-center transition hover:-translate-y-0.5 hover:shadow-lift"
          >
            <span className={`flex h-11 w-11 items-center justify-center rounded-full ${a.tono}`}>
              <Icon name={a.icon} className="w-5 h-5" />
            </span>
            <span className="text-[13px] font-bold leading-tight text-ink">{t(a.k)}</span>
            <span className="text-[11px] leading-snug text-ink/45">{t(`${a.k}s`)}</span>
          </Link>
        ))}
      </div>

      {/* Dos banners: biblioteca (ancho) + novedades */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="relative min-h-[190px] overflow-hidden rounded-2xl bg-[#2A160D] shadow-card lg:col-span-2">
          <img
            src="/images/hero/torta-chocolate.png"
            alt=""
            className="absolute inset-y-0 right-0 h-full w-[58%] object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#2A160D] via-[#2A160D]/92 to-transparent" />
          <div className="relative flex h-full flex-col justify-center gap-1 p-6">
            <p className="text-[13px] font-semibold text-white/75">{t('home.biblioteca')}</p>
            <p className="text-[34px] font-extrabold leading-none text-brand-400 sm:text-[40px]">
              {recetasPublicadas.length}+
            </p>
            <p className="text-[15px] font-semibold text-white">{t('home.disponibles')}</p>
            <p className="mt-2 max-w-[190px] text-[11.5px] leading-snug text-white/55">{t('home.semanal')}</p>
          </div>
          <span className="absolute bottom-6 right-6 flex h-12 w-12 items-center justify-center rounded-full bg-brand-500 text-white shadow-lift">
            <Icon name="trending" className="w-5 h-5" strokeWidth={2.2} />
          </span>
        </div>

        <div className="card relative min-h-[190px] overflow-hidden">
          <img
            src="/images/hero/cupcake.png"
            alt=""
            className="absolute inset-y-0 right-0 h-full w-[38%] object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white from-55% via-white/85 to-transparent" />
          <div className="relative flex h-full flex-col justify-center gap-2 p-6">
            <p className="flex items-center gap-1.5 text-[14px] font-extrabold text-ink">
              {t('home.novedadesTit')}
              <Icon name="bell" className="w-4 h-4 text-brand-500" />
            </p>
            <p className="max-w-[210px] text-[12.5px] leading-snug text-ink/55">
              {novedades.length} {t('home.novedadesTxt')}
            </p>
            <Link to="/novedades" className="btn-primary mt-1 w-fit !py-2 !text-[12.5px]">
              {t('home.verNovedades')}
            </Link>
          </div>
        </div>
      </div>

      {/* Nuevas recetas */}
      <div>
        <div className="mb-3.5 flex flex-wrap items-center gap-3">
          <h2 className="text-[17px] font-extrabold tracking-tight text-ink">{t('home.nuevasRecetas')}</h2>
          <span className="rounded-md bg-brand-50 px-2 py-1 text-[11px] font-semibold text-brand-600">
            {t('home.agregadasSemana')}
          </span>
          <Link
            to="/novedades"
            className="ml-auto text-[12.5px] font-semibold text-ink/50 transition hover:text-brand-600"
          >
            {t('home.verTodas')} →
          </Link>
        </div>

        {novedades.length === 0 ? (
          <EmptyState icon="sparkles" title="Sin novedades por ahora" />
        ) : (
          <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-6">
            {novedades.slice(0, 6).map((r) => (
              <RecipeCard key={r.id} receta={r} />
            ))}
          </div>
        )}
      </div>

      {/* Fila de herramientas — icono a la izquierda, texto a la derecha */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-6">
        {HERRAMIENTAS.map((h, i) => (
          <Link
            key={`${h.k}-${i}`}
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
    </div>
  );
}
