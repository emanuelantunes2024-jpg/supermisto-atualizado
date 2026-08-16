"use client";

import { useState } from "react";

interface PreviewFrameProps {
  src: string | null;
  title: string;
}

/** Vista previa en vivo de la demo, con conmutador escritorio / móvil. */
export function PreviewFrame({ src, title }: PreviewFrameProps) {
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");

  return (
    <div className="surface overflow-hidden">
      <div className="flex items-center justify-between border-b border-line px-4 py-3">
        <span className="text-[12.5px] text-ink-muted">Vista previa en vivo</span>

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

      {src ? (
        <div className="flex justify-center bg-navy-950 p-3">
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
      ) : (
        <div className="flex h-[420px] flex-col items-center justify-center gap-3 bg-navy-950 px-6 text-center">
          <span className="text-4xl" aria-hidden>
            🖼️
          </span>
          <p className="max-w-sm text-sm text-ink-muted">
            La demo en vivo de esta plantilla estará disponible en breve. Escríbenos y te enviamos capturas
            completas del diseño.
          </p>
        </div>
      )}
    </div>
  );
}
