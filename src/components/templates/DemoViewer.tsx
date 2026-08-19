"use client";

import Link from "next/link";
import { useState } from "react";

import { Logo } from "@/components/site/Logo";

interface DemoViewerProps {
  slug: string;
  title: string;
  categoryName?: string;
  priceLabel: string;
  /** Demo navegable. Si es null se muestra el aviso de "demo en preparación". */
  src: string | null;
}

const devices = [
  {
    id: "desktop",
    label: "Escritorio",
    width: "100%",
    icon: (
      <>
        <rect x="2.5" y="4" width="19" height="12.5" rx="2" />
        <path d="M9 20h6M12 16.5V20" />
      </>
    ),
  },
  {
    id: "tablet",
    label: "Tablet",
    width: "834px",
    icon: (
      <>
        <rect x="5" y="2.5" width="14" height="19" rx="2" />
        <path d="M11 18.5h2" />
      </>
    ),
  },
  {
    id: "mobile",
    label: "Móvil",
    width: "390px",
    icon: (
      <>
        <rect x="7" y="2.5" width="10" height="19" rx="2.5" />
        <path d="M11 18.8h2" />
      </>
    ),
  },
] as const;

type DeviceId = (typeof devices)[number]["id"];

/**
 * Demo a pantalla completa: el cliente navega la plantilla como si fuera su
 * propio sitio y compra desde la misma barra, sin perder el recorrido.
 *
 * Se monta como capa fija por encima de la cabecera del sitio para que la
 * demo ocupe toda la pantalla.
 */
export function DemoViewer({ slug, title, categoryName, priceLabel, src }: DemoViewerProps) {
  const [device, setDevice] = useState<DeviceId>("desktop");
  const width = devices.find((item) => item.id === device)!.width;

  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-navy-950">
      {/* Barra de la demo */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-navy-900 px-4 py-2.5">
        <div className="flex min-w-0 items-center gap-3">
          <Link
            href={`/plantillas/${slug}`}
            className="flex shrink-0 items-center gap-1.5 rounded-lg border border-line px-3 py-2 text-[12.5px] font-semibold text-ink transition-colors hover:border-gold-500 hover:text-gold-400"
          >
            <span aria-hidden>←</span>
            Volver
          </Link>

          <span className="hidden shrink-0 border-l border-line pl-3 md:block">
            <Logo />
          </span>

          <span className="min-w-0">
            <span className="block truncate text-[13.5px] font-semibold leading-tight">{title}</span>
            <span className="block truncate text-[11.5px] leading-tight text-ink-muted">
              {categoryName ? `${categoryName} · ` : ""}Demo navegable
            </span>
          </span>
        </div>

        {src && (
          <div className="flex shrink-0 gap-1 rounded-lg border border-line p-1">
            {devices.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setDevice(item.id)}
                aria-pressed={device === item.id}
                aria-label={item.label}
                title={item.label}
                className={`rounded-md px-2.5 py-1.5 transition-colors ${
                  device === item.id ? "bg-navy-700 text-gold-400" : "text-ink-muted hover:text-ink"
                }`}
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                  {item.icon}
                </svg>
              </button>
            ))}
          </div>
        )}

        <div className="flex shrink-0 items-center gap-3">
          {src && (
            <a
              href={src}
              target="_blank"
              rel="noreferrer"
              className="hidden items-center gap-1.5 text-[12.5px] text-ink-muted transition-colors hover:text-gold-400 sm:flex"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M14 4h6v6M20 4l-8.5 8.5" />
                <path d="M19 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5" />
              </svg>
              Abrir en otra pestaña
            </a>
          )}

          <span className="text-right leading-tight">
            <span className="block font-display text-[17px] font-extrabold text-gold-400">{priceLabel}</span>
            <span className="block text-[10.5px] text-ink-muted">pago único</span>
          </span>

          <Link href={`/checkout/${slug}`} className="btn btn-gold whitespace-nowrap">
            Comprar esta plantilla
          </Link>
        </div>
      </div>

      {/* Lienzo de la demo */}
      {src ? (
        <div className="flex flex-1 justify-center overflow-auto bg-navy-950 p-3">
          <iframe
            src={src}
            title={`Demo de ${title}`}
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            className="h-full rounded-lg border border-line bg-white transition-[width] duration-300"
            style={{ width, maxWidth: "100%" }}
          />
        </div>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
          <h2 className="text-[22px]">La demo de esta plantilla está en preparación</h2>
          <p className="max-w-md text-[14px] text-ink-muted">
            Escríbenos y te enviamos el recorrido completo del diseño antes de comprar.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/contacto" className="btn btn-ghost btn-lg">
              Pedir el recorrido
            </Link>
            <Link href={`/plantillas/${slug}`} className="btn btn-gold btn-lg">
              Ver la ficha
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
