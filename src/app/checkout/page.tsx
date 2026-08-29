import type { Metadata } from "next";

import { CheckoutClient } from "@/components/checkout/CheckoutClient";
import { getSession } from "@/lib/auth";
import { isStripeConfigured } from "@/lib/config";

export const metadata: Metadata = {
  title: "Finalizar compra",
  robots: { index: false, follow: false },
};

export default async function CheckoutPage() {
  const { user, customer } = await getSession();

  return (
    <CheckoutClient
      defaults={{
        email: user?.email ?? "",
        fullName: customer?.full_name ?? "",
      }}
      paymentsEnabled={isStripeConfigured}
    />
  );
}
