-- ============================================================
-- Leuname Software — ampliación del marketplace (panel 100% editable)
-- Ejecutar después de 0001_schema_inicial.sql.
-- ============================================================

-- ---------- templates: campos nuevos ----------
alter table public.templates
  add column if not exists tags                  jsonb   not null default '[]'::jsonb,
  add column if not exists compare_at_price_cents integer,
  add column if not exists featured               boolean not null default false;

create index if not exists templates_featured_idx on public.templates(featured) where featured;

-- ---------- categories: campos nuevos ----------
alter table public.categories
  add column if not exists description text,
  add column if not exists image_url  text,
  add column if not exists sort_order integer not null default 0;

-- ---------- product_images: capturas por dispositivo ----------
do $$ begin
  create type product_image_kind as enum ('main', 'desktop', 'laptop', 'tablet', 'mobile', 'gallery');
exception when duplicate_object then null; end $$;

create table if not exists public.product_images (
  id          uuid primary key default gen_random_uuid(),
  template_id uuid not null references public.templates(id) on delete cascade,
  kind        product_image_kind not null,
  url         text not null,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now()
);

create index if not exists product_images_template_idx on public.product_images(template_id);

-- ---------- orders: preparar para carrito (varias líneas por pedido) ----------
-- `template_id` se queda para no romper pedidos ya existentes (1 plantilla),
-- pero pasa a ser opcional: los pedidos nuevos con carrito usan `order_items`.
alter table public.orders alter column template_id drop not null;
alter table public.orders
  add column if not exists subtotal_cents integer,
  add column if not exists discount_cents integer not null default 0;

create table if not exists public.order_items (
  id                uuid primary key default gen_random_uuid(),
  order_id          uuid not null references public.orders(id) on delete cascade,
  template_id       uuid not null references public.templates(id) on delete restrict,
  title_snapshot    text not null,
  unit_price_cents  integer not null check (unit_price_cents >= 0),
  quantity          integer not null default 1 check (quantity > 0),
  created_at        timestamptz not null default now()
);

create index if not exists order_items_order_idx    on public.order_items(order_id);
create index if not exists order_items_template_idx on public.order_items(template_id);

-- ---------- licenses: derecho de descarga por plantilla comprada ----------
create table if not exists public.licenses (
  id             uuid primary key default gen_random_uuid(),
  order_item_id  uuid not null references public.order_items(id) on delete cascade,
  customer_id    uuid references public.customers(id) on delete set null,
  template_id    uuid not null references public.templates(id) on delete restrict,
  license_key    text not null unique default encode(gen_random_bytes(8), 'hex'),
  created_at     timestamptz not null default now()
);

create index if not exists licenses_customer_idx on public.licenses(customer_id);
create index if not exists licenses_template_idx on public.licenses(template_id);

-- ---------- reviews: valoraciones de clientes por plantilla ----------
create table if not exists public.reviews (
  id           uuid primary key default gen_random_uuid(),
  template_id  uuid not null references public.templates(id) on delete cascade,
  customer_id  uuid references public.customers(id) on delete set null,
  rating       smallint not null check (rating between 1 and 5),
  comment      text,
  created_at   timestamptz not null default now()
);

create index if not exists reviews_template_idx on public.reviews(template_id);

-- ---------- testimonials: opiniones curadas para la portada ----------
create table if not exists public.testimonials (
  id             uuid primary key default gen_random_uuid(),
  customer_name  text not null,
  role           text,
  avatar_url     text,
  comment        text not null,
  rating         smallint not null default 5 check (rating between 1 and 5),
  sort_order     integer not null default 0,
  is_published   boolean not null default true,
  created_at     timestamptz not null default now()
);

-- ---------- site_settings: fila única con la configuración global ----------
create table if not exists public.site_settings (
  id           boolean primary key default true check (id),
  company_name text not null default 'Leuname Software',
  logo_url     text,
  favicon_url  text,
  email        text,
  phone        text,
  whatsapp     text,
  address      text,
  currency     text not null default 'EUR',
  language     text not null default 'es',
  social       jsonb not null default '{}'::jsonb,
  footer_text  text,
  updated_at   timestamptz not null default now()
);

insert into public.site_settings (id) values (true) on conflict (id) do nothing;

-- ---------- homepage_sections: contenido editable de la portada ----------
create table if not exists public.homepage_sections (
  key         text primary key,
  content     jsonb not null default '{}'::jsonb,
  updated_at  timestamptz not null default now()
);

