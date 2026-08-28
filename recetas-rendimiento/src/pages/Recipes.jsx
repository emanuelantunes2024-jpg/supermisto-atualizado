import { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../lib/StoreContext.jsx';
import RecipeCard from '../components/RecipeCard.jsx';
import EmptyState from '../components/EmptyState.jsx';

export default function Recipes() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { recetasPublicadas, categorias, categoriaBySlug, etiquetas } = useStore();
  const [dificultad, setDificultad] = useState('');
  const [etiqueta, setEtiqueta] = useState('');
  const cat = slug ? categoriaBySlug(slug) : null;

  // Solo se ofrecen para filtrar las etiquetas que efectivamente tiene
  // alguna receta publicada — evita mostrar etiquetas "vacías".
  const etiquetasUsadas = useMemo(
    () => etiquetas.filter((et) => recetasPublicadas.some((r) => r.etiquetas?.includes(et.id))),
    [etiquetas, recetasPublicadas]
  );

  const recetas = useMemo(() => {
    return recetasPublicadas.filter((r) => {
      if (slug && r.categoria !== slug) return false;
      if (dificultad && r.dificultad !== dificultad) return false;
      if (etiqueta && !r.etiquetas?.includes(etiqueta)) return false;
      return true;
    });
  }, [recetasPublicadas, slug, dificultad, etiqueta]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-ink">{cat ? cat.name : 'Todas las recetas'}</h1>
        <p className="mt-1 text-sm text-ink/50">{recetas.length} recetas encontradas</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button onClick={() => navigate('/recetas')} className={`pill ${!slug ? 'pill-active' : ''}`}>
          Todas
        </button>
        {categorias.map((c) => (
          <button
            key={c.slug}
            onClick={() => navigate(`/categorias/${c.slug}`)}
            className={`pill ${slug === c.slug ? 'pill-active' : ''}`}
          >
            <span>{c.icon}</span> {c.name}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="label">Dificultad</span>
        {['', 'Fácil', 'Medio', 'Difícil'].map((d) => (
          <button
            key={d || 'todas'}
            onClick={() => setDificultad(d)}
            className={`pill !py-1 !px-2.5 text-xs ${dificultad === d ? 'pill-active' : ''}`}
          >
            {d || 'Todas'}
          </button>
        ))}
      </div>

      {etiquetasUsadas.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="label">Etiquetas</span>
          <button
            onClick={() => setEtiqueta('')}
            className={`pill !py-1 !px-2.5 text-xs ${!etiqueta ? 'pill-active' : ''}`}
          >
            Todas
          </button>
          {etiquetasUsadas.map((et) => (
            <button
              key={et.id}
              onClick={() => setEtiqueta(et.id)}
              className={`pill !py-1 !px-2.5 text-xs ${etiqueta === et.id ? 'pill-active' : ''}`}
            >
              {et.nombre}
            </button>
          ))}
        </div>
      )}

      {recetas.length === 0 ? (
        <EmptyState
          icon="book"
          title="No encontramos recetas"
          description="Probá con otra categoría o cambiá el filtro de dificultad."
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
