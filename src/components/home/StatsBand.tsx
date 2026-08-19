import { siteStats } from "@/lib/config";

/** Cinco estrellas doradas. */
function Stars({ size = 13 }: { size?: number }) {
  return (
    <span className="flex gap-[3px] text-gold-400" aria-hidden>
      {[0, 1, 2, 3, 4].map((i) => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4 6.1 20.5l1.2-6.5L2.5 9.4l6.6-.9z" />
        </svg>
      ))}
    </span>
  );
}

/**
 * Banda "Líderes en soluciones digitales premium".
 * Las cifras se editan en `siteStats` (src/lib/config.ts); las que están
 * vacías no se muestran.
 */
export function StatsBand() {
  const stats = siteStats.filter((stat) => stat.value);
  if (stats.length === 0) return null;

  return (
    <section className="pb-14 pt-4">
      <div className="container-shell">
        <div
          className="anim-in grid gap-8 rounded-[14px] border border-line px-7 py-7 lg:grid-cols-[1fr_2.7fr] lg:items-center"
          style={{ background: "linear-gradient(120deg,var(--navy-900),var(--navy-800))" }}
        >
          <div className="flex items-start gap-4 lg:border-r lg:border-line lg:pr-6">
            <svg
              width="46"
              height="46"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="shrink-0 text-gold-400"
              aria-hidden
            >
              <path d="M12 2.5l8 3.2v6.1c0 4.7-3.3 8.7-8 9.7-4.7-1-8-5-8-9.7V5.7z" />
              <path d="M8 13.5l-.7-4.2 2.4 1.6L12 8l2.3 2.9 2.4-1.6-.7 4.2z" />
            </svg>
            <div>
              <h3 className="mb-1.5 text-[15px] uppercase leading-tight">
                Líderes en soluciones
                <br />
                digitales premium
              </h3>
              <p className="mb-2 text-[12px] leading-snug text-ink-muted">
                Miles de negocios ya confían en nuestras soluciones para crecer y vender más.
              </p>
              <Stars size={15} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-5">
            {stats.map((stat, index) => {
              const isRating = stat.value.includes("/");
              return (
                <div
                  key={stat.label}
                  className={`text-center ${index < stats.length - 1 ? "lg:border-r lg:border-line" : ""}`}
                >
                  <div className="font-display text-[30px] font-extrabold leading-none text-gold-400">
                    {stat.value}
                  </div>
                  {isRating && (
                    <div className="mt-2 flex justify-center">
                      <Stars />
                    </div>
                  )}
                  <div className="mt-2 whitespace-pre-line text-[11px] uppercase leading-tight tracking-[0.05em] text-ink-muted">
                    {stat.label}
                  </div>
                  {isRating && (
                    <div className="mt-1 text-[10.5px] normal-case tracking-normal text-ink-muted/70">
                      Basado en opiniones reales
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
