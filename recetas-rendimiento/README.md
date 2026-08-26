# Recetas & Rendimiento

**Leuname Software** — PWA de recetas, costos y ganancias para quienes cocinan y venden.

Aplicación 100% en español, responsiva (celular y computadora), instalable como PWA, con
panel administrativo funcional y datos persistidos en el navegador (localStorage), lista
para conectarse a un backend real más adelante.

---

## Stack

- **React 19 + Vite** — SPA rápida, sin frameworks pesados innecesarios para la V1.
- **React Router** — navegación entre secciones.
- **Tailwind CSS** — sistema visual (colores, tarjetas, espaciado) inspirado en la referencia.
- **localStorage** como base de datos de la V1 (capa `src/lib/db.js`), fácil de reemplazar
  por una API/backend real sin tocar los componentes.
- **Service Worker propio** (`public/sw.js`) + `manifest.webmanifest` → instalable y con
  caché básica offline.

No se usa backend, autenticación ni pagos en esta etapa (a propósito, ver "Próximos pasos").

---

## Arranque rápido

```bash
npm install
npm run dev       # http://localhost:5173
```

```bash
npm run build     # genera /dist, listo para hospedar en cualquier servidor estático
npm run preview   # sirve /dist localmente para probar el build de producción
```

Al abrir la app por primera vez se cargan automáticamente **20 recetas de demostración**
en español (Dulces, Pasteles, Postres, Salados, Panes, Bebidas y Recetas para vender).
Todo lo que el usuario haga después (favoritos, colecciones, lista de compras, recetas
creadas/editadas desde el panel admin) se guarda en el navegador.

---

## Estructura del proyecto

```
src/
├── data/
│   ├── recipes.js        20 recetas semilla (nombre, ingredientes, pasos, costos…)
│   └── categories.js     Categorías fijas de la V1
├── lib/
│   ├── db.js             Capa de persistencia (localStorage) — CRUD de recetas,
│   │                     favoritos, colecciones y lista de compras
│   ├── StoreContext.jsx  Estado global de React sobre db.js
│   ├── calc.js           Cálculos de costo, precio de venta, ganancia y escalado
│   │                     de ingredientes según rendimiento
│   └── nav.js            Configuración del menú lateral
├── components/           Sidebar, Topbar, tarjetas de receta, modales, íconos…
└── pages/
    ├── Home.jsx, Recipes.jsx, RecipeDetail.jsx, Categories.jsx, Search.jsx
    ├── Favorites.jsx, Collections.jsx, CollectionDetail.jsx, ShoppingList.jsx
    ├── IncomeCenter.jsx        Central de Rendimiento (sugerencias por presupuesto)
    ├── SellRecipes.jsx         Recetas para vender
    ├── News.jsx                Novedades
    ├── calculators/            Calculadora de Costos y de Precio de Venta
    └── admin/                  Panel administrativo (dashboard + CRUD de recetas)
```

---

## Funcionalidades incluidas (V1)

- Página de inicio siguiendo la referencia visual.
- Menú lateral responsivo (drawer en celular, fijo en escritorio).
- Catálogo de recetas con filtros por categoría y dificultad.
- Buscador por nombre, descripción o ingrediente.
- Ficha de receta con pestañas (ingredientes, preparación, consejos, conservación),
  **ajuste de rendimiento en vivo** (recalcula cantidades y costos) y resumen de
  costos/precio/ganancia.
- Favoritos y Colecciones (crear, agregar/quitar recetas, eliminar).
- Lista de compras (manual o agregada desde cualquier receta).
- Calculadora de Costos y Calculadora de Precio de Venta (independientes, con opción
  de partir de una receta existente).
- Central de Rendimiento: sugiere recetas según presupuesto, categoría y canal de venta.
- Recetas para Vender y Novedades.
- Panel administrativo: dashboard con métricas, alta/edición/eliminación de recetas,
  publicar/despublicar, marcar como novedad, asignar categoría, y vista de categorías.

## Preparado para el futuro (sin implementarse aún, a propósito)

- **Asistente IA**: ítem de menú y pantalla ya existen (`/asistente-ia`); no hay
  integración de API ni claves cargadas.
- **Hotmart / suscripciones**: pantalla `Mi Plan` (`/mi-plan`) lista como punto de
  entrada; no hay autenticación ni control de acceso todavía.
- **Backend real**: toda la lectura/escritura pasa por `src/lib/db.js`, así que
  cambiar de localStorage a una API sólo implica reescribir ese archivo.

---

## Cómo agregar recetas nuevas

Dos formas, sin tocar código:

1. **Panel administrativo** → `/admin/recetas/nueva`: completa el formulario
   (nombre, categoría, ingredientes, pasos, costos, imagen) y guardá.
2. **Datos semilla**: para ampliar el catálogo de fábrica, sumá objetos al arreglo
   `RECETAS_SEED` en `src/data/recipes.js` siguiendo la misma estructura.

---

## Despliegue

El proyecto es una SPA estática: `npm run build` genera `/dist`, que puede
subirse directamente a Vercel, Netlify, GitHub Pages o cualquier hosting estático.
No requiere variables de entorno ni configuración de servidor.
