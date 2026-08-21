import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/** Rotas que exigem conta ativa (a área que o cliente comprou). */
const ROTAS_PRIVADAS = [
  "/inicio",
  "/receitas",
  "/categorias",
  "/buscar",
  "/calculadoras",
  "/lista-de-compras",
  "/central-de-renda",
  "/favoritos",
  "/colecoes",
  "/novidades",
  "/meu-plano",
  "/assistente",
  "/configuracoes",
  "/admin",
];

/**
 * Renova o token de sessão a cada navegação e protege a área do cliente.
 *
 * Enquanto o Supabase não estiver configurado, o middleware não bloqueia
 * nada: o projeto roda em modo demonstração para que dê para conhecer a
 * interface antes de ligar o banco.
 */
export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return response;

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const privada = ROTAS_PRIVADAS.some(
    (rota) => pathname === rota || pathname.startsWith(`${rota}/`),
  );

  if (!user && privada) {
    const destino = request.nextUrl.clone();
    destino.pathname = "/entrar";
    destino.search = `?redirecionar=${encodeURIComponent(pathname)}`;
    return NextResponse.redirect(destino);
  }

  return response;
}

export const config = {
  matcher: [
    // Tudo, menos estáticos, imagens e o webhook (que não tem sessão e
    // precisa do corpo da requisição intacto).
    "/((?!_next/static|_next/image|favicon.ico|api/webhooks|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
