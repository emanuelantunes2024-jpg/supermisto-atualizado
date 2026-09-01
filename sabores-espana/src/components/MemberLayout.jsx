import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext.jsx';

const TABS = [
  { to: '/app', label: 'Inicio', icon: '🏠', end: true },
  { to: '/app/buscar', label: 'Buscar', icon: '🔎' },
  { to: '/app/favoritos', label: 'Favoritos', icon: '❤️' },
  { to: '/app/perfil', label: 'Perfil', icon: '👤' },
];

export default function MemberLayout() {
  const { email, logout } = useAuth();

  return (
    <div className="flex min-h-screen flex-col bg-cream">
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-line bg-cream/95 px-4 py-3 backdrop-blur">
        <div className="flex items-center gap-2">
          <span className="text-xl">🇪🇸</span>
          <span className="font-display text-lg font-bold text-wine-500">Sabores de España</span>
        </div>
        <div className="hidden items-center gap-3 text-sm text-ink/60 sm:flex">
          <span>{email}</span>
          <button type="button" onClick={logout} className="rounded-lg border border-line px-3 py-1.5 hover:bg-white">
            Salir
          </button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 pb-24 pt-4 sm:pb-10">
        <Outlet />
      </main>

      <nav className="safe-bottom fixed bottom-0 left-0 right-0 z-30 flex border-t border-line bg-shell/95 backdrop-blur sm:hidden">
        {TABS.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.end}
            className={({ isActive }) =>
              `flex flex-1 flex-col items-center gap-0.5 py-2 text-[11px] font-medium ${
                isActive ? 'text-wine-500' : 'text-ink/50'
              }`
            }
          >
            <span className="text-lg">{tab.icon}</span>
            {tab.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
