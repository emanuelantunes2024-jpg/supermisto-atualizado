import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from './Icon.jsx';
import { useStore } from '../lib/StoreContext.jsx';
import {
  costoTotalReceta,
  precioSugerido,
  facturacionTotal,
  gananciaTotal,
  formatoMoneda,
} from '../lib/calc.js';

const PRESUPUESTOS = [30, 50, 100, 200, 500];

const CANALES = [
  { id: 'whatsapp', label: 'WhatsApp', icon: 'chat', tono: 'bg-emerald-50 text-emerald-500' },
  { id: 'vecindario', label: 'Vecindario', icon: 'home', tono: 'bg-orange-50 text-orange-500' },
  { id: 'trabajo', label: 'Trabajo', icon: 'box', tono: 'bg-sky-50 text-sky-500' },
  { id: 'escuela', label: 'Escuela', icon: 'book', tono: 'bg-violet-50 text-violet-500' },
  { id: 'eventos', label: 'Eventos', icon: 'sparkles', tono: 'bg-pink-50 text-pink-500' },
  { id: 'delivery', label: 'Delivery', icon: 'cart', tono: 'bg-rose-50 text-rose-400' },
];

const TONOS_CATEGORIA = [
  'bg-violet-50 text-violet-500',
  'bg-orange-50 text-orange-500',
  'bg-pink-50 text-pink-500',
  'bg-rose-50 text-rose-400',
  'bg-amber-50 text-amber-500',
  'bg-sky-50 text-sky-500',
  'bg-emerald-50 text-emerald-500',
];

