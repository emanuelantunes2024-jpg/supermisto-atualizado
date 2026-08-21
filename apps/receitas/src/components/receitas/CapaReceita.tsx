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
  bolos: "from-amber-300 via-orange-400 to-brand-500",
  doces: "from-rose-300 via-brand-400 to-brand-600",
  salgados: "from-amber-300 via-orange-400 to-amber-600",
  paes: "from-yellow-300 via-amber-400 to-orange-400",
  "sorvetes-picoles": "from-pink-300 via-fuchsia-400 to-purple-400",
  sobremesas: "from-purple-300 via-pink-400 to-rose-400",
  "massas-pizzas": "from-orange-300 via-red-400 to-red-500",
  "biscoitos-cookies": "from-lime-300 via-amber-400 to-yellow-500",
  "geleias-molhos": "from-emerald-300 via-lime-400 to-amber-400",
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
      className={`relative flex h-full w-full items-center justify-center overflow-hidden bg-gradient-to-br ${gradiente} ${className}`}
      aria-hidden="true"
    >
      {/* Brilho suave no canto, para a capa não ficar chapada. */}
      <span className="absolute -right-6 -top-8 h-24 w-24 rounded-full bg-white/25 blur-2xl" />
      <Icone
        nome={icone}
        tamanho={62}
        strokeWidth={1.4}
        className="relative text-white drop-shadow-[0_2px_6px_rgba(120,50,20,0.35)]"
      />
    </div>
  );
}
