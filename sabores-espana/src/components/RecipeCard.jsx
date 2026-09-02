import { Link } from 'react-router-dom';
import { RecipeImage } from './PlaceholderImage.jsx';
import FavoriteButton from './FavoriteButton.jsx';
import { formatearMinutos, colorDificultad } from '../lib/format.js';

export default function RecipeCard({ receta }) {
  return (
    <Link
      to={`/app/receta/${receta.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-shell shadow-card transition hover:shadow-lift"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <RecipeImage receta={receta} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
        <FavoriteButton id={receta.id} className="absolute right-2.5 top-2.5" />
        {receta.destacada && (
          <span className="absolute left-2.5 top-2.5 rounded-full bg-gold-300 px-2.5 py-0.5 text-[11px] font-semibold text-ink shadow-card">
            Destacada
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-3.5">
        <h3 className="font-display text-base font-semibold leading-snug text-ink line-clamp-2">
          {receta.nombre}
        </h3>
        <p className="line-clamp-2 text-xs text-ink/60">{receta.descripcion}</p>
        <div className="mt-auto flex items-center gap-2 pt-2 text-xs">
          <span className="rounded-full bg-cream px-2 py-0.5 text-ink/60">⏱ {formatearMinutos(receta.tiempoTotalMinutos)}</span>
          <span className={`rounded-full px-2 py-0.5 ring-1 ${colorDificultad(receta.dificultad)}`}>
            {receta.dificultad}
          </span>
        </div>
      </div>
    </Link>
  );
}
