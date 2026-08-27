"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Cliente para componentes de navegador. Devolve `null` em modo demonstração,
 * quando as variáveis do Supabase ainda não foram configuradas.
 */
export function criarClienteNavegador(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const chave = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !chave) return null;

  return createBrowserClient(url, chave);
}
