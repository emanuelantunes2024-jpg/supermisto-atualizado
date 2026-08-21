import type { ReactNode } from "react";

import { Icone } from "@/components/ui/Icone";

interface Props {
  icone?: string;
  titulo: string;
  descricao?: string;
  acao?: ReactNode;
}

/** Estado vazio: sempre explica o que aconteceu e oferece o próximo passo. */
export function Vazio({ icone = "buscar", titulo, descricao, acao }: Props) {
  return (
    <div className="cartao flex flex-col items-center gap-3 px-6 py-12 text-center">
      <span className="grid h-14 w-14 place-items-center rounded-2xl bg-cream-200 text-brand-500">
        <Icone nome={icone} tamanho={26} />
      </span>
      <div>
        <h3 className="font-display text-lg font-bold text-ink">{titulo}</h3>
        {descricao && <p className="mx-auto mt-1 max-w-sm text-sm text-ink-muted">{descricao}</p>}
      </div>
      {acao}
    </div>
  );
}
