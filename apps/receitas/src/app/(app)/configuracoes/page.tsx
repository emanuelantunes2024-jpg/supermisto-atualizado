import type { Metadata } from "next";

import { MeusPrecos } from "@/components/ferramentas/MeusPrecos";
import { CabecalhoPagina } from "@/components/layout/CabecalhoPagina";
import { Aviso } from "@/components/ui/Aviso";

export const metadata: Metadata = { title: "Configurações" };

export default function PaginaConfiguracoes() {
  return (
    <div className="flex flex-col gap-4">
      <CabecalhoPagina
        titulo="Meus preços"
        descricao="Ajuste o preço de cada ingrediente para o que você paga no seu mercado."
      />

      <Aviso tipo="info">
        Os valores que já vêm preenchidos são uma <strong>média de referência</strong> de mercado,
        só para você não começar do zero. Assim que você editar um preço, ele passa a valer em
        todas as calculadoras, na lista de compras e na Central de Renda.
      </Aviso>

      <MeusPrecos />
    </div>
  );
}
