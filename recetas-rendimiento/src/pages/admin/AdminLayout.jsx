import { useState } from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';
import Icon from '../../components/Icon.jsx';

const NAV = [
  { to: '/admin', label: 'Dashboard', icon: 'dashboard', end: true },
  { to: '/admin/recetas', label: 'Recetas', icon: 'book' },
  { to: '/admin/categorias', label: 'Categorías', icon: 'grid' },
];

function SidebarContent({ onNavigate }) {
  return (
    <div className="flex h-full flex-col bg-[#181113] text-white">
      <div className="flex items-center gap-2.5 px-5 py-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 text-lg">
          👩‍🍳
        </div>
        <div className="leading-tight">
          <p className="text-sm font-extrabold">Panel Administrativo</p>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-brand-400">Leuname Software</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                isActive ? 'bg-brand-500 text-white' : 'text-white/60 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            <Icon name={item.icon} className="w-5 h-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="space-y-1 border-t border-white/10 px-3 py-3">
        <Link to="/" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/60 hover:bg-white/5 hover:text-white">
          <Icon name="home" className="w-5 h-5" /> Volver a la app
        </Link>
        <Link to="/" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/60 hover:bg-white/5 hover:text-white">
          <Icon name="logout" className="w-5 h-5" /> Salir
        </Link>
      </div>
    </div>
  );
}

export default function AdminLayout() {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-cream lg:flex">
      <aside className="hidden w-64 shrink-0 lg:block">
        <div className="sticky top-0 h-screen">
          <SidebarContent />
        </div>
      </aside>

      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-64 shadow-2xl">
            <SidebarContent onNavigate={() => setOpen(false)} />
          </div>
        </div>
      )}

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-black/5 bg-white px-4 py-3 lg:px-8">
          <button onClick={() => setOpen(true)} className="rounded-xl border border-black/10 p-2 text-ink/70 lg:hidden">
            <Icon name="menu" className="w-5 h-5" />
          </button>
          <p className="text-sm font-bold text-ink">Recetas & Rendimiento · Administración</p>
        </header>
        <main className="mx-auto max-w-7xl px-4 py-6 lg:px-8 lg:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
