"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export interface CartItem {
  slug: string;
  title: string;
  price_cents: number;
  compare_at_price_cents?: number | null;
  thumbnail_url?: string | null;
  category_icon?: string | null;
  quantity: number;
}

interface CartContextValue {
  items: CartItem[];
  count: number;
  subtotalCents: number;
  discountCents: number;
  totalCents: number;
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (slug: string) => void;
  setQuantity: (slug: string, quantity: number) => void;
  clear: () => void;
  isInCart: (slug: string) => boolean;
}

const STORAGE_KEY = "leuname_cart_v1";

const CartContext = createContext<CartContextValue | null>(null);

function readStorage(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Carrito de compra: vive en `localStorage` (no hace falta cuenta para
 * añadir productos) y se sincroniza entre pestañas mediante el evento
 * `storage`. El checkout lo envía al servidor tal cual al confirmar la compra.
 */
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setItems(readStorage());
    setHydrated(true);

    function onStorage(event: StorageEvent) {
      if (event.key === STORAGE_KEY) setItems(readStorage());
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const addItem = useCallback((item: Omit<CartItem, "quantity">, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((row) => row.slug === item.slug);
      if (existing) {
        return prev.map((row) =>
          row.slug === item.slug ? { ...row, quantity: row.quantity + quantity } : row,
        );
      }
      return [...prev, { ...item, quantity }];
    });
  }, []);

  const removeItem = useCallback((slug: string) => {
    setItems((prev) => prev.filter((row) => row.slug !== slug));
  }, []);

  const setQuantity = useCallback((slug: string, quantity: number) => {
    setItems((prev) =>
      prev.map((row) => (row.slug === slug ? { ...row, quantity: Math.max(1, quantity) } : row)),
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const isInCart = useCallback((slug: string) => items.some((row) => row.slug === slug), [items]);

  const value = useMemo<CartContextValue>(() => {
    const subtotalCents = items.reduce((sum, item) => sum + item.price_cents * item.quantity, 0);
    const discountCents = items.reduce((sum, item) => {
      if (!item.compare_at_price_cents || item.compare_at_price_cents <= item.price_cents) return sum;
      return sum + (item.compare_at_price_cents - item.price_cents) * item.quantity;
    }, 0);

    return {
      items,
      count: items.reduce((sum, item) => sum + item.quantity, 0),
      subtotalCents,
      discountCents,
      totalCents: subtotalCents,
      addItem,
      removeItem,
      setQuantity,
      clear,
      isInCart,
    };
  }, [items, addItem, removeItem, setQuantity, clear, isInCart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de <CartProvider>.");
  return ctx;
}
