import { useEffect, useState } from 'react';
import { useAdminAuth } from '../../lib/auth/AdminAuthContext';
import { getSetting, setSetting } from '../../lib/settings';

export default function AdminCalculators() {
  const { can, logAction } = useAdminAuth();
  const [defaultMargin, setDefaultMargin] = useState(70);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getSetting('default_profit_margin', 70).then(setDefaultMargin);
  }, []);

  async function save() {
    await setSetting('default_profit_margin', defaultMargin);
    await logAction('update', 'settings', null, { key: 'default_profit_margin' });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="max-w-lg space-y-4">
      <p className="text-sm text-ink-600">
        As Calculadoras de Custo e de Preço do app usam a margem de lucro padrão abaixo como sugestão inicial. O
        assinante pode ajustar livremente na hora de calcular.
      </p>
      <div className="card space-y-3 p-5">
        <label className="label">Margem de lucro padrão: {defaultMargin}%</label>
        <input type="range" min={0} max={95} value={defaultMargin} disabled={!can('settings.manage')} onChange={(e) => setDefaultMargin(Number(e.target.value))} className="w-full accent-brand-500" />
        <button onClick={save} disabled={!can('settings.manage')} className="btn-primary">{saved ? 'Salvo!' : 'Salvar'}</button>
      </div>
    </div>
  );
}
