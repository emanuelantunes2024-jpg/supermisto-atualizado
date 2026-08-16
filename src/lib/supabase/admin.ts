import { createClient as createSupabaseClient, type SupabaseClient } from "@supabase/supabase-js";

import { hasSupabaseServiceRole, isSupabaseConfigured } from "@/lib/config";

/**
 * Cliente con `service_role`: salta las políticas RLS.
 *
 * Se usa solo donde el servidor actúa por su cuenta (webhook de Stripe,
 * generación del enlace de descarga firmado). Nunca debe llegar al navegador.
 */
export function createAdminClient(): SupabaseClient | null {
  if (!isSupabaseConfigured || !hasSupabaseServiceRole) return null;

  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}

/** Bucket privado donde viven los .zip de las plantillas. */
export const TEMPLATE_FILES_BUCKET = "template-files";

/** Bucket público de miniaturas. */
export const TEMPLATE_ASSETS_BUCKET = "template-assets";
