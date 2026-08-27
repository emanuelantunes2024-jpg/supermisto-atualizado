import Link from "next/link";

import { Icone } from "@/components/ui/Icone";
import { Logo } from "@/components/ui/Logo";

export default function PaginaNaoEncontrada() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-cream-100 px-5 text-center">
      <Logo href="/" />

      <div>
        <p className="font-display text-5xl font-extrabold text-brand-500">404</p>
        <h1 className="mt-2 font-display text-xl font-bold text-ink">Página não encontrada</h1>
        <p className="mx-auto mt-1.5 max-w-sm text-[14px] text-ink-muted">
          O endereço não existe ou a receita foi despublicada. Tente buscar pelo nome.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-2.5">
        <Link
          href="/inicio"
          className="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-5 py-3 text-[14px] font-bold text-white transition hover:bg-brand-600"
        >
          <Icone nome="inicio" tamanho={17} />
          Ir para o início
        </Link>
        <Link
          href="/buscar"
          className="inline-flex items-center gap-2 rounded-xl border border-line bg-white px-5 py-3 text-[14px] font-semibold text-ink-soft transition hover:border-brand-300 hover:text-brand-600"
        >
          <Icone nome="buscar" tamanho={17} />
          Buscar receitas
        </Link>
      </div>
    </div>
  );
}
