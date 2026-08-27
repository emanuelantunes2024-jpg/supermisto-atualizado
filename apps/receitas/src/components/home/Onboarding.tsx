"use client";

import { useState } from "react";

import { Botao } from "@/components/ui/Botao";
import { Icone } from "@/components/ui/Icone";
import { useDadosUsuario } from "@/lib/dados-usuario";
import type { LinhaProducao, PerfilOnboarding } from "@/lib/types";

const OBJETIVOS: Array<{ valor: PerfilOnboarding["objetivo"]; rotulo: string; icone: string }> = [
  { valor: "cozinhar", rotulo: "Cozinhar para casa", icone: "chef" },
  { valor: "aprender", rotulo: "Aprender receitas novas", icone: "receitas" },
  { valor: "vender", rotulo: "Vender e ganhar uma renda", icone: "dinheiro" },
  { valor: "produzir", rotulo: "Produzir por encomenda", icone: "alvo" },
  { valor: "economizar", rotulo: "Economizar no dia a dia", icone: "carrinho" },
];

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
];

/**
 * Primeiro acesso: três perguntas rápidas que personalizam a Home e a
 * Central de Renda. Pode ser pulado — nada fica bloqueado por causa dele.
 */
export function Onboarding() {
  const { onboarding, salvarOnboarding, carregando } = useDadosUsuario();
  const [passo, setPasso] = useState(0);
  const [objetivo, setObjetivo] = useState<PerfilOnboarding["objetivo"]>("vender");
  const [investimento, setInvestimento] = useState(50);
  const [linhas, setLinhas] = useState<LinhaProducao[]>([]);

  if (carregando || onboarding?.concluido) return null;

  function concluir(pular = false) {
    salvarOnboarding({
      objetivo,
      investimento,
      linhas: pular ? [] : linhas,
      concluido: true,
    });
  }

  function alternarLinha(valor: LinhaProducao) {
    setLinhas((atual) =>
      atual.includes(valor) ? atual.filter((l) => l !== valor) : [...atual, valor],
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/50 p-0 backdrop-blur-sm app:items-center app:p-6">
      <div className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-white p-6 shadow-pop app:rounded-card">
        <div className="mb-5 flex items-center gap-1.5">
          {[0, 1, 2].map((n) => (
            <span
              key={n}
              className={`h-1.5 flex-1 rounded-pill transition ${
                n <= passo ? "bg-brand-500" : "bg-line"
              }`}
            />
          ))}
        </div>

        {passo === 0 && (
          <div>
            <h2 className="font-display text-xl font-bold text-ink">
              O que você procura aqui?
            </h2>
            <p className="mt-1 text-sm text-ink-muted">
              Usamos a resposta para destacar o que interessa a você na tela inicial.
            </p>

            <div className="mt-4 grid gap-2">
              {OBJETIVOS.map((opcao) => (
                <button
                  key={opcao.valor}
                  type="button"
                  onClick={() => setObjetivo(opcao.valor)}
                  className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm font-semibold transition ${
                    objetivo === opcao.valor
                      ? "border-brand-500 bg-brand-50 text-brand-700"
                      : "border-line bg-white text-ink-soft hover:border-brand-200"
                  }`}
                >
                  <Icone nome={opcao.icone} tamanho={19} />
                  {opcao.rotulo}
                </button>
              ))}
            </div>
          </div>
        )}

        {passo === 1 && (
          <div>
            <h2 className="font-display text-xl font-bold text-ink">
              Quanto pretende investir para começar?
            </h2>
            <p className="mt-1 text-sm text-ink-muted">
              Serve para sugerir receitas que cabem no seu orçamento. Pode mudar depois.
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              {INVESTIMENTOS.map((valor) => (
                <button
                  key={valor}
                  type="button"
                  onClick={() => setInvestimento(valor)}
                  className={`rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${
                    investimento === valor
                      ? "border-brand-500 bg-brand-50 text-brand-700"
                      : "border-line bg-white text-ink-soft hover:border-brand-200"
                  }`}
                >
                  R$ {valor}
                </button>
              ))}
            </div>

            <label className="mt-4 block">
              <span className="rotulo">Outro valor</span>
              <input
                type="number"
                min={0}
                value={investimento}
                onChange={(e) => setInvestimento(Number(e.target.value) || 0)}
                className="campo"
              />
            </label>
          </div>
        )}

        {passo === 2 && (
          <div>
            <h2 className="font-display text-xl font-bold text-ink">
              Que tipo de alimento você quer produzir?
            </h2>
            <p className="mt-1 text-sm text-ink-muted">
              Escolha quantos quiser — ou nenhum, se ainda não decidiu.
            </p>

            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {LINHAS.map((linha) => {
                const marcada = linhas.includes(linha.valor);
                return (
                  <button
                    key={linha.valor}
                    type="button"
                    onClick={() => alternarLinha(linha.valor)}
                    className={`flex flex-col items-center gap-1.5 rounded-xl border px-2 py-3 text-[12px] font-semibold transition ${
                      marcada
                        ? "border-brand-500 bg-brand-50 text-brand-700"
                        : "border-line bg-white text-ink-soft hover:border-brand-200"
                    }`}
                  >
                    <Icone nome={linha.icone} tamanho={20} />
                    {linha.rotulo}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="mt-6 flex items-center gap-2">
          {passo > 0 && (
            <Botao variante="contorno" onClick={() => setPasso((p) => p - 1)}>
              Voltar
            </Botao>
          )}

          {passo < 2 ? (
            <Botao onClick={() => setPasso((p) => p + 1)} className="flex-1">
              Continuar
              <Icone nome="seta-direita" tamanho={16} />
            </Botao>
          ) : (
            <Botao onClick={() => concluir()} className="flex-1">
              Concluir
              <Icone nome="check" tamanho={16} />
            </Botao>
          )}
        </div>

        <button
          type="button"
          onClick={() => concluir(true)}
          className="mt-3 w-full text-center text-[13px] font-semibold text-ink-muted hover:text-ink"
        >
          Pular por enquanto
        </button>
      </div>
    </div>
  );
}
