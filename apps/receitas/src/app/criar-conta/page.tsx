import type { Metadata } from "next";

import { FormularioAuth } from "@/components/auth/FormularioAuth";
import { MolduraAuth } from "@/components/auth/MolduraAuth";

export const metadata: Metadata = { title: "Criar conta" };

export default function PaginaCriarConta() {
  return (
    <MolduraAuth>
      <FormularioAuth modo="criar" />
    </MolduraAuth>
  );
}
