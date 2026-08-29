"use client";

import { useState } from "react";

import { deleteTestimonial } from "@/app/admin/actions";
import { TestimonialForm } from "@/components/admin/TestimonialForm";
import type { Testimonial } from "@/lib/types";

export function TestimonialRow({ testimonial }: { testimonial: Testimonial }) {
  const [editing, setEditing] = useState(false);

  if (editing) {
    return (
      <div className="panel">
        <TestimonialForm testimonial={testimonial} onSaved={() => setEditing(false)} />
      </div>
    );
  }

  return (
    <div className="surface flex items-start justify-between gap-4 p-5">
      <div className="flex gap-3">
        {testimonial.avatar_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={testimonial.avatar_url} alt="" className="h-11 w-11 shrink-0 rounded-full object-cover" />
        ) : (
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-navy-700 text-[13px] font-semibold">
            {testimonial.customer_name.charAt(0)}
          </div>
        )}
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-[14.5px] font-semibold">{testimonial.customer_name}</h3>
            {!testimonial.is_published && (
              <span className="rounded-full bg-navy-700 px-2 py-0.5 text-[10.5px] text-ink-muted">Oculto</span>
            )}
          </div>
          {testimonial.role && <p className="text-[12px] text-ink-muted">{testimonial.role}</p>}
          <p className="mt-1 text-[12.5px] text-gold-400">{"★".repeat(testimonial.rating)}</p>
          <p className="mt-1.5 max-w-xl text-[13px] text-ink-muted">&ldquo;{testimonial.comment}&rdquo;</p>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-3 text-[13px]">
        <button onClick={() => setEditing(true)} className="text-gold-400 hover:underline">
          Editar
        </button>
        <form action={deleteTestimonial}>
          <input type="hidden" name="id" value={testimonial.id} />
          <button type="submit" className="text-red-300 hover:underline">
            Eliminar
          </button>
        </form>
      </div>
    </div>
  );
}
