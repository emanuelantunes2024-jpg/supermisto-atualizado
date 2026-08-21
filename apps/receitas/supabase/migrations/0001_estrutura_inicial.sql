-- ============================================================================
-- CENTRAL DE RECEITAS & RENDA — estrutura inicial
--
-- Rode este arquivo inteiro no SQL Editor do Supabase (Database → SQL Editor).
-- Ele é idempotente: pode ser executado mais de uma vez sem quebrar nada.
--
-- Depois dele, rode o arquivo gerado por `npm run gerar:seed`
-- (supabase/seed/seed.sql), que carrega insumos, categorias e receitas.
-- ============================================================================

create extension if not exists "pgcrypto";
-- Necessária para a busca por trecho (ILIKE '%termo%') ser rápida.
create extension if not exists "pg_trgm";

-- ============================================================================
-- 1. PERFIS  (espelha auth.users e guarda a situação de acesso)
-- ============================================================================

create table if not exists public.perfis (
  id uuid primary key references auth.users(id) on delete cascade,
  nome text,
  email text unique,
  papel text not null default 'cliente' check (papel in ('cliente', 'admin')),
  acesso text not null default 'ativo' check (acesso in ('ativo', 'suspenso', 'cancelado')),
  plano text,
  -- Respostas do primeiro acesso (objetivo, investimento, linhas).
  preferencias jsonb,
  criado_em timestamptz not null default now(),
  ultimo_acesso timestamptz
);

create index if not exists perfis_email_idx on public.perfis (email);
create index if not exists perfis_acesso_idx on public.perfis (acesso);

-- ============================================================================
-- 2. ACESSO VINDO DA PLATAFORMA DE VENDA
-- ============================================================================

-- E-mails liberados pelo webhook. Permite que a compra chegue ANTES de a
-- pessoa criar a conta: ao se cadastrar com o mesmo e-mail, o acesso já vale.
create table if not exists public.acessos_liberados (
  email text primary key,
  nome text,
  plano text,
  situacao text not null default 'ativo' check (situacao in ('ativo', 'suspenso', 'cancelado')),
  atualizado_em timestamptz not null default now()
);

-- Histórico bruto do que a plataforma enviou. Serve de auditoria e permite
-- reprocessar um evento se algo der errado.
create table if not exists public.eventos_compra (
  id uuid primary key default gen_random_uuid(),
  evento text not null,
  email text not null,
  transacao text,
  produto text,
  carga jsonb,
  recebido_em timestamptz not null default now()
);

-- Torna o webhook idempotente: a plataforma reenvia o mesmo evento em falhas.
create unique index if not exists eventos_compra_unico_idx
  on public.eventos_compra (transacao, evento)
  where transacao is not null;

create index if not exists eventos_compra_email_idx on public.eventos_compra (email);

-- ============================================================================
-- 3. CATÁLOGO
-- ============================================================================

create table if not exists public.categorias (
  slug text primary key,
  nome text not null,
  descricao text,
  icone text,
  cor text,
  ordem int not null default 0
);

create table if not exists public.subcategorias (
  id uuid primary key default gen_random_uuid(),
  categoria_slug text not null references public.categorias(slug) on delete cascade,
  nome text not null,
  ordem int not null default 0,
  unique (categoria_slug, nome)
);

create table if not exists public.insumos (
  chave text primary key,
  nome text not null,
  unidade_base text not null check (unidade_base in ('g', 'ml', 'un')),
  embalagem numeric not null check (embalagem > 0),
  embalagem_rotulo text not null,
  preco_ref numeric not null check (preco_ref >= 0),
  secao text not null
);

create table if not exists public.receitas (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  nome text not null,
  descricao text not null default '',
  categoria_slug text not null references public.categorias(slug),
  subcategoria text,
  imagem text,
  tempo_minutos int not null default 30 check (tempo_minutos > 0),
  dificuldade text not null default 'facil' check (dificuldade in ('facil', 'medio', 'avancado')),
  rendimento int not null default 1 check (rendimento > 0),
  rendimento_unidade text not null default 'unidades',
  preparo jsonb not null default '[]'::jsonb,
  dicas jsonb not null default '[]'::jsonb,
  conservacao text,
  equipamentos jsonb not null default '[]'::jsonb,
  tags text[] not null default '{}',
  objetivos text[] not null default '{}',
  linha text not null default 'outros',
  para_vender boolean not null default false,
  embalagem_por_unidade numeric,
  margem_sugerida numeric,
  -- Custo com os preços de referência, gravado ao salvar. Permite filtrar por
  -- faixa de investimento sem recalcular tudo a cada consulta.
  custo_estimado numeric,
  publicada_em date not null default current_date,
  novidade_ate date,
  publicada boolean not null default true,
  destaque boolean not null default false,
  -- Marca as receitas que a demonstração pública pode mostrar.
  demonstracao boolean not null default false,
  -- Texto consolidado para a busca (nome, descrição, tags e ingredientes).
  busca_texto text,
  criada_em timestamptz not null default now(),
  atualizada_em timestamptz not null default now()
);

