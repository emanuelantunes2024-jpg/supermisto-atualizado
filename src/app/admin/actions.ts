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
  if (slug) revalidatePath(`/plantillas/${slug}`);
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

  const payload = {
    title,
    slug,
    category_id: categoryId,
    short_description: String(formData.get("short_description") ?? "").trim(),
    full_description: String(formData.get("full_description") ?? "").trim(),
    price_cents: Math.round(priceEuros * 100),
    preview_url: String(formData.get("preview_url") ?? "").trim() || null,
    thumbnail_url: String(formData.get("thumbnail_url") ?? "").trim() || null,
    file_url: String(formData.get("file_url") ?? "").trim() || null,
    features,
    status,
    updated_at: new Date().toISOString(),
  };

  if (id) {
    const { error } = await supabase.from("templates").update(payload).eq("id", id);
    if (error) return { error: translate(error.message) };
  } else {
    const { error } = await supabase.from("templates").insert(payload);
    if (error) return { error: translate(error.message) };
  }

  revalidateStorefront(slug);
  redirect("/admin/plantillas?guardado=1");
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

/** Sube un archivo al storage y devuelve la ruta/URL para el formulario. */
export async function uploadTemplateAsset(
  _prev: ActionState & { path?: string },
  formData: FormData,
): Promise<ActionState & { path?: string }> {
  const session = await requireAdmin();
  if (!session) return { error: "No tienes permisos para esta acción." };

  const supabase = createAdminClient();
  if (!supabase) return { error: "Supabase no está configurado (falta SUPABASE_SERVICE_ROLE_KEY)." };

  const file = formData.get("file");
  const kind = String(formData.get("kind") ?? "asset");
  const slug = slugify(String(formData.get("slug") ?? "plantilla")) || "plantilla";

  if (!(file instanceof File) || file.size === 0) return { error: "Selecciona un archivo." };

  const isPrivate = kind === "file";
  const bucket = isPrivate ? TEMPLATE_FILES_BUCKET : TEMPLATE_ASSETS_BUCKET;
  const extension = file.name.split(".").pop()?.toLowerCase() ?? "bin";
  const objectPath = `${slug}/${Date.now()}.${extension}`;

  const { error } = await supabase.storage
    .from(bucket)
    .upload(objectPath, file, { contentType: file.type || undefined, upsert: false });

  if (error) return { error: `No se pudo subir el archivo: ${error.message}` };

  if (isPrivate) {
    // El .zip vive en un bucket privado: se guarda solo la ruta interna.
    return { success: "Archivo subido.", path: objectPath };
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(objectPath);
  return { success: "Imagen subida.", path: data.publicUrl };
}

function translate(message: string): string {
  if (message.includes("duplicate key") && message.includes("slug")) {
    return "Ya existe una plantilla con ese slug. Cambia el título o el slug.";
  }
  return `Error al guardar: ${message}`;
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
