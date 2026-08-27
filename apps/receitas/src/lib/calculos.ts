import { INSUMOS_POR_CHAVE } from "@/data/insumos";
import type { IngredienteReceita, PrecosUsuario, Receita } from "@/lib/types";

/**
 * Motor de cálculo da aplicação.
 *
 * Toda estimativa financeira daqui é SIMULAÇÃO: depende dos preços que o
 * usuário informa e das condições de venda dele. Nenhuma função promete
 * lucro nem garante resultado — os rótulos na interface deixam isso explícito.
 */

/** Preço da embalagem de um insumo: o do usuário, se houver, senão a referência. */
export function precoEmbalagem(chave: string, precos: PrecosUsuario = {}): number {
  const insumo = INSUMOS_POR_CHAVE[chave];
  if (!insumo) return 0;
  const personalizado = precos[chave];
  return typeof personalizado === "number" && personalizado >= 0 ? personalizado : insumo.precoRef;
}

/** Custo de um ingrediente na quantidade pedida, já com o fator de rendimento. */
export function custoIngrediente(
  ingrediente: IngredienteReceita,
  fator: number,
  precos: PrecosUsuario = {},
): number {
  const insumo = INSUMOS_POR_CHAVE[ingrediente.insumo];
  if (!insumo || insumo.embalagem <= 0) return 0;

  const quantidadeUsada = ingrediente.base * fator;
  return (quantidadeUsada / insumo.embalagem) * precoEmbalagem(ingrediente.insumo, precos);
}

export interface DetalheCusto {
  ingrediente: IngredienteReceita;
  nome: string;
  /** Quantidade na unidade base, já escalada. */
  quantidade: number;
  unidadeBase: "g" | "ml" | "un";
  custo: number;
  /** Quantas embalagens inteiras precisam ser compradas. */
  embalagensNecessarias: number;
}

export interface ResumoCusto {
  detalhes: DetalheCusto[];
  /** Soma do custo proporcional dos ingredientes obrigatórios. */
  custoIngredientes: number;
  /** Custo dos itens marcados como opcionais, informado à parte. */
  custoOpcionais: number;
  custoEmbalagem: number;
  outrosCustos: number;
  custoTotal: number;
  rendimento: number;
  custoPorUnidade: number;
}

export interface OpcoesCusto {
  /** Novo rendimento desejado. Se ausente, usa o rendimento original. */
  rendimento?: number;
  precos?: PrecosUsuario;
  /** Custos de gás, luz, transporte e mão de obra informados pelo usuário. */
  outrosCustos?: number;
  /** Sobrescreve o custo de embalagem por unidade da receita. */
  embalagemPorUnidade?: number;
  /** Inclui ingredientes opcionais no custo total. */
  incluirOpcionais?: boolean;
}

/** Fator de escala entre o rendimento desejado e o original da receita. */
export function fatorRendimento(receita: Receita, rendimento?: number): number {
  if (!rendimento || rendimento <= 0 || receita.rendimento <= 0) return 1;
  return rendimento / receita.rendimento;
}

/** Calcula o custo completo de uma produção. */
export function calcularCusto(receita: Receita, opcoes: OpcoesCusto = {}): ResumoCusto {
  const rendimento = opcoes.rendimento ?? receita.rendimento;
  const fator = fatorRendimento(receita, rendimento);
  const precos = opcoes.precos ?? {};

  const detalhes: DetalheCusto[] = receita.ingredientes.map((ingrediente) => {
    const insumo = INSUMOS_POR_CHAVE[ingrediente.insumo];
    const quantidade = ingrediente.base * fator;
    return {
      ingrediente,
      nome: insumo?.nome ?? ingrediente.insumo,
      quantidade,
      unidadeBase: insumo?.unidadeBase ?? "g",
      custo: custoIngrediente(ingrediente, fator, precos),
      embalagensNecessarias: insumo ? Math.ceil(quantidade / insumo.embalagem) : 0,
    };
  });

  const custoIngredientes = detalhes
    .filter((d) => !d.ingrediente.opcional)
    .reduce((soma, d) => soma + d.custo, 0);

  const custoOpcionais = detalhes
    .filter((d) => d.ingrediente.opcional)
    .reduce((soma, d) => soma + d.custo, 0);

  const embalagemUnitaria = opcoes.embalagemPorUnidade ?? receita.embalagemPorUnidade ?? 0;
  const custoEmbalagem = embalagemUnitaria * rendimento;
  const outrosCustos = opcoes.outrosCustos ?? 0;

  const custoTotal =
    custoIngredientes +
    (opcoes.incluirOpcionais ? custoOpcionais : 0) +
    custoEmbalagem +
    outrosCustos;

  return {
    detalhes,
    custoIngredientes,
    custoOpcionais,
    custoEmbalagem,
    outrosCustos,
    custoTotal,
    rendimento,
    custoPorUnidade: rendimento > 0 ? custoTotal / rendimento : 0,
  };
}

/**
 * Como o usuário quer pensar a margem:
 * - `markup`: percentual somado sobre o custo (o mais usado por quem começa);
 * - `margem`: percentual que sobra sobre o preço de venda.
 */
export type ModoMargem = "markup" | "margem";

export interface ResumoPreco {
  custoPorUnidade: number;
  precoSugerido: number;
  /** Lucro estimado por unidade, antes de impostos e taxas. */
  lucroPorUnidade: number;
  /** Percentual que o lucro representa sobre o preço de venda. */
  margemSobreVenda: number;
  /** Percentual acrescentado sobre o custo. */
  markupSobreCusto: number;
  faturamentoEstimado: number;
  lucroEstimado: number;
  custoTotal: number;
  quantidade: number;
}

