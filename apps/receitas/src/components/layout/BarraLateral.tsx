"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Logo } from "@/components/ui/Logo";
import { Icone } from "@/components/ui/Icone";
import { NAVEGACAO_PRINCIPAL, NAVEGACAO_RODAPE, type ItemNavegacao } from "@/components/layout/navegacao";

function Item({ item, ativo, aoClicar }: { item: ItemNavegacao; ativo: boolean; aoClicar?: () => void }) {
  return (
    <Link
      href={item.href}
      onClick={aoClicar}
      aria-current={ativo ? "page" : undefined}
      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] font-semibold transition ${
        ativo
          ? "bg-brand-50 text-brand-600"
          : "text-ink-soft hover:bg-cream-100 hover:text-ink"
      }`}
    >
      <Icone nome={item.icone} tamanho={19} className={ativo ? "text-brand-500" : "text-ink-muted"} />
      <span className="flex-1 truncate">{item.rotulo}</span>
      {item.selo && (
        <span className="rounded-pill bg-brand-100 px-1.5 py-0.5 text-[10px] font-bold text-brand-600">
          {item.selo}
        </span>
      )}
    </Link>
  );
}

function estaAtivo(pathname: string, href: string): boolean {
  if (href === "/inicio") return pathname === "/inicio";
  return pathname === href || pathname.startsWith(`${href}/`);
}

/** Barra lateral fixa (a partir de 1024px) e conteúdo do menu em gaveta. */
export function BarraLateral({ aoNavegar }: { aoNavegar?: () => void }) {
  const pathname = usePathname() ?? "";

  return (
    <div className="flex h-full flex-col gap-1 overflow-y-auto bg-white px-3 py-4">
      <div className="mb-3 px-2">
        <Logo />
      </div>

      <nav className="flex flex-1 flex-col gap-0.5">
        {NAVEGACAO_PRINCIPAL.map((item) => (
          <Item key={item.href} item={item} ativo={estaAtivo(pathname, item.href)} aoClicar={aoNavegar} />
        ))}

        <div className="my-3 border-t border-line" />

        {NAVEGACAO_RODAPE.map((item) => (
          <Item key={item.href} item={item} ativo={estaAtivo(pathname, item.href)} aoClicar={aoNavegar} />
        ))}

        <Link
          href="/auth/sair"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] font-semibold text-ink-soft transition hover:bg-cream-100 hover:text-ink"
        >
          <Icone nome="sair" tamanho={19} className="text-ink-muted" />
          Sair
        </Link>
      </nav>
    </div>
  );
}
