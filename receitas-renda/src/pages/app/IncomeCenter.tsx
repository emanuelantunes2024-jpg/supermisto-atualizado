import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { calcRecipeCost, formatBRL } from '../../lib/calc';
import { Icon, type IconName } from '../../components/common/Icon';
import { RecipeImage } from '../../components/common/RecipeImage';
import type { Category, Recipe, RecipeIngredient } from '../../lib/types';

const budgets = [30, 50, 100, 300, 500];
const canaisVenda: { label: string; icon: IconName }[] = [
  { label: 'WhatsApp', icon: 'whatsapp' },
  { label: 'Vizinhança', icon: 'building' },
  { label: 'Trabalho', icon: 'storefront' },
  { label: 'Escola', icon: 'star' },
  { label: 'Eventos', icon: 'sparkle' },
  { label: 'Delivery', icon: 'truck' },
];

type Full = Recipe & { recipe_ingredients: (RecipeIngredient & { ingredient: any })[] };

export default function IncomeCenter() {
  const location = useLocation();
  const [tab, setTab] = useState<'central' | 'simulador'>(
    location.pathname.includes('simulador') ? 'simulador' : 'central'
  );

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-extrabold text-ink-900">Central de Renda</h1>
      <div className="flex gap-2">
        <button onClick={() => setTab('central')} className={`rounded-lg px-4 py-2 text-sm font-semibold ${tab === 'central' ? 'bg-brand-500 text-white' : 'card text-ink-700'}`}>
          Central de Renda
        </button>
        <button onClick={() => setTab('simulador')} className={`rounded-lg px-4 py-2 text-sm font-semibold ${tab === 'simulador' ? 'bg-brand-500 text-white' : 'card text-ink-700'}`}>
          Simulador de Objetivos
        </button>
      </div>
      {tab === 'central' ? <CentralDeRenda /> : <GoalSimulator />}
    </div>
  );
}

