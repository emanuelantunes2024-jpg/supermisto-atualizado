import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { FormularioReceita } from "@/components/admin/FormularioReceita";
import { listarReceitasAdmin } from "@/lib/queries";
import { criarClienteServidor } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Editar receita · Painel" };
export const dynamic = "force-dynamic";

export default async function PaginaEditarReceita({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await criarClienteServidor();
  const { itens } = await listarReceitasAdmin(supabase);

  const receita = itens.find((r) => r.id === id);
  if (!receita) notFound();

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink">Editar receita</h1>
        <p className="mt-1 text-sm text-ink-muted">{receita.nome}</p>
      </div>

      <FormularioReceita receita={receita} />
    </div>
  );
}
