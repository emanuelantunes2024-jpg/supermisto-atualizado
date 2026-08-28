import { Link } from 'react-router-dom';
import { useStore } from '../../lib/StoreContext.jsx';
import Icon from '../../components/Icon.jsx';

function Stat({ icon, tono, valor, label }) {
  return (
    <div className="card flex items-center gap-3 p-4">
      <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${tono}`}>
        <Icon name={icon} className="w-[18px] h-[18px]" />
      </span>
      <span className="min-w-0">
        <span className="block text-[20px] font-extrabold leading-none text-ink">{valor}</span>
        <span className="mt-1 block text-[11.5px] text-ink/50">{label}</span>
      </span>
    </div>
  );
}

function haceCuanto(fecha) {
  const dias = Math.floor((Date.now() - new Date(fecha).getTime()) / 86400000);
  if (Number.isNaN(dias)) return '';
  if (dias <= 0) return 'Hoy';
  if (dias === 1) return 'Hace 1 día';
  if (dias < 30) return `Hace ${dias} días`;
  const meses = Math.floor(dias / 30);
  return meses === 1 ? 'Hace 1 mes' : `Hace ${meses} meses`;
}

const ACCIONES = [
  { to: '/admin/recetas/nueva', icon: 'plus', label: 'Nueva receta' },
  { to: '/admin/categorias', icon: 'grid', label: 'Nueva categoría' },
  { to: '/admin/recetas', icon: 'bell', label: 'Marcar novedad' },
  { to: '/admin/recetas', icon: 'upload', label: 'Importar recetas' },
];

export default function Dashboard() {
  const { recetas, favoritos, categoriaBySlug } = useStore();
  const publicadas = recetas.filter((r) => r.publicada);
  const novedades = recetas.filter((r) => r.novedad);
  const recientes = [...recetas]
    .sort((a, b) => new Date(b.creadoEn) - new Date(a.creadoEn))
    .slice(0, 6);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-[22px] font-extrabold tracking-tight text-ink">Dashboard</h1>
        <Link to="/admin/recetas/nueva" className="btn-primary !py-2 !text-[12.5px]">
          <Icon name="plus" className="w-4 h-4" /> Nueva receta
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3.5 lg:grid-cols-4">
        <Stat icon="book" tono="bg-sky-50 text-sky-500" valor={recetas.length} label="Total de recetas" />
        <Stat icon="sparkles" tono="bg-emerald-50 text-emerald-500" valor={`+${novedades.length}`} label="Nuevas esta semana" />
        <Stat icon="eye" tono="bg-amber-50 text-amber-500" valor={publicadas.length} label="Recetas publicadas" />
        <Stat icon="heart" tono="bg-rose-50 text-rose-400" valor={favoritos.length} label="Recetas favoritas" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="card p-5 lg:col-span-2">
          <p className="mb-3 text-[13.5px] font-extrabold text-ink">Recetas agregadas recientemente</p>
          <div className="divide-y divide-line/70">
            {recientes.map((r) => (
              <Link
                key={r.id}
                to={`/admin/recetas/${r.id}/editar`}
                className="flex items-center gap-3 py-2.5 transition hover:opacity-80"
              >
                <img src={r.imagen} alt="" className="h-9 w-9 shrink-0 rounded-lg object-cover" />
                <span className="min-w-0 flex-1 truncate text-[12.5px] font-semibold text-ink">{r.nombre}</span>
                <span className="hidden shrink-0 text-[11.5px] text-ink/45 sm:block">
                  {categoriaBySlug(r.categoria)?.name}
                </span>
                <span className="w-[92px] shrink-0 text-right text-[11.5px] text-ink/40">
                  {haceCuanto(r.creadoEn)}
                </span>
              </Link>
            ))}
          </div>
          <Link to="/admin/recetas" className="btn-secondary mt-3 w-full justify-center !py-2 !text-[12.5px]">
            Ver todas las recetas
          </Link>
        </div>

        <div className="space-y-4">
          <div className="card p-5">
            <p className="mb-3 text-[13.5px] font-extrabold text-ink">Acciones rápidas</p>
            <div className="space-y-2">
              {ACCIONES.map((a, i) => (
                <Link
                  key={`${a.label}-${i}`}
                  to={a.to}
                  className="flex w-full items-center gap-2 rounded-xl border border-line px-3 py-2.5 text-[12.5px] font-semibold text-ink transition hover:border-brand-200 hover:bg-brand-50"
                >
                  <Icon name={a.icon} className="w-4 h-4 text-ink/50" /> {a.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="card flex items-center gap-3 p-5">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-500">
              <Icon name="bell" className="w-[18px] h-[18px]" />
            </span>
            <span>
              <span className="block text-[20px] font-extrabold leading-none text-ink">{novedades.length}</span>
              <span className="mt-1 block text-[11.5px] text-ink/50">Novedades activas</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
