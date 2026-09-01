// Sesión de miembro (comprador vía Hotmart). El estado real vive en el
// servidor (cookie firmada + Redis) — este contexto solo refleja lo que
// devuelve /api/session/me. En desarrollo local (`npm run dev`) las
// funciones /api no corren, así que la app queda en modo "sin sesión": para
// probar el login hace falta el deploy en Vercel (igual que el resto de las
// apps de este repositorio).

import { createContext, useCallback, useContext, useEffect, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [estado, setEstado] = useState({ cargando: true, email: null, activo: false });

  const revalidar = useCallback(async () => {
    try {
      const resp = await fetch('/api/session/me');
      if (!resp.ok) throw new Error('sin sesión');
      const data = await resp.json();
      setEstado({ cargando: false, email: data.email || null, activo: Boolean(data.activo) });
    } catch {
      setEstado({ cargando: false, email: null, activo: false });
    }
  }, []);

  useEffect(() => {
    revalidar();
  }, [revalidar]);

  const login = useCallback(async (email) => {
    const resp = await fetch('/api/session/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const data = await resp.json().catch(() => ({}));
    if (!resp.ok || !data.ok) {
      throw new Error(data.error || 'no_encontrado');
    }
    await revalidar();
  }, [revalidar]);

  const logout = useCallback(async () => {
    await fetch('/api/session/logout', { method: 'POST' }).catch(() => {});
    setEstado({ cargando: false, email: null, activo: false });
  }, []);

  return (
    <AuthContext.Provider value={{ ...estado, login, logout, revalidar }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  return ctx;
}
