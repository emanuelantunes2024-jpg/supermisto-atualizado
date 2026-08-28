import { useEffect, useState } from 'react';
import { useAdminAuth } from '../../lib/auth/AdminAuthContext';
import { getSetting, setSetting } from '../../lib/settings';

export default function AdminSettings() {
  const { can, logAction } = useAdminAuth();
  const [siteName, setSiteName] = useState('Central de Receitas & Renda');
  const [supportEmail, setSupportEmail] = useState('');
  const [maintenance, setMaintenance] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getSetting('site_name', 'Central de Receitas & Renda').then(setSiteName);
    getSetting('support_email', '').then(setSupportEmail);
    getSetting('maintenance_mode', false).then(setMaintenance);
  }, []);

  async function save() {
    await setSetting('site_name', siteName);
    await setSetting('support_email', supportEmail);
    await setSetting('maintenance_mode', maintenance);
    await logAction('update', 'settings', null, { key: 'general' });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="max-w-lg space-y-4">
      <div className="card space-y-3 p-5">
        <div>
          <label className="label">Nome do site/app</label>
          <input className="input" disabled={!can('settings.manage')} value={siteName} onChange={(e) => setSiteName(e.target.value)} />
        </div>
        <div>
          <label className="label">E-mail de suporte</label>
          <input className="input" disabled={!can('settings.manage')} value={supportEmail} onChange={(e) => setSupportEmail(e.target.value)} />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={maintenance} disabled={!can('settings.manage')} onChange={(e) => setMaintenance(e.target.checked)} /> Modo de manutenção
        </label>
        <button onClick={save} disabled={!can('settings.manage')} className="btn-primary">{saved ? 'Salvo!' : 'Salvar'}</button>
      </div>
      <p className="text-xs text-ink-600">
        Chaves sensíveis (Supabase, Hotmart) não ficam aqui — elas vivem só em variáveis de ambiente do servidor/Vercel.
      </p>
    </div>
  );
}
