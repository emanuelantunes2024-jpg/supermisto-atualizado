"use client";

import Link from "next/link";

import { CATEGORIAS_POR_SLUG } from "@/data/categorias";
import { CapaReceita } from "@/components/receitas/CapaReceita";
import { Icone } from "@/components/ui/Icone";
import { useDadosUsuario } from "@/lib/dados-usuario";
import { formatarTempo, ROTULO_DIFICULDADE } from "@/lib/format";
import { ehNovidade } from "@/lib/receitas-util";
import type { Receita } from "@/lib/types";

interface Props {
  receita: Receita;
  prioridade?: boolean;
  /** Cartão estreito para carrosséis horizontais. */
  compacto?: boolean;
}

export function CartaoReceita({ receita, prioridade = false, compacto = false }: Props) {
  const { ehFavorito, alternarFavorito } = useDadosUsuario();
  const favorito = ehFavorito(receita.slug);
  const novidade = ehNovidade(receita);
  const categoria = CATEGORIAS_POR_SLUG[receita.categoria];

  return (
    <article
      className={`group cartao cartao-hover relative overflow-hidden ${compacto ? "w-[190px] shrink-0" : ""}`}
    >
      <Link href={`/receitas/${receita.slug}`} className="block">
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-cream-200">
          <CapaReceita
            nome={receita.nome}
            categoria={receita.categoria}
            imagem={receita.imagem}
            prioridade={prioridade}
            className="transition duration-300 group-hover:scale-105"
          />

          {novidade && (
            <span className="absolute left-2.5 top-2.5 rounded-pill bg-brand-500 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-card">
              Novo
            </span>
          )}

          <span className="absolute bottom-2.5 left-2.5 inline-flex items-center gap-1 rounded-pill bg-black/55 px-2 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
            <Icone nome="relogio" tamanho={12} />
            {formatarTempo(receita.tempoMinutos)}
          </span>
        </div>
      </Link>

      <button
        type="button"
        onClick={() => alternarFavorito(receita.slug)}
        aria-label={
          favorito
            ? `Remover ${receita.nome} dos favoritos`
            : `Salvar ${receita.nome} nos favoritos`
        }
        aria-pressed={favorito}
        className={`absolute right-2.5 top-2.5 grid h-8 w-8 place-items-center rounded-full backdrop-blur-sm transition ${
          favorito
            ? "bg-brand-500 text-white"
            : "bg-white/85 text-ink-muted hover:bg-white hover:text-brand-500"
        }`}
      >
        <Icone nome="coracao" tamanho={16} className={favorito ? "fill-current" : ""} />
      </button>

      <Link href={`/receitas/${receita.slug}`} className="block p-3">
        <h3 className="line-clamp-2 text-[14px] font-bold leading-snug text-ink group-hover:text-brand-600">
          {receita.nome}
        </h3>
        <p className="mt-1 text-[12px] text-ink-muted">
          {categoria?.nome ?? receita.categoria}
          <span className="px-1.5 text-ink-faint">·</span>
          {ROTULO_DIFICULDADE[receita.dificuldade]}
        </p>
      </Link>
    </article>
  );
}
