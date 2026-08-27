import type { Metadata } from "next";

import { CampoBusca } from "@/components/busca/CampoBusca";
import { FiltrosReceitas } from "@/components/busca/FiltrosReceitas";
import { CabecalhoPagina } from "@/components/layout/CabecalhoPagina";
import { CartaoReceita } from "@/components/receitas/CartaoReceita";
import { Paginacao } from "@/components/ui/Paginacao";
import { Vazio } from "@/components/ui/Vazio";
import { filtrosDaUrl, urlComPagina, type ParametrosBusca } from "@/lib/filtros-url";
import { listarReceitas } from "@/lib/queries";

export const metadata: Metadata = { title: "Buscar" };

/** Sugestões que ajudam quem abre a busca sem saber o que procurar. */
const SUGESTOES = [
  "bolo de chocolate",
  "morango",
  "brigadeiro",
  "receitas baratas",
  "doces para vender",
  "sorvete",
  "receita rápida",
  "pão",
  "coxinha",
];

export default async function PaginaBuscar({
  searchParams,
}: {
  searchParams: Promise<ParametrosBusca>;
}) {
  const params = await searchParams;
  const filtros = filtrosDaUrl(params);
  const termo = filtros.busca;

  const resultado = termo
    ? await listarReceitas({ ...filtros, porPagina: 12 })
    : { itens: [], total: 0, pagina: 1, porPagina: 12, demonstracao: false };

  return (
    <div className="flex flex-col gap-4">
      <CabecalhoPagina
        titulo="Buscar receitas"
        descricao="Procure por nome, ingrediente, categoria ou objetivo — como “doces para vender” ou “morango”."
      />

      <CampoBusca valorInicial={termo ?? ""} sugestoes={SUGESTOES} />

      {termo && <FiltrosReceitas base="/buscar" />}

      {!termo ? (
        <Vazio
          icone="buscar"
          titulo="O que você quer cozinhar hoje?"
          descricao="Digite o nome de uma receita, um ingrediente que você tem em casa ou um objetivo, como “festa” ou “delivery”."
        />
      ) : resultado.itens.length === 0 ? (
        <Vazio
          titulo={`Nada encontrado para “${termo}”`}
          descricao="Tente escrever de outro jeito, usar só uma palavra ou remover os filtros ativos."
        />
      ) : (
        <>
          <p className="text-[13px] text-ink-muted">
            <strong className="text-ink">{resultado.total}</strong>{" "}
            {resultado.total === 1 ? "resultado" : "resultados"} para “{termo}”
          </p>

          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 app:grid-cols-4">
            {resultado.itens.map((receita, indice) => (
              <CartaoReceita key={receita.slug} receita={receita} prioridade={indice < 4} />
            ))}
          </div>

          <Paginacao
            pagina={resultado.pagina}
            total={resultado.total}
            porPagina={resultado.porPagina}
            construirHref={(n) => urlComPagina(params, n, "/buscar")}
          />
        </>
      )}
    </div>
  );
}
