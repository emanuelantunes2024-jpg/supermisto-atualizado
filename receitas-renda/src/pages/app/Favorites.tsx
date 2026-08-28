import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../lib/auth/AuthContext';
import { RecipeCard } from '../../components/app/RecipeCard';
import type { Recipe } from '../../lib/types';

export default function Favorites() {
  const { profile } = useAuth();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile) return;
    supabase
      .from('favorites')
      .select('recipe:recipes(*, category:categories(*))')
      .eq('user_id', profile.id)
      .then(({ data }) => {
        setRecipes(((data as any[]) ?? []).map((f) => f.recipe).filter(Boolean));
        setLoading(false);
      });
  }, [profile]);

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-extrabold text-ink-900">Favoritos</h1>
      {loading && <p className="text-sm text-ink-600">Carregando…</p>}
      {!loading && recipes.length === 0 && <p className="text-sm text-ink-600">Você ainda não favoritou nenhuma receita.</p>}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {recipes.map((r) => (
          <RecipeCard key={r.id} recipe={r} />
        ))}
      </div>
    </div>
  );
}
