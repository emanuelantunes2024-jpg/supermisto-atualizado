import { Link } from 'react-router-dom';
import { useStore } from '../lib/StoreContext.jsx';
import Icon from '../components/Icon.jsx';
import RecipeCard from '../components/RecipeCard.jsx';
import SectionHeader from '../components/SectionHeader.jsx';
import EmptyState from '../components/EmptyState.jsx';

const ACCIONES = [
  { to: '/recetas', icon: 'search', color: 'bg-violet-100 text-violet-600', title: 'Encontrar una receta', subtitle: 'Explora el catálogo completo' },
  { to: '/vender', icon: 'bolt', color: 'bg-brand-100 text-brand-600', title: 'Empezar a vender', subtitle: 'Recetas rentables para vender' },
  { to: '/calculadoras/costos', icon: 'calculator', color: 'bg-pink-100 text-pink-600', title: 'Calcular costos', subtitle: 'Sabé cuánto vas a gastar' },
  { to: '/lista-compras', icon: 'cart', color: 'bg-amber-100 text-amber-600', title: 'Lista de compras', subtitle: 'Organizá tus ingredientes' },
  { to: '/central-de-rendimiento', icon: 'scale', color: 'bg-emerald-100 text-emerald-600', title: 'Central de Rendimiento', subtitle: 'Planificá tu producción' },
  { to: '/favoritos', icon: 'heart', color: 'bg-rose-100 text-rose-600', title: 'Mis favoritas', subtitle: 'Accedé a tus recetas guardadas' },
];

const ACCESOS = [
  { to: '/calculadoras/costos', icon: 'calculator', color: 'text-emerald-600 bg-emerald-50', title: 'Calculadora de Costos', subtitle: 'Calculá el costo de tus ingredientes' },
  { to: '/calculadoras/precios', icon: 'trending', color: 'text-brand-600 bg-brand-50', title: 'Calculadora de Precios', subtitle: 'Descubrí el precio ideal para vender' },
  { to: '/central-de-rendimiento', icon: 'scale', color: 'text-sky-600 bg-sky-50', title: 'Central de Rendimiento', subtitle: 'Simulá y planificá tus ganancias' },
  { to: '/lista-compras', icon: 'cart', color: 'text-amber-600 bg-amber-50', title: 'Lista de Compras', subtitle: 'Organizá y ordená tus compras' },
  { to: '/colecciones', icon: 'folder', color: 'text-violet-600 bg-violet-50', title: 'Mis Colecciones', subtitle: 'Agrupá tus recetas favoritas' },
  { to: '/admin', icon: 'dashboard', color: 'text-ink bg-black/5', title: 'Panel Administrativo', subtitle: 'Gestioná recetas y categorías' },
];

export default function Home() {
  const { recetasPublicadas } = useStore();
  const novedades = recetasPublicadas.filter((r) => r.novedad);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-ink sm:text-3xl">¿Qué quieres hacer hoy?</h1>
        <p className="mt-1 text-sm text-ink/50">Elegí una acción para empezar.</p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {ACCIONES.map((a) => (
          <Link
            key={a.to}
            to={a.to}
            className="card flex flex-col items-start gap-3 p-4 transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${a.color}`}>
              <Icon name={a.icon} className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold leading-snug text-ink">{a.title}</p>
              <p className="mt-0.5 text-xs text-ink/45">{a.subtitle}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#241C15] to-[#3A2A1E] p-6 text-white shadow-card">
          <p className="text-sm font-semibold text-white/70">Biblioteca en expansión</p>
          <p className="mt-2 text-4xl font-extrabold">{recetasPublicadas.length}+</p>
          <p className="text-sm text-white/70">recetas disponibles</p>
          <p className="mt-4 flex items-center gap-2 text-xs text-white/50">
            <Icon name="trending" className="w-4 h-4 text-brand-400" />
            Nuevas recetas agregadas cada semana
          </p>
        </div>
        <div className="card flex flex-col justify-between gap-4 p-6 sm:flex-row sm:items-center">
          <div>
            <p className="flex items-center gap-1.5 text-sm font-bold text-ink">
              <Icon name="bell" className="w-4 h-4 text-brand-500" /> ¡Novedades disponibles!
            </p>
            <p className="mt-1 text-sm text-ink/50">
              {novedades.length} recetas nuevas fueron agregadas recientemente.
            </p>
          </div>
          <Link to="/novedades" className="btn-primary shrink-0">
            Ver novedades
          </Link>
        </div>
      </div>

      <div>
        <SectionHeader title="Recetas nuevas" badge="Agregadas recientemente" action="Ver todas" actionTo="/novedades" />
        {novedades.length === 0 ? (
          <EmptyState icon="sparkles" title="Todavía no hay novedades" description="Las recetas marcadas como novedad aparecerán aquí." />
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {novedades.slice(0, 6).map((r) => (
              <RecipeCard key={r.id} receta={r} />
            ))}
          </div>
        )}
      </div>

      <div>
        <SectionHeader title="Accesos rápidos" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {ACCESOS.map((a) => (
            <Link key={a.to} to={a.to} className="card flex flex-col gap-2 p-4 transition hover:-translate-y-0.5 hover:shadow-lg">
              <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${a.color}`}>
                <Icon name={a.icon} className="w-4.5 h-4.5" />
              </div>
              <p className="text-sm font-bold text-ink">{a.title}</p>
              <p className="text-xs text-ink/45">{a.subtitle}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
