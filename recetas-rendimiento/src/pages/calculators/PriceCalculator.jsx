import { useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { calcularPrecioVenta, formatoMoneda } from '../../lib/calc.js';

const MARGENES_RAPIDOS = [30, 50, 70, 100, 150];

export default function PriceCalculator() {
  const location = useLocation();
  const [costoUnitario, setCostoUnitario] = useState(location.state?.costoUnitario?.toFixed?.(2) ?? '');
  const [margen, setMargen] = useState(70);
  const [unidades, setUnidades] = useState(location.state?.unidades ?? 1);

  const resultado = useMemo(
    () => calcularPrecioVenta({ costoUnitario: Number(costoUnitario) || 0, margen, unidades }),
    [costoUnitario, margen, unidades]
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-ink">Calculadora de precio de venta</h1>
        <p className="mt-1 text-sm text-ink/50">Definí tu margen de ganancia y descubrí el precio ideal.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <div className="card space-y-4 p-5">
            <div>
              <label className="label">Costo por unidad</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={costoUnitario}
                onChange={(e) => setCostoUnitario(e.target.value)}
                placeholder="0.00"
                className="input mt-1.5"
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="label">Margen de ganancia</label>
                <span className="text-sm font-bold text-brand-600">{margen}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="300"
                step="5"
                value={margen}
                onChange={(e) => setMargen(Number(e.target.value))}
                className="mt-2 w-full accent-brand-500"
              />
              <div className="mt-2 flex flex-wrap gap-2">
                {MARGENES_RAPIDOS.map((m) => (
                  <button
                    key={m}
                    onClick={() => setMargen(m)}
                    className={`pill !py-1 !px-2.5 text-xs ${margen === m ? 'pill-active' : ''}`}
                  >
                    {m}%
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="label">Unidades a vender</label>
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
          <div className="card sticky top-20 space-y-4 p-5">
            <div className="rounded-xl bg-brand-50 p-4 text-center">
              <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">Precio sugerido</p>
              <p className="mt-1 text-3xl font-extrabold text-brand-700">{formatoMoneda(resultado.precio)}</p>
            </div>
            <dl className="space-y-2.5 text-sm">
              <div className="flex justify-between">
                <dt className="text-ink/50">Ganancia por unidad</dt>
                <dd className="font-semibold text-emerald-600">{formatoMoneda(resultado.ganancia)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink/50">Facturación total ({unidades} u.)</dt>
                <dd className="font-semibold text-ink/80">{formatoMoneda(resultado.facturacionTotal)}</dd>
              </div>
              <div className="flex justify-between border-t border-black/5 pt-2.5">
                <dt className="font-semibold text-ink">Ganancia total</dt>
                <dd className="text-base font-extrabold text-emerald-600">{formatoMoneda(resultado.gananciaTotal)}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
