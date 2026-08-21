import type { Metadata } from "next";

import { CabecalhoPagina } from "@/components/layout/CabecalhoPagina";
import { GerenciadorColecoes } from "@/components/receitas/GerenciadorColecoes";
import { listarReceitas } from "@/lib/queries";

export const metadata: Metadata = { title: "Minhas Coleções" };

export default async function PaginaColecoes() {
  const { itens } = await listarReceitas({ porPagina: 500 });

  return (
    <div className="flex flex-col gap-4">
      <CabecalhoPagina
        titulo="Minhas Coleções"
        descricao="Organize receitas por tema: o que você quer fazer, o que vende, o que é de festa."
      />
      <GerenciadorColecoes receitas={itens} />
    </div>
  );
}
