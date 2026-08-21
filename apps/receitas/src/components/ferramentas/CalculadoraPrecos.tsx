"use client";

import { useMemo, useState } from "react";

import { AvisoSimulacao } from "@/components/ui/Aviso";
import { Icone } from "@/components/ui/Icone";
import { arredondarPrecoComercial, calcularPreco, type ModoMargem } from "@/lib/calculos";
import { formatarMoeda, formatarPercentual } from "@/lib/format";

interface Props {
  custoInicial?: number;
  quantidadeInicial?: number;
}

const MARGENS_RAPIDAS = [0.5, 0.7, 1, 1.5, 2];

/**
 * Calculadora de preço de venda.
 *
 * Aceita as duas formas de pensar margem, porque elas dão resultados
 * diferentes e muita gente confunde: markup soma um percentual sobre o custo;
 * margem é o percentual que sobra do preço de venda.
 */
export function CalculadoraPrecos({ custoInicial = 0, quantidadeInicial = 1 }: Props) {
  const [custoTotal, setCustoTotal] = useState(custoInicial * quantidadeInicial);
  const [quantidade, setQuantidade] = useState(quantidadeInicial);
  const [embalagem, setEmbalagem] = useState(0);
  const [outros, setOutros] = useState(0);
  const [percentual, setPercentual] = useState(0.7);
  const [modo, setModo] = useState<ModoMargem>("markup");

  const resumo = useMemo(() => {
    const totalComExtras = custoTotal + embalagem * quantidade + outros;
    const custoUnitario = quantidade > 0 ? totalComExtras / quantidade : 0;
    return calcularPreco(custoUnitario, quantidade, percentual, modo);
  }, [custoTotal, quantidade, embalagem, outros, percentual, modo]);

  const precoVitrine = arredondarPrecoComercial(resumo.precoSugerido);
  const faturamento = precoVitrine * quantidade;
  const lucro = (precoVitrine - resumo.custoPorUnidade) * quantidade;

  return (
    <div className="grid gap-4 app:grid-cols-[1fr_1fr] app:items-start">
      <div className="cartao flex flex-col gap-3 p-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <label>
            <span className="rotulo">Custo total dos ingredientes (R$)</span>
            <input
              type="number"
              min={0}
              step="0.01"
              value={custoTotal}
              onChange={(e) => setCustoTotal(Math.max(0, Number(e.target.value) || 0))}
              className="campo"
            />
          </label>

          <label>
            <span className="rotulo">Quantidade produzida</span>
            <input
              type="number"
              min={1}
              value={quantidade}
              onChange={(e) => setQuantidade(Math.max(1, Number(e.target.value) || 1))}
              className="campo"
            />
          </label>

          <label>
            <span className="rotulo">Embalagem por unidade (R$)</span>
            <input
              type="number"
              min={0}
              step="0.01"
              value={embalagem}
              onChange={(e) => setEmbalagem(Math.max(0, Number(e.target.value) || 0))}
              className="campo"
            />
          </label>

          <label>
            <span className="rotulo">Outros custos totais (R$)</span>
            <input
              type="number"
              min={0}
              step="0.01"
              value={outros}
              onChange={(e) => setOutros(Math.max(0, Number(e.target.value) || 0))}
              placeholder="Gás, luz, transporte"
              className="campo"
            />
          </label>
        </div>

        <div>
          <span className="rotulo">Como você quer calcular a margem</span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setModo("markup")}
              className={`rounded-xl border px-3 py-2.5 text-left text-[12.5px] font-semibold transition ${
                modo === "markup"
                  ? "border-brand-500 bg-brand-50 text-brand-700"
                  : "border-line bg-white text-ink-muted hover:border-brand-200"
              }`}
            >
              Somar sobre o custo
              <span className="mt-0.5 block text-[11px] font-normal text-ink-muted">
                Custo + {formatarPercentual(percentual)}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setModo("margem")}
              className={`rounded-xl border px-3 py-2.5 text-left text-[12.5px] font-semibold transition ${
                modo === "margem"
                  ? "border-brand-500 bg-brand-50 text-brand-700"
                  : "border-line bg-white text-ink-muted hover:border-brand-200"
              }`}
            >
              Margem sobre a venda
              <span className="mt-0.5 block text-[11px] font-normal text-ink-muted">
                {formatarPercentual(percentual)} do preço é lucro
              </span>
            </button>
          </div>
        </div>

        <div>
          <span className="rotulo">Margem desejada</span>
          <div className="mb-2 flex flex-wrap gap-1.5">
            {MARGENS_RAPIDAS.map((valor) => (
              <button
                key={valor}
                type="button"
                onClick={() => setPercentual(valor)}
                disabled={modo === "margem" && valor >= 1}
                className={`rounded-lg border px-3 py-1.5 text-[12.5px] font-semibold transition disabled:opacity-40 ${
                  percentual === valor
                    ? "border-brand-500 bg-brand-50 text-brand-600"
                    : "border-line bg-white text-ink-muted hover:border-brand-300"
                }`}
              >
                {formatarPercentual(valor)}
              </button>
            ))}
          </div>

          <input
            type="range"
            min={0}
            max={modo === "margem" ? 95 : 300}
            value={Math.round(percentual * 100)}
            onChange={(e) => setPercentual(Number(e.target.value) / 100)}
            className="w-full accent-brand-500"
            aria-label="Margem desejada"
          />
        </div>
      </div>

      {/* ---------------------------------------------------------- resultado */}
      <div className="flex flex-col gap-3">
        <div className="cartao overflow-hidden">
          <h2 className="border-b border-line px-4 py-3 text-[13px] font-bold uppercase tracking-wide text-ink-muted">
            Resultado da simulação
          </h2>

          <dl className="divide-y divide-line/60">
            <div className="flex justify-between gap-3 px-4 py-2.5">
              <dt className="text-[13px] text-ink-soft">Custo por unidade</dt>
              <dd className="text-[13px] font-bold tabular-nums text-ink">
                {formatarMoeda(resumo.custoPorUnidade)}
              </dd>
            </div>

            <div className="flex items-center justify-between gap-3 px-4 py-3">
              <dt className="text-[13px] font-semibold text-ink">Preço sugerido</dt>
              <dd className="text-right">
                <span className="block font-display text-2xl font-extrabold tabular-nums text-money-600">
                  {formatarMoeda(precoVitrine)}
                </span>
                <span className="text-[11px] text-ink-muted">
                  calculado: {formatarMoeda(resumo.precoSugerido)}
                </span>
              </dd>
            </div>

            <div className="flex justify-between gap-3 px-4 py-2.5">
              <dt className="text-[13px] text-ink-soft">Lucro por unidade</dt>
              <dd className="text-[13px] font-bold tabular-nums text-money-600">
                {formatarMoeda(precoVitrine - resumo.custoPorUnidade)}
              </dd>
            </div>

            <div className="flex justify-between gap-3 px-4 py-2.5">
              <dt className="text-[13px] text-ink-soft">Margem sobre a venda</dt>
              <dd className="text-[13px] font-bold tabular-nums text-ink">
                {precoVitrine > 0
                  ? formatarPercentual((precoVitrine - resumo.custoPorUnidade) / precoVitrine)
                  : "—"}
              </dd>
            </div>

            <div className="flex justify-between gap-3 bg-money-50 px-4 py-3">
              <dt className="text-[13px] font-semibold text-ink">
                Faturamento estimado ({quantidade} un.)
              </dt>
              <dd className="font-display text-lg font-extrabold tabular-nums text-money-700">
                {formatarMoeda(faturamento)}
              </dd>
            </div>

            <div className="flex justify-between gap-3 px-4 py-3">
              <dt className="text-[13px] font-semibold text-ink">Lucro estimado no total</dt>
              <dd className="font-display text-base font-extrabold tabular-nums text-money-600">
                {formatarMoeda(lucro)}
              </dd>
            </div>
          </dl>
        </div>

        <div className="cartao flex gap-3 p-4">
          <Icone nome="info" tamanho={18} className="mt-0.5 shrink-0 text-brand-500" />
          <p className="text-[12.5px] leading-relaxed text-ink-soft">
            O preço sugerido já vem arredondado para um valor de vitrine. Antes de fechar o seu
            preço, compare com o que cobram na sua região: preço muito acima do mercado trava a
            venda, e muito abaixo consome a sua margem.
          </p>
        </div>

        <AvisoSimulacao />
      </div>
    </div>
  );
}
