import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { categoryBySlug } from '../lib/categories.js';
import { useRecipes } from '../lib/useRecipes.js';
import RecipeCard from '../components/RecipeCard.jsx';

const DIFICULTADES = ['Todas', 'Fácil', 'Media', 'Difícil'];

export default function Category() {
  const { slug } = useParams();
  const { recetas } = useRecipes();
  const [dificultad, setDificultad] = useState('Todas');
  const categoria = categoryBySlug(slug);

  const filtradas = useMemo(
    () =>
      recetas.filter(
        (r) =>
          r.categoria === slug &&
          r.publicada !== false &&
          (dificultad === 'Todas' || r.dificultad === dificultad),
      ),
    [recetas, slug, dificultad],
  );

  if (!categoria) {
    return (
      <div className="py-10 text-center text-sm text-ink/60">
        Categoría no encontrada. <Link to="/app" className="font-semibold text-wine-500">Volver al inicio</Link>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <span className="text-3xl">{categoria.icon}</span>
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">{categoria.name}</h1>
          <p className="text-sm text-ink/60">{filtradas.length} recetas</p>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto no-scrollbar">
        {DIFICULTADES.map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => setDificultad(d)}
            className={`shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-medium transition ${
              dificultad === d ? 'border-wine-500 bg-wine-500 text-white' : 'border-line bg-shell text-ink/60'
            }`}
          >
            {d}
          </button>
        ))}
      </div>

      {filtradas.length === 0 ? (
        <p className="py-10 text-center text-sm text-ink/50">Todavía no hay recetas publicadas en este filtro.</p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {filtradas.map((r) => (
            <RecipeCard key={r.id} receta={r} />
          ))}
        </div>
      )}
    </div>
  );
}
