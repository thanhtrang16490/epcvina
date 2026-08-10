import { NextResponse } from "next/server";
import { buildFacebookAuthorizeUrl } from "@/lib/facebook-oauth";

export const dynamic = "force-dynamic";

export async function GET() {
  const state = crypto.randomUUID();
  const url = buildFacebookAuthorizeUrl(state);
  if (!url) {
    return NextResponse.json(
      { error: "Thiếu cấu hình FACEBOOK_APP_ID hoặc FACEBOOK_OAUTH_REDIRECT_URI" },
      { status: 400 },
    );
  }

  const response = NextResponse.redirect(url);
  response.cookies.set({
    name: "fb_oauth_popup",
    value: "1",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 10,
  });
  response.cookies.set({
    name: "fb_oauth_state",
    value: state,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 10,
  });
  return response;
}
