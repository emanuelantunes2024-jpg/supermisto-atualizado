import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useRecipes } from '../lib/useRecipes.js';
import { categoryBySlug } from '../lib/categories.js';
import { formatearMinutos, colorDificultad } from '../lib/format.js';
import { RecipeImage } from '../components/PlaceholderImage.jsx';
import FavoriteButton from '../components/FavoriteButton.jsx';
import CookingTimer from '../components/CookingTimer.jsx';

const TABS = ['Ingredientes', 'Preparación', 'Consejos'];

export default function RecipeDetail() {
  const { slug } = useParams();
  const { recetas } = useRecipes();
  const [porciones, setPorciones] = useState(null);
  const [tab, setTab] = useState('Ingredientes');
  const [pasosHechos, setPasosHechos] = useState(() => new Set());

  const receta = recetas.find((r) => r.slug === slug);
  const categoria = receta ? categoryBySlug(receta.categoria) : null;
  const porcionesActuales = porciones ?? receta?.porciones ?? 1;
  const factor = receta ? porcionesActuales / receta.porciones : 1;

  const ingredientesEscalados = useMemo(() => {
    if (!receta) return [];
    return receta.ingredientes.map((ing) => ({
      ...ing,
      cantidadEscalada: Math.round(ing.cantidad * factor * 100) / 100,
    }));
  }, [receta, factor]);

  if (!receta) {
    return (
      <div className="py-10 text-center text-sm text-ink/60">
        Receta no encontrada. <Link to="/app" className="font-semibold text-wine-500">Volver al inicio</Link>
      </div>
    );
  }

  function togglePaso(i) {
    setPasosHechos((prev) => {
      const nuevo = new Set(prev);
      if (nuevo.has(i)) nuevo.delete(i);
      else nuevo.add(i);
      return nuevo;
    });
  }

  return (
    <div className="space-y-6 pb-10">
      <div className="relative -mx-4 aspect-[16/10] overflow-hidden sm:mx-0 sm:rounded-2xl">
        <RecipeImage receta={receta} className="h-full w-full object-cover" />
        <FavoriteButton id={receta.id} size="lg" className="absolute right-3 top-3" />
        <Link
          to={`/app/categoria/${receta.categoria}`}
          className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-ink shadow-card"
        >
          {categoria?.icon} {categoria?.name}
        </Link>
      </div>

      <div>
        <h1 className="font-display text-2xl font-bold text-ink sm:text-3xl">{receta.nombre}</h1>
        {receta.region && <p className="mt-1 text-sm text-ink/50">📍 {receta.region}</p>}
        <p className="mt-2 text-sm text-ink/70">{receta.descripcion}</p>

        <div className="mt-4 flex flex-wrap gap-2 text-xs">
          <span className="rounded-full bg-shell px-3 py-1 ring-1 ring-line">⏱ Prep. {formatearMinutos(receta.tiempoPrepMinutos)}</span>
          <span className="rounded-full bg-shell px-3 py-1 ring-1 ring-line">🔥 Cocción {formatearMinutos(receta.tiempoCoccionMinutos)}</span>
          <span className={`rounded-full px-3 py-1 ring-1 ${colorDificultad(receta.dificultad)}`}>{receta.dificultad}</span>
        </div>
      </div>

      <div className="flex items-center justify-between rounded-2xl border border-line bg-shell px-4 py-3">
        <span className="text-sm font-medium text-ink">Porciones</span>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setPorciones(Math.max(1, porcionesActuales - 1))}
            className="h-8 w-8 rounded-full border border-line text-ink/70 hover:bg-cream"
          >
            −
          </button>
          <span className="w-6 text-center font-semibold text-ink">{porcionesActuales}</span>
          <button
            type="button"
            onClick={() => setPorciones(porcionesActuales + 1)}
            className="h-8 w-8 rounded-full border border-line text-ink/70 hover:bg-cream"
          >
            +
          </button>
        </div>
      </div>

      <CookingTimer minutosSugeridos={receta.tiempoCoccionMinutos || receta.tiempoPrepMinutos} nombreReceta={receta.nombre} />

      <div>
        <div className="flex gap-1 rounded-xl bg-shell p-1 ring-1 ring-line">
          {TABS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`flex-1 rounded-lg py-2 text-sm font-semibold transition ${
                tab === t ? 'bg-wine-500 text-white' : 'text-ink/60'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="mt-4">
          {tab === 'Ingredientes' && (
            <ul className="divide-y divide-line rounded-2xl border border-line bg-shell">
              {ingredientesEscalados.map((ing, i) => (
                <li key={i} className="flex items-center justify-between px-4 py-3 text-sm">
                  <span className="text-ink">{ing.nombre}</span>
                  <span className="font-medium text-ink/70">
                    {ing.cantidadEscalada} {ing.unidad}
                  </span>
                </li>
              ))}
            </ul>
          )}

          {tab === 'Preparación' && (
            <ol className="space-y-3">
              {receta.pasos.map((paso, i) => (
                <li
                  key={i}
                  onClick={() => togglePaso(i)}
                  className={`flex cursor-pointer gap-3 rounded-2xl border border-line bg-shell p-4 text-sm transition ${
                    pasosHechos.has(i) ? 'opacity-50' : ''
                  }`}
                >
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                      pasosHechos.has(i) ? 'bg-emerald-500 text-white' : 'bg-wine-500 text-white'
                    }`}
                  >
                    {pasosHechos.has(i) ? '✓' : i + 1}
                  </span>
                  <span className={pasosHechos.has(i) ? 'line-through' : ''}>{paso}</span>
                </li>
              ))}
            </ol>
          )}

          {tab === 'Consejos' && (
            <div className="space-y-3">
              {receta.consejos?.length > 0 ? (
                receta.consejos.map((c, i) => (
                  <div key={i} className="flex gap-3 rounded-2xl border border-gold-200 bg-gold-50 p-4 text-sm text-ink/80">
                    <span>💡</span>
                    <span>{c}</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-ink/50">Esta receta todavía no tiene consejos adicionales.</p>
              )}
              <div className="rounded-2xl border border-line bg-shell p-4 text-sm text-ink/70">
                <strong className="text-ink">Conservación:</strong> {receta.conservacion}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
