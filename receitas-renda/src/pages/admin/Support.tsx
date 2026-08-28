import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAdminAuth } from '../../lib/auth/AdminAuthContext';

const statusLabel: Record<string, string> = { open: 'Aberto', in_progress: 'Em andamento', closed: 'Fechado' };
const statusColor: Record<string, string> = { open: 'bg-amber-100 text-amber-700', in_progress: 'bg-blue-100 text-blue-700', closed: 'bg-emerald-100 text-emerald-700' };

export default function AdminSupport() {
  const { can, admin, logAction } = useAdminAuth();
  const [tickets, setTickets] = useState<any[]>([]);

  async function load() {
    const { data } = await supabase.from('support_tickets').select('*, user:users(name,email), assigned:admins(name)').order('created_at', { ascending: false });
    setTickets(data ?? []);
  }

  useEffect(() => {
    load();
  }, []);

  async function updateStatus(id: string, status: string) {
    await supabase.from('support_tickets').update({ status }).eq('id', id);
    await logAction('update_status', 'support_tickets', id, { status });
    load();
  }

  async function assignToMe(id: string) {
    if (!admin) return;
    await supabase.from('support_tickets').update({ assigned_admin_id: admin.id, status: 'in_progress' }).eq('id', id);
    await logAction('assign', 'support_tickets', id, { admin_id: admin.id });
    load();
  }

  return (
    <div className="space-y-3">
      {tickets.map((t) => (
        <div key={t.id} className="card p-4">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <p className="text-sm font-bold text-ink-900">{t.subject}</p>
              <p className="text-xs text-ink-600">{t.user?.name} · {t.user?.email}</p>
              <p className="mt-2 text-sm text-ink-700">{t.message}</p>
            </div>
            <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusColor[t.status]}`}>{statusLabel[t.status]}</span>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-ink-600">Responsável: {t.assigned?.name ?? 'Ninguém'}</span>
            {can('support.manage') && (
              <>
                <button onClick={() => assignToMe(t.id)} className="btn-secondary !py-1 !text-xs">Assumir</button>
                <select className="input !w-auto !py-1 text-xs" value={t.status} onChange={(e) => updateStatus(t.id, e.target.value)}>
                  <option value="open">Aberto</option>
                  <option value="in_progress">Em andamento</option>
                  <option value="closed">Fechado</option>
                </select>
              </>
            )}
          </div>
        </div>
      ))}
      {tickets.length === 0 && <p className="card p-6 text-center text-sm text-ink-600">Nenhum chamado de suporte ainda.</p>}
    </div>
  );
}
