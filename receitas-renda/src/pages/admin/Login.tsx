import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../lib/auth/AdminAuthContext';
import { supabaseConfigured } from '../../lib/supabase';
import { Icon } from '../../components/common/Icon';

export default function AdminLogin() {
  const { signIn } = useAdminAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await signIn(email, password);
    setLoading(false);
    if (error) setError(error);
    else navigate('/admin');
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-900 p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6">
        <div className="mb-6 flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500 text-white">
            <Icon name="wheat" className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase text-ink-600">Painel Administrativo</p>
            <p className="-mt-0.5 text-lg font-extrabold text-brand-600">Receitas&amp;Renda</p>
          </div>
        </div>
        {!supabaseConfigured && (
          <p className="mb-4 rounded-lg bg-amber-50 p-3 text-xs text-amber-800">
            Configure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no .env para ativar o login.
          </p>
        )}
        <form onSubmit={onSubmit} className="space-y-3">
          <div>
            <label className="label">E-mail</label>
            <input required type="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="label">Senha</label>
            <input required type="password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          {error && <p className="text-xs text-red-600">{error}</p>}
          <button disabled={loading} className="btn-primary w-full">{loading ? 'Entrando…' : 'Entrar no painel'}</button>
        </form>
      </div>
    </div>
  );
}
