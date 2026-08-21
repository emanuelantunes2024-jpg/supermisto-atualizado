import type { Metadata } from "next";

import { CabecalhoPagina } from "@/components/layout/CabecalhoPagina";
import { SimuladorObjetivo } from "@/components/renda/SimuladorObjetivo";
import { listarReceitas } from "@/lib/queries";

export const metadata: Metadata = { title: "Simulador de Objetivos" };

export default async function PaginaSimuladorObjetivo() {
  const { itens } = await listarReceitas({ paraVender: true, porPagina: 500, ordem: "nome" });

  return (
    <div className="flex flex-col gap-4">
      <CabecalhoPagina
        titulo="Simulador de Objetivos"
        descricao="Defina uma meta e veja quanto precisaria produzir e vender para alcançá-la."
      />

      <SimuladorObjetivo receitas={itens} />
    </div>
  );
}
