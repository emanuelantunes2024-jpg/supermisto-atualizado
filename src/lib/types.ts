/** Tipos del dominio — reflejan el esquema en `supabase/migrations`. */

export type TemplateStatus = "draft" | "published" | "archived";
export type OrderStatus = "pending" | "paid" | "refunded" | "failed";

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  created_at?: string;
}

export interface Template {
  id: string;
  category_id: string;
  title: string;
  slug: string;
  short_description: string;
  full_description: string;
  price_cents: number;
  preview_url: string | null;
  thumbnail_url: string | null;
  features: string[];
  file_url: string | null;
  status: TemplateStatus;
  created_at?: string;
  updated_at?: string;
}

/** Plantilla con su categoría resuelta (lo que consumen las páginas). */
export interface TemplateWithCategory extends Template {
  category: Category | null;
}

export interface Customer {
  id: string;
  full_name: string | null;
  email: string;
  phone: string | null;
  country: string | null;
  role: "customer" | "admin";
  created_at?: string;
}

export interface Order {
  id: string;
  customer_id: string | null;
  template_id: string;
  stripe_payment_intent_id: string | null;
  stripe_checkout_session_id: string | null;
  amount_cents: number;
  currency: string;
  status: OrderStatus;
  buyer_email: string;
  buyer_name: string | null;
  buyer_country: string | null;
  download_token: string;
  created_at: string;
}

export interface OrderWithTemplate extends Order {
  template: TemplateWithCategory | null;
}

export interface DownloadLog {
  id: string;
  order_id: string;
  downloaded_at: string;
  ip_address: string | null;
}
