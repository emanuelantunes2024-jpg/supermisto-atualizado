import { Link } from 'react-router-dom';
import { useStore } from '../lib/StoreContext.jsx';
import Icon from '../components/Icon.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { obtenerComprasReceta } from '../lib/db.js';
import { costoTotalReceta, precioSugerido, gananciaTotal, aplicarComprasAReceta, formatoMoneda } from '../lib/calc.js';

export default function SellRecipes() {
  const { recetasPublicadas } = useStore();
  const recetas = recetasPublicadas
    .filter((r) => r.paraVender)
    .map((r) => aplicarComprasAReceta(r, obtenerComprasReceta(r.id)))
    .sort((a, b) => gananciaTotal(b) - gananciaTotal(a));

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
          <Icon name="bolt" className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-ink">Recetas para vender</h1>
          <p className="mt-0.5 text-sm text-ink/50">Seleccionadas por su rentabilidad y facilidad de producción.</p>
        </div>
      </div>

      {recetas.length === 0 ? (
        <EmptyState icon="bolt" title="Sin recetas marcadas para vender" description="Marcá recetas como 'para vender' desde el panel administrativo." />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {recetas.map((r) => (
            <Link key={r.id} to={`/recetas/${r.slug}`} className="card overflow-hidden transition hover:-translate-y-0.5 hover:shadow-lg">
              <img src={r.imagen} alt={r.nombre} className="aspect-[16/9] w-full object-cover" />
              <div className="space-y-2.5 p-4">
                <h3 className="font-bold text-ink">{r.nombre}</h3>
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="rounded-lg bg-black/5 py-2">
                    <p className="text-ink/45">Costo</p>
                    <p className="font-bold text-ink">{formatoMoneda(costoTotalReceta(r))}</p>
                  </div>
                  <div className="rounded-lg bg-black/5 py-2">
                    <p className="text-ink/45">Precio</p>
                    <p className="font-bold text-ink">{formatoMoneda(precioSugerido(r))}</p>
                  </div>
                  <div className="rounded-lg bg-emerald-50 py-2">
                    <p className="text-emerald-600/70">Ganancia</p>
                    <p className="font-bold text-emerald-600">{formatoMoneda(gananciaTotal(r))}</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
