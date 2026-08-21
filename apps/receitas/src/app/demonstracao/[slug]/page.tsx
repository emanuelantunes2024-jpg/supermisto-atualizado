import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { CabecalhoPublico } from "@/components/publico/CabecalhoPublico";
import { RodapePublico } from "@/components/publico/RodapePublico";
import { DetalheReceita } from "@/components/receitas/DetalheReceita";
import { Icone } from "@/components/ui/Icone";
import { LINK_OFERTA } from "@/lib/config";
import { RECEITAS_DEMONSTRACAO, ehReceitaDaDemonstracao } from "@/lib/demonstracao";
import { obterReceita } from "@/lib/queries";

export const revalidate = 600;

export function generateStaticParams() {
  return RECEITAS_DEMONSTRACAO.map((slug) => ({ slug }));
}

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  if (!ehReceitaDaDemonstracao(slug)) return { title: "Demonstração" };

  const receita = await obterReceita(slug);
  if (!receita) return { title: "Demonstração" };

  return { title: `${receita.nome} · Demonstração`, description: receita.descricao };
}

export default async function PaginaReceitaDemonstracao({ params }: Props) {
  const { slug } = await params;

  // Fora da amostra escolhida, nada é servido publicamente.
  if (!ehReceitaDaDemonstracao(slug)) notFound();

  const receita = await obterReceita(slug);
  if (!receita) notFound();

  return (
    <div className="min-h-screen bg-cream-100">
      <CabecalhoPublico />

      <main className="mx-auto max-w-6xl px-4 py-8 app:px-6">
        <div className="mb-5 flex flex-wrap items-center gap-3 rounded-card border border-brand-200 bg-brand-50 px-4 py-3">
          <Icone nome="olho" tamanho={17} className="shrink-0 text-brand-600" />
          <p className="flex-1 text-[13px] text-ink-soft">
            Você está vendo uma receita da <strong className="text-ink">demonstração</strong>. Tudo
            aqui funciona de verdade: mude o rendimento e veja os ingredientes e os custos serem
            recalculados.
          </p>
          <Link
            href="/demonstracao"
            className="text-[13px] font-semibold text-brand-600 hover:underline"
          >
            Ver a amostra
          </Link>
        </div>

        <DetalheReceita receita={receita} />

        <section className="mt-10 rounded-card bg-gradient-to-br from-panel-900 via-panel-800 to-brand-800 px-6 py-9 text-center text-white app:px-12">
          <h2 className="font-display text-[24px] font-extrabold app:text-[30px]">
            Gostou? A biblioteca completa está esperando
          </h2>
          <p className="mx-auto mt-2.5 max-w-lg text-[14px] leading-relaxed text-white/75">
            Todas as receitas, todas as ferramentas e os seus dados salvos na conta.
          </p>

          <a
            href={LINK_OFERTA || "/#oferta"}
            {...(LINK_OFERTA ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand-500 px-7 py-3.5 text-[15px] font-bold text-white transition hover:bg-brand-600"
          >
            Quero ter acesso completo
            <Icone nome="seta-direita" tamanho={18} />
          </a>
        </section>
      </main>

      <RodapePublico />
    </div>
  );
}
