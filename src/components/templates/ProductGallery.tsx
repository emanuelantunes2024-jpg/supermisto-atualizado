import Image from "next/image";

import type { ProductImage, ProductImageKind } from "@/lib/types";

const DEVICE_LABELS: Record<Exclude<ProductImageKind, "gallery" | "main">, string> = {
  desktop: "Escritorio",
  laptop: "Portátil",
  tablet: "Tablet",
  mobile: "Móvil",
};

const DEVICE_ORDER: (keyof typeof DEVICE_LABELS)[] = ["desktop", "laptop", "tablet", "mobile"];

interface ProductGalleryProps {
  images: ProductImage[];
  title: string;
}

/**
 * Capturas de pantalla del diseño: una por dispositivo (si se subieron) más
 * la galería de fotos adicionales. No se muestra nada si el producto no
 * tiene ninguna de estas imágenes, así que es 100% compatible con las
 * plantillas que solo tienen imagen principal / miniatura.
 */
export function ProductGallery({ images, title }: ProductGalleryProps) {
  const deviceShots = DEVICE_ORDER.map((kind) => ({
    kind: kind as string,
    label: DEVICE_LABELS[kind],
    url: images.find((img) => img.kind === kind)?.url,
  })).filter((shot): shot is { kind: string; label: string; url: string } => Boolean(shot.url));

  const gallery = images.filter((img) => img.kind === "gallery").sort((a, b) => a.sort_order - b.sort_order);

  if (deviceShots.length === 0 && gallery.length === 0) return null;

  return (
    <div className="panel mt-6">
      <h2 className="mb-3 text-lg">Capturas de pantalla</h2>
      {deviceShots.length > 0 && (
        <div className={`grid gap-3 ${deviceShots.length > 1 ? "sm:grid-cols-2" : ""}`}>
          {deviceShots.map((shot) => (
            <a
              key={shot.kind}
              href={shot.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block overflow-hidden rounded-lg border border-line"
            >
              <div className="relative aspect-video w-full bg-navy-950">
                <Image
                  src={shot.url}
                  alt={`${title} — vista ${shot.label.toLowerCase()}`}
                  fill
                  sizes="(max-width:1024px) 100vw, 50vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />
              </div>
              <span className="block bg-navy-900 px-3 py-1.5 text-[11.5px] font-semibold text-ink-muted">
                {shot.label}
              </span>
            </a>
          ))}
        </div>
      )}

      {gallery.length > 0 && (
        <div className={deviceShots.length > 0 ? "mt-4" : undefined}>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {gallery.map((img) => (
              <a
                key={img.id}
                href={img.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group block overflow-hidden rounded-lg border border-line"
              >
                <div className="relative aspect-[4/3] w-full bg-navy-950">
                  <Image
                    src={img.url}
                    alt={`${title} — foto adicional`}
                    fill
                    sizes="(max-width:1024px) 50vw, 250px"
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.05]"
                  />
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
