import Link from "next/link";
import { redirect } from "next/navigation";

import { Icone } from "@/components/ui/Icone";
import { MarcaSimbolo } from "@/components/ui/Logo";
import { obterSessao } from "@/lib/auth";
import { supabaseConfigurado } from "@/lib/config";

const MENU = [
  { href: "/admin", rotulo: "Painel", icone: "painel" },
  { href: "/admin/receitas", rotulo: "Receitas", icone: "receitas" },
  { href: "/admin/categorias", rotulo: "Categorias", icone: "categorias" },
  { href: "/admin/usuarios", rotulo: "Usuários", icone: "usuarios" },
];

/**
 * Área administrativa.
 *
 * Só entra quem tem papel de administrador — pela coluna `papel` na tabela
 * `perfis` ou pela variável `ADMIN_EMAILS`. Sem Supabase configurado, o
 * painel abre em modo somente leitura e avisa o que falta.
 */
export default async function LayoutAdmin({ children }: { children: React.ReactNode }) {
  const sessao = await obterSessao();

  // Com o banco ligado, o acesso é restrito de verdade. Sem banco, deixamos
  // conhecer a interface — não há dado real para proteger ainda.
  if (supabaseConfigurado && !sessao.admin) {
    redirect("/entrar?redirecionar=/admin");
  }

  return (
    <div className="min-h-screen bg-cream-100">
      <div className="flex">
        <aside className="sticky top-0 hidden h-screen w-[230px] shrink-0 flex-col bg-panel-900 px-3 py-4 text-white app:flex">
          <Link href="/admin" className="mb-5 flex items-center gap-2.5 px-2">
            <MarcaSimbolo tamanho={34} />
            <span className="font-display text-[14px] font-bold leading-tight">
              Painel
              <span className="block text-[11px] font-medium text-white/50">
                Receitas &amp; Renda
              </span>
            </span>
          </Link>

          <nav className="flex flex-1 flex-col gap-0.5">
            {MENU.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13.5px] font-semibold text-white/70 transition hover:bg-panel-700 hover:text-white"
              >
                <Icone nome={item.icone} tamanho={18} />
                {item.rotulo}
              </Link>
            ))}

            <div className="my-3 border-t border-white/10" />

            <Link
              href="/inicio"
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13.5px] font-semibold text-white/70 transition hover:bg-panel-700 hover:text-white"
            >
              <Icone nome="olho" tamanho={18} />
              Ver o site
            </Link>
            <Link
              href="/auth/sair"
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13.5px] font-semibold text-white/70 transition hover:bg-panel-700 hover:text-white"
            >
              <Icone nome="sair" tamanho={18} />
              Sair
            </Link>
          </nav>

          {sessao.user && (
            <p className="truncate px-3 pt-3 text-[11px] text-white/40">{sessao.user.email}</p>
          )}
        </aside>

        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-line bg-white px-4 app:hidden">
            <MarcaSimbolo tamanho={30} />
            <span className="font-display text-[14px] font-bold">Painel</span>
            <nav className="rolagem-limpa ml-auto flex gap-1 overflow-x-auto">
              {MENU.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-ink-soft"
                  aria-label={item.rotulo}
                >
                  <Icone nome={item.icone} tamanho={18} />
                </Link>
              ))}
            </nav>
          </header>

          <main className="px-4 py-6 app:px-7">{children}</main>
        </div>
      </div>
    </div>
  );
}
