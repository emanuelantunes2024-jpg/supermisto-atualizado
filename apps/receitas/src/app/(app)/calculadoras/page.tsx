import type { Metadata } from "next";
import Link from "next/link";

import { CabecalhoPagina } from "@/components/layout/CabecalhoPagina";
import { Icone } from "@/components/ui/Icone";

export const metadata: Metadata = { title: "Calculadoras" };

const FERRAMENTAS = [
  {
    href: "/calculadoras/custos",
    titulo: "Calculadora de Custos",
    descricao:
      "Escolha uma receita, ajuste a quantidade e os preços dos ingredientes e veja quanto vai gastar de verdade.",
    icone: "calculadora",
    cor: "bg-emerald-100 text-emerald-700",
  },
  {
    href: "/calculadoras/precos",
    titulo: "Calculadora de Preços",
    descricao:
      "A partir do custo, simule o preço de venda com a margem que você quer trabalhar.",
    icone: "etiqueta",
    cor: "bg-amber-100 text-amber-600",
  },
  {
    href: "/central-de-renda",
    titulo: "Central de Renda",
    descricao:
      "Diga quanto tem para investir e o que quer produzir: o sistema sugere receitas compatíveis.",
    icone: "renda",
    cor: "bg-brand-100 text-brand-600",
  },
  {
    href: "/central-de-renda/objetivo",
    titulo: "Simulador de Objetivos",
    descricao:
      "Defina uma meta de faturamento ou de unidades e veja o que precisa produzir para chegar lá.",
    icone: "alvo",
    cor: "bg-purple-100 text-purple-600",
  },
];

export default function PaginaCalculadoras() {
  return (
    <div className="flex flex-col gap-4">
      <CabecalhoPagina
        titulo="Calculadoras"
        descricao="As ferramentas que transformam receita em planejamento de produção."
      />

      <div className="grid gap-2.5 sm:grid-cols-2">
        {FERRAMENTAS.map((f) => (
          <Link key={f.href} href={f.href} className="cartao cartao-hover flex gap-3.5 p-4">
            <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl ${f.cor}`}>
              <Icone nome={f.icone} tamanho={21} />
            </span>
            <div>
              <h2 className="font-display text-[15px] font-bold text-ink">{f.titulo}</h2>
              <p className="mt-1 text-[13px] leading-relaxed text-ink-muted">{f.descricao}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
