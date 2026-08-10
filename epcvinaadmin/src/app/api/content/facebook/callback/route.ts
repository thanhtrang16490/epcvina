import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { exchangeFacebookCode, fetchFacebookPages } from "@/lib/facebook-oauth";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code")?.trim();
  const state = url.searchParams.get("state")?.trim();
  const cookieStore = await cookies();
  const expectedState = cookieStore.get("fb_oauth_state")?.value;
  const usePopup = cookieStore.get("fb_oauth_popup")?.value === "1";

  const finish = (target: string) => {
    if (!usePopup) return NextResponse.redirect(new URL(target, url.origin));
    const response = new NextResponse(
      `<!doctype html><html><body><script>
        try {
          if (window.opener) {
            window.opener.postMessage({ type: "facebook-page-connected", target: ${JSON.stringify(target)} }, window.location.origin);
          }
        } catch (e) {}
        window.close();
      </script></body></html>`,
      {
        headers: { "Content-Type": "text/html; charset=utf-8" },
      },
    );
    response.cookies.delete("fb_oauth_state");
    response.cookies.delete("fb_oauth_popup");
    return response;
  };

  if (!code) {
    return finish("/admin/content/settings?fb=missing_code");
  }
  if (!state || !expectedState || state !== expectedState) {
    return finish("/admin/content/settings?fb=bad_state");
  }

  const tokenResult = await exchangeFacebookCode(code);
  const userAccessToken = tokenResult?.access_token;
  if (!userAccessToken) {
    return finish("/admin/content/settings?fb=token_failed");
  }

  const pagesResult = await fetchFacebookPages(userAccessToken);
  const pages = pagesResult?.data ?? [];
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return finish("/admin/content/settings?fb=supabase_missing");
  }

  const now = new Date().toISOString();
  let firstImportedPageId: string | null = null;
  for (let index = 0; index < pages.length; index += 1) {
    const page = pages[index];
    if (!page.id || !page.name || !page.access_token) continue;
    if (Array.isArray(page.tasks) && !page.tasks.includes("CREATE_CONTENT")) continue;
    if (!firstImportedPageId) firstImportedPageId = page.id;
    await supabase.from("content_facebook_pages").upsert({
      page_name: page.name,
      page_id: page.id,
      access_token: page.access_token,
      graph_version: process.env.FACEBOOK_GRAPH_VERSION || "v23.0",
      is_default: index === 0,
      is_active: true,
      notes: Array.isArray(page.tasks) ? `Imported from Facebook OAuth connect · tasks: ${page.tasks.join(", ")}` : "Imported from Facebook OAuth connect",
      updated_at: now,
    }, { onConflict: "page_id" });
  }

  if (firstImportedPageId) {
    await supabase
      .from("content_facebook_pages")
      .update({ is_default: false, updated_at: now })
      .eq("is_default", true);
    await supabase.from("content_facebook_pages").update({ is_default: true, updated_at: now }).eq("page_id", firstImportedPageId);
  }

  return finish(`/admin/content/settings?fb=connected&pages=${pages.length}`);
}
