// Sesión del panel administrativo — separada por completo de la sesión de
// miembro. Ver api/_lib/adminAuth.js para la validación real en el servidor.

import { createContext, useCallback, useContext, useEffect, useState } from 'react';

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [estado, setEstado] = useState({ cargando: true, email: null });

  const revalidar = useCallback(async () => {
    try {
      const resp = await fetch('/api/admin/status');
      if (!resp.ok) throw new Error('sin sesión');
      const data = await resp.json();
      setEstado({ cargando: false, email: data.email || null });
    } catch {
      setEstado({ cargando: false, email: null });
    }
  }, []);

  useEffect(() => {
    revalidar();
  }, [revalidar]);

  const login = useCallback(async (email, password) => {
    const resp = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await resp.json().catch(() => ({}));
    if (!resp.ok || !data.ok) throw new Error(data.error || 'credenciales_invalidas');
    await revalidar();
  }, [revalidar]);

  const logout = useCallback(async () => {
    await fetch('/api/admin/logout', { method: 'POST' }).catch(() => {});
    setEstado({ cargando: false, email: null });
  }, []);

  return (
    <AdminAuthContext.Provider value={{ ...estado, login, logout, revalidar }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth debe usarse dentro de <AdminAuthProvider>');
  return ctx;
}
