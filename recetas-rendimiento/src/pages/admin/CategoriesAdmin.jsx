import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../../lib/StoreContext.jsx';
import Icon from '../../components/Icon.jsx';

function slugificar(texto) {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

const CATEGORIA_VACIA = { slug: '', name: '', icon: '🍽️', color: '#8B5CF6' };

export default function CategoriesAdmin() {
  const { recetas, categorias, guardarCategoria, eliminarCategoria } = useStore();
  const [editando, setEditando] = useState(null); // null | 'nueva' | categoria
  const [form, setForm] = useState(CATEGORIA_VACIA);
  const [confirmarSlug, setConfirmarSlug] = useState(null);
  const [error, setError] = useState(null);
  const [guardando, setGuardando] = useState(false);

  function abrirNueva() {
    setForm(CATEGORIA_VACIA);
    setError(null);
    setEditando('nueva');
  }

  function abrirEditar(c) {
    setForm({ ...c });
    setError(null);
    setEditando(c);
  }

  async function onSubmit(e) {
    e.preventDefault();
    const name = form.name.trim();
    if (!name) return;

    let slug = editando === 'nueva' ? slugificar(name) : form.slug;
    if (editando === 'nueva') {
      let base = slug || 'categoria';
      let n = 2;
      while (categorias.some((c) => c.slug === slug)) {
        slug = `${base}-${n++}`;
      }
    }

    setError(null);
    setGuardando(true);
    try {
      await guardarCategoria({ ...form, name, slug });
      setEditando(null);
    } catch {
      setError('No se pudo guardar la categoría. Intentá de nuevo.');
    } finally {
      setGuardando(false);
    }
  }

  async function confirmarEliminar(slug) {
    setError(null);
    try {
      await eliminarCategoria(slug);
    } catch (err) {
      setError(
        err.message === 'categoria_en_uso'
          ? 'No se puede eliminar: todavía hay recetas en esta categoría.'
          : 'No se pudo eliminar la categoría.'
      );
    } finally {
      setConfirmarSlug(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-ink">Categorías</h1>
          <p className="mt-1 text-sm text-ink/50">Se asignan a cada receta desde su formulario de edición.</p>
        </div>
        <button onClick={abrirNueva} className="btn-primary">
          <Icon name="plus" className="w-4 h-4" /> Nueva categoría
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-3.5">
          <p className="text-[12.5px] font-semibold text-amber-800">{error}</p>
        </div>
      )}

      <div className="card overflow-x-auto">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead className="border-b border-black/5 text-xs uppercase tracking-wide text-ink/45">
            <tr>
              <th className="px-4 py-3 font-semibold">Categoría</th>
              <th className="px-4 py-3 font-semibold">Total</th>
              <th className="px-4 py-3 font-semibold">Publicadas</th>
              <th className="px-4 py-3 font-semibold text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {categorias.map((c) => {
              const todas = recetas.filter((r) => r.categoria === c.slug);
              const publicadas = todas.filter((r) => r.publicada);
              return (
                <tr key={c.slug}>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-2 font-semibold text-ink">
                      <span>{c.icon}</span> {c.name}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-ink/70">{todas.length}</td>
                  <td className="px-4 py-3 text-ink/70">{publicadas.length}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link
                        to={`/categorias/${c.slug}`}
                        className="rounded-lg p-2 text-ink/50 hover:bg-black/5 hover:text-ink"
                        title="Ver en el sitio"
                      >
                        <Icon name="chevronRight" className="w-4 h-4" />
                      </Link>
                      <button onClick={() => abrirEditar(c)} className="rounded-lg p-2 text-ink/50 hover:bg-black/5 hover:text-ink">
                        <Icon name="pencil" className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setConfirmarSlug(c.slug)}
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

      {editando && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setEditando(null)} />
          <div className="relative w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl">
            <p className="text-base font-bold text-ink">{editando === 'nueva' ? 'Nueva categoría' : 'Editar categoría'}</p>
            <form onSubmit={onSubmit} className="mt-4 space-y-3">
              <div>
                <label className="label">Nombre</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="input mt-1.5"
                  required
                  autoFocus
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Icono (emoji)</label>
                  <input
                    value={form.icon}
                    onChange={(e) => setForm((f) => ({ ...f, icon: e.target.value }))}
                    className="input mt-1.5"
                    maxLength={4}
                  />
                </div>
                <div>
                  <label className="label">Color</label>
                  <input
                    type="color"
                    value={form.color}
                    onChange={(e) => setForm((f) => ({ ...f, color: e.target.value }))}
                    className="input mt-1.5 h-[42px] p-1"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button type="button" onClick={() => setEditando(null)} className="btn-secondary">
                  Cancelar
                </button>
                <button type="submit" disabled={guardando} className="btn-primary">
                  {guardando ? 'Guardando…' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {confirmarSlug && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setConfirmarSlug(null)} />
          <div className="relative w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl">
            <p className="text-base font-bold text-ink">¿Eliminar esta categoría?</p>
            <p className="mt-1 text-sm text-ink/50">
              Solo se puede eliminar si no tiene recetas asignadas. Esta acción no se puede deshacer.
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setConfirmarSlug(null)} className="btn-secondary">
                Cancelar
              </button>
              <button
                onClick={() => confirmarEliminar(confirmarSlug)}
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
