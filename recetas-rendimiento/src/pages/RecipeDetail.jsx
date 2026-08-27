import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useStore } from '../lib/StoreContext.jsx';
import { categoryBySlug } from '../data/categories.js';
import Icon from '../components/Icon.jsx';
import RecipeCard from '../components/RecipeCard.jsx';
import EmptyState from '../components/EmptyState.jsx';
import ToolsBar from '../components/ToolsBar.jsx';
import CentralRendimiento from '../components/CentralRendimiento.jsx';
import AddToCollectionModal from '../components/AddToCollectionModal.jsx';
import {
  costoIngredientes,
  costoEmpaque,
  otrosCostos,
  costoTotalReceta,
  costoPorUnidad,
  precioSugerido,
  gananciaPorUnidad,
  gananciaTotal,
  facturacionTotal,
  escalarReceta,
  agruparIngredientes,
  formatoMoneda,
  formatoTiempo,
  formatoCantidad,
} from '../lib/calc.js';

const TABS = [
  'Ingredientes',
  'Modo de preparación',
  'Consejos',
  'Conservación',
  'Equipamiento',
  'Información',
];

export default function RecipeDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { recetasPublicadas, favoritos, alternarFavorito, agregarAListaCompras } = useStore();
  const receta = recetasPublicadas.find((r) => r.slug === slug);

  const [tab, setTab] = useState('Ingredientes');
  const [modalColeccion, setModalColeccion] = useState(false);
  const [copiado, setCopiado] = useState(false);
  const [agregado, setAgregado] = useState(false);
  const [rendimiento, setRendimiento] = useState(receta?.rendimientoBase ?? 1);

  // El store carga de forma asíncrona: cuando llega la receta (o cambia),
  // el rendimiento vuelve a su valor base.
  useEffect(() => {
    if (receta) setRendimiento(receta.rendimientoBase);
  }, [receta?.id, receta?.rendimientoBase]);

  // Toda la ficha (ingredientes, empaque y otros costos) se recalcula al ajustar
  // el rendimiento.
  const escalada = useMemo(
    () => (receta ? escalarReceta(receta, rendimiento) : null),
    [receta, rendimiento]
  );
  const grupos = useMemo(
    () => (escalada ? agruparIngredientes(escalada.ingredientes) : []),
    [escalada]
  );

  if (!receta) {
    return (
      <EmptyState
        icon="book"
        title="Receta no encontrada"
        description="Puede que haya sido eliminada o despublicada."
        action={<Link to="/recetas" className="btn-primary">Volver a recetas</Link>}
      />
    );
  }

  const cat = categoryBySlug(receta.categoria);
  const esFavorito = favoritos.includes(receta.id);
  const unidad = receta.unidadRendimiento;
  const unidadSingular = unidad.replace(/s$/, '');
  const relacionadas = recetasPublicadas
    .filter((r) => r.categoria === receta.categoria && r.id !== receta.id)
    .slice(0, 4);

  function compartir() {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({ title: receta.nombre, url }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(url);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 1800);
    }
  }

  function agregarTodo() {
    agregarAListaCompras(
      escalada.ingredientes.map((i) => ({
        nombre: i.nombre,
        cantidad: `${formatoCantidad(i.cantidad)} ${i.unidad}`,
        origen: receta.nombre,
      }))
    );
    setAgregado(true);
    setTimeout(() => setAgregado(false), 1800);
  }

  return (
    <div className="space-y-5">
      {/* 1. Barra superior de herramientas */}
      <ToolsBar />

      {/* Ficha de receta (izquierda) + Central de Rendimiento (derecha) */}
      <div className="grid gap-5 xl:grid-cols-2">
        <div className="space-y-4">
          {/* 2. Cabecera: imagen + datos */}
          <div className="card overflow-hidden">
            <div className="grid gap-0 sm:grid-cols-[minmax(0,44%)_1fr]">
              <div className="relative min-h-[190px] bg-brand-50">
                <img src={receta.imagen} alt={receta.nombre} className="h-full w-full object-cover" />
                <button
                  onClick={() => navigate(-1)}
                  className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-lg bg-white/95 px-2.5 py-1.5 text-[11.5px] font-semibold text-ink shadow-soft backdrop-blur transition hover:bg-white"
                >
                  <Icon name="chevronLeft" className="w-3.5 h-3.5" /> Volver
                </button>
              </div>

              <div className="flex flex-col justify-center gap-2.5 p-4">
                <h1 className="text-[20px] font-extrabold leading-tight tracking-tight text-ink">
                  {receta.nombre}
                </h1>

                <p className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[11.5px] font-medium text-ink/50">
                  <span>{cat?.name}</span>
                  <span className="text-ink/25">·</span>
                  <span>{receta.dificultad}</span>
                  <span className="text-ink/25">·</span>
                  <span>{formatoTiempo(receta.tiempoMinutos)}</span>
                  <span className="text-ink/25">·</span>
                  <span>Rinde {rendimiento} {unidad}</span>
                </p>

                <p className="text-[11.5px] leading-relaxed text-ink/60">{receta.descripcion}</p>

                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => alternarFavorito(receta.id)}
                    className={`${esFavorito ? 'btn-primary' : 'btn-secondary'} !px-2.5 !py-1.5 !text-[11.5px]`}
                  >
                    <Icon name="heart" className="w-3.5 h-3.5" filled={esFavorito} />
                    {esFavorito ? 'En favoritos' : 'Favorito'}
                  </button>
                  <button onClick={() => setModalColeccion(true)} className="btn-secondary !px-2.5 !py-1.5 !text-[11.5px]">
                    <Icon name="folder" className="w-3.5 h-3.5" /> Agregar a lista
                  </button>
                  <button onClick={compartir} className="btn-secondary !px-2.5 !py-1.5 !text-[11.5px]">
                    <Icon name="share" className="w-3.5 h-3.5" /> {copiado ? 'Copiado' : 'Compartir'}
                  </button>
                </div>

                {/* Ajustar rendimiento */}
                <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-line bg-cream/60 p-2.5">
                  <div className="min-w-[120px] flex-1">
                    <p className="text-[11.5px] font-bold text-ink">Ajustar rendimiento</p>
                    <p className="mt-0.5 text-[10px] leading-snug text-ink/45">
                      Ingredientes ajustados automáticamente
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1.5">
                    <button
                      onClick={() => setRendimiento((v) => Math.max(1, v - 1))}
                      className="flex h-7 w-7 items-center justify-center rounded-lg border border-line bg-white text-ink/60 transition hover:bg-brand-50 hover:text-brand-600"
                      aria-label="Reducir rendimiento"
                    >
                      <Icon name="minus" className="w-3.5 h-3.5" />
                    </button>
                    <span className="min-w-[72px] text-center text-[11.5px] font-bold text-ink">
                      {rendimiento} <span className="font-medium text-ink/45">{unidad}</span>
                    </span>
                    <button
                      onClick={() => setRendimiento((v) => v + 1)}
                      className="flex h-7 w-7 items-center justify-center rounded-lg border border-line bg-white text-ink/60 transition hover:bg-brand-50 hover:text-brand-600"
                      aria-label="Aumentar rendimiento"
                    >
                      <Icon name="plus" className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Pestañas */}
          <div className="flex flex-wrap gap-x-1 border-b border-line">
            {TABS.map((x) => (
              <button
                key={x}
                onClick={() => setTab(x)}
                className={`shrink-0 border-b-2 px-3 pb-2.5 text-[11.5px] font-semibold transition ${
                  tab === x ? 'border-brand-500 text-brand-600' : 'border-transparent text-ink/45 hover:text-ink'
                }`}
              >
                {x}
              </button>
            ))}
          </div>

          {/* 4/5/6. Contenido de la pestaña + costos */}
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              {tab === 'Ingredientes' && (
                <div className="space-y-3.5">
                  {grupos.map(([grupo, items]) => (
                    <div key={grupo}>
                      <p className="mb-1 text-[12px] font-extrabold text-ink">{grupo}</p>
                      <ul>
                        {items.map((i, idx) => (
                          <li
                            key={`${grupo}-${idx}`}
                            className="flex items-center gap-2 border-b border-line/70 py-1.5 text-[11.5px] last:border-0"
                          >
                            <span className="h-1.5 w-1.5 shrink-0 rounded-full border border-brand-300" />
                            <span className="flex-1 text-ink/75">{i.nombre}</span>
                            <span className="shrink-0 font-semibold text-ink/55">
                              {formatoCantidad(i.cantidad)} {i.unidad}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                  <button onClick={agregarTodo} className="btn-primary w-full justify-center !py-2 !text-[11.5px]">
                    <Icon name="cart" className="w-3.5 h-3.5" />
                    {agregado ? '¡Agregado a la lista!' : 'Agregar todo a la lista'}
                  </button>
                </div>
              )}

              {tab === 'Modo de preparación' && (
                <ol className="space-y-2.5">
                  {receta.pasos.map((paso, idx) => (
                    <li key={idx} className="flex gap-2 text-[11.5px] leading-relaxed text-ink/70">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-500 text-[9.5px] font-bold text-white">
                        {idx + 1}
                      </span>
                      <p>{paso}</p>
                    </li>
                  ))}
                </ol>
              )}

              {tab === 'Consejos' &&
                (receta.consejos?.length ? (
                  <ul className="space-y-2">
                    {receta.consejos.map((c, idx) => (
                      <li key={idx} className="flex gap-2 text-[11.5px] leading-relaxed text-ink/70">
                        <Icon name="sparkles" className="mt-0.5 w-3.5 h-3.5 shrink-0 text-brand-500" /> {c}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-[11.5px] text-ink/45">Esta receta todavía no tiene consejos cargados.</p>
                ))}

              {tab === 'Conservación' && (
                <p className="text-[11.5px] leading-relaxed text-ink/70">{receta.conservacion}</p>
              )}

              {tab === 'Equipamiento' && (
                <p className="text-[11.5px] leading-relaxed text-ink/70">
                  Utensilios básicos de cocina: bol, batidor o batidora, balanza, espátula y los moldes o
                  recipientes indicados en el modo de preparación.
                </p>
              )}

              {tab === 'Información' && (
                <dl className="divide-y divide-line/70 text-[11.5px]">
                  {[
                    ['Categoría', cat?.name],
                    ['Dificultad', receta.dificultad],
                    ['Tiempo total', formatoTiempo(receta.tiempoMinutos)],
                    ['Rendimiento base', `${receta.rendimientoBase} ${unidad}`],
                    ['Margen sugerido', `${receta.margenSugerido}%`],
                    ['Ideal para vender', receta.paraVender ? 'Sí' : 'No'],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between py-1.5">
                      <dt className="text-ink/50">{k}</dt>
                      <dd className="font-semibold text-ink/80">{v}</dd>
                    </div>
                  ))}
                </dl>
              )}
            </div>

            {/* 5. Resumen de costos + 6. Precio sugerido */}
            <div className="space-y-3.5">
              <div className="card p-4">
                <p className="mb-2.5 text-[12px] font-extrabold text-ink">Resumen de costos</p>
                <dl className="space-y-1.5 text-[11.5px]">
                  <Fila k="Costo total de ingredientes" v={formatoMoneda(costoIngredientes(escalada.ingredientes))} />
                  <Fila k={`Costo por ${unidadSingular}`} v={formatoMoneda(costoPorUnidad(escalada))} acento />
                  <Fila k="Costo de embalaje" v={formatoMoneda(costoEmpaque(escalada))} />
                  <Fila k="Otros costos" v={formatoMoneda(otrosCostos(escalada))} />
                  <div className="mt-1 border-t border-line pt-2">
                    <Fila k="Costo total de la receta" v={formatoMoneda(costoTotalReceta(escalada))} fuerte />
                  </div>
                </dl>
              </div>

              <div className="card p-4">
                <p className="mb-2.5 text-[12px] font-extrabold text-ink">Precio sugerido</p>
                <dl className="space-y-1.5 text-[11.5px]">
                  <Fila k={`Precio por ${unidadSingular}`} v={formatoMoneda(costoPorUnidad(escalada))} />
                  <Fila
                    k={`Margen de ganancia (${receta.margenSugerido}%)`}
                    v={formatoMoneda(gananciaPorUnidad(escalada))}
                    positivo
                  />
                  <Fila k="Precio sugerido de venta" v={formatoMoneda(precioSugerido(escalada))} fuerte />
                  <Fila k={`Facturación (${rendimiento} ${unidad})`} v={formatoMoneda(facturacionTotal(escalada))} />
                  <Fila k="Ganancia estimada" v={formatoMoneda(gananciaTotal(escalada))} positivo />
                </dl>
                <Link
                  to="/calculadoras/precios"
                  className="btn-primary mt-3 w-full justify-center !py-2 !text-[11.5px]"
                >
                  Ver cálculos detallados
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* 7/8/9. Central de Rendimiento */}
        <CentralRendimiento layout="columna" />
      </div>

      {relacionadas.length > 0 && (
        <div>
          <p className="mb-3 text-[15px] font-extrabold tracking-tight text-ink">Recetas relacionadas</p>
          <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-4">
            {relacionadas.map((r) => (
              <RecipeCard key={r.id} receta={r} />
            ))}
          </div>
        </div>
      )}

      {modalColeccion && <AddToCollectionModal recetaId={receta.id} onClose={() => setModalColeccion(false)} />}
    </div>
  );
}

function Fila({ k, v, fuerte, positivo, acento }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-ink/50">{k}</dt>
      <dd
        className={
          fuerte
            ? 'text-[13px] font-extrabold text-ink'
            : positivo
              ? 'font-bold text-emerald-600'
              : acento
                ? 'font-bold text-brand-600'
                : 'font-semibold text-ink/75'
        }
      >
        {v}
      </dd>
    </div>
  );
}
