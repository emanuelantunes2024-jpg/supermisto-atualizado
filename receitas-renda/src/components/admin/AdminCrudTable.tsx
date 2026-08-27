import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAdminAuth } from '../../lib/auth/AdminAuthContext';
import { Icon } from '../common/Icon';

export type FieldConfig = {
  key: string;
  label: string;
  type: 'text' | 'number' | 'textarea' | 'boolean' | 'select' | 'image';
  options?: { label: string; value: string }[];
  required?: boolean;
  hint?: string;
};

export type ColumnConfig<T> = {
  key: string;
  label: string;
  render?: (row: T) => React.ReactNode;
};

type Props<T extends { id: string }> = {
  table: string;
  entity: string;
  permission: string;
  select?: string;
  orderBy?: string;
  ascending?: boolean;
  columns: ColumnConfig<T>[];
  fields: FieldConfig[];
  emptyValues: Record<string, unknown>;
  searchKeys?: string[];
  extraActions?: (row: T, reload: () => void) => React.ReactNode;
};

/** Tabela CRUD genérica usada nas seções administrativas mais simples
 *  (categorias, banners, novidades, comentários, notificações, planos…).
 *  Toda ação passa por `can(permission)` e é registrada em system_logs. */
export function AdminCrudTable<T extends { id: string; [k: string]: any }>({
  table,
  entity,
  permission,
  select = '*',
  orderBy = 'created_at',
  ascending = false,
  columns,
  fields,
  emptyValues,
  searchKeys = [],
  extraActions,
}: Props<T>) {
  const { can, logAction } = useAdminAuth();
  const [rows, setRows] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<T | null>(null);
  const [form, setForm] = useState<Record<string, unknown>>(emptyValues);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    const { data } = await supabase.from(table).select(select).order(orderBy, { ascending });
    setRows((data as unknown as T[]) ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table]);

  function openCreate() {
    setEditing(null);
    setForm(emptyValues);
    setShowForm(true);
  }

  function openEdit(row: T) {
    setEditing(row);
    setForm(row);
    setShowForm(true);
  }

  async function save() {
    setSaving(true);
    if (editing) {
      const { error } = await supabase.from(table).update(form).eq('id', editing.id);
      if (!error) await logAction('update', entity, editing.id, form);
    } else {
      const { data, error } = await supabase.from(table).insert(form).select().maybeSingle();
      if (!error) await logAction('create', entity, data?.id ?? null, form);
    }
    setSaving(false);
    setShowForm(false);
    load();
  }

  async function remove(row: T) {
    if (!confirm('Tem certeza que deseja excluir este registro?')) return;
    const { error } = await supabase.from(table).delete().eq('id', row.id);
    if (!error) await logAction('delete', entity, row.id, {});
    load();
  }

  const filtered = search
    ? rows.filter((r) => searchKeys.some((k) => String(r[k] ?? '').toLowerCase().includes(search.toLowerCase())))
    : rows;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        {searchKeys.length > 0 && (
          <input className="input max-w-xs" placeholder="Buscar…" value={search} onChange={(e) => setSearch(e.target.value)} />
        )}
        {can(permission) && (
          <button onClick={openCreate} className="btn-primary ml-auto">
            <Icon name="plus" className="h-4 w-4" /> Novo
          </button>
        )}
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-black/5 text-xs uppercase text-ink-600">
              {columns.map((c) => (
                <th key={c.key} className="px-4 py-3 font-semibold">{c.label}</th>
              ))}
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={columns.length + 1} className="px-4 py-6 text-center text-ink-600">Carregando…</td></tr>
            )}
            {!loading && filtered.length === 0 && (
              <tr><td colSpan={columns.length + 1} className="px-4 py-6 text-center text-ink-600">Nenhum registro encontrado.</td></tr>
            )}
            {filtered.map((row) => (
              <tr key={row.id} className="border-b border-black/5 last:border-0 hover:bg-black/[0.015]">
                {columns.map((c) => (
                  <td key={c.key} className="px-4 py-3 text-ink-800">{c.render ? c.render(row) : String(row[c.key] ?? '—')}</td>
                ))}
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    {extraActions?.(row, load)}
                    {can(permission) && (
                      <>
                        <button onClick={() => openEdit(row)} className="rounded-lg p-1.5 text-ink-600 hover:bg-black/5" title="Editar">
                          <Icon name="edit" className="h-4 w-4" />
                        </button>
                        <button onClick={() => remove(row)} className="rounded-lg p-1.5 text-red-600 hover:bg-red-50" title="Excluir">
                          <Icon name="trash" className="h-4 w-4" />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-ink-900">{editing ? 'Editar' : 'Novo'} registro</h3>
              <button onClick={() => setShowForm(false)} className="rounded-lg p-1.5 hover:bg-black/5">
                <Icon name="x" className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-3">
              {fields.map((f) => (
                <div key={f.key}>
                  <label className="label">{f.label}{f.required && ' *'}</label>
                  {f.type === 'textarea' && (
                    <textarea
                      className="input min-h-[90px]"
                      value={(form[f.key] as string) ?? ''}
                      onChange={(e) => setForm((s) => ({ ...s, [f.key]: e.target.value }))}
                    />
                  )}
                  {f.type === 'boolean' && (
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={Boolean(form[f.key])}
                        onChange={(e) => setForm((s) => ({ ...s, [f.key]: e.target.checked }))}
                      />
                      Ativo
                    </label>
                  )}
                  {f.type === 'select' && (
                    <select
                      className="input"
                      value={(form[f.key] as string) ?? ''}
                      onChange={(e) => setForm((s) => ({ ...s, [f.key]: e.target.value }))}
                    >
                      <option value="">Selecione…</option>
                      {f.options?.map((o) => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </select>
                  )}
                  {(f.type === 'text' || f.type === 'image') && (
                    <input
                      className="input"
                      value={(form[f.key] as string) ?? ''}
                      onChange={(e) => setForm((s) => ({ ...s, [f.key]: e.target.value }))}
                      placeholder={f.type === 'image' ? 'https://…' : undefined}
                    />
                  )}
                  {f.type === 'number' && (
                    <input
                      type="number"
                      className="input"
                      value={(form[f.key] as number) ?? 0}
                      onChange={(e) => setForm((s) => ({ ...s, [f.key]: Number(e.target.value) }))}
                    />
                  )}
                  {f.hint && <p className="mt-1 text-[11px] text-ink-600">{f.hint}</p>}
                </div>
              ))}
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button onClick={() => setShowForm(false)} className="btn-secondary">Cancelar</button>
              <button onClick={save} disabled={saving} className="btn-primary">{saving ? 'Salvando…' : 'Salvar'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
