"use client";

import Link from "next/link";
import { useState } from "react";

import { CartaoReceita } from "@/components/receitas/CartaoReceita";
import { Botao } from "@/components/ui/Botao";
import { Icone } from "@/components/ui/Icone";
import { Vazio } from "@/components/ui/Vazio";
import { useDadosUsuario } from "@/lib/dados-usuario";
import type { Receita } from "@/lib/types";

/** Coleções do usuário: criar, remover e ver o que está guardado em cada uma. */
export function GerenciadorColecoes({ receitas }: { receitas: Receita[] }) {
  const { colecoes, criarColecao, removerColecao, alternarNaColecao, carregando } =
    useDadosUsuario();
  const [nome, setNome] = useState("");
  const [ativa, setAtiva] = useState<string | null>(null);

  if (carregando) {
    return <div className="cartao h-40 animate-pulse bg-cream-200" />;
  }

  const colecaoAtiva = colecoes.find((c) => c.id === ativa) ?? colecoes[0];
  const receitasDaColecao = receitas.filter((r) => colecaoAtiva?.receitas.includes(r.slug));

  return (
    <div className="flex flex-col gap-4">
      <form
        onSubmit={(evento) => {
          evento.preventDefault();
          const limpo = nome.trim();
          if (!limpo) return;
          criarColecao(limpo);
          setNome("");
        }}
        className="cartao flex flex-wrap items-end gap-2.5 p-4"
      >
        <label className="min-w-[200px] flex-1">
          <span className="rotulo">Nova coleção</span>
          <input
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Ex.: Encomendas de dezembro"
            className="campo"
          />
        </label>
        <Botao type="submit" disabled={!nome.trim()}>
          <Icone nome="mais" tamanho={16} />
          Criar coleção
        </Botao>
      </form>

      <div className="rolagem-limpa -mx-4 flex gap-1.5 overflow-x-auto px-4 app:mx-0 app:flex-wrap app:px-0">
        {colecoes.map((colecao) => (
          <button
            key={colecao.id}
            type="button"
            onClick={() => setAtiva(colecao.id)}
            className={`inline-flex shrink-0 items-center gap-2 rounded-lg border px-3 py-2 text-[12.5px] font-semibold transition ${
              colecaoAtiva?.id === colecao.id
                ? "border-brand-500 bg-brand-50 text-brand-600"
                : "border-line bg-white text-ink-muted hover:border-brand-300"
            }`}
          >
            <Icone nome="colecoes" tamanho={15} />
            {colecao.nome}
            <span className="rounded-pill bg-cream-200 px-1.5 py-0.5 text-[10px] text-ink-soft">
              {colecao.receitas.length}
            </span>
          </button>
        ))}
      </div>

      {colecaoAtiva && (
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-display text-lg font-bold text-ink">{colecaoAtiva.nome}</h2>
          {!colecaoAtiva.fixa && (
            <button
              type="button"
              onClick={() => {
                removerColecao(colecaoAtiva.id);
                setAtiva(null);
              }}
              className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-ink-muted transition hover:text-brand-600"
            >
              <Icone nome="lixo" tamanho={15} />
              Excluir coleção
            </button>
          )}
        </div>
      )}

      {receitasDaColecao.length === 0 ? (
        <Vazio
          icone="colecoes"
          titulo="Esta coleção está vazia"
          descricao="Adicione receitas a ela para organizar sua produção por tema, cliente ou data."
          acao={
            <Link
              href="/receitas"
              className="text-[13px] font-semibold text-brand-600 underline"
            >
              Ver receitas
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 app:grid-cols-4">
          {receitasDaColecao.map((receita) => (
            <div key={receita.slug} className="relative">
              <CartaoReceita receita={receita} />
              <button
                type="button"
                onClick={() => alternarNaColecao(colecaoAtiva!.id, receita.slug)}
                className="absolute bottom-2 right-2 rounded-lg bg-white/90 px-2 py-1 text-[11px] font-semibold text-ink-muted shadow-card transition hover:text-brand-600"
              >
                Remover
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
