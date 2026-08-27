import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { CATEGORIAS, CATEGORIAS_POR_SLUG } from "@/data/categorias";
import { CabecalhoPagina } from "@/components/layout/CabecalhoPagina";
import { CartaoReceita } from "@/components/receitas/CartaoReceita";
import { Paginacao } from "@/components/ui/Paginacao";
import { Vazio } from "@/components/ui/Vazio";
import { filtrosDaUrl, urlComPagina, type ParametrosBusca } from "@/lib/filtros-url";
import { listarReceitas } from "@/lib/queries";

export const revalidate = 300;

export function generateStaticParams() {
  return CATEGORIAS.map((c) => ({ slug: c.slug }));
}

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<ParametrosBusca>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const categoria = CATEGORIAS_POR_SLUG[slug];
  if (!categoria) return { title: "Categoria" };
  return { title: categoria.nome, description: categoria.descricao };
}

export default async function PaginaCategoria({ params, searchParams }: Props) {
  const { slug } = await params;
  const query = await searchParams;
  const categoria = CATEGORIAS_POR_SLUG[slug];

  if (!categoria) notFound();

  const filtros = filtrosDaUrl(query);
  const { itens, total, pagina, porPagina } = await listarReceitas({
    ...filtros,
    categoria: slug,
    porPagina: 12,
  });

  const subcategoriaAtiva = filtros.subcategoria;

  return (
    <div className="flex flex-col gap-4">
      <CabecalhoPagina
        titulo={categoria.nome}
        descricao={`${categoria.descricao} ${total} ${total === 1 ? "receita" : "receitas"} nesta categoria.`}
      />

      <div className="rolagem-limpa -mx-4 flex gap-1.5 overflow-x-auto px-4 app:mx-0 app:flex-wrap app:px-0">
        <Link
          href={`/categorias/${slug}`}
          className={`shrink-0 rounded-lg border px-3 py-1.5 text-[12.5px] font-semibold transition ${
            !subcategoriaAtiva
              ? "border-brand-500 bg-brand-50 text-brand-600"
              : "border-line bg-white text-ink-muted hover:border-brand-300"
          }`}
        >
          Todas
        </Link>

        {categoria.subcategorias.map((sub) => (
          <Link
            key={sub}
            href={`/categorias/${slug}?subcategoria=${encodeURIComponent(sub)}`}
            className={`shrink-0 rounded-lg border px-3 py-1.5 text-[12.5px] font-semibold transition ${
              subcategoriaAtiva === sub
                ? "border-brand-500 bg-brand-50 text-brand-600"
                : "border-line bg-white text-ink-muted hover:border-brand-300"
            }`}
          >
            {sub}
          </Link>
        ))}
      </div>

      {itens.length === 0 ? (
        <Vazio
          icone="receitas"
          titulo="Ainda não há receitas aqui"
          descricao="Esta subcategoria já existe na estrutura do sistema e receberá receitas nas próximas atualizações."
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
            construirHref={(n) => urlComPagina(query, n, `/categorias/${slug}`)}
          />
        </>
      )}
    </div>
  );
}
