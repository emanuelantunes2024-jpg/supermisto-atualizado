import { Link } from 'react-router-dom';
import Icon from './Icon.jsx';
import { useStore } from '../lib/StoreContext.jsx';
import { formatoTiempo } from '../lib/calc.js';
import { banderaDesdePais, nombrePais } from '../lib/paises.js';
import { useIdioma } from '../lib/IdiomaContext.jsx';

export default function RecipeCard({ receta, compact = false }) {
  const { favoritos, alternarFavorito, categoriaBySlug } = useStore();
  const { t } = useIdioma();
  const esFavorito = favoritos.includes(receta.id);
  const cat = categoriaBySlug(receta.categoria);

  return (
    <Link
      to={`/recetas/${receta.slug}`}
      className="card group flex flex-col overflow-hidden transition hover:-translate-y-0.5 hover:shadow-lg"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-brand-50">
        <img
          src={receta.imagen}
          alt={receta.nombre}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          loading="lazy"
        />
        {receta.novedad && (
          <span className="absolute left-2.5 top-2.5 rounded-full bg-violet-500 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow">
            {t('nav.nuevo')}
          </span>
        )}
        <button
          onClick={(e) => {
            e.preventDefault();
            alternarFavorito(receta.id);
          }}
          className={`absolute right-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow transition hover:text-brand-500 ${
            esFavorito ? 'text-brand-500' : 'text-ink/60'
          }`}
          aria-label="Favorito"
        >
          <Icon name="heart" className="w-4 h-4" filled={esFavorito} />
        </button>
        <span className="absolute bottom-2.5 left-2.5 flex items-center gap-1 rounded-full bg-black/55 px-2 py-1 text-[11px] font-medium text-white">
          <Icon name="clock" className="w-3.5 h-3.5" />
          {formatoTiempo(receta.tiempoMinutos)}
        </span>
      </div>
      {!compact && (
        <div className="flex flex-1 flex-col gap-1 p-4">
          <h3 className="line-clamp-2 text-[15px] font-bold leading-snug text-ink">
            {receta.origen && (
              <span className="mr-1" title={nombrePais(receta.origen)}>
                {banderaDesdePais(receta.origen)}
              </span>
            )}
            {receta.nombre}
          </h3>
          <p className="text-xs font-medium text-ink/60">{cat?.name}</p>
        </div>
      )}
    </Link>
  );
}
