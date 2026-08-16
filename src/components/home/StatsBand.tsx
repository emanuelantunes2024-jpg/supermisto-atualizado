const stats = [
  { icon: "🧑‍💼", value: "+2.000", label: "Emprendedores activos" },
  { icon: "🎨", value: null, label: "Plantillas disponibles" },
  { icon: "🌍", value: "15", label: "Países en Europa" },
  { icon: "💬", value: "4.9/5", label: "Satisfacción de clientes" },
];

export function StatsBand({ templateCount }: { templateCount: number }) {
  return (
    <section className="pb-20 pt-0">
      <div className="container-shell">
        <div
          className="anim-in grid grid-cols-2 gap-5 rounded-[20px] border border-line px-7 py-9 lg:grid-cols-4"
          style={{ background: "linear-gradient(120deg,var(--navy-800),var(--navy-700))", animationDelay: ".35s" }}
        >
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className={`text-center ${index < stats.length - 1 ? "lg:border-r lg:border-line" : ""}`}
            >
              <div className="mb-2.5 text-[26px]">{stat.icon}</div>
              <div className="font-display text-3xl font-extrabold text-gold-400">
                {stat.value ?? templateCount}
              </div>
              <div className="mt-1 text-[12.5px] text-ink-muted">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
