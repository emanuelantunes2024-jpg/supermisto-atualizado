import { NavLink } from 'react-router-dom';
import { Icon, type IconName } from '../common/Icon';
import { useAdminAuth } from '../../lib/auth/AdminAuthContext';

const nav: { to: string; label: string; icon: IconName; perm?: string }[] = [
  { to: '/admin', label: 'Dashboard', icon: 'home' },
  { to: '/admin/receitas', label: 'Receitas', icon: 'book', perm: 'recipes.manage' },
  { to: '/admin/ingredientes', label: 'Ingredientes', icon: 'wheat', perm: 'ingredients.manage' },
  { to: '/admin/categorias', label: 'Categorias', icon: 'grid', perm: 'recipes.manage' },
  { to: '/admin/usuarios', label: 'Usuários', icon: 'users', perm: 'users.manage' },
  { to: '/admin/planos', label: 'Planos', icon: 'card', perm: 'plans.manage' },
  { to: '/admin/assinaturas', label: 'Assinaturas', icon: 'receipt', perm: 'subscriptions.manage' },
  { to: '/admin/central-de-renda', label: 'Central de Renda', icon: 'target' },
  { to: '/admin/calculadoras', label: 'Calculadoras', icon: 'calculator' },
  { to: '/admin/simulador', label: 'Simulador', icon: 'scale' },
  { to: '/admin/lista-de-compras', label: 'Lista de Compras', icon: 'cart' },
  { to: '/admin/favoritos', label: 'Favoritos', icon: 'heart' },
  { to: '/admin/novidades', label: 'Novidades', icon: 'sparkle', perm: 'news.manage' },
  { to: '/admin/banners', label: 'Banners / Destaques', icon: 'image', perm: 'banners.manage' },
  { to: '/admin/assistente-ia', label: 'Assistente IA', icon: 'bot' },
  { to: '/admin/comentarios', label: 'Comentários', icon: 'chat', perm: 'comments.moderate' },
  { to: '/admin/notificacoes', label: 'Notificações', icon: 'bell', perm: 'notifications.manage' },
  { to: '/admin/relatorios', label: 'Relatórios', icon: 'chart', perm: 'reports.view' },
  { to: '/admin/suporte', label: 'Suporte', icon: 'lifebuoy', perm: 'support.manage' },
  { to: '/admin/administradores', label: 'Administradores', icon: 'shield', perm: 'admins.manage' },
  { to: '/admin/permissoes', label: 'Permissões', icon: 'key', perm: 'permissions.manage' },
  { to: '/admin/logs', label: 'Logs do Sistema', icon: 'list', perm: 'logs.view' },
  { to: '/admin/configuracoes', label: 'Configurações', icon: 'gear', perm: 'settings.manage' },
];

export function AdminSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { can, signOut, admin } = useAdminAuth();
  const items = nav.filter((n) => !n.perm || can(n.perm));

  return (
    <>
      {open && <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={onClose} />}
      <aside
        className={`fixed z-40 flex h-full w-64 flex-col bg-ink-900 text-white transition-transform lg:sticky lg:top-0 lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center gap-2 px-5 py-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500">
            <Icon name="wheat" className="h-5 w-5" />
          </div>
          <div className="leading-tight">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-white/50">Central de</p>
            <p className="-mt-0.5 text-lg font-extrabold text-brand-400">
              Receitas<span className="text-white">&amp;Renda</span>
            </p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 pb-4">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/admin'}
              onClick={onClose}
              className={({ isActive }) =>
                `mb-1 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  isActive ? 'bg-brand-500 text-white' : 'text-white/70 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <Icon name={item.icon} className="h-[18px] w-[18px]" /> {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-white/10 p-3">
          <p className="px-3 py-1 text-[11px] text-white/40">{admin?.role?.name}</p>
          <button onClick={() => signOut()} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-300 hover:bg-white/5">
            <Icon name="logout" className="h-[18px] w-[18px]" /> Sair
          </button>
        </div>
      </aside>
    </>
  );
}
