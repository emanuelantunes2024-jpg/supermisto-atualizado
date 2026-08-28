import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useStore } from '../../lib/StoreContext.jsx';
import Icon from '../../components/Icon.jsx';
import { costoDesdeCompra, redondear } from '../../lib/calc.js';
import { PAISES, banderaDesdePais } from '../../lib/paises.js';

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
  categoria: '',
  descripcion: '',
  imagen: '',
  tiempoMinutos: 30,
  dificultad: 'Fácil',
  origen: '',
  rendimientoBase: 1,
  unidadRendimiento: 'unidades',
  ingredientes: [{ nombre: '', grupo: '', cantidad: '', unidad: '', precioCompra: '', cantidadCompra: '', costo: '' }],
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
  const { recetas, guardarReceta, categorias } = useStore();
  const existente = useMemo(() => recetas.find((r) => r.id === id), [recetas, id]);
  const [form, setForm] = useState(() => (existente ? { ...existente } : { ...RECETA_VACIA }));
  const [error, setError] = useState(null);
  const [guardando, setGuardando] = useState(false);

  // Categorías cargan de forma asíncrona: al crear una receta nueva, apenas
  // llegan, se preselecciona la primera.
  useEffect(() => {
    if (!existente && !form.categoria && categorias[0]) {
      setForm((f) => ({ ...f, categoria: categorias[0].slug }));
    }
  }, [existente, categorias]); // eslint-disable-line react-hooks/exhaustive-deps

  function set(campo, valor) {
    setForm((f) => ({ ...f, [campo]: valor }));
  }

  // Campos que, al cambiar, recalculan el costo automáticamente a partir de
  // lo que costó el paquete/envase completo que se compró (precioCompra
  // dividido cantidadCompra, multiplicado por la cantidad que usa la
  // receta). Si el ingrediente no tiene precio/cantidad de compra cargados,
  // el costo se sigue pudiendo escribir a mano — no se fuerza nada.
  const CAMPOS_QUE_RECALCULAN = new Set(['cantidad', 'precioCompra', 'cantidadCompra']);

  function setIngrediente(idx, campo, valor) {
    setForm((f) => {
      const ingredientes = [...f.ingredientes];
      const actual = { ...ingredientes[idx], [campo]: valor };
      if (CAMPOS_QUE_RECALCULAN.has(campo) && actual.precioCompra && actual.cantidadCompra) {
        actual.costo = redondear(
          costoDesdeCompra({
            precioCompra: actual.precioCompra,
            cantidadCompra: actual.cantidadCompra,
            cantidadUsada: actual.cantidad,
          }),
          2
        );
      }
      ingredientes[idx] = actual;
      return { ...f, ingredientes };
    });
  }
  function agregarIngrediente() {
    setForm((f) => ({
      ...f,
      ingredientes: [
        ...f.ingredientes,
        { nombre: '', grupo: '', cantidad: '', unidad: '', precioCompra: '', cantidadCompra: '', costo: '' },
      ],
    }));
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

  async function onSubmit(e) {
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
          precioCompra: Number(i.precioCompra) || 0,
          cantidadCompra: Number(i.cantidadCompra) || 0,
          costo: Number(i.costo) || 0,
        })),
      pasos: form.pasos.filter((p) => p.trim()),
      creadoEn: existente?.creadoEn || new Date().toISOString().slice(0, 10),
    };

    setError(null);
    setGuardando(true);
    try {
      await guardarReceta(receta);
      navigate('/admin/recetas');
    } catch {
      setError('No se pudo guardar la receta. Revisá tu conexión e intentá de nuevo.');
    } finally {
      setGuardando(false);
    }
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
              {categorias.map((c) => (
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

          <div>
            <label className="label">País de origen (opcional)</label>
            <div className="mt-1.5 flex items-center gap-2">
              {form.origen && <span className="text-xl">{banderaDesdePais(form.origen)}</span>}
              <select value={form.origen} onChange={(e) => set('origen', e.target.value)} className="input flex-1">
                <option value="">Sin especificar</option>
                {PAISES.map((p) => (
                  <option key={p.code} value={p.code}>
                    {banderaDesdePais(p.code)} {p.nombre}
                  </option>
                ))}
              </select>
            </div>
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
          <p className="text-sm font-bold text-ink">Ingredientes</p>
          <p className="mt-1 text-[12.5px] leading-relaxed text-ink/50">
            Cargá cuánto pagaste por el paquete/envase completo y cuánto usa la receta — el costo se
            calcula solo. Si preferís, también podés escribir el costo directamente a mano.
          </p>
          <div className="mt-3 space-y-3">
            {form.ingredientes.map((ing, idx) => {
              const autoCalculado = Boolean(ing.precioCompra) && Boolean(ing.cantidadCompra);
              return (
                <div key={idx} className="rounded-xl border border-ink/10 p-3">
                  <div className="grid grid-cols-12 gap-2">
                    <input
                      value={ing.nombre}
                      onChange={(e) => setIngrediente(idx, 'nombre', e.target.value)}
                      placeholder="Ingrediente (ej: Harina)"
                      className="input col-span-4"
                    />
                    <input
                      value={ing.grupo || ''}
                      onChange={(e) => setIngrediente(idx, 'grupo', e.target.value)}
                      placeholder="Sección"
                      className="input col-span-3"
                    />
                    <input
                      value={ing.cantidad}
                      onChange={(e) => setIngrediente(idx, 'cantidad', e.target.value)}
                      placeholder="Cant. usada"
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
                    <button type="button" onClick={() => quitarIngrediente(idx)} className="col-span-1 flex items-center justify-center rounded-xl text-ink/40 hover:bg-red-50 hover:text-red-600">
                      <Icon name="x" className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="mt-2 grid grid-cols-12 gap-2">
                    <div className="col-span-4">
                      <input
                        value={ing.precioCompra || ''}
                        onChange={(e) => setIngrediente(idx, 'precioCompra', e.target.value)}
                        placeholder="Precio del paquete ($)"
                        type="number"
                        step="0.01"
                        min="0"
                        className="input"
                      />
                    </div>
                    <div className="col-span-4">
                      <input
                        value={ing.cantidadCompra || ''}
                        onChange={(e) => setIngrediente(idx, 'cantidadCompra', e.target.value)}
                        placeholder={`Cant. del paquete (en ${ing.unidad || 'la misma unidad'})`}
                        type="number"
                        step="0.01"
                        min="0"
                        className="input"
                      />
                    </div>
                    <div className="col-span-4">
                      <div className="relative">
                        <input
                          value={ing.costo}
                          onChange={(e) => setIngrediente(idx, 'costo', e.target.value)}
                          placeholder="Costo en la receta ($)"
                          type="number"
                          step="0.01"
                          className="input pr-14"
                        />
                        {autoCalculado && (
                          <span className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-700">
                            Auto
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
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

        {error && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-3.5">
            <p className="text-[12.5px] font-semibold text-amber-800">{error}</p>
          </div>
        )}

        <div className="flex justify-end gap-2">
          <Link to="/admin/recetas" className="btn-secondary">
            Cancelar
          </Link>
          <button type="submit" disabled={guardando} className="btn-primary">
            <Icon name="check" className="w-4 h-4" /> {guardando ? 'Guardando…' : 'Guardar receta'}
          </button>
        </div>
      </form>
    </div>
  );
}
