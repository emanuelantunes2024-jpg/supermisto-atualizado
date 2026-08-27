import type { Metadata } from "next";

import { FormularioAuth } from "@/components/auth/FormularioAuth";
import { MolduraAuth } from "@/components/auth/MolduraAuth";

export const metadata: Metadata = { title: "Recuperar senha" };

export default function PaginaRecuperarSenha() {
  return (
    <MolduraAuth>
      <FormularioAuth modo="recuperar" />
    </MolduraAuth>
  );
}
