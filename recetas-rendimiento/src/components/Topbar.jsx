import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from './Icon.jsx';
import { useStore } from '../lib/StoreContext.jsx';

export default function Topbar({ onOpenMenu }) {
  const navigate = useNavigate();
  const { recetasPublicadas } = useStore();
  const [q, setQ] = useState('');
  const novedades = recetasPublicadas.filter((r) => r.novedad).length;

  function buscar(e) {
    e.preventDefault();
    navigate(`/buscar${q ? `?q=${encodeURIComponent(q)}` : ''}`);
  }

  return (
    <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-black/5 bg-cream/90 px-4 py-3 backdrop-blur lg:px-8">
      <button
        onClick={onOpenMenu}
        className="rounded-xl border border-black/10 bg-white p-2 text-ink/70 shadow-soft lg:hidden"
        aria-label="Abrir menú"
      >
        <Icon name="menu" className="w-5 h-5" />
      </button>

      <form onSubmit={buscar} className="relative flex-1 max-w-xl">
        <Icon name="search" className="pointer-events-none absolute left-3 top-1/2 w-4 h-4 -translate-y-1/2 text-ink/40" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar recetas, ingredientes…"
          className="input pl-9"
        />
      </form>

      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        <button
          onClick={() => navigate('/novedades')}
          className="relative rounded-xl border border-black/10 bg-white p-2.5 text-ink/70 shadow-soft hover:text-brand-600"
          aria-label="Novedades"
        >
          <Icon name="bell" className="w-5 h-5" />
          {novedades > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4.5 min-w-[18px] items-center justify-center rounded-full bg-brand-500 px-1 text-[10px] font-bold text-white">
              {novedades}
            </span>
          )}
        </button>

        <div className="flex items-center gap-2 rounded-xl border border-black/10 bg-white py-1.5 pl-1.5 pr-3 shadow-soft">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-100 text-sm font-bold text-brand-600">
            LS
          </div>
          <span className="hidden text-sm font-semibold text-ink sm:block">¡Hola, Chef!</span>
        </div>
      </div>
    </header>
  );
}
