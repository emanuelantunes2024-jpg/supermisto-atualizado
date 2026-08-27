"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { CATEGORIAS } from "@/data/categorias";
import { INSUMOS, INSUMOS_POR_CHAVE } from "@/data/insumos";
import { Botao } from "@/components/ui/Botao";
import { Icone } from "@/components/ui/Icone";
import { salvarReceita, type EntradaReceita } from "@/app/admin/actions";
import { calcularCusto } from "@/lib/calculos";
import { formatarMoeda } from "@/lib/format";
import type { IngredienteReceita, Objetivo, PassoPreparo, Receita } from "@/lib/types";

const OBJETIVOS: Objetivo[] = ["familia", "festa", "encomenda", "venda", "delivery"];

const LINHAS: Receita["linha"][] = [
  "doces",
  "bolos",
  "salgados",
  "paes",
  "sorvetes",
  "picoles",
  "geladinhos",
  "sobremesas",
  "outros",
];

const UNIDADES = [
  "unidade",
  "g",
  "ml",
  "xícara (chá)",
  "colher (sopa)",
  "colher (chá)",
  "lata",
  "caixa",
  "pote",
  "sachê",
  "tablete",
  "pacote",
];

function hoje(): string {
  return new Date().toISOString().slice(0, 10);
}

