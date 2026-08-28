import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { formatBRL } from '../../lib/calc';
import { DonutChart } from '../../components/admin/Charts';

const PALETTE = ['#7C6FF2', '#22B573', '#F2600C', '#2F8FEA', '#EC4899', '#F5C542'];

function toCSV(rows: Record<string, unknown>[]) {
  if (rows.length === 0) return '';
  const headers = Object.keys(rows[0]);
  const lines = [headers.join(';'), ...rows.map((r) => headers.map((h) => JSON.stringify(r[h] ?? '')).join(';'))];
  return lines.join('\n');
}

function download(filename: string, content: string) {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function AdminReports() {
  const [categorySegments, setCategorySegments] = useState<{ label: string; value: number; color: string }[]>([]);
  const [revenueTotal, setRevenueTotal] = useState(0);
  const [subsCount, setSubsCount] = useState(0);

  useEffect(() => {
    (async () => {
      const { data: cats } = await supabase.from('categories').select('id,name').order('sort_order');
      const segments = await Promise.all(
        ((cats as any[]) ?? []).map(async (c, i) => {
          const { count } = await supabase.from('recipes').select('id', { count: 'exact', head: true }).eq('category_id', c.id);
          return { label: c.name, value: count ?? 0, color: PALETTE[i % PALETTE.length] };
        })
      );
      setCategorySegments(segments.filter((s) => s.value > 0));

      const { data: subs, count } = await supabase.from('subscriptions').select('*, plan:plans(price)', { count: 'exact' }).eq('status', 'ativa');
      setSubsCount(count ?? 0);
      setRevenueTotal(((subs as any[]) ?? []).reduce((s, r) => s + (r.plan?.price ?? 0), 0));
    })();
  }, []);

  async function exportRecipes() {
    const { data } = await supabase.from('recipes').select('title,category_id,published,views_count,favorites_count,created_at');
    download('receitas.csv', toCSV(data ?? []));
  }

  async function exportUsers() {
    const { data } = await supabase.from('users').select('name,email,status,created_at');
    download('usuarios.csv', toCSV(data ?? []));
  }

  async function exportSubscriptions() {
    const { data } = await supabase.from('subscriptions').select('status,hotmart_transaction_code,started_at,expires_at,created_at');
    download('assinaturas.csv', toCSV(data ?? []));
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="card p-5">
          <p className="text-xs font-semibold text-ink-600">Receita recorrente ativa (MRR aproximado)</p>
          <p className="text-2xl font-extrabold text-ink-900">{formatBRL(revenueTotal)}</p>
          <p className="text-xs text-ink-600">{subsCount} assinaturas ativas</p>
        </div>
        <div className="card p-5">
          <p className="mb-2 text-sm font-bold text-ink-900">Receitas por categoria</p>
          {categorySegments.length > 0 ? <DonutChart segments={categorySegments} /> : <p className="text-sm text-ink-600">Sem dados ainda.</p>}
        </div>
      </div>

      <div className="card p-5">
        <p className="mb-3 text-sm font-bold text-ink-900">Exportar dados (CSV)</p>
        <div className="flex flex-wrap gap-2">
          <button onClick={exportRecipes} className="btn-secondary">Exportar receitas</button>
          <button onClick={exportUsers} className="btn-secondary">Exportar usuários</button>
          <button onClick={exportSubscriptions} className="btn-secondary">Exportar assinaturas</button>
        </div>
      </div>
    </div>
  );
}
