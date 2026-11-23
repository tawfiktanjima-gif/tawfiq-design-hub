import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";
import { supabaseAdmin } from "@/lib/supabase/admin";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
const NS = { "Cache-Control": "no-store" };
const num = (v: string | undefined, d: number) => { const n = parseInt(v ?? "", 10); return n > 0 ? n : d; };

function fail(json: boolean, status: number, msg: string, extra: Record<string, string> = {}) {
  if (json) return NextResponse.json({ error: msg }, { status, headers: { ...NS, ...extra } });
  const html = `<!doctype html><html lang="bn"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>ডাউনলোড সম্ভব হয়নি</title><body style="font-family:sans-serif;text-align:center;padding:15vh 16px"><h1>${msg}</h1><p><a href="/">হোমে ফিরে যান</a></p></body></html>`;
  return new NextResponse(html, { status, headers: { "content-type": "text/html; charset=utf-8", ...NS, ...extra } });
}

/** GET /api/download/[id] — JSON {url} when Accept: application/json (used by the button), otherwise a 302 to a 60s signed URL. */
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const json = (req.headers.get("accept") ?? "").includes("application/json");
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(params.id)) return fail(json, 404, "রিসোর্সটি পাওয়া যায়নি");
  const { NEXT_PUBLIC_SUPABASE_URL: url, SUPABASE_SERVICE_ROLE_KEY: key, DOWNLOAD_HASH_SALT: salt } = process.env;
  if (!url || !key || !salt) { console.error("download: missing env (SUPABASE_URL / SERVICE_ROLE_KEY / DOWNLOAD_HASH_SALT)"); return fail(json, 503, "ডাউনলোড সেবা এখন চালু নেই। একটু পরে আবার চেষ্টা করুন।"); }

  const ip = (req.headers.get("x-forwarded-for")?.split(",")[0] || req.headers.get("x-real-ip") || "unknown").trim();
  const iph = createHash("sha256").update(`${salt}|${ip}`).digest("hex"); // raw IP is never stored
  const bot = /bot|crawl|spider|slurp|preview|facebookexternalhit|whatsapp|curl|wget/i.test(req.headers.get("user-agent") ?? "");
  const windowMin = num(process.env.DOWNLOAD_RATE_WINDOW_MIN, 10);

  const db = supabaseAdmin();
  const { data, error } = await db.rpc("begin_download", { rid: params.id, iph, do_count: !bot, max_per_window: num(process.env.DOWNLOAD_RATE_MAX, 20), window_minutes: windowMin });
  const row = Array.isArray(data) ? data[0] : data;
  if (error || !row) { console.error("download rpc:", error?.message); return fail(json, 500, "ডাউনলোড প্রস্তুত করা যায়নি। আবার চেষ্টা করুন।"); }
  if (row.out_status === "not_found") return fail(json, 404, "রিসোর্সটি পাওয়া যায়নি বা প্রকাশিত নেই");
  if (row.out_status === "rate_limited") return fail(json, 429, "অল্প সময়ে অনেক বেশি ডাউনলোড হয়েছে। কয়েক মিনিট পরে আবার চেষ্টা করুন।", { "Retry-After": String(windowMin * 60) });

  const { data: signed, error: e2 } = await db.storage.from("resource-files").createSignedUrl(row.out_path, 60, { download: row.out_name || true });
  if (e2 || !signed?.signedUrl) { console.error("download sign:", e2?.message); return fail(json, 500, "ফাইলটি পাওয়া যায়নি। অনুগ্রহ করে আমাদের জানান।"); }
  return json ? NextResponse.json({ url: signed.signedUrl }, { headers: NS }) : NextResponse.redirect(signed.signedUrl, { status: 302, headers: NS });
}
