import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAdminAuth } from '../../lib/auth/AdminAuthContext';
import { formatBRL } from '../../lib/calc';
import { StatusBadge } from './Dashboard';
import type { Subscription } from '../../lib/types';

export default function AdminSubscriptions() {
  const { can, logAction } = useAdminAuth();
  const [subs, setSubs] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const { data } = await supabase
      .from('subscriptions')
      .select('*, user:users(name,email), plan:plans(name,price)')
      .order('created_at', { ascending: false });
    setSubs((data as Subscription[]) ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function setStatus(sub: Subscription, status: Subscription['status']) {
    await supabase.from('subscriptions').update({ status, canceled_at: status === 'cancelada' ? new Date().toISOString() : null }).eq('id', sub.id);
    await logAction('update_status', 'subscriptions', sub.id, { status });
    load();
  }

  return (
    <div className="card overflow-x-auto">
      <table className="w-full min-w-[820px] text-left text-sm">
        <thead>
          <tr className="border-b border-black/5 text-xs uppercase text-ink-600">
            <th className="px-4 py-3 font-semibold">Usuário</th>
            <th className="px-4 py-3 font-semibold">Plano</th>
            <th className="px-4 py-3 font-semibold">Valor</th>
            <th className="px-4 py-3 font-semibold">Transação Hotmart</th>
            <th className="px-4 py-3 font-semibold">Status</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody>
          {loading && <tr><td colSpan={6} className="px-4 py-6 text-center text-ink-600">Carregando…</td></tr>}
          {!loading && subs.map((s) => (
            <tr key={s.id} className="border-b border-black/5 last:border-0">
              <td className="px-4 py-3">
                <p className="font-semibold text-ink-900">{s.user?.name}</p>
                <p className="text-xs text-ink-600">{s.user?.email}</p>
              </td>
              <td className="px-4 py-3 text-ink-700">{s.plan?.name}</td>
              <td className="px-4 py-3 text-ink-700">{formatBRL(s.plan?.price ?? 0)}</td>
              <td className="px-4 py-3 text-xs text-ink-600">{s.hotmart_transaction_code ?? '—'}</td>
              <td className="px-4 py-3"><StatusBadge status={s.status} /></td>
              <td className="px-4 py-3">
                {can('subscriptions.manage') && (
                  <select className="input !w-auto !py-1.5 text-xs" value={s.status} onChange={(e) => setStatus(s, e.target.value as any)}>
                    <option value="ativa">Ativa</option>
                    <option value="pendente">Pendente</option>
                    <option value="cancelada">Cancelada</option>
                  </select>
                )}
              </td>
            </tr>
          ))}
          {!loading && subs.length === 0 && <tr><td colSpan={6} className="px-4 py-6 text-center text-ink-600">Nenhuma assinatura ainda.</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
