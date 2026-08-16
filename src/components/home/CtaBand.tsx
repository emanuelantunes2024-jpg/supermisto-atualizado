import Link from "next/link";

import { formatPriceShort } from "@/lib/format";

interface CtaBandProps {
  templateCount: number;
  fromPriceCents: number;
}

export function CtaBand({ templateCount, fromPriceCents }: CtaBandProps) {
  return (
    <section id="precios" className="py-20">
      <div className="container-shell">
        <div
          className="flex flex-wrap items-center justify-between gap-7 rounded-[20px] border border-line px-8 py-10 sm:px-12 sm:py-[52px]"
          style={{ background: "linear-gradient(120deg,var(--navy-800),var(--navy-700))" }}
        >
          <div>
            <h3 className="mb-2 max-w-[420px] text-[26px]">¿Listo para tener tu sitio web profesional?</h3>
            <p className="text-[14.5px] text-ink-muted">
              {templateCount} plantillas para todo tipo de negocio, desde {formatPriceShort(fromPriceCents)} en pago
              único.
            </p>
          </div>
          <Link href="/plantillas" className="btn btn-gold btn-lg">
            Ver todas las plantillas
          </Link>
        </div>
      </div>
    </section>
  );
}
