import { Link } from 'react-router-dom';
import { useStore } from '../../lib/StoreContext.jsx';
import { CATEGORIES } from '../../data/categories.js';
import Icon from '../../components/Icon.jsx';

export default function CategoriesAdmin() {
  const { recetas } = useStore();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-ink">Categorías</h1>
        <p className="mt-1 text-sm text-ink/50">
          Las categorías se asignan a cada receta desde su formulario de edición.
        </p>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full min-w-[520px] text-left text-sm">
          <thead className="border-b border-black/5 text-xs uppercase tracking-wide text-ink/45">
            <tr>
              <th className="px-4 py-3 font-semibold">Categoría</th>
              <th className="px-4 py-3 font-semibold">Total</th>
              <th className="px-4 py-3 font-semibold">Publicadas</th>
              <th className="px-4 py-3 font-semibold text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {CATEGORIES.map((c) => {
              const todas = recetas.filter((r) => r.categoria === c.slug);
              const publicadas = todas.filter((r) => r.publicada);
              return (
                <tr key={c.slug}>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-2 font-semibold text-ink">
                      <span>{c.icon}</span> {c.name}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-ink/70">{todas.length}</td>
                  <td className="px-4 py-3 text-ink/70">{publicadas.length}</td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      to={`/categorias/${c.slug}`}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:text-brand-700"
                    >
                      Ver <Icon name="chevronRight" className="w-3.5 h-3.5" />
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
