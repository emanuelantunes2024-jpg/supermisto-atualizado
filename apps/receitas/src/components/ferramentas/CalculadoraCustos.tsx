"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { INSUMOS_POR_CHAVE } from "@/data/insumos";
import { AvisoSimulacao } from "@/components/ui/Aviso";
import { Icone } from "@/components/ui/Icone";
import { arredondarPrecoComercial, calcularCusto, precoEmbalagem } from "@/lib/calculos";
import { useDadosUsuario } from "@/lib/dados-usuario";
import { formatarBase, formatarMoeda } from "@/lib/format";
import type { Receita } from "@/lib/types";

interface Props {
  receitas: Receita[];
  slugInicial?: string;
  rendimentoInicial?: number;
}

/**
 * Calculadora de custos.
 *
 * Escolhe-se a receita, ajusta-se o rendimento e os preços de cada
 * ingrediente. Os preços editados são salvos em "Meus preços" e passam a
 * valer em todo o sistema — não só nesta tela.
 */
export function CalculadoraCustos({ receitas, slugInicial, rendimentoInicial }: Props) {
  const { precos, definirPreco } = useDadosUsuario();

  const [slug, setSlug] = useState(slugInicial ?? receitas[0]?.slug ?? "");
  const receita = useMemo(
    () => receitas.find((r) => r.slug === slug) ?? receitas[0],
    [receitas, slug],
  );

  const [rendimento, setRendimento] = useState(rendimentoInicial ?? receita?.rendimento ?? 1);
  const [outrosCustos, setOutrosCustos] = useState(0);
  const [embalagem, setEmbalagem] = useState(receita?.embalagemPorUnidade ?? 0);
  const [incluirOpcionais, setIncluirOpcionais] = useState(false);

  // Ao trocar de receita, volta aos valores próprios dela.
  useEffect(() => {
    if (!receita) return;
    setRendimento(rendimentoInicial ?? receita.rendimento);
    setEmbalagem(receita.embalagemPorUnidade ?? 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [receita?.slug]);

  const custo = useMemo(() => {
    if (!receita) return null;
    return calcularCusto(receita, {
      rendimento,
      precos,
      outrosCustos,
      embalagemPorUnidade: embalagem,
      incluirOpcionais,
    });
  }, [receita, rendimento, precos, outrosCustos, embalagem, incluirOpcionais]);

  if (!receita || !custo) {
    return (
      <p className="cartao p-6 text-center text-sm text-ink-muted">
        Nenhuma receita disponível para calcular.
      </p>
    );
  }

  const margem = receita.margemSugerida ?? 0.7;
  const precoSugerido = arredondarPrecoComercial(custo.custoPorUnidade * (1 + margem));

  return (
    <div className="grid gap-4 app:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] app:items-start">
      <div className="flex flex-col gap-4">
        <div className="cartao p-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <label>
              <span className="rotulo">Receita</span>
              <select value={slug} onChange={(e) => setSlug(e.target.value)} className="campo">
                {receitas.map((r) => (
                  <option key={r.slug} value={r.slug}>
                    {r.nome}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span className="rotulo">Quanto você vai produzir</span>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  value={rendimento}
                  onChange={(e) => setRendimento(Math.max(1, Number(e.target.value) || 1))}
                  className="campo"
                />
                <span className="shrink-0 text-[13px] text-ink-muted">
                  {receita.rendimentoUnidade}
                </span>
              </div>
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
                value={outrosCustos}
                onChange={(e) => setOutrosCustos(Math.max(0, Number(e.target.value) || 0))}
                placeholder="Gás, luz, transporte, seu tempo"
                className="campo"
              />
            </label>
          </div>

          {custo.custoOpcionais > 0 && (
            <label className="mt-3 flex items-center gap-2.5 text-[13px] text-ink-soft">
              <input
                type="checkbox"
                checked={incluirOpcionais}
                onChange={(e) => setIncluirOpcionais(e.target.checked)}
                className="h-4 w-4 rounded border-line text-brand-500 focus:ring-brand-200"
              />
              Incluir ingredientes opcionais ({formatarMoeda(custo.custoOpcionais)})
            </label>
          )}
        </div>

        <div className="cartao overflow-hidden">
          <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3">
            <h2 className="text-[13px] font-bold uppercase tracking-wide text-ink-muted">
              Preço dos ingredientes
            </h2>
            <span className="text-[11.5px] text-ink-muted">Edite e o valor fica salvo</span>
          </div>

          <ul className="divide-y divide-line/60">
            {custo.detalhes.map((detalhe, indice) => {
              const insumo = INSUMOS_POR_CHAVE[detalhe.ingrediente.insumo];
              if (!insumo) return null;

              const precoAtual = precoEmbalagem(detalhe.ingrediente.insumo, precos);
              const personalizado = precos[detalhe.ingrediente.insumo] !== undefined;

              return (
                <li
                  key={`${detalhe.ingrediente.insumo}-${indice}`}
                  className="flex flex-wrap items-center gap-3 px-4 py-3"
                >
                  <div className="min-w-[140px] flex-1">
                    <p className="text-[14px] font-semibold text-ink">
                      {detalhe.nome}
                      {detalhe.ingrediente.opcional && (
                        <span className="ml-1.5 text-[11px] font-medium text-ink-faint">
                          opcional
                        </span>
                      )}
                    </p>
                    <p className="text-[12px] text-ink-muted">
                      Usa {formatarBase(detalhe.quantidade, detalhe.unidadeBase)} ·{" "}
                      {insumo.embalagemRotulo}
                    </p>
                  </div>

                  <label className="flex items-center gap-1.5">
                    <span className="text-[12px] text-ink-muted">R$</span>
                    <input
                      type="number"
                      min={0}
                      step="0.01"
                      value={precoAtual}
                      onChange={(e) =>
                        definirPreco(detalhe.ingrediente.insumo, Number(e.target.value) || 0)
                      }
                      aria-label={`Preço de ${detalhe.nome}`}
                      className={`w-20 rounded-lg border px-2 py-1.5 text-right text-[13px] font-semibold tabular-nums outline-none transition focus:border-brand-300 ${
                        personalizado ? "border-brand-300 bg-brand-50" : "border-line bg-white"
                      }`}
                    />
                  </label>

                  <span className="w-20 shrink-0 text-right text-[13px] font-bold tabular-nums text-ink">
                    {formatarMoeda(detalhe.custo)}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* ------------------------------------------------------------ resumo */}
      <div className="flex flex-col gap-3 app:sticky app:top-20">
        <div className="cartao overflow-hidden">
          <h2 className="border-b border-line px-4 py-3 text-[13px] font-bold uppercase tracking-wide text-ink-muted">
            Resultado
          </h2>

          <dl className="divide-y divide-line/60">
            {[
              { rotulo: "Ingredientes", valor: custo.custoIngredientes },
              ...(custo.custoEmbalagem > 0
                ? [{ rotulo: "Embalagem", valor: custo.custoEmbalagem }]
                : []),
              ...(custo.outrosCustos > 0
                ? [{ rotulo: "Outros custos", valor: custo.outrosCustos }]
                : []),
            ].map((linha) => (
              <div key={linha.rotulo} className="flex justify-between gap-3 px-4 py-2.5">
                <dt className="text-[13px] text-ink-soft">{linha.rotulo}</dt>
                <dd className="text-[13px] font-bold tabular-nums text-ink">
                  {formatarMoeda(linha.valor)}
                </dd>
              </div>
            ))}

            <div className="flex justify-between gap-3 bg-cream-100 px-4 py-3">
              <dt className="text-[13px] font-semibold text-ink">Custo total</dt>
              <dd className="font-display text-lg font-extrabold tabular-nums text-ink">
                {formatarMoeda(custo.custoTotal)}
              </dd>
            </div>

            <div className="flex justify-between gap-3 px-4 py-3">
              <dt className="text-[13px] font-semibold text-ink">
                Custo por {receita.rendimentoUnidade.replace(/s$/, "")}
              </dt>
              <dd className="font-display text-lg font-extrabold tabular-nums text-brand-600">
                {formatarMoeda(custo.custoPorUnidade)}
              </dd>
            </div>
          </dl>
        </div>

        <div className="cartao overflow-hidden">
          <h2 className="border-b border-line px-4 py-3 text-[13px] font-bold uppercase tracking-wide text-ink-muted">
            Se você vender
          </h2>
          <div className="flex items-center justify-between gap-3 px-4 py-3">
            <div>
              <p className="text-[12.5px] text-ink-muted">
                Preço sugerido (margem de {Math.round(margem * 100)}% sobre o custo)
              </p>
              <p className="font-display text-2xl font-extrabold text-money-600">
                {formatarMoeda(precoSugerido)}
              </p>
            </div>
            <Link
              href={`/calculadoras/precos?custo=${custo.custoPorUnidade.toFixed(2)}&quantidade=${rendimento}`}
              className="shrink-0 rounded-xl border border-line px-3 py-2 text-[12.5px] font-semibold text-ink-soft transition hover:border-brand-300 hover:text-brand-600"
            >
              <Icone nome="etiqueta" tamanho={15} className="mr-1 inline" />
              Ajustar preço
            </Link>
          </div>
        </div>

        <AvisoSimulacao />
      </div>
    </div>
  );
}
