import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { RECETAS_SEED } from '../../data/recipes.js';
import { CATEGORIES, categoryBySlug } from '../../lib/categories.js';
import { useRecipes } from '../../lib/useRecipes.js';

export default function AdminRecipeList() {
  const { recetas } = useRecipes();
  const [q, setQ] = useState('');
  const [categoria, setCategoria] = useState('todas');

  const lista = useMemo(() => {
    const base = recetas.length ? recetas : RECETAS_SEED;
    return base
      .filter((r) => categoria === 'todas' || r.categoria === categoria)
      .filter((r) => !q.trim() || r.nombre.toLowerCase().includes(q.trim().toLowerCase()))
      .sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
  }, [recetas, q, categoria]);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-ink">Recetas ({lista.length})</h1>
        <Link
          to="/admin/recetas/nueva"
          className="rounded-xl bg-wine-500 px-4 py-2 text-sm font-semibold text-white shadow-card hover:bg-wine-600"
        >
          + Nueva receta
        </Link>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="search"
          placeholder="Buscar por nombre…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="flex-1 rounded-xl border border-line bg-shell px-4 py-2.5 text-sm outline-none focus:border-wine-400"
        />
        <select
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          className="rounded-xl border border-line bg-shell px-4 py-2.5 text-sm outline-none focus:border-wine-400"
        >
          <option value="todas">Todas las categorías</option>
          {CATEGORIES.map((c) => (
            <option key={c.slug} value={c.slug}>{c.icon} {c.name}</option>
          ))}
        </select>
      </div>

      <div className="overflow-hidden rounded-2xl border border-line bg-shell">
        <table className="w-full text-sm">
          <thead className="bg-cream text-left text-xs uppercase tracking-wide text-ink/50">
            <tr>
              <th className="px-4 py-3">Receta</th>
              <th className="px-4 py-3">Categoría</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {lista.map((r) => {
              const cat = categoryBySlug(r.categoria);
              return (
                <tr key={r.id}>
                  <td className="px-4 py-3 font-medium text-ink">{r.nombre}</td>
                  <td className="px-4 py-3 text-ink/60">{cat?.icon} {cat?.name}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs ${r.publicada === false ? 'bg-ink/10 text-ink/50' : 'bg-emerald-50 text-emerald-700'}`}>
                      {r.publicada === false ? 'Oculta' : 'Publicada'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link to={`/admin/recetas/${r.id}`} className="font-semibold text-wine-500">
                      Editar
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
