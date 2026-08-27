import type { Metadata } from "next";
import Link from "next/link";

import { CATEGORIA_VENDER } from "@/data/categorias";
import { CabecalhoPagina } from "@/components/layout/CabecalhoPagina";
import { Icone, ICONE_CATEGORIA } from "@/components/ui/Icone";
import { listarCategorias, listarReceitas } from "@/lib/queries";

export const metadata: Metadata = { title: "Categorias" };
export const revalidate = 300;

export default async function PaginaCategorias() {
  const [categorias, paraVender] = await Promise.all([
    listarCategorias(),
    listarReceitas({ paraVender: true, porPagina: 1 }),
  ]);

  return (
    <div className="flex flex-col gap-4">
      <CabecalhoPagina
        titulo="Categorias"
        descricao="Navegue pela biblioteca por tipo de produção."
      />

      <Link
        href="/receitas?vender=1"
        className="cartao cartao-hover flex items-center gap-4 border-money-500/25 bg-money-50 p-4"
      >
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white text-money-600">
          <Icone nome="dinheiro" tamanho={24} />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="font-display text-[16px] font-bold text-ink">{CATEGORIA_VENDER.nome}</h2>
          <p className="text-[13px] text-ink-muted">{CATEGORIA_VENDER.descricao}</p>
        </div>
        <span className="shrink-0 text-right">
          <span className="block font-display text-xl font-extrabold text-money-600">
            {paraVender.total}
          </span>
          <span className="text-[11px] text-ink-muted">receitas</span>
        </span>
      </Link>

      <div className="grid gap-2.5 sm:grid-cols-2 app:grid-cols-3">
        {categorias.map((categoria) => (
          <Link
            key={categoria.slug}
            href={`/categorias/${categoria.slug}`}
            className="cartao cartao-hover flex items-start gap-3.5 p-4"
          >
            <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl ${categoria.cor}`}>
              <Icone nome={ICONE_CATEGORIA[categoria.slug] ?? "receitas"} tamanho={21} />
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="font-display text-[15px] font-bold text-ink">{categoria.nome}</h2>
              <p className="mt-0.5 text-[12.5px] leading-snug text-ink-muted">
                {categoria.descricao}
              </p>
              <p className="mt-1.5 text-[12px] font-semibold text-brand-600">
                {categoria.total} {categoria.total === 1 ? "receita" : "receitas"}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
