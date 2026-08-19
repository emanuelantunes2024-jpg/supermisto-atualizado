import { siteStats } from "@/lib/config";

/**
 * Banda "Líderes en soluciones digitales premium".
 * Las cifras se editan en `siteStats` (src/lib/config.ts); las que están
 * vacías no se muestran, para no publicar números que aún no son reales.
 */
export function StatsBand() {
  const stats = siteStats.filter((stat) => stat.value);
  if (stats.length === 0) return null;

  return (
    <section className="pb-16">
      <div className="container-shell">
        <div
          className="anim-in grid gap-8 rounded-[16px] border border-line px-8 py-8 lg:grid-cols-[1.1fr_2.4fr] lg:items-center"
          style={{ background: "linear-gradient(120deg,var(--navy-900),var(--navy-800))" }}
        >
          <div className="flex items-start gap-4">
            <span
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-gold-500/40 text-[24px]"
              style={{ background: "rgba(240,167,48,0.12)" }}
              aria-hidden
            >
              👑
            </span>
            <div>
              <h3 className="mb-1.5 text-[15px] uppercase leading-tight">
                Líderes en soluciones
                <br />
                digitales premium
              </h3>
              <p className="text-[12px] text-ink-muted">
                Diseños profesionales listos para publicar y vender el mismo día.
              </p>
            </div>
          </div>

          <div className={`grid gap-6 ${stats.length >= 4 ? "grid-cols-2 lg:grid-cols-4" : "grid-cols-2"}`}>
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className={`text-center ${index < stats.length - 1 ? "lg:border-r lg:border-line" : ""}`}
              >
                <div className="font-display text-[32px] font-extrabold leading-none text-gold-400">
                  {stat.value}
                </div>
                <div className="mt-2 whitespace-pre-line text-[11px] uppercase leading-tight tracking-[0.05em] text-ink-muted">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
