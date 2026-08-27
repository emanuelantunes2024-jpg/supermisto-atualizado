import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';
import Topbar from './Topbar.jsx';

export default function Layout() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => setOpen(false), [location.pathname]);

  return (
    <div className="min-h-screen bg-cream lg:flex">
      {/* Sidebar de escritorio */}
      <aside className="hidden w-72 shrink-0 border-r border-black/5 lg:block">
        <div className="sticky top-0 h-screen">
          <Sidebar />
        </div>
      </aside>

      {/* Sidebar móvil (drawer) */}
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-72 shadow-2xl">
            <Sidebar onNavigate={() => setOpen(false)} onClose={() => setOpen(false)} />
          </div>
        </div>
      )}

      <div className="min-w-0 flex-1">
        <Topbar onOpenMenu={() => setOpen(true)} />
        <main className="mx-auto max-w-7xl px-4 py-6 lg:px-8 lg:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
