"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { AvisoSimulacao } from "@/components/ui/Aviso";
import { Icone } from "@/components/ui/Icone";
import { simularObjetivo } from "@/lib/calculos";
import { useDadosUsuario } from "@/lib/dados-usuario";
import { formatarMoeda } from "@/lib/format";
import type { Receita } from "@/lib/types";

const METAS_FATURAMENTO = [300, 500, 1000, 2000];
const METAS_UNIDADES = [50, 100, 200, 500];

/**
 * Simulador de objetivo.
 *
 * Responde "o que eu preciso produzir para chegar em X" — em faturamento ou
 * em unidades. É uma projeção matemática: não considera se haverá comprador.
 */
export function SimuladorObjetivo({ receitas }: { receitas: Receita[] }) {
  const { precos } = useDadosUsuario();

  const [tipo, setTipo] = useState<"faturamento" | "unidades">("faturamento");
  const [alvo, setAlvo] = useState(500);
  const [slug, setSlug] = useState(receitas[0]?.slug ?? "");

  const receita = useMemo(
    () => receitas.find((r) => r.slug === slug) ?? receitas[0],
    [receitas, slug],
  );

  const simulacao = useMemo(
    () => (receita ? simularObjetivo(receita, alvo, tipo, precos) : null),
    [receita, alvo, tipo, precos],
  );

  if (!receita || !simulacao) {
    return <p className="cartao p-6 text-center text-sm text-ink-muted">Nenhuma receita disponível.</p>;
  }

  const metas = tipo === "faturamento" ? METAS_FATURAMENTO : METAS_UNIDADES;

  return (
    <div className="grid gap-4 app:grid-cols-[1fr_1fr] app:items-start">
      <div className="cartao flex flex-col gap-4 p-4 app:p-5">
        <div>
          <span className="rotulo">Qual é o seu objetivo?</span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                setTipo("faturamento");
                setAlvo(500);
              }}
              className={`rounded-xl border px-3 py-2.5 text-[13px] font-semibold transition ${
                tipo === "faturamento"
                  ? "border-brand-500 bg-brand-50 text-brand-700"
                  : "border-line bg-white text-ink-muted hover:border-brand-200"
              }`}
            >
              Quero faturar
            </button>
            <button
              type="button"
              onClick={() => {
                setTipo("unidades");
                setAlvo(100);
              }}
              className={`rounded-xl border px-3 py-2.5 text-[13px] font-semibold transition ${
                tipo === "unidades"
                  ? "border-brand-500 bg-brand-50 text-brand-700"
                  : "border-line bg-white text-ink-muted hover:border-brand-200"
              }`}
            >
              Quero vender
            </button>
          </div>
        </div>

        <div>
          <span className="rotulo">
            {tipo === "faturamento" ? "Faturamento desejado" : "Quantidade a vender"}
          </span>
          <div className="mb-2 flex flex-wrap gap-1.5">
            {metas.map((valor) => (
              <button
                key={valor}
                type="button"
                onClick={() => setAlvo(valor)}
                className={`rounded-lg border px-3 py-1.5 text-[12.5px] font-semibold transition ${
                  alvo === valor
                    ? "border-brand-500 bg-brand-50 text-brand-600"
                    : "border-line bg-white text-ink-muted hover:border-brand-300"
                }`}
              >
                {tipo === "faturamento" ? `R$ ${valor}` : `${valor} un.`}
              </button>
            ))}
          </div>
          <input
            type="number"
            min={1}
            value={alvo}
            onChange={(e) => setAlvo(Math.max(1, Number(e.target.value) || 1))}
            className="campo"
          />
        </div>

        <label>
          <span className="rotulo">Com qual receita?</span>
          <select value={slug} onChange={(e) => setSlug(e.target.value)} className="campo">
            {receitas.map((r) => (
              <option key={r.slug} value={r.slug}>
                {r.nome}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="flex flex-col gap-3">
        <div className="cartao overflow-hidden">
          <h2 className="border-b border-line px-4 py-3 text-[13px] font-bold uppercase tracking-wide text-ink-muted">
            Para chegar nesse objetivo
          </h2>

          <dl className="divide-y divide-line/60">
            <div className="flex items-center justify-between gap-3 px-4 py-3">
              <dt className="text-[13px] font-semibold text-ink">Unidades a vender</dt>
              <dd className="font-display text-2xl font-extrabold tabular-nums text-brand-600">
                {simulacao.unidadesNecessarias}
              </dd>
            </div>

            <div className="flex justify-between gap-3 px-4 py-2.5">
              <dt className="text-[13px] text-ink-soft">Vezes que a receita precisa ser feita</dt>
              <dd className="text-[13px] font-bold tabular-nums text-ink">
                {simulacao.producoesNecessarias}x
              </dd>
            </div>

            <div className="flex justify-between gap-3 px-4 py-2.5">
              <dt className="text-[13px] text-ink-soft">Preço sugerido por unidade</dt>
              <dd className="text-[13px] font-bold tabular-nums text-ink">
                {formatarMoeda(simulacao.precoSugerido)}
              </dd>
            </div>

            <div className="flex justify-between gap-3 px-4 py-2.5">
              <dt className="text-[13px] text-ink-soft">Investimento necessário</dt>
              <dd className="text-[13px] font-bold tabular-nums text-ink">
                {formatarMoeda(simulacao.custoTotal)}
              </dd>
            </div>

            <div className="flex justify-between gap-3 bg-money-50 px-4 py-3">
              <dt className="text-[13px] font-semibold text-ink">Faturamento estimado</dt>
              <dd className="font-display text-lg font-extrabold tabular-nums text-money-700">
                {formatarMoeda(simulacao.faturamentoEstimado)}
              </dd>
            </div>

            <div className="flex justify-between gap-3 px-4 py-3">
              <dt className="text-[13px] font-semibold text-ink">Lucro estimado</dt>
              <dd className="font-display text-base font-extrabold tabular-nums text-money-600">
                {formatarMoeda(simulacao.lucroEstimado)}
              </dd>
            </div>
          </dl>

          <div className="border-t border-line px-4 py-3">
            <Link
              href={`/receitas/${receita.slug}`}
              className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-brand-600 hover:underline"
            >
              Ver a receita completa
              <Icone nome="chevron-direita" tamanho={15} />
            </Link>
          </div>
        </div>

        <div className="cartao flex gap-3 p-4">
          <Icone nome="alvo" tamanho={18} className="mt-0.5 shrink-0 text-brand-500" />
          <p className="text-[12.5px] leading-relaxed text-ink-soft">
            O cálculo mostra o que seria preciso produzir e vender. Ele não considera se haverá
            comprador para tudo — comece com uma produção pequena, confirme a procura e só depois
            aumente a escala.
          </p>
        </div>

        <AvisoSimulacao />
      </div>
    </div>
  );
}
