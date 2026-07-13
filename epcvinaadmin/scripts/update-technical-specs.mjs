import fs from "node:fs/promises";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

const ROOT = "/Users/thanhtrang/Documents/epcvina.com/epcvinaadmin";
const envPath = path.join(ROOT, ".env.local");

function loadEnvFile(text) {
  for (const line of text.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx < 0) continue;
    const key = trimmed.slice(0, idx).trim();
    const value = trimmed.slice(idx + 1).trim();
    if (!(key in process.env)) process.env[key] = value;
  }
}

function toNumber(value) {
  const n = Number(String(value ?? "").replace(/[^\d.,-]/g, "").replace(",", "."));
  return Number.isFinite(n) ? n : null;
}

function normalizeText(value) {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

function extractFirst(regex, text) {
  const match = normalizeText(text).match(regex);
  return match?.[1] ? normalizeText(match[1]) : null;
}

function parseSpecs({ name, category, brand, description, workbookSpecification }) {
  const text = `${name}\n${category}\n${brand}\n${description}\n${workbookSpecification}`;
  const specs = [];

  const push = (title, value) => {
    if (value === null || value === undefined || String(value).trim() === "") return;
    specs.push({ title, value: String(value) });
  };

  push("Thương hiệu", brand);
  push("Danh mục", category);

  if (/tấm pin|panel|pv/i.test(category)) {
    push("Công suất cực đại (Pmax)", extractFirst(/(?:Công suất(?:\s*tấm pin)?(?:\s*tối đa)?(?:\s*cực đại)?(?:\s*\(Pmax\))?[:：]?\s*)([0-9.,]+\s*(?:Wp|W))/i, text));
    push("Hiệu suất", extractFirst(/Hiệu suất(?:\s*(?:Module|mô-?đun|quang năng))?[^0-9%]*([0-9]+(?:[.,][0-9]+)?\s*%)/i, text));
    push("Loại cell", extractFirst(/(?:N-?Type(?:\s+i-?TopCon)?|PERC|TOPCon|Half-?cut)/i, text));
    push("Bảo hành", extractFirst(/Bảo hành[:：]?\s*([0-9]+(?:\s*năm)?)/i, text));
    push("Xuất xứ", extractFirst(/Xuất xứ[:：]?\s*([^\n]+)/i, text));
    push("Kích thước", extractFirst(/Kích thước[:：]?\s*([^\n]+)/i, text));
    push("Trọng lượng", extractFirst(/Trọng lượng[:：]?\s*([^\n]+)/i, text));
  }

  if (/inverter|biến tần/i.test(category)) {
    push("Công suất AC", extractFirst(/(?:Công suất(?:\s*đầu ra)?(?:\s*AC)?|Output Power)[:：]?\s*([0-9.,]+\s*(?:kW|KW|W|VA|kVA))/i, text));
    push("Công suất DC tối đa", extractFirst(/(?:Đầu vào Max DC|Max\.?\s*Input Power|Max DC)[:：]?\s*([0-9.,]+\s*(?:kW|KW|W))/i, text));
    push("Điện áp đầu vào tối đa", extractFirst(/(?:Max\.?\s*Input Voltage|Điện áp đầu vào tối đa|Input Voltage)[:：]?\s*([0-9.,]+\s*V)/i, text));
    push("Dải MPPT", extractFirst(/(?:MPPT Voltage Range|Dải MPPT|Voltage Range)[:：]?\s*([0-9.,]+\s*V\s*~\s*[0-9.,]+\s*V)/i, text));
    push("Số MPPT", extractFirst(/(?:MPPT|MPP Trackers?)[:：]?\s*([0-9]+(?:\s*\/\s*[0-9]+)?)/i, text));
    push("Hiệu suất tối đa", extractFirst(/Hiệu suất(?:\s*chuyển đổi)?[:：]?\s*([0-9.,]+\s*%)/i, text));
    push("Số pha", extractFirst(/([13]\s*pha)/i, text));
    push("Cấp bảo vệ", extractFirst(/(?:IP\s*[0-9]{2})/i, text));
    push("Kết nối", extractFirst(/(?:Wi-?Fi|Bluetooth|4G|RS485)/i, text));
    push("Bảo hành", extractFirst(/Bảo hành[:：]?\s*([0-9]+(?:\s*năm)?)/i, text));
  }

  if (/pin lưu trữ|battery/i.test(category)) {
    push("Điện áp", extractFirst(/Điện áp[:：]?\s*([0-9.,]+\s*V)/i, text));
    push("Dung lượng", extractFirst(/(?:Công suất|Dung lượng|Điện năng lưu trữ|Capacity)[:：]?\s*([0-9.,]+\s*(?:kWh|KWh|Ah))/i, text));
    push("Dòng sạc/xả", extractFirst(/Dòng sạc\/xả[:：]?\s*([0-9.,]+\s*A)/i, text));
    push("Công suất định mức", extractFirst(/Công suất định mức[:：]?\s*([0-9.,]+\s*kWh)/i, text));
    push("Loại pin", extractFirst(/(Lithium[^,\n]*|LFP[^,\n]*|LiFePO4[^,\n]*)/i, text));
    push("Bảo hành", extractFirst(/Bảo hành[:：]?\s*([0-9]+(?:\s*năm)?)/i, text));
    push("Kích thước", extractFirst(/Kích thước[:：]?\s*([^\n]+)/i, text));
    push("Trọng lượng", extractFirst(/Trọng lượng[:：]?\s*([^\n]+)/i, text));
  }

  push("Nguồn", "Workbook + EPCVINASOLAR");
  push("Model", name);
  push("Mô tả", description);

  const lowerName = normalizeText(name).toLowerCase();
  const lowerCategory = normalizeText(category).toLowerCase();
  if (lowerName.includes("tsm-neg19rc.20")) {
    specs.push(
      { title: "Công nghệ", value: "N-Type i-TOPCon" },
      { title: "Hiệu suất module", value: "23.0%" },
      { title: "Bảo hành sản phẩm", value: "25 năm" },
      { title: "Bảo hành hiệu suất", value: "30 năm" },
    );
  }

  if (lowerName.includes("xg10ktl1")) {
    specs.push(
      { title: "Max input voltage", value: "600V" },
      { title: "Start voltage", value: "80V" },
      { title: "Dải MPPT", value: "50V ~ 550V" },
      { title: "Số MPPT", value: "2" },
      { title: "Hiệu suất tối đa", value: "98.1%" },
      { title: "Cấp bảo vệ", value: "IP66" },
      { title: "Bảo hành", value: "5 năm" },
    );
  }

  if (lowerName.includes("xg10ktr-s") || lowerName.includes("xg15ktr1-s")) {
    specs.push(
      { title: "Max input voltage", value: "1100V" },
      { title: "Dải MPPT", value: "180V ~ 1000V" },
      { title: "Số MPPT", value: lowerName.includes("xg15ktr1-s") ? "4" : "3" },
      { title: "Hiệu suất tối đa", value: lowerName.includes("xg15ktr1-s") ? "98.7%" : "98.7%" },
      { title: "Cấp bảo vệ", value: "IP66" },
      { title: "Bảo hành", value: "5 năm" },
    );
  }

  if (lowerName.includes("s6-eh1p8k-l-pro") || lowerName.includes("s6-eh3p10k2")) {
    specs.push(
      { title: "Dòng sản phẩm", value: "Hybrid energy storage inverter" },
      { title: "Số MPPT", value: lowerName.includes("s6-eh3p10k2") ? "2" : "2" },
      { title: "Kết nối", value: "CAN / RS485 / Wi-Fi optional" },
      { title: "Hiệu suất tối đa", value: lowerName.includes("s6-eh3p10k2") ? "97.6%" : "96.9%" },
      { title: "Bảo hành", value: "5 năm" },
    );
  }

  if (/51\.2v|5\.2kwh|14\.3kwh|14\.3kwh|hv|battery/i.test(lowerName)) {
    if (lowerName.includes("5.2") || lowerName.includes("51.2v-100ah")) {
      specs.push(
        { title: "Điện áp", value: "51.2V" },
        { title: "Dung lượng", value: "5.2kWh" },
        { title: "Dòng sạc/xả", value: "220A" },
        { title: "Bảo hành", value: "5 năm" },
      );
    }
    if (lowerName.includes("14.3")) {
      specs.push(
        { title: "Điện áp", value: "51.2V" },
        { title: "Dung lượng", value: "14.3kWh" },
        { title: "Dòng sạc/xả", value: "220A" },
        { title: "Bảo hành", value: "5 năm" },
      );
    }
    if (lowerName.includes("15hv")) {
      specs.push(
        { title: "Điện áp", value: "High Voltage" },
        { title: "Dung lượng", value: "15kWh" },
      );
    }
  }

  if (lowerCategory.includes("tủ điện")) {
    push("Loại tủ", extractFirst(/(tủ điện[^,\n]*|cabinet[^,\n]*)/i, text));
    push("Cấp bảo vệ", extractFirst(/(?:IP\s*[0-9]{2})/i, text));
    push("Điện áp", extractFirst(/([0-9.,]+\s*V)/i, text));
    push("Bảo hành", extractFirst(/Bảo hành[:：]?\s*([0-9]+(?:\s*năm)?)/i, text));
  }

  if (lowerCategory.includes("khung")) {
    push("Vật liệu", extractFirst(/(nhôm[^,\n]*|aluminum[^,\n]*)/i, text));
    push("Bề mặt", extractFirst(/(anodized|mạ kẽm|sơn tĩnh điện[^,\n]*)/i, text));
    push("Bảo hành", extractFirst(/Bảo hành[:：]?\s*([0-9]+(?:\s*năm)?)/i, text));
  }

  if (lowerCategory.includes("tiếp địa")) {
    push("Vật liệu", extractFirst(/(đồng[^,\n]*|copper[^,\n]*|inox[^,\n]*)/i, text));
    push("Quy cách", extractFirst(/(m\d+|d\d+|l\d+|[0-9.,]+\s*mm[^,\n]*)/i, text));
    push("Bảo hành", extractFirst(/Bảo hành[:：]?\s*([0-9]+(?:\s*năm)?)/i, text));
  }

  if (lowerCategory.includes("phát ngược") || lowerCategory.includes("chống phát ngược")) {
    push("Loại", extractFirst(/(bộ chống phát ngược[^,\n]*)/i, text));
    push("Kết nối", extractFirst(/(CT[^,\n]*|meter[^,\n]*|relay[^,\n]*)/i, text));
    push("Bảo hành", extractFirst(/Bảo hành[:：]?\s*([0-9]+(?:\s*năm)?)/i, text));
  }

  return specs.filter((item) => item.title && item.value);
}

async function main() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    const envText = await fs.readFile(envPath, "utf8");
    loadEnvFile(envText);
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRole) throw new Error("Missing Supabase env");

  const supabase = createClient(url, serviceRole, { auth: { persistSession: false } });
  const { data, error } = await supabase
    .from("products")
    .select("id, name, category, brand, description, technical_specs");
  if (error) throw error;

  let updated = 0;
  for (const product of data ?? []) {
    const existing = product.technical_specs && typeof product.technical_specs === "object" ? product.technical_specs : {};
    const workbookSpecification = existing.workbook_specification ?? "";
    const needsFill = !Array.isArray(product.technical_specs) && Object.keys(existing).length < 4;
    if (!needsFill && !/tấm pin|inverter|pin lưu trữ|tủ điện|khung|tiếp địa|phát ngược/i.test(String(product.category ?? ""))) {
      continue;
    }
    const merged = parseSpecs({
      name: product.name,
      category: product.category,
      brand: product.brand,
      description: product.description,
      workbookSpecification,
    });
    const { error: updateError } = await supabase
      .from("products")
      .update({ technical_specs: merged })
      .eq("id", product.id);
    if (updateError) throw updateError;
    updated += 1;
  }

  console.log(JSON.stringify({ updated }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
