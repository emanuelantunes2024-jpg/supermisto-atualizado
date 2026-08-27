import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { RecipeCard } from '../../components/app/RecipeCard';
import type { Category, Recipe } from '../../lib/types';

export default function Recipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('categories').select('*').order('sort_order').then(({ data }) => setCategories((data as Category[]) ?? []));
  }, []);

  useEffect(() => {
    setLoading(true);
    let query = supabase.from('recipes').select('*, category:categories(*)').eq('published', true).order('created_at', { ascending: false });
    if (activeCategory) query = query.eq('category_id', activeCategory);
    query.then(({ data }) => {
      setRecipes((data as Recipe[]) ?? []);
      setLoading(false);
    });
  }, [activeCategory]);

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-extrabold text-ink-900">Receitas</h1>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveCategory(null)}
          className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
            !activeCategory ? 'bg-brand-500 text-white' : 'bg-white text-ink-700 border border-black/10'
          }`}
        >
          Todas
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setActiveCategory(c.id)}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
              activeCategory === c.id ? 'bg-brand-500 text-white' : 'bg-white text-ink-700 border border-black/10'
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {loading && <p className="text-sm text-ink-600">Carregando…</p>}
      {!loading && recipes.length === 0 && <p className="text-sm text-ink-600">Nenhuma receita encontrada.</p>}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {recipes.map((r) => (
          <RecipeCard key={r.id} recipe={r} />
        ))}
      </div>
    </div>
  );
}
