// Cálculos de costos, precios y ganancias — usados en la ficha de receta,
// las calculadoras y la Central de Rendimiento.

export function costoIngredientes(ingredientes = []) {
  return ingredientes.reduce((sum, i) => sum + (Number(i.costo) || 0), 0);
}

export function costoTotalReceta(receta) {
  return costoIngredientes(receta.ingredientes) + (Number(receta.costosExtra) || 0);
}

export function costoPorUnidad(receta) {
  const rendimiento = Number(receta.rendimientoBase) || 1;
  return costoTotalReceta(receta) / rendimiento;
}

export function precioSugerido(receta) {
  const margen = Number(receta.margenSugerido) || 0;
  return costoPorUnidad(receta) * (1 + margen / 100);
}

export function gananciaPorUnidad(receta) {
  return precioSugerido(receta) - costoPorUnidad(receta);
}

export function gananciaTotal(receta) {
  const rendimiento = Number(receta.rendimientoBase) || 1;
  return gananciaPorUnidad(receta) * rendimiento;
}

export function facturacionTotal(receta) {
  const rendimiento = Number(receta.rendimientoBase) || 1;
  return precioSugerido(receta) * rendimiento;
}

/** Calculadora de costos genérica a partir de una lista libre de ingredientes. */
export function calcularCosto({ ingredientes = [], costosExtra = 0, unidades = 1 }) {
  const totalIngredientes = ingredientes.reduce(
    (sum, i) => sum + (Number(i.costo) || 0),
    0
  );
  const total = totalIngredientes + (Number(costosExtra) || 0);
  const porUnidad = total / (Number(unidades) || 1);
  return { totalIngredientes, total, porUnidad };
}

/** Calculadora de precio de venta a partir de un costo y un margen deseado. */
export function calcularPrecioVenta({ costoUnitario = 0, margen = 50, unidades = 1 }) {
  const precio = costoUnitario * (1 + (Number(margen) || 0) / 100);
  const ganancia = precio - costoUnitario;
  return {
    precio,
    ganancia,
    gananciaTotal: ganancia * (Number(unidades) || 1),
    facturacionTotal: precio * (Number(unidades) || 1),
  };
}

/** Escala las cantidades de ingredientes de una receta a un nuevo rendimiento. */
export function escalarIngredientes(receta, nuevoRendimiento) {
  const factor = (Number(nuevoRendimiento) || 1) / (Number(receta.rendimientoBase) || 1);
  return receta.ingredientes.map((i) => ({
    ...i,
    cantidad: redondear(i.cantidad * factor, 2),
    costo: redondear(i.costo * factor, 2),
  }));
}

export function redondear(valor, decimales = 2) {
  const f = 10 ** decimales;
  return Math.round((Number(valor) || 0) * f) / f;
}

export function formatoMoneda(valor) {
  const n = Number(valor) || 0;
  return `$${n.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatoTiempo(minutos) {
  const m = Number(minutos) || 0;
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60);
  const resto = m % 60;
  return resto ? `${h}h ${resto}min` : `${h}h`;
}

export function formatoCantidad(cantidad) {
  const n = Number(cantidad);
  if (Number.isInteger(n)) return String(n);
  return n.toFixed(2).replace(/\.?0+$/, '');
}
