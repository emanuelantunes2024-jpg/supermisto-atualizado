import { Link } from 'react-router-dom';
import { useStore } from '../../lib/StoreContext.jsx';
import Icon from '../../components/Icon.jsx';
import { categoryBySlug } from '../../data/categories.js';

function Stat({ icon, label, valor, color }) {
  return (
    <div className="card flex items-center gap-3 p-4">
      <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${color}`}>
        <Icon name={icon} className="w-5 h-5" />
      </div>
      <div>
        <p className="text-xl font-extrabold text-ink">{valor}</p>
        <p className="text-xs text-ink/50">{label}</p>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { recetas } = useStore();
  const publicadas = recetas.filter((r) => r.publicada);
  const novedades = recetas.filter((r) => r.novedad);
  const paraVender = recetas.filter((r) => r.paraVender);
  const recientes = [...recetas].sort((a, b) => new Date(b.creadoEn) - new Date(a.creadoEn)).slice(0, 6);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-ink">Dashboard</h1>
          <p className="mt-1 text-sm text-ink/50">Resumen general del catálogo de recetas.</p>
        </div>
        <Link to="/admin/recetas/nueva" className="btn-primary">
          <Icon name="plus" className="w-4 h-4" /> Nueva receta
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat icon="book" label="Total de recetas" valor={recetas.length} color="bg-brand-100 text-brand-600" />
        <Stat icon="eye" label="Publicadas" valor={publicadas.length} color="bg-emerald-100 text-emerald-600" />
        <Stat icon="sparkles" label="Novedades activas" valor={novedades.length} color="bg-violet-100 text-violet-600" />
        <Stat icon="bolt" label="Para vender" valor={paraVender.length} color="bg-amber-100 text-amber-600" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="card p-5 lg:col-span-2">
          <p className="mb-3 text-sm font-bold text-ink">Recetas agregadas recientemente</p>
          <div className="divide-y divide-black/5">
            {recientes.map((r) => (
              <div key={r.id} className="flex items-center gap-3 py-2.5">
                <img src={r.imagen} alt={r.nombre} className="h-10 w-10 shrink-0 rounded-lg object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-ink">{r.nombre}</p>
                  <p className="text-xs text-ink/45">{categoryBySlug(r.categoria)?.name}</p>
                </div>
                <span
                  className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                    r.publicada ? 'bg-emerald-100 text-emerald-700' : 'bg-black/5 text-ink/50'
                  }`}
                >
                  {r.publicada ? 'Publicada' : 'Borrador'}
                </span>
              </div>
            ))}
          </div>
          <Link to="/admin/recetas" className="mt-3 inline-block text-sm font-semibold text-brand-600 hover:text-brand-700">
            Ver todas las recetas →
          </Link>
        </div>

        <div className="card p-5">
          <p className="mb-3 text-sm font-bold text-ink">Acciones rápidas</p>
          <div className="space-y-2">
            <Link to="/admin/recetas/nueva" className="btn-secondary w-full justify-start">
              <Icon name="plus" className="w-4 h-4" /> Nueva receta
            </Link>
            <Link to="/admin/categorias" className="btn-secondary w-full justify-start">
              <Icon name="grid" className="w-4 h-4" /> Ver categorías
            </Link>
            <Link to="/admin/recetas" className="btn-secondary w-full justify-start">
              <Icon name="pencil" className="w-4 h-4" /> Editar recetas
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
