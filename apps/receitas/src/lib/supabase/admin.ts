import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import { supabaseConfigurado, temServiceRole } from "@/lib/config";

/**
 * Cliente `service_role`: ignora as políticas de RLS.
 *
 * Usado apenas onde o servidor age sozinho — hoje, no webhook da plataforma
 * de venda, que precisa criar e revogar acessos sem sessão de usuário.
 * Nunca deve ser importado por um componente de cliente.
 */
export function criarClienteAdmin(): SupabaseClient | null {
  if (!supabaseConfigurado || !temServiceRole) return null;

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}

/** Bucket público com as fotos das receitas. */
export const BUCKET_IMAGENS = "receitas";
