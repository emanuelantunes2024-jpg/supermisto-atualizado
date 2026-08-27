import { BRAND } from '../lib/brand.js';

/**
 * Marca de la aplicación — logo + nombre. Usar este componente en vez de
 * repetir el emoji/ícono a mano, así el logo se puede reemplazar en un solo lugar
 * (ver src/lib/brand.js).
 */
export default function Logo({ withText = true, dark = false, size = 'md' }) {
  const box = size === 'sm' ? 'h-9 w-9 text-base' : 'h-10 w-10 text-lg';

  return (
    <div className="flex items-center gap-2.5">
      <div className={`flex shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 shadow-soft ${box}`}>
        {BRAND.logoSrc ? (
          <img src={BRAND.logoSrc} alt={BRAND.producto} className="h-full w-full rounded-xl object-cover" />
        ) : (
          <span>{BRAND.logoEmoji}</span>
        )}
      </div>
      {withText && (
        <div className="min-w-0 leading-tight">
          <p className={`truncate text-sm font-extrabold ${dark ? 'text-white' : 'text-ink'}`}>{BRAND.producto}</p>
          <p className="truncate text-[11px] font-semibold uppercase tracking-wide text-brand-500">
            {BRAND.empresa}
          </p>
        </div>
      )}
    </div>
  );
}
