import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Icon, type IconName } from '../../components/common/Icon';
import { RecipeImage } from '../../components/common/RecipeImage';
import { AreaChart, DonutChart } from '../../components/admin/Charts';
import { formatBRL } from '../../lib/calc';

const PALETTE = ['#7C6FF2', '#22B573', '#F2600C', '#2F8FEA', '#EC4899', '#F5C542'];

type Metric = { label: string; value: string; delta: number; icon: IconName; color: string };

function daysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

async function countBetween(table: string, from: Date, to: Date, filters?: Record<string, unknown>) {
  let q = supabase.from(table).select('id', { count: 'exact', head: true }).gte('created_at', from.toISOString()).lt('created_at', to.toISOString());
  if (filters) Object.entries(filters).forEach(([k, v]) => (q = q.eq(k, v as any)));
  const { count } = await q;
  return count ?? 0;
}

function pctChange(current: number, previous: number) {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}

export default function Dashboard() {
  const [metrics, setMetrics] = useState<Metric[] | null>(null);
  const [growthLabels, setGrowthLabels] = useState<string[]>([]);
  const [growthData, setGrowthData] = useState<number[]>([]);
  const [planSegments, setPlanSegments] = useState<{ label: string; value: number; color: string }[]>([]);
  const [topRecipes, setTopRecipes] = useState<any[]>([]);
  const [recentNews, setRecentNews] = useState<any[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [recentSubs, setRecentSubs] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const now = new Date();
      const d30 = daysAgo(30);
      const d60 = daysAgo(60);

      const [
        totalUsers,
        activeUsers,
        totalRecipes,
        publishedRecipes,
        totalFavorites,
        activeSubs,
        usersLast30,
        usersPrev30,
        recipesLast30,
        recipesPrev30,
        publishedLast30,
        publishedPrev30,
        favoritesLast30,
        favoritesPrev30,
        subsLast30,
        subsPrev30,
      ] = await Promise.all([
        supabase.from('users').select('id', { count: 'exact', head: true }),
        supabase.from('users').select('id', { count: 'exact', head: true }).eq('status', 'active'),
        supabase.from('recipes').select('id', { count: 'exact', head: true }),
        supabase.from('recipes').select('id', { count: 'exact', head: true }).eq('published', true),
        supabase.from('favorites').select('id', { count: 'exact', head: true }),
        supabase.from('subscriptions').select('id, plan:plans(price)').eq('status', 'ativa'),
        countBetween('users', d30, now),
        countBetween('users', d60, d30),
        countBetween('recipes', d30, now),
        countBetween('recipes', d60, d30),
        countBetween('recipes', d30, now, { published: true }),
        countBetween('recipes', d60, d30, { published: true }),
        countBetween('favorites', d30, now),
        countBetween('favorites', d60, d30),
        countBetween('subscriptions', d30, now, { status: 'ativa' }),
        countBetween('subscriptions', d60, d30, { status: 'ativa' }),
      ]);

      const revenue = ((activeSubs.data as any[]) ?? []).reduce((s, r) => s + (r.plan?.price ?? 0), 0);

      setMetrics([
        { label: 'Total de Usuários', value: (totalUsers.count ?? 0).toLocaleString('pt-BR'), delta: pctChange(usersLast30, usersPrev30), icon: 'users', color: '#7C6FF2' },
        { label: 'Usuários Ativos', value: (activeUsers.count ?? 0).toLocaleString('pt-BR'), delta: pctChange(usersLast30, usersPrev30), icon: 'trending', color: '#22B573' },
        { label: 'Total de Receitas', value: (totalRecipes.count ?? 0).toLocaleString('pt-BR'), delta: pctChange(recipesLast30, recipesPrev30), icon: 'book', color: '#F2600C' },
        { label: 'Receitas Publicadas', value: (publishedRecipes.count ?? 0).toLocaleString('pt-BR'), delta: pctChange(publishedLast30, publishedPrev30), icon: 'check', color: '#2F8FEA' },
        { label: 'Receitas Favoritas', value: (totalFavorites.count ?? 0).toLocaleString('pt-BR'), delta: pctChange(favoritesLast30, favoritesPrev30), icon: 'heart', color: '#EC4899' },
        { label: 'Receita (R$)', value: formatBRL(revenue), delta: pctChange(subsLast30, subsPrev30), icon: 'card', color: '#22B573' },
      ]);

      // Crescimento de usuários (últimos 30 dias, acumulado)
      const { count: baseCount } = await supabase.from('users').select('id', { count: 'exact', head: true }).lt('created_at', d30.toISOString());
      const { data: usersInWindow } = await supabase.from('users').select('created_at').gte('created_at', d30.toISOString());
      const byDay: Record<string, number> = {};
      (usersInWindow ?? []).forEach((u: any) => {
        const key = new Date(u.created_at).toISOString().slice(0, 10);
        byDay[key] = (byDay[key] ?? 0) + 1;
      });
      const labels: string[] = [];
      const values: number[] = [];
      let running = baseCount ?? 0;
      for (let i = 30; i >= 0; i--) {
        const d = daysAgo(i);
        const key = d.toISOString().slice(0, 10);
        running += byDay[key] ?? 0;
        labels.push(d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }));
        values.push(running);
      }
      setGrowthLabels(labels);
      setGrowthData(values);

      // Usuários por plano
      const { data: plans } = await supabase.from('plans').select('id,name').order('sort_order');
      const segments = await Promise.all(
        ((plans as any[]) ?? []).map(async (p, i) => {
          const { count } = await supabase.from('users').select('id', { count: 'exact', head: true }).eq('plan_id', p.id);
          return { label: p.name, value: count ?? 0, color: PALETTE[i % PALETTE.length] };
        })
      );
      setPlanSegments(segments.filter((s) => s.value > 0));

      // Receitas mais acessadas
      const { data: top } = await supabase.from('recipes').select('id,title,image_url,views_count,category:categories(name)').order('views_count', { ascending: false }).limit(5);
      setTopRecipes(top ?? []);

      // Novidades recentes
      const { data: news } = await supabase.from('news').select('*').order('created_at', { ascending: false }).limit(3);
      setRecentNews(news ?? []);

      // Atividade recente
      const { data: activity } = await supabase.from('system_logs').select('*, admin:admins(name)').order('created_at', { ascending: false }).limit(5);
      setRecentActivity(activity ?? []);

      // Assinaturas recentes
      const { data: subs } = await supabase.from('subscriptions').select('*, user:users(name), plan:plans(name,price)').order('created_at', { ascending: false }).limit(5);
      setRecentSubs(subs ?? []);
    })();
  }, []);

  return (
    <div className="space-y-4 lg:space-y-6">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-6">
        {(metrics ?? Array.from({ length: 6 })).map((m: Metric | undefined, i) => (
          <div key={i} className="card p-4">
            {!m ? (
              <div className="h-24 animate-pulse rounded-lg bg-black/5" />
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: `${m.color}1A`, color: m.color }}>
                    <Icon name={m.icon} className="h-4 w-4" />
                  </div>
                  <p className="text-xs font-semibold text-ink-600">{m.label}</p>
                </div>
                <p className="mt-2 text-2xl font-extrabold text-ink-900">{m.value}</p>
                <p className={`text-xs font-semibold ${m.delta >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                  {m.delta >= 0 ? '↑' : '↓'} {Math.abs(m.delta).toFixed(1)}% <span className="font-normal text-ink-600">vs período anterior</span>
                </p>
              </>
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-6">
        <div className="card p-5 lg:col-span-2">
          <h2 className="mb-3 text-sm font-bold text-ink-900">Crescimento de Usuários (últimos 30 dias)</h2>
          {growthData.length > 0 ? <AreaChart labels={growthLabels} data={growthData} /> : <p className="text-sm text-ink-600">Sem dados suficientes ainda.</p>}
        </div>
        <div className="card p-5">
          <h2 className="mb-3 text-sm font-bold text-ink-900">Usuários por plano</h2>
          {planSegments.length > 0 ? <DonutChart segments={planSegments} /> : <p className="text-sm text-ink-600">Nenhum usuário cadastrado ainda.</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-6">
        <div className="card p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-bold text-ink-900">Receitas mais acessadas</h2>
            <Link to="/admin/receitas" className="text-xs font-semibold text-brand-600">Ver todas</Link>
          </div>
          <ul className="space-y-3">
            {topRecipes.map((r, i) => (
              <li key={r.id} className="flex items-center gap-3">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-100 text-[11px] font-bold text-brand-700">{i + 1}</span>
                <RecipeImage src={r.image_url} alt={r.title} className="h-9 w-9 rounded-lg object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-ink-900">{r.title}</p>
                  <p className="text-xs text-ink-600">{r.category?.name}</p>
                </div>
                <span className="flex items-center gap-1 text-xs text-ink-600"><Icon name="eye" className="h-3.5 w-3.5" /> {r.views_count?.toLocaleString('pt-BR')}</span>
              </li>
            ))}
            {topRecipes.length === 0 && <p className="text-sm text-ink-600">Nenhuma receita ainda.</p>}
          </ul>
        </div>

        <div className="card p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-bold text-ink-900">Novidades recentes</h2>
            <Link to="/admin/novidades" className="text-xs font-semibold text-brand-600">Ver todas</Link>
          </div>
          <ul className="space-y-3">
            {recentNews.map((n) => (
              <li key={n.id} className="flex gap-3">
                <RecipeImage src={n.image_url} alt={n.title} className="h-12 w-12 shrink-0 rounded-lg object-cover" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-ink-900">{n.title}</p>
                  <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold ${n.status === 'published' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                    {n.status === 'published' ? 'Publicado' : 'Rascunho'}
                  </span>
                </div>
              </li>
            ))}
            {recentNews.length === 0 && <p className="text-sm text-ink-600">Nenhuma novidade ainda.</p>}
          </ul>
        </div>

        <div className="card p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-bold text-ink-900">Atividade recente</h2>
            <Link to="/admin/logs" className="text-xs font-semibold text-brand-600">Ver todas</Link>
          </div>
          <ul className="space-y-3">
            {recentActivity.map((a) => (
              <li key={a.id} className="text-sm">
                <p className="font-semibold text-ink-900">{a.action} · {a.entity}</p>
                <p className="text-xs text-ink-600">{a.admin?.name ?? 'Sistema'} · {timeAgo(a.created_at)}</p>
              </li>
            ))}
            {recentActivity.length === 0 && <p className="text-sm text-ink-600">Nenhuma atividade registrada ainda.</p>}
          </ul>
        </div>
      </div>

      <div className="card p-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-bold text-ink-900">Assinaturas recentes</h2>
          <Link to="/admin/assinaturas" className="text-xs font-semibold text-brand-600">Ver todas</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead>
              <tr className="text-xs uppercase text-ink-600">
                <th className="py-2 font-semibold">Usuário</th>
                <th className="py-2 font-semibold">Plano</th>
                <th className="py-2 font-semibold">Valor</th>
                <th className="py-2 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentSubs.map((s) => (
                <tr key={s.id} className="border-t border-black/5">
                  <td className="py-2.5 font-medium text-ink-900">{s.user?.name ?? '—'}</td>
                  <td className="py-2.5 text-ink-700">{s.plan?.name ?? '—'}</td>
                  <td className="py-2.5 text-ink-700">{formatBRL(s.plan?.price ?? 0)}</td>
                  <td className="py-2.5">
                    <StatusBadge status={s.status} />
                  </td>
                </tr>
              ))}
              {recentSubs.length === 0 && (
                <tr><td colSpan={4} className="py-4 text-center text-ink-600">Nenhuma assinatura ainda.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h2 className="mb-3 text-sm font-bold text-ink-900">Ações rápidas</h2>
        <div className="flex flex-wrap gap-2">
          <QuickAction to="/admin/receitas" icon="plus" label="Nova receita" />
          <QuickAction to="/admin/ingredientes" icon="plus" label="Novo ingrediente" />
          <QuickAction to="/admin/categorias" icon="plus" label="Nova categoria" />
          <QuickAction to="/admin/usuarios" icon="plus" label="Novo usuário" />
          <QuickAction to="/admin/planos" icon="plus" label="Novo plano" />
          <QuickAction to="/admin/novidades" icon="plus" label="Nova novidade" />
          <QuickAction to="/admin/banners" icon="plus" label="Novo banner" />
          <QuickAction to="/admin/relatorios" icon="chart" label="Ver relatórios" />
        </div>
      </div>
    </div>
  );
}

function QuickAction({ to, icon, label }: { to: string; icon: IconName; label: string }) {
  return (
    <Link to={to} className="card flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-ink-800 hover:bg-black/[0.02]">
      <Icon name={icon} className="h-4 w-4 text-brand-600" /> {label}
    </Link>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    ativa: 'bg-emerald-100 text-emerald-700',
    pendente: 'bg-amber-100 text-amber-700',
    cancelada: 'bg-red-100 text-red-700',
  };
  const labels: Record<string, string> = { ativa: 'Ativa', pendente: 'Pendente', cancelada: 'Cancelada' };
  return <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${map[status] ?? 'bg-gray-100 text-gray-700'}`}>{labels[status] ?? status}</span>;
}

function timeAgo(iso: string) {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return 'agora mesmo';
  if (diff < 3600) return `há ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `há ${Math.floor(diff / 3600)} h`;
  return `há ${Math.floor(diff / 86400)} dias`;
}
