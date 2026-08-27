import { useParams, useNavigate, Link } from 'react-router-dom';
import { useStore } from '../lib/StoreContext.jsx';
import Icon from '../components/Icon.jsx';
import RecipeCard from '../components/RecipeCard.jsx';
import EmptyState from '../components/EmptyState.jsx';

export default function CollectionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { colecciones, recetasPublicadas } = useStore();
  const coleccion = colecciones.find((c) => c.id === id);

  if (!coleccion) {
    return (
      <EmptyState
        icon="folder"
        title="Colección no encontrada"
        description="Puede que haya sido eliminada."
        action={
          <Link to="/colecciones" className="btn-primary">
            Volver a colecciones
          </Link>
        }
      />
    );
  }

  const recetas = recetasPublicadas.filter((r) => coleccion.recetaIds.includes(r.id));

  return (
    <div className="space-y-6">
      <button onClick={() => navigate('/colecciones')} className="btn-ghost -ml-3">
        <Icon name="chevronLeft" className="w-4 h-4" /> Volver a colecciones
      </button>

      <div>
        <h1 className="text-2xl font-extrabold text-ink">{coleccion.nombre}</h1>
        <p className="mt-1 text-sm text-ink/50">{recetas.length} receta{recetas.length === 1 ? '' : 's'}</p>
      </div>

      {recetas.length === 0 ? (
        <EmptyState
          icon="folder"
          title="Esta colección está vacía"
          description="Abrí una receta y usá 'Agregar a colección' para sumarla acá."
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
