-- Como criar o primeiro Super Admin do painel /admin
--
-- 1) Crie o usuário no Supabase Auth (Dashboard → Authentication → Add user,
--    ou peça para essa pessoa se cadastrar normalmente pelo app em /app/registro).
-- 2) Pegue o UUID desse usuário em Authentication → Users.
-- 3) Rode o comando abaixo no SQL Editor do Supabase, trocando o UUID, o nome
--    e o e-mail:

insert into public.admins (id, name, email, role_id, status)
select
  '00000000-0000-0000-0000-000000000000', -- troque pelo UUID do usuário no Supabase Auth
  'Seu Nome',
  'seu-email@exemplo.com',
  r.id,
  'active'
from public.roles r
where r.name = 'Super Admin'
on conflict (id) do update set role_id = excluded.role_id, status = 'active';

-- A partir daí, novos administradores podem ser convidados direto pela tela
-- Administradores do painel (usa o endpoint /api/admin/invite com a service role).
