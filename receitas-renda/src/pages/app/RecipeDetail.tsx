import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../lib/auth/AuthContext';
import { RecipeImage } from '../../components/common/RecipeImage';
import { Icon } from '../../components/common/Icon';
import { calcRecipeCost, formatBRL, scaleQuantity } from '../../lib/calc';
import type { Collection, Recipe, RecipeIngredient } from '../../lib/types';

type Full = Recipe & { recipe_ingredients: (RecipeIngredient & { ingredient: any })[] };

const tabs = ['Ingredientes', 'Modo de preparo', 'Dicas', 'Conservação', 'Equipamentos', 'Informações'] as const;

export default function RecipeDetail() {
  const { slug } = useParams();
  const { profile } = useAuth();
  const [recipe, setRecipe] = useState<Full | null>(null);
  const [yieldQty, setYieldQty] = useState(1);
  const [tab, setTab] = useState<(typeof tabs)[number]>('Ingredientes');
  const [isFavorite, setIsFavorite] = useState(false);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [showCollections, setShowCollections] = useState(false);

  useEffect(() => {
    if (!slug) return;
    supabase
      .from('recipes')
      .select('*, category:categories(*), recipe_ingredients(*, ingredient:ingredients(*))')
      .eq('slug', slug)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setRecipe(data as Full);
          setYieldQty((data as Full).yield_quantity);
          // Assinantes não têm permissão de UPDATE direto em recipes (RLS
          // exige recipes.manage) — a contagem de visualizações passa por
          // uma função no banco que roda com privilégio elevado.
          supabase.rpc('increment_recipe_views', { recipe_id: data.id }).then();
        }
      });
  }, [slug]);

  useEffect(() => {
    if (!recipe || !profile) return;
    supabase
      .from('favorites')
      .select('id')
      .eq('user_id', profile.id)
      .eq('recipe_id', recipe.id)
      .maybeSingle()
      .then(({ data }) => setIsFavorite(!!data));
  }, [recipe, profile]);

  const cost = useMemo(() => (recipe ? calcRecipeCost(recipe, recipe.recipe_ingredients, yieldQty) : null), [recipe, yieldQty]);

  async function toggleFavorite() {
    if (!recipe || !profile) return;
    if (isFavorite) {
      await supabase.from('favorites').delete().eq('user_id', profile.id).eq('recipe_id', recipe.id);
    } else {
      await supabase.from('favorites').insert({ user_id: profile.id, recipe_id: recipe.id });
    }
    setIsFavorite(!isFavorite);
  }

  async function openCollections() {
    if (!profile) return;
    const { data } = await supabase.from('collections').select('*').eq('user_id', profile.id);
    setCollections((data as Collection[]) ?? []);
    setShowCollections(true);
  }

  async function addToCollection(collectionId: string) {
    if (!recipe) return;
    await supabase.from('collection_recipes').upsert({ collection_id: collectionId, recipe_id: recipe.id });
    setShowCollections(false);
  }

  async function addToShoppingList() {
    if (!recipe || !profile) return;
    const scale = yieldQty / recipe.yield_quantity;
    const rows = recipe.recipe_ingredients.map((ri) => ({
      user_id: profile.id,
      recipe_id: recipe.id,
      label: ri.ingredient?.name ?? 'Ingrediente',
      quantity: `${scaleQuantity(ri.base_quantity, recipe.yield_quantity, yieldQty).toLocaleString('pt-BR', { maximumFractionDigits: 1 })} ${ri.ingredient?.unit ?? ''}`.trim(),
    }));
    await supabase.from('shopping_list_items').insert(rows);
    void scale;
    alert('Ingredientes adicionados à lista de compras!');
  }

  if (!recipe || !cost) return <p className="text-sm text-ink-600">Carregando…</p>;

  return (
    <div>
      <Link to="/app/receitas" className="mb-3 inline-flex items-center gap-1 text-sm font-semibold text-ink-700">
        <Icon name="chevronRight" className="h-4 w-4 rotate-180" /> Voltar
      </Link>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
        <div className="card overflow-hidden">
          <RecipeImage src={recipe.image_url} alt={recipe.title} className="h-64 w-full object-cover lg:h-full" />
        </div>

        <div className="card p-5">
          <p className="text-xs font-semibold text-brand-600">{recipe.category?.name}</p>
          <h1 className="mt-1 text-2xl font-extrabold text-ink-900">{recipe.title}</h1>
          <p className="mt-1 text-sm text-ink-600">
            {recipe.difficulty} · ⏱ {recipe.prep_time_minutes >= 60 ? `${Math.floor(recipe.prep_time_minutes / 60)}h ${recipe.prep_time_minutes % 60 || ''}`.trim() : `${recipe.prep_time_minutes}min`} · Rende {recipe.yield_quantity} {recipe.yield_unit}
          </p>
          {recipe.description && <p className="mt-3 text-sm text-ink-700">{recipe.description}</p>}

          <div className="mt-4 flex flex-wrap gap-2">
            <button onClick={toggleFavorite} className={isFavorite ? 'btn-primary' : 'btn-secondary'}>
              <Icon name="heart" className="h-4 w-4" /> {isFavorite ? 'Favoritado' : 'Favoritar'}
            </button>
            <button onClick={addToShoppingList} className="btn-secondary">
              <Icon name="cart" className="h-4 w-4" /> Adicionar à lista
            </button>
            <button
              onClick={() => navigator.share?.({ title: recipe.title, url: location.href }).catch(() => {})}
              className="btn-secondary"
            >
              <Icon name="upload" className="h-4 w-4" /> Compartilhar
            </button>
            <div className="relative">
              <button onClick={openCollections} className="btn-secondary">
                <Icon name="folder" className="h-4 w-4" /> Adicionar à coleção
              </button>
              {showCollections && (
                <div className="absolute z-10 mt-2 w-56 rounded-xl border border-black/10 bg-white p-2 shadow-lg">
                  {collections.length === 0 && <p className="p-2 text-xs text-ink-600">Crie uma coleção em "Minhas Coleções".</p>}
                  {collections.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => addToCollection(c.id)}
                      className="block w-full rounded-lg px-2 py-1.5 text-left text-sm hover:bg-black/5"
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="mt-5 flex items-center gap-3 rounded-xl border border-black/10 p-3">
            <span className="label !mb-0">Ajustar rendimento</span>
            <button
              onClick={() => setYieldQty((y) => Math.max(1, y - 1))}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-black/10 font-bold"
            >
              −
            </button>
            <span className="w-24 text-center text-sm font-bold">
              {yieldQty} {recipe.yield_unit}
            </span>
            <button
              onClick={() => setYieldQty((y) => y + 1)}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-black/10 font-bold"
            >
              +
            </button>
            <span className="ml-auto text-[11px] text-ink-600">Ingredientes ajustados automaticamente</span>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-[1fr_360px] lg:gap-6">
        <div className="card p-5">
          <div className="flex flex-wrap gap-1 border-b border-black/5 pb-2">
            {tabs.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
                  tab === t ? 'bg-brand-500 text-white' : 'text-ink-600 hover:bg-black/5'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="pt-4">
            {tab === 'Ingredientes' && (
              <ul className="space-y-2 text-sm">
                {recipe.recipe_ingredients
                  .sort((a, b) => a.sort_order - b.sort_order)
                  .map((ri) => {
                    const qty = scaleQuantity(ri.base_quantity, recipe.yield_quantity, yieldQty);
                    return (
                      <li key={ri.id} className="flex items-center justify-between border-b border-black/5 pb-2">
                        <span className="flex items-center gap-2 text-ink-800">
                          <Icon name="check" className="h-4 w-4 text-brand-500" /> {ri.ingredient?.name}
                        </span>
                        <span className="font-semibold text-ink-900">
                          {qty.toLocaleString('pt-BR', { maximumFractionDigits: 1 })} {ri.ingredient?.unit}
                          {ri.display_label ? ` (${ri.display_label})` : ''}
                        </span>
                      </li>
                    );
                  })}
              </ul>
            )}
            {tab === 'Modo de preparo' && (
              <ol className="space-y-3 text-sm text-ink-800">
                {(recipe.instructions ?? []).map((step, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-500 text-xs font-bold text-white">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
                {(!recipe.instructions || recipe.instructions.length === 0) && <p className="text-ink-600">Modo de preparo não cadastrado.</p>}
              </ol>
            )}
            {tab === 'Dicas' && <p className="whitespace-pre-line text-sm text-ink-800">{recipe.tips || 'Nenhuma dica cadastrada.'}</p>}
            {tab === 'Conservação' && <p className="whitespace-pre-line text-sm text-ink-800">{recipe.storage || 'Informação não cadastrada.'}</p>}
            {tab === 'Equipamentos' && <p className="whitespace-pre-line text-sm text-ink-800">{recipe.equipment || 'Informação não cadastrada.'}</p>}
            {tab === 'Informações' && (
              <dl className="grid grid-cols-2 gap-3 text-sm">
                <div><dt className="text-ink-600">Categoria</dt><dd className="font-semibold">{recipe.category?.name}</dd></div>
                <div><dt className="text-ink-600">Dificuldade</dt><dd className="font-semibold">{recipe.difficulty}</dd></div>
                <div><dt className="text-ink-600">Tempo de preparo</dt><dd className="font-semibold">{recipe.prep_time_minutes} min</dd></div>
                <div><dt className="text-ink-600">Rendimento base</dt><dd className="font-semibold">{recipe.yield_quantity} {recipe.yield_unit}</dd></div>
                <div><dt className="text-ink-600">Visualizações</dt><dd className="font-semibold">{recipe.views_count}</dd></div>
                <div><dt className="text-ink-600">Favoritos</dt><dd className="font-semibold">{recipe.favorites_count}</dd></div>
              </dl>
            )}
          </div>
        </div>

        <div className="card space-y-4 p-5">
          <div>
            <h3 className="text-sm font-bold text-ink-900">Resumo de custos</h3>
            <dl className="mt-2 space-y-1.5 text-sm">
              <Row label="Custo dos ingredientes" value={formatBRL(cost.ingredientsCost)} />
              <Row label="Custo por unidade" value={formatBRL(cost.ingredientsCostPerUnit)} />
              <Row label="Custo de embalagem" value={formatBRL(cost.packagingCost)} />
              <Row label="Outros custos" value={formatBRL(cost.otherCosts)} />
              <Row label="Custo total da receita" value={formatBRL(cost.totalCost)} strong />
            </dl>
          </div>
          <div className="border-t border-black/5 pt-4">
            <h3 className="text-sm font-bold text-ink-900">Preço sugerido</h3>
            <dl className="mt-2 space-y-1.5 text-sm">
              <Row label="Preço por unidade" value={formatBRL(cost.suggestedPricePerUnit)} />
              <Row label={`Margem de lucro (${cost.marginPercent}%)`} value="" />
              <Row label={`Faturamento (${cost.yield} un.)`} value={formatBRL(cost.revenue)} />
              <Row label="Lucro estimado" value={formatBRL(cost.profit)} strong good />
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, strong, good }: { label: string; value: string; strong?: boolean; good?: boolean }) {
  return (
    <div className={`flex items-center justify-between rounded-lg px-2 py-1.5 ${strong ? 'bg-brand-50' : ''}`}>
      <dt className="text-ink-600">{label}</dt>
      <dd className={`font-bold ${good ? 'text-brand-600' : 'text-ink-900'}`}>{value}</dd>
    </div>
  );
}
