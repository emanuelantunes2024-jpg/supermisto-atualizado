import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from './Icon.jsx';
import { useStore } from '../lib/StoreContext.jsx';
import { useIdioma } from '../lib/IdiomaContext.jsx';
import { traducir, IDIOMAS } from '../lib/i18n.js';

export default function Topbar({ idioma, onOpenMenu }) {
  const navigate = useNavigate();
  const { recetasPublicadas } = useStore();
  const { setIdioma } = useIdioma();
  const [q, setQ] = useState('');
  const novedades = recetasPublicadas.filter((r) => r.novedad).length;

  function buscar(e) {
    e.preventDefault();
    navigate(`/buscar${q ? `?q=${encodeURIComponent(q)}` : ''}`);
  }

  return (
    <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-line bg-white px-4 py-3 lg:px-6">
      <button
        onClick={onOpenMenu}
        className="shrink-0 rounded-lg p-2 text-ink/60 transition hover:bg-black/5"
        aria-label="Abrir menú"
      >
        <Icon name="menu" className="w-5 h-5" />
      </button>

      {/* buscador centrado, con la lupa a la derecha (igual que la referencia) */}
      <form onSubmit={buscar} className="relative mx-auto w-full max-w-[420px]">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={traducir('top.buscar', idioma)}
          className="w-full rounded-full border border-line bg-white py-2 pl-4 pr-10 text-[13px] text-ink placeholder:text-ink/40 focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-100"
        />
        <button
          type="submit"
          className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-ink/40 transition hover:text-brand-500"
          aria-label="Buscar"
        >
          <Icon name="search" className="w-[18px] h-[18px]" />
        </button>
      </form>

      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        <div className="relative">
          <select
            value={idioma}
            onChange={(e) => setIdioma(e.target.value)}
            aria-label="Idioma"
            className="appearance-none rounded-lg border border-ink/15 bg-white py-1.5 pl-2.5 pr-6 text-[12px] font-semibold text-ink/70 transition hover:border-brand-300 focus:border-brand-400 focus:outline-none"
          >
            {IDIOMAS.map((i) => (
              <option key={i.code} value={i.code}>
                {i.code.toUpperCase()}
              </option>
            ))}
          </select>
          <Icon name="chevronDown" className="pointer-events-none absolute right-1.5 top-1/2 h-3 w-3 -translate-y-1/2 text-ink/40" />
        </div>

        <button
          onClick={() => navigate('/novedades')}
          className="relative rounded-lg p-2 text-ink/60 transition hover:bg-black/5 hover:text-brand-600"
          aria-label={traducir('nav.novedades', idioma)}
        >
          <Icon name="bell" className="w-5 h-5" />
          {novedades > 0 && (
            <span className="absolute right-0.5 top-0.5 flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-brand-500 px-1 text-[9.5px] font-bold text-white ring-2 ring-white">
              {novedades}
            </span>
          )}
        </button>

        <button className="flex items-center gap-2 rounded-full py-1 pl-1 pr-2 transition hover:bg-black/5">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-brand-300 to-brand-600 text-[13px] font-bold text-white">
            RR
          </span>
          <span className="hidden text-[13px] font-semibold text-ink sm:block">
            {traducir('top.saludo', idioma)}
          </span>
          <Icon name="chevronDown" className="hidden w-4 h-4 text-ink/40 sm:block" />
        </button>
      </div>
    </header>
  );
}
