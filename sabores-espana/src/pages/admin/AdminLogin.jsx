import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../lib/AdminAuthContext.jsx';

export default function AdminLogin() {
  const { email, cargando, login } = useAdminAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);
  const navigate = useNavigate();

  if (!cargando && email) return <Navigate to="/admin" replace />;

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    setEnviando(true);
    try {
      await login(form.email.trim().toLowerCase(), form.password);
      navigate('/admin', { replace: true });
    } catch {
      setError('Email o contraseña incorrectos.');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-5">
      <div className="w-full max-w-sm rounded-2xl bg-shell p-7 shadow-lift">
        <h1 className="mb-1 font-display text-xl font-bold text-ink">Panel administrativo</h1>
        <p className="mb-6 text-sm text-ink/60">Sabores de España</p>
        <form onSubmit={onSubmit} className="space-y-3">
          <input
            type="email"
            required
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            className="w-full rounded-xl border border-line px-4 py-3 text-sm outline-none focus:border-wine-400"
          />
          <input
            type="password"
            required
            placeholder="Contraseña"
            value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            className="w-full rounded-xl border border-line px-4 py-3 text-sm outline-none focus:border-wine-400"
          />
          {error && <p className="text-xs text-wine-500">{error}</p>}
          <button
            type="submit"
            disabled={enviando}
            className="w-full rounded-xl bg-ink px-4 py-3 text-sm font-semibold text-white transition hover:bg-ink/90 disabled:opacity-60"
          >
            {enviando ? 'Entrando…' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}
