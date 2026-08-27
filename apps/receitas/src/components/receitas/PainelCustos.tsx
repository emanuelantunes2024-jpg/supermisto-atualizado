"use client";

import Link from "next/link";

import { Icone } from "@/components/ui/Icone";
import { arredondarPrecoComercial, calcularPreco, type ResumoCusto } from "@/lib/calculos";
import { formatarMoeda, formatarPercentual } from "@/lib/format";
import type { Receita } from "@/lib/types";

interface Props {
  receita: Receita;
  custo: ResumoCusto;
}

/**
 * Resumo de custo e preço mostrado ao lado da receita.
 *
 * Todos os valores são simulação: partem dos preços de referência ou dos
 * preços que o usuário salvou, e mudam conforme o rendimento escolhido.
 */
export function PainelCustos({ receita, custo }: Props) {
  const margem = receita.margemSugerida ?? 0.7;
  const preco = calcularPreco(custo.custoPorUnidade, custo.rendimento, margem, "markup");
  const precoVitrine = arredondarPrecoComercial(preco.precoSugerido);
  const faturamento = precoVitrine * custo.rendimento;

  const linhas = [
    { rotulo: "Custo total dos ingredientes", valor: formatarMoeda(custo.custoIngredientes) },
    {
      rotulo: `Custo por ${receita.rendimentoUnidade.replace(/s$/, "")}`,
      valor: formatarMoeda(custo.custoPorUnidade),
      destaque: true,
    },
    ...(custo.custoEmbalagem > 0
      ? [{ rotulo: "Custo de embalagem", valor: formatarMoeda(custo.custoEmbalagem) }]
      : []),
  ];

  return (
    <div className="cartao overflow-hidden">
      <div className="border-b border-line px-4 py-3">
        <h3 className="text-[13px] font-bold uppercase tracking-wide text-ink-muted">
          Resumo de custos
        </h3>
      </div>

      <dl className="divide-y divide-line/70">
        {linhas.map((linha) => (
          <div key={linha.rotulo} className="flex items-center justify-between gap-3 px-4 py-2.5">
            <dt className="text-[13px] text-ink-soft">{linha.rotulo}</dt>
            <dd
              className={`text-[13px] font-bold tabular-nums ${
                linha.destaque ? "text-brand-600" : "text-ink"
              }`}
            >
              {linha.valor}
            </dd>
          </div>
        ))}

        <div className="flex items-center justify-between gap-3 bg-cream-100 px-4 py-3">
          <dt className="text-[13px] font-semibold text-ink">Custo total da receita</dt>
          <dd className="font-display text-base font-extrabold tabular-nums text-ink">
            {formatarMoeda(custo.custoTotal)}
          </dd>
        </div>
      </dl>

      {receita.paraVender && (
        <>
          <div className="border-y border-line bg-white px-4 py-3">
            <h3 className="text-[13px] font-bold uppercase tracking-wide text-ink-muted">
              Preço sugerido
            </h3>
          </div>

          <dl className="divide-y divide-line/70">
            <div className="flex items-center justify-between gap-3 px-4 py-2.5">
              <dt className="text-[13px] text-ink-soft">Margem aplicada sobre o custo</dt>
              <dd className="text-[13px] font-bold tabular-nums text-ink">
                {formatarPercentual(margem)}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-3 px-4 py-2.5">
              <dt className="text-[13px] text-ink-soft">Lucro estimado por unidade</dt>
              <dd className="text-[13px] font-bold tabular-nums text-money-600">
                {formatarMoeda(precoVitrine - custo.custoPorUnidade)}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-3 px-4 py-3">
              <dt className="text-[13px] font-semibold text-ink">Preço sugerido de venda</dt>
              <dd className="font-display text-lg font-extrabold tabular-nums text-money-600">
                {formatarMoeda(precoVitrine)}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-3 bg-money-50 px-4 py-3">
              <dt className="text-[13px] font-semibold text-ink">
                Faturamento estimado ({custo.rendimento} un.)
              </dt>
              <dd className="font-display text-base font-extrabold tabular-nums text-money-700">
                {formatarMoeda(faturamento)}
              </dd>
            </div>
          </dl>
        </>
      )}

      <div className="px-4 py-3">
        <Link
          href={`/calculadoras/custos?receita=${receita.slug}&rendimento=${custo.rendimento}`}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-[13px] font-semibold text-white transition hover:bg-amber-600"
        >
          <Icone nome="calculadora" tamanho={16} />
          Ver cálculos detalhados
        </Link>

        <p className="mt-2.5 text-[11px] leading-relaxed text-ink-muted">
          Estimativa baseada em preços médios de mercado. Ajuste os preços em{" "}
          <Link href="/configuracoes" className="font-semibold text-brand-600 underline">
            Meus preços
          </Link>{" "}
          para o cálculo refletir o que você paga. Não é promessa de lucro.
        </p>
      </div>
    </div>
  );
}
