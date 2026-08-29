"use client";

import { useEffect } from "react";

import { useCart } from "@/lib/cart-context";

/** Vacía el carrito una vez confirmado el pago (la compra ya quedó registrada en el servidor). */
export function ClearCartOnMount() {
  const { clear } = useCart();
  useEffect(() => {
    clear();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}
