import { useEffect, useState } from 'react';
import { useAdminAuth } from '../../lib/auth/AdminAuthContext';
import { getSetting, setSetting } from '../../lib/settings';

export default function AdminSimulator() {
  const { can, logAction } = useAdminAuth();
  const [defaultGoal, setDefaultGoal] = useState(1500);
  const [defaultDays, setDefaultDays] = useState(5);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getSetting('goal_simulator_default_income', 1500).then(setDefaultGoal);
    getSetting('goal_simulator_default_days', 5).then(setDefaultDays);
  }, []);

  async function save() {
    await setSetting('goal_simulator_default_income', defaultGoal);
    await setSetting('goal_simulator_default_days', defaultDays);
    await logAction('update', 'settings', null, { key: 'goal_simulator_defaults' });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="max-w-lg space-y-4">
      <p className="text-sm text-ink-600">
        O Simulador de Objetivos (dentro de Central de Renda, no app) calcula quantas unidades o assinante precisa
        vender por dia para bater a meta de renda mensal. Defina os valores padrão exibidos ao abrir o simulador.
      </p>
      <div className="card space-y-3 p-5">
        <div>
          <label className="label">Meta de renda mensal padrão (R$)</label>
          <input type="number" className="input" disabled={!can('settings.manage')} value={defaultGoal} onChange={(e) => setDefaultGoal(Number(e.target.value))} />
        </div>
        <div>
          <label className="label">Dias de trabalho por semana padrão</label>
          <input type="number" min={1} max={7} className="input" disabled={!can('settings.manage')} value={defaultDays} onChange={(e) => setDefaultDays(Number(e.target.value))} />
        </div>
        <button onClick={save} disabled={!can('settings.manage')} className="btn-primary">{saved ? 'Salvo!' : 'Salvar'}</button>
      </div>
    </div>
  );
}
