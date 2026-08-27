import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

import { supabaseConfigurado } from "@/lib/config";

/**
 * Cliente para Server Components, Route Handlers e Server Actions.
 *
 * Devolve `null` quando ainda não há credenciais, para que as páginas caiam
 * no catálogo de demonstração em vez de quebrar.
 */
export async function criarClienteServidor(): Promise<SupabaseClient | null> {
  if (!supabaseConfigurado) return null;

  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Chamado de um Server Component: o middleware já renova a sessão.
          }
        },
      },
    },
  );
}
