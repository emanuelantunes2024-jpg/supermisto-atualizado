import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../lib/auth/AuthContext';
import { Icon } from '../../components/common/Icon';
import { formatBRL } from '../../lib/calc';
import type { Plan, Subscription } from '../../lib/types';

export default function MyPlan() {
  const { profile } = useAuth();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [subscription, setSubscription] = useState<Subscription | null>(null);

  useEffect(() => {
    supabase.from('plans').select('*').eq('is_active', true).order('sort_order').then(({ data }) => setPlans((data as Plan[]) ?? []));
  }, []);

  useEffect(() => {
    if (!profile) return;
    supabase
      .from('subscriptions')
      .select('*, plan:plans(*)')
      .eq('user_id', profile.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()
      .then(({ data }) => setSubscription(data as Subscription));
  }, [profile]);

  const statusColor =
    subscription?.status === 'ativa' ? 'bg-green-100 text-green-700' : subscription?.status === 'pendente' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700';

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-extrabold text-ink-900">Meu Plano</h1>

      <div className="card p-5">
        <p className="text-sm text-ink-600">Plano atual</p>
        <div className="mt-1 flex flex-wrap items-center gap-3">
          <p className="text-2xl font-extrabold text-ink-900">{profile?.plan?.name ?? 'Gratuito'}</p>
          {subscription && (
            <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusColor}`}>
              {subscription.status === 'ativa' ? 'Ativa' : subscription.status === 'pendente' ? 'Pendente' : 'Cancelada'}
            </span>
          )}
        </div>
        {subscription?.expires_at && (
          <p className="mt-1 text-xs text-ink-600">Renovação/expiração: {new Date(subscription.expires_at).toLocaleDateString('pt-BR')}</p>
        )}
        <p className="mt-2 text-xs text-ink-600">
          A assinatura é ativada e cancelada automaticamente pela Hotmart. Se você já comprou e o acesso não liberou, aguarde alguns minutos ou fale com o suporte.
        </p>
      </div>

      <div>
        <p className="mb-3 text-sm font-bold text-ink-900">Planos disponíveis</p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {plans.map((p) => (
            <div key={p.id} className={`card p-5 ${profile?.plan_id === p.id ? 'ring-2 ring-brand-500' : ''}`}>
              <p className="text-sm font-bold text-ink-900">{p.name}</p>
              <p className="mt-2 text-2xl font-extrabold text-brand-600">
                {p.price > 0 ? formatBRL(p.price) : 'Grátis'}
                {p.price > 0 && <span className="text-xs font-medium text-ink-600">/{p.billing_period}</span>}
              </p>
              <ul className="mt-3 space-y-1.5 text-xs text-ink-700">
                {p.features?.map((f, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Icon name="check" className="h-3.5 w-3.5 text-brand-500" /> {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
