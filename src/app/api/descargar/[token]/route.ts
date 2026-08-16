import { NextResponse } from "next/server";

import { createAdminClient, TEMPLATE_FILES_BUCKET } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Validez del enlace firmado que se entrega al navegador. */
const SIGNED_URL_TTL_SECONDS = 60 * 10;

interface RouteContext {
  params: Promise<{ token: string }>;
}

/**
 * Entrega el archivo de una plantilla comprada.
 *
 * Reglas: el token debe existir, el pedido debe estar en estado `paid` y el
 * archivo se sirve mediante una URL firmada de corta duración generada en el
 * momento — el bucket es privado, nunca se expone la ruta real.
 */
export async function GET(request: Request, context: RouteContext) {
  const { token } = await context.params;

  const supabase = createAdminClient();
  if (!supabase) {
    return NextResponse.json({ error: "Descargas no disponibles: falta configurar Supabase." }, { status: 503 });
  }

  const { data: order, error } = await supabase
    .from("orders")
    .select("id, status, template_id, templates(file_url, title)")
    .eq("download_token", token)
    .maybeSingle();

  if (error || !order) {
    return NextResponse.json({ error: "Enlace de descarga no válido." }, { status: 404 });
  }

  if (order.status !== "paid") {
    return NextResponse.json(
      { error: "Este pedido todavía no está pagado. Si acabas de pagar, espera unos segundos y recarga." },
      { status: 403 },
    );
  }

  const template = Array.isArray(order.templates) ? order.templates[0] : order.templates;
  const fileUrl = (template as { file_url?: string | null } | null)?.file_url;

  if (!fileUrl) {
    return NextResponse.json(
      { error: "El archivo de esta plantilla aún no está disponible. Contacta con soporte." },
      { status: 409 },
    );
  }

  // `file_url` guarda la ruta dentro del bucket privado (ej: "barberia-premium/v1.zip").
  const objectPath = fileUrl.replace(/^\/*/, "");

  const { data: signed, error: signError } = await supabase.storage
    .from(TEMPLATE_FILES_BUCKET)
    .createSignedUrl(objectPath, SIGNED_URL_TTL_SECONDS, { download: true });

  if (signError || !signed?.signedUrl) {
    console.error("[descargar] No se pudo firmar la URL:", signError);
    return NextResponse.json({ error: "No hemos podido preparar la descarga." }, { status: 500 });
  }

  // Registro de descargas (para soporte y control de abuso).
  await supabase.from("downloads").insert({
    order_id: order.id,
    ip_address:
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      request.headers.get("x-real-ip") ??
      null,
  });

  return NextResponse.redirect(signed.signedUrl, { status: 302 });
}
