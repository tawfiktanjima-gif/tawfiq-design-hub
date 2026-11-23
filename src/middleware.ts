import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
/** Gate /admin/*. Real authorization is re-checked in every server action/API (never trust middleware alone). */
export async function middleware(req: NextRequest) {
  const res = NextResponse.next({ request: req });
  if (req.nextUrl.pathname === "/admin/login") return res;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL, key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return new NextResponse("Supabase কনফিগার করা হয়নি", { status: 503 });
  const sb = createServerClient(url, key, { cookies: { getAll: () => req.cookies.getAll(), setAll: (l) => l.forEach(({ name, value, options }) => res.cookies.set(name, value, options)) } });
  const { data: { user } } = await sb.auth.getUser();
  if (user?.app_metadata?.role !== "admin") return NextResponse.redirect(new URL("/admin/login", req.url));
  return res;
}
export const config = { matcher: ["/admin/:path*"] };
