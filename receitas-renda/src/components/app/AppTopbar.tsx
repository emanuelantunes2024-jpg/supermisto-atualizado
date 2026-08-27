import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Icon } from '../common/Icon';
import { useAuth } from '../../lib/auth/AuthContext';

export function AppTopbar({ onMenu }: { onMenu: () => void }) {
  const { profile } = useAuth();
  const [term, setTerm] = useState('');
  const navigate = useNavigate();
  const firstName = (profile?.name || 'Assinante').split(' ')[0];

  return (
    <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-black/5 bg-white/90 px-4 py-3 backdrop-blur lg:px-6">
      <button onClick={onMenu} className="rounded-lg p-2 text-ink-700 hover:bg-black/5 lg:hidden">
        <Icon name="menu" className="h-5 w-5" />
      </button>

      <form
        className="hidden flex-1 max-w-xl items-center gap-2 rounded-xl border border-black/10 bg-white px-3 py-2 lg:flex"
        onSubmit={(e) => {
          e.preventDefault();
          navigate(`/app/buscar?q=${encodeURIComponent(term)}`);
        }}
      >
        <Icon name="search" className="h-4 w-4 text-ink-600" />
        <input
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder="Buscar receitas, ingredientes..."
          className="w-full text-sm outline-none placeholder:text-ink-600/60"
        />
      </form>

      <div className="ml-auto flex items-center gap-3">
        <button className="rounded-lg p-2 text-ink-700 hover:bg-black/5">
          <Icon name="bell" className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-700">
            {firstName.slice(0, 1).toUpperCase()}
          </div>
          <span className="hidden text-sm font-medium text-ink-700 sm:block">Olá, {firstName}!</span>
        </div>
      </div>
    </header>
  );
}
