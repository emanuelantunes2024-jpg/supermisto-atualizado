/** Tipos del dominio — reflejan el esquema en `supabase/migrations`. */

export type TemplateStatus = "draft" | "published" | "archived";
export type OrderStatus = "pending" | "paid" | "refunded" | "failed";

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description?: string | null;
  image_url?: string | null;
  sort_order?: number;
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
  compare_at_price_cents?: number | null;
  preview_url: string | null;
  thumbnail_url: string | null;
  features: string[];
  tags?: string[];
  featured?: boolean;
  file_url: string | null;
  status: TemplateStatus;
  created_at?: string;
  updated_at?: string;
}

/** Plantilla con su categoría resuelta (lo que consumen las páginas). */
export interface TemplateWithCategory extends Template {
  category: Category | null;
  images?: ProductImage[];
}

export type ProductImageKind = "main" | "desktop" | "laptop" | "tablet" | "mobile" | "gallery";

export interface ProductImage {
  id: string;
  template_id: string;
  kind: ProductImageKind;
  url: string;
  sort_order: number;
  created_at?: string;
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
  /** @deprecated Los pedidos nuevos usan `order_items` (carrito). Se mantiene por compatibilidad. */
  template_id: string | null;
  stripe_payment_intent_id: string | null;
  stripe_checkout_session_id: string | null;
  amount_cents: number;
  subtotal_cents?: number | null;
  discount_cents?: number;
  currency: string;
  status: OrderStatus;
  buyer_email: string;
  buyer_name: string | null;
  buyer_phone?: string | null;
  buyer_country: string | null;
  download_token: string;
  created_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  template_id: string;
  title_snapshot: string;
  unit_price_cents: number;
  quantity: number;
  created_at?: string;
}

export interface OrderItemWithTemplate extends OrderItem {
  template: TemplateWithCategory | null;
}

export interface OrderWithTemplate extends Order {
  /** Compatibilidad con pedidos antiguos (1 plantilla por pedido). */
  template: TemplateWithCategory | null;
  /** Líneas del carrito (pedidos nuevos, pueden ser varias plantillas). */
  items?: OrderItemWithTemplate[];
}

export interface DownloadLog {
  id: string;
  order_id: string;
  downloaded_at: string;
  ip_address: string | null;
}

export interface License {
  id: string;
  order_item_id: string;
  customer_id: string | null;
  template_id: string;
  license_key: string;
  created_at?: string;
}

export interface LicenseWithTemplate extends License {
  template: TemplateWithCategory | null;
}

export interface Testimonial {
  id: string;
  customer_name: string;
  role: string | null;
  avatar_url: string | null;
  comment: string;
  rating: number;
  sort_order: number;
  is_published: boolean;
  created_at?: string;
}

export interface SiteSettings {
  company_name: string;
  logo_url: string | null;
  favicon_url: string | null;
  email: string | null;
  phone: string | null;
  whatsapp: string | null;
  address: string | null;
  currency: string;
  language: string;
  social: Record<string, string>;
  footer_text: string | null;
}

export interface HeroContent {
  eyebrow: string;
  title: string;
  subtitle: string;
  image_url: string | null;
  button_text: string;
  button_href: string;
  search_placeholder: string;
  trust_badges: string[];
}

export interface BenefitContent {
  icon: string;
  title: string;
  text: string;
}

export interface WhyUsContent {
  title: string;
  text: string;
  button_text: string;
  button_href: string;
  stats: { value: string; label: string }[];
}

export interface NewsletterContent {
  title: string;
  subtitle: string;
  button_text: string;
}

export interface HomepageContent {
  hero: HeroContent;
  benefits: BenefitContent[];
  featured_categories: string[];
  featured_templates: string[];
  why_us: WhyUsContent;
  newsletter: NewsletterContent;
}
