import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAdminAuth } from '../../lib/auth/AdminAuthContext';
import { Icon } from '../../components/common/Icon';
import { formatBRL } from '../../lib/calc';
import type { Plan } from '../../lib/types';

const empty = {
  name: '', slug: '', price: 0, billing_period: 'mensal', description: '', features: '', hotmart_product_id: '', hotmart_offer_code: '', is_active: true, sort_order: 0,
};

export default function AdminPlans() {
  const { can, logAction } = useAdminAuth();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [editing, setEditing] = useState<Plan | null>(null);
  const [form, setForm] = useState<typeof empty>(empty);
  const [showForm, setShowForm] = useState(false);

  async function load() {
    const { data } = await supabase.from('plans').select('*').order('sort_order');
    setPlans((data as Plan[]) ?? []);
  }

  useEffect(() => {
    load();
  }, []);

  function openCreate() {
    setEditing(null);
    setForm(empty);
    setShowForm(true);
  }

  function openEdit(p: Plan) {
    setEditing(p);
    setForm({ ...p, features: (p.features ?? []).join('\n') } as any);
    setShowForm(true);
  }

  async function save() {
    const payload = { ...form, features: form.features.split('\n').map((s) => s.trim()).filter(Boolean) };
    if (editing) {
      await supabase.from('plans').update(payload).eq('id', editing.id);
      await logAction('update', 'plans', editing.id, { name: form.name });
    } else {
      const { data } = await supabase.from('plans').insert(payload).select().maybeSingle();
      await logAction('create', 'plans', data?.id, { name: form.name });
    }
    setShowForm(false);
    load();
  }

  async function remove(p: Plan) {
    if (!confirm(`Excluir o plano "${p.name}"?`)) return;
    await supabase.from('plans').delete().eq('id', p.id);
    await logAction('delete', 'plans', p.id);
    load();
  }

  return (
    <div className="space-y-4">
      {can('plans.manage') && (
        <button onClick={openCreate} className="btn-primary">
          <Icon name="plus" className="h-4 w-4" /> Novo plano
        </button>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {plans.map((p) => (
          <div key={p.id} className="card p-5">
            <div className="flex items-center justify-between">
              <p className="font-bold text-ink-900">{p.name}</p>
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${p.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>
                {p.is_active ? 'Ativo' : 'Inativo'}
              </span>
            </div>
            <p className="mt-2 text-xl font-extrabold text-brand-600">{p.price > 0 ? formatBRL(p.price) : 'Grátis'}</p>
            <p className="text-xs text-ink-600">{p.billing_period}</p>
            <ul className="mt-2 space-y-1 text-xs text-ink-700">
              {p.features?.slice(0, 4).map((f, i) => <li key={i}>• {f}</li>)}
            </ul>
            {can('plans.manage') && (
              <div className="mt-3 flex gap-2">
                <button onClick={() => openEdit(p)} className="btn-secondary !py-1.5 flex-1 !text-xs">Editar</button>
                <button onClick={() => remove(p)} className="rounded-lg p-2 text-red-600 hover:bg-red-50"><Icon name="trash" className="h-4 w-4" /></button>
              </div>
            )}
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-ink-900">{editing ? 'Editar' : 'Novo'} plano</h3>
              <button onClick={() => setShowForm(false)}><Icon name="x" className="h-5 w-5" /></button>
            </div>
            <div className="space-y-3">
              <div><label className="label">Nome</label><input className="input" value={form.name} onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))} /></div>
              <div><label className="label">Slug</label><input className="input" value={form.slug} onChange={(e) => setForm((s) => ({ ...s, slug: e.target.value }))} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="label">Preço (R$)</label><input type="number" className="input" value={form.price} onChange={(e) => setForm((s) => ({ ...s, price: Number(e.target.value) }))} /></div>
                <div>
                  <label className="label">Periodicidade</label>
                  <select className="input" value={form.billing_period} onChange={(e) => setForm((s) => ({ ...s, billing_period: e.target.value }))}>
                    <option value="gratuito">Gratuito</option><option value="mensal">Mensal</option><option value="anual">Anual</option><option value="vitalicio">Vitalício</option>
                  </select>
                </div>
              </div>
              <div><label className="label">Descrição</label><textarea className="input" value={form.description} onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))} /></div>
              <div><label className="label">Benefícios (um por linha)</label><textarea className="input min-h-[90px]" value={form.features} onChange={(e) => setForm((s) => ({ ...s, features: e.target.value }))} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="label">ID do produto na Hotmart</label><input className="input" value={form.hotmart_product_id} onChange={(e) => setForm((s) => ({ ...s, hotmart_product_id: e.target.value }))} /></div>
                <div><label className="label">Código da oferta</label><input className="input" value={form.hotmart_offer_code} onChange={(e) => setForm((s) => ({ ...s, hotmart_offer_code: e.target.value }))} /></div>
              </div>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.is_active} onChange={(e) => setForm((s) => ({ ...s, is_active: e.target.checked }))} /> Plano ativo</label>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button onClick={() => setShowForm(false)} className="btn-secondary">Cancelar</button>
              <button onClick={save} className="btn-primary">Salvar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
