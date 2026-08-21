"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { CATEGORIAS_POR_SLUG } from "@/data/categorias";
import { INSUMOS_POR_CHAVE } from "@/data/insumos";
import { CapaReceita } from "@/components/receitas/CapaReceita";
import { PainelCustos } from "@/components/receitas/PainelCustos";
import { Icone } from "@/components/ui/Icone";
import { Selo } from "@/components/ui/Selo";
import { calcularCusto, fatorRendimento } from "@/lib/calculos";
import { useDadosUsuario } from "@/lib/dados-usuario";
import {
  formatarBase,
  formatarMoeda,
  formatarQuantidade,
  formatarTempo,
  pluralizarUnidade,
  ROTULO_DIFICULDADE,
} from "@/lib/format";
import { ehNovidade, opcoesRendimento } from "@/lib/receitas-util";
import type { Receita } from "@/lib/types";

type Aba = "ingredientes" | "preparo" | "dicas" | "conservacao" | "equipamentos" | "informacoes";

const ABAS: Array<{ id: Aba; rotulo: string }> = [
  { id: "ingredientes", rotulo: "Ingredientes" },
  { id: "preparo", rotulo: "Modo de preparo" },
  { id: "dicas", rotulo: "Dicas" },
  { id: "conservacao", rotulo: "Conservação" },
  { id: "equipamentos", rotulo: "Equipamentos" },
  { id: "informacoes", rotulo: "Informações" },
];

