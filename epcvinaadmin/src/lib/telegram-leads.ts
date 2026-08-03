type TelegramLead = {
  id: string;
  name: string | null;
  phone: string;
  email: string | null;
  address: string | null;
  message: string | null;
  source_form: string;
  system_type: string | null;
  roof_area: string | null;
  monthly_bill: string | null;
  system_size_kw: number | null;
  landing_page: string | null;
  utm_source: string | null;
  utm_campaign: string | null;
};

function escapeHtml(value: unknown) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function line(label: string, value: unknown) {
  return value ? `<b>${escapeHtml(label)}:</b> ${escapeHtml(value)}` : "";
}

export async function notifyTelegramAboutLead(lead: TelegramLead) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_LEAD_CHAT_ID;
  if (!token || !chatId) return;

  const text = [
    "🔔 <b>LEAD MỚI TỪ EPCVINA.COM</b>",
    "",
    line("Khách hàng", lead.name || "Chưa cung cấp tên"),
    line("Điện thoại", lead.phone),
    line("Email", lead.email),
    line("Khu vực", lead.address),
    line("Nguồn form", lead.source_form),
    line("Hệ thống", lead.system_type),
    line("Công suất", lead.system_size_kw ? `${lead.system_size_kw} kWp` : ""),
    line("Diện tích mái", lead.roof_area),
    line("Hóa đơn/tháng", lead.monthly_bill),
    line("Nội dung", lead.message),
    "",
    line("UTM source", lead.utm_source),
    line("Chiến dịch", lead.utm_campaign),
    line("Trang gửi", lead.landing_page),
  ].filter(Boolean).join("\n").slice(0, 3900);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5_000);
  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "HTML",
        disable_web_page_preview: true,
        reply_markup: {
          inline_keyboard: [[{ text: "Mở lead trong CRM", url: `https://app.epcvina.com/admin/leads/${lead.id}` }]],
        },
      }),
      signal: controller.signal,
      cache: "no-store",
    });
    if (!response.ok) console.warn("Telegram lead notification failed with status", response.status);
  } catch {
    console.warn("Telegram lead notification could not be delivered");
  } finally {
    clearTimeout(timeout);
  }
}
