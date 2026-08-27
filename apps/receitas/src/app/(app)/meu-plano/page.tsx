import type { Metadata } from "next";

import { PainelPessoal } from "@/components/home/PainelPessoal";
import { CabecalhoPagina } from "@/components/layout/CabecalhoPagina";
import { Aviso } from "@/components/ui/Aviso";
import { obterSessao } from "@/lib/auth";
import { listarReceitas } from "@/lib/queries";
import { supabaseConfigurado } from "@/lib/config";

export const metadata: Metadata = { title: "Meu Plano" };

export default async function PaginaMeuPlano() {
  const [{ itens }, sessao] = await Promise.all([
    listarReceitas({ porPagina: 500 }),
    obterSessao(),
  ]);

  return (
    <div className="flex flex-col gap-4">
      <CabecalhoPagina
        titulo={sessao.perfil?.nome ? `Olá, ${sessao.perfil.nome}` : "Meu Plano"}
        descricao="Tudo o que você guardou, calculou e planejou dentro do sistema."
      />

      {sessao.user ? (
        <Aviso tipo="info" titulo="Seu acesso">
          Conta <strong>{sessao.user.email}</strong>
          {sessao.perfil?.plano ? ` · plano ${sessao.perfil.plano}` : ""} ·{" "}
          {sessao.perfil?.acesso === "ativo" ? "acesso ativo" : "acesso liberado"}. Novas receitas
          adicionadas à biblioteca entram no seu acesso automaticamente.
        </Aviso>
      ) : (
        <Aviso tipo="atencao" titulo="Você está sem login">
          {supabaseConfigurado
            ? "Entre na sua conta para que favoritos, listas e preços fiquem salvos e sincronizados entre os seus aparelhos."
            : "O sistema está em modo demonstração: seus dados ficam salvos apenas neste navegador até o Supabase ser configurado."}
        </Aviso>
      )}

      <PainelPessoal receitas={itens} />
    </div>
  );
}