create index if not exists receitas_categoria_idx on public.receitas (categoria_slug);
create index if not exists receitas_publicada_idx on public.receitas (publicada, publicada_em desc);
create index if not exists receitas_vender_idx on public.receitas (para_vender) where para_vender;
create index if not exists receitas_custo_idx on public.receitas (custo_estimado);
create index if not exists receitas_tempo_idx on public.receitas (tempo_minutos);
create index if not exists receitas_tags_idx on public.receitas using gin (tags);
create index if not exists receitas_objetivos_idx on public.receitas using gin (objetivos);
create index if not exists receitas_busca_idx on public.receitas using gin (busca_texto gin_trgm_ops);

create table if not exists public.receita_ingredientes (
  id uuid primary key default gen_random_uuid(),
  receita_id uuid not null references public.receitas(id) on delete cascade,
  insumo_chave text not null references public.insumos(chave),
  qtd numeric not null default 0,
  unidade text not null default 'unidade',
  base numeric not null default 0,
  grupo text,
  observacao text,
  opcional boolean not null default false,
  ordem int not null default 0
);

create index if not exists receita_ingredientes_receita_idx
  on public.receita_ingredientes (receita_id);
create index if not exists receita_ingredientes_insumo_idx
  on public.receita_ingredientes (insumo_chave);

-- ============================================================================
-- 4. DADOS DO USUÁRIO
-- ============================================================================

create table if not exists public.favoritos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  receita_slug text not null,
  criado_em timestamptz not null default now(),
  unique (user_id, receita_slug)
);

create index if not exists favoritos_user_idx on public.favoritos (user_id);

create table if not exists public.colecoes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  nome text not null,
  fixa boolean not null default false,
  criado_em timestamptz not null default now()
);

create index if not exists colecoes_user_idx on public.colecoes (user_id);

create table if not exists public.colecao_receitas (
  colecao_id uuid not null references public.colecoes(id) on delete cascade,
  receita_slug text not null,
  criado_em timestamptz not null default now(),
  primary key (colecao_id, receita_slug)
);

create table if not exists public.lista_itens (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  insumo_chave text references public.insumos(chave),
  base numeric not null default 0,
  comprado boolean not null default false,
  origens text[] not null default '{}',
  manual text,
  criado_em timestamptz not null default now()
);

create index if not exists lista_itens_user_idx on public.lista_itens (user_id);

create table if not exists public.precos_usuario (
  user_id uuid not null references auth.users(id) on delete cascade,
  insumo_chave text not null references public.insumos(chave) on delete cascade,
  preco numeric not null check (preco >= 0),
  atualizado_em timestamptz not null default now(),
  primary key (user_id, insumo_chave)
);

create table if not exists public.calculos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  tipo text not null check (tipo in ('custo', 'preco')),
  receita_slug text,
  rotulo text not null default '',
  resumo jsonb not null default '{}'::jsonb,
  criado_em timestamptz not null default now()
);

create index if not exists calculos_user_idx on public.calculos (user_id, criado_em desc);

create table if not exists public.planos_producao (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  nome text not null,
  itens jsonb not null default '[]'::jsonb,
  criado_em timestamptz not null default now()
);

create table if not exists public.metas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  tipo text not null check (tipo in ('faturamento', 'unidades')),
  alvo numeric not null,
  receita_slug text,
  criado_em timestamptz not null default now()
);

create table if not exists public.notificacoes (
  id uuid primary key default gen_random_uuid(),
  -- Nulo = aviso geral, para todo mundo.
  user_id uuid references auth.users(id) on delete cascade,
  titulo text not null,
  texto text,
  url text,
  criado_em timestamptz not null default now(),
  lida_em timestamptz
);

create index if not exists notificacoes_user_idx on public.notificacoes (user_id, criado_em desc);

create table if not exists public.visualizacoes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  receita_slug text not null,
  vista_em timestamptz not null default now()
);

create index if not exists visualizacoes_user_idx on public.visualizacoes (user_id, vista_em desc);

-- ============================================================================
-- 5. FUNÇÕES E GATILHOS
-- ============================================================================

