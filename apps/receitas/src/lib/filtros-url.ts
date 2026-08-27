import type { FiltrosReceita } from "@/lib/queries";
import type { Dificuldade, Objetivo } from "@/lib/types";

/** Parâmetros de busca aceitos pelas telas de listagem. */
export type ParametrosBusca = Record<string, string | string[] | undefined>;

function texto(valor: string | string[] | undefined): string | undefined {
  if (Array.isArray(valor)) return valor[0];
  return valor || undefined;
}

function numero(valor: string | string[] | undefined): number | undefined {
  const bruto = texto(valor);
  if (!bruto) return undefined;
  const convertido = Number(bruto);
  return Number.isFinite(convertido) ? convertido : undefined;
}

const DIFICULDADES = new Set(["facil", "medio", "avancado"]);
const OBJETIVOS = new Set(["familia", "festa", "encomenda", "venda", "delivery"]);

/** Converte a query string da URL nos filtros usados pelas consultas. */
export function filtrosDaUrl(params: ParametrosBusca): FiltrosReceita {
  const dificuldade = texto(params.dificuldade);
  const objetivo = texto(params.objetivo);
  const tempo = numero(params.tempo);

  return {
    busca: texto(params.q),
    categoria: texto(params.categoria),
    subcategoria: texto(params.subcategoria),
    dificuldade: dificuldade && DIFICULDADES.has(dificuldade) ? (dificuldade as Dificuldade) : undefined,
    // "999" é a opção "acima de 1 hora": não vira teto de tempo.
    tempoMaximo: tempo && tempo < 999 ? tempo : undefined,
    objetivo: objetivo && OBJETIVOS.has(objetivo) ? (objetivo as Objetivo) : undefined,
    paraVender: texto(params.vender) === "1" ? true : undefined,
    investimentoMaximo: numero(params.investimento),
    pagina: numero(params.pagina) ?? 1,
    ordem: (texto(params.ordem) as FiltrosReceita["ordem"]) ?? "recentes",
  };
}

/** Recria a query string preservando os filtros e trocando a página. */
export function urlComPagina(params: ParametrosBusca, pagina: number, base: string): string {
  const query = new URLSearchParams();

  for (const [chave, valor] of Object.entries(params)) {
    const unico = Array.isArray(valor) ? valor[0] : valor;
    if (unico && chave !== "pagina") query.set(chave, unico);
  }

  if (pagina > 1) query.set("pagina", String(pagina));

  const texto = query.toString();
  return texto ? `${base}?${texto}` : base;
}
