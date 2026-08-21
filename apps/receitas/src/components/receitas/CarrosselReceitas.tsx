import Link from "next/link";

import { CartaoReceita } from "@/components/receitas/CartaoReceita";
import { Icone } from "@/components/ui/Icone";
import { Selo } from "@/components/ui/Selo";
import type { Receita } from "@/lib/types";

interface Props {
  titulo: string;
  receitas: Receita[];
  selo?: string;
  verTodosHref?: string;
  verTodosRotulo?: string;
}

/**
 * Faixa horizontal de receitas.
 *
 * No celular rola com o dedo; no computador vira grade. É o formato que
 * melhor aproveita a tela pequena sem esconder conteúdo atrás de cliques.
 */
export function CarrosselReceitas({
  titulo,
  receitas,
  selo,
  verTodosHref,
  verTodosRotulo = "Ver todas",
}: Props) {
  if (receitas.length === 0) return null;

  return (
    <section>
      <div className="mb-3.5 flex flex-wrap items-center gap-2.5">
        <h2 className="titulo-seccao">{titulo}</h2>
        {selo && <Selo tom="coral">{selo}</Selo>}

        {verTodosHref && (
          <Link
            href={verTodosHref}
            className="ml-auto inline-flex items-center gap-1.5 text-[13px] font-semibold text-ink-soft transition hover:text-brand-600"
          >
            {verTodosRotulo}
            <Icone nome="chevron-direita" tamanho={15} />
          </Link>
        )}
      </div>

      <div className="rolagem-limpa -mx-4 flex gap-2.5 overflow-x-auto px-4 pb-1 app:mx-0 app:grid app:grid-cols-6 app:overflow-visible app:px-0">
        {receitas.slice(0, 6).map((receita, indice) => (
          <div key={receita.slug} className="w-[190px] shrink-0 app:w-auto">
            <CartaoReceita receita={receita} prioridade={indice < 3} />
          </div>
        ))}
      </div>
    </section>
  );
}
