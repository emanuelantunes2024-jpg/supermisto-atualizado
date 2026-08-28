// Cálculos de costos, precios y ganancias — usados en la ficha de receta,
// las calculadoras y la Central de Rendimiento.

export function costoIngredientes(ingredientes = []) {
  return ingredientes.reduce((sum, i) => sum + (Number(i.costo) || 0), 0);
}

/**
 * Calcula el costo de la fracción de un ingrediente usada en la receta, a
 * partir de lo que cuesta el paquete/envase completo que se compra.
 * Ej: compraste 1 kg de harina por $5 y la receta usa 500 g → devuelve 2.5.
 * `cantidadCompra` y `cantidadUsada` tienen que estar en la misma unidad
 * (ambas en gramos, ambas en ml, etc.) — la calculadora no convierte unidades.
 */
export function costoDesdeCompra({ precioCompra, cantidadCompra, cantidadUsada }) {
  const precio = Number(precioCompra) || 0;
  const cantComprada = Number(cantidadCompra) || 0;
  const cantUsada = Number(cantidadUsada) || 0;
  if (precio <= 0 || cantComprada <= 0) return 0;
  return (precio / cantComprada) * cantUsada;
}

export function normalizarNombreIngrediente(nombre) {
  return (nombre || '').trim().toLowerCase();
}

/**
 * Devuelve una copia de la receta con el costo de cada ingrediente
 * reemplazado por lo que le costó a quien la está mirando, según lo que
 * haya cargado en "Tus compras" (cuánto compró y cuánto pagó de cada
 * ingrediente). Si no cargó nada para un ingrediente puntual, se usa el
 * costo que haya dejado el admin como referencia (o 0).
 *
 * `compras` tiene la forma que devuelve obtenerComprasReceta() en db.js:
 * { [nombreDeIngredienteNormalizado]: { cantidadComprada, precioPagado } }.
 * Se usa tanto en la ficha de una receta como en cualquier listado que
 * muestre costos (Central de Rendimiento, Recetas para vender), para que
 * todos coincidan en el mismo número — nunca uno con precio real y otro en
 * $0 para la misma receta.
 */
export function aplicarComprasAReceta(receta, compras = {}) {
  const ingredientes = (receta.ingredientes || []).map((i) => {
    const compra = compras[normalizarNombreIngrediente(i.nombre)];
    const cantidadComprada = compra?.cantidadComprada;
    const precioPagado = compra?.precioPagado;
    const tieneCompra = Boolean(cantidadComprada) && Boolean(precioPagado);
    const costo = tieneCompra
      ? redondear(costoDesdeCompra({ precioCompra: precioPagado, cantidadCompra: cantidadComprada, cantidadUsada: i.cantidad }), 2)
      : Number(i.costo) || 0;
    const sobranteCantidad = tieneCompra ? redondear(Number(cantidadComprada) - i.cantidad, 2) : 0;
    const sobranteValor = tieneCompra ? redondear(Number(precioPagado) - costo, 2) : 0;
    return { ...i, cantidadComprada, precioPagado, costo, tieneCompra, sobranteCantidad, sobranteValor };
  });
  return { ...receta, ingredientes };
}

export function costoEmpaque(receta) {
  return Number(receta.costoEmpaque) || 0;
}

export function otrosCostos(receta) {
  return Number(receta.costosExtra) || 0;
}

export function costoTotalReceta(receta) {
  return costoIngredientes(receta.ingredientes) + costoEmpaque(receta) + otrosCostos(receta);
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

/**
 * Devuelve la receta completa ajustada a un nuevo rendimiento: además de los
 * ingredientes, el empaque y los otros costos también escalan (más porciones
 * implican más empaque y más consumo).
 */
export function escalarReceta(receta, nuevoRendimiento) {
  const rendimiento = Number(nuevoRendimiento) || 1;
  const factor = rendimiento / (Number(receta.rendimientoBase) || 1);
  return {
    ...receta,
    ingredientes: escalarIngredientes(receta, rendimiento),
    costoEmpaque: redondear(costoEmpaque(receta) * factor, 2),
    costosExtra: redondear(otrosCostos(receta) * factor, 2),
    rendimientoBase: rendimiento,
  };
}

/** Agrupa los ingredientes por su campo `grupo` (o un nombre por defecto). */
export function agruparIngredientes(ingredientes = [], porDefecto = 'Ingredientes') {
  const mapa = new Map();
  for (const i of ingredientes) {
    const g = i.grupo || porDefecto;
    if (!mapa.has(g)) mapa.set(g, []);
    mapa.get(g).push(i);
  }
  return [...mapa.entries()];
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

const UNIDADES_CONOCIDAS = [
  'kg', 'kilo', 'kilos', 'g', 'gr', 'gramo', 'gramos',
  'l', 'lt', 'litro', 'litros', 'ml',
  'taza', 'tazas', 'cucharada', 'cucharadas', 'cucharadita', 'cucharaditas',
  'unidad', 'unidades', 'un', 'u', 'pizca', 'diente', 'dientes',
];

const ENCABEZADOS_INGREDIENTES = /^(ingredientes?)\s*:?\s*$/i;
const ENCABEZADOS_PASOS = /^(modo de preparaci[oó]n|preparaci[oó]n|instrucciones|pasos|procedimiento)\s*:?\s*$/i;

function limpiarViñeta(linea) {
  return linea.replace(/^\s*(?:[-•*]|\d+[.)])\s*/, '').trim();
}

/**
 * Interpreta texto pegado (por ejemplo, una receta escrita por el admin en
 * ChatGPT u otro lado) buscando dos secciones — "Ingredientes" y "Modo de
 * preparación" — para no tener que cargar cada ingrediente y cada paso a
 * mano, uno por uno. Es heurístico, no magia: si el texto no trae esos
 * encabezados, no adivina nada y devuelve listas vacías.
 */
export function parsearRecetaPegada(texto) {
  const lineas = String(texto || '')
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);

  const ingredientes = [];
  const pasos = [];
  let seccion = null;

  for (const linea of lineas) {
    if (ENCABEZADOS_INGREDIENTES.test(linea)) {
      seccion = 'ingredientes';
      continue;
    }
    if (ENCABEZADOS_PASOS.test(linea)) {
      seccion = 'pasos';
      continue;
    }
    if (seccion === 'ingredientes') {
      const texto = limpiarViñeta(linea);
      if (!texto) continue;
      // Ej: "200g de chocolate amargo" / "2 tazas de harina" / "1 pizca de sal"
      const m = texto.match(/^([\d.,]+)\s*([a-záéíóúñ]+)?\s*(?:de\s+)?(.+)$/i);
      if (m && UNIDADES_CONOCIDAS.includes((m[2] || '').toLowerCase())) {
        ingredientes.push({
          nombre: m[3].trim(),
          grupo: '',
          cantidad: m[1].replace(',', '.'),
          unidad: m[2].toLowerCase(),
          precioCompra: '',
          cantidadCompra: '',
          costo: '',
        });
      } else {
        ingredientes.push({ nombre: texto, grupo: '', cantidad: '', unidad: '', precioCompra: '', cantidadCompra: '', costo: '' });
      }
    } else if (seccion === 'pasos') {
      const texto = limpiarViñeta(linea);
      if (texto) pasos.push(texto);
    }
  }

  return { ingredientes, pasos };
}
