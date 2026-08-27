import { Link } from 'react-router-dom';
import { RecipeImage } from '../common/RecipeImage';
import { Icon } from '../common/Icon';
import type { Recipe } from '../../lib/types';

export function RecipeCard({ recipe }: { recipe: Recipe }) {
  return (
    <Link to={`/app/receitas/${recipe.slug}`} className="card group overflow-hidden">
      <div className="relative">
        <RecipeImage src={recipe.image_url} alt={recipe.title} className="h-36 w-full object-cover" />
        <div className="absolute left-2 top-2 flex gap-1">
          {recipe.is_new && <span className="rounded-md bg-brand-500 px-1.5 py-0.5 text-[10px] font-bold text-white">Novo</span>}
          {recipe.featured && <span className="rounded-md bg-ink-900 px-1.5 py-0.5 text-[10px] font-bold text-white">Destaque</span>}
        </div>
        <span className="absolute bottom-2 right-2 flex items-center gap-1 rounded-md bg-black/60 px-1.5 py-0.5 text-[10px] text-white">
          <Icon name="chevronRight" className="hidden h-3 w-3" />⏱ {recipe.prep_time_minutes}min
        </span>
      </div>
      <div className="p-3">
        <p className="line-clamp-2 text-sm font-bold text-ink-900">{recipe.title}</p>
        <p className="mt-0.5 text-xs text-ink-600">{recipe.category?.name ?? 'Sem categoria'}</p>
      </div>
    </Link>
  );
}
