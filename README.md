# Leuname Software

Plataforma de venta de plantillas de sitios web para el mercado europeo. Idioma principal: **español**. Precios en **euros**, pago único.

> Construido a partir del prototipo visual de marca (navy profundo `#070c18` + dorado `#e7a63c`, tipografías Sora + Inter).

---

## Stack

| Capa | Tecnología |
|---|---|
| Frontend | Next.js 15 (App Router) + TypeScript + Tailwind CSS |
| Base de datos / Auth / Storage | Supabase (PostgreSQL) |
| Pagos | Stripe Checkout (modo `payment`, pago único) |
| Email transaccional | Resend |
| Deploy | Vercel |

---

## Arranque rápido

```bash
npm install
cp .env.example .env.local     # rellenar claves (ver abajo)
npm run dev                    # http://localhost:3000
```

**El sitio arranca sin ninguna clave.** Si Supabase no está configurado, la vitrine funciona con el catálogo de ejemplo de `src/lib/seed-data.ts`, de forma que puedes revisar el diseño antes de crear las cuentas externas. El checkout, el área de cliente y el panel avisan de lo que falta en vez de romperse.

---

## Estructura

```
src/
├── app/
│   ├── page.tsx                     Portada (vitrine)
│   ├── plantillas/                  Catálogo + filtro por categoría
│   │   └── [slug]/                  Detalle con demo embebida (iframe)
│   ├── checkout/[slug]/             Datos del comprador → Stripe Checkout
│   ├── checkout/exito/              Retorno de Stripe + botón de descarga
│   ├── mi-cuenta/                   "Mis compras" con descargas
│   ├── entrar/ · registro/          Auth (email/contraseña + Google)
│   ├── auth/callback · auth/salir   OAuth / confirmación / logout
│   ├── admin/                       Panel protegido (dashboard, CRUD, pedidos)
│   ├── legal/                       Términos, privacidad, reembolsos
│   ├── contacto/                    Contacto + FAQ
│   ├── api/checkout/                Crea pedido `pending` + sesión de Stripe
│   ├── api/webhooks/stripe/         Confirma el pago → libera descarga + email
│   ├── api/descargar/[token]/       Enlace firmado temporal (solo si `paid`)
│   ├── sitemap.ts · robots.ts       SEO
│   └── globals.css                  Sistema visual (tokens de marca)
├── components/                      UI por dominio (site, home, templates, …)
├── lib/
│   ├── queries.ts                   Lecturas + fallback al catálogo de ejemplo
│   ├── supabase/{client,server,admin}.ts
│   ├── stripe.ts · email.ts · auth.ts · config.ts · format.ts
│   └── seed-data.ts                 Catálogo de ejemplo (espejo de seed.sql)
├── middleware.ts                    Refresco de sesión + rutas protegidas
supabase/
├── migrations/0001_schema_inicial.sql   Tablas, RLS, triggers, buckets
└── seed.sql                             8 categorías + 9 plantillas
public/demos/barberia/                   Demo en vivo de la plantilla de barbería
```

---

## Configuración de servicios

Todas las variables están documentadas en `.env.example`.

### 1. Supabase