/** Converte o nome em slug: sem acentos, minúsculo e com hifens. */
function paraSlug(nome: string): string {
  return nome
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

const VAZIA: EntradaReceita = {
  slug: "",
  nome: "",
  descricao: "",
  categoria: CATEGORIAS[0].slug,
  subcategoria: "",
  imagem: "",
  tempoMinutos: 30,
  dificuldade: "facil",
  rendimento: 20,
  rendimentoUnidade: "unidades",
  ingredientes: [],
  preparo: [{ texto: "" }],
  dicas: [],
  conservacao: "",
  equipamentos: [],
  tags: [],
  objetivos: ["familia"],
  linha: "doces",
  paraVender: false,
  embalagemPorUnidade: undefined,
  margemSugerida: 0.7,
  publicadaEm: hoje(),
  novidadeAte: "",
  publicada: true,
  destaque: false,
};

export function FormularioReceita({ receita }: { receita?: Receita }) {
  const router = useRouter();

  const [dados, setDados] = useState<EntradaReceita>(() =>
    receita
      ? {
          id: receita.id,
          slug: receita.slug,
          nome: receita.nome,
          descricao: receita.descricao,
          categoria: receita.categoria,
          subcategoria: receita.subcategoria ?? "",
          imagem: receita.imagem ?? "",
          tempoMinutos: receita.tempoMinutos,
          dificuldade: receita.dificuldade,
          rendimento: receita.rendimento,
          rendimentoUnidade: receita.rendimentoUnidade,
          ingredientes: receita.ingredientes,
          preparo: receita.preparo.length ? receita.preparo : [{ texto: "" }],
          dicas: receita.dicas,
          conservacao: receita.conservacao,
          equipamentos: receita.equipamentos,
          tags: receita.tags,
          objetivos: receita.objetivos,
          linha: receita.linha,
          paraVender: receita.paraVender,
          embalagemPorUnidade: receita.embalagemPorUnidade,
          margemSugerida: receita.margemSugerida ?? 0.7,
          publicadaEm: receita.publicadaEm.slice(0, 10),
          novidadeAte: receita.novidadeAte?.slice(0, 10) ?? "",
          publicada: receita.publicada,
          destaque: receita.destaque ?? false,
        }
      : VAZIA,
  );

  const [salvando, setSalvando] = useState(false);
  const [aviso, setAviso] = useState<{ ok: boolean; texto: string } | null>(null);

  const categoria = CATEGORIAS.find((c) => c.slug === dados.categoria);

  const custo = useMemo(() => {
    if (dados.ingredientes.length === 0) return null;
    return calcularCusto({ ...(dados as unknown as Receita), id: dados.id ?? "novo" });
  }, [dados]);

  function atualizar<C extends keyof EntradaReceita>(campo: C, valor: EntradaReceita[C]) {
    setDados((atual) => ({ ...atual, [campo]: valor }));
  }

  /* ------------------------------------------------------- ingredientes */

  function adicionarIngrediente() {
    const novo: IngredienteReceita = {
      insumo: INSUMOS[0].chave,
      qtd: 1,
      unidade: "unidade",
      base: 1,
    };
    atualizar("ingredientes", [...dados.ingredientes, novo]);
  }

  function mudarIngrediente(indice: number, mudanca: Partial<IngredienteReceita>) {
    atualizar(
      "ingredientes",
      dados.ingredientes.map((item, i) => (i === indice ? { ...item, ...mudanca } : item)),
    );
  }

  function removerIngrediente(indice: number) {
    atualizar(
      "ingredientes",
      dados.ingredientes.filter((_, i) => i !== indice),
    );
  }

  /* ------------------------------------------------------------ preparo */

  function mudarPasso(indice: number, mudanca: Partial<PassoPreparo>) {
    atualizar(
      "preparo",
      dados.preparo.map((item, i) => (i === indice ? { ...item, ...mudanca } : item)),
    );
  }

  /* ------------------------------------------------------------- salvar */

  async function enviar(evento: React.FormEvent) {
    evento.preventDefault();
    setSalvando(true);
    setAviso(null);

    const limpo: EntradaReceita = {
      ...dados,
      slug: dados.slug || paraSlug(dados.nome),
      preparo: dados.preparo.filter((p) => p.texto.trim()),
      dicas: dados.dicas.filter((d) => d.trim()),
      equipamentos: dados.equipamentos.filter((e) => e.trim()),
      tags: dados.tags.filter((t) => t.trim()),
    };

    const resultado = await salvarReceita(limpo);
    setAviso({ ok: resultado.ok, texto: resultado.mensagem });
    setSalvando(false);

    if (resultado.ok) {
      router.push("/admin/receitas");
      router.refresh();
    }
  }

  return (
    <form onSubmit={enviar} className="flex flex-col gap-4">
      {/* ---------------------------------------------------------- básico */}
      <section className="cartao p-4 app:p-5">
        <h2 className="mb-3.5 font-display text-[15px] font-bold text-ink">Informações básicas</h2>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="sm:col-span-2">
            <span className="rotulo">Nome da receita *</span>
            <input
              value={dados.nome}
              onChange={(e) => {
                const nome = e.target.value;
                setDados((atual) => ({
                  ...atual,
                  nome,
                  // Só gera o slug automaticamente em receitas novas: mudar o
                  // endereço de uma receita publicada quebraria os links.
                  slug: atual.id ? atual.slug : paraSlug(nome),
                }));
              }}
              required
              className="campo"
            />
          </label>

          <label className="sm:col-span-2">
            <span className="rotulo">Endereço (slug) *</span>
            <input
              value={dados.slug}
              onChange={(e) => atualizar("slug", paraSlug(e.target.value))}
              required
              className="campo font-mono text-[13px]"
            />
            <span className="mt-1 block text-[11.5px] text-ink-muted">
              A receita ficará em /receitas/{dados.slug || "endereco"}
            </span>
          </label>

          <label className="sm:col-span-2">
            <span className="rotulo">Descrição curta *</span>
            <textarea
              value={dados.descricao}
              onChange={(e) => atualizar("descricao", e.target.value)}
              required
              rows={3}
              className="campo resize-y"
            />
          </label>

          <label>
            <span className="rotulo">Categoria *</span>
            <select
              value={dados.categoria}
              onChange={(e) => atualizar("categoria", e.target.value)}
              className="campo"
            >
              {CATEGORIAS.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.nome}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span className="rotulo">Subcategoria</span>
            <select
              value={dados.subcategoria}
              onChange={(e) => atualizar("subcategoria", e.target.value)}
              className="campo"
            >
              <option value="">Sem subcategoria</option>
              {categoria?.subcategorias.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span className="rotulo">Tempo de preparo (minutos) *</span>
            <input
              type="number"
              min={1}
              value={dados.tempoMinutos}
              onChange={(e) => atualizar("tempoMinutos", Number(e.target.value) || 1)}
              className="campo"
            />
          </label>

          <label>
            <span className="rotulo">Dificuldade *</span>
            <select
              value={dados.dificuldade}
              onChange={(e) => atualizar("dificuldade", e.target.value as Receita["dificuldade"])}
              className="campo"
            >
              <option value="facil">Fácil</option>
              <option value="medio">Médio</option>
              <option value="avancado">Avançado</option>
            </select>
          </label>

          <label>
            <span className="rotulo">Rendimento *</span>
            <input
              type="number"
              min={1}
              value={dados.rendimento}
              onChange={(e) => atualizar("rendimento", Number(e.target.value) || 1)}
              className="campo"
            />
          </label>

          <label>
            <span className="rotulo">Unidade do rendimento *</span>
            <input
              value={dados.rendimentoUnidade}
              onChange={(e) => atualizar("rendimentoUnidade", e.target.value)}
              placeholder="unidades, porções, potes, fatias"
              className="campo"
            />
          </label>

          <label className="sm:col-span-2">
            <span className="rotulo">Endereço da foto (opcional)</span>
            <input
              value={dados.imagem}
              onChange={(e) => atualizar("imagem", e.target.value)}
              placeholder="https://...supabase.co/storage/v1/object/public/receitas/foto.jpg"
              className="campo font-mono text-[12.5px]"
            />
            <span className="mt-1 block text-[11.5px] text-ink-muted">
              Sem foto, o sistema desenha uma capa com a cor da categoria.
            </span>
          </label>
        </div>
      </section>

      {/* ---------------------------------------------------- ingredientes */}
      <section className="cartao p-4 app:p-5">
        <div className="mb-3.5 flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-display text-[15px] font-bold text-ink">Ingredientes</h2>
          {custo && (
            <span className="text-[12.5px] text-ink-muted">
              Custo estimado:{" "}
              <strong className="text-money-600">{formatarMoeda(custo.custoTotal)}</strong>
            </span>
          )}
        </div>

        <div className="flex flex-col gap-2">
          {dados.ingredientes.map((ingrediente, indice) => {
            const insumo = INSUMOS_POR_CHAVE[ingrediente.insumo];

            return (
              <div
                key={indice}
                className="grid gap-2 rounded-xl border border-line p-3 sm:grid-cols-[2fr_70px_1.2fr_90px_1fr_auto]"
              >
                <select
                  value={ingrediente.insumo}
                  onChange={(e) => mudarIngrediente(indice, { insumo: e.target.value })}
                  aria-label="Insumo"
                  className="campo py-2 text-[13px]"
                >
                  {INSUMOS.map((i) => (
                    <option key={i.chave} value={i.chave}>
                      {i.nome}
                    </option>
                  ))}
                </select>

                <input
                  type="number"
                  step="0.25"
                  min={0}
                  value={ingrediente.qtd}
                  onChange={(e) => mudarIngrediente(indice, { qtd: Number(e.target.value) || 0 })}
                  aria-label="Quantidade"
                  className="campo py-2 text-[13px]"
                />

                <select
                  value={ingrediente.unidade}
                  onChange={(e) => mudarIngrediente(indice, { unidade: e.target.value })}
                  aria-label="Unidade"
                  className="campo py-2 text-[13px]"
                >
                  {UNIDADES.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>

                <input
                  type="number"
                  min={0}
                  value={ingrediente.base}
                  onChange={(e) => mudarIngrediente(indice, { base: Number(e.target.value) || 0 })}
                  aria-label={`Quantidade em ${insumo?.unidadeBase ?? "g"}`}
                  title={`Equivalente em ${insumo?.unidadeBase ?? "g"}, usado no cálculo de custo`}
                  className="campo py-2 text-[13px]"
                />

                <input
                  value={ingrediente.grupo ?? ""}
                  onChange={(e) => mudarIngrediente(indice, { grupo: e.target.value })}
                  placeholder="Grupo"
                  aria-label="Grupo"
                  className="campo py-2 text-[13px]"
                />

                <button
                  type="button"
                  onClick={() => removerIngrediente(indice)}
                  aria-label="Remover ingrediente"
                  className="grid h-9 w-9 place-items-center self-center rounded-lg text-ink-faint transition hover:bg-cream-100 hover:text-brand-600"
                >
                  <Icone nome="lixo" tamanho={16} />
                </button>
              </div>
            );
          })}
        </div>

        <Botao type="button" variante="contorno" tamanho="sm" onClick={adicionarIngrediente} className="mt-3">
          <Icone nome="mais" tamanho={15} />
          Adicionar ingrediente
        </Botao>

        <p className="mt-2.5 text-[11.5px] leading-relaxed text-ink-muted">
          A coluna estreita depois da unidade é a quantidade equivalente em gramas, mililitros ou
          unidades — é ela que o sistema usa para calcular o custo. Exemplo: 1 lata de leite
          condensado = 395.
        </p>
      </section>

      {/* --------------------------------------------------------- preparo */}
      <section className="cartao p-4 app:p-5">
        <h2 className="mb-3.5 font-display text-[15px] font-bold text-ink">Modo de preparo</h2>

        <div className="flex flex-col gap-2">
          {dados.preparo.map((passo, indice) => (
            <div key={indice} className="flex gap-2">
              <span className="mt-2.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brand-50 text-[12px] font-bold text-brand-600">
                {indice + 1}
              </span>

              <div className="flex-1 space-y-1.5">
                <input
                  value={passo.titulo ?? ""}
                  onChange={(e) => mudarPasso(indice, { titulo: e.target.value })}
                  placeholder="Etapa (opcional): Massa, Recheio, Montagem..."
                  className="campo py-2 text-[13px]"
                />
                <textarea
                  value={passo.texto}
                  onChange={(e) => mudarPasso(indice, { texto: e.target.value })}
                  rows={2}
                  placeholder="Descreva o passo"
                  className="campo resize-y text-[13px]"
                />
              </div>

              <button
                type="button"
                onClick={() =>
                  atualizar(
                    "preparo",
                    dados.preparo.filter((_, i) => i !== indice),
                  )
                }
                aria-label="Remover passo"
                className="mt-2.5 grid h-9 w-9 shrink-0 place-items-center rounded-lg text-ink-faint transition hover:bg-cream-100 hover:text-brand-600"
              >
                <Icone nome="lixo" tamanho={16} />
              </button>
            </div>
          ))}
        </div>

        <Botao
          type="button"
          variante="contorno"
          tamanho="sm"
          onClick={() => atualizar("preparo", [...dados.preparo, { texto: "" }])}
          className="mt-3"
        >
          <Icone nome="mais" tamanho={15} />
          Adicionar passo
        </Botao>
      </section>

      {/* --------------------------------------------------------- extras */}
      <section className="cartao p-4 app:p-5">
        <h2 className="mb-3.5 font-display text-[15px] font-bold text-ink">
          Dicas, conservação e equipamentos
        </h2>

        <div className="grid gap-3">
          <label>
            <span className="rotulo">Dicas (uma por linha)</span>
            <textarea
              value={dados.dicas.join("\n")}
              onChange={(e) => atualizar("dicas", e.target.value.split("\n"))}
              rows={4}
              className="campo resize-y text-[13px]"
            />
          </label>

          <label>
            <span className="rotulo">Conservação</span>
            <textarea
              value={dados.conservacao}
              onChange={(e) => atualizar("conservacao", e.target.value)}
              rows={2}
              className="campo resize-y text-[13px]"
            />
          </label>

          <div className="grid gap-3 sm:grid-cols-2">
            <label>
              <span className="rotulo">Equipamentos (separados por vírgula)</span>
              <input
                value={dados.equipamentos.join(", ")}
                onChange={(e) =>
                  atualizar(
                    "equipamentos",
                    e.target.value.split(",").map((t) => t.trim()),
                  )
                }
                className="campo text-[13px]"
              />
            </label>

            <label>
              <span className="rotulo">Tags (separadas por vírgula)</span>
              <input
                value={dados.tags.join(", ")}
                onChange={(e) =>
                  atualizar(
                    "tags",
                    e.target.value.split(",").map((t) => t.trim()),
                  )
                }
                className="campo text-[13px]"
              />
            </label>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------- venda e publicação */}
      <section className="cartao p-4 app:p-5">
        <h2 className="mb-3.5 font-display text-[15px] font-bold text-ink">Venda e publicação</h2>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <span className="rotulo">Objetivos</span>
            <div className="flex flex-wrap gap-1.5">
              {OBJETIVOS.map((objetivo) => {
                const marcado = dados.objetivos.includes(objetivo);
                return (
                  <button
                    key={objetivo}
                    type="button"
                    onClick={() =>
                      atualizar(
                        "objetivos",
                        marcado
                          ? dados.objetivos.filter((o) => o !== objetivo)
                          : [...dados.objetivos, objetivo],
                      )
                    }
                    className={`rounded-lg border px-3 py-1.5 text-[12.5px] font-semibold capitalize transition ${
                      marcado
                        ? "border-brand-500 bg-brand-50 text-brand-600"
                        : "border-line bg-white text-ink-muted"
                    }`}
                  >
                    {objetivo}
                  </button>
                );
              })}
            </div>
          </div>

          <label>
            <span className="rotulo">Linha de produção</span>
            <select
              value={dados.linha}
              onChange={(e) => atualizar("linha", e.target.value as Receita["linha"])}
              className="campo"
            >
              {LINHAS.map((linha) => (
                <option key={linha} value={linha} className="capitalize">
                  {linha}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span className="rotulo">Margem sugerida (ex.: 0,7 = 70%)</span>
            <input
              type="number"
              step="0.05"
              min={0}
              value={dados.margemSugerida ?? 0.7}
              onChange={(e) => atualizar("margemSugerida", Number(e.target.value) || 0)}
              className="campo"
            />
          </label>

          <label>
            <span className="rotulo">Embalagem por unidade (R$)</span>
            <input
              type="number"
              step="0.01"
              min={0}
              value={dados.embalagemPorUnidade ?? 0}
              onChange={(e) => atualizar("embalagemPorUnidade", Number(e.target.value) || 0)}
              className="campo"
            />
          </label>

          <label>
            <span className="rotulo">Data de publicação</span>
            <input
              type="date"
              value={dados.publicadaEm}
              onChange={(e) => atualizar("publicadaEm", e.target.value)}
              className="campo"
            />
          </label>

          <label>
            <span className="rotulo">Mostrar como novidade até</span>
            <input
              type="date"
              value={dados.novidadeAte}
              onChange={(e) => atualizar("novidadeAte", e.target.value)}
              className="campo"
            />
            <span className="mt-1 block text-[11.5px] text-ink-muted">
              Em branco, o selo dura 30 dias a partir da publicação.
            </span>
          </label>

          <div className="flex flex-col gap-2.5 sm:col-span-2">
            {[
              {
                campo: "paraVender" as const,
                rotulo: "Indicada para venda",
                texto: "Aparece na Central de Renda e no filtro de receitas para vender.",
              },
              {
                campo: "publicada" as const,
                rotulo: "Publicada",
                texto: "Desmarque para deixar como rascunho, invisível para os clientes.",
              },
              {
                campo: "destaque" as const,
                rotulo: "Destaque",
                texto: "Prioriza a receita nas vitrines da tela inicial.",
              },
            ].map((opcao) => (
              <label key={opcao.campo} className="flex items-start gap-2.5">
                <input
                  type="checkbox"
                  checked={Boolean(dados[opcao.campo])}
                  onChange={(e) => atualizar(opcao.campo, e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-line text-brand-500 focus:ring-brand-200"
                />
                <span>
                  <span className="block text-[13.5px] font-semibold text-ink">{opcao.rotulo}</span>
                  <span className="block text-[12px] text-ink-muted">{opcao.texto}</span>
                </span>
              </label>
            ))}
          </div>
        </div>
      </section>

      {aviso && (
        <p
          role="status"
          className={`rounded-xl border px-4 py-3 text-[13px] font-semibold ${
            aviso.ok
              ? "border-money-500/30 bg-money-50 text-money-700"
              : "border-brand-200 bg-brand-50 text-brand-700"
          }`}
        >
          {aviso.texto}
        </p>
      )}

      <div className="sticky bottom-0 flex flex-wrap gap-2.5 border-t border-line bg-cream-100/95 py-3 backdrop-blur-sm">
        <Botao type="submit" disabled={salvando} tamanho="lg">
          {salvando ? "Salvando..." : receita ? "Salvar alterações" : "Criar receita"}
        </Botao>
        <Botao type="button" variante="contorno" tamanho="lg" onClick={() => router.back()}>
          Cancelar
        </Botao>
      </div>
    </form>
  );
}
