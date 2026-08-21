import Image from "next/image";

import { ICONE_CATEGORIA, Icone } from "@/components/ui/Icone";

/**
 * Capa da receita.
 *
 * Quando existe foto cadastrada (Supabase Storage ou URL externa), ela é
 * usada. Sem foto, desenhamos uma capa gráfica com o gradiente da categoria —
 * assim o catálogo fica visualmente coerente desde o primeiro dia, e o
 * proprietário pode ir substituindo por fotos reais pelo painel.
 */

const GRADIENTES: Record<string, string> = {
  bolos: "from-amber-200 via-orange-200 to-brand-300",
  doces: "from-rose-200 via-brand-200 to-brand-300",
  salgados: "from-orange-200 via-amber-200 to-amber-400",
  paes: "from-yellow-200 via-amber-200 to-orange-200",
  "sorvetes-picoles": "from-pink-200 via-fuchsia-200 to-purple-200",
  sobremesas: "from-purple-200 via-pink-200 to-rose-200",
  "massas-pizzas": "from-red-200 via-orange-200 to-amber-300",
  "biscoitos-cookies": "from-lime-200 via-amber-200 to-yellow-300",
  "geleias-molhos": "from-emerald-200 via-lime-200 to-amber-200",
};

interface Props {
  nome: string;
  categoria: string;
  imagem?: string;
  className?: string;
  prioridade?: boolean;
  tamanhos?: string;
}

export function CapaReceita({
  nome,
  categoria,
  imagem,
  className = "",
  prioridade = false,
  tamanhos = "(max-width: 1024px) 50vw, 320px",
}: Props) {
  if (imagem) {
    return (
      <Image
        src={imagem}
        alt={nome}
        fill
        sizes={tamanhos}
        priority={prioridade}
        className={`object-cover ${className}`}
      />
    );
  }

  const gradiente = GRADIENTES[categoria] ?? "from-cream-200 via-cream-300 to-brand-200";
  const icone = ICONE_CATEGORIA[categoria] ?? "receitas";

  return (
    <div
      className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${gradiente} ${className}`}
      aria-hidden="true"
    >
      <Icone nome={icone} tamanho={64} className="text-white/70 drop-shadow-sm" strokeWidth={1.2} />
    </div>
  );
}
