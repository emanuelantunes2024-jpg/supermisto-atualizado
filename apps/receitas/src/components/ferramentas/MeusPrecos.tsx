"use client";

import { useMemo, useState } from "react";

import { INSUMOS, NOMES_SECAO } from "@/data/insumos";
import { Botao } from "@/components/ui/Botao";
import { Icone } from "@/components/ui/Icone";
import { useDadosUsuario } from "@/lib/dados-usuario";
import { formatarMoeda } from "@/lib/format";
import { normalizar } from "@/lib/texto";

/**
 * "Meus preços": o usuário substitui os preços de referência pelos que paga.
 * O valor salvo aqui vale em todas as calculadoras e na lista de compras.
 */
export function MeusPrecos() {
  const { precos, definirPreco, redefinirPrecos, carregando } = useDadosUsuario();
  const [busca, setBusca] = useState("");

  const secoes = useMemo(() => {
    const termo = normalizar(busca);
    const filtrados = termo
      ? INSUMOS.filter((i) => normalizar(i.nome).includes(termo))
      : INSUMOS;

    const mapa = new Map<string, typeof INSUMOS>();
    for (const insumo of filtrados) {
      if (!mapa.has(insumo.secao)) mapa.set(insumo.secao, []);
      mapa.get(insumo.secao)!.push(insumo);
    }
    return Array.from(mapa.entries());
  }, [busca]);

  if (carregando) return <div className="cartao h-64 animate-pulse bg-cream-200" />;

  const personalizados = Object.keys(precos).length;

  return (
    <div className="flex flex-col gap-4">
      <div className="cartao flex flex-wrap items-end gap-2.5 p-4">
        <label className="min-w-[220px] flex-1">
          <span className="rotulo">Procurar ingrediente</span>
          <input
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Ex.: leite condensado"
            className="campo"
          />
        </label>

        {personalizados > 0 && (
          <Botao variante="contorno" onClick={redefinirPrecos}>
            <Icone nome="lixo" tamanho={15} />
            Voltar aos preços de referência ({personalizados})
          </Botao>
        )}
      </div>

      {secoes.map(([secao, insumos]) => (
        <section key={secao} className="cartao overflow-hidden">
          <h2 className="border-b border-line bg-cream-50 px-4 py-2.5 text-[12px] font-bold uppercase tracking-wide text-ink-muted">
            {NOMES_SECAO[secao] ?? "Outros"}
          </h2>

          <ul className="divide-y divide-line/60">
            {insumos.map((insumo) => {
              const personalizado = precos[insumo.chave];
              const valor = personalizado ?? insumo.precoRef;

              return (
                <li key={insumo.chave} className="flex items-center gap-3 px-4 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-[14px] font-semibold text-ink">{insumo.nome}</p>
                    <p className="text-[12px] text-ink-muted">
                      {insumo.embalagemRotulo}
                      {personalizado !== undefined && (
                        <>
                          <span className="px-1.5">·</span>
                          <span className="text-brand-600">
                            referência: {formatarMoeda(insumo.precoRef)}
                          </span>
                        </>
                      )}
                    </p>
                  </div>

                  <label className="flex shrink-0 items-center gap-1.5">
                    <span className="text-[12px] text-ink-muted">R$</span>
                    <input
                      type="number"
                      min={0}
                      step="0.01"
                      value={valor}
                      onChange={(e) => definirPreco(insumo.chave, Number(e.target.value) || 0)}
                      aria-label={`Preço de ${insumo.nome}`}
                      className={`w-24 rounded-lg border px-2.5 py-1.5 text-right text-[13px] font-semibold tabular-nums outline-none transition focus:border-brand-300 ${
                        personalizado !== undefined
                          ? "border-brand-300 bg-brand-50"
                          : "border-line bg-white"
                      }`}
                    />
                  </label>

                  {personalizado !== undefined && (
                    <button
                      type="button"
                      onClick={() => definirPreco(insumo.chave, null)}
                      aria-label={`Restaurar preço de referência de ${insumo.nome}`}
                      className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-ink-faint transition hover:bg-cream-100 hover:text-brand-600"
                    >
                      <Icone nome="fechar" tamanho={15} />
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}
