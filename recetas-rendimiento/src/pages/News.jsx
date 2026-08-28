import { useStore } from '../lib/StoreContext.jsx';
import Icon from '../components/Icon.jsx';
import RecipeCard from '../components/RecipeCard.jsx';
import EmptyState from '../components/EmptyState.jsx';

export default function News() {
  const { recetasPublicadas } = useStore();
  const novedades = recetasPublicadas
    .filter((r) => r.novedad)
    .sort((a, b) => new Date(b.creadoEn) - new Date(a.creadoEn));

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-100 text-brand-600">
          <Icon name="sparkles" className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-ink">Novedades</h1>
          <p className="mt-0.5 text-sm text-ink/50">{novedades.length} recetas agregadas recientemente.</p>
        </div>
      </div>

      {novedades.length === 0 ? (
        <EmptyState icon="sparkles" title="Sin novedades por ahora" description="Las próximas recetas nuevas van a aparecer acá." />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {novedades.map((r) => (
            <RecipeCard key={r.id} receta={r} />
          ))}
        </div>
      )}
    </div>
  );
}
