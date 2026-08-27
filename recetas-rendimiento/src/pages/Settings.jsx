import Icon from '../components/Icon.jsx';
import { useIdioma } from '../lib/IdiomaContext.jsx';
import { IDIOMAS } from '../lib/i18n.js';
import { BRAND } from '../lib/brand.js';

export default function Settings() {
  const { idioma, setIdioma, t } = useIdioma();

  return (
    <div className="max-w-2xl space-y-5">
      <div>
        <h1 className="text-[22px] font-extrabold tracking-tight text-ink">{t('nav.config')}</h1>
        <p className="mt-1 text-[13px] text-ink/50">Preferencias de la aplicación.</p>
      </div>

      <div className="card p-5">
        <p className="text-[14px] font-bold text-ink">Idioma</p>
        <p className="mt-0.5 text-[12px] text-ink/45">
          Cambia solo el texto: la estructura visual permanece igual.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {IDIOMAS.map((i) => (
            <button
              key={i.code}
              onClick={() => setIdioma(i.code)}
              className={`pill ${idioma === i.code ? 'pill-active' : ''}`}
            >
              {idioma === i.code && <Icon name="check" className="w-3.5 h-3.5" />}
              {i.label}
            </button>
          ))}
        </div>
      </div>

      <div className="card p-5">
        <p className="text-[14px] font-bold text-ink">Acerca de</p>
        <dl className="mt-3 space-y-2 text-[13px]">
          <div className="flex justify-between">
            <dt className="text-ink/50">Producto</dt>
            <dd className="font-semibold text-ink">{BRAND.producto}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-ink/50">Desarrollado por</dt>
            <dd className="font-semibold text-ink">{BRAND.empresa}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-ink/50">Versión</dt>
            <dd className="font-semibold text-ink">1.0</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
