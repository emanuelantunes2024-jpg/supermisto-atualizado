import { useState } from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';
import Icon from '../../components/Icon.jsx';
import Logo from '../../components/Logo.jsx';
import { BRAND } from '../../lib/brand.js';

// Área administrativa — separada de la interfaz del cliente.
const NAV = [
  { to: '/admin', label: 'Dashboard', icon: 'dashboard', end: true },
  { to: '/admin/recetas', label: 'Recetas', icon: 'book' },
  { to: '/admin/categorias', label: 'Categorías', icon: 'grid' },
  { to: '/admin/etiquetas', label: 'Etiquetas', icon: 'tag' },
  { to: '/admin/usuarios', label: 'Usuarios', icon: 'users' },
  { to: '/admin/novedades', label: 'Novedades', icon: 'bell' },
  { to: '/admin/reportes', label: 'Reportes', icon: 'report' },
  { to: '/admin/configuracion', label: 'Configuración', icon: 'settings' },
];

function Contenido({ onNavigate }) {
  return (
    <div className="flex h-full flex-col bg-[#1B1512] text-white">
      <div className="px-5 py-5">
        <Logo dark />
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3">
        {NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition ${
                isActive ? 'bg-brand-500 text-white' : 'text-white/55 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            <Icon name={item.icon} className="w-[18px] h-[18px]" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 pb-5 pt-2">
        <Link
          to="/"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium text-white/55 transition hover:bg-white/5 hover:text-white"
        >
          <Icon name="logout" className="w-[18px] h-[18px]" /> Salir
        </Link>
      </div>
    </div>
  );
}

export default function AdminLayout() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-cream">
      <aside className="hidden w-[236px] shrink-0 lg:block">
        <div className="sticky top-0 h-screen">
          <Contenido />
        </div>
      </aside>

      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-[248px] shadow-2xl">
            <Contenido onNavigate={() => setOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-line bg-white px-4 py-3 lg:px-6">
          <button
            onClick={() => setOpen(true)}
            className="rounded-lg p-2 text-ink/60 transition hover:bg-black/5 lg:hidden"
            aria-label="Abrir menú"
          >
            <Icon name="menu" className="w-5 h-5" />
          </button>
          <p className="text-[13.5px] font-bold text-ink">Panel Administrativo</p>
          <Link
            to="/"
            className="ml-auto text-[12.5px] font-semibold text-ink/50 transition hover:text-brand-600"
          >
            Ver {BRAND.producto} →
          </Link>
        </header>
        <main className="flex-1 px-4 py-6 lg:px-7 lg:py-7">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
