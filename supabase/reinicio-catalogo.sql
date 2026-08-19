-- ============================================================
-- Leuname Software — reinicio del catálogo (empezar de cero)
--
-- QUÉ HACE
--   Deja la base de datos vacía y lista para el catálogo nuevo:
--     · borra TODAS las plantillas antiguas (cafeterías, barberías,
--       peluquerías… las que todavía aparecen al entrar en una categoría);
--     · borra TODAS las categorías antiguas.
--
-- QUÉ NO TOCA
--   · Pedidos y clientes: no se borra ni una fila.
--   · Si alguna plantilla YA SE VENDIÓ no se puede borrar (rompería el
--     historial y la descarga del cliente): se marca como "archived",
--     desaparece de la tienda y su pedido sigue funcionando.
--
-- CÓMO SE USA
--   1. Supabase → SQL Editor → New query → pegar TODO esto → Run.
--   2. Después, en otra query, ejecutar supabase/seed.sql: carga las
--      30 categorías premium y las plantillas ya terminadas.
--
--   Se puede ejecutar más de una vez sin problema.
-- ============================================================

begin;

-- 1. Las plantillas ya vendidas se archivan (no se pueden borrar).
update public.templates
   set status = 'archived'
 where id in (select template_id from public.orders);

-- 2. Fuera todas las demás plantillas.
delete from public.templates
 where id not in (select template_id from public.orders);

-- 3. Fuera las categorías que ya no sostienen ninguna plantilla.
delete from public.categories
 where id not in (select category_id from public.templates);

commit;

-- ------------------------------------------------------------
-- Comprobación
-- ------------------------------------------------------------

-- Debe salir 0 (o solo las que sostienen una plantilla ya vendida).
select count(*) as categorias_restantes from public.categories;

-- Debe salir vacío: la tienda no muestra nada hasta ejecutar seed.sql.
select title, slug, status from public.templates where status = 'published';

-- Plantillas conservadas por tener venta (archivadas, fuera de la web).
select t.title, t.slug, t.status, count(o.id) as pedidos
  from public.templates t
  join public.orders o on o.template_id = t.id
 group by t.id, t.title, t.slug, t.status;
