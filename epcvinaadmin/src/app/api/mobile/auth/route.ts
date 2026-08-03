import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { bearerToken, createMobileSupabaseClient } from "@/lib/supabase/mobile";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function message(error: unknown) {
  return error instanceof Error ? error.message : "Yêu cầu xác thực thất bại.";
}

export async function POST(request: Request) {
  const supabase = createMobileSupabaseClient();
  if (!supabase) return NextResponse.json({ error: "Supabase chưa được cấu hình." }, { status: 503 });

  try {
    const body = await request.json();
    const action = String(body.action ?? "");

    if (action === "login") {
      const credentials = body.phone
        ? { phone: String(body.phone), password: String(body.password ?? "") }
        : { email: String(body.email ?? ""), password: String(body.password ?? "") };
      const { data, error } = await supabase.auth.signInWithPassword(credentials);
      if (error) return NextResponse.json({ error: error.message }, { status: 401 });
      return NextResponse.json({ data });
    }

    if (action === "refresh") {
      const { data, error } = await supabase.auth.refreshSession({ refresh_token: String(body.refresh_token ?? "") });
      if (error) return NextResponse.json({ error: error.message }, { status: 401 });
      return NextResponse.json({ data });
    }

    if (action === "reset_password") {
      const { error } = await supabase.auth.resetPasswordForEmail(String(body.email ?? ""), {
        redirectTo: typeof body.redirectTo === "string" ? body.redirectTo : undefined,
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json({ data: null });
    }

    if (action === "signup") {
      const token = bearerToken(request);
      const authClient = createMobileSupabaseClient(token);
      const { data: userData } = token && authClient ? await authClient.auth.getUser(token) : { data: { user: null } };
      if (!userData.user) return NextResponse.json({ error: "Chưa đăng nhập." }, { status: 401 });
      const { data: profile } = await authClient!.from("profiles").select("role").eq("id", userData.user.id).maybeSingle();
      if (!profile || !["admin", "sale_admin"].includes(profile.role)) {
        return NextResponse.json({ error: "Không có quyền tạo người dùng." }, { status: 403 });
      }
      const admin = createSupabaseAdminClient();
      if (!admin) return NextResponse.json({ error: "Admin API chưa được cấu hình." }, { status: 503 });
      const { data, error } = await admin.auth.admin.createUser({
        email: body.email || undefined,
        phone: body.phone || undefined,
        password: String(body.password ?? ""),
        email_confirm: true,
        user_metadata: body.options?.data,
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json({ data: { user: data.user, session: null } });
    }

    return NextResponse.json({ error: "Hành động không hợp lệ." }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: message(error) }, { status: 500 });
  }
}
