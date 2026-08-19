interface FeatureChipsProps {
  categoryCount: number;
}

export function FeatureChips({ categoryCount }: FeatureChipsProps) {
  const chips = [
    { icon: "🏪", label: `${categoryCount}+ Categorías Premium` },
    { icon: "🖥️", label: "PDVs Completos" },
    { icon: "🛒", label: "Sitio Premium" },
    { icon: "👥", label: "Planes y Combos" },
    { icon: "✅", label: "Sistema Seguro" },
    { icon: "🎧", label: "Soporte Especializado" },
  ];

  return (
    <section className="pb-10 pt-2">
      <div className="container-shell">
        <div className="anim-in grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {chips.map((chip) => (
            <div
              key={chip.label}
              className="flex flex-col items-center gap-2 rounded-[14px] border border-line px-4 py-5 text-center"
              style={{ background: "linear-gradient(150deg,var(--navy-900),var(--navy-800))" }}
            >
              <span className="text-[26px]" aria-hidden>
                {chip.icon}
              </span>
              <span className="text-[12.5px] font-semibold leading-tight">{chip.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