1. Crea un proyecto en [supabase.com](https://supabase.com).
2. **SQL Editor** → pega y ejecuta `supabase/migrations/0001_schema_inicial.sql`.
3. **SQL Editor** → ejecuta `supabase/seed.sql` para cargar el catálogo de ejemplo.
4. **Project Settings → API** → copia a `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` *(solo servidor — nunca la expongas)*
5. **Authentication → Providers → Google**: activa el proveedor y añade como redirect
   `https://TU-DOMINIO/auth/callback` (y `http://localhost:3000/auth/callback` en local).

Detalles del esquema y de las políticas RLS: [`supabase/README.md`](supabase/README.md).

### 2. Stripe

1. Crea la cuenta en [stripe.com](https://stripe.com) y actívala para vender en la UE.
2. **Developers → API keys** → `STRIPE_SECRET_KEY` y `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`.
3. **Developers → Webhooks** → añade el endpoint `https://TU-DOMINIO/api/webhooks/stripe`
   con los eventos:
   - `checkout.session.completed`
   - `checkout.session.async_payment_succeeded`
   - `checkout.session.async_payment_failed`
   - `checkout.session.expired`
   - `charge.refunded`

   Copia la firma (`whsec_…`) a `STRIPE_WEBHOOK_SECRET`.
4. *(Opcional)* Activa **Stripe Tax** y pon `STRIPE_TAX_ENABLED=true` para que el IVA se
   calcule automáticamente según el país del comprador. Los precios se envían como
   `tax_behavior: inclusive` (IVA incluido, como exige la normativa de consumo de la UE).
5. Apple Pay y Google Pay se activan solos en Stripe Checkout una vez verificado el dominio
   en **Settings → Payments → Payment method domains**.

Para probar el webhook en local:

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

### 3. Resend

1. Crea la cuenta en [resend.com](https://resend.com) y verifica tu dominio.
2. `RESEND_API_KEY` y `RESEND_FROM` (ej: `Leuname Software <compras@tudominio.com>`).
3. *(Opcional)* `SALES_NOTIFICATION_EMAIL` para recibir copia oculta de cada venta.

Sin Resend configurado los pagos siguen funcionando: el cliente descarga desde "Mis compras" y el envío se registra como aviso en los logs.

### 4. Acceso al panel `/admin`

Dos formas, cualquiera vale:

- Añade tu email a `ADMIN_EMAILS` (separados por coma), **o**
- En Supabase, marca tu usuario como administrador:

  ```sql
  update public.customers set role = 'admin' where email = 'tu-email@ejemplo.com';
  ```

---

## Cómo funciona una compra

```
Cliente rellena sus datos en /checkout/[slug]
        ↓
POST /api/checkout  →  crea el pedido en estado `pending`
        ↓             →  crea la sesión de Stripe Checkout
Stripe cobra (tarjeta / Apple Pay / Google Pay)
        ↓
POST /api/webhooks/stripe  (firma verificada)
        ↓
  pedido → `paid`, se envía el email con el enlace
        ↓
GET /api/descargar/[token]  →  URL firmada de 10 min desde el bucket privado
```

**El archivo nunca se libera antes del pago.** El estado `paid` solo lo escribe el webhook, con la firma de Stripe verificada; la vuelta del navegador a `/checkout/exito` únicamente *lee* ese estado. El `.zip` vive en un bucket privado y se entrega mediante URL firmada de corta duración, registrando cada descarga en la tabla `downloads`.

---

## Gestión del catálogo

Desde `/admin/plantillas`:

- Crear, editar, publicar y archivar plantillas.
- Subir la miniatura (bucket público `template-assets`) y el `.zip` (bucket privado `template-files`) directamente desde el formulario.
- El campo **URL de la demo** admite una ruta interna (`/demos/mi-plantilla/index.html`, subiendo la demo a `public/demos/`) o una URL externa.

Las categorías se gestionan en la tabla `categories` de Supabase; `/admin/categorias` muestra cuántas plantillas publicadas tiene cada una.

---

## Deploy en Vercel

1. Importa el repositorio en [vercel.com](https://vercel.com).
2. Copia todas las variables de `.env.example` en **Settings → Environment Variables**.
3. Pon `NEXT_PUBLIC_SITE_URL` con tu dominio real (`https://tudominio.com`) — se usa en las URLs de retorno de Stripe, el sitemap y los enlaces del email.
4. Conecta el dominio en **Settings → Domains**.
5. Actualiza en Stripe la URL del webhook y en Supabase la URL de redirección de Google.

---

## Antes de lanzar

- [ ] Completar los datos fiscales del titular en `/legal/terminos` y `/legal/privacidad` (marcados en la propia página).
- [ ] Sustituir `siteConfig.supportEmail` en `src/lib/config.ts` por tu email real.
- [ ] Subir el `.zip` de cada plantilla publicada — sin `file_url` la descarga devuelve un error controlado.
- [ ] Probar una compra completa en modo test de Stripe (tarjeta `4242 4242 4242 4242`).
- [ ] Verificar el dominio en Stripe para habilitar Apple Pay y Google Pay.

---

## Scripts

```bash
npm run dev        # desarrollo
npm run build      # build de producción
npm run start      # servir el build
npm run typecheck  # TypeScript sin emitir
```
