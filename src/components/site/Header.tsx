"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { Logo } from "@/components/site/Logo";
import { mainNav, socialLinks } from "@/lib/config";

interface HeaderProps {
  isLoggedIn: boolean;
  isAdmin: boolean;
}

const trustBar = [
  { icon: "🛡️", label: "Compra segura" },
  { icon: "🚚", label: "Entrega inmediata" },
  { icon: "🎧", label: "Soporte especializado" },
];

const socials: { key: keyof typeof socialLinks; icon: string; label: string }[] = [
  { key: "whatsapp", icon: "💬", label: "WhatsApp" },
  { key: "facebook", icon: "📘", label: "Facebook" },
  { key: "instagram", icon: "📷", label: "Instagram" },
  { key: "youtube", icon: "▶️", label: "YouTube" },
  { key: "tiktok", icon: "🎵", label: "TikTok" },
];

export function Header({ isLoggedIn, isAdmin }: HeaderProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href.split("#")[0]);

  const activeSocials = socials.filter((item) => socialLinks[item.key]);

  return (
    <>
      {/* Barra superior */}
      <div className="hidden border-b border-line bg-navy-950 md:block">
        <div className="mx-auto flex max-w-shell items-center justify-between px-7 py-2 text-[12px] text-ink-muted">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 font-semibold text-gold-400">
              <span aria-hidden>🏆</span>
              ¡Soluciones inteligentes para tu negocio!
            </span>
            {trustBar.map((item) => (
              <span key={item.label} className="hidden items-center gap-1.5 lg:flex">
                <span aria-hidden>{item.icon}</span>
                {item.label}
              </span>
            ))}
          </div>
          {activeSocials.length > 0 && (
            <div className="flex items-center gap-3.5">
              {activeSocials.map((item) => (
                <a
                  key={item.key}
                  href={socialLinks[item.key]}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={item.label}
                  className="flex h-6 w-6 items-center justify-center rounded-full text-[13px] transition-colors hover:text-gold-400"
                >
                  {item.icon}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

      <header
        className="sticky top-0 z-50 border-b border-line backdrop-blur-[10px]"
        style={{ background: "rgba(8,9,11,0.92)" }}
      >
        <div className="mx-auto flex max-w-shell items-center justify-between gap-6 px-7 py-4">
          <Logo />

          <nav className="hidden flex-1 justify-center gap-7 lg:flex">
            {mainNav.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`whitespace-nowrap text-[13.5px] font-semibold uppercase tracking-[0.03em] transition-colors hover:text-gold-400 ${
                  isActive(item.href) ? "text-gold-400" : "text-ink-muted"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            {isAdmin && (
              <Link href="/admin" className="text-[13px] text-ink-muted transition-colors hover:text-gold-400">
                Panel
              </Link>
            )}

            <Link
              href={isLoggedIn ? "/mi-cuenta" : "/entrar"}
              className="btn btn-ghost"
              style={{ fontSize: "13px" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" />
              </svg>
              {isLoggedIn ? "Mi cuenta" : "Entrar"}
            </Link>

            <Link href="/plantillas" className="btn btn-ghost" style={{ fontSize: "13px" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="9" cy="20" r="1.4" />
                <circle cx="18" cy="20" r="1.4" />
                <path d="M2 3h2l2.6 12.4a2 2 0 0 0 2 1.6h8a2 2 0 0 0 2-1.6L21 7H6" />
              </svg>
              Carrito
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-line text-ink lg:hidden"
            aria-expanded={open}
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {open ? <path d="M18 6L6 18M6 6l12 12" /> : <path d="M3 12h18M3 6h18M3 18h18" />}
            </svg>
          </button>
        </div>

        {open && (
          <div className="border-t border-line bg-navy-950/95 px-7 py-4 lg:hidden">
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
                Explorar tienda
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
