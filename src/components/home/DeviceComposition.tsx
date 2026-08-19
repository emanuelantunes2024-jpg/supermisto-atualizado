import Link from "next/link";

import { PlatedDish } from "@/components/home/PlatedDish";
import { heroPhotos } from "@/lib/config";

/**
 * Composición portátil + tablet PDV + móvil de la portada, tal cual la
 * referencia de marca.
 *
 * Las fotos (el plato del restaurante y la modelo) se leen de
 * `heroPhotos` (src/lib/config.ts) → `public/hero/`. Van pintadas encima de
 * un degradado del mismo tono: mientras el archivo no exista se ve el
 * degradado y la composición nunca queda rota.
 */
export function DeviceComposition() {
  return (
    <div className="anim-in relative pb-8 pt-2" style={{ animationDelay: ".2s" }}>
      {/* Arcos dorados del fondo */}
      <div
        className="pointer-events-none absolute right-[-16%] top-[-26%] h-[520px] w-[520px] animate-pulseGlow rounded-full"
        style={{
          background: "conic-gradient(from 190deg,transparent 0deg,rgba(240,167,48,.6) 72deg,transparent 158deg)",
          maskImage: "radial-gradient(circle,transparent 63%,#000 64%,#000 70%,transparent 71%)",
          WebkitMaskImage: "radial-gradient(circle,transparent 63%,#000 64%,#000 70%,transparent 71%)",
        }}
      />
      <div
        className="pointer-events-none absolute right-[-10%] top-[-14%] h-[380px] w-[380px] animate-pulseGlow rounded-full"
        style={{
          background: "conic-gradient(from 205deg,transparent 0deg,rgba(240,167,48,.35) 60deg,transparent 140deg)",
          maskImage: "radial-gradient(circle,transparent 70%,#000 71%,#000 75%,transparent 76%)",
          WebkitMaskImage: "radial-gradient(circle,transparent 70%,#000 71%,#000 75%,transparent 76%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-x-[-8%] bottom-[2%] top-[-6%] blur-[20px]"
        style={{ background: "radial-gradient(ellipse at 54% 52%,rgba(240,167,48,0.16),transparent 66%)" }}
      />

      <div className="relative z-10 flex items-end justify-center">
        <Laptop />
        <Tablet />
        <Phone />
      </div>

      {/* Reflejo sobre la superficie */}
      <div
        className="pointer-events-none absolute inset-x-[6%] bottom-0 h-6 blur-[6px]"
        style={{ background: "radial-gradient(ellipse at 50% 0%,rgba(240,167,48,0.18),transparent 70%)" }}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Portátil — sitio web de restaurante                                */
/* ------------------------------------------------------------------ */

const laptopFeatures = ["Diseño Premium", "100% Responsive", "Optimizado SEO", "Rápido", "Soporte incluido"];

function Laptop() {
  return (
    <div className="relative z-10 w-[47%] shrink-0 animate-floatY">
      {/* Tapa: marco + pantalla */}
      <div
        className="rounded-t-[14px] p-[9px] pb-[7px] shadow-lg"
        style={{ background: "linear-gradient(160deg,#4a4d55,#26282e 40%,#15171a)" }}
      >
        <div className="relative overflow-hidden rounded-[5px] bg-[#0b0705]">
          {/* El plato dibujado; si hay foto en public/hero/ se pinta encima. */}
          <PlatedDish className="absolute inset-0 h-full w-full" />
          <div
            className="absolute inset-0"
            style={{ background: `url(${heroPhotos.restaurante}) center/cover no-repeat` }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(100deg,rgba(6,4,2,.95) 4%,rgba(9,6,3,.86) 30%,rgba(10,7,4,.34) 56%,rgba(10,7,4,0) 74%)",
            }}
          />

          <div className="relative flex min-h-[212px] flex-col justify-center px-6 py-6">
            <div className="mb-2.5 flex items-center gap-1.5 text-[8px] uppercase tracking-[0.18em] text-gold-400/85">
              <span className="h-[3px] w-[3px] rounded-full bg-gold-400" />
              Sabores excepcionales
            </div>
            <div className="mb-2 font-display text-[25px] font-extrabold uppercase leading-[1] text-[#f7f2e8]">
              Restaurante
              <br />
              Premium
            </div>
            <p className="mb-4 text-[9.5px] uppercase tracking-[0.14em] text-[#cbbfa6]">Sitio web completo</p>
            <Link
              href="/plantillas"
              className="inline-block w-fit rounded bg-gold-500 px-5 py-2.5 text-[10px] font-extrabold uppercase tracking-[0.08em] text-[#1a1200] transition-transform hover:-translate-y-0.5"
            >
              Ver demo
            </Link>

            {/* Franja inferior de ventajas */}
            <div className="absolute inset-x-0 bottom-0 flex items-center gap-4 border-t border-white/10 bg-black/55 px-5 py-2 text-[6.5px] uppercase tracking-[0.1em] text-[#d8cfbb] backdrop-blur-[2px]">
              {laptopFeatures.map((item) => (
                <span key={item} className="flex items-center gap-1">
                  <span className="text-gold-400">◆</span>
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bisagra + base del teclado en perspectiva */}
      <div
        className="mx-[-4%] h-[16px] rounded-b-[4px]"
        style={{
          background: "linear-gradient(180deg,#3c3f46,#23262b 55%,#15171a)",
          clipPath: "polygon(3.5% 0,96.5% 0,100% 100%,0 100%)",
        }}
      />
      <div
        className="relative mx-[-6%] h-[9px] rounded-b-[10px]"
        style={{ background: "linear-gradient(180deg,#2a2d33,#101215)" }}
      >
        <span className="absolute left-1/2 top-0 h-[4px] w-[16%] -translate-x-1/2 rounded-b-[4px] bg-[#0a0b0d]" />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Tablet — PDV Restaurante                                           */
/* ------------------------------------------------------------------ */

const pdvTiles: { label: string; color: string }[] = [
  { label: "Ventas", color: "#1f9d55" },
  { label: "Productos", color: "#e2761b" },
  { label: "Clientes", color: "#1d6fa5" },
  { label: "Mesas", color: "#d4a017" },
  { label: "Pedidos", color: "#c0392b" },
  { label: "Cocina", color: "#7d3cb5" },
  { label: "Inventario", color: "#159a8f" },
  { label: "Reportes", color: "#5b4bc4" },
  { label: "Empleados", color: "#2563a8" },
  { label: "Proveedores", color: "#d4551f" },
  { label: "Gastos", color: "#2f9e4f" },
  { label: "Ajustes", color: "#6b3fb0" },
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
    <div className="z-20 ml-[-1%] hidden w-[35%] shrink-0 animate-floatY sm:block" style={{ animationDelay: ".35s" }}>
      <div
        className="rounded-[12px] p-[7px] shadow-lg"
        style={{ background: "linear-gradient(160deg,#4a4d55,#26282e 42%,#15171a)" }}
      >
        <div className="overflow-hidden rounded-[5px] bg-[#0b0d10]">
          {/* Barra de título */}
          <div className="flex items-center justify-between border-b border-white/10 px-2.5 py-1.5">
            <span className="flex items-center gap-1.5 text-[7.5px] font-semibold uppercase tracking-[0.08em] text-ink">
              <span className="text-gold-400">◆</span>
              PDV Restaurante
            </span>
            <span className="flex gap-1.5 text-ink-muted/55">
              {[0, 1, 2, 3].map((d) => (
                <span key={d} className="h-[6px] w-[6px] rounded-full border border-current" />
              ))}
            </span>
          </div>

          <div className="flex gap-2 p-2">
            {/* Rejilla de accesos */}
            <div className="grid flex-1 grid-cols-4 gap-[5px]">
              {pdvTiles.map((tile) => (
                <span
                  key={tile.label}
                  className="flex aspect-[1/0.92] flex-col items-center justify-center gap-[3px] rounded-[4px] text-[5px] font-medium text-white/95"
                  style={{ background: `linear-gradient(165deg,${tile.color},${tile.color}c0)` }}
                >
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.6">
                    <rect x="4.5" y="6" width="15" height="13" rx="2.5" />
                    <path d="M8.5 6V4.5h7V6" />
                  </svg>
                  {tile.label}
                </span>
              ))}
            </div>

            {/* Ticket de la venta actual — panel claro, como la referencia */}
            <div className="flex w-[41%] flex-col rounded-[4px] bg-[#f4f2ee] p-2 text-[#1c1a17]">
              <span className="mb-1 border-b border-black/15 pb-1 text-[5.5px] font-bold uppercase tracking-[0.1em] text-[#4a463f]">
                Venta actual
              </span>
              {pdvTicket.map((row) => (
                <span key={row.name} className="flex justify-between py-[2px] text-[5.5px]">
                  {row.name}
                  <i className="not-italic font-medium">{row.price}</i>
                </span>
              ))}
              <span className="mt-auto flex justify-between border-t border-black/15 pt-1.5 text-[7px] font-bold">
                TOTAL
                <i className="not-italic">53,50 €</i>
              </span>
              <span className="mt-1.5 rounded-[3px] bg-gold-500 py-1.5 text-center text-[7px] font-extrabold uppercase tracking-[0.06em] text-[#1a1200]">
                Pagar
              </span>
            </div>
          </div>

          {/* Barra inferior */}
          <div className="flex items-center justify-around border-t border-white/10 px-2 py-1.5 text-[5px] text-ink-muted/70">
            {["Inicio", "Ventas", "Productos", "Reportes"].map((item) => (
              <span key={item} className="flex flex-col items-center gap-[2px]">
                <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <rect x="4.5" y="6" width="15" height="13" rx="2.5" />
                </svg>
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Pie del monitor */}
      <div className="mx-auto h-[20px] w-[13%]" style={{ background: "linear-gradient(90deg,#20232a,#3a3d44,#20232a)" }} />
      <div
        className="mx-auto h-[6px] w-[44%] rounded-[4px]"
        style={{ background: "linear-gradient(180deg,#3a3d44,#1a1c20)" }}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Móvil — tienda de moda                                             */
/* ------------------------------------------------------------------ */

function Phone() {
  return (
    <div className="z-30 mb-[5%] ml-[-1%] hidden w-[13.5%] shrink-0 animate-floatY sm:block" style={{ animationDelay: ".5s" }}>
      <div
        className="rounded-[17px] p-[4px] shadow-lg"
        style={{ background: "linear-gradient(160deg,#4a4d55,#26282e 45%,#15171a)" }}
      >
        <div
          className="relative flex aspect-[9/18.5] flex-col justify-end overflow-hidden rounded-[14px] px-2.5 pb-3"
          style={{
            background: [
              "linear-gradient(180deg,rgba(6,4,2,.28) 32%,rgba(8,6,4,.92) 74%)",
              `url(${heroPhotos.moda}) center/cover no-repeat`,
              "linear-gradient(180deg,#4a3a2c,#1d1712 55%,#0a0806)",
            ].join(","),
          }}
        >
          {/* Barra de estado + cabecera */}
          <div className="absolute inset-x-0 top-0">
            <div className="flex items-center justify-between px-2 pt-1 text-[4px] text-white/70">
              <span>9:41</span>
              <span className="flex gap-[2px]">
                <span className="h-[3px] w-[3px] rounded-[1px] bg-white/70" />
                <span className="h-[3px] w-[3px] rounded-[1px] bg-white/70" />
                <span className="h-[3px] w-[5px] rounded-[1px] bg-white/70" />
              </span>
            </div>
            <div className="flex items-center justify-between px-2 py-1.5">
              <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5">
                <path d="M3 6h18M3 12h18M3 18h18" />
              </svg>
              <span className="flex items-center gap-1 text-[5px] font-bold uppercase tracking-[0.1em] text-gold-400">
                <span className="text-[6px]">☀</span>
                Leuname
              </span>
            </div>
          </div>

          <div className="mb-1 font-display text-[13px] font-extrabold uppercase leading-[0.98] text-[#f7f2e8]">
            Moda
            <br />
            <span className="text-gold-400">Premium</span>
          </div>
          <p className="mb-2 text-[6px] leading-tight text-[#e0d7c4]">
            Nueva colección
            <br />
            2024
          </p>
          <span className="rounded-[3px] bg-gold-500 px-2 py-1.5 text-center text-[5.5px] font-extrabold uppercase tracking-[0.06em] text-[#1a1200]">
            Ver colección
          </span>
        </div>
      </div>
    </div>
  );
}
