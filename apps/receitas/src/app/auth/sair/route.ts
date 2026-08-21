import { NextResponse, type NextRequest } from "next/server";

import { criarClienteServidor } from "@/lib/supabase/server";

/** Encerra a sessão e volta para a página pública. */
export async function GET(request: NextRequest) {
  const supabase = await criarClienteServidor();
  if (supabase) await supabase.auth.signOut();

  return NextResponse.redirect(new URL("/", request.url));
}
