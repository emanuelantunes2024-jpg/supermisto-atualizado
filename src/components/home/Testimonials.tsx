const testimonials = [
  {
    quote:
      "Compré la plantilla de barbería un domingo por la tarde y el lunes ya estaba reservando citas. Increíblemente fácil de personalizar.",
    avatar: "💈",
    name: "Rui Martins",
    role: "Barbería Lisboa, Portugal",
  },
  {
    quote:
      "Probé con otras plataformas antes y siempre terminaba complicado. Con Leuname en un día tenía mi cafetería online funcionando.",
    avatar: "☕",
    name: "Elena Fischer",
    role: "Cafetería Berlín, Alemania",
  },
  {
    quote:
      "El soporte respondió mis dudas en minutos. La plantilla se ve profesional y mis clientes lo notaron enseguida.",
    avatar: "🧴",
    name: "Marta Ruiz",
    role: "Servicios de limpieza, Madrid",
  },
];

export function Testimonials() {
  return (
    <section id="testimonios" className="py-20">
      <div className="container-shell">
        <div className="section-head section-head-center">
          <div className="eyebrow">Testimonios</div>
          <h2>Emprendedores que ya publicaron su sitio</h2>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {testimonials.map((item) => (
            <figure
              key={item.name}
              className="surface p-6 transition-all duration-200 hover:-translate-y-[3px] hover:border-gold-500"
            >
              <div className="mb-3.5 tracking-[2px] text-[13px] text-gold-400">★★★★★</div>
              <blockquote className="mb-5 text-sm leading-[1.65] text-ink">“{item.quote}”</blockquote>
              <figcaption className="flex items-center gap-3">
                <span
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg"
                  style={{ background: "rgba(240,167,48,0.14)" }}
                >
                  {item.avatar}
                </span>
                <span>
                  <span className="block text-[13.5px] font-semibold">{item.name}</span>
                  <span className="block text-[11.5px] text-ink-muted">{item.role}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
