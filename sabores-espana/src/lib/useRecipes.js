// Combina el catálogo de fábrica (src/data/recipes.js, siempre disponible)
// con las ediciones guardadas por el admin en Redis (/api/content/recetas),
// exactamente como hace "Recetas & Rendimiento". Si el backend no está
// configurado o falla, la app sigue funcionando solo con el catálogo de
// fábrica — nunca se rompe por falta de Redis.

import { useEffect, useState } from 'react';
import { RECETAS_SEED } from '../data/recipes.js';

function combinar(seed, overrides) {
  if (!overrides || Object.keys(overrides).length === 0) return seed;
  const extras = Object.values(overrides).filter((r) => r.esNueva);
  const base = seed
    .map((r) => (overrides[r.id] ? { ...r, ...overrides[r.id] } : r))
    .filter((r) => !overrides[r.id]?.eliminada);
  return [...base, ...extras.filter((r) => !r.eliminada)];
}

export function useRecipes() {
  const [recetas, setRecetas] = useState(RECETAS_SEED);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    let cancelado = false;
    fetch('/api/content/recetas')
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data) => {
        if (!cancelado && data?.overrides) {
          setRecetas(combinar(RECETAS_SEED, data.overrides));
        }
      })
      .catch(() => {
        // Sin backend (desarrollo local) o Redis no configurado: se queda
        // con el catálogo de fábrica, que ya es 100% funcional.
      })
      .finally(() => !cancelado && setCargando(false));
    return () => {
      cancelado = true;
    };
  }, []);

  return { recetas, cargando };
}
