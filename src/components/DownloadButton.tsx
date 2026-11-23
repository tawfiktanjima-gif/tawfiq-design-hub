"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
class ApiError extends Error {}
export default function DownloadButton({ id, large }: { id: string; large?: boolean }) {
  const router = useRouter(); const [busy, setBusy] = useState(false); const [err, setErr] = useState("");
  async function go(e: React.MouseEvent) {
    e.preventDefault(); if (busy) return; setBusy(true); setErr("");
    try {
      const r = await fetch(`/api/download/${id}`, { headers: { Accept: "application/json" }, cache: "no-store" });
      const j = (await r.json().catch(() => ({}))) as { url?: string; error?: string };
      if (!r.ok || !j.url) throw new ApiError(j.error || "ডাউনলোড করা যায়নি। আবার চেষ্টা করুন।");
      window.location.assign(j.url);
      setTimeout(() => router.refresh(), 2000);
    } catch (x) { setErr(x instanceof ApiError ? x.message : "নেটওয়ার্ক সমস্যা হয়েছে। ইন্টারনেট সংযোগ দেখে আবার চেষ্টা করুন।"); }
    finally { setBusy(false); }
  }
  return (
    <>
      <a href={`/api/download/${id}`} onClick={go} aria-busy={busy} role="button" className={`btn ${large ? "my-3 w-full !py-3 text-lg" : "!py-1 text-sm"} ${busy ? "pointer-events-none opacity-70" : ""}`}>{busy ? "প্রস্তুত হচ্ছে…" : "⬇ ডাউনলোড করুন"}</a>
      {err && <p role="alert" className="mt-1 text-sm text-red-600">{err}</p>}
    </>
  );
}
