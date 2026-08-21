import Link from "next/link";

import { Icone } from "@/components/ui/Icone";

interface Props {
  pagina: number;
  total: number;
  porPagina: number;
  /** Monta a URL de cada página, preservando os filtros da tela. */
  construirHref: (pagina: number) => string;
}

/** Paginação por link: funciona sem JavaScript e mantém a URL compartilhável. */
export function Paginacao({ pagina, total, porPagina, construirHref }: Props) {
  const paginas = Math.ceil(total / porPagina);
  if (paginas <= 1) return null;

  const anterior = Math.max(pagina - 1, 1);
  const proxima = Math.min(pagina + 1, paginas);

  const janela = Array.from({ length: paginas }, (_, i) => i + 1).filter(
    (n) => n === 1 || n === paginas || Math.abs(n - pagina) <= 1,
  );

  return (
    <nav className="flex items-center justify-center gap-1.5 pt-2" aria-label="Paginação">
      <Link
        href={construirHref(anterior)}
        aria-disabled={pagina === 1}
        className={`grid h-9 w-9 place-items-center rounded-lg border border-line bg-white text-ink-soft transition hover:border-brand-300 hover:text-brand-600 ${
          pagina === 1 ? "pointer-events-none opacity-40" : ""
        }`}
      >
        <Icone nome="seta-esquerda" tamanho={16} />
      </Link>

      {janela.map((numero, indice) => {
        const anteriorNumero = janela[indice - 1];
        const salto = anteriorNumero && numero - anteriorNumero > 1;

        return (
          <span key={numero} className="flex items-center gap-1.5">
            {salto && <span className="px-1 text-ink-faint">…</span>}
            <Link
              href={construirHref(numero)}
              aria-current={numero === pagina ? "page" : undefined}
              className={`grid h-9 min-w-9 place-items-center rounded-lg border px-2 text-sm font-semibold transition ${
                numero === pagina
                  ? "border-brand-500 bg-brand-500 text-white"
                  : "border-line bg-white text-ink-soft hover:border-brand-300 hover:text-brand-600"
              }`}
            >
              {numero}
            </Link>
          </span>
        );
      })}

      <Link
        href={construirHref(proxima)}
        aria-disabled={pagina === paginas}
        className={`grid h-9 w-9 place-items-center rounded-lg border border-line bg-white text-ink-soft transition hover:border-brand-300 hover:text-brand-600 ${
          pagina === paginas ? "pointer-events-none opacity-40" : ""
        }`}
      >
        <Icone nome="seta-direita" tamanho={16} />
      </Link>
    </nav>
  );
}
