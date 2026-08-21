"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Icone } from "@/components/ui/Icone";
import { NAVEGACAO_CELULAR } from "@/components/layout/navegacao";

/**
 * Barra fixa inferior, só no celular.
 *
 * É o que faz o produto parecer aplicativo: alcance do polegar, ícone e
 * rótulo curto, sem depender do menu de gaveta para o dia a dia.
 */
export function BarraCelular() {
  const pathname = usePathname() ?? "";

  return (
    <nav className="pb-safe fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 backdrop-blur-md app:hidden">
      <ul className="mx-auto flex max-w-lg items-stretch justify-between px-1 pt-1.5">
        {NAVEGACAO_CELULAR.map((item) => {
          const ativo =
            item.href === "/inicio"
              ? pathname === "/inicio"
              : pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <li key={item.href} className="flex-1">
              <Link
                href={item.href}
                aria-current={ativo ? "page" : undefined}
                className={`flex flex-col items-center gap-1 rounded-lg px-1 py-1 text-[10px] font-semibold transition ${
                  ativo ? "text-brand-600" : "text-ink-muted"
                }`}
              >
                <span
                  className={`grid h-8 w-12 place-items-center rounded-pill transition ${
                    ativo ? "bg-brand-50" : ""
                  }`}
                >
                  <Icone nome={item.icone} tamanho={19} />
                </span>
                <span className="truncate">{item.rotulo}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
