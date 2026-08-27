import type { ReactNode } from "react";

interface Props {
  titulo: string;
  descricao?: string;
  acao?: ReactNode;
}

/** Cabeçalho padrão das telas internas. */
export function CabecalhoPagina({ titulo, descricao, acao }: Props) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink app:text-[28px]">{titulo}</h1>
        {descricao && <p className="mt-1 max-w-2xl text-sm text-ink-muted">{descricao}</p>}
      </div>
      {acao}
    </div>
  );
}
