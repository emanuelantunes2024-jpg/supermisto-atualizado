import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext.jsx';
import { BRAND } from '../lib/brand.js';
import Logo from '../components/Logo.jsx';
import Icon from '../components/Icon.jsx';

const MENSAJES_ERROR = {
  datos_incompletos: 'Completá el email y la contraseña.',
  credenciales_invalidas: 'Email o contraseña incorrectos.',
  falta_session_secret: 'El panel todavía no está configurado (falta SESSION_SECRET en el servidor).',
  falta_admin_password_hash: 'El panel todavía no está configurado (falta ADMIN_PASSWORD_HASH en el servidor).',
  error_desconocido: 'No se pudo iniciar sesión. Intentá de nuevo.',
};

export default function AdminLogin() {
  const { loginAdmin } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verPassword, setVerPassword] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  async function onSubmit(e) {
    e.preventDefault();
    setCargando(true);
    setError(null);
    const r = await loginAdmin(email, password);
    setCargando(false);
    if (r.ok) {
      navigate('/admin', { replace: true });
    } else {
      setError(r.error || 'error_desconocido');
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-6 flex justify-center">
          <Logo />
        </div>

        <div className="card p-6">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-ink/45">
            Panel Admin · Recetas &amp; Rendimiento
          </p>
          <h1 className="mt-1 text-[19px] font-extrabold tracking-tight text-ink">Iniciar sesión</h1>
          <p className="mt-1.5 text-[12.5px] leading-relaxed text-ink/55">
            Acceso exclusivo para quien administra {BRAND.producto}.
          </p>

          <form onSubmit={onSubmit} className="mt-5 space-y-3">
            <div>
              <label className="label">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@tuemail.com"
                className="input mt-1.5"
                autoFocus
              />
            </div>
            <div>
              <label className="label">Contraseña</label>
              <div className="relative mt-1.5">
                <input
                  type={verPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input pr-10"
                />
                <button
                  type="button"
                  onClick={() => setVerPassword((v) => !v)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink/40 hover:text-ink"
                  aria-label={verPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  <Icon name={verPassword ? 'eyeOff' : 'eye'} className="h-4 w-4" />
                </button>
              </div>
            </div>

            <button type="submit" disabled={cargando} className="btn-primary w-full justify-center !py-2.5">
              {cargando ? 'Verificando…' : 'Entrar al panel'}
            </button>
          </form>

          {error && (
            <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3.5">
              <p className="text-[12.5px] font-semibold text-amber-800">
                {MENSAJES_ERROR[error] || MENSAJES_ERROR.error_desconocido}
              </p>
            </div>
          )}
        </div>

        <p className="mt-4 text-center text-[11px] text-ink/40">{BRAND.empresa}</p>
      </div>
    </div>
  );
}
