import type { Metadata } from "next";

import { FormularioReceita } from "@/components/admin/FormularioReceita";
import { Aviso } from "@/components/ui/Aviso";
import { supabaseConfigurado } from "@/lib/config";

export const metadata: Metadata = { title: "Nova receita · Painel" };

export default function PaginaNovaReceita() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink">Nova receita</h1>
        <p className="mt-1 text-sm text-ink-muted">
          Assim que publicada, ela entra na biblioteca, atualiza o contador e aparece em Novidades.
        </p>
      </div>

      {!supabaseConfigurado && (
        <Aviso tipo="atencao" titulo="Banco não conectado">
          O formulário está visível para você conhecer os campos, mas ainda não é possível salvar.
          Configure as variáveis do Supabase e rode a migração primeiro.
        </Aviso>
      )}

      <FormularioReceita />
    </div>
  );
}
