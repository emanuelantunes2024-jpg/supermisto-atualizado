import type { Metadata } from "next";
import Link from "next/link";

import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "¿Dudas sobre una plantilla o sobre tu compra? Escríbenos y te respondemos en menos de 24 horas laborables.",
  alternates: { canonical: "/contacto" },
};

const faqs = [
  {
    question: "¿Necesito saber programar?",
    answer:
      "No. Las plantillas son archivos HTML/CSS/JS que se editan con cualquier editor de texto. Incluyen una guía paso a paso para cambiar textos, fotos, colores y logo.",
  },
  {
    question: "¿El pago es único o hay mensualidad?",
    answer:
      "Pago único. Compras la plantilla una vez y es tuya para siempre, sin cuotas ni renovaciones.",
  },
  {
    question: "¿Puedo usar la plantilla para un cliente?",
    answer:
      "Sí. La licencia cubre un proyecto o dominio, tuyo o de un cliente. Para varios proyectos necesitas una licencia por cada uno.",
  },
  {
    question: "¿Cuánto tarda la entrega?",
    answer:
      "Es inmediata. En cuanto se confirma el pago recibes el enlace de descarga por email y aparece en tu área de cliente.",
  },
  {
    question: "¿Dónde publico mi sitio?",
    answer:
      "En cualquier hosting que acepte archivos estáticos: Vercel, Netlify, Hostinger, cPanel… Te explicamos cómo hacerlo en la guía incluida.",
  },
];

export default function ContactPage() {
  return (
    <>
      <div className="container-shell breadcrumb">
        <Link href="/">Inicio</Link>
        <span>/</span>
        <span>Contacto</span>
      </div>

      <section className="pb-20 pt-8">
        <div className="container-shell">
          <div className="section-head">
            <div className="eyebrow">Contacto</div>
            <h2>¿Hablamos?</h2>
            <p>
              Resolvemos dudas antes de comprar y damos soporte después. Respondemos en menos de 24 horas
              laborables.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
            <div className="space-y-4">
              <a
                href={`mailto:${siteConfig.supportEmail}`}
                className="surface flex items-center gap-4 p-5 transition-colors hover:border-gold-500"
              >
                <span
                  className="flex h-11 w-11 items-center justify-center rounded-[10px] text-xl"
                  style={{ background: "rgba(231,166,60,0.12)" }}
                >
                  ✉️
                </span>
                <span>
                  <span className="block text-[15px] font-semibold">Email</span>
                  <span className="block text-[13px] text-ink-muted">{siteConfig.supportEmail}</span>
                </span>
              </a>

              <div className="surface flex items-center gap-4 p-5">
                <span
                  className="flex h-11 w-11 items-center justify-center rounded-[10px] text-xl"
                  style={{ background: "rgba(231,166,60,0.12)" }}
                >
                  ⏱️
                </span>
                <span>
                  <span className="block text-[15px] font-semibold">Horario de soporte</span>
                  <span className="block text-[13px] text-ink-muted">Lunes a viernes, 9:00 – 18:00 (CET)</span>
                </span>
              </div>

              <div className="surface flex items-center gap-4 p-5">
                <span
                  className="flex h-11 w-11 items-center justify-center rounded-[10px] text-xl"
                  style={{ background: "rgba(231,166,60,0.12)" }}
                >
                  🧾
                </span>
                <span>
                  <span className="block text-[15px] font-semibold">¿Problema con una compra?</span>
                  <span className="block text-[13px] text-ink-muted">
                    Indícanos el número de pedido que aparece en{" "}
                    <Link href="/mi-cuenta" className="text-gold-400 hover:underline">
                      Mis compras
                    </Link>
                    .
                  </span>
                </span>
              </div>
            </div>

            <div className="panel">
              <h3 className="mb-5 text-lg">Preguntas frecuentes</h3>
              <div className="space-y-3">
                {faqs.map((faq) => (
                  <details key={faq.question} className="group rounded-lg border border-line bg-navy-900 p-4">
                    <summary className="cursor-pointer list-none text-[14px] font-medium marker:hidden">
                      <span className="flex items-center justify-between gap-3">
                        {faq.question}
                        <span className="text-gold-400 transition-transform group-open:rotate-45">+</span>
                      </span>
                    </summary>
                    <p className="mt-2.5 text-[13.5px] leading-relaxed text-ink-muted">{faq.answer}</p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
