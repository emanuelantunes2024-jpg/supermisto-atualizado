const steps = [
  { title: "Elige tu plantilla", text: "Filtra por rubro y encuentra el diseño perfecto para tu negocio." },
  { title: "Compra online", text: "Pago seguro con tarjeta, Apple Pay o Google Pay. Acceso inmediato." },
  { title: "Personaliza", text: "Cambia textos, fotos, colores y logo. Los archivos son 100% tuyos." },
  { title: "Publica", text: "Sube los archivos a tu hosting, conecta tu dominio y listo." },
];

export function HowItWorks() {
  return (
    <section id="como-funciona" className="py-20">
      <div className="container-shell">
        <div className="section-head section-head-center">
          <div className="eyebrow">Cómo funciona</div>
          <h2>De la idea a tu sitio publicado en 4 pasos</h2>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <div key={step.title} className="surface px-5 pb-5 pt-[26px]">
              <div className="mb-4 flex h-7 w-7 items-center justify-center rounded-full bg-gold-500 font-display text-[13px] font-extrabold text-navy-950">
                {index + 1}
              </div>
              <h4 className="mb-1.5 text-[15px]">{step.title}</h4>
              <p className="text-[12.5px] text-ink-muted">{step.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
