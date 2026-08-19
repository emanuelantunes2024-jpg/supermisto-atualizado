-- ============================================================
-- Leuname Software — datos de ejemplo
-- Ejecutar DESPUÉS de 0001_schema_inicial.sql.
--
-- GENERADO por scripts/generate-seed-sql.py desde src/lib/seed-data.ts.
-- No editar a mano: cambia el catálogo en el TypeScript y vuelve a generar.
-- ============================================================

insert into public.categories (id, name, slug, icon) values
  ('11111111-1111-4111-8111-000000000001', 'Restaurantes', 'restaurantes', '🍴'),
  ('11111111-1111-4111-8111-000000000002', 'Clínicas', 'clinicas', '🩺'),
  ('11111111-1111-4111-8111-000000000003', 'Inmobiliarias', 'inmobiliarias', '🏡'),
  ('11111111-1111-4111-8111-000000000004', 'Hoteles', 'hoteles', '🏨'),
  ('11111111-1111-4111-8111-000000000005', 'Tiendas Online', 'tiendas-online', '🛒'),
  ('11111111-1111-4111-8111-000000000006', 'Automotriz', 'automotriz', '🚗'),
  ('11111111-1111-4111-8111-000000000007', 'Salud & Belleza', 'salud-belleza', '💆'),
  ('11111111-1111-4111-8111-000000000008', 'Educación', 'educacion', '🎓')
on conflict (id) do update
  set name = excluded.name,
      slug = excluded.slug,
      icon = excluded.icon;

insert into public.templates
  (id, category_id, title, slug, short_description, full_description, price_cents, preview_url, thumbnail_url, features, status)
values
  ('22222222-2222-4222-8222-000000000001',
   '11111111-1111-4111-8111-000000000002',
   'Clínica Dental Premium', 'clinica-dental-premium',
   'Clínica dental completa: tratamientos, equipo, urgencias y cita previa online.',
   'Para clínicas dentales y consultas privadas: catálogo de 6 tratamientos con ficha propia, equipo de especialistas, franja de urgencias 24h, promoción de bienvenida, preguntas frecuentes y formulario de cita previa. Paleta blanco + azul que transmite confianza, higiene y tecnología.',
   19900, '/demos/clinica-dental-premium/index.html', '/thumbnails/clinica-dental-premium.jpg',
   '["Cita previa online con formulario validado", "6 tratamientos con ficha propia", "Equipo de especialistas", "Urgencias 24h y financiación", "Preguntas frecuentes (acordeón)", "Responsive (móvil, tablet y desktop)", "Optimizado para Google (SEO)"]'::jsonb,
   'published')

on conflict (id) do update
  set title             = excluded.title,
      slug              = excluded.slug,
      category_id       = excluded.category_id,
      short_description = excluded.short_description,
      full_description  = excluded.full_description,
      price_cents       = excluded.price_cents,
      preview_url       = excluded.preview_url,
      thumbnail_url     = excluded.thumbnail_url,
      features          = excluded.features,
      status            = excluded.status;
