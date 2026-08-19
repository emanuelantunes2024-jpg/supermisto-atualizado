const benefits = [
  { icon: "⚡", title: "Entrega inmediata", note: "Descarga al instante" },
  { icon: "🔒", title: "Pago seguro", note: "Protegido con Stripe" },
  { icon: "🖥️", title: "100% responsivo", note: "Se ve bien en cualquier pantalla" },
  { icon: "🎧", title: "Soporte humanizado", note: "Estamos para ayudarte" },
  { icon: "💎", title: "Tecnología de punta", note: "Siempre actualizada" },
];

export function BenefitsStrip() {
  return (
    <section className="py-4">
      <div className="container-shell">
        <div
          className="anim-in flex flex-wrap items-stretch gap-0 overflow-hidden rounded-[16px] border border-line"
          style={{ background: "linear-gradient(120deg,var(--navy-900),var(--navy-800))" }}
        >
          <div className="grid flex-1 grid-cols-2 gap-x-4 gap-y-6 px-6 py-6 md:grid-cols-3 lg:grid-cols-5">
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
          <div
            className="flex items-center justify-center gap-2 px-8 py-6 text-center text-[12.5px] font-bold uppercase tracking-[0.03em] text-[#1a1200]"
            style={{ background: "linear-gradient(135deg,var(--gold-400),var(--gold-600))" }}
          >
            <span aria-hidden>👑</span>
            Tecnología propia
            <br />
            Leuname Software
          </div>
        </div>
      </div>
    </section>
  );
}
