import type { Metadata } from "next";

import { CalculadoraPrecos } from "@/components/ferramentas/CalculadoraPrecos";
import { CabecalhoPagina } from "@/components/layout/CabecalhoPagina";
import type { ParametrosBusca } from "@/lib/filtros-url";

export const metadata: Metadata = { title: "Calculadora de Preços" };

export default async function PaginaCalculadoraPrecos({
  searchParams,
}: {
  searchParams: Promise<ParametrosBusca>;
}) {
  const params = await searchParams;

  const custo = Number(Array.isArray(params.custo) ? params.custo[0] : params.custo);
  const quantidade = Number(
    Array.isArray(params.quantidade) ? params.quantidade[0] : params.quantidade,
  );

  return (
    <div className="flex flex-col gap-4">
      <CabecalhoPagina
        titulo="Calculadora de Preços"
        descricao="A partir do custo, simule o preço de venda, a margem e o faturamento estimado."
      />

      <CalculadoraPrecos
        custoInicial={Number.isFinite(custo) && custo > 0 ? custo : 0}
        quantidadeInicial={Number.isFinite(quantidade) && quantidade > 0 ? quantidade : 1}
      />
    </div>
  );
}
