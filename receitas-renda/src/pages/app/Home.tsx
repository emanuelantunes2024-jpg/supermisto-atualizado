import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Icon, type IconName } from '../../components/common/Icon';
import { RecipeImage } from '../../components/common/RecipeImage';
import { calcRecipeCost, formatBRL } from '../../lib/calc';
import type { Recipe, RecipeIngredient, News } from '../../lib/types';

const actions: { to: string; title: string; desc: string; icon: IconName }[] = [
  { to: '/app/buscar', title: 'Encontrar uma receita', desc: 'Explore milhares de receitas', icon: 'search' },
  { to: '/app/central-de-renda', title: 'Quero começar a vender', desc: 'Receitas lucrativas para vender', icon: 'storefront' },
  { to: '/app/calculadoras', title: 'Calcular custos', desc: 'Saiba quanto vai gastar', icon: 'calculator' },
  { to: '/app/lista-de-compras', title: 'Lista de compras', desc: 'Organize seus ingredientes', icon: 'cart' },
  { to: '/app/colecoes', title: 'Planejar produção', desc: 'Planeje e organize sua produção', icon: 'grid' },
  { to: '/app/favoritos', title: 'Minhas receitas', desc: 'Acesse suas favoritas', icon: 'heart' },
];

type RecipeWithIngredients = Recipe & { recipe_ingredients: (RecipeIngredient & { ingredient: any })[] };

