"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { Logo } from "@/components/site/Logo";
import { contactPhone, mainNav } from "@/lib/config";

interface HeaderProps {
  isLoggedIn: boolean;
  isAdmin: boolean;
}

const topBar = [
  { icon: "📦", label: "Envío digital inmediato" },
  { icon: "🔒", label: "Pago 100% seguro" },
  { icon: "🎧", label: "Soporte experto" },
];

/** Sección del menú cuyo producto todavía no está a la venta. */
function SoonTag() {
  return (
    <span className="rounded-full border border-line px-1.5 py-px text-[9px] font-semibold normal-case tracking-normal text-ink-muted/70">
      Pronto
    </span>
  );
}

export function Header({ isLoggedIn, isAdmin }: HeaderProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href.split("#")[0]);

  return (
    <>
      {/* Barra superior de servicio */}
      <div className="hidden border-b border-line bg-navy-950 md:block">
        <div className="mx-auto flex max-w-shell items-center justify-between px-7 py-2.5 text-[12px] text-ink-muted">
          <div className="flex items-center gap-7">
            {topBar.map((item) => (
              <span key={item.label} className="flex items-center gap-2">
                <span className="text-gold-400" aria-hidden>
                  {item.icon}
                </span>
                {item.label}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-5">
            {contactPhone && (
              <a href={`tel:${contactPhone.replace(/\s/g, "")}`} className="flex items-center gap-2 transition-colors hover:text-gold-400">
                <span className="text-[#22c55e]" aria-hidden>📞</span>
                {contactPhone}
              </a>
            )}
            <Link href="/contacto" className="transition-colors hover:text-gold-400">
              Ayuda
            </Link>
            <span className="flex items-center gap-1 text-ink-muted/70">
              ES
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </span>
          </div>
        </div>
      </div>

      <header
        className="sticky top-0 z-50 border-b border-line backdrop-blur-[10px]"
        style={{ background: "rgba(8,9,11,0.92)" }}
      >
        <div className="mx-auto flex max-w-shell items-center justify-between gap-8 px-7 py-4">
          <Logo />

          <nav className="hidden flex-1 justify-center gap-5 xl:flex">
            {mainNav.map((item) => {
              const soon = "soon" in item && item.soon;
              const inner = (
                <span className="flex items-center gap-1.5 whitespace-nowrap text-[13px] font-bold uppercase tracking-[0.04em]">
                  {item.label}
                  {soon && <SoonTag />}
                </span>
              );

              if (soon) {
                return (
                  <span key={item.label} className="cursor-default text-ink-muted/45">
                    {inner}
                  </span>
                );
              }
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`transition-colors hover:text-gold-400 ${
                    isActive(item.href) ? "text-gold-400" : "text-ink-muted"
                  }`}
                >
                  {inner}
                </Link>
              );
            })}
          </nav>

          <div className="hidden items-center gap-4 xl:flex">
            <Link
              href="/plantillas"
              aria-label="Buscar plantillas"
              className="text-ink-muted transition-colors hover:text-gold-400"
            >
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="7" />
                <path d="M20 20l-3.5-3.5" />
              </svg>
            </Link>

            {isAdmin && (
              <Link href="/admin" className="text-[13px] text-ink-muted transition-colors hover:text-gold-400">
                Panel
              </Link>
            )}

            <Link
              href={isLoggedIn ? "/mi-cuenta" : "/entrar"}
              className="flex items-center gap-2 text-[13px] text-ink-muted transition-colors hover:text-gold-400"
            >
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" />
              </svg>
              {isLoggedIn ? "Mi cuenta" : "Entrar"}
            </Link>

            <Link href="/plantillas" className="btn btn-gold" style={{ fontSize: "13px" }}>
              Explorar tienda
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-line text-ink xl:hidden"
            aria-expanded={open}
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {open ? <path d="M18 6L6 18M6 6l12 12" /> : <path d="M3 12h18M3 6h18M3 18h18" />}
            </svg>
          </button>
        </div>

        {open && (
          <div className="border-t border-line bg-navy-950/95 px-7 py-4 xl:hidden">
            <nav className="flex flex-col gap-3">
              {mainNav.map((item) => {
                const soon = "soon" in item && item.soon;
                if (soon) {
                  return (
                    <span key={item.label} className="flex items-center gap-2 py-1 text-[15px] text-ink-muted/45">
                      {item.label}
                      <SoonTag />
                    </span>
                  );
                }
                return (
                  <Link key={item.label} href={item.href} className="py-1 text-[15px] text-ink-muted">
                    {item.label}
                  </Link>
                );
              })}
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
    </>
  );
}
