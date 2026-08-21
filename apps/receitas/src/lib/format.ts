/** Formatação de números, dinheiro, tempo e medidas caseiras. */

const MOEDA = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const NUMERO = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 0 });

export function formatarMoeda(valor: number): string {
  if (!Number.isFinite(valor)) return "—";
  return MOEDA.format(valor);
}

export function formatarNumero(valor: number): string {
  if (!Number.isFinite(valor)) return "—";
  return NUMERO.format(valor);
}

export function formatarPercentual(fracao: number): string {
  if (!Number.isFinite(fracao)) return "—";
  return `${Math.round(fracao * 100)}%`;
}

/** "1h30", "45 min", "2h". */
export function formatarTempo(minutos: number): string {
  if (minutos < 60) return `${minutos} min`;
  const horas = Math.floor(minutos / 60);
  const resto = minutos % 60;
  return resto === 0 ? `${horas}h` : `${horas}h${String(resto).padStart(2, "0")}`;
}

const FRACOES: Array<[number, string]> = [
  [0.25, "¼"],
  [0.33, "⅓"],
  [0.5, "½"],
  [0.66, "⅔"],
  [0.75, "¾"],
];

/**
 * Converte um número em medida caseira legível: 0,5 vira "½" e 2,5 vira "2½".
 * Acima de 10 arredonda para inteiro, porque meia colher em 40 unidades
 * não muda o resultado e só atrapalha a leitura.
 */
export function formatarQuantidade(valor: number): string {
  if (!Number.isFinite(valor) || valor <= 0) return "0";
  if (valor >= 10) return String(Math.round(valor));

  const inteiro = Math.floor(valor);
  const resto = valor - inteiro;

  if (resto < 0.08) return String(inteiro || 0);

  for (const [fracao, simbolo] of FRACOES) {
    if (Math.abs(resto - fracao) < 0.09) {
      return inteiro > 0 ? `${inteiro}${simbolo}` : simbolo;
    }
  }

  return valor.toFixed(1).replace(".", ",").replace(",0", "");
}

/** Pluraliza a unidade de medida quando a quantidade passa de 1. */
export function pluralizarUnidade(unidade: string, qtd: number): string {
  if (qtd <= 1) return unidade;

  const irregulares: Record<string, string> = {
    "colher (sopa)": "colheres (sopa)",
    "colher (chá)": "colheres (chá)",
    "xícara (chá)": "xícaras (chá)",
    unidade: "unidades",
    lata: "latas",
    caixa: "caixas",
    pote: "potes",
    sachê: "sachês",
    tablete: "tabletes",
    pacote: "pacotes",
    dente: "dentes",
  };

  if (irregulares[unidade]) return irregulares[unidade];
  // g, ml, kg e afins não pluralizam.
  if (["g", "ml", "kg", "l", "L"].includes(unidade)) return unidade;
  return `${unidade}s`;
}

/** Mostra a quantidade base em g/ml/un de forma limpa: "790 g", "1,2 kg". */
export function formatarBase(base: number, unidadeBase: "g" | "ml" | "un"): string {
  if (unidadeBase === "un") {
    return `${formatarQuantidade(base)} un`;
  }
  if (base >= 1000) {
    const grande = base / 1000;
    const rotulo = unidadeBase === "g" ? "kg" : "L";
    return `${grande.toFixed(grande % 1 === 0 ? 0 : 1).replace(".", ",")} ${rotulo}`;
  }
  return `${Math.round(base)} ${unidadeBase}`;
}

export const ROTULO_DIFICULDADE: Record<string, string> = {
  facil: "Fácil",
  medio: "Médio",
  avancado: "Avançado",
};

export const ROTULO_OBJETIVO: Record<string, string> = {
  familia: "Família",
  festa: "Festa",
  encomenda: "Encomenda",
  venda: "Venda",
  delivery: "Delivery",
};

export const ROTULO_LINHA: Record<string, string> = {
  doces: "Doces",
  bolos: "Bolos",
  salgados: "Salgados",
  paes: "Pães",
  sorvetes: "Sorvetes",
  picoles: "Picolés",
  geladinhos: "Geladinhos",
  sobremesas: "Sobremesas",
  outros: "Outros",
};

export const ROTULO_CANAL: Record<string, string> = {
  whatsapp: "WhatsApp",
  vizinhanca: "Vizinhança",
  trabalho: "Trabalho",
  escola: "Escola",
  eventos: "Eventos",
  encomendas: "Encomendas",
  delivery: "Delivery",
};

/** "Hoje", "Ontem", "Há 3 dias", "12 de agosto". */
export function formatarDataRelativa(iso: string): string {
  const data = new Date(iso);
  if (Number.isNaN(data.getTime())) return "";

  const hoje = new Date();
  const dias = Math.floor((hoje.getTime() - data.getTime()) / 86_400_000);

  if (dias <= 0) return "Hoje";
  if (dias === 1) return "Ontem";
  if (dias < 7) return `Há ${dias} dias`;
  if (dias < 14) return "Há 1 semana";
  if (dias < 30) return `Há ${Math.floor(dias / 7)} semanas`;

  return data.toLocaleDateString("pt-BR", { day: "numeric", month: "long" });
}
