"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";

import { saveTemplate, uploadTemplateDemo, type ActionState } from "@/app/admin/actions";
import { UploadField } from "@/components/admin/UploadField";
import { slugify } from "@/lib/format";
import type { Category, ProductImage, ProductImageKind, Template } from "@/lib/types";

interface TemplateFormProps {
  categories: Category[];
  template?: Template | null;
  images?: ProductImage[];
}

const DEVICE_IMAGE_FIELDS: { kind: Exclude<ProductImageKind, "gallery">; label: string; hint: string; size: string }[] = [
  { kind: "main", label: "Imagen principal", hint: "La que se ve en la tarjeta del catálogo.", size: "1600 × 720 px (horizontal)" },
  { kind: "desktop", label: "Screenshot desktop", hint: "Pantalla completa de escritorio.", size: "1920 × 1080 px" },
  { kind: "laptop", label: "Screenshot notebook", hint: "Vista en portátil (mockup).", size: "1440 × 900 px" },
  { kind: "tablet", label: "Screenshot tablet", hint: "Vista adaptada a tablet.", size: "1024 × 768 px" },
  { kind: "mobile", label: "Screenshot mobile", hint: "Vista adaptada a celular.", size: "390 × 844 px (vertical)" },
];

export function TemplateForm({ categories, template, images = [] }: TemplateFormProps) {
  const [state, formAction] = useActionState<ActionState, FormData>(saveTemplate, {});

  const [title, setTitle] = useState(template?.title ?? "");
  const [slug, setSlug] = useState(template?.slug ?? "");
  const [previewUrl, setPreviewUrl] = useState(template?.preview_url ?? "");
  const [thumbnailUrl, setThumbnailUrl] = useState(template?.thumbnail_url ?? "");
  const [fileUrl, setFileUrl] = useState(template?.file_url ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(template?.slug));

  const imageByKind = new Map(images.map((img) => [img.kind, img.url]));
  const [deviceImages, setDeviceImages] = useState<Record<string, string>>(() =>
    Object.fromEntries(DEVICE_IMAGE_FIELDS.map((f) => [f.kind, imageByKind.get(f.kind) ?? ""])),
  );
  const [galleryUrls, setGalleryUrls] = useState<string[]>(
    images.filter((img) => img.kind === "gallery").map((img) => img.url),
  );

  const effectiveSlug = slugTouched ? slug : slugify(title);

  return (
    <form action={formAction} className="space-y-6">
      {template?.id && <input type="hidden" name="id" value={template.id} />}

      <div className="panel space-y-4">
        <h2 className="text-lg">Información básica</h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="field-label" htmlFor="title">
              Título *
            </label>
            <input
              id="title"
              name="title"
              required
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Barbería Premium"
              className="field-input"
            />
          </div>
          <div>
            <label className="field-label" htmlFor="slug">
              Slug (URL) *
            </label>
            <input
              id="slug"
              name="slug"
              required
              value={effectiveSlug}
              onChange={(event) => {
                setSlugTouched(true);
                setSlug(event.target.value);
              }}
              placeholder="barberia-premium"
              className="field-input"
            />
            <p className="mt-1.5 text-[11.5px] text-ink-muted">/plantillas/{effectiveSlug || "…"}</p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="field-label" htmlFor="category_id">
              Categoría *
            </label>
            <select
              id="category_id"
              name="category_id"
              required
              defaultValue={template?.category_id ?? ""}
              className="field-input"
            >
              <option value="" disabled>
                Selecciona…
              </option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.icon} {category.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="field-label" htmlFor="price">
              Precio (€) *
            </label>
            <input
              id="price"
              name="price"
              type="number"
              step="0.01"
              min="1"
              required
              defaultValue={template ? (template.price_cents / 100).toFixed(2) : "149.00"}
              className="field-input"
            />
          </div>
          <div>
            <label className="field-label" htmlFor="status">
              Estado
            </label>
            <select id="status" name="status" defaultValue={template?.status ?? "draft"} className="field-input">
              <option value="draft">Borrador (no visible)</option>
              <option value="published">Publicada</option>
              <option value="archived">Archivada</option>
            </select>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="field-label" htmlFor="compare_at_price">
              Precio anterior (€)
            </label>
            <input
              id="compare_at_price"
              name="compare_at_price"
              type="number"
              step="0.01"
              min="0"
              defaultValue={template?.compare_at_price_cents ? (template.compare_at_price_cents / 100).toFixed(2) : ""}
              placeholder="Opcional, para mostrar descuento"
              className="field-input"
            />
          </div>
          <div>
            <label className="field-label" htmlFor="tags">
              Tags (separados por coma)
            </label>
            <input
              id="tags"
              name="tags"
              defaultValue={(template?.tags ?? []).join(", ")}
              placeholder="negocios, moderno, oscuro"
              className="field-input"
            />
          </div>
          <div className="flex items-end pb-2.5">
            <label className="flex items-center gap-2 text-[13.5px]">
              <input
                type="checkbox"
                name="featured"
                value="1"
                defaultChecked={template?.featured ?? false}
                className="h-4 w-4 rounded border-line"
              />
              Destacar en la portada
            </label>
          </div>
        </div>

        <div>
          <label className="field-label" htmlFor="short_description">
            Descripción corta *
          </label>
          <input
            id="short_description"
            name="short_description"
            required
            defaultValue={template?.short_description ?? ""}
            placeholder="Diseño moderno con reservas integradas y galería de trabajos."
            className="field-input"
          />
          <p className="mt-1.5 text-[11.5px] text-ink-muted">Es lo que se ve en la tarjeta del catálogo.</p>
        </div>

        <div>
          <label className="field-label" htmlFor="full_description">
            Descripción completa
          </label>
          <textarea
            id="full_description"
            name="full_description"
            rows={5}
            defaultValue={template?.full_description ?? ""}
            placeholder="Explica qué incluye la plantilla, para qué negocio es y qué la hace especial."
            className="field-input resize-y"
          />
        </div>

        <div>
          <label className="field-label" htmlFor="features">
            Características (una por línea)
          </label>
          <textarea
            id="features"
            name="features"
            rows={6}
            defaultValue={(template?.features ?? []).join("\n")}
            placeholder={"Diseño 100% personalizable\nResponsive\nSistema de reservas integrado"}
            className="field-input resize-y"
          />
        </div>
      </div>

      <div className="panel space-y-5">
        <div>
          <h2 className="text-lg">Imágenes del producto</h2>
          <p className="mt-1 text-[12.5px] text-ink-muted">
            Sube la imagen principal y, si quieres, una captura por tipo de dispositivo. Cada una se guarda por
            separado y se puede sustituir en cualquier momento.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {DEVICE_IMAGE_FIELDS.map(({ kind, label, hint, size }) => (
            <div key={kind}>
              <label className="field-label">{label}</label>
              <p className="mb-1.5 text-[11px] text-ink-muted">
                Tamaño recomendado: <span className="font-semibold text-ink">{size}</span>
              </p>
              {deviceImages[kind] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={deviceImages[kind]}
                  alt={label}
                  className="mb-2 h-28 w-full rounded-lg border border-line object-cover"
                />
              ) : (
                <div className="mb-2 flex h-28 w-full items-center justify-center rounded-lg border border-dashed border-line text-[11.5px] text-ink-muted">
                  Sin imagen
                </div>
              )}
              <input type="hidden" name={`image_${kind}`} value={deviceImages[kind] ?? ""} />
              <UploadField
                kind="asset"
                slug={effectiveSlug}
                label={deviceImages[kind] ? "Subir nueva imagen" : "Subir imagen"}
                onUploaded={(url) => setDeviceImages((prev) => ({ ...prev, [kind]: url }))}
              />
              <p className="mt-1.5 text-[11px] text-ink-muted">{hint}</p>
            </div>
          ))}
        </div>

        <div>
          <label className="field-label">Imágenes adicionales (galería)</label>
          <p className="mb-1.5 text-[11px] text-ink-muted">
            Tamaño recomendado: <span className="font-semibold text-ink">1600 × 1000 px</span> (capturas extra del
            sitio, cualquier cantidad)
          </p>
          <input type="hidden" name="gallery_urls" value={galleryUrls.join("\n")} />
          {galleryUrls.length > 0 && (
            <div className="mb-2 flex flex-wrap gap-2">
              {galleryUrls.map((url, index) => (
                // eslint-disable-next-line @next/next/no-img-element
                <div key={url + index} className="relative">
                  <img src={url} alt="" className="h-20 w-28 rounded-lg border border-line object-cover" />
                  <button
                    type="button"
                    onClick={() => setGalleryUrls((prev) => prev.filter((_, i) => i !== index))}
                    className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-navy-900 text-[11px] text-ink ring-1 ring-line"
                    aria-label="Quitar imagen"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
          <UploadField
            kind="asset"
            slug={effectiveSlug}
            label="Añadir imagen a la galería"
            onUploaded={(url) => setGalleryUrls((prev) => [...prev, url])}
          />
        </div>
      </div>

      <div className="panel space-y-4">
        <h2 className="text-lg">Archivos y demo</h2>

        <div>
          <label className="field-label" htmlFor="preview_url">
            URL de la demo en vivo
          </label>
          <input
            id="preview_url"
            name="preview_url"
            value={previewUrl}
            onChange={(event) => setPreviewUrl(event.target.value)}
            placeholder="/demos/barberia/index.html o https://demo.tudominio.com"
            className="field-input"
          />
          <DemoUploadField slug={effectiveSlug} onUploaded={setPreviewUrl} />
          <p className="mt-2 text-[11.5px] text-ink-muted">
            Sube aquí el archivo <code>1-VER-LA-WEB.html</code> que viene dentro del paquete de la plantilla (todo
            en un único archivo, sin partes sueltas) y esta URL se rellena sola. También acepta un .zip con
            index.html + css + js + img si lo prefieres.
          </p>
        </div>

        <div>
          <label className="field-label" htmlFor="thumbnail_url">
            Miniatura (URL pública) — respaldo si no subes imagen principal
          </label>
          <p className="mb-1.5 text-[11px] text-ink-muted">
            Mismo tamaño que la imagen principal: <span className="font-semibold text-ink">1600 × 720 px</span>
          </p>
          <input
            id="thumbnail_url"
            name="thumbnail_url"
            value={thumbnailUrl}
            onChange={(event) => setThumbnailUrl(event.target.value)}
            placeholder="https://…/thumbnail.jpg"
            className="field-input"
          />
          <UploadField kind="asset" slug={effectiveSlug} label="Subir imagen" onUploaded={setThumbnailUrl} />
        </div>

        <div>
          <label className="field-label" htmlFor="file_url">
            Archivo de la plantilla (.zip) — ruta en el bucket privado
          </label>
          <input
            id="file_url"
            name="file_url"
            value={fileUrl}
            onChange={(event) => setFileUrl(event.target.value)}
            placeholder="barberia-premium/1730000000.zip"
            className="field-input"
          />
          <UploadField kind="file" slug={effectiveSlug} label="Subir .zip" onUploaded={setFileUrl} />
          <p className="mt-2 text-[11.5px] text-ink-muted">
            El .zip vive en un bucket privado. Solo se entrega mediante un enlace firmado temporal, y únicamente
            si el pedido está pagado.
          </p>
        </div>
      </div>

      {state.error && (
        <p className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-[13px] text-red-300">
          {state.error}
        </p>
      )}

      <div className="flex flex-wrap gap-3">
        <SubmitButton isEdit={Boolean(template?.id)} />
        <Link href="/admin/plantillas" className="btn btn-ghost">
          Cancelar
        </Link>
      </div>
    </form>
  );
}

function SubmitButton({ isEdit }: { isEdit: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn btn-gold btn-lg">
      {pending ? "Guardando…" : isEdit ? "Guardar cambios" : "Crear plantilla"}
    </button>
  );
}

interface DemoUploadFieldProps {
  slug: string;
  onUploaded: (url: string) => void;
}

/** Sube el .zip de una carpeta de demo entera y publica su index.html. */
function DemoUploadField({ slug, onUploaded }: DemoUploadFieldProps) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setBusy(true);
    setMessage(null);

    const data = new FormData();
    data.set("file", file);
    data.set("slug", slug || "plantilla");

    const result = await uploadTemplateDemo({}, data);

    if (result.error) setMessage(result.error);
    else if (result.path) {
      onUploaded(result.path);
      setMessage("✓ Demo publicada.");
    }

    setBusy(false);
    event.target.value = "";
  }

  return (
    <div className="mt-2 flex flex-wrap items-center gap-3">
      <label className="btn btn-ghost cursor-pointer text-[13px]">
        {busy ? "Subiendo…" : "Subir demo (1-VER-LA-WEB.html o .zip)"}
        <input type="file" className="hidden" disabled={busy} accept=".html,.zip" onChange={handleChange} />
      </label>
      {message && <span className="text-[12px] text-ink-muted">{message}</span>}
    </div>
  );
}

