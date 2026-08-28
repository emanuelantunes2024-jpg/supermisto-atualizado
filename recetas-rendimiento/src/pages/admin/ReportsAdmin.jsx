import { useEffect, useState } from 'react';
import { useStore } from '../../lib/StoreContext.jsx';
import EmptyState from '../../components/EmptyState.jsx';

function Metrica({ etiqueta, valor, acento }) {
  return (
    <div className="card p-4">
      <p className="text-[11.5px] font-semibold text-ink/50">{etiqueta}</p>
      <p className={`mt-1 text-2xl font-extrabold ${acento || 'text-ink'}`}>{valor}</p>
    </div>
  );
}

export default function ReportsAdmin() {
  const { recetas } = useStore();
  const [datos, setDatos] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let activo = true;
    fetch('/api/admin/reportes', { credentials: 'include' })
      .then((r) => r.json())
      .then((d) => {
        if (!activo) return;
        if (d.ok) setDatos(d);
        else setError(d.error || 'error_desconocido');
      })
      .catch(() => activo && setError('error_desconocido'));
    return () => {
      activo = false;
    };
  }, []);

  const ranking = datos
    ? recetas
        .map((r) => ({ receta: r, vistas: Number(datos.vistas?.[r.id]) || 0 }))
        .filter((x) => x.vistas > 0)
        .sort((a, b) => b.vistas - a.vistas)
        .slice(0, 10)
    : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-ink">Reportes</h1>
        <p className="mt-1 text-sm text-ink/50">
          Clientes según Hotmart, y las recetas más vistas (contador agregado, sin identificar visitantes).
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-3.5">
          <p className="text-[12.5px] font-semibold text-amber-800">
            {error === 'redis_no_configurado'
              ? 'Todavía falta conectar el almacenamiento en Vercel (Storage → Marketplace → Redis).'
              : 'No se pudieron cargar los reportes.'}
          </p>
        </div>
      )}

      {datos && (
        <>
          <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-4">
            <Metrica etiqueta="Clientes totales" valor={datos.clientes.total} />
            <Metrica etiqueta="Activos" valor={datos.clientes.activos} acento="text-emerald-600" />
            <Metrica etiqueta="Cancelados" valor={datos.clientes.cancelados} acento="text-red-600" />
            <Metrica etiqueta="Otros estados" valor={datos.clientes.otros} />
          </div>

          <div>
            <p className="mb-3 text-[13px] font-bold text-ink">Recetas más vistas</p>
            {ranking.length === 0 ? (
              <EmptyState
                icon="trending"
                title="Todavía no hay vistas registradas"
                description="Se van a ir sumando a medida que los clientes entren a cada receta."
              />
            ) : (
              <div className="card overflow-x-auto">
                <table className="w-full min-w-[480px] text-left text-sm">
                  <thead className="border-b border-black/5 text-xs uppercase tracking-wide text-ink/45">
                    <tr>
                      <th className="px-4 py-3 font-semibold">#</th>
                      <th className="px-4 py-3 font-semibold">Receta</th>
                      <th className="px-4 py-3 font-semibold text-right">Vistas</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/5">
                    {ranking.map((x, idx) => (
                      <tr key={x.receta.id}>
                        <td className="px-4 py-3 text-ink/45">{idx + 1}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <img src={x.receta.imagen} alt={x.receta.nombre} className="h-9 w-9 rounded-lg object-cover" />
                            <p className="font-semibold text-ink">{x.receta.nombre}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right font-bold text-brand-600">{x.vistas}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
