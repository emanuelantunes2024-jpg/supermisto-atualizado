import { useAuth } from '../lib/AuthContext.jsx';
import { siteConfig } from '../lib/config.js';

export default function Profile() {
  const { email, logout } = useAuth();

  return (
    <div className="mx-auto max-w-sm space-y-5 py-4">
      <div className="flex flex-col items-center gap-2 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-wine-500 text-2xl text-white">
          {email?.[0]?.toUpperCase() || '👤'}
        </span>
        <h1 className="font-display text-xl font-bold text-ink">{email}</h1>
        <p className="text-sm text-ink/50">Miembro de {siteConfig.nombre}</p>
      </div>

      <div className="rounded-2xl border border-line bg-shell p-4 text-sm">
        <p className="text-ink/70">
          ¿Tenés algún problema con tu acceso? Escribinos a{' '}
          <a href={`mailto:${siteConfig.soporteEmail}`} className="font-semibold text-wine-500">
            {siteConfig.soporteEmail}
          </a>
          .
        </p>
      </div>

      <button
        type="button"
        onClick={logout}
        className="w-full rounded-xl border border-line px-4 py-3 text-sm font-semibold text-ink/70 transition hover:bg-shell"
      >
        Cerrar sesión
      </button>
    </div>
  );
}
