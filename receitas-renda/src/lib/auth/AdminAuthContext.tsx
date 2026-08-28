import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../supabase';
import type { Admin } from '../types';

type AdminAuthContextValue = {
  session: Session | null;
  admin: Admin | null;
  permissions: Set<string>;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  can: (permission: string) => boolean;
  logAction: (action: string, entity: string, entityId?: string | null, details?: Record<string, unknown>) => Promise<void>;
};

const AdminAuthContext = createContext<AdminAuthContextValue | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [permissions, setPermissions] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  async function loadAdmin(userId: string) {
    const { data } = await supabase
      .from('admins')
      .select('*, role:roles(id,name,description)')
      .eq('id', userId)
      .maybeSingle();

    if (!data) {
      setAdmin(null);
      setPermissions(new Set());
      return;
    }

    let perms: string[] = [];
    if (data.role_id) {
      const { data: rp } = await supabase
        .from('role_permissions')
        .select('permission:permissions(code)')
        .eq('role_id', data.role_id);
      perms = (rp ?? []).map((row: any) => row.permission?.code).filter(Boolean);
    }

    setAdmin(data as Admin);
    setPermissions(new Set(perms));
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (data.session?.user) loadAdmin(data.session.user.id).finally(() => setLoading(false));
      else setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      if (newSession?.user) {
        loadAdmin(newSession.user.id);
      } else {
        setAdmin(null);
        setPermissions(new Set());
      }
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  const value = useMemo<AdminAuthContextValue>(
    () => ({
      session,
      admin,
      permissions,
      loading,
      async signIn(email, password) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) return { error: error.message };
        if (data.user) {
          await loadAdmin(data.user.id);
          const { data: check } = await supabase.from('admins').select('id').eq('id', data.user.id).maybeSingle();
          if (!check) {
            await supabase.auth.signOut();
            return { error: 'Este usuário não tem acesso ao painel administrativo.' };
          }
        }
        return { error: null };
      },
      async signOut() {
        await supabase.auth.signOut();
      },
      can(permission: string) {
        if (!admin) return false;
        if (admin.role?.name === 'Super Admin') return true;
        return permissions.has(permission);
      },
      async logAction(action, entity, entityId, details) {
        if (!admin) return;
        await supabase.from('system_logs').insert({
          admin_id: admin.id,
          action,
          entity,
          entity_id: entityId ?? null,
          details: details ?? {},
        });
      },
    }),
    [session, admin, permissions, loading]
  );

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth deve ser usado dentro de <AdminAuthProvider>');
  return ctx;
}
