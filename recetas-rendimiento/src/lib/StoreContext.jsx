import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import * as db from './db.js';

const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  const [recetas, setRecetas] = useState([]);
  const [favoritos, setFavoritos] = useState([]);
  const [colecciones, setColecciones] = useState([]);
  const [lista, setLista] = useState([]);
  const [listo, setListo] = useState(false);

  useEffect(() => {
    db.inicializarDatos();
    setRecetas(db.obtenerRecetas());
    setFavoritos(db.obtenerFavoritos());
    setColecciones(db.obtenerColecciones());
    setLista(db.obtenerListaCompras());
    setListo(true);
  }, []);

  const guardarReceta = useCallback((receta) => setRecetas(db.guardarReceta(receta)), []);
  const eliminarReceta = useCallback((id) => setRecetas(db.eliminarReceta(id)), []);
  const alternarFavorito = useCallback((id) => setFavoritos(db.alternarFavorito(id)), []);

  const crearColeccion = useCallback((nombre) => {
    const { colecciones: actualizadas, nueva } = db.crearColeccion(nombre);
    setColecciones(actualizadas);
    return nueva;
  }, []);
  const eliminarColeccion = useCallback((id) => setColecciones(db.eliminarColeccion(id)), []);
  const alternarRecetaEnColeccion = useCallback(
    (coleccionId, recetaId) => setColecciones(db.alternarRecetaEnColeccion(coleccionId, recetaId)),
    []
  );

  const agregarAListaCompras = useCallback((items) => setLista(db.agregarAListaCompras(items)), []);
  const alternarItemLista = useCallback((id) => setLista(db.alternarItemLista(id)), []);
  const eliminarItemLista = useCallback((id) => setLista(db.eliminarItemLista(id)), []);
  const vaciarLista = useCallback(() => setLista(db.vaciarLista()), []);

  const value = useMemo(
    () => ({
      listo,
      recetas,
      recetasPublicadas: recetas.filter((r) => r.publicada),
      favoritos,
      colecciones,
      lista,
      guardarReceta,
      eliminarReceta,
      alternarFavorito,
      crearColeccion,
      eliminarColeccion,
      alternarRecetaEnColeccion,
      agregarAListaCompras,
      alternarItemLista,
      eliminarItemLista,
      vaciarLista,
    }),
    [
      listo,
      recetas,
      favoritos,
      colecciones,
      lista,
      guardarReceta,
      eliminarReceta,
      alternarFavorito,
      crearColeccion,
      eliminarColeccion,
      alternarRecetaEnColeccion,
      agregarAListaCompras,
      alternarItemLista,
      eliminarItemLista,
      vaciarLista,
    ]
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore debe usarse dentro de <StoreProvider>');
  return ctx;
}
