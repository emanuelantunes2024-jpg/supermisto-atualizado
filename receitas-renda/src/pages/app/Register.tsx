import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../lib/auth/AuthContext';
import { Icon } from '../../components/common/Icon';

export default function Register() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await signUp(name, email, password);
    setLoading(false);
    if (error) setError(error);
    else setDone(true);
  }

  if (done) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream p-4">
        <div className="card max-w-sm p-6 text-center">
          <p className="text-lg font-bold text-ink-900">Conta criada! 🎉</p>
          <p className="mt-2 text-sm text-ink-600">Confirme seu e-mail (se solicitado) e faça login para começar.</p>
          <button onClick={() => navigate('/app/entrar')} className="btn-primary mt-4 w-full">Ir para o login</button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream p-4">
      <div className="card w-full max-w-sm p-6">
        <div className="mb-6 flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500 text-white">
            <Icon name="wheat" className="h-5 w-5" />
          </div>
          <p className="text-lg font-extrabold text-brand-600">
            Receitas<span className="text-ink-900">&amp;Renda</span>
          </p>
        </div>
        <h1 className="text-xl font-extrabold text-ink-900">Criar conta</h1>
        <form onSubmit={onSubmit} className="mt-4 space-y-3">
          <div>
            <label className="label">Nome</label>
            <input required className="input" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label className="label">E-mail</label>
            <input required type="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="label">Senha</label>
            <input required minLength={6} type="password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          {error && <p className="text-xs text-red-600">{error}</p>}
          <button disabled={loading} className="btn-primary w-full">{loading ? 'Criando…' : 'Criar conta'}</button>
        </form>
        <p className="mt-4 text-center text-xs text-ink-600">
          Já tem conta? <Link to="/app/entrar" className="font-semibold text-brand-600">Entrar</Link>
        </p>
      </div>
    </div>
  );
}
