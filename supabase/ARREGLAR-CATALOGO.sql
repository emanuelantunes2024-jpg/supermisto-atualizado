-- ============================================================
--  LEUNAME SOFTWARE — PONER EL CATÁLOGO NUEVO
--
--  QUÉ HACE, EN CRISTIANO
--    1. Borra las plantillas y las categorías VIEJAS (las cafeterías,
--       barberías y peluquerías que todavía salen al entrar en una
--       categoría de la web).
--    2. Carga las 31 CATEGORÍAS PREMIUM nuevas, en su orden.
--    3. Carga las plantillas ya terminadas (Clínica Dental, Agencia de
--       Viajes, Consultoría Legal y Restaurante) con su foto y su demo.
--
--  QUÉ NO TOCA — TRANQUILO
--    · Los pedidos y los clientes: no se borra ni una fila.
--    · Si alguna plantilla YA SE VENDIÓ no se borra: se guarda como
--      "archived". Sale de la tienda, pero el cliente que la compró
--      sigue pudiendo descargarla.
--
--  CÓMO SE USA
--    Supabase  >  SQL Editor  >  New query
--    Pegar TODO este archivo  >  botón RUN
--
--    Se puede ejecutar las veces que haga falta: no rompe nada.
--    Al terminar, abre tu web y recarga: ya salen las 31 categorías.
-- ============================================================


-- ------------------------------------------------------------
--  PASO 1 — fuera lo viejo
-- ------------------------------------------------------------

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
--  PASO 2 — cargar las 31 categorías y las plantillas
-- ------------------------------------------------------------
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
  ('11111111-1111-4111-8111-000000000030', 'Frutería y Verdulería', 'fruteria', '🥬'),
  ('11111111-1111-4111-8111-000000000031', 'Abogados y Consultoría Legal', 'abogados', '⚖️')
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
   'published'),

  ('22222222-2222-4222-8222-000000000002',
   '11111111-1111-4111-8111-000000000005',
   'Agencia de Viajes Premium', 'agencia-viajes-premium',
   'Agencia de viajes con buscador, destinos, paquetes y planificación a medida.',
   'Para agencias de viajes y turoperadores: buscador de viajes, carrusel de destinos destacados con precios y valoraciones, tarjetas de cruceros y ofertas, 8 tipos de viaje filtrables, paquetes preparados, testimonios, preguntas frecuentes, blog y formulario de propuesta a medida con validación. Paleta verde azulado + coral, tipografía Playfair Display.',
   21900, '/demos/agencia-viajes-premium/index.html', '/thumbnails/agencia-viajes-premium.jpg',
   '["Buscador de viajes funcional", "Carrusel de destinos con valoraciones", "8 tipos de viaje filtrables", "Paquetes y ofertas destacadas", "Formulario de propuesta con validación", "Preguntas frecuentes y blog", "Responsive (móvil, tablet y desktop)", "Optimizado para Google (SEO)"]'::jsonb,
   'published'),

  ('22222222-2222-4222-8222-000000000003',
   '11111111-1111-4111-8111-000000000031',
   'Consultoría Legal & Empresarial Premium', 'consultoria-legal-premium',
   'Despacho de abogados con 10 áreas de especialización, blog jurídico y formulario de consulta.',
   'Para despachos de abogados y consultoras: las 10 áreas más demandadas del derecho con ficha propia (empresarial, laboral, familia, inmobiliario, civil, penal, fiscal, comercial, propiedad intelectual y consultoría), proceso de trabajo en cuatro pasos, opiniones de clientes, blog jurídico, preguntas frecuentes y formulario de consulta con validación. Paleta azul noche + oro, tipografía Playfair Display. No necesita fotos: la balanza de la portada y los iconos de las áreas están dibujados en vectores, así que se ven nítidos en cualquier pantalla y la web carga al instante.',
   24900, '/demos/consultoria-legal-premium/index.html', '/thumbnails/consultoria-legal-premium.jpg',
   '["10 áreas de especialización con icono propio", "Formulario de consulta con validación", "Proceso de trabajo en cuatro pasos", "Blog jurídico y preguntas frecuentes", "Botones de WhatsApp, teléfono y email", "Sin fotos: todo en vectores, carga al instante", "Responsive (móvil, tablet y desktop)", "Optimizado para Google (SEO)"]'::jsonb,
   'published'),

  ('22222222-2222-4222-8222-000000000004',
   '11111111-1111-4111-8111-000000000020',
   'Restaurante Premium', 'restaurante-premium',
   'Restaurante de cocina de autor: carta con precios, reservas, galería y blog.',
   'Para restaurantes de cocina de autor y locales con carta de vinos: portada con carrusel de fotos, buscador de disponibilidad, seis secciones con foto propia, carta completa agrupada en entrantes, principales y postres con sus precios, cifras del local, opiniones que van rotando solas, galería, blog y formulario de reserva con validación (email, teléfono y fechas pasadas). Paleta negro + terracota + oro, tipografía Playfair Display. El dueño cambia la carta entera desde el panel escribiendo una línea por plato.',
   24900, '/demos/restaurante-premium/index.html', '/thumbnails/restaurante-premium.jpg',
   '["Carta completa con precios, editable línea a línea", "Portada con carrusel de hasta 4 fotos", "Buscador de disponibilidad y formulario de reserva", "Galería de 8 fotos y blog", "Opiniones de clientes que rotan solas", "Botón de WhatsApp para reservas", "Responsive (móvil, tablet y desktop)", "Optimizado para Google (SEO)"]'::jsonb,
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

-- ------------------------------------------------------------
--  PASO 3 — comprobación (mira los resultados de abajo)
-- ------------------------------------------------------------

-- Tienen que salir 31 categorías.
select count(*) as categorias_en_la_web from public.categories;

-- Tienen que salir las plantillas terminadas, en estado "published".
select title, slug, price_cents / 100 as precio_euros, status
  from public.templates
 where status = 'published'
 order by title;

-- Si vendiste algo antes, aquí sale archivado (fuera de la tienda,
-- pero el cliente sigue teniendo su descarga).
select title, slug, status from public.templates where status = 'archived';
