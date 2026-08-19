const benefits: { title: string; note: string; icon: React.ReactNode }[] = [
  {
    title: "Entrega inmediata",
    note: "Recibe al instante",
    icon: (
      <>
        <path d="M2.5 7h10v9h-10z" />
        <path d="M12.5 10.5h4l3 3V16h-7z" />
        <circle cx="6.5" cy="18" r="1.8" />
        <circle cx="16.5" cy="18" r="1.8" />
      </>
    ),
  },
  {
    title: "Pago 100% seguro",
    note: "Protegido y confiable",
    icon: (
      <>
        <rect x="4" y="10" width="16" height="11" rx="2.5" />
        <path d="M8 10V7a4 4 0 0 1 8 0v3" />
        <circle cx="12" cy="15.5" r="1.2" />
      </>
    ),
  },
  {
    title: "Actualizaciones gratuitas",
    note: "Mejora continua",
    icon: (
      <>
        <path d="M20 12a8 8 0 0 1-13.7 5.6M4 12a8 8 0 0 1 13.7-5.6" />
        <path d="M4 20v-4h4M20 4v4h-4" />
      </>
    ),
  },
  {
    title: "Soporte especializado",
    note: "Estamos para ayudarte",
    icon: (
      <>
        <path d="M4 14v-2a8 8 0 0 1 16 0v2" />
        <rect x="2.5" y="13" width="4" height="6" rx="1.6" />
        <rect x="17.5" y="13" width="4" height="6" rx="1.6" />
        <path d="M19.5 19v.5a2.5 2.5 0 0 1-2.5 2.5h-2" />
      </>
    ),
  },
  {
    title: "Garantía de satisfacción",
    note: "Tu éxito es nuestra prioridad",
    icon: (
      <>
        <path d="M12 3l7.5 3v6c0 4.4-3.1 8.2-7.5 9.3C7.6 20.2 4.5 16.4 4.5 12V6z" />
        <path d="M8.8 12.2l2.2 2.2 4.2-4.4" />
      </>
    ),
  },
];

export function BenefitsStrip() {
  return (
    <section className="py-4">
      <div className="container-shell">
        <div
          className="anim-in grid grid-cols-2 gap-x-4 gap-y-6 rounded-[14px] border border-line px-7 py-5 md:grid-cols-3 lg:grid-cols-5"
          style={{ background: "linear-gradient(120deg,var(--navy-900),var(--navy-800))" }}
        >
          {benefits.map((item, index) => (
            <div
              key={item.title}
              className={`flex items-center gap-3 ${
                index < benefits.length - 1 ? "lg:border-r lg:border-line" : ""
              }`}
            >
              <svg
                width="26"
                height="26"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="shrink-0 text-ink"
                aria-hidden
              >
                {item.icon}
              </svg>
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
