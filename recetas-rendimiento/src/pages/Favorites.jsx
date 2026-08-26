import { Link } from 'react-router-dom';
import { useStore } from '../lib/StoreContext.jsx';
import RecipeCard from '../components/RecipeCard.jsx';
import EmptyState from '../components/EmptyState.jsx';

export default function Favorites() {
  const { recetasPublicadas, favoritos } = useStore();
  const recetas = recetasPublicadas.filter((r) => favoritos.includes(r.id));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-ink">Mis favoritas</h1>
        <p className="mt-1 text-sm text-ink/50">Recetas que marcaste con ❤️.</p>
      </div>

      {recetas.length === 0 ? (
        <EmptyState
          icon="heart"
          title="Todavía no tenés favoritas"
          description="Tocá el corazón en cualquier receta para guardarla acá."
          action={
            <Link to="/recetas" className="btn-primary">
              Explorar recetas
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {recetas.map((r) => (
            <RecipeCard key={r.id} receta={r} />
          ))}
        </div>
      )}
    </div>
  );
}
