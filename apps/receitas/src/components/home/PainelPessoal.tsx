"use client";

import Link from "next/link";

import { CartaoReceita } from "@/components/receitas/CartaoReceita";
import { Icone } from "@/components/ui/Icone";
import { useDadosUsuario } from "@/lib/dados-usuario";
import { formatarMoeda } from "@/lib/format";
import type { Receita } from "@/lib/types";

/** Painel "Meu Plano": tudo o que o usuário acumulou dentro do sistema. */
export function PainelPessoal({ receitas }: { receitas: Receita[] }) {
  const { favoritos, colecoes, lista, precos, vistasRecentes, onboarding, carregando } =
    useDadosUsuario();

  if (carregando) return <div className="cartao h-64 animate-pulse bg-cream-200" />;

  const salvas = receitas.filter((r) => favoritos.includes(r.slug)).slice(0, 4);
  const recentes = vistasRecentes
    .map((slug) => receitas.find((r) => r.slug === slug))
    .filter((r): r is Receita => Boolean(r))
    .slice(0, 4);

  const indicadores = [
    { rotulo: "Receitas favoritas", valor: favoritos.length, icone: "coracao", href: "/favoritos" },
    { rotulo: "Coleções", valor: colecoes.length, icone: "colecoes", href: "/colecoes" },
    {
      rotulo: "Itens na lista",
      valor: lista.length,
      icone: "carrinho",
      href: "/lista-de-compras",
    },
    {
      rotulo: "Preços personalizados",
      valor: Object.keys(precos).length,
      icone: "etiqueta",
      href: "/configuracoes",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-2.5 app:grid-cols-4">
        {indicadores.map((item) => (
          <Link key={item.rotulo} href={item.href} className="cartao cartao-hover p-4">
            <span className="mb-2 grid h-9 w-9 place-items-center rounded-xl bg-brand-50 text-brand-500">
              <Icone nome={item.icone} tamanho={18} />
            </span>
            <p className="font-display text-2xl font-extrabold text-ink">{item.valor}</p>
            <p className="text-[12px] text-ink-muted">{item.rotulo}</p>
          </Link>
        ))}
      </div>

      {onboarding?.concluido && (
        <section className="cartao p-4">
          <h2 className="mb-2.5 font-display text-[15px] font-bold text-ink">Seu perfil</h2>
          <dl className="grid gap-2.5 sm:grid-cols-3">
            <div className="rounded-xl border border-line px-3 py-2.5">
              <dt className="text-[11px] font-semibold uppercase tracking-wide text-ink-muted">
                Objetivo
              </dt>
              <dd className="mt-0.5 text-[14px] font-semibold capitalize text-ink">
                {onboarding.objetivo}
              </dd>
            </div>
            <div className="rounded-xl border border-line px-3 py-2.5">
              <dt className="text-[11px] font-semibold uppercase tracking-wide text-ink-muted">
                Investimento previsto
              </dt>
              <dd className="mt-0.5 text-[14px] font-semibold text-ink">
                {formatarMoeda(onboarding.investimento)}
              </dd>
            </div>
            <div className="rounded-xl border border-line px-3 py-2.5">
              <dt className="text-[11px] font-semibold uppercase tracking-wide text-ink-muted">
                Linhas escolhidas
              </dt>
              <dd className="mt-0.5 text-[14px] font-semibold text-ink">
                {onboarding.linhas.length > 0 ? onboarding.linhas.join(", ") : "Todas"}
              </dd>
            </div>
          </dl>
        </section>
      )}

      {recentes.length > 0 && (
        <section>
          <h2 className="mb-3 font-display text-lg font-bold text-ink">Vistas recentemente</h2>
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 app:grid-cols-4">
            {recentes.map((receita) => (
              <CartaoReceita key={receita.slug} receita={receita} />
            ))}
          </div>
        </section>
      )}

      {salvas.length > 0 && (
        <section>
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="font-display text-lg font-bold text-ink">Suas favoritas</h2>
            <Link href="/favoritos" className="text-[13px] font-semibold text-brand-600 hover:underline">
              Ver todas
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 app:grid-cols-4">
            {salvas.map((receita) => (
              <CartaoReceita key={receita.slug} receita={receita} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
