import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

const legacyAdminPrefixes = [
  "/orders",
  "/projects",
  "/customers",
  "/discounts",
  "/payment-policies",
  "/combos",
  "/products",
  "/combo-categories",
  "/product-categories",
  "/brands",
  "/suppliers",
  "/supplier-products",
  "/settings",
];

function isProtectedPath(pathname: string) {
  if (pathname === "/admin" || pathname.startsWith("/admin/")) return true;
  return false;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin/")) {
    const legacyPath = pathname.replace(/^\/admin/, "");
    const response = NextResponse.rewrite(new URL(legacyPath || "/", request.url));
    return response;
  }

  const isLegacyPublicPath = pathname === "/products/public" || pathname.startsWith("/products/public/") || pathname === "/combos/public" || pathname.startsWith("/combos/public/");
  const isLegacyAdminPath = legacyAdminPrefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
  if (isLegacyAdminPath && !isLegacyPublicPath) {
    const redirectedUrl = new URL(`/admin${pathname}`, request.url);
    return NextResponse.redirect(redirectedUrl);
  }

  if (!isProtectedPath(pathname)) {
    return NextResponse.next();
  }

  const response = NextResponse.next({ request });
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "",
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: Record<string, unknown>) {
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: Record<string, unknown>) {
          response.cookies.set({ name, value: "", ...options, maxAge: 0 });
        },
      },
    },
  );

  const { data: sessionData } = await supabase.auth.getSession();
  const session = sessionData.session;

  if (!session) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user?.id;

  if (!userId) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const { data: adminRow } = await supabase.from("admin_users").select("user_id").eq("user_id", userId).maybeSingle();

  if (!adminRow) {
    const deniedUrl = new URL("/login", request.url);
    deniedUrl.searchParams.set("error", "not_admin");
    return NextResponse.redirect(deniedUrl);
  }

  return response;
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/orders/:path*",
    "/projects/:path*",
    "/customers/:path*",
    "/discounts/:path*",
    "/payment-policies/:path*",
    "/combos/:path*",
    "/products/:path*",
    "/combo-categories/:path*",
    "/product-categories/:path*",
    "/brands/:path*",
    "/suppliers/:path*",
    "/supplier-products/:path*",
    "/settings/:path*",
  ],
};
