"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { CATEGORIAS_POR_SLUG } from "@/data/categorias";
import { alternarPublicacao, excluirReceita, marcarNovidade } from "@/app/admin/actions";
import { Icone } from "@/components/ui/Icone";
import { Selo } from "@/components/ui/Selo";
import { formatarDataRelativa, formatarMoeda } from "@/lib/format";
import { custoReferencia } from "@/lib/calculos";
import { ehNovidade } from "@/lib/receitas-util";
import { normalizar } from "@/lib/texto";
import type { Receita } from "@/lib/types";

interface Props {
  receitas: Receita[];
  somenteLeitura: boolean;
}

/** Tabela de gerenciamento: publicar, marcar novidade, editar e excluir. */
export function TabelaReceitas({ receitas, somenteLeitura }: Props) {
  const router = useRouter();
  const [busca, setBusca] = useState("");
  const [pendente, iniciarTransicao] = useTransition();
  const [aviso, setAviso] = useState<string | null>(null);
  const [confirmando, setConfirmando] = useState<string | null>(null);

  const filtradas = busca
    ? receitas.filter((r) => normalizar(r.nome).includes(normalizar(busca)))
    : receitas;

  function executar(acao: () => Promise<{ ok: boolean; mensagem: string }>) {
    iniciarTransicao(async () => {
      const resultado = await acao();
      setAviso(resultado.mensagem);
      if (resultado.ok) router.refresh();
    });
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2.5">
        <div className="relative min-w-[220px] flex-1">
          <Icone
            nome="buscar"
            tamanho={16}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint"
          />
          <input
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Procurar receita pelo nome"
            className="campo pl-10"
          />
        </div>

        <Link
          href="/admin/receitas/nova"
          className="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-4 py-2.5 text-[13.5px] font-bold text-white transition hover:bg-brand-600"
        >
          <Icone nome="mais" tamanho={16} />
          Nova receita
        </Link>
      </div>

      {aviso && (
        <p role="status" className="cartao px-4 py-2.5 text-[13px] font-semibold text-ink-soft">
          {aviso}
        </p>
      )}

      <div className="cartao overflow-hidden">
        <ul className="divide-y divide-line/60">
          {filtradas.map((receita) => (
            <li key={receita.slug} className="flex flex-wrap items-center gap-3 px-4 py-3">
              <div className="min-w-[180px] flex-1">
                <p className="flex flex-wrap items-center gap-1.5 text-[13.5px] font-semibold text-ink">
                  {receita.nome}
                  {!receita.publicada && <Selo tom="ambar">Rascunho</Selo>}
                  {ehNovidade(receita) && <Selo tom="coral">Novo</Selo>}
                  {receita.paraVender && <Selo tom="dinheiro">Venda</Selo>}
                </p>
                <p className="text-[12px] text-ink-muted">
                  {CATEGORIAS_POR_SLUG[receita.categoria]?.nome ?? receita.categoria}
                  <span className="px-1.5">·</span>
                  {receita.rendimento} {receita.rendimentoUnidade}
                  <span className="px-1.5">·</span>
                  custo {formatarMoeda(receita.custoEstimado ?? custoReferencia(receita))}
                  <span className="px-1.5">·</span>
                  {formatarDataRelativa(receita.publicadaEm)}
                </p>
              </div>

              <div className="flex items-center gap-1">
                <Link
                  href={`/receitas/${receita.slug}`}
                  target="_blank"
                  aria-label={`Ver ${receita.nome} no site`}
                  className="grid h-9 w-9 place-items-center rounded-lg text-ink-muted transition hover:bg-cream-100 hover:text-brand-600"
                >
                  <Icone nome="olho" tamanho={16} />
                </Link>

                <Link
                  href={`/admin/receitas/${receita.id}`}
                  aria-label={`Editar ${receita.nome}`}
                  className="grid h-9 w-9 place-items-center rounded-lg text-ink-muted transition hover:bg-cream-100 hover:text-brand-600"
                >
                  <Icone nome="editar" tamanho={16} />
                </Link>

                <button
                  type="button"
                  disabled={somenteLeitura || pendente}
                  onClick={() => executar(() => alternarPublicacao(receita.id, !receita.publicada))}
                  aria-label={receita.publicada ? "Despublicar" : "Publicar"}
                  title={receita.publicada ? "Retirar do ar" : "Publicar"}
                  className="grid h-9 w-9 place-items-center rounded-lg text-ink-muted transition hover:bg-cream-100 hover:text-brand-600 disabled:opacity-40"
                >
                  <Icone nome={receita.publicada ? "menos" : "check"} tamanho={16} />
                </button>

                <button
                  type="button"
                  disabled={somenteLeitura || pendente}
                  onClick={() =>
                    executar(() => marcarNovidade(receita.id, ehNovidade(receita) ? null : 30))
                  }
                  aria-label="Alternar selo de novidade"
                  title="Marcar ou desmarcar como novidade"
                  className="grid h-9 w-9 place-items-center rounded-lg text-ink-muted transition hover:bg-cream-100 hover:text-brand-600 disabled:opacity-40"
                >
                  <Icone nome="novidades" tamanho={16} />
                </button>

                {confirmando === receita.id ? (
                  <span className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={pendente}
                      onClick={() => {
                        executar(() => excluirReceita(receita.id));
                        setConfirmando(null);
                      }}
                      className="rounded-lg bg-brand-500 px-2.5 py-1.5 text-[12px] font-bold text-white"
                    >
                      Excluir
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmando(null)}
                      className="rounded-lg border border-line px-2.5 py-1.5 text-[12px] font-semibold text-ink-muted"
                    >
                      Não
                    </button>
                  </span>
                ) : (
                  <button
                    type="button"
                    disabled={somenteLeitura || pendente}
                    onClick={() => setConfirmando(receita.id)}
                    aria-label={`Excluir ${receita.nome}`}
                    className="grid h-9 w-9 place-items-center rounded-lg text-ink-muted transition hover:bg-cream-100 hover:text-brand-600 disabled:opacity-40"
                  >
                    <Icone nome="lixo" tamanho={16} />
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>

        {filtradas.length === 0 && (
          <p className="px-4 py-10 text-center text-sm text-ink-muted">
            Nenhuma receita encontrada.
          </p>
        )}
      </div>
    </div>
  );
}
