import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../lib/auth/AuthContext';

export function RequireAuth() {
  const { session, loading } = useAuth();
  if (loading) return <div className="flex min-h-screen items-center justify-center bg-cream text-sm text-ink-600">Carregando…</div>;
  if (!session) return <Navigate to="/app/entrar" replace />;
  return <Outlet />;
}
