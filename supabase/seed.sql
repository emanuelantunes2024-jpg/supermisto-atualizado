-- ============================================================
-- Leuname Software — datos de ejemplo
-- Ejecutar DESPUÉS de 0001_schema_inicial.sql.
-- Los ids coinciden con src/lib/seed-data.ts (catálogo de respaldo).
-- ============================================================

insert into public.categories (id, name, slug, icon) values
  ('11111111-1111-4111-8111-000000000001', 'Barberías',              'barberias',   '💈'),
  ('11111111-1111-4111-8111-000000000002', 'Cafeterías',             'cafeterias',  '☕'),
  ('11111111-1111-4111-8111-000000000003', 'Restaurantes',           'restaurantes','🍽️'),
  ('11111111-1111-4111-8111-000000000004', 'Tiendas de ropa',        'ropa',        '👕'),
  ('11111111-1111-4111-8111-000000000005', 'Prod. de limpieza',      'limpieza',    '🧴'),
  ('11111111-1111-4111-8111-000000000006', 'Belleza',                'belleza',     '💆'),
  ('11111111-1111-4111-8111-000000000007', 'Servicios profesionales','servicios',   '💼'),
  ('11111111-1111-4111-8111-000000000008', 'E-commerce',             'ecommerce',   '🛍️')
on conflict (id) do update
  set name = excluded.name,
      slug = excluded.slug,
      icon = excluded.icon;

insert into public.templates
  (id, category_id, title, slug, short_description, full_description, price_cents, preview_url, thumbnail_url, features, status)
