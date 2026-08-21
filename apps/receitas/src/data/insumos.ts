import type { Insumo } from "@/lib/types";

/**
 * Catálogo de insumos com preço médio de referência (Brasil).
 *
 * IMPORTANTE: estes valores são uma REFERÊNCIA de partida para as
 * calculadoras, não uma cotação. O usuário pode substituir cada preço pelo
 * que paga no mercado dele em "Meus preços", e é esse valor que passa a
 * valer nos cálculos. Ao atualizar esta tabela, revise `docs/MANUTENCAO.md`.
 */
export const INSUMOS: Insumo[] = [
  // ---------------------------------------------------------------- mercearia
  { chave: "leite-condensado", nome: "Leite condensado", unidadeBase: "g", embalagem: 395, embalagemRotulo: "lata de 395 g", precoRef: 7.5, secao: "mercearia" },
  { chave: "creme-de-leite", nome: "Creme de leite", unidadeBase: "g", embalagem: 200, embalagemRotulo: "caixa de 200 g", precoRef: 4.5, secao: "mercearia" },
  { chave: "acucar-refinado", nome: "Açúcar refinado", unidadeBase: "g", embalagem: 1000, embalagemRotulo: "pacote de 1 kg", precoRef: 5.0, secao: "mercearia" },
  { chave: "acucar-cristal", nome: "Açúcar cristal", unidadeBase: "g", embalagem: 1000, embalagemRotulo: "pacote de 1 kg", precoRef: 4.5, secao: "mercearia" },
  { chave: "acucar-confeiteiro", nome: "Açúcar de confeiteiro", unidadeBase: "g", embalagem: 500, embalagemRotulo: "pacote de 500 g", precoRef: 7.5, secao: "mercearia" },
  { chave: "farinha-trigo", nome: "Farinha de trigo", unidadeBase: "g", embalagem: 1000, embalagemRotulo: "pacote de 1 kg", precoRef: 5.5, secao: "mercearia" },
  { chave: "farinha-trigo-fermentada", nome: "Farinha de trigo com fermento", unidadeBase: "g", embalagem: 1000, embalagemRotulo: "pacote de 1 kg", precoRef: 6.5, secao: "mercearia" },
  { chave: "amido-milho", nome: "Amido de milho", unidadeBase: "g", embalagem: 500, embalagemRotulo: "caixa de 500 g", precoRef: 8.0, secao: "mercearia" },
  { chave: "fuba", nome: "Fubá", unidadeBase: "g", embalagem: 500, embalagemRotulo: "pacote de 500 g", precoRef: 4.0, secao: "mercearia" },
  { chave: "polvilho-doce", nome: "Polvilho doce", unidadeBase: "g", embalagem: 500, embalagemRotulo: "pacote de 500 g", precoRef: 7.0, secao: "mercearia" },
  { chave: "polvilho-azedo", nome: "Polvilho azedo", unidadeBase: "g", embalagem: 500, embalagemRotulo: "pacote de 500 g", precoRef: 7.5, secao: "mercearia" },
  { chave: "oleo-soja", nome: "Óleo de soja", unidadeBase: "ml", embalagem: 900, embalagemRotulo: "garrafa de 900 ml", precoRef: 8.0, secao: "mercearia" },
  { chave: "fermento-quimico", nome: "Fermento em pó", unidadeBase: "g", embalagem: 100, embalagemRotulo: "pote de 100 g", precoRef: 6.0, secao: "mercearia" },
  { chave: "fermento-biologico", nome: "Fermento biológico seco", unidadeBase: "g", embalagem: 10, embalagemRotulo: "sachê de 10 g", precoRef: 3.0, secao: "mercearia" },
  { chave: "sal", nome: "Sal", unidadeBase: "g", embalagem: 1000, embalagemRotulo: "pacote de 1 kg", precoRef: 3.0, secao: "mercearia" },
  { chave: "chocolate-po", nome: "Chocolate em pó 50%", unidadeBase: "g", embalagem: 200, embalagemRotulo: "pacote de 200 g", precoRef: 12.0, secao: "mercearia" },
  { chave: "achocolatado", nome: "Achocolatado em pó", unidadeBase: "g", embalagem: 400, embalagemRotulo: "pote de 400 g", precoRef: 9.0, secao: "mercearia" },
  { chave: "cacau-po", nome: "Cacau em pó 100%", unidadeBase: "g", embalagem: 200, embalagemRotulo: "pacote de 200 g", precoRef: 18.0, secao: "mercearia" },
  { chave: "leite-po", nome: "Leite em pó integral", unidadeBase: "g", embalagem: 400, embalagemRotulo: "pacote de 400 g", precoRef: 18.0, secao: "mercearia" },
  { chave: "coco-ralado", nome: "Coco ralado", unidadeBase: "g", embalagem: 100, embalagemRotulo: "pacote de 100 g", precoRef: 6.0, secao: "mercearia" },
  { chave: "leite-coco", nome: "Leite de coco", unidadeBase: "ml", embalagem: 200, embalagemRotulo: "vidro de 200 ml", precoRef: 5.5, secao: "mercearia" },
  { chave: "aveia", nome: "Aveia em flocos", unidadeBase: "g", embalagem: 200, embalagemRotulo: "pacote de 200 g", precoRef: 7.0, secao: "mercearia" },
  { chave: "amendoim", nome: "Amendoim torrado", unidadeBase: "g", embalagem: 500, embalagemRotulo: "pacote de 500 g", precoRef: 14.0, secao: "mercearia" },
  { chave: "castanha-caju", nome: "Castanha de caju", unidadeBase: "g", embalagem: 200, embalagemRotulo: "pacote de 200 g", precoRef: 24.0, secao: "mercearia" },
  { chave: "nozes", nome: "Nozes picadas", unidadeBase: "g", embalagem: 100, embalagemRotulo: "pacote de 100 g", precoRef: 18.0, secao: "mercearia" },
  { chave: "gelatina-incolor", nome: "Gelatina sem sabor", unidadeBase: "g", embalagem: 12, embalagemRotulo: "caixa de 12 g", precoRef: 6.0, secao: "mercearia" },
  { chave: "gelatina-sabor", nome: "Gelatina em pó (sabor)", unidadeBase: "g", embalagem: 25, embalagemRotulo: "caixa de 25 g", precoRef: 3.5, secao: "mercearia" },
  { chave: "biscoito-maisena", nome: "Biscoito maisena", unidadeBase: "g", embalagem: 400, embalagemRotulo: "pacote de 400 g", precoRef: 7.0, secao: "mercearia" },
  { chave: "biscoito-chocolate", nome: "Biscoito de chocolate", unidadeBase: "g", embalagem: 130, embalagemRotulo: "pacote de 130 g", precoRef: 6.5, secao: "mercearia" },
  { chave: "vinagre", nome: "Vinagre", unidadeBase: "ml", embalagem: 500, embalagemRotulo: "garrafa de 500 ml", precoRef: 4.0, secao: "mercearia" },
  { chave: "extrato-tomate", nome: "Extrato de tomate", unidadeBase: "g", embalagem: 340, embalagemRotulo: "lata de 340 g", precoRef: 5.0, secao: "mercearia" },
  { chave: "molho-tomate", nome: "Molho de tomate", unidadeBase: "g", embalagem: 340, embalagemRotulo: "sachê de 340 g", precoRef: 3.5, secao: "mercearia" },
  { chave: "farinha-rosca", nome: "Farinha de rosca", unidadeBase: "g", embalagem: 500, embalagemRotulo: "pacote de 500 g", precoRef: 9.0, secao: "mercearia" },
  { chave: "trigo-quibe", nome: "Trigo para quibe", unidadeBase: "g", embalagem: 500, embalagemRotulo: "pacote de 500 g", precoRef: 9.5, secao: "mercearia" },
  { chave: "essencia-baunilha", nome: "Essência de baunilha", unidadeBase: "ml", embalagem: 30, embalagemRotulo: "vidro de 30 ml", precoRef: 6.0, secao: "mercearia" },
  { chave: "mel", nome: "Mel", unidadeBase: "g", embalagem: 300, embalagemRotulo: "pote de 300 g", precoRef: 22.0, secao: "mercearia" },
  { chave: "cafe-soluvel", nome: "Café solúvel", unidadeBase: "g", embalagem: 50, embalagemRotulo: "vidro de 50 g", precoRef: 12.0, secao: "mercearia" },
  { chave: "canela-po", nome: "Canela em pó", unidadeBase: "g", embalagem: 30, embalagemRotulo: "pote de 30 g", precoRef: 5.0, secao: "mercearia" },
  { chave: "cravo", nome: "Cravo-da-índia", unidadeBase: "g", embalagem: 20, embalagemRotulo: "pote de 20 g", precoRef: 5.0, secao: "mercearia" },
  { chave: "erva-doce", nome: "Erva-doce", unidadeBase: "g", embalagem: 20, embalagemRotulo: "pote de 20 g", precoRef: 4.5, secao: "mercearia" },
  { chave: "caldo-galinha", nome: "Caldo de galinha", unidadeBase: "g", embalagem: 57, embalagemRotulo: "caixa com 6 tabletes", precoRef: 4.5, secao: "mercearia" },
  { chave: "azeite", nome: "Azeite de oliva", unidadeBase: "ml", embalagem: 500, embalagemRotulo: "garrafa de 500 ml", precoRef: 28.0, secao: "mercearia" },
  { chave: "tapioca-granulada", nome: "Tapioca granulada", unidadeBase: "g", embalagem: 500, embalagemRotulo: "pacote de 500 g", precoRef: 8.0, secao: "mercearia" },
  { chave: "doce-leite", nome: "Doce de leite", unidadeBase: "g", embalagem: 400, embalagemRotulo: "pote de 400 g", precoRef: 14.0, secao: "mercearia" },
  { chave: "creme-avela", nome: "Creme de avelã", unidadeBase: "g", embalagem: 140, embalagemRotulo: "pote de 140 g", precoRef: 15.0, secao: "mercearia" },
  { chave: "suco-po", nome: "Suco em pó", unidadeBase: "g", embalagem: 25, embalagemRotulo: "sachê de 25 g", precoRef: 1.5, secao: "mercearia" },
  { chave: "emulsificante", nome: "Emulsificante para sorvete", unidadeBase: "g", embalagem: 200, embalagemRotulo: "pote de 200 g", precoRef: 12.0, secao: "confeitaria" },
  { chave: "liga-neutra", nome: "Liga neutra", unidadeBase: "g", embalagem: 100, embalagemRotulo: "pote de 100 g", precoRef: 11.0, secao: "confeitaria" },

  // --------------------------------------------------------------- laticínios
  { chave: "leite", nome: "Leite integral", unidadeBase: "ml", embalagem: 1000, embalagemRotulo: "caixa de 1 L", precoRef: 5.0, secao: "laticinios" },
  { chave: "manteiga", nome: "Manteiga", unidadeBase: "g", embalagem: 200, embalagemRotulo: "pote de 200 g", precoRef: 11.0, secao: "laticinios" },
  { chave: "margarina", nome: "Margarina", unidadeBase: "g", embalagem: 500, embalagemRotulo: "pote de 500 g", precoRef: 8.5, secao: "laticinios" },
  { chave: "ovo", nome: "Ovos", unidadeBase: "un", embalagem: 12, embalagemRotulo: "cartela com 12", precoRef: 12.0, secao: "laticinios" },
  { chave: "requeijao", nome: "Requeijão cremoso", unidadeBase: "g", embalagem: 200, embalagemRotulo: "copo de 200 g", precoRef: 8.0, secao: "laticinios" },
  { chave: "catupiry", nome: "Requeijão tipo catupiry", unidadeBase: "g", embalagem: 200, embalagemRotulo: "bisnaga de 200 g", precoRef: 11.0, secao: "laticinios" },
  { chave: "cream-cheese", nome: "Cream cheese", unidadeBase: "g", embalagem: 150, embalagemRotulo: "pote de 150 g", precoRef: 12.0, secao: "laticinios" },
  { chave: "queijo-mussarela", nome: "Queijo mussarela", unidadeBase: "g", embalagem: 500, embalagemRotulo: "peça de 500 g", precoRef: 24.0, secao: "laticinios" },
  { chave: "queijo-minas", nome: "Queijo minas padrão", unidadeBase: "g", embalagem: 500, embalagemRotulo: "peça de 500 g", precoRef: 26.0, secao: "laticinios" },
  { chave: "queijo-parmesao", nome: "Queijo parmesão ralado", unidadeBase: "g", embalagem: 100, embalagemRotulo: "pacote de 100 g", precoRef: 9.0, secao: "laticinios" },
  { chave: "iogurte-natural", nome: "Iogurte natural", unidadeBase: "g", embalagem: 170, embalagemRotulo: "pote de 170 g", precoRef: 4.0, secao: "laticinios" },
  { chave: "creme-leite-fresco", nome: "Creme de leite fresco", unidadeBase: "ml", embalagem: 500, embalagemRotulo: "caixa de 500 ml", precoRef: 22.0, secao: "laticinios" },

  // -------------------------------------------------------------- confeitaria
  { chave: "chocolate-granulado", nome: "Chocolate granulado", unidadeBase: "g", embalagem: 500, embalagemRotulo: "pacote de 500 g", precoRef: 15.0, secao: "confeitaria" },
  { chave: "granulado-macio", nome: "Granulado macio", unidadeBase: "g", embalagem: 500, embalagemRotulo: "pacote de 500 g", precoRef: 22.0, secao: "confeitaria" },
  { chave: "chocolate-meio-amargo", nome: "Chocolate meio amargo", unidadeBase: "g", embalagem: 1000, embalagemRotulo: "barra de 1 kg", precoRef: 58.0, secao: "confeitaria" },
  { chave: "chocolate-ao-leite", nome: "Chocolate ao leite", unidadeBase: "g", embalagem: 1000, embalagemRotulo: "barra de 1 kg", precoRef: 56.0, secao: "confeitaria" },
  { chave: "chocolate-branco", nome: "Chocolate branco", unidadeBase: "g", embalagem: 1000, embalagemRotulo: "barra de 1 kg", precoRef: 60.0, secao: "confeitaria" },
  { chave: "chantilly", nome: "Chantilly", unidadeBase: "ml", embalagem: 1000, embalagemRotulo: "caixa de 1 L", precoRef: 20.0, secao: "confeitaria" },
  { chave: "corante", nome: "Corante alimentício", unidadeBase: "ml", embalagem: 10, embalagemRotulo: "vidro de 10 ml", precoRef: 5.0, secao: "confeitaria" },
  { chave: "confeitos", nome: "Confeitos coloridos", unidadeBase: "g", embalagem: 100, embalagemRotulo: "pote de 100 g", precoRef: 8.0, secao: "confeitaria" },

  // --------------------------------------------------------------- hortifruti
  { chave: "morango", nome: "Morango", unidadeBase: "g", embalagem: 300, embalagemRotulo: "bandeja de 300 g", precoRef: 12.0, secao: "hortifruti" },
  { chave: "banana", nome: "Banana", unidadeBase: "un", embalagem: 12, embalagemRotulo: "dúzia", precoRef: 8.0, secao: "hortifruti" },
  { chave: "cenoura", nome: "Cenoura", unidadeBase: "g", embalagem: 1000, embalagemRotulo: "1 kg", precoRef: 6.0, secao: "hortifruti" },
  { chave: "limao", nome: "Limão", unidadeBase: "un", embalagem: 6, embalagemRotulo: "pacote com 6", precoRef: 5.0, secao: "hortifruti" },
  { chave: "laranja", nome: "Laranja", unidadeBase: "un", embalagem: 12, embalagemRotulo: "dúzia", precoRef: 9.0, secao: "hortifruti" },
  { chave: "maracuja", nome: "Maracujá", unidadeBase: "un", embalagem: 6, embalagemRotulo: "pacote com 6", precoRef: 12.0, secao: "hortifruti" },
  { chave: "abacaxi", nome: "Abacaxi", unidadeBase: "un", embalagem: 1, embalagemRotulo: "unidade", precoRef: 8.0, secao: "hortifruti" },
  { chave: "manga", nome: "Manga", unidadeBase: "un", embalagem: 1, embalagemRotulo: "unidade", precoRef: 5.0, secao: "hortifruti" },
  { chave: "uva", nome: "Uva", unidadeBase: "g", embalagem: 500, embalagemRotulo: "bandeja de 500 g", precoRef: 14.0, secao: "hortifruti" },
  { chave: "batata", nome: "Batata", unidadeBase: "g", embalagem: 1000, embalagemRotulo: "1 kg", precoRef: 6.0, secao: "hortifruti" },
  { chave: "cebola", nome: "Cebola", unidadeBase: "g", embalagem: 1000, embalagemRotulo: "1 kg", precoRef: 6.5, secao: "hortifruti" },
  { chave: "alho", nome: "Alho", unidadeBase: "g", embalagem: 100, embalagemRotulo: "cabeça de 100 g", precoRef: 4.0, secao: "hortifruti" },
  { chave: "tomate", nome: "Tomate", unidadeBase: "g", embalagem: 1000, embalagemRotulo: "1 kg", precoRef: 8.0, secao: "hortifruti" },
  { chave: "cheiro-verde", nome: "Cheiro-verde", unidadeBase: "g", embalagem: 100, embalagemRotulo: "maço de 100 g", precoRef: 3.5, secao: "hortifruti" },
  { chave: "milho-verde", nome: "Milho verde em conserva", unidadeBase: "g", embalagem: 200, embalagemRotulo: "lata de 200 g", precoRef: 4.5, secao: "mercearia" },
  { chave: "azeitona", nome: "Azeitona picada", unidadeBase: "g", embalagem: 200, embalagemRotulo: "vidro de 200 g", precoRef: 8.0, secao: "mercearia" },

  // ------------------------------------------------------------------- carnes
  { chave: "peito-frango", nome: "Peito de frango", unidadeBase: "g", embalagem: 1000, embalagemRotulo: "1 kg", precoRef: 18.0, secao: "carnes" },
  { chave: "carne-moida", nome: "Carne moída", unidadeBase: "g", embalagem: 1000, embalagemRotulo: "1 kg", precoRef: 32.0, secao: "carnes" },
  { chave: "presunto", nome: "Presunto fatiado", unidadeBase: "g", embalagem: 200, embalagemRotulo: "pacote de 200 g", precoRef: 9.0, secao: "carnes" },
  { chave: "calabresa", nome: "Linguiça calabresa", unidadeBase: "g", embalagem: 400, embalagemRotulo: "peça de 400 g", precoRef: 16.0, secao: "carnes" },

  // --------------------------------------------------------------- embalagens
  { chave: "forminha-doce", nome: "Forminha de papel para doces", unidadeBase: "un", embalagem: 100, embalagemRotulo: "pacote com 100", precoRef: 8.0, secao: "embalagens" },
  { chave: "pote-250", nome: "Pote plástico 250 ml com tampa", unidadeBase: "un", embalagem: 50, embalagemRotulo: "pacote com 50", precoRef: 32.0, secao: "embalagens" },
  { chave: "pote-180", nome: "Pote plástico 180 ml com tampa", unidadeBase: "un", embalagem: 50, embalagemRotulo: "pacote com 50", precoRef: 26.0, secao: "embalagens" },
  { chave: "saco-picole", nome: "Saquinho para picolé", unidadeBase: "un", embalagem: 100, embalagemRotulo: "pacote com 100", precoRef: 12.0, secao: "embalagens" },
  { chave: "saco-geladinho", nome: "Saquinho para geladinho", unidadeBase: "un", embalagem: 100, embalagemRotulo: "pacote com 100", precoRef: 9.0, secao: "embalagens" },
  { chave: "palito-picole", nome: "Palito de picolé", unidadeBase: "un", embalagem: 100, embalagemRotulo: "pacote com 100", precoRef: 7.0, secao: "embalagens" },
  { chave: "caixa-bolo", nome: "Caixa para bolo", unidadeBase: "un", embalagem: 10, embalagemRotulo: "pacote com 10", precoRef: 25.0, secao: "embalagens" },
  { chave: "embalagem-salgado", nome: "Embalagem para salgados", unidadeBase: "un", embalagem: 100, embalagemRotulo: "pacote com 100", precoRef: 18.0, secao: "embalagens" },
  { chave: "saco-pao", nome: "Saco de papel para pão", unidadeBase: "un", embalagem: 100, embalagemRotulo: "pacote com 100", precoRef: 14.0, secao: "embalagens" },
];

/** Índice por chave, para busca direta. */
export const INSUMOS_POR_CHAVE: Record<string, Insumo> = Object.fromEntries(
  INSUMOS.map((i) => [i.chave, i]),
);

/** Nomes amigáveis das seções, usados na lista de compras. */
export const NOMES_SECAO: Record<string, string> = {
  mercearia: "Mercearia",
  laticinios: "Laticínios e ovos",
  hortifruti: "Hortifrúti",
  carnes: "Carnes e frios",
  confeitaria: "Confeitaria",
  embalagens: "Embalagens",
  outros: "Outros",
};