/**
 * Preço sugerido a partir do custo unitário.
 *
 * No modo `margem`, uma margem de 100% seria divisão por zero: o valor é
 * limitado a 95% para o cálculo continuar fazendo sentido.
 */
export function calcularPreco(
  custoPorUnidade: number,
  quantidade: number,
  percentual: number,
  modo: ModoMargem = "markup",
): ResumoPreco {
  const custoTotal = custoPorUnidade * quantidade;

  let precoSugerido: number;
  if (modo === "margem") {
    const limitado = Math.min(Math.max(percentual, 0), 0.95);
    precoSugerido = custoPorUnidade / (1 - limitado);
  } else {
    precoSugerido = custoPorUnidade * (1 + Math.max(percentual, 0));
  }

  const lucroPorUnidade = precoSugerido - custoPorUnidade;
  const faturamentoEstimado = precoSugerido * quantidade;

  return {
    custoPorUnidade,
    precoSugerido,
    lucroPorUnidade,
    margemSobreVenda: precoSugerido > 0 ? lucroPorUnidade / precoSugerido : 0,
    markupSobreCusto: custoPorUnidade > 0 ? lucroPorUnidade / custoPorUnidade : 0,
    faturamentoEstimado,
    lucroEstimado: lucroPorUnidade * quantidade,
    custoTotal,
    quantidade,
  };
}

/** Arredonda para um preço "de vitrine": 4,73 vira 4,90; 12,20 vira 12,50. */
export function arredondarPrecoComercial(valor: number): number {
  if (valor <= 0) return 0;
  if (valor < 1) return Math.ceil(valor * 20) / 20; // múltiplos de 0,05
  if (valor < 10) return Math.ceil(valor * 10) / 10; // múltiplos de 0,10
  if (valor < 100) return Math.ceil(valor * 2) / 2; // múltiplos de 0,50
  return Math.ceil(valor);
}

export interface SimulacaoProducao {
  receita: Receita;
  /** Quantas unidades cabem no valor disponível para investir. */
  quantidadePossivel: number;
  custoTotal: number;
  custoPorUnidade: number;
  precoSugerido: number;
  faturamentoEstimado: number;
  lucroEstimado: number;
  /** Sobra do investimento que não completou outra receita cheia. */
  sobra: number;
}

/**
 * Simula o que dá para produzir com um valor disponível.
 *
 * Trabalha em múltiplos da receita inteira: ninguém compra meia lata de leite
 * condensado, e é isso que torna a simulação utilizável na prática.
 */
export function simularProducao(
  receita: Receita,
  investimento: number,
  precos: PrecosUsuario = {},
): SimulacaoProducao {
  const base = calcularCusto(receita, { precos });
  const custoDaReceita = base.custoTotal;

  const multiplos = custoDaReceita > 0 ? Math.floor(investimento / custoDaReceita) : 0;
  const vezes = Math.max(multiplos, 0);

  const quantidadePossivel = vezes * receita.rendimento;
  const custoTotal = vezes * custoDaReceita;
  const custoPorUnidade = base.custoPorUnidade;

  const margem = receita.margemSugerida ?? 0.7;
  const precoSugerido = arredondarPrecoComercial(custoPorUnidade * (1 + margem));

  return {
    receita,
    quantidadePossivel,
    custoTotal,
    custoPorUnidade,
    precoSugerido,
    faturamentoEstimado: precoSugerido * quantidadePossivel,
    lucroEstimado: (precoSugerido - custoPorUnidade) * quantidadePossivel,
    sobra: investimento - custoTotal,
  };
}

export interface SimulacaoObjetivo {
  receita: Receita;
  /** Unidades que precisam ser vendidas para atingir o objetivo. */
  unidadesNecessarias: number;
  /** Quantas vezes a receita precisa ser produzida. */
  producoesNecessarias: number;
  custoTotal: number;
  precoSugerido: number;
  faturamentoEstimado: number;
  lucroEstimado: number;
}

/** Simula quanto é preciso produzir para faturar (ou vender) um alvo. */
export function simularObjetivo(
  receita: Receita,
  alvo: number,
  tipo: "faturamento" | "unidades",
  precos: PrecosUsuario = {},
): SimulacaoObjetivo {
  const base = calcularCusto(receita, { precos });
  const margem = receita.margemSugerida ?? 0.7;
  const precoSugerido = arredondarPrecoComercial(base.custoPorUnidade * (1 + margem));

  const unidadesNecessarias =
    tipo === "unidades" ? Math.ceil(alvo) : precoSugerido > 0 ? Math.ceil(alvo / precoSugerido) : 0;

  const producoesNecessarias =
    receita.rendimento > 0 ? Math.ceil(unidadesNecessarias / receita.rendimento) : 0;

  const custoTotal = producoesNecessarias * base.custoTotal;
  const faturamentoEstimado = precoSugerido * unidadesNecessarias;

  return {
    receita,
    unidadesNecessarias,
    producoesNecessarias,
    custoTotal,
    precoSugerido,
    faturamentoEstimado,
    lucroEstimado: faturamentoEstimado - custoTotal,
  };
}

/** Custo estimado de uma receita com os preços de referência, para vitrines. */
export function custoReferencia(receita: Receita, precos: PrecosUsuario = {}): number {
  return calcularCusto(receita, { precos }).custoTotal;
}
