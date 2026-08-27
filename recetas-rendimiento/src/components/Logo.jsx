import { BRAND } from '../lib/brand.js';

/**
 * Marca de la aplicación — gorro de chef + nombre en tres líneas, igual que la
 * referencia visual. Para reemplazar el logo por un archivo propio basta con
 * definir `logoSrc` en src/lib/brand.js: no hay que tocar ningún otro archivo.
 */
function GorroChef({ className = 'w-6 h-6' }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
      <path
        d="M9 27h14v-2.5H9V27Z"
        fill="currentColor"
      />
      <path
        d="M23 22.5H9v-6.2a6.8 6.8 0 0 1-2.4-11 5.6 5.6 0 0 1 4.7-2.1A5.9 5.9 0 0 1 16 1.8a5.9 5.9 0 0 1 4.7 1.4 5.6 5.6 0 0 1 4.7 2.1 6.8 6.8 0 0 1-2.4 11v6.2Z"
        fill="currentColor"
      />
      <path d="M13 16.5v6M16 16.5v6M19 16.5v6" stroke="#F2571F" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

export default function Logo({ withText = true, dark = false, size = 'md' }) {
  const box = size === 'sm' ? 'h-10 w-10' : 'h-11 w-11';
  const glyph = size === 'sm' ? 'w-5 h-5' : 'w-6 h-6';

  return (
    <div className="flex items-center gap-3">
      <div
        className={`flex shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 text-white shadow-soft ${box}`}
      >
        {BRAND.logoSrc ? (
          <img src={BRAND.logoSrc} alt={BRAND.producto} className="h-full w-full rounded-2xl object-cover" />
        ) : (
          <GorroChef className={glyph} />
        )}
      </div>

      {withText && (
        <div className="min-w-0 leading-[1.05]">
          <p className={`text-[10px] font-semibold ${dark ? 'text-white/55' : 'text-ink/45'}`}>
            {BRAND.prefijo}
          </p>
          <p className="text-[15px] font-extrabold tracking-tight text-brand-500">{BRAND.nombreA}</p>
          <p className={`text-[15px] font-extrabold tracking-tight ${dark ? 'text-white' : 'text-ink'}`}>
            {BRAND.nombreB}
          </p>
        </div>
      )}
    </div>
  );
}
