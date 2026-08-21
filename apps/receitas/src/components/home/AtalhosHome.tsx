import Link from "next/link";

import { Icone } from "@/components/ui/Icone";

/** Os seis atalhos de "O que você quer fazer hoje?". */
const ATALHOS = [
  {
    href: "/receitas",
    titulo: "Encontrar uma receita",
    descricao: "Explore a biblioteca completa",
    icone: "buscar",
    cor: "bg-purple-100 text-purple-600",
  },
  {
    href: "/central-de-renda",
    titulo: "Quero começar a vender",
    descricao: "Receitas lucrativas para vender",
    icone: "chef",
    cor: "bg-amber-100 text-amber-600",
  },
  {
    href: "/calculadoras/custos",
    titulo: "Calcular custos",
    descricao: "Saiba quanto vai gastar",
    icone: "calculadora",
    cor: "bg-brand-100 text-brand-600",
  },
  {
    href: "/lista-de-compras",
    titulo: "Lista de compras",
    descricao: "Organize seus ingredientes",
    icone: "carrinho",
    cor: "bg-yellow-100 text-yellow-700",
  },
  {
    href: "/central-de-renda/objetivo",
    titulo: "Planejar produção",
    descricao: "Planeje e organize sua produção",
    icone: "alvo",
    cor: "bg-emerald-100 text-emerald-700",
  },
  {
    href: "/favoritos",
    titulo: "Minhas receitas",
    descricao: "Acesse suas favoritas",
    icone: "coracao",
    cor: "bg-pink-100 text-pink-600",
  },
];

export function AtalhosHome() {
  return (
    <section aria-labelledby="atalhos-titulo">
      <h2 id="atalhos-titulo" className="titulo-seccao mb-3.5">
        O que você quer fazer hoje?
      </h2>

      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 app:grid-cols-6">
        {ATALHOS.map((atalho) => (
          <Link
            key={atalho.href}
            href={atalho.href}
            className="cartao cartao-hover flex flex-col items-center gap-2 px-3 py-4 text-center"
          >
            <span className={`grid h-11 w-11 place-items-center rounded-2xl ${atalho.cor}`}>
              <Icone nome={atalho.icone} tamanho={21} />
            </span>
            <span className="text-[13px] font-bold leading-tight text-ink">{atalho.titulo}</span>
            <span className="text-[11px] leading-tight text-ink-muted">{atalho.descricao}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
