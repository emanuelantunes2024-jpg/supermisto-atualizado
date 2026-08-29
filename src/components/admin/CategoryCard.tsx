"use client";

import Link from "next/link";
import { useState } from "react";

import { deleteCategory } from "@/app/admin/actions";
import { CategoryForm } from "@/components/admin/CategoryForm";
import type { Category } from "@/lib/types";

export function CategoryCard({ category, count }: { category: Category; count: number }) {
  const [editing, setEditing] = useState(false);

  if (editing) {
    return (
      <div className="surface p-5 sm:col-span-2 xl:col-span-3">
        <CategoryForm category={category} onSaved={() => setEditing(false)} />
        <button onClick={() => setEditing(false)} className="mt-3 text-[12.5px] text-ink-muted hover:underline">
          Cancelar
        </button>
      </div>
    );
  }

  return (
    <div className="surface p-5">
      {category.image_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={category.image_url} alt="" className="mb-3 h-24 w-full rounded-lg object-cover" />
      ) : (
        <div className="mb-2 text-2xl">{category.icon}</div>
      )}
      <h3 className="text-[15px]">{category.name}</h3>
      <p className="mt-1 text-[12.5px] text-ink-muted">/{category.slug}</p>
      {category.description && <p className="mt-1.5 line-clamp-2 text-[12.5px] text-ink-muted">{category.description}</p>}
      <div className="mt-3 flex items-center justify-between text-[12.5px]">
        <span className="text-ink-muted">{count} publicadas</span>
        <Link href={`/plantillas?cat=${category.slug}`} className="text-gold-400 hover:underline">
          Ver en la tienda →
        </Link>
      </div>
      <div className="mt-3 flex items-center gap-3 border-t border-line pt-3 text-[12.5px]">
        <button onClick={() => setEditing(true)} className="text-gold-400 hover:underline">
          Editar
        </button>
        <form
          action={deleteCategory}
          onSubmit={(e) => {
            if (!confirm(`¿Eliminar la categoría "${category.name}"?`)) e.preventDefault();
          }}
        >
          <input type="hidden" name="id" value={category.id} />
          <button type="submit" className="text-red-300 hover:underline">
            Eliminar
          </button>
        </form>
      </div>
    </div>
  );
}
