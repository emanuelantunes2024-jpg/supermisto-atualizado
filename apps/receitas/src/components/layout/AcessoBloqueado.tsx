import Link from "next/link";

import { Icone } from "@/components/ui/Icone";
import { Logo } from "@/components/ui/Logo";
import { LINK_OFERTA } from "@/lib/config";
import type { Perfil } from "@/lib/types";

/**
 * Tela mostrada quando a conta existe mas o acesso não está ativo — depois de
 * um reembolso, uma contestação de pagamento ou um bloqueio manual.
 */
export function AcessoBloqueado({ perfil }: { perfil: Perfil | null }) {
  const suspenso = perfil?.acesso === "suspenso";

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-cream-100 px-5 text-center">
      <Logo href="/" />

      <span className="grid h-14 w-14 place-items-center rounded-2xl bg-amber-100 text-amber-600">
        <Icone nome="info" tamanho={26} />
      </span>

      <div>
        <h1 className="font-display text-xl font-bold text-ink">
          {suspenso ? "Seu acesso está suspenso" : "Seu acesso não está ativo"}
        </h1>
        <p className="mx-auto mt-2 max-w-md text-[14px] leading-relaxed text-ink-muted">
          {suspenso
            ? "O acesso desta conta está temporariamente suspenso. Isso costuma acontecer enquanto um pagamento está em análise na plataforma de venda."
            : "Não encontramos uma compra ativa para esta conta. Se você comprou agora há pouco, o acesso pode levar alguns minutos para ser liberado."}
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-2.5">
        {LINK_OFERTA && (
          <a
            href={LINK_OFERTA}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-5 py-3 text-[14px] font-bold text-white transition hover:bg-brand-600"
          >
            Ver a oferta
            <Icone nome="seta-direita" tamanho={17} />
          </a>
        )}

        <Link
          href="/demonstracao"
          className="inline-flex items-center gap-2 rounded-xl border border-line bg-white px-5 py-3 text-[14px] font-semibold text-ink-soft transition hover:border-brand-300 hover:text-brand-600"
        >
          <Icone nome="olho" tamanho={17} />
          Ver a demonstração
        </Link>

        <Link
          href="/auth/sair"
          className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-[14px] font-semibold text-ink-muted transition hover:text-ink"
        >
          Sair da conta
        </Link>
      </div>

      {perfil?.email && (
        <p className="text-[12px] text-ink-faint">Conta: {perfil.email}</p>
      )}
    </div>
  );
}
