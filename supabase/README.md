# Base de datos — Leuname Software

## Orden de ejecución

En el **SQL Editor** de Supabase:

1. `migrations/0001_schema_inicial.sql` — tablas, tipos, triggers, RLS y buckets.
2. `seed.sql` — 8 categorías y 9 plantillas de ejemplo (idempotente: se puede repetir).

Con la CLI de Supabase:

```bash
supabase db push
psql "$DATABASE_URL" -f supabase/seed.sql
```

---

## Tablas

| Tabla | Para qué sirve |
|---|---|
| `categories` | Rubros del catálogo (barberías, cafeterías…). Lectura pública. |
| `templates` | Plantillas a la venta. Solo las de estado `published` son públicas. |
| `customers` | Espejo de `auth.users` con datos de facturación y `role`. |
| `orders` | Un registro por compra, con su estado y su `download_token`. |
| `downloads` | Log de descargas (fecha + IP) para soporte y control de abuso. |

### Estados

- `templates.status`: `draft` · `published` · `archived`
- `orders.status`: `pending` · `paid` · `refunded` · `failed`

Un pedido nace como `pending` al crear la sesión de Stripe y solo pasa a `paid` desde el webhook, tras verificar la firma.

---

## Automatismos

- **`on_auth_user_created`** — al registrarse un usuario en Supabase Auth se crea su ficha en `customers`.
- **`on_customer_created`** — enlaza los pedidos hechos sin cuenta con el cliente que después se registra con el mismo email.
- **`templates_touch_updated_at`** — mantiene `updated_at` al día.

---

## Row Level Security

RLS está activo en las cinco tablas.

| Tabla | Público | Cliente autenticado | Admin |
|---|---|---|---|
| `categories` | lectura | lectura | todo |
| `templates` | solo `published` | solo `published` | todo |
| `customers` | — | su propia ficha | todo |
| `orders` | — | solo sus pedidos | todo |
| `downloads` | — | — | lectura |

`public.is_admin()` resuelve el rol consultando `customers.role`. Además, `ADMIN_EMAILS` da acceso a la interfaz `/admin` sin tocar la base de datos.

La inserción de pedidos y el paso a `paid` los hace el servidor con la clave `service_role`, que salta RLS. Por eso **no existe** ninguna policy que permita a un cliente insertar o modificar pedidos: aunque alguien obtuviese la clave anónima, no podría marcarse un pedido como pagado.

---

## Storage

| Bucket | Visibilidad | Contenido |
|---|---|---|
| `template-files` | **privado** | Los `.zip` de las plantillas. Solo accesibles mediante URL firmada generada por el servidor tras confirmar el pago. |
| `template-assets` | público | Miniaturas y capturas del catálogo. |

En `templates.file_url` se guarda la **ruta dentro del bucket** (ej. `barberia-premium/1730000000.zip`), no una URL pública.

---

## Crear el primer administrador

```sql
update public.customers
   set role = 'admin'
 where email = 'tu-email@ejemplo.com';
```

(El usuario tiene que haberse registrado antes en la web.)
