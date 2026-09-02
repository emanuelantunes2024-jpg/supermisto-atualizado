import { useMemo, useState } from 'react';
import { useRecipes } from '../lib/useRecipes.js';
import RecipeCard from '../components/RecipeCard.jsx';

export default function Search() {
  const { recetas } = useRecipes();
  const [q, setQ] = useState('');

  const resultados = useMemo(() => {
    const texto = q.trim().toLowerCase();
    if (!texto) return [];
    return recetas.filter((r) => {
      if (r.publicada === false) return false;
      const enNombre = r.nombre.toLowerCase().includes(texto);
      const enDescripcion = r.descripcion?.toLowerCase().includes(texto);
      const enIngredientes = r.ingredientes?.some((i) => i.nombre.toLowerCase().includes(texto));
      return enNombre || enDescripcion || enIngredientes;
    });
  }, [recetas, q]);

  return (
    <div className="space-y-5">
      <h1 className="font-display text-2xl font-bold text-ink">Buscar receta</h1>
      <input
        type="search"
        autoFocus
        placeholder="Nombre, ingrediente o descripción…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        className="w-full rounded-xl border border-line bg-shell px-4 py-3 text-sm text-ink outline-none focus:border-wine-400"
      />

      {q.trim() === '' ? (
        <p className="py-10 text-center text-sm text-ink/50">Escribí algo para empezar a buscar.</p>
      ) : resultados.length === 0 ? (
        <p className="py-10 text-center text-sm text-ink/50">No encontramos recetas con "{q}".</p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {resultados.map((r) => (
            <RecipeCard key={r.id} receta={r} />
          ))}
        </div>
      )}
    </div>
  );
}
