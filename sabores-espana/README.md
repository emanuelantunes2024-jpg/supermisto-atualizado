# Sabores de España

**Leuname Software** — App de recetas (no un PDF): el cliente compra en Hotmart, entra con
su email desde el celular o la computadora, y accede a las **207 recetas españolas** en
tiempo real, con favoritos y temporizador de cocina en cada ficha.

Primer título de la colección "Sabores del Mundo" — pensado para poder duplicarse por
país (México, Argentina, Italia…) cambiando solo el contenido (`src/data/recipes.js`),
la portada y el producto de Hotmart.

---

## Qué incluye

- **207 recetas en español**, repartidas en 11 categorías (ver `src/lib/categories.js`):
  Arroces y Paellas, Tapas y Aperitivos, Sopas/Cremas/Cocidos, Huevos y Tortillas, Carnes,
  Pescados y Mariscos, Legumbres y Guisos, Verduras y Ensaladas, Panes y Masas Saladas,
  Postres y Dulces, Bebidas.
- Cada receta trae: ingredientes (con cantidades escalables según porciones), pasos
  numerados con casilla para ir marcando, consejos, tiempo de preparación/cocción,
  dificultad y conservación.
- **Temporizador de cocina** en cada ficha (arranca del tiempo de cocción sugerido, con
  aviso sonoro y notificación al terminar).
- **Favoritos** (❤️): un toque para guardar cualquier receta, propio de cada dispositivo.
- **PWA instalable**: el cliente puede "agregar a pantalla de inicio" y usarla como una
  app nativa, con funcionamiento básico offline.
- **Acceso por compra en Hotmart**: login solo con email, gate real en el servidor
  (revalida en cada carga — si se cancela una suscripción, el acceso se corta al instante).
- **Panel `/admin`**: editar texto y foto de cualquier receta, publicar/ocultar, sin tocar
  código. Los cambios quedan guardados en Redis y se ven al instante para todos.

**Nota sobre las fotos**: el catálogo sale con ilustraciones por categoría (sin fotos
reales todavía). Se van reemplazando receta por receta desde `/admin` → pegando la URL
de la foto ya subida a algún hosting — ver "Fotos de las recetas" más abajo.

---

## Arranque rápido (local)

```bash
npm install
npm run dev       # http://localhost:5173
```

Sin ninguna clave configurada, el catálogo de las 207 recetas ya funciona completo. Lo
único que no corre en local (`npm run dev`) son las funciones `/api/*` (login, admin,
webhook de Hotmart) — necesitan el runtime serverless de Vercel. Para probar el login
real hace falta desplegar.

---

## Puesta en marcha para vender (Vercel + Hotmart + Redis)

### 1. Desplegar en Vercel

