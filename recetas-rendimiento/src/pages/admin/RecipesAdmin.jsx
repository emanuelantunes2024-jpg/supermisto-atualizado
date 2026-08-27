import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../../lib/StoreContext.jsx';
import Icon from '../../components/Icon.jsx';
import EmptyState from '../../components/EmptyState.jsx';

export default function RecipesAdmin() {
  const { recetas, guardarReceta, eliminarReceta, categorias, categoriaBySlug } = useStore();
  const [q, setQ] = useState('');
  const [categoria, setCategoria] = useState('');
  const [confirmarId, setConfirmarId] = useState(null);
  const [error, setError] = useState(null);

  const filtradas = recetas.filter((r) => {
    if (categoria && r.categoria !== categoria) return false;
    if (q && !r.nombre.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  function alternarPublicada(r) {
    guardarReceta({ ...r, publicada: !r.publicada }).catch(() => setError('No se pudo actualizar la receta.'));
  }
  function alternarNovedad(r) {
    guardarReceta({ ...r, novedad: !r.novedad }).catch(() => setError('No se pudo actualizar la receta.'));
  }
  function confirmarEliminar(id) {
    eliminarReceta(id).catch(() => setError('No se pudo eliminar la receta.'));
    setConfirmarId(null);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-ink">Recetas</h1>
          <p className="mt-1 text-sm text-ink/50">{recetas.length} recetas en total</p>
        </div>
        <Link to="/admin/recetas/nueva" className="btn-primary">
          <Icon name="plus" className="w-4 h-4" /> Nueva receta
        </Link>
      </div>

      {error && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-3.5">
          <p className="text-[12.5px] font-semibold text-amber-800">{error}</p>
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar por nombre…" className="input max-w-xs" />
        <select value={categoria} onChange={(e) => setCategoria(e.target.value)} className="input max-w-[220px]">
          <option value="">Todas las categorías</option>
          {categorias.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {filtradas.length === 0 ? (
        <EmptyState icon="book" title="No hay recetas que coincidan" description="Cambiá los filtros o creá una nueva receta." />
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-b border-black/5 text-xs uppercase tracking-wide text-ink/45">
              <tr>
                <th className="px-4 py-3 font-semibold">Receta</th>
                <th className="px-4 py-3 font-semibold">Categoría</th>
                <th className="px-4 py-3 font-semibold">Publicada</th>
                <th className="px-4 py-3 font-semibold">Novedad</th>
                <th className="px-4 py-3 font-semibold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {filtradas.map((r) => (
                <tr key={r.id}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={r.imagen} alt={r.nombre} className="h-10 w-10 rounded-lg object-cover" />
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-ink">{r.nombre}</p>
                        <p className="text-xs text-ink/45">{r.dificultad}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-ink/70">{categoriaBySlug(r.categoria)?.name}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => alternarPublicada(r)}
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        r.publicada ? 'bg-emerald-100 text-emerald-700' : 'bg-black/5 text-ink/50'
                      }`}
                    >
                      {r.publicada ? 'Publicada' : 'Oculta'}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => alternarNovedad(r)}
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        r.novedad ? 'bg-brand-100 text-brand-700' : 'bg-black/5 text-ink/50'
                      }`}
                    >
                      {r.novedad ? 'Sí' : 'No'}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link to={`/admin/recetas/${r.id}/editar`} className="rounded-lg p-2 text-ink/50 hover:bg-black/5 hover:text-ink">
                        <Icon name="pencil" className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => setConfirmarId(r.id)}
                        className="rounded-lg p-2 text-ink/50 hover:bg-red-50 hover:text-red-600"
                      >
                        <Icon name="trash" className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {confirmarId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setConfirmarId(null)} />
          <div className="relative w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl">
            <p className="text-base font-bold text-ink">¿Eliminar esta receta?</p>
            <p className="mt-1 text-sm text-ink/50">Esta acción no se puede deshacer.</p>
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setConfirmarId(null)} className="btn-secondary">
                Cancelar
              </button>
              <button
                onClick={() => confirmarEliminar(confirmarId)}
                className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
