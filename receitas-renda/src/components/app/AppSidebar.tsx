import { NavLink } from 'react-router-dom';
import { Icon, type IconName } from '../common/Icon';
import { useAuth } from '../../lib/auth/AuthContext';

const nav: { to: string; label: string; icon: IconName; badge?: string }[] = [
  { to: '/app', label: 'Início', icon: 'home' },
  { to: '/app/receitas', label: 'Receitas', icon: 'book' },
  { to: '/app/categorias', label: 'Categorias', icon: 'grid' },
  { to: '/app/buscar', label: 'Buscar', icon: 'search' },
  { to: '/app/calculadoras', label: 'Calculadoras', icon: 'calculator' },
  { to: '/app/lista-de-compras', label: 'Lista de Compras', icon: 'cart' },
  { to: '/app/central-de-renda', label: 'Central de Renda', icon: 'target' },
  { to: '/app/favoritos', label: 'Favoritos', icon: 'heart' },
  { to: '/app/colecoes', label: 'Minhas Coleções', icon: 'folder' },
  { to: '/app/novidades', label: 'Novidades', icon: 'sparkle' },
  { to: '/app/meu-plano', label: 'Meu Plano', icon: 'card' },
  { to: '/app/assistente-ia', label: 'Assistente IA', icon: 'bot', badge: 'Novo' },
];

export function AppSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { signOut } = useAuth();

  return (
    <>
      {open && <div className="fixed inset-0 z-30 bg-black/30 lg:hidden" onClick={onClose} />}
      <aside
        className={`fixed z-40 flex h-full w-64 flex-col border-r border-black/5 bg-white transition-transform lg:sticky lg:top-0 lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center gap-2 px-5 py-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500 text-white">
            <Icon name="wheat" className="h-5 w-5" />
          </div>
          <div className="leading-tight">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-600">Central de</p>
            <p className="-mt-0.5 text-lg font-extrabold text-brand-600">
              Receitas<span className="text-ink-900">&amp;Renda</span>
            </p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 pb-4">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/app'}
              onClick={onClose}
              className={({ isActive }) =>
                `mb-1 flex items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  isActive ? 'bg-brand-500 text-white shadow-card' : 'text-ink-700 hover:bg-black/[0.04]'
                }`
              }
            >
              <span className="flex items-center gap-3">
                <Icon name={item.icon} className="h-[18px] w-[18px]" />
                {item.label}
              </span>
              {item.badge && (
                <span className="rounded-full bg-brand-100 px-2 py-0.5 text-[10px] font-bold text-brand-700">
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-black/5 p-3">
          <NavLink to="/app/configuracoes" className="mb-1 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-ink-700 hover:bg-black/[0.04]">
            <Icon name="gear" className="h-[18px] w-[18px]" /> Configurações
          </NavLink>
          <button
            onClick={() => signOut()}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"
          >
            <Icon name="logout" className="h-[18px] w-[18px]" /> Sair
          </button>
        </div>
      </aside>
    </>
  );
}
