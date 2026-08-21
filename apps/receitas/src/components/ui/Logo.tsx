import Link from "next/link";

/**
 * Marca provisória do produto: chapéu de chef sobre fundo coral.
 * Quando o proprietário tiver a marca definitiva, basta trocar o SVG aqui.
 */
export function MarcaSimbolo({ tamanho = 40 }: { tamanho?: number }) {
  return (
    <span
      className="inline-flex shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 text-white shadow-card"
      style={{ width: tamanho, height: tamanho }}
      aria-hidden="true"
    >
      <svg
        width={tamanho * 0.6}
        height={tamanho * 0.6}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M7.4 12.6a3.6 3.6 0 1 1 1.2-6.9 3.8 3.8 0 0 1 6.8 0 3.6 3.6 0 1 1 1.2 6.9v3.2H7.4zM7.4 18.4h9.2v2.2H7.4z" />
      </svg>
    </span>
  );
}

interface Props {
  href?: string;
  compacto?: boolean;
  className?: string;
}

export function Logo({ href = "/inicio", compacto = false, className = "" }: Props) {
  const conteudo = (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <MarcaSimbolo tamanho={compacto ? 34 : 40} />
      {!compacto && (
        <span className="leading-none">
          <span className="block font-display text-[15px] font-bold text-ink">
            Central de
          </span>
          <span className="block font-display text-[15px] font-bold text-brand-600">
            Receitas &amp; Renda
          </span>
        </span>
      )}
    </span>
  );

  if (!href) return conteudo;

  return (
    <Link href={href} className="shrink-0" aria-label="Central de Receitas & Renda">
      {conteudo}
    </Link>
  );
}
