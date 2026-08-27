import { useMemo, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useStore } from '../../lib/StoreContext.jsx';
import { CATEGORIES } from '../../data/categories.js';
import Icon from '../../components/Icon.jsx';

const DIFICULTADES = ['Fácil', 'Medio', 'Difícil'];

function slugificar(texto) {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

const RECETA_VACIA = {
  nombre: '',
  categoria: CATEGORIES[0].slug,
  descripcion: '',
  imagen: '',
  tiempoMinutos: 30,
  dificultad: 'Fácil',
  rendimientoBase: 1,
  unidadRendimiento: 'unidades',
  ingredientes: [{ nombre: '', grupo: '', cantidad: '', unidad: '', costo: '' }],
  pasos: [''],
  consejos: [],
  conservacion: '',
  costosExtra: 0,
  costoEmpaque: 0,
  margenSugerido: 70,
  paraVender: false,
  novedad: false,
  publicada: true,
};

export default function RecipeForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { recetas, guardarReceta } = useStore();
  const existente = useMemo(() => recetas.find((r) => r.id === id), [recetas, id]);
  const [form, setForm] = useState(() => (existente ? { ...existente } : { ...RECETA_VACIA }));

  function set(campo, valor) {
    setForm((f) => ({ ...f, [campo]: valor }));
  }

  function setIngrediente(idx, campo, valor) {
    setForm((f) => {
      const ingredientes = [...f.ingredientes];
      ingredientes[idx] = { ...ingredientes[idx], [campo]: valor };
      return { ...f, ingredientes };
    });
  }
  function agregarIngrediente() {
    setForm((f) => ({ ...f, ingredientes: [...f.ingredientes, { nombre: '', grupo: '', cantidad: '', unidad: '', costo: '' }] }));
  }
  function quitarIngrediente(idx) {
    setForm((f) => ({ ...f, ingredientes: f.ingredientes.filter((_, i) => i !== idx) }));
  }

  function setPaso(idx, valor) {
    setForm((f) => {
      const pasos = [...f.pasos];
      pasos[idx] = valor;
      return { ...f, pasos };
    });
  }
  function agregarPaso() {
    setForm((f) => ({ ...f, pasos: [...f.pasos, ''] }));
  }
  function quitarPaso(idx) {
    setForm((f) => ({ ...f, pasos: f.pasos.filter((_, i) => i !== idx) }));
  }

  function onImagenSubida(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => set('imagen', reader.result);
    reader.readAsDataURL(file);
  }

  function onSubmit(e) {
    e.preventDefault();
    const nombre = form.nombre.trim();
    if (!nombre) return;

    let slug = existente?.slug;
    if (!slug) {
      const base = slugificar(nombre) || 'receta';
      slug = base;
      let n = 2;
      while (recetas.some((r) => r.slug === slug)) {
        slug = `${base}-${n++}`;
      }
    }

    const receta = {
      ...form,
      id: existente?.id || `r${Date.now()}`,
      slug,
      nombre,
      tiempoMinutos: Number(form.tiempoMinutos) || 0,
      rendimientoBase: Number(form.rendimientoBase) || 1,
      costosExtra: Number(form.costosExtra) || 0,
      costoEmpaque: Number(form.costoEmpaque) || 0,
      margenSugerido: Number(form.margenSugerido) || 0,
      imagen: form.imagen || '/images/recipes/brigadeiro-gourmet.svg',
      ingredientes: form.ingredientes
        .filter((i) => i.nombre.trim())
        .map((i) => ({
          ...i,
          grupo: (i.grupo || '').trim(),
          cantidad: Number(i.cantidad) || 0,
          costo: Number(i.costo) || 0,
        })),
      pasos: form.pasos.filter((p) => p.trim()),
      creadoEn: existente?.creadoEn || new Date().toISOString().slice(0, 10),
    };

    guardarReceta(receta);
    navigate('/admin/recetas');
  }

  return (
    <div className="space-y-6">
      <Link to="/admin/recetas" className="btn-ghost -ml-3">
        <Icon name="chevronLeft" className="w-4 h-4" /> Volver a recetas
      </Link>

      <h1 className="text-2xl font-extrabold text-ink">{existente ? 'Editar receta' : 'Nueva receta'}</h1>

      <form onSubmit={onSubmit} className="space-y-6">
        <div className="card grid gap-4 p-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="label">Nombre de la receta</label>
            <input value={form.nombre} onChange={(e) => set('nombre', e.target.value)} className="input mt-1.5" required />
          </div>

          <div>
            <label className="label">Categoría</label>
            <select value={form.categoria} onChange={(e) => set('categoria', e.target.value)} className="input mt-1.5">
              {CATEGORIES.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">Dificultad</label>
            <select value={form.dificultad} onChange={(e) => set('dificultad', e.target.value)} className="input mt-1.5">
              {DIFICULTADES.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="label">Descripción</label>
            <textarea
              value={form.descripcion}
              onChange={(e) => set('descripcion', e.target.value)}
              rows={2}
              className="input mt-1.5"
            />
          </div>

          <div>
            <label className="label">Tiempo (minutos)</label>
            <input type="number" min="0" value={form.tiempoMinutos} onChange={(e) => set('tiempoMinutos', e.target.value)} className="input mt-1.5" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Rendimiento</label>
              <input type="number" min="1" value={form.rendimientoBase} onChange={(e) => set('rendimientoBase', e.target.value)} className="input mt-1.5" />
            </div>
            <div>
              <label className="label">Unidad</label>
              <input value={form.unidadRendimiento} onChange={(e) => set('unidadRendimiento', e.target.value)} placeholder="unidades" className="input mt-1.5" />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label className="label">Imagen (URL o subir archivo)</label>
            <div className="mt-1.5 flex flex-wrap items-center gap-3">
              <input value={form.imagen} onChange={(e) => set('imagen', e.target.value)} placeholder="/images/recipes/…" className="input flex-1 min-w-[200px]" />
              <label className="btn-secondary cursor-pointer">
                <Icon name="upload" className="w-4 h-4" /> Subir
                <input type="file" accept="image/*" onChange={onImagenSubida} className="hidden" />
              </label>
              {form.imagen && <img src={form.imagen} alt="" className="h-12 w-12 rounded-lg object-cover" />}
            </div>
          </div>
        </div>

        {/* Ingredientes */}
        <div className="card p-5">
          <p className="mb-3 text-sm font-bold text-ink">Ingredientes</p>
          <div className="space-y-2">
            {form.ingredientes.map((ing, idx) => (
              <div key={idx} className="grid grid-cols-12 gap-2">
                <input
                  value={ing.nombre}
                  onChange={(e) => setIngrediente(idx, 'nombre', e.target.value)}
                  placeholder="Ingrediente"
                  className="input col-span-3"
                />
                <input
                  value={ing.grupo || ''}
                  onChange={(e) => setIngrediente(idx, 'grupo', e.target.value)}
                  placeholder="Sección"
                  className="input col-span-2"
                />
                <input
                  value={ing.cantidad}
                  onChange={(e) => setIngrediente(idx, 'cantidad', e.target.value)}
                  placeholder="Cant."
                  type="number"
                  step="0.01"
                  className="input col-span-2"
                />
                <input
                  value={ing.unidad}
                  onChange={(e) => setIngrediente(idx, 'unidad', e.target.value)}
                  placeholder="Unidad"
                  className="input col-span-2"
                />
                <input
                  value={ing.costo}
                  onChange={(e) => setIngrediente(idx, 'costo', e.target.value)}
                  placeholder="Costo"
                  type="number"
                  step="0.01"
                  className="input col-span-2"
                />
                <button type="button" onClick={() => quitarIngrediente(idx)} className="col-span-1 flex items-center justify-center rounded-xl text-ink/40 hover:bg-red-50 hover:text-red-600">
                  <Icon name="x" className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
          <button type="button" onClick={agregarIngrediente} className="btn-secondary mt-3">
            <Icon name="plus" className="w-4 h-4" /> Agregar ingrediente
          </button>
        </div>

        {/* Pasos */}
        <div className="card p-5">
          <p className="mb-3 text-sm font-bold text-ink">Modo de preparación</p>
          <div className="space-y-2">
            {form.pasos.map((paso, idx) => (
              <div key={idx} className="flex gap-2">
                <span className="flex h-10 w-8 shrink-0 items-center justify-center text-sm font-bold text-ink/40">{idx + 1}.</span>
                <input value={paso} onChange={(e) => setPaso(idx, e.target.value)} placeholder="Describí el paso…" className="input flex-1" />
                <button type="button" onClick={() => quitarPaso(idx)} className="rounded-xl p-2.5 text-ink/40 hover:bg-red-50 hover:text-red-600">
                  <Icon name="x" className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
          <button type="button" onClick={agregarPaso} className="btn-secondary mt-3">
            <Icon name="plus" className="w-4 h-4" /> Agregar paso
          </button>
        </div>

        {/* Costos y estado */}
        <div className="card grid gap-4 p-5 sm:grid-cols-2">
          <div>
            <label className="label">Costo de embalaje ($)</label>
            <input type="number" min="0" step="0.01" value={form.costoEmpaque} onChange={(e) => set('costoEmpaque', e.target.value)} className="input mt-1.5" />
          </div>
          <div>
            <label className="label">Otros costos ($)</label>
            <input type="number" min="0" step="0.01" value={form.costosExtra} onChange={(e) => set('costosExtra', e.target.value)} className="input mt-1.5" />
          </div>
          <div>
            <label className="label">Margen de ganancia sugerido (%)</label>
            <input type="number" min="0" value={form.margenSugerido} onChange={(e) => set('margenSugerido', e.target.value)} className="input mt-1.5" />
          </div>
          <div className="sm:col-span-2">
            <label className="label">Conservación</label>
            <textarea value={form.conservacion} onChange={(e) => set('conservacion', e.target.value)} rows={2} className="input mt-1.5" />
          </div>

          <div className="flex flex-wrap gap-4 sm:col-span-2">
            <label className="flex items-center gap-2 text-sm font-medium text-ink">
              <input type="checkbox" checked={form.publicada} onChange={(e) => set('publicada', e.target.checked)} className="h-4 w-4 accent-brand-500" />
              Publicada
            </label>
            <label className="flex items-center gap-2 text-sm font-medium text-ink">
              <input type="checkbox" checked={form.novedad} onChange={(e) => set('novedad', e.target.checked)} className="h-4 w-4 accent-brand-500" />
              Marcar como novedad
            </label>
            <label className="flex items-center gap-2 text-sm font-medium text-ink">
              <input type="checkbox" checked={form.paraVender} onChange={(e) => set('paraVender', e.target.checked)} className="h-4 w-4 accent-brand-500" />
              Receta para vender
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Link to="/admin/recetas" className="btn-secondary">
            Cancelar
          </Link>
          <button type="submit" className="btn-primary">
            <Icon name="check" className="w-4 h-4" /> Guardar receta
          </button>
        </div>
      </form>
    </div>
  );
}
