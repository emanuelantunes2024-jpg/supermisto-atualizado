import { useState } from 'react';
import { useStore } from '../../lib/StoreContext.jsx';
import Icon from '../../components/Icon.jsx';
import EmptyState from '../../components/EmptyState.jsx';

function slugificar(texto) {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// Etiquetas libres (ej: "sin gluten", "rápida", "para fiestas") que el
// admin arma acá y después aplica a cada receta desde su formulario — el
// cliente puede filtrar el catálogo por ellas en /recetas.
export default function TagsAdmin() {
  const { recetas, etiquetas, guardarEtiqueta, eliminarEtiqueta } = useStore();
  const [nombre, setNombre] = useState('');
  const [confirmarId, setConfirmarId] = useState(null);
  const [error, setError] = useState(null);
  const [guardando, setGuardando] = useState(false);

  async function crear(e) {
    e.preventDefault();
    const texto = nombre.trim();
    if (!texto) return;

    let id = slugificar(texto);
    let base = id || 'etiqueta';
    let n = 2;
    while (etiquetas.some((e) => e.id === id)) id = `${base}-${n++}`;

    setError(null);
    setGuardando(true);
    try {
      await guardarEtiqueta({ id, nombre: texto });
      setNombre('');
    } catch {
      setError('No se pudo crear la etiqueta. Intentá de nuevo.');
    } finally {
      setGuardando(false);
    }
  }

  async function confirmarEliminar(id) {
    setError(null);
    try {
      await eliminarEtiqueta(id);
    } catch {
      setError('No se pudo eliminar la etiqueta.');
    } finally {
      setConfirmarId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-ink">Etiquetas</h1>
        <p className="mt-1 text-sm text-ink/50">
          Se aplican a cada receta desde su formulario de edición, y el cliente puede filtrar por ellas
          en "Todas las recetas".
        </p>
      </div>

      <form onSubmit={crear} className="card flex flex-wrap items-end gap-3 p-4">
        <div className="min-w-[200px] flex-1">
          <label className="label">Nueva etiqueta</label>
          <input
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej: sin gluten, rápida, para fiestas…"
            className="input mt-1.5"
          />
        </div>
        <button type="submit" disabled={guardando || !nombre.trim()} className="btn-primary shrink-0">
          <Icon name="plus" className="w-4 h-4" /> {guardando ? 'Creando…' : 'Crear'}
        </button>
      </form>

      {error && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-3.5">
          <p className="text-[12.5px] font-semibold text-amber-800">{error}</p>
        </div>
      )}

      {etiquetas.length === 0 ? (
        <EmptyState icon="tag" title="Todavía no creaste ninguna etiqueta" description="Usá el formulario de arriba para crear la primera." />
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[480px] text-left text-sm">
            <thead className="border-b border-black/5 text-xs uppercase tracking-wide text-ink/45">
              <tr>
                <th className="px-4 py-3 font-semibold">Etiqueta</th>
                <th className="px-4 py-3 font-semibold">Recetas</th>
                <th className="px-4 py-3 font-semibold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {etiquetas.map((e) => {
                const cantidad = recetas.filter((r) => r.etiquetas?.includes(e.id)).length;
                return (
                  <tr key={e.id}>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700">{e.nombre}</span>
                    </td>
                    <td className="px-4 py-3 text-ink/70">{cantidad}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setConfirmarId(e.id)}
                          className="rounded-lg p-2 text-ink/50 hover:bg-red-50 hover:text-red-600"
                        >
                          <Icon name="trash" className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {confirmarId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setConfirmarId(null)} />
          <div className="relative w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl">
            <p className="text-base font-bold text-ink">¿Eliminar esta etiqueta?</p>
            <p className="mt-1 text-sm text-ink/50">Se va a quitar de todas las recetas que la tengan asignada.</p>
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
