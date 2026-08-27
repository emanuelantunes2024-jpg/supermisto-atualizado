import { useEffect, useState } from 'react';
import { useAdminAuth } from '../../lib/auth/AdminAuthContext';
import { getSetting, setSetting } from '../../lib/settings';

export default function AdminIncomeCenter() {
  const { can, logAction } = useAdminAuth();
  const [budgets, setBudgets] = useState('30,50,100,300,500');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getSetting('income_center_budgets', [30, 50, 100, 300, 500]).then((v) => setBudgets(v.join(',')));
  }, []);

  async function save() {
    const arr = budgets.split(',').map((s) => Number(s.trim())).filter((n) => !Number.isNaN(n));
    await setSetting('income_center_budgets', arr);
    await logAction('update', 'settings', null, { key: 'income_center_budgets' });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="max-w-lg space-y-4">
      <p className="text-sm text-ink-600">
        A Central de Renda no app guia o assinante com 3 perguntas (orçamento, categoria e canal de venda) e sugere as
        receitas com melhor lucro dentro do valor informado. Aqui você configura os valores de orçamento oferecidos.
      </p>
      <div className="card space-y-3 p-5">
        <div>
          <label className="label">Valores de orçamento sugeridos (separados por vírgula)</label>
          <input className="input" disabled={!can('settings.manage')} value={budgets} onChange={(e) => setBudgets(e.target.value)} />
        </div>
        <button onClick={save} disabled={!can('settings.manage')} className="btn-primary">{saved ? 'Salvo!' : 'Salvar'}</button>
      </div>
    </div>
  );
}
