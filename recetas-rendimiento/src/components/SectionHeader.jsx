import { Link } from 'react-router-dom';

export default function SectionHeader({ title, subtitle, badge, action, actionTo }) {
  return (
    <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-extrabold text-ink sm:text-xl">{title}</h2>
          {badge && (
            <span className="rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-semibold text-brand-600">
              {badge}
            </span>
          )}
        </div>
        {subtitle && <p className="mt-0.5 text-sm text-ink/50">{subtitle}</p>}
      </div>
      {action && actionTo && (
        <Link to={actionTo} className="text-sm font-semibold text-brand-600 hover:text-brand-700">
          {action} →
        </Link>
      )}
    </div>
  );
}
