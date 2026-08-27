import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variante = "primario" | "secundario" | "contorno" | "fantasma" | "dinheiro";
type Tamanho = "sm" | "md" | "lg";

const VARIANTES: Record<Variante, string> = {
  primario:
    "bg-brand-500 text-white shadow-card hover:bg-brand-600 active:bg-brand-700 disabled:bg-brand-200",
  secundario: "bg-ink text-white hover:bg-ink-soft disabled:bg-ink-faint",
  contorno: "border border-line bg-white text-ink hover:border-brand-300 hover:text-brand-600",
  fantasma: "text-ink-soft hover:bg-cream-200 hover:text-ink",
  dinheiro: "bg-money-500 text-white shadow-card hover:bg-money-600 active:bg-money-700",
};

const TAMANHOS: Record<Tamanho, string> = {
  sm: "h-9 px-3.5 text-[13px]",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-[15px]",
};

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition " +
  "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-100 " +
  "disabled:cursor-not-allowed disabled:opacity-70";

interface BotaoProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: Variante;
  tamanho?: Tamanho;
  children: ReactNode;
  blocoTotal?: boolean;
}

export function Botao({
  variante = "primario",
  tamanho = "md",
  blocoTotal = false,
  className = "",
  children,
  ...props
}: BotaoProps) {
  return (
    <button
      className={`${BASE} ${VARIANTES[variante]} ${TAMANHOS[tamanho]} ${blocoTotal ? "w-full" : ""} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

interface LinkBotaoProps {
  href: string;
  variante?: Variante;
  tamanho?: Tamanho;
  children: ReactNode;
  className?: string;
  blocoTotal?: boolean;
  externo?: boolean;
}

export function LinkBotao({
  href,
  variante = "primario",
  tamanho = "md",
  blocoTotal = false,
  externo = false,
  className = "",
  children,
}: LinkBotaoProps) {
  const classes = `${BASE} ${VARIANTES[variante]} ${TAMANHOS[tamanho]} ${blocoTotal ? "w-full" : ""} ${className}`;

  if (externo) {
    return (
      <a href={href} className={classes} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
