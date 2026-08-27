import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../lib/auth/AuthContext';
import { Icon } from '../../components/common/Icon';
import type { ShoppingListItem } from '../../lib/types';

export default function ShoppingList() {
  const { profile } = useAuth();
  const [items, setItems] = useState<ShoppingListItem[]>([]);
  const [label, setLabel] = useState('');
  const [quantity, setQuantity] = useState('');

  async function load() {
    if (!profile) return;
    const { data } = await supabase.from('shopping_list_items').select('*').eq('user_id', profile.id).order('created_at', { ascending: false });
    setItems((data as ShoppingListItem[]) ?? []);
  }

  useEffect(() => {
    load();
  }, [profile]);

  async function add() {
    if (!profile || !label.trim()) return;
    await supabase.from('shopping_list_items').insert({ user_id: profile.id, label, quantity: quantity || null });
    setLabel('');
    setQuantity('');
    load();
  }

  async function toggle(item: ShoppingListItem) {
    await supabase.from('shopping_list_items').update({ checked: !item.checked }).eq('id', item.id);
    load();
  }

  async function remove(id: string) {
    await supabase.from('shopping_list_items').delete().eq('id', id);
    load();
  }

  const pending = items.filter((i) => !i.checked);
  const done = items.filter((i) => i.checked);

  return (
    <div className="max-w-2xl space-y-4">
      <h1 className="text-xl font-extrabold text-ink-900">Lista de Compras</h1>

      <div className="card flex flex-wrap items-end gap-2 p-4">
        <div className="flex-1 min-w-[160px]">
          <label className="label">Item</label>
          <input className="input" value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Ex: Farinha de trigo" />
        </div>
        <div className="w-32">
          <label className="label">Quantidade</label>
          <input className="input" value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="Ex: 1kg" />
        </div>
        <button onClick={add} className="btn-primary">
          <Icon name="plus" className="h-4 w-4" /> Adicionar
        </button>
      </div>

      <div className="card p-4">
        <p className="mb-2 text-xs font-bold uppercase text-ink-600">A comprar ({pending.length})</p>
        <ul className="space-y-1">
          {pending.map((item) => (
            <ListRow key={item.id} item={item} onToggle={toggle} onRemove={remove} />
          ))}
          {pending.length === 0 && <p className="py-4 text-center text-sm text-ink-600">Sua lista está vazia.</p>}
        </ul>
      </div>

      {done.length > 0 && (
        <div className="card p-4">
          <p className="mb-2 text-xs font-bold uppercase text-ink-600">Comprados ({done.length})</p>
          <ul className="space-y-1">
            {done.map((item) => (
              <ListRow key={item.id} item={item} onToggle={toggle} onRemove={remove} />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function ListRow({ item, onToggle, onRemove }: { item: ShoppingListItem; onToggle: (i: ShoppingListItem) => void; onRemove: (id: string) => void }) {
  return (
    <li className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-black/[0.02]">
      <button
        onClick={() => onToggle(item)}
        className={`flex h-5 w-5 items-center justify-center rounded-md border ${item.checked ? 'border-brand-500 bg-brand-500 text-white' : 'border-black/20'}`}
      >
        {item.checked && <Icon name="check" className="h-3.5 w-3.5" />}
      </button>
      <span className={`flex-1 text-sm ${item.checked ? 'text-ink-600 line-through' : 'text-ink-900'}`}>{item.label}</span>
      {item.quantity && <span className="text-xs text-ink-600">{item.quantity}</span>}
      <button onClick={() => onRemove(item.id)} className="text-ink-600 hover:text-red-600">
        <Icon name="trash" className="h-4 w-4" />
      </button>
    </li>
  );
}