export default function Home() {
  const [totalRecipes, setTotalRecipes] = useState(0);
  const [novidades, setNovidades] = useState<News[]>([]);
  const [novasReceitas, setNovasReceitas] = useState<Recipe[]>([]);
  const [sugestoes, setSugestoes] = useState<RecipeWithIngredients[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [{ count }, newsRes, newRecipesRes, suggestionsRes] = await Promise.all([
        supabase.from('recipes').select('id', { count: 'exact', head: true }).eq('published', true),
        supabase.from('news').select('*').eq('status', 'published').order('published_at', { ascending: false }).limit(1),
        supabase
          .from('recipes')
          .select('*, category:categories(*)')
          .eq('published', true)
          .order('created_at', { ascending: false })
          .limit(5),
        supabase
          .from('recipes')
          .select('*, recipe_ingredients(*, ingredient:ingredients(*))')
          .eq('published', true)
          .order('favorites_count', { ascending: false })
          .limit(3),
      ]);

      setTotalRecipes(count ?? 0);
      setNovidades((newsRes.data as News[]) ?? []);
      setNovasReceitas((newRecipesRes.data as Recipe[]) ?? []);
      setSugestoes((suggestionsRes.data as RecipeWithIngredients[]) ?? []);
      setLoading(false);
    })();
  }, []);

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-4 lg:gap-6">
      <div className="space-y-4 lg:col-span-3 lg:space-y-6">
        {/* 6 cards de ação */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {actions.map((a) => (
            <Link key={a.to} to={a.to} className="card flex flex-col gap-2 p-4 transition hover:-translate-y-0.5 hover:shadow-lg">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                <Icon name={a.icon} className="h-5 w-5" />
              </div>
              <p className="text-sm font-bold leading-tight text-ink-900">{a.title}</p>
              <p className="text-xs text-ink-600">{a.desc}</p>
            </Link>
          ))}
        </div>

        {/* Banner escuro + banner de novidades */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="card relative overflow-hidden bg-ink-900 p-6 text-white">
            <p className="text-sm font-semibold text-white/70">Biblioteca em expansão</p>
            <p className="mt-2 text-4xl font-extrabold text-brand-400">
              {totalRecipes ? `${totalRecipes.toLocaleString('pt-BR')}+` : '—'}
            </p>
            <p className="text-sm font-medium text-white/90">receitas disponíveis</p>
            <p className="mt-3 text-xs text-white/60">Novas receitas adicionadas toda semana!</p>
            <div className="mt-4 flex h-9 w-9 items-center justify-center rounded-full bg-brand-500">
              <Icon name="trending" className="h-4 w-4" />
            </div>
          </div>

          <div className="card flex items-center justify-between gap-4 bg-brand-50 p-6">
            <div>
              <p className="text-sm font-bold text-ink-900">Novidades disponíveis! 🔔</p>
              <p className="mt-1 text-xs text-ink-600">
                {novidades[0]?.description || 'Novas receitas foram adicionadas esta semana.'}
              </p>
              <Link to="/app/novidades" className="btn-primary mt-3 !px-3 !py-2 text-xs">
                Ver novidades
              </Link>
            </div>
          </div>
        </div>

        {/* Novas receitas */}
        <div className="card p-4 lg:p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-base font-bold text-ink-900">
              Novas receitas <span className="ml-2 text-xs font-medium text-brand-600">Adicionadas esta semana</span>
            </h2>
            <Link to="/app/receitas" className="text-xs font-semibold text-brand-600">
              Ver todas as novidades →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {loading && <p className="col-span-full text-sm text-ink-600">Carregando…</p>}
            {!loading && novasReceitas.length === 0 && (
              <p className="col-span-full text-sm text-ink-600">Nenhuma receita publicada ainda.</p>
            )}
            {novasReceitas.map((r) => (
              <Link key={r.id} to={`/app/receitas/${r.slug}`} className="group overflow-hidden rounded-xl border border-black/5">
                <div className="relative">
                  <RecipeImage src={r.image_url} alt={r.title} className="h-24 w-full object-cover" />
                  <span className="absolute left-2 top-2 rounded-md bg-brand-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
                    Novo
                  </span>
                  <span className="absolute bottom-2 right-2 flex items-center gap-1 rounded-md bg-black/60 px-1.5 py-0.5 text-[10px] text-white">
                    <Icon name="chevronRight" className="hidden h-3 w-3" /> {r.prep_time_minutes}min
                  </span>
                </div>
                <div className="p-2">
                  <p className="line-clamp-2 text-xs font-bold text-ink-900">{r.title}</p>
                  <p className="text-[11px] text-ink-600">{r.category?.name}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Sugestões para você */}
      <div className="space-y-3">
        <h2 className="px-1 text-sm font-bold text-ink-900">Sugestões para você</h2>
        {sugestoes.map((r) => {
          const cost = calcRecipeCost(r, r.recipe_ingredients ?? []);
          return (
            <Link key={r.id} to={`/app/receitas/${r.slug}`} className="card flex gap-3 p-3">
              <RecipeImage src={r.image_url} alt={r.title} className="h-16 w-16 shrink-0 rounded-lg object-cover" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-ink-900">{r.title}</p>
                <dl className="mt-1 grid grid-cols-2 gap-x-2 text-[11px] text-ink-600">
                  <div>Custo: <span className="font-semibold text-ink-900">{formatBRL(cost.totalCost)}</span></div>
                  <div>Rendimento: <span className="font-semibold text-ink-900">{r.yield_quantity} {r.yield_unit}</span></div>
                  <div>Preço: <span className="font-semibold text-ink-900">{formatBRL(cost.suggestedPricePerUnit)}</span></div>
                  <div>Faturamento: <span className="font-semibold text-ink-900">{formatBRL(cost.revenue)}</span></div>
                </dl>
                <p className="mt-1 text-[11px] font-bold text-brand-600">Lucro estimado: {formatBRL(cost.profit)}</p>
              </div>
            </Link>
          );
        })}
        {!loading && sugestoes.length === 0 && (
          <p className="card p-4 text-xs text-ink-600">Publique receitas no painel para ver sugestões aqui.</p>
        )}
        <Link to="/app/receitas" className="btn-secondary w-full text-xs">
          Ver mais sugestões
        </Link>
      </div>
    </div>
  );
}
