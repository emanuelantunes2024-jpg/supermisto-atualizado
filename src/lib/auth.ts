import type { User } from "@supabase/supabase-js";

import { adminEmails } from "@/lib/config";
import { createClient } from "@/lib/supabase/server";
import type { Customer } from "@/lib/types";

export interface SessionInfo {
  user: User | null;
  customer: Customer | null;
  isAdmin: boolean;
}

/** Sesión actual + ficha de cliente + si tiene acceso al panel. */
export async function getSession(): Promise<SessionInfo> {
  const supabase = await createClient();
  if (!supabase) return { user: null, customer: null, isAdmin: false };

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { user: null, customer: null, isAdmin: false };

  const { data: customer } = await supabase
    .from("customers")
    .select("*")
    .eq("id", user.id)
    .maybeSingle<Customer>();

  const email = (user.email ?? "").toLowerCase();
  const isAdmin = customer?.role === "admin" || adminEmails().includes(email);

  return { user, customer: customer ?? null, isAdmin };
}

/** `true` si hay un usuario con permisos de administración. */
export async function requireAdmin(): Promise<SessionInfo | null> {
  const session = await getSession();
  return session.isAdmin ? session : null;
}
