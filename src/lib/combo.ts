import type { TemplateWithCategory } from "@/lib/types";

/**
 * Un combo no es un producto descargable en sí: son dos plantillas reales
 * (el sitio y el PDV) vendidas juntas con descuento. Se marcan en `tags`
 * como `incluye:<slug-real>`. Al pagar, cada parte se entrega por separado
 * (su propia licencia, su propia descarga en "Mis templates"), repartiendo
 * el precio del combo entre las dos según su precio de catálogo.
 */
export function getBundleSlugs(tags: string[] | undefined): string[] {
  return (tags ?? []).filter((tag) => tag.startsWith("incluye:")).map((tag) => tag.slice(8));
}

export interface BundleLine {
  template: TemplateWithCategory;
  unitPriceCents: number;
}

/**
 * Reparte el precio del combo entre sus partes, proporcional al precio de
 * catálogo de cada una, ajustando el redondeo en la última línea para que
 * la suma sea exacta.
 */
export function splitBundle(
  combo: TemplateWithCategory,
  bySlug: Map<string, TemplateWithCategory>,
): BundleLine[] | null {
  const slugs = getBundleSlugs(combo.tags);
  if (slugs.length < 2) return null;

  const parts = slugs.map((slug) => bySlug.get(slug)).filter((t): t is TemplateWithCategory => Boolean(t));
  if (parts.length !== slugs.length) return null; // alguna parte ya no existe: no se puede repartir con seguridad

  const catalogTotal = parts.reduce((sum, part) => sum + part.price_cents, 0);
  if (catalogTotal === 0) return null;

  let assigned = 0;
  const lines = parts.map((part, index) => {
    if (index === parts.length - 1) {
      return { template: part, unitPriceCents: combo.price_cents - assigned };
    }
    const share = Math.round((part.price_cents / catalogTotal) * combo.price_cents);
    assigned += share;
    return { template: part, unitPriceCents: share };
  });

  return lines;
}
