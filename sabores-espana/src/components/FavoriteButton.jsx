import { useFavorites } from '../lib/useFavorites.js';

export default function FavoriteButton({ id, size = 'md', className = '' }) {
  const { isFavorite, toggle } = useFavorites();
  const activo = isFavorite(id);
  const dims = size === 'lg' ? 'h-11 w-11 text-xl' : 'h-9 w-9 text-base';

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(id);
      }}
      aria-pressed={activo}
      aria-label={activo ? 'Quitar de favoritos' : 'Guardar en favoritos'}
      className={`${dims} flex shrink-0 items-center justify-center rounded-full shadow-card transition ${
        activo ? 'bg-wine-500 text-white' : 'bg-white/90 text-ink/70 hover:text-wine-500'
      } ${className}`}
    >
      {activo ? '❤️' : '🤍'}
    </button>
  );
}
