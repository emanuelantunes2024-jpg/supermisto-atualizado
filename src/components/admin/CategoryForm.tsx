"use client";

import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";

import { createCategory, updateCategory, type ActionState } from "@/app/admin/actions";
import { UploadField } from "@/components/admin/UploadField";
import { slugify } from "@/lib/format";
import type { Category } from "@/lib/types";

function SubmitButton({ isEdit }: { isEdit: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn btn-gold">
      {pending ? "Guardando…" : isEdit ? "Guardar cambios" : "Crear categoría"}
    </button>
  );
}

export function CategoryForm({ category, onSaved }: { category?: Category | null; onSaved?: () => void }) {
  const action = category?.id ? updateCategory : createCategory;
  const [state, formAction] = useActionState<ActionState, FormData>(action, {});

  const [name, setName] = useState(category?.name ?? "");
  const [slug, setSlug] = useState(category?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(category?.slug));
  const [imageUrl, setImageUrl] = useState(category?.image_url ?? "");

  const effectiveSlug = slugTouched ? slug : slugify(name);

  useEffect(() => {
    if (state.success && !category) {
      setName("");
      setSlug("");
      setSlugTouched(false);
      setImageUrl("");
    }
    if (state.success) onSaved?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.success]);

  return (
    <form action={formAction} className="space-y-4">
      {category?.id && <input type="hidden" name="id" value={category.id} />}

      <div className="grid gap-4 sm:grid-cols-[2fr_2fr_1fr_1fr]">
        <div>
          <label className="field-label">Nombre *</label>
          <input
            name="name"
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Tienda Online"
            className="field-input"
          />
        </div>
        <div>
          <label className="field-label">Slug (URL)</label>
          <input
            name="slug"
            value={effectiveSlug}
            onChange={(event) => {
              setSlugTouched(true);
              setSlug(event.target.value);
            }}
            placeholder="tienda-online"
            className="field-input"
          />
        </div>
        <div>
          <label className="field-label">Icono</label>
          <input name="icon" defaultValue={category?.icon ?? ""} placeholder="🛒" className="field-input" />
        </div>
        <div>
          <label className="field-label">Orden</label>
          <input name="sort_order" type="number" defaultValue={category?.sort_order ?? 0} className="field-input" />
        </div>
      </div>

      <div>
        <label className="field-label">Descripción</label>
        <textarea
          name="description"
          rows={2}
          defaultValue={category?.description ?? ""}
          placeholder="Se muestra en la página de la categoría."
          className="field-input resize-y"
        />
      </div>

      <div>
        <label className="field-label">Imagen de la categoría</label>
        {imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageUrl} alt="" className="mb-2 h-20 w-32 rounded-lg border border-line object-cover" />
        )}
        <input type="hidden" name="image_url" value={imageUrl} />
        <UploadField slug={effectiveSlug || "categoria"} label={imageUrl ? "Cambiar imagen" : "Subir imagen"} onUploaded={setImageUrl} />
      </div>

      {state.error && (
        <p className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-[13px] text-red-300">
          {state.error}
        </p>
      )}
      {state.success && (
        <p className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-[13px] text-emerald-300">
          {state.success}
        </p>
      )}

      <SubmitButton isEdit={Boolean(category?.id)} />
    </form>
  );
}
