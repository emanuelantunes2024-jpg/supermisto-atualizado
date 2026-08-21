import type { Metadata } from "next";

import { CabecalhoPagina } from "@/components/layout/CabecalhoPagina";
import { GradeFavoritos } from "@/components/receitas/GradeFavoritos";
import { listarReceitas } from "@/lib/queries";

export const metadata: Metadata = { title: "Favoritos" };

export default async function PaginaFavoritos() {
  // Carrega o catálogo para poder mostrar qualquer receita marcada.
  const { itens } = await listarReceitas({ porPagina: 500 });

  return (
    <div className="flex flex-col gap-4">
      <CabecalhoPagina
        titulo="Favoritos"
        descricao="As receitas que você salvou, sempre à mão."
      />
      <GradeFavoritos receitas={itens} />
    </div>
  );
}