-- Quem é administrador. Usada nas políticas de RLS.
create or replace function public.eh_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.perfis
    where id = auth.uid() and papel = 'admin'
  );
$$;

-- Monta o texto de busca de uma receita (nome, descrição, tags, ingredientes).
create or replace function public.atualizar_busca_receita(p_receita_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.receitas r
  set busca_texto = lower(
    coalesce(r.nome, '') || ' ' ||
    coalesce(r.descricao, '') || ' ' ||
    coalesce(r.categoria_slug, '') || ' ' ||
    coalesce(r.subcategoria, '') || ' ' ||
    coalesce(array_to_string(r.tags, ' '), '') || ' ' ||
    coalesce((
      select string_agg(i.nome || ' ' || ri.insumo_chave, ' ')
      from public.receita_ingredientes ri
      join public.insumos i on i.chave = ri.insumo_chave
      where ri.receita_id = r.id
    ), '')
  )
  where r.id = p_receita_id;
end;
$$;

create or replace function public.trg_receita_busca()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.atualizar_busca_receita(new.id);
  return new;
end;
$$;

drop trigger if exists receitas_busca_trg on public.receitas;
create trigger receitas_busca_trg
  after insert or update of nome, descricao, tags, subcategoria, categoria_slug
  on public.receitas
  for each row execute function public.trg_receita_busca();

create or replace function public.trg_ingrediente_busca()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.atualizar_busca_receita(coalesce(new.receita_id, old.receita_id));
  return coalesce(new, old);
end;
$$;

drop trigger if exists receita_ingredientes_busca_trg on public.receita_ingredientes;
create trigger receita_ingredientes_busca_trg
  after insert or update or delete on public.receita_ingredientes
  for each row execute function public.trg_ingrediente_busca();

-- Cria o perfil assim que o usuário se cadastra e já aplica o acesso que a
-- plataforma de venda liberou para aquele e-mail.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_situacao text;
  v_plano text;
begin
  select situacao, plano into v_situacao, v_plano
  from public.acessos_liberados
  where email = lower(new.email);

  insert into public.perfis (id, nome, email, acesso, plano)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'nome', new.raw_user_meta_data->>'name'),
    lower(new.email),
    coalesce(v_situacao, 'ativo'),
    v_plano
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Contagem pública de receitas: a landing e a demonstração mostram o número
-- real sem que o visitante consiga ler o catálogo inteiro.
create or replace function public.total_receitas_publicadas()
returns integer
language sql
stable
security definer
set search_path = public
as $$
  select count(*)::int from public.receitas where publicada;
$$;

create or replace function public.contagem_por_categoria()
returns table (categoria_slug text, total bigint)
language sql
stable
security definer
set search_path = public
as $$
  select r.categoria_slug, count(*)
  from public.receitas r
  where r.publicada
  group by r.categoria_slug;
$$;

grant execute on function public.total_receitas_publicadas() to anon, authenticated;
grant execute on function public.contagem_por_categoria() to anon, authenticated;

-- ============================================================================
-- 6. SEGURANÇA POR LINHA (RLS)
-- ============================================================================

alter table public.perfis enable row level security;
alter table public.acessos_liberados enable row level security;
alter table public.eventos_compra enable row level security;
alter table public.categorias enable row level security;
alter table public.subcategorias enable row level security;
alter table public.insumos enable row level security;
alter table public.receitas enable row level security;
alter table public.receita_ingredientes enable row level security;
alter table public.favoritos enable row level security;
alter table public.colecoes enable row level security;
alter table public.colecao_receitas enable row level security;
alter table public.lista_itens enable row level security;
alter table public.precos_usuario enable row level security;
alter table public.calculos enable row level security;
alter table public.planos_producao enable row level security;
alter table public.metas enable row level security;
alter table public.notificacoes enable row level security;
alter table public.visualizacoes enable row level security;

-- ---------------------------------------------------------------- perfis
drop policy if exists "perfil proprio leitura" on public.perfis;
create policy "perfil proprio leitura" on public.perfis
  for select using (auth.uid() = id or public.eh_admin());

drop policy if exists "perfil proprio escrita" on public.perfis;
create policy "perfil proprio escrita" on public.perfis
  for update using (auth.uid() = id or public.eh_admin())
  with check (auth.uid() = id or public.eh_admin());

-- ------------------------------------------------- acessos e eventos (admin)
drop policy if exists "acessos admin" on public.acessos_liberados;
create policy "acessos admin" on public.acessos_liberados
  for all using (public.eh_admin()) with check (public.eh_admin());

