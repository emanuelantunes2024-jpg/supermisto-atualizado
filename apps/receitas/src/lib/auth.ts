import type { User } from "@supabase/supabase-js";

import { emailsAdmin } from "@/lib/config";
import { criarClienteServidor } from "@/lib/supabase/server";
import type { Perfil } from "@/lib/types";

export interface Sessao {
  user: User | null;
  perfil: Perfil | null;
  admin: boolean;
  /** `true` quando o acesso está ativo (ou quando roda em demonstração). */
  liberado: boolean;
}

const SESSAO_VAZIA: Sessao = { user: null, perfil: null, admin: false, liberado: false };

/** Sessão atual, com o perfil e a situação de acesso do comprador. */
export async function obterSessao(): Promise<Sessao> {
  const supabase = await criarClienteServidor();
  if (!supabase) return SESSAO_VAZIA;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return SESSAO_VAZIA;

  const { data } = await supabase
    .from("perfis")
    .select("id, nome, email, papel, acesso, plano, criado_em, ultimo_acesso")
    .eq("id", user.id)
    .maybeSingle();

  const perfil: Perfil | null = data
    ? {
        id: data.id,
        nome: data.nome,
        email: data.email,
        papel: data.papel,
        acesso: data.acesso,
        plano: data.plano,
        criadoEm: data.criado_em,
        ultimoAcesso: data.ultimo_acesso,
      }
    : null;

  const email = (user.email ?? "").toLowerCase();
  const admin = perfil?.papel === "admin" || emailsAdmin().includes(email);

  return {
    user,
    perfil,
    admin,
    // Administrador nunca perde o acesso ao próprio produto.
    liberado: admin || perfil?.acesso === "ativo" || !perfil,
  };
}

/** Sessão apenas se o usuário for administrador; caso contrário, `null`. */
export async function exigirAdmin(): Promise<Sessao | null> {
  const sessao = await obterSessao();
  return sessao.admin ? sessao : null;
}
