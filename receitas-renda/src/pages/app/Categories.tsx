import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Icon } from '../../components/common/Icon';
import type { Category } from '../../lib/types';

export default function Categories() {
  const [categories, setCategories] = useState<(Category & { count: number })[]>([]);

  useEffect(() => {
    (async () => {
      const { data: cats } = await supabase.from('categories').select('*').order('sort_order');
      const list = (cats as Category[]) ?? [];
      const withCounts = await Promise.all(
        list.map(async (c) => {
          const { count } = await supabase
            .from('recipes')
            .select('id', { count: 'exact', head: true })
            .eq('category_id', c.id)
            .eq('published', true);
          return { ...c, count: count ?? 0 };
        })
      );
      setCategories(withCounts);
    })();
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-extrabold text-ink-900">Categorias</h1>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {categories.map((c) => (
          <Link key={c.id} to={`/app/receitas?categoria=${c.id}`} className="card flex flex-col items-center gap-2 p-5 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-brand-600">
              <Icon name={(c.icon as any) || 'book'} className="h-6 w-6" />
            </div>
            <p className="text-sm font-bold text-ink-900">{c.name}</p>
            <p className="text-xs text-ink-600">{c.count} receitas</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
