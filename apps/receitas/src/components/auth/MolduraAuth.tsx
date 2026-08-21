import Link from "next/link";
import type { ReactNode } from "react";

import { Logo } from "@/components/ui/Logo";
import { Icone } from "@/components/ui/Icone";

/** Moldura das telas de entrar, criar conta e recuperar senha. */
export function MolduraAuth({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-screen bg-cream-100 app:grid-cols-2">
      <div className="flex flex-col justify-center px-5 py-10 app:px-16">
        <div className="mx-auto w-full max-w-sm">
          <Logo href="/" className="mb-8" />
          {children}

          <Link
            href="/demonstracao"
            className="mt-6 inline-flex items-center gap-1.5 text-[13px] font-semibold text-ink-muted hover:text-brand-600"
          >
            <Icone nome="olho" tamanho={15} />
            Conhecer a demonstração antes
          </Link>
        </div>
      </div>

      <div className="relative hidden overflow-hidden bg-gradient-to-br from-panel-900 via-panel-800 to-brand-800 app:block">
        <div
          aria-hidden="true"
          className="absolute -right-16 top-10 h-72 w-72 rounded-full bg-brand-500/25 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="absolute -left-10 bottom-0 h-64 w-64 rounded-full bg-amber-400/20 blur-3xl"
        />

        <div className="relative flex h-full flex-col justify-center px-14 text-white">
          <p className="font-display text-3xl font-extrabold leading-tight">
            Sua cozinha com
            <br />
            <span className="text-brand-300">preço, custo e planejamento</span>
            <br />
            na mesma tela.
          </p>

          <ul className="mt-8 flex flex-col gap-3.5">
            {[
              "Receitas brasileiras completas, com rendimento ajustável",
              "Calculadora de custo e de preço de venda",
              "Lista de compras somada automaticamente",
              "Central de Renda com simulações de produção",
              "Novas receitas entram sem custo adicional",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-[14px] text-white/80">
                <Icone nome="check" tamanho={17} className="mt-0.5 shrink-0 text-brand-300" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
