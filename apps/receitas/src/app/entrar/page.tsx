import type { Metadata } from "next";

import { FormularioAuth } from "@/components/auth/FormularioAuth";
import { MolduraAuth } from "@/components/auth/MolduraAuth";
import type { ParametrosBusca } from "@/lib/filtros-url";

export const metadata: Metadata = { title: "Entrar" };

export default async function PaginaEntrar({
  searchParams,
}: {
  searchParams: Promise<ParametrosBusca>;
}) {
  const params = await searchParams;
  const bruto = Array.isArray(params.redirecionar) ? params.redirecionar[0] : params.redirecionar;

  // Só aceita caminho interno: evita redirecionamento para fora do site.
  const destino = bruto && bruto.startsWith("/") && !bruto.startsWith("//") ? bruto : "/inicio";

  return (
    <MolduraAuth>
      <FormularioAuth modo="entrar" redirecionar={destino} />
    </MolduraAuth>
  );
}
