// Tipos que espelham o schema do Supabase (supabase/migrations/0001_init.sql)

export type Role = {
  id: string;
  name: string;
  description: string | null;
};

export type Permission = {
  id: string;
  code: string;
  label: string;
  category: string;
};

export type Admin = {
  id: string;
  name: string;
  email: string;
  avatar_url: string | null;
  role_id: string | null;
  status: 'active' | 'inactive';
  created_at: string;
  role?: Role & { permissions?: string[] };
};

export type Plan = {
  id: string;
  name: string;
  slug: string;
  price: number;
  billing_period: 'gratuito' | 'mensal' | 'anual' | 'vitalicio';
  description: string | null;
  features: string[];
  hotmart_product_id: string | null;
  hotmart_offer_code: string | null;
  is_active: boolean;
  sort_order: number;
};

export type AppUser = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  avatar_url: string | null;
  plan_id: string | null;
  status: 'active' | 'inactive';
  created_at: string;
  plan?: Plan;
};

export type Subscription = {
  id: string;
  user_id: string;
  plan_id: string | null;
  status: 'ativa' | 'pendente' | 'cancelada';
  hotmart_transaction_code: string | null;
  hotmart_subscriber_code: string | null;
  started_at: string | null;
  expires_at: string | null;
  canceled_at: string | null;
  created_at: string;
  user?: AppUser;
  plan?: Plan;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  description: string | null;
  sort_order: number;
};

export type Ingredient = {
  id: string;
  name: string;
  unit: string;
  package_price: number;
  package_quantity: number;
  price_per_unit: number;
  supplier: string | null;
};

export type RecipeIngredient = {
  id: string;
  recipe_id: string;
  ingredient_id: string;
  base_quantity: number;
  display_label: string | null;
  sort_order: number;
  ingredient?: Ingredient;
};

export type Recipe = {
  id: string;
  title: string;
  slug: string;
  category_id: string | null;
  difficulty: 'Fácil' | 'Médio' | 'Difícil';
  prep_time_minutes: number;
  yield_quantity: number;
  yield_unit: string;
  image_url: string | null;
  description: string | null;
  instructions: string[];
  tips: string | null;
  storage: string | null;
  equipment: string | null;
  packaging_cost: number;
  other_costs: number;
  profit_margin_percent: number;
  published: boolean;
  featured: boolean;
  is_new: boolean;
  views_count: number;
  favorites_count: number;
  created_at: string;
  updated_at: string;
  category?: Category;
  recipe_ingredients?: RecipeIngredient[];
};

export type Favorite = { id: string; user_id: string; recipe_id: string; created_at: string };
export type Collection = { id: string; user_id: string; name: string; created_at: string };
export type ShoppingListItem = {
  id: string;
  user_id: string;
  recipe_id: string | null;
  label: string;
  quantity: string | null;
  checked: boolean;
};

export type News = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  status: 'draft' | 'published';
  published_at: string | null;
  created_at: string;
};

export type Banner = {
  id: string;
  title: string;
  subtitle: string | null;
  image_url: string | null;
  link_url: string | null;
  position: 'home_hero' | 'home_news' | 'app_top';
  is_active: boolean;
  sort_order: number;
};

export type Comment = {
  id: string;
  user_id: string;
  recipe_id: string;
  content: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  user?: AppUser;
  recipe?: Recipe;
};

export type Notification = {
  id: string;
  user_id: string | null;
  title: string;
  message: string;
  type: string;
  read: boolean;
  created_at: string;
};

export type SupportTicket = {
  id: string;
  user_id: string;
  subject: string;
  message: string;
  status: 'open' | 'in_progress' | 'closed';
  priority: 'baixa' | 'normal' | 'alta';
  assigned_admin_id: string | null;
  created_at: string;
  user?: AppUser;
};

export type SystemLog = {
  id: string;
  admin_id: string | null;
  action: string;
  entity: string;
  entity_id: string | null;
  details: Record<string, unknown>;
  created_at: string;
  admin?: Admin;
};

export type Setting = { id: string; key: string; value: unknown; updated_at: string };
