"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { CapaReceita } from "@/components/receitas/CapaReceita";
import { AvisoSimulacao } from "@/components/ui/Aviso";
import { Icone } from "@/components/ui/Icone";
import { Selo } from "@/components/ui/Selo";
import { simularProducao } from "@/lib/calculos";
import { useDadosUsuario } from "@/lib/dados-usuario";
import { formatarMoeda } from "@/lib/format";
import type { CanalVenda, LinhaProducao, Objetivo, Receita } from "@/lib/types";

const INVESTIMENTOS = [30, 50, 100, 200, 500];

const LINHAS: Array<{ valor: LinhaProducao; rotulo: string; icone: string }> = [
  { valor: "doces", rotulo: "Doces", icone: "doce" },
  { valor: "bolos", rotulo: "Bolos", icone: "bolo" },
  { valor: "salgados", rotulo: "Salgados", icone: "salgado" },
  { valor: "paes", rotulo: "Pães", icone: "pao" },
  { valor: "sorvetes", rotulo: "Sorvetes", icone: "picole" },
  { valor: "picoles", rotulo: "Picolés", icone: "picole" },
  { valor: "geladinhos", rotulo: "Geladinhos", icone: "picole" },
  { valor: "sobremesas", rotulo: "Sobremesas", icone: "sobremesa" },
  { valor: "outros", rotulo: "Outros", icone: "receitas" },
];

const CANAIS: Array<{ valor: CanalVenda; rotulo: string; icone: string }> = [
  { valor: "whatsapp", rotulo: "WhatsApp", icone: "whatsapp" },
  { valor: "vizinhanca", rotulo: "Vizinhança", icone: "inicio" },
  { valor: "trabalho", rotulo: "Trabalho", icone: "painel" },
  { valor: "escola", rotulo: "Escola", icone: "receitas" },
  { valor: "eventos", rotulo: "Eventos", icone: "estrela" },
  { valor: "encomendas", rotulo: "Encomendas", icone: "etiqueta" },
  { valor: "delivery", rotulo: "Delivery", icone: "carrinho" },
];

/** Objetivos de receita que combinam com cada canal de venda. */
const OBJETIVOS_DO_CANAL: Record<CanalVenda, Objetivo[]> = {
  whatsapp: ["venda", "encomenda", "delivery"],
  vizinhanca: ["venda"],
  trabalho: ["venda"],
  escola: ["venda"],
  eventos: ["festa", "encomenda"],
  encomendas: ["encomenda"],
  delivery: ["delivery"],
};

