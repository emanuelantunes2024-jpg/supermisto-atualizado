import Link from "next/link";

import { getSiteSettings } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function SoportePage() {
  const settings = await getSiteSettings();

  return (
    <div className="space-y-6">
      <h2 className="text-xl">Soporte</h2>
      <p className="max-w-lg text-[14px] text-ink-muted">
        Cada plantilla incluye 30 días de soporte técnico para ayudarte a publicarla. Escríbenos indicando el
        número de pedido (lo encuentras en &quot;Mis compras&quot;).
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="surface p-5">
          <h3 className="mb-1 text-[14px] font-semibold">Email</h3>
          <a href={`mailto:${settings.email}`} className="text-gold-500 hover:underline">
            {settings.email}
          </a>
        </div>
        {settings.whatsapp && (
          <div className="surface p-5">
            <h3 className="mb-1 text-[14px] font-semibold">WhatsApp</h3>
            <a
              href={`https://wa.me/${settings.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold-500 hover:underline"
            >
              Escribir por WhatsApp
            </a>
          </div>
        )}
      </div>

      <Link href="/contacto" className="btn btn-ghost">
        Ver preguntas frecuentes
      </Link>
    </div>
  );
}
