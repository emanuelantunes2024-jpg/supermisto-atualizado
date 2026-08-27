import type { Metadata } from "next";
import Link from "next/link";

import { Icone, ICONE_CATEGORIA } from "@/components/ui/Icone";
import { Aviso } from "@/components/ui/Aviso";
import { listarCategorias } from "@/lib/queries";

export const metadata: Metadata = { title: "Categorias · Painel" };
export const dynamic = "force-dynamic";

export default async function PaginaAdminCategorias() {
  const categorias = await listarCategorias();

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink">Categorias</h1>
        <p className="mt-1 text-sm text-ink-muted">
          Estrutura de categorias e subcategorias da biblioteca.
        </p>
      </div>

      <Aviso tipo="info" titulo="Como alterar a estrutura">
        As categorias e subcategorias ficam em{" "}
        <code className="rounded bg-cream-200 px-1.5 py-0.5">src/data/categorias.ts</code>. Para
        criar uma categoria nova, adicione o item nesse arquivo e publique o projeto — o passo a
        passo está em <code className="rounded bg-cream-200 px-1.5 py-0.5">docs/MANUTENCAO.md</code>.
        Isso é de propósito: categoria é estrutura do produto, não conteúdo do dia a dia.
      </Aviso>

      <div className="grid gap-2.5 sm:grid-cols-2">
        {categorias.map((categoria) => (
          <div key={categoria.slug} className="cartao p-4">
            <div className="flex items-start gap-3">
              <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-2xl ${categoria.cor}`}>
                <Icone nome={ICONE_CATEGORIA[categoria.slug] ?? "receitas"} tamanho={19} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-display text-[15px] font-bold text-ink">{categoria.nome}</p>
                <p className="text-[12px] text-ink-muted">
                  {categoria.total} {categoria.total === 1 ? "receita" : "receitas"} ·{" "}
                  {categoria.subcategorias.length} subcategorias
                </p>
              </div>
              <Link
                href={`/categorias/${categoria.slug}`}
                target="_blank"
                className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-ink-muted transition hover:bg-cream-100 hover:text-brand-600"
                aria-label={`Ver ${categoria.nome} no site`}
              >
                <Icone nome="olho" tamanho={16} />
              </Link>
            </div>

            <div className="mt-3 flex flex-wrap gap-1">
              {categoria.subcategorias.map((sub) => (
                <span
                  key={sub}
                  className="rounded-pill border border-line bg-cream-50 px-2 py-1 text-[11px] text-ink-muted"
                >
                  {sub}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