export function CentralRenda({ receitas }: { receitas: Receita[] }) {
  const { precos, onboarding } = useDadosUsuario();

  const [investimento, setInvestimento] = useState(onboarding?.investimento ?? 50);
  const [linhas, setLinhas] = useState<LinhaProducao[]>(onboarding?.linhas ?? []);
  const [canais, setCanais] = useState<CanalVenda[]>([]);
  const [mostrarResultado, setMostrarResultado] = useState(false);

  const sugestoes = useMemo(() => {
    const objetivosDesejados = new Set(canais.flatMap((c) => OBJETIVOS_DO_CANAL[c]));

    return receitas
      .filter((r) => r.paraVender)
      .filter((r) => (linhas.length === 0 ? true : linhas.includes(r.linha)))
      .filter((r) =>
        objetivosDesejados.size === 0
          ? true
          : r.objetivos.some((o) => objetivosDesejados.has(o)),
      )
      .map((receita) => simularProducao(receita, investimento, precos))
      // Só faz sentido sugerir o que cabe no valor informado.
      .filter((s) => s.quantidadePossivel > 0)
      .sort((a, b) => b.lucroEstimado - a.lucroEstimado)
      .slice(0, 12);
  }, [receitas, linhas, canais, investimento, precos]);

  function alternar<T>(lista: T[], valor: T, definir: (v: T[]) => void) {
    definir(lista.includes(valor) ? lista.filter((i) => i !== valor) : [...lista, valor]);
  }

  return (
    <div className="grid gap-4 app:grid-cols-[1fr_1.15fr] app:items-start">
      {/* ------------------------------------------------------- questionário */}
      <div className="cartao flex flex-col gap-5 p-4 app:p-5">
        <div>
          <p className="mb-2 text-[14px] font-bold text-ink">
            1. Quanto você tem para começar?
          </p>
          <div className="flex flex-wrap gap-1.5">
            {INVESTIMENTOS.map((valor) => (
              <button
                key={valor}
                type="button"
                onClick={() => setInvestimento(valor)}
                className={`rounded-lg border px-3.5 py-2 text-[13px] font-semibold transition ${
                  investimento === valor
                    ? "border-brand-500 bg-brand-50 text-brand-600"
                    : "border-line bg-white text-ink-muted hover:border-brand-300"
                }`}
              >
                R$ {valor}
              </button>
            ))}
          </div>
          <label className="mt-2.5 block">
            <span className="rotulo">Outro valor</span>
            <input
              type="number"
              min={0}
              value={investimento}
              onChange={(e) => setInvestimento(Math.max(0, Number(e.target.value) || 0))}
              className="campo"
            />
          </label>
        </div>

        <div>
          <p className="mb-2 text-[14px] font-bold text-ink">2. O que você quer produzir?</p>
          <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-5 app:grid-cols-3">
            {LINHAS.map((linha) => {
              const marcada = linhas.includes(linha.valor);
              return (
                <button
                  key={linha.valor}
                  type="button"
                  onClick={() => alternar(linhas, linha.valor, setLinhas)}
                  className={`flex flex-col items-center gap-1 rounded-xl border px-2 py-2.5 text-[11.5px] font-semibold transition ${
                    marcada
                      ? "border-brand-500 bg-brand-50 text-brand-600"
                      : "border-line bg-white text-ink-muted hover:border-brand-300"
                  }`}
                >
                  <Icone nome={linha.icone} tamanho={19} />
                  {linha.rotulo}
                </button>
              );
            })}
          </div>
          <p className="mt-1.5 text-[11.5px] text-ink-muted">
            Sem escolher nada, mostramos todas as linhas.
          </p>
        </div>

        <div>
          <p className="mb-2 text-[14px] font-bold text-ink">3. Onde pretende vender?</p>
          <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-4 app:grid-cols-3">
            {CANAIS.map((canal) => {
              const marcada = canais.includes(canal.valor);
              return (
                <button
                  key={canal.valor}
                  type="button"
                  onClick={() => alternar(canais, canal.valor, setCanais)}
                  className={`flex flex-col items-center gap-1 rounded-xl border px-2 py-2.5 text-[11.5px] font-semibold transition ${
                    marcada
                      ? "border-brand-500 bg-brand-50 text-brand-600"
                      : "border-line bg-white text-ink-muted hover:border-brand-300"
                  }`}
                >
                  <Icone nome={canal.icone} tamanho={19} />
                  {canal.rotulo}
                </button>
              );
            })}
          </div>
        </div>

        <button
          type="button"
          onClick={() => setMostrarResultado(true)}
          className="w-full rounded-xl bg-brand-500 px-4 py-3 text-[14px] font-bold text-white transition hover:bg-brand-600"
        >
          Ver sugestões de receitas
        </button>
      </div>

      {/* ---------------------------------------------------------- sugestões */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-display text-lg font-bold text-ink">Sugestões para você</h2>
          {sugestoes.length > 0 && (
            <span className="text-[12px] text-ink-muted">
              com {formatarMoeda(investimento)}
            </span>
          )}
        </div>

        {!mostrarResultado && sugestoes.length === 0 ? (
          <div className="cartao px-5 py-10 text-center">
            <Icone nome="renda" tamanho={30} className="mx-auto mb-2 text-brand-400" />
            <p className="text-[14px] font-semibold text-ink">
              Responda as perguntas ao lado
            </p>
            <p className="mx-auto mt-1 max-w-xs text-[13px] text-ink-muted">
              A partir das suas respostas, montamos uma simulação com custo, rendimento e preço
              sugerido de cada receita.
            </p>
          </div>
        ) : sugestoes.length === 0 ? (
          <div className="cartao px-5 py-10 text-center">
            <p className="text-[14px] font-semibold text-ink">
              Nenhuma receita cabe em {formatarMoeda(investimento)}
            </p>
            <p className="mx-auto mt-1 max-w-xs text-[13px] text-ink-muted">
              Aumente o valor disponível ou escolha outras linhas de produção. Geladinhos e
              picolés costumam ser os que exigem menos investimento.
            </p>
          </div>
        ) : (
          <>
            <ul className="flex flex-col gap-2.5">
              {sugestoes.map((sugestao) => (
                <li key={sugestao.receita.slug} className="cartao cartao-hover overflow-hidden">
                  <Link href={`/receitas/${sugestao.receita.slug}`} className="flex gap-3.5 p-3">
                    <span className="relative h-[86px] w-[86px] shrink-0 overflow-hidden rounded-xl bg-cream-200">
                      <CapaReceita
                        nome={sugestao.receita.nome}
                        categoria={sugestao.receita.categoria}
                        imagem={sugestao.receita.imagem}
                        tamanhos="86px"
                      />
                    </span>

                    <div className="min-w-0 flex-1">
                      <h3 className="text-[14px] font-bold leading-tight text-ink">
                        {sugestao.receita.nome}
                      </h3>

                      <dl className="mt-1.5 grid grid-cols-2 gap-x-3 gap-y-0.5 text-[12px]">
                        <div className="flex justify-between gap-2">
                          <dt className="text-ink-muted">Custo:</dt>
                          <dd className="font-semibold tabular-nums text-ink">
                            {formatarMoeda(sugestao.custoTotal)}
                          </dd>
                        </div>
                        <div className="flex justify-between gap-2">
                          <dt className="text-ink-muted">Rende:</dt>
                          <dd className="font-semibold tabular-nums text-ink">
                            {sugestao.quantidadePossivel} un.
                          </dd>
                        </div>
                        <div className="flex justify-between gap-2">
                          <dt className="text-ink-muted">Preço sug.:</dt>
                          <dd className="font-semibold tabular-nums text-ink">
                            {formatarMoeda(sugestao.precoSugerido)}
                          </dd>
                        </div>
                        <div className="flex justify-between gap-2">
                          <dt className="text-ink-muted">Faturamento:</dt>
                          <dd className="font-semibold tabular-nums text-money-600">
                            {formatarMoeda(sugestao.faturamentoEstimado)}
                          </dd>
                        </div>
                      </dl>

                      <p className="mt-1.5 flex flex-wrap items-center gap-1.5">
                        <Selo tom="dinheiro">
                          Lucro estimado: {formatarMoeda(sugestao.lucroEstimado)}
                        </Selo>
                        {sugestao.sobra > 0 && (
                          <span className="text-[11px] text-ink-muted">
                            sobram {formatarMoeda(sugestao.sobra)}
                          </span>
                        )}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>

            <AvisoSimulacao />
          </>
        )}
      </div>
    </div>
  );
}
