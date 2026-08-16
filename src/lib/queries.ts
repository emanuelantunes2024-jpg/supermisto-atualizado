import { createClient } from "@/lib/supabase/server";
import { seedCategories, seedTemplates } from "@/lib/seed-data";
import type { Category, OrderWithTemplate, Template, TemplateWithCategory } from "@/lib/types";

/**
 * Acceso de lectura al catálogo.
 *
 * Si Supabase está configurado se lee de la base de datos; si no (o si la
 * consulta falla), se cae al catálogo de ejemplo de `seed-data.ts`, de modo
 * que la vitrine nunca se queda en blanco.
 */

const TEMPLATE_SELECT = "*, category:categories(*)";

function sortCategories(list: Category[]): Category[] {
  return [...list].sort((a, b) => a.name.localeCompare(b.name, "es"));
}

export async function getCategories(): Promise<Category[]> {
  const supabase = await createClient();
  if (!supabase) return sortCategories(seedCategories);

  const { data, error } = await supabase.from("categories").select("*").order("name");
  if (error || !data || data.length === 0) return sortCategories(seedCategories);

  return data as Category[];
}

export async function getPublishedTemplates(categorySlug?: string): Promise<TemplateWithCategory[]> {
  const supabase = await createClient();

  if (!supabase) {
    return categorySlug
      ? seedTemplates.filter((t) => t.category?.slug === categorySlug)
      : seedTemplates;
  }

  const { data, error } = await supabase
    .from("templates")
    .select(TEMPLATE_SELECT)
    .eq("status", "published")
    .order("created_at", { ascending: false });

  if (error || !data) {
    return categorySlug
      ? seedTemplates.filter((t) => t.category?.slug === categorySlug)
      : seedTemplates;
  }

  const templates = data as unknown as TemplateWithCategory[];
  return categorySlug ? templates.filter((t) => t.category?.slug === categorySlug) : templates;
}

export async function getFeaturedTemplates(limit = 6): Promise<TemplateWithCategory[]> {
  const templates = await getPublishedTemplates();
  return templates.slice(0, limit);
}

export async function getTemplateBySlug(slug: string): Promise<TemplateWithCategory | null> {
  const supabase = await createClient();

  if (!supabase) {
    return seedTemplates.find((t) => t.slug === slug) ?? null;
  }

  const { data, error } = await supabase
    .from("templates")
    .select(TEMPLATE_SELECT)
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error || !data) {
    return seedTemplates.find((t) => t.slug === slug) ?? null;
  }

  return data as unknown as TemplateWithCategory;
}

/** Cuántas plantillas publicadas hay por categoría (para las tarjetas de rubro). */
export async function getCategoryCounts(): Promise<Record<string, number>> {
  const templates = await getPublishedTemplates();
  return templates.reduce<Record<string, number>>((acc, template) => {
    const slug = template.category?.slug;
    if (slug) acc[slug] = (acc[slug] ?? 0) + 1;
    return acc;
  }, {});
}

/* ------------------------------------------------------------------ */
/* Área de cliente                                                     */
/* ------------------------------------------------------------------ */

/** Compras pagadas del usuario autenticado. */
export async function getMyOrders(userId: string): Promise<OrderWithTemplate[]> {
  const supabase = await createClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("orders")
    .select(`*, template:templates(${TEMPLATE_SELECT})`)
    .eq("customer_id", userId)
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return data as unknown as OrderWithTemplate[];
}

/* ------------------------------------------------------------------ */
/* Panel de administración                                             */
/* ------------------------------------------------------------------ */

/** Todas las plantillas, incluidos borradores y archivadas. */
export async function getAllTemplates(): Promise<TemplateWithCategory[]> {
  const supabase = await createClient();
  if (!supabase) return seedTemplates;

  const { data, error } = await supabase
    .from("templates")
    .select(TEMPLATE_SELECT)
    .order("created_at", { ascending: false });

  if (error || !data) return seedTemplates;
  return data as unknown as TemplateWithCategory[];
}

export async function getTemplateById(id: string): Promise<Template | null> {
  const supabase = await createClient();
  if (!supabase) return seedTemplates.find((t) => t.id === id) ?? null;

  const { data, error } = await supabase.from("templates").select("*").eq("id", id).maybeSingle();
  if (error || !data) return null;
  return data as Template;
}

export async function getAllOrders(): Promise<OrderWithTemplate[]> {
  const supabase = await createClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("orders")
    .select(`*, template:templates(${TEMPLATE_SELECT})`)
    .order("created_at", { ascending: false })
    .limit(200);

  if (error || !data) return [];
  return data as unknown as OrderWithTemplate[];
}

export interface DashboardStats {
  totalRevenueCents: number;
  paidOrders: number;
  ordersThisMonth: number;
  revenueThisMonthCents: number;
  publishedTemplates: number;
  bestSeller: { title: string; count: number } | null;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const [orders, templates] = await Promise.all([getAllOrders(), getAllTemplates()]);

  const paid = orders.filter((o) => o.status === "paid");
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const paidThisMonth = paid.filter((o) => new Date(o.created_at) >= monthStart);

  const salesByTemplate = paid.reduce<Record<string, { title: string; count: number }>>(
    (acc, order) => {
      const title = order.template?.title ?? "Plantilla eliminada";
      acc[order.template_id] = { title, count: (acc[order.template_id]?.count ?? 0) + 1 };
      return acc;
    },
    {},
  );

  const bestSeller =
    Object.values(salesByTemplate).sort((a, b) => b.count - a.count)[0] ?? null;

  return {
    totalRevenueCents: paid.reduce((sum, o) => sum + o.amount_cents, 0),
    paidOrders: paid.length,
    ordersThisMonth: paidThisMonth.length,
    revenueThisMonthCents: paidThisMonth.reduce((sum, o) => sum + o.amount_cents, 0),
    publishedTemplates: templates.filter((t) => t.status === "published").length,
    bestSeller,
  };
}
