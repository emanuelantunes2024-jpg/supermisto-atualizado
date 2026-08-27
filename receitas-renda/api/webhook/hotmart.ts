// Webhook da Hotmart — configure em Ferramentas → Webhook apontando para
// https://SEU-DOMINIO/api/webhook/hotmart e cole o "Hottok" na variável de
// ambiente HOTMART_HOTTOK (Vercel → Settings → Environment Variables).
//
// Eventos tratados: compra aprovada (ativa assinatura), cancelamento e
// reembolso (desativa). Sempre responde 200 para payloads reconhecidos, como
// a Hotmart recomenda, para evitar reenvios desnecessários.
import { getSupabaseAdmin } from '../_lib/supabaseAdmin';

const EVENTOS_ATIVAM = new Set(['PURCHASE_APPROVED', 'PURCHASE_COMPLETE', 'SUBSCRIPTION_REACTIVATED']);
const EVENTOS_DESATIVAM = new Set([
  'PURCHASE_CANCELED',
  'PURCHASE_REFUNDED',
  'PURCHASE_CHARGEBACK',
  'PURCHASE_EXPIRED',
  'PURCHASE_PROTEST',
  'SUBSCRIPTION_CANCELLATION',
]);

function hottokValido(req: any, body: any) {
  const esperado = process.env.HOTMART_HOTTOK;
  if (!esperado) return false;
  const recebido = req.headers['x-hotmart-hottok'] || body?.hottok || req.query?.hottok;
  return recebido === esperado;
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'method_not_allowed' });
    return;
  }

  const body = req.body || {};

  if (!hottokValido(req, body)) {
    res.status(401).json({ ok: false, error: 'hottok_invalido' });
    return;
  }

  const evento: string | undefined = body.event;
  const email: string | undefined = body.data?.buyer?.email;
  const transaction: string | undefined = body.data?.purchase?.transaction;
  const subscriberCode: string | undefined = body.data?.subscription?.subscriber?.code;
  const offerCode: string | undefined = body.data?.purchase?.offer?.code;
  const productId: string | undefined = body.data?.product?.id ? String(body.data.product.id) : undefined;

  if (!evento || !email) {
    res.status(200).json({ ok: true, ignorado: true });
    return;
  }

  const supabase = getSupabaseAdmin();

  try {
    if (EVENTOS_ATIVAM.has(evento)) {
      await ativarAssinatura(supabase, { email, transaction, subscriberCode, offerCode, productId });
    } else if (EVENTOS_DESATIVAM.has(evento)) {
      await desativarAssinatura(supabase, { email, transaction, subscriberCode });
    }
    res.status(200).json({ ok: true });
  } catch (err: any) {
    console.error('[hotmart-webhook]', err);
    // Ainda respondemos 200 para eventos reconhecidos e já processados parcialmente,
    // evitando reenvios em loop; erros ficam registrados nos logs da função.
    res.status(200).json({ ok: false, error: err.message });
  }
}

async function findOrInviteUser(supabase: ReturnType<typeof getSupabaseAdmin>, email: string) {
  const { data: existing } = await supabase.from('users').select('id, plan_id').eq('email', email).maybeSingle();
  if (existing) return existing;

  // Comprador ainda não tem conta no app: criamos o usuário no Supabase Auth
  // (o trigger handle_new_user cria a linha correspondente em public.users).
  const { data: invited, error } = await supabase.auth.admin.inviteUserByEmail(email);
  if (error) throw error;
  const userId = invited.user?.id;
  if (!userId) throw new Error('Não foi possível criar o usuário a partir do e-mail da Hotmart.');

  const { data: created } = await supabase.from('users').select('id, plan_id').eq('id', userId).maybeSingle();
  return created ?? { id: userId, plan_id: null };
}

async function resolvePlanId(supabase: ReturnType<typeof getSupabaseAdmin>, offerCode?: string, productId?: string) {
  if (offerCode) {
    const { data } = await supabase.from('plans').select('id').eq('hotmart_offer_code', offerCode).maybeSingle();
    if (data) return data.id;
  }
  if (productId) {
    const { data } = await supabase.from('plans').select('id').eq('hotmart_product_id', productId).maybeSingle();
    if (data) return data.id;
  }
  return null;
}

async function ativarAssinatura(
  supabase: ReturnType<typeof getSupabaseAdmin>,
  opts: { email: string; transaction?: string; subscriberCode?: string; offerCode?: string; productId?: string }
) {
  const user = await findOrInviteUser(supabase, opts.email);
  const planId = await resolvePlanId(supabase, opts.offerCode, opts.productId);

  const { data: existingSub } = await supabase
    .from('subscriptions')
    .select('id')
    .eq('user_id', user.id)
    .eq('hotmart_transaction_code', opts.transaction ?? '')
    .maybeSingle();

  const payload = {
    user_id: user.id,
    plan_id: planId,
    status: 'ativa' as const,
    hotmart_transaction_code: opts.transaction ?? null,
    hotmart_subscriber_code: opts.subscriberCode ?? null,
    started_at: new Date().toISOString(),
    canceled_at: null,
  };

  if (existingSub) {
    await supabase.from('subscriptions').update(payload).eq('id', existingSub.id);
  } else {
    await supabase.from('subscriptions').insert(payload);
  }

  if (planId) {
    await supabase.from('users').update({ plan_id: planId, status: 'active' }).eq('id', user.id);
  }
}

async function desativarAssinatura(
  supabase: ReturnType<typeof getSupabaseAdmin>,
  opts: { email: string; transaction?: string; subscriberCode?: string }
) {
  const { data: user } = await supabase.from('users').select('id').eq('email', opts.email).maybeSingle();
  if (!user) return;

  let query = supabase.from('subscriptions').update({ status: 'cancelada', canceled_at: new Date().toISOString() }).eq('user_id', user.id);
  if (opts.transaction) query = query.eq('hotmart_transaction_code', opts.transaction);
  else if (opts.subscriberCode) query = query.eq('hotmart_subscriber_code', opts.subscriberCode);
  await query;

  const { data: freePlan } = await supabase.from('plans').select('id').eq('slug', 'gratuito').maybeSingle();
  if (freePlan) {
    await supabase.from('users').update({ plan_id: freePlan.id }).eq('id', user.id);
  }
}
