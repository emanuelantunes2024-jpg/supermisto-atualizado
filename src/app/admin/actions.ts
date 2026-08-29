"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/auth";
import { slugify } from "@/lib/format";
import { createAdminClient, TEMPLATE_ASSETS_BUCKET, TEMPLATE_FILES_BUCKET } from "@/lib/supabase/admin";
import type { TemplateStatus } from "@/lib/types";

export interface ActionState {
  error?: string;
  success?: string;
}

const STATUSES: TemplateStatus[] = ["draft", "published", "archived"];

function revalidateStorefront(slug?: string) {
  revalidatePath("/");
  revalidatePath("/plantillas");
  revalidatePath("/admin/plantillas");
  if (slug) {
    revalidatePath(`/plantillas/${slug}`);
    // La página de la demo a pantalla completa es una ruta aparte (SSG con
    // su propio caché): sin esto, "Ver demo completa" podía seguir sirviendo
    // durante minutos la versión vieja de preview_url tras guardar cambios.
    revalidatePath(`/plantillas/${slug}/demo`);
  }
}

/** Crea o actualiza una plantilla desde el formulario del panel. */
export async function saveTemplate(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const session = await requireAdmin();
  if (!session) return { error: "No tienes permisos para esta acción." };

  const supabase = createAdminClient();
  if (!supabase) return { error: "Supabase no está configurado (falta SUPABASE_SERVICE_ROLE_KEY)." };

  const id = String(formData.get("id") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const categoryId = String(formData.get("category_id") ?? "").trim();
  const priceEuros = Number(String(formData.get("price") ?? "").replace(",", "."));
  const status = String(formData.get("status") ?? "draft") as TemplateStatus;

  if (!title) return { error: "El título es obligatorio." };
  if (!categoryId) return { error: "Selecciona una categoría." };
  if (!Number.isFinite(priceEuros) || priceEuros <= 0) return { error: "Introduce un precio válido en euros." };
  if (!STATUSES.includes(status)) return { error: "Estado no válido." };

  const slug = slugify(String(formData.get("slug") ?? "") || title);
  if (!slug) return { error: "No se ha podido generar el slug a partir del título." };

  const features = String(formData.get("features") ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const tags = String(formData.get("tags") ?? "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

  const compareAtRaw = String(formData.get("compare_at_price") ?? "").replace(",", ".").trim();
  const compareAtEuros = compareAtRaw ? Number(compareAtRaw) : null;
  const compareAtPriceCents =
    compareAtEuros && Number.isFinite(compareAtEuros) && compareAtEuros > 0
      ? Math.round(compareAtEuros * 100)
      : null;

  // Imagen principal: si se sube una específica, sustituye a la miniatura de respaldo.
  const mainImageUrl = String(formData.get("image_main") ?? "").trim();

  const payload = {
    title,
    slug,
    category_id: categoryId,
    short_description: String(formData.get("short_description") ?? "").trim(),
    full_description: String(formData.get("full_description") ?? "").trim(),
    price_cents: Math.round(priceEuros * 100),
    compare_at_price_cents: compareAtPriceCents,
    preview_url: String(formData.get("preview_url") ?? "").trim() || null,
    thumbnail_url: mainImageUrl || String(formData.get("thumbnail_url") ?? "").trim() || null,
    file_url: String(formData.get("file_url") ?? "").trim() || null,
    features,
    tags,
    featured: formData.get("featured") === "1",
    status,
    updated_at: new Date().toISOString(),
  };

  let templateId = id;
  if (id) {
    const { error } = await supabase.from("templates").update(payload).eq("id", id);
    if (error) return { error: translate(error.message) };
  } else {
    const { data, error } = await supabase.from("templates").insert(payload).select("id").single();
    if (error) return { error: translate(error.message) };
    templateId = data.id;
  }

  await saveProductImages(supabase, templateId, formData);

  revalidateStorefront(slug);
  redirect("/admin/plantillas?guardado=1");
}

/** Reemplaza las imágenes por dispositivo/galería de una plantilla con las que llegan del formulario. */
async function saveProductImages(
  supabase: ReturnType<typeof createAdminClient>,
  templateId: string,
  formData: FormData,
) {
  if (!supabase || !templateId) return;

  const rows: { template_id: string; kind: string; url: string; sort_order: number }[] = [];

  for (const kind of ["main", "desktop", "laptop", "tablet", "mobile"]) {
    const url = String(formData.get(`image_${kind}`) ?? "").trim();
    if (url) rows.push({ template_id: templateId, kind, url, sort_order: 0 });
  }

  const galleryUrls = String(formData.get("gallery_urls") ?? "")
    .split("\n")
    .map((url) => url.trim())
    .filter(Boolean);
  galleryUrls.forEach((url, index) => {
    rows.push({ template_id: templateId, kind: "gallery", url, sort_order: index });
  });

  // Se borra y se vuelve a insertar: más simple que un upsert por tipo y evita
  // dejar huérfanas las imágenes que el admin acaba de quitar en el formulario.
  await supabase.from("product_images").delete().eq("template_id", templateId);
  if (rows.length > 0) await supabase.from("product_images").insert(rows);
}

/** Duplica una plantilla (y sus imágenes) como borrador, para partir de una ya hecha. */
export async function duplicateTemplate(formData: FormData): Promise<void> {
  const session = await requireAdmin();
  if (!session) return;

  const supabase = createAdminClient();
  if (!supabase) return;

  const id = String(formData.get("id") ?? "").trim();
  if (!id) return;

  const { data: original } = await supabase.from("templates").select("*").eq("id", id).maybeSingle();
  if (!original) return;

  const baseSlug = `${original.slug}-copia`;
  let slug = baseSlug;
  for (let i = 2; i < 50; i++) {
    const { data: exists } = await supabase.from("templates").select("id").eq("slug", slug).maybeSingle();
    if (!exists) break;
    slug = `${baseSlug}-${i}`;
  }

  const { id: _oldId, created_at: _createdAt, updated_at: _updatedAt, ...rest } = original;
  const { data: copy, error } = await supabase
    .from("templates")
    .insert({ ...rest, title: `${original.title} (copia)`, slug, status: "draft" })
    .select("id")
    .single();

  if (error || !copy) {
    redirect(`/admin/plantillas?error=${encodeURIComponent(error?.message ?? "No se pudo duplicar")}`);
  }

  const { data: images } = await supabase.from("product_images").select("kind, url, sort_order").eq("template_id", id);
  if (images && images.length > 0) {
    await supabase
      .from("product_images")
      .insert(images.map((img) => ({ ...img, template_id: copy.id })));
  }

  revalidateStorefront();
  redirect("/admin/plantillas?duplicado=1");
}

/** Alterna "destacado" desde el listado, sin abrir el editor completo. */
export async function toggleFeatured(formData: FormData): Promise<void> {
  const session = await requireAdmin();
  if (!session) return;

  const supabase = createAdminClient();
  if (!supabase) return;

  const id = String(formData.get("id") ?? "");
  const featured = String(formData.get("featured") ?? "") === "1";
  if (!id) return;

  await supabase.from("templates").update({ featured, updated_at: new Date().toISOString() }).eq("id", id);
  revalidateStorefront();
}

/** Borra una plantilla por completo (fila de la tabla). Los archivos que ya subió a Storage no se tocan. */
export async function deleteTemplate(formData: FormData): Promise<void> {
  const session = await requireAdmin();
  if (!session) return;

  const supabase = createAdminClient();
  if (!supabase) return;

  const id = String(formData.get("id") ?? "").trim();
  if (!id) return;

  const { data: template } = await supabase.from("templates").select("slug").eq("id", id).maybeSingle();

  const { error } = await supabase.from("templates").delete().eq("id", id);

  revalidateStorefront(template?.slug ?? undefined);

  if (error) {
    // Lo más habitual: hay pedidos que apuntan a esta plantilla y la base de
    // datos no deja borrarla sin borrar antes esos pedidos. Antes esto
    // fallaba en silencio y parecía que el botón "Eliminar" no hacía nada.
    redirect(`/admin/plantillas?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/admin/plantillas?eliminado=1");
}

/** Cambia el estado de una plantilla (publicar / archivar / volver a borrador). */
export async function setTemplateStatus(formData: FormData): Promise<void> {
  const session = await requireAdmin();
  if (!session) return;

  const supabase = createAdminClient();
  if (!supabase) return;

  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "") as TemplateStatus;
  if (!id || !STATUSES.includes(status)) return;

  await supabase
    .from("templates")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id);

  revalidateStorefront();
}

/**
 * Prepara una URL firmada de subida directa a Supabase Storage: el archivo
 * viaja del navegador al bucket sin pasar por esta función, así que no hay
 * límite de tamaño de las Server Actions (los .zip de plantillas con muchas
 * fotos pueden pesar varios MB). Devuelve lo que el navegador necesita para
 * subir con `uploadToSignedUrl`.
 */
export async function createUploadTicket(
  _prev: ActionState & { path?: string; token?: string; bucket?: string },
  formData: FormData,
): Promise<ActionState & { path?: string; token?: string; bucket?: string }> {
  const session = await requireAdmin();
  if (!session) return { error: "No tienes permisos para esta acción." };

  const supabase = createAdminClient();
  if (!supabase) return { error: "Supabase no está configurado (falta SUPABASE_SERVICE_ROLE_KEY)." };

  const kind = String(formData.get("kind") ?? "asset");
  const slug = slugify(String(formData.get("slug") ?? "plantilla")) || "plantilla";
  const filename = String(formData.get("filename") ?? "");
  if (!filename) return { error: "Falta el nombre del archivo." };

  const isPrivate = kind === "file";
  const bucket = isPrivate ? TEMPLATE_FILES_BUCKET : TEMPLATE_ASSETS_BUCKET;
  const extension = filename.split(".").pop()?.toLowerCase() || "bin";
  const objectPath = `${slug}/${Date.now()}.${extension}`;

  const { data, error } = await supabase.storage.from(bucket).createSignedUploadUrl(objectPath);
  if (error || !data) return { error: `No se pudo preparar la subida: ${error?.message ?? "error desconocido"}` };

  return { success: "ok", path: objectPath, token: data.token, bucket };
}

/* ------------------------------------------------------------------ */
/* Contenido de la portada (hero, beneficios, destacados, why-us, newsletter) */
/* ------------------------------------------------------------------ */

async function upsertHomepageSection(key: string, content: unknown): Promise<ActionState> {
  const session = await requireAdmin();
  if (!session) return { error: "No tienes permisos para esta acción." };

  const supabase = createAdminClient();
  if (!supabase) return { error: "Supabase no está configurado (falta SUPABASE_SERVICE_ROLE_KEY)." };

  const { error } = await supabase
    .from("homepage_sections")
    .upsert({ key, content, updated_at: new Date().toISOString() });

  if (error) return { error: `Error al guardar: ${error.message}` };

  revalidatePath("/");
  revalidatePath("/admin/contenido");
  return { success: "✓ Cambios guardados." };
}

export async function updateHeroSection(_prev: ActionState, formData: FormData): Promise<ActionState> {
  return upsertHomepageSection("hero", {
    eyebrow: String(formData.get("eyebrow") ?? "").trim(),
    title: String(formData.get("title") ?? "").trim(),
    subtitle: String(formData.get("subtitle") ?? "").trim(),
    image_url: String(formData.get("image_url") ?? "").trim() || null,
    button_text: String(formData.get("button_text") ?? "").trim(),
    button_href: String(formData.get("button_href") ?? "").trim() || "/plantillas",
    search_placeholder: String(formData.get("search_placeholder") ?? "").trim(),
    trust_badges: String(formData.get("trust_badges") ?? "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
  });
}

export async function updateBenefits(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const benefits = [1, 2, 3, 4].map((i) => ({
    icon: String(formData.get(`icon_${i}`) ?? "").trim() || "sparkles",
    title: String(formData.get(`title_${i}`) ?? "").trim(),
    text: String(formData.get(`text_${i}`) ?? "").trim(),
  }));
  return upsertHomepageSection("benefits", benefits);
}

export async function updateFeaturedSelection(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const categories = formData.getAll("featured_categories").map(String);
  const templates = formData.getAll("featured_templates").map(String);

  const r1 = await upsertHomepageSection("featured_categories", categories);
  if (r1.error) return r1;
  return upsertHomepageSection("featured_templates", templates);
}

export async function updateWhyUs(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const stats = [1, 2, 3, 4].map((i) => ({
    value: String(formData.get(`stat_value_${i}`) ?? "").trim(),
    label: String(formData.get(`stat_label_${i}`) ?? "").trim(),
  }));
  return upsertHomepageSection("why_us", {
    title: String(formData.get("title") ?? "").trim(),
    text: String(formData.get("text") ?? "").trim(),
    button_text: String(formData.get("button_text") ?? "").trim(),
    button_href: String(formData.get("button_href") ?? "").trim() || "/contacto",
    stats,
  });
}

export async function updateNewsletterSection(_prev: ActionState, formData: FormData): Promise<ActionState> {
  return upsertHomepageSection("newsletter", {
    title: String(formData.get("title") ?? "").trim(),
    subtitle: String(formData.get("subtitle") ?? "").trim(),
    button_text: String(formData.get("button_text") ?? "").trim(),
  });
}

/* ------------------------------------------------------------------ */
/* Testimonios                                                         */
/* ------------------------------------------------------------------ */

export async function saveTestimonial(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const session = await requireAdmin();
  if (!session) return { error: "No tienes permisos para esta acción." };

  const supabase = createAdminClient();
  if (!supabase) return { error: "Supabase no está configurado (falta SUPABASE_SERVICE_ROLE_KEY)." };

  const id = String(formData.get("id") ?? "").trim();
  const customerName = String(formData.get("customer_name") ?? "").trim();
  const comment = String(formData.get("comment") ?? "").trim();
  if (!customerName) return { error: "El nombre es obligatorio." };
  if (!comment) return { error: "El comentario es obligatorio." };

  const payload = {
    customer_name: customerName,
    role: String(formData.get("role") ?? "").trim() || null,
    avatar_url: String(formData.get("avatar_url") ?? "").trim() || null,
    comment,
    rating: Math.min(5, Math.max(1, Number(formData.get("rating") ?? 5))),
    sort_order: Number(formData.get("sort_order") ?? 0),
    is_published: formData.get("is_published") === "1",
  };

  if (id) {
    const { error } = await supabase.from("testimonials").update(payload).eq("id", id);
    if (error) return { error: `Error al guardar: ${error.message}` };
  } else {
    const { error } = await supabase.from("testimonials").insert(payload);
    if (error) return { error: `Error al crear: ${error.message}` };
  }

  revalidatePath("/");
  revalidatePath("/admin/testimonios");
  return { success: "✓ Testimonio guardado." };
}

export async function deleteTestimonial(formData: FormData): Promise<void> {
  const session = await requireAdmin();
  if (!session) return;

  const supabase = createAdminClient();
  if (!supabase) return;

  const id = String(formData.get("id") ?? "").trim();
  if (!id) return;

  await supabase.from("testimonials").delete().eq("id", id);
  revalidatePath("/");
  revalidatePath("/admin/testimonios");
}

/* ------------------------------------------------------------------ */
/* Configuración general del sitio                                     */
/* ------------------------------------------------------------------ */

export async function saveSiteSettings(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const session = await requireAdmin();
  if (!session) return { error: "No tienes permisos para esta acción." };

  const supabase = createAdminClient();
  if (!supabase) return { error: "Supabase no está configurado (falta SUPABASE_SERVICE_ROLE_KEY)." };

  const payload = {
    id: true,
    company_name: String(formData.get("company_name") ?? "").trim() || "Leuname Software",
    logo_url: String(formData.get("logo_url") ?? "").trim() || null,
    favicon_url: String(formData.get("favicon_url") ?? "").trim() || null,
    email: String(formData.get("email") ?? "").trim() || null,
    phone: String(formData.get("phone") ?? "").trim() || null,
    whatsapp: String(formData.get("whatsapp") ?? "").trim() || null,
    address: String(formData.get("address") ?? "").trim() || null,
    currency: String(formData.get("currency") ?? "EUR").trim() || "EUR",
    language: String(formData.get("language") ?? "es").trim() || "es",
    social: {
      facebook: String(formData.get("social_facebook") ?? "").trim(),
      instagram: String(formData.get("social_instagram") ?? "").trim(),
      twitter: String(formData.get("social_twitter") ?? "").trim(),
      youtube: String(formData.get("social_youtube") ?? "").trim(),
    },
    footer_text: String(formData.get("footer_text") ?? "").trim() || null,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase.from("site_settings").upsert(payload);
  if (error) return { error: `Error al guardar: ${error.message}` };

  revalidatePath("/");
  revalidatePath("/admin/configuracion");
  return { success: "✓ Configuración guardada." };
}

function translate(message: string): string {
  if (message.includes("duplicate key") && message.includes("slug")) {
    return "Ya existe una plantilla con ese slug. Cambia el título o el slug.";
  }
  return `Error al guardar: ${message}`;
}

/** Crea una categoría nueva (tabla `categories`). */
export async function createCategory(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const session = await requireAdmin();
  if (!session) return { error: "No tienes permisos para esta acción." };

  const supabase = createAdminClient();
  if (!supabase) return { error: "Supabase no está configurado (falta SUPABASE_SERVICE_ROLE_KEY)." };

  const name = String(formData.get("name") ?? "").trim();
  const icon = String(formData.get("icon") ?? "").trim() || "🏷️";
  if (!name) return { error: "El nombre de la categoría es obligatorio." };

  const slug = slugify(String(formData.get("slug") ?? "") || name);
  if (!slug) return { error: "No se ha podido generar el slug a partir del nombre." };

  const description = String(formData.get("description") ?? "").trim() || null;
  const imageUrl = String(formData.get("image_url") ?? "").trim() || null;
  const sortOrder = Number(formData.get("sort_order") ?? 0) || 0;

  const { error } = await supabase
    .from("categories")
    .insert({ name, slug, icon, description, image_url: imageUrl, sort_order: sortOrder });
  if (error) {
    if (error.message.includes("duplicate key")) {
      return { error: "Ya existe una categoría con ese slug." };
    }
    return { error: `Error al crear la categoría: ${error.message}` };
  }

  revalidatePath("/admin/categorias");
  revalidatePath("/admin/plantillas/nueva");
  revalidatePath("/");
  return { success: "✓ Categoría creada. Ya puedes elegirla al crear una plantilla." };
}

/** Edita una categoría existente (nombre, icono, descripción, imagen, orden). */
export async function updateCategory(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const session = await requireAdmin();
  if (!session) return { error: "No tienes permisos para esta acción." };

  const supabase = createAdminClient();
  if (!supabase) return { error: "Supabase no está configurado (falta SUPABASE_SERVICE_ROLE_KEY)." };

  const id = String(formData.get("id") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  if (!id) return { error: "Falta el identificador de la categoría." };
  if (!name) return { error: "El nombre es obligatorio." };

  const slug = slugify(String(formData.get("slug") ?? "") || name);

  const payload = {
    name,
    slug,
    icon: String(formData.get("icon") ?? "").trim() || "🏷️",
    description: String(formData.get("description") ?? "").trim() || null,
    image_url: String(formData.get("image_url") ?? "").trim() || null,
    sort_order: Number(formData.get("sort_order") ?? 0) || 0,
  };

  const { error } = await supabase.from("categories").update(payload).eq("id", id);
  if (error) return { error: `Error al guardar: ${error.message}` };

  revalidatePath("/admin/categorias");
  revalidatePath("/");
  return { success: "✓ Categoría actualizada." };
}

/** Elimina una categoría (falla si tiene plantillas asociadas). */
export async function deleteCategory(formData: FormData): Promise<void> {
  const session = await requireAdmin();
  if (!session) return;

  const supabase = createAdminClient();
  if (!supabase) return;

  const id = String(formData.get("id") ?? "").trim();
  if (!id) return;

  const { error } = await supabase.from("categories").delete().eq("id", id);
  revalidatePath("/admin/categorias");
  revalidatePath("/");

  if (error) {
    redirect(`/admin/categorias?error=${encodeURIComponent(error.message)}`);
  }
}

/**
 * Sube la demo: acepta un único archivo "1-VER-LA-WEB.html" (todo inline:
 * css, js y fotos en base64 dentro del mismo archivo — la forma más simple y
 * a prueba de fallos, sin rutas relativas que puedan romperse) o, si hace
 * falta, un .zip con index.html + css/js/img sueltos. Sube al bucket público
 * y devuelve la URL directa — lista para pegar en "URL de la demo en vivo".
 */
export async function uploadTemplateDemo(
  _prev: ActionState & { path?: string },
  formData: FormData,
): Promise<ActionState & { path?: string }> {
  const session = await requireAdmin();
  if (!session) return { error: "No tienes permisos para esta acción." };

  const supabase = createAdminClient();
  if (!supabase) return { error: "Supabase no está configurado (falta SUPABASE_SERVICE_ROLE_KEY)." };

  const file = formData.get("file");
  const slug = slugify(String(formData.get("slug") ?? "plantilla")) || "plantilla";

  if (!(file instanceof File) || file.size === 0) return { error: "Selecciona el archivo de la demo." };

  // Caso simple: un único .html con todo inline (p. ej. "1-VER-LA-WEB.html").
  if (file.name.toLowerCase().endsWith(".html")) {
    const bytes = new Uint8Array(await file.arrayBuffer());
    const objectPath = `${slug}/demo-${Date.now()}/index.html`;
    const blob = new Blob([bytes as unknown as BlobPart], { type: "text/html" });
    const { error } = await supabase.storage
      .from(TEMPLATE_ASSETS_BUCKET)
      .upload(objectPath, blob, { contentType: "text/html", upsert: false });
    if (error) return { error: `No se pudo subir el archivo: ${error.message}` };

    const { data } = supabase.storage.from(TEMPLATE_ASSETS_BUCKET).getPublicUrl(objectPath);
    return { success: "✓ Demo publicada.", path: data.publicUrl };
  }

  if (!file.name.toLowerCase().endsWith(".zip")) {
    return { error: "El archivo debe ser un .html (recomendado) o un .zip." };
  }

  const JSZip = (await import("jszip")).default;
  let zip: InstanceType<typeof JSZip>;
  try {
    zip = await JSZip.loadAsync(await file.arrayBuffer());
  } catch {
    return { error: "No se ha podido leer el .zip. ¿Está corrupto?" };
  }

  const allEntries = Object.values(zip.files).filter((entry) => !entry.dir);
  if (allEntries.length === 0) return { error: "El .zip está vacío." };
  if (allEntries.length > 800) return { error: "El .zip tiene demasiados archivos (máximo 800)." };

  // Busca el index.html estando donde esté dentro del .zip: así da igual que
  // suban solo la carpeta de demo (index.html en la raíz) o el paquete
  // completo de venta (que trae el index.html dentro de
  // "3-DEMO-EN-CARPETA/", junto a otros archivos que no son la demo). Se
  // toma el que esté menos anidado y solo se sube lo que cuelga de su
  // carpeta, ignorando el resto del paquete.
  const withPaths = allEntries.map((entry) => ({ entry, path: entry.name.replace(/^\/+/, "") }));
  const indexCandidates = withPaths
    .filter(({ path }) => path.toLowerCase().split("/").pop() === "index.html")
    .sort((a, b) => a.path.split("/").length - b.path.split("/").length);

  if (indexCandidates.length === 0) {
    return { error: 'El .zip no contiene ningún "index.html" (ni suelto ni dentro de una carpeta).' };
  }

  const indexRelDir = indexCandidates[0].path.split("/").slice(0, -1).join("/");
  const rootPrefix = indexRelDir ? `${indexRelDir}/` : "";
  const entries = withPaths
    .filter(({ path }) => path.startsWith(rootPrefix))
    .map(({ entry }) => entry);

  const stamp = Date.now();
  const basePath = `${slug}/demo-${stamp}`;
  const mime: Record<string, string> = {
    html: "text/html", css: "text/css", js: "application/javascript",
    json: "application/json", jpg: "image/jpeg", jpeg: "image/jpeg",
    png: "image/png", webp: "image/webp", gif: "image/gif", svg: "image/svg+xml",
    ico: "image/x-icon", woff: "font/woff", woff2: "font/woff2",
  };

  let indexPath: string | null = null;
  for (const entry of entries) {
    const relPath = entry.name.replace(/^\/+/, "").slice(rootPrefix.length);
    if (!relPath) continue;
    const extension = relPath.split(".").pop()?.toLowerCase() ?? "";
    const contentType = mime[extension] ?? "application/octet-stream";
    const bytes = await entry.async("uint8array");
    const objectPath = `${basePath}/${relPath}`;

    // Se envuelve en un Blob con el tipo explícito: subir el Uint8Array a
    // secas hace que Supabase adivine el tipo (deja el CSS/JS como
    // "text/plain" y el navegador los rechaza como hoja de estilo/script).
    const blob = new Blob([bytes as unknown as BlobPart], { type: contentType });
    const { error } = await supabase.storage
      .from(TEMPLATE_ASSETS_BUCKET)
      .upload(objectPath, blob, { contentType, upsert: false });
    if (error) return { error: `No se pudo subir "${relPath}": ${error.message}` };

    if (relPath.toLowerCase() === "index.html") indexPath = objectPath;
  }

  if (!indexPath) return { error: "El .zip no tiene un index.html en su raíz." };

  const { data } = supabase.storage.from(TEMPLATE_ASSETS_BUCKET).getPublicUrl(indexPath);
  return { success: "✓ Demo publicada.", path: data.publicUrl };
}

/** Validez del enlace firmado que se entrega al administrador. */
const ADMIN_SIGNED_URL_TTL_SECONDS = 60 * 10;

/**
 * Genera un enlace de descarga temporal para el propio administrador,
 * directamente desde el bucket privado — sin pasar por el flujo de compra.
 * Es la "bóveda" privada: solo entra quien pasa por `requireAdmin()`.
 */
export async function downloadTemplatePackage(formData: FormData): Promise<void> {
  const session = await requireAdmin();
  if (!session) return;

  const supabase = createAdminClient();
  if (!supabase) return;

  const id = String(formData.get("id") ?? "").trim();
  if (!id) return;

  const { data: template } = await supabase.from("templates").select("file_url").eq("id", id).maybeSingle();
  const fileUrl = template?.file_url as string | null | undefined;
  if (!fileUrl) return;

  const objectPath = fileUrl.replace(/^\/*/, "");
  const { data: signed, error } = await supabase.storage
    .from(TEMPLATE_FILES_BUCKET)
    .createSignedUrl(objectPath, ADMIN_SIGNED_URL_TTL_SECONDS, { download: true });

  if (error || !signed?.signedUrl) return;

  redirect(signed.signedUrl);
}
