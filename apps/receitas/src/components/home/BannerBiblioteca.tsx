import Link from "next/link";

import { Icone } from "@/components/ui/Icone";
import { formatarNumero } from "@/lib/format";

interface Props {
  total: number;
  novasSemana: number;
}

/**
 * Faixa "Biblioteca em expansão".
 *
 * O número vem da contagem real de receitas publicadas — nunca de um valor
 * inventado. É o que sustenta a promessa de produto vivo, que continua
 * crescendo depois da compra.
 */
export function BannerBiblioteca({ total, novasSemana }: Props) {
  return (
    <section className="grid gap-3 app:grid-cols-[1.55fr_1fr]">
      <div className="relative overflow-hidden rounded-card bg-gradient-to-br from-panel-900 via-panel-800 to-brand-800 px-5 py-6 text-white app:px-7 app:py-8">
        <div
          aria-hidden="true"
          className="absolute -right-10 -top-10 h-52 w-52 rounded-full bg-brand-500/25 blur-3xl"
        />
        <div className="relative">
          <p className="text-[13px] font-semibold text-white/70">Biblioteca em expansão</p>
          <p className="mt-1.5 font-display text-4xl font-extrabold leading-none text-brand-300 app:text-5xl">
            {formatarNumero(total)}
            <span className="text-white/80">+</span>
          </p>
          <p className="mt-1.5 font-display text-lg font-bold app:text-xl">receitas disponíveis</p>
          <p className="mt-2 max-w-sm text-[13px] leading-relaxed text-white/70">
            Novas receitas são adicionadas ao sistema e aparecem aqui automaticamente, sem
            precisar comprar de novo.
          </p>

          <Link
            href="/receitas"
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-[13px] font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
          >
            Ver a biblioteca
            <Icone nome="seta-direita" tamanho={16} />
          </Link>
        </div>
      </div>

      <div className="cartao flex flex-col justify-center gap-2 bg-brand-50 px-5 py-6">
        <p className="inline-flex items-center gap-2 font-display text-[15px] font-bold text-ink">
          Novidades disponíveis
          <Icone nome="sino" tamanho={17} className="text-brand-500" />
        </p>
        <p className="text-[13px] leading-relaxed text-ink-soft">
          {novasSemana > 0 ? (
            <>
              <strong className="text-brand-600">{novasSemana}</strong>{" "}
              {novasSemana === 1 ? "nova receita foi adicionada" : "novas receitas foram adicionadas"}{" "}
              nos últimos 7 dias.
            </>
          ) : (
            "Nenhuma receita nova nos últimos 7 dias. As próximas aparecem aqui assim que forem publicadas."
          )}
        </p>
        <Link
          href="/novidades"
          className="mt-1 inline-flex w-fit items-center gap-2 rounded-xl bg-brand-500 px-4 py-2.5 text-[13px] font-semibold text-white transition hover:bg-brand-600"
        >
          Ver novidades
          <Icone nome="seta-direita" tamanho={16} />
        </Link>
      </div>
    </section>
  );
}
