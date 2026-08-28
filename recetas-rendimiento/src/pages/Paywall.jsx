import { useState } from 'react';
import { useAuth } from '../lib/AuthContext.jsx';
import { BRAND } from '../lib/brand.js';
import Logo from '../components/Logo.jsx';
import Icon from '../components/Icon.jsx';

export default function Paywall() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [estado, setEstado] = useState('inicial'); // inicial | verificando | sin_suscripcion
  const [error, setError] = useState(null);

  async function onSubmit(e) {
    e.preventDefault();
    setEstado('verificando');
    setError(null);
    const r = await login(email);
    if (!r.ok) {
      setEstado('sin_suscripcion');
      setError(r.error);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-6 flex justify-center">
          <Logo />
        </div>

        <div className="card p-6">
          <h1 className="text-[19px] font-extrabold tracking-tight text-ink">Ingresá con tu email de compra</h1>
          <p className="mt-1.5 text-[12.5px] leading-relaxed text-ink/55">
            Usá el mismo email con el que compraste en Hotmart para activar tu acceso.
          </p>

          <form onSubmit={onSubmit} className="mt-5 space-y-3">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEstado('inicial');
              }}
              placeholder="tu@email.com"
              className="input"
              autoFocus
            />
            <button type="submit" disabled={estado === 'verificando'} className="btn-primary w-full justify-center !py-2.5">
              {estado === 'verificando' ? 'Verificando…' : 'Entrar'}
            </button>
          </form>

          {estado === 'sin_suscripcion' && (
            <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3.5">
              <p className="text-[12.5px] font-semibold text-amber-800">
                {error === 'email_invalido' ? 'Ingresá un email válido.' : 'No encontramos una suscripción activa con este email.'}
              </p>
              {error !== 'email_invalido' && (
                <p className="mt-1 text-[12px] leading-relaxed text-amber-700">
                  Si acabás de comprar, esperá unos minutos y probá de nuevo. Si todavía no compraste:
                </p>
              )}
            </div>
          )}

          {estado === 'sin_suscripcion' && error !== 'email_invalido' && (
            <a
              href={BRAND.hotmartCheckoutUrl}
              target="_blank"
              rel="noreferrer"
              className="btn-secondary mt-3 w-full justify-center !py-2.5"
            >
              <Icon name="bolt" className="w-4 h-4" /> Quiero suscribirme
            </a>
          )}
        </div>

        <p className="mt-4 text-center text-[11px] text-ink/40">{BRAND.empresa}</p>
      </div>
    </div>
  );
}
