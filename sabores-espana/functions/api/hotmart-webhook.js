// Webhook de Hotmart — Configurar en: Herramientas → Webhook, apuntando a
// https://TU-DOMINIO/api/hotmart-webhook, y copiar el "Hottok" a la variable
// de entorno HOTMART_HOTTOK en Cloudflare Pages.
//
// Acepta el formato v2 de Hotmart (evento + data.buyer.email). Responde 200
// siempre que el payload sea válido, como pide Hotmart para no reintentar.

import { guardarAcceso } from './_lib/kv.js';
import { json } from './_lib/http.js';

const EVENTOS_ACTIVAN = new Set([
  'PURCHASE_APPROVED',
  'PURCHASE_COMPLETE',
  'SUBSCRIPTION_REACTIVATED',
]);

const EVENTOS_EXPIRAN = new Set(['PURCHASE_EXPIRED']);
const EVENTOS_CANCELAN = new Set([
  'PURCHASE_CANCELED',
  'PURCHASE_REFUNDED',
  'PURCHASE_CHARGEBACK',
  'PURCHASE_PROTEST',
  'SUBSCRIPTION_CANCELLATION',
]);

function hottokValido(request, body, env) {
  const esperado = env?.HOTMART_HOTTOK;
  if (!esperado) return false;
  const url = new URL(request.url);
  const recibido = request.headers.get('x-hotmart-hottok') || body?.hottok || url.searchParams.get('hottok');
  return recibido === esperado;
}

function epochAIso(valor) {
  if (!valor) return null;
  const n = Number(valor);
  if (!Number.isFinite(n)) return null;
  return new Date(n).toISOString();
}

export async function onRequestPost({ request, env }) {
  let body = {};
  try {
    body = await request.json();
  } catch {
    body = {};
  }

  if (!hottokValido(request, body, env)) {
    return json({ ok: false, error: 'hottok_invalido' }, { status: 401 });
  }

  const evento = body.event;
  const email = body.data?.buyer?.email;

  if (!email || !evento) {
    return json({ ok: true, ignorado: true });
  }

  const datosComunes = {
    evento,
    plan: body.data?.subscription?.plan?.name || body.data?.product?.name || null,
    hotmartTransactionId: body.data?.purchase?.transaction || null,
    hotmartSubscriberCode: body.data?.subscription?.subscriber?.code || null,
    fechaInicio: epochAIso(body.data?.purchase?.approved_date || body.data?.purchase?.date) || null,
    fechaRenovacion: epochAIso(body.data?.subscription?.date_next_charge) || null,
  };

  if (EVENTOS_ACTIVAN.has(evento)) {
    await guardarAcceso(env, email, { ...datosComunes, active: true, status: 'activo' });
  } else if (EVENTOS_EXPIRAN.has(evento)) {
    await guardarAcceso(env, email, { ...datosComunes, active: false, status: 'expirado' });
  } else if (EVENTOS_CANCELAN.has(evento)) {
    await guardarAcceso(env, email, { ...datosComunes, active: false, status: 'cancelado' });
  }

  return json({ ok: true });
}