values
  ('22222222-2222-4222-8222-000000000001',
   '11111111-1111-4111-8111-000000000001',
   'Barbería Premium', 'barberia-premium',
   'Diseño moderno y elegante con reservas integradas y galería de trabajos.',
   'Diseño moderno y elegante, perfecto para barberías que quieren destacar online y llenar su agenda de reservas. Incluye página de inicio con hero de impacto, listado de servicios con precios, presentación del equipo, galería de trabajos, testimonios y formulario de contacto con botón directo de WhatsApp.',
   14900, '/demos/barberia/index.html', '/thumbnails/barberia-premium.jpg',
   '["Diseño 100% personalizable","Responsive (móvil, tablet y desktop)","Sistema de reservas integrado","Galería de trabajos","Botón directo de WhatsApp","Optimizado para Google (SEO)"]'::jsonb,
   'published'),

  ('22222222-2222-4222-8222-000000000002',
   '11111111-1111-4111-8111-000000000001',
   'Barbería Clásica', 'barberia-clasica',
   'Estilo vintage, ideal para barberías tradicionales con historia.',
   'Estética vintage con tipografía de máquina de escribir y paleta cálida. Pensada para barberías tradicionales que quieren transmitir oficio y años de experiencia sin renunciar a una web rápida y moderna.',
   13900, null, '/thumbnails/barberia-clasica.jpg',
   '["Diseño 100% personalizable","Responsive (móvil, tablet y desktop)","Sección de historia de la barbería","Lista de precios por servicio","Mapa de ubicación integrado","Optimizado para Google (SEO)"]'::jsonb,
   'published'),

  ('22222222-2222-4222-8222-000000000003',
   '11111111-1111-4111-8111-000000000002',
   'Cafetería Artesanal', 'cafeteria-artesanal',
   'Menú digital, pedidos online y ambiente cálido para cafeterías boutique.',
   'Pensada para cafeterías de especialidad: carta digital por categorías, historia del tostado, galería del local y formulario de reserva. Ambiente cálido, tipografía amable y fotografía como protagonista.',
   12900, null, '/thumbnails/cafeteria-artesanal.jpg',
   '["Menú digital editable","Pedidos online por WhatsApp","Galería del local","Horarios y ubicación","Responsive (móvil, tablet y desktop)","Optimizado para Google (SEO)"]'::jsonb,
   'published'),

  ('22222222-2222-4222-8222-000000000004',
   '11111111-1111-4111-8111-000000000003',
   'Restaurante Gourmet', 'restaurante-gourmet',
   'Carta interactiva, reservas de mesa y sección de eventos privados.',
   'Plantilla premium para restaurantes: carta interactiva con filtros por tipo de plato, reserva de mesa, presentación del chef, sección de eventos privados y galería de sala. Diseño oscuro y elegante que hace destacar la fotografía de los platos.',
   15900, null, '/thumbnails/restaurante-gourmet.jpg',
   '["Carta interactiva con filtros","Reserva de mesa online","Sección de eventos privados","Galería de sala y platos","Multi-idioma preparado","Optimizado para Google (SEO)"]'::jsonb,
   'published'),

  ('22222222-2222-4222-8222-000000000005',
   '11111111-1111-4111-8111-000000000004',
   'Tienda Urbana', 'tienda-urbana',
   'Catálogo de productos, carrito de compra y checkout listo para usar.',
   'Tienda de ropa con catálogo por colecciones, ficha de producto con selector de talla y color, carrito de compra y checkout preparado para conectar con tu pasarela de pago. Estética urbana y limpia.',
   13900, null, '/thumbnails/tienda-urbana.jpg',
   '["Catálogo por colecciones","Ficha de producto con tallas y colores","Carrito de compra","Checkout preparado para pasarela de pago","Responsive (móvil, tablet y desktop)","Optimizado para Google (SEO)"]'::jsonb,
   'published'),

  ('22222222-2222-4222-8222-000000000006',
   '11111111-1111-4111-8111-000000000005',
   'Clean Pro Services', 'clean-pro-services',
   'Presenta servicios de limpieza con solicitud de presupuesto en un clic.',
   'Ideal para empresas de limpieza y mantenimiento: listado de servicios con iconos, formulario de presupuesto en varios pasos, zona de cobertura y galería de antes/después. Transmite confianza y profesionalidad.',
   11900, null, '/thumbnails/clean-pro-services.jpg',
   '["Formulario de presupuesto en varios pasos","Listado de servicios con iconos","Galería antes / después","Zona de cobertura","Responsive (móvil, tablet y desktop)","Optimizado para Google (SEO)"]'::jsonb,
   'published'),

  ('22222222-2222-4222-8222-000000000007',
   '11111111-1111-4111-8111-000000000006',
   'Studio Belleza', 'studio-belleza',
   'Agenda de citas, catálogo de tratamientos y testimonios de clientas.',
   'Plantilla para centros de estética y peluquerías: catálogo de tratamientos con duración y precio, agenda de citas, presentación del equipo y testimonios. Paleta suave y elegante, totalmente editable.',
   13500, null, '/thumbnails/studio-belleza.jpg',
   '["Agenda de citas online","Catálogo de tratamientos con precios","Presentación del equipo","Testimonios de clientas","Responsive (móvil, tablet y desktop)","Optimizado para Google (SEO)"]'::jsonb,
   'published'),

  ('22222222-2222-4222-8222-000000000008',
   '11111111-1111-4111-8111-000000000007',
   'Consultora Pro', 'consultora-pro',
   'Presenta servicios profesionales y agenda consultas online.',
   'Para consultoras, despachos y profesionales independientes: propuesta de valor clara, servicios detallados, casos de éxito, equipo y agenda de consultas. Diseño corporativo sobrio y muy legible.',
   14500, null, '/thumbnails/consultora-pro.jpg',
   '["Agenda de consultas online","Sección de casos de éxito","Presentación del equipo","Blog / recursos incluido","Responsive (móvil, tablet y desktop)","Optimizado para Google (SEO)"]'::jsonb,
   'published'),

  ('22222222-2222-4222-8222-000000000009',
   '11111111-1111-4111-8111-000000000008',
   'Market Plus', 'market-plus',
   'Tienda online completa multi-categoría con pagos integrados.',
   'E-commerce completo multi-categoría: buscador, filtros, ficha de producto, carrito, cupones de descuento y checkout. La plantilla más completa del catálogo, preparada para catálogos grandes.',
   16900, null, '/thumbnails/market-plus.jpg',
   '["Catálogo multi-categoría con buscador","Filtros por precio y atributos","Carrito y cupones de descuento","Checkout preparado para pasarela de pago","Panel de pedidos incluido","Optimizado para Google (SEO)"]'::jsonb,
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
