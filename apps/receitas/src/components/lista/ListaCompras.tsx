"use client";

import { useMemo, useState } from "react";

import { INSUMOS_POR_CHAVE, NOMES_SECAO } from "@/data/insumos";
import { Botao } from "@/components/ui/Botao";
import { Icone } from "@/components/ui/Icone";
import { Vazio } from "@/components/ui/Vazio";
import { LinkBotao } from "@/components/ui/Botao";
import { precoEmbalagem } from "@/lib/calculos";
import { nomeItemLista, useDadosUsuario } from "@/lib/dados-usuario";
import { formatarBase, formatarMoeda } from "@/lib/format";
import type { ItemListaCompras } from "@/lib/types";

/**
 * Lista de compras consolidada.
 *
 * Os ingredientes somados das receitas viram quantidade total por insumo,
 * agrupada por seção do mercado. O valor estimado considera embalagens
 * inteiras: é assim que a compra acontece de verdade.
 */
export function ListaCompras() {
  const {
    lista,
    precos,
    carregando,
    alternarComprado,
    removerItem,
    limparLista,
    adicionarItemManual,
  } = useDadosUsuario();

  const [novoItem, setNovoItem] = useState("");
  const [confirmandoLimpeza, setConfirmandoLimpeza] = useState(false);

  const secoes = useMemo(() => {
    const mapa = new Map<string, ItemListaCompras[]>();

    for (const item of lista) {
      const secao = item.manual ? "outros" : INSUMOS_POR_CHAVE[item.insumo]?.secao ?? "outros";
      if (!mapa.has(secao)) mapa.set(secao, []);
      mapa.get(secao)!.push(item);
    }

    return Array.from(mapa.entries()).sort((a, b) =>
      (NOMES_SECAO[a[0]] ?? "").localeCompare(NOMES_SECAO[b[0]] ?? "", "pt-BR"),
    );
  }, [lista]);

  const total = useMemo(() => {
    return lista.reduce((soma, item) => {
      if (item.manual) return soma;
      const insumo = INSUMOS_POR_CHAVE[item.insumo];
      if (!insumo) return soma;
      // Compra-se a embalagem inteira, não a fração usada.
      const embalagens = Math.ceil(item.base / insumo.embalagem);
      return soma + embalagens * precoEmbalagem(item.insumo, precos);
    }, 0);
  }, [lista, precos]);

  const comprados = lista.filter((i) => i.comprado).length;

  if (carregando) return <div className="cartao h-64 animate-pulse bg-cream-200" />;

  return (
    <div className="flex flex-col gap-4">
      <form
        onSubmit={(evento) => {
          evento.preventDefault();
          const limpo = novoItem.trim();
          if (!limpo) return;
          adicionarItemManual(limpo);
          setNovoItem("");
        }}
        className="cartao flex flex-wrap items-end gap-2.5 p-4"
      >
        <label className="min-w-[200px] flex-1">
          <span className="rotulo">Adicionar item à mão</span>
          <input
            value={novoItem}
            onChange={(e) => setNovoItem(e.target.value)}
            placeholder="Ex.: papel-toalha, fita adesiva, etiquetas"
            className="campo"
          />
        </label>
        <Botao type="submit" variante="contorno" disabled={!novoItem.trim()}>
          <Icone nome="mais" tamanho={16} />
          Adicionar
        </Botao>
      </form>

      {lista.length === 0 ? (
        <Vazio
          icone="carrinho"
          titulo="Sua lista está vazia"
          descricao="Abra qualquer receita e toque em “Adicionar à lista”. Os ingredientes repetidos são somados automaticamente."
          acao={
            <LinkBotao href="/receitas" tamanho="sm">
              Escolher receitas
            </LinkBotao>
          }
        />
      ) : (
        <>
          <div className="cartao flex flex-wrap items-center justify-between gap-3 p-4">
            <div>
              <p className="text-[13px] text-ink-muted">Valor estimado da compra</p>
              <p className="font-display text-2xl font-extrabold text-money-600">
                {formatarMoeda(total)}
              </p>
              <p className="mt-0.5 text-[11.5px] text-ink-muted">
                Considera embalagens inteiras, com os preços salvos em Meus preços.
              </p>
            </div>

            <div className="text-right">
              <p className="text-[13px] text-ink-muted">Progresso</p>
              <p className="font-display text-xl font-bold text-ink">
                {comprados}/{lista.length}
              </p>
              <p className="text-[11.5px] text-ink-muted">itens marcados</p>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {secoes.map(([secao, itens]) => (
              <section key={secao} className="cartao overflow-hidden">
                <h2 className="border-b border-line bg-cream-50 px-4 py-2.5 text-[12px] font-bold uppercase tracking-wide text-ink-muted">
                  {NOMES_SECAO[secao] ?? "Outros"}
                </h2>

                <ul className="divide-y divide-line/60">
                  {itens.map((item) => {
                    const insumo = INSUMOS_POR_CHAVE[item.insumo];
                    const embalagens = insumo ? Math.ceil(item.base / insumo.embalagem) : 0;

                    return (
                      <li key={item.id} className="flex items-center gap-3 px-4 py-3">
                        <button
                          type="button"
                          onClick={() => alternarComprado(item.id)}
                          aria-pressed={item.comprado}
                          aria-label={`Marcar ${nomeItemLista(item)} como comprado`}
                          className={`grid h-6 w-6 shrink-0 place-items-center rounded-md border transition ${
                            item.comprado
                              ? "border-money-500 bg-money-500 text-white"
                              : "border-line bg-white text-transparent hover:border-money-500"
                          }`}
                        >
                          <Icone nome="check" tamanho={14} />
                        </button>

                        <div className="min-w-0 flex-1">
                          <p
                            className={`text-[14px] font-semibold ${
                              item.comprado ? "text-ink-faint line-through" : "text-ink"
                            }`}
                          >
                            {nomeItemLista(item)}
                          </p>
                          {insumo && (
                            <p className="text-[12px] text-ink-muted">
                              {formatarBase(item.base, insumo.unidadeBase)}
                              {embalagens > 0 && (
                                <>
                                  <span className="px-1">·</span>
                                  {embalagens} {embalagens === 1 ? "embalagem" : "embalagens"} (
                                  {insumo.embalagemRotulo})
                                </>
                              )}
                            </p>
                          )}
                          {item.origens.length > 0 && (
                            <p className="truncate text-[11px] text-ink-faint">
                              {item.origens.join(", ")}
                            </p>
                          )}
                        </div>

                        {insumo && (
                          <span className="shrink-0 text-[13px] font-bold tabular-nums text-ink-soft">
                            {formatarMoeda(embalagens * precoEmbalagem(item.insumo, precos))}
                          </span>
                        )}

                        <button
                          type="button"
                          onClick={() => removerItem(item.id)}
                          aria-label={`Remover ${nomeItemLista(item)}`}
                          className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-ink-faint transition hover:bg-cream-100 hover:text-brand-600"
                        >
                          <Icone nome="lixo" tamanho={15} />
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </section>
            ))}
          </div>

          <div className="flex justify-end">
            {confirmandoLimpeza ? (
              <div className="cartao flex flex-wrap items-center gap-2.5 p-3">
                <p className="text-[13px] text-ink-soft">Apagar todos os itens da lista?</p>
                <Botao
                  tamanho="sm"
                  onClick={() => {
                    limparLista();
                    setConfirmandoLimpeza(false);
                  }}
                >
                  Sim, limpar
                </Botao>
                <Botao
                  tamanho="sm"
                  variante="contorno"
                  onClick={() => setConfirmandoLimpeza(false)}
                >
                  Cancelar
                </Botao>
              </div>
            ) : (
              <Botao variante="fantasma" tamanho="sm" onClick={() => setConfirmandoLimpeza(true)}>
                <Icone nome="lixo" tamanho={15} />
                Limpar lista
              </Botao>
            )}
          </div>
        </>
      )}
    </div>
  );
}
