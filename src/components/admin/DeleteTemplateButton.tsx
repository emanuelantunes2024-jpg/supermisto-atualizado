"use client";

import { deleteTemplate } from "@/app/admin/actions";

/** Botón de borrado con confirmación: para plantillas duplicadas o de prueba. */
export function DeleteTemplateButton({ id, title }: { id: string; title: string }) {
  return (
    <form
      action={deleteTemplate}
      onSubmit={(event) => {
        if (!confirm(`¿Borrar "${title}" para siempre? Esto no se puede deshacer.`)) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button type="submit" className="text-red-400 hover:underline">
        Eliminar
      </button>
    </form>
  );
}
