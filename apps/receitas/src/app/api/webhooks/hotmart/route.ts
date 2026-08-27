import { NextResponse, type NextRequest } from "next/server";

import { HOTMART_HOTTOK } from "@/lib/config";
import { criarClienteAdmin } from "@/lib/supabase/admin";

/**
 * Webhook da plataforma de venda (Hotmart e compatíveis).
 *
 * Fluxo:
 *   compra aprovada → plataforma chama esta rota → o e-mail do comprador é
 *   liberado em `acessos_liberados` → se já existe conta com aquele e-mail,
 *   o acesso é ativado na hora; se ainda não existe, ele é ativado assim que
 *   a pessoa criar a conta com o mesmo e-mail (gatilho no banco).
 *
 *   reembolso, chargeback ou cancelamento → o acesso é revogado.
 *
 * CONFIGURAÇÃO NECESSÁRIA (sem isso a rota responde 503 e não faz nada):
 *   - HOTMART_HOTTOK: o "hottok" do webhook, no painel da Hotmart;
 *   - SUPABASE_SERVICE_ROLE_KEY: para escrever sem sessão de usuário.
 * O passo a passo completo está em `docs/HOTMART.md`.
 */

/** Eventos que liberam o acesso. */
const EVENTOS_LIBERAM = new Set([
  "PURCHASE_APPROVED",
  "PURCHASE_COMPLETE",
  "PURCHASE_PROTEST", // volta a valer quando a contestação é resolvida
  "SUBSCRIPTION_REACTIVATION",
]);

/** Eventos que revogam o acesso. */
const EVENTOS_REVOGAM = new Set([
  "PURCHASE_REFUNDED",
  "PURCHASE_CHARGEBACK",
  "PURCHASE_CANCELED",
  "PURCHASE_EXPIRED",
  "SUBSCRIPTION_CANCELLATION",
]);

interface CorpoHotmart {
  id?: string;
  event?: string;
  hottok?: string;
  data?: {
    buyer?: { email?: string; name?: string };
    purchase?: { transaction?: string; status?: string; offer?: { code?: string } };
    product?: { id?: number | string; name?: string };
    subscription?: { status?: string };
  };
  // Formato antigo (v1) e algumas plataformas compatíveis:
  email?: string;
  name?: string;
  status?: string;
  prod_name?: string;
  transaction?: string;
}

/** Lê o e-mail do comprador nos dois formatos aceitos. */
function extrairEmail(corpo: CorpoHotmart): string | null {
  const email = corpo.data?.buyer?.email ?? corpo.email;
  return email ? email.trim().toLowerCase() : null;
}

function extrairNome(corpo: CorpoHotmart): string | null {
  return corpo.data?.buyer?.name ?? corpo.name ?? null;
}

function extrairEvento(corpo: CorpoHotmart): string {
  if (corpo.event) return corpo.event.toUpperCase();

  // Formato antigo: o tipo vem no campo `status`.
  const status = (corpo.status ?? "").toLowerCase();
  if (["approved", "complete", "completed"].includes(status)) return "PURCHASE_APPROVED";
  if (status === "refunded") return "PURCHASE_REFUNDED";
  if (status === "chargeback") return "PURCHASE_CHARGEBACK";
  if (status === "canceled" || status === "cancelled") return "PURCHASE_CANCELED";

  return status.toUpperCase() || "DESCONHECIDO";
}

export async function POST(request: NextRequest) {
  // 1. A rota só funciona depois de configurada. Nada de fingir sucesso.
  if (!HOTMART_HOTTOK) {
    console.error("[webhook] HOTMART_HOTTOK não configurado.");
    return NextResponse.json(
      { erro: "Webhook não configurado neste ambiente." },
      { status: 503 },
    );
  }

  const supabase = criarClienteAdmin();
  if (!supabase) {
    console.error("[webhook] Supabase sem SUPABASE_SERVICE_ROLE_KEY.");
    return NextResponse.json({ erro: "Banco de dados não configurado." }, { status: 503 });
  }

  let corpo: CorpoHotmart;
  try {
    corpo = (await request.json()) as CorpoHotmart;
  } catch {
    return NextResponse.json({ erro: "Corpo inválido." }, { status: 400 });
  }

  // 2. Autenticidade: o hottok chega no cabeçalho (v2) ou no corpo (v1).
  const hottokRecebido = request.headers.get("x-hotmart-hottok") ?? corpo.hottok ?? "";
  if (hottokRecebido !== HOTMART_HOTTOK) {
    console.warn("[webhook] hottok inválido.");
    return NextResponse.json({ erro: "Não autorizado." }, { status: 401 });
  }

  const email = extrairEmail(corpo);
  if (!email) {
    return NextResponse.json({ erro: "E-mail do comprador ausente." }, { status: 400 });
  }

  const evento = extrairEvento(corpo);
  const transacao = corpo.data?.purchase?.transaction ?? corpo.transaction ?? null;
  const produto = corpo.data?.product?.name ?? corpo.prod_name ?? null;

  // 3. Registro do evento. A chave única da transação torna o webhook
  //    idempotente: a plataforma reenvia o mesmo evento em caso de falha.
  const { error: erroEvento } = await supabase.from("eventos_compra").upsert(
    {
      evento,
      email,
      transacao,
      produto,
      carga: corpo as unknown as Record<string, unknown>,
      recebido_em: new Date().toISOString(),
    },
    { onConflict: "transacao,evento", ignoreDuplicates: true },
  );

  if (erroEvento) {
    console.error("[webhook] falha ao registrar evento:", erroEvento.message);
  }

  // 4. Aplica o efeito do evento sobre o acesso.
  if (EVENTOS_LIBERAM.has(evento)) {
    await liberarAcesso(supabase, email, extrairNome(corpo), produto);
    return NextResponse.json({ ok: true, acao: "acesso_liberado", email });
  }

  if (EVENTOS_REVOGAM.has(evento)) {
    await revogarAcesso(supabase, email);
    return NextResponse.json({ ok: true, acao: "acesso_revogado", email });
  }

  // Eventos informativos (boleto gerado, carrinho abandonado) só são registrados.
  return NextResponse.json({ ok: true, acao: "registrado", evento });
}

type Cliente = NonNullable<ReturnType<typeof criarClienteAdmin>>;

async function liberarAcesso(
  supabase: Cliente,
  email: string,
  nome: string | null,
  produto: string | null,
) {
  // A liberação vale mesmo antes de a pessoa criar a conta: ao se cadastrar
  // com este e-mail, o gatilho do banco já encontra o acesso liberado.
  await supabase.from("acessos_liberados").upsert(
    {
      email,
      nome,
      plano: produto,
      situacao: "ativo",
      atualizado_em: new Date().toISOString(),
    },
    { onConflict: "email" },
  );

  // Se a conta já existe, ativa na hora.
  await supabase
    .from("perfis")
    .update({ acesso: "ativo", plano: produto })
    .eq("email", email);
}

async function revogarAcesso(supabase: Cliente, email: string) {
  await supabase.from("acessos_liberados").upsert(
    {
      email,
      situacao: "cancelado",
      atualizado_em: new Date().toISOString(),
    },
    { onConflict: "email" },
  );

  await supabase.from("perfis").update({ acesso: "cancelado" }).eq("email", email);
}

/** Verificação rápida de que a rota está publicada e configurada. */
export async function GET() {
  return NextResponse.json({
    servico: "webhook da plataforma de venda",
    configurado: Boolean(HOTMART_HOTTOK && criarClienteAdmin()),
    metodo: "Envie POST com o cabeçalho x-hotmart-hottok.",
  });
}
