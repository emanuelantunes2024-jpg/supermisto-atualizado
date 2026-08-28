import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { RecipeCard } from '../../components/app/RecipeCard';
import { Icon } from '../../components/common/Icon';
import type { Collection, Recipe } from '../../lib/types';

export default function CollectionDetail() {
  const { id } = useParams();
  const [collection, setCollection] = useState<Collection | null>(null);
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    if (!id) return;
    supabase.from('collections').select('*').eq('id', id).maybeSingle().then(({ data }) => setCollection(data as Collection));
    supabase
      .from('collection_recipes')
      .select('recipe:recipes(*, category:categories(*))')
      .eq('collection_id', id)
      .then(({ data }) => setRecipes(((data as any[]) ?? []).map((r) => r.recipe).filter(Boolean)));
  }, [id]);

  async function removeCollection() {
    if (!id || !confirm('Excluir esta coleção?')) return;
    await supabase.from('collections').delete().eq('id', id);
    location.href = '/app/colecoes';
  }

  return (
    <div className="space-y-4">
      <Link to="/app/colecoes" className="inline-flex items-center gap-1 text-sm font-semibold text-ink-700">
        <Icon name="chevronRight" className="h-4 w-4 rotate-180" /> Voltar
      </Link>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-extrabold text-ink-900">{collection?.name ?? 'Coleção'}</h1>
        <button onClick={removeCollection} className="btn-secondary !text-red-600">
          <Icon name="trash" className="h-4 w-4" /> Excluir
        </button>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {recipes.map((r) => (
          <RecipeCard key={r.id} recipe={r} />
        ))}
        {recipes.length === 0 && <p className="col-span-full text-sm text-ink-600">Adicione receitas a esta coleção pela ficha da receita.</p>}
      </div>
    </div>
  );
}
