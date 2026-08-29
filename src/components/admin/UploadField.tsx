"use client";

import { useState } from "react";

import { createUploadTicket } from "@/app/admin/actions";
import { createClient } from "@/lib/supabase/client";

interface UploadFieldProps {
  /** "file" sube al bucket privado de paquetes; "asset" al público de imágenes. */
  kind?: "asset" | "file";
  slug: string;
  label: string;
  onUploaded: (path: string) => void;
}

/**
 * Botón de subida a Supabase Storage, reutilizable en cualquier formulario
 * del panel (plantillas, contenido de portada, testimonios, configuración).
 *
 * Pide al servidor una URL firmada (petición diminuta, sin el archivo) y
 * sube el archivo directo del navegador a Storage: no pasa por el servidor,
 * así que no hay límite de tamaño de las Server Actions.
 */
export function UploadField({ kind = "asset", slug, label, onUploaded }: UploadFieldProps) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setBusy(true);
    setMessage(null);

    const ticketForm = new FormData();
    ticketForm.set("kind", kind);
    ticketForm.set("slug", slug || "sitio");
    ticketForm.set("filename", file.name);
    const ticket = await createUploadTicket({}, ticketForm);

    if (ticket.error || !ticket.path || !ticket.token || !ticket.bucket) {
      setMessage(ticket.error ?? "No se pudo preparar la subida.");
      setBusy(false);
      return;
    }

    const supabase = createClient();
    const { error } = await supabase.storage
      .from(ticket.bucket)
      .uploadToSignedUrl(ticket.path, ticket.token, file);

    if (error) {
      setMessage(`No se pudo subir el archivo: ${error.message}`);
      setBusy(false);
      return;
    }

    if (kind === "file") {
      onUploaded(ticket.path);
    } else {
      const { data } = supabase.storage.from(ticket.bucket).getPublicUrl(ticket.path);
      onUploaded(data.publicUrl);
    }
    setMessage("Subido correctamente.");
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
