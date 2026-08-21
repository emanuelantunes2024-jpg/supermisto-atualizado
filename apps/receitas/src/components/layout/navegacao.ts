/** Itens de navegação do aplicativo, compartilhados por barra lateral e menu. */

export interface ItemNavegacao {
  href: string;
  rotulo: string;
  icone: string;
  /** Aparece na barra inferior do celular. */
  noCelular?: boolean;
  selo?: string;
}

export const NAVEGACAO_PRINCIPAL: ItemNavegacao[] = [
  { href: "/inicio", rotulo: "Início", icone: "inicio", noCelular: true },
  { href: "/receitas", rotulo: "Receitas", icone: "receitas", noCelular: true },
  { href: "/categorias", rotulo: "Categorias", icone: "categorias" },
  { href: "/buscar", rotulo: "Buscar", icone: "buscar", noCelular: true },
  { href: "/calculadoras", rotulo: "Calculadoras", icone: "calculadora" },
  { href: "/lista-de-compras", rotulo: "Lista de Compras", icone: "carrinho" },
  { href: "/central-de-renda", rotulo: "Central de Renda", icone: "renda", noCelular: true },
  { href: "/favoritos", rotulo: "Favoritos", icone: "coracao", noCelular: true },
  { href: "/colecoes", rotulo: "Minhas Coleções", icone: "colecoes" },
  { href: "/novidades", rotulo: "Novidades", icone: "novidades" },
  { href: "/meu-plano", rotulo: "Meu Plano", icone: "plano" },
  { href: "/assistente", rotulo: "Assistente IA", icone: "assistente", selo: "Em breve" },
];

export const NAVEGACAO_RODAPE: ItemNavegacao[] = [
  { href: "/configuracoes", rotulo: "Configurações", icone: "ajustes" },
];

/** Itens da barra fixa inferior no celular (no máximo cinco). */
export const NAVEGACAO_CELULAR = NAVEGACAO_PRINCIPAL.filter((i) => i.noCelular).slice(0, 5);
