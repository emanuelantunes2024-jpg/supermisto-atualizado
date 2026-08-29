/**
 * Un combo lleva más de una demo (el sitio web y el PDV incluidos): se
 * marcan en `tags` como `demo:<carpeta-en-public/demos>`. Si el producto
 * no es un combo (menos de 2 tags "demo:"), no hay partes que mostrar.
 */
export interface DemoPart {
  label: string;
  href: string;
  src: string;
}

export function getDemoParts(tags: string[] | undefined, slug: string): DemoPart[] {
  const demoSlugs = (tags ?? []).filter((tag) => tag.startsWith("demo:")).map((tag) => tag.slice(5));
  if (demoSlugs.length < 2) return [];

  return demoSlugs.map((demoSlug) => ({
    label: demoSlug.startsWith("pdv") ? "Sistema PDV" : "Sitio web",
    href: `/plantillas/${slug}/demo?parte=${demoSlug}`,
    src: `/demos/${demoSlug}/index.html`,
  }));
}
