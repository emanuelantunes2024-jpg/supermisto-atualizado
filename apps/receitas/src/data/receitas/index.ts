import type { Receita } from "@/lib/types";

import { BISCOITOS } from "./biscoitos";
import { BOLOS } from "./bolos";
import { CONSERVAS } from "./conservas";
import { DOCES } from "./doces";
import { GELADOS } from "./gelados";
import { MASSAS } from "./massas";
import { PAES } from "./paes";
import { SALGADOS } from "./salgados";
import { SOBREMESAS } from "./sobremesas";

/**
 * Catálogo curado da primeira versão.
 *
 * É a fonte usada para gerar o seed do Supabase (`npm run gerar:seed`) e
 * também o que a aplicação mostra enquanto o banco não estiver configurado.
 * Depois do seed, quem manda é o banco: novas receitas entram pelo painel
 * administrativo, sem precisar publicar código.
 */
export const RECEITAS: Receita[] = [
  ...DOCES,
  ...BOLOS,
  ...SALGADOS,
  ...PAES,
  ...GELADOS,
  ...SOBREMESAS,
  ...MASSAS,
  ...BISCOITOS,
  ...CONSERVAS,
];

export const RECEITAS_POR_SLUG: Record<string, Receita> = Object.fromEntries(
  RECEITAS.map((r) => [r.slug, r]),
);

export { BISCOITOS, BOLOS, CONSERVAS, DOCES, GELADOS, MASSAS, PAES, SALGADOS, SOBREMESAS };