function CentralDeRenda() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [budget, setBudget] = useState<number>(50);
  const [customBudget, setCustomBudget] = useState('');
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [canal, setCanal] = useState<string | null>(null);
  const [results, setResults] = useState<Full[] | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.from('categories').select('*').order('sort_order').then(({ data }) => setCategories((data as Category[]) ?? []));
  }, []);

  async function buscarSugestoes() {
    setLoading(true);
    let query = supabase.from('recipes').select('*, category:categories(*), recipe_ingredients(*, ingredient:ingredients(*))').eq('published', true);
    if (categoryId) query = query.eq('category_id', categoryId);
    const { data } = await query;
    const list = (data as Full[]) ?? [];
    const budgetValue = customBudget ? Number(customBudget) : budget;
    const filtered = list
      .map((r) => ({ recipe: r, cost: calcRecipeCost(r, r.recipe_ingredients) }))
      .filter((x) => x.cost.totalCost <= budgetValue * 1.15)
      .sort((a, b) => b.cost.profit - a.cost.profit)
      .map((x) => x.recipe);
    setResults(filtered);
    setLoading(false);
  }

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[380px_1fr] lg:gap-6">
      <div className="card space-y-5 p-5">
        <p className="text-sm font-bold text-ink-900">Descubra as melhores receitas para o seu objetivo</p>

        <div>
          <p className="label">1. Quanto você tem para começar?</p>
          <div className="flex flex-wrap gap-2">
            {budgets.map((b) => (
              <button
                key={b}
                onClick={() => {
                  setBudget(b);
                  setCustomBudget('');
                }}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
                  budget === b && !customBudget ? 'bg-brand-500 text-white' : 'border border-black/10 text-ink-700'
                }`}
              >
                R$ {b}
              </button>
            ))}
            <input
              value={customBudget}
              onChange={(e) => setCustomBudget(e.target.value)}
              placeholder="Outro valor"
              className="input !w-28 !py-1.5 text-xs"
            />
          </div>
        </div>

        <div>
          <p className="label">2. O que você quer produzir?</p>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setCategoryId(null)}
              className={`flex flex-col items-center gap-1 rounded-lg border p-2 text-xs font-semibold ${
                !categoryId ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-black/10 text-ink-700'
              }`}
            >
              <Icon name="grid" className="h-5 w-5" /> Todos
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setCategoryId(c.id)}
                className={`flex flex-col items-center gap-1 rounded-lg border p-2 text-xs font-semibold ${
                  categoryId === c.id ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-black/10 text-ink-700'
                }`}
              >
                <Icon name={(c.icon as any) || 'book'} className="h-5 w-5" /> {c.name}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="label">3. Onde pretende vender?</p>
          <div className="grid grid-cols-3 gap-2">
            {canaisVenda.map((c) => (
              <button
                key={c.label}
                onClick={() => setCanal(c.label)}
                className={`flex flex-col items-center gap-1 rounded-lg border p-2 text-xs font-semibold ${
                  canal === c.label ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-black/10 text-ink-700'
                }`}
              >
                <Icon name={c.icon} className="h-5 w-5" /> {c.label}
              </button>
            ))}
          </div>
        </div>

        <button onClick={buscarSugestoes} className="btn-primary w-full">
          Ver sugestões de receitas
        </button>
      </div>

      <div className="space-y-3">
        {loading && <p className="text-sm text-ink-600">Calculando as melhores opções…</p>}
        {results === null && !loading && (
          <div className="card p-6 text-center text-sm text-ink-600">Responda as 3 perguntas ao lado para ver sugestões de receitas lucrativas.</div>
        )}
        {results !== null && !loading && results.length === 0 && (
          <div className="card p-6 text-center text-sm text-ink-600">Nenhuma receita cabe nesse orçamento ainda. Tente aumentar o valor.</div>
        )}
        {results?.map((r) => {
          const cost = calcRecipeCost(r, r.recipe_ingredients);
          return (
            <div key={r.id} className="card flex gap-3 p-3">
              <RecipeImage src={r.image_url} alt={r.title} className="h-20 w-20 shrink-0 rounded-lg object-cover" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-ink-900">{r.title}</p>
                <dl className="mt-1 grid grid-cols-2 gap-x-3 gap-y-0.5 text-[11px] text-ink-600">
                  <div>Custo: <b className="text-ink-900">{formatBRL(cost.totalCost)}</b></div>
                  <div>Rendimento: <b className="text-ink-900">{r.yield_quantity} {r.yield_unit}</b></div>
                  <div>Preço sugerido: <b className="text-ink-900">{formatBRL(cost.suggestedPricePerUnit)}</b></div>
                  <div>Faturamento: <b className="text-ink-900">{formatBRL(cost.revenue)}</b></div>
                </dl>
                <p className="mt-1 text-xs font-bold text-brand-600">Lucro estimado: {formatBRL(cost.profit)}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function GoalSimulator() {
  const [recipes, setRecipes] = useState<Full[]>([]);
  const [recipeId, setRecipeId] = useState<string>('');
  const [metaMensal, setMetaMensal] = useState(1500);
  const [diasPorSemana, setDiasPorSemana] = useState(5);

  useEffect(() => {
    supabase
      .from('recipes')
      .select('*, category:categories(*), recipe_ingredients(*, ingredient:ingredients(*))')
      .eq('published', true)
      .then(({ data }) => {
        const list = (data as Full[]) ?? [];
        setRecipes(list);
        if (list[0]) setRecipeId(list[0].id);
      });
  }, []);

  const recipe = recipes.find((r) => r.id === recipeId);
  const cost = recipe ? calcRecipeCost(recipe, recipe.recipe_ingredients) : null;
  const lucroPorUnidade = cost ? cost.profit / cost.yield : 0;
  const unidadesPorMes = lucroPorUnidade > 0 ? Math.ceil(metaMensal / lucroPorUnidade) : 0;
  const diasUteisMes = diasPorSemana * 4.345;
  const unidadesPorDia = diasUteisMes > 0 ? Math.ceil(unidadesPorMes / diasUteisMes) : 0;

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
      <div className="card space-y-4 p-5">
        <div>
          <label className="label">Receita para vender</label>
          <select className="input" value={recipeId} onChange={(e) => setRecipeId(e.target.value)}>
            {recipes.map((r) => (
              <option key={r.id} value={r.id}>{r.title}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Quanto você quer ganhar por mês? (R$)</label>
          <input type="number" className="input" value={metaMensal} onChange={(e) => setMetaMensal(Number(e.target.value))} />
        </div>
        <div>
          <label className="label">Quantos dias por semana você vai produzir/vender?</label>
          <input type="number" min={1} max={7} className="input" value={diasPorSemana} onChange={(e) => setDiasPorSemana(Number(e.target.value))} />
        </div>
      </div>

      <div className="card space-y-3 p-5">
        <p className="text-sm font-bold text-ink-900">Seu plano para bater a meta</p>
        {cost ? (
          <>
            <MetricRow label="Lucro por unidade vendida" value={formatBRL(lucroPorUnidade)} />
            <MetricRow label="Unidades a vender por mês" value={unidadesPorMes.toLocaleString('pt-BR')} />
            <MetricRow label="Unidades a vender por dia de trabalho" value={unidadesPorDia.toLocaleString('pt-BR')} highlight />
            <MetricRow label="Faturamento estimado do mês" value={formatBRL(unidadesPorMes * cost.suggestedPricePerUnit)} />
          </>
        ) : (
          <p className="text-sm text-ink-600">Cadastre receitas publicadas para simular sua meta.</p>
        )}
      </div>
    </div>
  );
}

function MetricRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`flex items-center justify-between rounded-lg p-3 ${highlight ? 'bg-brand-50' : 'bg-black/[0.02]'}`}>
      <span className="text-sm text-ink-700">{label}</span>
      <span className={`text-base font-extrabold ${highlight ? 'text-brand-600' : 'text-ink-900'}`}>{value}</span>
    </div>
  );
}
