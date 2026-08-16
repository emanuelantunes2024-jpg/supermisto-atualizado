import { Resend } from "resend";

import { isResendConfigured, siteConfig } from "@/lib/config";
import { formatPrice } from "@/lib/format";

interface PurchaseEmailInput {
  to: string;
  buyerName: string | null;
  templateTitle: string;
  amountCents: number;
  downloadUrl: string;
  orderId: string;
}

/**
 * Email de confirmación de compra con el enlace de descarga.
 * Si Resend no está configurado, se registra en consola y no se rompe el flujo
 * (el cliente siempre puede descargar desde "Mis compras").
 */
export async function sendPurchaseEmail(input: PurchaseEmailInput): Promise<void> {
  if (!isResendConfigured) {
    console.warn(
      `[email] RESEND_API_KEY sin configurar — no se envió la confirmación del pedido ${input.orderId}`,
    );
    return;
  }

  const resend = new Resend(process.env.RESEND_API_KEY!);
  const from = process.env.RESEND_FROM ?? "Leuname Software <onboarding@resend.dev>";
  const bcc = process.env.SALES_NOTIFICATION_EMAIL;

  try {
    await resend.emails.send({
      from,
      to: input.to,
      ...(bcc ? { bcc } : {}),
      subject: `Tu plantilla ${input.templateTitle} está lista para descargar`,
      html: purchaseEmailHtml(input),
      text: purchaseEmailText(input),
    });
  } catch (error) {
    // Un fallo de email no debe invalidar un pago ya cobrado.
    console.error("[email] Error enviando la confirmación de compra:", error);
  }
}

function purchaseEmailText({
  buyerName,
  templateTitle,
  amountCents,
  downloadUrl,
  orderId,
}: PurchaseEmailInput): string {
  return [
    `Hola${buyerName ? ` ${buyerName}` : ""},`,
    "",
    `Gracias por tu compra en ${siteConfig.name}.`,
    "",
    `Plantilla: ${templateTitle}`,
    `Importe: ${formatPrice(amountCents)}`,
    `Pedido: ${orderId}`,
    "",
    `Descarga tus archivos aquí: ${downloadUrl}`,
    "",
    "El enlace está siempre disponible desde tu área de cliente, en «Mis compras».",
    `Tienes 30 días de soporte técnico incluido: escríbenos a ${siteConfig.supportEmail}.`,
    "",
    `— El equipo de ${siteConfig.name}`,
  ].join("\n");
}

function purchaseEmailHtml({
  buyerName,
  templateTitle,
  amountCents,
  downloadUrl,
  orderId,
}: PurchaseEmailInput): string {
  return `<!doctype html>
<html lang="es">
<body style="margin:0;padding:0;background:#070c18;font-family:Inter,Helvetica,Arial,sans-serif;color:#eef1f8;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#070c18;padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#101c33;border:1px solid rgba(255,255,255,0.09);border-radius:14px;overflow:hidden;">
        <tr><td style="padding:28px 32px 8px;">
          <div style="font-size:15px;font-weight:800;letter-spacing:.03em;color:#f4c565;">LEUNAME SOFTWARE</div>
        </td></tr>
        <tr><td style="padding:8px 32px 0;">
          <h1 style="margin:0 0 12px;font-size:22px;line-height:1.25;color:#eef1f8;">¡Gracias por tu compra${
            buyerName ? `, ${escapeHtml(buyerName)}` : ""
          }!</h1>
          <p style="margin:0 0 20px;font-size:14px;line-height:1.6;color:#a8b3cc;">
            Tu pago se ha confirmado y tu plantilla ya está disponible para descargar.
          </p>
        </td></tr>
        <tr><td style="padding:0 32px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0b1424;border:1px solid rgba(255,255,255,0.09);border-radius:12px;">
            <tr><td style="padding:16px 18px;font-size:13.5px;color:#a8b3cc;">
              <div style="color:#eef1f8;font-size:16px;font-weight:600;margin-bottom:6px;">${escapeHtml(templateTitle)}</div>
              <div>Importe pagado: <strong style="color:#f4c565;">${formatPrice(amountCents)}</strong></div>
              <div style="margin-top:4px;">Pedido: ${escapeHtml(orderId)}</div>
            </td></tr>
          </table>
        </td></tr>
        <tr><td style="padding:24px 32px 8px;" align="center">
          <a href="${downloadUrl}" style="display:inline-block;background:#e7a63c;color:#070c18;font-weight:700;font-size:15px;text-decoration:none;padding:14px 28px;border-radius:9px;">
            Descargar mi plantilla
          </a>
        </td></tr>
        <tr><td style="padding:16px 32px 28px;">
          <p style="margin:0 0 10px;font-size:12.5px;line-height:1.6;color:#a8b3cc;">
            El enlace está siempre disponible desde tu área de cliente, en
            <a href="${siteConfig.url}/mi-cuenta" style="color:#f4c565;">Mis compras</a>.
          </p>
          <p style="margin:0;font-size:12.5px;line-height:1.6;color:#a8b3cc;">
            Incluye 30 días de soporte técnico: responde a este email o escribe a
            <a href="mailto:${siteConfig.supportEmail}" style="color:#f4c565;">${siteConfig.supportEmail}</a>.
          </p>
        </td></tr>
        <tr><td style="padding:16px 32px;border-top:1px solid rgba(255,255,255,0.09);font-size:11.5px;color:#7d88a3;">
          <span style="color:#7d88a3;">© ${new Date().getFullYear()} ${siteConfig.name}</span>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
