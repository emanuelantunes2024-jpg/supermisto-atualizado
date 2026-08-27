import type { ReactNode } from "react";

import { Icone } from "@/components/ui/Icone";

type Tipo = "info" | "atencao" | "simulacao";

const ESTILOS: Record<Tipo, { caixa: string; icone: string }> = {
  info: { caixa: "border-line bg-cream-50 text-ink-soft", icone: "text-brand-500" },
  atencao: { caixa: "border-amber-400/40 bg-amber-100/60 text-ink-soft", icone: "text-amber-600" },
  simulacao: { caixa: "border-line bg-white text-ink-muted", icone: "text-money-600" },
};

interface Props {
  children: ReactNode;
  tipo?: Tipo;
  titulo?: string;
  className?: string;
}

/** Caixa de aviso usada para contexto, alertas e o rótulo de simulação. */
export function Aviso({ children, tipo = "info", titulo, className = "" }: Props) {
  const estilo = ESTILOS[tipo];

  return (
    <div className={`flex gap-3 rounded-xl border p-3.5 text-[13px] leading-relaxed ${estilo.caixa} ${className}`}>
      <Icone nome="info" tamanho={18} className={`mt-0.5 shrink-0 ${estilo.icone}`} />
      <div>
        {titulo && <p className="mb-0.5 font-semibold text-ink">{titulo}</p>}
        <div>{children}</div>
      </div>
    </div>
  );
}

/**
 * Rótulo padrão de simulação financeira.
 *
 * Usado em toda tela que mostra dinheiro estimado. O produto não promete
 * renda: os números dependem dos preços e das condições de venda de cada um.
 */
export function AvisoSimulacao({ className = "" }: { className?: string }) {
  return (
    <Aviso tipo="simulacao" className={className}>
      Os valores são uma <strong className="text-ink">simulação</strong> feita a partir dos preços
      que você informou. Servem para planejar, não são promessa de lucro nem garantia de venda.
    </Aviso>
  );
}
