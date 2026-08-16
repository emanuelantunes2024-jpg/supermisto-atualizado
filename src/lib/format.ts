/** Formateo de precios y fechas en español europeo. */

const priceFormatter = new Intl.NumberFormat("es-ES", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 2,
});

const priceFormatterCompact = new Intl.NumberFormat("es-ES", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

/** 14900 → "149,00 €" */
export function formatPrice(cents: number): string {
  return priceFormatter.format(cents / 100);
}

/** 14900 → "149 €" (para tarjetas del catálogo). 12950 → "129,50 €" */
export function formatPriceShort(cents: number): string {
  return cents % 100 === 0 ? priceFormatterCompact.format(cents / 100) : formatPrice(cents);
}

const dateFormatter = new Intl.DateTimeFormat("es-ES", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

const dateTimeFormatter = new Intl.DateTimeFormat("es-ES", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export function formatDate(value: string | Date): string {
  return dateFormatter.format(new Date(value));
}

export function formatDateTime(value: string | Date): string {
  return dateTimeFormatter.format(new Date(value));
}

/** "Barbería Premium" → "barberia-premium" */
export function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * IVA incluido en el precio (los precios se muestran con impuestos incluidos,
 * como exige la normativa de consumo de la UE). Cuando Stripe Tax está activo
 * el importe real lo calcula Stripe según el país del comprador.
 */
export const DEFAULT_VAT_RATE = 0.21;

export function vatIncludedCents(totalCents: number, rate = DEFAULT_VAT_RATE): number {
  return Math.round(totalCents - totalCents / (1 + rate));
}
