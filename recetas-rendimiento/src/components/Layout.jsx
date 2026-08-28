import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';
import Topbar from './Topbar.jsx';
import { useIdioma } from '../lib/IdiomaContext.jsx';

export default function Layout() {
  const [drawer, setDrawer] = useState(false);
  const [colapsado, setColapsado] = useState(false);
  const location = useLocation();
  const { idioma } = useIdioma();

  useEffect(() => setDrawer(false), [location.pathname]);

  function alternarMenu() {
    if (window.innerWidth >= 1024) setColapsado((v) => !v);
    else setDrawer(true);
  }

  return (
    <div className="flex min-h-screen bg-cream">
      {/* Barra lateral fija en escritorio */}
      <aside
        className={`hidden shrink-0 border-r border-line transition-[width] duration-200 lg:block ${
          colapsado ? 'w-0 overflow-hidden' : 'w-[248px]'
        }`}
      >
        <div className="sticky top-0 h-screen w-[248px]">
          <Sidebar idioma={idioma} />
        </div>
      </aside>

      {/* Cajón en celular */}
      {drawer && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setDrawer(false)} />
          <div className="absolute left-0 top-0 h-full w-[264px] shadow-2xl">
            <Sidebar idioma={idioma} onNavigate={() => setDrawer(false)} onClose={() => setDrawer(false)} />
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar idioma={idioma} onOpenMenu={alternarMenu} />
        <main className="flex-1 px-4 py-6 lg:px-7 lg:py-7">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
