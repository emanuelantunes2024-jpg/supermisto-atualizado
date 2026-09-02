import { Navigate } from 'react-router-dom';
import { useAdminAuth } from '../lib/AdminAuthContext.jsx';

export default function RequireAdmin({ children }) {
  const { cargando, email } = useAdminAuth();

  if (cargando) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink">
        <span className="text-sm text-white/60">Cargando…</span>
      </div>
    );
  }

  if (!email) return <Navigate to="/admin/entrar" replace />;

  return children;
}
