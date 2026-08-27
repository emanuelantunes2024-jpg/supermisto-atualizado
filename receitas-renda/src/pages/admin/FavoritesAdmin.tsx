import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { RecipeImage } from '../../components/common/RecipeImage';
import { Icon } from '../../components/common/Icon';

export default function AdminFavorites() {
  const [recipes, setRecipes] = useState<any[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    (async () => {
      const { count } = await supabase.from('favorites').select('id', { count: 'exact', head: true });
      setTotal(count ?? 0);
      const { data } = await supabase
        .from('recipes')
        .select('id,title,image_url,favorites_count,category:categories(name)')
        .order('favorites_count', { ascending: false })
        .limit(10);
      setRecipes(data ?? []);
    })();
  }, []);

  return (
    <div className="space-y-4">
      <div className="card p-5">
        <p className="text-xs font-semibold text-ink-600">Total de favoritos na plataforma</p>
        <p className="text-2xl font-extrabold text-ink-900">{total.toLocaleString('pt-BR')}</p>
      </div>
      <div className="card p-5">
        <p className="mb-3 text-sm font-bold text-ink-900">Receitas mais favoritadas</p>
        <ul className="space-y-3">
          {recipes.map((r, i) => (
            <li key={r.id} className="flex items-center gap-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700">{i + 1}</span>
              <RecipeImage src={r.image_url} alt={r.title} className="h-10 w-10 rounded-lg object-cover" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-ink-900">{r.title}</p>
                <p className="text-xs text-ink-600">{r.category?.name}</p>
              </div>
              <span className="flex items-center gap-1 text-sm font-semibold text-ink-900">
                <Icon name="heart" className="h-4 w-4 text-brand-500" /> {r.favorites_count}
              </span>
            </li>
          ))}
          {recipes.length === 0 && <p className="text-sm text-ink-600">Nenhuma receita favoritada ainda.</p>}
        </ul>
      </div>
    </div>
  );
}
