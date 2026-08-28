import { useEffect, useState } from 'react';
import EmptyState from '../../components/EmptyState.jsx';

const ESTADO_ESTILOS = {
  activo: 'bg-emerald-100 text-emerald-700',
  cancelado: 'bg-red-100 text-red-700',
  expirado: 'bg-amber-100 text-amber-700',
};

function formatearFecha(iso) {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  } catch {
    return '—';
  }
}

export default function ClientesAdmin() {
  const [clientes, setClientes] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let activo = true;
    fetch('/api/admin/clientes', { credentials: 'include' })
      .then((r) => r.json())
      .then((d) => {
        if (!activo) return;
        if (d.ok) setClientes(d.clientes);
        else setError(d.error || 'error_desconocido');
      })
      .catch(() => activo && setError('error_desconocido'));
    return () => {
      activo = false;
    };
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-ink">Clientes</h1>
        <p className="mt-1 text-sm text-ink/50">
          Suscriptores de Hotmart. El estado lo actualiza Hotmart automáticamente (compra, cancelación,
          reembolso, vencimiento) — esta lista es de solo lectura.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-3.5">
          <p className="text-[12.5px] font-semibold text-amber-800">
            {error === 'redis_no_configurado'
              ? 'Todavía falta conectar el almacenamiento en Vercel (Storage → Marketplace → Redis).'
              : 'No se pudo cargar la lista de clientes.'}
          </p>
        </div>
      )}

      {!error && clientes?.length === 0 && (
        <EmptyState
          icon="users"
          title="Todavía no hay clientes"
          description="En cuanto Hotmart envíe la primera compra aprobada al webhook, va a aparecer acá."
        />
      )}

      {!error && clientes?.length > 0 && (
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-black/5 text-xs uppercase tracking-wide text-ink/45">
              <tr>
                <th className="px-4 py-3 font-semibold">Email</th>
                <th className="px-4 py-3 font-semibold">Estado</th>
                <th className="px-4 py-3 font-semibold">Plan</th>
                <th className="px-4 py-3 font-semibold">Inicio</th>
                <th className="px-4 py-3 font-semibold">Renovación</th>
                <th className="px-4 py-3 font-semibold">ID Hotmart</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {clientes.map((c) => (
                <tr key={c.email}>
                  <td className="px-4 py-3 font-semibold text-ink">{c.email}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        ESTADO_ESTILOS[c.status] || 'bg-black/5 text-ink/50'
                      }`}
                    >
                      {c.status || (c.active ? 'activo' : 'sin datos')}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-ink/70">{c.plan || '—'}</td>
                  <td className="px-4 py-3 text-ink/70">{formatearFecha(c.fechaInicio)}</td>
                  <td className="px-4 py-3 text-ink/70">{formatearFecha(c.fechaRenovacion)}</td>
                  <td className="px-4 py-3 text-ink/50">
                    {c.hotmartSubscriberCode || c.hotmartTransactionId || '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
