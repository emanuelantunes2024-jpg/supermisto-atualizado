import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import * as db from './db.js';
import { CATEGORIES as CATEGORIAS_SEED } from '../data/categories.js';

const StoreContext = createContext(null);

// Mismo valor por defecto que api/_lib/contentStore.js — hasta que el admin
// suba las suyas propias, la home usa las imágenes originales del diseño.
const CONFIG_SITIO_POR_DEFECTO = {
  bannerBibliotecaImagen: '/images/hero/torta-chocolate.png',
  bannerNovedadesImagen: '/images/hero/cupcake.png',
};

async function llamarJSON(url, opciones) {
  const r = await fetch(url, { credentials: 'include', ...opciones });
  const cuerpo = await r.json().catch(() => null);
  if (!r.ok || !cuerpo?.ok) throw new Error(cuerpo?.error || `error_${r.status}`);
  return cuerpo;
}

export function StoreProvider({ children }) {
  const [recetas, setRecetas] = useState([]);
  const [categorias, setCategorias] = useState(CATEGORIAS_SEED);
  const [etiquetas, setEtiquetas] = useState([]);
  const [favoritos, setFavoritos] = useState([]);
  const [colecciones, setColecciones] = useState([]);
  const [lista, setLista] = useState([]);
  const [configSitio, setConfigSitio] = useState(CONFIG_SITIO_POR_DEFECTO);
  const [listo, setListo] = useState(false);

  useEffect(() => {
    // Favoritos, colecciones y lista de compras siguen siendo datos propios
    // del dispositivo (localStorage) — nadie más los necesita ver.
    db.inicializarDatos();
    setFavoritos(db.obtenerFavoritos());
    setColecciones(db.obtenerColecciones());
    setLista(db.obtenerListaCompras());

    // Recetas y categorías ahora son contenido compartido: se leen del
    // backend (persistido en Redis, o el catálogo semilla si Redis todavía
    // no está configurado) para que lo que el admin publique lo vea
    // cualquier visitante.
    (async () => {
      try {
        const [rRecetas, rCategorias, rConfig, rEtiquetas] = await Promise.all([
          fetch('/api/content/recetas', { credentials: 'include' }).then((r) => r.json()),
          fetch('/api/content/categorias', { credentials: 'include' }).then((r) => r.json()),
          fetch('/api/content/config', { credentials: 'include' }).then((r) => r.json()),
          fetch('/api/content/etiquetas', { credentials: 'include' }).then((r) => r.json()),
        ]);
        if (rRecetas?.ok) setRecetas(rRecetas.recetas);
        if (rCategorias?.ok) setCategorias(rCategorias.categorias);
        if (rConfig?.ok) setConfigSitio(rConfig.config);
        if (rEtiquetas?.ok) setEtiquetas(rEtiquetas.etiquetas);
      } catch {
        // Sin conexión con el backend de contenido: seguimos con el catálogo semilla.
      } finally {
        setListo(true);
      }
    })();
  }, []);

  const guardarReceta = useCallback(async (receta) => {
    const r = await llamarJSON('/api/admin/recetas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(receta),
    });
    setRecetas(r.recetas);
    return r.recetas;
  }, []);

  const eliminarReceta = useCallback(async (id) => {
    const r = await llamarJSON(`/api/admin/recetas?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
    setRecetas(r.recetas);
    return r.recetas;
  }, []);

  const guardarCategoria = useCallback(async (categoria) => {
    const r = await llamarJSON('/api/admin/categorias', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(categoria),
    });
    setCategorias(r.categorias);
    return r.categorias;
  }, []);

  const eliminarCategoria = useCallback(async (slug) => {
    const r = await llamarJSON(`/api/admin/categorias?slug=${encodeURIComponent(slug)}`, { method: 'DELETE' });
    setCategorias(r.categorias);
    return r.categorias;
  }, []);

  const categoriaBySlug = useCallback((slug) => categorias.find((c) => c.slug === slug), [categorias]);

  const guardarEtiqueta = useCallback(async (etiqueta) => {
    const r = await llamarJSON('/api/admin/etiquetas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(etiqueta),
    });
    setEtiquetas(r.etiquetas);
    return r.etiquetas;
  }, []);

  const eliminarEtiqueta = useCallback(async (id) => {
    const r = await llamarJSON(`/api/admin/etiquetas?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
    setEtiquetas(r.etiquetas);
    setRecetas((rs) => rs.map((r) => (r.etiquetas?.includes(id) ? { ...r, etiquetas: r.etiquetas.filter((e) => e !== id) } : r)));
    return r.etiquetas;
  }, []);

  const guardarConfigSitio = useCallback(async (cambios) => {
    const r = await llamarJSON('/api/admin/config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cambios),
    });
    setConfigSitio(r.config);
    return r.config;
  }, []);

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
  const actualizarPrecioItemLista = useCallback((id, precio) => setLista(db.actualizarPrecioItemLista(id, precio)), []);
  const eliminarItemLista = useCallback((id) => setLista(db.eliminarItemLista(id)), []);
  const vaciarLista = useCallback(() => setLista(db.vaciarLista()), []);

  const value = useMemo(
    () => ({
      listo,
      recetas,
      recetasPublicadas: recetas.filter((r) => r.publicada),
      categorias,
      categoriaBySlug,
      etiquetas,
      guardarEtiqueta,
      eliminarEtiqueta,
      configSitio,
      guardarConfigSitio,
      favoritos,
      colecciones,
      lista,
      guardarReceta,
      eliminarReceta,
      guardarCategoria,
      eliminarCategoria,
      alternarFavorito,
      crearColeccion,
      eliminarColeccion,
      alternarRecetaEnColeccion,
      agregarAListaCompras,
      alternarItemLista,
      actualizarPrecioItemLista,
      eliminarItemLista,
      vaciarLista,
    }),
    [
      listo,
      recetas,
      categorias,
      categoriaBySlug,
      etiquetas,
      guardarEtiqueta,
      eliminarEtiqueta,
      configSitio,
      guardarConfigSitio,
      favoritos,
      colecciones,
      lista,
      guardarReceta,
      eliminarReceta,
      guardarCategoria,
      eliminarCategoria,
      alternarFavorito,
      crearColeccion,
      eliminarColeccion,
      alternarRecetaEnColeccion,
      agregarAListaCompras,
      alternarItemLista,
      actualizarPrecioItemLista,
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
