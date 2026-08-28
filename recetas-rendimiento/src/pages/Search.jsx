import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useStore } from '../lib/StoreContext.jsx';
import Icon from '../components/Icon.jsx';
import RecipeCard from '../components/RecipeCard.jsx';
import EmptyState from '../components/EmptyState.jsx';

export default function Search() {
  const { recetasPublicadas } = useStore();
  const [params, setParams] = useSearchParams();
  const [q, setQ] = useState(params.get('q') || '');

  const resultados = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return [];
    return recetasPublicadas.filter((r) => {
      const enTexto = `${r.nombre} ${r.descripcion}`.toLowerCase().includes(term);
      const enIngredientes = r.ingredientes.some((i) => i.nombre.toLowerCase().includes(term));
      return enTexto || enIngredientes;
    });
  }, [q, recetasPublicadas]);

  function onSubmit(e) {
    e.preventDefault();
    setParams(q ? { q } : {});
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-ink">Buscar recetas</h1>
        <p className="mt-1 text-sm text-ink/50">Buscá por nombre, descripción o ingrediente.</p>
      </div>

      <form onSubmit={onSubmit} className="relative max-w-xl">
        <Icon name="search" className="pointer-events-none absolute left-3.5 top-1/2 w-5 h-5 -translate-y-1/2 text-ink/40" />
        <input
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Ej: chocolate, harina, empanadas…"
          className="input pl-10 py-3"
        />
      </form>

      {q.trim() === '' ? (
        <EmptyState icon="search" title="Escribí algo para buscar" description="Encontrá recetas por nombre, ingrediente o descripción." />
      ) : resultados.length === 0 ? (
        <EmptyState icon="search" title={`Sin resultados para "${q}"`} description="Probá con otra palabra clave." />
      ) : (
        <>
          <p className="text-sm font-medium text-ink/50">{resultados.length} resultado{resultados.length === 1 ? '' : 's'}</p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {resultados.map((r) => (
              <RecipeCard key={r.id} receta={r} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
