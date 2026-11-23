"use client";
import Link from "next/link";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteResource, toggleResource } from "@/app/admin/actions";
export default function RowActions({ id, title, status, featured }: { id: string; title: string; status: string; featured: boolean }) {
  const r = useRouter(); const [p, start] = useTransition(); const [err, setErr] = useState("");
  const run = (fn: () => Promise<{ error?: string }>) => start(async () => { const x = await fn(); if (x.error) setErr(x.error); else { setErr(""); r.refresh(); } });
  const b = "rounded-full border border-current px-2.5 py-1 text-sm disabled:opacity-50";
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <Link href={`/admin/resources/${id}/edit`} className={b}>এডিট</Link>
      <button disabled={p} className={b} onClick={() => run(() => toggleResource(id, "status", status === "published" ? "draft" : "published"))}>{status === "published" ? "আনপাবলিশ" : "পাবলিশ"}</button>
      <button disabled={p} className={b} onClick={() => run(() => toggleResource(id, "featured", !featured))}>{featured ? "★ বিশেষ" : "☆ বিশেষ"}</button>
      <button disabled={p} className={`${b} text-red-600`} onClick={() => { if (confirm(`“${title}” স্থায়ীভাবে মুছে ফেলবেন? ফাইল ও প্রিভিউও মুছে যাবে।`)) run(() => deleteResource(id)); }}>ডিলিট</button>
      {err && <span role="alert" className="text-sm text-red-600">{err}</span>}
    </div>
  );
}
