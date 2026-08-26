import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../lib/StoreContext.jsx';
import Icon from '../../components/Icon.jsx';
import { calcularCosto, formatoMoneda } from '../../lib/calc.js';

const FILA_VACIA = () => ({ id: Math.random().toString(36).slice(2), nombre: '', costo: '' });

export default function CostCalculator() {
  const { recetasPublicadas } = useStore();
  const navigate = useNavigate();
  const [filas, setFilas] = useState([FILA_VACIA(), FILA_VACIA(), FILA_VACIA()]);
  const [costosExtra, setCostosExtra] = useState('');
  const [unidades, setUnidades] = useState(1);

  const resultado = useMemo(
    () =>
      calcularCosto({
        ingredientes: filas.map((f) => ({ costo: Number(f.costo) || 0 })),
        costosExtra,
        unidades,
      }),
    [filas, costosExtra, unidades]
  );

  function actualizarFila(id, campo, valor) {
    setFilas((prev) => prev.map((f) => (f.id === id ? { ...f, [campo]: valor } : f)));
  }

  function agregarFila() {
    setFilas((prev) => [...prev, FILA_VACIA()]);
  }

  function quitarFila(id) {
    setFilas((prev) => prev.filter((f) => f.id !== id));
  }

  function cargarReceta(e) {
    const slug = e.target.value;
    if (!slug) return;
    const receta = recetasPublicadas.find((r) => r.slug === slug);
    if (!receta) return;
    setFilas(receta.ingredientes.map((i) => ({ id: Math.random().toString(36).slice(2), nombre: i.nombre, costo: i.costo })));
    setCostosExtra(receta.costosExtra || 0);
    setUnidades(receta.rendimientoBase);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-ink">Calculadora de costos</h1>
        <p className="mt-1 text-sm text-ink/50">Sumá tus ingredientes para saber cuánto cuesta producir tu receta.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <div className="card p-5">
            <label className="label">Empezar desde una receta (opcional)</label>
            <select onChange={cargarReceta} defaultValue="" className="input mt-1.5">
              <option value="">Elegir receta…</option>
              {recetasPublicadas.map((r) => (
                <option key={r.id} value={r.slug}>
                  {r.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="card p-5">
            <p className="mb-3 text-sm font-bold text-ink">Ingredientes</p>
            <div className="space-y-2">
              {filas.map((f) => (
                <div key={f.id} className="flex gap-2">
                  <input
                    value={f.nombre}
                    onChange={(e) => actualizarFila(f.id, 'nombre', e.target.value)}
                    placeholder="Ingrediente"
                    className="input flex-1"
                  />
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={f.costo}
                    onChange={(e) => actualizarFila(f.id, 'costo', e.target.value)}
                    placeholder="Costo"
                    className="input w-28"
                  />
                  <button onClick={() => quitarFila(f.id)} className="rounded-xl p-2.5 text-ink/40 hover:bg-red-50 hover:text-red-600">
                    <Icon name="x" className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            <button onClick={agregarFila} className="btn-secondary mt-3">
              <Icon name="plus" className="w-4 h-4" /> Agregar ingrediente
            </button>
          </div>

          <div className="card grid gap-4 p-5 sm:grid-cols-2">
            <div>
              <label className="label">Otros costos (empaque, envío, etc.)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={costosExtra}
                onChange={(e) => setCostosExtra(e.target.value)}
                className="input mt-1.5"
              />
            </div>
            <div>
              <label className="label">¿Cuántas unidades rinde?</label>
              <input
                type="number"
                min="1"
                value={unidades}
                onChange={(e) => setUnidades(e.target.value)}
                className="input mt-1.5"
              />
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="card sticky top-20 p-5">
            <p className="mb-3 text-sm font-bold text-ink">Resultado</p>
            <dl className="space-y-2.5 text-sm">
              <div className="flex justify-between">
                <dt className="text-ink/50">Costo de ingredientes</dt>
                <dd className="font-semibold text-ink/80">{formatoMoneda(resultado.totalIngredientes)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink/50">Otros costos</dt>
                <dd className="font-semibold text-ink/80">{formatoMoneda(costosExtra)}</dd>
              </div>
              <div className="flex justify-between border-t border-black/5 pt-2.5">
                <dt className="font-semibold text-ink">Costo total</dt>
                <dd className="text-base font-extrabold text-ink">{formatoMoneda(resultado.total)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink/50">Costo por unidad</dt>
                <dd className="font-semibold text-brand-600">{formatoMoneda(resultado.porUnidad)}</dd>
              </div>
            </dl>
            <button
              onClick={() =>
                navigate('/calculadoras/precios', { state: { costoUnitario: resultado.porUnidad, unidades } })
              }
              className="btn-primary mt-5 w-full justify-center"
            >
              Calcular precio de venta →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
