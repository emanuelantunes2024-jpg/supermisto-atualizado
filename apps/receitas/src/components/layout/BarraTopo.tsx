"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";

import { BarraLateral } from "@/components/layout/BarraLateral";
import { Icone } from "@/components/ui/Icone";
import { Logo } from "@/components/ui/Logo";
import { useDadosUsuario } from "@/lib/dados-usuario";

interface Props {
  /** Quantidade de receitas novas nos últimos dias, para o sino. */
  novidades?: number;
  nomeUsuario?: string;
}

export function BarraTopo({ novidades = 0, nomeUsuario }: Props) {
  const router = useRouter();
  const [termo, setTermo] = useState("");
  const [menuAberto, setMenuAberto] = useState(false);
  const { user, modoLocal } = useDadosUsuario();

  // Trava a rolagem do fundo enquanto a gaveta está aberta.
  useEffect(() => {
    document.body.style.overflow = menuAberto ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuAberto]);

  function buscar(evento: FormEvent) {
    evento.preventDefault();
    const limpo = termo.trim();
    if (limpo) router.push(`/buscar?q=${encodeURIComponent(limpo)}`);
  }

  const nome = nomeUsuario ?? user?.user_metadata?.nome ?? user?.email?.split("@")[0] ?? null;

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-line bg-cream-100/90 backdrop-blur-md">
        <div className="flex h-16 items-center gap-3 px-4 app:px-6">
          <button
            type="button"
            onClick={() => setMenuAberto(true)}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-ink-soft transition hover:bg-white app:hidden"
            aria-label="Abrir menu"
          >
            <Icone nome="menu" tamanho={22} />
          </button>

          <div className="app:hidden">
            <Logo compacto />
          </div>

          <form onSubmit={buscar} className="ml-auto hidden flex-1 justify-center app:flex">
            <div className="relative w-full max-w-md">
              <Icone
                nome="buscar"
                tamanho={17}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint"
              />
              <input
                type="search"
                value={termo}
                onChange={(e) => setTermo(e.target.value)}
                placeholder="Buscar receitas, ingredientes..."
                aria-label="Buscar receitas"
                className="campo h-11 pl-10"
              />
            </div>
          </form>

          <div className="ml-auto flex items-center gap-1.5 app:ml-0">
            <Link
              href="/buscar"
              className="grid h-10 w-10 place-items-center rounded-xl text-ink-soft transition hover:bg-white app:hidden"
              aria-label="Buscar"
            >
              <Icone nome="buscar" tamanho={20} />
            </Link>

            <Link
              href="/novidades"
              className="relative grid h-10 w-10 place-items-center rounded-xl text-ink-soft transition hover:bg-white"
              aria-label={
                novidades > 0 ? `Novidades: ${novidades} receitas novas` : "Novidades"
              }
            >
              <Icone nome="sino" tamanho={20} />
              {novidades > 0 && (
                <span className="absolute right-1.5 top-1.5 grid h-4 min-w-4 place-items-center rounded-pill bg-brand-500 px-1 text-[9px] font-bold text-white">
                  {novidades > 99 ? "99+" : novidades}
                </span>
              )}
            </Link>

            <Link
              href="/meu-plano"
              className="flex items-center gap-2 rounded-pill py-1 pl-1 pr-1 transition hover:bg-white app:pr-3"
            >
              <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-brand-300 to-brand-500 text-sm font-bold text-white">
                {(nome ?? "?").charAt(0).toUpperCase()}
              </span>
              <span className="hidden text-[13px] font-semibold text-ink app:inline">
                {nome ? `Olá, ${nome}!` : "Minha conta"}
              </span>
            </Link>
          </div>
        </div>

        {modoLocal && (
          <p className="border-t border-line bg-amber-100/70 px-4 py-1.5 text-center text-[11px] font-medium text-ink-soft app:px-6">
            Modo demonstração — seus favoritos, listas e preços ficam salvos apenas neste
            navegador.{" "}
            <Link href="/entrar" className="font-bold text-brand-600 underline">
              Entrar na conta
            </Link>
          </p>
        )}
      </header>

      {menuAberto && (
        <div className="fixed inset-0 z-50 app:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
            onClick={() => setMenuAberto(false)}
            aria-label="Fechar menu"
          />
          <div className="animate-slideIn absolute inset-y-0 left-0 w-[280px] max-w-[85vw] shadow-pop">
            <button
              type="button"
              onClick={() => setMenuAberto(false)}
              className="absolute right-3 top-4 z-10 grid h-9 w-9 place-items-center rounded-xl text-ink-muted hover:bg-cream-100"
              aria-label="Fechar menu"
            >
              <Icone nome="fechar" tamanho={20} />
            </button>
            <BarraLateral aoNavegar={() => setMenuAberto(false)} />
          </div>
        </div>
      )}
    </>
  );
}
