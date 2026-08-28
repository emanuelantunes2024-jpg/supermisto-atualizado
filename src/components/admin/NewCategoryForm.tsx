"use client";

import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";

import { createCategory, type ActionState } from "@/app/admin/actions";
import { slugify } from "@/lib/format";

export function NewCategoryForm() {
  const [state, formAction] = useActionState<ActionState, FormData>(createCategory, {});
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);

  const effectiveSlug = slugTouched ? slug : slugify(name);

  useEffect(() => {
    if (state.success) {
      setName("");
      setSlug("");
      setSlugTouched(false);
    }
  }, [state.success]);

  return (
    <form action={formAction} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-[2fr_2fr_1fr]">
        <div>
          <label className="field-label" htmlFor="cat_name">
            Nombre *
          </label>
          <input
            id="cat_name"
            name="name"
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Xbox / Videojuegos"
            className="field-input"
          />
        </div>
        <div>
          <label className="field-label" htmlFor="cat_slug">
            Slug (URL)
          </label>
          <input
            id="cat_slug"
            name="slug"
            value={effectiveSlug}
            onChange={(event) => {
              setSlugTouched(true);
              setSlug(event.target.value);
            }}
            placeholder="xbox-videojuegos"
            className="field-input"
          />
        </div>
        <div>
          <label className="field-label" htmlFor="cat_icon">
            Icono
          </label>
          <input id="cat_icon" name="icon" placeholder="🎮" className="field-input" />
        </div>
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

      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn btn-gold">
      {pending ? "Creando…" : "Crear categoría"}
    </button>
  );
}
