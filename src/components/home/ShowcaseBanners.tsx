import Link from "next/link";
import Image from "next/image";

import type { TemplateWithCategory } from "@/lib/types";

interface ShowcaseBannersProps {
  templates: TemplateWithCategory[];
}

/** Los dos grandes banners de la portada: PDVs (en desarrollo) y Sitio Premium (a la venta). */
export function ShowcaseBanners({ templates }: ShowcaseBannersProps) {
  const preview = templates.slice(0, 3);

  return (
    <section className="pb-16">
      <div className="container-shell grid gap-5 lg:grid-cols-2">
        {/* PDVs — en desarrollo, sin botón de compra */}
        <div
          className="relative overflow-hidden rounded-[18px] border border-line p-8"
          style={{ background: "linear-gradient(135deg,#1a1206,#0d0f12 65%)" }}
        >
          <div
            className="pointer-events-none absolute inset-0"
            style={{ background: "radial-gradient(circle at 80% 30%,rgba(240,167,48,0.18),transparent 60%)" }}
          />
          <div className="relative z-10 grid items-center gap-6 sm:grid-cols-[1fr_1.1fr]">
            <PdvMockup />
            <div>
              <span className="badge-pill mb-3">En desarrollo</span>
              <h3 className="mb-2 text-[26px] uppercase leading-none">PDVs Profesionales</h3>
              <p className="mb-5 text-[13.5px] text-ink-muted">
                Sistemas de punto de venta para todos los rubros de tu negocio. Estamos terminando de
                construirlos.
              </p>
              <Link
                href="/pdvs"
                className="inline-flex items-center gap-1.5 text-[13px] font-bold uppercase tracking-[0.03em] text-gold-400 hover:underline"
              >
                Conoce los PDVs →
              </Link>
            </div>
          </div>
        </div>

        {/* Sitio Premium — a la venta hoy, con capturas reales */}
        <div
          className="relative overflow-hidden rounded-[18px] border border-line p-8"
          style={{ background: "linear-gradient(135deg,#131a24,#0d0f12 65%)" }}
        >
          <div
            className="pointer-events-none absolute inset-0"
            style={{ background: "radial-gradient(circle at 80% 30%,rgba(63,131,248,0.14),transparent 60%)" }}
          />
          <div className="relative z-10 grid items-center gap-6 sm:grid-cols-[1fr_1.1fr]">
            <SitesMockup templates={preview} />
            <div>
              <span className="badge-pill mb-3">Disponible hoy</span>
              <h3 className="mb-2 text-[26px] uppercase leading-none">Sitio Premium</h3>
              <p className="mb-5 text-[13.5px] text-ink-muted">Modernos, rápidos y responsivos.</p>
              <Link
                href="/plantillas"
                className="inline-flex items-center gap-1.5 text-[13px] font-bold uppercase tracking-[0.03em] text-gold-400 hover:underline"
              >
                Ver plantillas →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PdvMockup() {
  return (
    <div className="relative flex h-[170px] items-end justify-center">
      {/* Terminal */}
      <div className="relative z-10 w-[110px] rounded-t-lg border border-line bg-navy-900 p-2 shadow-lg">
        <div className="mb-1.5 h-[70px] rounded bg-navy-800 p-1.5">
          <div className="mb-1 h-1.5 w-3/4 rounded-full bg-gold-500/60" />
          <div className="mb-1 h-1.5 w-1/2 rounded-full bg-line" />
          <div className="h-1.5 w-2/3 rounded-full bg-line" />
        </div>
        <div className="rounded bg-gold-500 py-1 text-center text-[8px] font-bold text-[#1a1200]">COBRAR</div>
      </div>
      <div className="h-3 w-[130px] rounded-b-md" style={{ background: "linear-gradient(180deg,#2c3039,#16181c)" }} />

      {/* Impresora */}
      <div className="absolute bottom-0 left-[6%] z-0 w-[46px] rounded border border-line bg-navy-800 shadow-lg">
        <div className="h-[38px] rounded-t border-b border-line bg-navy-700" />
        <div className="h-[22px] w-[6px] translate-x-[20px] rounded-b bg-[#e8e8ec]" />
      </div>

      {/* Lector de código */}
      <div className="absolute bottom-3 right-[4%] z-0 flex h-[30px] w-[54px] items-center justify-center rounded-md border border-line bg-navy-800 shadow-lg">
        <div className="h-[14px] w-[36px] rounded-sm bg-[#0a0a0b]" />
      </div>
    </div>
  );
}

function SitesMockup({ templates }: { templates: TemplateWithCategory[] }) {
  const [a, b, c] = templates;
  return (
    <div className="relative flex h-[170px] items-end justify-center gap-2">
      {a?.thumbnail_url && (
        <div className="relative z-10 h-[105px] w-[130px] overflow-hidden rounded-lg border border-line shadow-lg">
          <Image src={a.thumbnail_url} alt={a.title} fill sizes="130px" className="object-cover" />
        </div>
      )}
      {b?.thumbnail_url && (
        <div className="relative z-20 h-[130px] w-[100px] overflow-hidden rounded-lg border border-line shadow-lg">
          <Image src={b.thumbnail_url} alt={b.title} fill sizes="100px" className="object-cover" />
        </div>
      )}
      {c?.thumbnail_url && (
        <div className="relative z-10 hidden h-[90px] w-[60px] overflow-hidden rounded-lg border border-line shadow-lg sm:block">
          <Image src={c.thumbnail_url} alt={c.title} fill sizes="60px" className="object-cover" />
        </div>
      )}
    </div>
  );
}