1. Importar este repositorio en [vercel.com](https://vercel.com) → **Add New → Project**.
2. **Root Directory**: `sabores-espana` (el repo también tiene el sitio principal de
   Leuname Software en la raíz — son proyectos de Vercel independientes).
3. Framework Preset: **Vite** (se detecta solo gracias a `vercel.json`).
4. Deploy.

### 2. Redis (para el login y el panel admin)

**Vercel → tu proyecto → Storage → Marketplace → Redis** (plan Free) → conectar. Esto
agrega solo `KV_REST_API_URL` y `KV_REST_API_TOKEN` — no hay que escribir nada a mano.

Sin esto conectado, el sitio sigue funcionando pero en "modo abierto": cualquier email
entra sin haber comprado. **No lanzar sin este paso.**

### 3. Variables de entorno

**Vercel → Settings → Environment Variables** (ver `.env.example`):

| Variable | Para qué sirve |
|---|---|
| `SESSION_SECRET` | Firma las cookies de sesión. Cualquier texto largo aleatorio (`openssl rand -hex 32`). |
| `HOTMART_HOTTOK` | Token de Hotmart para validar que el webhook es real (ver paso 4). |
| `ADMIN_EMAILS` | Tu email, para entrar a `/admin` y también como bypass de compra en `/entrar` (para probar antes de conectar Hotmart). |
| `ADMIN_PASSWORD_HASH` | Hash de la contraseña del panel — generalo con el comando de abajo. |

Generar la contraseña inicial del panel:

```bash
node scripts/generar-clave-admin.mjs
```

Copiá el `ADMIN_PASSWORD_HASH` que imprime a Vercel. Guardá la contraseña en texto plano
en un lugar seguro — es la única vez que se muestra.

### 4. Producto y webhook en Hotmart

1. Crear el producto "Sabores de España" en Hotmart, con el precio y la portada
   (`public/images/portada-libro.png` ya está en el proyecto).
2. Copiar el **link de venta** del producto y pegarlo en `src/lib/config.js` →
   `hotmartCheckoutUrl`. Volver a desplegar (o hacerlo antes del primer deploy).
3. **Hotmart → tu producto → Herramientas → Webhook**: URL
   `https://TU-DOMINIO/api/hotmart-webhook`, copiar el "Hottok" a la variable
   `HOTMART_HOTTOK` en Vercel.
4. Elegir los eventos: `PURCHASE_APPROVED`, `PURCHASE_COMPLETE`, `PURCHASE_CANCELED`,
   `PURCHASE_REFUNDED`, `PURCHASE_CHARGEBACK`, `PURCHASE_EXPIRED` (y los de suscripción,
   si el producto es recurrente).

Con esto, quien compre en Hotmart puede entrar en `/entrar` con el mismo email de la
compra; quien cancela o pide reembolso pierde el acceso en la siguiente carga de página.

### 5. Panel admin

Entrar en `https://TU-DOMINIO/admin/entrar` con el email de `ADMIN_EMAILS` y la
contraseña generada. Desde ahí:

- **Dashboard**: cuenta de recetas por categoría.
- **Recetas**: buscar, filtrar por categoría, editar cualquier receta (texto, foto,
  publicar/ocultar) o cargar una receta nueva.

---

## Fotos de las recetas

El catálogo sale con una ilustración de color por categoría (sin fotos reales). Para
poner las fotos reales:

1. Subir cada foto a un hosting de imágenes (tu propio servidor, Vercel Blob, Cloudinary,
   etc. — cualquiera que te dé una URL directa a la imagen).
2. `/admin/recetas` → buscar la receta → pegar la URL en el campo **Foto de la receta**
   → Guardar.

No hace falta tocar código ni volver a desplegar: el cambio se ve al instante para todos
los miembros.

---

## Estructura del proyecto

```
src/
├── data/recipes.js          Las 207 recetas (catálogo de fábrica)
├── lib/
│   ├── categories.js        Las 11 categorías
│   ├── useRecipes.js        Combina el catálogo con las ediciones del admin
│   ├── useFavorites.js / db.js   Favoritos (localStorage)
│   ├── AuthContext.jsx      Sesión de miembro (gate Hotmart)
│   ├── AdminAuthContext.jsx Sesión de admin
│   └── config.js            Nombre del producto y link de Hotmart
├── components/
│   ├── CookingTimer.jsx     Temporizador de cocina
│   ├── RecipeCard.jsx, CategoryCard.jsx, FavoriteButton.jsx, PlaceholderImage.jsx
│   ├── MemberLayout.jsx     Header + navegación inferior (móvil)
│   └── RequireMember.jsx / RequireAdmin.jsx   Guards de ruta
└── pages/
    ├── Landing.jsx           Portada de venta (capa, categorías, CTA a Hotmart)
    ├── Login.jsx             Entrada por email
    ├── Home.jsx, Category.jsx, RecipeDetail.jsx, Search.jsx, Favorites.jsx, Profile.jsx
    └── admin/                Login, Dashboard, lista y formulario de recetas

api/
├── hotmart-webhook.js        Activa/cancela acceso según eventos de Hotmart
├── session/                  login.js, logout.js, me.js (sesión de miembro)
├── admin/                    login.js, logout.js, status.js, recetas.js (CRUD)
├── content/recetas.js        Lectura pública de las ediciones del admin
└── _lib/                     redis.js, cookie.js, adminAuth.js, contentStore.js, config.js

public/
├── images/portada-libro.png  Capa del producto
├── icons/                    Íconos de la PWA
├── manifest.webmanifest      Config de instalación como app
└── sw.js                     Service worker (cache básica offline)
```

---

## Scripts

```bash
npm run dev        # desarrollo
npm run build      # build de producción → /dist
npm run preview    # sirve el build localmente
npm run lint        # oxlint
node scripts/generar-clave-admin.mjs   # genera la contraseña inicial del panel admin
```

---

## Antes de lanzar

- [ ] Conectar Redis en Vercel (paso 2) — sin esto, cualquiera entra sin pagar.
- [ ] Configurar `SESSION_SECRET`, `HOTMART_HOTTOK`, `ADMIN_EMAILS`, `ADMIN_PASSWORD_HASH`.
- [ ] Pegar el link real de venta de Hotmart en `src/lib/config.js` (`hotmartCheckoutUrl`).
- [ ] Configurar el webhook de Hotmart apuntando a `/api/hotmart-webhook`.
- [ ] Reemplazar `soporteEmail` en `src/lib/config.js` por tu email real de soporte.
- [ ] Cargar las fotos reales de las recetas desde `/admin` (ver sección de arriba).
- [ ] Probar el flujo completo: comprar en modo test de Hotmart → entrar en `/entrar` con
      ese email → ver que se accede a las recetas.
- [ ] Revisar `public/manifest.webmanifest` (nombre, colores) si se quiere ajustar la
      identidad antes de publicar.
