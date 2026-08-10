const DEFAULT_GRAPH_VERSION = "v23.0";

export function getFacebookOAuthConfig() {
  const appId = process.env.FACEBOOK_APP_ID;
  const appSecret = process.env.FACEBOOK_APP_SECRET;
  const redirectUri = process.env.FACEBOOK_OAUTH_REDIRECT_URI;
  return {
    appId,
    appSecret,
    redirectUri,
    graphVersion: process.env.FACEBOOK_GRAPH_VERSION || DEFAULT_GRAPH_VERSION,
  };
}

export function buildFacebookAuthorizeUrl(state: string) {
  const { appId, redirectUri, graphVersion } = getFacebookOAuthConfig();
  if (!appId || !redirectUri) return null;
  const scopes = [
    "pages_show_list",
    "pages_manage_metadata",
    "pages_manage_posts",
    "pages_read_engagement",
    "business_management",
  ].join(",");
  const url = new URL(`https://www.facebook.com/${graphVersion}/dialog/oauth`);
  url.searchParams.set("client_id", appId);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("state", state);
  url.searchParams.set("scope", scopes);
  return url.toString();
}

export async function exchangeFacebookCode(code: string) {
  const { appId, appSecret, redirectUri, graphVersion } = getFacebookOAuthConfig();
  if (!appId || !appSecret || !redirectUri) return null;
  const url = new URL(`https://graph.facebook.com/${graphVersion}/oauth/access_token`);
  url.searchParams.set("client_id", appId);
  url.searchParams.set("client_secret", appSecret);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("code", code);
  const response = await fetch(url.toString(), { cache: "no-store" });
  if (!response.ok) return null;
  return (await response.json().catch(() => null)) as { access_token?: string; token_type?: string; expires_in?: number } | null;
}

export async function fetchFacebookPages(userAccessToken: string) {
  const { graphVersion } = getFacebookOAuthConfig();
  const url = new URL(`https://graph.facebook.com/${graphVersion}/me/accounts`);
  url.searchParams.set("access_token", userAccessToken);
  url.searchParams.set("fields", "id,name,access_token,tasks");
  const response = await fetch(url.toString(), { cache: "no-store" });
  if (!response.ok) return null;
  return (await response.json().catch(() => null)) as { data?: Array<{ id?: string; name?: string; access_token?: string; tasks?: string[] }> } | null;
}

export async function fetchFacebookPagePosts(pageId: string, pageAccessToken: string, limit = 10) {
  const { graphVersion } = getFacebookOAuthConfig();
  const url = new URL(`https://graph.facebook.com/${graphVersion}/${encodeURIComponent(pageId)}/posts`);
  url.searchParams.set("access_token", pageAccessToken);
  url.searchParams.set("fields", "id,message,story,created_time,permalink_url,full_picture");
  url.searchParams.set("limit", String(limit));
  const response = await fetch(url.toString(), { cache: "no-store" });
  if (!response.ok) return null;
  return (await response.json().catch(() => null)) as {
    data?: Array<{
      id?: string;
      message?: string;
      story?: string;
      created_time?: string;
      permalink_url?: string;
      full_picture?: string;
    }>;
  } | null;
}
