"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { Logo } from "@/components/site/Logo";
import { mainNav } from "@/lib/config";

interface HeaderProps {
  isLoggedIn: boolean;
  isAdmin: boolean;
}

export function Header({ isLoggedIn, isAdmin }: HeaderProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Cerrar el menú móvil al navegar.
  useEffect(() => setOpen(false), [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href.split("#")[0]);

  return (
    <header className="sticky top-0 z-50 border-b border-line backdrop-blur-[10px]" style={{ background: "rgba(7,12,24,0.86)" }}>
      <div className="mx-auto flex max-w-shell items-center justify-between px-7 py-4">
        <Logo />

        <nav className="hidden gap-[30px] md:flex">
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm transition-colors hover:text-gold-400 ${
                isActive(item.href) ? "text-gold-400" : "text-ink-muted"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {isAdmin && (
            <Link href="/admin" className="text-sm text-ink-muted transition-colors hover:text-gold-400">
              Panel
            </Link>
          )}
          {isLoggedIn ? (
            <Link href="/mi-cuenta" className="btn btn-ghost">
              Mi cuenta
            </Link>
          ) : (
            <Link href="/entrar" className="btn btn-ghost">
              Entrar
            </Link>
          )}
          <Link href="/plantillas" className="btn btn-gold">
            Explorar tienda
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-line text-ink md:hidden"
          aria-expanded={open}
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? <path d="M18 6L6 18M6 6l12 12" /> : <path d="M3 12h18M3 6h18M3 18h18" />}
          </svg>
        </button>
      </div>

      {open && (
        <div className="border-t border-line bg-navy-950/95 px-7 py-4 md:hidden">
          <nav className="flex flex-col gap-3">
            {mainNav.map((item) => (
              <Link key={item.href} href={item.href} className="py-1 text-[15px] text-ink-muted">
                {item.label}
              </Link>
            ))}
            {isAdmin && (
              <Link href="/admin" className="py-1 text-[15px] text-ink-muted">
                Panel de administración
              </Link>
            )}
          </nav>
          <div className="mt-4 flex flex-col gap-2">
            <Link href={isLoggedIn ? "/mi-cuenta" : "/entrar"} className="btn btn-ghost btn-block">
              {isLoggedIn ? "Mi cuenta" : "Entrar"}
            </Link>
            <Link href="/plantillas" className="btn btn-gold btn-block">
              Explorar tienda
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
