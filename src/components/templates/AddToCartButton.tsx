"use client";

import { useRouter } from "next/navigation";

import { useCart } from "@/lib/cart-context";
import type { TemplateWithCategory } from "@/lib/types";

interface AddToCartButtonProps {
  template: Pick<
    TemplateWithCategory,
    "slug" | "title" | "price_cents" | "compare_at_price_cents" | "thumbnail_url" | "category"
  >;
  className?: string;
  /** Tras añadir, lleva directo al carrito (para el botón principal de la ficha). */
  goToCart?: boolean;
  children?: React.ReactNode;
}

export function AddToCartButton({ template, className, goToCart = false, children }: AddToCartButtonProps) {
  const { addItem } = useCart();
  const router = useRouter();

  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        addItem({
          slug: template.slug,
          title: template.title,
          price_cents: template.price_cents,
          compare_at_price_cents: template.compare_at_price_cents,
          thumbnail_url: template.thumbnail_url,
          category_icon: template.category?.icon,
        });
        if (goToCart) router.push("/carrito");
      }}
    >
      {children ?? (goToCart ? "Añadir al carrito y comprar" : "Añadir al carrito")}
    </button>
  );
}
