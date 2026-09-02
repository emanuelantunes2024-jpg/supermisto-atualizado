import { Link } from 'react-router-dom';
import { RECETAS_SEED } from '../../data/recipes.js';
import { CATEGORIES } from '../../lib/categories.js';

export default function AdminDashboard() {
  const total = RECETAS_SEED.length;

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold text-ink">Dashboard</h1>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-line bg-shell p-5 shadow-card">
          <p className="text-xs uppercase tracking-wide text-ink/50">Recetas totales</p>
          <p className="mt-1 font-display text-3xl font-bold text-wine-500">{total}</p>
        </div>
        <div className="rounded-2xl border border-line bg-shell p-5 shadow-card">
          <p className="text-xs uppercase tracking-wide text-ink/50">Categorías</p>
          <p className="mt-1 font-display text-3xl font-bold text-wine-500">{CATEGORIES.length}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-line bg-shell p-5 shadow-card">
        <h2 className="mb-3 font-display text-lg font-semibold text-ink">Por categoría</h2>
        <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {CATEGORIES.map((c) => {
            const n = RECETAS_SEED.filter((r) => r.categoria === c.slug).length;
            return (
              <li key={c.slug} className="flex items-center justify-between rounded-xl bg-cream px-3 py-2 text-sm">
                <span>{c.icon} {c.name}</span>
                <span className="font-semibold text-ink/70">{n}</span>
              </li>
            );
          })}
        </ul>
      </div>

      <Link
        to="/admin/recetas"
        className="inline-block rounded-xl bg-wine-500 px-5 py-3 text-sm font-semibold text-white shadow-card hover:bg-wine-600"
      >
        Gestionar recetas →
      </Link>
    </div>
  );
}
