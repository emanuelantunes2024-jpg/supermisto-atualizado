# Sabores de España

**Leuname Software** — App de recetas (no un PDF): el cliente compra en Hotmart, entra con
su email desde el celular o la computadora, y accede a las **207 recetas españolas** en
tiempo real, con favoritos y temporizador de cocina en cada ficha.

Primer título de la colección "Sabores del Mundo" — pensado para poder duplicarse por
país (México, Argentina, Italia…) cambiando solo el contenido (`src/data/recipes.js`),
la portada y el producto de Hotmart.

**Hosting: Cloudflare Pages.** Plan gratuito, sin tarjeta, **con uso comercial permitido**
(a diferencia del plan gratis de Vercel, que solo es para proyectos no comerciales) y sin
límite de transferencia en el hosting estático. Ver "Puesta en marcha" más abajo.

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
- **PWA instalable** ("el instalador"): en el celular, el botón compartir → "Agregar a
  pantalla de inicio" deja un ícono como el de cualquier app de la tienda — sin pasar por
  ninguna tienda de aplicaciones. En la compu, Chrome/Edge muestran un botón "Instalar" en
  la barra de direcciones. Funciona offline lo último que se visitó.
- **Acceso por compra en Hotmart**: login solo con email, gate real en el servidor
  (revalida en cada carga — si se cancela una compra, el acceso se corta al instante, no
  hace falta que el cliente reinstale nada).
- **Panel `/admin`**: editar texto y foto de cualquier receta, publicar/ocultar, sin tocar
  código. Los cambios quedan guardados y se ven al instante para todos.

**Nota sobre las fotos**: el catálogo sale con ilustraciones por categoría (sin fotos
reales todavía). Se van reemplazando receta por receta desde `/admin` → pegando la URL
de la foto ya subida a algún hosting — ver "Fotos de las recetas" más abajo.

---

## Arranque rápido (local)

```bash
npm install
npm run dev       # http://localhost:5173
```

Sin ninguna clave configurada, el catálogo de las 207 recetas ya funciona completo. Para
probar también el login/admin/webhook en local (sin necesidad de cuenta en Cloudflare):

```bash
cp .dev.vars.example .dev.vars     # completar con datos de prueba
npm run pages:dev                  # http://localhost:8788, con /api/* funcionando de verdad
```

---

## Puesta en marcha para vender (Cloudflare Pages + Hotmart)

Gratis, sin plan pago, sin límite de transferencia en el sitio, uso comercial permitido
desde el primer día.

### 1. Crear la cuenta y conectar el repositorio

