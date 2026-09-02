import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { CATEGORIES } from '../lib/categories.js';
import { useRecipes } from '../lib/useRecipes.js';
import CategoryCard from '../components/CategoryCard.jsx';
import RecipeCard from '../components/RecipeCard.jsx';

export default function Home() {
  const { recetas } = useRecipes();

  const publicadas = useMemo(() => recetas.filter((r) => r.publicada !== false), [recetas]);
  const destacadas = useMemo(() => publicadas.filter((r) => r.destacada).slice(0, 6), [publicadas]);
  const conteoPorCategoria = useMemo(() => {
    const mapa = {};
    publicadas.forEach((r) => {
      mapa[r.categoria] = (mapa[r.categoria] || 0) + 1;
    });
    return mapa;
  }, [publicadas]);

  return (
    <div className="space-y-8">
      <section>
        <h1 className="font-display text-2xl font-bold text-ink">¡Hola! ¿Qué cocinamos hoy?</h1>
        <p className="mt-1 text-sm text-ink/60">{publicadas.length} recetas españolas esperándote.</p>
      </section>

      {destacadas.length > 0 && (
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-ink">Destacadas</h2>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {destacadas.map((r) => (
              <RecipeCard key={r.id} receta={r} />
            ))}
          </div>
        </section>
      )}

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-ink">Categorías</h2>
          <Link to="/app/buscar" className="text-sm font-medium text-wine-500">
            Buscar receta →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {CATEGORIES.map((c) => (
            <CategoryCard key={c.slug} categoria={c} total={conteoPorCategoria[c.slug] || 0} />
          ))}
        </div>
      </section>
    </div>
  );
}
