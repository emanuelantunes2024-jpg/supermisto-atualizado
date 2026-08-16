import Link from "next/link";

import { Logo } from "@/components/site/Logo";
import { siteConfig } from "@/lib/config";

const columns = [
  {
    title: "Productos",
    links: [
      { href: "/plantillas", label: "Todas las plantillas" },
      { href: "/plantillas?cat=barberias", label: "Barberías" },
      { href: "/plantillas?cat=restaurantes", label: "Restaurantes" },
      { href: "/#precios", label: "Precios" },
    ],
  },
  {
    title: "Empresa",
    links: [
      { href: "/#como-funciona", label: "Cómo funciona" },
      { href: "/contacto", label: "Contacto" },
      { href: "/mi-cuenta", label: "Mis compras" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/legal/terminos", label: "Términos y condiciones" },
      { href: "/legal/privacidad", label: "Política de privacidad" },
      { href: "/legal/reembolsos", label: "Política de reembolso" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-line bg-navy-900 pb-7 pt-14">
      <div className="container-shell">
        <div className="mb-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Logo variant="full" />
            <p className="mt-4 max-w-[260px] text-[13px] text-ink-muted">
              Plantillas de sitios web profesionales para emprendedores. Tu idea, nuestra tecnología.
            </p>
          </div>

          {columns.map((column) => (
            <div key={column.title}>
              <h5 className="mb-4 text-[12.5px] uppercase tracking-[0.06em] text-ink-muted">{column.title}</h5>
              <ul className="space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.href + link.label}>
                    <Link href={link.href} className="text-[13.5px] text-ink-muted transition-colors hover:text-gold-400">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-6 text-xs text-ink-muted">
          <span>
            © {new Date().getFullYear()} {siteConfig.name}. Todos los derechos reservados.
          </span>
          <div className="flex gap-2.5">
            {["f", "in", "ig"].map((label) => (
              <span
                key={label}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-line transition-colors hover:border-gold-500 hover:text-gold-400"
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
