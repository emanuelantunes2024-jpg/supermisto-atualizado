import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";

import { isSupabaseConfigured } from "@/lib/config";

/**
 * Cliente de Supabase para lecturas públicas (catálogo: categorías y
 * plantillas publicadas). A diferencia del cliente de `server.ts`, este NO
 * usa `cookies()`, así que puede llamarse durante `generateStaticParams` y
 * en páginas estáticas — el catálogo es público, no depende de la sesión.
 */
export function createPublicClient(): SupabaseClient | null {
  if (!isSupabaseConfigured) return null;

  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } },
  );
}
