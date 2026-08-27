import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAdminAuth } from '../../lib/auth/AdminAuthContext';
import { Icon } from '../../components/common/Icon';
import { RecipeImage } from '../../components/common/RecipeImage';
import { calcRecipeCost, formatBRL } from '../../lib/calc';
import type { Category, Ingredient, Recipe, RecipeIngredient } from '../../lib/types';

type Full = Recipe & { recipe_ingredients: (RecipeIngredient & { ingredient: Ingredient })[] };

function slugify(s: string) {
  return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export default function AdminRecipes() {
  const { can, logAction } = useAdminAuth();
  const [recipes, setRecipes] = useState<Full[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Full | 'new' | null>(null);

  async function load() {
    setLoading(true);
    const [{ data: r }, { data: c }, { data: i }] = await Promise.all([
      supabase.from('recipes').select('*, category:categories(*), recipe_ingredients(*, ingredient:ingredients(*))').order('created_at', { ascending: false }),
      supabase.from('categories').select('*').order('sort_order'),
      supabase.from('ingredients').select('*').order('name'),
    ]);
    setRecipes((r as Full[]) ?? []);
    setCategories((c as Category[]) ?? []);
    setIngredients((i as Ingredient[]) ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function toggle(recipe: Full, field: 'published' | 'featured' | 'is_new') {
    await supabase.from('recipes').update({ [field]: !recipe[field] }).eq('id', recipe.id);
    await logAction(recipe[field] ? `unset_${field}` : `set_${field}`, 'recipes', recipe.id);
    load();
  }

  async function duplicate(recipe: Full) {
    const { data: newRecipe } = await supabase
      .from('recipes')
      .insert({
        title: `${recipe.title} (cópia)`,
        slug: `${recipe.slug}-copia-${Date.now().toString(36)}`,
        category_id: recipe.category_id,
        difficulty: recipe.difficulty,
        prep_time_minutes: recipe.prep_time_minutes,
        yield_quantity: recipe.yield_quantity,
        yield_unit: recipe.yield_unit,
        image_url: recipe.image_url,
        description: recipe.description,
        instructions: recipe.instructions,
        tips: recipe.tips,
        storage: recipe.storage,
        equipment: recipe.equipment,
        packaging_cost: recipe.packaging_cost,
        other_costs: recipe.other_costs,
        profit_margin_percent: recipe.profit_margin_percent,
        published: false,
      })
      .select()
      .maybeSingle();
    if (newRecipe) {
      const rows = recipe.recipe_ingredients.map((ri) => ({
        recipe_id: newRecipe.id,
        ingredient_id: ri.ingredient_id,
        base_quantity: ri.base_quantity,
        display_label: ri.display_label,
        sort_order: ri.sort_order,
      }));
      if (rows.length) await supabase.from('recipe_ingredients').insert(rows);
      await logAction('duplicate', 'recipes', newRecipe.id, { from: recipe.id });
    }
    load();
  }

  async function remove(recipe: Full) {
    if (!confirm(`Excluir "${recipe.title}"?`)) return;
    await supabase.from('recipes').delete().eq('id', recipe.id);
    await logAction('delete', 'recipes', recipe.id);
    load();
  }

  if (editing) {
    return (
      <RecipeForm
        recipe={editing === 'new' ? null : editing}
        categories={categories}
        ingredients={ingredients}
        onClose={() => {
          setEditing(null);
          load();
        }}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-ink-600">{recipes.length} receitas cadastradas</p>
        {can('recipes.manage') && (
          <button onClick={() => setEditing('new')} className="btn-primary">
            <Icon name="plus" className="h-4 w-4" /> Nova receita
          </button>
        )}
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead>
            <tr className="border-b border-black/5 text-xs uppercase text-ink-600">
              <th className="px-4 py-3 font-semibold">Receita</th>
              <th className="px-4 py-3 font-semibold">Categoria</th>
              <th className="px-4 py-3 font-semibold">Custo</th>
              <th className="px-4 py-3 font-semibold">Preço sugerido</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={6} className="px-4 py-6 text-center text-ink-600">Carregando…</td></tr>}
            {!loading && recipes.map((r) => {
              const cost = calcRecipeCost(r, r.recipe_ingredients);
              return (
                <tr key={r.id} className="border-b border-black/5 last:border-0 hover:bg-black/[0.015]">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <RecipeImage src={r.image_url} alt={r.title} className="h-10 w-10 rounded-lg object-cover" />
                      <div>
                        <p className="font-semibold text-ink-900">{r.title}</p>
                        <div className="flex gap-1">
                          {r.is_new && <span className="rounded bg-brand-100 px-1.5 py-0.5 text-[10px] font-bold text-brand-700">Novo</span>}
                          {r.featured && <span className="rounded bg-ink-900/10 px-1.5 py-0.5 text-[10px] font-bold text-ink-900">Destaque</span>}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-ink-700">{r.category?.name ?? '—'}</td>
                  <td className="px-4 py-3 text-ink-700">{formatBRL(cost.totalCost)}</td>
                  <td className="px-4 py-3 text-ink-700">{formatBRL(cost.suggestedPricePerUnit)}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => can('recipes.manage') && toggle(r, 'published')}
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${r.published ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}
                    >
                      {r.published ? 'Publicada' : 'Rascunho'}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button title="Destacar" onClick={() => toggle(r, 'featured')} className="rounded-lg p-1.5 text-ink-600 hover:bg-black/5">
                        <Icon name="star" className="h-4 w-4" />
                      </button>
                      <button title="Marcar como novidade" onClick={() => toggle(r, 'is_new')} className="rounded-lg p-1.5 text-ink-600 hover:bg-black/5">
                        <Icon name="sparkle" className="h-4 w-4" />
                      </button>
                      <button title="Duplicar" onClick={() => duplicate(r)} className="rounded-lg p-1.5 text-ink-600 hover:bg-black/5">
                        <Icon name="copy" className="h-4 w-4" />
                      </button>
                      <button title="Editar" onClick={() => setEditing(r)} className="rounded-lg p-1.5 text-ink-600 hover:bg-black/5">
                        <Icon name="edit" className="h-4 w-4" />
                      </button>
                      <button title="Excluir" onClick={() => remove(r)} className="rounded-lg p-1.5 text-red-600 hover:bg-red-50">
                        <Icon name="trash" className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function RecipeForm({
  recipe,
  categories,
  ingredients,
  onClose,
}: {
  recipe: Full | null;
  categories: Category[];
  ingredients: Ingredient[];
  onClose: () => void;
}) {
  const { logAction } = useAdminAuth();
  const [title, setTitle] = useState(recipe?.title ?? '');
  const [categoryId, setCategoryId] = useState(recipe?.category_id ?? categories[0]?.id ?? '');
  const [difficulty, setDifficulty] = useState(recipe?.difficulty ?? 'Fácil');
  const [prepTime, setPrepTime] = useState(recipe?.prep_time_minutes ?? 30);
  const [yieldQty, setYieldQty] = useState(recipe?.yield_quantity ?? 10);
  const [yieldUnit, setYieldUnit] = useState(recipe?.yield_unit ?? 'porções');
  const [imageUrl, setImageUrl] = useState(recipe?.image_url ?? '');
  const [description, setDescription] = useState(recipe?.description ?? '');
  const [instructions, setInstructions] = useState((recipe?.instructions ?? []).join('\n'));
  const [tips, setTips] = useState(recipe?.tips ?? '');
  const [storage, setStorage] = useState(recipe?.storage ?? '');
  const [equipment, setEquipment] = useState(recipe?.equipment ?? '');
  const [packagingCost, setPackagingCost] = useState(recipe?.packaging_cost ?? 0);
  const [otherCosts, setOtherCosts] = useState(recipe?.other_costs ?? 0);
  const [margin, setMargin] = useState(recipe?.profit_margin_percent ?? 70);
  const [published, setPublished] = useState(recipe?.published ?? false);
  const [rows, setRows] = useState(
    recipe?.recipe_ingredients.map((ri) => ({ ingredientId: ri.ingredient_id, quantity: ri.base_quantity, label: ri.display_label ?? '' })) ?? []
  );
  const [saving, setSaving] = useState(false);

  const previewCost = calcRecipeCost(
    { yield_quantity: yieldQty, packaging_cost: packagingCost, other_costs: otherCosts, profit_margin_percent: margin },
    rows.map((r) => ({ id: '', recipe_id: '', ingredient_id: r.ingredientId, base_quantity: r.quantity, display_label: r.label, sort_order: 0, ingredient: ingredients.find((i) => i.id === r.ingredientId) }))
  );

  async function save() {
    setSaving(true);
    const payload = {
      title,
      slug: recipe?.slug ?? `${slugify(title)}-${Date.now().toString(36)}`,
      category_id: categoryId || null,
      difficulty,
      prep_time_minutes: prepTime,
      yield_quantity: yieldQty,
      yield_unit: yieldUnit,
      image_url: imageUrl || null,
      description,
      instructions: instructions.split('\n').map((s) => s.trim()).filter(Boolean),
      tips,
      storage,
      equipment,
      packaging_cost: packagingCost,
      other_costs: otherCosts,
      profit_margin_percent: margin,
      published,
    };

    let recipeId = recipe?.id;
    if (recipe) {
      await supabase.from('recipes').update(payload).eq('id', recipe.id);
      await logAction('update', 'recipes', recipe.id, { title });
    } else {
      const { data } = await supabase.from('recipes').insert(payload).select().maybeSingle();
      recipeId = data?.id;
      await logAction('create', 'recipes', recipeId, { title });
    }

    if (recipeId) {
      await supabase.from('recipe_ingredients').delete().eq('recipe_id', recipeId);
      const ingredientRows = rows
        .filter((r) => r.ingredientId)
        .map((r, i) => ({ recipe_id: recipeId, ingredient_id: r.ingredientId, base_quantity: r.quantity, display_label: r.label || null, sort_order: i }));
      if (ingredientRows.length) await supabase.from('recipe_ingredients').insert(ingredientRows);
    }

    setSaving(false);
    onClose();
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <button onClick={onClose} className="inline-flex items-center gap-1 text-sm font-semibold text-ink-700">
          <Icon name="chevronRight" className="h-4 w-4 rotate-180" /> Voltar para a lista
        </button>
        <button onClick={save} disabled={saving || !title} className="btn-primary">{saving ? 'Salvando…' : 'Salvar receita'}</button>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_320px] lg:gap-6">
        <div className="card space-y-4 p-5">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="label">Título</label>
              <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div>
              <label className="label">Categoria</label>
              <select className="input" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Dificuldade</label>
              <select className="input" value={difficulty} onChange={(e) => setDifficulty(e.target.value as any)}>
                <option>Fácil</option><option>Médio</option><option>Difícil</option>
              </select>
            </div>
            <div>
              <label className="label">Tempo de preparo (min)</label>
              <input type="number" className="input" value={prepTime} onChange={(e) => setPrepTime(Number(e.target.value))} />
            </div>
            <div>
              <label className="label">Rendimento</label>
              <div className="flex gap-2">
                <input type="number" className="input" value={yieldQty} onChange={(e) => setYieldQty(Number(e.target.value))} />
                <input className="input" value={yieldUnit} onChange={(e) => setYieldUnit(e.target.value)} placeholder="porções, unidades…" />
              </div>
            </div>
            <div className="sm:col-span-2">
              <label className="label">URL da imagem (ou envie para o Supabase Storage e cole o link)</label>
              <input className="input" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://…" />
            </div>
            <div className="sm:col-span-2">
              <label className="label">Descrição curta</label>
              <textarea className="input min-h-[70px]" value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="label !mb-0">Ingredientes</label>
              <button onClick={() => setRows((r) => [...r, { ingredientId: ingredients[0]?.id ?? '', quantity: 1, label: '' }])} className="btn-secondary !py-1.5 !text-xs">
                <Icon name="plus" className="h-3.5 w-3.5" /> Adicionar
              </button>
            </div>
            <div className="space-y-2">
              {rows.map((row, i) => (
                <div key={i} className="grid grid-cols-[1fr_90px_1fr_36px] items-center gap-2">
                  <select className="input" value={row.ingredientId} onChange={(e) => setRows((r) => r.map((x, j) => (j === i ? { ...x, ingredientId: e.target.value } : x)))}>
                    {ingredients.map((ing) => <option key={ing.id} value={ing.id}>{ing.name}</option>)}
                  </select>
                  <input type="number" className="input" value={row.quantity} onChange={(e) => setRows((r) => r.map((x, j) => (j === i ? { ...x, quantity: Number(e.target.value) } : x)))} />
                  <input className="input" placeholder='Rótulo, ex: "2 xícaras (240g)"' value={row.label} onChange={(e) => setRows((r) => r.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)))} />
                  <button onClick={() => setRows((r) => r.filter((_, j) => j !== i))} className="rounded-lg p-2 text-red-600 hover:bg-red-50">
                    <Icon name="trash" className="h-4 w-4" />
                  </button>
                </div>
              ))}
              {rows.length === 0 && <p className="text-xs text-ink-600">Nenhum ingrediente adicionado.</p>}
            </div>
            <p className="mt-1 text-[11px] text-ink-600">A quantidade é usada na unidade cadastrada do ingrediente (g, ml, unidade…), para o rendimento base acima.</p>
          </div>

          <div>
            <label className="label">Modo de preparo (um passo por linha)</label>
            <textarea className="input min-h-[120px]" value={instructions} onChange={(e) => setInstructions(e.target.value)} />
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div><label className="label">Dicas</label><textarea className="input min-h-[80px]" value={tips} onChange={(e) => setTips(e.target.value)} /></div>
            <div><label className="label">Conservação</label><textarea className="input min-h-[80px]" value={storage} onChange={(e) => setStorage(e.target.value)} /></div>
            <div><label className="label">Equipamentos</label><textarea className="input min-h-[80px]" value={equipment} onChange={(e) => setEquipment(e.target.value)} /></div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="card space-y-3 p-5">
            <p className="text-sm font-bold text-ink-900">Custos e preço</p>
            <div><label className="label">Custo de embalagem (por unidade)</label><input type="number" className="input" value={packagingCost} onChange={(e) => setPackagingCost(Number(e.target.value))} /></div>
            <div><label className="label">Outros custos (por unidade)</label><input type="number" className="input" value={otherCosts} onChange={(e) => setOtherCosts(Number(e.target.value))} /></div>
            <div><label className="label">Margem de lucro desejada: {margin}%</label><input type="range" min={0} max={95} value={margin} onChange={(e) => setMargin(Number(e.target.value))} className="w-full accent-brand-500" /></div>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} /> Publicada (visível no app)</label>
          </div>

          <div className="card space-y-1.5 p-5">
            <p className="mb-2 text-sm font-bold text-ink-900">Prévia do cálculo</p>
            <Preview label="Custo dos ingredientes" value={formatBRL(previewCost.ingredientsCost)} />
            <Preview label="Custo total" value={formatBRL(previewCost.totalCost)} />
            <Preview label="Preço sugerido/un." value={formatBRL(previewCost.suggestedPricePerUnit)} />
            <Preview label={`Faturamento (${yieldQty} un.)`} value={formatBRL(previewCost.revenue)} />
            <Preview label="Lucro estimado" value={formatBRL(previewCost.profit)} strong />
          </div>
        </div>
      </div>
    </div>
  );
}

function Preview({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-ink-600">{label}</span>
      <span className={strong ? 'font-extrabold text-brand-600' : 'font-semibold text-ink-900'}>{value}</span>
    </div>
  );
}
