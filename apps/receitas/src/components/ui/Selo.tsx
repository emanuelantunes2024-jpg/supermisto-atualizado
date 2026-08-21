import type { ReactNode } from "react";

type Tom = "coral" | "creme" | "dinheiro" | "ambar" | "neutro" | "escuro";

const TONS: Record<Tom, string> = {
  coral: "bg-brand-50 text-brand-700 border-brand-100",
  creme: "bg-cream-200 text-ink-soft border-line",
  dinheiro: "bg-money-50 text-money-700 border-money-500/20",
  ambar: "bg-amber-100 text-amber-600 border-amber-400/30",
  neutro: "bg-white text-ink-muted border-line",
  escuro: "bg-ink text-white border-ink",
};

interface Props {
  children: ReactNode;
  tom?: Tom;
  className?: string;
}

export function Selo({ children, tom = "creme", className = "" }: Props) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-pill border px-2.5 py-1 text-[11px] font-semibold leading-none ${TONS[tom]} ${className}`}
    >
      {children}
    </span>
  );
}
