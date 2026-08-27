// Webhook de Hotmart — Configurar en: Herramientas → Webhook, apuntando a
// https://TU-DOMINIO/api/hotmart-webhook, y copiar el "Hottok" a la variable
// de entorno HOTMART_HOTTOK en Vercel.
//
// Acepta el formato v2 de Hotmart (evento + data.buyer.email). Responde 200
// siempre que el payload sea válido, como pide Hotmart para no reintentar.

import { guardarAcceso } from './_lib/redis.js';

const EVENTOS_ACTIVAN = new Set([
  'PURCHASE_APPROVED',
  'PURCHASE_COMPLETE',
  'SUBSCRIPTION_REACTIVATED',
]);

const EVENTOS_DESACTIVAN = new Set([
  'PURCHASE_CANCELED',
  'PURCHASE_REFUNDED',
  'PURCHASE_CHARGEBACK',
  'PURCHASE_EXPIRED',
  'PURCHASE_PROTEST',
  'SUBSCRIPTION_CANCELLATION',
]);

function hottokValido(req, body) {
  const esperado = process.env.HOTMART_HOTTOK;
  if (!esperado) return false;
  const recibido = req.headers['x-hotmart-hottok'] || body?.hottok || req.query?.hottok;
  return recibido === esperado;
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

  if (EVENTOS_ACTIVAN.has(evento)) {
    await guardarAcceso(email, {
      active: true,
      evento,
      producto: body.data?.product?.name || null,
      transaccion: body.data?.purchase?.transaction || null,
    });
  } else if (EVENTOS_DESACTIVAN.has(evento)) {
    await guardarAcceso(email, {
      active: false,
      evento,
      producto: body.data?.product?.name || null,
    });
  }
  // Otros eventos (ej. PURCHASE_BILLET_PRINTED) no cambian el acceso.

  res.status(200).json({ ok: true });
}
