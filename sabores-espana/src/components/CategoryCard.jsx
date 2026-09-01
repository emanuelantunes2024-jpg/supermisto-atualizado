import { Link } from 'react-router-dom';

export default function CategoryCard({ categoria, total = 0 }) {
  return (
    <Link
      to={`/app/categoria/${categoria.slug}`}
      className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-line bg-shell p-4 text-center shadow-card transition hover:shadow-lift"
      style={{ borderTopWidth: 3, borderTopColor: categoria.color }}
    >
      <span className="text-3xl">{categoria.icon}</span>
      <span className="font-display text-sm font-semibold leading-tight text-ink">{categoria.name}</span>
      <span className="text-[11px] text-ink/50">{total} recetas</span>
    </Link>
  );
}
