import type { Metadata } from "next";

import { TabelaUsuarios } from "@/components/admin/TabelaUsuarios";
import { Aviso } from "@/components/ui/Aviso";
import { criarClienteServidor } from "@/lib/supabase/server";
import type { Perfil } from "@/lib/types";

export const metadata: Metadata = { title: "Usuários · Painel" };
export const dynamic = "force-dynamic";

export default async function PaginaAdminUsuarios() {
  const supabase = await criarClienteServidor();

  if (!supabase) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="font-display text-2xl font-bold text-ink">Usuários</h1>
        <Aviso tipo="atencao" titulo="Banco não conectado">
          A lista de usuários vem da tabela <code>perfis</code> do Supabase. Configure as variáveis
          de ambiente para ver e gerenciar os acessos.
        </Aviso>
      </div>
    );
  }

  const { data, error } = await supabase
    .from("perfis")
    .select("id, nome, email, papel, acesso, plano, criado_em, ultimo_acesso")
    .order("criado_em", { ascending: false })
    .limit(200);

  const perfis: Perfil[] = (data ?? []).map((linha) => ({
    id: linha.id,
    nome: linha.nome,
    email: linha.email,
    papel: linha.papel,
    acesso: linha.acesso,
    plano: linha.plano,
    criadoEm: linha.criado_em,
    ultimoAcesso: linha.ultimo_acesso,
  }));

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink">Usuários</h1>
        <p className="mt-1 text-sm text-ink-muted">
          {perfis.length} contas cadastradas. A situação de acesso também é atualizada
          automaticamente pelo webhook da plataforma de venda.
        </p>
      </div>

      {error && (
        <Aviso tipo="atencao" titulo="Não foi possível carregar">
          {error.message}
        </Aviso>
      )}

      <Aviso tipo="info">
        <strong>Ativo</strong> libera o acesso. <strong>Suspenso</strong> bloqueia temporariamente
        (útil em contestação de pagamento). <strong>Cancelado</strong> encerra o acesso após
        reembolso ou cancelamento. Use com cuidado: mudar aqui afeta o cliente na hora.
      </Aviso>

      <TabelaUsuarios perfis={perfis} />
    </div>
  );
}
