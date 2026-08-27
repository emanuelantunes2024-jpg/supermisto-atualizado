import type { Metadata } from "next";

import { FiltrosReceitas } from "@/components/busca/FiltrosReceitas";
import { CabecalhoPagina } from "@/components/layout/CabecalhoPagina";
import { CartaoReceita } from "@/components/receitas/CartaoReceita";
import { LinkBotao } from "@/components/ui/Botao";
import { Paginacao } from "@/components/ui/Paginacao";
import { Vazio } from "@/components/ui/Vazio";
import { filtrosDaUrl, urlComPagina, type ParametrosBusca } from "@/lib/filtros-url";
import { listarReceitas } from "@/lib/queries";

export const metadata: Metadata = { title: "Receitas" };
export const revalidate = 300;

export default async function PaginaReceitas({
  searchParams,
}: {
  searchParams: Promise<ParametrosBusca>;
}) {
  const params = await searchParams;
  const filtros = filtrosDaUrl(params);
  const { itens, total, pagina, porPagina } = await listarReceitas({ ...filtros, porPagina: 12 });

  return (
    <div className="flex flex-col gap-4">
      <CabecalhoPagina
        titulo={filtros.paraVender ? "Receitas para vender" : "Todas as receitas"}
        descricao={
          filtros.paraVender
            ? "Seleção de receitas com boa margem, produção em escala e saída rápida."
            : `${total} ${total === 1 ? "receita disponível" : "receitas disponíveis"} na biblioteca.`
        }
      />

      <FiltrosReceitas base="/receitas" />

      {itens.length === 0 ? (
        <Vazio
          titulo="Nenhuma receita encontrada"
          descricao="Tente remover algum filtro ou buscar por outro termo."
          acao={
            <LinkBotao href="/receitas" variante="contorno" tamanho="sm">
              Limpar filtros
            </LinkBotao>
          }
        />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 app:grid-cols-4">
            {itens.map((receita, indice) => (
              <CartaoReceita key={receita.slug} receita={receita} prioridade={indice < 4} />
            ))}
          </div>

          <Paginacao
            pagina={pagina}
            total={total}
            porPagina={porPagina}
            construirHref={(n) => urlComPagina(params, n, "/receitas")}
          />
        </>
      )}
    </div>
  );
}
