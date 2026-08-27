import { Link } from 'react-router-dom';
import { useStore } from '../lib/StoreContext.jsx';
import { CATEGORIES } from '../data/categories.js';

export default function Categories() {
  const { recetasPublicadas } = useStore();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-ink">Categorías</h1>
        <p className="mt-1 text-sm text-ink/50">Explorá las recetas organizadas por tipo.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {CATEGORIES.map((c) => {
          const total = recetasPublicadas.filter((r) => r.categoria === c.slug).length;
          return (
            <Link
              key={c.slug}
              to={`/categorias/${c.slug}`}
              className="card flex flex-col items-start gap-3 p-5 transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              <div
                className="flex h-12 w-12 items-center justify-center rounded-2xl text-2xl"
                style={{ backgroundColor: `${c.color}1a` }}
              >
                {c.icon}
              </div>
              <div>
                <p className="font-bold text-ink">{c.name}</p>
                <p className="text-xs text-ink/45">{total} receta{total === 1 ? '' : 's'}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
