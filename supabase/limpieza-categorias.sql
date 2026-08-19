-- ============================================================
-- Leuname Software — limpieza del catálogo antiguo
--
-- QUÉ HACE
--   Borra las 30 categorías antiguas (las de emoji, con los duplicados
--   Restaurante / Restaurantes / Restaurante Premium) y deja las ocho
--   categorías premium de la referencia de marca.
--
-- CÓMO SE USA
--   1. Entra en Supabase → SQL Editor → New query.
--   2. Pega este archivo entero y pulsa "Run".
--   3. Al final verás la lista de categorías y plantillas que quedan.
--
-- ES SEGURO
--   Va todo dentro de una transacción: si algo falla, no se cambia nada.
--   Ninguna plantilla se borra — las que estuvieran en una categoría que
--   desaparece se mueven a "Restaurantes" y las puedes recolocar después
--   desde /admin. Los pedidos no se tocan.
--
--   Se puede ejecutar más de una vez sin problema.
-- ============================================================

begin;

-- ------------------------------------------------------------
-- 1. Liberar los slugs antiguos
--    ("restaurantes" y "hotel" ya existían y chocarían con los nuevos).
-- ------------------------------------------------------------
update public.categories
   set slug = 'zz-antigua-' || slug
 where slug not like 'zz-antigua-%'
   and id not in (
     '11111111-1111-4111-8111-000000000001',
     '11111111-1111-4111-8111-000000000002',
     '11111111-1111-4111-8111-000000000003',
     '11111111-1111-4111-8111-000000000004',
     '11111111-1111-4111-8111-000000000005',
     '11111111-1111-4111-8111-000000000006',
     '11111111-1111-4111-8111-000000000007',
     '11111111-1111-4111-8111-000000000008'
   );

-- Las ocho primeras filas también sueltan su slug: la línea de abajo se lo
-- vuelve a poner con el valor nuevo.
update public.categories
   set slug = 'zz-antigua-' || slug
 where slug not like 'zz-antigua-%'
   and slug not in (
     'restaurantes', 'clinicas', 'inmobiliarias', 'hoteles',
     'tiendas-online', 'automotriz', 'salud-belleza', 'educacion'
   );

-- ------------------------------------------------------------
-- 2. Escribir las ocho categorías premium
--    (mismos ids que src/lib/seed-data.ts y supabase/seed.sql)
-- ------------------------------------------------------------
insert into public.categories (id, name, slug, icon) values
  ('11111111-1111-4111-8111-000000000001', 'Restaurantes',    'restaurantes',    '🍴'),
  ('11111111-1111-4111-8111-000000000002', 'Clínicas',        'clinicas',        '🩺'),
  ('11111111-1111-4111-8111-000000000003', 'Inmobiliarias',   'inmobiliarias',   '🏡'),
  ('11111111-1111-4111-8111-000000000004', 'Hoteles',         'hoteles',         '🏨'),
  ('11111111-1111-4111-8111-000000000005', 'Tiendas Online',  'tiendas-online',  '🛒'),
  ('11111111-1111-4111-8111-000000000006', 'Automotriz',      'automotriz',      '🚗'),
  ('11111111-1111-4111-8111-000000000007', 'Salud & Belleza', 'salud-belleza',   '💆'),
  ('11111111-1111-4111-8111-000000000008', 'Educación',       'educacion',       '🎓')
on conflict (id) do update
  set name = excluded.name,
      slug = excluded.slug,
      icon = excluded.icon;

-- ------------------------------------------------------------
-- 3. Recolocar las plantillas
-- ------------------------------------------------------------

-- La clínica dental va a "Clínicas" (antes vivía en la categoría que ahora
-- ocupa "Restaurantes", así que hay que moverla a mano).
update public.templates
   set category_id = '11111111-1111-4111-8111-000000000002'
 where slug = 'clinica-dental-premium';

-- Cualquier otra plantilla que siguiera colgando de una categoría antigua
-- se guarda en "Restaurantes" para no perderla: recolócala en /admin.
update public.templates
   set category_id = '11111111-1111-4111-8111-000000000001'
 where category_id not in (
     '11111111-1111-4111-8111-000000000001',
     '11111111-1111-4111-8111-000000000002',
     '11111111-1111-4111-8111-000000000003',
     '11111111-1111-4111-8111-000000000004',
     '11111111-1111-4111-8111-000000000005',
     '11111111-1111-4111-8111-000000000006',
     '11111111-1111-4111-8111-000000000007',
     '11111111-1111-4111-8111-000000000008'
   );

-- ------------------------------------------------------------
-- 4. Borrar las categorías antiguas (ya no las usa ninguna plantilla)
-- ------------------------------------------------------------
delete from public.categories
 where id not in (
     '11111111-1111-4111-8111-000000000001',
     '11111111-1111-4111-8111-000000000002',
     '11111111-1111-4111-8111-000000000003',
     '11111111-1111-4111-8111-000000000004',
     '11111111-1111-4111-8111-000000000005',
     '11111111-1111-4111-8111-000000000006',
     '11111111-1111-4111-8111-000000000007',
     '11111111-1111-4111-8111-000000000008'
   );

commit;

-- ------------------------------------------------------------
-- 5. Comprobación — deben salir exactamente ocho categorías
-- ------------------------------------------------------------
select name, slug from public.categories order by id;

select t.title, t.slug, c.name as categoria, t.status
  from public.templates t
  join public.categories c on c.id = t.category_id
 order by t.created_at;
