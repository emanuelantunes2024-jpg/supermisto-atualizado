#!/usr/bin/env python3
"""
Genera supabase/seed.sql a partir de src/lib/seed-data.ts.

El catálogo vive en un único sitio (el TypeScript, que alimenta la vitrine
cuando aún no hay Supabase). Este script lo vuelca a SQL para que la base de
datos y ese catálogo de respaldo no puedan contradecirse.

Uso:  python3 scripts/generate-seed-sql.py
"""

import io
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "src" / "lib" / "seed-data.ts"
DST = ROOT / "supabase" / "seed.sql"


def sql_quote(value: str) -> str:
    return "'" + value.replace("'", "''") + "'"


def main() -> int:
    src = io.open(SRC, encoding="utf-8").read()

    cat_prefix = re.search(r'const CAT = "([^"]+)"', src).group(1)
    tpl_prefix = re.search(r'const TPL = "([^"]+)"', src).group(1)
    shortcuts = {
        "RESPONSIVE": re.search(r'const RESPONSIVE = "([^"]+)"', src).group(1),
        "SEO": re.search(r'const SEO = "([^"]+)"', src).group(1),
    }

    categories = [
        (cat_prefix + m.group(1), m.group(2), m.group(3), m.group(4))
        for m in re.finditer(
            r'\{ id: `\$\{CAT\}(\d+)`, name: "([^"]+)", slug: "([^"]+)", icon: "([^"]+)" \}',
            src,
        )
    ]
    if not categories:
        print("No se han encontrado categorías en seed-data.ts", file=sys.stderr)
        return 1

    body = src.split("const seed: SeedTemplate[] = [")[1].split("\n];")[0]
    blocks = re.split(r"\n  \{\n", body)[1:]

    def field(block: str, name: str) -> str | None:
        for pattern in (rf'{name}:\s*"((?:[^"\\]|\\.)*)"', rf'{name}:\s*\n\s*"((?:[^"\\]|\\.)*)"'):
            m = re.search(pattern, block, re.S)
            if m:
                return m.group(1).replace('\\"', '"')
        return None

    by_slug = {c[2]: c[0] for c in categories}
    rows = []

    for block in blocks:
        slug = field(block, "slug")
        features = []
        for line in re.search(r"features: \[(.*?)\n    \],", block, re.S).group(1).split("\n"):
            line = line.strip().rstrip(",")
            if not line:
                continue
            features.append(shortcuts.get(line, line.strip('"').replace('\\"', '"')))

        preview = field(block, "preview_url")
        thumbnail_slug = field(block, "thumbnailSlug") or slug
        rows.append(
            "  ({},\n   {},\n   {}, {},\n   {},\n   {},\n   {}, {}, {},\n   {}::jsonb,\n   'published')".format(
                sql_quote(tpl_prefix + re.search(r"id: `\$\{TPL\}(\d+)`", block).group(1)),
                sql_quote(by_slug[field(block, "categorySlug")]),
                sql_quote(field(block, "title")),
                sql_quote(slug),
                sql_quote(field(block, "short_description")),
                sql_quote(field(block, "full_description")),
                int(re.search(r"price_cents: (\d+)", block).group(1)),
                sql_quote(preview) if preview else "null",
                sql_quote(f"/thumbnails/{thumbnail_slug}.jpg"),
                sql_quote(json.dumps(features, ensure_ascii=False)),
            )
        )

    cat_rows = ",\n".join(
        f"  ({sql_quote(i)}, {sql_quote(n)}, {sql_quote(s)}, {sql_quote(ic)})"
        for i, n, s, ic in categories
    )
    tpl_rows = ",\n\n".join(rows)

    sql = f"""-- ============================================================
-- Leuname Software — datos de ejemplo
-- Ejecutar DESPUÉS de 0001_schema_inicial.sql.
--
-- GENERADO por scripts/generate-seed-sql.py desde src/lib/seed-data.ts.
-- No editar a mano: cambia el catálogo en el TypeScript y vuelve a generar.
-- ============================================================

insert into public.categories (id, name, slug, icon) values
{cat_rows}
on conflict (id) do update
  set name = excluded.name,
      slug = excluded.slug,
      icon = excluded.icon;

insert into public.templates
  (id, category_id, title, slug, short_description, full_description, price_cents, preview_url, thumbnail_url, features, status)
values
{tpl_rows}

on conflict (id) do update
  set title             = excluded.title,
      slug              = excluded.slug,
      category_id       = excluded.category_id,
      short_description = excluded.short_description,
      full_description  = excluded.full_description,
      price_cents       = excluded.price_cents,
      preview_url       = excluded.preview_url,
      thumbnail_url     = excluded.thumbnail_url,
      features          = excluded.features,
      status            = excluded.status;
"""

    io.open(DST, "w", encoding="utf-8").write(sql)
    print(f"seed.sql generado: {len(categories)} categorías, {len(rows)} plantillas")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
