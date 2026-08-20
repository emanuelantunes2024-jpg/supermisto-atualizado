-- ============================================================
--  LEUNAME SOFTWARE — ACTUALIZAR EL CATÁLOGO
--
--  QUÉ HACE
--    1. Junta las tres categorías de restaurante en una sola.
--       Había "Restaurante", "Restaurantes" y "Restaurante Premium",
--       y eran la misma cosa repetida. Ahora hay UNA categoría,
--       "Restaurantes", y dentro viven las plantillas de cada nivel
--       y cada precio.
--    2. Carga (o actualiza) las categorías y las plantillas.
--
--  QUÉ NO TOCA
--    Pedidos y clientes: no se borra ni una fila.
--
--  Supabase  >  SQL Editor  >  New query  >  pegar todo  >  RUN
--  Se puede ejecutar las veces que haga falta.
-- ============================================================


-- ------------------------------------------------------------
--  ANTES
-- ------------------------------------------------------------

select 'ANTES' as momento,
       (select count(*) from public.categories)                           as categorias,
       (select count(*) from public.templates where status = 'published') as plantillas;


-- ------------------------------------------------------------
--  PASO 1 — juntar las categorías de restaurante en una sola
-- ------------------------------------------------------------

begin;

-- Todo lo que colgaba de las categorías repetidas pasa a "restaurante".
update public.templates
   set category_id = '11111111-1111-4111-8111-000000000007'
 where category_id in (
   select id from public.categories where slug in ('restaurantes', 'restaurante-premium')
 );

-- Y las repetidas se van, ya sin nada colgando.
delete from public.categories
 where slug in ('restaurantes', 'restaurante-premium');

commit;


-- ------------------------------------------------------------
--  PASO 2 — cargar las categorías y las plantillas
-- ------------------------------------------------------------

insert into public.categories (id, name, slug, icon) values
  ('11111111-1111-4111-8111-000000000001', 'Clínica Dental', 'clinica-dental', '🦷'),
  ('11111111-1111-4111-8111-000000000002', 'Clínica Veterinaria', 'clinica-veterinaria', '🐾'),
  ('11111111-1111-4111-8111-000000000003', 'Pet Shop', 'pet-shop', '🐕'),
  ('11111111-1111-4111-8111-000000000004', 'Agencia Inmobiliaria', 'inmobiliaria', '🏡'),
  ('11111111-1111-4111-8111-000000000005', 'Agencia de Viajes', 'agencia-viajes', '✈️'),
  ('11111111-1111-4111-8111-000000000006', 'Hotel', 'hotel', '🏨'),
  ('11111111-1111-4111-8111-000000000007', 'Restaurantes', 'restaurante', '🍽️'),
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
   '11111111-1111-4111-8111-000000000007',
   'Restaurante Premium', 'restaurante-premium',
   'Restaurante de cocina de autor: carta con precios, reservas, galería y blog.',
   'Para restaurantes de cocina de autor y locales con carta de vinos: portada con carrusel de fotos, buscador de disponibilidad, seis secciones con foto propia, carta completa agrupada en entrantes, principales y postres con sus precios, cifras del local, opiniones que van rotando solas, galería, blog y formulario de reserva con validación (email, teléfono y fechas pasadas). Paleta negro + terracota + oro, tipografía Playfair Display. El dueño cambia la carta entera desde el panel escribiendo una línea por plato.',
   24900, '/demos/restaurante-premium/index.html', '/thumbnails/restaurante-premium.jpg',
   '["Carta completa con precios, editable línea a línea", "Portada con carrusel de hasta 4 fotos", "Buscador de disponibilidad y formulario de reserva", "Galería de 8 fotos y blog", "Opiniones de clientes que rotan solas", "Botón de WhatsApp para reservas", "Responsive (móvil, tablet y desktop)", "Optimizado para Google (SEO)"]'::jsonb,
   'published'),

  ('22222222-2222-4222-8222-000000000005',
   '11111111-1111-4111-8111-000000000008',
   'Panadería con Pedidos Online', 'panaderia-premium',
   'Panadería con catálogo de productos, cesta y pedidos que llegan por WhatsApp.',
   'Para panaderías, pastelerías y cafeterías que quieren vender sin depender de las plataformas de reparto: catálogo de productos por categorías con filtros, cesta de la compra que recuerda lo que has elegido aunque cierres la página, elección entre recoger en tienda o entrega a domicilio con su coste y su pedido mínimo, y un formulario que arma el pedido completo y lo manda al WhatsApp del negocio, con productos, cantidades, totales, dirección y hora. Sin comisiones por pedido y sin pasarela de pago que configurar. Paleta crema + ámbar, tipografía Playfair Display.',
   19900, '/demos/panaderia-premium/index.html', '/thumbnails/panaderia-premium.jpg',
   '["Catálogo de productos con filtros por categoría", "Cesta de la compra que no se pierde al cerrar", "Recogida en tienda o entrega, con pedido mínimo", "El pedido llega entero por WhatsApp", "Sin comisiones y sin pasarela que configurar", "Horarios, historia del negocio y contacto", "Responsive (móvil, tablet y desktop)", "Optimizado para Google (SEO)"]'::jsonb,
   'published'),

  ('22222222-2222-4222-8222-000000000006',
   '11111111-1111-4111-8111-000000000002',
   'Clínica Veterinaria Premium', 'veterinaria-premium',
   'Clínica veterinaria con urgencias 24h, planes de salud mensuales y cita online.',
   'Para clínicas veterinarias y centros de salud animal: ocho servicios con ficha propia, franja de urgencias 24 horas con llamada directa, tres planes de salud por cuota mensual (cachorro, adulto y sénior) con el plan destacado resaltado en color, equipo con su especialidad, formulario de cita que pregunta qué animal es y valida teléfono, correo y fechas pasadas, opiniones y preguntas frecuentes. Paleta verde + melocotón, tipografía Playfair Display. No necesita fotos: la portada dibuja un perro y un gato ilustrados, los servicios llevan iconos y el equipo se muestra con sus iniciales, así que se ve nítido en cualquier pantalla y carga al instante.',
   22900, '/demos/veterinaria-premium/index.html', '/thumbnails/veterinaria-premium.jpg',
   '["Tres planes de salud por cuota mensual", "Franja de urgencias 24h con llamada directa", "8 servicios con icono propio", "Cita online que pregunta qué animal es", "Sin fotos: todo ilustrado, carga al instante", "Equipo, opiniones y preguntas frecuentes", "Responsive (móvil, tablet y desktop)", "Optimizado para Google (SEO)"]'::jsonb,
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
--  DESPUÉS — mira estos resultados
-- ------------------------------------------------------------

select 'DESPUÉS' as momento,
       (select count(*) from public.categories)                           as categorias,
       (select count(*) from public.templates where status = 'published') as plantillas;

-- Las plantillas publicadas, cada una con su categoría.
select t.title, t.slug, c.name as categoria, t.price_cents / 100 as euros
  from public.templates t
  left join public.categories c on c.id = t.category_id
 where t.status = 'published'
 order by c.name, t.price_cents desc;

-- Tiene que salir UNA sola fila de restaurante.
select name, slug from public.categories where slug like '%restaurante%';

-- Si aquí sale algo, esa plantilla se quedó sin categoría y por eso
-- no aparece en la web. Avísame si pasa.
select t.title, t.slug, t.category_id
  from public.templates t
  left join public.categories c on c.id = t.category_id
 where t.status = 'published' and c.id is null;
