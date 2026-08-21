import Link from "next/link";

import { Logo } from "@/components/ui/Logo";
import { LINK_OFERTA } from "@/lib/config";

const SECOES = [
  { href: "#o-que-e", rotulo: "O que é" },
  { href: "#ferramentas", rotulo: "Ferramentas" },
  { href: "#biblioteca", rotulo: "Biblioteca" },
  { href: "#perguntas", rotulo: "Dúvidas" },
  { href: "#oferta", rotulo: "Acesso" },
];

export function CabecalhoPublico() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-cream-100/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 app:px-6">
        <Logo href="/" />

        <nav className="ml-auto hidden items-center gap-1 app:flex">
          {SECOES.map((secao) => (
            <a
              key={secao.href}
              href={secao.href}
              className="rounded-lg px-3 py-2 text-[13.5px] font-semibold text-ink-soft transition hover:bg-white hover:text-ink"
            >
              {secao.rotulo}
            </a>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 app:ml-0">
          <Link
            href="/entrar"
            className="rounded-xl px-3 py-2 text-[13.5px] font-semibold text-ink-soft transition hover:text-brand-600"
          >
            Entrar
          </Link>

          <a
            href={LINK_OFERTA || "#oferta"}
            {...(LINK_OFERTA ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className="rounded-xl bg-brand-500 px-4 py-2.5 text-[13.5px] font-bold text-white transition hover:bg-brand-600"
          >
            Quero acesso
          </a>
        </div>
      </div>
    </header>
  );
}
