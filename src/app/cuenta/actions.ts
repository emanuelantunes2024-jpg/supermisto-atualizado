"use server";

import { revalidatePath } from "next/cache";

import { getSession } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export interface ActionState {
  error?: string;
  success?: string;
}

/** Actualiza los datos de facturación del cliente autenticado. */
export async function updateProfile(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const { user } = await getSession();
  if (!user) return { error: "Tienes que iniciar sesión." };

  const supabase = await createClient();
  if (!supabase) return { error: "Supabase no está configurado." };

  const fullName = String(formData.get("full_name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim() || null;
  const country = String(formData.get("country") ?? "").trim() || null;

  const { error } = await supabase
    .from("customers")
    .update({ full_name: fullName || null, phone, country })
    .eq("id", user.id);

  if (error) return { error: `No se pudo guardar: ${error.message}` };

  revalidatePath("/cuenta/perfil");
  return { success: "✓ Perfil actualizado." };
}
