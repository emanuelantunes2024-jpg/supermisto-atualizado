import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAdminAuth } from '../../lib/auth/AdminAuthContext';
import { Icon } from '../../components/common/Icon';

export default function AdminComments() {
  const { can, logAction } = useAdminAuth();
  const [comments, setComments] = useState<any[]>([]);
  const [filter, setFilter] = useState<'pending' | 'approved' | 'rejected' | 'all'>('pending');

  async function load() {
    let q = supabase.from('comments').select('*, user:users(name), recipe:recipes(title)').order('created_at', { ascending: false });
    if (filter !== 'all') q = q.eq('status', filter);
    const { data } = await q;
    setComments(data ?? []);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  async function setStatus(id: string, status: string) {
    await supabase.from('comments').update({ status }).eq('id', id);
    await logAction(`comment_${status}`, 'comments', id);
    load();
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {(['pending', 'approved', 'rejected', 'all'] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${filter === f ? 'bg-brand-500 text-white' : 'card text-ink-700'}`}>
            {{ pending: 'Pendentes', approved: 'Aprovados', rejected: 'Rejeitados', all: 'Todos' }[f]}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {comments.map((c) => (
          <div key={c.id} className="card p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-ink-900">{c.user?.name} <span className="font-normal text-ink-600">em "{c.recipe?.title}"</span></p>
                <p className="mt-1 text-sm text-ink-700">{c.content}</p>
                <p className="mt-1 text-[11px] text-ink-600">{new Date(c.created_at).toLocaleString('pt-BR')}</p>
              </div>
              {can('comments.moderate') && (
                <div className="flex shrink-0 gap-1">
                  <button onClick={() => setStatus(c.id, 'approved')} className="rounded-lg p-1.5 text-emerald-600 hover:bg-emerald-50" title="Aprovar">
                    <Icon name="check" className="h-4 w-4" />
                  </button>
                  <button onClick={() => setStatus(c.id, 'rejected')} className="rounded-lg p-1.5 text-red-600 hover:bg-red-50" title="Rejeitar">
                    <Icon name="x" className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
        {comments.length === 0 && <p className="card p-6 text-center text-sm text-ink-600">Nenhum comentário aqui.</p>}
      </div>
    </div>
  );
}
