import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { RecipeImage } from '../../components/common/RecipeImage';
import type { News as NewsType } from '../../lib/types';

export default function News() {
  const [news, setNews] = useState<NewsType[]>([]);

  useEffect(() => {
    supabase
      .from('news')
      .select('*')
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .then(({ data }) => setNews((data as NewsType[]) ?? []));
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-extrabold text-ink-900">Novidades</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {news.map((n) => (
          <div key={n.id} className="card overflow-hidden">
            <RecipeImage src={n.image_url} alt={n.title} className="h-40 w-full object-cover" />
            <div className="p-4">
              <p className="text-sm font-bold text-ink-900">{n.title}</p>
              <p className="mt-1 text-xs text-ink-600">{n.description}</p>
              <p className="mt-2 text-[11px] text-ink-600">
                Publicado em {n.published_at ? new Date(n.published_at).toLocaleDateString('pt-BR') : ''}
              </p>
            </div>
          </div>
        ))}
        {news.length === 0 && <p className="text-sm text-ink-600">Nenhuma novidade publicada ainda.</p>}
      </div>
    </div>
  );
}
