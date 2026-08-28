// Webhook de Hotmart — Configurar en: Herramientas → Webhook, apuntando a
// https://TU-DOMINIO/api/hotmart-webhook, y copiar el "Hottok" a la variable
// de entorno HOTMART_HOTTOK en Vercel.
//
// Acepta el formato v2 de Hotmart (evento + data.buyer.email). Responde 200
// siempre que el payload sea válido, como pide Hotmart para no reintentar.
// No inventa endpoints ni credenciales: solo lee campos del payload oficial
// de Hotmart (evento, comprador, compra, producto y — cuando el producto es
// una suscripción recurrente — el bloque "subscription"). Los campos que
// dependen del tipo de producto/plan (código de suscriptor, próxima fecha de
// cobro) se leen de forma defensiva: si Hotmart no los manda en un evento
// puntual, quedan en null sin romper nada — conviene revisar con un evento
// real una vez conectada la cuenta.

import { guardarAcceso } from './_lib/redis.js';

const EVENTOS_ACTIVAN = new Set([
  'PURCHASE_APPROVED',
  'PURCHASE_COMPLETE',
  'SUBSCRIPTION_REACTIVATED',
]);

// Se distingue "expirado" (la suscripción llegó a su fin natural / venció el
// pago) de "cancelado" (el cliente o Hotmart la dieron de baja antes) porque
// el panel de clientes pide ese detalle.
const EVENTOS_EXPIRAN = new Set(['PURCHASE_EXPIRED']);
const EVENTOS_CANCELAN = new Set([
  'PURCHASE_CANCELED',
  'PURCHASE_REFUNDED',
  'PURCHASE_CHARGEBACK',
  'PURCHASE_PROTEST',
  'SUBSCRIPTION_CANCELLATION',
]);

function hottokValido(req, body) {
  const esperado = process.env.HOTMART_HOTTOK;
  if (!esperado) return false;
  const recibido = req.headers['x-hotmart-hottok'] || body?.hottok || req.query?.hottok;
  return recibido === esperado;
}

function epochAIso(valor) {
  if (!valor) return null;
  const n = Number(valor);
  if (!Number.isFinite(n)) return null;
  return new Date(n).toISOString();
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'method_not_allowed' });
    return;
  }

  const body = req.body || {};

  if (!hottokValido(req, body)) {
    res.status(401).json({ ok: false, error: 'hottok_invalido' });
    return;
  }

  const evento = body.event;
  const email = body.data?.buyer?.email;

  if (!email || !evento) {
    // Payload que no reconocemos: respondemos 200 para que Hotmart no reintente,
    // pero no guardamos nada.
    res.status(200).json({ ok: true, ignorado: true });
    return;
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
    await guardarAcceso(email, { ...datosComunes, active: true, status: 'activo' });
  } else if (EVENTOS_EXPIRAN.has(evento)) {
    await guardarAcceso(email, { ...datosComunes, active: false, status: 'expirado' });
  } else if (EVENTOS_CANCELAN.has(evento)) {
    await guardarAcceso(email, { ...datosComunes, active: false, status: 'cancelado' });
  }
  // Otros eventos (ej. PURCHASE_BILLET_PRINTED) no cambian el acceso.

  res.status(200).json({ ok: true });
}
