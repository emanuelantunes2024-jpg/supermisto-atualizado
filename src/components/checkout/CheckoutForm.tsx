"use client";

import { useState } from "react";

import { countries } from "@/lib/config";

interface CheckoutFormProps {
  templateSlug: string;
  /** Datos ya conocidos si el cliente ha iniciado sesión. */
  defaults: { email: string; fullName: string };
  paymentsEnabled: boolean;
}

export function CheckoutForm({ templateSlug, defaults, paymentsEnabled }: CheckoutFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(event.currentTarget);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          templateSlug,
          fullName: `${formData.get("firstName")} ${formData.get("lastName")}`.trim(),
          email: formData.get("email"),
          phone: formData.get("phone"),
          country: formData.get("country"),
        }),
      });

      const payload = (await response.json()) as { url?: string; error?: string };

      if (!response.ok || !payload.url) {
        setError(payload.error ?? "No hemos podido iniciar el pago. Inténtalo de nuevo.");
        setLoading(false);
        return;
      }

      // Stripe Checkout se encarga del cobro (tarjeta, Apple Pay y Google Pay).
      window.location.href = payload.url;
    } catch {
      setError("Error de conexión. Comprueba tu conexión a internet e inténtalo de nuevo.");
      setLoading(false);
    }
  }

  const [defaultFirst, ...restName] = defaults.fullName.split(" ");

  return (
    <form onSubmit={handleSubmit} className="panel">
      <h3 className="mb-5 text-lg">Datos del comprador</h3>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="field-label" htmlFor="firstName">
            Nombre
          </label>
          <input
            id="firstName"
            name="firstName"
            required
            defaultValue={defaultFirst ?? ""}
            placeholder="Tu nombre"
            className="field-input"
          />
        </div>
        <div>
          <label className="field-label" htmlFor="lastName">
            Apellidos
          </label>
          <input
            id="lastName"
            name="lastName"
            required
            defaultValue={restName.join(" ")}
            placeholder="Tus apellidos"
            className="field-input"
          />
        </div>
      </div>

      <div className="mt-4">
        <label className="field-label" htmlFor="email">
          Correo electrónico
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          defaultValue={defaults.email}
          placeholder="tucorreo@ejemplo.com"
          className="field-input"
        />
        <p className="mt-1.5 text-[11.5px] text-ink-muted">
          Aquí te enviaremos el enlace de descarga. Revísalo bien.
        </p>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <label className="field-label" htmlFor="phone">
            Teléfono / WhatsApp <span className="opacity-60">(opcional)</span>
          </label>
          <input id="phone" name="phone" type="tel" placeholder="+34 600 000 000" className="field-input" />
        </div>
        <div>
          <label className="field-label" htmlFor="country">
            País
          </label>
          <select id="country" name="country" required defaultValue="España" className="field-input">
            {countries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-line bg-navy-900 p-4">
        <h4 className="mb-2 text-[13px] font-semibold">Método de pago</h4>
        <p className="text-[12.5px] text-ink-muted">
          El pago se completa en la pasarela segura de Stripe: tarjeta de crédito o débito, Apple Pay y Google
          Pay. No guardamos ningún dato de tu tarjeta.
        </p>
      </div>

      {error && (
        <p className="mt-4 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-[13px] text-red-300">
          {error}
        </p>
      )}

      <button type="submit" disabled={loading || !paymentsEnabled} className="btn btn-gold btn-block btn-lg mt-6">
        {loading ? "Redirigiendo al pago…" : "Continuar al pago seguro →"}
      </button>

      {!paymentsEnabled && (
        <p className="mt-3 text-center text-[11.5px] text-ink-muted">
          Los pagos aún no están activados en este entorno. Configura las claves de Stripe en{" "}
          <code>.env.local</code> para habilitar el checkout.
        </p>
      )}

      <p className="mt-3 text-center text-[11px] text-ink-muted">
        No se te cobrará nada hasta confirmar el pago en Stripe.
      </p>
    </form>
  );
}
