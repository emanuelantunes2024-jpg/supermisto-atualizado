import type { Metadata } from "next";
import Link from "next/link";

import { CabecalhoPagina } from "@/components/layout/CabecalhoPagina";
import { CentralRenda } from "@/components/renda/CentralRenda";
import { Icone } from "@/components/ui/Icone";
import { listarReceitas } from "@/lib/queries";

export const metadata: Metadata = { title: "Central de Renda" };

export default async function PaginaCentralRenda() {
  const { itens } = await listarReceitas({ porPagina: 500 });

  return (
    <div className="flex flex-col gap-4">
      <CabecalhoPagina
        titulo="Central de Renda"
        descricao="Descubra quais receitas cabem no seu orçamento e simule quanto elas podem render."
        acao={
          <Link
            href="/central-de-renda/objetivo"
            className="inline-flex items-center gap-2 rounded-xl border border-line bg-white px-3.5 py-2.5 text-[13px] font-semibold text-ink-soft transition hover:border-brand-300 hover:text-brand-600"
          >
            <Icone nome="alvo" tamanho={16} />
            Simulador de objetivos
          </Link>
        }
      />

      <CentralRenda receitas={itens} />
    </div>
  );
}
