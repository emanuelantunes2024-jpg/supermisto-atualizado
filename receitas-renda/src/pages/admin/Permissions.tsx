import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAdminAuth } from '../../lib/auth/AdminAuthContext';
import { Icon } from '../../components/common/Icon';
import type { Permission, Role } from '../../lib/types';

export default function AdminPermissions() {
  const { can, logAction } = useAdminAuth();
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [matrix, setMatrix] = useState<Record<string, Set<string>>>({});

  async function load() {
    const [{ data: r }, { data: p }, { data: rp }] = await Promise.all([
      supabase.from('roles').select('*').order('name'),
      supabase.from('permissions').select('*').order('category'),
      supabase.from('role_permissions').select('role_id, permission_id'),
    ]);
    setRoles((r as Role[]) ?? []);
    setPermissions((p as Permission[]) ?? []);
    const m: Record<string, Set<string>> = {};
    (rp ?? []).forEach((row: any) => {
      m[row.role_id] = m[row.role_id] ?? new Set();
      m[row.role_id].add(row.permission_id);
    });
    setMatrix(m);
  }

  useEffect(() => {
    load();
  }, []);

  async function toggle(roleId: string, permissionId: string) {
    if (!can('permissions.manage')) return;
    const has = matrix[roleId]?.has(permissionId);
    if (has) {
      await supabase.from('role_permissions').delete().eq('role_id', roleId).eq('permission_id', permissionId);
    } else {
      await supabase.from('role_permissions').insert({ role_id: roleId, permission_id: permissionId });
    }
    await logAction('update', 'role_permissions', permissionId, { role_id: roleId, granted: !has });
    load();
  }

  const grouped = permissions.reduce<Record<string, Permission[]>>((acc, p) => {
    (acc[p.category] ??= []).push(p);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <p className="text-sm text-ink-600">
        O papel <b>Super Admin</b> sempre tem acesso total. Marque abaixo o que cada outro papel pode fazer — as
        alterações valem imediatamente, pois toda ação no painel é validada pelo banco (Row Level Security).
      </p>
      {Object.entries(grouped).map(([category, perms]) => (
        <div key={category} className="card overflow-x-auto p-5">
          <p className="mb-3 text-sm font-bold capitalize text-ink-900">{category}</p>
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead>
              <tr className="text-xs uppercase text-ink-600">
                <th className="py-2 font-semibold">Permissão</th>
                {roles.map((r) => <th key={r.id} className="py-2 text-center font-semibold">{r.name}</th>)}
              </tr>
            </thead>
            <tbody>
              {perms.map((p) => (
                <tr key={p.id} className="border-t border-black/5">
                  <td className="py-2 text-ink-800">{p.label}</td>
                  {roles.map((r) => {
                    const isSuper = r.name === 'Super Admin';
                    const checked = isSuper || matrix[r.id]?.has(p.id);
                    return (
                      <td key={r.id} className="py-2 text-center">
                        <button
                          disabled={isSuper}
                          onClick={() => toggle(r.id, p.id)}
                          className={`mx-auto flex h-6 w-6 items-center justify-center rounded-md border ${checked ? 'border-brand-500 bg-brand-500 text-white' : 'border-black/20'} ${isSuper ? 'opacity-60' : ''}`}
                        >
                          {checked && <Icon name="check" className="h-4 w-4" />}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
