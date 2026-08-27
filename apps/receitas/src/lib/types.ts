/**
 * Tipos centrais da Central de Receitas & Renda.
 *
 * O mesmo formato serve para os dados que vêm do Supabase e para o catálogo
 * curado em `src/data`, que alimenta o seed do banco e a demonstração pública.
 */

export type Dificuldade = "facil" | "medio" | "avancado";

export type Objetivo = "familia" | "festa" | "encomenda" | "venda" | "delivery";

/** Grandes áreas de produção usadas na Central de Renda e no onboarding. */
export type LinhaProducao =
  | "doces"
  | "bolos"
  | "salgados"
  | "paes"
  | "sorvetes"
  | "picoles"
  | "geladinhos"
  | "sobremesas"
  | "outros";

export type CanalVenda =
  | "whatsapp"
  | "vizinhanca"
  | "trabalho"
  | "escola"
  | "eventos"
  | "encomendas"
  | "delivery";

/**
 * Insumo do catálogo de compras.
 *
 * `embalagem` é o tamanho vendido no mercado, na `unidadeBase`. O preço de
 * referência é uma média de mercado editável pelo usuário: serve de ponto de
 * partida das calculadoras, nunca como preço garantido.
 */
export interface Insumo {
  chave: string;
  nome: string;
  /** Unidade em que o insumo é medido nas receitas: g, ml ou un. */
  unidadeBase: "g" | "ml" | "un";
  /** Quantidade que vem na embalagem vendida (ex.: 395 para uma lata). */
  embalagem: number;
  /** Como a embalagem aparece no mercado, ex.: "lata de 395 g". */
  embalagemRotulo: string;
  /** Preço médio de referência da embalagem, em reais. */
  precoRef: number;
  /** Seção do mercado, usada para agrupar a lista de compras. */
  secao: SecaoMercado;
}

export type SecaoMercado =
  | "mercearia"
  | "laticinios"
  | "hortifruti"
  | "carnes"
  | "confeitaria"
  | "embalagens"
  | "outros";

/** Ingrediente dentro de uma receita, na quantidade da receita original. */
export interface IngredienteReceita {
  /** Chave do insumo no catálogo — liga a receita ao preço. */
  insumo: string;
  /** Quantidade na medida de exibição (ex.: 2, de "2 xícaras"). */
  qtd: number;
  /** Medida de exibição: "xícara (chá)", "lata", "colher (sopa)", "g", "unidade". */
  unidade: string;
  /** Equivalente da quantidade acima na unidade base do insumo, para o custo. */
  base: number;
  /** Subdivisão da receita: "Massa", "Recheio", "Cobertura"... */
  grupo?: string;
  /** Observação curta, ex.: "em temperatura ambiente". */
  observacao?: string;
  /** Ingredientes opcionais não entram no custo obrigatório. */
  opcional?: boolean;
}

export interface PassoPreparo {
  titulo?: string;
  texto: string;
}

export interface Receita {
  id: string;
  slug: string;
  nome: string;
  descricao: string;
  categoria: string;
  subcategoria?: string;
  imagem?: string;
  /** Tempo total de preparo em minutos. */
  tempoMinutos: number;
  dificuldade: Dificuldade;
  rendimento: number;
  /** Unidade do rendimento: "unidades", "porções", "potes", "fatias". */
  rendimentoUnidade: string;
  ingredientes: IngredienteReceita[];
  preparo: PassoPreparo[];
  dicas: string[];
  conservacao: string;
  equipamentos: string[];
  tags: string[];
  objetivos: Objetivo[];
  linha: LinhaProducao;
  /** Receita selecionada para produção comercial. */
  paraVender: boolean;
  /** Custo médio estimado de embalagem por unidade produzida, em reais. */
  embalagemPorUnidade?: number;
  /** Margem de lucro sugerida para esta receita (ex.: 0.7 = 70%). */
  margemSugerida?: number;
  /**
   * Custo total da receita com os preços de referência, gravado no banco.
   * Existe para permitir filtrar por faixa de investimento sem recalcular
   * todas as receitas a cada consulta.
   */
  custoEstimado?: number;
  /** ISO date. Alimenta a seção de novidades e o selo "Novo". */
  publicadaEm: string;
  /** Enquanto for futura, a receita aparece como novidade. */
  novidadeAte?: string;
  publicada: boolean;
  destaque?: boolean;
}

export interface Categoria {
  slug: string;
  nome: string;
  descricao: string;
  /** Nome do ícone em `components/ui/Icone.tsx`. */
  icone: string;
  /** Classe de cor pastel do cartão da categoria. */
  cor: string;
  subcategorias: string[];
  ordem: number;
}

/* ---------------------------------------------------------------------------
 * Dados do usuário
 * ------------------------------------------------------------------------ */

export interface ItemListaCompras {
  id: string;
  insumo: string;
  /** Quantidade total consolidada, na unidade base do insumo. */
  base: number;
  comprado: boolean;
  /** Receitas que pediram este ingrediente. */
  origens: string[];
  /** Item digitado à mão pelo usuário, fora do catálogo. */
  manual?: string;
}

export interface Colecao {
  id: string;
  nome: string;
  receitas: string[];
  /** Coleções padrão não podem ser excluídas. */
  fixa?: boolean;
}

export interface PerfilOnboarding {
  objetivo: "cozinhar" | "aprender" | "vender" | "produzir" | "economizar";
  investimento: number;
  linhas: LinhaProducao[];
  concluido: boolean;
}

/** Preços de insumos personalizados pelo usuário, por chave de insumo. */
export type PrecosUsuario = Record<string, number>;

export interface CalculoSalvo {
  id: string;
  tipo: "custo" | "preco";
  receitaSlug?: string;
  rotulo: string;
  /** Resumo já calculado, guardado para o histórico do painel. */
  resumo: Record<string, number>;
  criadoEm: string;
}

/** Perfil do usuário na aplicação (espelha a tabela `profiles`). */
export interface Perfil {
  id: string;
  nome: string | null;
  email: string | null;
  papel: "cliente" | "admin";
  /** Situação do acesso, controlada pelo webhook da plataforma de venda. */
  acesso: "ativo" | "suspenso" | "cancelado";
  plano: string | null;
  criadoEm: string;
  ultimoAcesso: string | null;
}
