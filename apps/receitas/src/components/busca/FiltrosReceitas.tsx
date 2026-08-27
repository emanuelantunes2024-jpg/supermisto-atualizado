"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { CATEGORIAS } from "@/data/categorias";
import { Icone } from "@/components/ui/Icone";

/** Opções de filtro exibidas na listagem e na busca. */
const TEMPOS = [
  { valor: "15", rotulo: "Até 15 min" },
  { valor: "30", rotulo: "Até 30 min" },
  { valor: "60", rotulo: "Até 1 hora" },
  { valor: "999", rotulo: "Acima de 1 hora" },
];

const DIFICULDADES = [
  { valor: "facil", rotulo: "Fácil" },
  { valor: "medio", rotulo: "Médio" },
  { valor: "avancado", rotulo: "Avançado" },
];

const OBJETIVOS = [
  { valor: "familia", rotulo: "Família" },
  { valor: "festa", rotulo: "Festa" },
  { valor: "encomenda", rotulo: "Encomenda" },
  { valor: "venda", rotulo: "Venda" },
  { valor: "delivery", rotulo: "Delivery" },
];

const INVESTIMENTOS = [
  { valor: "30", rotulo: "Até R$ 30" },
  { valor: "50", rotulo: "Até R$ 50" },
  { valor: "100", rotulo: "Até R$ 100" },
  { valor: "200", rotulo: "Até R$ 200" },
];

interface Props {
  /** Caminho da página que recebe os filtros. */
  base: string;
}

export function FiltrosReceitas({ base }: Props) {
  const router = useRouter();
  const params = useSearchParams();
  const [aberto, setAberto] = useState(false);

  function aplicar(chave: string, valor: string | null) {
    const novos = new URLSearchParams(params?.toString() ?? "");
    if (valor === null || novos.get(chave) === valor) novos.delete(chave);
    else novos.set(chave, valor);
    novos.delete("pagina");
    router.push(`${base}?${novos.toString()}`);
  }

  function limpar() {
    const novos = new URLSearchParams();
    const termo = params?.get("q");
    if (termo) novos.set("q", termo);
    router.push(`${base}?${novos.toString()}`);
  }

  const ativos = ["categoria", "tempo", "dificuldade", "objetivo", "investimento", "vender"].filter(
    (chave) => params?.get(chave),
  ).length;

  function Grupo({
    titulo,
    chave,
    opcoes,
  }: {
    titulo: string;
    chave: string;
    opcoes: Array<{ valor: string; rotulo: string }>;
  }) {
    const atual = params?.get(chave);

    return (
      <div>
        <p className="rotulo">{titulo}</p>
        <div className="flex flex-wrap gap-1.5">
          {opcoes.map((opcao) => (
            <button
              key={opcao.valor}
              type="button"
              onClick={() => aplicar(chave, opcao.valor)}
              className={`rounded-lg border px-3 py-1.5 text-[12.5px] font-semibold transition ${
                atual === opcao.valor
                  ? "border-brand-500 bg-brand-50 text-brand-600"
                  : "border-line bg-white text-ink-muted hover:border-brand-300"
              }`}
            >
              {opcao.rotulo}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="cartao overflow-hidden">
      <button
        type="button"
        onClick={() => setAberto((a) => !a)}
        aria-expanded={aberto}
        className="flex w-full items-center gap-2 px-4 py-3 text-left"
      >
        <Icone nome="filtro" tamanho={17} className="text-brand-500" />
        <span className="text-[14px] font-bold text-ink">Filtros</span>
        {ativos > 0 && (
          <span className="rounded-pill bg-brand-500 px-2 py-0.5 text-[11px] font-bold text-white">
            {ativos}
          </span>
        )}
        <Icone
          nome="chevron-baixo"
          tamanho={17}
          className={`ml-auto text-ink-muted transition ${aberto ? "rotate-180" : ""}`}
        />
      </button>

      {aberto && (
        <div className="flex flex-col gap-4 border-t border-line px-4 py-4">
          <Grupo
            titulo="Categoria"
            chave="categoria"
            opcoes={CATEGORIAS.map((c) => ({ valor: c.slug, rotulo: c.nome }))}
          />
          <Grupo titulo="Tempo de preparo" chave="tempo" opcoes={TEMPOS} />
          <Grupo titulo="Dificuldade" chave="dificuldade" opcoes={DIFICULDADES} />
          <Grupo titulo="Objetivo" chave="objetivo" opcoes={OBJETIVOS} />
          <Grupo titulo="Investimento na produção" chave="investimento" opcoes={INVESTIMENTOS} />

          <div className="flex flex-wrap items-center gap-2 border-t border-line pt-3.5">
            <button
              type="button"
              onClick={() => aplicar("vender", "1")}
              className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[12.5px] font-semibold transition ${
                params?.get("vender")
                  ? "border-money-500 bg-money-50 text-money-700"
                  : "border-line bg-white text-ink-muted hover:border-money-500/50"
              }`}
            >
              <Icone nome="dinheiro" tamanho={15} />
              Somente receitas para vender
            </button>

            {ativos > 0 && (
              <button
                type="button"
                onClick={limpar}
                className="ml-auto text-[12.5px] font-semibold text-ink-muted underline hover:text-brand-600"
              >
                Limpar filtros
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