/** Botón cuadrado con icono arriba y etiqueta abajo (pasos 2 y 3 de la referencia). */
function Tile({ activo, icono, emoji, tono, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1.5 rounded-xl border px-1.5 py-2.5 transition ${
        activo ? 'border-brand-500 bg-brand-50' : 'border-line bg-white hover:border-brand-200'
      }`}
    >
      <span className={`flex h-9 w-9 items-center justify-center rounded-lg text-[15px] ${tono}`}>
        {icono ? <Icon name={icono} className="w-[18px] h-[18px]" /> : emoji}
      </span>
      <span className={`text-center text-[10.5px] font-semibold leading-tight ${activo ? 'text-brand-600' : 'text-ink/60'}`}>
        {label}
      </span>
    </button>
  );
}

export default function CentralRendimiento({ layout = 'ancho', conEncabezado = true }) {
  const { recetasPublicadas, categorias } = useStore();
  const [presupuesto, setPresupuesto] = useState(50);
  const [otroValor, setOtroValor] = useState('');
  const [categoria, setCategoria] = useState('');
  const [canal, setCanal] = useState('whatsapp');
  const [buscado, setBuscado] = useState(false);

  const sugerencias = useMemo(() => {
    if (!buscado) return [];
    return recetasPublicadas
      .filter((r) => (categoria ? r.categoria === categoria : true))
      .filter((r) => costoTotalReceta(r) <= Number(presupuesto))
      .sort((a, b) => gananciaTotal(b) - gananciaTotal(a))
      .slice(0, 6);
  }, [buscado, recetasPublicadas, categoria, presupuesto]);

  const ancho = layout === 'ancho';

  const preguntas = (
    <div className="space-y-3.5">
      <div className="card p-4">
        <p className="mb-2.5 text-[12.5px] font-bold text-ink">1. ¿Cuánto tenés para empezar?</p>
        <div className="flex flex-wrap gap-2">
          {PRESUPUESTOS.map((p) => (
            <button
              key={p}
              onClick={() => {
                setPresupuesto(p);
                setOtroValor('');
              }}
              className={`rounded-lg border px-3 py-1.5 text-[12px] font-semibold transition ${
                Number(presupuesto) === p && !otroValor
                  ? 'border-brand-500 bg-brand-50 text-brand-600'
                  : 'border-line bg-white text-ink/60 hover:border-brand-200'
              }`}
            >
              ${p}
            </button>
          ))}
          <input
            type="number"
            min="0"
            value={otroValor}
            onChange={(e) => {
              setOtroValor(e.target.value);
              if (e.target.value) setPresupuesto(e.target.value);
            }}
            placeholder="Otro valor"
            className="w-[104px] rounded-lg border border-line px-2.5 py-1.5 text-[12px] text-ink placeholder:text-ink/40 focus:border-brand-400 focus:outline-none"
          />
        </div>
      </div>

      <div className="card p-4">
        <p className="mb-2.5 text-[12.5px] font-bold text-ink">2. ¿Qué querés producir?</p>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          <Tile
            activo={!categoria}
            icono="grid"
            tono="bg-black/5 text-ink/60"
            label="Todas"
            onClick={() => setCategoria('')}
          />
          {categorias.map((c, i) => (
            <Tile
              key={c.slug}
              activo={categoria === c.slug}
              emoji={c.icon}
              tono={TONOS_CATEGORIA[i % TONOS_CATEGORIA.length]}
              label={c.name}
              onClick={() => setCategoria(c.slug)}
            />
          ))}
        </div>
      </div>

      <div className="card p-4">
        <p className="mb-2.5 text-[12.5px] font-bold text-ink">3. ¿Dónde pensás vender?</p>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
          {CANALES.map((c) => (
            <Tile
              key={c.id}
              activo={canal === c.id}
              icono={c.icon}
              tono={c.tono}
              label={c.label}
              onClick={() => setCanal(c.id)}
            />
          ))}
        </div>
      </div>

      <button onClick={() => setBuscado(true)} className="btn-primary w-full justify-center !py-2.5 !text-[12.5px]">
        Ver sugerencias de recetas
      </button>
    </div>
  );

  const panelSugerencias = (
    <div className="card p-4">
      <p className="mb-3 text-[12.5px] font-bold text-ink">Sugerencias para vos</p>

      {!buscado ? (
        <p className="text-[11.5px] leading-relaxed text-ink/45">
          Elegí tu presupuesto, qué querés producir y dónde vender. Después tocá
          «Ver sugerencias de recetas».
        </p>
      ) : sugerencias.length === 0 ? (
        <p className="text-[11.5px] leading-relaxed text-ink/45">
          Ninguna receta entra en ${presupuesto}. Probá con un presupuesto mayor o con otra categoría.
        </p>
      ) : (
        <>
          <div className="space-y-2.5">
            {sugerencias.map((r) => (
              <Link
                key={r.id}
                to={`/recetas/${r.slug}`}
                className="flex gap-2.5 rounded-xl border border-line p-2.5 transition hover:border-brand-200 hover:bg-brand-50/40"
              >
                <img src={r.imagen} alt="" className="h-[70px] w-[70px] shrink-0 rounded-lg object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[12.5px] font-bold text-ink">{r.nombre}</p>
                  <dl className="mt-1 space-y-[3px] text-[10.5px]">
                    <Dato k="Costo" v={formatoMoneda(costoTotalReceta(r))} />
                    <Dato k="Rendimiento" v={`${r.rendimientoBase} ${r.unidadRendimiento}`} />
                    <Dato k="Precio sugerido" v={`${formatoMoneda(precioSugerido(r))} un`} />
                    <Dato k="Facturación" v={formatoMoneda(facturacionTotal(r))} />
                    <Dato k="Ganancia estimada" v={formatoMoneda(gananciaTotal(r))} positivo />
                  </dl>
                </div>
              </Link>
            ))}
          </div>
          <Link
            to="/vender"
            className="btn-secondary mt-3 w-full justify-center !py-2 !text-[12px]"
          >
            Ver más sugerencias
          </Link>
        </>
      )}
    </div>
  );

  return (
    <section id="objetivos" className="space-y-3.5">
      {conEncabezado && (
        <div>
          <h2 className="text-[17px] font-extrabold tracking-tight text-ink">Central de Rendimiento</h2>
          <p className="mt-0.5 text-[12px] text-ink/50">
            Descubrí las mejores recetas para tu objetivo
          </p>
        </div>
      )}

      {ancho ? (
        <div className="grid gap-3.5 lg:grid-cols-[1fr_300px]">
          {preguntas}
          {panelSugerencias}
        </div>
      ) : (
        <div className="space-y-3.5">
          {preguntas}
          {panelSugerencias}
        </div>
      )}
    </section>
  );
}

function Dato({ k, v, positivo }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <dt className="text-ink/45">{k}:</dt>
      <dd className={positivo ? 'font-bold text-emerald-600' : 'font-semibold text-ink/70'}>{v}</dd>
    </div>
  );
}
