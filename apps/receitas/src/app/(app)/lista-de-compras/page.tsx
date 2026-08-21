import type { Metadata } from "next";

import { CabecalhoPagina } from "@/components/layout/CabecalhoPagina";
import { ListaCompras } from "@/components/lista/ListaCompras";

export const metadata: Metadata = { title: "Lista de Compras" };

export default function PaginaListaCompras() {
  return (
    <div className="flex flex-col gap-4">
      <CabecalhoPagina
        titulo="Lista de Compras"
        descricao="Os ingredientes das receitas que você escolheu, somados e organizados por seção do mercado."
      />
      <ListaCompras />
    </div>
  );
}
