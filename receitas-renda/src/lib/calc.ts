// Motor de cálculo de custo, preço e lucro — usado no /app (ficha da receita,
// calculadoras) e no /admin (formulário de receitas). Centralizado aqui para
// que uma alteração de preço de ingrediente recalcule tudo de forma idêntica
// nos dois ambientes.
import type { Recipe, RecipeIngredient } from './types';

export type RecipeCostBreakdown = {
  yield: number;
  ingredientsCost: number;
  ingredientsCostPerUnit: number;
  packagingCost: number;
  otherCosts: number;
  totalCost: number;
  costPerUnit: number;
  marginPercent: number;
  suggestedPricePerUnit: number;
  revenue: number;
  profit: number;
};

/**
 * Calcula o custo total dos ingredientes para um dado rendimento-alvo,
 * a partir da lista de ingredientes na quantidade-base da receita.
 */
export function calcIngredientsCost(
  recipeIngredients: RecipeIngredient[],
  baseYield: number,
  targetYield: number
): number {
  const scale = baseYield > 0 ? targetYield / baseYield : 1;
  return recipeIngredients.reduce((sum, ri) => {
    const pricePerUnit = ri.ingredient?.price_per_unit ?? 0;
    return sum + pricePerUnit * ri.base_quantity * scale;
  }, 0);
}

/**
 * Escala a quantidade de um ingrediente conforme o rendimento ajustado
 * pelo usuário na tela da receita.
 */
export function scaleQuantity(baseQuantity: number, baseYield: number, targetYield: number): number {
  if (baseYield <= 0) return baseQuantity;
  return baseQuantity * (targetYield / baseYield);
}

/**
 * Resumo completo de custo/preço/lucro de uma receita, para um rendimento
 * opcionalmente diferente do rendimento base cadastrado.
 */
export function calcRecipeCost(
  recipe: Pick<Recipe, 'yield_quantity' | 'packaging_cost' | 'other_costs' | 'profit_margin_percent'>,
  recipeIngredients: RecipeIngredient[],
  targetYield?: number
): RecipeCostBreakdown {
  const baseYield = recipe.yield_quantity || 1;
  const y = targetYield && targetYield > 0 ? targetYield : baseYield;

  const ingredientsCost = calcIngredientsCost(recipeIngredients, baseYield, y);
  const ingredientsCostPerUnit = y > 0 ? ingredientsCost / y : 0;

  const packagingCost = (recipe.packaging_cost || 0) * y;
  const otherCosts = (recipe.other_costs || 0) * y;
  const totalCost = ingredientsCost + packagingCost + otherCosts;
  const costPerUnit = y > 0 ? totalCost / y : 0;

  const marginPercent = recipe.profit_margin_percent ?? 70;
  const marginFraction = Math.min(Math.max(marginPercent, 0), 95) / 100;
  const suggestedPricePerUnit = marginFraction < 1 ? costPerUnit / (1 - marginFraction) : costPerUnit;

  const revenue = suggestedPricePerUnit * y;
  const profit = revenue - totalCost;

  return {
    yield: y,
    ingredientsCost,
    ingredientsCostPerUnit,
    packagingCost,
    otherCosts,
    totalCost,
    costPerUnit,
    marginPercent,
    suggestedPricePerUnit,
    revenue,
    profit,
  };
}

/** Calculadora de custos avulsa (fora do contexto de uma receita cadastrada). */
export function calcCustoAvulso(itens: { precoEmbalagem: number; quantidadeEmbalagem: number; quantidadeUsada: number }[]) {
  return itens.reduce((sum, item) => {
    const custoUnitario = item.quantidadeEmbalagem > 0 ? item.precoEmbalagem / item.quantidadeEmbalagem : 0;
    return sum + custoUnitario * item.quantidadeUsada;
  }, 0);
}

/** Calculadora de preços avulsa: preço de venda a partir de um custo e margem desejada. */
export function calcPrecoVenda(custoTotal: number, margemPercent: number) {
  const fraction = Math.min(Math.max(margemPercent, 0), 95) / 100;
  return fraction < 1 ? custoTotal / (1 - fraction) : custoTotal;
}

export function formatBRL(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function formatPercent(value: number): string {
  return `${value.toLocaleString('pt-BR', { maximumFractionDigits: 1 })}%`;
}
