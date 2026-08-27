import type { Metadata } from "next";

import { TabelaReceitas } from "@/components/admin/TabelaReceitas";
import { Aviso } from "@/components/ui/Aviso";
import { listarReceitasAdmin } from "@/lib/queries";
import { criarClienteServidor } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Receitas · Painel" };
export const dynamic = "force-dynamic";

export default async function PaginaAdminReceitas() {
  const supabase = await criarClienteServidor();
  const { itens, demonstracao } = await listarReceitasAdmin(supabase);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink">Receitas</h1>
        <p className="mt-1 text-sm text-ink-muted">
          {itens.length} receitas no sistema, incluindo rascunhos.
        </p>
      </div>

      {demonstracao && (
        <Aviso tipo="atencao" titulo="Modo somente leitura">
          Estas receitas vêm do catálogo local do projeto. Conecte o Supabase para poder criar,
          editar e publicar pelo painel.
        </Aviso>
      )}

      <TabelaReceitas receitas={itens} somenteLeitura={demonstracao} />
    </div>
  );
}
