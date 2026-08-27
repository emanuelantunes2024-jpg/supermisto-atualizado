import { Link, NavLink } from 'react-router-dom';
import Icon from './Icon.jsx';
import Logo from './Logo.jsx';
import { NAV_PRINCIPAL, NAV_PIE } from '../lib/nav.js';
import { traducir } from '../lib/i18n.js';

function NavItem({ item, idioma, onNavigate }) {
  const contenido = (
    <>
      <Icon name={item.icon} className="w-[18px] h-[18px] shrink-0" />
      <span className="flex-1 truncate">{traducir(item.key, idioma)}</span>
      {item.badgeKey && (
        <span className="rounded-md bg-brand-500 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white">
          {traducir(item.badgeKey, idioma)}
        </span>
      )}
    </>
  );

  // "Salir" no marca estado activo: es una acción, no una sección.
  if (item.sinEstado) {
    return (
      <Link
        to={item.to}
        onClick={onNavigate}
        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13.5px] font-medium text-ink/60 transition hover:bg-brand-50/60 hover:text-ink"
      >
        {contenido}
      </Link>
    );
  }

  return (
    <NavLink
      to={item.to}
      end={item.end}
      onClick={onNavigate}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13.5px] font-medium transition ${
          isActive ? 'bg-brand-50 text-brand-600' : 'text-ink/60 hover:bg-brand-50/60 hover:text-ink'
        }`
      }
    >
      {contenido}
    </NavLink>
  );
}

export default function Sidebar({ idioma, onNavigate, onClose }) {
  return (
    <div className="flex h-full flex-col bg-white">
      <div className="flex items-start justify-between gap-2 px-5 py-5">
        <Logo />
        {onClose && (
          <button onClick={onClose} className="rounded-lg p-1.5 text-ink/50 hover:bg-black/5 lg:hidden">
            <Icon name="x" className="w-5 h-5" />
          </button>
        )}
      </div>

      <nav className="space-y-0.5 overflow-y-auto px-3 pb-2">
        {NAV_PRINCIPAL.map((item) => (
          <NavItem key={item.to} item={item} idioma={idioma} onNavigate={onNavigate} />
        ))}
      </nav>

      {/* separación amplia igual que la referencia */}
      <div className="min-h-[28px] flex-1" />

      <nav className="space-y-0.5 px-3 pb-5">
        {NAV_PIE.map((item) => (
          <NavItem key={item.to} item={item} idioma={idioma} onNavigate={onNavigate} />
        ))}
      </nav>
    </div>
  );
}
