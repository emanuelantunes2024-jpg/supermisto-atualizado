import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAdminAuth } from '../../lib/auth/AdminAuthContext';
import { Icon } from '../../components/common/Icon';
import type { Admin, Role } from '../../lib/types';

export default function AdminAdministrators() {
  const { can, logAction, session } = useAdminAuth();
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [showInvite, setShowInvite] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [roleId, setRoleId] = useState('');
  const [inviting, setInviting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    const [{ data: a }, { data: r }] = await Promise.all([
      supabase.from('admins').select('*, role:roles(id,name)').order('created_at'),
      supabase.from('roles').select('*').order('name'),
    ]);
    setAdmins((a as Admin[]) ?? []);
    setRoles((r as Role[]) ?? []);
    if (r?.[0]) setRoleId(r[0].id);
  }

  useEffect(() => {
    load();
  }, []);

  async function invite() {
    setInviting(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session?.access_token}` },
        body: JSON.stringify({ name, email, role_id: roleId }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Falha ao convidar administrador');
      await logAction('invite', 'admins', json.id, { email, role_id: roleId });
      setShowInvite(false);
      setName('');
      setEmail('');
      load();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setInviting(false);
    }
  }

  async function updateRole(admin: Admin, newRoleId: string) {
    await supabase.from('admins').update({ role_id: newRoleId }).eq('id', admin.id);
    await logAction('update_role', 'admins', admin.id, { role_id: newRoleId });
    load();
  }

  async function toggleStatus(admin: Admin) {
    const status = admin.status === 'active' ? 'inactive' : 'active';
    await supabase.from('admins').update({ status }).eq('id', admin.id);
    await logAction('update_status', 'admins', admin.id, { status });
    load();
  }

  async function remove(admin: Admin) {
    if (!confirm(`Remover o acesso de ${admin.name} ao painel?`)) return;
    await supabase.from('admins').delete().eq('id', admin.id);
    await logAction('delete', 'admins', admin.id);
    load();
  }

  return (
    <div className="space-y-4">
      {can('admins.manage') && (
        <button onClick={() => setShowInvite(true)} className="btn-primary">
          <Icon name="plus" className="h-4 w-4" /> Convidar administrador
        </button>
      )}

      <div className="card overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-black/5 text-xs uppercase text-ink-600">
              <th className="px-4 py-3 font-semibold">Nome</th>
              <th className="px-4 py-3 font-semibold">E-mail</th>
              <th className="px-4 py-3 font-semibold">Papel</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {admins.map((a) => (
              <tr key={a.id} className="border-b border-black/5 last:border-0">
                <td className="px-4 py-3 font-semibold text-ink-900">{a.name}</td>
                <td className="px-4 py-3 text-ink-700">{a.email}</td>
                <td className="px-4 py-3">
                  <select disabled={!can('admins.manage')} className="input !w-auto !py-1.5 text-xs" value={a.role_id ?? ''} onChange={(e) => updateRole(a, e.target.value)}>
                    {roles.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
                  </select>
                </td>
                <td className="px-4 py-3">
                  <button onClick={() => can('admins.manage') && toggleStatus(a)} className={`rounded-full px-2.5 py-1 text-xs font-semibold ${a.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                    {a.status === 'active' ? 'Ativo' : 'Inativo'}
                  </button>
                </td>
                <td className="px-4 py-3 text-right">
                  {can('admins.manage') && (
                    <button onClick={() => remove(a)} className="rounded-lg p-1.5 text-red-600 hover:bg-red-50"><Icon name="trash" className="h-4 w-4" /></button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showInvite && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-ink-900">Convidar administrador</h3>
              <button onClick={() => setShowInvite(false)}><Icon name="x" className="h-5 w-5" /></button>
            </div>
            <div className="space-y-3">
              <div><label className="label">Nome</label><input className="input" value={name} onChange={(e) => setName(e.target.value)} /></div>
              <div><label className="label">E-mail</label><input type="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
              <div>
                <label className="label">Papel</label>
                <select className="input" value={roleId} onChange={(e) => setRoleId(e.target.value)}>
                  {roles.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
                </select>
              </div>
              {error && <p className="text-xs text-red-600">{error}</p>}
              <p className="text-[11px] text-ink-600">Um e-mail de convite será enviado pelo Supabase Auth para o novo administrador definir a senha.</p>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button onClick={() => setShowInvite(false)} className="btn-secondary">Cancelar</button>
              <button onClick={invite} disabled={inviting || !name || !email} className="btn-primary">{inviting ? 'Enviando…' : 'Enviar convite'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
