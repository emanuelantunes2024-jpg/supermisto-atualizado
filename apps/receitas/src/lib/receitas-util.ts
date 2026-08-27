import type { Receita } from "@/lib/types";

/** Janela padrão, em dias, em que uma receita nova continua marcada como novidade. */
export const DIAS_NOVIDADE = 30;

/**
 * Uma receita é novidade quando foi publicada dentro da janela ou quando o
 * administrador definiu uma data de expiração ainda no futuro.
 */
export function ehNovidade(receita: Receita, referencia = new Date()): boolean {
  if (receita.novidadeAte) {
    return new Date(receita.novidadeAte).getTime() >= referencia.getTime();
  }

  const publicada = new Date(receita.publicadaEm).getTime();
  if (Number.isNaN(publicada)) return false;

  const limite = referencia.getTime() - DIAS_NOVIDADE * 86_400_000;
  return publicada >= limite;
}

/** Opções de rendimento oferecidas na página da receita. */
export function opcoesRendimento(receita: Receita): number[] {
  const base = receita.rendimento;
  const sugestoes = new Set<number>([base]);

  if (base >= 20) {
    [10, 20, 30, 50, 100, 200, 500].forEach((n) => sugestoes.add(n));
  } else if (base >= 8) {
    [Math.round(base / 2), base, base * 2, base * 3, base * 5].forEach((n) => sugestoes.add(n));
  } else {
    [1, 2, 3, 4, 5, 10].forEach((n) => sugestoes.add(n));
  }

  return Array.from(sugestoes)
    .filter((n) => n > 0)
    .sort((a, b) => a - b)
    .slice(0, 8);
}
