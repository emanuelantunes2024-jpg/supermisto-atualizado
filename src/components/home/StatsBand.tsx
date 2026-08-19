interface StatsBandProps {
  templateCount: number;
  categoryCount: number;
}

/**
 * Banda de cifras. Solo datos verificables del propio catálogo: no se
 * inventan clientes ni entregas, porque son afirmaciones al visitante.
 */
export function StatsBand({ templateCount, categoryCount }: StatsBandProps) {
  const stats = [
    { value: `+${categoryCount}`, label: "Categorías\npremium" },
    { value: `${templateCount}`, label: "Sitios web\ndisponibles" },
    { value: "100%", label: "Personalizables\ny editables" },
    { value: "24 h", label: "Respuesta\nde soporte" },
  ];

  return (
    <section className="py-10">
      <div className="container-shell">
        <div
          className="anim-in grid gap-8 rounded-[18px] border border-line px-8 py-9 lg:grid-cols-[1.15fr_2.6fr] lg:items-center"
          style={{ background: "linear-gradient(120deg,var(--navy-800),var(--navy-700))" }}
        >
          <div className="flex items-start gap-4">
            <span
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl text-[26px]"
              style={{ background: "rgba(240,167,48,0.14)" }}
              aria-hidden
            >
              👑
            </span>
            <div>
              <h3 className="mb-1.5 text-[17px] uppercase leading-tight">
                Soluciones digitales
                <br />
                premium para tu negocio
              </h3>
              <p className="text-[12.5px] text-ink-muted">
                Diseños profesionales listos para publicar y vender el mismo día.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className={`text-center ${index < stats.length - 1 ? "lg:border-r lg:border-line" : ""}`}
              >
                <div className="font-display text-[34px] font-extrabold leading-none text-gold-400">
                  {stat.value}
                </div>
                <div className="mt-2 whitespace-pre-line text-[11.5px] uppercase leading-tight tracking-[0.04em] text-ink-muted">
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
