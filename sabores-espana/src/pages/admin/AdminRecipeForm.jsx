import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { RECETAS_SEED } from '../../data/recipes.js';
import { CATEGORIES } from '../../lib/categories.js';
import { RecipeImage } from '../../components/PlaceholderImage.jsx';

const VACIA = {
  nombre: '',
  categoria: CATEGORIES[0].slug,
  region: '',
  descripcion: '',
  imagen: '',
  tiempoPrepMinutos: 15,
  tiempoCoccionMinutos: 15,
  dificultad: 'Fácil',
  porciones: 4,
  destacada: false,
  publicada: true,
  ingredientes: [{ nombre: '', cantidad: '', unidad: '' }],
  pasos: [''],
  consejos: [],
  conservacion: 'Se conserva en la nevera, en un recipiente hermético, hasta 2-3 días.',
};

function slugify(nombre) {
  return nombre
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export default function AdminRecipeForm() {
  const { id } = useParams();
  const esNueva = id === 'nueva';
  const navigate = useNavigate();

  const [form, setForm] = useState(VACIA);
  const [cargando, setCargando] = useState(!esNueva);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');
  const [ok, setOk] = useState(false);

  useEffect(() => {
    if (esNueva) return;
    let cancelado = false;
    (async () => {
      const base = RECETAS_SEED.find((r) => r.id === id) || {};
      try {
        const resp = await fetch('/api/content/recetas');
        const data = resp.ok ? await resp.json() : {};
        const override = data?.overrides?.[id] || {};
        if (!cancelado) setForm({ ...VACIA, ...base, ...override });
      } catch {
        if (!cancelado) setForm({ ...VACIA, ...base });
      } finally {
        if (!cancelado) setCargando(false);
      }
    })();
    return () => {
      cancelado = true;
    };
  }, [id, esNueva]);

  function set(campo, valor) {
    setForm((f) => ({ ...f, [campo]: valor }));
  }

  function setListaItem(campo, i, valor) {
    setForm((f) => {
      const lista = [...f[campo]];
      lista[i] = valor;
      return { ...f, [campo]: lista };
    });
  }

  function agregarItem(campo, vacio) {
    setForm((f) => ({ ...f, [campo]: [...f[campo], vacio] }));
  }

  function quitarItem(campo, i) {
    setForm((f) => ({ ...f, [campo]: f[campo].filter((_, idx) => idx !== i) }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    setGuardando(true);
    setOk(false);
    try {
      const idFinal = esNueva ? `extra-${Date.now()}` : id;
      const payload = {
        ...form,
        slug: slugify(form.nombre),
        tiempoTotalMinutos: Number(form.tiempoPrepMinutos) + Number(form.tiempoCoccionMinutos),
        ingredientes: form.ingredientes.filter((i) => i.nombre.trim()),
        pasos: form.pasos.filter((p) => p.trim()),
        consejos: form.consejos.filter((c) => c.trim()),
        esNueva: esNueva || form.esNueva,
      };
      const resp = await fetch('/api/admin/recetas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: idFinal, data: payload }),
      });
      if (!resp.ok) throw new Error();
      setOk(true);
      if (esNueva) navigate(`/admin/recetas/${idFinal}`, { replace: true });
    } catch {
      setError('No se pudo guardar. Revisá que Redis esté conectado (ver README).');
    } finally {
      setGuardando(false);
    }
  }

  if (cargando) {
    return <p className="py-10 text-center text-sm text-ink/50">Cargando…</p>;
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-ink">{esNueva ? 'Nueva receta' : 'Editar receta'}</h1>
        <Link to="/admin/recetas" className="text-sm font-medium text-ink/60 hover:text-ink">
          ← Volver
        </Link>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        <section className="grid gap-4 rounded-2xl border border-line bg-shell p-5 sm:grid-cols-2">
          <label className="flex flex-col gap-1 text-sm sm:col-span-2">
            Nombre
            <input required value={form.nombre} onChange={(e) => set('nombre', e.target.value)} className="rounded-xl border border-line px-3 py-2" />
          </label>
          <label className="flex flex-col gap-1 text-sm sm:col-span-2">
            Descripción
            <textarea rows={2} value={form.descripcion} onChange={(e) => set('descripcion', e.target.value)} className="rounded-xl border border-line px-3 py-2" />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Categoría
            <select value={form.categoria} onChange={(e) => set('categoria', e.target.value)} className="rounded-xl border border-line px-3 py-2">
              {CATEGORIES.map((c) => (
                <option key={c.slug} value={c.slug}>{c.icon} {c.name}</option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Región (opcional)
            <input value={form.region} onChange={(e) => set('region', e.target.value)} className="rounded-xl border border-line px-3 py-2" />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Dificultad
            <select value={form.dificultad} onChange={(e) => set('dificultad', e.target.value)} className="rounded-xl border border-line px-3 py-2">
              <option>Fácil</option>
              <option>Media</option>
              <option>Difícil</option>
            </select>
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Porciones
            <input type="number" min={1} value={form.porciones} onChange={(e) => set('porciones', Number(e.target.value))} className="rounded-xl border border-line px-3 py-2" />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Tiempo de preparación (min)
            <input type="number" min={0} value={form.tiempoPrepMinutos} onChange={(e) => set('tiempoPrepMinutos', Number(e.target.value))} className="rounded-xl border border-line px-3 py-2" />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Tiempo de cocción (min)
            <input type="number" min={0} value={form.tiempoCoccionMinutos} onChange={(e) => set('tiempoCoccionMinutos', Number(e.target.value))} className="rounded-xl border border-line px-3 py-2" />
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.destacada} onChange={(e) => set('destacada', e.target.checked)} />
            Receta destacada
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.publicada} onChange={(e) => set('publicada', e.target.checked)} />
            Publicada (visible para los miembros)
          </label>
        </section>

        <section className="rounded-2xl border border-line bg-shell p-5">
          <h2 className="mb-3 font-display text-base font-semibold text-ink">Foto de la receta</h2>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="h-28 w-40 shrink-0 overflow-hidden rounded-xl">
              <RecipeImage receta={form} className="h-full w-full object-cover" />
            </div>
            <div className="flex-1">
              <input
                type="url"
                placeholder="https://…/foto-de-la-receta.jpg"
                value={form.imagen}
                onChange={(e) => set('imagen', e.target.value)}
                className="w-full rounded-xl border border-line px-3 py-2 text-sm"
              />
              <p className="mt-1.5 text-xs text-ink/50">
                Pegá acá la URL de la foto ya subida (a tu propio hosting, Vercel Blob, etc.). Vacío = ilustración por categoría.
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-line bg-shell p-5">
          <h2 className="mb-3 font-display text-base font-semibold text-ink">Ingredientes</h2>
          <div className="space-y-2">
            {form.ingredientes.map((ing, i) => (
              <div key={i} className="flex gap-2">
                <input
                  placeholder="Ingrediente"
                  value={ing.nombre}
                  onChange={(e) => setListaItem('ingredientes', i, { ...ing, nombre: e.target.value })}
                  className="flex-1 rounded-xl border border-line px-3 py-2 text-sm"
                />
                <input
                  placeholder="Cant."
                  value={ing.cantidad}
                  onChange={(e) => setListaItem('ingredientes', i, { ...ing, cantidad: Number(e.target.value) || e.target.value })}
                  className="w-20 rounded-xl border border-line px-3 py-2 text-sm"
                />
                <input
                  placeholder="Unidad"
                  value={ing.unidad}
                  onChange={(e) => setListaItem('ingredientes', i, { ...ing, unidad: e.target.value })}
                  className="w-24 rounded-xl border border-line px-3 py-2 text-sm"
                />
                <button type="button" onClick={() => quitarItem('ingredientes', i)} className="px-2 text-ink/40 hover:text-wine-500">✕</button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => agregarItem('ingredientes', { nombre: '', cantidad: '', unidad: '' })}
            className="mt-3 text-sm font-semibold text-wine-500"
          >
            + Agregar ingrediente
          </button>
        </section>

        <section className="rounded-2xl border border-line bg-shell p-5">
          <h2 className="mb-3 font-display text-base font-semibold text-ink">Preparación</h2>
          <div className="space-y-2">
            {form.pasos.map((paso, i) => (
              <div key={i} className="flex gap-2">
                <span className="mt-2 text-xs font-semibold text-ink/40">{i + 1}.</span>
                <textarea
                  rows={2}
                  value={paso}
                  onChange={(e) => setListaItem('pasos', i, e.target.value)}
                  className="flex-1 rounded-xl border border-line px-3 py-2 text-sm"
                />
                <button type="button" onClick={() => quitarItem('pasos', i)} className="px-2 text-ink/40 hover:text-wine-500">✕</button>
              </div>
            ))}
          </div>
          <button type="button" onClick={() => agregarItem('pasos', '')} className="mt-3 text-sm font-semibold text-wine-500">
            + Agregar paso
          </button>
        </section>

        <section className="rounded-2xl border border-line bg-shell p-5">
          <h2 className="mb-3 font-display text-base font-semibold text-ink">Consejos (opcional)</h2>
          <div className="space-y-2">
            {form.consejos.map((c, i) => (
              <div key={i} className="flex gap-2">
                <input value={c} onChange={(e) => setListaItem('consejos', i, e.target.value)} className="flex-1 rounded-xl border border-line px-3 py-2 text-sm" />
                <button type="button" onClick={() => quitarItem('consejos', i)} className="px-2 text-ink/40 hover:text-wine-500">✕</button>
              </div>
            ))}
          </div>
          <button type="button" onClick={() => agregarItem('consejos', '')} className="mt-3 text-sm font-semibold text-wine-500">
            + Agregar consejo
          </button>
        </section>

        {error && <p className="text-sm text-wine-500">{error}</p>}
        {ok && <p className="text-sm text-emerald-600">Guardado ✓</p>}

        <button
          type="submit"
          disabled={guardando}
          className="w-full rounded-xl bg-wine-500 px-4 py-3 text-sm font-semibold text-white shadow-card hover:bg-wine-600 disabled:opacity-60"
        >
          {guardando ? 'Guardando…' : 'Guardar cambios'}
        </button>
      </form>
    </div>
  );
}