insert into public.homepage_sections (key, content) values
  ('hero', '{
    "eyebrow": "Marketplace de plantillas",
    "title": "Los mejores templates para tu próximo proyecto",
    "subtitle": "Plantillas profesionales, modernas y 100% personalizables para impulsar tu negocio en línea.",
    "image_url": null,
    "button_text": "Explorar templates",
    "button_href": "/plantillas",
    "search_placeholder": "Buscar templates...",
    "trust_badges": ["Descarga inmediata", "Pago seguro", "Actualizaciones gratuitas", "Soporte dedicado"]
  }'::jsonb),
  ('benefits', '[
    {"icon": "sparkles", "title": "Templates Premium", "text": "Diseños profesionales listos para usar."},
    {"icon": "pencil", "title": "Fácil de Personalizar", "text": "Edita colores, textos e imágenes sin complicaciones."},
    {"icon": "devices", "title": "Compatible y Responsivo", "text": "Se ven perfectos en cualquier dispositivo."},
    {"icon": "refresh", "title": "Actualizaciones Constantes", "text": "Nuevos diseños cada semana para ti."}
  ]'::jsonb),
  ('featured_categories', '[]'::jsonb),
  ('featured_templates', '[]'::jsonb),
  ('why_us', '{
    "title": "¿Por qué elegirnos?",
    "text": "Más de 10.000 clientes confían en nosotros para llevar sus proyectos al siguiente nivel.",
    "button_text": "Conoce más sobre nosotros",
    "button_href": "/contacto",
    "stats": [
      {"value": "10K+", "label": "Clientes satisfechos"},
      {"value": "500+", "label": "Templates disponibles"},
      {"value": "5★", "label": "Calificación promedio"},
      {"value": "24/7", "label": "Soporte dedicado"}
    ]
  }'::jsonb),
  ('newsletter', '{
    "title": "Suscríbete a nuestro newsletter",
    "subtitle": "Recibe novedades, ofertas exclusivas y nuevos templates.",
    "button_text": "Suscribirme"
  }'::jsonb)
on conflict (key) do nothing;

-- ============================================================
-- Row Level Security
-- ============================================================
alter table public.product_images     enable row level security;
alter table public.order_items        enable row level security;
alter table public.licenses           enable row level security;
alter table public.reviews            enable row level security;
alter table public.testimonials       enable row level security;
alter table public.site_settings      enable row level security;
alter table public.homepage_sections  enable row level security;

-- --- product_images: visibles si la plantilla es visible; gestión admin ---
drop policy if exists "imagenes visibles si la plantilla es visible" on public.product_images;
create policy "imagenes visibles si la plantilla es visible"
  on public.product_images for select
  using (
    exists (
      select 1 from public.templates t
       where t.id = product_images.template_id
         and (t.status = 'published' or public.is_admin())
    )
  );

drop policy if exists "imagenes gestionadas por admin" on public.product_images;
create policy "imagenes gestionadas por admin"
  on public.product_images for all
  using (public.is_admin()) with check (public.is_admin());

-- --- order_items: visibles para el dueño del pedido o admin ---
drop policy if exists "cliente ve sus lineas de pedido" on public.order_items;
create policy "cliente ve sus lineas de pedido"
  on public.order_items for select
  using (
    exists (
      select 1 from public.orders o
       where o.id = order_items.order_id
         and (o.customer_id = auth.uid() or public.is_admin())
    )
  );

-- --- licenses: el cliente ve las suyas; el servidor (service_role) las crea ---
drop policy if exists "cliente ve sus licencias" on public.licenses;
create policy "cliente ve sus licencias"
  on public.licenses for select
  using (customer_id = auth.uid() or public.is_admin());

-- --- reviews: lectura pública, escritura del propio cliente autenticado ---
drop policy if exists "reseñas visibles para todos" on public.reviews;
create policy "reseñas visibles para todos"
  on public.reviews for select using (true);

drop policy if exists "cliente crea su reseña" on public.reviews;
create policy "cliente crea su reseña"
  on public.reviews for insert
  with check (auth.uid() = customer_id);

drop policy if exists "admin gestiona reseñas" on public.reviews;
create policy "admin gestiona reseñas"
  on public.reviews for all
  using (public.is_admin()) with check (public.is_admin());

-- --- testimonials: lectura pública de los publicados; gestión admin ---
drop policy if exists "testimonios publicados visibles" on public.testimonials;
create policy "testimonios publicados visibles"
  on public.testimonials for select
  using (is_published or public.is_admin());

drop policy if exists "testimonios gestionados por admin" on public.testimonials;
create policy "testimonios gestionados por admin"
  on public.testimonials for all
  using (public.is_admin()) with check (public.is_admin());

-- --- site_settings: lectura pública (para pintar el sitio); solo admin escribe ---
drop policy if exists "configuracion visible para todos" on public.site_settings;
create policy "configuracion visible para todos"
  on public.site_settings for select using (true);

drop policy if exists "configuracion gestionada por admin" on public.site_settings;
create policy "configuracion gestionada por admin"
  on public.site_settings for all
  using (public.is_admin()) with check (public.is_admin());

-- --- homepage_sections: lectura pública; solo admin escribe ---
drop policy if exists "contenido de portada visible para todos" on public.homepage_sections;
create policy "contenido de portada visible para todos"
  on public.homepage_sections for select using (true);

drop policy if exists "contenido de portada gestionado por admin" on public.homepage_sections;
create policy "contenido de portada gestionado por admin"
  on public.homepage_sections for all
  using (public.is_admin()) with check (public.is_admin());
