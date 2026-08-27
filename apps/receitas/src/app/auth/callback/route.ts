import { NextResponse, type NextRequest } from "next/server";

import { criarClienteServidor } from "@/lib/supabase/server";

/**
 * Retorno dos links enviados por e-mail (confirmação de conta e recuperação
 * de senha). Troca o código pela sessão e leva o usuário para dentro do app.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const codigo = searchParams.get("code");
  const proximo = searchParams.get("proximo");

  const destino = proximo && proximo.startsWith("/") && !proximo.startsWith("//") ? proximo : "/inicio";

  if (codigo) {
    const supabase = await criarClienteServidor();
    if (supabase) {
      const { error } = await supabase.auth.exchangeCodeForSession(codigo);
      if (!error) return NextResponse.redirect(`${origin}${destino}`);
    }
  }

  return NextResponse.redirect(`${origin}/entrar?erro=link_invalido`);
}
