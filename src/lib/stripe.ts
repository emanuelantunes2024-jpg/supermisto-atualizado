import Stripe from "stripe";

import { isStripeConfigured } from "@/lib/config";

let cached: Stripe | null = null;

/** Instancia de Stripe, o `null` si aún no hay clave configurada. */
export function getStripe(): Stripe | null {
  if (!isStripeConfigured) return null;
  if (!cached) {
    cached = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      // Sin `apiVersion` explícita: se usa la versión fijada en la cuenta.
      typescript: true,
      appInfo: { name: "Leuname Software", version: "1.0.0" },
    });
  }
  return cached;
}

/** Stripe Tax calcula el IVA según el país del comprador cuando está activo. */
export const stripeTaxEnabled = process.env.STRIPE_TAX_ENABLED === "true";
