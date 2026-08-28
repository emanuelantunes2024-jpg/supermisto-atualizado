import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAdminAuth } from '../../lib/auth/AdminAuthContext';
import { Icon } from '../../components/common/Icon';
import type { AppUser, Plan } from '../../lib/types';

export default function AdminUsers() {
  const { can, logAction } = useAdminAuth();
  const [users, setUsers] = useState<AppUser[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const [{ data: u }, { data: p }] = await Promise.all([
      supabase.from('users').select('*, plan:plans(*)').order('created_at', { ascending: false }),
      supabase.from('plans').select('*').order('sort_order'),
    ]);
    setUsers((u as AppUser[]) ?? []);
    setPlans((p as Plan[]) ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function updatePlan(user: AppUser, planId: string) {
    await supabase.from('users').update({ plan_id: planId }).eq('id', user.id);
    await logAction('update_plan', 'users', user.id, { plan_id: planId });
    load();
  }

  async function toggleStatus(user: AppUser) {
    const status = user.status === 'active' ? 'inactive' : 'active';
    await supabase.from('users').update({ status }).eq('id', user.id);
    await logAction('update_status', 'users', user.id, { status });
    load();
  }

  const filtered = search ? users.filter((u) => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())) : users;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <input className="input max-w-xs" placeholder="Buscar por nome ou e-mail…" value={search} onChange={(e) => setSearch(e.target.value)} />
        <p className="ml-auto text-xs text-ink-600">
          Novos usuários se cadastram pelo app (/app/registro) ou automaticamente na compra pela Hotmart.
        </p>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-black/5 text-xs uppercase text-ink-600">
              <th className="px-4 py-3 font-semibold">Usuário</th>
              <th className="px-4 py-3 font-semibold">Plano</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Cadastro</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={5} className="px-4 py-6 text-center text-ink-600">Carregando…</td></tr>}
            {!loading && filtered.map((u) => (
              <tr key={u.id} className="border-b border-black/5 last:border-0">
                <td className="px-4 py-3">
                  <p className="font-semibold text-ink-900">{u.name}</p>
                  <p className="text-xs text-ink-600">{u.email}</p>
                </td>
                <td className="px-4 py-3">
                  <select
                    disabled={!can('users.manage')}
                    className="input !w-auto !py-1.5 text-xs"
                    value={u.plan_id ?? ''}
                    onChange={(e) => updatePlan(u, e.target.value)}
                  >
                    {plans.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => can('users.manage') && toggleStatus(u)}
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${u.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}
                  >
                    {u.status === 'active' ? 'Ativo' : 'Inativo'}
                  </button>
                </td>
                <td className="px-4 py-3 text-ink-600">{new Date(u.created_at).toLocaleDateString('pt-BR')}</td>
                <td className="px-4 py-3 text-right">
                  <Icon name="users" className="ml-auto h-4 w-4 text-ink-400" />
                </td>
              </tr>
            ))}
            {!loading && filtered.length === 0 && <tr><td colSpan={5} className="px-4 py-6 text-center text-ink-600">Nenhum usuário encontrado.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
