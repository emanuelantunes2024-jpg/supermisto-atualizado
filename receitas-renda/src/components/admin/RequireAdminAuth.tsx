import { Navigate, Outlet } from 'react-router-dom';
import { useAdminAuth } from '../../lib/auth/AdminAuthContext';

export function RequireAdminAuth() {
  const { session, admin, loading } = useAdminAuth();
  if (loading) return <div className="flex min-h-screen items-center justify-center bg-ink-900 text-sm text-white/70">Carregando painel…</div>;
  if (!session || !admin) return <Navigate to="/admin/entrar" replace />;
  return <Outlet />;
}

export function RequirePermission({ permission, children }: { permission: string; children: React.ReactNode }) {
  const { can } = useAdminAuth();
  if (!can(permission)) {
    return (
      <div className="card p-6 text-sm text-ink-600">
        Você não tem permissão para acessar esta área. Fale com um Super Admin.
      </div>
    );
  }
  return <>{children}</>;
}
