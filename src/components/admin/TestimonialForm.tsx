"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";

import { saveTestimonial, type ActionState } from "@/app/admin/actions";
import { UploadField } from "@/components/admin/UploadField";
import type { Testimonial } from "@/lib/types";

function SaveButton({ isEdit }: { isEdit: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn btn-gold">
      {pending ? "Guardando…" : isEdit ? "Guardar cambios" : "Añadir testimonio"}
    </button>
  );
}

export function TestimonialForm({ testimonial, onSaved }: { testimonial?: Testimonial | null; onSaved?: () => void }) {
  const [state, formAction] = useActionState<ActionState, FormData>(saveTestimonial, {});
  const [avatarUrl, setAvatarUrl] = useState(testimonial?.avatar_url ?? "");

  return (
    <form
      action={(formData) => {
        formAction(formData);
        onSaved?.();
      }}
      className="grid gap-4 sm:grid-cols-2"
    >
      {testimonial?.id && <input type="hidden" name="id" value={testimonial.id} />}
      <div>
        <label className="field-label">Nombre *</label>
        <input name="customer_name" required defaultValue={testimonial?.customer_name ?? ""} className="field-input" />
      </div>
      <div>
        <label className="field-label">Rol / empresa</label>
        <input name="role" defaultValue={testimonial?.role ?? ""} placeholder="Emprendedor" className="field-input" />
      </div>
      <div className="sm:col-span-2">
        <label className="field-label">Comentario *</label>
        <textarea
          name="comment"
          required
          rows={3}
          defaultValue={testimonial?.comment ?? ""}
          className="field-input resize-y"
        />
      </div>
      <div>
        <label className="field-label">Calificación</label>
        <select name="rating" defaultValue={String(testimonial?.rating ?? 5)} className="field-input">
          {[5, 4, 3, 2, 1].map((n) => (
            <option key={n} value={n}>
              {"★".repeat(n)}
              {"☆".repeat(5 - n)}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="field-label">Orden</label>
        <input
          name="sort_order"
          type="number"
          defaultValue={testimonial?.sort_order ?? 0}
          className="field-input"
        />
      </div>
      <div className="sm:col-span-2">
        <label className="field-label">Foto</label>
        {avatarUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={avatarUrl} alt="" className="mb-2 h-14 w-14 rounded-full border border-line object-cover" />
        )}
        <input type="hidden" name="avatar_url" value={avatarUrl} />
        <UploadField slug="testimonios" label={avatarUrl ? "Cambiar foto" : "Subir foto"} onUploaded={setAvatarUrl} />
      </div>
      <div className="sm:col-span-2">
        <label className="flex items-center gap-2 text-[13.5px]">
          <input
            type="checkbox"
            name="is_published"
            value="1"
            defaultChecked={testimonial?.is_published ?? true}
            className="h-4 w-4 rounded border-line"
          />
          Publicado (visible en la portada)
        </label>
      </div>

      {state.error && <p className="sm:col-span-2 text-[13px] text-red-300">{state.error}</p>}
      {state.success && <p className="sm:col-span-2 text-[13px] text-emerald-300">{state.success}</p>}

      <div className="sm:col-span-2">
        <SaveButton isEdit={Boolean(testimonial?.id)} />
      </div>
    </form>
  );
}
