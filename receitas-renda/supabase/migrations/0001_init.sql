-- Central de Receitas & Renda — schema inicial
-- Convenção: toda tabela usa uuid como chave primária, timestamps em UTC,
-- e Row Level Security ativado em todas as tabelas.

create extension if not exists "pgcrypto";

-- =========================================================================
-- Funções utilitárias
-- =========================================================================
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- =========================================================================
-- Catálogo de permissões / papéis administrativos
-- =========================================================================
create table public.roles (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,               -- Super Admin, Admin, Editor, Suporte
  description text,
  created_at timestamptz not null default now()
);

create table public.permissions (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,               -- ex: recipes.manage, users.manage
  label text not null,
  category text not null default 'geral',
  created_at timestamptz not null default now()
);

create table public.role_permissions (
  role_id uuid not null references public.roles(id) on delete cascade,
  permission_id uuid not null references public.permissions(id) on delete cascade,
  primary key (role_id, permission_id)
);

-- =========================================================================
-- Administradores (equipe do painel /admin)
-- =========================================================================
create table public.admins (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  email text not null unique,
  avatar_url text,
  role_id uuid references public.roles(id) on delete set null,
  status text not null default 'active' check (status in ('active','inactive')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_admins_updated_at before update on public.admins
  for each row execute function public.set_updated_at();

-- Helpers de autorização (security definer para poder ler admins/roles dentro das policies)
create or replace function public.is_admin(uid uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.admins a where a.id = uid and a.status = 'active');
$$;

create or replace function public.has_permission(uid uuid, perm text)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1
    from public.admins a
    join public.role_permissions rp on rp.role_id = a.role_id
    join public.permissions p on p.id = rp.permission_id
    where a.id = uid and a.status = 'active' and p.code = perm
  );
$$;

-- =========================================================================
-- Planos e assinantes (usuários do /app)
-- =========================================================================
create table public.plans (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  price numeric(10,2) not null default 0,
  billing_period text not null default 'mensal' check (billing_period in ('gratuito','mensal','anual','vitalicio')),
  description text,
  features jsonb not null default '[]'::jsonb,
  hotmart_product_id text,
  hotmart_offer_code text,
  is_active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_plans_updated_at before update on public.plans
  for each row execute function public.set_updated_at();

create table public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null default '',
  email text not null unique,
  phone text,
  avatar_url text,
  plan_id uuid references public.plans(id) on delete set null,
  status text not null default 'active' check (status in ('active','inactive')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_users_updated_at before update on public.users
  for each row execute function public.set_updated_at();

create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  plan_id uuid references public.plans(id) on delete set null,
  status text not null default 'pendente' check (status in ('ativa','pendente','cancelada')),
  hotmart_transaction_code text,
  hotmart_subscriber_code text,
  started_at timestamptz,
  expires_at timestamptz,
  canceled_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_subscriptions_updated_at before update on public.subscriptions
  for each row execute function public.set_updated_at();
create index idx_subscriptions_user on public.subscriptions(user_id);
create index idx_subscriptions_hotmart_tx on public.subscriptions(hotmart_transaction_code);

-- Cria automaticamente uma linha em public.users quando alguém se cadastra via Supabase Auth
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  v_free_plan uuid;
begin
  select id into v_free_plan from public.plans where slug = 'gratuito' limit 1;
  insert into public.users (id, name, email, plan_id)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email,
    v_free_plan
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger trg_on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =========================================================================
-- Catálogo de receitas
-- =========================================================================
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  icon text default 'utensils',
  description text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table public.ingredients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  unit text not null default 'g',            -- g, ml, unidade
  package_price numeric(10,2) not null default 0,
  package_quantity numeric(10,2) not null default 1,
  price_per_unit numeric(12,6) generated always as (
    case when package_quantity > 0 then package_price / package_quantity else 0 end
  ) stored,
  supplier text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_ingredients_updated_at before update on public.ingredients
  for each row execute function public.set_updated_at();

create table public.recipes (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  category_id uuid references public.categories(id) on delete set null,
  difficulty text not null default 'Fácil' check (difficulty in ('Fácil','Médio','Difícil')),
  prep_time_minutes int not null default 30,
  yield_quantity numeric(10,2) not null default 1,
  yield_unit text not null default 'porções',
  image_url text,
  description text,
  instructions jsonb not null default '[]'::jsonb,   -- array de passos do modo de preparo
  tips text,
  storage text,        -- conservação
  equipment text,       -- equipamentos
  packaging_cost numeric(10,2) not null default 0,
  other_costs numeric(10,2) not null default 0,
  profit_margin_percent numeric(5,2) not null default 70,
  published boolean not null default false,
  featured boolean not null default false,
  is_new boolean not null default false,
  views_count int not null default 0,
  favorites_count int not null default 0,
  created_by uuid references public.admins(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_recipes_updated_at before update on public.recipes
  for each row execute function public.set_updated_at();
create index idx_recipes_category on public.recipes(category_id);
create index idx_recipes_published on public.recipes(published);

create table public.recipe_ingredients (
  id uuid primary key default gen_random_uuid(),
  recipe_id uuid not null references public.recipes(id) on delete cascade,
  ingredient_id uuid not null references public.ingredients(id) on delete restrict,
  base_quantity numeric(10,3) not null default 0,   -- quantidade na unidade do ingrediente, para o rendimento base da receita
  display_label text,                                -- ex: "2 xícaras (240g)"
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);
create index idx_recipe_ingredients_recipe on public.recipe_ingredients(recipe_id);
create index idx_recipe_ingredients_ingredient on public.recipe_ingredients(ingredient_id);

-- =========================================================================
-- Interação do usuário: favoritos, coleções, lista de compras
-- =========================================================================
create table public.favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  recipe_id uuid not null references public.recipes(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, recipe_id)
);

create table public.collections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now()
);

create table public.collection_recipes (
  collection_id uuid not null references public.collections(id) on delete cascade,
  recipe_id uuid not null references public.recipes(id) on delete cascade,
  added_at timestamptz not null default now(),
  primary key (collection_id, recipe_id)
);

create table public.shopping_list_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  recipe_id uuid references public.recipes(id) on delete set null,
  label text not null,
  quantity text,
  checked boolean not null default false,
  created_at timestamptz not null default now()
);

-- =========================================================================
-- Conteúdo editorial: novidades, banners, comentários, notificações
-- =========================================================================
create table public.news (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text,
  image_url text,
  status text not null default 'draft' check (status in ('draft','published')),
  published_at timestamptz,
  created_by uuid references public.admins(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_news_updated_at before update on public.news
  for each row execute function public.set_updated_at();

create table public.banners (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  subtitle text,
  image_url text,
  link_url text,
  position text not null default 'home' check (position in ('home_hero','home_news','app_top')),
  is_active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table public.comments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  recipe_id uuid not null references public.recipes(id) on delete cascade,
  content text not null,
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  created_at timestamptz not null default now()
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade, -- null = notificação global
  title text not null,
  message text not null,
  type text not null default 'info',
  read boolean not null default false,
  created_at timestamptz not null default now()
);

-- =========================================================================
-- Suporte, logs e configurações
-- =========================================================================
create table public.support_tickets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  subject text not null,
  message text not null,
  status text not null default 'open' check (status in ('open','in_progress','closed')),
  priority text not null default 'normal' check (priority in ('baixa','normal','alta')),
  assigned_admin_id uuid references public.admins(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_support_tickets_updated_at before update on public.support_tickets
  for each row execute function public.set_updated_at();

create table public.system_logs (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid references public.admins(id) on delete set null,
  action text not null,          -- create, update, delete, publish, login, ...
  entity text not null,          -- recipes, ingredients, users, ...
  entity_id uuid,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index idx_system_logs_created_at on public.system_logs(created_at desc);

create table public.settings (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
create trigger trg_settings_updated_at before update on public.settings
  for each row execute function public.set_updated_at();

-- Mantém recipes.favorites_count sincronizado automaticamente
create or replace function public.sync_recipe_favorites_count()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if tg_op = 'INSERT' then
    update public.recipes set favorites_count = favorites_count + 1 where id = new.recipe_id;
  elsif tg_op = 'DELETE' then
    update public.recipes set favorites_count = greatest(favorites_count - 1, 0) where id = old.recipe_id;
  end if;
  return null;
end;
$$;

create trigger trg_favorites_count
  after insert or delete on public.favorites
  for each row execute function public.sync_recipe_favorites_count();

-- =========================================================================
-- Row Level Security
-- =========================================================================
alter table public.roles enable row level security;
alter table public.permissions enable row level security;
alter table public.role_permissions enable row level security;
alter table public.admins enable row level security;
alter table public.plans enable row level security;
alter table public.users enable row level security;
alter table public.subscriptions enable row level security;
alter table public.categories enable row level security;
alter table public.ingredients enable row level security;
alter table public.recipes enable row level security;
alter table public.recipe_ingredients enable row level security;
alter table public.favorites enable row level security;
alter table public.collections enable row level security;
alter table public.collection_recipes enable row level security;
alter table public.shopping_list_items enable row level security;
alter table public.news enable row level security;
alter table public.banners enable row level security;
alter table public.comments enable row level security;
alter table public.notifications enable row level security;
alter table public.support_tickets enable row level security;
alter table public.system_logs enable row level security;
alter table public.settings enable row level security;

-- roles / permissions / role_permissions: leitura para qualquer admin autenticado, gestão só com permissions.manage
create policy "admins podem ler roles" on public.roles for select using (public.is_admin(auth.uid()));
create policy "gestao de roles" on public.roles for all using (public.has_permission(auth.uid(),'permissions.manage')) with check (public.has_permission(auth.uid(),'permissions.manage'));

create policy "admins podem ler permissions" on public.permissions for select using (public.is_admin(auth.uid()));
create policy "gestao de permissions" on public.permissions for all using (public.has_permission(auth.uid(),'permissions.manage')) with check (public.has_permission(auth.uid(),'permissions.manage'));

create policy "admins podem ler role_permissions" on public.role_permissions for select using (public.is_admin(auth.uid()));
create policy "gestao de role_permissions" on public.role_permissions for all using (public.has_permission(auth.uid(),'permissions.manage')) with check (public.has_permission(auth.uid(),'permissions.manage'));

-- admins
create policy "admin ve proprio registro" on public.admins for select using (id = auth.uid() or public.has_permission(auth.uid(),'admins.manage'));
create policy "gestao de admins" on public.admins for insert with check (public.has_permission(auth.uid(),'admins.manage'));
create policy "gestao de admins update" on public.admins for update using (public.has_permission(auth.uid(),'admins.manage')) with check (public.has_permission(auth.uid(),'admins.manage'));
create policy "gestao de admins delete" on public.admins for delete using (public.has_permission(auth.uid(),'admins.manage'));

-- plans: leitura pública, gestão via permissão
create policy "planos publicos" on public.plans for select using (is_active or public.is_admin(auth.uid()));
create policy "gestao de planos" on public.plans for insert with check (public.has_permission(auth.uid(),'plans.manage'));
create policy "gestao de planos update" on public.plans for update using (public.has_permission(auth.uid(),'plans.manage')) with check (public.has_permission(auth.uid(),'plans.manage'));
create policy "gestao de planos delete" on public.plans for delete using (public.has_permission(auth.uid(),'plans.manage'));

-- users
create policy "usuario ve proprio perfil" on public.users for select using (id = auth.uid() or public.has_permission(auth.uid(),'users.manage'));
create policy "usuario edita proprio perfil" on public.users for update using (id = auth.uid() or public.has_permission(auth.uid(),'users.manage')) with check (id = auth.uid() or public.has_permission(auth.uid(),'users.manage'));
create policy "gestao de usuarios insert" on public.users for insert with check (id = auth.uid() or public.has_permission(auth.uid(),'users.manage'));
create policy "gestao de usuarios delete" on public.users for delete using (public.has_permission(auth.uid(),'users.manage'));

-- subscriptions: usuário vê a própria; admins com permissão gerenciam; webhook usa service role (ignora RLS)
create policy "usuario ve propria assinatura" on public.subscriptions for select using (user_id = auth.uid() or public.has_permission(auth.uid(),'subscriptions.manage'));
create policy "gestao de assinaturas" on public.subscriptions for insert with check (public.has_permission(auth.uid(),'subscriptions.manage'));
create policy "gestao de assinaturas update" on public.subscriptions for update using (public.has_permission(auth.uid(),'subscriptions.manage')) with check (public.has_permission(auth.uid(),'subscriptions.manage'));
create policy "gestao de assinaturas delete" on public.subscriptions for delete using (public.has_permission(auth.uid(),'subscriptions.manage'));

-- categories: leitura pública, gestão via permissão
create policy "categorias publicas" on public.categories for select using (true);
create policy "gestao de categorias" on public.categories for insert with check (public.has_permission(auth.uid(),'recipes.manage'));
create policy "gestao de categorias update" on public.categories for update using (public.has_permission(auth.uid(),'recipes.manage')) with check (public.has_permission(auth.uid(),'recipes.manage'));
create policy "gestao de categorias delete" on public.categories for delete using (public.has_permission(auth.uid(),'recipes.manage'));

-- ingredients: leitura pública (para calcular custo em tela), gestão via permissão
create policy "ingredientes publicos" on public.ingredients for select using (true);
create policy "gestao de ingredientes" on public.ingredients for insert with check (public.has_permission(auth.uid(),'ingredients.manage'));
create policy "gestao de ingredientes update" on public.ingredients for update using (public.has_permission(auth.uid(),'ingredients.manage')) with check (public.has_permission(auth.uid(),'ingredients.manage'));
create policy "gestao de ingredientes delete" on public.ingredients for delete using (public.has_permission(auth.uid(),'ingredients.manage'));

-- recipes: leitura pública das publicadas, admins veem tudo
create policy "receitas publicadas sao publicas" on public.recipes for select using (published or public.is_admin(auth.uid()));
create policy "gestao de receitas" on public.recipes for insert with check (public.has_permission(auth.uid(),'recipes.manage'));
create policy "gestao de receitas update" on public.recipes for update using (public.has_permission(auth.uid(),'recipes.manage')) with check (public.has_permission(auth.uid(),'recipes.manage'));
create policy "gestao de receitas delete" on public.recipes for delete using (public.has_permission(auth.uid(),'recipes.manage'));

-- recipe_ingredients: segue a visibilidade da receita
create policy "ingredientes da receita" on public.recipe_ingredients for select using (
  exists (select 1 from public.recipes r where r.id = recipe_id and (r.published or public.is_admin(auth.uid())))
);
create policy "gestao de recipe_ingredients" on public.recipe_ingredients for insert with check (public.has_permission(auth.uid(),'recipes.manage'));
create policy "gestao de recipe_ingredients update" on public.recipe_ingredients for update using (public.has_permission(auth.uid(),'recipes.manage')) with check (public.has_permission(auth.uid(),'recipes.manage'));
create policy "gestao de recipe_ingredients delete" on public.recipe_ingredients for delete using (public.has_permission(auth.uid(),'recipes.manage'));

-- favorites / collections / collection_recipes / shopping_list_items: só o dono
create policy "usuario gerencia favoritos" on public.favorites for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "usuario gerencia colecoes" on public.collections for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "usuario gerencia itens de colecao" on public.collection_recipes for all using (
  exists (select 1 from public.collections c where c.id = collection_id and c.user_id = auth.uid())
) with check (
  exists (select 1 from public.collections c where c.id = collection_id and c.user_id = auth.uid())
);
create policy "usuario gerencia lista de compras" on public.shopping_list_items for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- news: publicadas são públicas, gestão via permissão
create policy "novidades publicadas sao publicas" on public.news for select using (status = 'published' or public.is_admin(auth.uid()));
create policy "gestao de novidades" on public.news for insert with check (public.has_permission(auth.uid(),'news.manage'));
create policy "gestao de novidades update" on public.news for update using (public.has_permission(auth.uid(),'news.manage')) with check (public.has_permission(auth.uid(),'news.manage'));
create policy "gestao de novidades delete" on public.news for delete using (public.has_permission(auth.uid(),'news.manage'));

-- banners: ativos são públicos, gestão via permissão
create policy "banners ativos sao publicos" on public.banners for select using (is_active or public.is_admin(auth.uid()));
create policy "gestao de banners" on public.banners for insert with check (public.has_permission(auth.uid(),'banners.manage'));
create policy "gestao de banners update" on public.banners for update using (public.has_permission(auth.uid(),'banners.manage')) with check (public.has_permission(auth.uid(),'banners.manage'));
create policy "gestao de banners delete" on public.banners for delete using (public.has_permission(auth.uid(),'banners.manage'));

-- comments: aprovados são públicos; usuário gerencia os próprios; admin modera
create policy "comentarios aprovados sao publicos" on public.comments for select using (
  status = 'approved' or user_id = auth.uid() or public.has_permission(auth.uid(),'comments.moderate')
);
create policy "usuario cria comentario" on public.comments for insert with check (user_id = auth.uid());
create policy "usuario edita proprio comentario" on public.comments for update using (user_id = auth.uid() or public.has_permission(auth.uid(),'comments.moderate')) with check (user_id = auth.uid() or public.has_permission(auth.uid(),'comments.moderate'));
create policy "usuario apaga proprio comentario" on public.comments for delete using (user_id = auth.uid() or public.has_permission(auth.uid(),'comments.moderate'));

-- notifications: usuário vê as próprias e as globais; gestão via permissão
create policy "usuario ve proprias notificacoes" on public.notifications for select using (user_id = auth.uid() or user_id is null or public.has_permission(auth.uid(),'notifications.manage'));
create policy "usuario marca notificacao como lida" on public.notifications for update using (user_id = auth.uid() or public.has_permission(auth.uid(),'notifications.manage')) with check (user_id = auth.uid() or public.has_permission(auth.uid(),'notifications.manage'));
create policy "gestao de notificacoes insert" on public.notifications for insert with check (public.has_permission(auth.uid(),'notifications.manage'));
create policy "gestao de notificacoes delete" on public.notifications for delete using (public.has_permission(auth.uid(),'notifications.manage'));

-- support_tickets: usuário vê/abre os próprios; equipe de suporte gerencia
create policy "usuario ve proprios tickets" on public.support_tickets for select using (user_id = auth.uid() or public.has_permission(auth.uid(),'support.manage'));
create policy "usuario abre ticket" on public.support_tickets for insert with check (user_id = auth.uid());
create policy "suporte atualiza ticket" on public.support_tickets for update using (user_id = auth.uid() or public.has_permission(auth.uid(),'support.manage')) with check (user_id = auth.uid() or public.has_permission(auth.uid(),'support.manage'));
create policy "suporte apaga ticket" on public.support_tickets for delete using (public.has_permission(auth.uid(),'support.manage'));

-- system_logs: qualquer admin registra sua própria ação; leitura restrita a quem tem logs.view
create policy "leitura de logs" on public.system_logs for select using (public.has_permission(auth.uid(),'logs.view'));
create policy "admin registra log" on public.system_logs for insert with check (admin_id = auth.uid() and public.is_admin(auth.uid()));

-- settings: somente admins
create policy "admins leem configuracoes" on public.settings for select using (public.is_admin(auth.uid()));
create policy "gestao de configuracoes" on public.settings for insert with check (public.has_permission(auth.uid(),'settings.manage'));
create policy "gestao de configuracoes update" on public.settings for update using (public.has_permission(auth.uid(),'settings.manage')) with check (public.has_permission(auth.uid(),'settings.manage'));
create policy "gestao de configuracoes delete" on public.settings for delete using (public.has_permission(auth.uid(),'settings.manage'));
