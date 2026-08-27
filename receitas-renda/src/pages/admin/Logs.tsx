import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import type { SystemLog } from '../../lib/types';

export default function AdminLogs() {
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    supabase
      .from('system_logs')
      .select('*, admin:admins(name,email)')
      .order('created_at', { ascending: false })
      .limit(200)
      .then(({ data }) => setLogs((data as SystemLog[]) ?? []));
  }, []);

  const filtered = search
    ? logs.filter((l) => `${l.action} ${l.entity} ${l.admin?.name ?? ''}`.toLowerCase().includes(search.toLowerCase()))
    : logs;

  return (
    <div className="space-y-4">
      <input className="input max-w-xs" placeholder="Buscar por ação, entidade ou admin…" value={search} onChange={(e) => setSearch(e.target.value)} />
      <div className="card overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-black/5 text-xs uppercase text-ink-600">
              <th className="px-4 py-3 font-semibold">Data</th>
              <th className="px-4 py-3 font-semibold">Administrador</th>
              <th className="px-4 py-3 font-semibold">Ação</th>
              <th className="px-4 py-3 font-semibold">Entidade</th>
              <th className="px-4 py-3 font-semibold">Detalhes</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((l) => (
              <tr key={l.id} className="border-b border-black/5 last:border-0">
                <td className="px-4 py-3 text-ink-600">{new Date(l.created_at).toLocaleString('pt-BR')}</td>
                <td className="px-4 py-3 font-medium text-ink-900">{l.admin?.name ?? 'Sistema'}</td>
                <td className="px-4 py-3 text-ink-700">{l.action}</td>
                <td className="px-4 py-3 text-ink-700">{l.entity}</td>
                <td className="px-4 py-3 text-xs text-ink-600">{Object.keys(l.details ?? {}).length ? JSON.stringify(l.details) : '—'}</td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={5} className="px-4 py-6 text-center text-ink-600">Nenhum log ainda.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
