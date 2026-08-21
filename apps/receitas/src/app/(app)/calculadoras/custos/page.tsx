import type { Metadata } from "next";

import { CalculadoraCustos } from "@/components/ferramentas/CalculadoraCustos";
import { CabecalhoPagina } from "@/components/layout/CabecalhoPagina";
import { listarReceitas } from "@/lib/queries";
import type { ParametrosBusca } from "@/lib/filtros-url";

export const metadata: Metadata = { title: "Calculadora de Custos" };

export default async function PaginaCalculadoraCustos({
  searchParams,
}: {
  searchParams: Promise<ParametrosBusca>;
}) {
  const params = await searchParams;
  const { itens } = await listarReceitas({ porPagina: 500, ordem: "nome" });

  const slug = Array.isArray(params.receita) ? params.receita[0] : params.receita;
  const rendimentoBruto = Array.isArray(params.rendimento) ? params.rendimento[0] : params.rendimento;
  const rendimento = Number(rendimentoBruto);

  return (
    <div className="flex flex-col gap-4">
      <CabecalhoPagina
        titulo="Calculadora de Custos"
        descricao="Informe o que você paga por cada ingrediente e descubra o custo real da sua produção."
      />

      <CalculadoraCustos
        receitas={itens}
        slugInicial={slug}
        rendimentoInicial={Number.isFinite(rendimento) && rendimento > 0 ? rendimento : undefined}
      />
    </div>
  );
}
