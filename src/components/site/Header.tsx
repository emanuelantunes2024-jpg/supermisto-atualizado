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
  {
    label: "Envío digital inmediato",
    icon: (
      <>
        <rect x="2.5" y="7" width="19" height="13" rx="2" />
        <path d="M2.5 11h19M9 7V4h6v3" />
      </>
    ),
  },
  {
    label: "Pago 100% seguro",
    icon: (
      <>
        <rect x="4" y="10" width="16" height="11" rx="2" />
        <path d="M8 10V7a4 4 0 0 1 8 0v3" />
      </>
    ),
  },
  {
    label: "Soporte experto",
    icon: (
      <>
        <path d="M4 14v-2a8 8 0 0 1 16 0v2" />
        <rect x="2.5" y="13" width="4" height="6" rx="1.6" />
        <rect x="17.5" y="13" width="4" height="6" rx="1.6" />
      </>
    ),
  },
];

/** Icono de línea dorado usado en la barra superior y en las acciones. */
function LineIcon({ children, size = 15 }: { children: React.ReactNode; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {children}
    </svg>
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
      <div className="border-b border-line bg-navy-950">
        <div className="mx-auto flex max-w-shell items-center justify-between gap-3 px-5 py-2.5 text-[11.5px] text-ink-muted sm:px-7 sm:text-[12px]">
          <div className="flex items-center gap-5 xl:gap-8">
            {topBar.map((item, index) => (
              <span
                key={item.label}
                className={`flex items-center gap-2 ${index > 0 ? "hidden md:flex" : ""}`}
              >
                <span className="text-gold-400">
                  <LineIcon>{item.icon}</LineIcon>
                </span>
                {item.label}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-6">
            {contactPhone && (
              <a
                href={`https://wa.me/${contactPhone.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 transition-colors hover:text-gold-400"
              >
                <span className="text-[#25d366]">
                  <LineIcon size={16}>
                    <path d="M20.5 11.6a8.5 8.5 0 0 1-12.6 7.5L3.5 20.5l1.4-4.3A8.5 8.5 0 1 1 20.5 11.6z" />
                    <path d="M8.9 8.4c.3-.7.6-.7.9-.7h.6c.2 0 .5 0 .7.5l.8 1.9c.1.2 0 .4-.1.6l-.4.5c-.1.2-.3.4-.1.7.2.4.9 1.4 1.9 2 1.2.7 1.4.5 1.7.5.2-.1.6-.5.7-.7.2-.2.3-.2.5-.1l1.8.9c.3.1.4.2.5.4 0 .2 0 .9-.3 1.3-.4.5-1.1.9-1.6.9-1.1.1-2.6-.3-4.4-1.5-2.1-1.4-3.4-3.5-3.5-3.7-.1-.2-.8-1.2-.8-2.3 0-1 .5-1.5.7-1.7z" />
                  </LineIcon>
                </span>
                {contactPhone}
              </a>
            )}
            <Link href="/contacto" className="hidden transition-colors hover:text-gold-400 sm:block">
              Ayuda
            </Link>
            <span className="flex items-center gap-1 text-ink-muted/80">
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
        <div className="mx-auto flex max-w-shell items-center gap-4 px-5 py-4 sm:px-7 nav:gap-6">
          <div className="shrink-0">
            <Logo />
          </div>

          <nav className="hidden flex-1 items-center justify-center gap-2 nav:flex lg:gap-3.5 xl:gap-6">
            {mainNav.map((item) => {
              const hasMenu = "menu" in item && item.menu;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`flex items-center gap-1.5 whitespace-nowrap text-[10.5px] font-bold uppercase tracking-[0.02em] transition-colors hover:text-gold-400 lg:text-[11.5px] lg:tracking-[0.03em] xl:text-[13px] xl:tracking-[0.04em] ${
                    isActive(item.href) ? "text-gold-400" : "text-ink"
                  }`}
                >
                  {item.label}
                  {hasMenu && (
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2">
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="ml-auto flex shrink-0 items-center gap-2.5 nav:ml-0 lg:gap-3.5 xl:gap-5">
            <Link
              href="/plantillas"
              aria-label="Buscar plantillas"
              className="hidden text-ink transition-colors hover:text-gold-400 sm:block"
            >
              <LineIcon size={19}>
                <circle cx="11" cy="11" r="7" />
                <path d="M20 20l-3.5-3.5" />
              </LineIcon>
            </Link>

            {isAdmin && (
              <Link href="/admin" className="hidden text-[13px] text-ink-muted transition-colors hover:text-gold-400 wide:block">
                Panel
              </Link>
            )}

            <Link
              href="/mi-cuenta"
              className="relative hidden items-center gap-2 text-[13px] text-ink transition-colors hover:text-gold-400 sm:flex"
            >
              <LineIcon size={19}>
                <path d="M12 20s-7-4.3-7-9a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 4.7-7 9-7 9z" />
              </LineIcon>
              <span className="hidden wide:inline">Favoritos</span>
              <Count value={0} />
            </Link>

            <Link
              href={isLoggedIn ? "/mi-cuenta" : "/entrar"}
              className="flex items-center gap-2 text-[13px] text-ink transition-colors hover:text-gold-400"
            >
              <LineIcon size={19}>
                <circle cx="12" cy="8" r="3.6" />
                <path d="M4.5 20c0-3.6 3.4-6.4 7.5-6.4s7.5 2.8 7.5 6.4" />
              </LineIcon>
              <span className="hidden wide:inline">Mi cuenta</span>
            </Link>

            <Link
              href="/plantillas"
              className="flex items-center gap-2 text-[13px] text-ink transition-colors hover:text-gold-400"
            >
              <LineIcon size={19}>
                <circle cx="9.5" cy="20" r="1.3" />
                <circle cx="18" cy="20" r="1.3" />
                <path d="M2.5 3.5h2.6l2.4 11h11l2-7.5H6.4" />
              </LineIcon>
              <span className="hidden wide:inline">Carrito</span>
              <Count value={0} />
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-line text-ink nav:hidden"
            aria-expanded={open}
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {open ? <path d="M18 6L6 18M6 6l12 12" /> : <path d="M3 12h18M3 6h18M3 18h18" />}
            </svg>
          </button>
        </div>

        {open && (
          <div className="border-t border-line bg-navy-950/95 px-5 py-4 sm:px-7 nav:hidden">
            <nav className="flex flex-col gap-3">
              {mainNav.map((item) => (
                <Link key={item.label} href={item.href} className="py-1 text-[15px] text-ink-muted">
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
                Ver categorías
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}

/** Contador dorado en burbuja (Favoritos / Carrito). */
function Count({ value }: { value: number }) {
  return (
    <span className="flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-gold-500 px-1 text-[10px] font-bold text-[#1a1200]">
      {value}
    </span>
  );
}
