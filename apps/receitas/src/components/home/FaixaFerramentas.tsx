import Link from "next/link";

import { Icone } from "@/components/ui/Icone";

const FERRAMENTAS = [
  {
    href: "/calculadoras/custos",
    titulo: "Calculadora de Custos",
    descricao: "Calcule o custo dos ingredientes",
    icone: "calculadora",
    cor: "bg-emerald-100 text-emerald-700",
  },
  {
    href: "/calculadoras/precos",
    titulo: "Calculadora de Preços",
    descricao: "Descubra o preço ideal para vender",
    icone: "etiqueta",
    cor: "bg-amber-100 text-amber-600",
  },
  {
    href: "/central-de-renda",
    titulo: "Central de Renda",
    descricao: "Simule e planeje seus ganhos",
    icone: "renda",
    cor: "bg-brand-100 text-brand-600",
  },
  {
    href: "/central-de-renda/objetivo",
    titulo: "Simulador de Objetivos",
    descricao: "Defina metas e veja as possibilidades",
    icone: "alvo",
    cor: "bg-purple-100 text-purple-600",
  },
  {
    href: "/lista-de-compras",
    titulo: "Lista de Compras",
    descricao: "Organize e otimize suas compras",
    icone: "carrinho",
    cor: "bg-yellow-100 text-yellow-700",
  },
  {
    href: "/assistente",
    titulo: "Assistente Inteligente",
    descricao: "Tire dúvidas e receba sugestões",
    icone: "assistente",
    cor: "bg-pink-100 text-pink-600",
  },
];

/** Faixa de ferramentas do produto, no rodapé da Home. */
export function FaixaFerramentas() {
  return (
    <section aria-labelledby="ferramentas-titulo">
      <h2 id="ferramentas-titulo" className="sr-only">
        Ferramentas
      </h2>

      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 app:grid-cols-6">
        {FERRAMENTAS.map((f) => (
          <Link key={f.href} href={f.href} className="cartao cartao-hover p-3.5">
            <span className={`mb-2 grid h-9 w-9 place-items-center rounded-xl ${f.cor}`}>
              <Icone nome={f.icone} tamanho={18} />
            </span>
            <p className="text-[12.5px] font-bold leading-tight text-ink">{f.titulo}</p>
            <p className="mt-1 text-[11px] leading-tight text-ink-muted">{f.descricao}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
