import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useStore } from '../lib/StoreContext.jsx';
import { categoryBySlug } from '../data/categories.js';
import Icon from '../components/Icon.jsx';
import RecipeCard from '../components/RecipeCard.jsx';
import EmptyState from '../components/EmptyState.jsx';
import AddToCollectionModal from '../components/AddToCollectionModal.jsx';
import {
  costoIngredientes,
  costoTotalReceta,
  costoPorUnidad,
  precioSugerido,
  gananciaPorUnidad,
  facturacionTotal,
  escalarIngredientes,
  formatoMoneda,
  formatoTiempo,
  formatoCantidad,
} from '../lib/calc.js';

const TABS = ['Ingredientes', 'Modo de preparación', 'Consejos', 'Conservación', 'Equipamiento', 'Información'];

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

  const ingredientes = useMemo(
    () => (receta ? escalarIngredientes(receta, rendimiento) : []),
    [receta, rendimiento]
  );
  const escalada = useMemo(
    () => (receta ? { ...receta, ingredientes, rendimientoBase: rendimiento } : null),
    [receta, ingredientes, rendimiento]
  );

  // Los ingredientes se agrupan si traen `grupo`; si no, van en un solo bloque.
  const grupos = useMemo(() => {
    const mapa = new Map();
    for (const i of ingredientes) {
      const g = i.grupo || 'Ingredientes';
      if (!mapa.has(g)) mapa.set(g, []);
      mapa.get(g).push(i);
    }
    return [...mapa.entries()];
  }, [ingredientes]);

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
  const unidadSingular = receta.unidadRendimiento.replace(/s$/, '');
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
      ingredientes.map((i) => ({
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
      {/* Fila 1 — imagen a la izquierda, información a la derecha */}
      <div className="grid gap-5 lg:grid-cols-2">
        <div className="relative overflow-hidden rounded-2xl bg-brand-50">
          <img src={receta.imagen} alt={receta.nombre} className="h-full min-h-[280px] w-full object-cover" />
          <button
            onClick={() => navigate(-1)}
            className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-lg bg-white/95 px-3 py-1.5 text-[12px] font-semibold text-ink shadow-soft backdrop-blur transition hover:bg-white"
          >
            <Icon name="chevronLeft" className="w-3.5 h-3.5" /> Volver
          </button>
        </div>

        <div className="flex flex-col justify-center gap-3">
          <h1 className="text-[26px] font-extrabold leading-tight tracking-tight text-ink sm:text-[30px]">
            {receta.nombre}
          </h1>

          <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[12.5px] font-medium text-ink/50">
            <span>{cat?.name}</span>
            <span className="text-ink/25">·</span>
            <span>{receta.dificultad}</span>
            <span className="text-ink/25">·</span>
            <span>{formatoTiempo(receta.tiempoMinutos)}</span>
            <span className="text-ink/25">·</span>
            <span>Rinde {receta.rendimientoBase} {receta.unidadRendimiento}</span>
          </p>

          <p className="text-[13px] leading-relaxed text-ink/60">{receta.descripcion}</p>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => alternarFavorito(receta.id)}
              className={esFavorito ? 'btn-primary !py-2 !text-[12.5px]' : 'btn-secondary !py-2 !text-[12.5px]'}
            >
              <Icon name="heart" className="w-4 h-4" filled={esFavorito} />
              {esFavorito ? 'En favoritos' : 'Favorito'}
            </button>
            <button onClick={() => setModalColeccion(true)} className="btn-secondary !py-2 !text-[12.5px]">
              <Icon name="folder" className="w-4 h-4" /> Agregar a lista
            </button>
            <button onClick={compartir} className="btn-secondary !py-2 !text-[12.5px]">
              <Icon name="share" className="w-4 h-4" /> {copiado ? 'Enlace copiado' : 'Compartir'}
            </button>
          </div>

          <div className="card flex items-center justify-between gap-3 p-3.5">
            <div className="min-w-0">
              <p className="text-[13px] font-bold text-ink">Ajustar rendimiento</p>
              <p className="mt-0.5 text-[11px] text-ink/45">Ingredientes ajustados automáticamente</p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <button
                onClick={() => setRendimiento((v) => Math.max(1, v - 1))}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-line text-ink/60 transition hover:bg-brand-50 hover:text-brand-600"
                aria-label="Reducir rendimiento"
              >
                <Icon name="minus" className="w-4 h-4" />
              </button>
              <span className="min-w-[86px] text-center text-[13px] font-bold text-ink">
                {rendimiento} <span className="font-medium text-ink/45">{receta.unidadRendimiento}</span>
              </span>
              <button
                onClick={() => setRendimiento((v) => v + 1)}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-line text-ink/60 transition hover:bg-brand-50 hover:text-brand-600"
                aria-label="Aumentar rendimiento"
              >
                <Icon name="plus" className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Fila 2 — pestañas */}
      <div className="scroll-x flex gap-1 border-b border-line">
        {TABS.map((x) => (
          <button
            key={x}
            onClick={() => setTab(x)}
            className={`shrink-0 border-b-2 px-3.5 pb-2.5 pt-1 text-[12.5px] font-semibold transition ${
              tab === x ? 'border-brand-500 text-brand-600' : 'border-transparent text-ink/45 hover:text-ink'
            }`}
          >
            {x}
          </button>
        ))}
      </div>

      {/* Fila 3 — contenido de la pestaña + costos a la derecha */}
      <div className="grid gap-5 lg:grid-cols-2">
        <div>
          {tab === 'Ingredientes' && (
            <div className="space-y-4">
              {grupos.map(([grupo, items]) => (
                <div key={grupo}>
                  <p className="mb-1.5 text-[13px] font-extrabold text-ink">{grupo}</p>
                  <ul>
                    {items.map((i, idx) => (
                      <li
                        key={idx}
                        className="flex items-center gap-2 border-b border-line/70 py-2 text-[12.5px] last:border-0"
                      >
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full border border-brand-300" />
                        <span className="flex-1 text-ink/75">{i.nombre}</span>
                        <span className="font-semibold text-ink/55">
                          {formatoCantidad(i.cantidad)} {i.unidad}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              <button onClick={agregarTodo} className="btn-primary !py-2 !text-[12.5px]">
                <Icon name="cart" className="w-4 h-4" />
                {agregado ? '¡Agregado a la lista!' : 'Agregar todo a la lista de compras'}
              </button>
            </div>
          )}

          {tab === 'Modo de preparación' && (
            <ol className="space-y-3">
              {receta.pasos.map((paso, idx) => (
                <li key={idx} className="flex gap-2.5 text-[12.5px] leading-relaxed text-ink/70">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-500 text-[10px] font-bold text-white">
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
                  <li key={idx} className="flex gap-2 text-[12.5px] leading-relaxed text-ink/70">
                    <Icon name="sparkles" className="mt-0.5 w-4 h-4 shrink-0 text-brand-500" /> {c}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[12.5px] text-ink/45">Esta receta todavía no tiene consejos cargados.</p>
            ))}

          {tab === 'Conservación' && (
            <p className="text-[12.5px] leading-relaxed text-ink/70">{receta.conservacion}</p>
          )}

          {tab === 'Equipamiento' && (
            <p className="text-[12.5px] leading-relaxed text-ink/70">
              Utensilios básicos de cocina: bol, batidor o batidora, balanza, y los moldes o recipientes
              indicados en el modo de preparación.
            </p>
          )}

          {tab === 'Información' && (
            <dl className="divide-y divide-line/70 text-[12.5px]">
              {[
                ['Categoría', cat?.name],
                ['Dificultad', receta.dificultad],
                ['Tiempo total', formatoTiempo(receta.tiempoMinutos)],
                ['Rendimiento base', `${receta.rendimientoBase} ${receta.unidadRendimiento}`],
                ['Margen sugerido', `${receta.margenSugerido}%`],
                ['Ideal para vender', receta.paraVender ? 'Sí' : 'No'],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between py-2">
                  <dt className="text-ink/50">{k}</dt>
                  <dd className="font-semibold text-ink/80">{v}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>

        {/* Costos — siempre visibles a la derecha, igual que la referencia */}
        <div className="space-y-4">
          <div className="card p-5">
            <p className="mb-3 text-[13px] font-extrabold text-ink">Resumen de costos</p>
            <dl className="space-y-2 text-[12.5px]">
              <Fila k="Costo total de ingredientes" v={formatoMoneda(costoIngredientes(ingredientes))} />
              <Fila k={`Costo por ${unidadSingular}`} v={formatoMoneda(costoPorUnidad(escalada))} acento />
              <Fila k="Otros costos" v={formatoMoneda(escalada.costosExtra)} />
              <div className="border-t border-line pt-2">
                <Fila k="Costo total de la receta" v={formatoMoneda(costoTotalReceta(escalada))} fuerte />
              </div>
            </dl>
          </div>

          <div className="card p-5">
            <p className="mb-3 text-[13px] font-extrabold text-ink">Precio sugerido</p>
            <dl className="space-y-2 text-[12.5px]">
              <Fila k={`Precio por ${unidadSingular}`} v={formatoMoneda(precioSugerido(escalada))} fuerte />
              <Fila k={`Margen de ganancia (${receta.margenSugerido}%)`} v={formatoMoneda(gananciaPorUnidad(escalada))} positivo />
              <Fila k={`Facturación (${rendimiento} ${receta.unidadRendimiento})`} v={formatoMoneda(facturacionTotal(escalada))} />
            </dl>
            <Link to="/calculadoras/precios" className="btn-primary mt-4 w-full justify-center !py-2.5 !text-[12.5px]">
              Ver cálculos detallados
            </Link>
          </div>

          {receta.paraVender && (
            <div className="flex items-start gap-2.5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
              <Icon name="bolt" className="mt-0.5 w-4 h-4 shrink-0 text-emerald-600" />
              <p className="text-[12px] leading-snug text-emerald-800">
                Esta receta es ideal para vender: buen margen y alta demanda.
              </p>
            </div>
          )}
        </div>
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
            ? 'text-[14px] font-extrabold text-ink'
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