drop policy if exists "eventos admin" on public.eventos_compra;
create policy "eventos admin" on public.eventos_compra
  for all using (public.eh_admin()) with check (public.eh_admin());

-- ------------------------------------------------------ catálogo: leitura
-- Categorias, subcategorias e insumos são estrutura, não conteúdo pago.
drop policy if exists "categorias leitura" on public.categorias;
create policy "categorias leitura" on public.categorias for select using (true);

drop policy if exists "subcategorias leitura" on public.subcategorias;
create policy "subcategorias leitura" on public.subcategorias for select using (true);

drop policy if exists "insumos leitura" on public.insumos;
create policy "insumos leitura" on public.insumos for select using (true);

-- Receitas: quem tem conta ativa lê tudo o que está publicado; visitante só
-- enxerga as marcadas para a demonstração pública.
drop policy if exists "receitas leitura cliente" on public.receitas;
create policy "receitas leitura cliente" on public.receitas
  for select using (
    public.eh_admin()
    or (
      publicada
      and (
        demonstracao
        or exists (
          select 1 from public.perfis p
          where p.id = auth.uid() and p.acesso = 'ativo'
        )
      )
    )
  );

drop policy if exists "receitas escrita admin" on public.receitas;
create policy "receitas escrita admin" on public.receitas
  for all using (public.eh_admin()) with check (public.eh_admin());

drop policy if exists "ingredientes leitura" on public.receita_ingredientes;
create policy "ingredientes leitura" on public.receita_ingredientes
  for select using (
    exists (
      select 1 from public.receitas r
      where r.id = receita_id
        and (
          public.eh_admin()
          or (
            r.publicada
            and (
              r.demonstracao
              or exists (
                select 1 from public.perfis p
                where p.id = auth.uid() and p.acesso = 'ativo'
              )
            )
          )
        )
    )
  );

drop policy if exists "ingredientes escrita admin" on public.receita_ingredientes;
create policy "ingredientes escrita admin" on public.receita_ingredientes
  for all using (public.eh_admin()) with check (public.eh_admin());

-- ------------------------------------------------- dados de cada usuário
-- O padrão se repete: cada um enxerga e altera apenas o que é seu.
drop policy if exists "favoritos proprios" on public.favoritos;
create policy "favoritos proprios" on public.favoritos
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "colecoes proprias" on public.colecoes;
create policy "colecoes proprias" on public.colecoes
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "colecao receitas proprias" on public.colecao_receitas;
create policy "colecao receitas proprias" on public.colecao_receitas
  for all using (
    exists (select 1 from public.colecoes c where c.id = colecao_id and c.user_id = auth.uid())
  )
  with check (
    exists (select 1 from public.colecoes c where c.id = colecao_id and c.user_id = auth.uid())
  );

drop policy if exists "lista propria" on public.lista_itens;
create policy "lista propria" on public.lista_itens
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "precos proprios" on public.precos_usuario;
create policy "precos proprios" on public.precos_usuario
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "calculos proprios" on public.calculos;
create policy "calculos proprios" on public.calculos
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "planos proprios" on public.planos_producao;
create policy "planos proprios" on public.planos_producao
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "metas proprias" on public.metas;
create policy "metas proprias" on public.metas
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "notificacoes proprias" on public.notificacoes;
create policy "notificacoes proprias" on public.notificacoes
  for select using (user_id is null or auth.uid() = user_id);

drop policy if exists "notificacoes admin" on public.notificacoes;
create policy "notificacoes admin" on public.notificacoes
  for all using (public.eh_admin()) with check (public.eh_admin());

drop policy if exists "visualizacoes proprias" on public.visualizacoes;
create policy "visualizacoes proprias" on public.visualizacoes
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ============================================================================
-- 7. STORAGE (fotos das receitas)
-- ============================================================================

insert into storage.buckets (id, name, public)
values ('receitas', 'receitas', true)
on conflict (id) do nothing;

drop policy if exists "fotos leitura publica" on storage.objects;
create policy "fotos leitura publica" on storage.objects
  for select using (bucket_id = 'receitas');

drop policy if exists "fotos escrita admin" on storage.objects;
create policy "fotos escrita admin" on storage.objects
  for insert with check (bucket_id = 'receitas' and public.eh_admin());

drop policy if exists "fotos atualizacao admin" on storage.objects;
create policy "fotos atualizacao admin" on storage.objects
  for update using (bucket_id = 'receitas' and public.eh_admin());

drop policy if exists "fotos exclusao admin" on storage.objects;
create policy "fotos exclusao admin" on storage.objects
  for delete using (bucket_id = 'receitas' and public.eh_admin());
