import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const AuthContext = createContext(null);

async function llamar(url, opciones) {
  const r = await fetch(url, { credentials: 'include', ...opciones });
  let cuerpo = null;
  try {
    cuerpo = await r.json();
  } catch {
    cuerpo = null;
  }
  return { ok: r.ok, status: r.status, ...cuerpo };
}

export function AuthProvider({ children }) {
  // 'cargando' | 'autenticado' | 'anonimo'
  const [estado, setEstado] = useState('cargando');
  const [email, setEmail] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [modoAbierto, setModoAbierto] = useState(false);
  const [error, setError] = useState(null);

  const revisarSesion = useCallback(async () => {
    const r = await llamar('/api/session/me');
    if (r.ok) {
      setEmail(r.email);
      setIsAdmin(!!r.isAdmin);
      setModoAbierto(r.modo === 'abierto');
      setEstado('autenticado');
    } else {
      setEmail(null);
      setIsAdmin(false);
      setModoAbierto(false);
      setEstado('anonimo');
    }
  }, []);

  useEffect(() => {
    revisarSesion();
  }, [revisarSesion]);

  const login = useCallback(async (correo) => {
    setError(null);
    const r = await llamar('/api/session/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: correo }),
    });
    if (r.ok) {
      setEmail(r.email);
      setIsAdmin(!!r.isAdmin);
      setEstado('autenticado');
      return { ok: true };
    }
    setError(r.error || 'error_desconocido');
    return { ok: false, error: r.error };
  }, []);

  /** Login exclusivo del panel administrativo (email + contraseña). */
  const loginAdmin = useCallback(async (correo, password) => {
    setError(null);
    const r = await llamar('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: correo, password }),
    });
    if (r.ok) {
      setEmail(r.email);
      setIsAdmin(!!r.isAdmin);
      setEstado('autenticado');
      return { ok: true };
    }
    setError(r.error || 'error_desconocido');
    return { ok: false, error: r.error };
  }, []);

  const logout = useCallback(async () => {
    await llamar('/api/session/logout', { method: 'POST' });
    setEmail(null);
    setIsAdmin(false);
    setEstado('anonimo');
  }, []);

  const value = useMemo(
    () => ({ estado, email, isAdmin, modoAbierto, error, login, loginAdmin, logout }),
    [estado, email, isAdmin, modoAbierto, error, login, loginAdmin, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  return ctx;
}
