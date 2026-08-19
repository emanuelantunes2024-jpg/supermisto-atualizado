import Link from "next/link";

import { heroPhotos } from "@/lib/config";

/**
 * Composición portátil + tablet PDV + móvil de la portada, tal cual la
 * referencia de marca.
 *
 * Las fotos (el plato del restaurante y la modelo) se configuran en
 * `heroPhotos` (src/lib/config.ts). Mientras no haya archivo se dibuja un
 * degradado del mismo tono, así la composición nunca se rompe.
 */
export function DeviceComposition() {
  return (
    <div className="anim-in relative pb-6 pt-2" style={{ animationDelay: ".2s" }}>
      {/* Arcos dorados del fondo */}
      <div
        className="pointer-events-none absolute right-[-18%] top-[-22%] h-[460px] w-[460px] animate-pulseGlow rounded-full"
        style={{
          background: "conic-gradient(from 195deg,transparent 0deg,rgba(240,167,48,.55) 70deg,transparent 155deg)",
          maskImage: "radial-gradient(circle,transparent 64%,#000 65%,#000 71%,transparent 72%)",
          WebkitMaskImage: "radial-gradient(circle,transparent 64%,#000 65%,#000 71%,transparent 72%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-x-[-8%] bottom-[4%] top-[-6%] blur-[18px]"
        style={{ background: "radial-gradient(ellipse at 52% 52%,rgba(240,167,48,0.18),transparent 68%)" }}
      />

      <div className="relative z-10 flex items-end justify-center gap-[2%]">
        <Laptop />
        <Tablet />
        <Phone />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Portátil — sitio web de restaurante                                */
/* ------------------------------------------------------------------ */

function Laptop() {
  return (
    <div className="w-[52%] shrink-0 animate-floatY">
      <div className="overflow-hidden rounded-t-[10px] border-[7px] border-b-0 border-[#2a2c31] bg-[#050506] shadow-lg">
        <div
          className="relative flex min-h-[188px] flex-col justify-center px-5 py-4"
          style={{
            /* Foto encima, degradado debajo: si aún no has copiado el
               archivo en public/hero/, se ve el degradado y nada se rompe. */
            background: [
              "linear-gradient(100deg,rgba(6,4,2,.94) 4%,rgba(10,7,4,.72) 40%,rgba(10,7,4,.10) 70%)",
              `url(${heroPhotos.restaurante}) center/cover no-repeat`,
              "radial-gradient(ellipse at 72% 50%,#6b3c14,#2a1708 45%,#0b0705 78%)",
            ].join(","),
          }}
        >
          <div className="mb-2 flex items-center gap-1.5 text-[7.5px] uppercase tracking-[0.16em] text-gold-400/85">
            <span className="h-[3px] w-[3px] rounded-full bg-gold-400" />
            Sabores excepcionales
          </div>
          <div className="mb-1.5 font-display text-[20px] font-extrabold uppercase leading-[1.02] text-[#f7f2e8]">
            Restaurante
            <br />
            Premium
          </div>
          <p className="mb-3.5 text-[8.5px] uppercase tracking-[0.12em] text-[#cbbfa6]">Sitio web completo</p>
          <Link
            href="/plantillas"
            className="inline-block w-fit rounded bg-gold-500 px-4 py-2 text-[9px] font-extrabold uppercase tracking-[0.06em] text-[#1a1200]"
          >
            Ver demo
          </Link>

          {/* Franja inferior de ventajas */}
          <div className="absolute inset-x-0 bottom-0 flex items-center gap-3 border-t border-white/10 bg-black/55 px-4 py-1.5 text-[6px] uppercase tracking-[0.08em] text-[#d8cfbb] backdrop-blur-[2px]">
            {["Diseño Premium", "100% Responsive", "Optimizado SEO", "Rápido", "Soporte incluido"].map((item) => (
              <span key={item} className="flex items-center gap-1">
                <span className="text-gold-400">◆</span>
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Base del portátil */}
      <div
        className="h-[10px]"
        style={{
          background: "linear-gradient(180deg,#33363c,#1b1d21)",
          clipPath: "polygon(4% 0,96% 0,100% 100%,0 100%)",
        }}
      />
      <div
        className="relative mx-[-2%] h-[13px] rounded-b-[7px]"
        style={{ background: "linear-gradient(180deg,#3a3d44,#16181c)" }}
      >
        <span className="absolute left-1/2 top-0 h-[4px] w-[64px] -translate-x-1/2 rounded-b-[4px] bg-[#0d0f12]" />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Tablet — PDV Restaurante                                           */
/* ------------------------------------------------------------------ */

const pdvTiles: { label: string; color: string }[] = [
  { label: "Ventas", color: "#2f9e6b" },
  { label: "Productos", color: "#e07b2c" },
  { label: "Clientes", color: "#2f7fd1" },
  { label: "Mesas", color: "#c9a227" },
  { label: "Pedidos", color: "#cf3b3b" },
  { label: "Cocina", color: "#8a4bd1" },
  { label: "Inventario", color: "#2fa39e" },
  { label: "Reportes", color: "#6b52c9" },
  { label: "Empleados", color: "#2f6fd1" },
  { label: "Proveedores", color: "#e0562c" },
  { label: "Gastos", color: "#3fa35c" },
  { label: "Ajustes", color: "#7a52c9" },
];

const pdvTicket = [
  { name: "Parrillada", price: "22,50 €" },
  { name: "Ensalada César", price: "8,50 €" },
  { name: "Vino Tinto", price: "15,00 €" },
  { name: "Agua Mineral", price: "2,00 €" },
  { name: "Postre", price: "5,50 €" },
];

function Tablet() {
  return (
    <div className="hidden w-[34%] shrink-0 animate-floatY sm:block" style={{ animationDelay: ".35s" }}>
      <div className="overflow-hidden rounded-[9px] border-[6px] border-[#2a2c31] bg-[#0b0d10] shadow-lg">
        {/* Barra de título */}
        <div className="flex items-center justify-between border-b border-line px-2.5 py-1.5">
          <span className="text-[7px] font-bold uppercase tracking-[0.1em] text-ink">PDV Restaurante</span>
          <span className="flex gap-1.5 text-ink-muted/60">
            {[0, 1, 2, 3].map((d) => (
              <span key={d} className="h-[5px] w-[5px] rounded-full border border-current" />
            ))}
          </span>
        </div>

        <div className="flex gap-1.5 p-1.5">
          {/* Rejilla de accesos */}
          <div className="grid flex-1 grid-cols-4 gap-1">
            {pdvTiles.map((tile) => (
              <span
                key={tile.label}
                className="flex aspect-square flex-col items-center justify-center gap-[3px] rounded-[3px] text-[4.5px] font-medium text-white/90"
                style={{ background: `linear-gradient(160deg,${tile.color},${tile.color}bb)` }}
              >
                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8">
                  <rect x="4" y="4" width="16" height="16" rx="3" />
                </svg>
                {tile.label}
              </span>
            ))}
          </div>

          {/* Ticket de la venta actual */}
          <div className="flex w-[42%] flex-col rounded-[3px] border border-line bg-[#101216] p-1.5">
            <span className="mb-1 border-b border-line pb-1 text-[5.5px] font-bold uppercase tracking-[0.08em] text-ink-muted">
              Venta actual
            </span>
            {pdvTicket.map((row) => (
              <span key={row.name} className="flex justify-between py-[1.5px] text-[5px] text-ink/85">
                {row.name}
                <i className="not-italic text-ink-muted">{row.price}</i>
              </span>
            ))}
            <span className="mt-auto flex justify-between border-t border-line pt-1 text-[6px] font-bold text-ink">
              TOTAL
              <i className="not-italic">53,50 €</i>
            </span>
            <span className="mt-1 rounded-[3px] bg-gold-500 py-1 text-center text-[6.5px] font-extrabold uppercase text-[#1a1200]">
              Pagar
            </span>
          </div>
        </div>

        {/* Barra inferior */}
        <div className="flex items-center justify-around border-t border-line px-2 py-1 text-[4.5px] text-ink-muted/70">
          {["Inicio", "Ventas", "Productos", "Reportes"].map((item) => (
            <span key={item} className="flex flex-col items-center gap-[2px]">
              <svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="4" y="4" width="16" height="16" rx="3" />
              </svg>
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* Pie del monitor */}
      <div className="mx-auto h-[14px] w-[16%] bg-[#25272c]" />
      <div className="mx-auto h-[5px] w-[46%] rounded-[3px] bg-[#2f3238]" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Móvil — tienda de moda                                             */
/* ------------------------------------------------------------------ */

function Phone() {
  return (
    <div
      className="hidden w-[13%] shrink-0 animate-floatY overflow-hidden rounded-[14px] border-[4px] border-[#2a2c31] bg-[#050506] shadow-lg sm:block"
      style={{ animationDelay: ".5s" }}
    >
      <div
        className="relative flex aspect-[9/18] flex-col justify-end px-2 pb-2.5"
        style={{
          background: [
            "linear-gradient(180deg,rgba(6,4,2,.30) 34%,rgba(8,6,4,.90) 76%)",
            `url(${heroPhotos.moda}) center/cover no-repeat`,
            "linear-gradient(180deg,#4a3a2c,#1d1712 55%,#0a0806)",
          ].join(","),
        }}
      >
        <div className="absolute inset-x-0 top-0 flex items-center justify-between px-2 py-1.5">
          <svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5">
            <path d="M3 6h18M3 12h18M3 18h18" />
          </svg>
          <span className="text-[5px] font-bold uppercase tracking-[0.1em] text-gold-400">Leuname</span>
        </div>

        <div className="mb-0.5 font-display text-[10px] font-extrabold uppercase leading-[1.02] text-[#f7f2e8]">
          Moda
          <br />
          <span className="text-gold-400">Premium</span>
        </div>
        <p className="mb-1.5 text-[5.5px] leading-tight text-[#d8cfbb]">
          Nueva colección
          <br />
          2024
        </p>
        <span className="rounded-[3px] bg-gold-500 px-1.5 py-1 text-center text-[5px] font-extrabold uppercase text-[#1a1200]">
          Ver colección
        </span>
      </div>
    </div>
  );
}
