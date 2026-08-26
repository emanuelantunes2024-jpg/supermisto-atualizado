import Icon from './Icon.jsx';

export default function EmptyState({ icon = 'book', title, description, action }) {
  return (
    <div className="card flex flex-col items-center gap-3 px-6 py-14 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-500">
        <Icon name={icon} className="w-7 h-7" />
      </div>
      <h3 className="text-base font-bold text-ink">{title}</h3>
      {description && <p className="max-w-sm text-sm text-ink/50">{description}</p>}
      {action}
    </div>
  );
}
