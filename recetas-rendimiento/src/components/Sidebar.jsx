import { NavLink } from 'react-router-dom';
import Icon from './Icon.jsx';
import Logo from './Logo.jsx';
import { NAV_PRINCIPAL, NAV_HERRAMIENTAS, NAV_MIS_RECETAS, NAV_CUENTA } from '../lib/nav.js';

function NavItem({ item, onNavigate }) {
  return (
    <NavLink
      to={item.to}
      end={item.end}
      onClick={onNavigate}
      className={({ isActive }) =>
        `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
          isActive
            ? 'bg-brand-50 text-brand-600'
            : 'text-ink/65 hover:bg-black/5 hover:text-ink'
        }`
      }
    >
      <Icon name={item.icon} className="w-5 h-5 shrink-0" />
      <span className="flex-1 truncate">{item.label}</span>
      {item.badge && (
        <span className="rounded-full bg-brand-500 px-2 py-0.5 text-[10px] font-bold uppercase text-white">
          {item.badge}
        </span>
      )}
    </NavLink>
  );
}

function Section({ title, items, onNavigate }) {
  return (
    <div className="space-y-1">
      {title && <p className="label px-3 pb-1 pt-3">{title}</p>}
      {items.map((item) => (
        <NavItem key={item.to} item={item} onNavigate={onNavigate} />
      ))}
    </div>
  );
}

export default function Sidebar({ onNavigate, onClose }) {
  return (
    <div className="flex h-full flex-col bg-white">
      <div className="flex items-center justify-between gap-2 px-4 py-5">
        <Logo />
        {onClose && (
          <button onClick={onClose} className="rounded-lg p-1.5 text-ink/50 hover:bg-black/5 lg:hidden">
            <Icon name="x" className="w-5 h-5" />
          </button>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto px-3 pb-4">
        <Section items={NAV_PRINCIPAL} onNavigate={onNavigate} />
        <Section title="Herramientas" items={NAV_HERRAMIENTAS} onNavigate={onNavigate} />
        <Section title="Mis recetas" items={NAV_MIS_RECETAS} onNavigate={onNavigate} />
        <Section title="Cuenta" items={NAV_CUENTA} onNavigate={onNavigate} />
      </nav>

      <div className="space-y-1 border-t border-black/5 px-3 py-3">
        <NavItem item={{ to: '/admin', label: 'Panel Administrativo', icon: 'dashboard' }} onNavigate={onNavigate} />
        <NavItem item={{ to: '/configuracion', label: 'Configuración', icon: 'settings' }} onNavigate={onNavigate} />
      </div>
    </div>
  );
}
