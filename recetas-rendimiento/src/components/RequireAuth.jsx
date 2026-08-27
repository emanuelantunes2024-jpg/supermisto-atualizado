import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext.jsx';
import Icon from './Icon.jsx';

function Cargando() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-cream">
      <Icon name="sparkles" className="w-6 h-6 animate-pulse text-brand-400" />
    </div>
  );
}

/** Exige una sesión con suscripción activa (o admin). Si no hay, muestra el paywall. */
export function RequireAuth({ children }) {
  const { estado } = useAuth();
  if (estado === 'cargando') return <Cargando />;
  if (estado === 'anonimo') return <Navigate to="/entrar" replace />;
  return children ?? <Outlet />;
}

/** Exige además que la sesión sea de administrador. */
export function RequireAdmin({ children }) {
  const { estado, isAdmin } = useAuth();
  if (estado === 'cargando') return <Cargando />;
  if (estado === 'anonimo') return <Navigate to="/entrar" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;
  return children ?? <Outlet />;
}
