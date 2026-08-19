-- ============================================================
-- Leuname Software — reinicio del catálogo (empezar de cero)
--
-- QUÉ HACE
--   Deja la tienda vacía y lista para el catálogo nuevo:
--     · borra TODAS las plantillas antiguas (las de cafés, panaderías,
--       barberías… las que se ven ahora en la web);
--     · borra TODAS las categorías antiguas;
--     · crea las ocho categorías premium de la referencia de marca.
--
--   Después de esto la web muestra 0 plantillas — es lo correcto: el
--   catálogo se vuelve a llenar desde /admin o con nuevas plantillas.
--
-- QUÉ NO TOCA
--   · Los pedidos y los clientes: no se borra ni una fila.
--   · Si alguna plantilla YA SE VENDIÓ, no se puede borrar (rompería el
--     historial del pedido y la descarga del cliente): esas se marcan como
--     "archived", desaparecen de la tienda y su pedido sigue funcionando.
--     Al final del script se listan, si las hay.
--
-- CÓMO SE USA
--   Supabase → SQL Editor → New query → pegar todo → Run.
--   Se puede ejecutar más de una vez sin problema.
--
-- OJO: esto borra el catálogo. Si quieres conservar alguna plantilla de las
-- que hay ahora, dilo antes de ejecutarlo.
-- ============================================================

begin;

-- ------------------------------------------------------------
-- 1. Las plantillas ya vendidas se archivan (no se pueden borrar)
-- ------------------------------------------------------------
update public.templates
   set status = 'archived'
 where id in (select template_id from public.orders);

-- ------------------------------------------------------------
-- 2. Fuera todas las demás plantillas
-- ------------------------------------------------------------
delete from public.templates
 where id not in (select template_id from public.orders);

-- ------------------------------------------------------------
-- 3. Fuera las categorías que ya no usa ninguna plantilla
--    (las que sostienen una plantilla archivada se quedan)
-- ------------------------------------------------------------
delete from public.categories
 where id not in (select category_id from public.templates);

-- ------------------------------------------------------------
-- 4. Las ocho categorías premium
--    (mismos ids y slugs que src/lib/seed-data.ts)
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

commit;

-- ------------------------------------------------------------
-- 5. Comprobación
-- ------------------------------------------------------------

-- Deben salir las ocho categorías nuevas (más alguna antigua sólo si
-- sostiene una plantilla ya vendida).
select name, slug from public.categories order by name;

-- Debe salir vacío: la tienda no muestra nada hasta cargar el catálogo nuevo.
select title, slug, status from public.templates where status = 'published';

-- Plantillas conservadas por tener venta (aparecen archivadas, no en la web).
select t.title, t.slug, t.status, count(o.id) as pedidos
  from public.templates t
  join public.orders o on o.template_id = t.id
 group by t.id, t.title, t.slug, t.status;
