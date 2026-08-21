/** Leitura central das variáveis de ambiente. */

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const NOME_PRODUTO = "Central de Receitas & Renda";

/** Link da oferta na plataforma de venda (Hotmart, Kiwify, Braip...). */
export const LINK_OFERTA = process.env.NEXT_PUBLIC_LINK_OFERTA ?? "";

export const PRECO_OFERTA = process.env.NEXT_PUBLIC_PRECO_OFERTA ?? "29,90";

/**
 * `true` quando as chaves públicas do Supabase existem.
 * Sem elas a aplicação roda em MODO DEMONSTRAÇÃO: o catálogo vem do arquivo
 * curado e os dados do usuário ficam apenas no navegador.
 */
export const supabaseConfigurado = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

/** `true` quando a chave de serviço está disponível (somente no servidor). */
export const temServiceRole = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);

/** E-mails com acesso ao painel administrativo. */
export function emailsAdmin(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

/** Segredo compartilhado (hottok) validado no webhook da plataforma. */
export const HOTMART_HOTTOK = process.env.HOTMART_HOTTOK ?? "";
