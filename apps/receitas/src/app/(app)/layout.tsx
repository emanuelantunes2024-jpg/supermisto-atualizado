import { BarraCelular } from "@/components/layout/BarraCelular";
import { BarraLateral } from "@/components/layout/BarraLateral";
import { BarraTopo } from "@/components/layout/BarraTopo";
import { obterSessao } from "@/lib/auth";
import { obterNovidades } from "@/lib/queries";

/**
 * Casca da aplicação: barra lateral fixa no computador, barra inferior no
 * celular. Todas as telas internas do produto vivem dentro dela.
 */
export default async function LayoutAplicacao({ children }: { children: React.ReactNode }) {
  const [sessao, novidades] = await Promise.all([obterSessao(), obterNovidades(1)]);

  return (
    <div className="min-h-screen bg-cream-100">
      <div className="mx-auto flex max-w-shell">
        <aside className="sticky top-0 hidden h-screen w-[248px] shrink-0 border-r border-line app:block">
          <BarraLateral />
        </aside>

        <div className="min-w-0 flex-1">
          <BarraTopo
            novidades={novidades.semana}
            nomeUsuario={sessao.perfil?.nome ?? undefined}
          />

          <main className="px-4 pb-28 pt-5 app:px-6 app:pb-12">{children}</main>
        </div>
      </div>

      <BarraCelular />
    </div>
  );
}
