// Mientras no haya foto real cargada desde el admin, cada receta muestra un
// fondo degradado con el ícono de su categoría — se ve prolijo desde el
// primer día y no depende de imágenes externas.

import { categoryBySlug } from '../lib/categories.js';

export default function PlaceholderImage({ categoria, className = '' }) {
  const cat = categoryBySlug(categoria);
  const color = cat?.color || '#7A2620';
  return (
    <div
      className={`flex items-center justify-center ${className}`}
      style={{
        background: `linear-gradient(135deg, ${color}dd 0%, ${color} 100%)`,
      }}
    >
      <span className="drop-shadow-sm" style={{ fontSize: '2.75rem' }}>
        {cat?.icon || '🍽️'}
      </span>
    </div>
  );
}

export function RecipeImage({ receta, className = '' }) {
  if (receta?.imagen) {
    return (
      <img
        src={receta.imagen}
        alt={receta.nombre}
        className={className}
        loading="lazy"
      />
    );
  }
  return <PlaceholderImage categoria={receta?.categoria} className={className} />;
}
