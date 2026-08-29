import type { Metadata } from "next";

import { LegalPage, LegalSection } from "@/components/legal/LegalPage";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "Política de privacidad",
  description:
    "Cómo trata Leuname Software tus datos personales: finalidades, base legal, encargados y tus derechos según el RGPD.",
  alternates: { canonical: "/legal/privacidad" },
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Política de privacidad" updatedAt="16 de agosto de 2026">
      <LegalSection title="1. Responsable del tratamiento">
        <p>
          {siteConfig.name} es responsable del tratamiento de los datos personales recogidos a través de esta
          web. Puedes contactarnos en{" "}
          <a href={`mailto:${siteConfig.supportEmail}`} className="text-gold-400 hover:underline">
            {siteConfig.supportEmail}
          </a>
          .
        </p>
        <p className="on-dark rounded-lg border border-line bg-navy-900 px-4 py-3 text-[13px]">
          <strong className="text-ink">Responsable:</strong> Emanuel Da Silva Antunes Coletto, persona física
          residente en Brasil, CPF 096.463.317-50. <strong className="text-ink">Domicilio:</strong> Estrada de
          Xerem, 484, Casa — Duque de Caxias, RJ, 25241390, Brasil.
        </p>
      </LegalSection>

      <LegalSection title="2. Qué datos tratamos y con qué finalidad">
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong className="text-ink">Datos de cuenta</strong> (nombre, email): para crear y gestionar tu
            cuenta de cliente y darte acceso a tus descargas. Base legal: ejecución del contrato.
          </li>
          <li>
            <strong className="text-ink">Datos de compra</strong> (nombre, email, país, teléfono opcional,
            historial de pedidos): para tramitar el pago, emitir la factura y cumplir obligaciones fiscales. Base
            legal: ejecución del contrato y obligación legal.
          </li>
          <li>
            <strong className="text-ink">Registro de descargas</strong> (fecha y dirección IP): para dar soporte
            y prevenir el uso fraudulento de los enlaces. Base legal: interés legítimo.
          </li>
          <li>
            <strong className="text-ink">Consultas de contacto</strong>: para responderte. Base legal:
            consentimiento.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="3. Encargados del tratamiento">
        <p>Trabajamos con proveedores que cumplen el RGPD y actúan como encargados:</p>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>
            <strong className="text-ink">Supabase</strong> — base de datos, autenticación y almacenamiento de
            archivos.
          </li>
          <li>
            <strong className="text-ink">Stripe</strong> — procesamiento de pagos. Los datos de tarjeta se
            tratan exclusivamente en su entorno; nosotros no los recibimos.
          </li>
          <li>
            <strong className="text-ink">Resend</strong> — envío de emails transaccionales.
          </li>
          <li>
            <strong className="text-ink">Vercel</strong> — alojamiento de la aplicación.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="4. Conservación">
        <p>
          Conservamos los datos de cuenta mientras la mantengas activa. Los datos de facturación se conservan
          durante los plazos exigidos por la normativa fiscal y contable (por lo general, 6 años). Los registros
          de descarga se conservan 12 meses.
        </p>
      </LegalSection>

      <LegalSection title="5. Tus derechos">
        <p>
          Puedes ejercer los derechos de acceso, rectificación, supresión, oposición, limitación y portabilidad
          escribiendo a{" "}
          <a href={`mailto:${siteConfig.supportEmail}`} className="text-gold-400 hover:underline">
            {siteConfig.supportEmail}
          </a>
          . También puedes presentar una reclamación ante la autoridad de control de tu país (en España, la
          Agencia Española de Protección de Datos).
        </p>
      </LegalSection>

      <LegalSection title="6. Cookies">
        <p>
          Usamos únicamente cookies técnicas necesarias para mantener tu sesión iniciada y completar el proceso de
          compra. No utilizamos cookies publicitarias ni de perfilado, por lo que no se requiere banner de
          consentimiento. Si en el futuro añadimos analítica o publicidad, actualizaremos esta política y
          solicitaremos tu consentimiento previo.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