1. Cuenta gratis en [dash.cloudflare.com](https://dash.cloudflare.com) (solo pide email).
2. **Workers & Pages → Create → Pages → Connect to Git** → elegir el repositorio
   `leuname-software`.
3. **Root directory**: `sabores-espana`.
4. Build settings (los detecta solo por `wrangler.toml`, pero por las dudas):
   - Build command: `npm run build`
   - Build output directory: `dist`
5. Deploy. A los pocos minutos ya hay una URL tipo `sabores-espana.pages.dev` funcionando
   (en "modo abierto": ver paso 2 antes de vender de verdad).

Desde acá en adelante, cada `git push` a esta rama vuelve a desplegar solo — no hay que
tocar nada más.

### 2. KV (para el login y el panel admin)

El namespace de KV es lo que reemplaza a una base de datos — nativo de Cloudflare, sin
depender de ningún servicio externo.

1. **Workers & Pages → KV** → **Create namespace** → nombre `sabores-espana` (o el que
   quieras).
2. Volver al proyecto → **Settings → Functions → KV namespace bindings → Add binding**:
   - Variable name: **`SABORES_KV`** (exacto, así lo espera el código)
   - KV namespace: el que acabás de crear
3. Guardar y volver a desplegar (Deployments → los tres puntos → Retry deployment).

Sin este paso, el sitio funciona en "modo abierto": cualquier email entra sin haber
comprado. **No lanzar sin conectar esto.**

### 3. Variables de entorno

**Tu proyecto → Settings → Environment Variables** (ver `.env.example`), en producción:

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

Copiá el `ADMIN_PASSWORD_HASH` que imprime a Cloudflare. Guardá la contraseña en texto
plano en un lugar seguro — es la única vez que se muestra.

### 4. Producto y webhook en Hotmart

1. Crear el producto "Sabores de España" en Hotmart, con el precio y la portada
   (`public/images/portada-libro.jpg` ya está en el proyecto).
2. En la configuración del producto, **Área de miembros: usar un link externo** → pegar
   la URL de Cloudflare (o tu dominio propio, ver paso 5). Así Hotmart le manda ese link
   al comprador por email automáticamente, apenas se aprueba el pago — no hace falta
   construir nada aparte para "enviar el acceso por email".
3. Copiar el **link de venta** del producto y pegarlo en `src/lib/config.js` →
   `hotmartCheckoutUrl`. Hacer commit y push (vuelve a desplegar solo).
4. **Hotmart → tu producto → Herramientas → Webhook**: URL
   `https://TU-DOMINIO/api/hotmart-webhook`, copiar el "Hottok" a la variable
   `HOTMART_HOTTOK` en Cloudflare.
5. Elegir los eventos: `PURCHASE_APPROVED`, `PURCHASE_COMPLETE`, `PURCHASE_CANCELED`,
   `PURCHASE_REFUNDED`, `PURCHASE_CHARGEBACK`, `PURCHASE_EXPIRED` (y los de suscripción,
   si el producto es recurrente).

Con esto, quien compre en Hotmart puede entrar en `/entrar` con el mismo email de la
compra, cuantas veces quiera, para siempre — mientras la compra siga activa. Quien
cancela o pide reembolso pierde el acceso en la siguiente carga de página, no hace falta
que reinstale ni desinstale nada.

### 5. Dominio propio (opcional, también gratis)

Si ya tenés un dominio (en Cloudflare o en cualquier otro lugar): **tu proyecto →
Custom domains → Set up a custom domain** → por ejemplo `espana.tudominio.com`. Cuando
repitas esto para otros países, cada uno puede tener su propio subdominio
(`bolivia.tudominio.com`, `ecuador.tudominio.com`…) apuntando a su propio proyecto.

### 6. Panel admin

Entrar en `https://TU-DOMINIO/admin/entrar` con el email de `ADMIN_EMAILS` y la
contraseña generada. Desde ahí:

- **Dashboard**: cuenta de recetas por categoría.
- **Recetas**: buscar, filtrar por categoría, editar cualquier receta (texto, foto,
  publicar/ocultar) o cargar una receta nueva.

---

## Sobre compartir el acceso

El login es por email verificado contra la compra en Hotmart (no por contraseña propia
del cliente), y la sesión queda guardada en el navegador donde instaló la PWA. Esto evita
que cualquiera con el link entre sin haber comprado — necesita usar un email con una
compra activa. Lo que **no** impide del todo es que el propio comprador le diga a otra
persona "usá mi email" para entrar también.

Si en el futuro esto se vuelve un problema real, la forma correcta de cerrarlo del todo es
agregar un **código de un solo uso enviado por email** en el login (además de escribir el
email, se manda un código de 6 dígitos a esa casilla y hay que escribirlo) — así, aunque
alguien sepa el email del comprador, no puede entrar sin acceso a esa bandeja de entrada.
Es una mejora chica de agregar más adelante si hace falta; no está incluida ahora para no
sumar una dependencia (un servicio de envío de emails) que hoy no es necesaria.

---

## Fotos de las recetas

El catálogo sale con una ilustración de color por categoría (sin fotos reales). Para
poner las fotos reales:

1. Subir cada foto a un hosting de imágenes (Cloudflare Images, tu propio servidor,
   cualquiera que te dé una URL directa a la imagen).
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

functions/api/                Cloudflare Pages Functions (mismo /api/* que consume el frontend)
├── hotmart-webhook.js        Activa/cancela acceso según eventos de Hotmart
├── session/                  login.js, logout.js, me.js (sesión de miembro)
├── admin/                    login.js, logout.js, status.js, recetas.js (CRUD)
├── content/recetas.js        Lectura pública de las ediciones del admin
└── _lib/                     kv.js, cookie.js, adminAuth.js, contentStore.js, config.js, http.js

public/
├── images/portada-libro.jpg  Capa del producto
├── icons/                    Íconos de la PWA
├── manifest.webmanifest      Config de instalación como app
└── sw.js                     Service worker (cache básica offline)
```

---

## Scripts

```bash
npm run dev         # desarrollo del frontend (solo Vite, sin /api)
npm run pages:dev    # desarrollo completo (frontend + /api) simulando Cloudflare, 100% local
npm run build        # build de producción → /dist
npm run pages:deploy  # build + deploy manual a Cloudflare (alternativa a conectar Git)
npm run lint          # oxlint
node scripts/generar-clave-admin.mjs   # genera la contraseña inicial del panel admin
```

---

## Antes de lanzar

- [ ] Conectar el namespace de KV en Cloudflare (paso 2) — sin esto, cualquiera entra sin pagar.
- [ ] Configurar `SESSION_SECRET`, `HOTMART_HOTTOK`, `ADMIN_EMAILS`, `ADMIN_PASSWORD_HASH`.
- [ ] Pegar el link real de venta de Hotmart en `src/lib/config.js` (`hotmartCheckoutUrl`).
- [ ] Configurar el webhook de Hotmart apuntando a `/api/hotmart-webhook`.
- [ ] Configurar el producto en Hotmart con "Área de miembros: link externo" apuntando a tu URL.
- [ ] Reemplazar `soporteEmail` en `src/lib/config.js` por tu email real de soporte.
- [ ] Cargar las fotos reales de las recetas desde `/admin` (ver sección de arriba).
- [ ] Probar el flujo completo: comprar en modo test de Hotmart → entrar en `/entrar` con
      ese email → ver que se accede a las recetas → cancelar la compra de prueba → ver
      que el acceso se corta.
- [ ] Revisar `public/manifest.webmanifest` (nombre, colores) si se quiere ajustar la
      identidad antes de publicar.
