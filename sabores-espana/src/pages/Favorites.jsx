import { Link } from 'react-router-dom';
import { useRecipes } from '../lib/useRecipes.js';
import { useFavorites } from '../lib/useFavorites.js';
import RecipeCard from '../components/RecipeCard.jsx';

export default function Favorites() {
  const { recetas } = useRecipes();
  const { favoritos } = useFavorites();

  const misFavoritas = recetas.filter((r) => favoritos.includes(r.id));

  return (
    <div className="space-y-5">
      <h1 className="font-display text-2xl font-bold text-ink">Tus favoritas</h1>

      {misFavoritas.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line bg-shell py-14 text-center">
          <p className="text-3xl">🤍</p>
          <p className="mt-2 text-sm text-ink/60">
            Todavía no guardaste ninguna receta. Tocá el corazón en cualquier receta para guardarla acá.
          </p>
          <Link to="/app" className="mt-4 inline-block text-sm font-semibold text-wine-500">
            Explorar recetas →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {misFavoritas.map((r) => (
            <RecipeCard key={r.id} receta={r} />
          ))}
        </div>
      )}
    </div>
  );
}
