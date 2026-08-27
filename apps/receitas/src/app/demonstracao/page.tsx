import type { Metadata } from "next";
import Link from "next/link";

import { CabecalhoPublico } from "@/components/publico/CabecalhoPublico";
import { RodapePublico } from "@/components/publico/RodapePublico";
import { CapaReceita } from "@/components/receitas/CapaReceita";
import { Icone } from "@/components/ui/Icone";
import { LINK_OFERTA } from "@/lib/config";
import { RECEITAS_DEMONSTRACAO } from "@/lib/demonstracao";
import { formatarNumero, formatarTempo, ROTULO_DIFICULDADE } from "@/lib/format";
import { contarReceitas, obterReceita } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Demonstração",
  description:
    "Conheça a Central de Receitas & Renda antes de comprar: uma amostra de receitas e das ferramentas de cálculo.",
};

export const revalidate = 600;

export default async function PaginaDemonstracao() {
  const [total, receitas] = await Promise.all([
    contarReceitas(),
    Promise.all(RECEITAS_DEMONSTRACAO.map((slug) => obterReceita(slug))),
  ]);

  const amostra = receitas.filter((r): r is NonNullable<typeof r> => Boolean(r));

  return (
    <div className="min-h-screen bg-cream-100">
      <CabecalhoPublico />

      <main className="mx-auto max-w-6xl px-4 py-10 app:px-6 app:py-14">
        <span className="inline-flex items-center gap-2 rounded-pill border border-brand-200 bg-brand-50 px-3 py-1.5 text-[12px] font-bold text-brand-700">
          <Icone nome="olho" tamanho={14} />
          Amostra gratuita
        </span>

        <h1 className="mt-4 font-display text-[30px] font-extrabold leading-tight text-ink app:text-[40px]">
          Experimente a Central de Receitas &amp; Renda
        </h1>

        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-ink-soft">
          Estas {amostra.length} receitas estão abertas para você conhecer a interface, o ajuste de
          rendimento e o cálculo de custos. A biblioteca completa tem{" "}
          <strong className="text-ink">{formatarNumero(total)} receitas</strong> e fica disponível
          com o acesso.
        </p>

        <div className="mt-8 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
          {amostra.map((receita, indice) => (
            <Link
              key={receita.slug}
              href={`/demonstracao/${receita.slug}`}
              className="cartao cartao-hover group overflow-hidden"
            >
              <div className="relative aspect-[4/3] bg-cream-200">
                <CapaReceita
                  nome={receita.nome}
                  categoria={receita.categoria}
                  imagem={receita.imagem}
                  prioridade={indice < 3}
                  className="transition duration-300 group-hover:scale-105"
                />
                <span className="absolute bottom-2.5 left-2.5 inline-flex items-center gap-1 rounded-pill bg-black/55 px-2 py-1 text-[11px] font-semibold text-white">
                  <Icone nome="relogio" tamanho={12} />
                  {formatarTempo(receita.tempoMinutos)}
                </span>
              </div>
              <div className="p-3">
                <h2 className="line-clamp-2 text-[14px] font-bold leading-snug text-ink group-hover:text-brand-600">
                  {receita.nome}
                </h2>
                <p className="mt-1 text-[12px] text-ink-muted">
                  {ROTULO_DIFICULDADE[receita.dificuldade]}
                  <span className="px-1.5 text-ink-faint">·</span>
                  Rende {receita.rendimento} {receita.rendimentoUnidade}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <section className="mt-10 grid gap-3 app:grid-cols-3">
          {[
            {
              icone: "balanca",
              titulo: "Ajuste de rendimento",
              texto:
                "Abra qualquer receita da amostra e mude a quantidade: os ingredientes se recalculam na hora.",
            },
            {
              icone: "calculadora",
              titulo: "Cálculo de custos",
              texto:
                "Cada receita mostra o custo estimado e o custo por unidade com preços médios de mercado.",
            },
            {
              icone: "renda",
              titulo: "Preço sugerido",
              texto:
                "Nas receitas indicadas para venda, veja o preço sugerido e o faturamento estimado.",
            },
          ].map((item) => (
            <div key={item.titulo} className="cartao p-5">
              <span className="mb-2.5 grid h-10 w-10 place-items-center rounded-2xl bg-brand-50 text-brand-500">
                <Icone nome={item.icone} tamanho={20} />
              </span>
              <h3 className="font-display text-[15px] font-bold text-ink">{item.titulo}</h3>
              <p className="mt-1 text-[13px] leading-relaxed text-ink-muted">{item.texto}</p>
            </div>
          ))}
        </section>

        <section className="mt-10 rounded-card bg-gradient-to-br from-panel-900 via-panel-800 to-brand-800 px-6 py-9 text-center text-white app:px-12">
          <h2 className="font-display text-[24px] font-extrabold app:text-[30px]">
            Quero ter acesso completo
          </h2>
          <p className="mx-auto mt-2.5 max-w-lg text-[14px] leading-relaxed text-white/75">
            Biblioteca completa, todas as ferramentas, favoritos e listas salvos na sua conta, e as
            novas receitas conforme forem publicadas.
          </p>

          <a
            href={LINK_OFERTA || "/#oferta"}
            {...(LINK_OFERTA ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand-500 px-7 py-3.5 text-[15px] font-bold text-white transition hover:bg-brand-600"
          >
            Ver a oferta
            <Icone nome="seta-direita" tamanho={18} />
          </a>
        </section>
      </main>

      <RodapePublico />
    </div>
  );
}
