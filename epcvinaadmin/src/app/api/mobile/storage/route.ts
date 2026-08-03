import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { bearerToken, createMobileSupabaseClient } from "@/lib/supabase/mobile";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BUCKET_ALIASES: Record<string, string> = { "product-images": "catalog-media" };

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > 10 * 1024 * 1024) {
    return NextResponse.json({ error: "Ảnh vượt quá giới hạn 10 MB." }, { status: 413 });
  }
  const token = bearerToken(request);
  const authClient = createMobileSupabaseClient(token);
  const admin = createSupabaseAdminClient();
  if (!token || !authClient) return NextResponse.json({ error: "Chưa đăng nhập." }, { status: 401 });
  if (!admin) return NextResponse.json({ error: "Storage chưa được cấu hình." }, { status: 503 });

  const { data: userData } = await authClient.auth.getUser(token);
  if (!userData.user) return NextResponse.json({ error: "Phiên đăng nhập không hợp lệ." }, { status: 401 });
  const { data: adminUser } = await admin.from("admin_users").select("user_id").eq("user_id", userData.user.id).maybeSingle();
  if (!adminUser) return NextResponse.json({ error: "Không có quyền tải ảnh." }, { status: 403 });

  const form = await request.formData();
  const bucket = String(form.get("bucket") ?? "");
  const path = String(form.get("path") ?? "").replace(/^\/+/, "");
  const file = form.get("file");
  const databaseBucket = BUCKET_ALIASES[bucket];
  if (!databaseBucket || !path.startsWith("products/") || !(file instanceof File)) {
    return NextResponse.json({ error: "Thông tin ảnh không hợp lệ." }, { status: 400 });
  }
  if (file.size > 8 * 1024 * 1024 || !file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Chỉ chấp nhận ảnh tối đa 8 MB." }, { status: 400 });
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const { error } = await admin.storage.from(databaseBucket).upload(path, bytes, {
    contentType: file.type,
    upsert: form.get("upsert") === "true",
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  const { data } = admin.storage.from(databaseBucket).getPublicUrl(path);
  return NextResponse.json({ data: { path, publicUrl: data.publicUrl }, error: null });
}
