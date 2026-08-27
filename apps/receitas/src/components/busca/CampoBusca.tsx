"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import { Icone } from "@/components/ui/Icone";

interface Props {
  valorInicial?: string;
  sugestoes?: string[];
}

export function CampoBusca({ valorInicial = "", sugestoes = [] }: Props) {
  const router = useRouter();
  const [termo, setTermo] = useState(valorInicial);

  function enviar(evento: FormEvent) {
    evento.preventDefault();
    const limpo = termo.trim();
    router.push(limpo ? `/buscar?q=${encodeURIComponent(limpo)}` : "/buscar");
  }

  return (
    <div className="flex flex-col gap-2.5">
      <form onSubmit={enviar} className="relative">
        <Icone
          nome="buscar"
          tamanho={18}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-faint"
        />
        <input
          type="search"
          value={termo}
          onChange={(e) => setTermo(e.target.value)}
          placeholder="Buscar receitas, ingredientes..."
          aria-label="Buscar receitas"
          autoFocus={!valorInicial}
          className="campo py-3.5 pl-11 pr-24 text-[15px]"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg bg-brand-500 px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-brand-600"
        >
          Buscar
        </button>
      </form>

      {sugestoes.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[12px] font-semibold text-ink-muted">Sugestões:</span>
          {sugestoes.map((sugestao) => (
            <button
              key={sugestao}
              type="button"
              onClick={() => {
                setTermo(sugestao);
                router.push(`/buscar?q=${encodeURIComponent(sugestao)}`);
              }}
              className="rounded-pill border border-line bg-white px-3 py-1.5 text-[12px] font-medium text-ink-soft transition hover:border-brand-300 hover:text-brand-600"
            >
              {sugestao}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
