import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../lib/StoreContext.jsx';
import { CATEGORIES } from '../data/categories.js';
import Icon from '../components/Icon.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { costoTotalReceta, precioSugerido, gananciaTotal, formatoMoneda } from '../lib/calc.js';

const PRESUPUESTOS = [30, 50, 100, 200, 500];
const CANALES = [
  { id: 'whatsapp', label: 'WhatsApp', icon: 'share' },
  { id: 'vecindario', label: 'Vecindario', icon: 'home' },
  { id: 'trabajo', label: 'Trabajo', icon: 'folder' },
  { id: 'escuela', label: 'Escuela', icon: 'book' },
  { id: 'eventos', label: 'Eventos', icon: 'sparkles' },
  { id: 'delivery', label: 'Delivery', icon: 'cart' },
];

export default function IncomeCenter() {
  const { recetasPublicadas } = useStore();
  const [presupuesto, setPresupuesto] = useState(50);
  const [categoria, setCategoria] = useState('');
  const [canal, setCanal] = useState('whatsapp');
  const [buscado, setBuscado] = useState(false);

  const sugerencias = useMemo(() => {
    return recetasPublicadas
      .filter((r) => (categoria ? r.categoria === categoria : true))
      .filter((r) => costoTotalReceta(r) <= Number(presupuesto))
      .sort((a, b) => gananciaTotal(b) - gananciaTotal(a))
      .slice(0, 6);
  }, [recetasPublicadas, categoria, presupuesto]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-ink">Central de Rendimiento</h1>
        <p className="mt-1 text-sm text-ink/50">Descubrí las mejores recetas para tu objetivo de venta.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <div className="card p-5">
            <p className="label mb-3">1. ¿Cuánto tenés para empezar?</p>
            <div className="flex flex-wrap gap-2">
              {PRESUPUESTOS.map((p) => (
                <button
                  key={p}
                  onClick={() => setPresupuesto(p)}
                  className={`pill ${Number(presupuesto) === p ? 'pill-active' : ''}`}
                >
                  ${p}
                </button>
              ))}
              <input
                type="number"
                min="0"
                value={PRESUPUESTOS.includes(Number(presupuesto)) ? '' : presupuesto}
                onChange={(e) => setPresupuesto(e.target.value)}
                placeholder="Otro valor"
                className="input w-32"
              />
            </div>
          </div>

          <div className="card p-5">
            <p className="label mb-3">2. ¿Qué querés producir?</p>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => setCategoria('')} className={`pill ${!categoria ? 'pill-active' : ''}`}>
                Todas
              </button>
              {CATEGORIES.map((c) => (
                <button
                  key={c.slug}
                  onClick={() => setCategoria(c.slug)}
                  className={`pill ${categoria === c.slug ? 'pill-active' : ''}`}
                >
                  <span>{c.icon}</span> {c.name}
                </button>
              ))}
            </div>
          </div>

          <div className="card p-5">
            <p className="label mb-3">3. ¿Dónde pensás vender?</p>
            <div className="flex flex-wrap gap-2">
              {CANALES.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCanal(c.id)}
                  className={`pill ${canal === c.id ? 'pill-active' : ''}`}
                >
                  <Icon name={c.icon} className="w-4 h-4" /> {c.label}
                </button>
              ))}
            </div>
          </div>

          <button onClick={() => setBuscado(true)} className="btn-primary w-full justify-center py-3 sm:w-auto">
            Ver sugerencias de recetas
          </button>
        </div>

        <div className="lg:col-span-1">
          <div className="card p-5">
            <p className="mb-3 text-sm font-bold text-ink">Sugerencias para vos</p>
            {!buscado ? (
              <p className="text-sm text-ink/45">Completá los pasos y tocá "Ver sugerencias" para ver recomendaciones.</p>
            ) : sugerencias.length === 0 ? (
              <EmptyState
                icon="scale"
                title="Sin resultados"
                description="Probá con un presupuesto mayor o cambiá de categoría."
              />
            ) : (
              <div className="space-y-3">
                {sugerencias.map((r) => (
                  <Link
                    key={r.id}
                    to={`/recetas/${r.slug}`}
                    className="flex gap-3 rounded-xl border border-black/5 p-2.5 transition hover:border-brand-200 hover:bg-brand-50/40"
                  >
                    <img src={r.imagen} alt={r.nombre} className="h-16 w-16 shrink-0 rounded-lg object-cover" />
                    <div className="min-w-0 flex-1 text-xs">
                      <p className="truncate text-sm font-bold text-ink">{r.nombre}</p>
                      <p className="mt-1 text-ink/50">Costo: {formatoMoneda(costoTotalReceta(r))}</p>
                      <p className="text-ink/50">Rendimiento: {r.rendimientoBase} {r.unidadRendimiento}</p>
                      <p className="text-ink/50">Precio sugerido: {formatoMoneda(precioSugerido(r))}</p>
                      <p className="font-semibold text-emerald-600">Ganancia estimada: {formatoMoneda(gananciaTotal(r))}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
