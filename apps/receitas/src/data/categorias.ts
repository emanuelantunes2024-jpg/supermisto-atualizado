import type { Categoria } from "@/lib/types";

/**
 * Categorias da primeira versão (culinária brasileira).
 *
 * A estrutura já suporta módulos internacionais futuros: basta cadastrar
 * novas categorias com outro prefixo de slug e filtrá-las por módulo.
 */
export const CATEGORIAS: Categoria[] = [
  {
    slug: "bolos",
    nome: "Bolos",
    descricao: "Caseiros, recheados, de festa, no pote e gelados.",
    icone: "bolo",
    cor: "bg-amber-100 text-amber-600",
    ordem: 1,
    subcategorias: [
      "Bolos caseiros",
      "Bolos simples",
      "Bolos de chocolate",
      "Bolos de frutas",
      "Bolos recheados",
      "Bolos de festa",
      "Bolos no pote",
      "Mini bolos",
      "Bolos gelados",
      "Massas de bolo",
      "Recheios",
      "Coberturas",
      "Decoração",
      "Bolos para vender",
    ],
  },
  {
    slug: "doces",
    nome: "Doces",
    descricao: "Brigadeiros, beijinhos, trufas, bombons e doces no pote.",
    icone: "doce",
    cor: "bg-brand-100 text-brand-600",
    ordem: 2,
    subcategorias: [
      "Brigadeiros",
      "Beijinhos",
      "Trufas",
      "Bombons",
      "Doces gourmet",
      "Doces de festa",
      "Doces no pote",
      "Caramelos",
      "Balas",
      "Doces para vender",
    ],
  },
  {
    slug: "salgados",
    nome: "Salgados",
    descricao: "Coxinhas, risoles, bolinhas, quibes, empadas e esfihas.",
    icone: "salgado",
    cor: "bg-orange-100 text-orange-600",
    ordem: 3,
    subcategorias: [
      "Coxinhas",
      "Risoles",
      "Bolinhas de queijo",
      "Quibes",
      "Empadas",
      "Esfihas",
      "Salgados assados",
      "Salgados fritos",
      "Massas para salgados",
      "Salgados para festas",
      "Salgados para vender",
    ],
  },
  {
    slug: "paes",
    nome: "Pães",
    descricao: "Caseiros, de forma, doces, recheados e integrais.",
    icone: "pao",
    cor: "bg-yellow-100 text-yellow-700",
    ordem: 4,
    subcategorias: [
      "Pão caseiro",
      "Pão de forma",
      "Pães doces",
      "Pães recheados",
      "Pães integrais",
      "Massas fermentadas",
      "Pães para vender",
    ],
  },
  {
    slug: "sorvetes-picoles",
    nome: "Sorvetes e Picolés",
    descricao: "Sorvetes cremosos, picolés, geladinhos e sacolés.",
    icone: "picole",
    cor: "bg-pink-100 text-pink-600",
    ordem: 5,
    subcategorias: [
      "Sorvetes",
      "Sorvetes cremosos",
      "Sorvetes de frutas",
      "Sorvetes para vender",
      "Picolés",
      "Picolés cremosos",
      "Picolés de frutas",
      "Geladinhos",
      "Sacolés",
      "Sobremesas congeladas",
      "Bases",
      "Caldas",
      "Coberturas",
    ],
  },
  {
    slug: "sobremesas",
    nome: "Sobremesas",
    descricao: "Mousses, pudins, pavês, tortas e cheesecakes.",
    icone: "sobremesa",
    cor: "bg-purple-100 text-purple-600",
    ordem: 6,
    subcategorias: [
      "Mousses",
      "Pudins",
      "Pavês",
      "Tortas",
      "Cheesecakes",
      "Sobremesas geladas",
      "Sobremesas no pote",
      "Sobremesas para festas",
    ],
  },
  {
    slug: "massas-pizzas",
    nome: "Massas e Pizzas",
    descricao: "Pizzas, lasanhas, nhoques e massas recheadas.",
    icone: "pizza",
    cor: "bg-red-100 text-red-600",
    ordem: 7,
    subcategorias: ["Pizzas", "Massas", "Lasanhas", "Nhoques", "Massas recheadas", "Molhos"],
  },
  {
    slug: "biscoitos-cookies",
    nome: "Biscoitos e Cookies",
    descricao: "Cookies, amanteigados, recheados e biscoitos caseiros.",
    icone: "biscoito",
    cor: "bg-lime-100 text-lime-700",
    ordem: 8,
    subcategorias: [
      "Biscoitos caseiros",
      "Cookies",
      "Biscoitos amanteigados",
      "Biscoitos recheados",
      "Biscoitos para vender",
    ],
  },
  {
    slug: "geleias-molhos",
    nome: "Geleias, Molhos e Conservas",
    descricao: "Geleias, molhos, conservas, pastas e antepastos.",
    icone: "conserva",
    cor: "bg-emerald-100 text-emerald-700",
    ordem: 9,
    subcategorias: ["Geleias", "Molhos", "Conservas", "Pastas", "Antepastos"],
  },
];

export const CATEGORIAS_POR_SLUG: Record<string, Categoria> = Object.fromEntries(
  CATEGORIAS.map((c) => [c.slug, c]),
);

/**
 * Categoria especial: não guarda receitas próprias, agrupa as que estão
 * marcadas como `paraVender`.
 */
export const CATEGORIA_VENDER = {
  slug: "para-vender",
  nome: "Receitas para Vender",
  descricao: "Seleção de receitas com boa margem, produção em escala e saída rápida.",
  icone: "dinheiro",
  cor: "bg-money-50 text-money-700",
};
