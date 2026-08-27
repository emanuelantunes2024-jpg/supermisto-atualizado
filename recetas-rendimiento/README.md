# Recetas & Rendimiento

**Leuname Software** — PWA de recetas, costos y ganancias para quienes cocinan y venden.

Aplicación 100% en español, responsiva (celular y computadora), instalable como PWA, con
panel administrativo real (login propio, protegido en el servidor) y contenido
(recetas/categorías) persistido en Redis — lo que el admin publica lo ve cualquier
visitante, no solo su propio navegador.

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
- Panel administrativo (`/admin`, login propio en `/admin/entrar`): dashboard con
  métricas, alta/edición/eliminación de recetas, publicar/despublicar, marcar como
  novedad, y alta/edición/eliminación de categorías. Todo lo que se guarda ahí queda
  persistido en el servidor (Redis) y lo ve cualquier visitante del sitio — no es solo
  local al navegador del admin.

## Panel administrativo — seguridad y configuración

El panel es una zona separada del resto de la app, con su propio login por
contraseña:

- **`/admin/entrar`** — pantalla de login exclusiva del panel (email + contraseña).
  No aparece ningún link hacia ella en el menú público.
- **`/admin`** y todas sus subrutas están protegidas por `RequireAdmin`: quien no
  tenga una sesión de administrador válida es redirigido automáticamente a
  `/admin/entrar`.
- La validación real ocurre **en el servidor**, en cada llamada a `/api/admin/*`
  (crear/editar/eliminar receta o categoría) — no alcanza con "engañar" al frontend,
  porque la API vuelve a chequear la cookie de sesión firmada.
- La contraseña nunca está en el código ni en texto plano: se guarda como hash
  (scrypt + salt) en la variable de entorno `ADMIN_PASSWORD_HASH`.

### Variables de entorno necesarias (Vercel → Settings → Environment Variables)

| Variable | Para qué sirve |
|---|---|
| `SESSION_SECRET` | Firma las cookies de sesión (cualquier texto largo aleatorio). |
| `ADMIN_EMAILS` | Emails autorizados a intentar loguearse como admin (separados por coma). |
| `ADMIN_PASSWORD_HASH` | Hash de la contraseña del panel. Generalo con `node scripts/gerar-senha-admin.mjs`. |
| `KV_REST_API_URL` / `KV_REST_API_TOKEN` | Las agrega solo Vercel al conectar **Storage → Marketplace → Redis**. Sin esto, el panel no puede guardar cambios (el sitio público sigue funcionando con el catálogo semilla). |

### Cambiar el email/contraseña del administrador (sin tocar Vercel)

Desde el propio panel: **`/admin/configuracion`** → "Cambiar email y/o
contraseña". Pide la contraseña actual para confirmar, y:

- transforma la contraseña nueva en hash (scrypt + salt) en el servidor —
  nunca se guarda en texto plano, ni siquiera un instante;
- guarda el email/hash nuevos en Redis (el mismo almacenamiento persistente
  que ya usa el resto del panel) — sobrevive redeploys, no depende del
  navegador ni de `localStorage`;
- invalida automáticamente cualquier sesión de admin abierta con la
  credencial anterior (la propia incluida): hay que volver a entrar con el
  email y la contraseña nuevos.

La credencial de `ADMIN_EMAILS` + `ADMIN_PASSWORD_HASH` (variables de Vercel)
sigue funcionando como arranque inicial; en cuanto se guarda una credencial
nueva desde `/admin/configuracion`, esa pasa a ser la única válida para
entrar al panel.

### Generar la contraseña inicial (antes del primer login)

```bash
node scripts/gerar-senha-admin.mjs
```

Copiá el valor `ADMIN_PASSWORD_HASH` que imprime y pegalo en Vercel. Guardá la
contraseña (la que también imprime) en un lugar seguro — es la única vez que se
muestra en texto plano. Después del primer login podés cambiarla desde el
panel, sin volver a tocar Vercel.

## Suscripción con Hotmart (ya implementado)

Toda la app (y el panel admin) está detrás de un login por email en `/entrar`.
El flujo real, de punta a punta:

1. Hotmart llama a `POST /api/hotmart-webhook` en cada compra/cancelación/reembolso.
2. Ese webhook guarda en Redis si el email tiene acceso activo o no.
3. `/api/session/login` (email) solo deja pasar si Redis dice que está activo,
   y emite una cookie firmada (HMAC, sin librerías externas).
4. `/api/session/me` **revalida contra Redis en cada carga** — si cancelás una
   suscripción en Hotmart, el acceso se corta al instante, no espera a que la
   cookie venza.

Probado con 11 pruebas automatizadas que simulan el ciclo completo (compra →
login → acceso → reembolso → pérdida de acceso) sin depender de Hotmart ni
Vercel en vivo.

### Puesta en marcha (3 pasos, todos en el dashboard de Vercel/Hotmart)

1. **Vercel → Storage → Marketplace → Redis** (plan Free) → conectar a este
   proyecto. Inyecta `KV_REST_API_URL` / `KV_REST_API_TOKEN` solo.
