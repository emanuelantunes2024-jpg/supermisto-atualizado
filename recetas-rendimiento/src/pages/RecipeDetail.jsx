import { useMemo, useState } from 'react';
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
  gananciaTotal,
  escalarIngredientes,
  formatoMoneda,
  formatoTiempo,
  formatoCantidad,
} from '../lib/calc.js';

const TABS = ['Ingredientes', 'Preparación', 'Consejos', 'Conservación'];

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

  const ingredientesEscalados = useMemo(
    () => (receta ? escalarIngredientes(receta, rendimiento) : []),
    [receta, rendimiento]
  );
  const recetaEscalada = useMemo(
    () => (receta ? { ...receta, ingredientes: ingredientesEscalados, rendimientoBase: rendimiento } : null),
    [receta, ingredientesEscalados, rendimiento]
  );

  if (!receta) {
    return (
      <EmptyState
        icon="book"
        title="Receta no encontrada"
        description="Puede que haya sido eliminada o despublicada."
        action={
          <Link to="/recetas" className="btn-primary">
            Volver a recetas
          </Link>
        }
      />
    );
  }

  const cat = categoryBySlug(receta.categoria);
  const esFavorito = favoritos.includes(receta.id);
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

  function agregarIngredientesALista() {
    agregarAListaCompras(
      ingredientesEscalados.map((i) => ({
        nombre: i.nombre,
        cantidad: `${formatoCantidad(i.cantidad)} ${i.unidad}`,
        origen: receta.nombre,
      }))
    );
    setAgregado(true);
    setTimeout(() => setAgregado(false), 1800);
  }

  return (
    <div className="space-y-8">
      <button onClick={() => navigate(-1)} className="btn-ghost -ml-3">
        <Icon name="chevronLeft" className="w-4 h-4" /> Volver
      </button>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Columna principal */}
        <div className="space-y-6 lg:col-span-2">
          <div className="overflow-hidden rounded-2xl">
            <img src={receta.imagen} alt={receta.nombre} className="aspect-[16/10] w-full object-cover" />
          </div>

          <div>
            <p className="text-sm font-semibold text-brand-600">{cat?.name}</p>
            <h1 className="mt-1 text-2xl font-extrabold text-ink sm:text-3xl">{receta.nombre}</h1>
            <p className="mt-2 text-sm text-ink/60">{receta.descripcion}</p>

            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-ink/60">
              <span className="flex items-center gap-1.5">
                <Icon name="clock" className="w-4 h-4" /> {formatoTiempo(receta.tiempoMinutos)}
              </span>
              <span className="flex items-center gap-1.5">
                <Icon name="star" className="w-4 h-4" /> {receta.dificultad}
              </span>
              <span className="flex items-center gap-1.5">
                <Icon name="scale" className="w-4 h-4" /> Rinde {receta.rendimientoBase} {receta.unidadRendimiento}
              </span>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <button onClick={() => alternarFavorito(receta.id)} className={esFavorito ? 'btn-primary' : 'btn-secondary'}>
                <Icon name="heart" className="w-4 h-4" filled={esFavorito} /> {esFavorito ? 'En favoritos' : 'Favorito'}
              </button>
              <button onClick={() => setModalColeccion(true)} className="btn-secondary">
                <Icon name="folder" className="w-4 h-4" /> Colección
              </button>
              <button onClick={compartir} className="btn-secondary">
                <Icon name="share" className="w-4 h-4" /> {copiado ? 'Enlace copiado' : 'Compartir'}
              </button>
            </div>
          </div>

          {/* Ajustar rendimiento */}
          <div className="card flex flex-wrap items-center justify-between gap-3 p-4">
            <div>
              <p className="text-sm font-bold text-ink">Ajustar rendimiento</p>
              <p className="text-xs text-ink/45">Las cantidades se recalculan automáticamente</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setRendimiento((v) => Math.max(1, v - 1))}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-black/10 text-ink/60 hover:bg-black/5"
              >
                <Icon name="minus" className="w-4 h-4" />
              </button>
              <span className="w-24 text-center text-base font-bold text-ink">
                {rendimiento} <span className="text-xs font-medium text-ink/45">{receta.unidadRendimiento}</span>
              </span>
              <button
                onClick={() => setRendimiento((v) => v + 1)}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-black/10 text-ink/60 hover:bg-black/5"
              >
                <Icon name="plus" className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div>
            <div className="flex gap-1 overflow-x-auto border-b border-black/5">
              {TABS.map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`shrink-0 border-b-2 px-4 py-2.5 text-sm font-semibold transition ${
                    tab === t ? 'border-brand-500 text-brand-600' : 'border-transparent text-ink/45 hover:text-ink'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="py-5">
              {tab === 'Ingredientes' && (
                <div className="space-y-3">
                  <ul className="divide-y divide-black/5">
                    {ingredientesEscalados.map((i, idx) => (
                      <li key={idx} className="flex items-center justify-between py-2.5 text-sm">
                        <span className="text-ink">{i.nombre}</span>
                        <span className="font-semibold text-ink/60">
                          {formatoCantidad(i.cantidad)} {i.unidad}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <button onClick={agregarIngredientesALista} className="btn-primary w-full sm:w-auto">
                    <Icon name="cart" className="w-4 h-4" /> {agregado ? '¡Agregado a la lista!' : 'Agregar todo a la lista de compras'}
                  </button>
                </div>
              )}

              {tab === 'Preparación' && (
                <ol className="space-y-3">
                  {receta.pasos.map((paso, idx) => (
                    <li key={idx} className="flex gap-3 text-sm text-ink/70">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-500 text-xs font-bold text-white">
                        {idx + 1}
                      </span>
                      <p className="pt-0.5">{paso}</p>
                    </li>
                  ))}
                </ol>
              )}

              {tab === 'Consejos' &&
                (receta.consejos?.length ? (
                  <ul className="space-y-2">
                    {receta.consejos.map((c, idx) => (
                      <li key={idx} className="flex gap-2 text-sm text-ink/70">
                        <Icon name="sparkles" className="mt-0.5 w-4 h-4 shrink-0 text-brand-500" /> {c}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-ink/45">Esta receta todavía no tiene consejos cargados.</p>
                ))}

              {tab === 'Conservación' && <p className="text-sm text-ink/70">{receta.conservacion}</p>}
            </div>
          </div>
        </div>

        {/* Columna de costos */}
        <div className="space-y-4 lg:col-span-1">
          <div className="card p-5">
            <p className="mb-3 text-sm font-bold text-ink">Resumen de costos</p>
            <dl className="space-y-2 text-sm">
              <Fila label="Costo de ingredientes" valor={formatoMoneda(costoIngredientes(ingredientesEscalados))} />
              <Fila label="Otros costos" valor={formatoMoneda(recetaEscalada.costosExtra)} />
              <Fila label="Costo total" valor={formatoMoneda(costoTotalReceta(recetaEscalada))} destacado />
              <Fila
                label={`Costo por ${receta.unidadRendimiento.replace(/s$/, '')}`}
                valor={formatoMoneda(costoPorUnidad(recetaEscalada))}
              />
            </dl>

            <div className="my-4 border-t border-black/5" />

            <p className="mb-3 text-sm font-bold text-ink">Precio sugerido</p>
            <dl className="space-y-2 text-sm">
              <Fila label="Margen de ganancia" valor={`${receta.margenSugerido}%`} />
              <Fila
                label={`Precio por ${receta.unidadRendimiento.replace(/s$/, '')}`}
                valor={formatoMoneda(precioSugerido(recetaEscalada))}
                destacado
              />
              <Fila label="Ganancia por unidad" valor={formatoMoneda(gananciaPorUnidad(recetaEscalada))} />
              <Fila
                label={`Ganancia total (${rendimiento} ${receta.unidadRendimiento})`}
                valor={formatoMoneda(gananciaTotal(recetaEscalada))}
                positivo
              />
            </dl>

            <Link to="/calculadoras/precios" className="btn-primary mt-4 w-full justify-center">
              Ver calculadora detallada
            </Link>
          </div>

          {receta.paraVender && (
            <div className="card flex items-start gap-3 border-emerald-200 bg-emerald-50 p-4">
              <Icon name="bolt" className="mt-0.5 w-5 h-5 text-emerald-600" />
              <p className="text-sm text-emerald-800">Esta receta es ideal para vender: buen margen y alta demanda.</p>
            </div>
          )}
        </div>
      </div>

      {relacionadas.length > 0 && (
        <div>
          <p className="mb-4 text-lg font-extrabold text-ink">Recetas relacionadas</p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
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

function Fila({ label, valor, destacado, positivo }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-ink/50">{label}</dt>
      <dd className={`font-semibold ${destacado ? 'text-ink text-base' : positivo ? 'text-emerald-600' : 'text-ink/80'}`}>
        {valor}
      </dd>
    </div>
  );
}
