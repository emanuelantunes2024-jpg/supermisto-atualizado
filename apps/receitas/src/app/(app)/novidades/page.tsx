import type { Metadata } from "next";
import Link from "next/link";

import { CabecalhoPagina } from "@/components/layout/CabecalhoPagina";
import { CartaoReceita } from "@/components/receitas/CartaoReceita";
import { Paginacao } from "@/components/ui/Paginacao";
import { Vazio } from "@/components/ui/Vazio";
import { urlComPagina, type ParametrosBusca } from "@/lib/filtros-url";
import { listarReceitas, obterNovidades } from "@/lib/queries";

export const metadata: Metadata = { title: "Novidades" };
export const revalidate = 300;

const PERIODOS = [
  { chave: "hoje", rotulo: "Hoje", dias: 0 },
  { chave: "semana", rotulo: "Esta semana", dias: 7 },
  { chave: "mes", rotulo: "Este mês", dias: 30 },
  { chave: "tudo", rotulo: "Tudo", dias: null },
] as const;

function dataDeCorte(dias: number): string {
  const data = new Date();
  data.setDate(data.getDate() - dias);
  return data.toISOString().slice(0, 10);
}

export default async function PaginaNovidades({
  searchParams,
}: {
  searchParams: Promise<ParametrosBusca>;
}) {
  const params = await searchParams;
  const periodoAtual = (Array.isArray(params.periodo) ? params.periodo[0] : params.periodo) ?? "mes";
  const pagina = Number(Array.isArray(params.pagina) ? params.pagina[0] : params.pagina) || 1;

  const periodo = PERIODOS.find((p) => p.chave === periodoAtual) ?? PERIODOS[2];
  const resumo = await obterNovidades(1);

  const { itens, total, porPagina } = await listarReceitas({
    desde: periodo.dias === null ? undefined : dataDeCorte(periodo.dias),
    pagina,
    porPagina: 12,
    ordem: "recentes",
  });

  return (
    <div className="flex flex-col gap-4">
      <CabecalhoPagina
        titulo="Novidades"
        descricao="Tudo o que foi adicionado à biblioteca recentemente. O acesso continua o mesmo: novas receitas entram sem custo adicional."
      />

      <div className="grid grid-cols-3 gap-2.5">
        {[
          { rotulo: "Hoje", valor: resumo.hoje },
          { rotulo: "Esta semana", valor: resumo.semana },
          { rotulo: "Este mês", valor: resumo.mes },
        ].map((item) => (
          <div key={item.rotulo} className="cartao px-4 py-3.5 text-center">
            <p className="font-display text-2xl font-extrabold text-brand-500">
              {item.valor > 0 ? `+${item.valor}` : "0"}
            </p>
            <p className="mt-0.5 text-[12px] font-semibold text-ink-muted">{item.rotulo}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-1.5">
        {PERIODOS.map((item) => (
          <Link
            key={item.chave}
            href={item.chave === "mes" ? "/novidades" : `/novidades?periodo=${item.chave}`}
            className={`rounded-lg border px-3 py-1.5 text-[12.5px] font-semibold transition ${
              periodo.chave === item.chave
                ? "border-brand-500 bg-brand-50 text-brand-600"
                : "border-line bg-white text-ink-muted hover:border-brand-300"
            }`}
          >
            {item.rotulo}
          </Link>
        ))}
      </div>

      {itens.length === 0 ? (
        <Vazio
          icone="novidades"
          titulo="Nenhuma receita nova neste período"
          descricao="Experimente ampliar o período. As próximas atualizações aparecem aqui automaticamente."
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
            construirHref={(n) => urlComPagina(params, n, "/novidades")}
          />
        </>
      )}
    </div>
  );
}
