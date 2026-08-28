import { Icon } from '../common/Icon';
import { useAdminAuth } from '../../lib/auth/AdminAuthContext';

export function AdminTopbar({ title, onMenu }: { title: string; onMenu: () => void }) {
  const { admin } = useAdminAuth();

  return (
    <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-black/5 bg-white px-4 py-4 lg:px-6">
      <button onClick={onMenu} className="rounded-lg p-2 text-ink-700 hover:bg-black/5 lg:hidden">
        <Icon name="menu" className="h-5 w-5" />
      </button>
      <h1 className="text-lg font-extrabold text-ink-900 lg:text-xl">{title}</h1>
      <div className="ml-auto flex items-center gap-3">
        <button className="rounded-lg p-2 text-ink-700 hover:bg-black/5">
          <Icon name="moon" className="h-5 w-5" />
        </button>
        <button className="relative rounded-lg p-2 text-ink-700 hover:bg-black/5">
          <Icon name="bell" className="h-5 w-5" />
          <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand-500 text-[9px] font-bold text-white">•</span>
        </button>
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-500 text-sm font-bold text-white">
            {(admin?.name ?? 'A').slice(0, 1).toUpperCase()}
          </div>
          <div className="hidden leading-tight sm:block">
            <p className="text-sm font-semibold text-ink-900">{admin?.name}</p>
            <p className="text-xs text-ink-600">{admin?.role?.name}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
