"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";

import { saveTemplate, uploadTemplateAsset, type ActionState } from "@/app/admin/actions";
import { slugify } from "@/lib/format";
import type { Category, Template } from "@/lib/types";

interface TemplateFormProps {
  categories: Category[];
  template?: Template | null;
}

export function TemplateForm({ categories, template }: TemplateFormProps) {
  const [state, formAction] = useActionState<ActionState, FormData>(saveTemplate, {});

  const [title, setTitle] = useState(template?.title ?? "");
  const [slug, setSlug] = useState(template?.slug ?? "");
  const [thumbnailUrl, setThumbnailUrl] = useState(template?.thumbnail_url ?? "");
  const [fileUrl, setFileUrl] = useState(template?.file_url ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(template?.slug));

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

      <div className="panel space-y-4">
        <h2 className="text-lg">Archivos y demo</h2>

        <div>
          <label className="field-label" htmlFor="preview_url">
            URL de la demo en vivo
          </label>
          <input
            id="preview_url"
            name="preview_url"
            defaultValue={template?.preview_url ?? ""}
            placeholder="/demos/barberia/index.html o https://demo.tudominio.com"
            className="field-input"
          />
        </div>

        <div>
          <label className="field-label" htmlFor="thumbnail_url">
            Miniatura (URL pública)
          </label>
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

interface UploadFieldProps {
  kind: "asset" | "file";
  slug: string;
  label: string;
  onUploaded: (path: string) => void;
}

/**
 * Subida a Supabase Storage. Va en su propio `<form>` lógico: se envía con
 * fetch para no interferir con el formulario principal de la plantilla.
 */
function UploadField({ kind, slug, label, onUploaded }: UploadFieldProps) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setBusy(true);
    setMessage(null);

    const data = new FormData();
    data.set("file", file);
    data.set("kind", kind);
    data.set("slug", slug || "plantilla");

    const result = await uploadTemplateAsset({}, data);

    if (result.error) setMessage(result.error);
    else if (result.path) {
      onUploaded(result.path);
      setMessage("Subido correctamente.");
    }

    setBusy(false);
    event.target.value = "";
  }

  return (
    <div className="mt-2 flex flex-wrap items-center gap-3">
      <label className="btn btn-ghost cursor-pointer text-[13px]">
        {busy ? "Subiendo…" : label}
        <input
          type="file"
          className="hidden"
          disabled={busy}
          accept={kind === "file" ? ".zip" : "image/*"}
          onChange={handleChange}
        />
      </label>
      {message && <span className="text-[12px] text-ink-muted">{message}</span>}
    </div>
  );
}
