import { NextResponse } from "next/server";

import { getPublishedTemplates } from "@/lib/queries";

export const runtime = "nodejs";

/** Devuelve las plantillas publicadas cuyo slug esté en `?slugs=a,b,c` (para los Favoritos, guardados en el navegador). */
export async function GET(request: Request) {
  const slugsParam = new URL(request.url).searchParams.get("slugs") ?? "";
  const slugs = slugsParam
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  if (slugs.length === 0) return NextResponse.json({ templates: [] });

  const catalog = await getPublishedTemplates();
  const templates = catalog.filter((t) => slugs.includes(t.slug));

  return NextResponse.json({ templates });
}
