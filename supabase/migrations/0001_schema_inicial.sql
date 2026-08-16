-- ============================================================
-- Leuname Software — esquema inicial
-- Ejecutar en el SQL Editor de Supabase (o con `supabase db push`).
-- ============================================================

create extension if not exists "pgcrypto";

-- ---------- tipos ----------
do $$ begin
  create type template_status as enum ('draft', 'published', 'archived');
exception when duplicate_object then null; end $$;

do $$ begin
  create type order_status as enum ('pending', 'paid', 'refunded', 'failed');
exception when duplicate_object then null; end $$;

do $$ begin
  create type customer_role as enum ('customer', 'admin');
exception when duplicate_object then null; end $$;

-- ---------- categories ----------
create table if not exists public.categories (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text not null unique,
  icon        text not null default '🎨',
  created_at  timestamptz not null default now()
);

-- ---------- templates ----------
create table if not exists public.templates (
  id                uuid primary key default gen_random_uuid(),
  category_id       uuid not null references public.categories(id) on delete restrict,
  title             text not null,
  slug              text not null unique,
  short_description text not null default '',
  full_description  text not null default '',
  price_cents       integer not null check (price_cents > 0),
  preview_url       text,
  thumbnail_url     text,
  features          jsonb not null default '[]'::jsonb,
  -- Ruta del .zip dentro del bucket privado `template-files`.
  file_url          text,
  status            template_status not null default 'draft',
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index if not exists templates_status_idx   on public.templates(status);
create index if not exists templates_category_idx on public.templates(category_id);

-- ---------- customers ----------
-- Espejo de auth.users con los datos de facturación del cliente.
create table if not exists public.customers (
  id         uuid primary key references auth.users(id) on delete cascade,
  full_name  text,
  email      text not null,
  phone      text,
  country    text,
  role       customer_role not null default 'customer',
  created_at timestamptz not null default now()
);

-- ---------- orders ----------
create table if not exists public.orders (
  id                          uuid primary key default gen_random_uuid(),
  customer_id                 uuid references public.customers(id) on delete set null,
  template_id                 uuid not null references public.templates(id) on delete restrict,
  stripe_payment_intent_id    text,
  stripe_checkout_session_id  text,
  amount_cents                integer not null check (amount_cents >= 0),
  currency                    text not null default 'eur',
  status                      order_status not null default 'pending',
  -- Datos del comprador: se guardan aunque compre sin cuenta.
  buyer_email                 text not null,
  buyer_name                  text,
  buyer_phone                 text,
  buyer_country               text,
  -- Token del enlace de descarga que se envía por email.
  download_token              uuid not null default gen_random_uuid() unique,
  paid_at                     timestamptz,
  created_at                  timestamptz not null default now()
);

create index if not exists orders_customer_idx on public.orders(customer_id);
create index if not exists orders_status_idx   on public.orders(status);
create index if not exists orders_email_idx    on public.orders(lower(buyer_email));
create unique index if not exists orders_session_idx
  on public.orders(stripe_checkout_session_id)
  where stripe_checkout_session_id is not null;

-- ---------- downloads ----------
create table if not exists public.downloads (
  id            uuid primary key default gen_random_uuid(),
  order_id      uuid not null references public.orders(id) on delete cascade,
  downloaded_at timestamptz not null default now(),
  ip_address    text
);

create index if not exists downloads_order_idx on public.downloads(order_id);

-- ============================================================
-- Alta automática de cliente al registrarse en Supabase Auth
-- ============================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.customers (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Enlaza los pedidos hechos sin cuenta cuando el cliente se registra
-- después con el mismo email.
create or replace function public.link_orders_to_new_customer()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.orders
     set customer_id = new.id
   where customer_id is null
     and lower(buyer_email) = lower(new.email);
  return new;
end;
$$;

drop trigger if exists on_customer_created on public.customers;
create trigger on_customer_created
  after insert on public.customers
  for each row execute function public.link_orders_to_new_customer();

-- `updated_at` automático en templates
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists templates_touch_updated_at on public.templates;
create trigger templates_touch_updated_at
  before update on public.templates
  for each row execute function public.touch_updated_at();

-- ============================================================
-- Row Level Security
-- ============================================================
alter table public.categories enable row level security;
alter table public.templates  enable row level security;
alter table public.customers  enable row level security;
alter table public.orders     enable row level security;
alter table public.downloads  enable row level security;

-- Helper: ¿el usuario actual es administrador?
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.customers
     where id = auth.uid() and role = 'admin'
  );
$$;

-- --- categories: lectura pública, escritura solo admin ---
drop policy if exists "categorias visibles para todos" on public.categories;
create policy "categorias visibles para todos"
  on public.categories for select using (true);

drop policy if exists "categorias gestionadas por admin" on public.categories;
create policy "categorias gestionadas por admin"
  on public.categories for all
  using (public.is_admin()) with check (public.is_admin());

-- --- templates: solo las publicadas son públicas ---
drop policy if exists "plantillas publicadas visibles" on public.templates;
create policy "plantillas publicadas visibles"
  on public.templates for select
  using (status = 'published' or public.is_admin());

drop policy if exists "plantillas gestionadas por admin" on public.templates;
create policy "plantillas gestionadas por admin"
  on public.templates for all
  using (public.is_admin()) with check (public.is_admin());

-- --- customers: cada uno ve y edita su ficha ---
drop policy if exists "cliente ve su ficha" on public.customers;
create policy "cliente ve su ficha"
  on public.customers for select
  using (auth.uid() = id or public.is_admin());

drop policy if exists "cliente edita su ficha" on public.customers;
create policy "cliente edita su ficha"
  on public.customers for update
  using (auth.uid() = id) with check (auth.uid() = id);

-- --- orders: cada cliente ve solo sus pedidos ---
-- La inserción y el paso a `paid` los hace el servidor con service_role,
-- que salta RLS: por eso no hay policy de insert para clientes.
drop policy if exists "cliente ve sus pedidos" on public.orders;
create policy "cliente ve sus pedidos"
  on public.orders for select
  using (auth.uid() = customer_id or public.is_admin());

-- --- downloads: solo admin puede consultarlas ---
drop policy if exists "descargas visibles para admin" on public.downloads;
create policy "descargas visibles para admin"
  on public.downloads for select using (public.is_admin());

-- ============================================================
-- Storage
-- ============================================================
-- Bucket privado con los .zip: solo accesible mediante URL firmada
-- generada por el servidor tras confirmar el pago.
insert into storage.buckets (id, name, public)
values ('template-files', 'template-files', false)
on conflict (id) do nothing;

-- Bucket público de miniaturas y capturas.
insert into storage.buckets (id, name, public)
values ('template-assets', 'template-assets', true)
on conflict (id) do nothing;

drop policy if exists "miniaturas visibles para todos" on storage.objects;
create policy "miniaturas visibles para todos"
  on storage.objects for select
  using (bucket_id = 'template-assets');

drop policy if exists "admin gestiona archivos de plantillas" on storage.objects;
create policy "admin gestiona archivos de plantillas"
  on storage.objects for all
  using (bucket_id in ('template-files', 'template-assets') and public.is_admin())
  with check (bucket_id in ('template-files', 'template-assets') and public.is_admin());