export function DetalheReceita({ receita }: { receita: Receita }) {
  const { ehFavorito, alternarFavorito, adicionarReceitaNaLista, precos, registrarVisita } =
    useDadosUsuario();

  const [rendimento, setRendimento] = useState(receita.rendimento);
  const [aba, setAba] = useState<Aba>("ingredientes");
  const [mensagem, setMensagem] = useState<string | null>(null);

  const favorito = ehFavorito(receita.slug);
  const categoria = CATEGORIAS_POR_SLUG[receita.categoria];
  const fator = fatorRendimento(receita, rendimento);

  const custo = useMemo(
    () => calcularCusto(receita, { rendimento, precos }),
    [receita, rendimento, precos],
  );

  // Registra a visita uma vez por receita aberta, para "Vistas recentemente".
  useEffect(() => {
    registrarVisita(receita.slug);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [receita.slug]);

  // A mensagem de confirmação some sozinha.
  useEffect(() => {
    if (!mensagem) return;
    const id = setTimeout(() => setMensagem(null), 3200);
    return () => clearTimeout(id);
  }, [mensagem]);

  const grupos = useMemo(() => {
    const mapa = new Map<string, typeof receita.ingredientes>();
    for (const ingrediente of receita.ingredientes) {
      const chave = ingrediente.grupo ?? "";
      if (!mapa.has(chave)) mapa.set(chave, []);
      mapa.get(chave)!.push(ingrediente);
    }
    return Array.from(mapa.entries());
  }, [receita.ingredientes]);

  function adicionarNaLista() {
    const total = adicionarReceitaNaLista(receita, rendimento);
    setMensagem(`${total} ingredientes somados à sua lista de compras.`);
  }

  async function compartilhar() {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: receita.nome, text: receita.descricao, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setMensagem("Link copiado para a área de transferência.");
    } catch {
      // O usuário cancelou o compartilhamento: nada a fazer.
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <Link
        href="/receitas"
        className="inline-flex w-fit items-center gap-1.5 rounded-xl border border-line bg-white px-3 py-2 text-[13px] font-semibold text-ink-soft transition hover:border-brand-300 hover:text-brand-600"
      >
        <Icone nome="seta-esquerda" tamanho={15} />
        Voltar
      </Link>

      <div className="grid gap-5 app:grid-cols-[1.35fr_1fr] app:items-start">
        {/* ---------------------------------------------------- coluna esquerda */}
        <div className="flex flex-col gap-5">
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-card bg-cream-200">
            <CapaReceita
              nome={receita.nome}
              categoria={receita.categoria}
              imagem={receita.imagem}
              prioridade
              tamanhos="(max-width: 1024px) 100vw, 720px"
            />
            {ehNovidade(receita) && (
              <span className="absolute left-3 top-3 rounded-pill bg-brand-500 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
                Novo
              </span>
            )}
          </div>

          {/* Abas */}
          <div className="cartao overflow-hidden">
            <div
              className="rolagem-limpa flex overflow-x-auto border-b border-line"
              role="tablist"
              aria-label="Conteúdo da receita"
            >
              {ABAS.map((item) => (
                <button
                  key={item.id}
                  role="tab"
                  aria-selected={aba === item.id}
                  onClick={() => setAba(item.id)}
                  className={`shrink-0 border-b-2 px-4 py-3 text-[13px] font-semibold transition ${
                    aba === item.id
                      ? "border-brand-500 text-brand-600"
                      : "border-transparent text-ink-muted hover:text-ink"
                  }`}
                >
                  {item.rotulo}
                </button>
              ))}
            </div>

            <div className="p-4 app:p-5">
              {aba === "ingredientes" && (
                <div className="flex flex-col gap-5">
                  {grupos.map(([grupo, itens]) => (
                    <div key={grupo || "principal"}>
                      {grupo && (
                        <h3 className="mb-2 font-display text-[15px] font-bold text-ink">
                          {grupo}
                        </h3>
                      )}
                      <ul className="flex flex-col">
                        {itens.map((ingrediente, indice) => {
                          const insumo = INSUMOS_POR_CHAVE[ingrediente.insumo];
                          const qtd = ingrediente.qtd * fator;
                          const medidaBase = ingrediente.base * fator;
                          const unidadeEhBase = ["g", "ml", "un", "unidade"].includes(
                            ingrediente.unidade,
                          );

                          return (
                            <li
                              key={`${ingrediente.insumo}-${indice}`}
                              className="flex items-baseline justify-between gap-4 border-b border-line/60 py-2.5 last:border-0"
                            >
                              <span className="flex items-baseline gap-2 text-[14px] text-ink-soft">
                                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-300" />
                                <span>
                                  {insumo?.nome ?? ingrediente.insumo}
                                  {ingrediente.observacao && (
                                    <span className="text-ink-muted"> — {ingrediente.observacao}</span>
                                  )}
                                  {ingrediente.opcional && (
                                    <span className="ml-1.5 text-[11px] font-semibold text-ink-faint">
                                      (opcional)
                                    </span>
                                  )}
                                </span>
                              </span>

                              <span className="shrink-0 text-right text-[13px] font-bold tabular-nums text-ink">
                                {formatarQuantidade(qtd)}{" "}
                                {pluralizarUnidade(ingrediente.unidade, qtd)}
                                {!unidadeEhBase && insumo && (
                                  <span className="block text-[11px] font-medium text-ink-muted">
                                    {formatarBase(medidaBase, insumo.unidadeBase)}
                                  </span>
                                )}
                              </span>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  ))}
                </div>
              )}

              {aba === "preparo" && (
                <ol className="flex flex-col gap-3.5">
                  {receita.preparo.map((passo, indice) => (
                    <li key={indice} className="flex gap-3">
                      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brand-50 text-[12px] font-bold text-brand-600">
                        {indice + 1}
                      </span>
                      <div>
                        {passo.titulo && (
                          <p className="text-[12px] font-bold uppercase tracking-wide text-brand-500">
                            {passo.titulo}
                          </p>
                        )}
                        <p className="text-[14px] leading-relaxed text-ink-soft">{passo.texto}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              )}

              {aba === "dicas" && (
                <ul className="flex flex-col gap-3">
                  {receita.dicas.map((dica, indice) => (
                    <li key={indice} className="flex gap-2.5">
                      <Icone nome="raio" tamanho={17} className="mt-0.5 shrink-0 text-amber-500" />
                      <p className="text-[14px] leading-relaxed text-ink-soft">{dica}</p>
                    </li>
                  ))}
                </ul>
              )}

              {aba === "conservacao" && (
                <p className="text-[14px] leading-relaxed text-ink-soft">{receita.conservacao}</p>
              )}

              {aba === "equipamentos" && (
                <ul className="grid gap-2 sm:grid-cols-2">
                  {receita.equipamentos.map((equipamento) => (
                    <li
                      key={equipamento}
                      className="flex items-center gap-2 rounded-xl border border-line px-3 py-2.5 text-[13px] text-ink-soft"
                    >
                      <Icone nome="check" tamanho={15} className="shrink-0 text-money-500" />
                      {equipamento}
                    </li>
                  ))}
                </ul>
              )}

              {aba === "informacoes" && (
                <dl className="grid gap-3 sm:grid-cols-2">
                  {[
                    { rotulo: "Categoria", valor: categoria?.nome ?? receita.categoria },
                    { rotulo: "Subcategoria", valor: receita.subcategoria ?? "—" },
                    { rotulo: "Tempo de preparo", valor: formatarTempo(receita.tempoMinutos) },
                    { rotulo: "Dificuldade", valor: ROTULO_DIFICULDADE[receita.dificuldade] },
                    {
                      rotulo: "Rendimento original",
                      valor: `${receita.rendimento} ${receita.rendimentoUnidade}`,
                    },
                    {
                      rotulo: "Custo estimado da receita",
                      valor: formatarMoeda(custo.custoTotal),
                    },
                    {
                      rotulo: "Indicada para venda",
                      valor: receita.paraVender ? "Sim" : "Uso doméstico",
                    },
                    {
                      rotulo: "Publicada em",
                      valor: new Date(receita.publicadaEm).toLocaleDateString("pt-BR"),
                    },
                  ].map((info) => (
                    <div key={info.rotulo} className="rounded-xl border border-line px-3 py-2.5">
                      <dt className="text-[11px] font-semibold uppercase tracking-wide text-ink-muted">
                        {info.rotulo}
                      </dt>
                      <dd className="mt-0.5 text-[14px] font-semibold text-ink">{info.valor}</dd>
                    </div>
                  ))}

                  {receita.tags.length > 0 && (
                    <div className="sm:col-span-2">
                      <dt className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-ink-muted">
                        Tags
                      </dt>
                      <dd className="flex flex-wrap gap-1.5">
                        {receita.tags.map((tag) => (
                          <Link key={tag} href={`/buscar?q=${encodeURIComponent(tag)}`}>
                            <Selo>{tag}</Selo>
                          </Link>
                        ))}
                      </dd>
                    </div>
                  )}
                </dl>
              )}
            </div>
          </div>
        </div>

        {/* ----------------------------------------------------- coluna direita */}
        <div className="flex flex-col gap-4 app:sticky app:top-20">
          <div>
            <div className="mb-2 flex flex-wrap items-center gap-2">
              {categoria && (
                <Link href={`/categorias/${categoria.slug}`}>
                  <Selo tom="coral">{categoria.nome}</Selo>
                </Link>
              )}
              {receita.paraVender && <Selo tom="dinheiro">Boa para vender</Selo>}
            </div>

            <h1 className="font-display text-2xl font-extrabold leading-tight text-ink app:text-3xl">
              {receita.nome}
            </h1>

            <p className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-ink-muted">
              <span className="font-semibold text-ink-soft">
                {ROTULO_DIFICULDADE[receita.dificuldade]}
              </span>
              <span className="text-ink-faint">·</span>
              <span className="inline-flex items-center gap-1">
                <Icone nome="relogio" tamanho={13} />
                {formatarTempo(receita.tempoMinutos)}
              </span>
              <span className="text-ink-faint">·</span>
              <span>
                Rende {rendimento} {receita.rendimentoUnidade}
              </span>
            </p>

            <p className="mt-3 text-[14px] leading-relaxed text-ink-soft">{receita.descricao}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => alternarFavorito(receita.slug)}
              aria-pressed={favorito}
              className={`inline-flex flex-1 items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-[13px] font-semibold transition ${
                favorito
                  ? "border-brand-500 bg-brand-500 text-white"
                  : "border-line bg-white text-ink-soft hover:border-brand-300 hover:text-brand-600"
              }`}
            >
              <Icone nome="coracao" tamanho={16} className={favorito ? "fill-current" : ""} />
              {favorito ? "Favoritada" : "Favoritar"}
            </button>

            <button
              type="button"
              onClick={adicionarNaLista}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-line bg-white px-3 py-2.5 text-[13px] font-semibold text-ink-soft transition hover:border-brand-300 hover:text-brand-600"
            >
              <Icone nome="carrinho" tamanho={16} />
              Adicionar à lista
            </button>

            <button
              type="button"
              onClick={compartilhar}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-line bg-white px-3 py-2.5 text-[13px] font-semibold text-ink-soft transition hover:border-brand-300 hover:text-brand-600"
            >
              <Icone nome="copiar" tamanho={16} />
              <span className="hidden sm:inline">Compartilhar</span>
            </button>
          </div>

          {mensagem && (
            <p
              role="status"
              className="rounded-xl border border-money-500/30 bg-money-50 px-3 py-2.5 text-[13px] font-semibold text-money-700"
            >
              {mensagem}
            </p>
          )}

          {/* Ajuste de rendimento */}
          <div className="cartao p-4">
            <div className="mb-2.5 flex items-center justify-between gap-3">
              <h3 className="text-[13px] font-bold text-ink">Ajustar rendimento</h3>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setRendimento((r) => Math.max(1, r - 1))}
                  className="grid h-8 w-8 place-items-center rounded-lg border border-line text-ink-soft transition hover:border-brand-300 hover:text-brand-600"
                  aria-label="Diminuir rendimento"
                >
                  <Icone nome="menos" tamanho={15} />
                </button>
                <input
                  type="number"
                  min={1}
                  value={rendimento}
                  onChange={(e) => setRendimento(Math.max(1, Number(e.target.value) || 1))}
                  aria-label={`Rendimento em ${receita.rendimentoUnidade}`}
                  className="h-8 w-16 rounded-lg border border-line text-center text-[13px] font-bold tabular-nums text-ink outline-none focus:border-brand-300"
                />
                <button
                  type="button"
                  onClick={() => setRendimento((r) => r + 1)}
                  className="grid h-8 w-8 place-items-center rounded-lg border border-line text-ink-soft transition hover:border-brand-300 hover:text-brand-600"
                  aria-label="Aumentar rendimento"
                >
                  <Icone nome="mais" tamanho={15} />
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {opcoesRendimento(receita).map((opcao) => (
                <button
                  key={opcao}
                  type="button"
                  onClick={() => setRendimento(opcao)}
                  className={`rounded-lg border px-2.5 py-1.5 text-[12px] font-semibold transition ${
                    rendimento === opcao
                      ? "border-brand-500 bg-brand-50 text-brand-600"
                      : "border-line bg-white text-ink-muted hover:border-brand-300"
                  }`}
                >
                  {opcao}
                </button>
              ))}
            </div>

            <p className="mt-2.5 text-[11.5px] leading-relaxed text-ink-muted">
              Os ingredientes e os custos são recalculados automaticamente para{" "}
              <strong className="text-ink-soft">
                {rendimento} {receita.rendimentoUnidade}
              </strong>
              .
            </p>
          </div>

          <PainelCustos receita={receita} custo={custo} />
        </div>
      </div>
    </div>
  );
}
