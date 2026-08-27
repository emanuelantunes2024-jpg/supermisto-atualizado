import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { RecipeCard } from '../../components/app/RecipeCard';
import { Icon } from '../../components/common/Icon';
import type { Recipe } from '../../lib/types';

export default function Search() {
  const [params, setParams] = useSearchParams();
  const q = params.get('q') ?? '';
  const [term, setTerm] = useState(q);
  const [results, setResults] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => setTerm(q), [q]);

  useEffect(() => {
    if (!q) {
      setResults([]);
      return;
    }
    setLoading(true);
    supabase
      .from('recipes')
      .select('*, category:categories(*)')
      .eq('published', true)
      .ilike('title', `%${q}%`)
      .then(({ data }) => {
        setResults((data as Recipe[]) ?? []);
        setLoading(false);
      });
  }, [q]);

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-extrabold text-ink-900">Buscar</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setParams(term ? { q: term } : {});
        }}
        className="flex max-w-xl items-center gap-2 rounded-xl border border-black/10 bg-white px-3 py-2.5"
      >
        <Icon name="search" className="h-4 w-4 text-ink-600" />
        <input
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder="Buscar receitas, ingredientes..."
          className="w-full text-sm outline-none"
        />
      </form>

      {loading && <p className="text-sm text-ink-600">Buscando…</p>}
      {q && !loading && results.length === 0 && <p className="text-sm text-ink-600">Nada encontrado para "{q}".</p>}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {results.map((r) => (
          <RecipeCard key={r.id} recipe={r} />
        ))}
      </div>
    </div>
  );
}
