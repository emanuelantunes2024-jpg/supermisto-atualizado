import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext.jsx';

export default function RequireMember({ children }) {
  const { cargando, activo } = useAuth();
  const location = useLocation();

  if (cargando) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream">
        <span className="text-sm text-ink/50">Cargando…</span>
      </div>
    );
  }

  if (!activo) {
    return <Navigate to="/entrar" replace state={{ from: location.pathname }} />;
  }

  return children;
}
