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

function normalize(value) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, "d")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function inferSheetGroup(row, previousGroup) {
  const explicit = normalize(row.sheet_group);
  if (explicit) return explicit;

  const text = normalize(`${row.category ?? ""} ${row.item_name ?? ""} ${row.notes ?? ""}`);
  if (!text) return previousGroup || "wiring";
  if (text.includes("tiep dia") || text.includes("ground")) return "grounding";
  if (text.includes("nhan cong") || text.includes("thi cong")) return "labor";
  if (text.includes("pin luu tru") || text.includes("battery") || text.includes("lithium")) return "battery";
  if (text.includes("tam pin") || text.includes("panel") || text.includes("pv")) return "panel";
  if (text.includes("inverter") || text.includes("bien tan")) return "inverter";
  if (text.includes("khung") || text.includes("rail") || text.includes("mount") || text.includes("kep")) return "mounting";
  if (text.includes("day") || text.includes("cap") || text.includes("mc4") || text.includes("wire")) return "wiring";
  if (text.includes("tu dien") || text.includes("cabinet") || text.includes("meter")) return "cabinet";
  if (previousGroup === "battery" && (text.includes("giao tiep") || text.includes("tin hieu") || text.includes("pin"))) {
    return previousGroup;
  }
  if (previousGroup && previousGroup !== "panel" && (text.includes("giao tiep") || text.includes("tin hieu") || text.includes("ct") || text.includes("chong phat nguoc"))) {
    return previousGroup;
  }
  return previousGroup || "wiring";
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
  const { data: items, error } = await supabase
    .from("combo_items")
    .select("id, combo_id, item_name, category, notes, sheet_group, sort_order")
    .order("combo_id", { ascending: true })
    .order("sort_order", { ascending: true });
  if (error) throw error;

  const updates = [];
  const byCombo = new Map();
  for (const item of items ?? []) {
    const comboId = String(item.combo_id ?? "");
    const previousGroup = byCombo.get(comboId) ?? null;
    const nextGroup = inferSheetGroup(item, previousGroup);
    byCombo.set(comboId, nextGroup);
    if (String(item.sheet_group ?? "").trim().toLowerCase() !== nextGroup) {
      updates.push({ id: item.id, sheet_group: nextGroup });
    }
  }

  for (const chunkStart of Array.from({ length: Math.ceil(updates.length / 100) }, (_, index) => index * 100)) {
    const batch = updates.slice(chunkStart, chunkStart + 100);
    for (const row of batch) {
      const { error: updateError } = await supabase.from("combo_items").update({ sheet_group: row.sheet_group }).eq("id", row.id);
      if (updateError) throw updateError;
    }
  }

  console.log(JSON.stringify({ scanned: items?.length ?? 0, updated: updates.length }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
