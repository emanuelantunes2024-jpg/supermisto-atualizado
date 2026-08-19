-- ============================================================
-- Leuname Software — datos de ejemplo
-- Ejecutar DESPUÉS de 0001_schema_inicial.sql.
--
-- GENERADO por scripts/generate-seed-sql.py desde src/lib/seed-data.ts.
-- No editar a mano: cambia el catálogo en el TypeScript y vuelve a generar.
-- ============================================================

insert into public.categories (id, name, slug, icon) values
  ('11111111-1111-4111-8111-000000000001', 'Clínica Dental', 'clinica-dental', '🦷'),
  ('11111111-1111-4111-8111-000000000002', 'Clínica Veterinaria', 'clinica-veterinaria', '🐾'),
  ('11111111-1111-4111-8111-000000000003', 'Pet Shop', 'pet-shop', '🐕'),
  ('11111111-1111-4111-8111-000000000004', 'Agencia Inmobiliaria', 'inmobiliaria', '🏡'),
  ('11111111-1111-4111-8111-000000000005', 'Agencia de Viajes', 'agencia-viajes', '✈️'),
  ('11111111-1111-4111-8111-000000000006', 'Hotel', 'hotel', '🏨'),
  ('11111111-1111-4111-8111-000000000007', 'Restaurante', 'restaurante', '🍽️'),
  ('11111111-1111-4111-8111-000000000008', 'Panadería', 'panaderia', '🥖'),
  ('11111111-1111-4111-8111-000000000009', 'Boutique de Moda', 'boutique-moda', '👗'),
  ('11111111-1111-4111-8111-000000000010', 'Muebles y Decoración', 'muebles-decoracion', '🛋️'),
  ('11111111-1111-4111-8111-000000000011', 'Taller Mecánico', 'taller-mecanico', '🔧'),
  ('11111111-1111-4111-8111-000000000012', 'Piezas Automotrices', 'piezas-auto', '⚙️'),
  ('11111111-1111-4111-8111-000000000013', 'Taller de Motos', 'taller-motos', '🏍️'),
  ('11111111-1111-4111-8111-000000000014', 'Piezas para Moto', 'piezas-moto', '🔩'),
  ('11111111-1111-4111-8111-000000000015', 'Pizzería', 'pizzeria', '🍕'),
  ('11111111-1111-4111-8111-000000000016', 'Materiales de Construcción', 'materiales-construccion', '🧱'),
  ('11111111-1111-4111-8111-000000000017', 'Obras y Construcción', 'obras-construccion', '🏗️'),
  ('11111111-1111-4111-8111-000000000018', 'Pesca', 'pesca', '🎣'),
  ('11111111-1111-4111-8111-000000000019', 'Restaurantes', 'restaurantes', '🍴'),
  ('11111111-1111-4111-8111-000000000020', 'Restaurante Premium', 'restaurante-premium', '🍷'),
  ('11111111-1111-4111-8111-000000000021', 'Energía Solar', 'energia-solar', '☀️'),
  ('11111111-1111-4111-8111-000000000022', 'Mudanzas y Transportes', 'mudanzas-transportes', '🚚'),
  ('11111111-1111-4111-8111-000000000023', 'Electrónica', 'electronica', '📱'),
  ('11111111-1111-4111-8111-000000000024', 'Hamburguesería', 'hamburgueseria', '🍔'),
  ('11111111-1111-4111-8111-000000000025', 'Alquiler de Coches', 'alquiler-coches', '🚗'),
  ('11111111-1111-4111-8111-000000000026', 'Concesionaria de Automóviles', 'concesionaria', '🚘'),
  ('11111111-1111-4111-8111-000000000027', 'Instrumentos Musicales', 'instrumentos-musicales', '🎸'),
  ('11111111-1111-4111-8111-000000000028', 'Perfumería', 'perfumeria', '🧴'),
  ('11111111-1111-4111-8111-000000000029', 'Relojería', 'relojeria', '⌚'),
  ('11111111-1111-4111-8111-000000000030', 'Frutería y Verdulería', 'fruteria', '🥬')
on conflict (id) do update
  set name = excluded.name,
      slug = excluded.slug,
      icon = excluded.icon;

insert into public.templates
  (id, category_id, title, slug, short_description, full_description, price_cents, preview_url, thumbnail_url, features, status)
values
  ('22222222-2222-4222-8222-000000000001',
   '11111111-1111-4111-8111-000000000001',
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
