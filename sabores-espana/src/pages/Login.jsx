import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext.jsx';
import { siteConfig } from '../lib/config.js';

export default function Login() {
  const { activo, cargando, login } = useAuth();
  const [email, setEmail] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  if (!cargando && activo) {
    const destino = location.state?.from || '/app';
    return <Navigate to={destino} replace />;
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    setEnviando(true);
    try {
      await login(email.trim().toLowerCase());
      navigate('/app', { replace: true });
    } catch (err) {
      setError(
        err.message === 'sin_acceso'
          ? 'Ese email todavía no tiene una compra activa. Si acabás de comprar, esperá un minuto y probá de nuevo.'
          : 'No encontramos ese email. Usá el mismo que usaste en la compra de Hotmart.',
      );
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-wine-gradient px-5">
      <div className="w-full max-w-sm rounded-2xl bg-shell p-7 shadow-lift">
        <div className="mb-6 text-center">
          <span className="text-3xl">🇪🇸</span>
          <h1 className="mt-2 font-display text-xl font-bold text-ink">{siteConfig.nombre}</h1>
          <p className="mt-1 text-sm text-ink/60">Ingresá con el email que usaste en la compra</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-3">
          <input
            type="email"
            required
            placeholder="tu-email@ejemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-line px-4 py-3 text-sm text-ink outline-none focus:border-wine-400"
          />
          {error && <p className="text-xs text-wine-500">{error}</p>}
          <button
            type="submit"
            disabled={enviando}
            className="w-full rounded-xl bg-wine-500 px-4 py-3 text-sm font-semibold text-white shadow-card transition hover:bg-wine-600 disabled:opacity-60"
          >
            {enviando ? 'Verificando…' : 'Entrar'}
          </button>
        </form>

        <p className="mt-5 text-center text-xs text-ink/50">
          ¿Todavía no compraste?{' '}
          <Link to="/" className="font-semibold text-wine-500">
            Ver el producto
          </Link>
        </p>
      </div>
    </div>
  );
}
