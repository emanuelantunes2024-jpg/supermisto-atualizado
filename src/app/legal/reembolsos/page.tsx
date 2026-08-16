import type { Metadata } from "next";
import Link from "next/link";

import { LegalPage, LegalSection } from "@/components/legal/LegalPage";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "Política de reembolso",
  description:
    "Cuándo puedes solicitar la devolución de una plantilla de Leuname Software y cómo funciona el plazo de 14 días de la UE para contenido digital.",
  alternates: { canonical: "/legal/reembolsos" },
};

export default function RefundPage() {
  return (
    <LegalPage title="Política de reembolso" updatedAt="16 de agosto de 2026">
      <LegalSection title="Resumen">
        <p>
          Vendemos contenido digital de descarga inmediata. La normativa europea reconoce un plazo de desistimiento
          de <strong className="text-ink">14 días naturales</strong>, pero ese derecho{" "}
          <strong className="text-ink">se pierde en cuanto descargas el archivo</strong>, porque solicitas
          expresamente la ejecución inmediata del contrato al completar la compra.
        </p>
        <p>Aun así, devolvemos el importe en varios supuestos. Los detallamos abajo.</p>
      </LegalSection>

      <LegalSection title="1. Reembolso completo dentro de los 14 días">
        <p>Te devolvemos el 100% del importe si:</p>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>
            <strong className="text-ink">Aún no has descargado el archivo.</strong> Si has comprado por error o
            has cambiado de opinión y no has descargado nada, escríbenos dentro de los 14 días y te devolvemos el
            dinero sin preguntas.
          </li>
          <li>
            <strong className="text-ink">La plantilla tiene un defecto técnico</strong> que impide su uso normal y
            no podemos corregirlo en un plazo razonable.
          </li>
          <li>
            <strong className="text-ink">La plantilla no corresponde con lo descrito</strong> en su ficha o en la
            demo pública.
          </li>
          <li>
            <strong className="text-ink">Se te ha cobrado dos veces</strong> o hay un error de facturación.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="2. Casos que no dan lugar a reembolso">
        <ul className="list-disc space-y-1.5 pl-5">
          <li>Haber descargado el archivo y luego cambiar de opinión.</li>
          <li>Falta de conocimientos técnicos para editar la plantilla (para eso está el soporte incluido).</li>
          <li>Incompatibilidad con un servicio de terceros no mencionado en la ficha del producto.</li>
          <li>Solicitudes realizadas más de 14 días después de la compra.</li>
          <li>Querer cambiar a otra plantilla después de descargar la primera (te ofrecemos un descuento).</li>
        </ul>
      </LegalSection>

      <LegalSection title="3. Cómo solicitarlo">
        <p>
          Escribe a{" "}
          <a href={`mailto:${siteConfig.supportEmail}`} className="text-gold-400 hover:underline">
            {siteConfig.supportEmail}
          </a>{" "}
          o desde la{" "}
          <Link href="/contacto" className="text-gold-400 hover:underline">
            página de contacto
          </Link>
          , indicando el número de pedido y el motivo. Respondemos en un máximo de 48 horas laborables.
        </p>
        <p>
          Los reembolsos aprobados se devuelven por el mismo medio de pago en un plazo de{" "}
          <strong className="text-ink">5 a 10 días hábiles</strong>, según tu entidad bancaria.
        </p>
      </LegalSection>

      <LegalSection title="4. Antes de comprar">
        <p>
          Todas las plantillas tienen demo en vivo y descripción detallada de lo que incluyen. Si tienes cualquier
          duda sobre si una plantilla encaja con tu negocio, pregúntanos antes de pagar: preferimos resolver la
          duda a tramitar una devolución.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
