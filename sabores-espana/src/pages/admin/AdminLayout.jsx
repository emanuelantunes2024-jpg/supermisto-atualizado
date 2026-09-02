import { NavLink, Outlet } from 'react-router-dom';
import { useAdminAuth } from '../../lib/AdminAuthContext.jsx';

const LINKS = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/recetas', label: 'Recetas' },
];

export default function AdminLayout() {
  const { email, logout } = useAdminAuth();

  return (
    <div className="min-h-screen bg-cream">
      <header className="flex items-center justify-between border-b border-line bg-ink px-5 py-3 text-white">
        <div className="flex items-center gap-6">
          <span className="font-display font-bold">🇪🇸 Sabores de España · Admin</span>
          <nav className="flex gap-4 text-sm">
            {LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                className={({ isActive }) => (isActive ? 'font-semibold text-gold-200' : 'text-white/70 hover:text-white')}
              >
                {l.label}
              </NavLink>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-3 text-sm text-white/70">
          <span>{email}</span>
          <button type="button" onClick={logout} className="rounded-lg border border-white/30 px-3 py-1.5 hover:bg-white/10">
            Salir
          </button>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-5 py-6">
        <Outlet />
      </main>
    </div>
  );
}
