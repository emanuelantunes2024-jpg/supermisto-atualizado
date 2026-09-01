import { useCallback, useEffect, useState } from 'react';
import { alternarFavorito, esFavorito, obtenerFavoritos } from './db.js';

export function useFavorites() {
  const [favoritos, setFavoritos] = useState(() => obtenerFavoritos());

  useEffect(() => {
    const actualizar = () => setFavoritos(obtenerFavoritos());
    window.addEventListener('favoritos:cambio', actualizar);
    window.addEventListener('storage', actualizar);
    return () => {
      window.removeEventListener('favoritos:cambio', actualizar);
      window.removeEventListener('storage', actualizar);
    };
  }, []);

  const toggle = useCallback((id) => alternarFavorito(id), []);
  const isFavorite = useCallback((id) => favoritos.includes(id), [favoritos]);

  return { favoritos, toggle, isFavorite, esFavorito };
}
