-- ============================================================
-- LIMPIAR EL CATÁLOGO ANTIGUO
--
-- Ejecutar UNA VEZ en Supabase → SQL Editor, y DESPUÉS ejecutar
-- supabase/seed.sql para cargar las 30 categorías premium nuevas.
--
-- ⚠️  Borra también los pedidos de prueba, porque cada pedido apunta
--     a una plantilla y la base no deja borrar una plantilla que tenga
--     pedidos. Hazlo solo mientras no haya ventas reales.
-- ============================================================

delete from public.downloads;
delete from public.orders;
delete from public.templates;
delete from public.categories;

-- Comprobación: las cuatro tablas deben quedar a 0.
select
  (select count(*) from public.categories) as categorias,
  (select count(*) from public.templates)  as plantillas,
  (select count(*) from public.orders)     as pedidos;
