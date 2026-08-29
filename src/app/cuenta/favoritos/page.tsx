"use client";

import { useEffect, useState } from "react";

import { TemplateCard } from "@/components/templates/TemplateCard";
import { useFavorites } from "@/lib/favorites-context";
import type { TemplateWithCategory } from "@/lib/types";

export default function FavoritosPage() {
  const { slugs } = useFavorites();
  const [templates, setTemplates] = useState<TemplateWithCategory[] | null>(null);

  useEffect(() => {
    if (slugs.length === 0) {
      setTemplates([]);
      return;
    }
    fetch(`/api/templates?slugs=${encodeURIComponent(slugs.join(","))}`)
      .then((res) => res.json())
      .then((data) => setTemplates(data.templates ?? []))
      .catch(() => setTemplates([]));
  }, [slugs]);

  return (
    <div className="space-y-6">
      <h2 className="text-xl">Favoritos</h2>

      {templates === null ? (
        <p className="text-ink-muted">Cargando…</p>
      ) : templates.length === 0 ? (
        <div className="panel text-center text-ink-muted">
          Todavía no has guardado ningún template. Toca el corazón en cualquier tarjeta para añadirlo aquí.
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((template) => (
            <TemplateCard key={template.id} template={template} showPriceNote />
          ))}
        </div>
      )}
    </div>
  );
}
