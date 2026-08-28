import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

export default function AdminShoppingList() {
  const [items, setItems] = useState<any[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    (async () => {
      const { count } = await supabase.from('shopping_list_items').select('id', { count: 'exact', head: true });
      setTotal(count ?? 0);
      const { data } = await supabase
        .from('shopping_list_items')
        .select('*, user:users(name)')
        .order('created_at', { ascending: false })
        .limit(20);
      setItems(data ?? []);
    })();
  }, []);

  return (
    <div className="space-y-4">
      <div className="card p-5">
        <p className="text-xs font-semibold text-ink-600">Itens na lista de compras de todos os assinantes</p>
        <p className="text-2xl font-extrabold text-ink-900">{total.toLocaleString('pt-BR')}</p>
      </div>
      <div className="card overflow-x-auto">
        <table className="w-full min-w-[520px] text-left text-sm">
          <thead>
            <tr className="border-b border-black/5 text-xs uppercase text-ink-600">
              <th className="px-4 py-3 font-semibold">Usuário</th>
              <th className="px-4 py-3 font-semibold">Item</th>
              <th className="px-4 py-3 font-semibold">Quantidade</th>
              <th className="px-4 py-3 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {items.map((i) => (
              <tr key={i.id} className="border-b border-black/5 last:border-0">
                <td className="px-4 py-3 text-ink-900">{i.user?.name ?? '—'}</td>
                <td className="px-4 py-3 text-ink-700">{i.label}</td>
                <td className="px-4 py-3 text-ink-700">{i.quantity ?? '—'}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${i.checked ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>
                    {i.checked ? 'Comprado' : 'Pendente'}
                  </span>
                </td>
              </tr>
            ))}
            {items.length === 0 && <tr><td colSpan={4} className="px-4 py-6 text-center text-ink-600">Nenhum item ainda.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
