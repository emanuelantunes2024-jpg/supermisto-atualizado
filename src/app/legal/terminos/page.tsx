import type { Metadata } from "next";
import Link from "next/link";

import { LegalPage, LegalSection } from "@/components/legal/LegalPage";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "Términos y condiciones",
  description:
    "Condiciones de uso y de compra de las plantillas web de Leuname Software: licencia, pagos, entrega y garantías.",
  alternates: { canonical: "/legal/terminos" },
};

export default function TermsPage() {
  return (
    <LegalPage title="Términos y condiciones" updatedAt="16 de agosto de 2026">
      <LegalSection title="1. Objeto y titularidad">
        <p>
          Estas condiciones regulan el acceso y uso de {siteConfig.name} (en adelante, «la Plataforma») y la
          compra de plantillas de sitios web (en adelante, «los Productos»). El uso de la Plataforma implica la
          aceptación de estas condiciones.
        </p>
        <p className="on-dark rounded-lg border border-line bg-navy-900 px-4 py-3 text-[13px]">
          <strong className="text-ink">Titular:</strong> Emanuel Da Silva Antunes Coletto, persona física
          residente en Brasil, CPF 096.463.317-50. <strong className="text-ink">Domicilio:</strong> Estrada de
          Xerem, 484, Casa — Duque de Caxias, RJ, 25241390, Brasil. <strong className="text-ink">Contacto:
          </strong> {siteConfig.supportEmail}.
        </p>
      </LegalSection>

      <LegalSection title="2. Productos y licencia de uso">
        <p>
          Los Productos son archivos digitales (HTML, CSS, JavaScript y recursos asociados). Con la compra
          adquieres una <strong className="text-ink">licencia de uso permanente, no exclusiva e
          intransferible</strong> para publicar la plantilla en <strong className="text-ink">un (1) proyecto o
          dominio</strong> propio o de un cliente tuyo.
        </p>
        <p>Salvo autorización expresa por escrito, no está permitido:</p>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>Revender, redistribuir o ceder la plantilla, ni siquiera modificada.</li>
          <li>Incluirla en otro producto destinado a la venta o distribución.</li>
          <li>Publicarla en repositorios, marketplaces o servicios de descarga de terceros.</li>
        </ul>
        <p>
          Si necesitas usar una misma plantilla en varios proyectos, escríbenos para adquirir licencias
          adicionales.
        </p>
      </LegalSection>

      <LegalSection title="3. Precios, impuestos y pago">
        <p>
          Los precios se muestran en euros (€) con los impuestos incluidos. El IVA aplicable se calcula según tu
          país de residencia en el momento del pago, conforme a la normativa de la Unión Europea sobre servicios
          digitales.
        </p>
        <p>
          Los pagos se procesan a través de Stripe. No almacenamos ni tenemos acceso a los datos de tu tarjeta.
        </p>
      </LegalSection>

      <LegalSection title="4. Entrega">
        <p>
          La entrega es digital e inmediata. Una vez confirmado el pago recibirás por email un enlace de descarga
          y podrás acceder al archivo desde tu área de cliente, en «Mis compras», de forma permanente mientras la
          Plataforma esté operativa.
        </p>
        <p>
          Si no recibes el email en unos minutos, revisa la carpeta de spam y contáctanos: reenviaremos el enlace
          sin coste.
        </p>
      </LegalSection>

      <LegalSection title="5. Derecho de desistimiento">
        <p>
          Al tratarse de contenido digital suministrado de forma inmediata, al completar la compra solicitas
          expresamente el inicio de la ejecución del contrato y reconoces que{" "}
          <strong className="text-ink">pierdes el derecho de desistimiento</strong> una vez descargado el archivo
          (art. 103.m del Real Decreto Legislativo 1/2007 y Directiva 2011/83/UE).
        </p>
        <p>
          Consulta los supuestos en los que sí devolvemos el importe en nuestra{" "}
          <Link href="/legal/reembolsos" className="text-gold-400 hover:underline">
            política de reembolso
          </Link>
          .
        </p>
      </LegalSection>

      <LegalSection title="6. Soporte técnico">
        <p>
          Cada compra incluye 30 días de soporte técnico por email para dudas de instalación y personalización
          básica. El soporte no cubre desarrollo a medida, integraciones con sistemas de terceros ni la
          configuración de tu hosting o dominio.
        </p>
      </LegalSection>

      <LegalSection title="7. Responsabilidad">
        <p>
          Los Productos se entregan «tal cual». No garantizamos que una plantilla cubra requisitos específicos no
          descritos en su ficha, ni resultados comerciales derivados de su uso. Nuestra responsabilidad se limita,
          en todo caso, al importe pagado por el Producto.
        </p>
        <p>
          Eres responsable del contenido que publiques con la plantilla y de cumplir la normativa aplicable a tu
          negocio (protección de datos, cookies, información al consumidor).
        </p>
      </LegalSection>

      <LegalSection title="8. Legislación aplicable">
        <p>
          Estas condiciones se rigen por la legislación española y europea aplicable. Para consumidores, la
          jurisdicción competente es la de su lugar de residencia. También puedes acudir a la plataforma europea
          de resolución de litigios en línea:{" "}
          <a
            href="https://ec.europa.eu/consumers/odr"
            target="_blank"
            rel="noreferrer"
            className="text-gold-400 hover:underline"
          >
            ec.europa.eu/consumers/odr
          </a>
          .
        </p>
      </LegalSection>
    </LegalPage>
  );
}
