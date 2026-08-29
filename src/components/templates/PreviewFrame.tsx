"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface PreviewFrameProps {
  src: string | null;
  title: string;
  /** Slug de la plantilla: abre la demo a pantalla completa. */
  slug: string;
  /** Maqueta del diseño: se muestra cuando la plantilla aún no tiene demo en vivo. */
  thumbnail?: string | null;
}

/** Vista previa de la plantilla, con conmutador escritorio / móvil. */
export function PreviewFrame({ src, title, slug, thumbnail }: PreviewFrameProps) {
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");

  return (
    <div className="surface overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-3">
        <span className="text-[12.5px] text-ink-muted">
          {src ? "Vista previa en vivo" : "Vista del diseño"}
        </span>

        {src && (
          <div className="flex items-center gap-3">
            <Link
              href={`/plantillas/${slug}/demo`}
              className="flex items-center gap-1.5 rounded-md border border-gold-500 px-3 py-1.5 text-[12px] font-bold uppercase tracking-[0.04em] text-gold-400 transition-colors hover:bg-gold-500 hover:text-[#1a1200]"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 9V4h5M20 15v5h-5M20 9V4h-5M4 15v5h5" />
              </svg>
              Ver demo completa
            </Link>

            <div className="flex gap-1">
            {(["desktop", "mobile"] as const).map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setDevice(value)}
                aria-pressed={device === value}
                aria-label={value === "desktop" ? "Vista escritorio" : "Vista móvil"}
                className={`rounded-md px-2.5 py-1 text-sm transition-colors ${
                  device === value ? "bg-navy-700 text-gold-400" : "text-ink-muted hover:text-ink"
                }`}
              >
                {value === "desktop" ? "🖥" : "📱"}
              </button>
            ))}
            </div>
          </div>
        )}
      </div>

      {src ? (
        <div className="on-dark flex justify-center bg-navy-950 p-3">
          <iframe
            src={src}
            title={`Demo de ${title}`}
            loading="lazy"
            sandbox="allow-scripts allow-same-origin"
            className={`h-[520px] rounded-lg border border-line bg-white transition-all duration-300 ${
              device === "desktop" ? "w-full" : "w-[380px] max-w-full"
            }`}
          />
        </div>
      ) : thumbnail ? (
        <div className="on-dark bg-navy-950 p-3">
          <div className="relative aspect-[1600/720] w-full overflow-hidden rounded-lg border border-line">
            <Image
              src={thumbnail}
              alt={`Diseño de ${title}`}
              fill
              sizes="(max-width:1024px) 100vw, 760px"
              priority
              className="object-cover"
            />
          </div>
          <p className="px-1 pb-1 pt-3 text-[12.5px] text-ink-muted">
            Demo navegable disponible en breve. Escríbenos y te enviamos el recorrido completo del diseño.
          </p>
        </div>
      ) : (
        <div className="on-dark flex h-[420px] flex-col items-center justify-center gap-3 bg-navy-950 px-6 text-center">
          <span className="text-4xl" aria-hidden>
            🖼️
          </span>
          <p className="max-w-sm text-sm text-ink-muted">
            La vista previa de esta plantilla estará disponible en breve.
          </p>
        </div>
      )}
    </div>
  );
}
