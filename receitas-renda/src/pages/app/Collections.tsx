import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../lib/auth/AuthContext';
import { Icon } from '../../components/common/Icon';
import type { Collection } from '../../lib/types';

export default function Collections() {
  const { profile } = useAuth();
  const [collections, setCollections] = useState<(Collection & { count: number })[]>([]);
  const [name, setName] = useState('');

  async function load() {
    if (!profile) return;
    const { data } = await supabase.from('collections').select('*, collection_recipes(count)').eq('user_id', profile.id);
    setCollections(((data as any[]) ?? []).map((c) => ({ ...c, count: c.collection_recipes?.[0]?.count ?? 0 })));
  }

  useEffect(() => {
    load();
  }, [profile]);

  async function create() {
    if (!profile || !name.trim()) return;
    await supabase.from('collections').insert({ user_id: profile.id, name });
    setName('');
    load();
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-extrabold text-ink-900">Minhas Coleções</h1>
      <div className="card flex gap-2 p-4">
        <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome da nova coleção (ex: Para o Natal)" />
        <button onClick={create} className="btn-primary shrink-0">
          <Icon name="plus" className="h-4 w-4" /> Criar
        </button>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {collections.map((c) => (
          <Link key={c.id} to={`/app/colecoes/${c.id}`} className="card flex flex-col items-center gap-2 p-6 text-center">
            <Icon name="folder" className="h-8 w-8 text-brand-500" />
            <p className="text-sm font-bold text-ink-900">{c.name}</p>
            <p className="text-xs text-ink-600">{c.count} receitas</p>
          </Link>
        ))}
        {collections.length === 0 && <p className="col-span-full text-sm text-ink-600">Crie sua primeira coleção acima.</p>}
      </div>
    </div>
  );
}