2. **Vercel → Settings → Environment Variables**: agregar `SESSION_SECRET`
   (cualquier texto largo aleatorio) y `ADMIN_EMAILS` (tu email, para entrar
   sin pagar). Ver `.env.example`.
3. **Hotmart → tu producto → Webhook**: URL `https://TU-DOMINIO/api/hotmart-webhook`,
   copiar el "Hottok" a la variable `HOTMART_HOTTOK` en Vercel.

Con eso, quien compre en Hotmart puede entrar con su email; quien cancela o
pide reembolso pierde el acceso en la siguiente carga de página.

**Nota:** las funciones `/api/*` solo corren en Vercel (no en `npm run dev`
local), porque necesitan el runtime serverless. Para tocar el diseño en local
alcanza con `npm run dev`; para probar el login hace falta el deploy.

### Ficha de cliente (qué guarda cada suscriptor)

Cada compra/suscripción que Hotmart notifica queda guardada en Redis con esta
forma (clave `hotmart:acceso:<email>`), visible en el panel en **Clientes**
(`/admin/usuarios`, solo lectura):

| Campo | De dónde sale |
|---|---|
| `email` | `data.buyer.email` |
| `status` | `activo` / `cancelado` / `expirado`, según el evento recibido |
| `active` | booleano — es lo que usa el gate de acceso (`/api/session/*`) |
| `plan` | `data.subscription.plan.name`, o si no hay, `data.product.name` |
| `hotmartTransactionId` | `data.purchase.transaction` |
| `hotmartSubscriberCode` | `data.subscription.subscriber.code` (si el producto es recurrente) |
| `fechaInicio` | `data.purchase.approved_date` |
| `fechaRenovacion` | `data.subscription.date_next_charge`, si Hotmart lo manda |
| `evento` | el evento crudo de Hotmart que generó la última actualización |
| `actualizadoEn` | cuándo se guardó este registro |

`plan`, `hotmartSubscriberCode` y `fechaRenovacion` dependen de qué manda
Hotmart en cada tipo de producto/evento — se leen de forma defensiva
(`?.`), así que si faltan quedan en `null` sin romper nada. Conviene
revisarlos con un evento real una vez conectada la cuenta de Hotmart.

**Eventos oficiales que la app ya reconoce** (no hay que agregar nada, solo
configurar el webhook en Hotmart):

- Activan (`status: 'activo'`): `PURCHASE_APPROVED`, `PURCHASE_COMPLETE`, `SUBSCRIPTION_REACTIVATED`.
- Marcan expirado: `PURCHASE_EXPIRED`.
- Marcan cancelado: `PURCHASE_CANCELED`, `PURCHASE_REFUNDED`, `PURCHASE_CHARGEBACK`, `PURCHASE_PROTEST`, `SUBSCRIPTION_CANCELLATION`.

Si Hotmart manda otro evento no listado acá (por ejemplo `PURCHASE_BILLET_PRINTED`),
la app responde 200 (para que Hotmart no reintente) pero no cambia el acceso de nadie.

## Preparado para el futuro (sin implementarse aún, a propósito)

- **Asistente IA**: ítem de menú y pantalla ya existen (`/asistente-ia`); no hay
  integración de API ni claves cargadas.

## Persistencia de datos

- **Recetas y categorías** (contenido editable desde `/admin`): persisten en Redis
  del lado del servidor (`api/_lib/contentStore.js`), vía las rutas `/api/content/*`
  (lectura pública) y `/api/admin/*` (escritura, protegida). Así lo que publica el
  admin lo ve cualquier visitante, no solo su propio navegador.
- **Favoritos, colecciones y lista de compras**: siguen siendo datos propios de
  cada dispositivo, en `localStorage` (`src/lib/db.js`) — tiene sentido que sean
  así, nadie más los necesita ver.

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

### Vercel — proyecto independiente (importante)

Este repositorio también contiene el sitio principal de **Leuname Software**
(Next.js, en la raíz). Son dos aplicaciones distintas que **no comparten
proyecto de Vercel**. Para publicar Recetas & Rendimiento con su propia URL,
sin tocar el proyecto del sitio principal:

1. En Vercel → **Add New → Project**.
2. Importá este mismo repositorio (`leuname-software`) **de nuevo**, como un
   proyecto nuevo (no reutilices el proyecto del sitio principal).
3. En **Root Directory**, elegí `recetas-rendimiento`.
4. Framework Preset: **Vite** (se detecta solo gracias a `vercel.json`).
   Build Command y Output Directory ya quedan definidos en ese archivo.
5. Deploy.

El archivo `recetas-rendimiento/vercel.json` ya trae el `buildCommand`, el
`outputDirectory` y el rewrite catch-all necesario para que las rutas de
React Router (`/recetas/algo`, `/admin`, etc.) funcionen al refrescar o
entrar por link directo.

El proyecto de Vercel del sitio principal sigue apuntando a la raíz del
repo (`/`) y no necesita ningún cambio: seguirá compilando y sirviendo
únicamente el sitio de Leuname Software, igual que antes.
