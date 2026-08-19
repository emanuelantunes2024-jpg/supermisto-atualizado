const benefits = [
  { icon: "🚚", title: "Entrega inmediata", note: "Recibe al instante" },
  { icon: "🔒", title: "Pago 100% seguro", note: "Protegido con Stripe" },
  { icon: "🔄", title: "Actualizaciones gratis", note: "Mejora continua" },
  { icon: "🎧", title: "Soporte experto", note: "Estamos para ayudarte" },
  { icon: "🛡️", title: "Garantía de satisfacción", note: "Tu éxito es lo primero" },
];

export function BenefitsStrip() {
  return (
    <section className="py-4">
      <div className="container-shell">
        <div
          className="anim-in grid grid-cols-2 gap-x-4 gap-y-6 rounded-[16px] border border-line px-6 py-6 md:grid-cols-3 lg:grid-cols-5"
          style={{ background: "linear-gradient(120deg,var(--navy-900),var(--navy-800))" }}
        >
          {benefits.map((item, index) => (
            <div
              key={item.title}
              className={`flex items-center gap-3 ${
                index < benefits.length - 1 ? "lg:border-r lg:border-line" : ""
              }`}
            >
              <span className="text-[22px]" aria-hidden>
                {item.icon}
              </span>
              <span>
                <span className="block text-[13px] font-semibold leading-tight">{item.title}</span>
                <span className="block text-[11.5px] text-ink-muted">{item.note}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
