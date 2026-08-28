import { useEffect, useState } from 'react';
import { useAdminAuth } from '../../lib/auth/AdminAuthContext';
import { getSetting, setSetting } from '../../lib/settings';

export default function AdminAIAssistant() {
  const { can, logAction } = useAdminAuth();
  const [enabled, setEnabled] = useState(true);
  const [welcome, setWelcome] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getSetting('ai_assistant_enabled', true).then(setEnabled);
    getSetting('ai_assistant_welcome', 'Olá! Sou o Assistente IA da Central de Receitas & Renda.').then(setWelcome);
  }, []);

  async function save() {
    await setSetting('ai_assistant_enabled', enabled);
    await setSetting('ai_assistant_welcome', welcome);
    await logAction('update', 'settings', null, { key: 'ai_assistant' });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="max-w-lg space-y-4">
      <p className="text-sm text-ink-600">
        A estrutura de conversa do Assistente IA já está pronta no app. A integração com um provedor de IA (API) deve
        ser conectada depois, em variáveis de ambiente de servidor — nenhuma chave fica no frontend.
      </p>
      <div className="card space-y-3 p-5">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={enabled} disabled={!can('settings.manage')} onChange={(e) => setEnabled(e.target.checked)} /> Assistente IA visível no app
        </label>
        <div>
          <label className="label">Mensagem de boas-vindas</label>
          <textarea className="input min-h-[80px]" disabled={!can('settings.manage')} value={welcome} onChange={(e) => setWelcome(e.target.value)} />
        </div>
        <button onClick={save} disabled={!can('settings.manage')} className="btn-primary">{saved ? 'Salvo!' : 'Salvar'}</button>
      </div>
    </div>
  );
}
