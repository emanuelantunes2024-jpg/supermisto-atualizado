import { createContext, useContext, useCallback, useMemo, useState } from 'react';
import { obtenerIdioma, guardarIdioma, traducir } from './i18n.js';

const IdiomaContext = createContext(null);

export function IdiomaProvider({ children }) {
  const [idioma, setIdiomaState] = useState(() => obtenerIdioma());

  const setIdioma = useCallback((code) => {
    guardarIdioma(code);
    setIdiomaState(code);
    document.documentElement.lang = code;
  }, []);

  const value = useMemo(
    () => ({ idioma, setIdioma, t: (clave) => traducir(clave, idioma) }),
    [idioma, setIdioma]
  );

  return <IdiomaContext.Provider value={value}>{children}</IdiomaContext.Provider>;
}

export function useIdioma() {
  const ctx = useContext(IdiomaContext);
  if (!ctx) throw new Error('useIdioma debe usarse dentro de <IdiomaProvider>');
  return ctx;
}
